'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const expressReact = require('express-react-views');
const ErrorMessage = require('./lib/error-message');

const app = express();
app.use(favicon(path.join(__dirname, '/../client/static/favicon.ico')));
app.use(express.static(path.join(__dirname, '/../client/static')));
app.use(express.static(path.join(__dirname, '/../client/app')));

if (app.get('env') !== 'production' && app.get('env') !== 'test') {
    app.use(morgan('dev'));
}

// Use React for server side view rendering
app.set('views', __dirname + '/view');
app.set('view engine', 'jsx');
app.engine('jsx', expressReact.createEngine());


function print(s) { console.log(s); }

// Routes go here
// Sample route that returns the app name
const chatrouter = require('./chat').router;
app.use('/api', chatrouter);

app.get('/aaa', (req, res, next) => {
//  res.end(appname);
  print("Fetch root");
  res.render('index')
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new ErrorMessage({
    title: 'Not Found',
    status: 404,
    message: 'The requested resource could not be found.',
    stack: new Error().stack
  });
  next(error);
});

app.use((err, req, res, next) => {
  let error;
  if (err instanceof ErrorMessage) {
    error = err;
  } else {
    error = new ErrorMessage({
      title: err.name || 'Internal Server Error',
      status: err.status || 500,
      message: 'Something went wrong',
      stack: err.stack || new Error().stack
    });
  }

  res.render('error', error);
});

module.exports = app;
