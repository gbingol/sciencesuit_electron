import { round } from '../lib/sci_math.js';
import { addInputListener, checkInputs } from './psyutil.js';

const btn = document.getElementById('compute') as HTMLButtonElement;

const txtP =  document.getElementById('txtP') as HTMLInputElement;
const txtT1 =  document.getElementById('txtT1') as HTMLInputElement;
const txtRH1 =  document.getElementById('txtRH1') as HTMLInputElement;
const txtRH2 =  document.getElementById('txtRH2') as HTMLInputElement;

addInputListener(txtP, "P", "P");
addInputListener(txtT1, "T1", "T<sub>1</sub>");
addInputListener(txtRH1, "RH1", "RH<sub>1</sub>");
addInputListener(txtRH2, "RH2", "RH<sub>2</sub>");


const txtDigits =  document.getElementById('txtDigits') as HTMLInputElement;


function compute(P:number, T1:number, RH1:number, RH2:number)
{
	let st1 = window.api.psychrometry({"tdb":T1, "rh":RH1, "p":P})
	let h1 = st1.H()

	let st2 = window.api.psychrometry({"h":h1, "rh":RH2, "p":P});

	return [st2.Tdb(), st2.Twb()]
}

btn.addEventListener("click", (evt) => 
{
	let infoDiv = document.querySelector("#info") as HTMLDivElement;
	if(!checkInputs())
		return true;

	let P = parseFloat(txtP.value)*1000; //Pa
	let T1 = parseFloat(txtT1.value);
	let RH1 = parseFloat(txtRH1.value);
	let RH2 = parseFloat(txtRH2.value);

	let digits = parseInt(txtDigits.value);

	try
	{
		if(RH1>=RH2)
		{
			let s = "Inlet's relative humidity must be smaller than outlet's <br>";
			s += "Click on <b>hint</b> and check the presented figure.";
			throw new Error(s);
		}

		const [Tdb, Twb] = compute(P, T1, RH1, RH2)

		let s = "<i>Input values</i> <br>";
		s += "<b>Pressure</b> = " + txtP.value + " kPa <br>";
		s += "<b>T<sub>1</sub></b> = " + txtT1.value + " &deg;C <br>";
		s += "<b>RH<sub>1</sub></b> = " + txtRH1.value + " % <br>";
		s += "<b>RH<sub>2</sub></b> = " + txtRH2.value + " % <br>";

		s += "<br><i>Output values</i> <br>";

		s += "<b>T = </b>" + round(Tdb, digits) + " &deg;C <br>";
		s += "<b>T<sub>min</sub> = </b>" + round(Twb, digits) + " &deg;C";

		let outDiv = (document.querySelector("#maincontent") as HTMLDivElement).
			appendChild(document.createElement("div-copydel"));
		outDiv.innerHTML = s;
		outDiv.scrollIntoView();

		infoDiv.style.display = "none";
	}
	catch(e)
	{
		infoDiv.style.display = "inline";
		infoDiv.innerHTML = <string>e;
	}
});