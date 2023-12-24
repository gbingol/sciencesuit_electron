import { round } from '../lib/sci_math.js';
import { addInputListener, checkInputs } from './psyutil.js';

const btn = document.getElementById('compute') as HTMLButtonElement;
const txtP =  document.getElementById('txtP') as HTMLInputElement;

const txtT1 =  document.getElementById('txtT1') as HTMLInputElement;
const txtRH1 =  document.getElementById('txtRH1') as HTMLInputElement;
const txtV1 =  document.getElementById('txtV1') as HTMLInputElement;

const txtT2 =  document.getElementById('txtT2') as HTMLInputElement;
const txtT3 =  document.getElementById('txtT3') as HTMLInputElement;
const txtRH3 =  document.getElementById('txtRH3') as HTMLInputElement;

addInputListener(txtP, "P", "P");
addInputListener(txtT1, "T1", "T<sub>1</sub>");
addInputListener(txtRH1, "RH1", "RH<sub>1</sub>");
addInputListener(txtV1, "V1", "V<sub>1</sub>");
addInputListener(txtT2, "T2", "T<sub>2</sub>");
addInputListener(txtRH3, "RH3", "RH<sub>3</sub>");
addInputListener(txtT3, "T3", "T<sub>3</sub>");

const txtDigits =  document.getElementById('txtDigits') as HTMLInputElement;



function compute(P:number, T1:number, RH1:number, V1:number, T2:number, T3:number, RH3:number)
{
	let st1 = window.api.psychrometry({"tdb":T1, "rh":RH1, "p":P});
	
	let v1 = st1.V()
	let h1 = st1.H()
	let w1 = st1.W()

	//(m3/time) / (m3/kg da) = kg da /time
	let ma = V1/v1

	//simple heating
	let w2 = w1;

	let st2 = window.api.psychrometry({"tdb":T2, "w":w2, "p":P});
	let h2 = st2.H()

	let st3 = window.api.psychrometry({"tdb":T3, "rh":RH3, "p":P});
	let w3 = st3.W()

	let Q = ma*(h2-h1)
	let mw = ma*(w3-w1)

	return [Q, mw]
}

btn.addEventListener("click", (evt:Event) => 
{
	let infoDiv = document.querySelector("#info") as HTMLDivElement;
	if(!checkInputs())
		return true;

	let P = parseFloat(txtP.value)*1000; //Pa
	let T1 = parseFloat(txtT1.value);
	let RH1 = parseFloat(txtRH1.value);
	let V1 = parseFloat(txtV1.value);
	let T2 = parseFloat(txtT2.value);
	let RH3= parseFloat(txtRH3.value);
	let T3 = parseFloat(txtT3.value);

	let digits = parseInt(txtDigits.value);

	try
	{
		if(T1>=T2)
			throw new Error("T<sub>1</sub> &lt; T<sub>2</sub> expected.");

		if(RH1>=RH3)
			throw new Error("RH<sub>1</sub> &lt; RH<sub>3</sub> expected.");

		const [Q, mw] = compute(P, T1, RH1, V1, T2, T3, RH3);

		let s = "<i>Input values</i> <br>";
		s += "<b>Pressure</b> = " + txtP.value + " kPa <br>";
		s += "<b>T<sub>1</sub></b> = " + txtT1.value + " &deg;C <br>";
		s += "<b>RH<sub>1</sub></b> = " + txtRH1.value + " % <br>";
		s += "<b>V<sub>1</sub></b> = " + txtV1.value + " m<sup>3</sup> / time <br>";
		s += "<b>T<sub>2</sub></b> = " + txtT2.value + " &deg;C <br>";
		s += "<b>T<sub>3</sub></b> = " + txtT3.value + " &deg;C <br>";
		s += "<b>RH<sub>3</sub></b> = " + txtRH3.value + " % <br>";

		s += "<br><i>Output values</i> <br>";

		s += "<b>Heat supply = </b>" + round(Q, digits) + " kJ / time <br>";
		s += "<b>Flow ratel = </b>" + round(mw, digits) + " kg / time <br>";
		
		let outDiv = document.body.appendChild(document.createElement("div-copydel"));
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