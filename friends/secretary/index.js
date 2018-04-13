const server = require('http').createServer();
const api = require('./api');
const db = require('./db');
const util = require('../util');
const config = require('../config');
const { lexicalAnalyse, timeNlp } = require('../nlp');

const users = {};
const hello = 'Hello，恭喜你 get 小秘书一枚～对我说\"提醒我 XX 去 XX\"可以帮你设置提醒事项。另外，\"查看 XX 的日程\"可以查询日程';
const help = '\"提醒我 XX 去开会\"可以帮你设置提醒事项。另外，\"查看 XX 的日程\"可以查询日程';

const io = require('socket.io')(server, config.io);

io.on('connection', (socket) => {
  socket.on('hello', async (data) => {
    console.log(data);
    const { userid, friendid } = data;
    const [user] = await db.findUserById(userid);
    if (!user) {
      db.createUser(userid);
      socket.emit('message', { message: hello });
    }
    users[userid] = { friendid };
  });

  socket.on('message', async (data) => {
    console.log(data);
    const { userid, message } = data;
    const result = await lexicalAnalyse(message);
    const times = await timeNlp(message);
    if (message.indexOf('提醒') !== -1) {
      const time = times[0];
      if (time <= new Date()) {
        socket.emit('message', { message: 'Sorry，提醒时间不能在过去哦' });
        return;
      }
      const pos = message.indexOf('去');
      if (pos === -1 || pos === message.length - 1) {
        socket.emit('message', { message: 'Sorry，我 get 不到你要我提醒你什么' });
        return;
      }
      const event = message.substr(pos + 1, message.length - pos);
      db.createReminder(userid, time, event, message);
      const friendid = users[userid].friendid;
      api.remind(friendid, userid, time, event);
      socket.emit('message', { message: '好的，到时提醒你' });
    } else {
      let reminders;
      if (times.length === 1) {
        reminders = await db.findReminderByTime(userid, times[0]);
      } else {
        reminders = await db.findReminderByTimes(userid, times[0], times[times.length-1]);
      }
      if (reminders.length === 0) {
        socket.emit('message', { message: '没有查询到提醒事项哦' });
      } else {
        const messages = ['查到了这些提醒事项'];
        for (const reminder of reminders) {
          messages.push(`[${util.formatTime(reminder.time)}] ${reminder.event}`);
        }
        socket.emit('messages', { messages });
      }
    }
  });
});

server.listen(config.secretary.port);
