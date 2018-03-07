const queryDB = require('../services/db')
const { MyChatError } = require('../services/MyChatUtils')

async function createFriendTable() {
    if (showTable())
        return;
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

async function showTable() {
    const sql = `
        show tables like 'friends'
    `;
    let flag = true;
    await queryDB(sql, []).then(function(res) {
        if (res.length === 0)
            flag = false;
    });
    if (flag) {
      console.log("friends table exits")
    }
    return flag;
}

async function insertFriend(friend) {
    const sql = `
    INSERT INTO friends (friendid, friendname, gender, birth, roleid, attribute) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [friend.friendid, friend.friendname, friend.gender, friend.birth, friend.roleid, friend.attribute];
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

async function assignRole(obj) {
    const sql = `
        UPDATE friends
        SET friends.roleid = ${obj.roleid}
        WHERE friends.friendid = (?)
    `;
    return queryDB(sql, [obj.friendid]);
}

async function removeRole(obj) {
    const sql = `
        UPDATE friends
        SET friends.roleid = null
        WHERE friends.friends = (?)
    `;
    return queryDB(sql, [obj.friendid]);
}

async function addFriendAttribute(obj) {
    let friend = findFriendById({ friendid: obj.friendid });
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

async function deleteFriendAttribute(obj) {
    let friend = findFriendById({ friendid: obj.friendid });
    let attribute = friend.attribute;
    let array = []
    attribute.split(obj.attributeid).forEach(function(item) {
        if (item.length != 0) {
            if (item[0] === ",")
                array.push(item.slice(1, item.length));
            if (item[item.length-1] === ",")
                array.push(item.slice(0, item.length-1));
        }
    });
    let newAttribute = array.join(',');
    const sql = `
        UPDATE friends
        SET friends.attribute = ${newAttribute}
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
