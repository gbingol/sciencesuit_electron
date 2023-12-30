"use strict";
const { contextBridge } = require('electron');
const path = require('node:path');
const { exec } = require('child_process');
const scicore = require('./cpp/sci_core.js');
const stattests = require('./cpp/sci_stat_tests.js');
const statdists = require('./cpp/sci_stat_tests.js');
let { PythonShell } = require('python-shell');
//Run a termina command
function RunCmd(cmd) {
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
const API = {
    dirname: () => {
        return __dirname;
    },
    projdir: () => {
        return path.dirname(__dirname);
    },
    runcmd: (cmd) => {
        return RunCmd(cmd);
    },
    runpython: (input, options, isstr = false) => {
        if (!isstr)
            return PythonShell.run(input, options);
        return PythonShell.runString(input, options);
    },
    psychrometry: (k, v) => {
        if (v !== undefined)
            return new scicore.Psychrometry(k, v);
        return scicore.Psychrometry.Instance(k);
    },
    test_z: (x, sd, mu, alternative, conflevel) => {
        return stattests.test_z(x, sd, mu, alternative, conflevel);
    },
    test_f: (x, y, ratio = 1.0, alternative = "two.sided", conflevel = 0.95) => {
        return stattests.test_f(x, y, ratio, alternative, conflevel);
    },
    test_t1: (x, mu, alternative = "two.sided", conflevel = 0.95) => {
        return stattests.test_t1(x, mu, alternative, conflevel);
    },
    test_t2: (x, y, mu, varequal = true, alternative = "two.sided", conflevel = 0.95) => {
        return stattests.test_t2(x, y, mu, varequal, alternative, conflevel);
    },
    test_tpaired: (x, y, mu, alternative = "two.sided", conflevel = 0.95) => {
        return stattests.test_tpaired(x, y, mu, alternative, conflevel);
    },
    dist: {
        pf: (x, df1, df2) => {
            return statdists.dist_pf(x, df1, df2);
        }
    }
};
module.exports = { API };
contextBridge.exposeInMainWorld('api', API);
