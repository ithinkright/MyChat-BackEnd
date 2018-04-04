const server = require('http').createServer();
const api = require('./api');
const db = require('./db');
const config = require('../config');

const preference = {};
const mail = {};
const help = '对我说\"发邮件\"就可以发一封邮件，其他功能敬请期待！';

const io = require('socket.io')(server, config.io);

io.on('connection', (socket) => {
  socket.on('hello', async (data) => {
    console.log(data);
    const { userid } = data;
    const [user] = await db.findUserById(userid);
    if (!user || user.accounts === null) {
      await db.createUser(userid);
      preference[userid] = {
        status: 'username',
        data: { vendor: 'QQ' },
      };
      socket.emit('messages', {
        messages: [
          'Hello~这是咱们第一次见面。你先得添加一个邮箱账户（目前只支持 QQ 邮箱）才能使用此服务。',
          '请问你的 QQ 邮箱账号是？',
        ],
      });
    } else {
      const accounts = JSON.parse(user.accounts);
      preference[userid] = {
        status: 'done',
        data: accounts[0],
      };
      mail[userid] = { status: 'to', data: {} };
      socket.emit('message', { message: '你要发邮件给谁？' });
    }
  });

  socket.on('message', async (data) => {
    console.log(data);
    const { userid, message } = data;
    if (preference[userid].status !== 'done') {
      const { status } = preference[userid];
      if (status === 'username') {
        if (api.validateEmail(message)) {
          preference[userid].data['username'] = message;
          preference[userid].status = 'password';
          socket.emit('message', { message: 'OK，我还需要知道你的授权码（放心我一定会保密哈）' });
        } else {
          socket.emit('message', { message: '邮箱账号格式不对哦，再试一下吧' });
        }
      } else if (status === 'password') {
        const username = preference[userid].data['username'];
        const password = message;
        const testEmail = await api.testEmail(username, password);
        if (testEmail) {
          preference[userid].data['password'] = password;
          const account = preference[userid].data;
          await db.updateAccounts(userid, JSON.stringify(account));
          preference[userid].status = 'done';
          socket.emit('message', { message: '添加成功！试一下跟我说\"发邮件\"' });
        } else {
          socket.emit('message', { message: '授权码不对耶，再试一下吧' });
        }
      }
    } else if (message === '发邮件' || mail[userid]) {
      if (!mail[userid]) {
        mail[userid] = { status: 'to', data: {} };
        socket.emit('message', { message: '你要发邮件给谁？' });
      } else {
        const { status } = mail[userid];
        if (status === 'to') {
          if (api.validateEmail(message)) {
            mail[userid].data['to'] = message;
            mail[userid].status = 'subject';
            socket.emit('message', { message: '邮件的主题是什么？' });
          } else {
            socket.emit('message', { message: '邮箱账号格式不对哦，再试一下吧' })
          }
        } else if (status === 'subject') {
          mail[userid].data['subject'] = message;
          mail[userid].status = 'content';
          socket.emit('message', { message: '邮件的内容是？' });
        } else if (status === 'content') {
          mail[userid].data['content'] = message;
          const { to, subject, content } = mail[userid].data;
          const sent = await api.sendEmail(to, subject, content);
          if (sent) {
            socket.emit('message', { message: '发送成功！' });
          } else {
            socket.emit('message', { message: '发送成功！' });
          }
          mail[userid] = null;
        }
      }
    } else {
      socket.emit('message', { message: help });
    }
  });
});

server.listen(config.postman.port);
