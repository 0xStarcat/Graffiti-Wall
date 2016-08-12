const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const db = require('../../db/db');

const https = require('https');
var request = require('request');
var clientID = process.env.imgurAPIkey;



router.post('/', db.saveGraffiti, function(req,res)
{
  res.end();
});

router.get('/load', db.loadGraffiti, function(req,res)
{
  res.end();
});

router.get('/graffiti', function(req,res)
{
  res.render('./graffiti/index');
});


router.get('/search/:search',function(req,res){

    console.log('backend hit!');

    var searchTerm = req.params.search;
    var options = {
      url: 'https://api.imgur.com/3/gallery/search/top/week/0/?q_any='+searchTerm+'&q_type=jpg',
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



module.exports = router;
