const MyChatSendMail = require('../../services/Mail/sendMail')
const testMail = require('../../services/Mail/testMail')

let testObj = {
    service: '163',
    username: 'mychat_org@163.com',
    password: 'mychat23',
    to: '1042651820@qq.com',
    title: '欢迎使用MyChat',
    text: '欢迎使用MyChat，您的验证码是：987821，祝您使用愉快！'
}

let testobj1 = {
    username: "1042651820@qq.com",
    password: "abcd",
    host: 'imap.qq.com'
}

function validateEmail(email) {
  let pattern = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
  return pattern.test(email);
}

async function testEmail(username, password) {
  let obj = {
    user: username,
    password: password,
    host: "imap.qq.com"
  }
  return testMail(obj);
}

async function sendEmail(obj) {
  obj.service = '163';
  return new Promise(function (resolve, reject) {
    MyChatSendMail(obj).then(function(value) {
        resolve(1);
    }, function(error) {
        reject(0);
    })
  })
}

async function test () {
    let result = await sendEmail(testObj);
    console.log(result);
}

//test();

exports = module.exports = {
  validateEmail,
  testEmail,
  sendEmail,
};
