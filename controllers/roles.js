const { friendModel, roleModel, attributeModel } = require('../models')
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils/')

async function assignRole(ctx, next) {
  const obj = pick(ctx.param, ['friendid', 'roleid']);
  let [result] = await friendModel.findFriendById({ friendid: obj.friendid });
  if (!result)
      throw new MyChatError(2, "找不到此朋友")
  return next();
}

async function removeRole(ctx, next) {
  const obj = pick(ctx.param, ['friendid', 'roleid']);
  let [result] = await friendModel.findFriendById({ friendid: obj.friendid });
  if (!result)
      throw new MyChatError(2, "找不到此朋友")
  return next();
}
