/*
	A copyable and deleteable div element
	When copy clicked, it also shows a transient popup window
*/

class DivTransientPopupWindow extends HTMLElement 
{
	constructor() 
	{
		super();

		this.shadow = this.attachShadow({ mode: "open" });
	
		this.msgBox = document.createElement("div");
		this.msgBox.style.position = "fixed";
		this.msgBox.style.bottom = "0px";
		this.msgBox.style.left = "40%";
		this.msgBox.style.border = "3px solid goldenrod";
		this.msgBox.style.backgroundColor = "azure"
		this.msgBox.style.fontSize = "1.3em";

		this.contentTxt = this.msgBox.appendChild(document.createElement("div"));
		
		this.shadow.appendChild(this.msgBox);
	}

	connectedCallback()
	{
		setTimeout(() => { this.shadow.removeChild(this.msgBox); }, 2500);
	}

	set innerHTML(val)
	{
		this.contentTxt.innerHTML = val;
	}

}

export { DivTransientPopupWindow };
	
customElements.define("div-transientpopwnd", DivTransientPopupWindow);