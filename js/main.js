var canvasWidth = 550;
var canvasHeight = 400;
var showSplash = false;

$(document).ready(function (){

	// Remove welcome modal whilst testing
	if(!showSplash) {
		$('#welcome-modal').remove();
	}

	// Set initial element sizes based on current viewport
	resize();

	// Set up welcome modal
	setupWelcomeModal();

	// Set up event listeners
	setupEventListeners();

	// Set up workspace-canvas
	setupWorkspaceCanvas();

	// Set up toolkit
	setupToolkit();
});


// When the window resizes
$(window).resize(function() {

	// Set initial element sizes based on current viewport
	resize();
});

// Set initial element sizes based on current viewport
function resize() {

	$('#welcome-modal').css("height", $(window).height());
	$('.workspace-canvas, .workspace-output').css("height", ($(window).innerHeight() - $('header').height()));
	$('.ws-canvas-toolkit, .ws-canvas-wrapper').css("height", ($(window).innerHeight() - $('header').height()));
}

// Set up welcome modal
function setupWelcomeModal() {

	// Fade out welcome modal when begin button is clicked
	$('#btn-begin').click(function() {	
		$('#welcome-modal').fadeOut(500);
	});
}

// Set up workspace-canvas
function setupWorkspaceCanvas() {
	var paper = Raphael("ws-canvas", canvasWidth, canvasHeight);
	var exampleSketch, exampleSketch2 = [
	{
		type: "circle",
		cx: 50,
		cy: 50,
		r: 50,
		fill: "#FF0000",
		"stroke-width": 0,
		stroke: "#000"
	},
	{
		type: "rect",
		x: 50,
		y: 50,
		width: 50,
		height: 50,
		fill: "#FF0000",
		"stroke-width": 0,
		stroke: "#000"
	},
	{
		type: "rect",
		x: 50,
		y: 50,
		width: 25,
		height: 25,
		fill: "#FFF",
		"stroke-width": 0
	},
	{
		type: "circle",
		cx: 50,
		cy: 50,
		r: 25,
		fill: "#FFF",
		"stroke-width": 0
	}
	// {
	// 	type: "text",
	// 	x: 150,
	// 	y: 100,
	// 	text: "Some Text",
	// 	fill: "#000"
	// }
	];

	var r1 = paper.rect(100,100,200,10,5).attr({fill:'white'});
	var r2 = paper.rect(50,200,100,15,5).attr({fill:'white'});
	var r3 = paper.rect(200,100,200,10,5).attr({fill:'white'});
	var r4 = paper.rect(150,200,100,15,5).attr({fill:'white'});

	var shape = paper.set(r1, r2);
	var shape2 = paper.set(r3, r4);

	var l_coords = shape.getBBox().x,
		r_coords = shape.getBBox().x2,
		t_coords = shape.getBBox().y,
		b_coords = shape.getBBox().y2;

	var l2_coords = shape2.getBBox().x,
		r2_coords = shape2.getBBox().x2,
		t2_coords = shape2.getBBox().y,
		b2_coords = shape2.getBBox().y2;

	var cx = (l_coords + r_coords) / 2,
		cy = (t_coords + b_coords) / 2;

	var cx2 = (l_coords + r_coords) / 2,
		cy2 = (t_coords + b_coords) / 2;

	shape.rotate(45, cx, cy);
	shape2.rotate(45, cx2, cy2);


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