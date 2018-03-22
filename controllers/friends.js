const { usersModel, friendModel, roleModel, user_friendModel, attributeModel } = require('../models')
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils/')
const { friendsData } = require('../data');
const fs = require('fs');

async function uploadAvatar(ctx, next) {
    ctx.param = Object.assign(ctx.param, ctx.req.body);
    console.log(ctx.req.file);
    let res = pick(ctx.param, ['friendid']);
    let avatarPath = `public/friendAvatar/${res.friendid}.jpg`;
    let oldPath = ctx.req.file.path;
    console.log(fs.existsSync(oldPath))
    console.log(ctx.req.file);
    try {
        fs.renameSync(oldPath, avatarPath);
        sendRes(ctx)
    } catch (e) {
        throw new MyChatError(2, "头像上传失败");
    }
    return next();
}

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

async function getFriends(ctx, next) {
    let user = pick(ctx.param, ['userid']);
    let user_friend = await user_friendModel.findUserFriendByObj(user);
    let result = [];
    for (let i in user_friend) {
        let [friend] = await friendModel.findFriendById({ friendid: user_friend[i].friendid });
        let [attribute] = await attributeModel.findAttributeById({ attributeid: friend.attribute });
        let [role] = await roleModel.findRoleById({ roleid: friend.roleid });
        friend.attributename = (attribute ? attribute.name : null);
        friend.rolename = (role ? role.name : null);
        friend.friendid = friend.friendid.toString();
        result.push(friend);
    }
    sendRes(ctx, {data: result});
    return next();
}


async function updatePreference(ctx, next) {
    if (!ctx.params.friendid) {
        sendRes(ctx, {result: "设置失败，请重试"});
        throw new MyChatError(2, "好友id有误");
    }
    let obj = ctx.param;
    let [friend] = await user_friendModel.findUserFriendByObj({ friendid: ctx.params.friendid });
    if (!friend) {
        throw new MyChatError(2, "好友不存在");
    }
    if (friend.preference) {
        obj = Object.assign(JSON.parse(friend.preference), obj)
    }
    friend.preference = JSON.stringify(obj);
    await user_friendModel.updatePreference({ friendid: friend.friendid, preference: friend.preference });
    return next();
}

async function getOriginFrends(userid, next) {
    let data = friendsData.data;
    for (e in data) {
          data[e].userid = userid;
          await setAttribute(data[e]);
          data[e].friendid = undefined;
          await insertFriends(data[e]);
    }
    return next();
}

async function insertFriends(friend, next) {
    await friendModel.insertFriend(friend).then(function(res) {
        friend.friendid = res.insertId;
    });
    let attributeSet = friend.attribute.split(',');
    let first = (attributeSet.length === 0 ? "default" : attributeSet[0]);
    let path = `public/friendAvatar/${first}.png`;
    if (!fs.existsSync(path)) {
        path = "public/friendAvatar/default.png";
    }
    let avatarPath = `public/friendAvatar/${friend.friendid}.jpg`;
    try {
        fs.copyFileSync(path, avatarPath);
    } catch (e) {
        console.log(e);
    }
    await user_friendModel.insertUserFriend({ userid: friend.userid, friendid: friend.friendid });
    return next();
}

async function setAttribute(friend, next) {
    let [role] = await roleModel.findRoleById({roleid: friend.roleid});
    if (friend.roleid && !role) {
        throw new MyChatError(2, "该角色id指向的角色不存在")
    }
    friend.attribute = (role === undefined ? undefined : role.attribute);
    return next();
}

exports = module.exports = {
    addFriend,
    deleteFriend,
    getOriginFrends,
    updatePreference,
    getFriends,
    uploadAvatar
}
