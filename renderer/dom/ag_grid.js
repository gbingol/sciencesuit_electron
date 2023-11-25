function createCSS()
{
	let alpine = document.head.appendChild(document.createElement("link"));
	alpine.href = window.api.projdir() + "/" + "node_modules/ag-grid-community/styles/ag-theme-alpine.css";
	alpine.rel = "stylesheet";

	let aggrid = document.head.appendChild(document.createElement("link"));
	aggrid.href = window.api.projdir() + "/" + "node_modules/ag-grid-community/styles/ag-grid.css";
	aggrid.rel = "stylesheet";
}

function addScript()
{
	return new Promise((resolve, reject)=>
	{
	let address = window.api.projdir() + "/" + "node_modules/ag-grid-community/dist/ag-grid-community.min.js";
	let script = document.body.appendChild(document.createElement("script"));
	script.setAttribute("src", address);
	script.addEventListener("load",resolve);
	script.addEventListener("error", reject);
	});
}

createCSS();