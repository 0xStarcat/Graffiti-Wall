$(document).ready(function()
{
  window.onresize = windowResizeFunction;
  console.log('Window resize logic... standing by!')
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

function adjustBrushSize(){

  cursorSize = (canvas.width * 0.01) * $('#brushSizeSlider').val();
  drawBrushExample();
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
