const axios = require('axios');
const md5 = require('md5');
const appKey = "3b4b0b84c21ec9cc";
const key = "f92CuyCGVh9KHSoM43rKpBEzCxQiOQOd";

//接口需要提供的数据
let test = {
    from: "auto",  //源语言
    to: "ja",   //目标语言
    query: "I Love You"  //文本
}

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
    return result.data;
}

async function mytest() {
    let result = await tranlate(test);
}
// mytest()
exports = module.exports = tranlate;
