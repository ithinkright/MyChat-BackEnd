const server = require('http').createServer();
const api = require('./api');
const db = require('./db');
const config = require('../config');
const { sendMessages } = require('../../services/socket.io');

const hello = 'Hello，我是 MyChat。如果你对 MyChat 有任何建议或者吐槽的，尽管跟我说吧，一定帮你转达！';
const help = '你说的每一句话，我都会帮你转达到 MyChat 的开发团队～一旦有回复我也会告诉你😊';

const io = require('socket.io')(server, config.io);

io.on('connection', (socket) => {
  socket.on('hello', async (data) => {
    console.log(data);
    const { userid } = data;
    const [user] = await db.findUserById(userid);
    if (!user) {
      db.createUser(userid);
      socket.emit('message', { message: hello });
    }
  });

  socket.on('message', async (data) => {
    console.log(data);
    const { userid, message } = data;
    if (isMyChater(userid)) {
      const pos = message.indexOf(' ');
      const adviceid = message.substr(0, pos);
      if (message.length <= pos+1) {
        socket.emit('message', { message: '老铁，你这样的回复格式不对耶🤭' });
        return;
      }
      const response = message.substr(pos+1);
      socket.emit('message', { message: '👌已转发给提建议的那个用户了' });
      api.sendToUser(adviceid, response);
      db.updateResponse(adviceid, response);
    } else {
      const time = new Date();
      const { insertId: adviceid } = await db.createAdvice(userid, time, message);
      socket.emit('message', { message: '👌我会帮你转达滴' });
      api.sendToMyChater(adviceid, message);
    }
  });
});

server.listen(config.mychat.port);
