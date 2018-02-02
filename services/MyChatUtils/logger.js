const logger = {};
logger.log = (msg) => {
    const time = new Date().toLocaleString();
    console.log(`✅ ${time}-${msg}`);
}
logger.error = (err) => {
    const time = new Date().toLocaleString();
    console.error(`❌ ${time} -> ${err.message} -> ${err.stack}`)
}
exports = module.exports = logger;
