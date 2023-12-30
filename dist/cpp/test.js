const core = require("./nodebind.node");


x = [0.69, 0.606, 0.57, 0.749, 0.672, 0.628, 0.609, 0.844, 0.654, 0.615, 0.668, 0.601, 0.576, 0.67, 0.606, 0.611, 0.553, 0.933];
let res = core.test_t1(x, 0.618, "two.sided", 0.95)

console.log(res);