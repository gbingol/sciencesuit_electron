function createCSS()
{
	let alpine = document.head.appendChild(document.createElement("link"));
	alpine.href = window.api.projdir() + "/" + "node_modules/ag-grid-community/styles/ag-theme-alpine.css";
	alpine.rel = "stylesheet";

	let aggrid = document.head.appendChild(document.createElement("link"));
	aggrid.href = window.api.projdir() + "/" + "node_modules/ag-grid-community/styles/ag-grid.css";
	aggrid.rel = "stylesheet";
}


async function addScript()
{
	return new Promise((resolve, reject)=>
	{
		let address = window.api.projdir();
		address += "/" + "node_modules/ag-grid-community/dist/ag-grid-community.min.js";

		let script = document.body.appendChild(document.createElement("script"));
		script.setAttribute("src", address);
		script.addEventListener("load",resolve);
		script.addEventListener("error", reject);
	});
}


async function CreateGrid(div, nrows, ncols)
{
	let ColumnDefs = 
	[
		{ headerName: "", valueGetter: "node.rowIndex + 1", suppressMovable:true, editable: false, width: 60}
	];

	
	for(let i=65; i<=(65+ncols); ++i)
	{
		let obj = {};
		obj.headerName = String.fromCharCode(i);
		obj.field =  String.fromCharCode(i);
		obj.width = 100;
		ColumnDefs.push(obj);
	}

	let RowData = [];
	for(let i=0; i<=nrows; i++)
		RowData.push({});
	
	let gridOptions = 
	{
		rowHeight: 25,
		//onCellClicked: CellClicked,
		columnDefs: ColumnDefs,
		rowData: RowData,
		animateRows: true,
		defaultColDef: 
		{
			editable: true,
			resizable: true,
		}
	};

	
	let grid = new agGrid.Grid(div, gridOptions);
	return gridOptions;	
}


async function InitGrid(div, nrows=200, ncols = 15)
{
	createCSS();
	let e = await addScript()
	return CreateGrid(div, nrows, ncols);
}

export {InitGrid}