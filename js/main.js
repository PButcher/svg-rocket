var canvasWidth = 550;
var canvasHeight = 400;
var testing = true;
var quadID = 0;
var circleID = 0;
var polygonID = 0;
var svgFocus = null;
var svgMousedown = null;
var svgSelected = null;

// Drawing state object
var paper;

// Drawing palette properties
var palette = {
	fillColour: "#FFF",
	fillOpacity: "0",
	opacity: 1,
	stroke: '#000',
	strokeColour: "#000",
	strokeWidth: 1,
	radius: 10,
	rotation: 0,
};

// Holds the set of SVG elements in canvas
var currentStateSet;

// User's chosen tool type
// 0 - none
// 1 - hand
// 2 - square
// 3 - circle
// 4 - star
var toolType = 0;

// Layers
var layers = {};

$(document).ready(function (){

	// Remove welcome modal whilst testing
	if(testing) {
		$('#welcome-modal').remove();
	}

	// Set up welcome modal
	setupWelcomeModal();

	// Set up event listeners
	setupViewListeners();

	// Lift off!
	rocketInitialise();

	// Set up canvas plotting
	setupCanvasPlotting();

	// Set up toolkit
	setupToolkit();

	// Set up properties
	setupProperties();

	// Set initial element sizes based on current viewport
	resize();
});


// When the window resizes
$(window).resize(function() {

	// Set initial element sizes based on current viewport
	resize();
});

// Set initial element sizes based on current viewport
function resize() {

	$("#ws-canvas-wrapper").css("width", ($(window).innerWidth() - $(".ws-canvas-toolkit").width() - $(".ws-canvas-properties").width()));
}

// Set up welcome modal
function setupWelcomeModal() {

	// Fade out welcome modal when begin button is clicked
	$('#btn-begin').click(function() {	
		$('#welcome-modal').fadeOut(500);
	});
}

// Set up event listeners
function setupViewListeners() {

	// Canvas workspace button
	$('#btn-ws-canvas').click(function() {
		pageTransition("canvas");
	});

	// Output workspace button
	$('#btn-ws-output').click(function() {
		pageTransition("output");
	});
}

// Set up toolkit
function setupToolkit() {

	// Set initial canvas width and height input values
	$('#canvas-width').val(canvasWidth);
	$('#canvas-height').val(canvasHeight);

	toolProperties(0);

	// Nominate help tool as primary
	$('#toolkit-help').addClass("toolkit-active");

	// Hand tool
	$('#toolkit-hand').click(function() {
		if (toolType != 1) setTool(1);
	});

	// Square tool
	$('#toolkit-square').click(function() {
		if(toolType != 2) setTool(2);
	});

	// Circle tool
	$('#toolkit-circle').click(function() {
		if(toolType != 3) setTool(3);
	});

	// Star tool
	$('#toolkit-star').click(function() {
		if(toolType != 4) setTool(4);
	});

	// Help tool
	$('#toolkit-help').click(function() {
		if(toolType != 0) setTool(0);
	});

	// Canvas width input
	$('#canvas-width').change(function() {
		if(($('#canvas-width').val() > 0) && ($('#canvas-width').val() <= 1000)) {
			canvasWidth = $('#canvas-width').val();
			$('#ws-canvas').css("width", canvasWidth);
		}
	});

	// Canvas height input
	$('#canvas-height').change(function() {
		if(($('#canvas-height').val() > 0) && ($('#canvas-height').val() <= 1000)) {
			canvasHeight = $('#canvas-height').val();
			$('#ws-canvas').css("height", canvasHeight);
		}
	});
}

// Setup properties
function setupProperties() {

}

// Change tool type
function setTool(t) {

	// Disable all tools
	$("#toolkit-hand").removeClass("toolkit-active");
	$("#toolkit-square").removeClass("toolkit-active");
	$("#toolkit-circle").removeClass("toolkit-active");
	$("#toolkit-star").removeClass("toolkit-active");
	$("#toolkit-help").removeClass("toolkit-active");

	switch(t) {
		case 0:
			$("#toolkit-help").addClass("toolkit-active");
			break;
		case 1:
			$("#toolkit-hand").addClass("toolkit-active");
			break;
		case 2:
			$("#toolkit-square").addClass("toolkit-active");
			break;
		case 3:
			$("#toolkit-circle").addClass("toolkit-active");
			break;
		case 4:
			$("#toolkit-star").addClass("toolkit-active");
			break;
		default:
			break;
	}

	// Update tool properties pane
	toolProperties(t);

	toolType = t;
}

// Tool properties pane
// t - tool type
function toolProperties(t) {

	// Hide all tool properties
	$('#properties-help').hide();
	$('#properties-hand').hide();
	$('#properties-square').hide();
	$('#properties-circle').hide();
	$('#properties-star').hide();

	switch(t) {
		case 0:
			$('#properties-help').show();
			break;
		case 1:
			$('#properties-hand').show();
			break;
		case 2:
			$('#properties-square').show();
			break;
		case 3:
			$('#properties-circle').show();
			break;
		case 4:
			$('#properties-star').show();
			break;
	}
}

// Page transitions
// dest -- Destination Page
function pageTransition(dest) {

	switch(dest) {

		// Show canvas page
		case "canvas":
			$('#btn-ws-canvas').addClass("active");
			$('#btn-ws-output').removeClass("active");
			$('#workspace-canvas').addClass("workspace-active");
			$('#workspace-output').removeClass("workspace-active");
			break;

		// Show output page
		case "output":
			$('#btn-ws-output').addClass("active");
			$('#btn-ws-canvas').removeClass("active");
			$('#workspace-output').addClass("workspace-active");
			$('#workspace-canvas').removeClass("workspace-active");
			break;

		// Do nothing
		default:
			break;
	}
}

// Initialise SVG JS
function rocketInitialise() {

	// SVGJS draw object
	paper = SVG("ws-canvas").size(canvasWidth, canvasHeight);

	// Holds SVG set that's being used at the moment
	currentStateSet = paper.set();

	// Draw stuff!
	draw();
}

// Set up canvas plotting
function setupCanvasPlotting() {

	// Call main plotting function with cursor coordinates
	$('#ws-canvas').click(function() {
		console.log("CLICK: canvas");
		var cXPos = event.clientX - $("#ws-canvas").offset().left - $('#ws-canvas-toolkit').width();
		var cYPos = event.clientY - $("#ws-canvas").offset().top;

		canvasPlotting(cXPos, cYPos);
	});
}

// Canvas plotting
function canvasPlotting(cXPos, cYPos) {

	// Decide what to plot
	switch(toolType) {
		case 2:
			console.log("DRAW: rect");
			console.log(cXPos + " : " + cYPos)
			makeRect(100, 100, cXPos-50, cYPos-50);
			break;
	}
}

// Main draw function
function draw() {

	makeRect(100,100,100,100);

}

// Draw a rectangle at a given position
function makeRect(width, height, x, y) {

	quadID = ++quadID;

	var rect = paper.rect(width, height).id("quad-" + quadID).attr({
		fill: palette.fillColour,
		stroke: palette.strokeColour,
		"stroke-width": palette.strokeWidth,
		x: x,
		y: y,
		"fill-opacity": palette.fillOpacity,
		opacity: palette.opacity
	}).radius(palette.radius, palette.radius);

	// Events
	svgNodeInteractions(rect);

	// Add rect to set
	currentStateSet.add(rect);
}

// PATTERN :: RANDOM SQUARES
function makeRandomSquares(n) {

	// Draw a bunch of random squares
	var size;
	var nSquares = 5;
	if(n != undefined) nSquares = n;

	for(var i = 0; i < nSquares; i++) {
		size = Math.ceil(Math.random()*100);
		if(size < 25){ size = 25;}
		makeRect(size, size, Math.floor(Math.random()*(canvasWidth-size)), Math.floor(Math.random()*(canvasHeight-size)));
	}
	currentStateSet.each(function() {
		var rN = Math.round(Math.random()*255);
		var gN = Math.round(Math.random()*255);
		var bN = Math.round(Math.random()*255);
		var newRGB = new SVG.Color({r: rN, g: gN, b: bN});
		this.fill(newRGB);
	});
}

// PATTERN :: POLYGON
function drawPolygon(x, y, v, r, colour, strokeColour, strokeWidth, rotation) {

	// Point arrays
	var xPoints = [];
	var yPoints = [];

	// Polygon points string
	var polygonString = "";

	// Get polygon vertex coordinates
	for(var i = 0; i < sides; i++) {
		polygonXPoints.push((x + ((r * 2) * Math.cos(i * 2 * Math.PI / sides))));
		polygonYPoints.push((y + ((r * 2) * Math.sin(i * 2 * Math.PI / sides))));

		// Add next coordinates to the polygon string
		polygonString = polygonString + polygonXPoints[i] + "," + polygonYPoints[i] + " ";
	}

	// Draw polygon
	draw.polygon(polygonString).attr({
		"stroke-width": 1,
		fill: "#FFF"
	});
}

var store;

// IMPORT PATTERN
function importPattern() {

	var importedPattern = '<svg id="SvgjsSvg1000" xmlns="http://www.w3.org/2000/svg" version="1.1" width="550" height="400" xmlns:xlink="http://www.w3.org/1999/xlink"><rect id="SvgjsRect1006" width="25" height="25" fill="#dc09e9" stroke="none" stroke-width="1" x="325" y="70" radius="0"></rect><rect id="SvgjsRect1007" width="28" height="28" fill="#45725e" stroke="none" stroke-width="1" x="157" y="304" radius="0"></rect><rect id="SvgjsRect1009" width="25" height="25" fill="#934ade" stroke="none" stroke-width="1" x="281" y="27" radius="0"></rect><rect id="SvgjsRect1010" width="25" height="25" fill="#e81d2c" stroke="none" stroke-width="1" x="434" y="144" radius="0"></rect><rect id="SvgjsRect1008" width="57" height="57" fill="#22930b" stroke-width="0" x="213.5" y="176" radius="0"></rect><defs id="SvgjsDefs1001"></defs></svg>';		

	store = paper.svg(importedPattern);

	for (var i = 0; i < store.roots()[0].children().length; i++) {

		// console.log(store.roots()[0].children()[i].type);
		// console.log(store.roots()[0].children()[i].id());
		var nextShape = SVG.get(store.roots()[0].children()[i].id());
		
		svgNodeInteractions(nextShape);

		currentStateSet.add(nextShape);
	}
}

// Update and populate hand tool properties pane
function populateHandToolProperties() {

	if(svgSelected != null) {

		switch(SVG.get(svgSelected).type) {

			// Hand tool for quads
			case "rect":
				$("#properties-hand-pane").show();
				$("#pShapeID").html('<i class="fa fa-square-o"></i>' + svgSelected);
				$("#pShapeX").val(SVG.get(svgSelected).x());
				$("#pShapeY").val(SVG.get(svgSelected).y());
				$("#pShapeWidth").val(SVG.get(svgSelected).width());
				$("#pShapeHeight").val(SVG.get(svgSelected).height());
				$("#pShapeRadius").val(SVG.get(svgSelected).node.attributes.rx.value);
				$("#pShapeStrokeWidth").val(SVG.get(svgSelected).node.attributes[5].value);
				$("#pShapeRotation").val(SVG.get(svgSelected).transform().rotation);
		}
	}
}

// Clear hand tool properties pane
function clearHandToolProperties() {
	$("#properties-hand-pane").hide();
	$("#pShapeID").html("");
	$("#pShapeX").html("");
	$("#pShapeY").html("");
	$("#pShapeWidth").val("");
	$("#pShapeHeight").val("");
	$("#pShapeRadius").val("");
	$("#pShapeStrokeWidth").val("");
	$("#pShapeRotation").val("");
}

// Mouse interactions with nodes
function svgNodeInteractions(node) {

	// Mouseover event
	node.mouseover(function() {

		// Only register a mouseover event when using hand tool
		if(toolType == 1) {
			console.log("MOUSEOVER: " + this.id());
			$("#ws-canvas").css("cursor", "pointer");

			// Do not show a red border if node is selected
			if(svgSelected != this.id()) {
				this.attr({
					stroke: "#F00",
					"stroke-width": 2
				});
			}

			// Element in focus
			svgFocus = this.id();
		}

	// Mouseout event
	}).mouseout(function () {

		// Only register a mouseout event when using hand tool
		if(toolType == 1) {
			console.log("MOUSEOUT: " + this.id());
			$("#ws-canvas").css("cursor", "auto");

			// Do not remove border if node is selected
			if(svgSelected != this.id()) {
				this.attr({
					stroke: palette.strokeColour,
					"stroke-width": palette.strokeWidth
				});
			}

			// Unregister focus and mousedown
			svgFocus = null;
			svgMousedown = null;
		}

	// Mousedown event
	}).mousedown(function () {

		// Only register a mousedown event when using hand tool
		if(toolType == 1) {
			console.log("MOUSEDOWN: " + this.id());
			$("#ws-canvas").css("cursor", "move");

			// Mouse is down on this element
			svgMousedown = this.id();
		}

	// Mouseup event
	}).mouseup(function() {
		
		// Only register a mouseup event when using hand tool
		if(toolType == 1) {
			console.log("MOUSEUP: " + this.id());
			$("#ws-canvas").css("cursor", "pointer");

			// Unregister mousedown
			svgMousedown = null;
		}

	// Mousemove event
	}).mousemove(function() {
		
		// Only register a mousemove event when using hand tool
		if(toolType == 1) {

			// Only register mousemove if mouse is down on thois node
			if(svgMousedown != null) {

				// Bring node to the front of the sketch
				this.front();

				// Move node coordinates to cursor position
				SVG.get(svgMousedown).attr({
					x: (event.clientX - $("#ws-canvas").offset().left - $('#ws-canvas-toolkit').width() - (this.width() / 2)), 
					y: (event.clientY - $("#ws-canvas").offset().top  - (this.height() / 2))
				});

				// Update properties pane
				populateHandToolProperties();
			}
		}

	// Click event
	}).click(function() {

		// Only register a click event when using hand tool
		if(toolType == 1) {

			// If node is not already selected...
			if(svgSelected != this.id()) {

				// ...and if a another node is currently selected, unselect it
				if(svgSelected != null) {
					SVG.get(svgSelected).attr({
						stroke: palette.strokeColour,
						"stroke-width": palette.strokeWidth
					});
				}

				console.log("CLICK: " + this.id());

				// This is now selected
				svgSelected = this.id();

				// Update properties pane
				populateHandToolProperties();

				// Add green border
				this.attr({
					stroke: "#0F0",
					"stroke-width": 2
				});

			// If node is already selected...
			} else {

				// Unregister node
				svgSelected = null;
				this.attr({
					stroke: "#F00",
					"stroke-width": 2
				});

				// Clear properties pane
				clearHandToolProperties();
			}
		}
	});
}