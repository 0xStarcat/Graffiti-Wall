var cursorModeButton;
var paintMode = true;

$('document').ready(function()
{
  cursorModeButton = $('#cursorMode');
  eventListeners();

})

function eventListeners()
{
    cursorModeButton.on('click',function(e)
  {
    if (paintMode)
    {
      paintMode = false;
      cursorModeButton.text('Paint Wall');

    } else
    {
      paintMode = true;
      cursorModeButton.text('Tag Wall');

      $("#imageSelectionWrapper").addClass("hide");
    }
    console.log('click!');
  });

  $('.exitWindowButton').on('click', function(e)
  {
    console.log('hide');

    if ( !$("#imageSelectionWrapper").hasClass("hide"))
    {
       $("#imageSelectionWrapper").addClass("hide");
       $('#openChooser').text('Open Image Chooser');
    } else {
      $(this).parent().addClass('hide');
    }
  });

  $('#openChooser').on('click',function(e)
  {
    if ( $("#imageSelectionWrapper").hasClass("hide"))
    {

     $("#imageSelectionWrapper").removeClass("hide");
      $('#openChooser').text('Close Image Chooser');
    } else {
       $("#imageSelectionWrapper").addClass("hide");
       $('#openChooser').text('Open Image Chooser');
    }
  });

  $('#imageSearchButton').on('click', function(e)
  {
    imgurAjaxHit();
  });
};

function movePalette()
{
   var wrapper = $('#paletteOuter');
   var wrapperLeft = cursorX;
   var wrapperTop = cursorY;

   if (wrapperLeft + wrapper.innerWidth() >= window.innerWidth)
   {
    wrapper.css({
      'left' : window.innerWidth - wrapper.innerWidth()
    });
   } else if ((wrapperTop + wrapper.innerHeight()) >= window.innerHeight){
      wrapper.css({
        'top' : window.innerHeight - wrapper.innerHeight()
      });

   } else {
     wrapper.css({
      'left' : cursorX,
      'top' : cursorY
      });
   }
}
