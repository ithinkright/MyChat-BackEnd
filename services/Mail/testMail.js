const Imap = require('imap');
const path = require('path')
const simpleParser = require('mailparser').simpleParser;
const fs = require('fs');
let test = {
    user: '934657014@qq.com',
    password: 'hahahahah',
    host: 'imap.qq.com'
}

let test1 = {
    user: 'zhengweilin2@bigo.sg',
    password: 'hahaha',
    host: 'mail.bigo.sg'
}

async function testMail(obj) {
    let flag = true;
    let imap = new Imap({
        user: obj.user,
        password: obj.password,
        host: obj.host,
        port: 993,
        tls: true
    });
    return new Promise(function (resolve, reject) {
        imap.once('error', function (err) {
            reject(0);
        });
        imap.once('ready', function () {
            resolve(1);
            imap.end();
        });
        imap.connect();
    })
}

exports = module.exports = testMail;
// async function test11() {
//     try {
//         let result = await testMail(test1);
//         console.log(result)
//     } catch (e) {
//         console.log(e)
//     }
// }

// test11();