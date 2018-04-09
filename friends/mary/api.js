function isQuestion(message) {
  return message.indexOf('哪里') !== -1
      || message.indexOf('干嘛') !== -1
      || message.indexOf('什么') !== -1;
}

exports = module.exports = {
  isQuestion,
};
