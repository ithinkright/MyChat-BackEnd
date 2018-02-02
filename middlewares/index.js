const path = require('path')
function loadMiddlewares(app, server) {
    // koa官方中间件
    app.use(require('koa-logger')());      // 记录http请求
    app.use(require('koa-bodyparser')());  // 处理request传来的JSON数据
    app.use(require('koa-json')());        // 处理response传回的JSON数据  
    app.use(require('koa-static')(path.join(__dirname, '..', 'public')))

    app.use(require('./unifyError'));       //统一处理错误
    app.use(require('./unifyData'));        //统一参数(body params query)
}

exports = module.exports = {
    loadMiddlewares
}