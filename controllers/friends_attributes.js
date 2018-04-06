const { friendsModel, attributesModel } = require('../models');
const { MyChatError, pick, sendRes, mdAttr } = require('../services/MyChatUtils');

async function addAttribute (ctx, next) {
    const obj = pick(ctx.param, ['attributeid']);
    obj.friendid = ctx.params.friendid;
    let [attribute] = await attributesModel.findAttributeById({ attributeid: obj.attributeid });
    let [friend] = await friendsModel.findFriendById({ friendid: obj.friendid });
    if (!friend) {
        throw new MyChatError(2, '该id指向的朋友不存在')
    }
    if (!attribute) {
        throw new MyChatError(2, '属性不存在')
    }
    let newAttribute = mdAttr.merge(friend.attribute, attribute.attributeid);
    await friendsModel.modifyAttribute({ friendid: obj.friendid, attributeid: newAttribute });
    let [result] = await friendsModel.findFriendById({ friendid: obj.friendid });
    result.friendid = result.friendid.toString();
    sendRes(ctx, result)
    return next();
}

async function deleteAttribute (ctx, next) {
    const obj = pick(ctx.param, ['attributeid']);
    obj.friendid = ctx.params.friendid;
    let [attribute] = await attributesModel.findAttributeById({ attributeid: obj.attributeid });
    let [friend] = await friendsModel.findFriendById({ friendid: obj.friendid });
    if (!friend) {
        throw new MyChatError(2, '该id指向的朋友不存在')
    }
    if (!attribute) {
        throw new MyChatError(2, '属性不存在')
    }
    let newAttribute = mdAttr.remove(friend.attribute, attribute.attributeid);
    await friendsModel.modifyAttribute({ friendid: obj.friendid, attributeid: newAttribute });
    let [result] = await friendsModel.findFriendById({ friendid: obj.friendid });
    result.friendid = result.friendid.toString();
    sendRes(ctx, result);
    return next();
}

exports = module.exports = {
    addAttribute,
    deleteAttribute
}
