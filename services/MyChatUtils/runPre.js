const mysql = require('mysql')
const { MyChatError } = require('./index');
const logger = require('./logger');
const mysql_configs = require('../../config/mysql');

async function testMysql() {
    return new Promise(function (resolve, reject) {
        const conn = mysql.createConnection(mysql_configs);
        conn.connect(function (err) {
            if (err) {
                reject(new MyChatError(1, "MySQL数据库连接失败", err.stack));
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