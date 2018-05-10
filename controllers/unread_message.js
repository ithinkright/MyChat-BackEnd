const { umModel } = require('../models');
const { MyChatError, sendRes } = require('../services/MyChatUtils');

async function getAll(ctx, next) {
  const { userid } = ctx.param;
  const unread_messages = await umModel.findByUserid(userid);
  const umids = [];
  for (const um of unread_messages) {
    um.friendid = `${um.friendid}`;
    um.messages = JSON.parse(um.messages);
    umids.push(um.umid);
  }
  sendRes(ctx, { unread_messages });
  if (umids.length !== 0) umModel.updateFetched(umids);
  return next();
}

async function getOne(ctx, next) {
  const { userid, friendid } = ctx.param;
  const unread_messages = await umModel.findByUseridAndFriendid(userid, friendid);
  for (const um of unread_messages) {
    um.friendid = `${um.friendid}`;
    um.messages = JSON.parse(um.messages);
  }
  sendRes(ctx, { unread_messages });
  umModel.deleteByFriendid(friendid);
  return next();
}

async function del(ctx, next) {
  const { userid, umids } = ctx.param;
  umModel.deleteByIds(umids);
  sendRes(ctx, {});
  return next();
}

exports = module.exports = {
  getAll,
  getOne,
  del,
};
