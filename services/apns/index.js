const apn = require("apn");
const path = require('path');
const { findFriendByObj } = require('../../models/friends');

// const device_token = '527325efaa9bded0a682e2e001ade4213f682449fca25f117be11887c30b70d4';
const tokens = new Map();
const badges = new Map();
const provider = new apn.Provider({
  token: {
    key: `${__dirname}/../../config/AuthKey_H8DPF75JW9.p8`,
    keyId: 'H8DPF75JW9',
    teamId: 'H34D54V7L7',
  },
  production: false,
});

function decreaseBadge(userid, delta) {
  if (!badges.has(userid)) {
    badges.set(userid, 0);
    return;
  }
  const before = badges.get(userid);
  let now = before - delta;
  if (now < 0) now = 0;
  badges.set(userid, now);
}

function increaseBadge(userid, delta) {
  if (!badges.has(userid)) {
    badges.set(userid, delta);
  }
  const before = badges.get(userid);
  let now = before + delta;
  badges.set(userid, now);
}

function saveDeviceToken(userid, token) {
  tokens.set(userid, token);
}

async function pushNotificetion(userid, friendid, messages) {
  if (!tokens.has(userid)) return;
  const [friend] = await findFriendByObj({ friendid });
  const note = new apn.Notification();
  increaseBadge(userid, messages.length);
  // note.badge = badges.get(userid);
  note.badge = 1;
  note.alert = {
    title: '新消息',
    subtitle: friend.friendname,
    body: messages[messages.length-1],
  };
  note.sound = "ping.aiff";
  note.payload = { friendid, messages };
  note.topic = "edu.sysu.mychat";
  console.log(note);
  provider.send(note, tokens.get(userid)).then(result => {
    console.log(result);
  });
}

exports = module.exports = {
  saveDeviceToken,
  pushNotificetion,
  decreaseBadge,
  increaseBadge,
};
