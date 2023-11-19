/*
	A copyable and deleteable div element
	When copy clicked, it also shows a transient popup window
*/

class DivTransientPopupWindow extends HTMLElement 
{
	constructor() 
	{
		super();
	}

	
	
	connectedCallback() 
	{
		const shadow = this.attachShadow({ mode: "open" });
	
		this.msgBox = document.createElement("div");
		this.msgBox.style.position = "fixed";
		this.msgBox.style.bottom = "0px";
		this.msgBox.style.left = "40%";
		this.msgBox.style.border = "3px solid goldenrod";
		this.msgBox.style.backgroundColor = "azure"
		this.msgBox.style.fontSize = "1.3em";
		this.msgBox.innerHTML = "Copied to clipboard";
	
		shadow.appendChild(this.msgBox);

		setTimeout(() => { shadow.removeChild(this.msgBox); }, 2500);
	}

	attributeChangedCallback(name, oldValue, newValue) 
	{
		this.msgBox.innerHTML = newValue
	}

}

export { DivTransientPopupWindow };
	
customElements.define("div-transientpopwnd", DivTransientPopupWindow);