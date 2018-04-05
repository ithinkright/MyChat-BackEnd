const Router = require('koa-router')
const multer = require('koa-multer')
const upload = multer({ dest: '../public/' })
const { friendCtrl, friends_attributesCtrl, friends_rolesCtrl  } = require('../controllers')

const router = new Router({ prefix: '/api/friends' });

router.get('/', friendCtrl.getFriends)

router.post('/', friendCtrl.addFriend)

// 好友上传头像
router.post('/upload', upload.single('friendAvatar'), friendCtrl.uploadAvatar)

// 给好友加上配置项目
router.post('/:friendid/preferences', friendCtrl.updatePreference)

// 增删好友属性
router.post('/:friendid/attributes', friends_attributesCtrl.addAttribute)
router.delete('/:friendid/attributes', friends_attributesCtrl.deleteAttribute)

// 给好友添加/移除角色
router.post('/:friendid/roles', friends_rolesCtrl.assignRole)
router.delete('/:friendid/roles', friends_rolesCtrl.removeRole)

router.delete('/', friendCtrl.deleteFriend)
exports = module.exports = router
