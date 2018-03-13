const { pick,MyChatError,sendRes } = require("../services/MyChatUtils")
const MyChatSendMail = require("../services/Mail/sendMail")

let testObj = {
    service: '163',
    username: 'zhengweimumu@163.com',
    password: 'weimumu123',
    to: '13719280429@163.com',
    title: 'MyChat发送邮件测试',
    text: 'MyChat发送邮件测试',
    filename: 'MyChat简历',
    path: './sendMail.js'
}

async function send(ctx, next) {
    try {
        let mail = pick(ctx.param, ["service", "username", "password", "to", "title", "text", "filename", "path"]);
        MyChatSendMail(mail);
    }
    catch (e) {
        sendRes(ctx, {result: "发送失败"});
    }
    sendRes(ctx, {result: "发送成功"});
    return next();
}
