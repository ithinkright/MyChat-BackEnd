const Router = require('koa-router')
const { friends_roles } = require('../controllers')

const router = new Router({ prefix: '/api/friendsroles' });

router.get('/', async function (ctx, next) {
  ctx.body = 'this is a friends roles api route'
})

router.post('/', friends_roles.assignRole)


router.delete('/', friends_roles.removeRole)
exports = module.exports = router
