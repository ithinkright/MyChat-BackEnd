const { MyChatError, pick, sendRes } = require('../services/MyChatUtils/index');
const getWeather = require('../services/Weather/index');


async function get(ctx, next) {
  const obj = pick(ctx.param, ['place']);
  try {
    let result = await getWeather(obj.place);
    sendRes(ctx, {result: JSON.stringify(result)});
  }
  catch (e) {
    console.log(e);
    sendRes(ctx, {result: "城市有误，请重新输入"});
  }
  return next();
}

exports = module.exports = {
  get
}
