# canvas系列一之页面截图实现

### 写在最前：
这两天在看MDN上关于canvas的介绍，感觉看了好多的api，
看着看着不用又慢慢的淡忘了，所以想着写个什么DEMO出来
。然后同事说先写个简单的屏幕截图吧，就这样，我就慢慢的开始了我的页面截图实现之路......
### git地址：
    https://github.com/ry928330/screenShot.git
### 实现思路：
仔细想想，利用canvas实现页面截图的功能不外乎以下几点：

```
1.按下截图快捷键，确定页面绘图区域；
2.进入绘图模式，在鼠标滑动区域“模拟”出截图效果，记为canvas1；
3.将页面绘图区域的DOM转化为canvas，记为canvas2；
4.将canvas2转为图片，利用drawImage这个api截出和前面鼠标滑动区域一样大小的图，将该图“印”在之前的canvas1上；
5.讲canvas1转换为图片，并下载。
```

### 成果展示：
http://note.youdao.com/noteshare?id=ec389ba3e27bba69edc11843301077d4
### 详细说明：
> ##### 确定页面绘图区域：
你要在页面截图，所以你得确定你要截图的区域。当然，你也可以在页面的整个区域去完成截图。贴下代码：

```
//创建一个全局变量canvasObj，记录绘制过程中的信息
    var canvasObj = {
    	xStart:0,
    	yStart:0,
    	width:0,
    	height:0,
    	initialWidth:0,
    	initialHeight:0,
    	beginDraw: false
    }
    canvas.addEventListener('mousedown', function() {
        if (event.key == 's') {
            var canvas = createCanvas("wordExpress") //创建和截图区域一样大小的canvas
        }
        ...
    }
```

在按下s键后进入截图模式，利用createCanvas函数，出入DOM区域的id，绘制出和DOM一样大小的canvas。
> ##### 进入绘图模式，在鼠标滑动区域‘模拟’出截图效果
这里我们监听鼠标的mousedown，mousemove，mouseup三个事件。代码及相关解释分别如下：

```
canvas.addEventListener('mousedown', function(event) {
	var ctx = canvas.getContext('2d');
	var e = event || window.event;
	var xStart = e.clientX;
	var yStart = e.clientY;
	canvasObj.beginDraw = true
	canvasObj.xStart = xStart;
	canvasObj.yStart = yStart;
	ctx.clearRect(0,0,canvasObj.initialWidth,canvasObj.initialHeight);
	ctx.fillStyle = "rgba(0,0,0,0.4)";
	ctx.fillRect(canvasObj.xStart, canvasObj.yStart, 1, 1)
})
```
鼠标按下，记录按下位置的横纵坐标，并画点。而且每次按下鼠标我们都会清理整个截图区域。然后是鼠标拖动时：

```
canvas.addEventListener('mousemove', function(event) {
    var ctx = canvas.getContext('2d');
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
```

在鼠标拖动过程中我们会一边清理绘制的区域，一边又重新绘制拖动的区域。在这里我们要注意这个if判断语句，它会判断如果你往回拖的话，canvas擦除的区域和你直接拖（就是不往回拖）擦除的区域是不一样的。最后，在松开鼠标后：
	
```
canvas.addEventListener('mouseup', function(event) {
	var e = event || window.event;
	canvasObj.beginDraw = false;
	createBar(canvasObj.xStart, canvasObj.yStart, canvasObj.width, canvasObj.height)
})
```

将可以绘制的标志beginDraw设置为false，并添加“点击下载按钮”。此时你已经绘制了一张‘图’，就是你鼠标划过的区域，即为canvas1（特别注意，这里的canvas1其实不是一个canvas，他只是你画出的矩形区域，后面我们会详细说明）
> ##### 将页面绘图区域的DOM转化为canvas
进行到这里，你只是模拟出了页面“截图”这一功能，你还没有真正将页面的内容“印”到你的canvas上，要怎么做呢？我的思路是将页面被截图区域变成一张图片，然后我就可以利用canvas的api即drawImage将改图片剪切到我的canvas里面，是不是很简单。在这之前，我们要想想怎么把页面被截区域变成一张图片呢，其实很简单，你只要讲整个要截图的DOM区域转化为canvas，然后把这个canvas转化为图片即可，canvas转化为图片是十分简单的，直接调用toDataURL这个api即可。但是我们这里又有一个难题了，就是怎么将这个DOM区域转化为canvas呢，我没有找到很好的解决办法，查阅了下资料，网上给出了一个jquery的库函数html2canvas，只要你传入页面DOM的元素就可以讲该片DOM转换为canvas，代码如下：
    
```
html2canvas(document.getElementById('wordExpress'), {
	onrendered: function(canvas) {
	    ...
		//你要对此canvas做的事...
	},
});
```
整个DOM转换为canvas了，记为canvas2。接下来的事情接好办多了，我们接着来看
> ##### 将canvas2转为图片，利用drawImage这个api截出和面鼠标滑动区域一样大小的图，将该图“印”在之前的canvas1上
得到了整个DOM转换来的canvas2，我们已经迫不及待的将其转换为图片了，代码如下：
    
```
function canvasTrans2Image(canvas) {
	var imageURL = canvas.toDataURL('image/png');
	return imageURL;
}
var imageURL = canvasTrans2Image(canvas);
```

就这么一两句话，不难懂吧，这里我们拿到了由canvas2转换来的图片地址imageURL，然后我们需要在这张图片上和之前canvas1相同的位置，剪切出和canvas1一样大小的图片记为image，而且我们要知道现在canvas1它也只是我们画出的一个鼠标划过的矩形区域，你需要在这个canvas1的矩形区域的位置重新建立一个真正的canvas，记为canvas3,然后通过drawImage这个api，你才可以将image剪切到你的canvas3里面去。然后你才可以将最后的这个canvas3按照前面的方式转化为图片，这个图片就是最后的截图。照例，贴出代码：
    
```
function imageTrans2Canvas(imageURL, newCanvasId, sx, sy, width, height) {
	var newCanvas = document.getElementById(newCanvasId);
	var ctx = newCanvas.getContext('2d');
	var img = new Image();
	img.src = imageURL;
	img.onload = function() {
    	ctx.drawImage(img, sx, sy, width, height, 0, 0 ,width, height);
    	var url = canvasTrans2Image(newCanvas);
	}
}
```

函数中这个最后的url就是我们要截的图的地址，你可以通过a标签的download属性把这个图给保存下来，你也可以右键另存为，反正你已经拿到最后图片的地址了，想怎么处理图片你看着办。
### 相关依赖：
<script src="https://cdn.bootcss.com/html2canvas/0.5.0-beta4/html2canvas.min.js"></script>

### 写在最后：
唉，拖了好久终于还是“强迫”自己在周五这个晚上把总结写出来了，感觉自己写得好乱，不知道有没有说清楚（感觉是没有，尴尬了......），有什么不对的地方欢迎给为大佬指出。有什么不懂的，欢迎一起探讨，谢谢了。
