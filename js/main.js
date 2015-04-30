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
	strokeWidth: 2,
	radius: 10,
	rotation: 0,
	width: 100,
	height: 100,
	x: 0,
	y: 0
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

	// Delete workspace button
	$('#btn-ws-bin').click(function() {
		paper.clear();
		currentStateSet.clear();
		svgSelected = null;
	});
}

// Set up toolkit
function setupToolkit() {

	// Set initial canvas width and height input values
	$('#canvas-width').val(canvasWidth);
	$('#canvas-height').val(canvasHeight);

	setTool(0);

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

	// Hand Tool Shape x coordinate
	$("#pShapeX").change(function() {
		SVG.get(svgSelected).animate().attr({x:this.value});
		palette.x = this.value;
	});

	// Hand Tool Shape y coordinate
	$("#pShapeY").change(function() {
		SVG.get(svgSelected).animate().attr({y:this.value});
		palette.y = this.value;
	});

	// Hand Tool Shape width
	$("#pShapeWidth").change(function() {
		SVG.get(svgSelected).animate().attr({width:this.value});
		palette.width = this.value;
	});

	// Hand Tool Shape height
	$("#pShapeHeight").change(function() {
		SVG.get(svgSelected).animate().attr({height:this.value});
		palette.height = this.value;
	});

	// Hand Tool Shape radius
	$("#pShapeRadius").change(function() {
		SVG.get(svgSelected).animate().radius(this.value);
		palette.radius = this.value;
	});

	// Hand Tool Shape stroke width
	$("#pShapeStrokeWidth").change(function() {
		SVG.get(svgSelected).animate().attr({"stroke-width":this.value});
		palette.strokeWidth = this.value;
		console.log(palette.strokeWidth);
	});

	// Hand Tool Shape rotation
	$("#pShapeRotation").change(function() {
		SVG.get(svgSelected).animate().transform({rotation:this.value});
		palette.rotation = this.value;
	});

	// Hand Tool Shape copy
	$("#pShapeCopy").click(function() {
		switch(SVG.get(svgSelected).type) {
			case "rect":
				var rect2copy = SVG.get(svgSelected);
				palette.radius = rect2copy.node.attributes.rx.value;
				palette.strokeWidth = rect2copy.node.attributes[5].value;
				palette.rotation = rect2copy.transform().rotation;
				makeRect(rect2copy.width(), rect2copy.height(), rect2copy.x()+10, rect2copy.y()+10);
		}
	});

	// Hand Tool Shape remove
	$("#pShapeDelete").click(function() {
		SVG.get(svgSelected).remove();
		svgSelected = null;
		clearHandToolProperties();
	});

	// Hand Tool Generate
	$("#pShapeGenerate").click(function() {
		drawSpiral(5, 10);
	});

	// Quad Tools
	// Quad Tool Shape x coordinate
	$("#pQuadX").change(function() {
		palette.x = this.value;
	});

	// Quad Tool Shape y coordinate
	$("#pQuadY").change(function() {
		palette.y = this.value;
	});

	// Quad Tool Shape width
	$("#pQuadWidth").change(function() {
		palette.width = this.value;
	});

	// Quad Tool Shape height
	$("#pQuadHeight").change(function() {
		palette.height = this.value;
	});

	// Quad Tool Shape radius
	$("#pQuadRadius").change(function() {
		palette.radius = this.value;
	});

	// Quad Tool Shape stroke width
	$("#pQuadStrokeWidth").change(function() {
		palette.strokeWidth = this.value;
	});

	// Quad Tool Shape rotation
	$("#pQuadRotation").change(function() {
		palette.rotation = this.value;
	});

	// Quad Add Tool
	$("#pQuadAdd").click(function() {
		makeRect(palette.width, palette.height, palette.x, palette.y);
	});

	// Quad Random Tool
	$("#pQuadRandom").click(function() {
		makeRandomSquare(1);
	})
}

// Change tool type
function setTool(t) {

	// Disable all tools
	$("#toolkit-hand").removeClass("toolkit-active");
	$("#toolkit-square").removeClass("toolkit-active");
	$("#toolkit-circle").removeClass("toolkit-active");
	$("#toolkit-star").removeClass("toolkit-active");
	$("#toolkit-help").removeClass("toolkit-active");

	// Unselect all shapes
	if(svgSelected != null) {
		SVG.get(svgSelected).attr({
			stroke: palette.strokeColour,
		});
		svgSelected = null;
		clearHandToolProperties();
	}

	// Hide all tool properties
	$('#properties-help').hide();
	$('#properties-hand').hide();
	$('#properties-square').hide();
	$('#properties-circle').hide();
	$('#properties-star').hide();

	switch(t) {
		case 0:
			$("#toolkit-help").addClass("toolkit-active");
			$('#properties-help').show();
			break;
		case 1:
			$("#toolkit-hand").addClass("toolkit-active");
			$('#properties-hand').show();
			break;
		case 2:
			$("#toolkit-square").addClass("toolkit-active");
			$('#properties-square').show();
			populateQuadToolProperties();
			break;
		case 3:
			$("#toolkit-circle").addClass("toolkit-active");
			$('#properties-circle').show();
			break;
		case 4:
			$("#toolkit-star").addClass("toolkit-active");
			$('#properties-star').show();
			break;
		default:
			break;
	}

	toolType = t;
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

		plot(cXPos, cYPos);
	});
}

// Canvas plotting
function plot(cXPos, cYPos) {

	// Decide what to plot
	switch(toolType) {

		// Plot square
		case 2:
			console.log("DRAW: rect");
			console.log(cXPos + " : " + cYPos)
			makeRect(palette.width, palette.height, cXPos-50, cYPos-50);
			break;
	}
}

// Main draw function
function draw() {


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
	}).transform({
		rotation: palette.rotation
	}).radius(palette.radius, palette.radius);

	// Events
	svgNodeInteractions(rect);

	// Add rect to set
	currentStateSet.add(rect);
}

// Draw a square
function makeSquare(x, y, w, h, r, s, rt) {

	quadID = ++quadID;

	var rect = paper.rect(w, h).id("quad-" + quadID).attr({
		fill: "#FFF",
		"fill-opacity": "0",
		opacity: 1,
		stroke: "#000",
		x: x,
		y: y,
		"stroke-width": s,
	}).transform({
		rotation: rt
	}).radius(r, r);

	// Eveents
	svgNodeInteractions(rect);

	// Add square to set
	currentStateSet.add(rect);
}

// SHAPE :: MAKE RANDOM SQUARE
function makeRandomSquare(n) {

	var w, x, y, r, s, rt;

	for(var i = 0; i < n; i++) {
		w = Math.floor(Math.random() * 250) + 50;
		x = Math.floor(Math.random() * canvasWidth) - w/2;
		y = Math.floor(Math.random() * canvasHeight) - w/2;
		r = Math.floor(Math.random() * (w/4));
		s = Math.ceil(Math.random() * 10);
		rt = Math.floor(Math.random() * 360);

		makeSquare(x, y, w, w, r, s, rt);
	}
}

// PATTERN :: SPIRAL
function drawSpiral(iterations, rotationStep) {

	var s = SVG.get(svgSelected);

	// Gap between each shape
	var g = Math.floor(s.width() / iterations);

	// Origin of original shape
	var originX;
	var originY;

	// Rotation of original shape
	var r = s.transform().rotation;

	// Draw loop
	for (var i = 1; i <= iterations; i++) {

		// Origin of next iteration
		originX = s.x()+((g*i)/2);
		originY = s.y()+((g*i)/2);

		// Attributes of next iteration
		palette.strokeWidth = s.node.attributes[5].value;
		palette.radius = Math.floor(palette.radius - ((palette.radius / iterations) * (i-1)));
		palette.rotation = r+(rotationStep * i);

		// Draw next iteration
		makeRect(s.width()-(g*i),s.height()-(g*i),originX, originY);
	}

	// Reset palette state
	palette.rotation = 0;
	palette.radius = s.node.attributes.rx.value;
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

// Update and populte quad tool properties pane
function populateQuadToolProperties() {

	$("#pQuadX").val(palette.x);
	$("#pQuadY").val(palette.y);
	$("#pQuadWidth").val(palette.width);
	$("#pQuadHeight").val(palette.height);
	$("#pQuadRadius").val(palette.radius);
	$("#pQuadStrokeWidth").val(palette.strokeWidth);
	$("#pQuadRotation").val(palette.rotation);
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
					stroke: "#F00"
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
					stroke: palette.strokeColour
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
					});
				}

				console.log("CLICK: " + this.id());

				// This is now selected
				svgSelected = this.id();

				// Update properties pane
				populateHandToolProperties();

				// Add green border
				this.attr({
					stroke: "#0F0"
				});

			// If node is already selected...
			} else {

				// Unregister node
				svgSelected = null;
				this.attr({
					stroke: "#F00"
				});

				// Clear properties pane
				clearHandToolProperties();
			}
		}
	});
}