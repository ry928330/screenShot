window.onload = function() {
	var canvas = document.getElementById("screen");
	var ctx = canvas.getContext('2d');
	var canvasObj = {
		xStart:0,
		yStart:0,
		width:0,
		height:0,
		beginDraw: false
	}
	var canvasInitialWidth = $("#wordExpress").width();
	var canvasInitialHeight = $("#wordExpress").height();
	window.addEventListener('keydown', function(event) {
		if (event.key == 's') {
			$('canvas').width = canvasInitialWidth;
			$('canvas').height = canvasInitialHeight;
			var ctx = canvas.getContext('2d');
			ctx.fillStyle = "rgba(0,0,0,0.4)";
			ctx.fillRect(0,0,canvasInitialWidth,canvasInitialHeight);
		}
	})
	canvas.addEventListener('mousedown', function(event) {
		var e = event || window.event;
		var xStart = e.clientX;
		var yStart = e.clientY;
		canvasObj.beginDraw = true
		canvasObj.xStart = xStart;
		canvasObj.yStart = yStart;
		ctx.clearRect(0,0,500,500);
		ctx.fillStyle = "#fff";
		ctx.fillRect(canvasObj.xStart, canvasObj.yStart, 1, 1)
	})
	canvas.addEventListener('mousemove', function() {
		var e = event || window.event;
		var xDistance = e.clientX;
		var yDistance = e.clientY;
		if (canvasObj.beginDraw) {
			if (canvasObj.width && canvasObj.height) {
				//利用canvasObj记录canvas走过的宽高
				ctx.clearRect(canvasObj.xStart, canvasObj.yStart, canvasObj.width, canvasObj.height);
			} else {
				ctx.clearRect(canvasObj.xStart, canvasObj.yStart, xDistance - canvasObj.xStart, yDistance - canvasObj.yStart);
			}
			ctx.fillStyle = "rgba(0,0,0,0.4)";
			ctx.fillRect(canvasObj.xStart, canvasObj.yStart, xDistance - canvasObj.xStart, yDistance - canvasObj.yStart);
			canvasObj.width = xDistance - canvasObj.xStart;
			canvasObj.height = yDistance - canvasObj.yStart;
		}
	})
	canvas.addEventListener('mouseup', function() {
		var e = event || window.event;
		canvasObj.beginDraw = false;
		createBar(canvasObj.xStart, canvasObj.yStart, canvasObj.width, canvasObj.height)
	})
}

function canvasTranstoImage(canvasId) {
	var canvas = document.getElementById(canvasId);
	var ctx = canvas.getContext('2d');
	var imageURL = canvas.toDataURL('image/png');
}
function canvasTrans2Image(canvas, newCanvasId, sx, sy, width, height) {
	var imageURL = canvas.toDataURL('image/png');
	imageTrans2Canvas(imageURL, newCanvasId, sx, sy, width, height)
}
function imageTrans2Canvas(imageURL, newCanvasId, sx, sy, width, height) {
	var newCanvas = document.getElementById(newCanvasId);
	var ctx = newCanvas.getContext('2d');
	var img = new Image();
	img.src = imageURL;
	img.onload = function() {
		ctx.drawImage(img, sx, sy, width, height, 0, 0 ,width, height);
		var url = newCanvas.toDataURL('images/png');
		document.write("<img src='"+url+"' alt='from canvas'/>"); 
	}
}
function createNewCanvas(sx, sy, width, height) {
	var newCanvas = document.createElement('canvas');

	newCanvas.id = 'newCanvas';
	newCanvas.style.position = 'absolute';
	newCanvas.style.left = sx + 'px';
	newCanvas.style.top = sy + 'px';
	newCanvas.width = Math.abs(width);
	newCanvas.height = Math.abs(height);
	document.body.appendChild(newCanvas);
	return newCanvas.id
}
function createBar(sx, sy, width, height, canvasId) {
	if (width < 0 || height < 0) {
		if (width < 0) {
			sx -= Math.abs(width);
		}
		if (height < 0) {
			sy -= Math.abs(height);
		}
	}
	width = Math.abs(width);
	height = Math.abs(height);

	var divElement = document.createElement('div');
	divElement.id = 'config';
	divElement.style.position = 'absolute';
	divElement.style.left = sx + 'px';
	divElement.style.top = 20 + sy + height + 'px';
	divElement.style.backgroundColor = '#d7d7d7';
	divElement.innerHTML = '确认';
	document.body.appendChild(divElement);
	var configButton = document.getElementById('config');
	configButton.onclick = function() {
		var newCanvasId = createNewCanvas(sx, sy, width, height);
		html2canvas(document.getElementById('wordExpress'), {
			onrendered: function(canvas) {
				canvasTrans2Image(canvas, newCanvasId, sx, sy, width, height);
			},
		});
		//canvasTranstoImage(canvasId);
		//document.body.removeChild(divElement);
		//document.body.removeChild(document.getElementById(canvasId));
	}
}















