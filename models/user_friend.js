const queryDB = require('../services/db')
const { MyChatError } = require('../services/MyChatUtils')

async function createUserFriendTable() {
    const sql = `
    CREATE TABLE user_friends(
        userid varchar(255) NOT NULL PRIMARY KEY,
        friendid varchar(255) NOT NULL check(friendid != ''),
    );`;
    const values = [];
    return queryDB(sql, values);
}

async function insertUserFriend(user_friend) {
    const sql = `
    INSERT INTO user_friends (userid, friendid) VALUES (?, ?)
    `;
    const values = [user.userid, user.friendid];
    return queryDB(sql, values);
}

async function findUserFriendById(obj) {
    const sql = `
    SELECT *
    FROM user_friends
    WHERE user_friends.userid = (?)
    `;
    const values = [obj.userid];
    return queryDB(sql, values)
}

//根据某些字段查询用户(AND)
async function findUserFriendByObj(obj) {
    let condition = '';
    let flag = true;
    let values = [];
    for (let key in obj) {
        if (flag) {
            condition += `user_friends.${key} = ?`;
            flag = false;
        } else {
            condition += ` AND user_friends.${key} = ?`
        }
        values.push(obj[key])
    }
    const sql = `
        SELECT *
        FROM user_friends
        WHERE ${condition}
    `;
    return queryDB(sql, values);
}

exports = module.exports = {
    createUserFriendTable,
    insertUserFriend,
    findUserFriendById,
    findUserFriendByObj
}
