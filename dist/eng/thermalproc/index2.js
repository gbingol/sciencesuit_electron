"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const np = __importStar(require("../../lib/sci_math"));
const idb_keyval_1 = require("idb-keyval");
const grid_1 = require("../../lib/ext/grid");
const PAGEID = "THERMALPROC";
function FindAvg(arr) {
    let x = [];
    for (let i = 1; i < arr.length; ++i)
        x.push((arr[i] + arr[i - 1]) / 2.0);
    return x;
}
function compute(t, T, Dval_time, Dval_T, zvalue, Ref_T) {
    if (t.length != T.length)
        throw new Error("Length of time and temperature data must be equal.");
    let temp = np.div(np.sub(Dval_T, T), zvalue);
    let DValue = np.mul(Dval_time, np.pow(10.0, temp));
    temp = np.div(np.sub(T, Ref_T), zvalue);
    let LethalRate = np.pow(10.0, temp);
    let FValue = window.api.trapz(t, LethalRate, true);
    let dt = np.diff(t);
    let avg_T = FindAvg(T);
    temp = np.div(np.sub(Dval_T, avg_T), zvalue);
    let DVal_avg = np.mul(Dval_time, np.pow(10.0, temp));
    let LogRed = np.div(dt, DVal_avg);
    let TotalLogRed = np.cumsum(LogRed);
    TotalLogRed.splice(0, 0, 0.0); // at time=0 TotalLogRed(1)=0
    return { "LR": LethalRate, "D": DValue, "TotRed": TotalLogRed, "F": FValue };
}
let ws_div = document.querySelector('#myGrid');
let ws = new grid_1.Worksheet(ws_div);
ws.init().then(gridOptions => { });
window.onload = (evt) => {
    (0, idb_keyval_1.get)(PAGEID).then(obj => {
        const inputs = document.querySelectorAll("#inputtable input");
        for (let input of inputs) {
            input.value = obj[input.id];
        }
    });
};
let btnCompute = document.querySelector("#compute");
btnCompute.onclick = ((evt) => {
    let txtz = document.querySelector("#zvalue");
    let txtd_temp = document.querySelector("#d_temp");
    let txtd_t = document.querySelector("#d_time");
    let txtRefT = document.querySelector("#t_ref");
    let txtTime = document.querySelector("#time");
    let txtTemperature = document.querySelector("#temperature");
    let txtDigits = document.querySelector("txtDigits");
    const inputs = document.querySelectorAll("#inputtable input");
    let storeObj = {};
    for (let input of inputs) {
        let Input = input;
        storeObj[Input.id] = Input.value;
    }
    try {
        if (txtz.value === "")
            throw new Error("z-value cannot be blank");
        if (txtd_temp.value === "")
            throw new Error("D(Temperature) cannot be blank");
        if (txtd_temp.value === "")
            throw new Error("D(time) cannot be blank");
        let zvalue = parseFloat(txtz.value);
        let Dvalue_Temp = parseFloat(txtd_temp.value);
        let Dvalue_Time = parseFloat(txtd_t.value);
        let RefTemp = parseFloat(txtRefT.value);
        let NDigits = parseInt(txtDigits.value);
        if (Dvalue_Time < 0 || Dvalue_Temp < 0 || zvalue < 0)
            throw new Error("Neither D-values nor z-value can be negative");
        let rng = new grid_1.Range(txtTime.value, ws);
        let time = rng.data[0];
        rng = new grid_1.Range(txtTemperature.value, ws);
        let range_T = rng.data;
        storeObj["t"] = time;
        storeObj["T"] = range_T;
        let Results = [];
        for (let T of range_T) {
            let s = `
				<table class='output'>
				<tr>
				<th>Time</th>
				<th>Temperature</th>
				<th>Lethality Rate</th>
				<th>D-value</th>
				<th>Total Log Red</th>
				<th>F-value</th>
				</tr>`;
            let obj = compute(time.map(e => parseFloat(e)), T.map(e => parseFloat(e)), Dvalue_Time, Dvalue_Temp, zvalue, RefTemp);
            let LR = obj.LR;
            let D = obj.D;
            let TotRed = obj.TotRed;
            let F = obj.F;
            for (let j = 0; j < LR.length; ++j) {
                s += "<tr>";
                s += ("<td>" + time[j] + "</td>" +
                    "<td>" + T[j] + "</td>" +
                    "<td>" + np.round(LR[j], NDigits) + "</td>" +
                    "<td>" + np.round(D[j], NDigits) + "</td>" +
                    "<td>" + np.round(TotRed[j], NDigits) + "</td>" +
                    "<td>" + np.round(F[j], NDigits) + "</td>");
                s += "</tr>";
            }
            s += "</table>";
            Results.push(s);
        }
        let str = "";
        for (let s of Results)
            str += s + "<p>&nbsp;</p>";
        (0, idb_keyval_1.set)(PAGEID, storeObj).
            then(reason => console.log(reason));
        let divCopy = document.createElement("div-copydel");
        let outDiv = document.querySelector("#maincontent").appendChild(divCopy);
        outDiv.innerHTML = str;
        outDiv.scrollIntoView();
    }
    catch (e) {
    }
});
