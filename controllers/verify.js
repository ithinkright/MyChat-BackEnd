const { MyChatError, pick, sendRes } = require('../services/MyChatUtils');
const MyChatSendMail = require('../services/Mail/sendMail');
const md5 = require('md5');

async function verifyEmail(ctx, next) {
    let obj = pick(ctx.param, ['email']);
    var checkCode = md5(getRandomCode());
    let info = {
        service: '163',
        username: 'mychat_org@163.com',
        password: 'mychat123',
        to: `${obj.email}`,
        title: '欢迎使用MyChat',
        text: `欢迎使用MyChat，您的验证码是：${checkCode}，祝您使用愉快！`,
        files: [{
            filename: 'MyChat简历',
            path: './app.js' //这里需要稍微注意一下 相对路径是该函数执行的位置的相对路径
        }]
    }
    await MyChatSendMail(info);
    sendRes(ctx, {result: checkCode });
}

function getRandomCode() {
    let checkCode = "";
    var codeLength = 4;
    var random = new Array(0,1,2,3,4,5,6,7,8,9);
    for (var i = 0; i < codeLength; i++) {
        var index = Math.floor(Math.random()*10);
        checkCode += random[index];
    }
    return checkCode;
}

exports = module.exports = {
  verifyEmail
}
