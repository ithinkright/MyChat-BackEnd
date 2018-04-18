const db = require('./db');
const { sendMessages } = require('../../services/socket.io');
const { findFriendByAttributename } = require('../../models/friends');

const mychaters = [];

function isMyChater(userid) {
  return mychaters.includes(userid);
}

async function sendToUser(advice_id, response) {
  const [advice] = await db.findAdvice(advice_id);
  if (!advice) return;
  const { userid } = advice;
  const [friend] = await findFriendByAttributename(userid, 'mychat');
  if (!friend) return;
  sendMessages(friend.friendid, userid, [response]);
}

async function sendToMyChater(advice_id, advice) {
  for (const userid of mychaters) {
    const [friend] = await findFriendByAttributename(userid, 'mychat');
    if (!friend) continue;
    sendMessages(friend.friendid, userid, [advice]);
  }
}

exports = module.exports = {
  sendToUser,
  sendToMyChater,
};
