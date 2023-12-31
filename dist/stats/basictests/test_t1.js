import { Worksheet, Range } from "../../lib/comp/grid.js";
import * as np from "../../lib/sci_math.js";
import * as util from "../../lib/util.js";
import { get, set } from "../../../node_modules/idb-keyval/dist/index.js";
const PAGEID = "TESTT1";
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
    let txtxdata = document.querySelector("#x");
    let txtmu = document.querySelector("#mu");
    let txtconflevel = document.querySelector("#conflevel");
    let selalternative = document.querySelector("#alternative");
    const inputs = document.querySelectorAll("#inputtable input, select");
    for (let input of inputs) {
        if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement) {
            if (input.value === "")
                throw new Error("All entries must have valid values");
            UserInputs.set(input.id, input.value);
        }
    }
    try {
        let mu = parseFloat(txtmu.value);
        let conflevel = parseFloat(txtconflevel.value);
        let alternative = selalternative.value;
        let NDigits = parseInt(document.querySelector("#txtDigits").value);
        if (conflevel < 0 || conflevel > 100)
            throw new Error("Confidence level must be [0, 100]");
        let rng = new Range(txtxdata.value, ws);
        if (rng.ncols != 1)
            throw new Error(`Range contains ${rng.ncols} columns. 1 expected!`);
        let xdata = util.FilterNumbers(rng.data[0]);
        let results = window.api.stat.test_t1(xdata, mu, alternative, conflevel / 100);
        let s = `
			<table>
			<tr>
			<th>N</th>
			<th>Average</th>
			<th>stdev</th>
			<th>SE Mean</th>
			<th>T</th>
			<th>p-value</th>
			</tr>`;
        s += "<tr>";
        s += "<td>" + results.N + "</td>";
        s += "<td>" + np.round(results.mean, NDigits) + "</td>";
        s += "<td>" + np.round(results.stdev, NDigits) + "</td>";
        s += "<td>" + np.round(results.SE, NDigits) + "</td>";
        s += "<td>" + np.round(results.tcritical, NDigits) + "</td>";
        s += "<td>" + np.round(results.pvalue, NDigits) + "</td>";
        s += "</tr>";
        s += "<tr>";
        s += "<td colspan=6>" + txtconflevel.value + "% Confidence Interval (" +
            np.round(results.CI_lower, NDigits) + ", " + np.round(results.CI_upper, NDigits) + ")</td>";
        s += "</tr></table>";
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
