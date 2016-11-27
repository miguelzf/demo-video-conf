'use strict';

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

var messages = [];

// test data:
for (var i = 0; i < 10; i++) {
  var msg = { name: 'teste'+i, msg: 'Hi ho ho! '+i+' '+ Math.random().toString(36).substring(getRandomInt(0, 30)),
              time: new Date(Date.now()+i*100000), color: get_random_color(), sid: null};
  messages.push(msg);
}

module.exports = function chatserver(io, socket, users) {

/////////////

    // When a new user arrive
    socket.on('chat:user', function (username) {

      print("New user entered the chat: " + username);

      if (!username) {
        // client should close connection and redirect
        socket.emit('chat:error', 'user invalid/null');
        return;
      }

      if (!users[username]) {
        // client should close connection and redirect
        socket.emit('chat:error', 'user not found');
        return;
      }

      // send users to new client, except own user
      var uservals = Object.keys(users).map(k => users[k])
                                       .filter(u => u.name !== username);
      socket.emit('chat:users', uservals);

      // Send the last messages
      var lasmsg = messages.slice(messages.length-10, messages.length-1);
      socket.emit('chat:messages', lasmsg);

      var user    = users[username];
      user.sid    = socket.id;
      user.color  = get_random_color();
      socket.user = user;

      // Send new user info to all other connected clients
      socket.broadcast.emit('chat:addUser', user);

      // teste:
      // setTimeout(function() { socket.emit('remUser', 'test1')}, 5000);
    });

    // Request for updated users lists
    //socket.on('chat:reqUsers',sendUserList);

    socket.on('chat:reqMessages', function () {
      print('Request for updated users lists\n');
      // Send the last 10msgs
      var lasmsg = [];
      for (var i=messages.length-1, z=0; z<10 && i>0; i--, z++)
        lasmsg.push(messages[i]);
      socket.emit('chat:messages', lasmsg.reverse());
    });

    // When a user leaves
    socket.on('disconnect', function () {
      var user = socket.user;
      if (!user) return;

      setTimeout(() => {
        if (!user.videosid && !user.sid) {
          print('User disconnected: ' + user.name);
          delete users[user.name];
          // Update the other users
          socket.broadcast.emit('chat:remUser', user.name);
        }
      }, 1000*60);
    });

    // When a user send a new message
    socket.on('chat:message', function (data) {
      var user = socket.user;
      print("Incoming msg from " + user+':', data);

      var msg = {name: user.name, msg: data.msg, time: new Date(), color: user.color};
      messages.push(msg);

      // Send to all
      io.emit('chat:messages', [msg]);
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

