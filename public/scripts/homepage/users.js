$('document').ready(function()
{

  buttonListeners()

});

function buttonListeners()
{
  $('button').on('click', function(e)
  {
    // e.preventDefault();
    console.log('submit new user');
    //createNewUserAjax();
  });

  $('.screenshotSave').on('click', function(e)
  {
    // var id = '#'+$(this).parent().parent().attr('data-id').split('_')[1];
    // console.log(id);
    // var img = $(id).attr('src');

    // downloadScreenshot(img);
    console.log('Save')
  });
  $('.screenshotShare').on('click', function(e)
  {
    var id = $(this).parent().parent().attr('data-id').split('_')[1];
    var image = $('#'+id).attr('src');
    console.log('Share' + id)
    shareOnTwitter(image);

  });
   $('.screenshotDelete').on('click', function(e)
  {
    var element = $(this).parent().parent().remove();
    var id = $(this).parent().parent().attr('data-id').split('_')[0];
    var username = $(this).parent().parent().attr('data-id').split('_')[1];

    deleteScreenshot(username, id);
  });

}

function shareOnTwitter(img)
{
  // var imageData =
  var url = 'https://upload.twitter.com/1.1/'+img+'/upload.json'
   $.ajax({
      'method' : 'POST',
      'url' : url,
      'success' : function(data)
      {
        conosle.log('twitter image shared!')
      },
      'error' :function()
      {
        console.log('twitter FAILED');
      }
    })
}

function deleteScreenshot(id, username, element)
{
  $.ajax({
    'method' : 'DELETE',
    'url' : '/deleteScreenshot/'+username+'/'+id,
    'success' : function(data)
    {
      console.log(username+'\s picture #'+id+'delete');
    },
    'error' : function()
    {
      console.log('could not delete photo');
    }
  })
}

function downloadScreenshot(img)
  {
    //canvasData = canvas.toDataURL("image/png");
    this.href = img;//document.getElementById(canvasId).toDataURL();
    this.download = 'newfile.png';//filename;
    console.log(img, 'save')
  }
