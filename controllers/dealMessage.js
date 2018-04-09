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
    if (!friend.attribute) {
        sendRes(ctx, {result: result});
        return;
    }
    let choice = friend.attribute.split(',')[0];
    switch (choice) {
      case "35b4b419fa4b8c97858f967daf196f96":
        try {
          result = compute(obj.mes);
        }
        catch (e) {
          console.log("字符串无法求值");
          result = "该字符串无法求值";
        }
        result = result.toString();
        break;
      case "8b3607d0f4181a3cb6ffdccf7185f09b":
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
      case "e9dd3c65c01e1b7167e28137ad16ef79":
        result = await weatherCtrl.get(obj.mes);
        break;
      // 小秘 做点自动回复的好玩东西
    }
    sendRes(ctx, {result: result});
}

exports = module.exports = {
    process
}
