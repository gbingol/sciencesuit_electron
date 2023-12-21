function ParseListPaths(str) {
    var arr = str.split("\n");
    arr.pop(); //the last element is with empty string
    var retObj = [];
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var s = arr_1[_i];
        s = s.trim();
        var start = s.indexOf(":");
        var end = s.indexOf(" ");
        var version = s.substring(start + 1, end);
        start = s.indexOf("*");
        var IsGlobal = false;
        if (start == -1)
            start = end;
        else {
            start += 1;
            IsGlobal = true; //has *
        }
        var path = s.substring(start);
        path = path.trim();
        retObj.push({ "version": version, "path": path, "global": IsGlobal });
    }
    return retObj;
}
function GenerateHTMLPythonList(output, div) {
    var Arr = ParseListPaths(output);
    var ol = div.appendChild(document.createElement("ol"));
    ol.className = "linespaced";
    var PyVersion = localStorage.getItem("pyversion");
    var PyPath = localStorage.getItem("pypath");
    var prevInput;
    var _loop_1 = function (obj) {
        var version = obj.version, path = obj.path, IsGlobal = obj.global;
        var li = ol.appendChild(document.createElement("li"));
        var input = li.appendChild(document.createElement("input"));
        input.type = "radio";
        input.name = "pyhome";
        input.id = version;
        input.value = path;
        var label = li.appendChild(document.createElement("label"));
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
            prevInput.parentElement.style.color = "inherit";
            evt.target.parentElement.style.color = "green";
            localStorage.setItem("pyversion", evt.target.id);
            localStorage.setItem("pypath", evt.target.value);
            if (input != prevInput)
                prevInput = input;
        };
    };
    for (var _i = 0, Arr_1 = Arr; _i < Arr_1.length; _i++) {
        var obj = Arr_1[_i];
        _loop_1(obj);
    }
}
var div = document.querySelector("#maincontent").appendChild(document.createElement("div"));
div.className = "PyHomes";
var pHeader = div.appendChild(document.createElement("p"));
pHeader.innerHTML = "Python Management";
pHeader.style.cssText = "text-align: center; color: red; font-weight: bold;";
var p_PyHomes = div.appendChild(document.createElement("p"));
window.api.runcmd("py --list-paths").
    then(function (output) {
    GenerateHTMLPythonList(output, div);
}).
    catch(function (error) {
    p.innerText = error;
});
