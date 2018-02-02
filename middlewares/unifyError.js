const logger = require('../services/MyChatUtils/logger')
const sendRes = require('../services/MyChatUtils/sendRes');
const { MyChatError } = require('../services/MyChatUtils');
async function unifyError(ctx, next) {
    try {
        await next();
    } catch (err) {
        logger.error(err);
        if (err instanceof MyChatError) {
            sendRes(ctx, {}, 400, err.code, err.message)
        } else {
            sendRes(ctx, {}, 500, err.message, '服务端未明确错误(参数缺少,参数为空,主键重复等)')
        }
    }
}
exports = module.exports = unifyError;