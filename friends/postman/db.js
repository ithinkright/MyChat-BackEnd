const options = require('../config').postman.mysql;
const queryDb = require('../mysql').getQueryDb(options);

function findUserById(userid) {
  const sql = `SELECT * FROM user WHERE userid = ?;`;
  const values = [userid];
  return queryDb(sql, values);
}

function createUser(userid) {
  const sql = `INSERT INTO user (userid, last_time) VALUES (?, ?);`;
  const values = [userid, new Date()];
  return queryDb(sql, values);
}

function updateAccounts(userid, accounts) {
  const sql = `UPDATE user SET accounts = ? WHERE userid = ?;`;
  const values = [accounts, userid];
  return queryDb(sql, values);
}

exports = module.exports = {
  findUserById,
  createUser,
  updateAccounts,
};
