'use strict';

const express = require('express');
const router = express.Router();

const appname = 'demo-video-chat';


// User list support

const users = {};

// Return list of users online
router.get('/users', (req, res, next) => {
  res.end(users.keys());
});

// Return list of users online
router.post('/users/add', (req, res, next) => {
  const user = req.body.username;
  const ip = req.connection.remoteAddress;

  if (users[user]) {
    const error = new ErrorMessage({
      title: 'Already Exists',
      status: 404,
      message: 'User name already exists.',
      stack: new Error().stack
    });
    return next(error);
  }

  users[user] = {name: user, ip: ip};
  res.end();
});


module.exports = {
  appname: appname,
  router: router
};
