const server = require('http').createServer();
const api = require('./api');
const db = require('./db');
const util = require('../util');
const config = require('../config');
const { lexicalAnalyse, timeNlp } = require('../nlp');

const users = {};
const hello = 'Hello，恭喜你 get 小秘书一枚～对我说\"提醒我 XX 去 XX\"可以帮你设置提醒事项。另外，\"查询 XX 的日程\"可以查询日程';
const help = '啊，小秘太傻了，get 不到你的意思。不过你可以这样跟我聊天：\"提醒我 XX 去开会\"可以设置提醒事项；另外，\"查询 XX 的日程\"可以查询日程';

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
    let result, times;
    try {
      result = await lexicalAnalyse(message);
      times = await timeNlp(message);
    } catch (err) {
      socket.emit('message', { message: help });
      return;
    }
    if (message.indexOf('提醒') !== -1 || message.indexOf('叫我') !== -1) {
      const time = times[0];
      if (time <= new Date()) {
        socket.emit('message', { message: 'Sorry，提醒时间不能在过去哦' });
        return;
      }
      let { event } = result;
      if (!event) {
        socket.emit('message', { message: 'Sorry，我 get 不到你要我提醒你什么' });
        return;
      }
      const pos = message.indexOf(event);
      if (pos + event.length !== message.length) {
        event = message.substr(pos, message.length - pos);
      }
      db.createReminder(userid, time, event, message);
      const friendid = users[userid].friendid;
      api.remind(friendid, userid, time, `是时候去${event}啦`);
      socket.emit('message', { message: '好的，到时提醒你' });
    } else if (message.indexOf('查询') !== -1) {
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
    } else if (message.indexOf('计时') !== -1) {
      const friendid = users[userid].friendid;
      api.remind(friendid, userid, times[0], `倒计时${result.date}到啦`);
      socket.emit('message', { message: '好的，到时提醒你' });
    } else {
      socket.emit('message', { message: help });
    }
  });
});

server.listen(config.secretary.port);
