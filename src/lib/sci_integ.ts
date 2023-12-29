export function trapz(
	x:number[],
	y:number[]): number
{
	let len_x = x.length, len_y = y.length;
	if(len_x != len_y) 
		throw new Error("Arrays must be same size.");

	let retval = 0;
	let a = 0, b = 0, f_a = 0, f_b = 0;

	for (let i = 0; i < len_x - 1; ++i)
	{
		a = x[i];
		b = x[i + 1];

		f_a = y[i];
		f_b = y[i + 1];

		retval += (b - a) * (f_a + f_b) / 2.0;
	}

	return retval;
}


export function cumtrapz(
	x:number[],
	y:number[]): number[]
{
	let retVec:number[] = [];
	
	let len_x = x.length, len_y = y.length;
	if(len_x != len_y) 
		throw new Error("Arrays must be same size.");

	let val = 0;
	let a = 0, b = 0, f_a = 0, f_b = 0;

	retVec.push(val);

	for (let i = 0; i < len_x - 1; i++)
	{
		a = x[i];
		b = x[i + 1];

		if(Math.abs(b - a) < 1E-5)
			throw new Error("|X(i+1)-X(i)|<1E-5");
		if(b < a) 
			throw new Error("X data is not sorted in ascending order.");

		f_a = y[i];
		f_b = y[i + 1];

		val += (b - a) * (f_a + f_b) / 2.0;

		retVec.push(val);
	}

	return retVec;
}