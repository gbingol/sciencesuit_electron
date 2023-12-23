export const API:
{
	dirname: () => string;
	projdir: () => string;
	runcmd: (cmd: string) => Promise<any>;
	runpython: (file: any, options: any, isstr?: boolean) => Promise<any>;
	psychrometry: (k: string[] | Object, v?: number[]) => Psychrometry;
	trapz: (x: number[], y: number[], isCumulative?: boolean) => any;
}

declare global
{
	interface Window { api: typeof API }
}