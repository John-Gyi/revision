var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose=require('mongoose');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiUserRouter=require('./api/routes/user');
var apiAdminRouter=require('./api/routes/admin');
var apiAuthRouter=require('./api/routes/auth');
var apiProfileRouter=require('./api/routes/profile');
var apiPostRouter=require('./api/routes/post');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
mongoose.connect('mongodb+srv://john12:john12@heyman.6uluk.mongodb.net/<dbname>?retryWrites=true&w=majority',{useUnifiedTopology: true,useNewUrlParser: true,useCreateIndex:true,useFindAndModify:false,
});
var db=mongoose.connection;
db.on('error',console.error.bind(console,"Mongodb Connection error"));

app.use(function(req,res,next){
  res.locals.user=req.session.user;
  next();
})
app.use('/', indexRouter);
app.use('/api',apiAdminRouter);
app.use('/api/users',apiUserRouter);
app.use('/api/auth',apiAuthRouter);
app.use('/api/profile',apiProfileRouter);
app.use('/api/post',apiPostRouter),

app.use(express.json({extended:false}));

app.use(function (req,res,next){
  if(req.session.user){
    next();
  }else {
    res.redirect('/signin');
  }
})
app.use('/users', usersRouter);


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
