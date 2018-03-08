const { roleModel, attributeModel } = require('../models');
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils');
const md5 = require('md5')

async function addRole (ctx, next) {
    let obj = pick(ctx.param, ['name', 'description', 'attribute', 'usercount']);
    obj.roleid = md5(obj.name);
    let [result] = await roleModel.findRoleByObj(obj);
    if (result) {
        throw new MyChatError(2, '角色已存在')
    }
    await roleModel.insertRole(obj);
    sendRes(ctx, obj)
    return next();
}

async function deleteRole (ctx, next) {
    let obj = pick(ctx.param, ['roleid']);
    let [result] = await roleModel.findRoleById(obj);
    if (!result) {
        throw new MyChatError(2, '角色不存在')
    }
    await roleModel.deleteRole(obj);
    sendRes(ctx, obj)
    return next();
}

exports = module.exports = {
    addRole,
    deleteRole
}
