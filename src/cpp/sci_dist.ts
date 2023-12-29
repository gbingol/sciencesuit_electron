var addon = require("./nodebind.node");


function dist_pf(
	x: Array<number> | number,
	df1: number,
	df2: number): Array<number> | number
{
	
	if (df1 <=0 || df2<=0)
		throw new Error("df1>0 and df2>0 expected");

	return addon.dist_pf(x, df1, df2);
}


function dist_dnorm(
	x: Array<number> | number,
	mean: number = 0,
	sd: number = 1): Array<number> | number
{
	if (sd <= 0)
		throw new Error("sd >0 expected");

	return addon.dist_dnorm(x, mean, sd);
}



module.exports = {
	dist_pf,
	dist_dnorm,
};
