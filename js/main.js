$(document).ready(function() {

	// Set initial element sizes based on current viewport
	resize();

	// Set up welcome modal
	setupWelcomeModal();

	// Set up app windows
	setupApp();
});


// When the window resizes
$(window).resize(function() {

	// Set initial element sizes based on current viewport
	resize();
});

// Set initial element sizes based on current viewport
function resize() {

	$('#welcome-modal').css("height", $(window).height());
	$('.workspace-canvas').css("height", ($(window).innerHeight() - $('header').height()));
}

// Set up welcome modal
function setupWelcomeModal() {

	// Fade out welcome modal when begin button is clicked
	$('#btn-begin').click(function() {	
		$('#welcome-modal').fadeOut(500);
	});
}

// Set up app windows
function setupApp() {

	// Canvas workspace button
	$('#btn-ws-canvas').click(function() {
		pageTransition("canvas");
	});

	// Output workspace button
	$('#btn-ws-output').click(function() {
		pageTransition("output");
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
			$('#workspace-output').hide();
			$('#workspace-canvas').show();
			break;

		// Show output page
		case "output":
			$('#btn-ws-output').addClass("active");
			$('#btn-ws-canvas').removeClass("active");
			$('#workspace-output').show();
			$('#workspace-canvas').hide();
			break;

		// Do nothing
		default:
			break;
	}
}