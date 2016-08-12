const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const db = require('../../db/db');

router.get('/', function (req, res){
 //  if(!req.session.user){
 //    res.redirect('sessions/new');
 //  } else {
 //    res.render('./homepage/index', { 'email': req.session.user.email });
 // }
  res.render('./homepage/index')
});


router.get('/loadHomepage', db.loadHomepageGraffiti, function(req, res)
{
  console.log('/loadHomepage hit')
  res.end();
});

module.exports = router;
