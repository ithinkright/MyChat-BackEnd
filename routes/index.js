function loadRouters(app) {
  app.use(require('./users').routes());
  app.use(require('./friend').routes());
}

exports = module.exports = {
  loadRouters
}
