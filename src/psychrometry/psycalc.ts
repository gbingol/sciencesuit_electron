document.body.onload = function(evt)
{
	/*
	Most likely defers are not necessary
	*/
	
	const script = document.head.appendChild(document.createElement("script"));
	script.src = "../lib/comp/div_copydel.js";
	script.defer;

	const script2 = document.head.appendChild(document.createElement("script"));
	script2.src = "../lib/comp/div_transientpopwnd.js";
	script2.defer;
}


const btn = document.getElementById('compute') as HTMLButtonElement;
const chkP =  document.getElementById('chkP') as HTMLInputElement;
const chkTdb =  document.getElementById('chkTdb') as HTMLInputElement;
const chkTwb =  document.getElementById('chkTwb') as HTMLInputElement;
const chkTdp =  document.getElementById('chkTdp') as HTMLInputElement;
const chkW =  document.getElementById('chkW') as HTMLInputElement;
const chkRH =  document.getElementById('chkRH') as HTMLInputElement;
const chkH =  document.getElementById('chkH') as HTMLInputElement;
const chkV =  document.getElementById('chkV') as HTMLInputElement;

const txtP =  document.getElementById('txtP') as HTMLInputElement;
const txtTdb =  document.getElementById('txtTdb') as HTMLInputElement;
const txtTwb =  document.getElementById('txtTwb') as HTMLInputElement;
const txtTdp =  document.getElementById('txtTdp') as HTMLInputElement;
const txtW =  document.getElementById('txtW') as HTMLInputElement;
const txtRH =  document.getElementById('txtRH') as HTMLInputElement;
const txtH =  document.getElementById('txtH') as HTMLInputElement;
const txtV =  document.getElementById('txtV') as HTMLInputElement;

const txtDigits =  document.getElementById('txtDigits') as HTMLInputElement;

const elems = [
	["p", chkP, txtP],
	["tdb", chkTdb, txtTdb], ["twb", chkTwb, txtTwb], ["tdp", chkTdp, txtTdp],
	["w", chkW, txtW], ["rh", chkRH, txtRH],
	["h", chkH, txtH],
	["v", chkV, txtV]
]

let NChecked = 0;

let table = document.getElementById("inputtable") as HTMLTableElement;
table.addEventListener("click", (evt:Event)=>
{
	let elem = evt.target as HTMLInputElement;
	if(elem.type === "checkbox")
	{
		elem.checked ? NChecked++ : NChecked--;

		let infoDiv = document.querySelector("#info") as HTMLDivElement;
		infoDiv.style.display = NChecked != 3 ? "inline" : "none";
		infoDiv.innerHTML = `<b>${3-NChecked}</b> selections must be made`;
		btn.disabled = (NChecked!=3)

		let txt = elems.find((entry) => entry[1] == elem)?.[2] as HTMLInputElement;
		txt.required = elem.checked

		for(let i=0; i<elems.length; ++i)
		{
			let chk = elems[i][1] as HTMLInputElement;
			let txt = elems[i][2] as HTMLInputElement;

			let condition = (NChecked==3) && !chk.checked;
			txt.disabled = condition;
			chk.disabled = condition;
		}
	}
	
});


btn.addEventListener("click", (evt) => 
{
	let infoDiv = document.querySelector("#info") as HTMLDivElement;

	let Keys=[], Vals=[];
	for(let i=0; i<elems.length; ++i)
	{
		let lbl = elems[i][0] as string;
		let chk = elems[i][1] as HTMLInputElement;
		let txt = elems[i][2] as HTMLInputElement;

		if(txt.required && txt.value === "")
		{
			infoDiv.style.display = "inline";
			infoDiv.innerHTML = "Value is missing.";
			txt.focus();
			return true;
		}
			
		if(chk.checked) 
		{
			let val = parseFloat(txt.value);

			if(isNaN(val))
			{
				infoDiv.style.display = "inline";
				infoDiv.innerHTML = "<b>" + txt.value + "</b> is not a number"
				txt.focus();
				return true;
			}

			Keys.push(lbl);
			Vals.push(lbl === "p" ? val*1000: val);
		}
	}

	let digits = parseInt(txtDigits.value);
	if(digits<1 || digits>6)
	{
		infoDiv.style.display = "inline";
		infoDiv.innerHTML = "Digits must be in [1, 6]";
		return true;
	}

	
	try
	{
		let p = window.api.psychrometry(Keys, Vals);

		let outDiv = (document.querySelector("#maincontent") as HTMLDivElement).
			appendChild(document.createElement("div-copydel"));
		
		outDiv.innerHTML = p.to_html(digits);
		outDiv.scrollIntoView();

		infoDiv.style.display = "none";
	}
	catch(e)
	{
		infoDiv.style.display = "inline";
		infoDiv.innerHTML = e as string;
	}
});


const chartBtn = <HTMLButtonElement>document.getElementById('chartbtn');
let options = {pythonPath: localStorage.getItem("pypath")};
chartBtn.onclick = async function(evt)
{
	let cmd = 
`
import scisuit.plot as plt
plt.psychrometry()
plt.show()
`			
	try{
		let output = await window.api.runpython(cmd, options, true);
		return false;
	}
	catch(e)
	{
		let msgBox = document.createElement("div-transientpopwnd");
		// @ts-ignore
		msgBox.timeout = 3500;
		// @ts-ignore
		msgBox.innerHTML = e;
		document.body.appendChild(msgBox);
	}
		
}