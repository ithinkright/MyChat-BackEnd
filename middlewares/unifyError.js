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
            sendRes(ctx, {}, 500, err.message, '呀！服务端出错了');
        }
    }
}
exports = module.exports = unifyError;