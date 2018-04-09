const axios = require('axios');
const moment = require('moment');

const access_token = '24.624c6bd23456a029884d1aebbd87a4d8.2592000.1524062832.282335-10929395';

// https://cloud.baidu.com/doc/NLP/NLP-API.html#.E8.AF.8D.E6.B3.95.E5.88.86.E6.9E.90.E6.8E.A5.E5.8F.A3

function format(date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

function formatDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

function analyseItems(items_) {
  const result = {};
  const items = [];

  // 过滤掉助词
  for (const item of items_) {
    if (item['pos'] !== 'u') items.push(item);
  }

  // 获取日记的各个元素
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    // date
    if (item['ne'] === 'TIME' || item['pos'] === 't') {
      result.date = item['item'];
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
    // event
    if (item['pos'] === 'v') {
      result.event = item['item'];
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
  }

  console.log(result);
  return result;
}

async function timeNlp(message) {
  const url = 'http://127.0.0.1:4000';
  const res = await axios.post(url, { time: message });
  const { result } = res.data;
  const ret = [];
  if (result.error) return [new Date()];
  if (result.type === 'timestamp') {
    ret.push(new Date(result.timestamp));
  } else if (result.type === 'timedelta') {
    const { year, month, day, hour, minute, second } = result.timedelta;
    const now = new Date();
    const delta = message.indexOf('前') !== -1 ? -1 : 1;
    ret.push(new Date(
      now.getFullYear() + delta * year,
      now.getMonth() + delta * month,
      now.getDate() + delta * day,
      now.getHours() + delta * hour,
      now.getMinutes() + delta * minute,
      now.getSeconds() + delta * second,
    ));
  } else if (result.type === 'timespan') {
    const day1 = new Date(result.timespan[0]);
    const day2 = new Date(result.timespan[1]);
    let before, after;
    if (day1 < day2) {
      before = day1;
      after = day2;
    } else {
      before = day2;
      after = day1;
    }
    while (before < after) {
      ret.push(new Date(before));
      before.setDate(before.getDate() + 1);
    }
    if (ret.length > 0 && after.getDate() === before.getDate()) {
      ret.push(after);
    }
  }
  console.log(ret);
  return ret;
}

async function lexicalAnalyse(message) {
  const url = `https://aip.baidubce.com/rpc/2.0/nlp/v1/lexer?access_token=${access_token}&charset=UTF-8`;
  const res = await axios.post(url, { text: message });
  const data = res.data;
  if (data.error_code) throw new Error(data.error_msg);
  const result = analyseItems(data.items);
  console.log(result);
  return result;
}

exports = module.exports = {
  timeNlp,
  lexicalAnalyse,
};
