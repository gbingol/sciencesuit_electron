namespace stat
{

	enum Alternative {
		TWOSIDED = "two.sided",
		GREATER = "greater",
		LESS = "less"
	}


	type test_t1_result = {
		pvalue: number;
		CI_lower: number,
		CI_upper: number,
		SE: number;
		N: number;
		stdev: number;
		mean: number;
		tcritical: number;
	}

}