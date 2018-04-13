const io = require('socket.io')();
const { pushNotificetion } = require('../apns');
// const receiveMail = require('../Mail/receiveMail');

const sockets = new Map();
const test_timeout = 3000;
const unread_messages = new Map();
let test = {
    user: '934657014@qq.com',
    password: 'umffjousigrgbbhb',
    host: 'imap.qq.com'
}

function setSocket(server) {
  io.attach(server);
  io.on('connection', function (socket) {
    // console.log('new conn');
    // setInterval(() => {
    //   socket.emit('message', { friendid: 'test', message: 'test' });
    // }, 5000);

    socket.on('hello', function (data) {
      console.log(data);
      const { userid } = data;
      setInterval(async () => {
        const is_online = await testOnline(userid);
        console.log(new Date(), is_online);
      }, 5000);
      sockets.set(userid, socket);
    });
  });
    // io.of('/schedule').on('connection', function (socket) {
    //     socket.on('start', function (data) {
    //         setTimeout(function () {
    //             socket.emit('schedule', { thing: data.thing })
    //         }, data.time * 1000);
    //         socket.emit('scheduleSuccess', {
    //             mes: '日程创建成功'
    //         })
    //     })
    // })
    // io.of('/mail').on('connection', function (socket) {
    //     socket.on('start', function (data) {
    //         receiveMail(data, socket)
    //     })
    // })
}

function testOnline(userid) {
  return new Promise((resolve, reject) => {
    if (!sockets.has(userid)) resolve(false);
    const socket = sockets.get(userid);
    socket.on('test-online', (data) => {
      socket.removeAllListeners('test-online');
      resolve(true);
    });
    socket.emit('test-online', {});
    setTimeout(() => {
      socket.removeAllListeners('test-online');
      resolve(false);
    }, test_timeout);
  });
}

async function sendMessages(friendid, userid, messages) {
  if (!messages || messages.length === 0) return;
  const is_online = await testOnline(userid);
  if (is_online) {
    const socket = sockets.get(userid);
    socket.emit('messages', {
      friendid,
      messages,
    });
  } else {
    pushNotificetion(userid, messages.length, friendid, messages);
  }
}

exports = module.exports = {
  setSocket,
  sendMessages,
  testOnline,
};
