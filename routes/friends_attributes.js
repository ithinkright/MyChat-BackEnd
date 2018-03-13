const Router = require('koa-router')
const { friends_attributes } = require('../controllers')

const router = new Router({ prefix: '/api/friendsattr' });

router.get('/', async function (ctx, next) {
  ctx.body = 'this is a friends attributes api route'
})

router.post('/', friends_attributes.addAttribute)


router.delete('/', friends_attributes.deleteAttribute)
exports = module.exports = router
