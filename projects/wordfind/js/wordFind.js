$(document).ready(function() {

	WF1_answerBank = [
		'COMPUTER',
		'CABLES',
		'INTERNET',
		'EMAIL',
		'PAGES',
		'DIGITAL',
		'SEARCH',
		'ENGINE',
		'INTRANET',
		'CONNECT',
		'SOFTWARE',
		'BROWSER',
		'WORLDWIDEWEB',
		'HYPERLINK'
	]

	WF1_correct = '#98EA7D'
	WF1_incorrect = '#F57474'

	WF1_setUp()

	var firstSelection,
		startPoint,
		secondSelection,
		endPoint;

	$('.wf_row').on('click','div',function() {
		$(this).toggleClass('selected')
		if ($('#WF1 .selected').length === 1) {
			firstSelection = $(this).attr('id')
			startPoint = firstSelection.split('_')
		} else if ($('#WF1 .selected').length > 1) {
			secondSelection = $(this).attr('id')
			endPoint = secondSelection.split('_')
			WF1_validateSelection(startPoint, endPoint)
		};
	});

	$('#WF1 .wordList div').hover(function() {
		var targIDs = $(this).attr('data')
		if (targIDs!=undefined) {
			$('#WF1 .wordFindBox').animate({'opacity': 0.5}, 0, function() {
				var wordIDs = targIDs.split(',')
				for (var i = wordIDs.length - 1; i >= 0; i--) {
					$(wordIDs[i]).css('opacity', 1)
				};
			})
			$(this).siblings().css('opacity',0.5)
		};
	}, function() {
		var targIDs = $(this).attr('data')
		if (targIDs!=undefined) {
			$('#WF1 .wordFindBox').css('opacity', 1)
		};
		$(this).siblings().css('opacity',1)
	})
})

function WF1_setUp() {
	var content = $('#WF1 .wordFind').text().split('')
	var columns = 15
	var rows = content.length/columns

	$('#WF1 .wordFind').text('')

	for (var i = 0; i <=rows - 1; i++){
		$('#WF1 .wordFind').append('<div class="wf_row"></div>')
		var newRow = $('#WF1 .wf_row')[i]
		newRow = $(newRow)
		for (var j = 0; j <= columns - 1; j++) {
			newRow.append('<div id="R'+(i+1)+'_C'+(j+1)+'" class="wordFindBox"><p>'+ content[(i*columns)+j] +'</p></div>')
		};
	};


	for (var i = 0; i <= WF1_answerBank.length - 1; i++) {
		var thisWord = WF1_answerBank[i]
		var displayWord = thisWord.toLowerCase().split('')
			displayWord[0] = displayWord[0].toUpperCase()
			displayWord = displayWord.join('')
		$('#WF1 .wordList').append('<div class="'+thisWord+'">'+displayWord+'</div>')
	};
}


function WF1_validateSelection(startPoint, endPoint) {
	if (startPoint[0]===endPoint[0]) {
		var rowMatch = true
		WF1_fillSelection(startPoint, endPoint, rowMatch)
	} else if(startPoint[1]===endPoint[1]) {
		var rowMatch = false
		WF1_fillSelection(startPoint, endPoint, rowMatch)
	} else {
		$('#'+startPoint.join('_')).removeClass('selected')
		$('#'+endPoint.join('_')).removeClass('selected')
	};
}

function WF1_fillSelection(startPoint, endPoint, rowMatch) {
	$('#WF1 .selected').removeClass('selected')
	var selectedWord = {
		'id': [],
		'text': [],
		'colour': []
	}
	if (rowMatch) {
		var startCount = +startPoint[1].split('').splice(1,2).join('')
		var endCount = +endPoint[1].split('').splice(1,2).join('')
		

		if (startCount>endCount) {
			var tempCount = startCount
			startCount = endCount
			endCount = tempCount
		}

		for (var i = startCount; i <= endCount; i++) {
			var fillThis = '#'+WF1_getID(i)
			selectedWord.id.push(fillThis)
			selectedWord.text.push($(fillThis + ' p').text())
			selectedWord.colour.push($(fillThis).css('background-color'))
		};

		WF1_fillThis(selectedWord)

	} else {
		var startCount = +startPoint[0].split('').splice(1,2).join('')
		var endCount = +endPoint[0].split('').splice(1,2).join('')

		if (startCount>endCount) {
			var tempCount = startCount
			startCount = endCount
			endCount = tempCount
		}

		for (var i = startCount; i <= endCount; i++) {
			var fillThis = '#'+WF1_getID(i)
			selectedWord.id.push(fillThis)
			selectedWord.text.push($(fillThis + ' p').text())
			selectedWord.colour.push($(fillThis).css('background-color'))
		};

		WF1_fillThis(selectedWord)


	};

	function WF1_getID(i) {
		var fillThis = startPoint
		if (rowMatch) {
			var fillChanger = startPoint[1].split('')
		} else {
			var fillChanger = startPoint[0].split('')
		};
		var fillChangerLetter = fillChanger.splice(0, 1)
		var fillChangerNumber = fillChanger.splice(1, 2).join('')

		fillChangerNumber = i
		fillChanger = fillChangerLetter+fillChangerNumber
		if (rowMatch) {
			var fillChanger = fillThis[1] = fillChanger
		} else {
			var fillChanger = fillThis[0] = fillChanger
		};

		fillThis = fillThis.join('_')
		return fillThis
	}

	function WF1_fillThis(selectedWord) {

		var fullWord = selectedWord.text.join('')
		var foundWord = $.inArray(fullWord, WF1_answerBank) > -1;
		if (foundWord) {
			for (var i = selectedWord.id.length - 1; i >= 0; i--) {
				$(selectedWord.id[i]).animate({'background-color': WF1_correct}, 250)
			};
			$('#WF1 .'+fullWord)
				.animate({'background-color': WF1_correct}, 250)
				.attr('data', selectedWord.id)
				.addClass('foundWord')
		} else {
			for (var i = selectedWord.id.length - 1; i >= 0; i--) {
				var tempVariable = selectedWord.id[i]
				$(selectedWord.id[i]).animate({'background-color': WF1_incorrect}, 250, function() {
					for (var i = selectedWord.id.length - 1; i >= 0; i--) {
						$(selectedWord.id[i]).animate({'background-color': selectedWord.colour[i]}, 250)
					}
				})
			};
			
		};
	}
}


// The following function is used for colour animation
(function($) {
	function isRGBACapable() {
		var $script = $('script:first'),
				color = $script.css('color'),
				result = false;
		if (/^rgba/.test(color)) {
			result = true;
		} else {
			try {
				result = ( color != $script.css('color', 'rgba(0, 0, 0, 0.5)').css('color') );
				$script.css('color', color);
			} catch (e) {
			}
		}

		return result;
	}

	$.extend(true, $, {
		support: {
			'rgba': isRGBACapable()
		}
	});

	var properties = ['color', 'backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'outlineColor'];
	$.each(properties, function(i, property) {
		$.Tween.propHooks[ property ] = {
			get: function(tween) {
				return $(tween.elem).css(property);
			},
			set: function(tween) {
				var style = tween.elem.style;
				var p_begin = parseColor($(tween.elem).css(property));
				var p_end = parseColor(tween.end);
				tween.run = function(progress) {
					style[property] = calculateColor(p_begin, p_end, progress);
				}
			}
		}
	});

	// borderColor doesn't fit in standard fx.step above.
	$.Tween.propHooks.borderColor = {
		set: function(tween) {
			var style = tween.elem.style;
			var p_begin = [];
			var borders = properties.slice(2, 6); // All four border properties
			$.each(borders, function(i, property) {
				p_begin[property] = parseColor($(tween.elem).css(property));
			});
			var p_end = parseColor(tween.end);
			tween.run = function(progress) {
				$.each(borders, function(i, property) {
					style[property] = calculateColor(p_begin[property], p_end, progress);
				});
			}
		}
	}

	// Calculate an in-between color. Returns "#aabbcc"-like string.
	function calculateColor(begin, end, pos) {
		var color = 'rgb' + ($.support['rgba'] ? 'a' : '') + '('
				+ parseInt((begin[0] + pos * (end[0] - begin[0])), 10) + ','
				+ parseInt((begin[1] + pos * (end[1] - begin[1])), 10) + ','
				+ parseInt((begin[2] + pos * (end[2] - begin[2])), 10);
		if ($.support['rgba']) {
			color += ',' + (begin && end ? parseFloat(begin[3] + pos * (end[3] - begin[3])) : 1);
		}
		color += ')';
		return color;
	}

	// Parse an CSS-syntax color. Outputs an array [r, g, b]
	function parseColor(color) {
		var match, quadruplet;

		// Match #aabbcc
		if (match = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(color)) {
			quadruplet = [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16), 1];

			// Match #abc
		} else if (match = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(color)) {
			quadruplet = [parseInt(match[1], 16) * 17, parseInt(match[2], 16) * 17, parseInt(match[3], 16) * 17, 1];

			// Match rgb(n, n, n)
		} else if (match = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color)) {
			quadruplet = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), 1];

		} else if (match = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(color)) {
			quadruplet = [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10),parseFloat(match[4])];

			// No browser returns rgb(n%, n%, n%), so little reason to support this format.
		} else {
			quadruplet = colors[color];
		}
		return quadruplet;
	}
})(jQuery);