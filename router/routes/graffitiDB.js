const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const db = require('../../db/db');
//const database = pgp('postgres://Wolphox@localhost:5432/graffiti');
const database = pgp(process.env.DATABASE_URL);

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

//console.log(locks);

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
  var error = req.flash('error')[0];

  //View, don't write, to graffiti wall if not logged in
  if(!req.session.user){
     var graffitiSession = {
      'row' : row,
      'column' : column,
      'error' : error
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
    //console.log('LOCKS AFTER LEAVING PAGE', locks);


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


    //console.log('LOCKS AFTER JOINING PAGE = ' , locks);

    res.render('./graffiti/index', graffitiSession);
   // console.log('viewing graffiti wall WITH login. Congrats!');

  }


  // console.log('showing canvas')
  // res.render('./graffiti/index', gridCoordinates);
});

router.get('/unlockBrush', function(req,res){

//If request is not from a logged in user, brush lock true.
//Else if logged in, unlock brushes.
  if (!req.session.user)
  {
    console.log('sending brush LOCK');
    res.send({'brushLocked' : true})
  } else {
    console.log('sending brush unlock');
    res.send({'brushLocked' : false})
  }

});

router.get('/checkLocks', function(req,res)
{
  res.send(locks);
})

//unlock page when user leaves, called from the HTML template to canvasDraw.js to here
router.post('/unlockpage', function(req,res)
{
  console.log('UNLOCKING PAGE');
  var data = req.body;
  var row = data.row;
  var column = data.column;

  //Check key by converting grid format (Number, Letter) to array index format
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
    //console.log('LOCKS AFTER LEAVING PAGE', locks);
    res.end();
})

//Request data from API
router.post('/searchImgur',function(req,res){


    var data = req.body;
    console.log('received search data: ' , req.body);
    //console.log(clientID)
    //ar searchTerm = req.params.search;

    //#
    //#
    //#
    //Search based query
    //"url" : '/api.imgur.com/3/gallery/search/top/week/0/?q_any='+searchTerm+'&q_type=jpg'
    //#
    //Popular List Query
    //https://api.imgur.com/3/gallery/hot/viral/0.json
    //#
    //#
    //#
    //'https://api.imgur.com/3/gallery/search/viral/0/?q_any='+searchTerm+'&q_type=jpg'
    //var constructedURL =  'https://api.imgur.com/3/gallery/hot/viral?showViral=false';
    var constructedURL;
    var sort;

    if (data.sort === 'sortViral')
    {
      sort = 'viral'
    } else if (data.sort === 'searchAllTime')
    {
      sort = 'top/all'
    } else if (data.sort === 'searchWeek')
    {
      sort = 'top/week'
    }

    if (data.popularSearch == 'false')
    {
      constructedURL = 'https://api.imgur.com/3/gallery/search/'+sort+'/'+data.page+'/?q_any='+data.searchTerm+'&q_type='+data.imageType;
      console.log('popular search OFF')
    }else {
      constructedURL =  'https://api.imgur.com/3/gallery/hot/'+sort+'/'+data.page+'.json';
      console.log('popular search ON!')
    }

    console.log('sending URL: '+constructedURL)

    var options = {
      url: constructedURL,
      headers: {
        Authorization: 'Client-ID ' + clientID,
        Accept: 'application/json'
      }
    };
    request(options, ajaxThisNow);

    function ajaxThisNow(error, response, body) {

      if (!error && response.statusCode == 200) {
        console.log(body) // Show the HTML for the Google homepage.
        var ourData = {stuff:body}
        res.send(ourData);

      }
    }
  });

router.post('/savelog', function(req,res)
{
  var data = req.body;
  var username = data.username;
  var row = data.row;
  var column = data.column;
  var post_type = data.post_type;
  var img_url = '';
  var date = data.date;
  var imageCenterX = Number(Number(data.imageCenterX).toFixed(14));
  var imageCenterY = Number(Number(data.imageCenterY).toFixed(14));
  var imageWidth = Number(Number(data.imageWidth).toFixed(14));
  var imageHeight = Number(Number(data.imageHeight).toFixed(14));

  console.log('Got log data', data, typeof imageCenterX);

  database.none('INSERT INTO graffitiLogs(username,date_posted,post_type,imageURL,row,col,imageCenterx,imageCentery,imagewidth,imageheight) VALUES($1, $2, $3, $4, $5,$6,$7,$8,$9,$10)',[username,date,post_type,img_url,row,column, imageCenterX,imageCenterY,imageWidth, imageHeight])
  .catch(function()
  {
    console.log('could NOT insert a log');
    res.end();
  }).then(function()
  {
    console.log('posted a log')
    res.end();
  })

});

router.get('/logs/:row/:column', function(req,res)
{
  var row = req.params.row;
  var column = req.params.column;
  console.log(row, column)

  database.any('SELECT * FROM graffitiLogs WHERE row = $1 AND col = $2 ORDER BY id DESC',[row,column])
  .catch(function()
  {
    console.log('could not grab graffiti logs for grid',row,column)
    res.redirect('/')
  }).then(function(data)
  {

    //console.log('Is Image?',isImage);
    console.log('got the logs', data);
    var logData= {
      'row' : row,
      'column' : column,
      'data' : data

    }

    res.render('./graffiti/logs', logData )
  })

});

router.get('/imageCoordinates/:row/:column', function(req,res)
{
  var row = req.params.row;
  var column = req.params.column;
  database.any('SELECT * FROM graffitiLogs WHERE row =$1 AND col =$2',[row, column])
  .catch(function(err)
  {
    console.log('backend DB coordinates failed', err)
    res.end();
  }).then(function(data)
  {

    res.send(data);
  })
})



router.post('/saveScreenshot', db.saveScreenshot, function(req,res)
{
  res.end();
})


module.exports = router;
