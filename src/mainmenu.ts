let ID_PLACEHOLDERPANEL = "_placeholderpanel";

function _sidePanel()
{
	let Panel = document.body.appendChild(document.createElement("div"));
	Panel.id = "_sidepanel";

	Panel.addEventListener("mouseleave", (evt)=>
	{
		let togglePanel = document.querySelector("#" + ID_PLACEHOLDERPANEL) as HTMLDivElement;
		togglePanel.style.display = "block";
		Panel.style.display = "none";
	});

	return Panel;
}


function _TogglePlaceHolderPanel()
{
	/*
	Appears at the side as a thin layer
	When the user enters with mouse it disappears and the actual side panel appears
	When the user leaves the actual side panel, this appears again
	*/
	let TogglePanel = document.body.appendChild(document.createElement("div"));
	TogglePanel.innerHTML = "☰";
	TogglePanel.id = ID_PLACEHOLDERPANEL;
	TogglePanel.style.cssText = 
		`
		background-image: var(--linearbg);
		min-height: 100vh;
		position: fixed;
		`

	TogglePanel.addEventListener("mouseenter", (event)=>
	{
		let sidepanel = document.querySelector("#_sidepanel") as HTMLDivElement;
		sidepanel.style.display = "flex";
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

_TogglePlaceHolderPanel();
_DesktopMenu(_sidePanel());