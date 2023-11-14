const { contextBridge } = require('electron')
const os = require('os');
const { exec } = require('child_process');

const { Psychrometry } = require('../build/sci_core.js');

const hljs = require('highlight.js/lib/core');
hljs.registerLanguage('python', require('highlight.js/lib/languages/python'));

let {PythonShell} = require('python-shell')


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
function RunCmd(callback, cmd) 
{
	exec(cmd, (error, stdout, stderr) =>
	{
		if (error)
			callback(error, null);
		else 
			callback(null, stdout);
	});
}

  
function RunPython(input, options, isstr = false)
{
	if (!isstr)
		return PythonShell.run(input, options);

	return PythonShell.runString(input, options);
}


contextBridge.exposeInMainWorld('myapi',
{
	dirname: () => { return __dirname; },
	homedir: () => { return os.homedir(); },
	runcmd: (callback, cmd) => { return RunCmd(callback, cmd); },
	runpython: (file, options) => { return RunPython(file, options); },
	psychrometry: (k, v) => { return psychrometry(k, v); },
	hljs: hljs
});