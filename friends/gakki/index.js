const server = require('http').createServer();
const config = require('../config');

const io = require('socket.io')(server, config.io);

io.on('connection', (socket) => {
  socket.on('hello', (data) => {
    console.log(data);
  });

  socket.on('message', (data) => {
    console.log(data);
    const { message } = data;
    socket.emit('message', { message: '好的，老公😝' });
  });
});

server.listen(config.gakki.port);
