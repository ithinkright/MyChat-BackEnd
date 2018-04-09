const options = require('../config').mary.mysql;
const queryDb = require('../mysql').getQueryDb(options);

function createUser(userid) {
  const sql = `INSERT INTO user (userid) VALUES (?);`;
  const values = [userid];
  return queryDb(sql, values);
}

function createDiary(userid, time, location, people, event) {
  const sql = `INSERT INTO diary (userid, time, location, people, event) VALUES (?, ?, ?, ?, ?);`;
  const values = [userid, time, location, people, event];
  return queryDb(sql, values);
}

function findDiariesByDate(date) {
  const sql = `SELECT * FROM diary WHERE date = ?;`;
  const values = [date];
  return queryDb(sql, values);
}

exports = module.exports = {
  createUser,
  createDiary,
  findDiariesByDate,
};
