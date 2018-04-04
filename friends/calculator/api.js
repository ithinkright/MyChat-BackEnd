const math = require("mathjs")

function compute(str) {
    return math.eval(str)
}

exports = module.exports = {
  compute,
};
