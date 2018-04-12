const { sendMessages } = require('../../services/socket.io');

function remind(userid, time, event) {
  const ms = time.getTime() - new Date().getTime();
  setTimeout(() => {
    const messages = [`是时候去${event}啦`];
    sendMessages(userid, messages);
  }, ms);
}

exports = module.exports = {
  remind,
};
