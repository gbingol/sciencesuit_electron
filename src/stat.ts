

export enum Alternative {
	TWOSIDED = "two.sided",
	GREATER = "greater",
	LESS = "less"
}


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
	df:number,
	xaver: number,
	yaver: number,
	s1: number,
	s2: number,
	sp?: number
}