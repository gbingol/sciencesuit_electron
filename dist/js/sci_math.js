
/**
 * 
 * @param {number} number 
 * @param {number} digits 
 * @returns {number}
 */
function round(number, digits)
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
function lerp(x, y, a)
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
function clamp(a, min = 0, max = 1)
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
function invlerp(x, y, a)
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
function linearinterp(x1, y1, x2, y2, xval)
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
function cumsum(arr)
{
	let sum = 0;
	return arr.map(e => sum += e);
}


export {linearinterp, round, invlerp, clamp, lerp, cumsum }