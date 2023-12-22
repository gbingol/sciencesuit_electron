
/**
 * 
 * @param {string} str 
 * @param {string}  delimiter
 * @returns {string[]}
 */
function parseMultilineString(str, delimiter = "\t")
{
	//str is a multiline string where each line contains entries separated with tabs
	let retArr = []

	let lines = str.split("\n");
	for (let line of lines)
	{
		//check for Windows
		if(line.endsWith("\r"))
			line = line.slice(0, -1);

		let arr = line.split(delimiter);
		retArr.push(arr);
	}

	return retArr;
}



function createCSS()
{
	let alpine = document.head.appendChild(document.createElement("link"));
	alpine.href = window.api.projdir() + "/" + "node_modules/ag-grid-community/styles/ag-theme-alpine.css";
	alpine.rel = "stylesheet";

	let aggrid = document.head.appendChild(document.createElement("link"));
	aggrid.href = window.api.projdir() + "/" + "node_modules/ag-grid-community/styles/ag-grid.css";
	aggrid.rel = "stylesheet";

	let extraStyle = 
	`
		.ag-header-cell-label
		{
			justify-content: center;
		}

		.ag-header-cell-label .ag-header-cell-text 
		{
			color: red;
		}

		.ag-cell{

			--ag-cell-horizontal-border: solid rgba(128, 128, 128, 0.24);
		   
		}
	`
	let css = document.head.appendChild(document.createElement("style"));
	css.innerHTML = extraStyle;
	document.head.appendChild(css);
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






/*******************           RANGE    ************************************/

class CRange
{
	/**
	 * @param {string} str 
	 * @param {Worksheet} ws
	 */
	constructor(str, ws)
	{
		let rng = str.split(":");
		if(rng.length != 2)
			throw new Error("Invalid range");

		let Start = this.parseRange(rng[0]);
		let End = this.parseRange(rng[1]);

		let stCol = Start[0].charCodeAt(0), stRow = parseInt(Start[1]);
		let endCol = End[0].charCodeAt(0), endRow = parseInt(End[1]);

		if(stRow>endRow)
			throw new Error("Start row number cannot be greater than end row number");

		if(stCol>endCol)
			throw new Error("Starting column number cannot be greater than end column number");

		this._ncols = endCol - stCol + 1;
		this._nrows = endRow - stRow + 1;

		this._TL = { "row": stRow, "col": stCol };
		this._BR = { "row": endRow, "col": endCol };
		this._ws = ws;
	}


	get nrows()
	{
		return this._nrows;
	}


	get ncols()
	{
		return this._ncols;
	}


	get topleft()
	{
		return this._TL;
	}


	get bottomright()
	{
		return this._BR;
	}


	/**
	 * @param {string} str 
	 * @returns {string[]}
	 */
	parseRange(str)
	{
		//comes in format of A15, B20
		//returns A and 15 or B and 20
		let s="";

		let i=0;
		while(isNaN(str[i]))
			s += str[i++];

		return [s, str.substring(i)];
	}

	//returns row-majored data
	get datarows()
	{
		let Arr = [];

		let TL = this._TL;
		let BR = this._BR;

		for(let i=TL.row; i<=BR.row; i++)
		{
			const rowNode = this._ws.gridOptions.api.getRowNode((i-1).toString());
			let a = [];
			for(let j=TL.col; j<=BR.col; j++)
			{
				let data = rowNode.data[String.fromCharCode(j)];
				a.push(data);
			}
			Arr.push(a);
		}

		return Arr;
	}

	//returns column-majored data
	get data()
	{
		let a = this.datarows;

		let arr = [];
		for(let i=0; i<a[0].length; ++i)
			arr.push(a.map(e=>e[i]));

		return arr;
	}
}




/******************* WORKSHEET  ************************************/

class CWorksheet
{
	/**
	 * 
	 * @param {HTMLDivElement} div 
	 * @param {Number} nrows 
	 * @param {Number} ncols 
	 */
	constructor(div, nrows = 200, ncols = 15)
	{
		this._div = div;
		this._nrows = nrows;
		this._ncols = ncols;

		this._div.style.display = "flex";
		this._div.style.flexDirection = "column";

		let btnDiv = this._div.appendChild(document.createElement("div"));
		btnDiv.style.display = "flex";
		btnDiv.style.flexDirection = "row";
		btnDiv.style.gap = "0.5em";

		let pasteBtn = btnDiv.appendChild(document.createElement("button"));
		pasteBtn.innerHTML="Paste";

		let clearBtn = btnDiv.appendChild(document.createElement("button"));
		clearBtn.innerHTML="Clear Cells";

		this.gridDiv = this._div.appendChild(document.createElement("div"));
		this.gridDiv.className = "ag-theme-alpine";
		this.gridDiv.style.height = "100%";
		this.gridDiv.style.width = "100%";


		pasteBtn.addEventListener("click", (evt)=>
		{
			this.paste();
		});

		clearBtn.addEventListener("click", (evt)=>
		{
			this.clearCells();
		});
	}

	
	init = async()=>
	{
		createCSS();
		let e = await addScript()
		this._gridOptions = await this.CreateGrid(this._div, this._nrows, this._ncols);
		return this._gridOptions;
	}

	get gridOptions()
	{
		return this._gridOptions;
	}

	/**
	 * 
	 * @param {HTMLDivElement} div 
	 * @param {Number} nrows 
	 * @param {Number} ncols 
	 */
	CreateGrid = async (div, nrows, ncols)=>
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
			onCellClicked: this.CellClicked,
			columnDefs: ColumnDefs,
			rowData: RowData,
			animateRows: true,
			defaultColDef: 
			{
				editable: true,
				resizable: true,
			}
		};

		new agGrid.Grid(this.gridDiv, gridOptions);
		
		return gridOptions;	
	}


	CellClicked = (evt)=>
	{
		const field = evt.colDef.field;
		const colindex = evt.columnApi.getColumns()?.findIndex((col) => col.getColDef().field === field);
		
		this._curRow = evt.rowIndex;
		this._curCol = colindex;
		this._curField = field;
	}


	paste = () =>
	{
		let row = this._curRow || 0;

		//column numbering starts from 1, so for A which is 65 we need (col -1) +65 = (1-1) + 65 = A
		let col = (this._curCol - 1) + 65 || 65;

		/**
		 * @type {string} field
		 */
		let field = this._curField || "A";	
		
		navigator.clipboard.readText().then(txt =>
		{
			let Arr = parseMultilineString(txt);
			for (let i = 0; i < Arr.length; i++)
			{
				for (let j = 0; j < Arr[i].length; j++)
				{
					let Row = row + i;
					let Col = col + j 

					const rowNode = this._gridOptions.api.getRowNode(Row.toString());
					rowNode.setDataValue(String.fromCharCode(Col), Arr[i][j]);
				}
			}
		});
	}


	clearCells = () =>
	{
		for (let i = 0; i < this._nrows; i++)
		{
			let Row = i;
			const rowNode = this._gridOptions.api.getRowNode(Row.toString());

			for (let j = 0; j < this._ncols; j++)
			{	
				let Col = 65 + j 
				rowNode.setDataValue(String.fromCharCode(Col), "");
			}
		}
	}
}




export {CWorksheet, CRange}