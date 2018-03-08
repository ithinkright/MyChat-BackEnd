const { usersModel, friendModel, roleModel, user_friendModel } = require('../models')
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils/')
const { friendsData } = require('../data');

// 增加好友的请求 请求体包含 添加者id 被添加者的角色、属性以及
async function addFriend(ctx, next) {
    let friend = pick(ctx.param, ['userid', 'friendname', 'gender', 'birth']);
    friend.roleid = ctx.param['roleid'];
    let [user] = await usersModel.findUserById({userid: friend.userid});
    if (!user) {
        throw new MyChatError(2, "该用户不存在")
    }
    await setAttribute(friend);
    await insertFriends(friend);
    sendRes(ctx, friend)
    return next()
}

async function deleteFriend(ctx, next) {
    let obj = pick(ctx.param, ['friendid']);
    let affectedRows = -1;
    let [friend] = await friendModel.findFriendById({ friendid: obj.friendid });
    if (!friend) {
        throw new MyChatError(2, "该朋友不存在")
    }
    await friendModel.deleteFriend({ friendid: friend.friendid });
    let [user_friend] = await user_friendModel.findUserFriendByObj( { friendid: friend.friendid });
    friend.userid = user_friend.userid;
    await user_friendModel.deleteFriend({ friendid: friend.friendid });
    let result = { mes: "DELETE SUCCESSFULLY", userid: friend.userid, friendid: friend.friendid };
    sendRes(ctx, result)
    return next()
}

async function getOriginFrends(userid) {
    let data = friendsData.data;
    for (e in data) {
          data[e].userid = userid;
          await setAttribute(data[e]);
          console.log(data[e]);
          await insertFriends(data[e]);
    }
}

async function getFriends(ctx, next) {
    sendRes(ctx, {friendsData});
}

async function insertFriends(friend) {
    await friendModel.insertFriend(friend).then(function(res) {
      friend.friendid = res.insertId;
    });
    await user_friendModel.insertUserFriend({ userid: friend.userid, friendid: friend.friendid });
}

async function setAttribute(friend) {
    let [role] = await roleModel.findRoleById({roleid: friend.roleid});
    if (friend.roleid && !role) {
        throw new MyChatError(2, "该角色id指向的角色不存在")
    }
    friend.attribute = (role === undefined ? undefined : role.attribute);
}

exports = module.exports = {
    addFriend,
    deleteFriend,
    getOriginFrends,
    getFriends
}
