const math = require("mathjs")
let test = "(3 / 4.0) * 5 ^ 2 + 6";
function compute(str) {
    return math.eval(str)
}
exports = module.exports = compute;