const translate = require('../services/Translator/youdao');
const compute = require('../services/Compute/index');
const { friendModel,attributeModel } = require('../models');
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils/')


async function process(ctx, next) {
    let obj = pick(ctx.param, ['friendid', 'mes']);
    let [friend] = await friendModel.findFriendById({ friendid: obj.friendid });
    let [attribute] = await attributeModel.findAttributeById({ attributeid: friend.attribute });
    let result = "Not anything";
    switch (attribute.name) {
      case "compute":
        result = compute(obj.mes);
        break;
      case "translate":
        obj.from = "zh-CHS";
        obj.to = "ja";
        obj.query = obj.mes;
        let res = await translate(obj);
        result = res.translation[0];
        break;
      default:
        result = "更多功能敬请期待";
        break;
    }
    sendRes(ctx, {result: result});
}

exports = module.exports = {
    process
}
