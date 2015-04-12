var canvasWidth = 550;
var canvasHeight = 400;
var testing = true;
var svgFocus = null;
var svgMousedown = null;

// Drawing state object
var paper;
var palette = {
	fillColour: "none",
	opacity: "0.1",
	strokeColour: "none",
	strokeWidth: 1,
	radius: 0,
};
var currentStateSet;

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

	// Canvas width input
	$('#canvas-width').change(function() {
		if(($('#canvas-width').val() > 0) && ($('#canvas-width').val() <= 1000)) {
			canvasWidth = $('#canvas-width').val();
			$('#ws-canvas').css("width", canvasWidth);
			draw();
		}
	});

	// Canvas height input
	$('#canvas-height').change(function() {
		if(($('#canvas-height').val() > 0) && ($('#canvas-height').val() <= 1000)) {
			canvasHeight = $('#canvas-height').val();
			$('#ws-canvas').css("height", canvasHeight);
			paper.clear();
			paper.clear();
			draw();
		}
	});
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

	// Random squares
	makeRandomSquares();
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
		console.log("MOUSEOVER: " + this.id());
		this.attr({
			stroke: "#F00",
			"stroke-width": 2
		});
		svgFocus = this.id();
	}).mouseout(function () {
		console.log("MOUSEOUT: " + this.id());
		this.attr({
			stroke: "none",
			"stroke-width": 0
		});
		svgFocus = null;
		svgMousedown = null;
	}).mousedown(function () {
		console.log("MOUSEDOWN: " + this.id());
		svgMousedown = this.id();
	}).mouseup(function() {
		console.log("MOUSEUP: " + this.id());
		svgMousedown = null;
	}).mousemove(function() {
		if(svgMousedown != null) {
			this.front();
			SVG.get(svgMousedown).attr({
				x: (event.clientX - $("#ws-canvas").offset().left - $('#ws-canvas-toolkit').width() - (this.width() / 2)), 
				y: (event.clientY - $("#ws-canvas").offset().top  - (this.height() / 2))
			});
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