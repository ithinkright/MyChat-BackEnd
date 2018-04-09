const axios = require('axios');

const access_token = '24.624c6bd23456a029884d1aebbd87a4d8.2592000.1524062832.282335-10929395';

// https://cloud.baidu.com/doc/NLP/NLP-API.html#.E8.AF.8D.E6.B3.95.E5.88.86.E6.9E.90.E6.8E.A5.E5.8F.A3

async function lexicalAnalyse(message) {
  const url = `https://aip.baidubce.com/rpc/2.0/nlp/v1/lexer?access_token=${access_token}&charset=UTF-8`;
  const res = await axios.post(url, { text: message });
  const data = res.data;
  if (data.error_code) throw new Error(data.error_msg);
  const result = {};
  const { items: items_ } = data;
  const items = [];
  // 过滤掉助词
  for (const item of items_) {
    if (item['pos'] !== 'u') items.push(item);
  }
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    if (item['ne'] === 'TIME' || item['pos'] === 't') {
      result.date = item['item'];
      // TODO: 转成绝对时间
    }
    // location
    if (item['ne'] ===  'LOC' || item['pos'] === 's') {
      result.location = item['item'];
    }
    // people
    if (item['ne'] === 'PER' || item['ne'] === 'ORG' || item['pos'] === 'nr' || item['pos'] === 'nt') {
      if (!result.people) result.people = [];
      result.people.push(item['item']);
    }
    // event
    if (item['pos'] === 'v') {
      result.event = item['item'];
    }
    if (item['pos'] === 'n' && i > 0) {
      if (items[i-1]['item'] === '去' || items[i-1]['item'] === '在') {
        result.location = item['item'];
      }
      if (items[i-1]['item'] === '和' || items[i-1]['item'] === '跟' || items[i-1]['item'] === '与') {
        if (!result.people) result.people = [];
        result.people.push(item['item']);
      }
    }
  }
  console.log(result);
  return result;
}

exports = module.exports = {
  lexicalAnalyse,
};
