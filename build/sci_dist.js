var addon = require('bindings')('nodebind');



/**
 * @param {Array | Number} x
 * @param {Number} mean
 * @param {Number} sd
 * @returns {Array | Number}
 */
function dnorm(x, mean = 0, sd = 1)
{
	if (isNaN(x) && !Array.isArray(x))
		throw "x must be number or array";

	if (isNaN(mean))
		throw "mean must be number";
	
	if (isNaN(sd) || sd <= 0)
		throw "sd >0 expected";

	return addon.dnorm(x, mean, sd);
}



module.exports = { dnorm };
