
(function () {

	// ----- VARS ----- //
	var game;
	var canvas;
	var dir;
	var req;
	
	var socket;
	
	
	// ----- CONSTANTS ----- //
	var THRESHOLD = 200;
	
	// ----- FUNCTIONS ----- //
	function init() {
		console.log( "init" );
		
		// Canvas
		canvas = document.getElementById( "stage" );
		game = new BREAKOUT.Game( canvas );
		game.startGame();
		dir = 0;
		
		// Request Animation Frame
		req = requestAnimationFrame( onAnimationFrame );
		
		// Connect to Input Device
		//connectMouse();
		connectHandset();		
		
	};
	
	function connectMouse() {
		
		$("#stage").on( "click", onMouseClick );
		$(window).on( "mousemove", onMouseMove );		
		
	};
	
	function connectHandset() {
	
		socket = io.connect( "http://10.192.132.127:3000" );
		socket.on( "connect" , function () {
			
			socket.on( "click", function( data ) {
			
				game.launch();
			
			});
			
			socket.on( "move", function( data ) {
			
				dir = data.beta * 0.3;
			
			});
			
		});
	
	};
	
	// ----- EVENT LISTENERS ----- //
	function onReady() {
		init();
	};
	
	function onAnimationFrame() {
	
		game.move( dir );
		req = requestAnimationFrame( onAnimationFrame );
	
	};
	
	function onMouseClick( e ) {
		console.log( "onMouseClick" );
	
		game.launch();
	
	};
	
	function onMouseMove( e ) {
	
		var centerX = $(window).width() / 2;
		dir = ( e.clientX - centerX ) * 0.01;
	
	};	
	
	// ----- INIT ----- //
	$(document).ready( onReady );

})();






















