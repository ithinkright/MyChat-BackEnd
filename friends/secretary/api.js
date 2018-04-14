const { sendMessages } = require('../../services/socket.io');

function remind(friendid, userid, time, message) {
  const ms = time.getTime() - new Date().getTime();
  console.log(ms);
  setTimeout(() => {
    const messages = [message];
    console.log(friendid, userid, time, message);
    sendMessages(friendid, userid, messages);
  }, ms);
}

exports = module.exports = {
  remind,
};
