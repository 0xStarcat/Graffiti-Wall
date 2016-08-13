const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const db = require('../../db/db');

router.get('/', function (req, res){
  if(!req.session.user){
    //res.redirect('sessions/new');
    res.render('./homepage/index')
  } else {
    res.render('./homepage/index', { 'username': req.session.user.username, 'logged_in' : req.session.user.logged_in });
  }
});


//Loads all the images for the grids on homepage
router.get('/loadHomepage', db.loadHomepageGraffiti, function(req, res)
{
  //console.log('/loadHomepage hit')
  res.end();
});

module.exports = router;
