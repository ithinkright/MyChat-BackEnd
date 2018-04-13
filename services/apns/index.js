const apn = require("apn");
const { findFriendByObj } = require('../../models/friends');

// const device_token = '527325efaa9bded0a682e2e001ade4213f682449fca25f117be11887c30b70d4';
const tokens = new Map();
const provider = new apn.Provider({
  token: {
    key: '/Users/raincome/codespace/projects/mychat/MyChat-BackEnd/config/AuthKey_H8DPF75JW9.p8',
    keyId: 'H8DPF75JW9',
    teamId: 'H34D54V7L7',
  },
  production: false,
});

function saveDeviceToken(userid, token) {
  tokens.set(userid, token);
}

async function pushNotificetion(userid, count, friendid, messages) {
  if (!tokens.has(userid)) return;
  const [friend] = await findFriendByObj({ friendid });
  const note = new apn.Notification();
  note.badge = count;
  note.alert = {
    title: '新消息',
    subtitle: friend.friendname,
    body: messages[messages.length-1],
  };
  note.sound = "ping.aiff";
  note.payload = { friendid, messages };
  note.topic = "edu.sysu.mychat";
  provider.send(note, tokens.get(userid)).then(result => {
    console.log(result);
  });
}

exports = module.exports = {
  saveDeviceToken,
  pushNotificetion,
};
