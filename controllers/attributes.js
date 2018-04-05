const { attributesModel } = require('../models');
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils');
const { attributesData } = require('../data/index');
const md5 = require('md5')

async function addAttribute (ctx, next) {
    let attribute = pick(ctx.param, ['name', 'description', 'usercount']);
    attribute.attributeid = md5(attribute.name);
    let [result] = await attributesModel.findAttributeById(attribute);
    if (result) {
        throw new MyChatError(2, '属性已存在')
    }
    await attributesModel.insertAttribute(attribute);
    sendRes(ctx, attribute)
    return next();
}

async function deleteAttribute (ctx, next) {
    let obj = pick(ctx.param, ['attributeid']);
    let [attribute] = await attributesModel.findAttributeById({ attributeid: obj.attributeid });
    if (!attribute) {
        throw new MyChatError(2, '属性不存在')
    }
    await attributesModel.deleteAttributeById(obj);
    sendRes(ctx, attribute)
    return next();
}

async function getAllAttributes (ctx, next) {
    let result = await attributesModel.showAllattributes();
    sendRes(ctx, {data: result});
    return next();
}

async function insertOriginAttributes () {
    let data = attributesData.data;
    for (e in data) {
        data[e].attributeid= md5(data[e].name);
        let [result] = await attributesModel.findAttributeById(data[e]);
        if (!result) {
            await attributesModel.insertAttribute(data[e]);
        }
    }
}

exports = module.exports = {
    addAttribute,
    deleteAttribute,
    getAllAttributes,
    insertOriginAttributes
}
