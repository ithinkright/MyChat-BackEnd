async function unifyData(ctx, next) {
    ctx.param = {};
    if (ctx.request.body) {
        Object.assign(ctx.param, ctx.request.body);
    }
    if (ctx.request.query) {
        Object.assign(ctx.param, ctx.request.query);
    }
    if (ctx.params) {
        Object.assign(ctx.param, ctx.params);
    }
    return next();
}

exports = module.exports = unifyData;