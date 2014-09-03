
(function () {

	// ----- VARS ----- //
	
	// ----- CONSTANTS ----- //
	
	// ----- FUNCTIONS ----- //
	function init() {

		// Controller
		if ( window.DeviceOrientationEvent &&
			 Modernizr.touch ) {

			window.location.replace( "ctrl.html" );

		// Game
		} else {

			window.location.replace( "game.html" );

		}

	};

	// ----- EVENT LISTENERS ----- //

	// ----- CALL ----- //
	init();

})();






















