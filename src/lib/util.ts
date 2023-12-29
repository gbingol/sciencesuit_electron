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