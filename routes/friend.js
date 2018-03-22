const Router = require('koa-router')
const multer = require('koa-multer')
const upload = multer({ dest: '../public/' })
const { friendCtrl } = require('../controllers')

const router = new Router({ prefix: '/api/friends' });

router.get('/', friendCtrl.getFriends)

router.post('/', friendCtrl.addFriend)

router.post('/upload', upload.single('friendAvatar'), friendCtrl.uploadAvatar)

router.post('/:friendid/preferences', friendCtrl.updatePreference)

router.delete('/', friendCtrl.deleteFriend)
exports = module.exports = router
