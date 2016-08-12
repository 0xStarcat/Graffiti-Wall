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
      console.log(data);
      displayImages(data);
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
  data.forEach(function(image){
    var row = image.row;
    var col = image.col;
    $('#grid'+row+col+' > img').attr('src', 'data:image/png;base64,'+image.imageurl);
    console.log(image.row);
  });
}
