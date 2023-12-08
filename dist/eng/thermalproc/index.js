import {CWorksheet, CRange} from '../../../renderer/ag_grid.js';
import * as np from "../../js/sci_math.js";

function FindAvg(arr)
{
	let x = []

	for(let i=1; i<arr.length; ++i)
		x.push((arr[i] + arr[i - 1]) / 2.0);

	return x;
}
	
/**
@param {Array} t
@param {Array} T
*/
function compute(t, T, Dval_time, Dval_T, zvalue, Ref_T)
{
	if(t.length != T.length)
		throw new Error("Length of time and temperature data must be equal.");

	let temp = np.div(np.sub(Dval_T - T), zvalue);
	let DValue =  np.mul(Dval_time, np.pow(10.0, temp));

	temp = np.div(np.sub(T - Ref_T), zvalue);
	let LethalRate = np.pow(10.0, temp);

	let FValue = window.api.trapz(t, LethalRate, true);
	let dt = np.diff(t); 
	
	let avg_T = FindAvg(T);

	temp = np.div(np.sub(Dval_T - avg_T), zvalue);
	let DVal_avg =  np.mul(Dval_time, np.pow(10.0, temp));
	let LogRed = np.div(dt, DVal_avg);
	
	let TotalLogRed = np.cumsum(LogRed)
	TotalLogRed.splice(0, 0, 0.0); // at time=0 TotalLogRed(1)=0

	return [LethalRate, DValue, TotalLogRed, FValue]
}

	
let ws_div = document.querySelector('#myGrid');
let ws = new CWorksheet(ws_div);
ws.
ws.init().then(gridOptions=> {
	
	});

let btn = document.querySelector("#btn");
btn.onclick = ((evt)=>
{
	let rng = new CRange("A1:B3", ws);
	console.log(rng.data);
	console.log(rng.ncols)
	console.log(rng.nrows)
});

let txtz = document.querySelector("#zvalue");
let txtd_temp = document.querySelector("#d_temp")
let txtd_t = document.querySelector("#d_time");
let txtRefT = document.querySelector("#t_ref");

	let zvalue = parsefloat(txtz.value)
	let Dvalue_Temp = parsefloat(txtd_temp.value)
	let Dvalue_Time = parsefloat(txtd_t.value)
	let RefTemp = parsefloat(txtRefT.value)