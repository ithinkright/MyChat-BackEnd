const Router = require('koa-router')
const { friendCtrl } = require('../controllers')

const router = new Router({ prefix: '/api/friends' });

router.get('/', async function (ctx, next) {
  ctx.body = 'this is a friends api route'
})

router.post('/', friendCtrl.addFriend)


router.delete('/', friendCtrl.deleteFriend)
exports = module.exports = router
