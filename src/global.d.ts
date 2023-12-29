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
		fFcritical:number,
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


export const API: {
	dirname: () => string;
	projdir: () => string;
	runcmd: (cmd: string) => Promise<any>;
	runpython: (file: any, options: any, isstr?: boolean) => Promise<any>;
	
	psychrometry: (
		k: string[] | Object,
		v?: number[]) => Psychrometry;
	
	trapz: (
		x: number[],
		y: number[],
		isCumulative?: boolean) => any;
	
	test_z: (
		x: Array<number>,
		sd: number,
		mu: number,
		alternative: string = "two.sided",
		conflevel: number = 0.95) => stat.test_z_result;
	
	test_f: (
		x: Array<number>,
		y: Array<number>,
		ratio: number = 1.0,
		alternative: string = "two.sided",
		conflevel: number = 0.95) => stat.test_f_result;
	
	test_t1: (
		x: Array<number>,
		mu: number,
		alternative: string = "two.sided",
		conflevel: number = 0.95) => stat.test_t1_result;
	
	test_t2: (
		x: Array<number>,
		y: Array<number>,
		mu: number,
		varequal: boolean = true,
		alternative: string = "two.sided",
		conflevel: number = 0.95) => stat.test_t2_result;
	
	test_tpaired: (
		x: Array<number>,
		y: Array<number>,
		mu: number,
		alternative: string = "two.sided",
		conflevel: number = 0.95) => stat.test_tpaired_result;
}

declare global
{
	interface Window { api: typeof API }
}