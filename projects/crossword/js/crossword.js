$(document).ready(function() {

	CW1_matrix = [
		'............a...',
		'a.........a.a...',
		'a.a.......a.a..a',
		'a.a.....a.a.a..a',
		'a.a.aaaaaaaaaaaa',
		'a.a.....a.a.a..a',
		'aaaaaaaaa.a.a...',
		'a.a.a...a.a.a...',
		'a...a...a.a.....',
		'....a...a.a.....',
		'....a...a.a.....',
		'....a...a.......',
		'....a.aaaaaaa...',
		'....a...a.......',
	]
	CW1_hints = {
		across: [
			[7, "Cool clue is cool"],
			[8, "Another clue for the quiz"],
			[10, "Last across clue"]
		],
		down: [
			[1, "Great day to make a crossword but don't forget it should be tabbed if it runs over multiple lines"],
			[2, "I should use lorem"],
			[3, "Not sure why I haven't"],
			[4, "It's a bit too late now"],
			[5, "Nearly there, promise"],
			[6, "Penultimate clue"],
			[9, "And we're done with this"]
		]
	}

	CW1_setUpCrossWord()
	CW1_runCrossword()
})

function CW1_runCrossword() {
	var selection
	var selectedCell
	$('#CW1 .inputCell').on('click', function(e) {
			var thisThing = $(this)
			var selectedInfo = CW1_getSelections(thisThing)
			selection = selectedInfo.selection
			selectedCell = selectedInfo.selectedCell
			return
	})

	$('#CW1 .crosswordContainer').on('keypress', function(event) {
		if (selectedCell<$(selection).length) {
			for (var i = selectedCell+1; i <= $(selection).length; i++) {
				var tempVar = $($(selection)[i]).children('input').val()
				if (!tempVar) {
					$($(selection)[i]).children('input').focus()
					selectedCell=i
					i=$(selection).length
				};
			};
		};
		return
	})

	$('#CW1 .crosswordContainer').on('keyup', function(event) {
		var keycode = event.which
		if (keycode==8) {
			if (selectedCell>0) {
				for (var i = $(selection).length-1; i >= 0; i--) {
					var tempVar = $($(selection)[i]).children('input')
					if (!tempVar.prop('disabled')&&tempVar.val()!='') {
						$($(selection)[i]).children('input')
							.focus()
							.val('')
						selectedCell = i
						i = -1
					};
				};

			}
		}
		if(selectedCell===$(selection).length) {
			CW1_checkAnswers(selection)
		}
		return
	})
}

function CW1_checkAnswers(selection) {
	var correctLetters = 0
	var wordLength = $('.selectedCell').length/2
	var selection = selection.replace('.','#')
	$('.selectedCell').each(function() {
		if (!$(this).hasClass('inputCell')) {
			var thisAnswer = $(this).attr('cell')
			var thisValue = $(this).val().toUpperCase()
			$(this).prop('disabled', true)

			if (thisAnswer===thisValue) {
				$(this).parent().attr('outcome', 'correct')
				correctLetters++
			} else {
				$(this).parent().attr('outcome', 'incorrect')
			};
		};
		$(this).removeClass('selectedCell')
	})

	console.log(correctLetters, wordLength)
	if (correctLetters===wordLength) {
		$(selection).append('<img class="crosswordOutcome" src="images/tick-image.png">')
	};
}

function CW1_getSelections(thisThing) {
	if ($(thisThing).hasClass('firstDown')) {
		selection = $(thisThing).attr('class').split(' ')
			selectionDebug = selection[selection.length-2]
		if (selectionDebug!='firstDown') {
			var selection = selectionDebug
		} else {
			var selection = selection[selection.length-3]
		};
	} else {
		var selection = $(thisThing).attr('class').split(' ')[1]
	}

	$('#CW1 .inputCell[outcome="incorrect"]').each(function(){
		$(this).children('input').prop('disabled', false)
	})

	$('#CW1 .inputCell').each(function() {
		var tempVar = $(this).children('input').prop('disabled')
		if (!tempVar) {
			$(this).children('input').val('')
		};
	})

	$('#CW1 .selectedCell').removeClass('selectedCell')
	$('#CW1 .hintHighlight').removeClass('hintHighlight')
	$('#CW1 #'+selection).children().addClass('hintHighlight')

	selection = '.'+selection
	$(selection)
		.addClass('selectedCell')
		.children('input').addClass('selectedCell')

	$('.inputCell').each(function() {
		if ($(this).attr('outcome')==='incorrect') {
			$(this).children('input').val('')
			$(this).attr('outcome', '')
		};
	})

	for (var i = 0; i < $(selection).length; i++) {
		var tempVar = $($(selection)[i]).children('input').val()
		if (!tempVar) {
			$($(selection)[i]).children('input').focus()
			var selectedCell=i
			i=$(selection).length
		};
	};

	$($(selection)[selectedCell]).children('input').focus()

	
	
	selection =  {
		selection: selection,
		selectedCell: selectedCell
	}

	return selection
}

function CW1_setUpCrossWord() {
	CW1_createCrossword()
	CW1_groupCells()
	CW1_createHints()
	CW1_cleanClasses()
}

function CW1_createCrossword() {
	$('#CW1').append('<div class="crosswordContainer"></div>')
	var thisCW = $('#CW1 .crosswordContainer')
	thisCW.append('<div class="crossword"></div>')
	thisCW_crossword = thisCW.children('.crossword')

	for (var i = CW1_matrix.length - 1; i >= 0; i--) {
		CW1_matrix[i] = CW1_matrix[i].split('')
		thisCW_crossword.prepend('<div class="cwRow newRow"></div>')
		var thisRow = thisCW_crossword.children('.newRow')
		for (var j = CW1_matrix[i].length - 1; j >= 0; j--) {
			if (CW1_matrix[i][j]!='.') {
				thisRow.prepend('<div class="cell inputCell index_'+(i+1)+'_'+(j+1)+'"><input maxlength="1" type="text" cell="'+CW1_matrix[i][j].toUpperCase()+'"></div>')
			} else {
				thisRow.prepend('<div class="cell emptyCell index_'+(i+1)+'_'+(j+1)+'"></div>')
			};
		};
		thisRow.removeClass('newRow')
	};
}

function CW1_groupCells() {
	var CW1_maxRow = $('#CW1 .cwRow').length
	var CW1_maxCol = $('#CW1 .cwRow:nth-child(1) .cell').length

	CW1_numberCells(CW1_maxRow, CW1_maxCol)
	CW1_groupAcross(CW1_maxRow, CW1_maxCol)
	CW1_groupDown(CW1_maxRow, CW1_maxCol)
}

function CW1_groupAcross(CW1_maxRow, CW1_maxCol) {
	$('#CW1 .firstCell').each(function() {
		var tempArray = []
		tempArray[0] = '.'+$(this).attr('class').split(' ')[2]

		var thisRow = +$(this).attr('class').split(' ')[2].split('_')[1]
		var thisCol = +$(this).attr('class').split(' ')[2].split('_')[2]
		var leftCell = $('#CW1 .index_'+thisRow+'_'+(thisCol-1))

		if (!leftCell.hasClass('inputCell')) {
			for (var i = thisCol; i < CW1_maxCol; i++) {
				var indexShift = $('#CW1 .index_'+thisRow+'_'+(i+1))
				if (!indexShift.hasClass('inputCell')) {
					i = CW1_maxCol
				} else {
					tempArray.push('.index_'+thisRow+'_'+(i+1))
				};
			};
		};

		if (tempArray.length>1) {
			var thisAcross = 'across_'+$(this).children('.numberBox').text()
			for (var i = tempArray.length - 1; i >= 0; i--) {
				$(tempArray[i]).addClass(thisAcross)
			};
			$(this).addClass('firstAcross')
		};
	})
}

function CW1_groupDown(CW1_maxRow, CW1_maxCol) {
	$('#CW1 .firstCell').each(function() {
		var tempArray = []
		tempArray[0] = '.'+$(this).attr('class').split(' ')[2]

		var thisRow = +$(this).attr('class').split(' ')[2].split('_')[1]
		var thisCol = +$(this).attr('class').split(' ')[2].split('_')[2]
		var topCell = $('#CW1 .index_'+(thisRow-1)+'_'+thisCol)

		if (!topCell.hasClass('inputCell')) {
			for (var i = thisRow; i < CW1_maxRow; i++) {
				var indexShift = $('#CW1 .index_'+(i+1)+'_'+thisCol)
				if (!indexShift.hasClass('inputCell')) {
					i = CW1_maxRow
				} else {
					tempArray.push('.index_'+(i+1)+'_'+thisCol)
				};
			};
		};

		if (tempArray.length>1) {
			var thisAcross = 'down_'+$(this).children('.numberBox').text()
			for (var i = tempArray.length - 1; i >= 0; i--) {
				$(tempArray[i]).addClass(thisAcross)
			};
			$(this).addClass('firstDown')
		};
	})
}

function CW1_numberCells(CW1_maxRow, CW1_maxCol) {
	var CW1_index = 1
	$('#CW1 .cell').each(function() {
		if ($(this).hasClass('inputCell')) {
			var thisRow = +$(this).attr('class').split(' ')[2].split('_')[1]
			var thisCol = +$(this).attr('class').split(' ')[2].split('_')[2]

			var topEmpty = checkShift(thisRow-1, thisCol)
			var botEmpty = checkShift(thisRow+1, thisCol)
			var leftEmpty = checkShift(thisRow, thisCol-1)
			var rightEmpty = checkShift(thisRow, thisCol+1)

			if ((topEmpty && !botEmpty)||(leftEmpty&&!rightEmpty)) {
				$(this).prepend('<div class="numberBox">'+CW1_index+'</div>')
				$(this).addClass('firstCell')
				CW1_index++
			};
		};
	});
	function checkShift(thisRow, thisCol) {
		if (!thisRow||!thisCol||thisRow>CW1_maxRow||thisCol>CW1_maxCol) {
			return true
		} else {
			var indexShift = $('#CW1 .index_'+thisRow+'_'+thisCol)
			if (indexShift.hasClass('inputCell')) {
				return false
			} else {
				return true
			};
		};
	}
}

function CW1_createHints() {
	$('#CW1').append('<div class="hintContainer"></div>')

	$('#CW1 .hintContainer').append('<div class="acrossBox"></div')
	$('#CW1 .hintContainer').append('<div class="downBox"></div')

	$('#CW1 .acrossBox').append('<div class="hintHead">Across:</div><div class="hintBox"></div')
	$('#CW1 .downBox').append('<div class="hintHead">Down:</div><div class="hintBox"></div')

	for (var i = 0; i < CW1_hints.across.length; i++) {
		$('#CW1 .acrossBox').append('<div id="across_'+CW1_hints.across[i][0]+'" class="hint"></div>')
		var thisThing = $('#across_'+CW1_hints.across[i][0])
		thisThing.append('<div class="hintNumber">'+CW1_hints.across[i][0]+'.</div>')

		thisThing.append('<div class="hintText" >'+CW1_hints.across[i][1]+'</div>')
	};

	for (var i = 0; i < CW1_hints.down.length; i++) {
		$('#CW1 .downBox').append('<div id="down_'+CW1_hints.down[i][0]+'" class="hint"></div>')
		var thisThing = $('#down_'+CW1_hints.down[i][0])
		thisThing.append('<div class="hintNumber">'+CW1_hints.down[i][0]+'.</div>')
		thisThing.append('<div class="hintText" >'+CW1_hints.down[i][1]+'</div>')
	};

	$('#CW1 .hintText').each(function() {
		var thisWidth = $(this).width()
		var maxWidth = ($(this).parent().outerWidth(true) - $(this).siblings('.hintNumber').outerWidth(true))

		if (thisWidth>maxWidth) {
			var outerWidth = $(this).outerWidth(true) - thisWidth
			$(this).css('width', maxWidth-outerWidth)
		};
		var thisHeight = $(this).outerHeight(true)
		$(this).parent().css('height', thisHeight)
	})
}

function CW1_cleanClasses() {
	$('#CW1 .cell').each(function() {
		$(this)
			.removeClass('firstCell')
			.removeClass($(this).attr('class').split(' ')[2])
			.removeClass('cell')
	})	
}