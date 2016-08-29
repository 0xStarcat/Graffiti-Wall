
//Canvases
var canvas;
var ctx;
var canvasData;
var brushSizeCanvas;
var brushCtx;

//input
var inputActive = false;
//mouse
var cursorX;
var cursorY;
var cursorSize;
var cursorColor;
var crosshairX;
var crosshairY;

//tags
var tagWidth;
var tagHeight;
var tagURL;


document.addEventListener('DOMContentLoaded',domloaded,false);

function domloaded() {

canvas = document.getElementById("myCanvas");
ctx = canvas.getContext("2d");
canvasData = canvas.toDataURL("image/png");

if(!brushLocked)
  {
    sizePreviewBox();
  }

cursorX = 0;
cursorY = 0;
cursorSize = 10;
cursorColor = "black";

var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

//var touchStart = false;

var inputDown = ('ontouchstart' in document.documentElement)  ? 'touchstart' : 'mousedown';
var inputMove = ('ontouchmove' in document.documentElement)  ? 'touchmove' : 'mousemove';
var inputUp = ('ontouchend' in document.documentElement)  ? 'touchend' : 'mouseup';

$("#myCanvas").on(inputDown, inputDownFunction);
$("#myCanvas").on(inputMove, inputMoveFunction);
$(window).on(inputUp, inputUpFunction);

windowResizeFunction();
update();


};
  // document.addEventListener("keydown",function(){ alert(String(data));});
function update()

{
  //drawDebug();
  requestAnimationFrame(update);

  if(!brushLocked)
  {
    updateColorPicker();
  }


  if (mobilePalette)
  {
    console.log('working????')
    movePalette();
  }

  if (sliderMove)
  {
    getSliderValue();
  }

  if(!paintMode)
  {
    moveCursorImagePreview();
  }

  if (brushSliderMove)
  {
    adjustBrushSize();
  }

}

function inputDownFunction(event)
  {
    getInputPosition(event);
    inputActive=true;
    if (paintMode && !brushLocked)
    {
       drawCursor();
       console.log(brushLocked);
    } else if (!paintMode && !brushLocked) {
      tagWall();
    }
  }


function inputMoveFunction(event)
  {
    getInputPosition(event);
    if(inputActive && paintMode && !brushLocked)
      {
        drawCursor();
      }
  }

function inputUpFunction(event)
  {
    inputActive = false;
  }


function getInputPosition(event) {

  cursorX = (event.pageX) ? event.pageX : event.touches[0].pageX;
  cursorY = (event.pageY) ? event.pageY : event.touches[0].pageY;

//Tag at CENTER of cursor/image
  if(!paintMode)
  {
    crosshairX = cursorX - (tagWidth/2);
    crosshairY = cursorY - (tagHeight/2);
  }
}
