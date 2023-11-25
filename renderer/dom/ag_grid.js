function createCSS()
{
	let alpine = document.head.appendChild(document.createElement("link"));
	alpine.href = "../../node_modules/ag-grid-community/styles/ag-theme-alpine.css";
	alpine.rel = "stylesheet";

	let aggrid = document.head.appendChild(document.createElement("link"));
	aggrid.href = "../../node_modules/ag-grid-community/styles/ag-grid.css";
	aggrid.rel = "stylesheet";
}

function addScript()
{
	let script = document.body.appendChild(document.createElement("script"));
	script.src = "../../node_modules/ag-grid-community/dist/ag-grid-community.min.js";
}

export {createCSS, addScript}