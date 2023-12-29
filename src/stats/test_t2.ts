import {Worksheet, Range, Cell} from "../lib/comp/grid.js";
import * as np from "../lib/sci_math.js";
import * as util from "../lib/util.js";
import {get, set} from "../../node_modules/idb-keyval/dist/index.js";

const PAGEID = "TESTT2";
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
	let txtxdata = document.querySelector("#xdata") as HTMLInputElement;
	let txtydata = document.querySelector("#ydata") as HTMLInputElement;
	let txtmu = document.querySelector("#mu") as HTMLInputElement;
	let chkVarEqual = document.querySelector("#varequal") as HTMLInputElement;
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
		let mu = parseFloat(txtmu.value);
		let conflevel = parseFloat(txtconflevel.value);
		let alternative = selalternative.value;
		let varequal = chkVarEqual.checked;
		let NDigits = parseInt((document.querySelector("#txtDigits")  as HTMLInputElement).value);

		if(conflevel<0 || conflevel>100)
			throw new Error("Confidence level must be [0, 100]");

		let rng = new Range(txtxdata.value, ws);
		if (rng.ncols != 1)
			throw new Error(`Range contains ${rng.ncols} columns. 1 expected!`);
		let xdata = util.FilterNumbers(rng.data[0]);

		rng = new Range(txtydata.value, ws);
		if (rng.ncols != 1)
			throw new Error(`Range contains ${rng.ncols} columns. 1 expected!`);
		let ydata = util.FilterNumbers(rng.data[0]);

		let results = window.api.test_t2(xdata, ydata, mu, varequal, alternative, conflevel/100);
		
		let s = "<table>";
		
		s += "<tr>"
		s += "<td>Observation</td>";
		s += "<td>" + results.n1 + "</td>";
		s += "<td>" + results.n2 + "</td>";
		s += "</tr>";

		s += "<tr>";
		s += "<td>Mean</td>";
		s += "<td>" + np.round(results.xaver, NDigits) + "</td>";
		s += "<td>" + np.round(results.yaver, NDigits) + "</td>";
		s += "</tr>";

		s += "<tr>";
		s += "<td>Std Deviation</td>";
		s += "<td>" + np.round(results.s1, NDigits) + "</td>";
		s += "<td>" + np.round(results.s2, NDigits) + "</td>";
		s += "</tr>";

		if (varequal)
		{
			s += "<tr>"
			s += "<td>Pooled variance</td>";
			s += "<td colspan=2>" + np.round(results.sp as number, NDigits) + "</td>";
			s += "</tr>";
		}

		s += "<tr><td colspan=3>&nbsp;</td></tr>";

		s += "<tr>"
		s += "<td>t<sub>critical</sub></td>";
		s += "<td colspan=2>" + np.round(results.tcritical, NDigits) + "</td>";
		s += "</tr>";

		s += "<tr>"
		s += "<td>p-value</td>";
		s += "<td colspan=2>" +  np.round(results.pvalue, NDigits) + "</td>";
		s += "</tr>";

		
		s += "<tr><td colspan=3>" + txtconflevel.value + "% Confidence Interval (" +
			np.round(results.CI_lower, NDigits) + ", " + np.round(results.CI_upper, NDigits) + ")</td></tr>";
		
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