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

function createReminder(userid, time, event, origin) {
  const sql = `INSERT INTO reminder (userid, time, event, origin) VALUES (?, ?, ?, ?);`;
  const values = [userid, time, event, origin];
  return queryDb(sql, values);
}

function findReminderByTime(userid, time) {
  const sql = `SELECT * FROM reminder WHERE userid = ? AND TO_DAYS(time) = TO_DAYS(?);`;
  const values = [userid, time];
  return queryDb(sql, values);
}

function findReminderByTimes(userid, before, after) {
  const sql = `SELECT * FROM reminder WHERE userid = ? AND time >= ? AND time <= ?;`;
  const values = [userid, before, after];
  return queryDb(sql, values);
}

exports = module.exports = {
  findUserById,
  createUser,
  createReminder,
  findReminderByTime,
  findReminderByTimes,
};
