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
      result.date = item['item'];
    }
    // event
    if (item['pos'] === 'v' && !result.event) {
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
  analyseItems,
};
