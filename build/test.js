const core = require("./sci_core.js");


x= [0, 1, 2, 3, 4, 5, 6]
y= [8.16, 1.89, 7.13, 7.48, 4.59, 0.82, 5.68]

/**
* @type {Array} a
 */
let a=[
	[1, 2], 
	[3, 4],
	[5, 6]];

const create2dArray = (rows, columns) => [...Array(rows).keys()].map(i => Array(columns))

let arr = []

for(let i=0; i<a[0].length; ++i)
	arr.push(a.map(e=>e[i]));


console.log(arr);
