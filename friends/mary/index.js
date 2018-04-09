const server = require('http').createServer();
const api = require('./api');
const db = require('./db');
const config = require('../config');
const { lexicalAnalyse, timeNlp } = require('../nlp');

const hello = 'Hello，我是 Mary，你可以通过跟我聊天记日记。比如说你三天前告诉我你去了某个地方玩，就可以问我\"我三天前去了哪里\", \"我三天前在干嘛\"，我就可以帮你回忆起来哦。'
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
    if (api.isQuestion(message) && result.date) {
      const dates = await timeNlp(message);
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
      const response_message = `这是你在${result.date}的日记：`;
      for (const diary in diaries) {
        response_message += `\n${diary.origin}`;
      }
      socket.emit('message', { message: response_message });
    } else {
      const { date, location, people, event } = result;
      db.createDiary(userid, date, location, people, event);
    }
  });
});

server.listen(config.translator.port);
