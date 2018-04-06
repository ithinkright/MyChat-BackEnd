const mysql = require('mysql');
const bluebird = require("bluebird");

bluebird.promisifyAll(require('mysql/lib/Connection').prototype);
bluebird.promisifyAll(require('mysql/lib/Pool').prototype);

function getQueryDb(options) {
  const pool = mysql.createPool(options);
  return async (sql, values) => {
    try {
      return pool.queryAsync(sql, values);
    } catch (err) {
      console.error(err);
    }
  };
}

exports = module.exports = { getQueryDb };
