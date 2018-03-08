const { friendModel, roleModel, attributeModel } = require('../models')
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils/')

async function assignRole(ctx, next) {
    const obj = pick(ctx.param, ['friendid', 'roleid']);
    let [friend] = await friendModel.findFriendById({ friendid: obj.friendid });
    let [role] = await roleModel.findRoleById({ roleid: obj.roleid });
    if (!friend) {
        throw new MyChatError(2, "找不到此朋友")
    }
    if (!role) {
        throw new MyChatError(2, "找不到此角色")
    }
    await friendModel.assignRole({ friendid: obj.friendid, roleid: obj.roleid });
    await friendModel.addFriendAttribute({ friendid: obj.friendid, attributeid: role.attribute });
    [friend] = await friendModel.findFriendById({ friendid: obj.friendid });
    sendRes(ctx, friend)
    return next();
}

async function removeRole(ctx, next) {
    const obj = pick(ctx.param, ['friendid', 'roleid']);
    let [friend] = await friendModel.findFriendById({ friendid: obj.friendid });
    let [role] = await roleModel.findRoleById({ roleid: obj.roleid });
    if (!friend) {
        throw new MyChatError(2, "找不到此朋友")
    }
    if (!role) {
        throw new MyChatError(2, "找不到此角色")
    }
    await friendModel.removeRole({ friendid: obj.friendid, roleid: obj.roleid });
    await friendModel.deleteFriendAttribute({ friendid: obj.friendid, attributeid: role.attribute });
    [friend] = await friendModel.findFriendById({ friendid: obj.friendid });
    sendRes(ctx, friend)
    return next();
}

exports = module.exports = {
    assignRole,
    removeRole
}
