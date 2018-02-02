const Imap = require('imap');
const path = require('path')
const simpleParser = require('mailparser').simpleParser;
const fs = require('fs');
let test = {
    user: '934657014@qq.com',
    password: 'umffjousigrgbbhb',
    host: 'imap.qq.com'
}

function receiveMail(obj, socket) {
    let flag = true;
    let imap = new Imap({
        user: obj.user,
        password: obj.password,
        host: obj.host,
        port: 993,
        tls: true
    });

    imap.once('ready', function () {
        imap.openBox('INBOX', true, function (err, box) {
            if (err) {
                socket.emit('mailError', { mes: '无法打开指定邮箱' })
            } else {
                let userMail = __dirname + `/../../data/mail/${obj.user}`;
                if (!fs.existsSync(userMail)) {
                    fs.mkdirSync(userMail);
                }
                socket.emit('mailSuccess', { mes: '成功绑定邮箱' })
            }
        })
    })

    imap.once('error', function (err) {
        socket.emit('someerror', {
            mes: '请前往邮件服务商获取正确授权码用于登录'
        })
    });
    imap.once('end', function () {
        console.log('Connection ended');
    });

    imap.on('mail', function (params) {
        if (flag) {
            flag = false;
            return;
        }
        imap.openBox('INBOX', true, function (err, box) {
            if (err) throw err;
            imap.search(['NEW'], function (err, result) {
                if (err) {
                    throw err;
                }
                let f = imap.fetch(result[result.length - 1], { bodies: '' });
                f.on('message', function (msg, seqno) {
                    let mailContent = {
                        attachments: []
                    };
                    msg.on('body', function (stream, info) {
                        simpleParser(stream, (err, mail) => {
                            mailContent.subject = mail.headers.get('subject');
                            mailContent.from = mail.headers.get('from').text;
                            mailContent.to = mail.headers.get('to').text;
                            mailContent.date = mail.headers.get('date');
                            let maildirdate = __dirname + `/../../data/mail/${mailContent.to}/${mailContent.date}`;
                            console.log(fs.existsSync(maildirdate))
                            console.log(maildirdate)
                            if (!fs.existsSync(maildirdate)) {
                                fs.mkdirSync(maildirdate);
                            }
                            mail.attachments.forEach(element => {
                                let file = {
                                    filename: element.filename,
                                    url: `/${mailContent.to}/${mailContent.date}/${element.filename}`
                                }
                                let attachmentUrl = `${maildirdate}/${element.filename}`;
                                fs.writeFileSync(attachmentUrl, file.content, 'utf-8', function (err) {
                                    if (err) throw (err)
                                })
                                mailContent.attachments.push(file);
                            });
                            socket.emit('mail', mailContent);
                        })
                    });
                });
            })
        });
    })
    imap.connect();
}

//receiveMail(test)

exports = module.exports = receiveMail;