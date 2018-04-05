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
  str += "空气质量：" + obj.environment.quality + "\n";
  str += "出行建议：" + obj.environment.suggest + "\n";
  str += "未来六天预报：\n";
  let forecastweather = obj.forecast.weather;
  for (key in forecastweather) {
    let data = forecastweather[key];
    str += data.date + "\t";
    str += data.high + "\t" + data.low + "\t";
    str += "白天：" + data.day.type + "\t" + "晚上：" + data.night.type + "\n";
  }
  return str;
}

exports = module.exports = {
  get
}
