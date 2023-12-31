import {round, linearinterp} from '../lib/sci_math.js';
import { addInputListener, checkInputs } from './psyutil.js';
import { Water, findIndexes } from '../lib/eng/refrigerants.js';

const btn = document.getElementById('compute') as HTMLButtonElement;
const txtP =  document.getElementById('txtP') as HTMLInputElement;

const txtT1 =  document.getElementById('txtT1') as HTMLInputElement;
const txtRH1 =  document.getElementById('txtRH1') as HTMLInputElement;
const txtV1 =  document.getElementById('txtV1') as HTMLInputElement;

const txtT3 =  document.getElementById('txtT3') as HTMLInputElement;

addInputListener(txtP, "P", "P");
addInputListener(txtT1, "T1", "T<sub>1</sub>");
addInputListener(txtRH1, "RH1", "RH<sub>1</sub>");
addInputListener(txtV1, "V1", "V<sub>1</sub>");

txtT3.addEventListener("input", (evt:Event)=> 
{
	let v = (evt.target as HTMLInputElement).value;
	let elems = document.getElementsByClassName("T3");
	for(let i=0; i<elems.length; ++i)
		elems[i].innerHTML = v === ""? "T<sub>3</sub>" : v; 
});

const txtDigits =  document.getElementById('txtDigits') as HTMLInputElement;


function compute(P:number, T1:number, RH1:number, V1:number, T3:number)
{
	let st1 = window.api.psychrometry({"tdb":T1, "rh":RH1, "p":P});	
	let v1 = st1.V() ,  h1 = st1.H(), w1 = st1.W();

	let ma = V1/v1; // (m3/s) / (m3/kg da) = kg da /s

	let st3 = window.api.psychrometry({"tdb":T3, "rh":100, "p":P});
	let h3 = st3.H(), w3 = st3.W();

	if (w1<=w3)
	{
		let s = "Inlet's absolute humidity computed to be <i>smaller</i> than outlet's. <br><br>";
		s += "<b>Note:</b> Outlet's RH=100%.<br>";
		s += "<b>Recommendation:</b> Choose an outlet temperature at least 5-10&deg;C smaller than inlet's.";

		throw new Error(s);
	}

	let mw = ma* (w1-w3)

	let T2 = T3

	let water = new Water();
	let indexes = findIndexes(water.T(), T2+273.15);
	let T = [water.T()[indexes[0]], water.T()[indexes[1]]];
	let H = [water.hf()[indexes[0]], water.hf()[indexes[1]]];
	let hwater = linearinterp(T[0], H[0], T[1], H[1], T2+273.15);

	let Q = ma*(h1-h3) - mw*hwater

	return [Q, mw];
}

btn.addEventListener("click", (evt) => 
{
	let infoDiv = document.querySelector("#info") as HTMLDivElement;
	if(!checkInputs())
		return true;

	let P = parseFloat(txtP.value)*1000; //Pa
	let T1 = parseFloat(txtT1.value);
	let RH1 = parseFloat(txtRH1.value);
	let V1 = parseFloat(txtV1.value);
	let T3 = parseFloat(txtT3.value);

	let digits = parseInt(txtDigits.value);

	try
	{
		if (T3>=T1)
			throw new Error("Outlet temperature must be smaller than inlet's.");
		
		const [Q, mw] = compute(P, T1, RH1, V1, T3)

		let s = "<i>Input values</i> <br>";
		s += "<b>Pressure</b> = " + txtP.value + " kPa <br>";
		s += "<b>T<sub>1</sub></b> = " + txtT1.value + " &deg;C <br>";
		s += "<b>RH<sub>1</sub></b> = " + txtRH1.value + " % <br>";
		s += "<b>V<sub>1</sub></b> = " + txtV1.value + " m<sup>3</sup> / time <br>";
		s += "<b>T<sub>3</sub></b> = " + txtT3.value + " &deg;C <br>";

		s += "<br><i>Output values</i> <br>";

		s += "<b>Heat Removal = </b>" + round(Q, digits) + " kJ / time <br>";
		s += "<b>Moisture Removal = </b>" + round(mw, digits) + " kg / time <br>";

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