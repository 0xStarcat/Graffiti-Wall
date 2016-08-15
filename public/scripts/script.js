//Source: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
//and http://zipso.net/a-simple-touchscreen-sketchpad-using-javascript-and-html5/

//Possible color spectrum solution:
//when clicking hue, open floating slider for adjusting that spectrum
//Limit slider from White to top and Black to bottom, starting the slider in the middle corresponding with that hue.

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



//var cursorData = brushSizeCanvas.toDataURL();


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
//setInterval(update,10); //miliseconds setInterval is for FIXED UPDATE





function tagWall()
{
    resizeTagSize();
   var base_image = new Image();
      base_image.crossOrigin = "Anonymous";
      //base_image.src = tagURL;
      previewData = previewCanvas.toDataURL("image/png");
      base_image.src = previewData;
      ctx.drawImage(base_image, crosshairX, crosshairY, tagWidth, tagHeight)
      canvasData = canvas.toDataURL("image/png");  //Save snapshot

      // base_image.onload = function(){
      //   ctx.drawImage(base_image, crosshairX, crosshairY, tagWidth, tagHeight)//, 0, 0, canvas.width, (canvas.width * 0.5625));//, 0, 0, canvas.width, (canvas.width * 0.5625));
      //   canvasData = canvas.toDataURL("image/png");  //Save snapshot
      // }



}


function inputDownFunction(event)
  {
    getInputPosition(event);
    inputActive=true;

     //console.log('inputDown!');

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
        //console.log('move Draw');
      }
  }

function inputUpFunction(event)
  {
    inputActive = false;
    //console.log('input Up')
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

  $("#clearCanvas").click(function(){

    if ($("#notificationWindow").hasClass("hide"))
    {
      $("#notificationWindow").removeClass("hide");
    }else{
      $("#notificationWindow").addClass("hide");
      }

  })

   $("#yes").click(function(){
    if (!$("#notificationWindow").hasClass("hide"))
          {
            clearCanvas();
            $("#notificationWindow").addClass("hide");
          }
       });

  $("#no").click(function(){
    $("#notificationWindow").addClass("hide");
  });










