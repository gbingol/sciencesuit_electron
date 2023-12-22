"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
const child_process_1 = require("child_process");
const sci_core_1 = require("./lib/sci_core");
const python_shell_1 = require("python-shell");
//Run a termina command
function RunCmd(cmd) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(cmd, (error, stdout, stderr) => {
            if (error)
                reject(error);
            else
                resolve(stdout);
        });
    });
}
function RunPython(input, options, isstr = false) {
    if (!isstr)
        return python_shell_1.PythonShell.run(input, options);
    return python_shell_1.PythonShell.runString(input, options);
}
function psychrometry(k, v = undefined) {
    if (v != undefined && Array.isArray(k) && Array.isArray(v))
        return new sci_core_1.Psychrometry(k, v);
    return sci_core_1.Psychrometry.Instance(k);
}
exports.API = {
    dirname: () => { return __dirname; },
    projdir: () => { return node_path_1.default.dirname(__dirname); },
    runcmd: (cmd) => { return RunCmd(cmd); },
    runpython: (file, options, isstr = false) => { return RunPython(file, options, isstr); },
    psychrometry: (k, v) => { return psychrometry(k, v); },
    trapz: (x, y, isCumulative = false) => { return (0, sci_core_1.trapz)(x, y, isCumulative); },
};
electron_1.contextBridge.exposeInMainWorld('api', exports.API);
