const { usersModel } = require('../models')
const { getOriginFrends } = require('./friends')
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils/')
const fs = require('fs');
const md5 = require('md5')

async function uploadAvatar(ctx, next) {
    ctx.param = Object.assign(ctx.param, ctx.req.body);
    let res = pick(ctx.param, ['userid']);
    let avatarPath = `public/avatar/${res.userid}.jpg`;
    let oldPath = ctx.req.file.path;
    console.log(fs.existsSync(oldPath))
    console.log(ctx.req.file);
    try {
        fs.renameSync(oldPath, avatarPath);
        sendRes(ctx)
    } catch (e) {
        throw new MyChatError(2, "头像上传失败");
    }
    return next();
}

async function signup(ctx, next) {
    let user = pick(ctx.param, ['username', 'password']);
    user.userid = md5(user.username);
    let [result] = await usersModel.findUserById({ userid: user.userid });
    if (result) {
        throw new MyChatError(2, '用户名已存在')
    }
    await usersModel.insertUser(user);
    await getOriginFrends(user.userid);
    let avatarPath = `public/avatar/${user.userid}.jpg`;
    try {
        fs.copyFileSync("public/images/default.png", avatarPath);
    } catch (e) {
        console.log(e);
    }
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
    signin,
    uploadAvatar
}
