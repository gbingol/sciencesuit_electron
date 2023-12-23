"use strict";
/*
    A copyable and deleteable div element
    When copy clicked, it also shows a transient popup window
*/
class DivCopyDel extends HTMLElement {
    constructor() {
        super();
    }
    set innerHTML(val) {
        this.contentTxt.innerHTML = val;
    }
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        this.outDiv = document.createElement("div");
        this.outDiv.setAttribute("class", "output");
        this.outDiv.style.position = "relative";
        this.contentTxt = this.outDiv.appendChild(document.createElement("div"));
        let btnDiv = this.outDiv.appendChild(document.createElement("div"));
        btnDiv.style.position = "absolute";
        btnDiv.style.right = "0";
        btnDiv.style.top = "0px";
        let delBtn = btnDiv.appendChild(document.createElement("button"));
        delBtn.innerHTML = "Delete";
        delBtn.style.float = "right";
        let copyBtn = btnDiv.appendChild(document.createElement("button"));
        copyBtn.innerHTML = "Copy";
        copyBtn.style.float = "right";
        delBtn.onclick = (evt) => {
            shadow.removeChild(this.outDiv);
        };
        copyBtn.onclick = (evt) => {
            let type = "text/html";
            let text = this.contentTxt.innerHTML;
            let blob = new Blob([text], { type });
            let data = [new ClipboardItem({ [type]: blob })];
            navigator.clipboard.write(data).then(function () {
                let msgBox = document.createElement("div-transientpopwnd");
                msgBox.innerHTML = "Copied to clipboard";
                document.body.appendChild(msgBox);
            }, function () {
                /* failure */
            });
        };
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
        shadow.appendChild(this.outDiv);
    }
}
customElements.define("div-copydel", DivCopyDel);
