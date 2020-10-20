var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var exphbs = require('express-handlebars');
var session = require('express-session');
var expressValidator = require('express-validator');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var classesRouter = require('./routes/classes');
var studentsRouter = require('./routes/students');
var instructorsRouter = require('./routes/instructors');

var mongo = require('mongodb');
var mongoose = require('mongoose');
var async = require('async');

mongoose.connect('mongodb://localhost/elearn',{useFindAndModify: false});
var db = mongoose.connection;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.engine('handlebars', exphbs({defaultLayout:'main',
                          partialsDir: __dirname + '/views/partials',
                          handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Handlebars Register Helper
Handlebars.registerHelper("splitText", function(text, length){
  var subText = text.subString(0, length);
  return subText;
});

//Handle Sessions
app.use(session({
  secret : 'secret',
  saveUninitialized : true,
  resave : true
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
})); 

//connect-flash
app.use(flash());

//Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  if(req.user){
    res.locals.type = req.user.type;
  } next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/classes', classesRouter);
app.use('/students', studentsRouter);
app.use('/instructors', instructorsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
