"use strict";
var addon = require("./nodebind.node");
function dist_pf(x, df1, df2) {
    if (df1 <= 0 || df2 <= 0)
        throw new Error("df1>0 and df2>0 expected");
    return addon.dist_pf(x, df1, df2);
}
function dist_dnorm(x, mean = 0, sd = 1) {
    if (sd <= 0)
        throw new Error("sd >0 expected");
    return addon.dist_dnorm(x, mean, sd);
}
module.exports = {
    dist_pf,
    dist_dnorm,
};
