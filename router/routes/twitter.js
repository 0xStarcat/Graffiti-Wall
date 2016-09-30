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






  var twitterSuccess = function(data)
  {
  console.log('Twitter SUCCESSSS', data);
  //res.send(data);
  }
  var twitterError = function(err, response, body)
  {
  console.log('Twitter ERROR callback', err);
  //res.end();
  }


module.exports = router;
