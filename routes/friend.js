const Router = require('koa-router')
const { friendCtrl } = require('../controllers')

const router = new Router({ prefix: '/api/friends' });

router.get('/', friendCtrl.getFriends)

router.post('/', friendCtrl.addFriend)


router.delete('/', friendCtrl.deleteFriend)
exports = module.exports = router
