const Router = require('koa-router')
const { weatherCtrl } = require('../controllers')

const router = new Router({ prefix: '/api/weather' });

router.get('/', weatherCtrl.get);

exports = module.exports = router
