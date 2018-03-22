const { MyChatError, pick, sendRes } = require('../services/MyChatUtils');
const MyChatSendMail = require('../services/Mail/sendMail');

async function verifyEmail() {
    var checkCode = "";
    var codeLength = 4;
    let obj = {
        service: '163',
        username: 'mychat_org@163.com',
        password: 'mychat123',
        to: 'zhengweimumu@163.com',
        title: '欢迎使用MyChat',
        text: `欢迎使用MyChat，您的验证码是：${checkCode}，祝您使用愉快！`,
        files: [{
            filename: 'MyChat简历',
            path: './sendMail.js' //这里需要稍微注意一下 相对路径是该函数执行的位置的相对路径
        }]
    }

    var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',
             'S','T','U','V','W','X','Y','Z');
    for (var i = 0; i < codeLength; i++) {
        var index = Math.floor(Math.random()*36);
        checkCode += random[index];
    }
    console.log(obj.text);
    await MyChatSendMail(obj.text);

}

async function test() {
  await verifyEmail();
}

// test();

exports = module.exports = {
  verifyEmail
}
