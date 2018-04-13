const { MyChatError, pick, sendRes } = require('../services/MyChatUtils/index');
const getWeather = require('../services/Weather/index');

async function get(place, next) {
  try {
    let result = await getWeather(place);
    result = stringifyWeather(result);
    return result;
  }
  catch (e) {
    console.log(e);
    return "输入有误";
  }
  return next();
}

function stringifyWeather(obj) {
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

exports = module.exports = {
  get
}
