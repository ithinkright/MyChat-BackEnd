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

  translator: {
    port: 3003,
    mysql: {
      host: '139.199.174.146',
      user: 'MyChatOwner',
      password: 'WoJueDeDui',
      database: 'MyChat-translator',
      connectionLimit: 10,
    },
  },

  weather: {
    port: 3004,
    mysql: {
      host: '139.199.174.146',
      user: 'MyChatOwner',
      password: 'WoJueDeDui',
      database: 'MyChat-weather',
      connectionLimit: 10,
    },
  },

  mary: {
    port: 3005,
    mysql: {
      host: '139.199.174.146',
      user: 'MyChatOwner',
      password: 'WoJueDeDui',
      database: 'MyChat-mary',
      connectionLimit: 10,
    },
  },

  secretary: {
    port: 3006,
    mysql: {
      host: '139.199.174.146',
      user: 'MyChatOwner',
      password: 'WoJueDeDui',
      database: 'MyChat-secretary',
      connectionLimit: 10,
    },
  },
};
