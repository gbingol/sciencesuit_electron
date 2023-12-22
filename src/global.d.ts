export const API:
{
	dirname: () => string;
    projdir: () => string;
    runcmd: (callback: any, cmd: any) => Promise<any>;
    runpython: (file: any, options: any, isstr?: boolean) => Promise<any>;
    psychrometry: (k: string[], v: number[]) => Psychrometry;
    trapz: (x: any, y: any, isCumulative?: boolean) => any;
}

declare global
{
	interface Window { api: typeof API }
}