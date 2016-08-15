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

  //console.log(searchTerm);


  var url = '/searchImgur';

  ajaxData = {
    'searchTerm' : searchTerm,
    'popularSearch' : popularSearch,
    'sort' : sort,
    'imageType' : imageType,
    'page' : pageNumber
  }
  //https://api.imgur.com/3/gallery/image/
  console.log('imgur ajax...');

  // data = {
  //   "url" : '/api.imgur.com/3/gallery/search/top/week/0/?q_any='+searchTerm+'&q_type=jpg'
  // }

  //Hot gallery https://api.imgur.com/3/gallery/hot/viral/0.json

  $.ajax({
    'type' : 'POST',
    'url' : url,
    'data' : ajaxData,
    'success' : function(data)
    {
      var results = JSON.parse(data.stuff);
      //console.log(results);
      console.log('Images returned!');

      parseImageResults(results);

    },
    'error' : function(err)
    {
       console.log('BACKEND SNAKES!')
       console.log(err);
    },
    'complete' : function()
    {

      if (imageType === 'jpg' && popularSearch == false)
      {
        imgurAjaxHit(searchTerm, popularSearch, sort, 'png');
        console.log('now searching for pngs...')
      }
    }
  })
}

function parseImageResults(results)
{
  //debugger;
  console.log(results);
  var galleryWrapper = $('#galleryWrapper');
  if (results.data.length > 0)
  {

  //#
  //append each result
  //if doing text search, append jpegs first then 2nd ajax for pngs
  //This is to exclude gifs from results. Also jpeg results less meme-y
  //#

      results.data.forEach(function(result)
      {
        var link = result.link;
         console.log(result.link.substr(-4))
          if (link.substr(-4) === '.jpg' || link.substr(-4) === '.png')
          {

            var imageResult = $('<img data-id ='+imageCountID+' class="imageResult" src='+link+'>');
            imageCountID++;
            galleryWrapper.append(imageResult);

          } else {


          }


      })
//#
//#
//If doing popular image search, keep searching until 50 images found
//#
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
      tagURL = $(this).attr('src');
      $('#myCanvas').css('cursor','url('+tagURL+') 32 32, crosshair')

      clearClickedBorders();
      $(this).addClass('clicked');
      console.log(tagURL);

      resetAll(); //reset filter sliders
      showPreviewImage(tagURL);
      // $('#myCanvas').css('cursor', 'pointer');
    });
    //console.log(result);


  } else {
    console.log('no results')
  }

}

function showPreviewImage(img_url)
{
  //#
  //create a new canvas
  //#

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
  //slap image to the canvas
  //#

      preview_64bit.onload = function(){
        previewContext.drawImage(preview_64bit, 0, 0, previewCanvas.width, previewCanvas.height)//, 0, 0, canvas.width, (canvas.width * 0.5625));//, 0, 0, canvas.width, (canvas.width * 0.5625));
        previewData = previewCanvas.toDataURL("image/png");
        hiddenPreviewContext.drawImage(preview_64bit, 0, 0, previewCanvas.width, previewCanvas.height)//, 0, 0, canvas.width, (canvas.width * 0.5625));//, 0, 0, canvas.width, (canvas.width * 0.5625));
        pixels = hiddenPreviewContext.getImageData(0,0,previewCanvas.width,previewCanvas.height); //Moved to imgurAjax.showPreviewImage(img_url)-- wolphox
        Filters.changeAll();
        //console.log(previewData);
      }

  $('#cursorImagePreview').attr('src', previewData);
  // previewImage = $('#previewImage');
  // previewImage.attr('src', img_url);
  //console.log(previewImage.innerWidth(), previewImage.innerHeight())
  console.log(previewBoxWidth, previewBoxHeight)
  resizeTagSize();
  // tagWidth = previewBoxWidth;
  // tagHeight = previewBoxHeight;
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
