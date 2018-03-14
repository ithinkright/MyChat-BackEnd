const { friendModel, roleModel, attributeModel } = require('../models')
const { MyChatError, pick, sendRes, mdAttr } = require('../services/MyChatUtils/')

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
    let temp = friend.attribute;
    let [originRole] = await roleModel.findRoleById({ roleid: friend.roleid });
    if (originRole) {
        temp = mdAttr.remove(temp, originRole.attribute);
        await friendModel.modifyAttribute({ friendid: obj.friendid, attributeid: temp });
    }
    await friendModel.modifyRole({ friendid: obj.friendid, roleid: obj.roleid });
    temp = mdAttr.merge(temp, role.attribute);
    await friendModel.modifyAttribute({ friendid: obj.friendid, attributeid: temp });
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
    if (friend.roleid != role.roleid) {
        throw new MyChatError(2, "该朋友不属于这个角色");
    }
    await friendModel.modifyRole({ friendid: obj.friendid, roleid: null });
    let temp = mdAttr.remove(friend.attribute, role.attribute);
    await friendModel.modifyAttribute({ friendid: obj.friendid, attributeid: temp });
    [friend] = await friendModel.findFriendById({ friendid: obj.friendid });
    sendRes(ctx, friend)
    return next();
}

exports = module.exports = {
    assignRole,
    removeRole
}
