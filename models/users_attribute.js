// 用户购买的属性

const queryDB = require('../services/db')
const { MyChatError } = require('../services/MyChatUtils')

async function createUsersAttributeTable() {
    const sql = `
    CREATE TABLE users_attribute(
        userid varchar(255) NOT NULL,
        attributeid varchar(255) NOT NULL check(name != '')
    );`;
    const values = [];
    return queryDB(sql, values);
}

async function insertUsersAttribute(users_attribute) {
    const sql = `
    INSERT INTO users_attribute (userid, attributeid) VALUES (?, ?)
    `;
    const values = [users_attribute.userid, users_attribute.attributeid];
    return queryDB(sql, values);
}

async function findUsersAttributeById(obj) {
    const sql = `
    SELECT *
    FROM users_attribute
    WHERE users_attribute.userid = (?)
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
            condition += `users_attribute.${key} = ?`;
            flag = false;
        } else {
            condition += ` AND users_attribute.${key} = ?`
        }
        values.push(obj[key])
    }
    const sql = `
        SELECT *
        FROM users_attribute
        WHERE ${condition}
    `;
    return queryDB(sql, values);
}

async function deleteUsersAttributeByUserId(obj) {
    const sql = `
    DELETE FROM users_attribute WHERE users_attribute.userid = (?)
    `;
    const values = [obj.userid];
    return queryDB(sql, values)
}

async function deleteUsersAttributeByAttributeId(obj) {
    const sql = `
    DELETE FROM users_attribute WHERE users_attribute.attributeid = (?)
    `;
    const values = [obj.attributeid];
    return queryDB(sql, values)
}

exports = module.exports = {
    createRoleTable,
    insertRole,
    findRoleById,
    findRoleByObj,
    deleteRole
}
