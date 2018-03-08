const Router = require('koa-router')
const { dealMessageCtrl } = require('../controllers')

const router = new Router({ prefix: '/api/dealMessage' });

router.get('/', async function (ctx, next) {
  ctx.body = 'this is a dealMessage api route'
})

router.post('/', dealMessageCtrl.process)

exports = module.exports = router
