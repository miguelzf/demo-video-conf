'use strict';

var messages = [];
function print(s,o) {
  if (o) console.log(s,o);
  else console.log(s);
}

module.exports = function chatserver(httpapp, users) {

// test data:
  for (var i = 0; i < 10; i++) {
    var msg = {name: 'teste'+i, msg: 'nsdgdfsgdf  sdhg dsfaj '+i,
     time: new Date(Date.now()+i*100000), color: get_random_color(), sid: null};
    messages.push(msg);
  }

  for (var i = 0; i < 2; i++)
    users['test'+i] = {name: 'test'+i, ip: '127.0.0.1', color: get_random_color(), sid: null};
/////////////

  var io = require('socket.io').listen(httpapp);

  // Socket server
  io.on('connection', function(socket) {

    var thisocket = socket;

    print('New Connecton! from id ' + socket.id)
//    print(socket)

    const sendUserList = function () {
      var uservals = Object.keys(users).map(function(k) { return users[k]; });
      //print("Send Users List:", uservals);
      socket.emit('users', uservals);
    };

    sendUserList();

    // Send the last messages
    var lasmsg = messages.slice(messages.length-10, messages.length-1);
    socket.emit('messages', lasmsg.reverse());
    print("Last Msgs:" + lasmsg.reverse());

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

      // Send new user info to all other connected clients
      socket.broadcast.emit('addUser', user);

      // teste:
      // setTimeout(function() { socket.emit('remUser', 'test1')}, 5000);
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
      var user = socket.user || {};
      print('User disconnected: ' + user.name);
      if (!user) return;

      delete users[user.name];

      // Update the other users
      socket.broadcast.emit('remUser', user.name);
    });

    // When a user send a new message
    socket.on('message', function (data) {
      var user = socket.user;
      print("Incoming msg from " + user+':', data);

      var msg = {name: user.name, msg: data.msg, time: new Date(), color: user.color};
      messages.push(msg);

      // Send to all
      io.emit('messages', [msg]);
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

