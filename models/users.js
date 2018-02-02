const queryDB = require('../services/db')
const { MyChatError } = require('../services/MyChatUtils')

async function createUserTable() {
    const sql = `
    CREATE TABLE users(
        userid varchar(255) NOT NULL PRIMARY KEY,
        username varchar(255) NOT NULL unique check(username != ''),
        password varchar(255) NOT NULL check(password != '')
    );`;
    const values = [];
    return queryDB(sql, values);
}

async function insertUser(user) {
    const sql = `
    INSERT INTO users (userid, username, password) VALUES (?, ?, ?)
    `;
    const values = [user.userid, user.username, user.password];
    return queryDB(sql, values);
}

async function findUserById(obj) {
    const sql = `
    SELECT *
    FROM users
    WHERE users.userid = (?)
    `;
    const values = [obj.userid];
    return queryDB(sql, values)
}

//根据某些字段查询用户(AND)
async function findUserByObj(obj) {
    let condition = '';
    let flag = true;
    let values = [];
    for (let key in obj) {
        if (flag) {
            condition += `users.${key} = ?`;
            flag = false;
        } else {
            condition += ` AND users.${key} = ?`
        }
        values.push(obj[key])
    }
    const sql = `
        SELECT * 
        FROM users
        WHERE ${condition}
    `;
    return queryDB(sql, values);
}

exports = module.exports = {
    createUserTable,
    insertUser,
    findUserById,
    findUserByObj
}