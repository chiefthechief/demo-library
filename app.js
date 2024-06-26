require("dotenv").config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require("compression");
var helmet = require("helmet")
var mongoose = require('mongoose');
var url = process.env.PRIVATE_KEY;
var RateLimit = require("express-rate-limit")
const db = mongoose.connection;

let indexRouter = require("./routes/index");
let userRouter = require("./routes/users");
let catalogRouter = require("./routes/catalog");

var app = express();
const limiter = RateLimit({
   windowMs: 1 * 60 * 1000,
   max: 15
})
app.use(limiter)
app.use(
   helmet.contentSecurityPolicy({
      directives: {
         "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"]
      }
   })
)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
db.on("error", console.error.bind(console, "mongodb connection error"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression())
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/catalog", catalogRouter);

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