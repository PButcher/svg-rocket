// Are we testing?
var testing = false;

// Initial dimensions of the drawing canvas
var canvasWidth = 550;
var canvasHeight = 400;

// Unique shape IDs
var quadID = 0;
var ellipseID = 0;
var polygonID = 0;

// Shape focussed/pressed/selected
var svgFocus = null;
var svgMousedown = null;
var svgSelected = null;

// Drawing state object
var paper;

// Holds the set of SVG elements in canvas
var currentStateSet;

// Drawing palette properties
var palette = {
	x: 0,
	y: 0,
	width: 100,
	height: 100,
	radius: 10,
	rotation: 0,
	opacity: 1,
	strokeWidth: 2,
	vertices: 5,
	stroke: '#000',
	strokeColour: "#000",
	fillColour: "#FFF",
	fillOpacity: "0",
	polyRadius1: 40,
	polyRadius2: 20
};

// User's chosen tool type
// 0 - none
// 1 - hand
// 2 - quad
// 3 - ellipse
// 4 - polystar
var toolType = 0;

// SVG URI Blob
var SVGBlob = null;

// When the document loads
$(document).ready(function (){

	// Remove welcome modal whilst testing
	if(testing) {
		$('#welcome-modal').remove();
	}

	// Set up welcome modal
	setupWelcomeModal();

	// Set up event listeners
	setupViewListeners();

	// Set up key bindings
	setupKeyBindings();

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

	// Import go button
	$("#btn-import-go").click(function() {
		importSVG($("#svg-import-field").val());
		$("#welcome-modal").fadeOut(500);
	});

	// Import pattern button
	$("#btn-import").click(function() {
		$("#btn-begin, #btn-import").hide();
		$("#svg-import-field").css("display", "inline-block");
		$("#btn-import-go").css("display", "inline-block");
	});

	// New pattern button
	$("#btn-ws-new").click(function() {
		$("#svg-import-field, #btn-import-go").hide();
		$("#btn-begin, #btn-import").show();
		$("#welcome-modal").fadeIn(500);
		resetCanvas();
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

		// Clear any selections
		if(svgSelected != null) {
			$("#" + SVG.get(svgSelected).id()).click().mouseout();
		}
		$("#ws-output").html($("#ws-canvas").html());
		$("#svg-export-field").val($("#ws-canvas").html());
		$("#svg-export-field").focus(function() {
			$(this).select();
		});
	});

	// Download button
	$("#btn-ws-download").click(function() {
		exportSVG();
	});

	// Delete workspace button
	$('#btn-ws-bin').click(function() {
		resetCanvas();
	});
}

// Set up key bindings
function setupKeyBindings() {

	// Delete key
	$(document).keyup(function(e) {
		if(e.keyCode == 46) $("#pShapeDelete").click();
	});	

	// Escape key
	$(document).keyup(function(e) {
		if(svgSelected != null) {
			if(e.keyCode == 27) $("#" + SVG.get(svgSelected).id()).click().mouseout();
		}
	});	
}

// Reset canvas
function resetCanvas() {
	paper.clear();
	clearHandToolProperties();
	quadID = 0;
	ellipseID = 0;
	polygonID = 0;
	currentStateSet.clear();
	svgSelected = null;
}

// Set up toolkit
function setupToolkit() {

	// The default tool is the help tool
	setTool(0);

	// Set initial canvas width and height input values
	$('#canvas-width').val(canvasWidth);
	$('#canvas-height').val(canvasHeight);

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
			$('#ws-canvas, #ws-output').css("width", canvasWidth);
			paper.size(canvasWidth, canvasHeight);
		}
	});

	// Canvas height input
	$('#canvas-height').change(function() {
		if(($('#canvas-height').val() > 0) && ($('#canvas-height').val() <= 1000)) {
			canvasHeight = $('#canvas-height').val();
			$('#ws-canvas, #ws-output').css("height", canvasHeight);
			paper.size(canvasWidth, canvasHeight);
		}
	});
}

// Setup properties
function setupProperties() {

	// Hand Tool Shape x coordinate
	$("#pShapeX").change(function() {
		switch(SVG.get(svgSelected).type) {
			case "rect":
				SVG.get(svgSelected).animate().attr({x:parseInt(this.value)});
				break;
			case "polygon":
				SVG.get(svgSelected).animate().x(parseInt(this.value));
				break;
			case "ellipse":
				SVG.get(svgSelected).animate().transform({x:parseInt(this.value)});
				break;
		}
		palette.x = parseInt(this.value);
	});

	// Hand Tool Shape y coordinate
	$("#pShapeY").change(function() {
		switch(SVG.get(svgSelected).type) {
			case "rect":
				SVG.get(svgSelected).animate().attr({y:parseInt(this.value)});
				break;
			case "polygon":
				SVG.get(svgSelected).animate().y(parseInt(this.value));
				break;
			case "ellipse":
				SVG.get(svgSelected).animate().transform({y:parseInt(this.value)});
				break;	
		}
		palette.y = parseInt(this.value);
	});

	// Hand Tool Shape width
	$("#pShapeWidth").change(function() {
		switch(SVG.get(svgSelected).type) {
			case "rect":
				SVG.get(svgSelected).animate().attr({width:parseInt(this.value)});
				break;
			case "polygon":
				SVG.get(svgSelected).width(parseInt(this.value));
				break;
			case "ellipse":
				SVG.get(svgSelected).width(parseInt(this.value));
				SVG.get(svgSelected).translate().x(0);
				break;	
		}
		palette.width = parseInt(this.value);
	});

	// Hand Tool Shape height
	$("#pShapeHeight").change(function() {
		switch(SVG.get(svgSelected).type) {
			case "rect":
				SVG.get(svgSelected).animate().attr({height:parseInt(this.value)});
				break;
			case "polygon":
				SVG.get(svgSelected).height(parseInt(this.value));
				break;
			case "ellipse":
				SVG.get(svgSelected).height(parseInt(this.value));
				SVG.get(svgSelected).translate().y(0);
				break;	
		}
		palette.height = parseInt(this.value);
	});

	// Hand Tool Shape radius
	$("#pShapeRadius").change(function() {
		SVG.get(svgSelected).animate().radius(parseInt(this.value));
		palette.radius = parseInt(this.value);
	});

	// Hand Tool Shape stroke width
	$("#pShapeStrokeWidth").change(function() {
		SVG.get(svgSelected).animate().attr({"stroke-width":parseInt(this.value)});
		palette.strokeWidth = parseInt(this.value);
	});

	// Hand Tool Shape rotation
	$("#pShapeRotation").change(function() {
		SVG.get(svgSelected).animate().transform({rotation:parseInt(this.value)});
		palette.rotation = parseInt(this.value);
	});

	// Hand Tool Shape copy
	$("#pShapeCopy").click(function() {

		switch(SVG.get(svgSelected).type) {

			case "rect":
				var rect2copy = SVG.get(svgSelected);
				palette.radius = rect2copy.node.attributes.rx.value;
				palette.strokeWidth = rect2copy.attr("stroke-width");
				palette.rotation = rect2copy.transform().rotation;
				makeRect(rect2copy.width(), rect2copy.height(), rect2copy.x()+10, rect2copy.y()+10);
				break;

			case "ellipse":
				var ellipse2copy = SVG.get(svgSelected);
				palette.strokeWidth = ellipse2copy.attr("stroke-width");
				palette.width = ellipse2copy.width();
				palette.height = ellipse2copy.height();
				makeEllipse(ellipse2copy.transform().x+10, ellipse2copy.transform().y+10);
				break;

			case "polygon":
				var polygon2copy = SVG.get(svgSelected);
				palette.strokeWidth = polygon2copy.attr("stroke-width");
				palette.width = polygon2copy.width();
				palette.height = polygon2copy.height();
				palette.x = polygon2copy.x()+polygon2copy.width()/2+10;
				palette.y = polygon2copy.y()+polygon2copy.height()/2+10;
				makePoly(1);
				break;
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
		switch(SVG.get(svgSelected).type) {
			case "rect":
				drawSpiral(5, 10);
				break;
			case "ellipse":
				drawScope(5);
				break;
			case "polygon":
				drawSpectacle();
				break;
		}
	});

	// Other Tools
	// Tool shape x coordinate
	$("#pQuadX, #pEllipseX, #pPolyX").change(function() {
		palette.x = parseInt(this.value);
	});

	// Tool shape y coordinate
	$("#pQuadY, #pEllipseY, #pPolyY").change(function() {
		palette.y = parseInt(this.value);
	});

	// Tool shape width
	$("#pQuadWidth, #pEllipseWidth").change(function() {
		palette.width = parseInt(this.value);
	});

	// Tool shape height
	$("#pQuadHeight, #pEllipseHeight").change(function() {
		palette.height = parseInt(this.value);
	});

	// Quad Tool Shape radius
	$("#pQuadRadius").change(function() {
		palette.radius = parseInt(this.value);
	});

	// Poly tool outer radius
	$("#pPolyRadius1").change(function() {
		palette.polyRadius1 = parseInt(this.value);
	});

	// Poly tool inner radius
	$("#pPolyRadius2").change(function() {
		palette.polyRadius2 = parseInt(this.value);
	});

	// Poly tool vertices
	$("#pPolyVertices").change(function() {
		palette.vertices = parseInt(this.value);
	});

	// Tool shape stroke width
	$("#pQuadStrokeWidth, #pEllipseStrokeWidth, #pPolyStrokeWidth").change(function() {
		palette.strokeWidth = parseInt(this.value);
	});

	// Tool shape rotation
	$("#pQuadRotation, #pPolyRotation").change(function() {
		palette.rotation = parseInt(this.value);
	});

	// Quad Add Tool
	$("#pQuadAdd").click(function() {
		makeRect(palette.width, palette.height, palette.x, palette.y);
	});

	// Quad Random Tool
	$("#pQuadRandom").click(function() {
		makeRandomSquare(1);
	});

	// Ellipse Add Tool
	$("#pEllipseAdd").click(function() {
		makeEllipse(palette.x, palette.y);
	});

	// Ellipse Random Tool
	$("#pEllipseRandom").click(function() {
		makeRandomEllipse(1);
	});

	// Poly Add Tool
	$("#pPolyAdd").click(function() {
		if(palette.polyRadius1 == 0 || palette.polyRadius2 == 0) {
			makePoly();
		} else {
			makePoly(1);
		}
	});

	// Poly Random Tool
	$("#pPolyRandom").click(function() {
		makeRandomPoly(1);
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
			populateEllipseToolProperties();
			break;
		case 4:
			$("#toolkit-star").addClass("toolkit-active");
			$('#properties-star').show();
			populatePolystarToolProperties();
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
	paper = SVG("ws-canvas").size(canvasWidth, canvasHeight).id("svg-rocket");

	// Holds SVG set that's being used at the moment
	currentStateSet = paper.set();

	// Draw stuff!
	draw();
}

// Set up canvas plotting
function setupCanvasPlotting() {

	// Call main plotting function with cursor coordinates
	$('#ws-canvas').click(function() {
		if(testing) {
			console.log("CLICK: canvas");
		}
		var cXPos = event.clientX - $("#ws-canvas").offset().left - $('#ws-canvas-toolkit').width();
		var cYPos = event.clientY - $("#ws-canvas").offset().top;

		plot(cXPos, cYPos);
	});
}

// Canvas plotting
function plot(cXPos, cYPos) {

	// Decide what to plot
	switch(toolType) {

		// Plot quad
		case 2:
			if(testing) {
				console.log("DRAW: rect");
				console.log(cXPos + " : " + cYPos);
			}
			makeRect(palette.width, palette.height, cXPos-(palette.width/2), cYPos-(palette.height/2));
			break;

		// Plot ellipse
		case 3:
			if(testing) {
				console.log("DRAW: ellipse");
				console.log(cXPos + " : " + cYPos);
			}
			makeEllipse(cXPos-(palette.width/2), cYPos-(palette.height/2));
			break;

		// Plot poly
		case 4:
			if(testing) {
				console.log("DRAW: poly");
				console.log(cXPos + " : " + cYPos);
			}
			if(palette.polyRadius1 == 0 || palette.polyRadius2 == 0) {
				palette.x = cXPos;
				palette.y = cYPos;
				makePoly();
			} else {
				palette.x = cXPos;
				palette.y = cYPos;
				makePoly(1);
			}
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

// Draw an ellipse
function makeEllipse(x, y) {

	ellipseID = ++ellipseID;

	var ellipse = paper.ellipse(palette.width, palette.height).id("ellipse-" + ellipseID).attr({
		fill: "#FFF",
		"fill-opacity": "0",
		opacity: 1,
		stroke: "#000",
		"stroke-width": palette.strokeWidth
	}).transform({
		x: x,
		y: y
	});

	// Events
	svgNodeInteractions(ellipse);

	// Add ellipse to set
	currentStateSet.add(ellipse);
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

// SHAPE :: MAKE RANDOM ELLIPSE
function makeRandomEllipse(n) {

	for (var i = 0; i < n; i++) {
		palette.width = Math.floor(Math.random() * 250) + 50;
		palette.height = palette.width;
		palette.x = Math.floor(Math.random() * canvasWidth) - palette.width/2;
		palette.y = Math.floor(Math.random() * canvasHeight) - palette.width/2;
		palette.strokeWidth = Math.ceil(Math.random() * 10);

		makeEllipse(palette.x, palette.y);
	}
}

// SHAPE :: POLYGON
function makePoly(polystar, w, h) {

	polygonID = ++polygonID;

	// Point arrays
	var xPoints1 = [];
	var xPoints2 = [];
	var yPoints1 = [];
	var yPoints2 = [];

	// Polygon points string
	var polygonString = "";

	// Get polygon vertex coordinates
	for(var i = 0; i < palette.vertices; i++) {

		xPoints1.push((palette.x + ((palette.polyRadius1) * Math.cos(i * 2 * Math.PI / palette.vertices))));
		yPoints1.push((palette.y + ((palette.polyRadius1) * Math.sin(i * 2 * Math.PI / palette.vertices))));

		if(polystar == 1) {

			xPoints2.push((palette.x + ((palette.polyRadius2) * Math.cos((i * 2 * Math.PI / palette.vertices) + Math.PI / palette.vertices))));
			yPoints2.push((palette.y + ((palette.polyRadius2) * Math.sin((i * 2 * Math.PI / palette.vertices) + Math.PI / palette.vertices))));

			// Add next coordinates to the polygon string
			polygonString = polygonString + xPoints1[i] + "," + yPoints1[i] + " " + xPoints2[i] + "," + yPoints2[i] + " ";

		} else {

			// Add next coordinates to the polygon string
			polygonString = polygonString + xPoints1[i] + "," + yPoints1[i] + " ";
		}
	}

	// Draw polygon
	var poly = paper.polygon(polygonString).id("polygon-" + polygonID).attr({
		fill: palette.fillColour,
		stroke: palette.strokeColour,
		"stroke-width": palette.strokeWidth,
		x: palette.x,
		y: palette.y,
		"fill-opacity": palette.fillOpacity,
		opacity: palette.opacity
	}).transform({
		rotation: palette.rotation
	});

	if(w != undefined) {
		poly.width(w);
		poly.height(h);
		poly.transform({cx: palette.x, cy: palette.y})
	}

	// Events
	svgNodeInteractions(poly);

	// Add ellipse to set
	currentStateSet.add(poly);
}

// SHAPE :: MAKE RANDOM POLY
function makeRandomPoly(n) {

	var p;

	for(var i = 0; i < n; i++) {
		palette.polyRadius1 = Math.floor(Math.random() * 50) + 50;
		palette.polyRadius2 = Math.floor(Math.random() * 50);
		palette.x = Math.floor(Math.random() * canvasWidth) - palette.polyRadius2/2;
		palette.y = Math.floor(Math.random() * canvasHeight) - palette.polyRadius2/2;
		palette.vertices = Math.floor(Math.random() * 10)+3;
		palette.strokeWidth = Math.ceil(Math.random() * 10);
		palette.rotation = Math.floor(Math.random() * 360);
		p = Math.round(Math.random());

		makePoly(p);
	}	
}

// PATTERN :: SPIRAL
function drawSpiral(iterations, rotationStep) {

	var s = SVG.get(svgSelected);

	// Gap between each shape
	var g = Math.floor(s.width() / iterations);

	// Origin of original shape
	var originX, originY;

	// Rotation of original shape
	var r = s.transform().rotation;

	// Draw loop
	for (var i = 1; i <= iterations; i++) {

		// Origin of next iteration
		originX = s.x()+((g*i)/2);
		originY = s.y()+((g*i)/2);

		// Attributes of next iteration
		palette.strokeWidth = s.attr("stroke-width");
		palette.radius = Math.floor(palette.radius - ((palette.radius / iterations) * (i-1)));
		palette.rotation = r+(rotationStep * i);

		// Draw next iteration
		makeRect(s.width()-(g*i),s.height()-(g*i),originX, originY);
	}

	// Reset palette state
	palette.rotation = 0;
	palette.radius = s.node.attributes.rx.value;
	palette.strokeWidth = s.attr("stroke-width");
}

// PATTERN :: SCOPE
function drawScope(iterations) {
	var s = SVG.get(svgSelected);
	var g = Math.floor(s.width() / iterations);
	var originX, originY;
	for (var i = 1; i <= iterations; i++) {
		palette.width = s.width()-(g*i);
		palette.height = s.height()-(g*i);
		originX = s.transform().x+((g*i)/2);
		originY = s.transform().y+((g*i)/2);
		palette.strokeWidth = s.attr("stroke-width");
		makeEllipse(originX, originY);
	}

	palette.width = s.width();
	palette.height = s.height();
	palette.x = 0;
	palette.y = 0;
}

// PATTERN :: SPECTACLE
function drawSpectacle() {

	palette.x = SVG.get(svgSelected).x();
	palette.y = SVG.get(svgSelected).y();
	palette.vertices = 5;
	palette.fillOpacity = 1;

	for (var i = 0; i < (25); i++) {
		palette.rotation = i * 10;
		palette.width -= 2;
		palette.height -= 2;
		makePoly(1, palette.width, palette.height);
	}

	palette.fillOpacity = 0;
}

var store;

// IMPORT SVG
function importSVG(importedSVG) {

	store = paper.svg(importedSVG);

	for (var i = 0; i < store.roots()[0].children().length; i++) {

		var nextShape = SVG.get(store.roots()[0].children()[i].id());
		
		svgNodeInteractions(nextShape);

		currentStateSet.add(nextShape);
	}
}

// EXPORT SVG
function exportSVG() {

	// Clear any selections
	if(svgSelected != null) {
		$("#" + SVG.get(svgSelected).id()).click().mouseout();
	}

	// Encode SVG as URI Blob
	var data = new Blob([$("#ws-canvas").html()], {type: 'image/svg+xml'});

	// Revoke any previous blobs
	if(SVGBlob !== null) {
		window.URL.revokeObjectURL(SVGBlob);
	}

	// Attach blob
	SVGBlob = window.URL.createObjectURL(data);

	// Add SVG data to download button
	$("#btn-ws-download").attr("download", "svg-rocket.svg");
	$("#btn-ws-download").attr("href", SVGBlob);
}

// Update and populate hand tool properties pane
function populateHandToolProperties() {

	if(svgSelected != null) {

		$("#properties-hand-pane").show();

		switch(SVG.get(svgSelected).type) {

			// Hand tool for quads
			case "rect":
				$("#pShapeID").show().html('<i class="fa fa-square-o"></i>' + svgSelected);
				$("#pShapeX").show().val(parseInt(SVG.get(svgSelected).x()));
				$("#pShapeY").show().val(parseInt(SVG.get(svgSelected).y()));
				$("#pShapeWidth").show().val(parseInt(SVG.get(svgSelected).width()));
				$("#pShapeHeight").show().val(parseInt(SVG.get(svgSelected).height()));
				$("#pShapeRadius").show().val(parseInt(SVG.get(svgSelected).node.attributes.rx.value));
				$("#pShapeStrokeWidth").show().val(SVG.get(svgSelected).attr("stroke-width"));
				$("#pShapeRotation").show().val(SVG.get(svgSelected).transform().rotation);
				break;
			
			// Hand tool for ellipses
			case "ellipse":
				$("#pShapeID").show().html('<i class="fa fa-circle-o"></i>' + svgSelected);
				$("#pShapeX").show().val(parseInt(SVG.get(svgSelected).transform().x));
				$("#pShapeY").show().val(parseInt(SVG.get(svgSelected).transform().y));
				$("#pShapeWidth").show().val(parseInt(SVG.get(svgSelected).width()));
				$("#pShapeHeight").show().val(parseInt(SVG.get(svgSelected).height()));
				$("#pShapeRadius").show().val("-");
				$("#pShapeStrokeWidth").show().val(SVG.get(svgSelected).attr("stroke-width"));
				$("#pShapeRotation").show().val("-");
				break;

			// Hand tool for polygon
			case "polygon":
				$("#pShapeID").show().html('<i class="fa fa-star-o"></i>' + svgSelected);
				$("#pShapeX").show().val(parseInt(SVG.get(svgSelected).x()));
				$("#pShapeY").show().val(parseInt(SVG.get(svgSelected).y()));
				$("#pShapeWidth").show().val(parseInt(SVG.get(svgSelected).width()));
				$("#pShapeHeight").show().val(parseInt(SVG.get(svgSelected).height()));
				$("#pShapeRadius").show().val("-");		
				$("#pShapeStrokeWidth").show().val(SVG.get(svgSelected).attr("stroke-width"));
				$("#pShapeRotation").show().val(SVG.get(svgSelected).transform().rotation);
				break;
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

// Update and populate ellipse tool properties pane
function populateEllipseToolProperties() {
	$("#pEllipseX").val(palette.x);
	$("#pEllipseY").val(palette.y);
	$("#pEllipseWidth").val(palette.width);
	$("#pEllipseHeight").val(palette.height);
	$("#pEllipseStrokeWidth").val(palette.strokeWidth);
}

// Update and populate polystar tool properties pane
function populatePolystarToolProperties() {
	$("#pPolyX").val(palette.x);
	$("#pPolyY").val(palette.y);
	$("#pPolyRadius1").val(palette.polyRadius1);
	$("#pPolyRadius2").val(palette.polyRadius2);
	$("#pPolyVertices").val(palette.vertices);
	$("#pPolyStrokeWidth").val(palette.strokeWidth);
	$("#pPolyRotation").val(palette.rotation);
}

// Mouse interactions with nodes
function svgNodeInteractions(node) {

	// Mouseover event
	node.mouseover(function() {

		// Only register a mouseover event when using hand tool
		if(toolType == 1) {
			if(testing) {
				console.log("MOUSEOVER: " + this.id());
			}
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
			if(testing) {
				console.log("MOUSEOUT: " + this.id());
			}
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
			if(testing) {
				console.log("MOUSEDOWN: " + this.id());
			}
			$("#ws-canvas").css("cursor", "move");

			// Mouse is down on this element
			svgMousedown = this.id();
		}

	// Mouseup event
	}).mouseup(function() {
		
		// Only register a mouseup event when using hand tool
		if(toolType == 1) {
			if(testing) {
				console.log("MOUSEUP: " + this.id());
			}
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
				if(SVG.get(svgMousedown).type == "ellipse") {
					SVG.get(svgMousedown).transform({
						x: (event.clientX - $("#ws-canvas").offset().left - $('#ws-canvas-toolkit').width() - (this.width() / 2)), 
						y: (event.clientY - $("#ws-canvas").offset().top  - (this.height() / 2))
					});
				} else if(SVG.get(svgMousedown).type == "polygon") {
					SVG.get(svgMousedown).x((event.clientX - $("#ws-canvas").offset().left - $('#ws-canvas-toolkit').width() - (this.width() / 2))); 
					SVG.get(svgMousedown).y((event.clientY - $("#ws-canvas").offset().top  - (this.height() / 2)));
				} else {
					SVG.get(svgMousedown).attr({
						x: (event.clientX - $("#ws-canvas").offset().left - $('#ws-canvas-toolkit').width() - (this.width() / 2)), 
						y: (event.clientY - $("#ws-canvas").offset().top  - (this.height() / 2))
					});
				}

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
				if(testing) {
					console.log("CLICK: " + this.id());
				}

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