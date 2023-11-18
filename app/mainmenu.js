function createCSS()
{
	let s = `
	.desktopmenubar
	{
		list-style-type: none;
		margin: 0;
		padding: 0;
		overflow: hidden;
		background-color: green;
		width:100%;
	}
	
	
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
		background-color: red;
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
		padding: 12px 16px;
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
		
	
	.mobilemenubar 
	{ 
		display: none; 
	}
	
	
	div.mobilemenubar span.home
	{
		cursor:pointer; 
		font-size:2.2em; 
		float: left; 
		margin-left: 5px;
	}
	
	div.mobilemenubar span.navigator
	{
		cursor:pointer; 
		float: right; 
		margin-right: 5px;
	}
	
	
	@media only screen and (max-width:400px) 
	{
		#desktopmenu 
		{ 
			display:none; 
		}
	
		.mobilemenubar 
		{
			display: block;
			position: relative;
			width: 100%;
			height: 40px;
			text-align: center;
			background-color: green;
		}
	
		
		.mobileoverlay 
		{
			width: 100%;
			height: 0%;
			position: fixed;
			z-index: 10;
			top: 0;
			left: 0;
			background-color: rgba(0,100,0, 0.9);
			overflow-x: hidden;
			transition: 0.5s;
		}
		
		.overlay-content 
		{
			position: relative;   
			top: 10%;
			margin-top: 10%;
			width: 100%;
			text-align: center; 
		}
	
		.mobileoverlay a 
		{
			padding: 8px;
			text-decoration: none;
			font-size: 20px;
			color: white;
			display: block;
			transition: 0.3s;
		}
	
		.mobileoverlay a:hover, .mobileoverlay a:focus 
		{
			color: #f1f1f1;
		}
	}
	`
	let css = document.head.appendChild(document.createElement("style"));
	css.innerHTML = s;
}


function createMobileMenuBar()
{
	let mobileDiv = document.body.appendChild(document.createElement("div"));
	mobileDiv.id = "mobilemenu";
	mobileDiv.className = "mobileoverlay";
	mobileDiv.style.display = "none";

	let divOverlayContent = mobileDiv.appendChild(document.createElement("div"));
	divOverlayContent.className = "overlay-content";

		
	let div = document.body.appendChild(document.createElement("div"));
	div.className = "mobilemenubar";

	//home button on the left
	let home = div.appendChild(document.createElement("span"));
	home.className="home";
	home.innerHTML = "&#8962;";
	home.style.cssText = "vertical-align: middle; line-height: 40px; font-size: 25px; color: whitesmoke;";
	home.onclick = function(evt)
	{
		location.href= window.api.dirname() + "/index.html";
	}

	//navigator button which when clicked shows the link
	let navigator = div.appendChild(document.createElement("span"));
	navigator.style.cssText = "vertical-align: middle; line-height: 40px; font-size: 25px; color: whitesmoke;";
	navigator.className="navigator";
	navigator.innerHTML = "&#9776;";
	
	//as of this point it is the mobile-overlay
	navigator.onclick = function(evt)
	{
		mobileDiv.style.display = "block";
		mobileDiv.style.height = "100%";

		let btn = mobileDiv.appendChild(document.createElement("a"));
		btn.innerHTML = "&times;";
		btn.href = "javascript:void(0)";
		btn.style.cssText = "display: block; position:fixed; font-size:40px; top:15px; right:35px; z-index:100";
		
		btn.onclick = function (evt)
		{
			mobileDiv.style.height = "0%";  
			mobileDiv.removeChild(btn);
			mobileDiv.style.display = "none";
		}
	}

}


function createDesktopMenu()
{	
	let desktopDiv = document.body.appendChild(document.createElement("div"));
	desktopDiv.id = "desktopmenu";

	let mobileDiv = document.body.appendChild(document.createElement("div"));
	mobileDiv.id = "mobilemenu";
	mobileDiv.className = "mobileoverlay";

	let desktopMenuBar = desktopDiv.appendChild(document.createElement("ul"));
	desktopMenuBar.className = "desktopmenubar";
	
	let links = [
		{ "cls": "active", "href":"index.html", "lbl": "Home" },
		{ "href": "eng/psychrometry/index.html", "lbl": "Psychrometry" },
		{ "href": "pipmngr.html", "lbl": "PIP Manager" },
	];

	for (let lnk of links)
	{
		let lstItem = desktopMenuBar.appendChild(document.createElement("li"));
		lstItem.className = "singlemenu";

		let a = lstItem.appendChild(document.createElement("a"));
		a.innerHTML = lnk.lbl;
		a.href = window.api.dirname() +"/" + lnk.href;

		if (lnk.hasOwnProperty("cls"))
		{	
			a.className = "active";
		}
	}
}

createCSS();
createMobileMenuBar();
createDesktopMenu();