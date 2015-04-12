var canvasWidth = 550;
var canvasHeight = 400;
var testing = true;
var svgFocus = null;
var svgMousedown = null;
var svgSelected = null;

// Drawing state object
var paper;

// Drawing palette properties
var palette = {
	fillColour: "none",
	opacity: "0.1",
	strokeColour: "none",
	strokeWidth: 1,
	radius: 0,
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

$(document).ready(function (){

	// Remove welcome modal whilst testing
	if(testing) {
		$('#welcome-modal').remove();
	}

	// Set up welcome modal
	setupWelcomeModal();

	// Set up event listeners
	setupEventListeners();

	// Lift off!
	rocketInitialise();

	// Set up toolkit
	setupToolkit();

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
function setupEventListeners() {

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

// Main draw function
function draw() {

	
}

// Draw a rectangle at a given position
function makeRect(width, height, x, y) {

	var rect = paper.rect(width, height).attr({
		fill: palette.fillColour,
		stroke: palette.strokeColour,
		"stroke-width": palette.strokeWidth,
		x: x,
		y: y,
		radius: palette.radius
	});

	// Events
	rect.mouseover(function() {
		if(toolType == 1) {
			console.log("MOUSEOVER: " + this.id());
			if(svgSelected != this.id()) {
				this.attr({
					stroke: "#F00",
					"stroke-width": 2
				});
			}
			svgFocus = this.id();
			$("#ws-canvas").css("cursor", "pointer");
		}
	}).mouseout(function () {
		if(toolType == 1) {
			console.log("MOUSEOUT: " + this.id());
			if(svgSelected != this.id()) {
				this.attr({
					stroke: "none",
					"stroke-width": 0
				});
			}
			svgFocus = null;
			svgMousedown = null;
			$("#ws-canvas").css("cursor", "auto");
		}
	}).mousedown(function () {
		if(toolType == 1) {
			console.log("MOUSEDOWN: " + this.id());
			svgMousedown = this.id();
			$("#ws-canvas").css("cursor", "move");
		}
	}).mouseup(function() {
		if(toolType == 1) {
			console.log("MOUSEUP: " + this.id());
			svgMousedown = null;
			$("#ws-canvas").css("cursor", "pointer");
		}
	}).mousemove(function() {
		if(toolType == 1) {
			if(svgMousedown != null) {
				this.front();
				SVG.get(svgMousedown).attr({
					x: (event.clientX - $("#ws-canvas").offset().left - $('#ws-canvas-toolkit').width() - (this.width() / 2)), 
					y: (event.clientY - $("#ws-canvas").offset().top  - (this.height() / 2))
				});
			}
		}
	}).click(function() {
		if(toolType == 1) {
			if(svgSelected != this.id()) {
				if(svgSelected != null) {
					SVG.get(svgSelected).attr({
						stroke: "none",
						"stroke-width": 0
					});
				}
				console.log("CLICK: " + this.id());
				svgSelected = this.id();
				this.attr({
					stroke: "#0F0",
					"stroke-width": 2
				});
			} else {
				svgSelected = null;
				this.attr({
					stroke: "F00",
					"stroke-width": 2
				});
			}
		}
	});

	// Add rect to set
	currentStateSet.add(rect);
}

// PATTERN :: RANDOM SQUARES
function makeRandomSquares() {

	// Draw a bunch of random squares
	var size;
	var nSquares = 5;

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

var store;

// IMPORT PATTERN
function importPattern() {
	var importedPattern = '<svg id="SvgjsSvg1000" xmlns="http://www.w3.org/2000/svg" version="1.1" width="550" height="400" xmlns:xlink="http://www.w3.org/1999/xlink"><rect id="SvgjsRect1006" width="25" height="25" fill="#dc09e9" stroke="none" stroke-width="1" x="325" y="70" radius="0"></rect><rect id="SvgjsRect1007" width="28" height="28" fill="#45725e" stroke="none" stroke-width="1" x="157" y="304" radius="0"></rect><rect id="SvgjsRect1009" width="25" height="25" fill="#934ade" stroke="none" stroke-width="1" x="281" y="27" radius="0"></rect><rect id="SvgjsRect1010" width="25" height="25" fill="#e81d2c" stroke="none" stroke-width="1" x="434" y="144" radius="0"></rect><rect id="SvgjsRect1008" width="57" height="57" fill="#22930b" stroke-width="0" x="213.5" y="176" radius="0"></rect><defs id="SvgjsDefs1001"></defs></svg>';		
	store = paper.svg(importedPattern);
	for (var i = 0; i < store.roots()[0].children().length; i++) {

		console.log(store.roots()[0].children()[i].type);
		console.log(store.roots()[0].children()[i].id());
		var nextShape = SVG.get(store.roots()[0].children()[i].id());
		
		svgNodeInteractions(nextShape);

		currentStateSet.add(nextShape);
	}
}

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
					stroke: "none",
					"stroke-width": 0
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
						stroke: "none",
						"stroke-width": 0
					});
				}

				console.log("CLICK: " + this.id());

				// This is now selected
				svgSelected = this.id();

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
					stroke: "F00",
					"stroke-width": 2
				});
			}
		}
	});
}