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



module.exports =
{
	test_t1
};
