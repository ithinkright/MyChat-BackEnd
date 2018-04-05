// 用户购买的属性

const queryDB = require('../services/db')
const { MyChatError } = require('../services/MyChatUtils')

async function createUsersAttributeTable() {
    if (await showTable())
        return;
    const sql = `
    CREATE TABLE users_attributes(
        userid varchar(255) NOT NULL,
        attributeid varchar(255) NOT NULL
    );`;
    const values = [];
    return queryDB(sql, values);
}

async function showTable() {
    const sql = `
        show tables like 'users_attributes'
    `;
    let flag = true;
    await queryDB(sql, []).then(function(res) {
        if (res.length === 0)
            flag = false;
    });
    if (flag) {
      console.log("users_attributes table exits")
    }
    return flag;
}

async function insertUsersAttribute(users_attribute) {
    const sql = `
    INSERT INTO users_attributes (userid, attributeid) VALUES (?, ?)
    `;
    const values = [users_attribute.userid, users_attribute.attributeid];
    return queryDB(sql, values);
}

async function findUsersAttributeById(obj) {
    const sql = `
    SELECT *
    FROM users_attributes
    WHERE users_attributes.userid = (?)
    `;
    const values = [obj.userid];
    return queryDB(sql, values)
}

//根据某些字段查询角色(AND)
async function findUsersAttributeByObj(obj) {
    let condition = '';
    let flag = true;
    let values = [];
    for (let key in obj) {
        if (flag) {
            condition += `users_attributes.${key} = ?`;
            flag = false;
        } else {
            condition += ` AND users_attributes.${key} = ?`
        }
        values.push(obj[key])
    }
    const sql = `
        SELECT *
        FROM users_attributes
        WHERE ${condition}
    `;
    return queryDB(sql, values);
}

async function deleteUsersAttributeByUserId(obj) {
    const sql = `
    DELETE FROM users_attributes WHERE users_attributes.userid = (?)
    `;
    const values = [obj.userid];
    return queryDB(sql, values)
}

async function deleteUsersAttributeByAttributeId(obj) {
    const sql = `
    DELETE FROM users_attributes WHERE users_attributes.attributeid = (?)
    `;
    const values = [obj.attributeid];
    return queryDB(sql, values)
}

exports = module.exports = {
    createUsersAttributeTable,
    insertUsersAttribute,
    findUsersAttributeById,
    findUsersAttributeByObj,
    deleteUsersAttributeByUserId,
    deleteUsersAttributeByAttributeId
}
