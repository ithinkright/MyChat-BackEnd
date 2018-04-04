const server = require('http').createServer();
const { compute } = require('./api');

const io = require('socket.io')(server, {
  path: '/',
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

server.listen(3002);

io.on('connection', (socket) => {
  // 从数据库获取用户的
});
