const { attributeModel } = require('../models');
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils');
const md5 = require('md5')

async function addAttribute (ctx, next) {
    let attribute = pick(ctx.param, ['name', 'description', 'usercount']);
    attribute.attributeid = md5(attribute.name);
    let [result] = await attributeModel.findAttributeById(attribute);
    if (result) {
        throw new MyChatError(2, '属性已存在')
    }
    await attributeModel.insertAttribute(attribute);
    sendRes(ctx, attribute)
    return next();
}

async function deleteAttribute (ctx, next) {
    let obj = pick(ctx.param, ['attributeid']);
    let [attribute] = await attributeModel.findAttributeById({ attributeid: obj.attributeid });
    if (!attribute) {
        throw new MyChatError(2, '属性不存在')
    }
    await attributeModel.deleteAttributeById(obj);
    sendRes(ctx, attribute)
    return next();
}

exports = module.exports = {
    addAttribute,
    deleteAttribute
}
