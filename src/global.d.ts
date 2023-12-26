export const API:
{
	dirname: () => string;
	projdir: () => string;
	runcmd: (cmd: string) => Promise<any>;
	runpython: (file: any, options: any, isstr?: boolean) => Promise<any>;
	psychrometry: (k: string[] | Object, v?: number[]) => Psychrometry;
	trapz: (x: number[], y: number[], isCumulative?: boolean) => any;
	
	test_t1: (
		x: Array<number>,
		mu: number,
		alternative: core.stat.Alternative = core.stat.Alternative.TWOSIDED,
		conflevel: number = 0.95) => core.stat.test_t1_result;
}

declare global
{
	interface Window { api: typeof API }
}