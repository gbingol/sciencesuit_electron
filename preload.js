const { contextBridge }  = require('electron')
const os = require('os');

const { exec } = require('child_process');

const Psychrometry = require('./cpp/psychrometry.js');

function psychrometry_tostr(k, v) {
	return new Promise((resolve, reject) => {
		Psychrometry().then(myModule =>
		{
			const vals = new myModule.VectorDouble();
			const keys = new myModule.VectorString();
			for (let i = 0; i < k.length; i++)
			{
				keys.push_back(k[i]);
				vals.push_back(v[i]);
			}

			const str = myModule.to_str(keys, vals);
			resolve(str);
    		}).catch(reject);
	});
}

function psychrometry_tojson(k, v) {
	return new Promise((resolve, reject) => {
		Psychrometry().then(myModule =>
		{
			const vals = new myModule.VectorDouble();
			const keys = new myModule.VectorString();
			for (let i = 0; i < k.length; i++)
			{
				keys.push_back(k[i]);
				vals.push_back(v[i]);
			}

			const str = myModule.to_json(keys, vals);
			resolve(str);
    		}).catch(reject);
	});
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
	psychrometry_tostr: (k, v) => { return psychrometry_tostr(k, v); },
	psychrometry_tojson:(k, v)=> {return psychrometry_tojson(k, v);}
});
    
