const options = require('../config').mary.mysql;
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

function createDiary(userid, date, location, people, event, origin) {
  const sql = `INSERT INTO diary (userid, date, location, people, event, origin) VALUES (?, ?, ?, ?, ?, ?);`;
  const values = [userid, date, location, people, event, origin];
  return queryDb(sql, values);
}

function findDiaryByDate(userid, date) {
  const sql = `SELECT * FROM diary WHERE userid = ? AND date = ?;`;
  const values = [userid, date];
  return queryDb(sql, values);
}

function findDiaryByDates(userid, before, after) {
  const sql = `SELECT * FROM diary WHERE userid = ? AND date >= ? AND date <= ?;`;
  const values = [userid, before, after];
  return queryDb(sql, values);
}

exports = module.exports = {
  findUserById,
  createUser,
  createDiary,
  findDiaryByDate,
  findDiaryByDates,
};
