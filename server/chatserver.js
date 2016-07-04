'use strict';

var messages = [];
function print(s,o) {
  if (o) console.log(s,o);
  else console.log(s);
}

module.exports = function chatserver(httpapp, users) {

  var io = require('socket.io').listen(httpapp);

  // Socket server
  io.on('connection', function(socket) {

    var thisocket = socket;

    print('New Connecton! from id ' + socket.id)
//    print(socket)

    const sendUserList = function () {
      var uservals = Object.keys(users).map(function(k) { return users[k]; });
      print("Send Users List:", uservals);
      socket.emit('users', uservals);
    };

    // First send the current users
    sendUserList();

    // Send the last 10msgs
    var lasmsg = [];
    for (var i=messages.length-1, z=0; z<10 && i>0; i--, z++)
      lasmsg.push(messages[i]);
    socket.emit('messages', lasmsg.reverse());
    print("Last Msgs:" + lasmsg.reverse());

    socket.on('errorr  ', function(d) {
      print("RECEIVED ERROR???", d);
    });

    // When a new user arrive
    socket.on('user', function (username) {

      print("New user entered the chat: " + username);

      if (!username) {
        // client should close connection and redirect
        socket.emit('errorr', 'user invalid/null');
        return;
      }

      if (!users[username]) {
        // client should close connection and redirect
        socket.emit('errorr', 'user not found');
        return;
      }

      var user    = users[username];
      user.sid    = socket.id;
      user.color  = get_random_color();
      socket.user = user;

      // Ack the user
      //socket.emit('okuser', user);

      // Update the other users
      socket.broadcast.emit('addUser', user);
    });

    // Request for updated users lists
    socket.on('reqUsers',sendUserList);

    socket.on('reqMessages', function () {
      print('Request for updated users lists\n');
      // Send the last 10msgs
      var lasmsg = [];
      for (var i=messages.length-1, z=0; z<10 && i>0; i--, z++)
        lasmsg.push(messages[i]);
      socket.emit('messages', lasmsg.reverse());
    });

    // When a user leaves
    socket.on('disconnect', function () {
      var user = socket.user || "";
      print('User disconnected: ' + user.name);
      delete users[user.name];

      // Update the other users
      io.emit('remUser', user);
    });

    // When a user send a new message
    socket.on('message', function (data) {
      print("Incoming msg", data);
      var user = socket.user;

      var msg = {name: data.user, msg: data.msg, time: new Date(), color: users[data.user].color};
      messages.push(msg);

      // Send to all
      io.emit('messages',[msg]);
    });

  });
}


function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

