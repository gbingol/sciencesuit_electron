export function checkInputs():boolean
{
	/*
	Applies to: <input type="text"  or <input type="number"

	Checks if input contains a text or a valid real number
	*/
	let inputs = document.getElementsByTagName("input")
	for(let i=0; i<inputs.length; ++i)
	{
		let elem = inputs[i] as HTMLInputElement;
					
		if(elem.type === "text" || elem.type === "number")
		{
			if(elem.value ==="" || isNaN(Number(elem.value)))
			{
				let infoDiv = document.querySelector("#info") as HTMLDivElement;
				if (infoDiv != null) {
					infoDiv.style.display = "inline";
					infoDiv.innerHTML = "Value is missing or not a number.";
				}
				elem.focus();
				return false;
			}
		}
	}

	return true;
}

export function addInputListener(node:HTMLElement, spanId:string, htmlText:string):void
{
	node.addEventListener("input", (evt:Event)=> {
		let v = (evt.target as HTMLInputElement).value;
		(document.getElementById(spanId) as HTMLInputElement).innerHTML = v === ""? htmlText : v; 
	});
}
