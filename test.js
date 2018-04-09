const moment = require('moment');
const { lexicalAnalyse, timeNlp } = require('./friends/nlp');

// lexicalAnalyse('今天我去看望外婆');

const a = new Date('2018-08-08 02:40:22');
console.log(a);
console.log(moment(a).format('YYYY-MM-DD HH:mm:ss'));

console.log(a.getFullYear());
console.log(a.getMonth());
console.log(a.getDate());
console.log(a.getHours());
console.log(a.getMinutes());
console.log(a.getSeconds());

timeNlp('20小时前我在打游戏');
