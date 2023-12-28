export namespace stat
{
	export type test_t1_result = {
		pvalue: number;
		CI_lower: number,
		CI_upper: number,
		SE: number;
		N: number;
		stdev: number;
		mean: number;
		tcritical: number;
	}

	export type test_t2_result = {
		pvalue: number;
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
}

declare global
{
	interface Window { api: typeof API }
}