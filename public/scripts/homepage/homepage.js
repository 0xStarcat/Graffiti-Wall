$('document').ready(function()
{
  console.log('homepage loaded!');

  ajaxHomepage();
});

function ajaxHomepage()
{
  $.ajax({
    'method' : 'GET',
    'url' : '/loadHomepage',
    'success' : function(data)
    {
      console.log('homepage images loaded');
      //console.log(data);
      displayImages(data);
      checkLocks();
    },
    'error' : function()
    {
      console.log('homepage SNAKES WHY DID IT HAVE TO BE');
    },
    'compete': function()
    {

    }
  })
};

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
}

function checkLocks()
{
  $.ajax({
    'method' : 'GET',
    'url' : '/checkLocks',
    'success' : function(data)
    {
      var grids = $('.grid');

      for (var i = 0; i < grids.length; i++)
      {
        var gridLock = data[i][Object.keys(data[i])[0]];
        //obj[Object.keys(obj)[0]]

        if(gridLock === false)
        {


        } else if (gridLock === true){

          $('.grid').eq(i).removeClass('unlocked');
          $('.grid').eq(i).addClass('locked');
        }
      }
      console.log(data);
    },
    'error' : function()
    {

    }
  })
}
