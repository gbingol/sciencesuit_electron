"use strict";
function createCSS() {
    let link = document.head.appendChild(document.createElement("link"));
    link.href = window.api.dirname() + "/" + "css/common.css";
    link.rel = "stylesheet";
}
function sidePanel() {
    let mBar = document.body.appendChild(document.createElement("div"));
    mBar.id = "_sidepanel";
    return mBar;
}
function DesktopMenu(mBar) {
    let links = [
        { "href": "index.html", "lbl": "Home" },
        { "href": "eng/psychrometry/index.html", "lbl": "Psychrometry" },
        { "href": "eng/thermalproc/index.html", "lbl": "Thermal Proc" },
        { "href": "pipmngr.html", "lbl": "PIP" },
    ];
    for (let lnk of links) {
        let a = mBar.appendChild(document.createElement("a"));
        a.innerHTML = lnk.lbl;
        a.href = window.api.dirname() + "/" + lnk.href;
    }
}
let pnl = sidePanel();
createCSS();
DesktopMenu(pnl);
