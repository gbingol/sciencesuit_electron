/*
	A transient popup window
	By default it shows for 2500 ms at the bottom-center and then destroyed

	Usage:
	let msgBox = document.createElement("div-transientpopwnd");
	msgBox.innerHTML = "Copied to clipboard";
	msgBox.timeout=3000; //if another 
*/

class DivTransientPopupWindow extends HTMLElement 
{
	private duration:number;
	private shadow:ShadowRoot;
	private msgBox:HTMLDivElement;
	private contentTxt:HTMLDivElement;
	constructor() 
	{
		super();

		this.duration = 2500; //ms

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
		setTimeout(() => { this.shadow.removeChild(this.msgBox); }, this.duration);
	}

	set innerHTML(val:string)
	{
		this.contentTxt.innerHTML = val;
	}

	set timeout(val:number)
	{
		this.duration = val;
	}

}

	
customElements.define("div-transientpopwnd", DivTransientPopupWindow);