const axios = require('axios');
const md5 = require('md5');
var to_json = require('xmljson').to_json;
async function getWeather(place) {
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
                resolve(data);
            }
        });
    })
    let res = await toJson;
    return res.resp;
}

async function mytest() {
  let result = await getWeather("广州");
  console.log(result);
}

//mytest();
exports = module.exports = {
    getWeather
};
