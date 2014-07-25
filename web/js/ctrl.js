
(function () {

	// ----- VARS ----- //
	var output;
	var socket;
	
	// ----- CONSTANTS ----- //
	
	// ----- FUNCTIONS ----- //
	function init() {
		
		$(window).on( "click", onClick );
		
		if ( window.DeviceOrientationEvent ) {
		
			debug( "^ DeviceOrientationEvent exists!" );			
			window.addEventListener( "deviceorientation", onOrientation );
		
		}
		
		socket = io.connect( "http://10.192.132.127:3000" );
		socket.on( "connect" , function () {
		
			debug( "onConnect" );
			
		});
		
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
	
	function onClick( e ) {
		debug( "onClick" );
	
		socket.emit( "ctrlClick", {
			x: e.clientX,
			y: e.clientY
		} );
	
	};
	
	function onOrientation( e ) {
		
		socket.emit( "ctrlMove", {
			alpha: e.alpha,
			beta: e.beta,
			gamma: e.gamma
		} );
	
	};
	
	
	// ----- INIT ----- //
	$(document).ready( onReady );

})();






















