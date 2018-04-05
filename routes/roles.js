const Router = require('koa-router')
const { rolesCtrl } = require('../controllers')

const router = new Router({ prefix: '/api/roles' });

router.get('/', rolesCtrl.getAllRoles)

router.post('/', rolesCtrl.addRole)

router.delete('/', rolesCtrl.deleteRole)
exports = module.exports = router
