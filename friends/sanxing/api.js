function getQuestionNumbers(userid) {
  const ret = [];
  while (ret.length < 3) {
    let temp = Math.floor(Math.random()*64+1);
    while (ret.includes(temp)) {
      temp = Math.floor(Math.random()*64+1);
    }
    ret.push(temp);
  }
  return ret;
}

exports = module.exports = {
  getQuestionNumbers,
};
