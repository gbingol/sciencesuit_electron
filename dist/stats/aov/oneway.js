import { Worksheet, Range } from "../../lib/comp/grid.js";
import * as util from "../../lib/util.js";
import { get, set } from "../../../node_modules/idb-keyval/dist/index.js";
import { aov_oneway } from "../../lib/aov.js";
const PAGEID = "AOV_ONEWAY";
const WSKEY = PAGEID + "_WS";
let UserInputs = new Map();
let ws_div = document.querySelector('#myGrid');
let ws = new Worksheet(ws_div);
ws.init().then(gridOptions => {
    get(WSKEY).then((value) => {
        if (value !== undefined && value.length > 0)
            ws.loadData(value);
    });
});
window.onload = (evt) => {
    get(PAGEID).then((value) => {
        if (value === undefined)
            return;
        const inputs = document.querySelectorAll("#inputtable input, select");
        for (let input of inputs) {
            if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement)
                input.value = value.get(input.id);
        }
    });
};
let btnCompute = document.querySelector("#compute");
btnCompute.onclick = ((evt) => {
    let txtresponse = document.querySelector("#response");
    let txtfactors = document.querySelector("#factors");
    let txtconflevel = document.querySelector("#conflevel");
    let chkStacked = document.querySelector("#stacked");
    let chkTukey = document.querySelector("#tukey");
    const inputs = document.querySelectorAll("#inputtable input, select");
    for (let input of inputs) {
        if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement) {
            if (!input.disabled && input.value === "")
                throw new Error("All entries must have valid values");
            UserInputs.set(input.id, input.value);
        }
    }
    try {
        let conflevel = parseFloat(txtconflevel.value);
        let IsStacked = chkStacked.checked;
        let IsTukey = chkTukey.checked;
        let NDigits = parseInt(document.querySelector("#txtDigits").value);
        if (conflevel < 0 || conflevel > 100)
            throw new Error("Confidence level must be [0, 100]");
        let rng = new Range(txtresponse.value, ws);
        if (IsStacked == false && rng.ncols < 3)
            throw new Error(`Range contains ${rng.ncols} columns. At least 3 expected!`);
        let responses = [];
        for (let d of rng.data)
            responses.push(util.FilterNumbers(d));
        let results = aov_oneway(responses);
        console.log(results);
        return;
        let s = "<table>";
        s += "</table>";
        let divCopy = document.createElement("div-copydel");
        let outDiv = document.querySelector("#maincontent").appendChild(divCopy);
        outDiv.innerHTML = s;
        outDiv.scrollIntoView();
        set(PAGEID, UserInputs).then(() => console.log(""));
        set(WSKEY, ws.getDataCells()).then(() => console.log(""));
    }
    catch (e) {
        let msgBox = document.createElement("div-transientpopwnd");
        //@ts-ignore
        msgBox.timeout = 3500;
        //@ts-ignore
        msgBox.innerHTML = e;
        document.body.appendChild(msgBox);
    }
});
