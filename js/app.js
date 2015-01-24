$(document).ready(function() {
	preloadImages();
	qualityDefined();
	imgListeners();
	navBarListeners();
});

function preloadImages() {
	cover = new Image(3552,1728)
	cover.src = "img/sunrise.jpg"
}

// Global variables
var enterSpeed = 200,
	exitSpeed = 100;

// Project image functions
function qualityDefined() {

	$('#quality').qtip({
	    content: {
	    	title: "Quality assurance - ISO 9000",
	        text: '"Part of quality management focused on providing confidence that quality requirements will be fulfilled"'
	    }, position: {
	        my: 'top center',
	        at: 'bottom center'
	    }, style: {
	        classes: 'qtip-bootstrap'
       }
	});
}

// Project image functions
function imgListeners() {

	// Fade image and show description
	$(".projectImg").on("mouseenter", function() {
		opacity(this, "img", enterSpeed, 0.3);
		downSlide(this, ".description", enterSpeed);
	});

	// Reset image and hide description
	$(".projectImg").on("mouseleave", function() {
		opacity(this, "img", exitSpeed, 1);
		upSlide(this, ".description", exitSpeed);
	});
}

// Nav bar functions
function navBarListeners() {
	$(".link").on("mouseenter", function() {
		highlightLink(this)
	});
	$(".link").on("mouseleave", function() {
		resetLink(this)
	});
	// Show contact links
	$("#contactDrop").on("mouseenter", function() {
		downSlide("#nav-bar", ".hidden", enterSpeed)
	});
	// Hide contact links
	$("#contactDrop").on("mouseleave", function() {
		upSlide("#nav-bar", ".hidden", exitSpeed)
	});

}

// General functions
function highlightLink(element) {
	$(element).css({
		"color": "#f0dbb0",
		"transform": "scale(1.1)",
		"transition": "all 0.2s ease-in"
	});
}

function resetLink(element) {
	$(element).css("color", "white");
	$(element).css("transform", "scale(1)");
}

function opacity (parent, child, speed, opacity) {
	$(parent).find(child).fadeTo(speed, opacity);
}

function downSlide(parent, child, speed) {
	$(parent).find(child).slideDown(speed);
}

function upSlide(parent, child, speed) {
	$(parent).find(child).slideUp(speed);
}

