const queryDB = require('../services/db')
const { MyChatError } = require('../services/MyChatUtils')

async function createUserFriendTable() {
    if (await showTable())
        return;
    const sql = `
    CREATE TABLE user_friends(
        userid varchar(255) NOT NULL,
        friendid int NOT NULL,
        preference varchar(20000) NOT NULL
    );`;
    const values = [];
    return queryDB(sql, values);
}

async function showTable() {
    const sql = `
        show tables like 'user_friends'
    `;
    let flag = true;
    await queryDB(sql, []).then(function(res) {
        if (res.length === 0)
            flag = false;
    });
    if (flag) {
      console.log("user_friend table exits")
    }
    return flag;
}

async function insertUserFriend(user_friend) {
    const sql = `
    INSERT INTO user_friends (userid, friendid) VALUES (?, ?, ?)
    `;
    const values = [user_friend.userid, user_friend.friendid, user_friend.preference];
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

async function deleteFriend(obj) {
    const sql = `
    DELETE FROM user_friends WHERE user_friends.friendid = (?)
    `
    const values = [obj.friendid];
    return queryDB(sql, values);
}

async function updatePreference(obj) {
  const sql = `
      UPDATE user_friends
      SET user_friends.preference = (?)
      WHERE user_friends.friendid = (?)
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
