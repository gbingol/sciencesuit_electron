const { contextBridge }  = require('electron')
const os = require('os');

const { exec } = require('child_process');

const Psychrometry = require('./cpp/psychrometry.js');

function ComputePsychrometricProps(k, v) {
  return new Promise((resolve, reject) => {
    Psychrometry().then(myModule => {
      const v1 = new myModule.VectorDouble();
      v1.push_back(101325);
      v1.push_back(30);
      v1.push_back(15);

      const v2 = new myModule.VectorString();
      v2.push_back("p");
      v2.push_back("tdb");
      v2.push_back("twb");

      const str = myModule.to_str(v2, v1);
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

contextBridge.exposeInMainWorld('myapi', {
	homedir: () => { return os.homedir(); },
	runpy: (callback, cmd) => { return RunPy(callback, cmd); },
	psychrometry_tostr:(k, v)=> {return ComputePsychrometricProps(k, v);}
});
    
