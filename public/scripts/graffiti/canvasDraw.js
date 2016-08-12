function windowResizeFunction() // Source = http://jsfiddle.net/m1erickson/V6SVz/
{

   //document.body.style.cursor = cursorString;

  //alert(String(data));
//var data = canvas.toDataURL();
ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
//alert("hello");
canvas.width = window.innerWidth;
canvas.height = (window.innerWidth * 0.5625); //16:9 is height 56.25% of width. 4:3 is height 75% of width.
brushSizeCanvas.width = window.innerWidth;
brushSizeCanvas.height = (window.innerHeight);
  // scale and redraw the canvas content
  var img = new Image();
  img.src = canvasData;//load snapshot

  img.onload = function () {
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, (canvas.width * 0.5625));
  }
}

function drawDebug() {
  ctx.clearRect(0,0, 125, 50);
  ctx.font = "8px Arial";
  ctx.fillStyle = "rgba(0, 0, 200, 1)";
  ctx.fillText("Canvas Height: "+canvas.height, 8, 8);
  ctx.fillText("Canvas Width: "+canvas.width, 8, 16);
  ctx.fillText("Cursor X: "+cursorX.toFixed(0), 8, 24);
  ctx.fillText("Cursor Y: "+cursorY.toFixed(0), 8, 32);
  ctx.fillText("Slider Percent: "+slidePercent.toFixed(2), 8, 40);
  //ctx.fillText("RelativeX Value = "+relativeX, 8, 100);
  //ctx.fillText("RelativeY Value = "+relativeY, 8, 120);

}

function updateColorPicker() {
  var palettePicker = $('#palettePicker');
    cursorColor = palettePicker.text();
    drawBrushExample();
}

function drawBrushExample(){

    brushCtx.clearRect(0,0,brushSizeCanvas.width,brushSizeCanvas.height);
      brushCtx.beginPath();
      //brushCtx.rect(25,25, cursorSize, cursorSize * 0.5625);
      brushCtx.arc(37,37, cursorSize, 3, Math.PI, true);

      brushCtx.closePath();
      brushCtx.fillStyle = cursorColor;
      brushCtx.fill();

  }




