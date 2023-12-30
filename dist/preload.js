"use strict";
const { contextBridge } = require('electron');
const path = require('node:path');
const { exec } = require('child_process');
const scicore = require('./cpp/sci_core.js');
var scinodebind = require("./cpp/nodebind.node");
let { PythonShell } = require('python-shell');
function dirname() {
    return __dirname;
}
function projdir() {
    return path.dirname(__dirname);
}
function runcmd(cmd) {
    return new Promise((resolve, reject) => {
        //@ts-ignore
        exec(cmd, (error, stdout, stderr) => {
            if (error)
                reject(error);
            else
                resolve(stdout);
        });
    });
}
function runpython(input, options, isstr = false) {
    if (!isstr)
        return PythonShell.run(input, options);
    return PythonShell.runString(input, options);
}
function psychrometry(k, v) {
    if (v !== undefined)
        return new scicore.Psychrometry(k, v);
    return scicore.Psychrometry.Instance(k);
}
function test_z(x, sd, mu, alternative, conflevel) {
    return scinodebind.test_z(x, sd, mu, alternative, conflevel);
}
function test_f(x, y, ratio = 1.0, alternative = "two.sided", conflevel = 0.95) {
    return scinodebind.test_f(x, y, ratio, alternative, conflevel);
}
function test_t1(x, mu, alternative = "two.sided", conflevel = 0.95) {
    return scinodebind.test_t1(x, mu, alternative, conflevel);
}
function test_t2(x, y, mu, varequal = true, alternative = "two.sided", conflevel = 0.95) {
    return scinodebind.test_t2(x, y, mu, varequal, alternative, conflevel);
}
function test_tpaired(x, y, mu, alternative = "two.sided", conflevel = 0.95) {
    return scinodebind.test_tpaired(x, y, mu, alternative, conflevel);
}
function pf(x, df1, df2) {
    return scinodebind.dist_pf(x, df1, df2);
}
function dnorm(x, mean = 0, sd = 1) {
    if (sd <= 0)
        throw new Error("sd >0 expected");
    return scinodebind.dist_dnorm(x, mean, sd);
}
const API = {
    dirname: dirname,
    projdir: projdir,
    runcmd: runcmd,
    runpython: runpython,
    //core functions
    psychrometry: psychrometry,
    stat: {
        //statistical tests
        test_z: test_z,
        test_f: test_f,
        test_t1: test_t1,
        test_t2: test_t2,
        test_tpaired: test_tpaired,
        //Statistical Distributions
        dist: {
            pf: pf,
            dnorm: dnorm
        }
    }
};
module.exports = { API };
contextBridge.exposeInMainWorld('api', API);
