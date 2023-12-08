import * as np from "../dist/js/sci_math.js";

np.

function add(x, y)
{
	if(!(Array.isArray(x) || Array.isArray(y)))
		throw new Error("x and/or y must be array");

	let _x  = Array.from(Array.isArray(x) ? x: y);

	if(Array.isArray(x) && Array.isArray(y))
	{
		if(x.length != y.length)
			throw new Error("Array lengths must be same");

		for(let i=0; i<_x.length; ++i)
			_x[i] += y[i];
	}

	else if (Number.isFinite(x) || Number.isFinite(y))
	{
		let val = Number.isFinite(x) ? x: y;
		for(let i=0; i<_x.length; ++i)
			_x[i] += val;
	}

	return _x;
}

x=[1,2]
y=[3,4]
console.log(add(x,y));