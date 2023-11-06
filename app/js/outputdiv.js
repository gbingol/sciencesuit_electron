class DivOutput extends HTMLElement 
{
	constructor() {
		// Always call super first in constructor
		super();
	  }
	
	connectedCallback() 
	{
		const shadow = this.attachShadow({ mode: "open" });
	
		const outDiv = document.createElement("div");
		outDiv.setAttribute("class", "output");
		outDiv.style.position="relative";

		let contentTxt = outDiv.appendChild(document.createElement("div"));
		let btnDiv = outDiv.appendChild(document.createElement("div"));
		btnDiv.style.position="absolute";
		btnDiv.style.right=0;
		btnDiv.style.top="0px";

		let delBtn = btnDiv.appendChild(document.createElement("button"));
		delBtn.innerHTML="Delete";
		delBtn.style.float="right";

		let copyBtn = btnDiv.appendChild(document.createElement("button"));
		copyBtn.innerHTML="Copy";
		copyBtn.style.float="right";

		delBtn.onclick = (evt) => 
		{
			document.body.removeChild(outDiv); 
			outDiv = null;
			btnDiv = null;
			delBtn = null;
			copyBtn = null;
		}

		copyBtn.onclick = (evt) => 
		{
			navigator.clipboard.writeText(contentTxt.innerText)
		}
	
		const style = document.createElement("style");
		style.textContent = `
		.output{
			clear: both;
			margin-top: 12px;
			padding-top: 12px;
			border-style: dashed;
			border-color: red;
			border-width: 1px;
			font-size: large;
		}
		`;
	
		// Attach the created elements to the shadow dom
		shadow.appendChild(style);	
		shadow.appendChild(outDiv);
	  }
	}
	
	// Define the new element
customElements.define("output", DivOutput);