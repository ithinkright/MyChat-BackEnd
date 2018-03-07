const { friendModel, attributeModel } = require('../models');
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils');

async function addAttribute (ctx, next) {
    const obj = pick(ctx.param, ['friendid', 'attributeid']);
    let [attribute] = attributeModel.findAttributeById({ attributeid: obj.attributeid });
    if (!attribute) {
        throw new MyChatError(2, '属性不存在')
    }
    friendModel.addFriendAttribute({friendid: obj.friendid, attributeid: obj.attributeid });
    sendRes(ctx, obj)
    return next();
}

async function deleteAttribute (ctx, next) {
    const obj = pick(ctx.param, ['friendid', 'attributeid']);
    let [attribute] = attributeModel.findAttributeById({ attributeid: obj.attributeid });
    if (!attribute) {
        throw new MyChatError(2, '属性不存在')
    }
    friendModel.deleteFriendAttribute({ friendid: obj.friendid, attributeid: obj.attributeid });
    sendRes(ctx, obj);
    return next();
}
