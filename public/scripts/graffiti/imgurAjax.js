$('document').ready(function()
{
  console.log('Imgur connection... standing by!')
});

function imgurAjaxHit()
{
  var searchTerm = $('#imageSearchBox').val();
  console.log(searchTerm);

  //var authorization = '/oauth2/authorize?client_id='+clientID+'&response_type=token&state=APPLICATION_STATE/'
  var url = '/search/'+searchTerm;//'https://api.imgur.com/3/gallery/hot/viral/0.json'

  //https://api.imgur.com/3/gallery/image/
  console.log('imgur ajax...');

  // data = {
  //   "url" : '/api.imgur.com/3/gallery/search/top/week/0/?q_any='+searchTerm+'&q_type=jpg'
  // }

  $.ajax({
    'type' : 'GET',
    'url' : url,
    'success' : function(data)
    {
      var results = JSON.parse(data.stuff);
      console.log(results);
      console.log('Images returned!');

      parseImageResults(results);
    },
    'error' : function()
    {
       console.log('BACKEND SNAKES!')
    }
  })

  // $.ajax({
  //   'type' : 'GET',
  //   'url' : url,
  //   'headers' : {
  //       Authorization: 'Client-ID ' + clientID,
  //       Accept: 'application/json'
  //     },
  //   'success' : function(data)
  //   {
  //     console.log(data);
  //     console.log('Images returned!');

  //     parseImageResults(data);

  //   },
  //   'error' : function()
  //   {
  //      console.log('IMGUR GOT SNAKES!')
  //   },
  //   'complete' : function()
  //   {

  //   }
  // })
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

            var imageResult = $('<div><img data-id ='+id+' class="imageResult" src='+result.link+'></div>');
            id++;
            galleryWrapper.append(imageResult);
          }
      })


        $('.imageResult').on('click', function(e)
          {
            tagURL = $(this).attr('src');
             console.log(tagURL);
          });
          //console.log(result);


  } else {
    console.log('no results')
  }

}
