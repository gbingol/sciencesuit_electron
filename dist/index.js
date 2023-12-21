"use strict";
function ParseListPaths(str) {
    const arr = str.split("\n");
    arr.pop(); //the last element is with empty string
    let retObj = [];
    for (let s of arr) {
        s = s.trim();
        let start = s.indexOf(":");
        let end = s.indexOf(" ");
        let version = s.substring(start + 1, end);
        start = s.indexOf("*");
        let IsGlobal = false;
        if (start == -1)
            start = end;
        else {
            start += 1;
            IsGlobal = true; //has *
        }
        let path = s.substring(start);
        path = path.trim();
        retObj.push({ "version": version, "path": path, "global": IsGlobal });
    }
    return retObj;
}
function GenerateHTMLPythonList(output, div) {
    const Arr = ParseListPaths(output);
    let ol = div.appendChild(document.createElement("ol"));
    ol.className = "linespaced";
    let PyVersion = localStorage.getItem("pyversion");
    let PyPath = localStorage.getItem("pypath");
    let prevInput;
    for (let obj of Arr) {
        let version = obj.version, path = obj.path, IsGlobal = obj.global;
        let li = ol.appendChild(document.createElement("li"));
        let input = li.appendChild(document.createElement("input"));
        input.type = "radio";
        input.name = "pyhome";
        input.id = version;
        input.value = path;
        let label = li.appendChild(document.createElement("label"));
        label.htmlFor = input.id;
        label.innerHTML = path;
        if (IsGlobal && PyVersion === null) {
            localStorage.setItem("pyversion", input.id);
            localStorage.setItem("pypath", input.value);
            input.checked = true;
            prevInput = input;
            li.style.color = "green";
        }
        if (PyVersion !== null) {
            input.checked = (PyVersion == input.id);
            if (input.checked)
                prevInput = input;
            li.style.color = input.checked ? "green" : "inherit";
        }
        input.onchange = function (evt) {
            if (prevInput.parentElement)
                prevInput.parentElement.style.color = "inherit";
            if (evt.target instanceof HTMLElement && evt.target.parentElement instanceof HTMLElement)
                evt.target.parentElement.style.color = "green";
            if (evt.target instanceof HTMLInputElement) {
                localStorage.setItem("pyversion", evt.target.id);
                localStorage.setItem("pypath", evt.target.value);
            }
            if (input != prevInput)
                prevInput = input;
        };
    }
}
let div = document.querySelector("#maincontent").appendChild(document.createElement("div"));
div.className = "PyHomes";
let pHeader = div.appendChild(document.createElement("p"));
pHeader.innerHTML = "Python Management";
pHeader.style.cssText = "text-align: center; color: red; font-weight: bold;";
let p_PyHomes = div.appendChild(document.createElement("p"));
window.api.runcmd("py --list-paths").
    then((output) => {
    GenerateHTMLPythonList(output, div);
}).
    catch(error => {
    //p.innerText=error;
});
