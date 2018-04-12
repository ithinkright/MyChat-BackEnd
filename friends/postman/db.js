const options = require('../config').postman.mysql;
const queryDb = require('../mysql').getQueryDb(options);

function findUserById(userid) {
  const sql = `SELECT * FROM user WHERE userid = ?;`;
  const values = [userid];
  return queryDb(sql, values);
}

function createUser(userid) {
  const sql = `INSERT INTO user (userid) VALUES (?);`;
  const values = [userid];
  return queryDb(sql, values);
}

function updateAccount(userid, account) {
  const sql = `UPDATE user SET account = ? WHERE userid = ?;`;
  const values = [account, userid];
  return queryDb(sql, values);
}

exports = module.exports = {
  findUserById,
  createUser,
  updateAccount,
};
