import {Worksheet, Range, Cell} from "../../lib/comp/grid.js";
import * as np from "../../lib/sci_math.js";
import * as util from "../../lib/util.js";
import { get, set } from "../../../node_modules/idb-keyval/dist/index.js";
import { stat } from "../../global.js";

const PAGEID = "AOV_TWOFACTOR";
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

let IsStacked = false;


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
	let txtfactor1 = document.querySelector("#factor1") as HTMLInputElement;
	let txtfactor2 = document.querySelector("#factor2") as HTMLInputElement;
	
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
		let NDigits = parseInt((document.querySelector("#txtDigits")  as HTMLInputElement).value);

		let rng = new Range(txtresponse.value, ws);
		if (rng.ncols != 1)
			throw new Error(" Exactly 1 column expected for responses");

		let Response = util.FilterNumbers(rng.data[0]);

		rng = new Range(txtfactor1.value, ws);
		if (rng.ncols != 1)
		throw new Error(" Exactly 1 column expected for factor1");

		let Factor1 = util.ToStringArray(rng.data[0]);

		rng = new Range(txtfactor2.value, ws);
		if (rng.ncols != 1)
			throw new Error(" Exactly 1 column expected for factor2");

		let Factor2 = util.ToStringArray(rng.data[0]);

		let res: stat.test_aov2_result = window.api.stat.test_aov2(Response, Factor1, Factor2);

		let DFTotal = res.DFError + res.DFFact1 + res.DFFact2 + res.DFinteract;
		let SSTotal = res.SSError + res.SSFact1 + res.SSFact2 + res.SSinteract;

		let Output = `
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
			<td>Factor #1</td>
			<td>${np.round(res.DFFact1, NDigits)}</td>
			<td>${np.round(res.SSFact1, NDigits)}</td>
			<td>${np.round(res.MSFact1, NDigits)}</td>
			<td>${np.round(res.FvalFact1, NDigits)}</td>
			<td>${np.round(res.pvalFact1, NDigits)}</td>
		</tr>

		<tr>
			<td>Factor #2</td>
			<td>${np.round(res.DFFact2, NDigits)}</td>
			<td>${np.round(res.SSFact2, NDigits)}</td>
			<td>${np.round(res.MSFact2, NDigits)}</td>
			<td>${np.round(res.FvalFact2, NDigits)}</td>
			<td>${np.round(res.pvalFact2, NDigits)}</td>
		</tr>

		<tr>
			<td>Interaction</td>
			<td>${np.round(res.DFinteract, NDigits)}</td>
			<td>${np.round(res.SSinteract, NDigits)}</td>
			<td>${np.round(res.MSinteract, NDigits)}</td>
			<td>${np.round(res.Fvalinteract, NDigits)}</td>
			<td>${np.round(res.pvalinteract, NDigits)}</td>
		</tr>

		<tr>
			<td colspan = 6>&nbsp;</td>
		</tr>

		<tr>
			<td>Error</td>
			<td>${np.round(res.DFError, NDigits)}</td>
			<td>${np.round(res.SSError, NDigits)}</td>
			<td>${np.round(res.MSError, NDigits)}</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		</tr>

		<tr>
			<td>Total</td>
			<td>${np.round(DFTotal  , NDigits)}</td>
			<td>${np.round(SSTotal, NDigits)}</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		</tr>

		<tr>
			<td colspan = 6>&nbsp;</td>
		</tr>

		</table>
		`

		

		let divCopy = document.createElement("div-copydel");
		let outDiv = (document.querySelector("#maincontent") as HTMLDivElement).appendChild(divCopy);
		outDiv.innerHTML = Output;
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