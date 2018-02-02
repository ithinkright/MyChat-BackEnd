const MyChatError = require('./MyChatError')
function pick(obj, keys) {
    let newObj = {};
    for (let i = 0; i < keys.length; i++) {
        if (typeof (obj[keys[i]]) === 'undefined') {
            throw new MyChatError(1, '缺少参数');
        }
        if (obj[keys[i]] === '') {
            throw new MyChatError(1, '参数不能为空');
        }
        newObj[keys[i]] = obj[keys[i]];
    }
    return newObj;
}

exports = module.exports = pick;