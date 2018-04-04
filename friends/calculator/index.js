const server = require('http').createServer();
const api = require('./api');
const config = require('../config');

const io = require('socket.io')(server, config.io);

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    console.log(data);
    const { message } = data;
    try {
      const result = api.compute(message);
      socket.emit('message', { message: result.toString() });
    } catch (err) {
      socket.emit('message', { message: '抱歉，我解析不了该表达式' });
    }
  })
});

server.listen(config.calculator.port);
