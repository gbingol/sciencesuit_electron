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
