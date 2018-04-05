const translate = require('../services/Translator/youdao');
const compute = require('../services/Compute/index');
const { friendsModel, attributesModel,users_frineds } = require('../models');
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils/');
const weatherCtrl = require('./weather');

async function process(ctx, next) {
    let obj = pick(ctx.param, ['friendid', 'mes']);
    let result = "更多功能请升级为MyChat尊享会员";
    let [friend] = await friendsModel.findFriendById({ friendid: obj.friendid });
    if (!friend) {
        throw new MyChatError(2, '该朋友不存在');
    }
    let choice = friend.attribute.split(',')[0];
    switch (choice) {
      case "77e73f3a185e16d1f08ca5e057710b9d":
        try {
          result = compute(obj.mes);
        }
        catch (e) {
          console.log("字符串无法求值");
          result = "该字符串无法求值";
        }
        result = result.toString();
        break;
      case "fc46e26a907870744758b76166150f62":
        obj.from = "auto";
        obj.to = "ja";
        obj.query = obj.mes;
        let res = await translate(obj);
        result = res.translation[0];
        break;
      case "0c83f57c786a0b4a39efab23731c7ebc":
        let [users_friends] = await users_frineds.findUserFriendByObj({ friendid: obj.friendid });
        let preference = JSON.parse(users_friends.preference);
        break;
      case "1441df6b1c10f910ccdc400e40b5fce9":
        result = await weatherCtrl.get(obj.mes);
        break;
      // 小秘 做点自动回复的好玩东西
    }
    sendRes(ctx, {result: result});
}

exports = module.exports = {
    process
}
