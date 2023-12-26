"use strict";
var addon = require("./nodebind.node");
function test_t1(x, mu, alternative = core.stat.Alternative.TWOSIDED, conflevel = 0.95) {
    return addon.test_t1(x, mu, alternative, conflevel);
}
module.exports =
    {
        test_t1
    };
