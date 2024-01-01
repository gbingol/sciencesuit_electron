import {Worksheet, Range, Cell} from "../../lib/comp/grid.js";
import * as np from "../../lib/sci_math.js";
import * as util from "../../lib/util.js";
import { get, set } from "../../../node_modules/idb-keyval/dist/index.js";
import { aov_oneway, tukey } from "../../lib/aov.js";

const PAGEID = "AOV_ONEWAY";
const WSKEY = PAGEID + "_WS";


function parseFactors(factors: string[], responses: number[])
{
	/*
	Input: 
	Reponse = [1,2,3,4]
	Factors = ["A", "B", "A", "B"]

	Output: 2D array (without header)
	A	B
	1	2
	3	4
	*/
	let unique = [... new Set(factors)];
	let retArr: number[][] = [];

	unique.forEach(e => retArr.push([]));

	for (let i = 0; i < factors.length; ++i)
	{
		for (let j = 0; j < unique.length; j++)
		{
			if (factors[i] === unique[j])
				retArr[j].push(responses[i]);
		}	
	}

	return retArr;
}


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
	
	let chkStacked = document.querySelector("#stacked") as HTMLInputElement;
	let txtfactors = document.querySelector("#factors") as HTMLInputElement;
	IsStacked = chkStacked.checked;

	chkStacked.addEventListener("change", (evt:Event) => {
		IsStacked = chkStacked.checked;
		txtfactors.disabled = !chkStacked.checked;
	});

}



let btnCompute = document.querySelector("#compute") as HTMLButtonElement;
btnCompute.onclick = ((evt)=>
{
	let txtresponse = document.querySelector("#response") as HTMLInputElement;
	let txtfactors = document.querySelector("#factors") as HTMLInputElement;
	let txtconflevel = document.querySelector("#conflevel") as HTMLInputElement;
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
		
		let IsTukey = chkTukey.checked;
		let NDigits = parseInt((document.querySelector("#txtDigits")  as HTMLInputElement).value);

		if(conflevel<0 || conflevel>100)
			throw new Error("Confidence level must be [0, 100]");

		let rng = new Range(txtresponse.value, ws);
		if (IsStacked == false && rng.ncols <3)
			throw new Error(`Range contains ${rng.ncols} columns. At least 3 expected!`);
		
		let responses: number[][] = [];

		if (!IsStacked) {
			for (let d of rng.data)
				responses.push(util.FilterNumbers(d));
		}
		else
		{
			let rngFactors = new Range(txtfactors.value, ws);
			let factors = util.ToStringArray(rngFactors.data[0]);
			let Response = util.FilterNumbers(rng.data[0]);
			responses = parseFactors(factors, Response);
		}


		let res = aov_oneway(responses);
		
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
			<td>Treatment</td>
			<td>${np.round(res.DF_Treat, NDigits)}</td>
			<td>${np.round(res.SS_Treat, NDigits)}</td>
			<td>${np.round(res.MS_Treat, NDigits)}</td>
			<td>${np.round(res.Fvalue, NDigits)}</td>
			<td>${np.round(res.pvalue, NDigits)}</td>
		</tr>
		<tr>
			<td>Error</td>
			<td>${np.round(res.DF_Err, NDigits)}</td>
			<td>${np.round(res.SS_Err, NDigits)}</td>
			<td>${np.round(res.MS_Err, NDigits)}</td>
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

		if (IsTukey)
		{
			let TukeyTable = `
			<table>
			<tr>
				<th>Pairs</th>
				<th>Difference (i-j)</th>
				<th>Tukey Interval</th>
			</tr>
			`;
			let result = tukey(1 - conflevel / 100, res);
			for (let r of result)
			{
				if (r.CILow * r.CIHigh < 0)
					TukeyTable += "<tr style='background-color: grey;'>";
				else
					TukeyTable += "<tr>";

				TukeyTable += `
					<td>${r.a + 1} - ${r.b + 1} </td>
					<td>${np.round(r.MeanValueDiff, NDigits)}</td>
					<td>${np.round(r.CILow, NDigits)} , ${np.round(r.CIHigh, NDigits)}</td>
				</tr>
				`
			}
			TukeyTable += "</table>"

			Output += "<p>&nbsp;</p>";
			Output += TukeyTable;
		}

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