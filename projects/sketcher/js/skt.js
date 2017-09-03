var sktTransitionSpeed = 0.15
var sketcherObjects = {}
var sketcherCache = {}

$(document).ready(function () {
	setUpSketcher()
	drawSketch()

	var userBroswer = checkBrowser()
	if (userBroswer==='safari') {
		$('.sktWindow').addClass('safariCursor')
	}

	$('.colourSelector').hover(function() {
		$(this).find('.colourOptions').stop().fadeIn(sktTransitionSpeed*1000)
	}, function() {
		$(this).find('.colourOptions').stop().fadeOut(sktTransitionSpeed*1000)
	})

	$('.colourOption').on('click', function() {
		var container = $(this).closest('.sktContainer')
		var thisColour = $(this).attr('colour')
		container.find('.selectedColour').css('background-color', thisColour)
		container.find('.sktWindow').attr('currentColour', thisColour)
	})

	$('.lineSelector').hover(function() {
		$(this).find('.lineOptions').stop().fadeIn(sktTransitionSpeed*1000)
	}, function() {
		$(this).find('.lineOptions').stop().fadeOut(sktTransitionSpeed*1000)
	})

	// $('.sizeOption').on('click', function() {
	// 	var container = $(this).closest('.sktContainer')
	// 	var thisSize = $(this).attr('size')
	// 	container.find('.sktWindow').attr('lineWidth', thisSize)
	// })
})

function undoSktStroke(thisThing) {
	var container = thisThing.closest('.sktContainer')
	var sketcher = container.find('.sktWindow')
	sketcherCache[sketcher.attr('useobj')].pop()
	var background = sketcherCache[sketcher.attr('useobj')].length - 1
		background = sketcherCache[sketcher.attr('useobj')][background]
	clearCanvas(sketcher, background)
	sketcherCache[sketcher.attr('useobj')].pop()
	var newSketcher = container.find('.sktWindow')
	updateSketcherCache(newSketcher)
}

function drawSketch() {
	var freeHandPaint = false

	$('.lineOptions > div').on('click', function() {
		var container = $(this).closest('.sktContainer')
		container.find('.selectedLine').removeClass('selectedLine')
		$(this).addClass('selectedLine')
		resetSktTools($(this))

		var chosenLine = container.find('.chosenLine div')
		var thisIcon = $(this).find('.sktOptionImg').clone()
		var thisText = $(this).find('.sktOptionText').clone()
		chosenLine.children().remove()
		chosenLine.append(thisIcon)
		chosenLine.append(thisText)

		var thisCursor = $(this).attr('lineType')
		var sketcher = container.find('.sktWindow')
		sketcher.attr('lineType', thisCursor)
	})

	$('.sktDownload').on('click', function() {
		sktPrintThis($(this))
	})

	$('.sktReset').on('click', function() {
		clearCanvas($(this))
		resetSktTools($(this))

		var container = $(this).closest('.sktContainer')
		var sketcher = container.find('.sktWindow')
		sketcherCache[sketcher.attr('useobj')] = []

	})

	$('.sktUndo').on('click', function() {
		undoSktStroke($(this))
		console.log(sketcherCache['sketcher_0'])
	})


	$(document).on('mousedown', '.sktWindow', function(event){
		var thisThing = $(this)
		var thisCache = thisThing.attr('useobj')
		var container = thisThing.closest('.sktContainer')
		if (container.find('.lineOptionHover[lineType="line"]').hasClass('selectedLine')) {
			connectLine(event, thisThing)
		} else {
			var lineFill = false
			var useObj = populateLine(event, thisThing, lineFill)
			freeHandPaint = true
			drawLine(useObj)
		}
	})

	$(document).on('mousemove', '.sktWindow', function(event){
		var thisThing = $(this)
		var lineFill = true
		if (freeHandPaint){
			var useObj = populateLine(event, thisThing, lineFill)
			drawLine(useObj)
		}
	})

	$(document).on('mouseup', '.sktWindow', function() {
		updateSketcherCache($(this))
		freeHandPaint = false
	})
	$(document).on('mouseleave', '.sktWindow', function() {
		if (freeHandPaint) {
			updateSketcherCache($(this))
		}
		freeHandPaint = false
	})

	$('.color-button').on('click', function() {
		targColor = $(this).attr('colour')
		selectedColor = targColor
	})
}

function populateLine(event, thisThing, lineFill) {
	var tempObj = {
		'clickX' : event.pageX -  thisThing.offset().left,
		'clickY' : event.pageY - thisThing.offset().top,
		'lineFill' : lineFill,
		'colour' : thisThing.attr('currentColour'),
		'lineWidth' : thisThing.attr('lineWidth')
	}
	eval('var thisObj = sketcherObjects.' + thisThing.attr('useObj'))
	thisObj.canvasLine.push(tempObj)
	return thisObj
}

function connectLine(event, thisThing) {
	eval('var thisObj = sketcherObjects.' + thisThing.attr('useObj'))
	if (!thisObj.lineConnect) {
		thisObj.lineStart = [
			event.pageX -  thisThing.offset().left,
			event.pageY - thisThing.offset().top
		]
		var drawThis = populateLine(event, thisThing, thisObj.lineFill)
		drawLine(drawThis)
		thisObj.lineConnect = true
	} else {
		thisObj.lineEnd = [
			event.pageX -  thisThing.offset().left,
			event.pageY - thisThing.offset().top
		]
		var xDiff = thisObj.lineEnd[0] - thisObj.lineStart[0]
		var yDiff = thisObj.lineEnd[1] - thisObj.lineStart[1]
		var maxDiff = Math.max(Math.abs(xDiff), Math.abs(yDiff))

		for (var i = 1 ; i <= maxDiff ; i++) {
			var drawThis = {
				'clickX' : thisObj.lineStart[0] + (i*(xDiff/maxDiff)),
				'clickY' : thisObj.lineStart[1] + (i*(yDiff/maxDiff)),
				'lineFill' : false,
				'colour' : thisThing.attr('currentColour'),
				'lineWidth' : thisThing.attr('lineWidth')
			}
			thisObj.canvasLine.push(drawThis)
			drawLine(thisObj)
		}

		thisObj.canvasLine = []
		thisObj.lineStart = thisObj.lineEnd
	}
}

function drawLine(thisObj) {
	var context = thisObj.context
	var canvasLine = thisObj.canvasLine
	context.lineJoin = "round"
	for(var i=0 ; i < canvasLine.length ; i++) {	
		context.lineWidth = canvasLine[i].lineWidth	
		context.beginPath()
		if(canvasLine[i].lineFill && i){
			context.moveTo(canvasLine[i-1].clickX, canvasLine[i-1].clickY)
		} else {
			context.moveTo(canvasLine[i].clickX-1, canvasLine[i].clickY)
		}
		context.lineTo(canvasLine[i].clickX, canvasLine[i].clickY)
		context.closePath()
		context.strokeStyle = canvasLine[i].colour
		context.stroke()
	}
}

function clearCanvas(thisThing, background) {
	var container = thisThing.closest('.sktContainer')
	var oldSketcher = container.find('.sktWindow')
	var tempInfo = []
	oldSketcher.each(function() {
		$.each(this.attributes, function() {
			if(this.specified) {
				var tempobj = {
					'attrName' : this.name,
					'attrValue' : this.value
				}
				tempInfo.push(tempobj)
			}
		});
	})

	var parentDiv = oldSketcher.parent()
	oldSketcher.remove()

	if (!background) {
		var thisEle = '<canvas>'
	} else {
		var thisEle = background
	}
	
	var newCanvas = parentDiv.append(thisEle).children('canvas')

	if (!background) {
		for (var i = 0 ; i < tempInfo.length ; i++) {
			newCanvas.attr(tempInfo[i].attrName, tempInfo[i].attrValue)
		}
	} else {
		for (var i = 0 ; i < tempInfo.length ; i++) {
			if (tempInfo[i].attrName!='height'&&tempInfo[i].attrName!='width') {
				newCanvas.attr(tempInfo[i].attrName, tempInfo[i].attrValue)
			}
		}
	}
	
	var tempObj = resetSketcher(newCanvas, background)
	eval('sketcherObjects.' + newCanvas.attr('useobj') + ' = tempObj')
}

function setUpSketcher() {
	var duplicateChecker = []
	$('.sktContainer').each(function(i) {

		var sketcherWindow = $(this).find('.sktWindow')	
		sketcherWindow.attr('useObj', 'sketcher_'+i)
		var tempObj = resetSketcher(sketcherWindow)
		eval('sketcherObjects.sketcher_' + i + ' = tempObj')
		eval('sketcherCache.sketcher_' + i + ' = []')

		var chosenLine = $(this).find('.lineOptions')
			.wrap('<div class="lineSelector"></div>').parent()
				.prepend('<div class="chosenLine"></div>')
				.children('.chosenLine').append('<div></div>').children('div')
		var defaultLine = $(this).find('.lineOptionHover:first-child')
		var defaultImg = defaultLine.find('.sktOptionImg').clone()
		var defaultText = defaultLine.find('.sktOptionText').clone()
		chosenLine.append(defaultImg)
		chosenLine.append(defaultText)

		var defaultCursor = defaultLine.attr('lineType')
		sketcherWindow.attr('lineType', defaultCursor)

		$(this).find('.colourOption').each(function() {
			$(this).css('background',$(this).attr('colour'))
		})

		var defaultColour = $(this).find('.colourOption:first-child')
		sketcherWindow.attr('currentColour', defaultColour.attr('colour'))

		$(this).find('.colourOptions')
			.wrap('<div class="colourSelector"></div>').parent()
				.prepend('<div class="chosenColour"><div class="selectedColour"></div></div>')
				.find('.selectedColour')
					.css('background-color', defaultColour.attr('colour'))

		var defaultSize = $(this).find('.sizeOption:first-child')
		sketcherWindow.attr('lineWidth', defaultSize.attr('size'))

		$(this).find('.sizeOptions')
			.wrap('<div class="sizeSelector"></div>')
			.prepend('<div class="selectedSize"></div>')
	})
}

function resetSketcher(thisThing, background) {
	var canvas = thisThing[0]
	var context = canvas.getContext('2d')

	if (!background) {
		var base_image = new Image()
		base_image.src = thisThing.attr('backgroundImage')
		base_image.onload = function(){
			context.drawImage(base_image, 0, 0)
		}
	}

	var tempObj = {
		'canvas' : canvas,
		'context' : context,
		'canvasLine' : [],
		'freeHandPaint' : false,
		'lineFill' : false,
		'lineStart' : [],
		'lineEnd' : [],
		'lineConnect' : false,
	}
	return tempObj
}

function resetSktTools(thisThing) {
	var sketcher = thisThing.closest('.sktContainer').find('.sktWindow')
	var sketcherObj = eval('sketcherObjects.' + sketcher.attr('useObj'))
	sketcherObj.canvasLine = []
	sketcherObj.freeHandPaint = false
	sketcherObj.lineFill = false
	sketcherObj.lineStart = []
	sketcherObj.lineEnd = []
	sketcherObj.lineConnect = false
}

function checkBrowser() {
	var thisBrowser = navigator.userAgent
	if (thisBrowser.includes('Chrome')) {
		return 'chrome'
	} else if (thisBrowser.includes('Firefox')) {
		return 'firefox'
	} else {
		return 'safari'
	}
}