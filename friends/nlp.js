const axios = require('axios');
const { formatTime } = require('./util');

const access_token = '24.30c9bd66ecf0ad8bdc3b2515cb71e641.2592000.1526655825.282335-10929395';
// https://cloud.baidu.com/doc/NLP/NLP-API.html#.E8.AF.8D.E6.B3.95.E5.88.86.E6.9E.90.E6.8E.A5.E5.8F.A3

async function timeNlp(message) {
  const url = 'http://127.0.0.1:4000';
  const base = formatTime(new Date());
  let half = false;
  if (message.indexOf('半') !== -1) {
    half = true;
    message = message.replace('半', '一');
  }
  const res = await axios.post(url, { time: message, base });
  const { result } = res.data;
  const ret = [];
  if (result.error) throw new Error(result.error);
  if (result.type === 'timestamp') {
    ret.push(new Date(result.timestamp));
  } else if (result.type === 'timedelta') {
    const { year, month, day, hour, minute, second } = result.timedelta;
    const now = new Date();
    const ago = message.indexOf('前') !== -1 ? -1 : 1;
    const one_time = new Date(
      now.getFullYear() + ago * year,
      now.getMonth() + ago * month,
      now.getDate() + ago * day,
      now.getHours() + ago * hour,
      now.getMinutes() + ago * minute,
      now.getSeconds() + ago * second,
    );
    if (half) {
      const delta = one_time.getTime() - now.getTime();
      const half_time = new Date(now.getTime() + Math.floor(delta/2));
      ret.push(half_time);
    } else {
      ret.push(one_time);
    }
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
  return ret;
}

async function lexicalAnalyse(message) {
  const url = `https://aip.baidubce.com/rpc/2.0/nlp/v1/lexer?access_token=${access_token}&charset=UTF-8`;
  const res = await axios.post(url, { text: message });
  const data = res.data;
  if (!data) throw new Error('语法分析出错');
  if (data.error_code) throw new Error(data.error_msg);
  return data.items;
}

exports = module.exports = {
  timeNlp,
  lexicalAnalyse,
};
