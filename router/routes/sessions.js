const express = require('express');
const router = express.Router();
const db = require('../../db/db');

router.get('/new', function(req, res){
  var error = req.flash('error')[0];
  res.render('sessions/new', { 'error': error });
});

router.post('/create', db.login, function(req, res){
  console.log('login info received' , req.body);
  if(res.error)
    {
      console.log('error on LOGIN '+ res.error);

      req.flash('error', res.error);
      if (!req.body.row)
        {
          res.redirect('/');
        } else{
          res.redirect('/graffiti/'+req.body.row+'/'+req.body.column);
        }
    } else {

      if (!req.body.row)
        {
          res.redirect('/');
        } else{
          res.redirect('/graffiti/'+req.body.row+'/'+req.body.column);
        }
        console.log('POST SESSIONS/CREATE', req.body);
    }

});

router.get('/logout', db.logout, function(req, res){
  res.redirect('/');
});

module.exports = router;
