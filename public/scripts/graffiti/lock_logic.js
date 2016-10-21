var lockStatus;


$(document).ready(function()
{
  unlockBrush();
  console.log('Lock logic... standing by!');
});

//Check html element #lockStatus for lock status
function unlockBrush()
{
  lockStatus = $('#lockStatus').attr('data-id');
  if (lockStatus == 'true' || lockStatus == undefined)
  {
    brushLocked = true;
     console.log('LOCK STATUS', brushLocked)
  } else {
    brushLocked = false;
    console.log('LOCK STATUS', brushLocked)
    grabUnlockedElements();
  }
}

function grabUnlockedElements()
{
   brushSizeCanvas = document.getElementById("brushExampleCanvas");
   brushCtx = brushSizeCanvas.getContext("2d");
   brushSizeCanvas.width = window.innerWidth;
   brushSizeCanvas.height = (window.innerHeight);
}

//Unlock page once you leave the page, called from graffiti/index.html
function unlockPage()
{
  var row = String($('#coordinates').attr('data-id')).substr(0,1);
  var column = String($('#coordinates').attr('data-id')).substr(1,1);
  var coordinates ={
    'row' : row,
    'column' : column
  }
  ajax_this('POST','/unlockpage',coordinates,unlock_success,undefined);
}

function unlock_success(data)
{
  console.log('unlock SUCCESSFUL');
}
