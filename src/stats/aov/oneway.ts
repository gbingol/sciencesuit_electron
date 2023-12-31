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


		let results = aov_oneway(responses);
		console.log(results);
		return;
		
		let s = "<table>";
		
		
		
		s += "</table>";

		let divCopy = document.createElement("div-copydel");
		let outDiv = (document.querySelector("#maincontent") as HTMLDivElement).appendChild(divCopy);
		outDiv.innerHTML = s;
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