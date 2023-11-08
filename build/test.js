const core = require("./sci_dist.js");

const {util} = require("../app/js/util.js")

console.log(util.math.round(core.dnorm(1, 0, 1), 2));