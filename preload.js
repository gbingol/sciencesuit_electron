const { contextBridge }  = require('electron')
const os = require('os');

const { exec } = require('child_process');

const { Psychrometry } = require('./libscisuit/main.js');



/**
 * @param {Array} k
 * @param {Array} v 
 * @returns Psychrometry
*/
function psychrometry(k, v)
{
	return new Psychrometry(k, v);
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
	homedir: () => { return os.homedir(); },
	runpy: (callback, cmd) => { return RunPy(callback, cmd); },
	psychrometry:(k, v)=> {return psychrometry(k, v);}
});
    
