const { contextBridge }  = require('electron')
const os = require('os');

const { exec } = require('child_process');

const Psychrometry = require('./cpp/psychrometry.js');

function RunPy(callback, cmd) 
{
	exec('python ' + cmd, (error, stdout, stderr) => {
	    if (error) {
		  callback(error, null);
	    } else {
		  callback(null, stdout);
	    }
	});
  }

contextBridge.exposeInMainWorld('electron', {
	homedir: () => { return os.homedir(); },
	runpy: (callback, cmd) => { return RunPy(callback, cmd); },
	psychrometry:Psychrometry,
});
    
