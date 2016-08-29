var previewBox;
var previewCanvas;
var previewBoxWidth;
var previewBoxHeight;

var imageCountID;
var ajaxData;
var pageNumber = 0;
var previewCanvas;
var hiddenPreviewCanvas;
var previewContext;
var preview_64bit;
var previewData;

$('document').ready(function()
{
  previewBox = $('#previewBox');
  previewCanvas = document.getElementById('previewCanvas');
  previewContext = previewCanvas.getContext("2d");
  hiddenPreviewCanvas = document.getElementById('originalPixels');
  hiddenPreviewContext = hiddenPreviewCanvas.getContext("2d");
  console.log('Imgur connection... standing by!')


});
function imgurAjaxHit(searchTerm, popularSearch, sort, imageType, page)
{
  var url = '/searchImgur';
  ajaxData = {
    'searchTerm' : searchTerm,
    'popularSearch' : popularSearch,
    'sort' : sort,
    'imageType' : imageType,
    'page' : pageNumber
  }
  ajax_this('POST', url, ajaxData, imgur_ajax_success, undefined)
  if (imageType == 'jpg')
  {
    imgurAjaxHit(searchTerm, popularSearch, sort, 'png', page)
  }
}

function imgur_ajax_success(data)
{
  var results = JSON.parse(data.stuff);
  parseImageResults(results);
  console.log(results)
}

function parseImageResults(results)
{
  var galleryWrapper = $('#galleryWrapper');
  if (results.data.length > 0)
  {

  //#
  //append each result
  //if doing text search, append jpegs first, then 2nd ajax for pngs
  //This is to exclude gifs from results. Also jpeg results less meme-y
  //#
  results.data.forEach(function(result)
  {
    var link = result.link;
      if (link.substr(-4) === '.jpg' || link.substr(-4) === '.png')
      {
        console.log(result.link.substr(-4))
        var imageResult = $('<img data-id ='+imageCountID+' class="imageResult" src='+link+'>');
        imageCountID++;
        galleryWrapper.append(imageResult);

      } else {
        console.log('Unable to parse file-types from results')
      }
  })
//#
//If doing popular image search, keep searching until 50 images found
//Because the popular image search also returns gifs and blog-style articles
//#
  if (imageCountID < 50 && ajaxData.popularSearch == true)
    {
      console.log('searching for more popular images...')

      imgurAjaxHit(ajaxData.searchTerm, ajaxData.popularSearch, ajaxData.sort, ajaxData.imageType);
      pageNumber++;
    }
//#
//Add click listener to each image result
//Set tagURL, handle border effects
//#

  $('.imageResult').on('click', function(e)
    {
      if (!collapseSearch)
      {
        handleMenuExpand();
      }
      tagURL = $(this).attr('src');
      $('#myCanvas').css('cursor','url('+tagURL+') 32 32, crosshair')

      clearClickedBorders();
      $(this).addClass('clicked');
      console.log(tagURL);

      resetAll(); //reset filter sliders
      showPreviewImage(tagURL);
    });

  //No results found
  } else {
    galleryWrapper.empty();
    var imageResult = $('<p style="text-align: center; color:white;">No Results Found </p>');
    galleryWrapper.append(imageResult);
  }
}

function showPreviewImage(img_url)
{
  //#
  //Clear old canvas rendering
  //#
  $('.previewProgress').removeClass('hide');
  previewCanvas.width = previewBoxWidth;
  previewCanvas.height = previewBoxHeight;
  hiddenPreviewCanvas.width = previewBoxWidth;
  hiddenPreviewCanvas.height = previewBoxHeight;
  previewContext.clearRect(0,0,previewCanvas.width, previewCanvas.height);
  hiddenPreviewContext.clearRect(0,0,hiddenPreviewCanvas.width, hiddenPreviewCanvas.height);


  preview_64bit = new Image();
  preview_64bit.crossOrigin = "Anonymous";
  preview_64bit.src = img_url;

  //#
  //slap new image to the canvas
  //#
  preview_64bit.onload = function(){
    previewContext.drawImage(preview_64bit, 0, 0, previewCanvas.width, previewCanvas.height)//, 0, 0, canvas.width, (canvas.width * 0.5625));//, 0, 0, canvas.width, (canvas.width * 0.5625));
    previewData = previewCanvas.toDataURL("image/png");
    hiddenPreviewContext.drawImage(preview_64bit, 0, 0, previewCanvas.width, previewCanvas.height)//, 0, 0, canvas.width, (canvas.width * 0.5625));//, 0, 0, canvas.width, (canvas.width * 0.5625));
    pixels = hiddenPreviewContext.getImageData(0,0,previewCanvas.width,previewCanvas.height); //Moved to imgurAjax.showPreviewImage(img_url)-- wolphox
    Filters.changeAll();
    $('.previewProgress').addClass('hide');
  }
  //#
  //Add the image to the cursor preview
  //#
  $('#cursorImagePreview').attr('src', previewData);
  resizeTagSize();
}

//#
//Clear the border css effect from other boxes
//When a new box is clicked
//#
function clearClickedBorders()
{
  $('.clicked').each(function(border)
  {
    $(this).removeClass('clicked');
  })
}
