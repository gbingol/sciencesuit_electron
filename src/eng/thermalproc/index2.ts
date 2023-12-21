import * as np from '../../lib/sci_math';

const PAGEID = "THERMALPROC";

function FindAvg(arr:Array<number>)
{
	let x = []

	for(let i=1; i<arr.length; ++i)
		x.push((arr[i] + arr[i - 1]) / 2.0);

	return x;
}
	

function compute(
	t:Array<number>, 
	T:Array<number>, 
	Dval_time:number, 
	Dval_T:number, 
	zvalue:number, 
	Ref_T:number):Object
{
	if(t.length != T.length)
		throw new Error("Length of time and temperature data must be equal.");

	let temp = np.div(np.sub(Dval_T, T), zvalue);
	let DValue =  np.mul(Dval_time, np.pow(10.0, temp));

	temp = np.div(np.sub(T, Ref_T), zvalue);
	let LethalRate = np.pow(10.0, temp);

	let FValue = window.api.trapz(t, LethalRate, true);
	let dt = np.diff(t); 
	
	let avg_T = FindAvg(T);

	temp = np.div(np.sub(Dval_T, avg_T), zvalue);
	let DVal_avg =  np.mul(Dval_time, np.pow(10.0, temp));
	let LogRed = np.div(dt, DVal_avg);
	
	let TotalLogRed = np.cumsum(LogRed)
	TotalLogRed.splice(0, 0, 0.0); // at time=0 TotalLogRed(1)=0

	return {"LR":LethalRate, "D":DValue, "TotRed": TotalLogRed, "F":FValue};
}