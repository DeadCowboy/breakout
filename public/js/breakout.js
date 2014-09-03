/**
 * @title Breakout Game
 * @description Manages Canvas 2D and Game Logic.
 * @version 0.1
 * @date 2013-07-17
 * @author Richard Nelson
*/

/**
 **********************************************************
 * PACKAGE OBJECT
 *
 */

var BREAKOUT = BREAKOUT || {};

/**
 **********************************************************
 * EVENT DISPATCHER
 *
 */

// * * * * * CONSTRUCTOR * * * * * //
BREAKOUT.EventDispatcher = function() {

	this._listeners = {};

};

// * * * * * INHERITANCE * * * * * //
BREAKOUT.EventDispatcher.prototype.constructor = BREAKOUT.EventDispatcher;

// * * * * * PROTOTYPE * * * * * //
BREAKOUT.EventDispatcher.prototype.addEventListener = function( type, listener ) {
		
	if ( typeof this._listeners[type] == "undefined" )
		this._listeners[type] = [];

	this._listeners[type].push( listener );
	
};

BREAKOUT.EventDispatcher.prototype.removeEventListener = function( type, listener ) {
		
	if ( this._listeners[type] instanceof Array ) {
	
		var listeners = this._listeners[type];
		
		for ( var i = 0; i < listeners.length; i++ ) {
		
			if ( listeners[i] === listener ){
			
				listeners.splice( i, 1 );
				break;
				
			}
			
		}
		
	}
	
};
	
BREAKOUT.EventDispatcher.prototype.dispatchEvent = function( event ) {
		
	if ( typeof event == "string" )
		event = { type: event };

	if ( !event.target )
		event.target = this;

	if ( !event.type )
		throw new Error("Event must have a type.");

	if ( this._listeners[event.type] instanceof Array ) {
	
		var listeners = this._listeners[ event.type ];
		
		for ( var i = 0; i < listeners.length; i++ ) {
		
			listeners[i].call( this, event );
			
		}
		
	}
	
};

/**
 **********************************************************
 * GameEvent
 * Static class with events that dispatch from the Game
 * class.
 *
 */
 
BREAKOUT.GameEvent = function( type, target ) {

	// ----- PUBLIC VARS ----- //
	
	this.type = type;
	this.target = target;

};

// * * * * * PUBLIC STATIC CONSTANTS * * * * * //
BREAKOUT.GameEvent.NAME = "GameEvent";
BREAKOUT.GameEvent.LOAD_COMPLETE = BREAKOUT.GameEvent.NAME + "LoadComplete";

 
/**
 **********************************************************
 * Game
 *
 */

// * * * * * CONSTRUCTOR * * * * * // 
BREAKOUT.Game = function( canvasElement ) {
	//log("new Manager");
 
	// ----- PUBLIC VARS ----- //
	
	// ----- PROTECTED VARS ----- //	
	this._elem = canvasElement;
	this._stage = new createjs.Stage( this._elem );
	this._width = this._elem.width;
	this._height = this._elem.height;
	
	this._paddle;
	this._puck;
	this._wall;
	
	// ----- CONSTANTS ----- //
	this.BLOCK_WIDTH = 100;
	this.BLOCK_HEIGHT = 20;
	this.BLOCK_SPACING = 1;
	this.BLOCK_ROWS = 5;
	this.BLOCK_COLUMNS = 8;	
	
	this.PUCK_VELOCITY = 12;
	this.PUCK_DIRECTION_WIDTH = Math.PI / 2;
	this.PUCK_DIRECTION_MIN = Math.PI - this.PUCK_DIRECTION_WIDTH / 2;
	this.PUCK_DIRECTION_MAX = Math.PI + this.PUCK_DIRECTION_WIDTH / 2;	
	
	// ----- EVENT LISTENERS ----- //
	this.onTick;

	// ----- CONSTRUCT ----- //
	this.init();
	
};

// * * * * * INHERITANCE * * * * * //
BREAKOUT.Game.prototype = new BREAKOUT.EventDispatcher();
BREAKOUT.Game.prototype.constructor = BREAKOUT.Game;
BREAKOUT.Game.prototype.supr = BREAKOUT.EventDispatcher.prototype;

// * * * * * PROTOTYPE * * * * * //
// ----- GET / SET FUNCTIONS ----- //

// ----- PUBLIC FUNCTIONS ----- //
BREAKOUT.Game.prototype.startGame = function() {
	console.log( "BREAKOUT: Game: startGame" );

	// Wall
	this._wall.reset();

	// Paddle
	this._paddle.setX( ( this._width - this._paddle.getWidth() ) / 2 );
	
	// Puck
	this._puck.setVelocity( 0 );

};

BREAKOUT.Game.prototype.pauseGame = function() {

};

BREAKOUT.Game.prototype.resumeGame = function() {

};

BREAKOUT.Game.prototype.launch = function() {

	if ( this._puck.getVelocity() == 0 ) {
	
		this._puck.setDirection( Math.PI );
		this._puck.setVelocity( this.PUCK_VELOCITY );
		
	}

};

BREAKOUT.Game.prototype.move = function( dir ) {

	var paddleX = this._paddle.getX() + dir;
	var paddleMinX = 0;
	var paddleMaxX = this._width - this._paddle.getWidth();
	
	if ( paddleX < paddleMinX )
		paddleX = paddleMinX;
	else if ( paddleX > paddleMaxX ) 
		paddleX = paddleMaxX;
		
	this._paddle.setX( paddleX );

};

// ----- PROTECTED FUNCTIONS ----- //
BREAKOUT.Game.prototype.init = function() {

	this.delegateListeners();

	this.addWall();
	this.addBlocks();
	this.addPaddle();	
	this.addPuck();
	
	this._stage.update();
	this.startTicker();
	
	// Temp
	//this.startGame();
	
};

// ----- BLOCKS ----- //
BREAKOUT.Game.prototype.addWall = function() {

	this._wall = new BREAKOUT.Wall();
	this._wall.setX( ( this._width - ( this.BLOCK_WIDTH + this.BLOCK_SPACING ) * this.BLOCK_COLUMNS ) / 2 );
	this._wall.setY( this._wall.getX() );
	this._stage.addChild( this._wall.getDisplayObject() );

};

BREAKOUT.Game.prototype.addBlocks = function() {

	var i;
	var length = this.BLOCK_ROWS * this.BLOCK_COLUMNS;
	var row;
	var col;
	
	for ( i = 0; i < length; i++ ) {
	
		row = Math.floor( i / this.BLOCK_COLUMNS );
		col = i - row * this.BLOCK_COLUMNS;
	
		var block = new BREAKOUT.Block( this.BLOCK_WIDTH, this.BLOCK_HEIGHT, 232, 246, 255 );
		block.setName( "block" + i );
		block.setX( col * ( block.getWidth() + this.BLOCK_SPACING ) );
		block.setY( row * ( block.getHeight() + this.BLOCK_SPACING ) );
		
		this._wall.addChild( block );
	
	}
	
};

// ----- PADDLE ----- //
BREAKOUT.Game.prototype.addPaddle = function() {

	this._paddle = new BREAKOUT.Paddle();
	this._paddle.setX( ( this._width - this._paddle.getWidth() ) / 2 );
	this._paddle.setY( 440 );
	this._stage.addChild( this._paddle.getDisplayObject() );

};

// ----- PUCK ----- //
BREAKOUT.Game.prototype.addPuck = function() {

	this._puck = new BREAKOUT.Puck();
	this._stage.addChild( this._puck.getDisplayObject() );

};

BREAKOUT.Game.prototype.updatePuck = function() {

	if ( this._puck.getVelocity() == 0 ) {
	
		this._puck.setX( ( this._paddle.getWidth() - this._puck.getWidth() ) / 2 + this._paddle.getX() );
		this._puck.setY( this._paddle.getY() - this._puck.getHeight() );
	
	} else {
	
		// Predict Puck
		var nX = this._puck.getX() + this._puck.getVelocityX();
		var nY = this._puck.getY() + this._puck.getVelocityY();
		var cX = nX + this._puck.getWidth() / 2;
		var cY = nY + this._puck.getHeight() / 2;
	
		// Check Hit
		this.checkPaddle( cX, cY );
		this.checkBlocks( cX - this._wall.getX(), cY - this._wall.getY() ); 
		this.checkBoundaries( nX, nY );
			
		// Update Puck
		nX = this._puck.getX() + this._puck.getVelocityX();
		nY = this._puck.getY() + this._puck.getVelocityY();
		this._puck.setX( nX );
		this._puck.setY( nY );
		
		// Reset Wall
		//console.log( this._wall.getNumBlocksVisible() );
		if ( this._wall.getNumBlocksVisible() <= 0 ) {
		
			var self = this;
			
			setTimeout( function() {
			
				self._wall.reset();
			
			}, 1800 );
		
		}
	
	}

};

BREAKOUT.Game.prototype.checkPaddle = function( x, y ) {

	if ( this.hitTest( this._paddle, x, y ) ) {
		
		var percent = 1 - ( x - this._paddle.getX() ) / this._paddle.getWidth();
		this._puck.setDirection( this.PUCK_DIRECTION_MIN + this.PUCK_DIRECTION_WIDTH * percent );			
		this._puck.setVelocity( this.PUCK_VELOCITY );
		
		return true;
	
	}
	
	return false;

};

BREAKOUT.Game.prototype.checkBlocks = function( x, y ) {

	if ( y < this._wall.getHeight() ) {
		
		var i;
		var length = this._wall.getNumBlocks();
		var block;
		
		for ( i = 0; i < length; i++ ) {
		
			block = this._wall.getBlockAt( i );
		
			if ( block.getVisible() &&
				 this.hitTest( block, x, y ) ) {
			
				this._wall.hideBlockAt( i );
				this._puck.reverseDirection( "y" );
				
				return true;
			
			}				
		
		}

	}

	return false;

};

BREAKOUT.Game.prototype.checkBoundaries = function( x, y ) {

	if ( x < 0 || x > this._width - this._puck.getWidth() ) {
		
		this._puck.reverseDirection( "x" );
		return true;
		
	}
		
	if ( y < 0 ) {
	
		this._puck.reverseDirection( "y" );
		return true;
		
	} else if ( y > this._height - this._puck.getHeight() ) {
	
		this._puck.setVelocity( 0 );
		return true;
	
	}

	return false;
	
};

// ----- TICKER ----- //
BREAKOUT.Game.prototype.startTicker = function() {

	createjs.Ticker.addEventListener( "tick", this.onTick );

};

BREAKOUT.Game.prototype.stopTicker = function() {

	createjs.Ticker.removeEventListener( "tick", this.onTick );

};

// ----- UTILS ----- //
BREAKOUT.Game.prototype.hitTest = function( shape, x, y ) {

	var minX = shape.getX();
	var maxX = minX + shape.getWidth();
	
	var minY = shape.getY();
	var maxY = minY + shape.getHeight();
	
	//console.log( "X: " + minX + " - " + maxX + ": " + x );
	//console.log( "Y: " + minY + " - " + maxY + ": " + y );
	
	return ( x > minX && x <= maxX && y > minY && y <= maxY );

};

BREAKOUT.Game.prototype.hitTestArea = function( shape0, shape1 ) {

	

};

// ----- EVENT LISTENERS ----- //
BREAKOUT.Game.prototype.delegateListeners = function() {

	var self = this;
	
	this.onTick = function( e ) {
	
		self.updatePuck();
		self._stage.update();
	
	};

};

/**
 **********************************************************
 * GameObject
 *
 */

// * * * * * CONSTRUCTOR * * * * * //
BREAKOUT.GameObject = function() {
	//console.log( "new BREAKOUT: GameObject" );

	// ----- PUBLIC VARS ----- //
	
	// ----- PROTECTED VARS ----- //
	this._displayObject;
	this._name;	
	this._width;
	this._height;

	// ----- CONSTRUCT ----- //
	
};

// * * * * * INHERITANCE * * * * * //
BREAKOUT.GameObject.prototype = new BREAKOUT.EventDispatcher();
BREAKOUT.GameObject.prototype.constructor = BREAKOUT.GameObject;
BREAKOUT.GameObject.prototype.supr = BREAKOUT.EventDispatcher.prototype;

// * * * * * PROTOTYPE * * * * * //
// ----- GET / SET FUNCTIONS ----- //
BREAKOUT.GameObject.prototype.getDisplayObject = function() {
	return this._displayObject;
};

BREAKOUT.GameObject.prototype.getName = function() {
	return this._displayObject.name;
};

BREAKOUT.GameObject.prototype.setName = function( value ) {
	this._displayObject.name = value;
};

BREAKOUT.GameObject.prototype.getX = function() {
	return this._displayObject.x;
};

BREAKOUT.GameObject.prototype.setX = function( value ) {
	this._displayObject.x = value;
};

BREAKOUT.GameObject.prototype.getY = function() {
	return this._displayObject.y;
};

BREAKOUT.GameObject.prototype.setY = function( value ) {
	this._displayObject.y = value;
};

BREAKOUT.GameObject.prototype.getWidth = function() {
	return this._width;
};

BREAKOUT.GameObject.prototype.getHeight = function() {
	return this._height;
};

BREAKOUT.GameObject.prototype.getVisible = function() {
	return this._displayObject.visible;
};

// ----- PUBLIC FUNCTIONS ----- //
BREAKOUT.GameObject.prototype.setCoords = function( x, y ) {

	this._displayObject.x = x;
	this._displayObject.y = y;

};

// ----- PROTECTED FUNCTIONS ----- //



/**
 **********************************************************
 * Shape
 *
 */

// * * * * * CONSTRUCTOR * * * * * //
BREAKOUT.GameShape = function() {
	//console.log( "new BREAKOUT: Shape" );

	// ----- PUBLIC VARS ----- //
	
	// ----- PROTECTED VARS ----- //
	this._color;

	// ----- CONSTRUCT ----- //
	
};

// * * * * * INHERITANCE * * * * * //
BREAKOUT.GameShape.prototype = new BREAKOUT.GameObject();
BREAKOUT.GameShape.prototype.constructor = BREAKOUT.GameShape;
BREAKOUT.GameShape.prototype.supr = BREAKOUT.GameObject.prototype;

// * * * * * PROTOTYPE * * * * * //
// ----- GET / SET FUNCTIONS ----- //
BREAKOUT.GameShape.prototype.getColor = function() {
	return this._color;
};

BREAKOUT.GameShape.prototype.setColor = function( r, g, b ) {
	this._color = createjs.Graphics.getRGB( r, g, b );
};

BREAKOUT.GameShape.prototype.getGraphics = function() {
	return this._displayObject.graphics;
};

// ----- PUBLIC FUNCTIONS ----- //

// ----- PROTECTED FUNCTIONS ----- //
BREAKOUT.GameShape.prototype.init = function() {
	//console.log( "BREAKOUT: Shape: init" );

	this._displayObject = new createjs.Shape();
	this.draw();

};

BREAKOUT.GameShape.prototype.draw = function() {

	var gfx = new createjs.Graphics();
	gfx.beginFill( this._color ).drawRect( 0, 0, this._width, this._height );

	this._displayObject.graphics = gfx;

};


/**
 **********************************************************
 * Paddle
 *
 */

// * * * * * CONSTRUCTOR * * * * * //
BREAKOUT.Paddle = function() {
	//console.log( "new BREAKOUT: Paddle" );

	// ----- PUBLIC VARS ----- //

	// ----- PROTECTED VARS ----- //

	// ----- CONSTRUCT ----- //
	this.init();
	
};

// * * * * * INHERITANCE * * * * * //
BREAKOUT.Paddle.prototype = new BREAKOUT.GameShape();
BREAKOUT.Paddle.prototype.constructor = BREAKOUT.Paddle;
BREAKOUT.Paddle.prototype.supr = BREAKOUT.GameShape.prototype;

// * * * * * PROTOTYPE * * * * * //
// ----- GET / SET FUNCTIONS ----- //

// ----- PUBLIC FUNCTIONS ----- //

// ----- PROTECTED FUNCTIONS ----- //
BREAKOUT.Paddle.prototype.init = function() {

	this._width = 120;
	this._height = 20;
	this.setColor( 153, 153, 187 );

	this.supr.init.call( this );

};


/**
 **********************************************************
 * Puck
 *
 */

// * * * * * CONSTRUCTOR * * * * * //
BREAKOUT.Puck = function() {
	//console.log( "new BREAKOUT: Puck" );

	// ----- PUBLIC VARS ----- //

	// ----- PROTECTED VARS ----- //
	this._direction;
	this._velocity;
	this._vX;
	this._vY;
	

	// ----- CONSTRUCT ----- //
	this.init();
	
};

// * * * * * INHERITANCE * * * * * //
BREAKOUT.Puck.prototype = new BREAKOUT.GameShape();
BREAKOUT.Puck.prototype.constructor = BREAKOUT.Puck;
BREAKOUT.Puck.prototype.supr = BREAKOUT.GameShape.prototype;

// * * * * * PROTOTYPE * * * * * //
// ----- GET / SET FUNCTIONS ----- //
BREAKOUT.Puck.prototype.getDirection = function() {
	return this._direction;
};

BREAKOUT.Puck.prototype.setDirection = function( value ) {
	this._direction = value;
};

BREAKOUT.Puck.prototype.getVelocity = function() {
	return this._velocity;
};

BREAKOUT.Puck.prototype.setVelocity = function( value ) {

	this._velocity = value;
	this._vX = this._velocity * Math.sin( this._direction );
	this._vY = this._velocity * Math.cos( this._direction );

};

BREAKOUT.Puck.prototype.getVelocityX = function() {
	return this._vX;
};

BREAKOUT.Puck.prototype.getVelocityY = function() {
	return this._vY;
};

// ----- PUBLIC FUNCTIONS ----- //
BREAKOUT.Puck.prototype.reverseDirection = function( axis ) {

	if ( axis.toLowerCase() == "x" )
		this._vX *= -1;
	else 
		this._vY *= -1;

};

// ----- PROTECTED FUNCTIONS ----- //
BREAKOUT.Puck.prototype.init = function() {
	
	this._width = 15;
	this._height = 15;
	this.setColor( 255, 255, 255 );
	this.setVelocity( 0 );

	this.supr.init.call( this );

};


/**
 **********************************************************
 * Wall
 * Container for all Blocks
 *
 */

// * * * * * CONSTRUCTOR * * * * * //
BREAKOUT.Wall = function() {
	//console.log( "new BREAKOUT: Block" );

	// ----- PUBLIC VARS ----- //

	// ----- PROTECTED VARS ----- //
	this._blocks;
	this._numBlocksVisible;
	
	// ----- CONSTRUCT ----- //
	this.init();
	
};

// * * * * * INHERITANCE * * * * * //
BREAKOUT.Wall.prototype = new BREAKOUT.GameObject();
BREAKOUT.Wall.prototype.constructor = BREAKOUT.Wall;
BREAKOUT.Wall.prototype.supr = BREAKOUT.GameObject.prototype;

// * * * * * PROTOTYPE * * * * * //
// ----- GET / SET FUNCTIONS ----- //
BREAKOUT.Wall.prototype.getWidth = function() {

	var block = this._blocks[ this.getNumBlocks() - 1 ];
	return block.getX() + block.getWidth();

};

BREAKOUT.Wall.prototype.getHeight = function() {

	var block = this._blocks[ this.getNumBlocks() - 1 ];
	return block.getY() + block.getHeight();

};

BREAKOUT.Wall.prototype.getBlockAt = function( index ) {
	return this._blocks[ index ];
};

BREAKOUT.Wall.prototype.getNumBlocks = function() {
	return this._blocks.length;
};

BREAKOUT.Wall.prototype.getNumBlocksVisible = function() {
	return this._numBlocksVisible;
};

// ----- PUBLIC FUNCTIONS ----- //
BREAKOUT.Wall.prototype.addChild = function( gameObject ) {

	this._blocks.push( gameObject );
	this._displayObject.addChild( gameObject.getDisplayObject() );

};

BREAKOUT.Wall.prototype.hideBlockAt = function( index ) {

	this._numBlocksVisible--;

	var block = this._blocks[ index ];
	block.hide();
	
};

BREAKOUT.Wall.prototype.reset = function() {
	console.log( "BREAKOUT: Wall: reset" );

	var i;
	var length = this._blocks.length;
	var block;
	
	for ( i = 0; i < length; i++ ) {
		
		block = this._blocks[ i ];
		block.show();
		
	}
	
	this._numBlocksVisible = length;

};

// ----- PROTECTED FUNCTIONS ----- //
BREAKOUT.Wall.prototype.init = function() {
	
	this._blocks = [];
	this._displayObject = new createjs.Container();
	
};



/**
 **********************************************************
 * Block
 *
 */

// * * * * * CONSTRUCTOR * * * * * //
BREAKOUT.Block = function( width, height, r, g, b ) {
	//console.log( "new BREAKOUT: Block" );

	// ----- PUBLIC VARS ----- //

	// ----- PROTECTED VARS ----- //

	// ----- CONSTRUCT ----- //
	this._width = width;
	this._height = height;
	this.setColor( r, g, b );
	this.supr.init.call( this );
	
};

// * * * * * INHERITANCE * * * * * //
BREAKOUT.Block.prototype = new BREAKOUT.GameShape();
BREAKOUT.Block.prototype.constructor = BREAKOUT.Block;
BREAKOUT.Block.prototype.supr = BREAKOUT.GameShape.prototype;

// * * * * * PROTOTYPE * * * * * //
// ----- GET / SET FUNCTIONS ----- //

// ----- PUBLIC FUNCTIONS ----- //
BREAKOUT.Block.prototype.show = function() {
	//console.log( "BREAKOUT: Block: show" );

	this._displayObject.visible = true;

};

BREAKOUT.Block.prototype.hide = function() {
	//console.log( "BREAKOUT: Block: hide" );

	this._displayObject.visible = false;

};

// ----- PROTECTED FUNCTIONS ----- //





















	