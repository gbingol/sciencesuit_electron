util ={}

math = {};

math.round = function round(number, digits)
{
	if (Number.isInteger(number))
		return number;

	return number.toFixed(digits)
}

util.math = math;

export default { util };