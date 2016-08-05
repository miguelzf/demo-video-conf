'use strict';

function print(s,o) {
  if (o) console.log(s,o);
  else console.log(s);
}


module.exports = function videoserver(io, socket, users) {

  // convenience function to log server messages on the client
  function log() {
	console.log.apply(console, arguments);
    var array = ['Server:'];
    array.push.apply(array, arguments);
    socket.emit('video:log', array);
  }

  socket.on('video:message', function(message, roomid) {
    log('Client said: ', message);

    if (message == 'bye') {
      console.log('User left room ' + roomid);
      var room = io.sockets.adapter.rooms[roomid];
      if (room) setTimeout(()=> {log('Room ' + roomid + ' now has ' + room.length + ' client(s)');}, 1000);
    }

    socket.broadcast.to(roomid).emit('video:message', message);
  });

  socket.on('video:create', function(roomid) {
    log('Client ID ' + socket.id + ' request to create room ' + roomid);
    // var numClients = io.sockets.sockets.length; // doesn't work in this version
    // var numClients = io.engine.clientsCount; // global connected

    //log('Room ' + room + ' now has ' + numClients + ' client(s)');
    // var numClients = room.length; // in this room

    var room =  io.sockets.adapter.rooms[roomid];
    if (room) {
      print("Room " + roomid + " already has clients: " + room.length);
    }

    socket.join(roomid);
    socket.emit('video:created', roomid, socket.id);

    var match = /room\$([^$]+)\$(.+)/.exec(roomid);
    var user = match[1], partner = match[2];

    log('Client ID ' + socket.id + ' user ' + user + ' requests ' + partner + ' to join call');
	console.log(users);

    // notify other user to join room
    setTimeout(() => {
      var sid = users[partner].sid;
      io.to(sid).emit('chat:joincall', user);
    }, 400);

  });

  socket.on('video:join', function(roomid, userid) {
    log('Client ID ' + socket.id + ' joined room ' + roomid);
    io.sockets.in(roomid).emit('video:join', roomid);
    socket.join(roomid);
    socket.emit('video:joined', roomid, socket.id);
    io.sockets.in(roomid).emit('video:ready');
  });

  socket.on('video:ipaddr', function() {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('video:ipaddr', details.address);
        }
      });
    }
  });

}