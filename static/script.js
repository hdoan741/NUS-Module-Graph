var stage;
var tabLayer;
var currentLayer;
var SCREEN_WIDTH = 1100;
var LEVEL_HEIGHT = 140;
var WIDTH = 70;
var HEIGHT = 35;
var BUTTON_DISTANCE = 20;
var LEVEL_DISTANCE = 240;
var LEVEL_START = [0, 200, 400, 600, 720, 840 ];
var LEVEL_DISTANCE_LOCAL_GRAPH = 70;
var connection
var buttonArray;
var preqArray = new Array(5);
var moduleAtLevel;
var numModule = [10, 20, 30, 40, 30];
var OFFSET_X = [3, 2, 1, 0, 1];

var BUTTON_COLOR = "#CCCCCC";
var ENABLE_COLOR = "#8CC63F";
var DISABLE_COLOR = "#FF1D25";
var COLOR_AT_LEVEL = ["#CFE7F9", "#BCDBF4", "#A0C9ED", "#61A4D7", "#00457C"];

var imageNotTick;
var imageTick;


function button(id, level, x, y, width, height, shape) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.topX = x + width / 2;
    this.topY = y - 10;
    this.botX = x + width / 2;
    this.botY = y + height + 5;
    //	this.onClickCallback = onClickCallback;
    //	this.onHoverCallback = onHoverCallback;
    this.shape = shape;
    this.level = level;
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }        
}

function drawImage(shape, x, y, w, h, image) {
	var pos = new Object;
	pos.x = x;
	pos.y = y;
	shape.origin = pos;
	shape.width = w;
	shape.height = h;
	if (shape.image == null) 
		shape.image = image;
	context = shape.getContext();
	var destX = x;
    var destY = y;
    var destWidth = w;
    var destHeight = h;

    context.drawImage(shape.image, destX, destY, destWidth, destHeight);
    context.beginPath();
    context.rect(x, y, w, h);
}


function drawRectangle(shape, x, y, w, h, message, color, borderColor, grd) {
	var pos = new Object;
	pos.x = x;
	pos.y = y;
	if (shape.origin == null)
        shape.origin = pos;
	if (shape.width == null)
        shape.width = w;
	if (shape.height == null)
        shape.height = h;
	if (shape.color == null)
		shape.color = color;
	if (shape.message == null)
		shape.message = message;
    var context = shape.getContext();
    var topLeftCornerX = x;
    var topLeftCornerY = y;
    var width = w;
    var height = h;
    context.save();
    if (shape.grd == null) 
	    context.fillStyle = shape.color;
    else {
	    var grd = context.createLinearGradient(shape.origin.x + shape.width / 2, shape.origin.y, shape.origin.x + shape.width / 2, shape.origin.y + shape.height);
    	grd.addColorStop(0, "#E6E6E6"); 
    	grd.addColorStop(1, shape.color); 
    	context.fillStyle = grd;
    }
  
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 1;
    context.shadowBlur = 3;
    context.shadowColor = "black";
    roundRect(context, shape.origin.x, shape.origin.y, shape.width, shape.height, HEIGHT / 5, true, false); 

    context.restore(); 
    
    context.save();     
    context.font = "12pt Calibri";
    context.fillStyle = "black";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 1;
    context.shadowBlur = 0;
    context.shadowColor = "white";
    context.textAlign = "center";
    context.fillText(shape.message, x + w / 2, y + h / 2 + 4);
   	context.restore();
}

function drawTriangle(shape, x, y, w, h, message, color, borderColor, grd) {
	var pos = new Object;
	pos.x = x;
	pos.y = y;
	shape.origin = pos;
	shape.width = w;
	shape.height = h;
	if (shape.color == null)
		shape.color = color;
	if (shape.message == null)
		shape.message = message;
    var context = shape.getContext();
    var topLeftCornerX = x;
    var topLeftCornerY = y;
    var width = w;
    var height = h;
    context.save();
    if (shape.grd == null) 
	    context.fillStyle = shape.color;
    else {
	    var grd = context.createLinearGradient(x + w / 2, y, x + w / 2, y + h);
    	grd.addColorStop(0, "#E6E6E6"); 
    	grd.addColorStop(1, shape.color); 
    	context.fillStyle = grd;
    }
  
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 1;
    context.shadowBlur = 3;
    context.shadowColor = "black";
    context.beginPath();
    context.moveTo(x + w / 2, y);
    context.lineTo(x , y + h);
    context.lineTo(x + w, y + h);
    context.closePath();
    context.stroke();
    context.fill();
    

    context.restore(); 
    
    context.save();     
    context.font = "12pt Calibri";
    context.fillStyle = "black";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 1;
    context.shadowBlur = 0;
    context.shadowColor = "white";
    context.textAlign = "center";
    context.fillText(shape.message, x + w / 2, y + h / 2 + 4);
   	context.restore();
}



function drawConnectionOneLevel (shape, p1x, p1y, p2x, p2y) {
    //console.log("one connection from " + p1x + " " + p1y + " " + p2x + " " + p2y + " " + (x++));
    
    var context = shape.getContext();
    context.beginPath();
    context.moveTo(p1x, p1y);
    var controlX1 = p1x;
    var controlY1 = p1y + (p2y - p1y) / 2 + 10;
    var controlX2 = p2x;
    var controlY2 = controlY1 - 20;
    context.bezierCurveTo(controlX1, controlY1, controlX2, 
                          controlY2, p2x, p2y);
    context.lineWidth = 0.5;
    context.strokeStyle = "black";
    context.stroke();	
}


function drawLevel(level, posX, posY, maxX, numModuleThisLev, name) {
	var numButtonPerScreenWidth = parseInt((maxX - 2 * posX - WIDTH) / 
								(WIDTH + BUTTON_DISTANCE))  + 1;
	console.log("num button "  + numButtonPerScreenWidth + " " + maxX + " " + posX + " " + (WIDTH + BUTTON_DISTANCE));
    for (var i = 0; i < numModuleThisLev; i++) {	
        (function(){
         var t = i % numButtonPerScreenWidth;
         var posButtonX = posX + t * (WIDTH + BUTTON_DISTANCE)  ;
         var posButtonY = posY + parseInt(i / numButtonPerScreenWidth) * (HEIGHT + 10);
         var moduleName = name[i];
         
         var module = new Kinetic.Shape(
                  function() {
                           drawRectangle(this, posButtonX, posButtonY, WIDTH, HEIGHT, moduleName, BUTTON_COLOR, "black");                                    
                  }, moduleName
		 );
		 module.grd = true;
		 module.on("click", moduleClicked);
         //buttonArray[startId + i] = new button(startId + i, level, posButtonX, posButtonY, WIDTH, HEIGHT, module);
         tabLayer[0].add(module);
         })();
    }
}


function moduleClicked() {
	module = this;
	code = this.getName();
    moduleSelected(code);
}

function getMax(arrayA) {
    var max = 0;
    for (var i = 0; i < arrayA.length; i++) {
        if (arrayA[i] > max) max = arrayA[i];
    }
    return max;
}

function drawGraph() {
    canvas = tabLayer[0].getCanvas();

    var max = getMax(numModule);

    var sum = 0;
    for (var i = 0; i < 5; i++) 
    	sum += numModule[i];
    console.log(sum);
    buttonArray = new Array(sum);
    
    // draw 5 levels:
    
    var startId = 0;
    for (var i = 0; i < 5; i++) {  
    	(function() {
    	var color = COLOR_AT_LEVEL[i];
        var posX = 20;
        var posY = 20 + LEVEL_START[4-i];
        var pos = 4-i;
        var name = new Array(numModule[i]);
        var levelBackGround = new Kinetic.Shape(
                  function() {
        			drawRectangle(this, 0, (LEVEL_START[pos]), SCREEN_WIDTH, (LEVEL_START[pos + 1] - LEVEL_START[pos]), "", color);                                    
                  }
		 );
		 tabLayer[0].add(levelBackGround);
        drawLevel(i, posX, posY, SCREEN_WIDTH ,numModule[i], moduleAtLevel[i]);
        })();
        
    }
    stage.add(tabLayer[0]);
}


$(document).ready ( function() {
    /*
	var imageTickObj = new Image();
    imageTickObj.onload = function(){
    	imageTick = imageTickObj;
    };
    imageTickObj.src = "/static/images/checkbox_checked.png";
    
    var imageUnTickObj = new Image();
    imageUnTickObj.onload = function(){
    	imageNotTick = imageUnTickObj;
    };
    imageUnTickObj.src = "/static/images/checkbox_unchecked.png";
    
    stage = new Kinetic.Stage("container", 1100, 2000);
    tabLayer = new Array();
    tabLayer[0] = new Kinetic.Layer("globalLayer");
    currentLayer = tabLayer[0];
    readGraph(jQuery.parseJSON(TESTDATA));
    drawGraph();
    stage.add(tabLayer[0]);
    */
});

