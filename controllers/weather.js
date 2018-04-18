const { MyChatError, pick, sendRes } = require('../services/MyChatUtils/index');
const getWeather = require('../services/Weather/index');

async function get(place, next) {
  try {
    let result = await getWeather(place);
    result = stringifyWeather(result);
    return result;
  }
  catch (e) {
    return "输入有误";
  }
  return next();
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
      fengxiang: "风向"
    }
    for (key in keyArray) {
      str += keyArray[key] + ": " + obj[key] + "\n";
    }
    return str;
  }
  catch (e) {
    return "输入有误";
  }
  return "输入有误";
}

exports = module.exports = {
  get
}
