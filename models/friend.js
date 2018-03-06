const queryDB = require('../services/db')
const { MyChatError } = require('../services/MyChatUtils')

async function createFriendTable() {
    const sql = `
    CREATE TABLE friends(
        friendid int NOT NULL PRIMARY KEY AUTO_INCREMENT,
        friendname varchar(255) NOT NULL,
        gender varchar(255) NOT NULL,
        birth varchar(255) NOT NULL,
        roleid varchar(255),
        attribute varchar(20000)
    );`;
    const values = [];
    return queryDB(sql, values);
}

async function insertFriend(friend) {
    const sql = `
    INSERT INTO friends (friendid, friendname, gender, birth, roleid, attribute) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [friend.friendid, friend.friendname, friend.gender, friend.gender, friend.birth, friend.roleid, friend.attribute];
    return queryDB(sql, values);
}

async function findFriendById(obj) {
    const sql = `
    SELECT *
    FROM friends
    WHERE friends.friendid = (?)
    `;
    const values = [obj.friendid];
    return queryDB(sql, values);
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

async function addFriendAttribute(obj) {
    let friend = findFriendById({obj.friendid});
    let attribute = friend.attribute;
    if (attribute.length === 0) {
      attribute = obj.attributeid;
    }
    else {
      attribute += "," + obj.attributeid;
    }
    const sql = `
        UPDATE friends
        SET friends.attribute = ${attribute}
        WHERE friends.friendid = (?)
    `;
    return queryDB(sql, [friend.friendid]);
}

async function deleteFriend(obj) {
    const sql = `
    DELETE FROM friends WHERE friends.friendid = (?)
    `;
    const values = [obj.friendid];
    return queryDB(sql, values);
}

exports = module.exports = {
    createFriendTable,
    insertFriend,
    findFriendById,
    findFriendByObj,
    deleteFriend
}
