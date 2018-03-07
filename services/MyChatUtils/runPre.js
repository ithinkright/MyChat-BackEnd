const mysql = require('mysql')
const MyChatError = require('./MyChatError');
const logger = require('./logger');
const mysql_configs = require('../../config/mysql');

async function testMysql() {
    return new Promise(function (resolve, reject) {
        const conn = mysql.createConnection(mysql_configs);
        conn.connect(function (err) {
            if (err) {
                let testError = new MyChatError(1, "MySQL数据库连接失败", err.stack);
                reject(testError);
            } else {
                logger.log("MySQL数据库连接成功");
                conn.destroy();
                resolve();
            }
        })
    })
}

exports = module.exports = {
    testMysql: testMysql
}
