var brushLocked = true;
var sliderMove = false;
var brushSliderMove = false;
var menuFitMultiplier = 0.25;
var row;
var column;
var username;
var paintLogged = false;
var canvasWrap;
var lockStatus;
$('document').ready(function()
{
  canvasWrap = $('#canvasWrap');
  row = String($('#coordinates').attr('data-id')).substr(0,1);
  column = String($('#coordinates').attr('data-id')).substr(1,1);
  username = String($('.welcome').attr('data-id'));
  var cursorImage =  $('#cursorImagePreview');
  var url = "/load/"+row+"/"+column;
  getAJAXImage (row, column);
  unlockBrush();
  window.onresize = windowResizeFunction;
  document.addEventListener("resize", windowResizeFunction, false);
  loadImageCoordinates();

});


function windowResizeFunction() // Source = http://jsfiddle.net/m1erickson/V6SVz/
{

ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
canvas.width = window.innerWidth;
canvas.height = (window.innerWidth * 0.5625); //16:9 is height 56.25% of width. 4:3 is height 75% of width.

canvasWrap.css({
  'width' : canvas.width,
  'height' :canvas.height,
});

//##Resize Dependent tag dimensions
//need to resize the preview BOX (for when search window is open)
//and the IMAGE's size that is tagged on the wall
 if(imgurSearch)
  {

    sizePreviewBox()
  }
  resizeTagSize();
  //#
  //scale and redraw the canvas content
  //#
  var img = new Image();
  img.src = canvasData;//load snapshot

  img.onload = function () {
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, (canvas.width * 0.5625));
  }
  //#
  //#Cursor Size adjustment based on window size
  //#
  if (!brushLocked)
  {
    adjustBrushSize();
  }
}

function drawCursor()
{
  var paletteWidth = $("#palette").outerWidth();

  if (cursorX > 0 && cursorX < (window.innerWidth - paletteWidth ))
    {
      ctx.beginPath(); //every object goes between beginPath() and closePath();
      ctx.arc(cursorX, cursorY, cursorSize, 3, Math.PI, true) //draws a circle arrgs = (x, y, radius length, degrees in radii to render, Math.PI, and clockwise true or false)
      ctx.closePath();
      ctx.fillStyle =cursorColor; //CSS color in quotes
      ctx.fill(); //command to fill with above color
      var canvasData = canvas.toDataURL("image/png");
  }

  if (!paintLogged)
  {
    postLog('paint');
    paintLogged = true;
  }
}

function clearCanvas(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
  canvasData = canvas.toDataURL();  //Save snapshot
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

  var $previewCanvas = $('#previewCanvas')
  $previewCanvas.css({
      'height' : previewBoxHeight+'px',
      'width' : previewBoxWidth+'px'
    })

  var $hiddenPreviewCanvas = $('#originalPixels')
  $hiddenPreviewCanvas.css({
      'height' : previewBoxHeight+'px',
      'width' : previewBoxWidth+'px'
    })

  var $progressWrapper = $('.previewProgress')
  $progressWrapper.css({
    'top' : $previewCanvas.position().top+'px',
    'left' : $previewCanvas.position().left+'px',
    'height' : previewBoxHeight+'px',
    'width' : previewBoxWidth+'px'
  })

  if (tagURL == undefined)
  {
    $('.previewProgress').addClass('hide');
  } else{
    showPreviewImage(tagURL);
  }
  resizeTagSize()
}

function resizeTagSize()
{
   tagWidth = (canvas.width * menuFitMultiplier) * imageSliderMultiplier;
   tagHeight = (canvas.width * menuFitMultiplier) * imageSliderMultiplier;
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

function drawDebug()
{
  ctx.clearRect(0,0, 125, 50);
  ctx.font = "8px Arial";
  ctx.fillStyle = "rgba(0, 0, 200, 1)";
  ctx.fillText("Canvas Height: "+canvas.height, 8, 8);
  ctx.fillText("Canvas Width: "+canvas.width, 8, 16);
  ctx.fillText("Cursor X: "+cursorX.toFixed(0), 8, 24);
  ctx.fillText("Cursor Y: "+cursorY.toFixed(0), 8, 32);
  ctx.fillText("Slider Percent: "+slidePercent.toFixed(2), 8, 40);
}

function updateColorPicker() {
  var palettePicker = $('#palettePicker');
    cursorColor = palettePicker.text();
    drawBrushExample();
}

function adjustBrushSize(){

  cursorSize = (canvas.width * 0.01) * $('#brushSizeSlider').val();
  drawBrushExample();
}

//Check html element #lockStatus for lock status
function unlockBrush()
{
  lockStatus = $('#lockStatus').attr('data-id');
  console.log(lockStatus)
  if (lockStatus == 'true' || lockStatus == undefined)
  {
    brushLocked = true;
     console.log('LOCK STATUS', brushLocked)
  } else {
    brushLocked = false;
    console.log('LOCK STATUS', brushLocked)
    grabUnlockedElements();
  }
}

function grabUnlockedElements()
{
   brushSizeCanvas = document.getElementById("brushExampleCanvas");
   brushCtx = brushSizeCanvas.getContext("2d");
   brushSizeCanvas.width = window.innerWidth;
   brushSizeCanvas.height = (window.innerHeight);
}

function drawBrushExample(){

if (!brushLocked)
  {
    brushCtx.clearRect(0,0,brushSizeCanvas.width,brushSizeCanvas.height);
    brushCtx.beginPath();
    brushCtx.arc(27.5,27.5, cursorSize, 3, Math.PI, true);
    brushCtx.closePath();
    brushCtx.fillStyle = cursorColor;
    brushCtx.fill();
  }
}

function postAJAXImage ()
{
  var row = String($('#coordinates').attr('data-id')).substr(0,1);
  var column = String($('#coordinates').attr('data-id')).substr(1,1);
  canvasData = canvas.toDataURL("image/png");
  parsedData = canvasData.replace('data:image/png;base64,', '');
  var imageData = {
    'image' : parsedData,
    'row' : row,
    'column' : column
  }
  ajax_this('POST','/',imageData,graffiti_imagesave_success,undefined)
}

function graffiti_imagesave_success(data)
{
  console.log('Graffiti saved');
}

function getAJAXImage (row, column)
{
  var coordinates = {
    'row' : row,
    'column' : column
  }
  var url = "/load/"+row+"/"+column;
  ajax_this('POST',url,coordinates,graffiti_imageload_success,undefined)
}

function graffiti_imageload_success(data)
{
  console.log('Graffiti loaded!')
  var img = new Image;
  img.src = ('data:image/png;base64,'+data.imageurl);
  img.onload = function(){
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, (canvas.width * 0.5625));
  canvasData = canvas.toDataURL("image/png");
  };
  $('.graffitiProgress').hide();
}

//Unlock page once you leave the page, called from graffiti/index.html
function unlockPage()
{
  console.log('*********unlocking***********');
  var row = String($('#coordinates').attr('data-id')).substr(0,1);
  var column = String($('#coordinates').attr('data-id')).substr(1,1);
  var coordinates ={
    'row' : row,
    'column' : column
  }
  ajax_this('POST','/unlockpage',coordinates,unlock_success,undefined);
}

function unlock_success(data)
{
  console.log('unlock SUCCESSFUL');
}

function tagWall()
{
  resizeTagSize();
  var base_image = new Image();
  base_image.crossOrigin = "Anonymous";
  previewData = previewCanvas.toDataURL("image/png");
  base_image.src = previewData;
  ctx.drawImage(base_image, crosshairX, crosshairY, tagWidth, tagHeight)
  canvasData = canvas.toDataURL("image/png");  //Save snapshot
  postLog('image');

}

function postLog(post_type)
{

  var date = new Date();
  var imageCenterX = (crosshairX / canvas.width); //Get a percentage from LEFT edge of canvas
  var imageCenterY = (crosshairY / canvas.height); //Get a percentage from TOP edge of canvas
  var imageWidth = (tagWidth / canvas.width); //Get the width as a percentage of the canvas width
  var imageHeight = (tagHeight / canvas.height); //Get a height as a percentage of the canvas height

  var logData = {
    'username' : username,
    'row' : row,
    'column' : column,
    'post_type' : post_type,
    'date' : date,
    'imageCenterX' : imageCenterX,
    'imageCenterY' : imageCenterY,
    'imageWidth' : imageWidth,
    'imageHeight' : imageHeight,
  }
  ajax_this('POST','/savelog',logData,log_success,undefined);
}

function log_success(data)
{
  console.log('log posted of an action');
}

function loadImageCoordinates()
{
  var url = '/imageCoordinates/'+row+'/'+column;
  ajax_this('GET',url,undefined,load_coordinates_success,load_coordinates_complete)
}
function load_coordinates_success(data)
{
  data.forEach(function(box)
  {
    var boxLeft = box.imagecenterx*100;
    var boxTop = box.imagecentery*100;
    var boxWidth = box.imagewidth*100;
    var boxHeight = box.imageheight*100;
    var username = box.username;
    var zindex = 0;

    if (boxLeft < 10)
    {
      var selectionBox = $('<a class="selectionBox tooltipped" data-position="right" data-delay="50" data-tooltip="Tagged by: '+username+'" html="true" style="display:inline;position:absolute;left:'+boxLeft+'%;top:'+boxTop+'%;width:'+boxWidth+'%;height:'+boxHeight+'%;z-index:'+zindex+'"></a>');
    } else {
      var selectionBox = $('<a class="selectionBox tooltipped" data-position="left" data-delay="50" data-tooltip="Tagged by: '+username+'" html="true" style="display:inline;position:absolute;left:'+boxLeft+'%;top:'+boxTop+'%;width:'+boxWidth+'%;height:'+boxHeight+'%;z-index:'+zindex+'"></a>');
    }
    canvasWrap.append(selectionBox);

  })
  toggleViewMode();
  console.log('loaded image coordinates from DB', data)
};

function load_coordinates_complete()
{
  $('.tooltipped').tooltip({delay: 50});
};

