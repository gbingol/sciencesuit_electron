const { contextBridge } = require('electron')
const path = require('node:path')
const { exec } = require('child_process');

const { Psychrometry, trapz } = require('./cpp/sci_core.js');
const stattests = require('./cpp/sci_stat_tests.js');
let {PythonShell} = require('python-shell');



//Run a termina command
function RunCmd(cmd) 
{
	return new Promise((resolve, reject)=>
	{
		exec(cmd, (error, stdout, stderr) =>
		{
			if (error)
				reject(error);
			else 
				resolve(stdout);
		});
	});
}



let funcs =
{
	dirname: () =>
	{
		return __dirname;
	},
	
	projdir: () =>
	{
		return path.dirname(__dirname);
	},

	runcmd: (callback, cmd) =>
	{
		return RunCmd(callback, cmd);
	},

	runpython: (input, options, isstr = false) =>
	{
		if (!isstr)
			return PythonShell.run(input, options);

		return PythonShell.runString(input, options);
	},
	
	psychrometry: (k, v) =>
	{
		if (v != null)
			return new Psychrometry(k, v);

		return Psychrometry.Instance(k);
	},

	trapz: (x, y, isCumulative = false) =>
	{
		return trapz(x, y, isCumulative);
	},

	test_t1: (x, mu, alternative, conflevel) =>
	{
		return stattests.test_t1(x, mu, alternative, conflevel)
	},

	test_t2: (x, y, mu, varequal = true, alternative = "two.sided", conflevel = 0.95) =>
	{
		return stattests.test_t2(x, y, mu, varequal, alternative, conflevel)
	}
}



contextBridge.exposeInMainWorld('api', funcs);