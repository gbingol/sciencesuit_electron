function createCSS()
{
	let s = `
	
	li.singlemenu { 
		display: inline-block; 
	}
	
	
	li.singlemenu a 
	{
		display: inline-block;
		color: white;
		text-align: center;
		padding-right: 0.5em;
		padding-left: 0.5em;
		text-decoration: none;
	}
	
	
	li.singlemenu a:hover {
		background-color: gray;
	}
	
	
	li.dropdownmenu { 
		display: inline-block; 
	}
	
	
	.drop_menuitems {
		display: none;
		position: absolute;
		background-color: #f9f9f9;
		min-width: 160px;
		box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
	}
	
	
	.drop_menuitems  a
	{
		color: black;	
		text-decoration: none;
		display: block;
		text-align: left;
	}
	
	.drop_menuitems  a:hover { 
		background-color: #f1f1f1; 
	}
	
	.dropdownmenu:hover .drop_menuitems { 
		display: block; 
	}

	span.historynavigate
	{
		color: white;
	}

	span.historynavigate:hover
	{
		cursor: pointer;
		background-color: gray;
	}
		
	`
	let css = document.head.appendChild(document.createElement("style"));
	css.innerHTML = s;
}


function createMenuBar()
{
	let mBar = document.body.appendChild(document.createElement("div"));
	mBar.style.position = "sticky";
	mBar.style.display = "flex";
	mBar.style.flexDirection = "row";
	mBar.style.gap = "3em";
	mBar.style.alignItems = "center";
	mBar.style.backgroundColor = "black";
	mBar.style.top = "0px";
	mBar.style.width = "100%";
	mBar.style.height = "1.5em";

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

let mBar = createMenuBar();
createCSS();

createDesktopMenu(mBar);
createNavigation(mBar);