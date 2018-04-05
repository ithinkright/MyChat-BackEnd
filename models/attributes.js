const queryDB = require('../services/db')
const { MyChatError } = require('../services/MyChatUtils')

async function createAttributeTable() {
    if (await showTable())
        return;
    const sql = `
    CREATE TABLE attributes(
        attributeid varchar(255) NOT NULL PRIMARY KEY,
        name varchar(255) NOT NULL unique check(username != ''),
        description varchar(1024) NOT NULL check(password != ''),
        usercount varchar(255)
    );`;
    const values = [];
    return queryDB(sql, values);
}

async function showTable() {
    const sql = `
        show tables like 'attributes'
    `;
    let flag = true;
    await queryDB(sql, []).then(function(res) {
        if (res.length === 0)
            flag = false;
    });
    if (flag) {
      console.log("attributes table exits")
    }
    return flag;
}

async function showAllattributes() {
    const sql = `
        SELECT * from attributes
    `;
    return queryDB(sql, []);
}

async function insertAttribute(attribute) {
    const sql = `
    INSERT INTO attributes (attributeid, name, description, usercount) VALUES (?, ?, ?, ?)
    `;
    const values = [attribute.attributeid, attribute.name, attribute.description, attribute.usercount];
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

async function deleteAttributeById(obj) {
    const sql = `
    DELETE FROM attributes WHERE attributes.attributeid = (?)
    `
    const values = [obj.attributeid];
    return queryDB(sql, values);
}

async function deleteAttributeByObj(obj) {
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
        DELETE FROM attributes
        WHERE ${condition}
    `;
    return queryDB(sql, values);
}

exports = module.exports = {
    createAttributeTable,
    insertAttribute,
    showAllattributes,
    findAttributeById,
    findAttributeByObj,
    deleteAttributeById,
    deleteAttributeByObj
}
