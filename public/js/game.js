
(function () {

	// ----- VARS ----- //
	var gameId;
	var game;
	var canvas;
	var dir;
	var req;
	
	var socket;
	
	
	// ----- CONSTANTS ----- //
	var SERVER = window.location.hostname + ":3000";

	
	// ----- FUNCTIONS ----- //
	function init() {
		console.log( "init" );
		
		// Vars
		dir = 0;
		gameId = Math.floor( Math.random() * 89999 ) + 10000;

		// Canvas
		canvas = document.getElementById( "stage" );
		game = new BREAKOUT.Game( canvas );

		// Overlay
		showOverlay();

		// Connect to Input Device
		//connectMouse();
		connectHandset();
		
	};

	function startGame() {
		console.log( "startGame" );

		game.startGame();
		req = requestAnimationFrame( onAnimationFrame );

	};
	
	function connectMouse() {
		console.log( "connectMouse" );
		
		$("#stage").on( "click", onMouseClick );
		$(window).on( "mousemove", onMouseMove );		
		
	};
	
	function connectHandset() {
		console.log( "connectHandset -> " + SERVER );
	
		socket = io.connect( SERVER );
		socket.on( "connect" , function () {
			
			socket.emit( "gameInit", { id:gameId } );

			socket.on( "sync", function( data ) {
				console.log( "onCtrlSync" );

				startGame();
				hideOverlay();

			} );

			socket.on( "click", function( data ) {
				console.log( "onCtrlClick" );
			
				game.launch();
			
			} );
			
			socket.on( "move", function( data ) {
			
				dir = data.beta * 0.3;
			
			} );
			
		} );
	
	};

	function showOverlay() {
		console.log( "showOverlay" );

		$("#overlay").show();
		$("#overlay p").text( gameId );

	};

	function hideOverlay() {
		console.log( "hideOverlay" );

		$("#overlay").hide();
		
	};

	
	// ----- EVENT LISTENERS ----- //
	function onReady() {
		init();
	};
	
	function onAnimationFrame() {
	
		game.move( dir );
		req = requestAnimationFrame( onAnimationFrame );
	
	};
	
	// ----- MOUSE EVENT LISTENERS ----- //
	function onMouseClick( e ) {
		console.log( "onMouseClick" );
	
		game.launch();
	
	};
	
	function onMouseMove( e ) {
	
		var centerX = $(window).width() / 2;
		dir = ( e.clientX - centerX ) * 0.01;
	
	};	

	// ----- CTRL EVENT LISTENERS ----- //
	function onCtrlClick( data ) {
		// TBD
	};

	function onCtrlMove( data ) {
		// TBD
	};
	
	// ----- INIT ----- //
	$(document).ready( onReady );

})();






















