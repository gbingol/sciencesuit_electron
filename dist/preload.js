const { contextBridge } = require('electron')
const path = require('node:path')
const { exec } = require('child_process');

const { Psychrometry, trapz } = require('./cpp/sci_core.js');
const { test_t1 } = require('./cpp/sci_stat_tests.js');
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

/**
 * 
 * @param {string} input 
 * @param {Object} options 
 * @param {boolean} isstr 
 * @returns {Promise}
 */
function RunPython(input, options, isstr = false)
{
	if (!isstr)
		return PythonShell.run(input, options);

	return PythonShell.runString(input, options);
}



/**
 * @param {string[] | Object} k
 * @param {string[]} v 
 * @returns {Psychrometry}
*/
function psychrometry(k, v=null)
{
	if (v != null)
		return new Psychrometry(k, v);

	return Psychrometry.Instance(k);
}

/**
 * @param {number[]} x
 * @param {number} mu  
 * @param {string} alternative
 * @param {number} conflevel
 * @returns {Object}
*/
function _test_t1(x, mu, alternative, conflevel)
{
	return test_t1(x, mu, alternative, conflevel);
}


let funcs =
{
	dirname: () => { return __dirname; },
	projdir: () => { return path.dirname(__dirname); },
	runcmd: (callback, cmd) => { return RunCmd(callback, cmd); },
	runpython: (file, options, isstr=false) => { return RunPython(file, options, isstr); },
	
	psychrometry: (k, v) => { return psychrometry(k, v); },
	trapz: (x, y, isCumulative = false) => { return trapz(x, y, isCumulative); },

	test_t1: (x, mu, alternative, conflevel)=> {return _test_t1(x, mu, alternative, conflevel)}
}



contextBridge.exposeInMainWorld('api', funcs);