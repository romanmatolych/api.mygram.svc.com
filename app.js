var createError = require('http-errors');
var express = require('express');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');
var debug = require('debug')('api.mygram.svc.com:app');

const healthRouter = require('./routes/health');
const usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

app.use('/healthcheck', healthRouter);
app.use('/users', usersRouter);

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.log.bind(console, 'Mongoose connection error:'));
db.once('open', function () {
  debug('Mongoose connection opened');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }

  if (req.xhr) {
    res.status(err.status || 500).json({error: err});
  } else {
    next(err);
  }
});

module.exports = app;
