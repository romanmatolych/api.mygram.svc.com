const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const debug = require('debug')('api.mygram.svc.com:app');
const cors = require('cors');

// Import routers for the app
const healthRouter = require('./routes/health');
const usersRouter = require('./routes/users');
const blogsRouter = require('./routes/blogs');
const authRouter = require('./routes/auth');

const app = express();

if (app.get('env') === 'development') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Enable all CORS reqs
app.use(cors());

// Use all needed routers
app.use('/healthcheck', healthRouter);
app.use('/users', usersRouter);
app.use('/blogs', blogsRouter);
app.use(authRouter);

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
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
  debug('Error handler: %O', err);

  if (res.headersSent) {
    return next(err);
  }

  if (req.xhr || req.accepts('application/json')) {
    res.status(err.status || 500).json({error: err});
  } else {
    next(err);
  }
});

module.exports = app;
