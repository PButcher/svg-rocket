var canvasWidth = 550;
var canvasHeight = 400;
var showSplash = false;

$(document).ready(function() {

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
	paper.add([
    {
        type: "circle",
        cx: 50,
        cy: 50,
        r: 50,
        fill: "#FF0000"
    },
    {
        type: "rect",
        x: 50,
        y: 50,
        width: 50,
        height: 50,
        fill: "#fc0"
    }
	]);
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

	// Canvas width
	$('#canvas-width').change(function() {
		if(($('#canvas-width').val() > 0) && ($('#canvas-width').val() < 1000)) {
			canvasWidth = $('#canvas-width').val();
			$('#ws-canvas').css("width", canvasWidth);
		}
	});

	// Canvas height
	$('#canvas-height').change(function() {
		if(($('#canvas-height').val() > 0) && ($('#canvas-height').val() < 1000)) {
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