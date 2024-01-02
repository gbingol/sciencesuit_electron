function _sidePanel()
{
	let Panel = document.body.appendChild(document.createElement("div"));
	Panel.id = "_sidepanel";

	Panel.addEventListener("mouseleave", (evt)=>
	{
		let togglePanel = document.querySelector("#_togglesidepanel") as HTMLDivElement;
		togglePanel.style.display = "block";
		Panel.style.display = "none";
	});

	return Panel;
}

function _ToggleSidePanel()
{
	let TogglePanel = document.body.appendChild(document.createElement("div"));
	TogglePanel.innerHTML = "☰";
	TogglePanel.id = "_togglesidepanel";

	TogglePanel.addEventListener("mouseenter", (event)=>
	{
		let sidepanel = document.querySelector("#_sidepanel") as HTMLDivElement;
		sidepanel.style.display = "block";
		TogglePanel.style.display = "none";
	});

}

function _DesktopMenu(mBar: HTMLElement)
{
	let links = [
		{"href":"index.html", "lbl": "Home" },
		{ "href": "psychrometry/index.html", "lbl": "Psychrometry" },
		{ "href": "fpe/index.html", "lbl": "FPE" },
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

_ToggleSidePanel();
_DesktopMenu(_sidePanel());