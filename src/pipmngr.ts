
function InitTable(owner: DocumentFragment, headers: string[]): HTMLTableElement
{
	let table = owner.appendChild(document.createElement("table"));
	let header = table.appendChild(document.createElement("thead"));
	let row = header.appendChild(document.createElement("tr"));

	for (let header of headers)
	{
		let col = row.appendChild(document.createElement("td"));
		col.innerHTML=header;
	}

	return table;
}


function DisableButtons(disable=true)
{
	const AllBtns = document.body.getElementsByClassName("pip");
	for(let b of AllBtns) 
	{
		if(b instanceof HTMLButtonElement)
			b.disabled=disable;
	}
}



const btnOutdated:HTMLButtonElement = document.querySelector('#btnOutdated') as HTMLButtonElement;
btnOutdated.disabled = !window.navigator.onLine;


window.onload = (evt)=>
{
	(document.querySelector("#version") as HTMLSpanElement).innerHTML = 
	`<b>${localStorage.getItem("pyversion")}</b>`
}


type PIPListEntry =
{
	name:string,
	version:string,
	latest_version:string
}


btnOutdated.onclick = async function(evt)
{
	const divModules = document.querySelector('#modules') as HTMLDivElement;

	let i=0;
	let timer = setInterval(()=> divModules.innerHTML = "Working on it, elapsed time: " + i++, 1000);

	let divPip = document.querySelector("#pipoutput") as HTMLDivElement;
	divPip.innerText="";

	let json:Array<PIPListEntry>;
	try {
		DisableButtons();

		let cmd = "py -"+localStorage.getItem("pyversion") + " -m pip list -o --format=json "
		let output = await window.api.runcmd(cmd);
		json = JSON.parse(output as string);
	}
	catch(e) 
	{
		divModules.innerText = e as string;
		clearInterval(timer);
		return false;
	}
	
	let fragment = document.createDocumentFragment();

	let table = InitTable(fragment, ["Name", "Current", "Latest", ""]);

	let doc = document;
	for (let i = 0; i <json.length; i++) 
	{
		let e = json[i];

		let row = table.appendChild(doc.createElement("tr"));
		let col1 = row.appendChild(doc.createElement("td"));
		col1.innerHTML=e.name;
		let col2 = row.appendChild(doc.createElement("td"));
		col2.innerHTML=e.version;
		let col3 = row.appendChild(doc.createElement("td"));
		col3.innerHTML=e.latest_version;

		let col4 = row.appendChild(doc.createElement("td"));
		let btnUpgrade = col4.appendChild(doc.createElement("button"));
		btnUpgrade.id = "upgrade_"+e.name;
		btnUpgrade.innerHTML="Upgrade";
		btnUpgrade.className = "pip"
		
		clearInterval(timer);
		table.appendChild(row);

		
		btnUpgrade.onclick = async (evt)=>
		{
			try {
				DisableButtons();
				divPip.innerText="";

				let UpgradeCmd = "py -"+localStorage.getItem("pyversion") + 
					" -m pip install --upgrade " + e.name;
				let output = await window.api.runcmd(UpgradeCmd);
				divPip.scrollIntoView();
				divPip.innerText = <string>output;

				DisableButtons(false);
			}
			catch(error) {
				divPip.scrollIntoView();
				divPip.innerText=error as string;
			}
		}

		DisableButtons(false);
	}

	divModules.innerHTML="";
	divModules.appendChild(fragment)
}




const btnInstalled = document.querySelector('#btnInstalled') as HTMLButtonElement;
btnInstalled.onclick = async function(evt) 
{
	const divModules = document.querySelector('#modules') as HTMLDivElement;
	
	let i=0;
	let timer = setInterval(()=> divModules.innerHTML = "Working on it, elapsed time: " + i++, 1000);

	let divPip = document.querySelector("#pipoutput") as HTMLDivElement;
	divPip.innerText="";

	let json:Array<PIPListEntry>;
	try {
		DisableButtons();

		let cmd = "py -"+localStorage.getItem("pyversion") + " -m pip list --format=json "
		let output = await window.api.runcmd(cmd);
		json = JSON.parse(output as string);
	}
	catch(e) {
		divModules.innerText = e as string;
		clearInterval(timer);
		return false;
	}
	
	let fragment = document.createDocumentFragment();

	let table = InitTable(fragment, ["Name", "Version", ""]);

	for (let i = 0; i <json.length; i++) 
	{
		let e = json[i];

		let row = table.appendChild(document.createElement("tr"));
		let col1 = row.appendChild(document.createElement("td"));
		col1.innerHTML=e.name ;
		let col2 = row.appendChild(document.createElement("td"));
		col2.innerHTML=e.version;
		let col3 = row.appendChild(document.createElement("td"));
		let btnInfo = col3.appendChild(document.createElement("button"));
		btnInfo.id = "info_"+e.name;
		btnInfo.innerHTML="Info";
		btnInfo.className="pip";

		let btnRemove = col3.appendChild(document.createElement("button"));
		btnRemove.id = "remove_"+e.name;
		btnRemove.innerHTML="Uninstall";
		btnRemove.className="pip";
		
		table.appendChild(row);

		btnInfo.disabled = !window.navigator.onLine;
		btnInfo.onclick = async (evt)=> {
			try {
				DisableButtons();
				divPip.innerText="";

				let ShowCmd = "py -"+localStorage.getItem("pyversion") + 
					" -m pip show " + e.name;
				let output = await window.api.runcmd(ShowCmd);
				divPip.scrollIntoView();
				divPip.innerText = output as string;

				DisableButtons(false);
			}
			catch(error) {
				divPip.scrollIntoView();
				divPip.innerText=error as string;
			}
		}

		btnRemove.onclick = async (evt)=>{
			try {
				divPip.innerText = "";
					
				DisableButtons();

				let remCmd = "py -"+ localStorage.getItem("pyversion") + 
					" -m pip uninstall -y " + e.name;

				let output = await window.api.runcmd(remCmd);
				divPip.scrollIntoView();
				divPip.innerText = output as string;

				DisableButtons(false);
			}		
			catch(error) {
				divPip.scrollIntoView();
				divPip.innerText=error as string;

				DisableButtons(false);
			}
		}

		DisableButtons(false);
	}

	divModules.innerHTML="";
	clearInterval(timer);
	divModules.appendChild(fragment)
}