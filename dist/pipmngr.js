"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function InitTable(owner, headers) {
    let table = owner.appendChild(document.createElement("table"));
    let header = table.appendChild(document.createElement("thead"));
    let row = header.appendChild(document.createElement("tr"));
    for (let header of headers) {
        let col = row.appendChild(document.createElement("td"));
        col.innerHTML = header;
    }
    return table;
}
function DisableButtons(disable = true) {
    const AllBtns = document.body.getElementsByClassName("pip");
    for (let b of AllBtns) {
        if (b instanceof HTMLButtonElement)
            b.disabled = disable;
    }
}
function SetStatusText() {
    document.querySelector("#connection").innerHTML =
        window.navigator.onLine ? "<b>online</b>" : "<b>offline</b>";
}
const btnOutdated = document.querySelector('#btnOutdated');
btnOutdated.disabled = !window.navigator.onLine;
window.onload = (evt) => {
    SetStatusText();
    document.querySelector("#version").innerHTML =
        `<b>${localStorage.getItem("pyversion")}</b>`;
};
window.ononline = function (evt) {
    btnOutdated.disabled = !window.navigator.onLine;
    SetStatusText();
};
window.onoffline = function (evt) {
    btnOutdated.disabled = !window.navigator.onLine;
    SetStatusText();
};
btnOutdated.onclick = function (evt) {
    return __awaiter(this, void 0, void 0, function* () {
        const divModules = document.querySelector('#modules');
        divModules.innerHTML = "Working on it, this might take some time...";
        let divPip = document.querySelector("#pipoutput");
        divPip.innerText = "";
        let json;
        try {
            DisableButtons();
            let cmd = "py -" + localStorage.getItem("pyversion") + " -m pip list -o --format=json ";
            let output = yield window.api.runcmd(cmd);
            json = JSON.parse(output);
        }
        catch (e) {
            divModules.innerText = e;
            return false;
        }
        let fragment = document.createDocumentFragment();
        let table = InitTable(fragment, ["Name", "Current", "Latest", ""]);
        for (let i = 0; i < json.length; i++) {
            let e = json[i];
            let row = table.appendChild(document.createElement("tr"));
            let col1 = row.appendChild(document.createElement("td"));
            col1.innerHTML = e.name;
            let col2 = row.appendChild(document.createElement("td"));
            col2.innerHTML = e.version;
            let col3 = row.appendChild(document.createElement("td"));
            col3.innerHTML = e.latest_version;
            let col4 = row.appendChild(document.createElement("td"));
            let btnUpgrade = col4.appendChild(document.createElement("button"));
            btnUpgrade.id = "upgrade_" + e.name;
            btnUpgrade.innerHTML = "Upgrade";
            btnUpgrade.className = "pip";
            table.appendChild(row);
            btnUpgrade.onclick = (evt) => __awaiter(this, void 0, void 0, function* () {
                try {
                    DisableButtons();
                    divPip.innerText = "";
                    let UpgradeCmd = "py -" + localStorage.getItem("pyversion") +
                        " -m pip install --upgrade " + e.name;
                    let output = yield window.api.runcmd(UpgradeCmd);
                    divPip.scrollIntoView();
                    divPip.innerText = output;
                    DisableButtons(false);
                }
                catch (error) {
                    divPip.scrollIntoView();
                    divPip.innerText = error;
                }
            });
            DisableButtons(false);
        }
        divModules.innerHTML = "";
        divModules.appendChild(fragment);
    });
};
const btnInstalled = document.querySelector('#btnInstalled');
btnInstalled.onclick = function (evt) {
    return __awaiter(this, void 0, void 0, function* () {
        const divModules = document.querySelector('#modules');
        divModules.innerHTML = "Working on it...";
        let divPip = document.querySelector("#pipoutput");
        divPip.innerText = "";
        let json;
        try {
            DisableButtons();
            let cmd = "py -" + localStorage.getItem("pyversion") + " -m pip list --format=json ";
            let output = yield window.api.runcmd(cmd);
            json = JSON.parse(output);
        }
        catch (e) {
            divModules.innerText = e;
            return false;
        }
        let fragment = document.createDocumentFragment();
        let table = InitTable(fragment, ["Name", "Version", ""]);
        for (let i = 0; i < json.length; i++) {
            let e = json[i];
            let row = table.appendChild(document.createElement("tr"));
            let col1 = row.appendChild(document.createElement("td"));
            col1.innerHTML = e.name;
            let col2 = row.appendChild(document.createElement("td"));
            col2.innerHTML = e.version;
            let col3 = row.appendChild(document.createElement("td"));
            let btnInfo = col3.appendChild(document.createElement("button"));
            btnInfo.id = "info_" + e.name;
            btnInfo.innerHTML = "Info";
            btnInfo.className = "pip";
            let btnRemove = col3.appendChild(document.createElement("button"));
            btnRemove.id = "remove_" + e.name;
            btnRemove.innerHTML = "Uninstall";
            btnRemove.className = "pip";
            table.appendChild(row);
            btnInfo.disabled = !window.navigator.onLine;
            btnInfo.onclick = (evt) => __awaiter(this, void 0, void 0, function* () {
                try {
                    DisableButtons();
                    divPip.innerText = "";
                    let ShowCmd = "py -" + localStorage.getItem("pyversion") +
                        " -m pip show " + e.name;
                    let output = yield window.api.runcmd(ShowCmd);
                    divPip.scrollIntoView();
                    divPip.innerText = output;
                    DisableButtons(false);
                }
                catch (error) {
                    divPip.scrollIntoView();
                    divPip.innerText = error;
                }
            });
            btnRemove.onclick = (evt) => __awaiter(this, void 0, void 0, function* () {
                try {
                    divPip.innerText = "";
                    DisableButtons();
                    let remCmd = "py -" + localStorage.getItem("pyversion") +
                        " -m pip uninstall -y " + e.name;
                    let output = yield window.api.runcmd(remCmd);
                    divPip.scrollIntoView();
                    divPip.innerText = output;
                    DisableButtons(false);
                }
                catch (error) {
                    divPip.scrollIntoView();
                    divPip.innerText = error;
                    DisableButtons(false);
                }
            });
            DisableButtons(false);
        }
        divModules.innerHTML = "";
        divModules.appendChild(fragment);
    });
};
