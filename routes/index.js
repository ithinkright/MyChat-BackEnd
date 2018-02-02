function loadRouters(app) {
  app.use(require('./users').routes());
}

exports = module.exports = {
  loadRouters
}