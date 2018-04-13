const options = require('../config').sanxing.mysql;
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

function findQuestionsByIds(ids) {
  const sql = `SELECT * FROM question WHERE questionid IN (?);`;
  const values = [ids];
  return queryDb(sql, values);
}

function createAnswer(userid, questionid, answer) {
  const sql = `INSERT INTO answer (userid, questionid, answer) VALUES (?, ?, ?);`;
  const values = [userid, questionid, answer];
  return queryDb(sql, values);
}

function updateLastTime(userid, last_time) {
  const sql = `UPDATE user SET last_time = ? WHERE userid = ?;`;
  const values = [last_time, userid];
  return queryDb(sql, values);
}

exports = module.exports = {
  findUserById,
  createUser,
  findQuestionsByIds,
  createAnswer,
  updateLastTime,
};
