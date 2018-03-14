const { friendModel, attributeModel } = require('../models');
const { MyChatError, pick, sendRes, mdAttr } = require('../services/MyChatUtils');

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
    let newAttribute = mdAttr.merge(friend.attribute, attribute.attributeid);
    await friendModel.modifyAttribute({ friendid: obj.friendid, attributeid: newAttribute });
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
    let newAttribute = mdAttr.remove(friend.attribute, attribute.attributeid);
    await friendModel.modifyAttribute({ friendid: obj.friendid, attributeid: newAttribute });
    let [result] = await friendModel.findFriendById({ friendid: obj.friendid });
    sendRes(ctx, result);
    return next();
}

exports = module.exports = {
    addAttribute,
    deleteAttribute
}
