const { usersModel } = require('../models')
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils/')
const md5 = require('md5')

async function signup(ctx, next) {
    let user = pick(ctx.param, ['username', 'password']);
    user.userid = md5(user.username);
    let [result] = await usersModel.findUserById({ userid: user.userid });
    if (result) {
        throw new MyChatError(2, '用户名已存在')
    }
    await usersModel.insertUser(user);
    sendRes(ctx, user)
    return next()
}

async function signin(ctx, next) {
    let user = pick(ctx.param, ['username', 'password']);
    let [result] = await usersModel.findUserByObj({ username: user.username })
    if (!result) {
        throw new MyChatError(2, '用户名不存在');
    }
    if (result.password !== user.password) {
        throw new MyChatError(2, '密码错误');
    }
    sendRes(ctx, result)
    return next()
}

exports = module.exports = {
    signup,
    signin
}