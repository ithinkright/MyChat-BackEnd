const axios = require('axios');
const md5 = require('md5');
const { getWeather: myGetWeather } = require('../../services/Weather/index.js')
var to_json = require('xmljson').to_json;

let map = new Map([
  ['多云', '🌥多云'],
  ['晴', '☀️晴'],
  ['雷阵雨', '⛈雷阵雨'],
  ['小雪', '🌨小雪'],
  ['大雪', '❄️大雪'],
  ['雨夹雪', '❄️🌧雨夹雪'],
  ['阵雨', '🌩阵雨'],
  ['阴', '☁️阴天'],
  ['中雨', '🌧中雨'],
  ['大雨', '🌧大雨'],
  ['小雨', '🌦小雨'],
]);

let map1 = new Map([
  ['运动', '运动🏃🚴‍⛹️‍🤾‍'],
  ['旅游', '旅游🏝🛳⛱'],
  ['衣物', '衣物👚👕👗'],
  ['情侣们', '情侣们💑👫💑'],
  ['洗车', '洗车🚗🚕🛵'],
  ['感冒', '感冒🤧😷'],
  ['太阳', '太阳☀️🌞☀️']
])
// 1JINTIAN  0 WEILAI
async function getWeather(place, flag) {
  try {
    let result = await myGetWeather(place);
    return stringifyWeather(result.resp, flag)
  } catch (e) {
    throw (e)
  }
}

function stringifyWeather(obj, flag) {
  if (obj.status) {
    return "城市有误，请重新输入";
  }
  if (!obj.wendu) {
    throw (new Error(''))
  }

  let str;
  if (flag) {
    str = `今天${obj.city}温度大概为${obj.wendu}℃，湿度为${obj.shidu}`
    if (obj.environment) {
      str += `，pm2.5为${obj.environment.pm25}，空气质量${obj.environment.quality}，MyChat给你的小建议是:${obj.environment.suggest}`;
    }
    str += `\n此外，偷偷告诉你哦，`;
    let num = Math.floor(Math.random() * 10)
    for (let item of map1.entries()) {
      obj.zhishus.zhishu[num].detail = obj.zhishus.zhishu[num].detail.replace(item[0], item[1]);
    }
    str += obj.zhishus.zhishu[num].detail;
  } else {
    str = `未来五天天气预报如下:\n`;
    for (let i in obj.forecast.weather) {
      let item = obj.forecast.weather[i];
      item.day.type = map.has(item.day.type) ? map.get(item.day.type) : item.day.type;
      item.night.type = map.has(item.night.type) ? map.get(item.night.type) : item.night.type;
      if (i == '4') {
        str += `${item.date}，${item.low.substr(3)}-${item.high.substr(3)}，白天${item.day.type}，晚上${item.night.type}`;
      } else {
        str += `${item.date}，${item.low.substr(3)}-${item.high.substr(3)}，白天${item.day.type}，晚上${item.night.type}\n`;
      }
    }
  }
  console.log(str)
  return str;
}

function isToday(date) {
  const now = new Date();
  return now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();
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
    // location
    if (item['ne'] ===  'LOC' || item['pos'] === 's') {
      result.location = item['item'];
    }
  }
  return result;
}

//getWeather("白城", 0);
exports = module.exports = {
  getWeather,
  isToday,
  analyseItems,
};
