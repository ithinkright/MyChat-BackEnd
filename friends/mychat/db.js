const options = require('../config').mychat.mysql;
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

function createAdvice(userid, time, advice) {
  const sql = `INSERT INTO advice (userid, time, advice) VALUES (?, ?, ?);`;
  const values = [userid, time, advice];
  return queryDb(sql, values);
}

function updateResponse(adviceid, response) {
  const sql = `UPDATE advice SET response = ? WHERE adviceid = ?;`;
  const values = [response, adviceid];
  return queryDb(sql, values);
}

exports = module.exports = {
  findUserById,
  createUser,
  createAdvice,
  updateResponse,
};
