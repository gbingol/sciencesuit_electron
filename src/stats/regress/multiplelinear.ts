import { Worksheet, Range, Cell } from "../../lib/comp/grid.js";
import * as np from "../../lib/sci_math.js";
import * as util from "../../lib/util.js";
import { get, set } from "../../../node_modules/idb-keyval/dist/index.js";
import { stat } from "../../global.js";

const PAGEID = "REGRESS_MULTIPLELINEAR";
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
				if(input instanceof HTMLInputElement)
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
	let chkZeroIntercept = document.querySelector("#zerointercept") as HTMLInputElement;
	
	const inputs = document.querySelectorAll("#inputtable input");
	for(let input of inputs)
	{
		if(input instanceof HTMLInputElement)
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

		rng = new Range(txtfactors.value, ws);
		if (rng.ncols <2)
			throw new Error("Factors require at least 2 columns!");

		let Factors:number[][] = []
		for (let fct of rng.data)
		{
			let Factor = util.FilterNumbers(fct);
			Factors.push(Factor);
		}

		let HasIntercept = !chkZeroIntercept.checked;

		let res: stat.regression.linregress_result =
			window.api.stat.regression.multiple_linear(Response, Factors, HasIntercept, conflevel / 100);
		
		let Output = `
		<p><b>R<sup>2</sup>:</b> ${np.round(res.R2, NDigits)}</p>
		<p>&nbsp;</p>
		`;
		
		Output += `
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
			<td>Regression</td>
			<td>${res.DF_Regression}</td>
			<td>${np.round(res.SS_Regression, NDigits)}</td>
			<td>${np.round(res.MS_Regression, NDigits)}</td>
			<td>${np.round(res.Fvalue, NDigits)}</td>
			<td>${np.round(res.pvalue, NDigits)}</td>
		</tr>

		<tr>
			<td>Residual</td>
			<td>${res.DF_Residual}</td>
			<td>${np.round(res.SS_Residual, NDigits)}</td>
			<td>${np.round(res.MS_Residual, NDigits)}</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		</tr>

		<tr>
			<td>Total</td>
			<td>${res.DF_Regression + res.DF_Residual}</td>
			<td>${np.round(res.SS_Total, NDigits)}</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		</tr>
		
		</table>
		`;

		Output += "<p>&nbsp</p>";

		Output += `
		<table>
		<tr>
			<th>&nbsp;</th>
			<th>Coefficient</th>
			<th>Std Error</th>
			<th>T-value</th>
			<th>p-value</th>
			<th>CI</th>
		</tr>
		`;

		let CoeffStat = res.CoeffStats;

		let j = 0;
		for (let coeff of CoeffStat)
		{
			let Label = "";
			if (j == 0 && HasIntercept)
			{
				Label = "Intercept";
				HasIntercept = false;
			}
			else {
				j++;
				Label = `Variable #${j}`;
			}

			Output += `
			<tr>
				<td>${Label}</td>
				<td>${np.round(coeff.Coefficient, NDigits)}</td>
				<td>${np.round(coeff.SE, NDigits)}</td>
				<td>${np.round(coeff.tvalue, NDigits)}</td>
				<td>${np.round(coeff.pvalue, NDigits)}</td>
				<td>${np.round(coeff.CILow, NDigits)}, ${np.round(coeff.CIHigh, NDigits)}</td>
			</tr>
			`;
		}

		Output += "</table>";

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