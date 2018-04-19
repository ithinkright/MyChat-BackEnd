const server = require('http').createServer();
const api = require('./api');
const db = require('./db');
const config = require('../config');
const { sendMessages } = require('../../services/socket.io');

const hello = 'Hello，我是 MyChat 小姐姐～\n\n如果你对 MyChat 有任何建议或者吐槽的，尽管跟我说吧，一定帮你转达！';
const help = '你说的每一句话，我都会帮你转达到 MyChat 的开发团队～一旦有回复我也会告诉你😊';

const io = require('socket.io')(server, config.io);

io.on('connection', (socket) => {
  socket.on('hello', async (data) => {
    console.log('mychat', 'hello', data);
    const { userid } = data;
    const [user] = await db.findUserById(userid);
    if (!user) {
      db.createUser(userid);
      if (!api.isMyChater(userid)) {
        socket.emit('message', { message: hello });
      }
    }
  });

  socket.on('message', async (data) => {
    console.log('mychat', 'message', data);
    const { userid, message } = data;
    if (api.isMyChater(userid)) {
      const posa = message.indexOf('@');
      const posb = message.indexOf(' ');
      if (posa === -1 || posb === -1 || message.length <= posa+1 || message.length <= posb+1) {
        socket.emit('message', { message: '老铁，你这样的回复格式不对耶🤭' });
        return;
      }
      const userid_ = message.substr(posa+1, posb-1);
      const response = message.substr(posb+1);
      socket.emit('message', { message: '👌已转发给提建议的那个用户了' });
      api.sendToUser(userid_, response);
    } else {
      const time = new Date();
      const { insertId: adviceid } = await db.createAdvice(userid, time, message);
      // socket.emit('message', { message: '👌我会帮你转达滴' });
      api.sendToMyChater(userid, message);
    }
  });
});

server.listen(config.mychat.port);
