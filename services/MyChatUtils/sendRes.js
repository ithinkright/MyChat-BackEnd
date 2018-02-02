async function sendRes(ctx, obj, status, code, message) {
    ctx.body = Object.assign({}, obj);
    ctx.status = status ? status : 200;
    ctx.body.code = code ? code : 0;
    ctx.body.message = message ? message : 'ok';
}
exports = module.exports = sendRes;