const server = require('http').createServer();
const api = require('./api');
const db = require('./db');
const config = require('../config');
const { lexicalAnalyse, timeNlp } = require('../nlp');
const { formatDate } = require('../util');

const hello = 'Hello，我是小会计，你可以通过跟我聊天记账。\n\n比如说你告诉我\"今天吃午饭花了15\"，然后就可以问我\"今天/上星期我花了多少钱\"。'
const help = '比如说你告诉我\"今天吃午饭花了15\"，然后就可以问我\"今天/上星期我花了多少钱\"。';

const io = require('socket.io')(server, config.io);

io.on('connection', (socket) => {
  socket.on('hello', async (data) => {
    console.log('accountant', 'hello', data);
    const { userid } = data;
    const [user] = await db.findUserById(userid);
    if (!user) {
      db.createUser(userid);
      socket.emit('message', { message: hello });
    }
  });

  socket.on('message', async (data) => {
    console.log('accountant', 'message', data);
    const { userid, message } = data;
    const items = await lexicalAnalyse(message);
    const result = api.analyseItems(items);
    let dates;
    try { dates = await timeNlp(result.time); }
    catch (err) { dates = [new Date()]; }
    if (message.indexOf('多少') !== -1) {
      // 查账
      let before, after;
      before = new Date(dates[0].getFullYear(), dates[0].getMonth(), dates[0].getDate(), 0, 0 ,0);
      if (dates.length === 1) {
        after = new Date(dates[0].getFullYear(), dates[0].getMonth(), dates[0].getDate(), 23, 59 ,59);
      } else {
        const last = dates.length-1;
        after = new Date(dates[last].getFullYear(), dates[last].getMonth(), dates[last].getDate(), 23, 59, 59);
      }
      const { time } = result;
      if (time === '这周' || time === '这一周' || time === '这星期' || time === '这一星期' || time === '这个星期') {
        after = new Date();
        before = new Date(after.getTime() - after.getDay() * 24*60*60*1000);
      }
      if (time === '上周' || time === '上一周' || time === '上星期' || time === '上一星期' || time === '上个星期') {
        const now = new Date();
        after = new Date(now.getTime() - now.getDay() * 24*60*60*1000 - 1);
        before = new Date(after.getTime() - 7*24*60*60*1000+1);
      }
      if (time === '这个月') {
        after = new Date();
        before = new Date(after.getFullYear(), after.getMonth(), 1, 0, 0, 0);
      }
      const accounts = await db.findAccountsDuringDates(userid, before, after);
      if (accounts.length === 0) {
        socket.emit('message', { message: `咦，${result.time}你好像没记账喔😯` });
        return;
      }
      let sum = 0.00;
      let messages = [`这是你${result.time}的消费记录👇`];
      for (const a of accounts) {
        messages.push(`⏰${formatDate(a.time)}\n💡${a.item}\n💰${a.money.toFixed(2)}`);
        sum += a.money;
      }
      messages.push(`共计：${sum.toFixed(2)}`);
      socket.emit('messages', { messages });
    } else {
      // 记账
      let { time, event, amount, item } = result;
      if (item) event += item;
      db.createAccount(userid, dates[0], event, amount);
      socket.emit('message', { message: '👌帮你记下了' });
    }
  });
});

server.listen(config.accountant.port);
