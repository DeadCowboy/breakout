
(function () {

	// ----- VARS ----- //
	var output;
	var socket;
	var gameId;
	
	var reqId;
	var orientation;
	var currentBeta;
	var lastBeta;


	// ----- CONSTANTS ----- //
	var SERVER = window.location.hostname + ":3000";
	var THRESHOLD = 0.5;

	
	// ----- FUNCTIONS ----- //
	function init() {
		debug( "init" );

		if ( window.DeviceOrientationEvent ) {
		
			debug( "^ DeviceOrientationEvent exists!" );			
			window.addEventListener( "deviceorientation", onOrientation );
		
		}

		currentBeta = 0;
		lastBeta = 0;

		connectGame();
		
	};

	function connectGame() {
		debug( "connectGame -> " + SERVER );

		socket = io.connect( SERVER );
		socket.on( "connect", onConnect );
		socket.on( "disconnect", onDisconnect );
		socket.on( "error", onError );

		$(window).on( "click", onClick );

	};

	function disconnectGame() {
		debug( "disconnectGame" );

		socket.removeListener( "connect", onConnect );
		socket.removeListener( "disconnect", onDisconnect );
		socket.removeListener( "error", onError );
		socket = null;

		$(window).off( "click", onClick );

	};

	function showOverlay() {
		debug( "showOverlay" );

		$("#overlay").show();
		$("#gameIdForm").on( "submit", onSubmit );

	};

	function hideOverlay() {
		debug( "hideOverlay" );

		$("#overlay").hide();
		$("#gameIdForm").off( "submit", onSubmit );

	};
	
	
	// ----- UTILS ----- //	
	function debug( text ) {
	
		// Send to Console
		console.log( text );
		
		// Update Array
		if ( !output ) output = [];
		output.unshift( text );
		if ( output.length > 20 ) output.pop();

		// Update Container Element
		var i;
		var length = output.length;
		var html = "";		
		
		for ( i = 0; i < length; i++ )
			html += output[i] + "<br>";
		
		$("#output").html( html );
	
	};	
	
	
	// ----- EVENT LISTENERS ----- //
	function onReady() {
		init();
	};
	
	function onSubmit( e ) {
		debug( "onSubmit" );

		e.preventDefault();

		var value = $("#gameId").val();
		var isValid = ( value.match(/[0-9]{5}/g) != null );

		if ( isValid ) {

			hideOverlay();
			
			gameId = value;
			socket.emit( "ctrlInit", { id: gameId } );

			reqId = requestAnimationFrame( onAnimationFrame );

		}

	};

	function onConnect() {
		debug( "onConnect" );

		showOverlay();

	};

	function onDisconnect() {
		debug( "onDisconnect" );

		disconnectGame();
		cancelAnimationFrame( reqId );

	};

	function onError( data ) {
		debug( "onError" );

		gameId = undefined;
		showOverlay();

		cancelAnimationFrame( reqId );

	};

	function onClick( e ) {
		debug( "onClick" );
	
		socket.emit( "ctrlClick", {
			x: e.clientX,
			y: e.clientY
		} );
	
	};
	
	function onOrientation( e ) {
		//debug( "onOrientation" );
		
		/*
		orientation = {
			alpha: e.alpha,
			beta: e.beta,
			gamma: e.gamma
		};
		*/

		currentBeta = e.beta;
	
	};

	function onAnimationFrame() {
		//debug( "onAnimationFrame" );

		if ( socket ) {

			if ( Math.abs( currentBeta - lastBeta ) > THRESHOLD ) {

				socket.emit( "ctrlMove", { beta: currentBeta } );
				lastBeta = currentBeta;
				//debug( "beta data sent: " + lastBeta );

			}

		}

		reqId = requestAnimationFrame( onAnimationFrame );

	};
	
	
	// ----- INIT ----- //
	$(document).ready( onReady );

})();






















