var scrollSpeed = 800
var fadeSpeed = 400

function aboutMe() {
	var toAboutMe = $('#mastHead').outerHeight(true)
	$('html, body').animate({scrollTop: toAboutMe}, scrollSpeed);
}

function openProjects() {
	$('#projects').fadeIn(fadeSpeed)
	$('body').css('overflow', 'hidden')
}

function closeProjects() {
	$('#projects').fadeOut(fadeSpeed)
	$('body').css('overflow', 'initial')
}

$(document).ready(function() {
	$('body').append('\
		<div class="loading">\
			<div>\
				<img src="img/gears.gif">\
				<p>Loading<br>Please wait</p>\
			</div>\
		</div>\
	')
})

$(window).on('load', function() {

	$('.loading').remove()
	$('body').css('overflow', 'initial')

	setUpProjects()

	$('.project').hover(function() {
		$(this).find('.caption').stop().animate({
			'top': 0
		}, fadeSpeed)
	}, function() {
		$(this).find('.caption').stop().animate({
			'top': '100%'
		}, fadeSpeed)
	})

	$('.overlay').on('click', function() {
		closeProjects()
	})
})

function setUpProjects() {

	setTimeout(function() {
		$('#projects').css({
			'display': 'none',
			'opacity': 'initial'
		})
	}, 100)

	var containerHeight = $('#projects .container').outerHeight(true)
	var headerHeight = $('#projects .header').outerHeight(true)
	var projectSpace = $('#projects .viewer').outerHeight(true)
		projectHeight = projectSpace - $('#projects .viewer').outerHeight(false)
	$('#projects .viewer').css('height', containerHeight-(headerHeight+projectHeight))
	$('.project').each(function() {
		var imageHeight = $(this).find('img').outerHeight(true)
		$(this).css('height', imageHeight)
	})
	
}