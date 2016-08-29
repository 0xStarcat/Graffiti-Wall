var brushLocked = true;
var sliderMove = false;
var brushSliderMove = false;
var menuFitMultiplier = 0.25;
var row;
var column;
var username;
var paintLogged = false;
var canvasWrap;
$('document').ready(function()
{
  canvasWrap = $('#canvasWrap');
  row = String($('#coordinates').attr('data-id')).substr(0,1);
  column = String($('#coordinates').attr('data-id')).substr(1,1);
  username = String($('.welcome').attr('data-id'));
  var cursorImage =  $('#cursorImagePreview');
  var url = "/load/"+row+"/"+column;
  getAJAXImage (row, column);
  loadImageCoordinates();

});

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

