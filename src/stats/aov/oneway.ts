import {Worksheet, Range, Cell} from "../../lib/comp/grid.js";
import * as np from "../../lib/sci_math.js";
import * as util from "../../lib/util.js";
import { get, set } from "../../../node_modules/idb-keyval/dist/index.js";
import { aov_oneway } from "../../lib/aov.js";

const PAGEID = "AOV_ONEWAY";
const WSKEY = PAGEID + "_WS";


let UserInputs = new Map<string, string>();

	
let ws_div = document.querySelector('#myGrid') as HTMLDivElement;
let ws = new Worksheet(ws_div);
ws.init().then(gridOptions=> {
	get(WSKEY).then((value:Cell[])=>
	{
		if(value!==undefined && value.length>0)
			ws.loadData(value);
	});
});


window.onload = (evt)=>
{
	get(PAGEID).then(
		(value: Map<String, string>) => 
		{
			if(value ===undefined) return;
			
			const inputs = document.querySelectorAll("#inputtable input, select");
			for (let input of inputs) 
			{
				if(input instanceof HTMLInputElement || input instanceof HTMLSelectElement)
					input.value = value.get(input.id) as string;
			}
		}
	);
	
}


let btnCompute = document.querySelector("#compute") as HTMLButtonElement;
btnCompute.onclick = ((evt)=>
{
	let txtresponse = document.querySelector("#response") as HTMLInputElement;
	let txtfactors = document.querySelector("#factors") as HTMLInputElement;
	let txtconflevel = document.querySelector("#conflevel") as HTMLInputElement;
	let chkStacked = document.querySelector("#stacked") as HTMLInputElement;
	let chkTukey = document.querySelector("#tukey") as HTMLInputElement;
	
	const inputs = document.querySelectorAll("#inputtable input, select");
	for(let input of inputs)
	{
		if(input instanceof HTMLInputElement || input instanceof HTMLSelectElement)
		{
			if(!input.disabled && input.value ==="")
				throw new Error("All entries must have valid values");

			UserInputs.set(input.id, input.value);
		}
	}

	try
	{
		let conflevel = parseFloat(txtconflevel.value);
		let IsStacked = chkStacked.checked;
		let IsTukey = chkTukey.checked;
		let NDigits = parseInt((document.querySelector("#txtDigits")  as HTMLInputElement).value);

		if(conflevel<0 || conflevel>100)
			throw new Error("Confidence level must be [0, 100]");

		let rng = new Range(txtresponse.value, ws);
		if (IsStacked == false && rng.ncols <3)
			throw new Error(`Range contains ${rng.ncols} columns. At least 3 expected!`);
		
		let responses: number[][] = [];
		for(let d of rng.data)
			responses.push(util.FilterNumbers(d));


		let res = aov_oneway(responses);
		
		let AOVTable = `
		<table>
		<tr>
			<th>Source</th>
			<th>df</th>
			<th>SS</th>
			<th>MS</th>
			<th>F</th>
			<th>P</th>
		</tr>
		<tr>
			<td>Treatment</td>
			<td>${np.round(res.DF_Treatment, NDigits)}</td>
			<td>${np.round(res.SS__Treatment, NDigits)}</td>
			<td>${np.round(res.MS_Treatment, NDigits)}</td>
			<td>${np.round(res.Fvalue, NDigits)}</td>
			<td>${np.round(res.pvalue, NDigits)}</td>
		</tr>
		<tr>
			<td>Error</td>
			<td>${np.round(res.DF_Error, NDigits)}</td>
			<td>${np.round(res.SS_Error, NDigits)}</td>
			<td>${np.round(res.MS_Error, NDigits)}</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		</tr>

		<tr>
			<td>Total</td>
			<td>${np.round(res.DF_Total, NDigits)}</td>
			<td>${np.round(res.SS_Total, NDigits)}</td>
			<td>${np.round(res.MS_Total, NDigits)}</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		</tr>
		</table>
		`

		let divCopy = document.createElement("div-copydel");
		let outDiv = (document.querySelector("#maincontent") as HTMLDivElement).appendChild(divCopy);
		outDiv.innerHTML = AOVTable;
		outDiv.scrollIntoView();

		set(PAGEID, UserInputs).then(()=>console.log(""));
		set(WSKEY, ws.getDataCells()).then(()=>console.log(""));
	}
	catch(e)
	{
		let msgBox = document.createElement("div-transientpopwnd");
		//@ts-ignore
		msgBox.timeout = 3500;
		//@ts-ignore
		msgBox.innerHTML = e;
		document.body.appendChild(msgBox);

	}
});


/*
Source	df			SS		MS		F	P
Treatment	3		4194.333333	1398.111111	27.227091	0.000000
Error	20	1027.0	51.350000		
Total	23	5221.333333	227.014493		
					
Pairwise Diff	Difference (i-j)	Tukey Interval			
1-2			-0.83	-12.41, 10.75			
1-3			-16.17	-27.75, -4.59			
1-4			-32.33	-43.91, -20.75			
2-3			-15.33	-26.91, -3.75			
2-4	-		31.5		-43.08, -19.92			
3-4			-16.17	-27.75, -4.59			

*/