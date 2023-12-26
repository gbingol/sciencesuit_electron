"use strict";
var corestat = require("./nodebind.node");
function test_t1(x, mu, alternative = core.stat.Alternative.TWOSIDED, conflevel = 0.95) {
    let obj = corestat.test_t1(x, mu, alternative, conflevel);
    let ret = {
        pvalue: obj["pvalue"],
        CI_lower: obj["CI_lower"],
        CI_upper: obj["CI_upper"],
        mean: obj["mean"],
        SE: obj["SE"],
        stdev: obj["stdev"],
        N: obj["N"],
        tcritical: obj["tcritical"]
    };
    return ret;
}
module.exports =
    {
        test_t1
    };
