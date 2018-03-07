const { friendModel, roleModel, user_friendModel } = require('../models')
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils/')

// 增加好友的请求 请求体包含 添加者id 被添加者的角色、属性以及
async function addFriend(ctx, next) {
    let friend = pick(ctx.param, ['userid', 'friendname', 'gender', 'birth']);
    friend.roleid = ctx.param['roleid'];
    let role = await roleModel.findRoleById({roleid: friend.roleid});
    friend.attribute = (role === undefined ? undefined : role.attribute);
    friend.friendid = undefined;
    await friendModel.insertFriend(friend).then(function(res) {
      friend.friendid = res.insertId;
    });
    await user_friendModel.insertUserFriend({ userid: friend.userid, friendid: friend.friendid });
    sendRes(ctx, friend)
    return next()
}

async function deleteFriend(ctx, next) {
    let friend = pick(ctx.param, ['friendid']);
    let affectedRows = -1;
    await friendModel.deleteFriend({ friendid: friend.friendid });
    await user_friendModel.deleteFriend({ friendid: friend.friendid });
    let result = { mes: "DELETE SUCCESSFULLY" };
    sendRes(ctx, result)
    return next()
}

exports = module.exports = {
    addFriend,
    deleteFriend
}
