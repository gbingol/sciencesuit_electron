import { Worksheet, Range } from "../lib/comp/grid.js";
import { get, set } from "../../node_modules/idb-keyval/dist/index.js";
import { GetAlternative } from "../lib/util.js";
const PAGEID = "TESTT2";
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
    let txtxdata = document.querySelector("#xdata");
    let txtydata = document.querySelector("#ydata");
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
        let xdata = rng.data[0].map(e => parseFloat(e));
        rng = new Range(txtydata.value, ws);
        let ydata = rng.data[0].map(e => parseFloat(e));
        let results = window.api.test_t2(xdata, ydata, mu, false, GetAlternative(alternative), conflevel / 100);
        let s = `
			<table class='output'>
			<tr>
			<th>N</th>
			<th>Average</th>
			<th>stdev</th>
			<th>SE Mean</th>
			<th>T</th>
			<th>p-value</th>
			</tr>`;
        s += "<tr>";
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
