const Koa = require('koa');
const http = require('http')
const { loadMiddlewares } = require('./middlewares');
const { loadRouters } = require('./routes');
const { runPre } = require('./services/MyChatUtils');
const socketio = require('./services/socket.io');
(async function bootstrap() {
  try {
    await runPre.testMysql();
    const app = new Koa();
    const server = http.createServer(app.callback());
    loadMiddlewares(app, server);
    loadRouters(app);
    socketio.setSocket(server)
    server.on('error', (err) => {
      console.log(err);
    });
    server.listen(3000);
    console.log(`服务端程序正在监听3000端口`);
  } catch (err) {
    console.log(err);
  }
})();
