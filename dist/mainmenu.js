function createCSS()
{
	let link = document.head.appendChild(document.createElement("link"));
	link.href = window.api.dirname() + "/" + "mainmenu.css";
	link.rel = "stylesheet";
}


function createTopBar()
{
	let mBar = document.body.appendChild(document.createElement("div"));
	mBar.className = "__topbar";

	return mBar;
}


/**
 * 
 * @param {HTMLElement} mBar 
 */
function createNavigation(mBar)
{
	let div = mBar.appendChild(document.createElement("div"));
	div.style.display = "flex";
	div.style.flexDirection = "row";
	div.style.gap = "0.8em";

	let back = div.appendChild(document.createElement("span"));
	back.className = "historynavigate";
	back.innerHTML = "&larr;"
	back.style.color = history.length > 1 ? "white" : "gray";
	back.onclick = function (evt)
	{
		if (history.length > 0)
			history.back();	
	}

	let forward = div.appendChild(document.createElement("span"));
	forward.className = "historynavigate";
	forward.innerHTML = "&rarr;"
	forward.style.color = "white";
	forward.onclick = function (evt)
	{
		history.forward();	
	}
}


/**
 * 
 * @param {HTMLElement} mBar 
 */
function createDesktopMenu(mBar)
{
	let Menu = mBar.appendChild(document.createElement("ul"));
	Menu.style.cssText = "list-style-type: none; padding: 0; overflow: hidden;"
	
	let links = [
		{"href":"index.html", "lbl": "Home" },
		{ "href": "eng/psychrometry/index.html", "lbl": "Psychrometry" },
		{ "href": "eng/fpe/index.html", "lbl": "FPE" },
		{ "href": "pipmngr.html", "lbl": "PIP" },
	];

	for (let lnk of links)
	{
		let lstItem = Menu.appendChild(document.createElement("li"));
		lstItem.className = "singlemenu";

		let a = lstItem.appendChild(document.createElement("a"));
		a.innerHTML = lnk.lbl;
		a.href = window.api.dirname() +"/" + lnk.href;
	}
}

let topBar = createTopBar();
createCSS();

createDesktopMenu(topBar);
createNavigation(topBar);