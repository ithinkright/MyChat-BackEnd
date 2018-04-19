const { rolesModel, attributesModel } = require('../models');
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils');
const { rolesData } = require('../data/index');
const md5 = require('md5')

async function addRole (ctx, next) {
    let obj = pick(ctx.param, ['name', 'description', 'attribute', 'usercount']);
    obj.roleid = md5(obj.name);
    let [result] = await rolesModel.findRoleByObj(obj);
    if (result) {
        throw new MyChatError(2, '角色已存在')
    }
    let [attribute] = await attributesModel.findAttributeById({ attributeid: obj.attribute });
    if (!attribute) {
        throw new MyChatError(2, '属性不存在');
    }
    await rolesModel.insertRole(obj);
    sendRes(ctx, obj)
    return next();
}

async function deleteRole (ctx, next) {
    let obj = pick(ctx.param, ['roleid']);
    let [result] = await rolesModel.findRoleById(obj);
    if (!result) {
        throw new MyChatError(2, '角色不存在')
    }
    await rolesModel.deleteRole(obj);
    sendRes(ctx, obj)
    return next();
}

async function getAllRoles(ctx, next) {
    let result = await rolesModel.showAllRoles();
    sendRes(ctx, {data: result});
    return next();
}

async function insertOriginRoles () {
    let data = rolesData.data;
    for (e in data) {
        data[e].roleid= md5(data[e].name);
        let [result] = await rolesModel.findRoleById(data[e]);
        if (!result) {
            await rolesModel.insertRole(data[e]);
        }
    }
}

exports = module.exports = {
    addRole,
    deleteRole,
    getAllRoles,
    insertOriginRoles
}
