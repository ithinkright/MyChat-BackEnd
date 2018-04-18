const { sendMessages } = require('../../services/socket.io');

function remind(friendid, userid, time, message) {
  const ms = time.getTime() - new Date().getTime();
  setTimeout(() => {
    const messages = [message];
    sendMessages(friendid, userid, messages);
  }, ms);
}

function analyseItems(items_) {
  const result = {};
  const items = [];
  // 过滤掉助词
  for (const item of items_) {
    if (item['pos'] !== 'u') items.push(item);
  }
  // 获取各个元素
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    // event
    if (item['pos'] === 'v') {
      result.event = item['item'];
    }
    // date
    if (item['ne'] === 'TIME' || item['pos'] === 't') {
      result.date = item['item'];
    }
  }
  return result;
}

exports = module.exports = {
  remind,
  analyseItems,
};
