const options = require('../config').accountant.mysql;
const queryDb = require('../mysql').getQueryDb(options);

function createUser(userid) {
  const sql = `INSERT INTO user (userid) VALUES (?);`;
  const values = [userid];
  return queryDb(sql, values);
}

function createAccount(userid, time, item, money) {
  const sql = `INSERT INTO account (userid, time, item, money) VALUES (?, ?, ?, ?);`;
  const values = [userid, time, item, money];
  return queryDb(sql, values);
}

function findAccountsDuringDates(userid, before, after) {
  const sql = `SELECT * FROM account WHERE userid = ? AND time >= ? AND time <= ?;`;
  const values = [userid, before, after];
  return queryDb(sql, values);
}

exports = module.exports = {
  createUser,
  createAccount,
  findAccountsDuringDates,
};
