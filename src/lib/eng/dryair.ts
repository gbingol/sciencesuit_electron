
//Properties of dry air
export class Air
{
	private m_T:number;
	private m_P:number;
	private m_Z:number;

	constructor(T:number, P:number = 101325, Z:number = 1.0)
	{
		/*
		T: Temperature (K) \n
		P : Pressure (Pa) \n
		Z: Compressibility factor
		*/
		if(T<=0) throw new Error("T>0 expected");
		if(P<=0) throw new Error("P>0 expected");
		if(Z<=0) throw new Error("Z>0 expected");

		this.m_T = T;
		this.m_P = P;
		this.m_Z = Z;
	}

	cp = ()=>
	{
		/*
		returns kJ/kgK, does not take P and Z into account
		
		## Reference:
		Poling et al (2001). Properties of gases and liquids, 5th ed, McGraw-Hill
		*/
		let T = this.m_T
		return (1030.5-0.19975*T + 0.00039734*T**2)/1000
	}

	k =()=>
	{
		/*
		returns W/mK, does not take P and Z into account
		
		## Reference:
		Poling et al (2001). Properties of gases and liquids, 5th ed, McGraw-Hill
		*/
		let T = this.m_T;
		return (0.002334*T**1.5)/(164.54 + T)
	}

	conductivity = ()=>
	{
		//Alias for member func k()
		return this.k();
	}

	mu = ()=>
	{
		/*
		returns Pa s, does not take P and Z into account
		
		## Reference:
		Sutherland equation
		*/
		let T = this.m_T;
		return (1.4592*T**1.5)/(109.1+T)*0.000001
	}

	viscosity = () =>
	{
		return this.mu();
	}

	Pr = ()=>
	{
		//Prandtl number
		return this.cp()*this.mu()/this.k()*1000
	}

	rho = ()=>
	{
		//returns kg/m3, uses ideal gas equation with Z

		let R = 287.0500676 //J/ (kg K)
		return this.m_P/(R*this.m_T*this.m_Z)
	}

	density = ()=>
	{
		//Alias for rho()
		return this.rho()
	}
}