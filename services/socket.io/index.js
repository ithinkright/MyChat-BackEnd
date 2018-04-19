const io = require('socket.io')();
const { pushNotificetion } = require('../apns');

const sockets = new Map();
const online = new Map();  // 0不在线，1检测中，2在线
const test_timeout = 3000;
const unread_messages = new Map();

function setSocket(server) {
  io.attach(server);
  io.on('connection', function (socket) {
    socket.on('hello', function (data) {
      console.log(data);
      const { userid } = data;
      sockets.set(userid, socket);
      online.set(userid, true);
    });

    socket.on('message', (data) => {
      console.log(data);
    });

    socket.on('online', (data) => {
      console.log('online', data);
      const { userid } = data;
      online.set(userid, true);
    });

    socket.on('offline', (data) => {
      console.log('offline', data);
      const { userid } = data;
      online.set(userid, false);
    });
  });
}

function isOnline(userid) {
  return online.has(userid) && online.get(userid);
}

async function sendMessages(friendid, userid, messages) {
  console.log('*******', online);
  if (!messages || messages.length === 0) return;
  console.log('isOnline: ', userid, isOnline(userid));
  if (isOnline(userid)) {
    const socket = sockets.get(userid);
    socket.emit('messages', {
      friendid,
      messages,
    });
  } else {
    pushNotificetion(userid, friendid, messages);
  }
}

exports = module.exports = {
  setSocket,
  sendMessages,
};
