const queryDB = require('../services/db')
const { MyChatError } = require('../services/MyChatUtils')

async function createUserFriendTable() {
    if (await showTable())
        return;
    const sql = `
    CREATE TABLE users_friends(
        userid varchar(255) NOT NULL,
        friendid int NOT NULL,
        preference varchar(20000)
    );`;
    const values = [];
    return queryDB(sql, values);
}

async function showTable() {
    const sql = `
        show tables like 'users_friends'
    `;
    let flag = true;
    await queryDB(sql, []).then(function(res) {
        if (res.length === 0)
            flag = false;
    });
    return flag;
}

async function insertUserFriend(user_friend) {
    const sql = `
    INSERT INTO users_friends (userid, friendid, preference) VALUES (?, ?, ?)
    `;
    const values = [user_friend.userid, user_friend.friendid, user_friend.preference];
    return queryDB(sql, values);
}

async function findUserFriendById(obj) {
    const sql = `
    SELECT *
    FROM users_friends
    WHERE users_friends.userid = (?)
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
            condition += `users_friends.${key} = ?`;
            flag = false;
        } else {
            condition += ` AND users_friends.${key} = ?`
        }
        values.push(obj[key])
    }
    const sql = `
        SELECT *
        FROM users_friends
        WHERE ${condition}
    `;
    return queryDB(sql, values);
}

async function deleteFriend(obj) {
    const sql = `
    DELETE FROM users_friends WHERE users_friends.friendid = (?)
    `
    const values = [obj.friendid];
    return queryDB(sql, values);
}

async function updatePreference(obj) {
  const sql = `
      UPDATE users_friends
      SET users_friends.preference = (?)
      WHERE users_friends.friendid = (?)
  `;
  const values = [obj.preference, obj.friendid];
  return queryDB(sql, values);
}

exports = module.exports = {
    createUserFriendTable,
    insertUserFriend,
    findUserFriendById,
    findUserFriendByObj,
    deleteFriend,
    updatePreference
}
