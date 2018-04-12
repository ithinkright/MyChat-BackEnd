const server = require('http').createServer();
const api = require('./api');
const db = require('./db');
const config = require('../config');
const { lexicalAnalyse, timeNlp } = require('../nlp');

const hello = 'Hello，我是 Mary，你可以通过跟我聊天记日记。比如说你告诉我\"三天前我去了XX玩XX\"，就可以问我\"我三天前去了哪里\", \"我三天前在干嘛\"，我就可以帮你回忆起来哦。'
const help = '问我\"我昨天做了什么\"或者\"我前天去了哪里\"等问题，我也许能通过你的日记找到答案，试试吧～';

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
    const result = await lexicalAnalyse(message);
    let dates;
    try { dates = await timeNlp(message); }
    catch (err) { dates = [new Date()]; }
    if (api.isQuestion(message) && result.date) {
      let diaries;
      if (dates.length === 1) {
        const date = dates[0];
        diaries = await db.findDiaryByDate(userid, date);
      } else {
        const before = dates[0];
        const after = dates[dates.length-1];
        diaries = await db.findDiaryByDates(userid, before, after);
      }
      if (diaries.length === 0) {
        socket.emit('message', { message: `Sorry，查不到${result.date}你做了什么` });
        return;
      }
      const messages = [`这是你在${result.date}的日记：`];
      for (const diary of diaries) {
        messages.push(diary.origin);
      }
      socket.emit('messages', { messages });
    } else {
      const { location, people, event } = result;
      if (!people && !event) {
        socket.emit('message', { message: help });
        return;
      }
      for (const date of dates) {
        db.createDiary(userid, date, location, people, event, message);
      }
    }
  });
});

server.listen(config.mary.port);
