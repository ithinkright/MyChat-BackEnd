const queryDB = require('../services/db')
const { MyChatError } = require('../services/MyChatUtils')

async function showTable() {
  const sql = `
      show tables like 'unread_message'
  `;
  let flag = true;
  await queryDB(sql, []).then(function(res) {
      if (res.length === 0)
          flag = false;
  });
  return flag;
}

async function createUnreadMessageTable() {
  if (await showTable()) return;
  const sql = `
  CREATE TABLE unread_message (
    umid INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    userid VARCHAR(255) NULL,
    friendid INT NULL,
    message TEXT NULL,
    time DATETIME NULL,
    fetched TINYINT NULL DEFAULT 0
  );`;
  const values = [];
  return queryDB(sql, values);
}

function insert(userid, friendid, messages, time, fetched) {
  const sql = `insert into unread_message (userid, friendid, messages, time, fetched) values (?, ?, ?, ?, ?);`;
  const values = [userid, friendid, JSON.stringify(messages), time, fetched];
  return queryDB(sql, values);
}

function findByUserid(userid) {
  const sql = `select * from unread_message where userid = ? AND fetched = 0;`;
  const values = [userid];
  return queryDB(sql, values);
}

function findByUseridAndFriendid(userid, friendid) {
  const sql = `select * from unread_message where userid = ? and friendid = ? and fetched = 0;`;
  const values = [userid, friendid];
  return queryDB(sql, values);
}

function deleteByFriendid(friendid) {
  const sql = `delete from unread_message where friendid = ?;`;
  const values = [friendid];
  return queryDB(sql, values);
}

function updateFetched(umids) {
  const sql = `update unread_message set fetched = 1 where umid in (?);`;
  const values = [umids];
  return queryDB(sql, values);
}

function count(userid) {
  const sql = `select count(*) from unread_message where userid = ?;`;
  const values = [userid];
  return queryDB(sql, values);
}

exports = module.exports = {
  createUnreadMessageTable,
  insert,
  findByUserid,
  findByUseridAndFriendid,
  deleteByFriendid,
  updateFetched,
  count,
};
