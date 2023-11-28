class CVector
{
	/**
	 * 
	 * @param {number[]} x 
	 */
	constructor(x)
	{
		this._x = x;
	}

	/**
	 * 
	 * @param {number[]} y 
	 * @returns {number[]}
	 */
	add(y)
	{
		if(this._x.length != y.length)
			throw new Error("Array lengths must be same");

		let x  = Array.from(this._x);

		if(Array.isArray(y))
		{
			for(let i=0; i<x.length; ++i)
				x[i] += y[i];
		}
		else if (Number.isFinite(y))
		{
			for(let i=0; i<x.length; ++i)
				x[i] += y;
		}

		return x;
	}

	/**
	 * 
	 * @param {number[]} y
	 * @returns {number[]}
	 */
	subt(y)
	{
		if(this._x.length != y.length)
			throw new Error("Array lengths must be same");

		let x  = Array.from(this._x);

		if(Array.isArray(y))
		{
			for(let i=0; i<x.length; ++i)
				x[i] -= y[i];
		}
		else if (Number.isFinite(y))
		{
			for(let i=0; i<x.length; ++i)
				x[i] -= y;
		}

		return x;
	}

	/**
	 * 
	 * @param {number[]} y
	 * @returns {number[]}
	 */
	div(y)
	{
		if(this._x.length != y.length)
			throw new Error("Array lengths must be same");

		let x  = Array.from(this._x);

		if(Array.isArray(y))
		{
			for(let i=0; i<x.length; ++i)
				x[i] /= y[i];
		}
		else if (Number.isFinite(y))
		{
			for(let i=0; i<x.length; ++i)
				x[i] /= y;
		}

		return x;
	}


	/**
	 * 
	 * @param {number[]} y
	 * @returns {number[]}
	 */
	mult(y)
	{
		if(this._x.length != y.length)
			throw new Error("Array lengths must be same");

		let x  = Array.from(this._x);

		if(Array.isArray(y))
		{
			for(let i=0; i<x.length; ++i)
				x[i] *= y[i];
		}
		else if (Number.isFinite(y))
		{
			for(let i=0; i<x.length; ++i)
				x[i] *= y;
		}

		return x;
	}


	/**
	 * 
	 * @param {number[]} y
	 * @returns {number[]}
	 */
	pow(y)
	{
		if(this._x.length != y.length)
			throw new Error("Array lengths must be same");

		let x  = Array.from(this._x);

		if(Array.isArray(y))
		{
			for(let i=0; i<x.length; ++i)
				x[i] = Math.pow(x[i], y[i]);
		}
		else if (Number.isFinite(y))
		{
			for(let i=0; i<x.length; ++i)
			x[i] = Math.pow(x[i], y);
		}

		return x;
	}


}