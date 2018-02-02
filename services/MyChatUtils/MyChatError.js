class MyChatError extends Error {
    constructor(code, message, stack) {
        super(message);
        this.code = code;
        this.message = message;
        this.stack = stack ? stack : '';
    }
}

exports = module.exports = MyChatError;