const md5 = require('md5');
const db = require('./db');
const { sendMessages } = require('../../services/socket.io');
const { findFriendByAttributename } = require('../../models/friends');

const our_emails = [
  'painterdrown@hotmail.com',
  '2364194350@qq.com',
];

const mychaters = [];
for (const e of our_emails) {
  mychaters.push(md5(e.toLowerCase()));
}
console.log(mychaters);

function isMyChater(userid) {
  return mychaters.includes(userid);
}

async function sendToUser(userid, response) {
  const [friend] = await findFriendByAttributename(userid, 'mychat');
  console.log(friend);
  if (!friend) return;
  sendMessages(`${friend.friendid}`, userid, [response]);
}

async function sendToMyChater(userid, advice) {
  for (const u of mychaters) {
    const [friend] = await findFriendByAttributename(u, 'mychat');
    if (!friend) continue;
    sendMessages(`${friend.friendid}`, u, [`${userid}\n${advice}`]);
  }
}

exports = module.exports = {
  isMyChater,
  sendToUser,
  sendToMyChater,
};
