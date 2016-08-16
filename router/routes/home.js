const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const db = require('../../db/db');
//const database = pgp('postgres://Wolphox@localhost:5432/graffiti');
const database = pgp(process.env.DATABASE_URL);
const graffitiDB = require('./graffitiDB.js')
router.get('/', function (req, res){
  var error = req.flash('error')[0];

  if(!req.session.user){

    //res.redirect('sessions/new');
    res.render('./homepage/index', { 'error': error })

  } else {
    res.render('./homepage/index', { 'username': req.session.user.username, 'logged_in' : req.session.user.logged_in }, graffitiDB.locks);
    console.log(graffitiDB.locks);
  }
});


//Loads all the images for the grids on homepage
router.get('/loadHomepage', db.loadHomepageGraffiti, function(req, res)
{
  //console.log('/loadHomepage hit')
  res.end();
});

router.get('/screenshots/:username', function(req,res)
{

  var username = req.params.username;
  console.log('Screenshot access: ' + username);

  database.any('SELECT * FROM userScreenshots WHERE owner = $1',[username])
  .catch(function()
  {
    console.log('Unable to load user screenshots for ' + username);
  })
  .then(function(data)
  {
    var isUser = false;

    if (req.session.user.username === username)
    {
      isUser = true;
    }

    var screenshotData = {
        'screenshotData' : data,
        'username' : username,
        'isUser' : isUser
      }

    console.log(isUser);
    console.log('Screenshots loaded for ' + username);
    res.render('users/userScreenshots', screenshotData);
  })

});

router.delete('/deleteScreenshot/:username/:id', function(req,res)
{
  var username = req.params.username;
  var id = req.params.id;
  database.none('DELETE FROM userscreenshots WHERE owner = $1 AND id = $2',[username, id])
  console.log('delete screenshot '+username+id);
})


module.exports = router;
