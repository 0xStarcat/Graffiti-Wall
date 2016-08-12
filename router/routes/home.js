const express = require('express');
const router = express.Router();

router.get('/', function (req, res){
 //  if(!req.session.user){
 //    res.redirect('sessions/new');
 //  } else {
 //    res.render('./homepage/index', { 'email': req.session.user.email });
 // }
    res.render('./homepage/index')
});



module.exports = router;
