const Router = require('koa-router')
const { attributesCtrl } = require('../controllers')

const router = new Router({ prefix: '/api/attributes' });

router.get('/', async function (ctx, next) {
  ctx.body = 'this is a attributes api route'
})

router.post('/', attributesCtrl.addAttribute)


router.delete('/', attributesCtrl.deleteAttribute)
exports = module.exports = router
