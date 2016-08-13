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

//mouse
var cursorX;
var cursorY;
var cursorSize;
var cursorColor;

//Brush size slider
var slidePercent;
var sliderHandle;

var tagWidth;
var tagHeight;
var tagURL;
document.addEventListener('DOMContentLoaded',domloaded,false);


function domloaded() {



canvas = document.getElementById("myCanvas");
ctx = canvas.getContext("2d");
canvasData = canvas.toDataURL("image/png");

brushSizeCanvas = document.getElementById("brushExampleCanvas");
brushCtx = brushSizeCanvas.getContext("2d");
//var cursorData = brushSizeCanvas.toDataURL();


cursorX = 0;
cursorY = 0;
cursorSize = 10;
cursorColor = "black";

var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;
var inputActive = false;
//var touchStart = false;

var inputDown = ('ontouchstart' in document.documentElement)  ? 'touchstart' : 'mousedown';
var inputMove = ('ontouchmove' in document.documentElement)  ? 'touchmove' : 'mousemove';
var inputUp = ('ontouchend' in document.documentElement)  ? 'touchend' : 'mouseup';
var handleClicked = false;

slidePercent = 0;
sliderHandle = document.getElementById("#sliderHandle");

var mobilePalette = false;

window.onresize = windowResizeFunction;
document.addEventListener("resize", windowResizeFunction, false);
// document.addEventListener("mousemove", mouseMoveFunction, false);
// //document.addEventListener("mousedown", mouseDownFunction, false);
// document.addEventListener("mouseup", mouseUpFunction, false);
// //document.addEventListener("touchstart", touchStartFunction, false);
// document.addEventListener("touchend", touchEndFunction, false);
// document.addEventListener("touchmove", touchMoveFunction, false);

$("#myCanvas").on(inputDown, inputDownFunction);
$("#myCanvas").on(inputMove, inputMoveFunction);
$(document).on(inputUp, inputUpFunction);

windowResizeFunction();
update();

  // document.addEventListener("keydown",function(){ alert(String(data));});
function update()


{
  drawDebug();
  requestAnimationFrame(update);
  updateColorPicker();

  if (mobilePalette)
  {
    movePalette();
  }


}
//setInterval(update,10); //miliseconds setInterval is for FIXED UPDATE






function drawCursor() {
  //var cursorString = "url("+String(data)+"), crosshair";

  var paletteWidth = $("#palette").outerWidth();

  if (cursorX > 0 && cursorX < (window.innerWidth - paletteWidth ))
      {
      ctx.beginPath(); //every object goes between beginPath() and closePath();
      // //ctx.rect(cursorX, cursorY, cursorSize, cursorSize) //draws a circle arrgs = (x, y, radius length, degrees in radii to render, Math.PI, and clockwise true or false)
      ctx.arc(cursorX, cursorY, cursorSize, 3, Math.PI, true) //draws a circle arrgs = (x, y, radius length, degrees in radii to render, Math.PI, and clockwise true or false)

      ctx.closePath(); //
      ctx.fillStyle =cursorColor; //CSS color in quotes
      ctx.fill(); //command to fill with above color
      var canvasData = canvas.toDataURL("image/png");


      // function getBase64Image(img) {
      // // imgElem must be on the same server otherwise a cross-origin error will be thrown "SECURITY_ERR: DOM Exception 18"
      //     var imageCanvas = document.createElement("canvas");
      //     imageCanvas.width = window.innerWidth;
      //     imageCanvas.height = window.innerWidth * 0.5625;

      //     var imageCtx = imageCanvas.getContext("2d");
      //     imageCtx.drawImage(img, 0, 0, base_image.width, base_image.height)//, 0, 0, 50, 50);
      //     var dataURL = imageCanvas.toDataURL("image/png");
      //     //console.log(dataURL);

      //     return dataURL//.replace(/^data:image\/(png|jpg);base64,/, "");
      // }
      //http://stackoverflow.com/questions/6011378/how-to-add-image-to-canvas

  }
}

function tagWall()
{
   var base_image = new Image();
      base_image.crossOrigin = "Anonymous";


      base_image.src =tagURL;

      // var base64Image = new Image();
      // base64Image.src = getBase64Image(base_image);

      // var processedImage = base_image.toDataURL();
      // console.log(processedImage);

      tagWidth = 50;
      tagHeight = 50;

      base_image.onload = function(){
        ctx.drawImage(base_image, cursorX, cursorY, tagWidth, tagHeight)//, 0, 0, canvas.width, (canvas.width * 0.5625));//, 0, 0, canvas.width, (canvas.width * 0.5625));
        canvasData = canvas.toDataURL("image/png");  //Save snapshot
      }

      // base_image.onload = function(){
      //   processedImage = new Image();
      //   processedImage.src = ('data:image/png;base64,'+getBase64Image(base_image));

      //   console.log(processedImage);

        //context.drawImage(base_image, 100, 100);

      //img = 'http://artpetty.com/wp-content/uploads/2010/12/smileyface.jpg'

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

// function mouseUpFunction(event)
// {
//   inputDown = false;

// }

// function mouseMoveFunction(event) {


// }

function getInputPosition(event) {

  cursorX = (event.pageX) ? event.pageX : event.touches[0].pageX;
  cursorY = (event.pageY) ? event.pageY : event.touches[0].pageY;
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


  function clearCanvas(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    canvasData = canvas.toDataURL();  //Save snapshot

  }

  $("#colorRed").click(function(){
    cursorColor = "red";
    drawBrushExample();
    indentButton($(this));
  });
  $("#colorOrange").click(function(){
    cursorColor = "orange";
    drawBrushExample();
  });
  $("#colorYellow").click(function(){
    cursorColor = "yellow";
    drawBrushExample();
  });
  $("#colorGreen").click(function(){
    cursorColor = "green";
    drawBrushExample();
  });
  $("#colorBlue").click(function(){
    cursorColor = "blue";
    drawBrushExample();
  });
  $("#colorPurple").click(function(){
    cursorColor = "purple";
    drawBrushExample();
  });
  $("#colorBlack").click(function(){
    cursorColor = "black";
    drawBrushExample();
  });
  $("#colorGray").click(function(){
    cursorColor = "gray";
    drawBrushExample();
  });
  $("#colorWhite").click(function(){
    cursorColor = "white";
    drawBrushExample();
  });

  $("#sizeSlider").click(function(){
   if ($("#brushAdjustmentWindow").hasClass("hide"))
    {
      //$("#sizeSlider").text("Close Brush Size");

      $("#brushAdjustmentWindow").removeClass("hide");

      drawBrushExample();
    }

    else if (!$("#brushAdjustmentWindow").hasClass("hide"))
      {
        //$("#sizeSlider").html("Brush Size");
        //$("#sizeSlider").removeClass("openSlider");
        //$("#sizeSlider").text("Open Brush Size");
        $("#sizeSlider").css("border", "3px lightgray outset");
        $("#brushAdjustmentWindow").addClass("hide");
        $("#sliderExample").addClass("hide");
        $("#sliderWrapper").addClass("hide");
        $("#sliderBar").addClass("hide");
        $("#sliderHandle").addClass("hide");
      }
   });


 $("#sliderHandle").on(inputDown, handleDown);
 $("#sliderWrapper").on(inputMove, resizeCursor);
 $(window).on(inputUp, handleUp);

  function handleDown(){
    handleClicked=true;
  }

function resizeCursor(event)
  {
   var sliderOffset = $("#sliderBar").offset().left;
   var sliderWidth = $("#sliderBar").outerWidth();

   if (handleClicked)
     {
   getInputPosition(event);
   slidePercent = Math.min(Math.max((((cursorX - sliderOffset) / sliderWidth) * 80), 0),80);

   $("#sliderHandle").css("left", slidePercent+"%");
      cursorSize = (20 * (slidePercent * 0.015)+2);

      drawBrushExample();

     }


  }

function handleUp(){
    handleClicked=false;
  }



  //working on this function to be called by any button clicked and then un-indent all other buttons.
function indentButton(element){

    element.css("border", "3px lightgray inset");
  }

  $('#saveCanvas').on('click', function(e)
  {
    postAJAXImage();
  });

function postAJAXImage ()
  {
    var row = String($('#coordinates').attr('data-id')).substr(0,1);
    var column = String($('#coordinates').attr('data-id')).substr(1,1);
    //console.log('ROW' + row);
    //console.log('COL' + column);
    canvasData = canvas.toDataURL("image/png");
    parsedData = canvasData.replace('data:image/png;base64,', '');
    var imageData = {
      'image' : parsedData,
      'row' : row,
      'column' : column
    }
     //console.log(parsedData);
    console.log('saving...');
    //console.log(parsedData)
    $.ajax({
      'method' : 'POST',
      'url' : '/',
      'data' : imageData,
      'success' : function(data)
      {
        console.log('picture SAVED');
        console.log(parsedData);
      },
      'error' : function()
      {
        console.log('SNAKES man GODDAM SNAKES i told you')
      },
      'complete' : function()
      {

      }
    })

  }



$('#paletteMoveTab').on('mousedown',function(e)
{
  mobilePalette = true;

});

$('#palettePicker').on('mousedown',function(e)
{



});

$(window).on('mouseup',function(e)
{
  mobilePalette = false;
  mobileNavBar=false;

});




}

//windowResizeFunction();
