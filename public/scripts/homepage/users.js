$('document').ready(function()
{
  buttonListeners()
});

function buttonListeners()
{
  $('button').on('click', function(e)
  {
    console.log('submit new user');
  });

  $('.screenshot').on('click',function(e)
   {
    var enlargedScreenshot = $('<div class = "enlargedScreenshot"><img src="'+$(this).attr('src')+'"><button class="exitWindowButton">X</button></div>');
    $('body').append(enlargedScreenshot);

     $('.exitWindowButton').on('click', function(e)
      {
        $(this).parent().remove();
      })
   })

  $('.screenshotSave').on('click', function(e)
  {
    console.log('Save');
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

    deleteScreenshot(id, username);
  });

}

function shareOnTwitter(img)
  {
    var imageData = {
      'imageURL' : img
    }
    ajax_this('POST', '/tweet', imageData, twitter_success, undefined)
  }

function twitter_success(data)
  {
    console.log('twitter image shared!');
  }


function deleteScreenshot(id, username, element)
  {
    url = '/deleteScreenshot/'+id+'/'+username
    ajax_this('DELETE', url, undefined, delete_screenshot_success, undefined);

  }

function delete_screenshot_success()
  {
    console.log('Image deleted!');
  }

function downloadScreenshot(img)
  {
    this.href = img;
    this.download = 'newfile.png';
    console.log(img, 'save')
  }
