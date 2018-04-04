const server = require('http').createServer();
const api = require('./api');
const db = require('./db');
const config = require('../config');

const language = {};
const help = '\"换成XX\"就可以切换翻译的目标语言为！';

const io = require('socket.io')(server, config.io);

io.on('connection', (socket) => {
  socket.on('hello', async (data) => {
    console.log(data);
    const { userid } = data;
    const [user] = await db.findUserById(userid);
    if (!user) {
      await db.createUser(userid);
      language[userid] = 'EN';
    } else {
      language[userid] = user.language;
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
        language[userid] = code;
        socket.emit('message', { message: `成功切换语言为：${lang}` });
      } else {
        socket.emit('message', { message: '暂不支持该语言哦' });
      }
    } else {
      const result = await api.tranlate({ from: 'auto', to: language[userid], query: message });
      socket.emit('message', { message: result });
    }
  });
});

server.listen(config.translator.port);
