exports = module.exports = {
  io: {
    path: '/',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
  },

  postman: {
    port: 3001,
    mysql: {
      host: '139.199.174.146',
      user: 'MyChatOwner',
      password: 'WoJueDeDui',
      database: 'MyChat-postman',
      connectionLimit: 10,
    },
  },

  calculator: {
    port: 3002,
  },
};
