const { friendModel, attributeModel } = require('../models');
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils');

async function addAttribute (ctx, next) {
    const obj = pick(ctx.param, ['friendid', 'attributeid']);
    let [attribute] = await attributeModel.findAttributeById({ attributeid: obj.attributeid });
    let [friend] = await friendModel.findFriendById({ friendid: obj.friendid });
    if (!friend) {
        throw new MyChatError(2, '该id指向的朋友不存在')
    }
    if (!attribute) {
        throw new MyChatError(2, '属性不存在')
    }
    await friendModel.addFriendAttribute({ friendid: obj.friendid, attributeid: obj.attributeid });
    let [result] = await friendModel.findFriendById({ friendid: obj.friendid });
    sendRes(ctx, result)
    return next();
}

async function deleteAttribute (ctx, next) {
    const obj = pick(ctx.param, ['friendid', 'attributeid']);
    let [attribute] = await attributeModel.findAttributeById({ attributeid: obj.attributeid });
    let [friend] = await friendModel.findFriendById({ friendid: obj.friendid });
    if (!friend) {
        throw new MyChatError(2, '该id指向的朋友不存在')
    }
    if (!attribute) {
        throw new MyChatError(2, '属性不存在')
    }
    await friendModel.deleteFriendAttribute({ friendid: obj.friendid, attributeid: obj.attributeid });
    let [result] = await friendModel.findFriendById({ friendid: obj.friendid });
    sendRes(ctx, result);
    return next();
}

exports = module.exports = {
    addAttribute,
    deleteAttribute
}
