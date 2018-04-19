function isQuestion(message) {
  return message.indexOf('哪') !== -1
      || message.indexOf('嘛') !== -1
      || message.indexOf('什么') !== -1
      || message.indexOf('啥') !== -1;
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
    // date
    if (item['ne'] === 'TIME' || item['pos'] === 't') {
      result.time = item['item'];
    }
    // location
    if (item['ne'] ===  'LOC' || item['pos'] === 's') {
      result.location = item['item'];
    }
    // people
    if (item['ne'] === 'PER' || item['ne'] === 'ORG' || item['pos'] === 'nr' || item['pos'] === 'nt' || item['pos' === 'r']) {
      if (!result.people) result.people = [];
      result.people.push(item['item']);
    }
    if (item['pos'] === 'n' && i > 0) {
      // if (items[i-1]['item'] === '去' || items[i-1]['item'] === '在') {
      //   result.location = item['item'];
      // }
      if (items[i-1]['item'] === '和' || items[i-1]['item'] === '跟' || items[i-1]['item'] === '与') {
        if (!result.people) result.people = [];
        result.people.push(item['item']);
      }
    }
    // event
    if (item['pos'] === 'v') {
      result.event = item['item'];
    }
    // amount
    if (item['pos'] === 'm') {
      result.amount = item['item'];
    }
  }
  return result;
}

exports = module.exports = {
  isQuestion,
  analyseItems,
};
