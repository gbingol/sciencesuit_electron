"use strict";
var addon = require("./nodebind.node");
class Psychrometry {
    constructor(Keys, Values) {
        this.P = () => { return this._P; };
        this.Pw = () => { return this._Pw; };
        this.Pws = () => { return this._Pws; };
        this.Tdb = () => { return this._Tdb; };
        this.Twb = () => { return this._Twb; };
        this.Tdp = () => { return this._Tdp; };
        this.H = () => { return this._h; };
        this.RH = () => { return this._RH; };
        this.W = () => { return this._W; };
        this.Ws = () => { return this._Ws; };
        this.V = () => { return this._V; };
        this.to_html = (digits = 3) => {
            let s = "";
            s += "<b>P=</b>" + this.round(this.P(), digits) + " kPa <br>";
            s += "<b>T<sub>db</sub>=</b>" + this.round(this.Tdb(), digits) + " &deg;C <br>";
            s += "<b>T<sub>wb</sub>=</b>" + this.round(this.Twb(), digits) + " &deg;C <br>";
            s += "<b>T<sub>dp</sub>=</b>" + this.round(this.Tdp(), digits) + " &deg;C <br>";
            s += "<b>h=</b>" + this.round(this.H(), digits) + " kJ/kg da<br>";
            s += "<b>w=</b>" + this.round(this.W(), digits) + " kg/kg da <br>";
            s += "<b>RH=</b>" + this.round(this.RH(), digits) + " % <br>";
            s += "<b>V=</b>" + this.round(this.W(), digits) + " m<sup>3</sup> / kg da <br><br>";
            s += "<i>Other properties</i> <br>";
            s += "<b>P<sub>w</sub>=</b>" + this.round(this.Pw(), digits) + " kPa <br>";
            s += "<b>P<sub>ws</sub>=</b>" + this.round(this.Pws(), digits) + " kPa";
            return s;
        };
        if (!Array.isArray(Keys))
            throw ("First argument must be array");
        if (!Array.isArray(Values))
            throw ("Second argument must be array");
        let e = addon.psy(Keys, Values);
        this._P = e.p;
        this._Tdb = e.tdb;
        this._Twb = e.twb;
        this._Tdp = e.tdp;
        this._h = e.h;
        this._RH = e.rh;
        this._V = e.v;
        this._Pw = e.pw;
        this._Pws = e.pws;
        this._W = e.w;
        this._Ws = e.ws;
    }
    static Instance(obj) {
        return new Psychrometry(Object.keys(obj), Object.values(obj));
    }
    round(num, digits) {
        if (Number.isInteger(num))
            return num;
        return num.toFixed(digits);
    }
    to_str() {
        let s = "";
        s += "P=" + this.P() + " kPa \n";
        s += "Tdb=" + this.Tdb() + " °C \n";
        s += "Twb=" + this.Twb() + " °C \n";
        s += "Tdp=" + this.Tdp() + " °C \n";
        s += "h=" + this.H() + " kJ/kg da\n";
        s += "w=" + this.W() + " kg/kg da \n";
        s += "RH=" + this.RH() + " % \n";
        s += "V=" + this.W() + " m3 / kg da \n\n";
        s += "Other properties \n";
        s += "Pw=" + this.Pw() + " kPa \n";
        s += "Pws=" + this.Pws() + " kPa";
        return s;
    }
}
function cumtrapz(x, y) {
    if (!Array.isArray(x))
        throw ("x must be array");
    if (!Array.isArray(y))
        throw ("y must be array");
    return addon.cumtrapz(x, y);
}
function trapz(x, y, isCumulative = false) {
    //isCumulative = true, cumtrapz otherwise trapz
    if (!Array.isArray(x))
        throw ("x must be array");
    if (!Array.isArray(y))
        throw ("y must be array");
    return addon.trapz(x, y, isCumulative);
}
module.exports = { Psychrometry, trapz };
