import { isclose } from "../sci_math.js";



/*
Tolerance for temperature differences
if less than tolerance food's temperatures assumed equal
*/
const T_TOL = 0.1



type Ingredient = 
{
	water?:number;
	cho?: number;
	protein?:number;
	lipid?: number;
	ash?: number;
	salt?: number
}


export class Food
{
	private m_Ingredients:Ingredient;
	private m_T:number;
	private m_Weight:number;

	constructor(f: Ingredient)
	{
		/*
		## Input: 
		water, cho, protein, lipid, ash, salt: % or fractions (must be consistent)

		## Example:
		f1 = Food(cho=30, water=70) \n
		f2 = Food(cho=0.3, water=0.7)
		*/
		let LessThanZero = Object.values(f).filter(e=>e<0)
		if(LessThanZero.length>0)
			throw new Error("All ingredients must have non-negative values");

		this.m_Ingredients = {...f};

		/*
		User does not necessarily provide values where total fraction is exactly 1.0
		Therefore it is adjusted so that total fraction is ALWAYS exactly 1.0
		
		Note that even if the values were percentages, dividing them
		by sum forces it to be in the range of [0, 1]
		*/
		let Sum = Object.values(this.m_Ingredients).reduce((acc, e) => acc + e, 0);
		if(Sum<=0)
			throw new Error("At least one ingredient must be present");

		for(const property in this.m_Ingredients)
		{
			if(this.m_Ingredients.hasOwnProperty(property))
			{
				let p = property as keyof Ingredient;
				this.m_Ingredients[p]= (this.m_Ingredients[p] as number)/ Sum;
			}
		}

		this.m_T = 20.0 // C
		this.m_Weight = 1.0 //Unit weight
	}


	eq = (other:Food):boolean =>
	{		
		if (typeof(this) !== typeof(other))
			return false;

		let fA = this.m_Ingredients;
		let fB = other.m_Ingredients;

		for(let e in fA)
		{
			let prop = e as keyof Ingredient;
			//if B does not have the same ingredient A has, then A and B cant be same

			if(fB[prop] === undefined)
				return false;

			if(!isclose(fA[prop] as number, fB[prop] as number, T_TOL))
				return false;
		}
			
		return true;
	}


	//similar to mixing of two food items
	add =(rhs:Food):Food=>
	{
		let ma = this.weight;
		let mb = rhs.weight;

		let Ta = this.T;
		let Tb = rhs.T;
		
		let cpa = this.cp();
		let cpb = rhs.cp();

		let water = ma*this.water + mb*rhs.water;
		let cho = ma*this.cho + mb*rhs.cho;
		let lipid = ma*this.lipid + mb*rhs.lipid;
		let protein = ma*this.protein + mb*rhs.protein;
		let ash = ma*this.ash + mb* rhs.ash;
		let salt = ma*this.salt + mb* rhs.salt;

		let NewIngredient:Ingredient = 
		{
			water:water, cho:cho, lipid:lipid, protein:protein, ash:ash, salt:salt
		}

		let fd = new Food(NewIngredient);
		fd.weight= ma + mb
	
		/*
		if the other food's temperature is negligibly different (Ta=10, Tb=10.1)
		then mixtures temperature is one of the food items' temperature
		*/
		if(isclose(Ta, Tb, T_TOL))
			fd.T = Ta
		else
		{
			let mtot = ma + mb
			let e1 = ma*cpa*Ta;
			let e2 = mb*cpb*Tb;

			let cp_avg = (ma*cpa + mb*cpb) / mtot;
			let Tmix = (e1 + e2)/(mtot*cp_avg);

			fd.T = Tmix;
		}

		return fd;
	}


	sub = (B:Food):Food=>
	{

		if(typeof(this) !== typeof(B))
			throw new Error("Foods must have same type.");

		let ma = this.weight;
		let mb = B.weight;

		if(ma<mb)
			throw new Error("weight A > weight B expected.");

		let Ta = this.T;
		let Tb = B.T;
		
		if(!isclose(Ta, Tb, T_TOL))
			throw new Error("Temperature differences must be negligible.");

		let fA  = this.m_Ingredients;
		let fB = B.m_Ingredients;

		//A must have all the ingredients B has, check if it is the case
		for(let key of Object.keys(fB))
		{
			let k = key as keyof Ingredient;
			if(fA[k] === undefined)
				throw new Error("Food does not have an ingredient:" + key);
		} 
		
		
		//collect ingredients in a dictionary
		let ingDict:Ingredient = {};

		for(let key of Object.keys(fA))
		{
			let k = key as keyof Ingredient;
			let _ing = 0;
			if(fB[k] !== undefined)
			{
				_ing = ma*(fA[k] as number) - mb*(fB[k] as number);
				if(_ing<0)
					throw new Error("Weigt of " + key + "must be >0.");

				if(isclose(_ing, 0.0)) _ing = 0.0;
			}
			else
				_ing = ma*(fA[k] as number);

			ingDict[k] = _ing;
		} 

		let fd = new Food(ingDict);
		fd.weight = ma-mb

		return fd;
	}


	mul = (m:number):Food=>
	{
		let ing = this.m_Ingredients;

		let f = new Food(ing);
		f.weight = this.weight*m;

		return f
	}



	cp = (T?: number):number=>
	{
		/*
		If T (in °C) is not specified then Food's current temperature will be used.\n
		Returns specific heat capacity in kJ/kgK

		Thermo-physical properties are valid in the range of -40<=T(C) <=150
		2006, ASHRAE Handbook Chapter 9, Table 1 (source: Choi and Okos (1986))
		*/
		let w = (x:number) => 4.1289 -9.0864e-05*x + 5.4731e-06*x**2;
		let p = (x:number) => 2.0082 + 0.0012089*x -1.3129e-06*x**2;
		let f = (x:number)=> 1.9842 + 0.0014733*x -4.8008e-06*x**2;
		let cho_ = (x:number)=> 1.5488 + 0.0019625*x - 5.9399e-06*x**2;
		let ash_ =  (x:number)=> 1.0926 + 0.0018896*x -3.6817e-06*x**2;
		let salt_ =  0.88

		let t = (T === undefined) ?  this.m_T : T;

		let water = this.m_Ingredients.water || 0;
		let protein = this.m_Ingredients.protein || 0;
		let lipid = this.m_Ingredients.lipid || 0;
		let cho = this.m_Ingredients.cho || 0;
		let ash = this.m_Ingredients.ash || 0;
		let salt = this.m_Ingredients.salt || 0;

		return water*w(t) + protein*p(t) + lipid*f(t) + 
			cho*cho_(t) + ash*ash_(t) + salt*salt_
	}


	k = (T?:number):number=>
	{
		/*
		If T (in °C) is not specified then Food's current temperature will be used.\n
		Returns conductivity in W/mK
		*/
		let w = (x:number) => 0.457109 + 0.0017625*x -6.7036e-06*x**2;
		let p = (x:number) =>0.17881 + 0.0011958*x -2.7178e-06*x**2;
		let f = (x:number) =>0.18071 -0.00027604*x -1.7749e-07*x**2;
		let cho_ = (x:number) =>0.20141 + 0.0013874*x -4.3312e-06*x**2;
		let ash_ = (x:number) =>0.3296 + 0.0014011*x -2.9069e-06*x**2;
		let salt_ =  0.574
		/*
		For salt: 5.704 molal solution at 20C, Riedel L. (1962),
		Thermal Conductivities of Aqueous Solutions of Strong Electrolytes 
		Chem.-1ng.-Technik., 23 (3) P.59 - 64
		*/
		
		let t = (T === undefined) ?  this.m_T : T;

		return this.water*w(t)+ this.protein*p(t) + this.lipid*f(t) + 
				this.cho*cho_(t) + this.ash*ash_(t) + this.salt*salt_	
	}


	rho = (T?:number):number =>
	{
		/*
		If T (in °C) is not specified then Food's current temperature will be used.\n
		Returns density in kg/m3
		*/
		let w = (x:number) => 997.18 + 0.0031439*x - 0.0037574*x**2; //water
		let p = (x:number) => 1329.9 - 0.5184*x; //protein
		let f = (x:number) => 925.59 - 0.41757*x; //lipid
		let c = (x:number) => 1599.1 - 0.31046*x; //cho
		let a = (x:number) => 2423.8 - 0.28063*x; //ash
		let s =  2165 //salt, Wikipedia
		
		let t = (T === undefined) ?  this.m_T : T;

		return  this.water*w(t) + 
				this.protein*p(t) + 
				this.lipid*f(t) + 
				this.cho*c(t) + 
				this.ash*a(t) + 
				this.salt*s;
	}


	molecularweight = ():number =>
	{
		/*
		Average molecular weight of the food item
		returns g/mol
		*/
		return this.water*18.02 + 
				this.cho*180.16 + 
				this.lipid*92.0944 + 
				this.protein*89.09 + 
				this.salt*58.44;
	}


	x_ice = (T:number):number|null =>
	{
		/*
		Computes the fraction of ice \n
		T: Initial freezing temperature
		*/
		
		//if temperature > initial freezing temperature then no ice can exist
		if (this.T > T)
			return null;

		let Tdiff = T -this.T + 1

		//Tchigeov's (1979) equation (Eq #5 in ASHRAE manual)
		return 1.105*this.water / (1 + 0.7138/Math.log(Tdiff))
	}


	enthalpy =(T:number):number =>
	{
		/*
		Computes enthalpy for frozen and unfrozen foods, returns: kJ/kg 

		## Input:
		T: Initial freezing temperature

		## Reference:
		2006 ASHRAE Handbook, thermal properties of foods (Eq #18)

		## Notes:
		If foods current temperature smaller than Tfreezing it will 
		compute the enthalpy for frozen foods.
		*/		
		let LO = 333.6; //constant
		let Tref = -40; //reference temperature

		let Tfood = this.T;

		let X_w = this.water;

		//solute
		let X_slt = this.cho + this.lipid + this.protein + this.ash + this.salt;
	
		/*
		if food's current T is smaller than or equal to (close enough) freezing temp 
		then it is assumed as frozen
		*/
		let IsFrozen = Tfood<T || isclose(Tfood,T, T_TOL);

		if (IsFrozen)
		{
			/*
			If the food temperature is at 0C and it is frozen
			then return the enthalpy of ice at 0C
			*/
			if (isclose(Tfood, 0.0, T_TOL))
				return 2.050;

			/*
			fraction of the bound water (Equation #3 in ASHRAE) (Schwartzberg 1976). 
			Bound water is the portion of water in a food that is bound to solids in the food, 
			and thus is unavailable for freezing.
			*/
			let Xb = 0.4 * this.protein;

			let temp= 1.55 + 1.26* X_slt - (X_w - Xb) * (LO* T) / (Tref*Tfood);
			return (Tfood - Tref)*temp
		}
		

		//UNFROZEN -> Equation #15 in ASHRAE book
		
		/*
		compute enthalpy of food at initial freezing temperature 
		Chang and Tao (1981) correlation, Eq #25 in ASHRAE manual
		*/
		let Hf = 9.79246 + 405.096*X_w;

		return Hf + (Tfood - T)*(4.19 - 2.30*X_slt - 0.628*X_slt**3) 
	}


	get weight():number
	{
		return this.m_Weight;
	}

	set weight(w:number)
	{
		this.m_Weight = w;
	}


	get T():number 
	{
		return this.m_T;
	}

	set T(t:number)
	{
		this.m_T = t;
	}

	get water():number
	{
		return this.m_Ingredients.water || 0;
	}

	get protein():number
	{
		return this.m_Ingredients.protein || 0;
	}

	get cho():number
	{
		return this.m_Ingredients.cho || 0;
	}

	get lipid():number
	{
		return this.m_Ingredients.lipid ||0;
	}

	get ash():number
	{
		return this.m_Ingredients.ash || 0;
	}

	get salt():number
	{
		return this.m_Ingredients.salt || 0;
	}

}




export function ComputeAw_T(food:Food, aw1:number):number|null
{
	/*
	Computes aw at a different temperatures
	
	food: Food material
	aw1: water activity of food at reference temperature (generally around 20C)
	T2: the temperature at which water activity will be computed
	*/
	const Tref = 20;
	if (isclose(food.T, Tref, 1.0))
		return aw1;

	//save the actual temperature
	let T = food.T

	food.T = Tref;
	let Cp_20 = food.cp();

	//restore the actual temperature
	food.T = T;
	let Cp_T = food.cp();

	let Cp_avg = (Cp_20 + Cp_T) / 2.0;
	let Qs = food.molecularweight()* Cp_avg*(T - 20.0) //kJ/kg

	const R = 8.314 //kPa*m^3/kgK

	T += 273.15;
	let dT = 1/293.15 - 1/T;

	let aw2 = aw1*Math.exp(Qs/R*dT);
	
	return (aw2>=0 && aw2<=1) ? aw2: null;
}


class Aw
{
	private m_Food:Food;

	constructor(food:Food)
	{
		this.m_Food = food;
	}

	FerroFontan_Chirife_Boquet = ():number =>
	{
		/*
		Assumptions: 
		CHO (fructose), protein (alanine), lipid (glycerol)
		*/
		const MW_CHO = 180.16; //fructose
		const MW_LIPID = 92.0944; //glycerol
		const MW_PROTEIN = 89.09; //alanine

		let fd = this.m_Food;

		let NCHO = fd.cho/MW_CHO;
		let NLipid = fd.lipid/ MW_LIPID;
		let NProtein = fd.protein/MW_PROTEIN;
		
		//number of moles of water
		let N_w = fd.water/18.02;

		//solute
		let N_slt = NCHO + NLipid + NProtein;

		let Solute = 1 - fd.water;
		let C_cho = fd.cho/Solute;
		let C_Lipid = fd.lipid/Solute;
		let C_Protein = fd.protein/Solute;

		let Mt = Math.sqrt(C_cho/MW_CHO + C_Lipid/MW_LIPID + C_Protein/MW_PROTEIN);

		//Norrish equation K values using Ferro-Chirife-Boquet equation
		let Km = C_cho*(Mt/MW_CHO)*(-2.15) +
				 C_Lipid*(Mt/MW_LIPID)*(-1.16) + 
				 C_Protein*(Mt/MW_PROTEIN)*(-2.52) ;
		
		// Mole fraction of solute
		let X_slt = N_slt/(N_slt + N_w);

		// Mole fraction of water
		let XWater = N_w/(N_slt + N_w) 

		let aw = XWater*Math.exp(Km*X_slt**2);

		return aw
	}


	Norrish = ():number=>
	{
		//Norrish equation
		
		f = this.m_Food

		//CHO is considered as fructose
		let N_cho = f.cho/180.16;
		
		//lipid is considered as glycerol
		let N_l = f.lipid/ 92.0944 
		
		//protein is considered as alanine
		let N_p = f.protein/89.09 

		//water
		let N_w = f.water / 18

		//total
		let N_tot = N_cho + N_l + N_p + N_w

		//X_l: lipid, X_p: protein, X_w: water
		let X_cho = N_cho/N_tot;
		let X_l = N_l/N_tot;
		let X_p =N_p/N_tot;
		let X_w = N_w/N_tot;

		
		// Norrish equation K values using Ferro-Chirife-Boquet equation
		let SumSq = -(2.15)*X_cho**2 - (1.16)*X_l**2 - (2.52)*X_p**2
		let SumX2 = X_cho**2 + X_l**2 + X_p**2
		
		let rhs = Math.log(X_w) + SumSq/SumX2*(1-X_w)**2

		return Math.exp(rhs)
	}
}


let ing:Ingredient = {
	water:88.13, protein:3.15, cho:4.80, lipid:3.25, ash:0.67
}

let ing2:Ingredient = {
	ash:60,
	protein:35
}

let f = new Food(ing);
let f2 = new Food(ing2);
let f3 = f.add(f2);
console.log(f3);




/*


class Aw():

	#mostly used in confectionaries
	def MoneyBorn(self)->float:
		f = self._food

		# amount of CHO in 100 g water (equation considers thus way) 
		W = 100*f.cho/f.water 
		
		#CHO is considered as fructose
		N_cho = W/180.16 
		
		return 1.0/(1.0 + 0.27*N_cho)



	def Raoult(self)->float:
		#prediction using Raoult's law
		#all in percentages

		f = self._food

		x_w = f.water
		xCHO =  f.cho
		x_l = f.lipid
		x_p =  f.protein

		#solute
		x_slt = xCHO + x_l + x_p + f.ash

		#average molecular weight
		MW_slt = (xCHO/x_slt)*180.16 + (x_l/x_slt)*92.0944 + (x_p/x_slt)*89.09 if x_slt>0 else 1
			
		MW_w=18 #molecular weight of water
		MW_nacl = 58.44

		temp1 = x_w + (MW_w/MW_slt)*x_slt + 2*(MW_w/MW_nacl)*f.salt
		return x_w/temp1





""" ------------------------------------------------------------------------------- """

class Cp():
	def __init__(self, food:Food) -> None:
		self._food = food

	def Siebel(self, Tf = -1.7)->float:
		"""
		returns kJ/kg°C \n

		## Input:
		Tf = -1.7 is the default freezing temperature

		## Reference:
		Siebel, E (1892). Specific heats of various products. Ice and Refrigeration, 2, 256-257.
		"""

		food = self._food

		Fat = food.lipid
		SNF = food.ash + food.protein + food.cho
		M = food.water
		Tfood = food.T


		#for fat free foods
		if _math.isclose(Fat, 0.0, abs_tol=1E-5):
			r = 837.36
			r += 3349*M if Tfood>Tf else 1256*M
			return r/1000

		r = 1674.72*Fat +  837.36*SNF
		r += 4186.8*M if Tfood>Tf else 2093.4*M

		return r/1000


	def Heldman(self)->float:
		"""
		returns kJ/kg°C 

		## Reference:
		Heldman, DR (1975). Food Process Engineering. Westport, CT: AVI 
		"""
		food = self._food

		Fat = food.lipid
		Protein = food.protein
		Ash = food.ash
		cho = food.cho
		water = food.water
		
		return 4.18*water + 1.547*Protein + 1.672*Fat + 1.42*cho + 0.836*Ash


	def Chen(self)->float:
		"""
		specific heat of an unfrozen food returns kJ/kg°C \n

		## Reference:
		Chen CS (1985). Thermodynamic Analysis of the Freezing and Thawing of Foods: 
		Enthalpy and Apparent Specific Heat. Food Science, 50(4), 1158-1162
		"""
		food = self._food

		Solid = 1 - food.water	
		return 4.19 - 2.30*Solid - 0.628*Solid**3




class Food:

	
	
	def aw(self)->float|None:
		"""
		Returns value of water activity or None \n
		
		## Warning:
		At T>25 C, built-in computation might return None. \n
		Therefore, must be used with caution at T>25.
		"""
		aw1 = 0.92
	
		water, cho, lipid, protein = self._water, self._cho, self._lipid, self._protein
		ash, salt = self._ash, self._salt 


		#Virtually no water or 99.99% water
		if water < 0.01 or water > 0.9999:
			return water
		
		#almost all CHO
		if cho>0.98:
			return 0.70

		#note that salt is excluded
		Msolute = cho + lipid + protein + ash

		"""
		Very dilute solution containing at least one of cho, lipid, protein or ash
		
		>> nacl = Food(water = 80, salt=20)
		Therefore, for salt solutions that contain none of the above, the following check
		does NOT return 0.99
		"""
		if 0 < Msolute < 0.01: 
			return 0.99
	

		_Aw = Aw(self)

		#salt solution?
		if salt>=0.01 and water>=0.7:	
			aw1 = _Aw.Raoult()
			return ComputeAw_T(self, aw1)	
		
		#dilute
		if water>=0.90:
			aw1 = _Aw.Raoult()

		#solute is 2.5 more times than solvent
		elif Msolute>=0.70:
			aw1 = _Aw.Norrish()
		
		else:
			aw1 = _Aw.FerroFontan_Chirife_Boquet()

		return ComputeAw_T(self, aw1)




	def freezing_T(self)->None:
		"""
		Estimates the initial freezing temperature of a food item \n
		returns in Celcius (None if estimation fails)

		## Warning:
		Not implemented in the base class (Food), raises error
		"""
		raise NotImplementedError("Only implemented for Juice, Fruit/Veggies and Meat")
	
	

	def dielectric(self, f:int=2450)->Dielectric:
		"""
		Computes dielectric properties
		f: frequency in MHz

		## Reference:
		Gulati T, Datta AK (2013). Enabling computer-aided food process engineering: Property estimation
		equations for transport phenomena-based models, Journal of Food Engineering, 116, 483-504
		"""
		water = self._water 
		ash = self.ash
		T = self.T

		meat_dc = lambda w, ash: w*(1.0707-0.0018485*T) + ash*4.7947 + 8.5452
		meat_dl = lambda w, ash:  w*(3.4472-0.01868*T + 0.000025*T**2) + ash*(-57.093+0.23109*T) - 3.5985
		
		fv_dc = lambda w, ash:  38.57 + 0.1255 + 0.456*w - 14.54*ash - 0.0037*T*w + 0.07327*ash*T
		fv_dl = lambda w, ash: 17.72 - 0.4519*T + 0.001382*T**2 \
						- 0.07448*w + 22.93*ash - 13.44*ash**2 \
						+ 0.002206*w*T + 0.1505*ash*T

		#No generalized equation, so a crude approximation
		d_const = (meat_dc(water, ash) + fv_dc(water, ash)) / 2
		d_loss = (meat_dl(water, ash) + fv_dl(water, ash)) / 2
		
		return Dielectric(d_const, d_loss)
		


	def makefrom(self, inputs:list[Food])->list[float]:
		"""
		Given a list of food items, computes the amount of each to be mixed to 
		make the current food item \n
		Material Balance
		"""
		N = len(inputs)

		A, b = [], []
		A.append([1]*N) #first row is the weights
		b.append(1)

		for food in inputs:
			assert isinstance(food, Food), "All entries in the list must be of type Food"
			assert self.intersects(food), "List has food item with no common ingredient with the target"
		
		Ingredients = self.ingredients()
		NCols = len(Ingredients) + 1

		for key, value in Ingredients.items():
			row = []
			for f in inputs:
				ing = f.ingredients()
				val = 0.0
				if ing.get(key)!= None:
					val = ing[key]/100
				row.append(val)
			
			assert len(row) == NCols, "Malformed matrix"
			A.append(row)
			b.append(value/100*self.weight)

		#solve Ax=b
		return _np.linalg.solve(_np.asfarray(A), _np.asfarray(b)).tolist()



	def ingredients(self)->dict:
		return self._Ingredients
	

	def normalize(self):
		"""sets the weight to 1.0"""
		self._Weight = 1.0


	

	def intersects(self, f2:Food)->bool:
		"""Do f1 and f2 have any common ingredient"""	
		fA, fB = self.ingredients(), f2.ingredients()

		#is there an element at intersection of both sets
		return set(fA.keys()) & set(fB.keys())





#--------------------------------------------------------------------------------------

class Beverage(Food):
	def __init__(self, water=0, cho=0, protein=0, lipid=0, ash=0, salt=0):
		super().__init__(water, cho, protein, lipid, ash, salt)


	@override(Food)
	def freezing_T(self)->float|None:
		"""
		Estimates the initial freezing temperature of a food item \n
		returns in Celcius
		"""
		water = self._water 
		return 120.47 + 327.35*water - 176.49*water**2  - 273.15

	@override(Food)
	def enthalpy(self, T=-0.4)->float:
		"""
		Computes enthalpy for frozen and unfrozen foods, returns: kJ/kg 

		## Input:
		T: Initial freezing temperature

		## Reference:
		2006 ASHRAE Handbook, thermal properties of foods (Eq #18)

		## Notes:
		If foods current temperature smaller than Tfreezing it will 
		compute the enthalpy for frozen foods.
		
		"""	
		super().enthalpy(T) 			


#----------------------------------------------------------------------------------

class Juice(Food):
	def __init__(self, water=0, cho=0, protein=0, lipid=0, ash=0, salt=0):
		super().__init__(water, cho, protein, lipid, ash, salt)

	@override(Food)
	def freezing_T(self)->float|None:
		"""
		Estimates the initial freezing temperature of a food item \n
		returns in Celcius
		"""
		water = self._water 
		return 120.47 + 327.35*water - 176.49*water**2  - 273.15

	@override(Food)
	def enthalpy(self, T=-0.4)->float:
		"""
		Computes enthalpy for frozen and unfrozen foods, returns: kJ/kg 

		## Input:
		T: Initial freezing temperature

		## Reference:
		2006 ASHRAE Handbook, thermal properties of foods (Eq #18)

		## Notes:
		If foods current temperature smaller than Tfreezing it will 
		compute the enthalpy for frozen foods.
		"""
		super().enthalpy(T)


#----------------------------------------------------------------------------------------

class Cereal(Food):
	def __init__(self, water=0, cho=0, protein=0, lipid=0, ash=0, salt=0):
		super().__init__(water, cho, protein, lipid, ash, salt)


	@override(Food)
	def dielectric(self, f:int=2450)->Dielectric:
		"""
		Computes dielectric properties
		f: frequency in MHz

		## Reference:
		Gulati T, Datta AK (2013). Enabling computer-aided food process engineering: Property estimation
		equations for transport phenomena-based models, Journal of Food Engineering, 116, 483-504

		Calay RK, Newborough M, Probert D, Calay PS (1995). Predictive equations for the dielectric properties of foods. 
		International Journal of Food Science and Technology, 29, 699-713.
		"""
		w = self._water*100
		T = self.T
		
		#assuming it as bulk density
		logf = _math.log10(f)
		rho = self.rho()

		if 2000<f<3000 and 10<T<30 and 3<w<30:
			dc_ = 1.71 + 0.0701*w
			dl_ = 0.12 + 0.00519*w

		elif 900<f<10000 and 10<T<30 and 3<w<30:
			dc_ = 1.82 + 0.0621*w -0.0253*(f/1000)
			dl_ = 1.72 + 0.066*w - 0.0254*(f/1000) + self.rho()

		else:
			dc_ = (1 + 0.504*w*rho/(_math.sqrt(w) + logf))**2
			dl_ = 0.146*rho**2 + 0.004615*w**2*rho**2*(0.32*logf + 1.74/logf - 1)
		
		return Dielectric(dc_, dl_)



#----------------------------------------------------------------------------------------

class Legume(Food):
	def __init__(self, water=0, cho=0, protein=0, lipid=0, ash=0, salt=0):
		super().__init__(water, cho, protein, lipid, ash, salt)


	@override(Food)
	def dielectric(self, f:int=2450)->Dielectric:
		"""
		Computes dielectric properties
		f: frequency in MHz

		## Reference:
		Gulati T, Datta AK (2013). Enabling computer-aided food process engineering: Property estimation
		equations for transport phenomena-based models, Journal of Food Engineering, 116, 483-504

		Calay RK, Newborough M, Probert D, Calay PS (1995). Predictive equations for the dielectric properties of foods. 
		International Journal of Food Science and Technology, 29, 699-713.
		"""
		w = self._water*100
		T = self.T
		
		#assuming it as bulk density
		logf = _math.log10(f)
		rho = self.rho()

		if 2000<f<3000 and 10<T<30 and 3<w<30:
			dc_ = 1.71 + 0.0701*w
			dl_ = 0.12 + 0.00519*w

		elif 900<f<10000 and 10<T<30 and 3<w<30:
			dc_ = 1.82 + 0.0621*w -0.0253*(f/1000)
			dl_ = 1.72 + 0.066*w - 0.0254*(f/1000) + self.rho()

		else:
			dc_ = (1 + 0.504*w*rho/(_math.sqrt(w) + logf))**2
			dl_ = 0.146*rho**2 + 0.004615*w**2*rho**2*(0.32*logf + 1.74/logf - 1)
		
		return Dielectric(dc_, dl_)



#----------------------------------------------------------------------------------------

class Nut(Food):
	def __init__(self, water=0, cho=0, protein=0, lipid=0, ash=0, salt=0):
		super().__init__(water, cho, protein, lipid, ash, salt)


	@override(Food)
	def dielectric(self, f:int=2450)->Dielectric:
		"""
		Computes dielectric properties
		f: frequency in MHz

		## Reference:
		Gulati T, Datta AK (2013). Enabling computer-aided food process engineering: Property estimation
		equations for transport phenomena-based models, Journal of Food Engineering, 116, 483-504

		Calay RK, Newborough M, Probert D, Calay PS (1995). Predictive equations for the dielectric properties of foods. 
		International Journal of Food Science and Technology, 29, 699-713.
		"""
		w = self._water*100
		T = self.T
		
		#assuming it as bulk density
		logf = _math.log10(f)
		rho = self.rho()

		if 2000<f<3000 and 10<T<30 and 3<w<30:
			dc_ = 1.71 + 0.0701*w
			dl_ = 0.12 + 0.00519*w

		elif 900<f<10000 and 10<T<30 and 3<w<30:
			dc_ = 1.82 + 0.0621*w -0.0253*(f/1000)
			dl_ = 1.72 + 0.066*w - 0.0254*(f/1000) + self.rho()

		else:
			dc_ = (1 + 0.504*w*rho/(_math.sqrt(w) + logf))**2
			dl_ = 0.146*rho**2 + 0.004615*w**2*rho**2*(0.32*logf + 1.74/logf - 1)
		
		return Dielectric(dc_, dl_)




#-------------------------------------------------------------------------------------

class Dairy(Food):
	def __init__(self, water=0, cho=0, protein=0, lipid=0, ash=0, salt=0):
		super().__init__(water, cho, protein, lipid, ash, salt)


	@override(Food)
	def enthalpy(self, T=-0.6)->float:
		"""
		Computes enthalpy for frozen and unfrozen foods, returns: kJ/kg 

		## Input:
		T: Initial freezing temperature

		## Reference:
		2006 ASHRAE Handbook, thermal properties of foods (Eq #18)

		## Notes:
		If foods current temperature smaller than Tfreezing it will 
		compute the enthalpy for frozen foods.
		
		Milk: -0.6 (skim), -15.6 (evaporated, condensed)
		"""	
		super().enthalpy(T)


#-----------------------------------------------------------------------------

class Fruit(Food):
	def __init__(self, water=0, cho=0, protein=0, lipid=0, ash=0, salt=0):
		super().__init__(water, cho, protein, lipid, ash, salt)
	
	@override(Food)
	def freezing_T(self)->float|None:
		"""
		Estimates the initial freezing temperature of a food item \n
		returns in Celcius
		"""
		water = self._water 	
		return (287.56 -49.19*water + 37.07*water**2) - 273.15
	

	@override(Food)
	def dielectric(self, f:int=2450)->Dielectric:
		"""
		Computes dielectric properties
		f: frequency in MHz

		## Reference:
		Gulati T, Datta AK (2013). Enabling computer-aided food process engineering: Property estimation
		equations for transport phenomena-based models, Journal of Food Engineering, 116, 483-504

		Calay RK, Newborough M, Probert D, Calay PS (1995). Predictive equations for the dielectric properties of foods. 
		International Journal of Food Science and Technology, 29, 699-713.
		"""
		w, ash = self.water*100, self.ash*100
		T = self.T

		if f == 2450 and 0<T<70 and 50<w<90:
			dc_ = 2.14 - 0.104*T + 0.808*w
			dl_ = 3.09-0.0638*T+0.213*w

		elif 900<=f<=3000 and 0<T<70 and 50<w<90:
			dc_ = -12.8-0.103*T + 0.788*w + 5.49*(f/1000)
			dl_ = 10.1 + 0.008*T + 0.221*w -3.53*(f/1000)
		
		else:
			dc_ = 38.57 + 0.1255 + 0.456*w - 14.54*ash - 0.0037*T*w + 0.07327*ash*T
			dl_ = 17.72 - 0.4519*T + 0.001382*T**2 - 0.07448*w + 22.93*ash - 13.44*ash**2 + 0.002206*w*T + 0.1505*ash*T

		return Dielectric(dc_, dl_)


	@override(Food)
	def enthalpy(self, T=-1.5)->float:
		"""
		Computes enthalpy for frozen and unfrozen foods, returns: kJ/kg 

		## Input:
		T: Initial freezing temperature

		## Reference:
		2006 ASHRAE Handbook, thermal properties of foods (Eq #18)

		## Notes:
		If foods current temperature smaller than Tfreezing it will 
		compute the enthalpy for frozen foods.
		"""	
		super().enthalpy(T)

#--------------------------------------------------------------------------

class Vegetable(Food):
	def __init__(self, water=0, cho=0, protein=0, lipid=0, ash=0, salt=0):
		super().__init__(water, cho, protein, lipid, ash, salt)

	@override(Food)
	def freezing_T(self)->float|None:
		"""
		Estimates the initial freezing temperature of a food item \n
		returns in Celcius
		"""
		water = self._water 	
		return (287.56 -49.19*water + 37.07*water**2) - 273.15

	@override(Food)
	def dielectric(self, f:int=2450)->Dielectric:
		"""
		Computes dielectric properties
		f: frequency in MHz

		## Reference:
		Gulati T, Datta AK (2013). Enabling computer-aided food process engineering: Property estimation
		equations for transport phenomena-based models, Journal of Food Engineering, 116, 483-504

		Calay RK, Newborough M, Probert D, Calay PS (1995). Predictive equations for the dielectric properties of foods. 
		International Journal of Food Science and Technology, 29, 699-713.
		"""
		w, ash = self.water*100, self.ash*100
		T = self.T

		if f == 2450 and 0<T<70 and 50<w<90:
			dc_ = 2.14 - 0.104*T + 0.808*w
			dl_ = 3.09-0.0638*T+0.213*w

		elif 900<=f<=3000 and 0<T<70 and 50<w<90:
			dc_ = -12.8-0.103*T + 0.788*w + 5.49*(f/1000)
			dl_ = 10.1 + 0.008*T + 0.221*w -3.53*(f/1000)
		
		else:
			dc_ = 38.57 + 0.1255 + 0.456*w - 14.54*ash - 0.0037*T*w + 0.07327*ash*T
			dl_ = 17.72 - 0.4519*T + 0.001382*T**2 - 0.07448*w + 22.93*ash - 13.44*ash**2 + 0.002206*w*T + 0.1505*ash*T

		return Dielectric(dc_, dl_)
	


	@override(Food)
	def enthalpy(self, T=-1.5)->float:
		"""
		Computes enthalpy for frozen and unfrozen foods, returns: kJ/kg 

		## Input:
		T: Initial freezing temperature

		## Reference:
		2006 ASHRAE Handbook, thermal properties of foods (Eq #18)

		## Notes:
		If foods current temperature smaller than Tfreezing it will 
		compute the enthalpy for frozen foods.
		"""	
		super().enthalpy(T)





#---------------------------------------------------------------------------------

class Meat(Food):
	def __init__(self, water=0, cho=0, protein=0, lipid=0, ash=0, salt=0):
		super().__init__(water, cho, protein, lipid, ash, salt)

	@override(Food)
	def freezing_T(self)->float|None:
		"""
		Estimates the initial freezing temperature of a food item \n
		returns in Celcius
		"""
		water = self._water 
		return (271.18 + 1.47*water) - 273.15


	@override(Food)
	def dielectric(self, f:int=2450)->Dielectric:
		"""
		Computes dielectric properties
		f: frequency in MHz

		## Reference:
		Gulati T, Datta AK (2013). Enabling computer-aided food process engineering: Property estimation
		equations for transport phenomena-based models, Journal of Food Engineering, 116, 483-504

		Calay RK, Newborough M, Probert D, Calay PS (1995). Predictive equations for the dielectric properties of foods. 
		International Journal of Food Science and Technology, 29, 699-713.
		"""
		water, ash, salt, fat = self.water*100, self.ash, self.salt*100, self.lipid*100
		T = self.T

		if 0<fat<20 and -30<T<0:
			"""Calay et al 2007, Predictive equations for dielectric ..."""
			dc_ = 29.3 + 0.076*T - 0.3*water - 0.11*fat
			dl_ = 9.8 + 0.028*T- 0.0117*water
		
		elif 0<salt<=6 and 0<T<70:
			dc_ = -52-0.03*T+ 1.2*water+(4.5+0.07*T)*salt
			dl_ = -22-0.013*T + 0.48*water + (4 + 0.05*T)*salt
		
		elif -30<T<0:
			dc_ = 23.6 + 0.0767*T - 0.231*water
			dl_ = 9.8 + 0.028*T- 0.0117*water 
		
		elif water>0 and ash>0:
			dc_ = water*(1.0707-0.0018485*T) + ash*4.7947 + 8.5452
			dl_ = water*(3.4472-0.01868*T + 0.000025*T**2) + ash*(-57.093+0.23109*T) - 3.5985
		
		#calay et al -> Raw beef
		elif 0<T<70:
			dc_=-37.1-0.145*T+ 1.2*water
			dl_ = -12.7 + 0.082*T + 0.405*water

		else:
			raise RuntimeError("None of the equations matched given conditions.")
		
		return Dielectric(dc_, dl_)


	@override(Food)
	def enthalpy(self, T=-1.7)->float:
		"""
		Computes enthalpy for frozen and unfrozen foods, returns: kJ/kg 

		## Input:
		T: Initial freezing temperature

		## Reference:
		2006 ASHRAE Handbook, thermal properties of foods (Eq #18)

		## Notes:
		If foods current temperature smaller than Tfreezing it will 
		compute the enthalpy for frozen foods.
		"""	
		super().enthalpy(T)





#-------------------------------------------------------------------------------------
class Sweet(Food):
	def __init__(self, water=0, cho=0, protein=0, lipid=0, ash=0, salt=0):
		super().__init__(water, cho, protein, lipid, ash, salt)

	@override(Food)
	def aw(self)->float|None:
		"""
		Returns value of water activity or None \n

		## Warning:
		At T>25 C, built-in computation might return None. \n
		Therefore, must be used with caution.
		"""
		_aw = Aw(self)	
		return ComputeAw_T(self, _aw.MoneyBorn())


	@override(Food)
	def enthalpy(self, T=-15)->float:
		"""
		Computes enthalpy for frozen and unfrozen foods, returns: kJ/kg 

		## Input:
		T: Initial freezing temperature

		## Reference:
		2006 ASHRAE Handbook, thermal properties of foods (Eq #18)

		## Notes:
		If foods current temperature smaller than Tfreezing it will 
		compute the enthalpy for frozen foods.
		"""	
		super().enthalpy(T)


*/