const { MyChatCourier } = require('../../services/Courier');

function isExpressNumber(text) {
  return /^[\d]+$/.test(text);
}

exports = module.exports = {
  isExpressNumber,
  query: MyChatCourier,
};
