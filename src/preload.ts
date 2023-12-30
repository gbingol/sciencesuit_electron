const { contextBridge } = require('electron')
const path = require('node:path')
const { exec } = require('child_process');

const scicore = require('./cpp/sci_core.js');
const stattests = require('./cpp/sci_stat_tests.js');
const statdists = require('./cpp/sci_stat_tests.js');
let {PythonShell} = require('python-shell');



const API =
{
	dirname: () =>
	{
		return __dirname;
	},
	
	projdir: () =>
	{
		return path.dirname(__dirname);
	},

	runcmd: (cmd:string) =>
	{
		return new Promise((resolve, reject)=>
		{
			//@ts-ignore
			exec(cmd, (error, stdout, stderr) =>
			{
				if (error)
					reject(error);
				else 
					resolve(stdout);
			});
		});
	},

	runpython: (input:string, options:Object, isstr = false) =>
	{
		if (!isstr)
			return PythonShell.run(input, options);

		return PythonShell.runString(input, options);
	},
	
	psychrometry: (k:string[]| Object, v?:number[]) =>
	{
		if (v !== undefined)
			return new scicore.Psychrometry(k as string[], v as number[]);

		return scicore.Psychrometry.Instance(k as Object);
	},

	
	test_z: (x:number[], sd:number, mu:number, alternative:string, conflevel:number) =>
	{
		return stattests.test_z(x, sd, mu, alternative, conflevel)
	},

	test_f: (x:number[], y:number[], ratio=1.0, alternative = "two.sided", conflevel = 0.95) =>
	{
		return stattests.test_f(x, y, ratio, alternative, conflevel)
	},

	test_t1: (x:number[], mu:number, alternative = "two.sided", conflevel = 0.95) =>
	{
		return stattests.test_t1(x, mu, alternative, conflevel)
	},

	test_t2: (x:number[], y:number[], mu:number, varequal = true, alternative = "two.sided", conflevel = 0.95) =>
	{
		return stattests.test_t2(x, y, mu, varequal, alternative, conflevel)
	},

	test_tpaired: (x:number[], y:number[], mu:number, alternative = "two.sided", conflevel = 0.95) =>
	{
		return stattests.test_tpaired(x, y, mu, alternative, conflevel)
	},

	//Statistical Distributions
	dist: 
	{
		pf: (x: number[] | number, df1: number, df2:number):number[] | number =>
		{
			return statdists.dist_pf(x, df1, df2);
		}
	}
}

module.exports = {API};

contextBridge.exposeInMainWorld('api', API);