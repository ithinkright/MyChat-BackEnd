const { sendMessages } = require('../../services/socket.io');

function remind(friendid, userid, time, event) {
  const ms = time.getTime() - new Date().getTime();
  console.log(ms);
  setTimeout(() => {
    const messages = [`是时候去${event}啦`];
    console.log(friendid, userid, time, event);
    sendMessages(friendid, userid, messages);
  }, ms);
}

exports = module.exports = {
  remind,
};
