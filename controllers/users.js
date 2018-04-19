const { usersModel, attributesModel, users_attributesModel } = require('../models')
const { insertOriginFrendsForUser } = require('./friends')
const { attributesData } = require('../data/index')
const { MyChatError, pick, sendRes, utils } = require('../services/MyChatUtils/')
const MyChatSendMail = require('../services/Mail/sendMail');
const fs = require('fs');
const md5 = require('md5')
const weather = require('./weather')
const { saveDeviceToken: saveDT, decreaseBadge } = require('../services/apns');

async function uploadAvatar(ctx, next) {
    ctx.param = Object.assign(ctx.param, ctx.req.body);
    let res = pick(ctx.param, ['userid']);
    let avatarPath = `public/avatar/${res.userid}.jpg`;
    let oldPath = ctx.req.file.path;
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
        let result = await weather.get(res.place);
        sendRes(ctx, { result: result });
    } catch (e) {
        throw new MyChatError(2, "天气获取失败，请勿频繁获取");
    }
    return next();
}

async function signup(ctx, next) {
    let user = pick(ctx.param, ['username', 'password']);
    user.username = user.username.toLowerCase();
    user.userid = md5(user.username);
    let [result] = await usersModel.findUserById({ userid: user.userid });
    if (result) {
        throw new MyChatError(2, '用户名已存在')
    }
    await usersModel.insertUser(user);
    await insertOriginFrendsForUser(user.userid);
    await insertOriginAttributesForUser(user.userid);
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
    user.username = user.username.toLowerCase()
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

async function addAttributes(ctx, next) {
    let obj = pick(ctx.param, ['attributeid']);
    obj.userid = ctx.params.userid;
    let [attribute] = await attributesModel.findAttributeById(obj);
    if (!attribute) {
        sendRes(ctx, { result: "Fail" });
        throw new MyChatError("属性不存在");
    }
    let [user_attribute] = await users_attributesModel.findUsersAttributeByObj(obj);
    if (user_attribute) {
        sendRes(ctx, { result: "Fail" });
        throw new MyChatError("这个好友已经拥有此属性");
    }
    await users_attributesModel.insertUsersAttribute(obj);
    let result = await users_attributesModel.findUsersAttributeById(obj);
    sendRes(ctx, { result: result });
    return next();
}


async function deleteAttributes(ctx, next) {
    let obj = pick(ctx.param, ['attributeid']);
    obj.userid = ctx.params.userid;
    let [user_attribute] = await users_attributesModel.findUsersAttributeByObj(obj);
    if (!user_attribute) {
        sendRes(ctx, { result: "Fail" });
        throw new MyChatError("这个好友不拥有此属性");
    }
    await users_attributesModel.deleteUsersAttributeByAttributeId(obj);
    let result = await users_attributesModel.findUsersAttributeById(obj);
    sendRes(ctx, { result: result });
    return next();
}

async function insertOriginAttributesForUser(userid) {
    let data = attributesData.data;
    console.log(data);
    for (e in data) {
        let [attribute] = await attributesModel.findAttributeByObj({ name: data[e].name });
        users_attributesModel.insertUsersAttribute({ userid: userid, attributeid: attribute.attributeid });
    }
}

async function saveDeviceToken(ctx, next) {
    const { userid, device_token } = ctx.param;
    await saveDT(userid, device_token);
    sendRes(ctx, {});
    return next();
}

function deleteBadge(ctx, next) {
    const { userid, delta } = ctx.param;
    decreaseBadge(userid, delta);
    return next();
}

exports = module.exports = {
    signup,
    signin,
    uploadAvatar,
    gainCode,
    gainWeather,
    addAttributes,
    deleteAttributes,
    saveDeviceToken,
    deleteBadge,
};
