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
    if (flag) {
      console.log("device_token table exits")
    }
    return flag;
}

exports = module.exports = {
    createDeviceTokenTable
}
