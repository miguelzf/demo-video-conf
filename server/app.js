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


// Setup and config Express

const app = express();
app.use(favicon(path.join(__dirname, '/../client/static/favicon.ico')));
app.use(express.static(path.join(__dirname, '/../client/static')));
app.use(express.static(path.join(__dirname, '/../client/app')));

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));  // to support URL-encoded bodies

var session = require('express-session');
var sessionStore = new session.MemoryStore();

var ssecret = 'all that we see or seem is but a dream within a dream'.replace(' ', '');

app.use(session({secret: ssecret, resave: true, saveUninitialized: true,
                    store: sessionStore,
                    // default: { path: '/', httpOnly: true, secure: false, maxAge: null }.
                    cookie: {
                      secure: 'auto', // support respective HTTP or HTTPS connection
                      maxAge: 30*60*1000 } }));  // 1 min to test, then 30mins

app.use(flash());


if (app.get('env') !== 'production' && app.get('env') !== 'test') {
    app.use(morgan('dev'));
}

// Use React for server side view rendering
app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');
//app.engine('ejs', expressReact.createEngine());


// Helpers

function print(s,o) {
  if (o) console.log(s,o);
  else console.log(s);
}

var getRandomInt = function(min, max) {
  if (!max) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}


// Router for '/chat'
// var chatrouter = require('./chat')
// var users = chatrouter.users;
// app.use('/chat', chatrouter.router);


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


// Demo transient user accounts
const users = {};

for (var i = 0; i < 2; i++)
  users['test'+i] = {name: 'test'+i, ip: '127.0.0.1', color: get_random_color(), sid: null};


// Return list of users online
app.get('/chat/users', (req, res, next) => {
  res.end(users.keys());
});

app.get('/chat', (req, res, next) => {
  var serverLocation = req.headers.host;
  var user = req.flash('user');

  // testdata:
  if (!user || user.length == 0) {
    var user = 'guest' + getRandomInt(1000000);
    users[user] = {name: user, ip: '127.0.0.1'};
  }

  if (!user || !users[user]) {
    return next({
      type: 'Bad username',
      status: 404,
      message: 'User name "' + user + '" missing or invalid.',
      //stack: new Error().stack
    });
  }

  res.render('chat', {user: user, host: serverLocation});
});

// enter chat
app.post('/chat/', checkUser, (req, res, next) => {
  const user = req.body.user;
  const ip = req.connection.remoteAddress;
  print("ADD user " + user);

  users[user] = {name: user, ip: ip};
  res.redirect('/chat');
});


function checkPartner(partner) {
  if (!partner) {
    return {
      type: 'Bad username',
      status: 404,
      message: 'Partner name "' + partner + '" missing or invalid.',
      //stack: new Error().stack
    };
  }

  if (!users[partner]) {
    return {
      type: 'Partner not found',
      status: 404,
      message: 'Partner name "' + partner + '" left.',
      //stack: new Error().stack
    };
  }
  return null;
}

app.post('/video', checkUser, (req, res, next) => {
  const user = req.body.user;
  const partner = req.body.partner;
  var serverLocation = req.headers.host;

  print("CALL " + user + " to " + partner);
  var err = checkPartner(partner);
  if (err)
    return next(err);

  res.render('videoconf', {user: user, partner: partner, host: serverLocation, initiator: user });
});


app.get('/video', checkUser, (req, res, next) => {
  const user = req.query.user;
  const partner = req.query.partner;
  var serverLocation = req.headers.host;

  print("CALL " + user + " to " + partner);

  var err = checkPartner(partner);
  if (err)
    return next(err);

  res.render('videoconf', {user: user, partner: partner, host: serverLocation, initiator: partner });
});


function checkUser(req, res, next) {
  const user    = (req.method == 'POST' ? req.body.user    : req.query.user);
  const partner = (req.method == 'POST' ? req.body.partner : req.query.partner);

  if (!user) {
    return next({
      type: 'Must specify user',
      status: 404,
      message: 'Received invalid or null user',
      //stack: new Error().stack
    });
  }

  req.flash('user', user);
  req.flash('partner', partner);
  return next();
}


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