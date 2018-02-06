const queryDB = require('../services/db')
const { MyChatError } = require('../services/MyChatUtils')

async function createFriendTable() {
    const sql = `
    CREATE TABLE friends(
        friendid varchar(255) NOT NULL PRIMARY KEY,
        roleid varchar(255),
        attribute varchar(65535),
    );`;
    const values = [];
    return queryDB(sql, values);
}

async function insertFriend(friend) {
    const sql = `
    INSERT INTO friends (friendid, roleid, attribute) VALUES (?, ?, ?)
    `;
    const values = [friend.friendid, friend.roleid, friend.attribute];
    return queryDB(sql, values);
}

async function findFriendById(obj) {
    const sql = `
    SELECT *
    FROM friends
    WHERE friends.friendid = (?)
    `;
    const values = [obj.friendid];
    return queryDB(sql, values)
}

//根据某些字段查询好友(AND)
async function findFriendByObj(obj) {
    let condition = '';
    let flag = true;
    let values = [];
    for (let key in obj) {
        if (flag) {
            condition += `friends.${key} = ?`;
            flag = false;
        } else {
            condition += ` AND friends.${key} = ?`
        }
        values.push(obj[key])
    }
    const sql = `
        SELECT *
        FROM friends
        WHERE ${condition}
    `;
    return queryDB(sql, values);
}

exports = module.exports = {
    createFriendTable,
    insertFriend,
    findFriendById,
    findFriendByObj
}
