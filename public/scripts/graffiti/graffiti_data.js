$('document').ready(function()
{
  console.log('Graffiti Data... online.')
});

function postAJAXImage ()
{
  var row = String($('#coordinates').attr('data-id')).substr(0,1);
  var column = String($('#coordinates').attr('data-id')).substr(1,1);
  canvasData = canvas.toDataURL("image/png");
  parsedData = canvasData.replace('data:image/png;base64,', '');
  var imageData = {
    'image' : parsedData,
    'row' : row,
    'column' : column
  }
  ajax_this('POST','/',imageData,graffiti_imagesave_success,undefined)
}

function graffiti_imagesave_success(data)
{
  console.log('Graffiti saved');
}

function getAJAXImage (row, column)
{
  var coordinates = {
    'row' : row,
    'column' : column
  }
  var url = "/load/"+row+"/"+column;
  ajax_this('POST',url,coordinates,graffiti_imageload_success,undefined)
}

function graffiti_imageload_success(data)
{
  console.log('Graffiti loaded!')
  var img = new Image;
  img.src = ('data:image/png;base64,'+data.imageurl);
  img.onload = function(){
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, (canvas.width * 0.5625));
  canvasData = canvas.toDataURL("image/png");
  };
  $('.graffitiProgress').hide();
}

function postLog(post_type)
{

  var date = new Date();
  var imageCenterX = (crosshairX / canvas.width); //Get a percentage from LEFT edge of canvas
  var imageCenterY = (crosshairY / canvas.height); //Get a percentage from TOP edge of canvas
  var imageWidth = (tagWidth / canvas.width); //Get the width as a percentage of the canvas width
  var imageHeight = (tagHeight / canvas.height); //Get a height as a percentage of the canvas height

  var logData = {
    'username' : username,
    'row' : row,
    'column' : column,
    'post_type' : post_type,
    'date' : date,
    'imageCenterX' : imageCenterX,
    'imageCenterY' : imageCenterY,
    'imageWidth' : imageWidth,
    'imageHeight' : imageHeight,
  }
  ajax_this('POST','/savelog',logData,log_success,undefined);
}

function log_success(data)
{
  console.log('log posted of an action');
}

function loadImageCoordinates()
{
  var url = '/imageCoordinates/'+row+'/'+column;
  ajax_this('GET',url,undefined,load_coordinates_success,load_coordinates_complete)
}
function load_coordinates_success(data)
{
  data.forEach(function(box)
  {
    var boxLeft = box.imagecenterx*100;
    var boxTop = box.imagecentery*100;
    var boxWidth = box.imagewidth*100;
    var boxHeight = box.imageheight*100;
    var username = box.username;
    var zindex = 0;

    if (boxLeft < 10)
    {
      var selectionBox = $('<a class="selectionBox tooltipped" data-position="right" data-delay="50" data-tooltip="Tagged by: '+username+'" html="true" style="display:inline;position:absolute;left:'+boxLeft+'%;top:'+boxTop+'%;width:'+boxWidth+'%;height:'+boxHeight+'%;z-index:'+zindex+'"></a>');
    } else {
      var selectionBox = $('<a class="selectionBox tooltipped" data-position="left" data-delay="50" data-tooltip="Tagged by: '+username+'" html="true" style="display:inline;position:absolute;left:'+boxLeft+'%;top:'+boxTop+'%;width:'+boxWidth+'%;height:'+boxHeight+'%;z-index:'+zindex+'"></a>');
    }
    canvasWrap.append(selectionBox);

  })
  toggleViewMode();
  console.log('loaded image coordinates from DB', data)
};

function load_coordinates_complete()
{
  $('.tooltipped').tooltip({delay: 50});
};
