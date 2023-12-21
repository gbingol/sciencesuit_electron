var addon = require("./nodebind.node");




function dnorm(
	x: Array<number> | number,
	mean: number = 0,
	sd: number = 1): Array<number> | number
{
	if (typeof x!=="number" && !Array.isArray(x))
		throw "x must be number or array";

	if (typeof mean!=="number")
		throw "mean must be number";
	
	if (typeof sd!=="number" || sd <= 0)
		throw "sd >0 expected";

	return addon.dnorm(x, mean, sd);
}



export default { dnorm };
