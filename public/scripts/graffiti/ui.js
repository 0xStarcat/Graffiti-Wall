var cursorModeButton;
var paintMode = true;
var collapsedNavBar = false;
var wrapper;
var navBar;
var mobilePalette = false;
var imgurSearch = false;
var collapseSearch = false;
var imageSliderMultiplier = 0.5;

$('document').ready(function()
{

  $('select').material_select();
  navBar = $('#navBarWrapper');
  wrapper = $('#paletteOuter');

  cursorModeButton = $('#cursorMode');
  eventListeners();

})

function eventListeners()
{

  $('#imageSlider').on('mousedown', getSliderValue);


  //Paint or Tag Wall button
    cursorModeButton.on('click',function(e)
  {

    changeCursorMode();

  });


//The red X close Window
  $('.exitWindowButton').on('click', function(e)
  {
   //Special behavior for closing the imgur search window
    if ( !$("#imageSelectionWrapper").hasClass("hide"))
    {
       $("#imageSelectionWrapper").addClass("hide");
       imgurSearch = false;
       if(paintMode)
       {
        changeCursorMode();

      }
       $('#openChooser').text('Open Image Chooser');
      $('#cursorImagePreview').css('display' , 'inline');

    //Normal behavior for closing all other windows
    } else {
      $(this).parent().addClass('hide');
    }
  });

//Open IMGUR search
  $('#openChooser').on('click',function(e)
  {

    if ( $("#imageSelectionWrapper").hasClass("hide"))
    {
      imgurSearch = true;
      sizePreviewBox()
      $('#cursorImagePreview').css('display', 'none');
      $("#imageSelectionWrapper").removeClass("hide");
      $('#openChooser').text('Close Image Chooser');
    } else {
      imgurSearch = false;
       $("#imageSelectionWrapper").addClass("hide");
       $('#openChooser').text('Open Image Chooser');
    }
  });


//Submit IMGUR search
  $('#imageSearchButton').on('click', function(e)
  {
    var searchTerm;
    var popularSearch = false;
    var sort = $('#sortSelectValue').val();

    var searchType = $('#searchSelectValue').val();


    //For image data-id in parseImages()
    $('#galleryWrapper').empty();
    imageCountID = 0;
    pageNumber = 0;

    if (searchType === 'search1')
    {//search by text
      searchTerm = $('#imageSearchBox').val();
    } else {
      searchTerm = null;
      popularSearch = true;
    }
    //console.log(searchTerm, popularSearch, sort, 'png');

    imgurAjaxHit(searchTerm, popularSearch, sort, 'jpg');
  });

  $('#searchSelectValue').on('change',function()
  {
    if ($('#searchSelectValue').val() === 'search1')
    {
      $('.searchText').removeClass('hide');
      $('.searchHot').addClass('hide');
      console.log('switch to hot')
    } else {
      $('.searchText').addClass('hide');
      $('.searchHot').removeClass('hide');
       console.log('switch to text')
    }
  })

  $('#menuExpand').on('click',function(e)
  {

    if (collapseSearch)
    {
      $('#previewWrapper').animate({
      'height' : '50vh'
      }, 1000,function()
      {
         menuFitMultiplier = 0.25;
        sizePreviewBox();
      })

      $('#menuExpand').text('Collapse');
      collapseSearch = false;
    } else {
       $('#previewWrapper').animate({
      'height' : '80vh'
      }, 1000, function()
      {
        menuFitMultiplier = 0.5;
        sizePreviewBox();
      })

      $('#menuExpand').text('Expand');

      collapseSearch = true;
    }

  });

//Open and close navbar
  $('#navBarTab').on('click', function(e)
  {
    console.log('tab move nav bar');

    moveNavBar();
  });

//Depracated
   $('#loadCanvas').on('click', function(e)
  {
    //getAJAXImage();
      loadScreenshots();
  });

//Move the Palette
   $('#paletteMoveTab').on('mousedown',function(e)
    {
      console.log('working')
      mobilePalette = true;

    });

//#######
//Do stuff on mouse up
//########
  $(window).on('mouseup',function(e)
    {
      mobilePalette = false;
      mobileNavBar=false;
      sliderMove =false;
      handleClicked=false;
      inputActive=true;
    });


//depracated
  $('#saveScreenshot').on('click',function(e)
  {
        //postAJAXImage();

        saveScreenshot();
  });


//depracated
  $('#downloadScreenshot').on('click', function(e)
  {
    canvasData = canvas.toDataURL("image/png");
    this.href = canvasData;//document.getElementById(canvasId).toDataURL();
    this.download = 'newfile.png';//filename;
    console.log(this, 'save')


  });




  //Save Image every mouse up from canvas
  $('#myCanvas').on('mouseup', function(e)
  {
    if(!brushLocked)
    {
     postAJAXImage ();
    }
  })

};

function changeCursorMode()
{
  if (paintMode)
    {
      paintMode = false;
      cursorModeButton.text('Mode: Tag');

      $('#cursorImagePreview').css('display' , 'inline');

    } else
    {
      paintMode = true;
      cursorModeButton.text('Mode: Paint');
      $('#cursorImagePreview').css('display', 'none');
      $("#imageSelectionWrapper").addClass("hide");
    }

}

function getSliderValue()
{
  sliderMove = true;
  imageSliderMultiplier = ($('#imageSlider').val() / 100)

  if(imgurSearch)
  {
    sizePreviewBox();
    // showPreviewImage(tagURL); //moved inside sizePreviewBox();
  }

}


function saveScreenshot()
  {
    canvasData = canvas.toDataURL("image/png");
    var username = $('.welcome').attr('data-id');
    screenshot = {
      'imageURL' : canvasData,
      'username' : username
    }

    console.log('screenshot');
    $.ajax({
      'method' : 'POST',
      'url' : '/saveScreenshot',
      'data' : screenshot,
      'success' : function(data)
      {
        console.log('Screenshot saved for' + username+'!');
      },
      'error' : function()
      {
        console.log('ERROR SAVING SCREENSNAKES')
      }
    })
  }


  function loadScreenshots()
  {
    var username = $('h1').attr('data-id');
    var data = {
      'username' : username
    }
    $.ajax({
      'method' : 'POST',
      'url' : '/loadScreenshots/'+username,
      'data' : data,
      'success' : function(data)
      {
        console.log('got those screen shots');
        //appendScreenshots(data);
        //console.log(data);
      },
      'error' : function()
      {
        console.log('error grabbing screenSNAKES');
      }
    })
  }

  function appendScreenshots(data)
  {

    console.log(data);
    var oneShot = $('<div class="screenshotCard"><img data-id = {{data.id}} class = screenshot src={{data.imageURL}}></div>');

  }



function movePalette()
{

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

function moveNavBar()
{

  if (!collapsedNavBar)
  {

    //Closes Nav Bar
     navBar.animate({
      'top' : '-100px'
    }, 1000, function(){
      collapsedNavBar = true;
      $('#navBarTab').text('Open Nav-Bar');
    });
   } else {
    navBar.animate({
      'top' : '0'
    }, 1000, function(){
      collapsedNavBar = false;
      $('#navBarTab').text('Close Nav-Bar')
    });
   }
}
