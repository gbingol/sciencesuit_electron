import {Worksheet, Range, Cell} from "../../lib/comp/grid.js";
import * as np from "../../lib/sci_math.js";
import * as util from "../../lib/util.js";
import {get, set} from "../../../node_modules/idb-keyval/dist/index.js";

const PAGEID = "TESTZ";
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
	let txtxdata = document.querySelector("#x") as HTMLInputElement;
	let txtsd = document.querySelector("#sd") as HTMLInputElement;
	let txtmu = document.querySelector("#mu") as HTMLInputElement;
	let txtconflevel = document.querySelector("#conflevel") as HTMLInputElement;
	let selalternative = document.querySelector("#alternative") as HTMLSelectElement;
	
	const inputs = document.querySelectorAll("#inputtable input, select");
	for(let input of inputs)
	{
		if(input instanceof HTMLInputElement || input instanceof HTMLSelectElement)
		{
			if(input.value ==="")
				throw new Error("All entries must have valid values");

			UserInputs.set(input.id, input.value);
		}
	}

	try
	{
		let stdev = parseFloat(txtsd.value);
		let mu = parseFloat(txtmu.value);
		let conflevel = parseFloat(txtconflevel.value);
		let alternative = selalternative.value;
		let NDigits = parseInt((document.querySelector("#txtDigits")  as HTMLInputElement).value);

		if(conflevel<0 || conflevel>100)
			throw new Error("Confidence level must be [0, 100]");

		if (stdev <= 0)
			throw new Error("standard deviation >0 expected");

		let rng = new Range(txtxdata.value, ws);
		if (rng.ncols != 1)
			throw new Error(`Range contains ${rng.ncols} columns. 1 expected!`);
		let xdata = util.FilterNumbers(rng.data[0]);

		let results = window.api.stat.test_z(xdata, stdev, mu, alternative, conflevel/100);
		
		let s = `
			<table>
			<tr>
			<th>N</th>
			<th>Average</th>
			<th>stdev</th>
			<th>SE Mean</th>
			<th>z</th>
			<th>p-value</th>
			</tr>`

		s += "<tr>";
		s += "<td>"+results.N+ "</td>";
		s += "<td>"+ np.round(results.mean, NDigits) + "</td>";
		s += "<td>"+ np.round(results.stdev, NDigits) + "</td>";
		s += "<td>"+ np.round(results.SE, NDigits) + "</td>";
		s += "<td>"+ np.round(results.zcritical, NDigits) + "</td>";
		s += "<td>" + np.round(results.pvalue, NDigits) + "</td>";
		s += "</tr>";

		s += "<tr>";
		s += "<td colspan=6>" + txtconflevel.value + "% Confidence Interval (" +
			np.round(results.CI_lower, NDigits) + ", " + np.round(results.CI_upper, NDigits) + ")</td>";
		s += "</tr></table>";

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