//const { myapi } = require('./preload');

export namespace stat
{
	export type test_z_result = {
		pvalue: number,
		CI_lower: number, CI_upper: number,
		SE: number,
		N: number,
		stdev: number,
		mean: number,
		zcritical: number
	}

	export type test_f_result = {
		pvalue: number,
		CI_lower: number, CI_upper: number,
		fcritical: number,
		df1: number, df2: number
		var1: number, var2: number
	}

	export type test_t1_result = {
		pvalue: number,
		CI_lower: number, CI_upper: number,
		SE: number,
		N: number,
		stdev: number,
		mean: number,
		tcritical: number
	}

	export type test_t2_result = {
		pvalue: number,
		CI_lower: number, CI_upper: number,
		tcritical: number,
		n1: number, n2: number,
		df: number,
		xaver: number,
		yaver: number,
		s1: number, s2: number, sp?: number
	}

	export type test_tpaired_result = {
		pvalue: number,
		CI_lower: number, CI_upper: number,
		tcritical: number,
		xaver: number, yaver: number,
		s1: number, s2: number,
		SE: number,
		N: number,
		stdev: number, //stdev of difference
		mean: number //mean of difference
	}

	export type test_aov2_result = {
		DFError: number, DFFact1: number, DFFact2: number, DFinteract: number,
		FvalFact1: number, FvalFact2: number, Fvalinteract: number,
		MSError: number, MSFact1: number, MSFact2: number, MSinteract: number,
		pvalFact1: number, pvalFact2: number, pvalinteract: number,
		SSError: number, SSFact1: number, SSFact2: number, SSinteract: number,
		Residuals: number[], Fits: number[]
	}

	export namespace regression
	{
		export type CoefficientStatistics = {
			Coefficient: number,
			pvalue: number, tvalue: number, SE: number,
			CILow:number, CIHigh:number
		}
	
		export type simple_linregress_result = {
			DF_Residual: number, DF_Regression: number,
			SS_Residual: number, MS_Residual: number,
			SS_Regression: number, MS_Regression: number,
			SS_Total: number, Fvalue: number,
			R2: number,
			SE: number,
			pvalue: number,
			CoeffStats:CoefficientStatistics[]
		}
	}
	
}

declare global
{
	interface Window { api: typeof API }
}