var io = require( "socket.io" ).listen( 3000, "10.192.132.127" );

io.sockets.on( "connection", function( socket ) {

	socket.on( "ctrlClick", function ( data ) { 
	
		socket.broadcast.emit( "click", data );
	
	} );
	
	socket.on( "ctrlMove", function ( data ) { 
	
		socket.broadcast.emit( "move", data );
	
	} );
	
	socket.on( "disconnect", function () { } );
  
});