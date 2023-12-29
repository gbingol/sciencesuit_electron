var corestat = require("./nodebind.node");


function test_z(
	x: Array<number>,
	sd: number,
	mu: number,
	alternative:string = "two.sided",
	conflevel: number = 0.95):Object
{
	return corestat.test_z(x, sd, mu, alternative, conflevel);
}


//x, y, sd, alternative="two.sided", conflevel=0.95
function test_f(
	x: Array<number>,
	y:Array<number>,
	ratio: number = 1.0,
	alternative:string = "two.sided",
	conflevel: number = 0.95):Object
{
	return corestat.test_f(x, y, ratio, alternative, conflevel);
	
}


function test_t1(
	x: Array<number>,
	mu: number,
	alternative:string = "two.sided",
	conflevel: number = 0.95):Object
{
	return corestat.test_t1(x, mu, alternative, conflevel);
}


//x, y, mu, varequal = True, alternative="two.sided", conflevel=0.95
function test_t2(
	x: Array<number>,
	y:Array<number>,
	mu: number,
	varequal:boolean = true,
	alternative:string = "two.sided",
	conflevel: number = 0.95):Object
{
	return corestat.test_t2(x, y, mu, varequal, alternative, conflevel);
	
}

//x, y, mu, alternative="two.sided", conflevel=0.95
function test_tpaired(
	x: Array<number>,
	y:Array<number>,
	mu: number,
	alternative:string = "two.sided",
	conflevel: number = 0.95):Object
{
	return corestat.test_tpaired(x, y, mu, alternative, conflevel);
	
}



module.exports =
{
	test_z, test_f,
	test_t1, test_t2, test_tpaired
};
