function sidePanel()
{
	let Panel = document.body.appendChild(document.createElement("div"));
	Panel.id = "_sidepanel";

	Panel.addEventListener("mouseleave", (evt)=>{
		let toggleBtn = document.querySelector("#_togglesidepanel") as HTMLDivElement;
		toggleBtn.style.display = "block";
		Panel.style.display = "none";
	});

	return Panel;
}

function ToggleSidePanel()
{
	let btn = document.body.appendChild(document.createElement("div"));
	btn.innerHTML = "☰";
	btn.id = "_togglesidepanel";

	btn.addEventListener("mouseenter", (event)=>
	{
		let sidepanel = document.querySelector("#_sidepanel") as HTMLDivElement;
		sidepanel.style.display = "block";
		btn.style.display = "none";
	});

}

function DesktopMenu(mBar: HTMLElement)
{
	let links = [
		{"href":"index.html", "lbl": "Home" },
		{ "href": "psychrometry/index.html", "lbl": "Psychrometry" },
		{ "href": "thermalproc/index.html", "lbl": "Thermal Proc" },
		{ "href": "stats/index.html", "lbl": "Statistics" },
		{ "href": "pipmngr.html", "lbl": "PIP" },
	];

	for (let lnk of links)
	{
		let div = mBar.appendChild(document.createElement("div"));
		div.innerHTML = lnk.lbl;
		div.onclick = function(e)
		{
			location.href = window.api.dirname() +"/" + lnk.href;
		}
	}
}

ToggleSidePanel();
DesktopMenu(sidePanel());