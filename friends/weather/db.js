const options = require('../config').weather.mysql;
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

function updateLastTime(userid, last_time) {
  const sql = `UPDATE user SET last_time = ? WHERE userid = ?;`;
  const values = [last_time, userid];
  return queryDb(sql, values);
}

function updateLocation(userid, location) {
  const sql = `UPDATE user SET location = ? WHERE userid = ?;`;
  const values = [location, userid];
  return queryDb(sql, values);
}

exports = module.exports = {
  findUserById,
  createUser,
  updateLastTime,
  updateLocation,
};
