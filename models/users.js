const queryDB = require('../services/db')
const { MyChatError } = require('../services/MyChatUtils')

async function createUserTable() {
    if (await showTable())
        return;
    const sql = `
    CREATE TABLE users(
        userid varchar(255) NOT NULL PRIMARY KEY,
        username varchar(255) NOT NULL unique check(username != ''),
        password varchar(255) NOT NULL check(password != '')
    );`;
    const values = [];
    return queryDB(sql, values);
}

async function showTable() {
    const sql = `
        show tables like 'users'
    `;
    let flag = true;
    await queryDB(sql, []).then(function(res) {
        if (res.length === 0)
            flag = false;
    });
    if (flag) {
      console.log("users table exits")
    }
    return flag;
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

function saveDeviceToken(userid, token, time) {
    const sql = `INSERT INTO device_token (userid, token, time) VALUES (?, ?, ?);`;
    const values = [userid, token, time];
    return queryDB(sql, values);
}

function updateDeviceToken(userid, token, time) {
    const sql = `UPDATE device_token SET token = ?, time = ? WHERE userid = ?;`;
    const values = [token, time, userid];
    return queryDB(sql, values);
}

exports = module.exports = {
    createUserTable,
    insertUser,
    showTable,
    findUserById,
    findUserByObj,
    saveDeviceToken,
    updateDeviceToken,
};
