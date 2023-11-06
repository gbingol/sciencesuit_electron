var addon = require('./bindings.js')('nodebind');

class Psychrometry
{
	/**
	 * @param {Array} Keys
	 * @param {Array} Values
	 * @returns {null}
	 */
	constructor(Keys, Values)
	{
		if (!Array.isArray(Keys))
			throw ("First argument must be array");

		if (!Array.isArray(Values))
			throw ("Second argument must be array");

		let jsonstr = addon.psy(Keys, Values, "json");
		let e = JSON.parse(jsonstr);

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

	P = () => { return this._P; }
	Pw = () => { return this._Pw; }
	Pws = () => { return this._Pws; }

	Tdb = () => { return this._Tdb; }
	Twb = () => { return this._Twb; }
	Tdp = () => { return this._Tdp; }
	
	H = () => { return this._h; }
	
	RH = () => { return this._RH; }

	W = () => { return this._W; }
	Ws = () => { return this._Ws; }

	V = () => { return this._V; }


	/**
	 * @returns {string}
	 */
	to_html = () =>
	{
		let s = "";
			
		s += "<b>P=</b>" + this.P() + " kPa <br>";
		s += "<b>T<sub>db</sub>=</b>" + this.Tdb() + " &deg;C <br>";
		s += "<b>T<sub>wb</sub>=</b>" + this.Twb() + " &deg;C <br>";
		s += "<b>T<sub>dp</sub>=</b>" + this.Tdp() + " &deg;C <br>";
		s += "<b>h=</b>" + this.H() + " kJ/kg da<br>";
		s += "<b>w=</b>" + this.W() + " kg/kg da <br>";
		s += "<b>RH=</b>" + this.RH() + " % <br>";
		s += "<b>V=</b>" + this.W() + " m<sup>3</sup> / kg da <br><br>";

		s += "<i>Other properties</i> <br>"
		s += "<b>P<sub>w</sub>=</b>" + this.Pw() + " kPa <br>";
		s += "<b>P<sub>ws</sub>=</b>" + this.Pws() + " kPa";

		return s;
	}

	/**
	 * @returns {string}
	 */
	to_str()
	{
		let s = "";
			
		s += "P=" + this.P() + " kPa \n";
		s += "Tdb=" + this.Tdb() + " °C \n";
		s += "Twb=" + this.Twb() + " °C \n";
		s += "Tdp=" + this.Tdp() + " °C \n";
		s += "h=" + this.H() + " kJ/kg da\n";
		s += "w=" + this.W() + " kg/kg da \n";
		s += "RH=" + this.RH() + " % \n";
		s += "V=" + this.W() + " m3 / kg da \n\n";

		s += "Other properties \n"
		s += "Pw=" + this.Pw() + " kPa \n";
		s += "Pws=" + this.Pws() + " kPa";

		return s;
	}

}

module.exports = { Psychrometry };
