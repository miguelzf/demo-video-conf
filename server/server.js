'use strict';

const router = require('./app');
const path = require('path');
const http = require('http');

const app = router.app;
const users = router.users;

function normalizePort(val) {
  const portNorm = parseInt(val, 10);

  if (isNaN(portNorm)) {
    // named pipe
    return val;
  }

  if (portNorm >= 0) {
    // port number
    return portNorm;
  }

  return false;
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}

const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

const server = http.createServer(app);

var io = require('socket.io').listen(server);

// Socket.IO server
io.on('connection', function(socket) {

  console.log('New Connecton! from id ' + socket.id)
  console.log("Socket has " + io.engine.clientsCount + " clients");

  // both chat and video use the same http PORT,
  // load up handlers for both router apps

  var chatserver = require('./chatserver')(io, socket, users);

  var videoserver = require('./videoserver')(io, socket);
});


server.listen(port);
server.on('listening', onListening);

if (false)
if (process.env['gulp:watch']) {
  require('chokidar-socket-emitter')({
    path: 'src/client/app',
    app: server,
    dir: path.join(__dirname, '..', '..'),
    relativeTo: 'src/client/app/',
  });
}

module.exports = {
  port: port,
  server: server
};
