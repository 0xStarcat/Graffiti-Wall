var previewBox;
var previewBoxWidth;
var previewBoxWidth;

$('document').ready(function()
{
  previewBox = $('#previewBox');

  console.log('Imgur connection... standing by!')
});

function imgurAjaxHit(searchTerm, popularSearch, sort)
{

  console.log(searchTerm);

  var url = '/search/'+searchTerm;

  //https://api.imgur.com/3/gallery/image/
  console.log('imgur ajax...');

  // data = {
  //   "url" : '/api.imgur.com/3/gallery/search/top/week/0/?q_any='+searchTerm+'&q_type=jpg'
  // }

  //Hot gallery https://api.imgur.com/3/gallery/hot/viral/0.json

  $.ajax({
    'type' : 'GET',
    'url' : url,
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
    galleryWrapper.empty();
    var id = 0;
      results.data.forEach(function(result)
      {
         console.log(result.link.substr(-4))
          if (result.link.substr(-4) === '.jpg')
          {

            var imageResult = $('<img data-id ='+id+' class="imageResult" src='+result.link+'>');
            id++;
            galleryWrapper.append(imageResult);

          }
      })


  $('.imageResult').on('click', function(e)
    {
      tagURL = $(this).attr('src');
      $('#myCanvas').css('cursor','url('+tagURL+') 32 32, crosshair')

      clearClickedBorders();
      $(this).addClass('clicked');
      console.log(tagURL);

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
  previewImage = $('#previewImage');

  previewImage.attr('src', img_url);
  $('#cursorImagePreview').attr('src', img_url);
  console.log(previewImage.innerWidth(), previewImage.innerHeight())

  tagWidth = previewBoxWidth;
  tagHeight = previewBoxHeight;

}

function clearClickedBorders()
{
  $('.clicked').each(function(border)
  {
    $(this).removeClass('clicked');
  })
}
