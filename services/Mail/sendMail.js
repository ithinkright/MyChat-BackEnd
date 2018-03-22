const nodemailer = require('nodemailer');

let testObj = {
    service: '163',
    username: 'mychat_org@163.com',
    password: 'mychat123',
    to: 'zhengweimumu@163.com',
    title: '欢迎使用MyChat',
    text: '欢迎使用MyChat，您的验证码是：987821，祝您使用愉快！',
    files: [{
        filename: 'MyChat简历',
        path: './sendMail.js' //这里需要稍微注意一下 相对路径是该函数执行的位置的相对路径
    }]
}

async function MyChatSendMail(myObj) {
    let transporter = nodemailer.createTransport({
        service: myObj.service, //163orqq
        auth: {
            user: myObj.username, // generated ethereal user
            pass: myObj.password  // generated ethereal password
        }
    });
    let mailOptions = {
        from: myObj.username, // 发送者
        to: myObj.to, // 接受者,可以同时发送多个,以逗号隔开
        subject: myObj.title, // 标题
        text: myObj.text, //内容
        attachments: myObj.files,
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (e) {
        throw e;
    }
}

//MyChatSendMail(testObj);
exports = module.exports = MyChatSendMail;
