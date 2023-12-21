import { contextBridge } from 'electron';
import path from 'node:path';
import { exec } from 'child_process';

import { Psychrometry, trapz } from './lib/sci_core';
let {PythonShell} = require('python-shell');



//Run a termina command
function RunCmd(cmd:string):Promise<any>
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


function RunPython(input:string, options:Object, isstr:boolean = false)
{
	if (!isstr)
		return PythonShell.run(input, options);

	return PythonShell.runString(input, options);
}




function psychrometry(k:string[] | Object, v:number[] | undefined=undefined)
{
	if (v != undefined && Array.isArray(k) && Array.isArray(v))
		return new Psychrometry(k, v);

	return Psychrometry.Instance(k);
}


export const API =
{
	dirname: () => { return __dirname; },
	projdir: () => { return path.dirname(__dirname); },
	runcmd: (cmd:string) => { return RunCmd(cmd); },
	runpython: (file:string, options:Object, isstr=false) => { return RunPython(file, options, isstr); },
	
	psychrometry: (k:string[], v:number[]) => { return psychrometry(k, v); },
	trapz: (x:number[], y:number[], isCumulative = false) => { return trapz(x, y, isCumulative); },
}



contextBridge.exposeInMainWorld('api', API);