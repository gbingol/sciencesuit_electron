var addon = require("./nodebind.node");




function test_t1(
	x: Array<number>,
	mu: number,
	alternative:core.stat.Alternative = core.stat.Alternative.TWOSIDED,
	conflevel: number = 0.95): core.stat.test_t1_result
{
	return addon.test_t1(x, mu, alternative, conflevel);
}



module.exports =
{
	test_t1
};
