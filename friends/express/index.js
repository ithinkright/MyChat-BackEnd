const server = require('http').createServer();
const api = require('./api');
const config = require('../config');

const io = require('socket.io')(server, config.io);
const hello = 'Hello，我是快递小哥。\n\n只管告诉我快递单号，我就可以帮你查物流信息。如果物流信息发生变化，我也会尽快通知你的！';
const users = {};

io.on('connection', (socket) => {
  socket.on('hello', (data) => {
    console.log('express', 'hello', data);
    // const { userid } = data;
    // const [user] = await db.findUserById(userid);
    // if (!user) {
    //   db.createUser(userid);
    //   socket.emit('message', { message: hello });
    // }
    // if (!users[userid]) {
    //   const expresses = await db.findUnrecievedExpress(userid);
    //   users[userid] = [];
    //   for (const e of expresses) {
    //     users[userid].push({ number: e.number, last_time: e.last_time });
    //   }
    // }
  });

  socket.on('message', async (data) => {
    console.log('express', 'message', data);
    const { message } = data;
    if (api.isExpressNumber(message)) {
      // let [express] = await db.findByNumber(userid, message);
      // if (!express) {
        const result = await api.query(message);
        if (!result) {
          socket.emit('message', { message: 'Sorry，查不到相关信息😅' });
          return;
        }
        if (result['State'] === '2') {
          // 在路上
          const traces = result['Traces'];
          if (traces.length === 0) {
            socket.emit('message', { message: '查到了，但暂无物流信息哦😅' });
            return;
          }
          const messages = ['查到啦👇'];
          for (const t of traces) {
            messages.push(`⏰${t.AcceptTime}\n🏠${t.AcceptStation}`);
          }
          socket.emit('messages', { messages });
        } else if (result['State'] === '3') {
          // 已签收
          const last_trace = result['Traces'][result['Traces'].length-1];
          const messages = ['这个快递已经被签收啦😝'];
          messages.push(`⏰${last_trace.AcceptTime}\n🏠${last_trace.AcceptStation}`);
          socket.emit('messages', { messages });
          return;
        } else if (result['State'] === '4') {
          // 问题件
          socket.emit('message', { message: '这是一个问题件哦😯' });
          return;
        }
      // }
    } else {
      socket.emit('message', { message: '你输入的不是一个快递单号嘤嘤嘤😕' });
    }
  });
});

server.listen(config.express.port);
