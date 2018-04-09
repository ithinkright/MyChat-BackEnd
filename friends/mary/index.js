const server = require('http').createServer();
const api = require('./api');
const db = require('./db');
const config = require('../config');

const hello = 'Hello，我是'
const help = '问我\"我昨天做了什么\"或者\"我前天去了哪里\"等问题，我也许能通过你的日记找到答案，试试吧～';

const io = require('socket.io')(server, config.io);

io.on('connection', (socket) => {
  socket.on('hello', async (data) => {
    console.log(data);
    const { userid } = data;
    const [user] = await db.findUserById(userid);
    if (!user) {
      db.createUser(userid);
    }
    socket.emit('message', '')
  });

  socket.on('message', async (data) => {
    console.log(data);
    const { userid, message } = data;
    const result = await api.lexicalAnalyse(message);
    if (api.isQuestion(message)) {
      const { date, absolute_date } = result;
      const diaries = await db.findDiariesByDate(absolute_date);
      if (diaries.length === 0) {
        socket.emit('message', { message: `Sorry，查不到${date}你做了什么` });
      }
      const response_message = `${date} 你`;
      for (const diary in diaries) {
        if (diary.location === null) {
          response_message += `${diary.event} `;
        } else {
          response_message += `去了${diary.location}${diary.event} `;
        }
      }
      socket.emit('message', { message: response_message });
    } else {
      if (isDiary(result)) {
        const { date = new Date(), location, people, event } = result;
        db.createDiary(userid, date, location, people, event);
      }
    }
  });
});

server.listen(config.translator.port);
