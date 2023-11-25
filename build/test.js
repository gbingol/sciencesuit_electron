const core = require("./sci_dist.js");

const {util} = require("../renderer/util.js")

console.log(util.math.round(core.dnorm(1, 0, 1), 2));