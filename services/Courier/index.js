const axios = require('axios');
const md5 = require('md5');
const userID = '1332796';
const DataType = "2";
const keyValue = "2275f172-c9a5-402e-addd-81d1d872e3b7";
const url = "https://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx";


async function myCourier(str, type) {
    try {
        const some = new Buffer(md5(str + keyValue))
        const datasign = encodeURI(some.toString('base64'))
        let result = await axios({
            url: url,
            method: 'post',
            data: {
                RequestType: type,
                EBusinessID: userID,
                RequestData: encodeURIComponent(str),
                DataSign: datasign,
                DataType: DataType
            },
            transformRequest: [function (data) {
                let ret = [];
                for (let it in data) {
                    ret.push(encodeURIComponent(it) + '=' + encodeURIComponent(data[it]));
                }
                return ret.join("&")
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        })
        return result.data;
    } catch (e) {
        throw (e)
    }
}


// 如果查询到物流信息，则返回json, 如果没有，则返回数字0
async function MyChatCourier(number) {
    const jsonStr = `{\"OrderCode\":\"\",\"ShipperCode\":\"YD\",\"LogisticCode\":\"${number}\"}`;
    try {
        let { Shippers } = await myCourier(jsonStr, '2002');
        if (!Shippers.length) {
            return 0;
        }
        let ShipperCode = Shippers[0].ShipperCode;
        let str = `{\"OrderCode\":\"\",\"ShipperCode\":\"${ShipperCode}\",\"LogisticCode\":\"${number}\"}`;
        let result = await myCourier(str, '1002');
        result.ShipperName = Shippers[0].ShipperName;
        if (!result.Traces.length) {
            return 0;
        }
        console.log(result)
        return result;
    } catch (e) {
        return 0;
    }
}
//test
//MyChatCourier('3832052309994')

exports = module.exports = {
    MyChatCourier
}