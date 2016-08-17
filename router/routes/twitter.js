const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const db = require('../../db/db');

const request = require('request');
const deepExtend = require('deep-extend');
const OAuth = require('oauth');
const qs = require('qs');
const assert = require('assert');


const https = require('https');
var twitterAPIKey = process.env.twitterAPIKey;
var twitterAPISecret = process.env.twitterAPISecret;
var accessToken = process.env.twitterAccessToken;
var accessSecret = process.env.twitterAccessSecret;
const callBackUrl = '';

var Twitter = require('twitter');


//I made a twitter spam bot. It will post the image to twitter under MY account
//I don't have a way to bring user to THEIR account
//or to bring them to their twitter page after to see it

var client = new Twitter({
  // consumer_key: twitterAPIKey,
  // consumer_secret: twitterAPISecret,
  // access_token_key: accessToken,
  // access_token_secret: accessSecret
});


router.post('/tweet', function(req,res)
{



  var data = req.body;
  var image = data.imageURL.replace('data:image/png;base64', "");
  console.log(image);
  console.log('chirp!');

  //console.log(image);
  var params ={media_data : image} //{screen_name: 'nodejs'};
  client.post('media/upload', {media_data: image}, function(error, media, response){
    if (!error) {
      //console.log(tweets);
      var status = {
      status: 'Check out the graffiti wall!',
      media_ids: media.media_id_string,
      possibly_sensitive: true // Pass the media id string
    }

    client.post('statuses/update', status, function(error, tweet, response) {
      if (!error) {
        console.log(tweet);
      } else {
        console.log(error);
      }
    });
    } else {
      console.log(error);
    }
  });
  //twitter.postMedia({"media_data" : image}, error, success);
  //twitter.getUserTimeline({ screen_name: 'BoyCook', count: '10'}, error, success);



  var twitterSuccess = function(data)
  {
  console.log('Twitter SUCCESSSS', data);
  res.send(data);
  }
  var twitterError = function(err, response, body)
  {
  console.log('Twitter ERROR callback', err);
  res.end();
  }




})


module.exports = router;
