var ddActions = {}
$(document).ready(function(){
	
	setUpDragAndDrops();
	setTimeout(runDragAndDrop, 1000);

	$('.ddReset').on('click', function() {
		var dd = $(this).closest('.dragAndDrop')
		resetDragAndDrop(dd)
	});

	$('.ddCheck').on('click', function() {
		var dd = $(this).closest('.dragAndDrop')
		checkDragAndDrop(dd)
		dd.find('.ddUndo').addClass('hidden')
	});

	$('.ddUndo').on('click', function() {
		var dd = $(this).closest('.dragAndDrop')
		undoDdActions(dd)
	});

	$('.ddFeedback').on('click', function() {
		var dd = $(this).closest('.dragAndDrop')
		dd.find('.feedback').slideDown('fast')
		$(this).addClass('hidden')
	});

	$('.questionBox').hover(function() {
		$(this).find('.dragCaption').stop().fadeIn('fast')
	}, function() {
		$(this).find('.dragCaption').stop().fadeOut('fast')
	})

	$('.dragBox').hover(function() {
		$(this).find('.dragTitle').stop().fadeIn('fast')
		$(this).find('.dragHelp').stop().fadeIn('fast')
		$(this).find('.dragCaption').stop().fadeIn('fast')
	}, function() {
		$(this).find('.dragTitle').stop().fadeOut('fast')
		$(this).find('.dragHelp').stop().fadeOut('fast')
		$(this).find('.dragCaption').stop().fadeOut('fast')
	})

	$('.dragHelp').hover(function() {
		$(this).siblings('.dragMessage').stop().fadeIn('fast')
		$(this).siblings('img').stop().fadeOut('fast')
	}, function() {
		$(this).siblings('.dragMessage').stop().fadeOut('fast')
		$(this).siblings('img').stop().fadeIn('fast')
	})
});

function runDragAndDrop() {
	$('.dragContainer').each(function() {
		var thisDragHeight = $(this).css('height')
		$(this).css('height', thisDragHeight)
	})

	$('.dragBox').draggable({
	    revert: true  
	});

	$('.dropBox').droppable({
		drop: handleDropEvent,
	    over: function() {
	        $(this).addClass('hoverClass');
	    },
	    out: function() {
	        $(this).removeClass('hoverClass');
	    }
	});
}

function handleDropEvent(event,ui) {
	var thisDrag = ui.draggable
	var thisDrop = $(this)
	thisDrop.removeClass('hoverClass');
	var isCorrect = {
		drag : false,
		drop : false
	}
	
	disableDrag(thisDrag, thisDrop)
	disableDrop(thisDrop)
	// Check the dragBoxes outcome
	var dropID = thisDrop.attr('option');
	var dragID = thisDrag.attr('option').split(' ');
	

	for (var i = 0; i < dragID.length; i++) {
		if(dropID === dragID[i]) {
			isCorrect.drag = true
			isCorrect.drop = true
		}
	};

	if(isCorrect.drop) {
		thisDrop
			.attr('outcome', 'correct')
			.append('<img class="hidden outcome" src="images/tick.png" />');
	} else {
		thisDrop
			.attr('outcome', 'incorrect')
			.append('<img class="hidden outcome" src="images/cross.png" />');
	}
	if(isCorrect.drag) {
		thisDrag.attr('outcome', 'correct')
	} else {
		thisDrag.attr('outcome', 'incorrect')
	}
	
	var dd = thisDrop.closest('.dragAndDrop'),
		drops = dd.find('.dropBox').length,
		dropped = dd.find('.dropped').length;
	dd.find('.dropContainer').each(function() {
		if ($(this).attr('blanks')) {
			dropped += (+$(this).attr('blanks'));
		}
	});
	if (drops===dropped) {
		dd.find('.ddCheck').removeClass('hidden');
	} else {
		dd.find('.ddCheck').addClass('hidden');
	}

	dd.find('.ddUndo').removeClass('hidden')
	var actions = dd.attr('actions')
	eval('ddActions.'+actions+'.push({drop: $(this), drag: ui.draggable})')
	return
}

function standardDrop(thisDrag, thisDrop, ui, isCorrect) {
	disableDrag(thisDrag, thisDrop)
	disableDrop(thisDrop)
	// Check the dragBoxes outcome
	var dropID = thisDrop.attr('option');
	var dragID = thisDrag.attr('option').split(' ');
	

	for (var i = 0; i < dragID.length; i++) {
		if(dropID === dragID[i]) {
			isCorrect.drag = true
			isCorrect.drop = true
		}
	};
	return isCorrect
}

function disableDrag(thisDrag, thisDrop) {
	thisDrag.draggable('disable');
	thisDrag.position({of: thisDrop, my: 'center', at: 'center'});
	thisDrag.draggable('option', 'revert', false);
}

function enableDrag(thisDrag) {
	thisDrag.draggable('enable')
	thisDrag.removeAttr('outcome')
	thisDrag.draggable({revert: true});
	thisDrag.animate({
		'left': '0px',
		'top': '0px'
	});
}

function disableDrop(thisDrop) {
	thisDrop.droppable('disable')
	thisDrop.addClass('dropped')
}

function enableDrop(thisDrop) {
	thisDrop.removeClass('dropped');
	thisDrop.droppable('enable');
	thisDrop.removeAttr('outcome')
	thisDrop.find('.outcome').remove();
}

function resetDragAndDrop(dd) {
	// Find out if the drag and drop has been finished
	var dropInfo = {
		numberOfDrops : dd.find('.dropBox').length,
		numberCorrect : dd.find('.dropBox[outcome="correct"]').length,
		numberShowing : dd.find('.showing').length
	}

	var drops = {}
	if (dropInfo.numberShowing===dropInfo.numberOfDrops) {
		drops.showingAnswers = true
	}
	if (dropInfo.numberCorrect===dropInfo.numberOfDrops) {
		drops.allCorrect = true
	}

	if (!drops.showingAnswers||drops.allCorrect) {
		dd.find('.dropBox').each(function() {
			enableDrop($(this))
		})
		dd.find('.dragBox').each(function() {
			enableDrag($(this))
		})
	} else {
		dd.find('.dropBox').each(function() {
			if ($(this).attr('outcome')==='incorrect') {
				enableDrop($(this))
			}
		});
		dd.find('.dragBox').each(function() {
			if ($(this).attr('outcome')==='incorrect') {
				enableDrag($(this))
			}
		});
	}
	
	dd.find('.ddCheck').addClass('hidden');
	dd.find('.ddFeedback').addClass('hidden')
	dd.find('.feedback').slideUp('fast')

	var actions = dd.attr('actions')
	eval('ddActions.'+actions+' = []')
	dd.find('.ddUndo').addClass('hidden')
	return
}

function undoDdActions(dd) {
	var actions = dd.attr('actions')
	var ddAction = eval('ddActions.'+actions+'[ddActions.'+actions+'.length-1]')
	enableDrop(ddAction.drop)
	enableDrag(ddAction.drag)
	ddAction = eval('ddActions.'+actions+'.splice(ddActions.'+actions+'.length-1, 1)')

	dd.find('.ddCheck').addClass('hidden')
	if (eval('ddActions.'+actions+'.length')===0) {
		dd.find('.ddUndo').addClass('hidden')
	}
}

function checkDragAndDrop(dd) {
	dd.find('.outcome').removeClass('hidden').addClass('showing')
	dd.find('.ddFeedback').removeClass('hidden')
	dd.find('.ddCheck').addClass('hidden')
}

function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;								
}

function setUpDragAndDrops() {
	var	duplicateChecker = []
	$('.dragAndDrop').each(function(counter) {
		$(this).find('.dragContainer').each(function() {
			var dragBoxes = $(this).find('.dragBox')
			$(this).find('.dragBox').remove()
			shuffle(dragBoxes);
			for ( var i=0; i<dragBoxes.length; i++ ) {
				$(this).append(dragBoxes[i])
			}
		})
		$(this).attr('actions', 'dd'+counter)
		eval('ddActions.dd'+counter+' = []')
	});
	return
}