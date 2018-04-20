const Router = require('koa-router');
const { umCtrl } = require('../controllers')

const router = new Router({ prefix: '/api/unread_messages' });

router.get('/all', umCtrl.getAll);

router.get('/one', umCtrl.getOne);

router.delete('/', umCtrl.del);

exports = module.exports = router;
