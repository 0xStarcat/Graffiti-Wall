$('document').ready(function()
{
  console.log('homepage loaded!');
  ajax_this('GET', '/loadHomepage', undefined, homepage_ajax_success, undefined);
});

function homepage_ajax_success(data)
{
  displayImages(data);
  ajax_this('GET', '/checkLocks', undefined, check_locks_success, undefined);
}

function displayImages(data)
{

  var progressBars = $(".progressWrapper");
  $(".progressWrapper").each(function(bar)
  {
    $(this).hide();
  });

  data.forEach(function(image){
    var row = image.row;
    var col = image.col;
    $('#grid'+row+col+' > img').attr('src', 'data:image/png;base64,'+image.imageurl);

  });
};

function check_locks_success(data)
{
  var grids = $('.grid');
  for (var i = 0; i < grids.length; i++)
  {
    var gridLock = data[i][Object.keys(data[i])[0]];
    if (gridLock === true)
    {
      $('.grid').eq(i).removeClass('unlocked');
      $('.grid').eq(i).addClass('locked');
    }
  }
};

