//Only returns entries that can be converted to number (uses parseFloat)
export function FilterNumbers(arr: any[]): number[]
{
	let retArr:number[] = []
	for (let e of arr)
	{
		if (isNaN(Number(e)))
			continue;
		retArr.push(parseFloat(e));
	}

	return retArr
}

//All types can be converted to string!
export function ToStringArray(arr: any[]): string[]
{
	return arr.map(e => String(e));
}