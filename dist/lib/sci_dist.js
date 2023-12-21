"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var addon = require("./nodebind.node");
function dnorm(x, mean = 0, sd = 1) {
    if (typeof x !== "number" && !Array.isArray(x))
        throw "x must be number or array";
    if (typeof mean !== "number")
        throw "mean must be number";
    if (typeof sd !== "number" || sd <= 0)
        throw "sd >0 expected";
    return addon.dnorm(x, mean, sd);
}
exports.default = { dnorm };
