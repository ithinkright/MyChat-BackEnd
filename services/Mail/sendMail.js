const nodemailer = require('nodemailer');

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
        text: myObj.text,
        attachments: [
            {
                filename: myObj.filename,
                path: myObj.path
            }
        ]
    };
    try {
        let result = await transporter.sendMail(mailOptions);
    } catch (e) {
        console.log(error);
    }
}

MyChatSendMail(testObj)
