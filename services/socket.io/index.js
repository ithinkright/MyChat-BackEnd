const io = require('socket.io')();
const { pushNotificetion } = require('../apns');
const umModel = require('../../models/unread_message');

const sockets = new Map();
const online = new Map();
const test_online = new Map();
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

    socket.on('test-online', (data) => {
      console.log('test-online', data);
      const { userid } = data;
      test_online.set(userid, true);
    });
  });
}

async function testOnline(userid) {
  const socket = sockets.get(userid);
  if (!socket) return false;
  if (!online.has(userid) || !online.get(userid)) return false;
  test_online.set(userid, false);
  socket.emit('test-online', {});
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      if (test_online.get(userid)) {
        resolve(true);
      } else resolve(false);
    }, 1000);
  });
}

async function sendMessages(friendid, userid, messages) {
  if (!messages || messages.length === 0) return;
  if (await testOnline(userid)) {
    const socket = sockets.get(userid);
    socket.emit('messages', { friendid, messages });
  } else {
    pushNotificetion(userid, friendid, messages);
    umModel.insert(userid, friendid, messages, new Date(), 0);
  }
}

exports = module.exports = {
  setSocket,
  sendMessages,
};
