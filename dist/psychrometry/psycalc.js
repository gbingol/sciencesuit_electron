"use strict";
const btn = document.getElementById('compute');
const chkP = document.getElementById('chkP');
const chkTdb = document.getElementById('chkTdb');
const chkTwb = document.getElementById('chkTwb');
const chkTdp = document.getElementById('chkTdp');
const chkW = document.getElementById('chkW');
const chkRH = document.getElementById('chkRH');
const chkH = document.getElementById('chkH');
const chkV = document.getElementById('chkV');
const txtP = document.getElementById('txtP');
const txtTdb = document.getElementById('txtTdb');
const txtTwb = document.getElementById('txtTwb');
const txtTdp = document.getElementById('txtTdp');
const txtW = document.getElementById('txtW');
const txtRH = document.getElementById('txtRH');
const txtH = document.getElementById('txtH');
const txtV = document.getElementById('txtV');
const txtDigits = document.getElementById('txtDigits');
const elems = [
    ["p", chkP, txtP],
    ["tdb", chkTdb, txtTdb], ["twb", chkTwb, txtTwb], ["tdp", chkTdp, txtTdp],
    ["w", chkW, txtW], ["rh", chkRH, txtRH],
    ["h", chkH, txtH],
    ["v", chkV, txtV]
];
let NChecked = 0;
let table = document.getElementById("inputtable");
table.addEventListener("click", (evt) => {
    var _a;
    let elem = evt.target;
    if (elem.type === "checkbox") {
        elem.checked ? NChecked++ : NChecked--;
        let infoDiv = document.querySelector("#info");
        infoDiv.style.display = NChecked != 3 ? "inline" : "none";
        infoDiv.innerHTML = `<b>${3 - NChecked}</b> selections must be made`;
        btn.disabled = (NChecked != 3);
        let txt = (_a = elems.find((entry) => entry[1] == elem)) === null || _a === void 0 ? void 0 : _a[2];
        txt.required = elem.checked;
        for (let i = 0; i < elems.length; ++i) {
            let chk = elems[i][1];
            let txt = elems[i][2];
            let condition = (NChecked == 3) && !chk.checked;
            txt.disabled = condition;
            chk.disabled = condition;
        }
    }
});
btn.addEventListener("click", (evt) => {
    let infoDiv = document.querySelector("#info");
    let Keys = [], Vals = [];
    for (let i = 0; i < elems.length; ++i) {
        let lbl = elems[i][0];
        let chk = elems[i][1];
        let txt = elems[i][2];
        if (txt.required && txt.value === "") {
            infoDiv.style.display = "inline";
            infoDiv.innerHTML = "Value is missing.";
            txt.focus();
            return true;
        }
        if (chk.checked) {
            let val = parseFloat(txt.value);
            if (isNaN(val)) {
                infoDiv.style.display = "inline";
                infoDiv.innerHTML = "<b>" + txt.value + "</b> is not a number";
                txt.focus();
                return true;
            }
            Keys.push(lbl);
            Vals.push(lbl === "p" ? val * 1000 : val);
        }
    }
    let digits = parseInt(txtDigits.value);
    if (digits < 1 || digits > 6) {
        infoDiv.style.display = "inline";
        infoDiv.innerHTML = "Digits must be in [1, 6]";
        return true;
    }
    try {
        let p = window.api.psychrometry(Keys, Vals);
        let outDiv = document.querySelector("#maincontent").
            appendChild(document.createElement("div-copydel"));
        outDiv.innerHTML = p.to_html(digits);
        outDiv.scrollIntoView();
        infoDiv.style.display = "none";
    }
    catch (e) {
        infoDiv.style.display = "inline";
        infoDiv.innerHTML = e;
    }
});
