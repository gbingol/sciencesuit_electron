const { contextBridge } = require('electron')
const path = require('node:path')
const { exec } = require('child_process');

const scicore = require('./cpp/sci_core.js');
var scinodebind = require("./cpp/nodebind.node");
let {PythonShell} = require('python-shell');



function dirname()
{
	return __dirname;
}


function projdir(){
	return path.dirname(__dirname);
}


function runcmd(cmd:string)
{
	return new Promise((resolve, reject)=> {
		//@ts-ignore
		exec(cmd, (error, stdout, stderr) => {
			if (error) reject(error);
			else resolve(stdout);
		});
	});
}


function runpython(
	input:string, 
	options:Object, 
	isstr = false)
{
	if (!isstr)
		return PythonShell.run(input, options);

	return PythonShell.runString(input, options);
}


function psychrometry(
	k:string[]| Object, 
	v?:number[])
{
	if (v !== undefined)
		return new scicore.Psychrometry(k as string[], v as number[]);

	return scicore.Psychrometry.Instance(k as Object);
}


function test_z(
	x:number[], 
	sd:number, 
	mu:number, 
	alternative:string, 
	conflevel:number)
{
	return scinodebind.test_z(x, sd, mu, alternative, conflevel)
}


function test_f(
	x:number[], 
	y:number[], 
	ratio=1.0, 
	alternative = "two.sided", 
	conflevel = 0.95)
{
	return scinodebind.test_f(x, y, ratio, alternative, conflevel)
}


function test_t1(
	x:number[], 
	mu:number, 
	alternative = "two.sided", 
	conflevel = 0.95)
{
	return scinodebind.test_t1(x, mu, alternative, conflevel)
}


function test_t2(
	x:number[], 
	y:number[], 
	mu:number, 
	varequal = true, 
	alternative = "two.sided", 
	conflevel = 0.95)
{
	return scinodebind.test_t2(x, y, mu, varequal, alternative, conflevel)
}


function test_tpaired(
	x:number[], 
	y:number[], 
	mu:number, 
	alternative = "two.sided", 
	conflevel = 0.95)
{
	return scinodebind.test_tpaired(x, y, mu, alternative, conflevel)
}

//two-factor anova
function test_aov2(
	responses:number[], 
	factor1:string[], 
	factor2:string[])
{
	return scinodebind.test_aov2(responses, factor1, factor2);
}

function regression_simplelinear(
	response: number[],
	factor: number[],
	intercept = true,
	conflevel = 0.95)
{
	return scinodebind.regression_simplelinear(response, factor, intercept, conflevel);
}


function pf(
	x: number[] | number, 
	df1: number, 
	df2:number):number[] | number
{
	return scinodebind.dist_pf(x, df1, df2);
}


function dnorm(
	x: Array<number> | number, 
	mean: number = 0, 
	sd: number = 1): Array<number> | number
{
	if (sd <= 0)
		throw new Error("sd >0 expected");

	return scinodebind.dist_dnorm(x, mean, sd);
}


const API =
{
	dirname: dirname,
	projdir: projdir,

	runcmd:runcmd,
	runpython: runpython,
	
	//core functions
	psychrometry: psychrometry,


	stat:
	{
		//statistical tests
		test_z: test_z,
		test_f: test_f,
		test_t1: test_t1,
		test_t2: test_t2,
		test_tpaired: test_tpaired,
		test_aov2: test_aov2,

		regression:
		{
			simple_linear: regression_simplelinear,
		},

		//Statistical Distributions
		dist:
		{
			pf: pf,
			dnorm: dnorm
		}
	}
}

module.exports = {API};

contextBridge.exposeInMainWorld('api', API);