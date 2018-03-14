let socketio = {};
const io = require('socket.io')();
const receiveMail = require('../Mail/receiveMail');
let map = new Map();
let test = {
    user: '934657014@qq.com',
    password: 'umffjousigrgbbhb',
    host: 'imap.qq.com'
}

socketio.setSocket = function (server) {
    io.attach(server);
    io.on('connection', function (socket) {
        socket.on('start', function (data) {
            console.log(data);
            map.set(data.userid, socket);
            console.log(map.get(data.userid));
        })
    })
    io.of('/schedule').on('connection', function (socket) {
        socket.on('start', function (data) {
            setTimeout(function () {
                socket.emit('schedule', { thing: data.thing })
            }, data.time * 1000);
            socket.emit('scheduleSuccess', {
                mes: '日程创建成功'
            })
        })
    })
    io.of('/mail').on('connection', function (socket) {
        socket.on('start', function (data) {
            receiveMail(data, socket)
        })
    })
}

exports = module.exports = socketio;
