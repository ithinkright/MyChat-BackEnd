const Router = require('koa-router')
const { attributesCtrl } = require('../controllers')

const router = new Router({ prefix: '/api/attributes' });

router.get('/', attributesCtrl.getAllAttributes)

router.post('/', attributesCtrl.addAttribute)

router.delete('/', attributesCtrl.deleteAttribute)
exports = module.exports = router
