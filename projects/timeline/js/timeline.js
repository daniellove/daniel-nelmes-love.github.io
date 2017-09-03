$(document).ready(function(){

	/* -------------------------------------------------------------------------------*/

	/* This is the variable that lets you deicde when the timeline will start moving*/
	/* While it's set to '2' that means after 2 clicks, the 3rd click will cause the
	timeline to shift across*/

	var startNum = 2; 

	/* -------------------------------------------------------------------------------*/


	var totalslides = $('.milestone').length; 
	var indexslides = $('.milestone').length - 1;
	var slidenum = 0;
	var slidenext = 0;
	var stopNum = totalslides - startNum;


	/* -------------------------------------------------------------------------------*/

	/* The (.milestone width) & (.milestone margin-right) should be the only properties
	you manipulate in the CSS to alter the timeline points for the code to keep working
	correctly */

	/* This is because the below code adds these values together and multiplies it by
	how many .milestone elements it picks up, and then this becomes the width of the
	timeline container */

	var milestoneWidth = parseInt($('.milestone').css('width')) + parseInt($('.milestone').css('margin-right'));
	var totalWidth = 10 + (milestoneWidth * totalslides);
	$("#timeline-scrolling-container").css('width', totalWidth);

	/* -------------------------------------------------------------------------------*/


	$(function () {

	    var $content = $('.milestone-content');
	    var $timelineCircle = $('.timeline-circle');
	    var $milestone = $('.milestone');

	    $content.hide().eq(0).show();
	    $milestone.eq(0).removeClass('inactive-milestone').addClass('active-milestone');

	    $('#next-arrow').click(function(event) {

	    	event.preventDefault();

	    	if(slidenum==indexslides) { 
			    return; //stop the execution of function
			}

	    	slidenext = slidenum + 1;

	    	$content.eq(slidenum).stop(true, false);
	    	$content.eq(slidenext).stop(true, false);

	    	$('#timeline-scrolling-container').stop(true, true);


	        $content.eq(slidenum).fadeOut(600);
	        $content.eq(slidenext).delay(600).stop(true, true).fadeIn(600);

	        $('.active-milestone').removeClass('active-milestone').addClass('inactive-milestone');
	        $milestone.eq(slidenext).removeClass('inactive-milestone').addClass('active-milestone');

	        slidenum++;

			if(slidenum<=startNum || slidenum>=stopNum) { 
			    return; //stop the execution of function
			}
	        	
	        $( "#timeline-scrolling-container" ).animate({
                left: "-=" + milestoneWidth
              }, 400)

	    });

	    $('#previous-arrow').click(function(event) {

	    	event.preventDefault();

	    	if(slidenum==0) { 
			    return; //stop the execution of function
			}

			previousnum = slidenum;
	        slideback = slidenum - 1;
	        
	        if(slideback == -1) slideback = totalslides - 1;

	        $content.eq(slidenum).stop(true, false);
	        $content.eq(slideback).stop(true, false);

	        $('#timeline-scrolling-container').stop(true, true);

	        $content.eq(slidenum).fadeOut(600);
	        $content.eq(slideback).delay(600).stop(true, true).fadeIn(600);

	        $('.active-milestone').removeClass('active-milestone').addClass('inactive-milestone');
	        $milestone.eq(slideback).removeClass('inactive-milestone').addClass('active-milestone');

	        slidenum = slidenum - 1;	       

	        if(previousnum>=stopNum || slidenum<startNum) { 
			    return; //stop the execution of function
			}

	        $( "#timeline-scrolling-container" ).animate({
                left: "+=" + milestoneWidth
              }, 400)

	    });


		$('.milestone').click(function(event) {

			var currentMilestone = $(".milestone").index($(this));

			if(slidenum == currentMilestone) {

				return;

			} else if(currentMilestone < stopNum && currentMilestone <= startNum) {

					if(parseInt($('#timeline-scrolling-container').css('left')) != 0) {
						$( "#timeline-scrolling-container" ).animate({
		                left: 0
		              	}, 400)
					}

			} else if(currentMilestone > startNum && currentMilestone >= stopNum){

					var finalLeftValue = -Math.abs(milestoneWidth * (indexslides - (startNum * 2)));

					if(parseInt($('#timeline-scrolling-container').css('left')) != finalLeftValue) {
						$( "#timeline-scrolling-container" ).animate({
		                left: finalLeftValue
		              	}, 400)
					}

			} else if (currentMilestone > slidenum) {

					var milestoneDif = currentMilestone - startNum;
					var milestoneLeft = -Math.abs(milestoneDif * milestoneWidth);

					var finalLeft = milestoneLeft - parseInt($('#timeline-scrolling-container').css('left'));

					$( "#timeline-scrolling-container" ).animate({
	                left: "+=" + finalLeft
	              }, 400)
				
			} else if(currentMilestone < slidenum) {

					var milestoneDif = currentMilestone - startNum;
					var milestoneRight = Math.abs(milestoneDif * milestoneWidth);
					var finalRight = Math.abs(parseInt($('#timeline-scrolling-container').css('left'))) - milestoneRight;

					$( "#timeline-scrolling-container" ).animate({
	                left: "+=" + finalRight
	              }, 400)

			}

			$content.eq(slidenum).stop(true, false);
			$content.eq(currentMilestone).stop(true, false);

			$content.eq(slidenum).fadeOut(600);
	        $content.eq(currentMilestone).delay(600).stop(true, true).fadeIn(600);

			slidenum = currentMilestone;

			$('.active-milestone').removeClass('active-milestone').addClass('inactive-milestone');
	        $milestone.eq(slidenum).removeClass('inactive-milestone').addClass('active-milestone');

	    });

	});

}); //closes the document.ready
