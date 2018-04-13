const axios = require('axios');
const md5 = require('md5');
const {getWeather : myGetWeather} = require('../../services/Weather/index.js')
var to_json = require('xmljson').to_json;

// 1JINTIAN  0 WEILAI
async function getWeather(place, flag) {
  try {
    let result = await myGetWeather(place);
    return stringifyWeather(result, flag)
  } catch(e) {
    throw(e)
  }
}

function stringifyWeather(obj, flag) {
        if (obj.status) {
          return "城市有误，请重新输入";
        }
        obj = obj.resp;
        let str;
        if(flag) {
          str = `今天${obj.city}温度大概为${obj.wendu}℃，湿度为${obj.shidu}，pm2.5为${obj.environment.pm25}，空气质量${obj.environment.quality}，MyChat给你的小建议是:${obj.environment.suggest}。\n此外，偷偷告诉你哦，`;
          let num = Math.floor(Math.random() * 10)
          str += obj.zhishus.zhishu[num].detail;
        } else {
          str = `未来五天天气预报如下:\n`;
          for(let i in obj.forecast.weather) {
            let item = obj.forecast.weather[i];
            if(i == '4') {
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

exports = module.exports = {
  getWeather,
  isToday,
};
