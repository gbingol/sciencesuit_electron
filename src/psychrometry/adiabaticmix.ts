import { round } from "../lib/sci_math.js";
import { addInputListener, checkInputs } from "./psyutil.js";

const btn = document.getElementById('compute') as HTMLButtonElement;
const txtP =  document.getElementById('txtP') as HTMLInputElement;

const txtT1 =  document.getElementById('txtT1') as HTMLInputElement;
const txtRH1 =  document.getElementById('txtRH1') as HTMLInputElement;
const txtV1 =  document.getElementById('txtV1') as HTMLInputElement;

const txtT2 =  document.getElementById('txtT2') as HTMLInputElement;
const txtRH2 =  document.getElementById('txtRH2') as HTMLInputElement;
const txtV2 =  document.getElementById('txtV2') as HTMLInputElement;

addInputListener(txtP, "P", "P");
addInputListener(txtT1, "T1", "T<sub>1</sub>");
addInputListener(txtRH1, "RH1", "RH<sub>1</sub>");
addInputListener(txtV1, "V1", "V<sub>1</sub>");
addInputListener(txtT2, "T2", "T<sub>2</sub>");
addInputListener(txtRH2, "RH2", "RH<sub>2</sub>");
addInputListener(txtV2, "V2", "V<sub>2</sub>");

const txtDigits =  document.getElementById('txtDigits') as HTMLInputElement;


function compute(P:number, T1:number, RH1:number, V1:number, T2:number, RH2:number, V2:number)
{
	let st1 = window.api.psychrometry({"tdb":T1, "rh":RH1, "p":P});
	
	let v1 = st1.V()
	let h1 = st1.H()
	let w1 = st1.W()

	let st2 = window.api.psychrometry({"tdb":T2, "rh":RH2, "p":P});
	let v2 = st2.V()
	let h2 = st2.H()
	let w2 = st2.W()

	//(m3/time) / (m3/kg da) = kg da /time
	let ma1 = V1/v1
	let ma2 = V2/v2
	let ma3 = ma1 + ma2

	let w3 = (w2*ma2 + w1*ma1)/(ma1 + ma2)
	let h3 = (h2*ma2 + h1*ma1)/(ma1 + ma2)

	let st3 = window.api.psychrometry({"w":w3, "h": h3, "p": P});
	let V3 = st3.V()*ma3

	return {"w":w3, "h":h3, "v":V3, "st":st3}
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
	let T2 = parseFloat(txtT2.value);
	let RH2 = parseFloat(txtRH2.value);
	let V2 = parseFloat(txtV2.value);

	let digits = parseInt(txtDigits.value);

	

	try
	{
		let obj = compute(P, T1, RH1, V1, T2, RH2, V2);
		let w3 = obj.w, h3 = obj.h, V3=obj.v, st3=obj.st;

		let s = "<b>w=</b>" + round(w3, digits) + "kg / kg da <br>";
		s += "<b>RH=</b>" + round(st3.RH(), digits) + "% <br>";
		s += "<b>T<sub>db</sub>=</b>" + round(st3.Tdb(), digits) + "&deg;C <br>";
		s += "<b>h=</b>" + round(h3, digits) + "kJ / kg da <br>";
		s += "<b>Flow Rate=</b>" + round(V3, digits) + "m<sup>3</sup> / time";

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