'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
// const expressReact = require('express-react-views');
//const ErrorMessage = require('./lib/error-message');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');

const app = express();
app.use(favicon(path.join(__dirname, '/../client/static/favicon.ico')));
app.use(express.static(path.join(__dirname, '/../client/static')));
app.use(express.static(path.join(__dirname, '/../client/app')));

if (app.get('env') !== 'production' && app.get('env') !== 'test') {
    app.use(morgan('dev'));
}

// Use React for server side view rendering
app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');
//app.engine('ejs', expressReact.createEngine());


function print(s,o) { console.log(s,o); }

// Router for '/chat'
var chatrouter = require('./chat')
var users = chatrouter.users;
app.use('/chat', chatrouter.router);


const appname = 'demo-video-chat';

// Return list of users online
app.get('/appname', (req, res, next) => {
  res.end(appname);
});

app.get('/', (req, res, next) => {
//  res.end(appname);
  print("Fetch root");
  res.render('index', {test: 'aa'})
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = {
    type: 'Not Found',
    status: 404,
    message: 'The requested resource could not be found.',
    stack: new Error().stack
  };
  next(error);
});


app.use((err, req, res, next) => {
  if (!err.type)
    err.type = 'Internal Server Error'
  if (!err.status)
    err.status = 500;

  res.render('error', { error: err });
});

module.exports = {
	app: app,
	users: users
}