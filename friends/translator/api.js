const axios = require('axios');
const md5 = require('md5');
const appKey = "3b4b0b84c21ec9cc";
const key = "f92CuyCGVh9KHSoM43rKpBEzCxQiOQOd";

async function tranlate(obj) {
  let salt = (new Date).getTime();
  let str1 = appKey + obj.query + salt + key;
  let sign = md5(str1);
  let data = {
    q: obj.query,
    appKey: appKey,
    salt: salt,
    from: obj.from,
    to: obj.to,
    sign: sign
  };
  let result = await axios({
    url: 'http://openapi.youdao.com/api',
    method: 'post',
    data: data,
    transformRequest: [function (data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return result.data.translation[0];
}

function getLanguageCode(language) {
  if (language === '中文' || language === '国语') return 'zh-CHS';
  if (language === '日文' || language === '日语') return 'ja';
  if (language === '英文' || language === '英语') return 'EN';
  if (language === '韩文' || language === '韩语') return 'ko';
  if (language === '法文' || language === '法语') return 'fr';
  if (language === '德文' || language === '德语') return 'de';
  if (language === '俄文' || language === '俄语') return 'ru';
  if (language === '泰文' || language === '泰语') return 'th';
  if (language === '希腊文' || language === '希腊语') return 'el';
  if (language === '葡萄牙文' || language === '葡萄牙语') return 'pt';
  if (language === '西班牙文' || language === '西班牙语') return 'es';
  if (language === '意大利文' || language === '意大利语') return 'it';
  return undefined;
}

exports = module.exports = {
  tranlate,
  getLanguageCode,
};
