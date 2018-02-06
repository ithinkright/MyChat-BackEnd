const queryDB = require('../services/db')
const { MyChatError } = require('../services/MyChatUtils')

async function createAttributeTable() {
    const sql = `
    CREATE TABLE attributes(
        attributeid varchar(255) NOT NULL PRIMARY KEY,
        name varchar(255) NOT NULL unique check(username != ''),
        description varchar(65535) NOT NULL check(password != ''),
        usercount varchar(255)
    );`;
    const values = [];
    return queryDB(sql, values);
}

async function insertAttribute(atttribute) {
    const sql = `
    INSERT INTO arrtibutes (attributeid, name, description, usercount) VALUES (?, ?, ?, ?)
    `;
    const values = [atttribute.attributeid, atttribute.name, atttribute.description, description.usercount];
    return queryDB(sql, values);
}

async function findAttributeById(obj) {
    const sql = `
    SELECT *
    FROM attributes
    WHERE attributes.attributeid = (?)
    `;
    const values = [obj.attributeid];
    return queryDB(sql, values)
}

//根据某些字段查询属性(AND)
async function findAttributeByObj(obj) {
    let condition = '';
    let flag = true;
    let values = [];
    for (let key in obj) {
        if (flag) {
            condition += `attributes.${key} = ?`;
            flag = false;
        } else {
            condition += ` AND attributes.${key} = ?`
        }
        values.push(obj[key])
    }
    const sql = `
        SELECT *
        FROM attributes
        WHERE ${condition}
    `;
    return queryDB(sql, values);
}

exports = module.exports = {
    createAttributeTable,
    insertAttribute,
    findAttributeById,
    findAttributeByObj
}
