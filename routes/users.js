var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
 
var User = require('../models/user');
var Student = require('../models/student');
var Instructor = require('../models/instructor');
const { InsufficientStorage } = require('http-errors');

//User Register
router.get('/register', function(req, res, next) {
  res.render('users/register');
});

router.get('/logout', function(req, res, next){
  console.log('logout');
  req.logout();
  req.flash('success_msg', 'You have loged out');
  res.redirect('/');
});
router.post('/login', passport.authenticate('local', {failureRedirect:'/', failureFlash: true}),function(req, res, next) {
  req.flash('success_msg','You are now logged in');
  var usertype = req.user.type;
  res.redirect('/'+usertype+'s/classes');

});

passport.use(new LocalStrategy(function(username, password, done){

  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message : 'Incorrect UserName'});
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      if(isMatch){
        return done(null, user);
      }else{
        return done(null, false, {message : 'Incorrect Password'});
      }
    });

  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/register', function(req, res, next) {

  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var street_address = req.body.street_address;
  var city = req.body.city;
  var state = req.body.state;
  var zip = req.body.zip;
  var email_address = req.body.email_address;
  var user_name = req.body.user_name;
  var password = req.body.password;
  var password2 = req.body.password2;
  var type = req.body.type;

  req.checkBody('first_name', 'FirstName filed is required').notEmpty();
  req.checkBody('last_name', 'LastName filed is required').notEmpty();
  req.checkBody('email_address', 'Email filed is required').notEmpty();
  req.checkBody('email_address', 'Email filed is required').isEmail();
  req.checkBody('user_name', 'UserName filed is required').notEmpty();
  req.checkBody('password', 'password filed is required').notEmpty();
  req.checkBody('password2', 'password2 filed is required').notEmpty();
  req.checkBody('password2', 'Not Match Password').equals(password);
  var errors = req.validationErrors();
  if (errors){
    res.render('users/register',{errors: errors});
  }else{
    var newUser = new User({
      username : user_name,
      type : type,
      email: email_address,
      password : password
    });
    if(type == 'student'){

      var newStudent = new Student({
        first_name : first_name,
        last_name :last_name,
        address :[{
          street_address : street_address,
          city: city,
          state : state,
          zip : zip
        }],
        username : user_name,
        email : email_address
      });
      User.saveStudent(newUser, newStudent, function(err, result){
        if(err) {
          console.log(err);
          return;
        }
        console.log(result);
      });
    }else{
      var newInstructor = new Instructor({
        first_name : first_name,
        last_name :last_name,
        address :[{
          street_address : street_address,
          city: city,
          state : state,
          zip : zip
        }],
        username : user_name,
        email : email_address
      });
      User.saveInstructor(newUser, newInstructor, function(err, result){
        if(err){
          console.log(err);
          return;
        }
        console.log(result);
      });
    }
    req.flash('success_msg','User Added');
    res.redirect('/');
  }
});
module.exports = router;
