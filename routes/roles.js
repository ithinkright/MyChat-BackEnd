const Router = require('koa-router')
const { rolesCtrl } = require('../controllers')

const router = new Router({ prefix: '/api/roles' });

router.get('/', async function (ctx, next) {
  ctx.body = 'this is a roles api route'
})

router.post('/', rolesCtrl.addRole)


router.delete('/', rolesCtrl.deleteRole)
exports = module.exports = router
