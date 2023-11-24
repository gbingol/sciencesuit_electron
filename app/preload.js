const { contextBridge } = require('electron')
const os = require('os');
const { exec } = require('child_process');

const { Psychrometry } = require('../build/sci_core.js');
let {PythonShell} = require('python-shell');

const { Grid } =require('ag-grid-community');


/**
 * @param {Array} k
 * @param {Array} v 
 * @returns Psychrometry
*/
function psychrometry(k, v=null)
{
	if (v != null)
		return new Psychrometry(k, v);

	return Psychrometry.Instance(k);
}


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

  
function RunPython(input, options, isstr = false)
{
	if (!isstr)
		return PythonShell.run(input, options);

	return PythonShell.runString(input, options);
}


let funcs =
{
	dirname: () => { return __dirname; },
	homedir: () => { return os.homedir(); },
	runcmd: (callback, cmd) => { return RunCmd(callback, cmd); },
	runpython: (file, options, isstr=false) => { return RunPython(file, options, isstr); },
	psychrometry: (k, v) => { return psychrometry(k, v); },
	creategrid:(div, options)=>{return createGrid(div, options);}
}



contextBridge.exposeInMainWorld('api', funcs);