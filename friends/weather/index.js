const server = require('http').createServer();
const api = require('./api');
const db = require('./db');
const config = require('../config');

const users = {};
const help = '直接告诉我城市名来看天气';

const io = require('socket.io')(server, config.io);

io.on('connection', (socket) => {
  socket.on('hello', async (data) => {
    console.log(data);
    const { userid } = data;
    const [user] = await db.findUserById(userid);
    if (!user) {
      db.createUser(userid);
      users[userid] = { location: null, last_time: new Date() };
      socket.emit('message', { message: 'Hello，初次见面，需要知道你住在哪座城市~' });
    } else {
      users[userid] = user;
      if (!api.isToday(user.last_time)) {
        try {
          const weather = await api.getWeather(user.location, 1);
          socket.emit('message', { message: weather });
        } catch (err) {
          socket.emit('message', { message: 'Sorry, 暂时查询不到，晚点再试下吧~' })
        }
      }
      db.updateLastTime(userid, new Date());
    }
  });

  socket.on('message', async (data) => {
    console.log(data);
    const { userid, message: location } = data;
    const user = users[userid];
    const is_new_user = user.location === null;
    if (is_new_user) {
      await db.updateLocation(userid, location);
      users[userid].location = location;
    }
    const weather = await api.getWeather(location);
    socket.emit('message', { message: weather });
    db.updateLocation(userid, location);
  });
});

server.listen(config.weather.port);
