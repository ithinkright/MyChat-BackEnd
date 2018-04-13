const { sendMessages } = require('../../services/socket.io');

function remind(friendid, userid, time, event) {
  const ms = time.getTime() - new Date().getTime();
  setTimeout(() => {
    const messages = [`是时候去${event}啦`];
    sendMessages(friendid, userid, messages);
  }, ms);
}

exports = module.exports = {
  remind,
};
