function createCSS()
{
	let s = `
	
	li.singlemenu { 
		display: inline-block; 
	}
	
	
	li.singlemenu a, .dropbutton 
	{
		display: inline-block;
		color: white;
		text-align: center;
		padding: 0.5em 0.5em;
		text-decoration: none;
	}
	
	
	li.singlemenu a:hover, .dropdownmenu:hover .dropbutton {
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
	
	
	.drop_menuitems  a {
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
		
	`
	let css = document.head.appendChild(document.createElement("style"));
	css.innerHTML = s;
}


function createDesktopMenu()
{	
	let titleBar = document.body.appendChild(document.createElement("div"));

	let MenuBar = titleBar.appendChild(document.createElement("ul"));
	MenuBar.style.cssText = "list-style-type: none; margin: 0; padding: 0; overflow: hidden; background-color: black; width:100%;"
	
	let links = [
		{"href":"index.html", "lbl": "Home" },
		{ "href": "eng/psychrometry/index.html", "lbl": "Psychrometry" },
		{ "href": "pipmngr.html", "lbl": "PIP" },
	];

	for (let lnk of links)
	{
		let lstItem = MenuBar.appendChild(document.createElement("li"));
		lstItem.className = "singlemenu";

		let a = lstItem.appendChild(document.createElement("a"));
		a.innerHTML = lnk.lbl;
		a.href = window.api.dirname() +"/" + lnk.href;
	}
}

createCSS();
createDesktopMenu();