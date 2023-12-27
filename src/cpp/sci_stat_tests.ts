var corestat = require("./nodebind.node");

//import * as stat from "../stat";

function test_t1(
	x: Array<number>,
	mu: number,
	//@ts-ignore
	alternative:stat.Alternative = stat.Alternative.TWOSIDED,
	//@ts-ignore
	conflevel: number = 0.95): stat.test_t1_result
{
	let obj = corestat.test_t1(x, mu, alternative, conflevel);
	//@ts-ignore
	let ret: stat.test_t1_result =
	{
		pvalue: obj["pvalue"],
		CI_lower:obj["CI_lower"],
		CI_upper: obj["CI_upper"],
		mean: obj["mean"],
		SE: obj["SE"],
		stdev: obj["stdev"],
		N: obj["N"],
		tcritical: obj["tcritical"]
	}
	return ret;
}


//x, y, mu, varequal = True, alternative="two.sided", conflevel=0.95
function test_t2(
	x: Array<number>,
	y:Array<number>,
	mu: number,
	varequal:boolean = true,
	//@ts-ignore
	alternative:stat.Alternative = stat.Alternative.TWOSIDED,
	//@ts-ignore
	conflevel: number = 0.95): stat.test_t2_result
{
	let obj = corestat.test_t2(x, y, mu, varequal, alternative, conflevel);
	//@ts-ignore
	let ret: stat.test_t2_result =
	{
		pvalue: obj["pvalue"],
		CI_lower:obj["CI_lower"],
		CI_upper: obj["CI_upper"],
		tcritical: obj["tcritical"],
		df: obj["df"],
		s1: obj["s1"],
		s2: obj["s2"],
		sp: obj["sp"],
		n1: obj["n1"],
		n2: obj["n2"],
		xaver: obj["xaver"],
		yaver: obj["yaver"]
	}
	return ret;
}



module.exports =
{
	test_t1, test_t2
};
