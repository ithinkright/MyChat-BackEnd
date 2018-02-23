const Router = require('koa-router')
const { usersCtrl } = require('../controllers')

const router = new Router({ prefix: '/api/users' });

router.get('/', async function (ctx, next) {
  ctx.body = 'this is a users api route'
})

router.post('/signin', usersCtrl.signin)


router.post('/signup', usersCtrl.signup)
exports = module.exports = router
