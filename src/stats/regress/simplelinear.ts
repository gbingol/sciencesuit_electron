import {Worksheet, Range, Cell} from "../../lib/comp/grid.js";
import * as np from "../../lib/sci_math.js";
import * as util from "../../lib/util.js";
import { get, set } from "../../../node_modules/idb-keyval/dist/index.js";
import { aov_oneway, tukey } from "../../lib/aov.js";

const PAGEID = "REGRESS_SIMPLELINEAR";
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
	let txtfactor = document.querySelector("#factor") as HTMLInputElement;
	let txtconflevel = document.querySelector("#conflevel") as HTMLInputElement;
	
	const inputs = document.querySelectorAll("#inputtable input");
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
		let NDigits = parseInt((document.querySelector("#txtDigits")  as HTMLInputElement).value);

		if(conflevel<0 || conflevel>100)
			throw new Error("Confidence level must be [0, 100]");

		let rng = new Range(txtresponse.value, ws);
		if (rng.ncols !=1)
			throw new Error(`Responses contains ${rng.ncols} columns. Exactly 1 expected!`);

		let Response = util.FilterNumbers(rng.data[0]);

		rng = new Range(txtfactor.value, ws);
		if (rng.ncols !=1)
			throw new Error(`Factor contains ${rng.ncols} columns. Exactly 1 expected!`);

		let Factor = util.FilterNumbers(rng.data[0]);

		//let res = aov_oneway(responses);
		
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