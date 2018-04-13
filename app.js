const Koa = require('koa');
const http = require('http')
const { loadMiddlewares } = require('./middlewares');
const { loadRouters } = require('./routes');
const { runPre } = require('./services/MyChatUtils');
const socketio = require('./services/socket.io');
const { usersModel,attributesModel,friendsModel,rolesModel,users_friendsModel,users_attributesModel } = require('./models');
const { MyChatError } = require('./services/MyChatUtils');
const queryDB = require('./services/db');
const compute = require('./services/Compute/index');
const translate = require('./services/Translator/youdao');
const { getOriginFrends } = require('./controllers/friends');
const { attributesCtrl } = require('./controllers/index');
require('./friends');

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
    await createDataBase();
    await attributesCtrl.insertOriginAttributes();
    //await getOriginFrends("21633e8138c5669902a4bed40ec6516b");
    //await testSql();
  } catch (err) {
    console.log(err);
  }
})();

async function createDataBase() {
    await usersModel.createUserTable();
    await attributesModel.createAttributeTable();
    await friendsModel.createFriendTable();
    await rolesModel.createRoleTable();
    await users_friendsModel.createUserFriendTable();
    await users_attributesModel.createUsersAttributeTable();
}

async function testSql() {
  let obj = {friendid: 8};
  let [friend] = await friendsModel.findFriendById(obj);
  console.log(friend);
}
