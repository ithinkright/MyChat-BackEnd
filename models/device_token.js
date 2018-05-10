const queryDB = require('../services/db')
const { MyChatError } = require('../services/MyChatUtils')

async function createDeviceTokenTable() {
    if (await showTable()) {
      return;
    }
    const sql = `
        CREATE TABLE device_token (
        userid varchar(255) DEFAULT NULL,
        token varchar(255) DEFAULT NULL,
        time datetime DEFAULT NULL,
        KEY userid_idx (userid),
        CONSTRAINT userid FOREIGN KEY (userid) REFERENCES users (userid) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `;
    return queryDB(sql, []);
}

async function showTable() {
    const sql = `
        show tables like 'device_token'
    `;
    let flag = true;
    await queryDB(sql, []).then(function(res) {
        if (res.length === 0)
            flag = false;
    });
    return flag;
}

function saveDeviceToken(userid, token, time) {
    const sql = `INSERT INTO device_token (userid, token, time) VALUES (?, ?, ?);`;
    const values = [userid, token, time];
    return queryDB(sql, values);
}

function updateDeviceToken(userid, token, time) {
    const sql = `UPDATE device_token SET token = ?, time = ? WHERE userid = ?;`;
    const values = [token, time, userid];
    return queryDB(sql, values);
}

function findDeviceToken(userid) {
    const sql = `select * from device_token where userid = ?;`;
    const values = [userid];
    return queryDB(sql, values);
}

exports = module.exports = {
    createDeviceTokenTable,
    saveDeviceToken,
    updateDeviceToken,
    findDeviceToken,
};
