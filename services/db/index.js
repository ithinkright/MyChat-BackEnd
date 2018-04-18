const mysql = require('mysql');
var Promise = require("bluebird");
const mysql_options = require('../../config/mysql');
const { MyChatError } = require('../MyChatUtils')
const pool = mysql.createPool(mysql_options);
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);
pool.on('error', err => {
    console.log(err);
});


async function queryDB(sql, value) {
    try {
        return pool.queryAsync(sql, value);
    } catch (err) {
        throw new MyChatError(1, '数据库查询错误', err.stack)
    }
}

exports = module.exports = queryDB;