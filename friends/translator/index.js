const server = require('http').createServer();
const api = require('./api');
const db = require('./db');
const config = require('../config');

const users = {};
const help = '\"换成XX\"就可以切换翻译的目标语言！';

const io = require('socket.io')(server, config.io);

io.on('connection', (socket) => {
  socket.on('hello', async (data) => {
    console.log(data);
    const { userid } = data;
    const [user] = await db.findUserById(userid);
    if (!user) {
      db.createUser(userid);
      users[userid] = { language: 'EN' };
    } else {
      users[userid] = user;
    }
  });

  socket.on('message', async (data) => {
    console.log(data);
    const { userid, message } = data;
    if (message.startsWith('换成') && message.length < 8) {
      const lang = message.substr(2, message.length);
      const code = api.getLanguageCode(lang);
      if (code !== undefined) {
        await db.updateLanguage(userid, code);
        users[userid].language = code;
        socket.emit('message', { message: `成功切换语言为：${lang}` });
      } else {
        socket.emit('message', { message: '暂不支持该语言哦' });
      }
    } else {
      const result = await api.tranlate({ from: 'auto', to: users[userid].language, query: message });
      socket.emit('message', { message: result });
    }
  });
});

server.listen(config.translator.port);
