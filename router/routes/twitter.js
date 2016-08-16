const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const db = require('../../db/db');
//const database = pgp('postgres://Wolphox@localhost:5432/graffiti');
//const database = pgp(process.env.DATABASE_URL);

const https = require('https');
const request = require('request');
const twitterAPIKey = process.env.twitterAPIKey;
const twitterAPISecret = process.env.twitterAPISecret;
const accessToken = process.env.twitterAccessToken;
const accessSecret = process.env.twitterAccessSecret;
const callBackUrl = '';

// var error = function (err, response, body) {
//   console.log('ERROR [%s]', err);
// };
// var success = function (data) {
//   console.log('Data [%s]', data);
// };

var Twitter = require('twitter-js-client').Twitter;
var OAuth = require('oauth');
var qs = require('qs');
var assert = require('assert');

    //Get this data from your twitter apps dashboard
var config = {
  "consumerKey": twitterAPIKey,
  "consumerSecret": twitterAPISecret,
  "accessToken": accessToken,
  "accessTokenSecret": accessSecret,
  "callBackUrl": 'https://graffitiwall.herokuapp.com/tweet/back'
}






router.post('/tweet', function(req,res)
{

var twitter = new Twitter(config);

  var data = req.body;
  var image = data.imageURL;
  // console.log(image);
  console.log('chirp!');
  twitter.postMedia({"media_data" : image}, error, success);
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

var error = function (err, response, body) {
  //console.log('ERROR [%s]', err);
    console.log('Twitter ERROR callback', err);
   // res.end();
  };

var success = function (data) {
  //console.log('Data [%s]', data);

  console.log('Twitter ERROR callback', err);
 // res.end();
};





module.exports = router;
