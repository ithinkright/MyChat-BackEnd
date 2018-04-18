const server = require('http').createServer();
const api = require('./api');
const db = require('./db');
const config = require('../config');

const users = {};
const mail = {};
const help = '对我说\"发邮件\"就可以发一封邮件，其他功能敬请期待！';

const io = require('socket.io')(server, config.io);

io.on('connection', (socket) => {
  socket.on('hello', async (data) => {
    console.log(data);
    const { userid } = data;

    if (!users[userid]) {
      const [user] = await db.findUserById(userid);
      if (!user || !user.account) {
        users[userid] = {
          status: 'username',
          account: { vendor: 'QQ' },
        };
        socket.emit('messages', {
          messages: [
            'Hello，我是可以帮你发邮件的小邮差～\n\n这是咱们第一次见面，你先得添加一个邮箱账户（目前只支持 QQ 邮箱）哦。',
            '请问你的 QQ 邮箱账号是？',
          ],
        });
      } else {
        users[userid] = {
          status: 'done',
          account: JSON.parse(user.account),
        };
      }
    }
  });

  socket.on('message', async (data) => {
    console.log(data);
    const { userid, message } = data;
    if (users[userid].status !== 'done') {
      const { status } = users[userid];
      if (status === 'username') {
        if (api.validateEmail(message)) {
          users[userid].account['username'] = message;
          users[userid].status = 'password';
          socket.emit('message', { message: 'OK，我还需要知道你的授权码（放心我一定会保密哈）' });
        } else {
          socket.emit('message', { message: '邮箱账号格式不对哦，再试一下吧' });
        }
      } else if (status === 'password') {
        const username = users[userid].account['username'];
        const password = message;
        const testEmail = await api.testEmail(username, password);
        if (testEmail) {
          users[userid].account['password'] = password;
          const account = users[userid].account;
          await db.updateAccount(userid, JSON.stringify(account));
          users[userid].status = 'done';
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
            mail[userid].status = 'title';
            socket.emit('message', { message: '邮件的主题是什么？' });
          } else {
            socket.emit('message', { message: '邮箱账号格式不对哦，再试一下吧' })
          }
        } else if (status === 'title') {
          mail[userid].data['title'] = message;
          mail[userid].status = 'text';
          socket.emit('message', { message: '邮件的内容是？' });
        } else if (status === 'text') {
          mail[userid].data['text'] = message;
          const { to, title, text } = mail[userid].data;
          const { username, password } = users[userid].account;
          const sent = await api.sendEmail({ to, title, text, username, password });
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
