function sidePanel()
{
	let mBar = document.body.appendChild(document.createElement("div"));
	mBar.id = "_sidepanel";

	return mBar;
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

DesktopMenu(sidePanel());