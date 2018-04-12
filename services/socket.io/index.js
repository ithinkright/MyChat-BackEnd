const io = require('socket.io')();
const receiveMail = require('../Mail/receiveMail');

let sockets = new Map();
let test = {
    user: '934657014@qq.com',
    password: 'umffjousigrgbbhb',
    host: 'imap.qq.com'
}

function setSocket(server) {
  io.attach(server);
  io.on('connection', function (socket) {
    socket.on('hello', function (data) {
      console.log(data);
      const { userid } = data;
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

function sendMessages(friendid, userid, messages) {
  if (!messages || messages.length === 0) return;
  if (!sockets.has(userid)) return;
  const socket = sockets.get(userid);
  socket.emit('messages', {
    friendid,
    messages,
  });
}

exports = module.exports = {
  setSocket,
  sendMessages,
};
