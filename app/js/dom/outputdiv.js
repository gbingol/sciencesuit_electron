class DivOutput extends HTMLElement 
{
	static observedAttributes = ["data-text"];
	constructor() 
	{
		super();
	}
	
	connectedCallback() 
	{
		const shadow = this.attachShadow({ mode: "open" });
	
		const outDiv = document.createElement("div");
		outDiv.setAttribute("class", "output");
		outDiv.style.position="relative";

		this.contentTxt = outDiv.appendChild(document.createElement("div"));

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
			shadow.removeChild(outDiv); 
			outDiv = null;
			btnDiv = null;
			delBtn = null;
			copyBtn = null;
		}

		copyBtn.onclick = (evt) => 
		{
			let type = "text/html";
			let text = this.contentTxt.innerHTML;
			let blob = new Blob([text], { type });
			let data = [new ClipboardItem({ [type]: blob })];
			navigator.clipboard.write(data).then(
				function ()
				{
					let msgBox = document.createElement("div");
					msgBox.style.position = "fixed";
					msgBox.style.bottom = "0px";
					msgBox.style.left = "40%";
					msgBox.style.border = "3px solid goldenrod";
					msgBox.style.backgroundColor = "azure"
					msgBox.style.fontSize = "1.3em";
					msgBox.innerHTML = "Copied to clipboard";
					
					document.body.appendChild(msgBox);

					setTimeout(() => { document.body.removeChild(msgBox); }, 2500);
				},
				function () {
				/* failure */
				}
			);
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
	
		shadow.appendChild(style);	
		shadow.appendChild(outDiv);
	}

	attributeChangedCallback(name, oldValue, newValue) 
	{
		this.contentTxt.innerHTML = newValue
	}

}
	
customElements.define("output-div", DivOutput);