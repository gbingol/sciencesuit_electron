const core = require("./sci_core.js");


x= [0, 1, 2, 3, 4, 5, 6]
y= [8.16, 1.89, 7.13, 7.48, 4.59, 0.82, 5.68]

res = core.trapz(x, y, true);
//console.log(res.length)
console.log(res);
