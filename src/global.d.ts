//const { myapi } = require('./preload');

export namespace stat
{
	export type test_z_result = {
		pvalue: number,
		CI_lower: number,
		CI_upper: number,
		SE: number,
		N: number,
		stdev: number,
		mean: number,
		zcritical: number
	}

	export type test_f_result = {
		pvalue: number,
		CI_lower: number,
		CI_upper: number,
		fcritical:number,
		df1: number,
		df2: number
		var1: number,
		var2: number
	}

	export type test_t1_result = {
		pvalue: number,
		CI_lower: number,
		CI_upper: number,
		SE: number,
		N: number,
		stdev: number,
		mean: number,
		tcritical: number
	}

	export type test_t2_result = {
		pvalue: number,
		CI_lower: number,
		CI_upper: number,
		tcritical: number,
		n1: number,
		n2: number,
		df: number,
		xaver: number,
		yaver: number,
		s1: number,
		s2: number,
		sp?: number
	}

	export type test_tpaired_result ={
		pvalue: number,
		CI_lower: number,
		CI_upper: number,
		tcritical: number,
		xaver: number,
		yaver: number,
		s1: number,
		s2: number,
		SE: number,
		N: number,
		stdev: number, //stdev of difference
		mean: number //mean of difference
	}
	
}

declare global
{
	interface Window { api: typeof API }
}