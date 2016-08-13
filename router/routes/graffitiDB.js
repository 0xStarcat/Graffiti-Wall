const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const db = require('../../db/db');

const https = require('https');
var request = require('request');
var clientID = process.env.imgurAPIkey;

var grids = 16;
var rows = 4;
var columns = 4;
var locks = [];

createLocks();
function createLocks()
{
  var i = 0;
  for (var row = 1; row <= rows; row++)
  {
    for (var col = 1; col <= columns; col++)
    {
      var letter = nextChar('`', col); //start at ` because next letter is a
      var key = 'grid_lock_'+row+letter;
        locks[i] = { [key] : false };
        letter = nextChar(letter, col);
        i++
    }
  }
}

console.log(locks);

function nextChar(c, loop) {
    return String.fromCharCode(c.charCodeAt(0) + loop);
}

router.post('/', db.saveGraffiti, function(req,res)
{
  res.end();
});

//Load the actual image from database
router.post('/load/:row/:column', db.loadGraffiti, function(req,res)
{
  res.end();
});


//Load the graffiti page from clicking on homepage square.
router.get('/graffiti/:row/:column', function(req,res)
{
  var row = req.params.row;
  var column = req.params.column;

  //View graffiti wall only if not logged in
  if(!req.session.user){
     var graffitiSession = {
      'row' : row,
      'column' : column,
    }
    //res.redirect('sessions/new');
    res.render('./graffiti/index', graffitiSession);
    console.log('viewing graffiti wall without login');

  } else {
    //Enable painting on graffiti wall if logged in


    //Check Lock Status
    var letter = column.charCodeAt(0) - 96;//a = 97;
    var lock = ((Number(row) + Number(letter)) -2);
    var key = "grid_lock_"+row+column;

    locks.forEach(function(lock)
    {
      if (lock.hasOwnProperty(key))
      {
        if(lock[key])
        {
          isLocked = true;
          console.log('THIS PAGE IS LOCKED');
        } else {
          isLocked = false;
          console.log('THIS PAGE IS UNLOCKED');
        }



      }
    });
    console.log('LOCKS AFTER LEAVING PAGE', locks);


    var graffitiSession = {
      'row' : row,
      'column' : column,
      'username' : req.session.user.username,
      'logged_in' : req.session.user.logged_in,
      'isLocked' : isLocked
    }

    //Lock Grid
    var letter = column.charCodeAt(0) - 96;//a = 97;
    var lock = ((Number(row) + Number(letter)) -2);
    var key = "grid_lock_"+row+column;

    locks.forEach(function(lock)
    {
      if (lock.hasOwnProperty(key))
      {
         lock[key] = true;
         //console.log('LOCK = ' + lock[key]);

      }
    });


    console.log('LOCKS AFTER JOINING PAGE = ' , locks);

    res.render('./graffiti/index', graffitiSession);
    console.log('viewing graffiti wall WITH login. Congrats!');

  }


  // console.log('showing canvas')
  // res.render('./graffiti/index', gridCoordinates);
});

router.get('/unlockBrush', function(req,res){

  if (!req.session.user)
  {
    console.log('sending brush LOCK');
    res.send({'brushLocked' : true})
  } else {
    console.log('sending brush unlock');
    res.send({'brushLocked' : false})
  }

});

//unlock page when user leaves, called from the HTML template to canvasDraw.js to here
router.post('/unlockpage', function(req,res)
{
  console.log('UNLOCKING PAGE');
  var data = req.body;
  var row = data.row;
  var column = data.column;

  var letter = column.charCodeAt(0) - 96;//a = 97;
  var lock = ((Number(row) + Number(letter)) -2);
  var key = "grid_lock_"+row+column;

  locks.forEach(function(lock)
  {
    if (lock.hasOwnProperty(key))
    {
       lock[key] = false;
       console.log('LOCK = ' + lock[key]);

    }
  });
    console.log('LOCKS AFTER LEAVING PAGE', locks);
    res.end();
})

//Request data from API
router.get('/search/:search',function(req,res){

    console.log('backend hit!');
    console.log(clientID)
    var searchTerm = req.params.search;
    var options = {
      url: 'https://api.imgur.com/3/gallery/search/top/week/0/?q_any='+searchTerm+'&q_type=jpg',
      headers: {
        Authorization: 'Client-ID ' + clientID,
        Accept: 'application/json'
      }
    };
    request(options, ajaxThisNow);
    console.log('up to ajaxthisnow');

    function ajaxThisNow(error, response, body) {

      if (!error && response.statusCode == 200) {
        console.log(body) // Show the HTML for the Google homepage.
        var ourData = {stuff:body}
        res.send(ourData);

      }
    }

  });

module.exports = router;
