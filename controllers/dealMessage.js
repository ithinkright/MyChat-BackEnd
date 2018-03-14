const translate = require('../services/Translator/youdao');
const compute = require('../services/Compute/index');
const { friendModel,attributeModel } = require('../models');
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils/')


async function process(ctx, next) {
    let obj = pick(ctx.param, ['friendid', 'mes']);
    let result = "更多功能请升级为MyChat尊享会员，可缴费至15521160474支付宝";
    let [friend] = await friendModel.findFriendById({ friendid: obj.friendid });
    if (!friend) {
        throw new MyChatError(2, '该朋友不存在');
    }
    let choice = friend.attribute.split(',')[0];
    let [attribute] = await attributeModel.findAttributeById({ attributeid: choice });
    if (!attribute) {
        throw new MyChatError(2, '该属性不存在');
    }
    switch (attribute.name) {
      case "compute":
        try {
          result = compute(obj.mes);
        }
        catch (e) {
          console.log("字符串无法求值");
          sendRes(ctx, {result: "该字符串无法求值"})
        }
        result = result.toString();
        break;
      case "translate":
        obj.from = "auto";
        obj.to = "ja";
        obj.query = obj.mes;
        let res = await translate(obj);
        result = res.translation[0];
        break;
    }
    sendRes(ctx, {result: result});
}

exports = module.exports = {
    process
}
