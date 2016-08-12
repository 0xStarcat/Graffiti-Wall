const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const db = require('../../db/db');

const https = require('https');
var request = require('request');


router.post('/', db.saveGraffiti, function(req,res)
{
  res.end();
});

router.get('/load', db.loadGraffiti, function(req,res)
{
  res.end();
});


router.get('/search/:search',function(req,res){

    console.log('backend hit!');

    var searchTerm = req.params.search;
    var clientID = imgurAPIkey;
    var options = {
      url: 'https://api.imgur.com/3/gallery/search/top/week/0/?q_any='+searchTerm+'&q_type=jpg',
      headers: {
        Authorization: 'Client-ID ' + imgurAPIkey,
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
// router.get('/search/:search', function(req,res)
// {
//   console.log('backend Hit!');

//   var searchTerm = req.params.search;
//


//     var options = {
//       hostname: 'api.imgur.com',
//       //port: 443,
//       path: '/3/gallery/search/top/week/0/?q_any='+searchTerm+'&q_type=jpg',
//       method: 'GET',
//       headers : {
//             Authorization: 'Client-ID ' + clientID,
//             Accept: 'application/json'
//           }
//     };

//   var req = https.request(options, (res) => {
//     console.log('statusCode: ', res.statusCode);
//     console.log('headers: ', res.headers);

//     res.on('data', function(data) {

//       process.stdout.write(data);
//       sendData(data);
//       });
//     });
//   function sendData(data)
//     {
//       console.log('we are here');
//       res.send(data);
//     }

//   req.end();


//   req.on('error', (e) => {
//     console.error(e);
//   });
// })


module.exports = router;
