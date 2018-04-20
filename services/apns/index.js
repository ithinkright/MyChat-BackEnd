const apn = require("apn");
const path = require('path');
const { findFriendByObj } = require('../../models/friends');
const dtModel = require('../../models/device_token');
const umModel = require('../../models/unread_message');

// const device_token = '527325efaa9bded0a682e2e001ade4213f682449fca25f117be11887c30b70d4';
const provider = new apn.Provider({
  token: {
    key: `${__dirname}/../../config/AuthKey_H8DPF75JW9.p8`,
    keyId: 'H8DPF75JW9',
    teamId: 'H34D54V7L7',
  },
  production: false,
});

async function getDeviceToken(userid) {
  const [device_token] = await dtModel.findDeviceToken(userid);
  if (!device_token) throw new Error('用户的 device_token 不存在');
  return device_token.token;
}

async function pushNotificetion(userid, friendid, messages) {
  const device_token = await getDeviceToken(userid);
  const [friend] = await findFriendByObj({ friendid });
  const note = new apn.Notification();
  note.badge = await umModel.count(userid);
  note.alert = {
    title: friend.friendname,
    body: messages[messages.length-1],
  };
  note.sound = "ping.aiff";
  note.payload = { friendid, messages };
  note.topic = "edu.sysu.mychat";
  provider.send(note, device_token).then(result => {
    console.log(result);
  });
}

exports = module.exports = {
  pushNotificetion,
};
