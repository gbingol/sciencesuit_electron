"use strict";
var corestat = require("./nodebind.node");
function test_t1(x, mu, alternative = "two.sided", conflevel = 0.95) {
    return corestat.test_t1(x, mu, alternative, conflevel);
}
//x, y, mu, varequal = True, alternative="two.sided", conflevel=0.95
function test_t2(x, y, mu, varequal = true, alternative = "two.sided", conflevel = 0.95) {
    return corestat.test_t2(x, y, mu, varequal, alternative, conflevel);
}
//x, y, mu, alternative="two.sided", conflevel=0.95
function test_tpaired(x, y, mu, alternative = "two.sided", conflevel = 0.95) {
    return corestat.test_tpaired(x, y, mu, alternative, conflevel);
}
module.exports =
    {
        test_t1, test_t2, test_tpaired
    };
