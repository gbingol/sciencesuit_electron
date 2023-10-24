const { contextBridge }  = require('electron')
const os = require('os');

const { exec } = require('child_process');

function RunPy(callback) 
{
	exec('python py/listmodules.py', (error, stdout, stderr) => {
	    if (error) {
		  callback(error, null);
	    } else {
		  callback(null, stdout);
	    }
	});
  }

contextBridge.exposeInMainWorld('electron', {
	homedir: () => { return os.homedir(); },
	runpy: (callback) => { return RunPy(callback); },
});
    
