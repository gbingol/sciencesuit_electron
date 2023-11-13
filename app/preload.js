const { contextBridge }  = require('electron')
const os = require('os');

const { exec } = require('child_process');

const { Psychrometry } = require('../build/sci_core.js');



/**
 * @param {Array} k
 * @param {Array} v 
 * @returns Psychrometry
*/
function psychrometry(k, v=null)
{
	if(v!=null)
		return new Psychrometry(k, v);

	return Psychrometry.Instance(k);
}


function RunPy(callback, cmd) 
{
	exec('python ' + cmd, (error, stdout, stderr) => {
		if (error)
			callback(error, null);
		else 
			callback(null, stdout);
	});
  }

contextBridge.exposeInMainWorld('myapi',
{
	dirname: () => { return __dirname; },
	homedir: () => { return os.homedir(); },
	runpy: (callback, cmd) => { return RunPy(callback, cmd); },
	psychrometry:(k, v)=> {return psychrometry(k, v);}
});
    
