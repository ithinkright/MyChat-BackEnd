const axios = require('axios');
const md5 = require('md5');
var to_json = require('xmljson').to_json;

async function getWeather(place) {
  console.log(place);
  let result = await axios({
    url: 'https://www.sojson.com/open/api/weather/xml.shtml',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: {
      'city': place
    }
  })
  let toJson = new Promise(function (resolve, reject) {
    to_json(result.data, function (err, data) {
      if (err) {
        reject(err);
      } else {
        console.log(data);
        resolve(stringifyWeather(data));
      }
    });
  })
  let res = await toJson;
  return res.resp;
}

function stringifyWeather(obj) {
    try {
        if (obj.status) {
          return "城市有误，请重新输入";
        }
        let str = "";
        let keyArray = {
          city: "城市",
          wendu: "温度",
          fengli: "风力",
          shidu: "湿度",
          fengxiang: "风向",
          sunrise_1: "日升时间",
          sunset_1: "日落时间"
        }
        for (key in keyArray) {
          str += keyArray[key] + ": " + obj[key] + "\n";
        }
        return str;
    }
    catch(e) {
      console.log(e);
      return "输入有误";
    }
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
