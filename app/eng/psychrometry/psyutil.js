function checkInputs()
{
	/*
	Applies to: <input type="text"  or <input type="number"

	Checks if input contains a text or a valid real number
	*/
	let inputs = document.getElementsByTagName("input")
	for(let i=0; i<inputs.length; ++i)
	{
		let elem = inputs[i];
					
		if(elem.type === "text" || elem.type === "number")
		{
			if(elem.value ==="" || isNaN(elem.value))
			{
				let infoDiv = document.querySelector("#info");
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

function addInputListener(node, spanId, htmlText)
{
	node.addEventListener("input", (evt)=> {
		let v = evt.target.value;
		document.getElementById(spanId).innerHTML = v === ""? htmlText : v; 
	});
}


function createMenu()
{
	let s = `
	<div id="desktopmenu">

		<ul class="desktopmenubar">

			<li class="singlemenu">
				<a class="active"  href="../../index.html">Home</a>
			</li>
			
			<li class="singlemenu">
				<a href="calculator.html">Calculator</a>
			</li>
			
			<li class="dropdownmenu"> 
				<a class="dropbutton" href="#">Simulations</a>
		
				<div class="drop_menuitems">
					<a href="adiabaticmixing.html">Adiabatic mixing</a>
					<a href="coolingdehumid.html">Cooling with dehumidification</a>
					<a href="evaporativecooling.html">Evaporative cooling</a>
					<a href="heating_humidif.html">Heating with humidification</a>
				</div>
			</li>
		</ul>	
	</div>

	<div id="mobilemenu" class="mobileoverlay">

		<div class="overlay-content">
			<a href="calculator.html">Calculator</a>
			<a href="adiabaticmixing.html">Adiabatic mixing</a>
			<a href="coolingdehumid.html">Cooling with dehumidification</a>
			<a href="evaporativecooling.html">Evaporative cooling</a>
			<a href="heating_humidif.html">Heating with humidification</a>
		</div>
	</div>

	`

	document.body.innerHTML += s;
}