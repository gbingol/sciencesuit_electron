var addon = require("./nodebind.node");


function dist_pf(
	x: Array<number> | number,
	df1: number,
	df2: number): Array<number> | number
{
	
	if (df1 <=0 || df2<=0)
		throw "df1>0 and df2>0 expected";

	return addon.dist_pf(x, df1, df2);
}


function dist_dnorm(
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

	return addon.dist_dnorm(x, mean, sd);
}



module.exports = {
	dist_pf,
	dist_dnorm,
};
