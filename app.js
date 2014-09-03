
// ----- IMPORTS ----- //
var io = require( "socket.io" );
var express = require('express');


// ----- VARS ----- //
var app;
var server;
var socketServer;
var port = process.env.PORT || 80;
var rooms = [];


// ----- CONSTANTS ----- //
var TYPE_GAME = "game";
var TYPE_CONTROLLER = "ctrl";


// ----- INIT ----- //
app = express();
app.listen( port );
app.use( express.static( __dirname + "/public" ) );
app.get( "/", function ( req, res ) {

	res.sendfile( __dirname + "/index.html" );

} );

server = require( "http" ).createServer( app );

socketServer = io.listen( 3000 );
socketServer.set( "log level", 0 );
socketServer.set( "transports", ["xhr-polling"] );


// ----- FUNCTIONS ----- //
function addRoom( id ) {
	console.log( "addRoom: " + id );

	var room = "room" + id;
	rooms.push( room );

	return room;

};

function getRoomIndexByName( name ) {

	return rooms.indexOf( name );

};

function removeRoomByName( name ) {
	console.log( "removeRoomByName: " + name );

	var index = rooms.indexOf( name );
	delete rooms[ index ];

};


// ----- SOCKET IO EVENTS ----- //
socketServer.sockets.on( "connection", function( socket ) {
	
	var type;
	var room;

	// Game
	socket.on( "gameInit", function( data ) {
		console.log( "Game Initialized #" + data.id );

		type = TYPE_GAME;
		room = addRoom( data.id );
		socket.join( room );
		
	} );

	// Ctrl
	socket.on( "ctrlInit", function( data ) {
		console.log( "Controller Initialized #" + data.id );

		type = TYPE_CONTROLLER;
		var name = "room" + data.id;

		if ( getRoomIndexByName( name ) > -1 ) {

			console.info( "...controller joining room: " + name );
			room = name;
			socket.broadcast.to( room ).emit( "sync" );

		} else {

			console.error( "...that room does not exist!" );
			socket.emit( "error" );

		}

	} );

	socket.on( "ctrlClick", function( data ) { 
	
		if ( room ) {

			socket.broadcast.to( room ).emit( "click", data );

		}
	
	} );
	
	socket.on( "ctrlMove", function( data ) { 
	
		if ( room ) {

			socket.broadcast.to( room ).emit( "move", data );

		}
	
	} );
	
	// General
	socket.on( "disconnect", function() {

		socket.leave( room );
		room = null;

		if ( type == TYPE_GAME ) {

			removeRoomByName( room );

		}

	} );
  
} );
