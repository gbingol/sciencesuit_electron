const { Psychrometry } = require('./main.js');

try
{
	let p = new Psychrometry(["p", "tdb", "twb"], [101325, 20, 18])
	console.log(p.to_str());
	
}
catch(e)
{
	console.log(e);
}