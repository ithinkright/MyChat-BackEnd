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
    password: "pdyyhgnzeztxbbgc",
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
  try {
    let result = await testMail(obj);
    console.log(1)
    return 1;
  }
  catch(e) {
    console.log(0)
    return 0;
  }
}

async function sendEmail(obj) {
  obj.service = 'qq';
  try {
    await MyChatSendMail(obj);
    return 1;
  }
  catch(e) {
    console.log(e);
    return 0;
  }
}

async function test () {
    let result = await testEmail(testobj1.username, testobj1.password);
    console.log(result);
}

//test();

exports = module.exports = {
  validateEmail,
  testEmail,
  sendEmail,
};
