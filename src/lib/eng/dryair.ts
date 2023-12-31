
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
}

/*
class Air:
		
	def k(self):
		"""
		returns W/mK, does not take P and Z into account
		
		## Reference:
		Poling et al (2001). Properties of gases and liquids, 5th ed, McGraw-Hill
		"""
		T=self._T
		return (0.002334*T**1.5)/(164.54+T)
	
	def conductivity(self):
		"""Alias for member func k()"""
		return self.k()
	

	def mu(self):
		"""
		returns Pa s, does not take P and Z into account
		
		## Reference:
		Sutherland equation
		"""
		T = self._T
		return (1.4592*T**1.5)/(109.1+T)*0.000001
	
	def viscosity(self):
		"""Alias for mu()"""
		return self.mu()


	def Pr(self):
		"""Prandtl number"""
		return self.cp()*self.mu()/self.k()*1000
	

	def rho(self):
		"""returns kg/m3, uses ideal gas equation with Z"""
		R = 287.0500676 #J/ (kg K)
		return self._P/(R*self._T*self._Z)
	
	def density(self):
		"""Alias for rho()"""
		return self.rho()
*/