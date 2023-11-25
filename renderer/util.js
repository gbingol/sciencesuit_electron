util ={}
math = {};

math.round = function round(number, digits)
{
	if (Number.isInteger(number))
		return number;

	return number.toFixed(digits)
}

/*
	lerp(20, 80, 0)   // 20
	lerp(20, 80, 1)   // 80
	lerp(20, 80, 0.5) // 50
*/
math.lerp = (x, y, a) => x * (1 - a) + y * a;

/*
	clamp(24, 20, 30) // 24
	clamp(12, 20, 30) // 20
	clamp(32, 20, 30) // 30
*/
math.clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));

/*
	invlerp(50, 100, 75)  // 0.5
	invlerp(50, 100, 25)  // 0
	invlerp(50, 100, 125) // 1
*/
math.invlerp = (x, y, a) => clamp((a - x) / (y - x));

//linear interpolation
math.linearinterp = (x1, y1, x2, y2, xval) =>
{
	if (x1 == x2)
		return y1 

	let m = 0, n = 0;
	m = (y2 - y1) / (x2 - x1)
	n = y2 - m * x2

	return m * xval + n
};

util.math = math;

util.fetchText = function(url)
{
	let content = fetch(url).
	then( response=>response.text()).
	then(text=> text);

	return content;
}

/**
 * 
 * @param {HTMLElement} owner 
 * @param {string[]} headers 
 * @returns {HTMLTableElement}
 */
util.InitTable = function (owner, headers)
{
	let table = owner.appendChild(document.createElement("table"));
	let header = table.appendChild(document.createElement("thead"));
	let row = header.appendChild(document.createElement("tr"));

	for (let header of headers)
	{
		let col = row.appendChild(document.createElement("td"));
		col.innerHTML=header;
	}

	return table;
}