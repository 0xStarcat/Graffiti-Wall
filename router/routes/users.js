const express = require('express');
const router = express.Router();
const db = require('../../db/db');

router.get('/new', function (req, res) {
  var error = req.flash('error')[0];
  res.render('users/new', { 'error': error });
});

router.post('/create', db.create_user, function (req, res) {


  if(res.error){
    req.flash('error', res.error);

    console.log('NEW USER ERRROR'+res.error);
    res.redirect('new');
  } else {

    res.redirect('/');
    console.log('User Creation Successful - users.js')
  }
});



module.exports = router;
