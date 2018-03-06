const math = require("mathjs")
let test = "(3 / 4.0) * 5 ^ 2 + 6";
function compute(str) {
    return math.eval(str)
}
// console.log(math.derivative('2x^2 / (3x + 4)', 'x').toString());
// console.log(compute(test));
exports = module.exports = compute;