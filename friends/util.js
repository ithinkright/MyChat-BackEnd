const moment = require('moment');

function formatTime(time) {
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
}

function formatDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

exports = module.exports = {
  formatTime,
  formatDate,
};
