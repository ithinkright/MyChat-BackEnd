const { usersModel } = require('../models')
const { getOriginFrends } = require('./friends')
const getWeather = require('../services/Weather')
const MyChatSendMail = require('../services/Mail/sendMail');
const { MyChatError, pick, sendRes, utils } = require('../services/MyChatUtils/')
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

async function gainWeather(ctx, next) {
    let res = pick(ctx.param, ['place']);
    try {
        let result = await getWeather(res.place);
        sendRes(ctx, result);
    } catch (e) {
        throw new MyChatError(2, "天气获取失败，请勿频繁获取");
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

async function gainCode(ctx, next) {
    let code = utils.proCode();
    let user = pick(ctx.param, ['username']);
    let Obj = {
        service: '163',
        username: 'mychat_org@163.com',
        password: 'mychat123',
        to: user.username,
        title: '欢迎使用MyChat',
        text: `[MyChat]，您的邮箱验证码是：${code}，5分钟内有效。请勿向他人泄露。如非本人操作，可忽略本信息。`,
        files: [],
    };
    try {
        await MyChatSendMail(Obj);
        sendRes(ctx, { authcode: code });
    } catch (e) {
        throw new MyChatError(2, '验证码无法成功发送，请重新输入邮箱');
    }
    return next();
}
exports = module.exports = {
    signup,
    signin,
    uploadAvatar,
    gainCode,
    gainWeather
}
