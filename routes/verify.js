const Router = require('koa-router')
const { verifyCtrl } = require('../controllers')

const router = new Router({ prefix: '/api/verify' });

router.get('/', verifyCtrl.verifyEmail);

exports = module.exports = router
