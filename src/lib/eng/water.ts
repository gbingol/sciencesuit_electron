import { polyval } from "../util.js";

/**** Thermo-physical properties of water. ****/

export class Water
{
	private m_T:number;

	constructor(T:number)
	{
		//T in Celcius
		this.m_T = T;
	}

	cp = ()=>
	{
		/*
		Thermo-physical properties are valid in the range of -40<=T(C) <=150
		2006, ASHRAE Handbook Chapter 9, Table 1 (source: Choi and Okos (1986))
		*/
		let Cp_w = [4.1289, -9.0864e-05, 5.4731e-06];
		let T = this.m_T;

		return polyval(T, Cp_w);
	}

	conductivity = ()=>
	{
		//Thermal conductivity, result W/mK
		let k_w = [0.57109, 0.0017625, -6.7036e-06];
		let T = this.m_T;

		return polyval(T, k_w);
	}

	density = ()=>
	{
		//returns kg/m3

		let rho_w = [997.18, 0.0031439, -0.0037574];
		let T = this.m_T;

		return polyval(T, rho_w);
	}

	viscosity = ()=>
	{
		/*
		returns Pa*s
		
		## Reference:
		Joseph Kestin, Mordechai Sokolov, and William A. Wakeham
		Viscosity of liquid water in the range -8°C to 150°C
		Journal of Physical and Chemical Reference Data 7, 941 (1978);	
		*/
		let T = this.m_T;
		let mu_ref=1002; //micro-Pascal*second (at 20C)
		
		let temp1 =(20-T)/(T+96)*(1.2378-0.001303*(20-T)+0.00000306*(20-T)**2+0.0000000255*(20-T)**3);
		let mu = 10**temp1*mu_ref //micro-Pascal*second
	
		return mu/1E6
	}

	Prandtl = ()=>
	{
		//Prandtl number
		return this.cp()*this.viscosity()/this.conductivity()*1000
	}
}
