var brushLocked;
var sliderMove = false;
var menuFitMultiplier = 0.25;


$('document').ready(function()
{
  var row = String($('#coordinates').attr('data-id')).substr(0,1);
  var column = String($('#coordinates').attr('data-id')).substr(1,1);
  var cursorImage =  $('#cursorImagePreview');
  var url = "/load/"+row+"/"+column;
  getAJAXImage (row, column);
  unlockBrush();

  window.onresize = windowResizeFunction;
  document.addEventListener("resize", windowResizeFunction, false);

});


function windowResizeFunction() // Source = http://jsfiddle.net/m1erickson/V6SVz/
{

ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
//alert("hello");
canvas.width = window.innerWidth;
canvas.height = (window.innerWidth * 0.5625); //16:9 is height 56.25% of width. 4:3 is height 75% of width.
brushSizeCanvas.width = window.innerWidth;
brushSizeCanvas.height = (window.innerHeight);

//##Resize Dependent tag dimensions
//need to resize the preview BOX (for when search window is open)
//and the IMAGE's size that is tagged on the wall
 if(imgurSearch)
  {

    sizePreviewBox()
  }
    resizeTagSize();

  //######
  // scale and redraw the canvas content
  var img = new Image();
  img.src = canvasData;//load snapshot

  img.onload = function () {
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, (canvas.width * 0.5625));
  }
}



function sizePreviewBox()
{
  //keep it square
  //menuFitMultiplier = depending on size of menu (collapsed or expanded) image will expand.
  //imageSliderMultiplier = user controlled slider on screen
  previewBoxWidth = canvas.width * menuFitMultiplier * imageSliderMultiplier;
  previewBoxHeight = canvas.width * menuFitMultiplier * imageSliderMultiplier;

  console.log(previewBoxWidth, previewBoxHeight);

  previewBox.css({
      'height' : previewBoxHeight+'px',
      'width' : previewBoxWidth+'px'
    })

  resizeTagSize()
}

function resizeTagSize()
{
   tagWidth = (canvas.width * menuFitMultiplier) * imageSliderMultiplier;
   tagHeight = (canvas.width * menuFitMultiplier) * imageSliderMultiplier;

   console.log(tagWidth, tagHeight, 'TAGS')
   resizeCursorImage()
}

function resizeCursorImage()
{
  $('#cursorImagePreview').css({
    'width' : tagWidth,
    'height': tagHeight
  })
}

function moveCursorImagePreview()
{
  $('#cursorImagePreview').css({
    'top' : crosshairY+'px',
    'left' : crosshairX+'px'
  })
}

function drawDebug() {
  ctx.clearRect(0,0, 125, 50);
  ctx.font = "8px Arial";
  ctx.fillStyle = "rgba(0, 0, 200, 1)";
  ctx.fillText("Canvas Height: "+canvas.height, 8, 8);
  ctx.fillText("Canvas Width: "+canvas.width, 8, 16);
  ctx.fillText("Cursor X: "+cursorX.toFixed(0), 8, 24);
  ctx.fillText("Cursor Y: "+cursorY.toFixed(0), 8, 32);
  ctx.fillText("Slider Percent: "+slidePercent.toFixed(2), 8, 40);
  //ctx.fillText("RelativeX Value = "+relativeX, 8, 100);
  //ctx.fillText("RelativeY Value = "+relativeY, 8, 120);

}

function updateColorPicker() {
  var palettePicker = $('#palettePicker');
    cursorColor = palettePicker.text();
    drawBrushExample();
}

//Ajax to server to check if user is logged in or not
function unlockBrush()
{
  $.ajax({
    'method' : 'GET',
    'url' : '/unlockBrush',
    'success' : function(data)
    {
      if (data.brushLocked)
      {
        brushLocked = true;
        $('#myCanvas').css('cursor', 'auto');
        console.log(data.brushLocked);
      } else {
        brushLocked = false;

        console.log(data.brushLocked);
      }
    },
    'error' : function()
    {
      console.log('Could not reach SNAKES to unlock brush');
    },
    'complete' : function()
    {

    }

  })
}

function drawBrushExample(){

    brushCtx.clearRect(0,0,brushSizeCanvas.width,brushSizeCanvas.height);
      brushCtx.beginPath();
      //brushCtx.rect(25,25, cursorSize, cursorSize * 0.5625);
      brushCtx.arc(37,37, cursorSize, 3, Math.PI, true);

      brushCtx.closePath();
      brushCtx.fillStyle = cursorColor;
      brushCtx.fill();

  }

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
        //console.log(parsedData);
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

function getAJAXImage (row, column)
  {

    var coordinates = {
      'row' : row,
      'column' : column
    }

    var url = "/load/"+row+"/"+column;

    console.log('loading...');
    $.ajax({
      'method' : 'POST',
      'url' : url,
      'data' : coordinates,
      'success' : function(data)
      {
        console.log('picture loading');

          var img = new Image;
          img.src = ('data:image/png;base64,'+data.imageurl);

          img.onload = function(){
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, (canvas.width * 0.5625));
          canvasData = canvas.toDataURL("image/png");
          };
          //data = canvas.toDataURL("image/png");  //Save snapshot

      },
      'error' : function()
      {
        console.log('SNAKES man GODDAM SNAKES i told you')
      },
      'complete' : function()
      {
        //data = canvas.toDataURL("image/png");  //Save snapshot
      }
    })
  }


  //Unlock page once you leave the page


  function unlockPage()
  {
    console.log('*********unlocking***********');
    var row = String($('#coordinates').attr('data-id')).substr(0,1);
    var column = String($('#coordinates').attr('data-id')).substr(1,1);


    var coordinates ={
      'row' : row,
      'column' : column
    }
    $.ajax({
      'method' : 'POST',
      'url' : '/unlockpage',
      'data' : coordinates,
      'success' : function(data)
      {
        console.log('unlock SUCCESSFUL');

      },
      'error' : function()
      {
        console.log('unlock SNAKES ERROR');

      },
      'complete' : function()
      {
      }
    })
  }


