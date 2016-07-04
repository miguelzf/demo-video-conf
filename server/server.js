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

// Start socket.io chat server
var chatserver = require('./chatserver')(server, users);

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
