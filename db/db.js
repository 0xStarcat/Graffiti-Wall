const pgp = require('pg-promise')();
//const db = pgp('postgres://Wolphox@localhost:5432/graffiti');
const db = pgp(process.env.DATABASE_URL);
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);

var login = function(req, res, next){
  //var email = req.body.email;
  var password = req.body.password;
  var username = req.body.username;
  var auth_error = 'Incorrect Username / Password!';

  db.one(
    "SELECT * FROM users WHERE username = $1",
    [username]
  ).catch(function(){

    res.error = auth_error;
     console.log('Login ERROR 1');
    next();
  }).then(function(user){
    bcrypt.compare(
      password,
      user.hashed_password,
      function(err, cmp){
        if(cmp){
          var logged_in = true;
          req.session.user = {
            'username': user.username,
            'logged_in' : logged_in
          };

          console.log('Login SUCCESS');
          console.log(req.session.user);
          next();
        } else {
          res.error = auth_error;
          console.log('Login ERROR 2');
          next();
        }
      }
    );
  });
};

var logout = function(req, res, next){
  req.session.user = null;
  next()
};

var create_user = function(req, res, next){

  var username = req.body.username;
  if (username.replace(/\s/g, '') === '' || username.replace(/\s/g, '').length < 3)
  {
    console.log(username.replace(/\S/g, '').length);
    res.error = 'Please enter a username with 3 or more characters!'
    //next();
  }
  var email = req.body.email;
  if (email.replace(/\s/g, '') === '')
  {
    res.error = 'That\'s not a valid email!';
    //next();
  }
  var password = req.body.password;
  if (password.replace(/\s/g, '') === '' || password.replace(/\s/g, '').length < 6)
  {
    res.error = 'Password must be at least 6 characters!';
    next();
  }

  bcrypt.hash(password, 10, function(err, hashed_password){
    db.none(
      "INSERT INTO users (username,email,hashed_password) VALUES ($1, $2, $3)",
      [username, email, hashed_password]
    ).catch(function(errorMessage){
     // console.log(errorMessage);
      if(errorMessage.detail === 'Key (username)=('+username+') already exists.')
      {
        res.error = 'User name already taken!'
      } else if (errorMessage.detail === 'Key (email)=('+email+') already exists.')
      {
         res.error = 'Email already in use!';
      } else {
        res.error = 'Something went wrong! Try again!';
      }

      next();
    }).then(function(user){

      var logged_in = true;
      req.session.user = {
        'username': username,
        'logged_in' : logged_in
      };
      console.log(req.session.user);
      //THIS GOES TO home.js '/' ROUTE WITH A req.session.user AND USERNAME
      next();
    });
  });
};

var saveGraffiti = function (req,res, next){
  var data = req.body;


  console.log(data);
  console.log('saving picture...');
  //db.none("INSERT INTO publicGraffiti(grid_block, imageURL) VALUES($1, $2)",["1a", data.image])
  //db.none("UPDATE publicGraffiti SET imageURL = $2 WHERE grid_block = $1",["1a", data.image])
  db.none("UPDATE publicGraffiti SET imageURL = $3 WHERE row = $1 AND col = $2",[data.row,data.column, data.image]).then(function(data)
  {
    console.log('picture saved!')
    res.end();
  })
}

var loadGraffiti = function (req,res,next)
{
  var data = req.body;
  console.log('LOAD GRAFFITI' + data.row)
  console.log('loading picture...');
  db.one("SELECT * FROM publicGraffiti WHERE row =$1 AND col =$2",[data.row, data.column]).then(function(data)
  {
    res.send(data);
    console.log('picture loaded!')
    //console.log(data);
    res.end();
  })
}

var loadHomepageGraffiti = function (req,res,next)
{
  db.any('SELECT * FROM publicGraffiti').then(function(data)
    {
      //console.log(data);

       res.send(data);

    });
}


// module.exports = { login, logout, create_user };
module.exports = { login, logout, create_user,loadGraffiti,saveGraffiti, loadHomepageGraffiti };

