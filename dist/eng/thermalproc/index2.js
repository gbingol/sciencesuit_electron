"use strict";
const PAGEID = "THERMALPROC";
function FindAvg(arr) {
    let x = [];
    for (let i = 1; i < arr.length; ++i)
        x.push((arr[i] + arr[i - 1]) / 2.0);
    return x;
}
