
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');

const router = express.Router();
router.use(bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({ extended: true }));  // to support URL-encoded bodies

var session = require('express-session');
var sessionStore = new session.MemoryStore();

var ssecret = 'all that we see or seem is but a dream within a dream'.replace(' ', '');

router.use(session({secret: ssecret, resave: true, saveUninitialized: true,
                    store: sessionStore,
                    // default: { path: '/', httpOnly: true, secure: false, maxAge: null }.
                    cookie: {
                      secure: 'auto', // support respective HTTP or HTTPS connection
                      maxAge: 30*60*1000 } }));  // 1 min to test, then 30mins

router.use(flash());

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


// User list support

const users = {};

// Return list of users online
router.get('/', (req, res, next) => {
  var u = req.flash('user');

  // testdata:
  if (!u || u.length == 0) {
    var u = 'guest' + getRandomInt(1000000);
    users[u] = {name: u, ip: '127.0.0.1'};
  }

  if (!u || !users[u]) {
    const error = {
      type: 'Bad username',
      status: 404,
      message: 'User name "' + u + '" missing or invalid.',
      //stack: new Error().stack
    }
    return next(error);
  }

  var serverLocation = req.headers.host;

  res.render('chat', {user: u, host: serverLocation});
});

// Return list of users online
router.get('/users', (req, res, next) => {
  res.end(users.keys());
});

// Return list of users online
router.post('/users/enter', (req, res, next) => {
  print(req.body);
  const user = req.body.username;
  const ip = req.connection.remoteAddress;
  print("ADD user " + user);

  if (!user) {
    const error = {
      type: 'Must specify user',
      status: 404,
      message: 'Received invalid or null user',
      //stack: new Error().stack
    }
    return next(error);
  }

  if (users[user]) {
    const error = {
      type: 'Already Exists',
      status: 404,
      message: 'User name "' + user + '" already exists.',
      //stack: new Error().stack
    }
    return next(error);
  }
  users[user] = {name: user, ip: ip};
  req.flash('user', user);
  res.redirect('/chat');
});


module.exports = {
  router:router,
  users: users,
};
