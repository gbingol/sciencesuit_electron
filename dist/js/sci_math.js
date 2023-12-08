
/**
 * 
 * @param {number} number 
 * @param {number} digits 
 * @returns {number}
 */
export function round(number, digits)
{
	if (Number.isInteger(number))
		return number;

	return number.toFixed(digits)
}



/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} a 
 * @returns {number}
 */
export function lerp(x, y, a)
{
	/*
	lerp(20, 80, 0)   // 20
	lerp(20, 80, 1)   // 80
	lerp(20, 80, 0.5) // 50
	*/
	return x * (1 - a) + y * a;
}

/*
	clamp(24, 20, 30) // 24
	clamp(12, 20, 30) // 20
	clamp(32, 20, 30) // 30
*/
export function clamp(a, min = 0, max = 1)
{
	return Math.min(max, Math.max(min, a));
}


/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} a 
 * @returns {number}
 */
export function invlerp(x, y, a)
{
	/*
	invlerp(50, 100, 75)  // 0.5
	invlerp(50, 100, 25)  // 0
	invlerp(50, 100, 125) // 1
	*/
	return clamp((a - x) / (y - x));
}


/**
 * 
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * @param {number} xval 
 * @returns {number}
 */
export function linearinterp(x1, y1, x2, y2, xval)
{
	//linear interpolation
	if (x1 == x2)
		return y1 

	let m = 0, n = 0;
	m = (y2 - y1) / (x2 - x1)
	n = y2 - m * x2

	return m * xval + n
}


/**
 * 
 * @param {number[]} arr
 * @returns {number[]}
 */
export function cumsum(arr)
{
	let sum = 0;
	return arr.map(e => sum += e);
}

/**
 * 
 * @param {number[]} arr
 * @returns {number[]}
 */
export function diff(arr)
{
	if (arr.length < 2)
		throw new Error("Array must have at least 2 elements");

	let x = [];
	for (let i = 1; i < arr.length; ++i)
		x.push(arr[i] - arr[i - 1]);

	return x;
}



/*******************  SIMPLE ARRAY OPERATIONS ************************/

/**
 * @param {number[]} x
 * @param {number[] | number} y 
 * @returns {number[]}
*/
export function add(x, y)
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

/**
 * @param {number[]} x
 * @param {number[] | number} y 
 * @returns {number[]}
*/
export function sub(x, y)
{
	// x - y = x + (-y)
	return add(x, Array.isArray(y) ? y.map(e=>-e) : -y);
}


/**
 * @param {number[]} x
 * @param {number[] | number} y 
 * @returns {number[]}
*/
export function mul(x, y)
{
	if(!(Array.isArray(x) || Array.isArray(y)))
		throw new Error("x and/or y must be array");

	let _x  = Array.from(Array.isArray(x) ? x: y);

	if(Array.isArray(x) && Array.isArray(y))
	{
		if(x.length != y.length)
			throw new Error("Array lengths must be same");

		for(let i=0; i<_x.length; ++i)
			_x[i] *= y[i];
	}

	else if (Number.isFinite(x) || Number.isFinite(y))
	{
		let val = Number.isFinite(x) ? x: y;
		for(let i=0; i<_x.length; ++i)
			_x[i] *= val;
	}

	return _x;
}


/**
 * @param {number[]} x
 * @param {number[] | number} y 
 * @returns {number[]}
*/
export function div(x, y)
{
	// x/y = x* (1/y)
	return mul(x, Array.isArray(y) ? y.map(e=>1.0/e) : 1.0/y);
}


/**
 * @param {number[]} x
 * @param {number[] | number} y 
 * @returns {number[]}
*/
export function pow(x, y)
{
	if(!(Array.isArray(x) || Array.isArray(y)))
		throw new Error("x and/or y must be array");

	let _x  = [];

	if(Array.isArray(x) && Array.isArray(y))
	{
		if(x.length != y.length)
			throw new Error("Array lengths must be same");

		for(let i=0; i<_x.length; ++i)
			_x[i] = Math.pow(x[i], y[i]);
	}

	else if (Number.isFinite(x))
	{
		for(let i=0; i<y.length; ++i)
			_x[i] = Math.pow(x, y[i]);
	}

	else if (Number.isFinite(y))
	{
		for(let i=0; i<x.length; ++i)
			_x[i] = Math.pow(x[i], y);
	}

	return _x;
}