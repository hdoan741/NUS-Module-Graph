
var TESTDATA = ' \
{ \
"listModule": ["CS1101", "CS1102", "CS1231", "CS2102", "CS2103", "CS2105", "CS2106", \
"CS3101", "CS3102", "CS3010", "CS3102", "CS4113", "CS4115", "CS4116", \
"CS4103", "CS4105", "CS4106", "CS5432", \
"CS5231", "CS5123" \
],\
"desc": [ \
	{ \
	"code":"CS2102", \
	"req":[1, "CS1101", "CS1102"] \
	}, \
	{ \
	"code":"CS2105", \
	"req":[0, "CS1102", "CS1231"] \
	}, \
	{ \
	"code":"CS2103", \
	"req":[0, [1, "CS1101", "CS1102"], "CS1231"], \
	"exc":["CS2105", "CS2106"] \
	} , \
	{ \
	"code":"CS3010", \
	"req":[1, "CS2102", [0, "CS2105", "CS2106"]], \
	"exc":["CS3102"]\
	},\
	{ \
	"code":"CS4106", \
	"req":[1, "CS3010"] \
	},\
	{ \
	"code":"CS5432", \
	"req":[0, "CS3010"] \
	}\
] \
} \
';

var require;
var listModule;
var listModuleButton;
var graph;
var exc;
var directLink;

var enableList;
var level;

var preLevel;

function extractCode(reqArray) {
	var list = new Array();
	if (reqArray == null) 
		return list;
	if (reqArray instanceof Array) {
		for (var i = 1; i < reqArray.length; i++) {
			req = reqArray[i];
			if ((req != 0) || (req != 1))
				list = list.concat(extractCode(req));
		}
	} else return [reqArray];
	return list;
}

function extractDirectLink() {
	directLink = new Object;
	for (var i = 0; i < listModule.length; i++) {
		code = listModule[i];
		req = graph[code];
		var list = extractCode(req);
		directLink[code] = list;
	}
}

function markRequire(code) {
	preLevel = new Object;
	for (var i = 0; i < listModule.length; i++) 
		preLevel[listModule[i]] = -1;
	
	preLevel[code] = 0;
	var queue = directLink[code].slice();
	for (var i = 0; i < queue.length; i++) {
		var c = queue[i];
		preLevel[c] = 1;
	}
	while (queue.length >= 1) {
		var code = queue.shift();
		var currentLevel = preLevel[code];
		if (directLink[code] == null) continue;
		for (var i = 0; i < directLink[code].length; i++) {
			nextIndex = directLink[code][i];
			preLevel[nextIndex] = currentLevel + 1;
			queue.push(nextIndex);
		}
	}
}


function arrayContain(array, key) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] === key) 
			return true;
	}
	return false;
}

function checkOk (req, listModuleChosen) {
	if (! (req instanceof Array)) 
		return (arrayContain[listModuleChosen, req] ? 1 : 0);
	var type = req[0];
	if (type == 1) { // AND
		var ok = true;
		for (var i = 1; i < req.length; i++)
			ok = ok && checkOk( req[i], listModuleChosen);
	} else {
		var ok = true;
		for (var i = 1; i < req.length; i++)
			ok = ok || checkOk( req[i], listModuleChosen);
	}
}

function checkAvailable(listModuleChosen) {
	var checked = new Object;
	
	for (code in listModuleChosen) {
		if (checked[code] == null) 
			checked[code] = checkOk (graph[code], listModuleChosen);
	}
	return checked;
}


var viewPortX = 0;
var viewPortY = 0;
var viewPortWidth = 800;
var viewPortHeight = 2000;

function drawEnableList(layer, posX, posY, maxX, name) {
	var numButtonPerScreenWidth = parseInt((maxX - 2 * posX - WIDTH) / 
								(WIDTH + BUTTON_DISTANCE))  + 1;
    for (var i = 0; i < name.length; i++) {	
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
		 module.color = "yellow";
		 var pos = new Object;
		 pos.x =  posButtonX;
		 pos.y =  posButtonY;
		 module.origin = pos;
		 module.width = WIDTH;
		 module.height = HEIGHT;
         layer.add(module);
         })();
    }
}

function drawPreClusionList(layer, posX, posY, maxX, name) {
	var numButtonPerScreenWidth = parseInt((maxX - 2 * posX - WIDTH) / 
								(WIDTH + BUTTON_DISTANCE))  + 1;
    for (var i = 0; i < name.length; i++) {	
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
		 module.color = DISABLE_COLOR;
		 var pos = new Object;
		 pos.x =  posButtonX;
		 pos.y =  posButtonY;
		 module.origin = pos;
		 module.width = WIDTH;
		 module.height = HEIGHT;
         layer.add(module);
         })();
    }
}


function moduleOnLayerClicked() {
	console.log(this);
	console.log(this.getName() + "clicked");
}


function drawLevelPreReq(layer, posX, posY, maxX, name) {
	var numButtonPerScreenWidth = parseInt((maxX - 2 * posX - WIDTH) / 
								(WIDTH + BUTTON_DISTANCE))  + 1;
	for (var i = 0; i < name.length; i++) {	
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
		 module.color = ENABLE_COLOR;
		 //module.on("click", moduleOnLayerClicked() );
		 var pos = new Object;
		 pos.x =  posButtonX;
		 pos.y =  posButtonY;
		 module.origin = pos;
		 module.width = WIDTH;
		 module.height = HEIGHT;
         //buttonArray[startId + i] = new button(startId + i, level, posButtonX, posButtonY, WIDTH, HEIGHT, module);
         layer.add(module);
         })();
    }
}


function drawAndGate(group, px, py, numChild) {
	console.log(" draw and gate " + px + " " + py);
	var and = new Kinetic.Shape(
		function() {
			drawTriangle(this, px - 5 * (numChild-1), py - 5, 10 * (numChild-1), 10, "", "black");
		}
	);
	group.add(and);
}

function drawOrGate(group, px, py, numChild) {

	console.log(" draw or gate " + px + " " + py);
	var or = new Kinetic.Shape(
		function() {
			drawRectangle(this, px - 5 * (numChild-1), py - 5, 10 * (numChild-1), 10, "", "#CCCCCC");
		}
	);
	group.add(or);
}


function getMidTopPos(code) {
	var button = currentLayer.getChild(code);
    var pos = button.origin;
    var topX = pos.x + button.width / 2;
    var topY = pos.y - 5;
    var obj = new Object;
    obj.x = topX;
    obj.y = topY;
    return obj;
}

function count(reqGroup) {
	if (reqGroup == null) return 0;
	if (!(reqGroup instanceof Array)) return 1;
	var sum = 0;
	for (var i = 1; i < reqGroup.length; i++)
		sum += count (reqGroup[i]);
	return sum;
}

function drawReqGroup(group, reqGroup, px, py) {
	console.log("draw req group " + reqGroup + " " + px + " " + py);
	if (reqGroup == null) return;
	if (! (reqGroup instanceof Array)) {
		var button = currentLayer.getChild(reqGroup);
		//console.log("button " + button.getName());
		var pos = getMidTopPos(reqGroup);
		var line = new Kinetic.Shape(function() {
			drawConnectionOneLevel(this, px, py - 5, pos.x, pos.y);
		});
		group.add(line);
	} else {
		
		var lengthSubTree = Array();
		lengthSubTree[0] = 0;
		var sum = 0;
		for (var i = 1; i < reqGroup.length; i++) {
			sum += lengthSubTree[i] = count(reqGroup[i]);
		}
		
		console.log(reqGroup +  " length sub tree " + sum);
		
		var type = reqGroup[0];
		if (type == 1) {
			drawAndGate(group, px, py, sum);
		} else {
			drawOrGate(group, px, py, sum);		
		}

		var leftX = px - (sum - 1) * 5;
		console.log(leftX);
		var sumLeft = 0;
		for (var i = 1; i < reqGroup.length; i++) {
			sumLeft += lengthSubTree[i-1];
			(function () {
				var posX =  leftX + sumLeft * 10;
				console.log("draw small group " + posX + " " + px);
				var posY = py + 10;
				drawReqGroup(group, reqGroup[i], posX, posY);
			})();
		}
	}
}
function drawPreForModule(layer, code) {
	console.log("draw pre for module");
    var button = currentLayer.getChild(code);
    console.log(button);
    var pos = button.origin;
    var botX = pos.x + button.width / 2;
    var botY = pos.y + button.height + 4;
    console.log(botX + " " + botY);
    var req = graph[code];
    console.log(req);
    var numReq = 0;
    if (req!=null) 
    	numReq = req.length;
    
    var group = new Kinetic.Group("line group");
    drawReqGroup(group, req, botX, botY);
    console.log("group " + group);
    currentLayer.add(group);
}

function addModuleEventListener() {
	for (var i = 0; i < listModuleChosen.length; i++) {
		var code = listModuleChosen[i];
		var module = currentLayer.getChild(code);
		module.on("click", moduleOnLayerClicked);
	}
}

function drawModule(code) {
	var layer = null;
	for (var i = 0; i < tabLayer.length; i++) {
		if (tabLayer[i].getName() === code) {
			layer = tabLayer[i];
			break;
		}
	}
	if (layer == null) {
		markRequire (code);
		var layer = new Kinetic.Layer(code);
		currentLayer = layer;
		var moduleAtHopLevel = new Array(5);
		for (var i = 0; i < 5; i++)
			moduleAtHopLevel[i] = new Array();
		
		listModuleChosen = new Array();
		listModuleChosen.push(code);
		for (var i = 0; i < listModule.length; i++) {
			mCode = listModule[i];
			var hop = preLevel[mCode];
			if (hop!=-1 && hop != 0){
				moduleAtHopLevel[hop].push (mCode);
				listModuleChosen.push(mCode);
			}
		}
				
		
		var enableList = new Array();
		for (var i = 0; i < listModule.length; i++) {
			var aCode = listModule[i];
			if (arrayContain(directLink[aCode], code)) {
				enableList.push(aCode);
			}
		}
		x = SCREEN_WIDTH - (enableList.length * (WIDTH + BUTTON_DISTANCE) 
				- BUTTON_DISTANCE);
		x = parseInt( x/ 2);
			
	    posX;
	    posX = (x < 20) ? 20: x;
		
		drawEnableList(layer, posX, 20, SCREEN_WIDTH, enableList);
		
		var mainX = SCREEN_WIDTH / 2 - WIDTH / 2;
		var mainY = 1 * (LEVEL_DISTANCE_LOCAL_GRAPH +  HEIGHT) + 20;
		var module = new Kinetic.Shape(
             function() {
                 drawRectangle(this, mainX, mainY, 
                 	WIDTH, HEIGHT, code, BUTTON_COLOR, "black");                                    
             }, code
		 );
		 
		 
		module.grd = true;
		module.color = ENABLE_COLOR;
		 
		var pos = new Object;
		pos.x =  mainX;
		pos.y =  mainY;
		module.origin = pos;
		module.width = WIDTH;
		module.height = HEIGHT;
		layer.add(module);
		 
		var max = 0;
		for (var i = 1; i <  5; i++) {
			if ((moduleAtHopLevel[i] == null) || (moduleAtHopLevel[i].length == 0))
			{
				max = i;
				break;
			}
			var x = SCREEN_WIDTH - ( moduleAtHopLevel[i].length * (WIDTH + BUTTON_DISTANCE) 
				- BUTTON_DISTANCE);
			x = parseInt( x/ 2);
			
	    	var posX;
	    	posX = (x < 20) ? 20: x;
    	    var posY = 20 + (1 + i) * (HEIGHT + LEVEL_DISTANCE_LOCAL_GRAPH);
    	    if (i == 1)
    	    	drawLevelPreReq(layer, posX, posY, SCREEN_WIDTH, directLink[code]);
    	    else
			drawLevelPreReq(layer, posX, posY, SCREEN_WIDTH, moduleAtHopLevel[i]);
		}
		 
		
		var x = SCREEN_WIDTH - (exc[code].length * (WIDTH + BUTTON_DISTANCE) 
			- BUTTON_DISTANCE);
		x = parseInt( x/ 2);
			
	    var posX;
	    posX = (x < 20) ? 20: x;
		drawPreClusionList(layer, posX, 20 + (1 + max) * (HEIGHT + LEVEL_DISTANCE_LOCAL_GRAPH), SCREEN_WIDTH, exc[code]);
		
		
		drawPreForModule(layer, code);
		stage.add(layer);
		tabLayer.push(layer);
		addModuleEventListener();
	} else {
		currentLayer = layer;
		stage.add(layer);
	}
}


function readGraph(data) {
	var obj = data;
	listModule = obj.listModule;
	console.log("list module " + listModule);
	
	level = new Object;
	moduleAtLevel = new Array(5);
	for (var i = 0; i < 5; i++) {
		moduleAtLevel[i] = new Array();
		numModule[i] = 0;
	}
	for (var i = 0; i < listModule.length; i++) {
		var code = listModule[i];
		if ((code.charAt(2) >= '0') && (code.charAt(2) <= '9'))
			level[code] = parseInt(code.charAt(2)) - 1;
		else {
			level[code] = parseInt(code.charAt(3)) - 1;
		}
        if (level[code] >= 5) {
            continue;
        }
		numModule[level[code]]++;
		moduleAtLevel[level[code]].push(code);
	}
	console.log(level);
	console.log(numModule);
	console.log(moduleAtLevel);
	graph = new Object;
	exc = new Object;
	for (var i = 0; i < obj.desc.length; i++) {
		moduleDesc = obj.desc[i];
		var code = moduleDesc.code;
		graph[code] = moduleDesc.req;
		exc[code] = moduleDesc.exc;
	}
	console.log(graph);
	extractDirectLink(graph);
}


