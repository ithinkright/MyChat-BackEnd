const { friendModel, roleModel } = require('../models')
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils/')

// 增加好友的请求 请求体包含 添加者id 被添加者的角色、属性以及
async function addFriend(ctx, next) {
    let friend = pick(ctx.param, ['userid', 'friendname', 'gender', 'birth']);
    friend.roleid = (ctx.param['roleid'] === 'undefined' ? NULL : ctx.param['roleid']);
    let role = await roleModel.findRoleById({roleid: friend.roleid});
    friend.attribute = role.attribute;
    friend.friendid = NULL;
    await friendModel.insertFriend(friend);
    sendRes(ctx, friend)
    return next()
}

async function deleteFriend(ctx, next) {
    let friend = pick(ctx.param, ['friendid']);
    let [result] = await friendModel.deleteFriend({ friendid: friend.friendid });
    if (!result) {
        throw new MyChatError(2, '该朋友不存在');
    }
    sendRes(ctx, result)
    return next()
}

exports = module.exports = {
    addFriend,
    deleteFriend
}
