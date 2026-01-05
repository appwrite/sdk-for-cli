import type { CliConfig } from "./types.js";
declare const cliConfig: CliConfig;
export declare const parse: (data: Record<string, any>) => void;
export declare const drawTable: (data: Array<Record<string, any>>) => void;
export declare const drawJSON: (data: any) => void;
export declare const parseError: (err: Error) => void;
export declare const actionRunner: <T extends (...args: any[]) => Promise<any>>(fn: T) => ((...args: Parameters<T>) => Promise<void>);
export declare const parseInteger: (value: string) => number;
export declare const parseBool: (value: string) => boolean;
export declare const log: (message?: string) => void;
export declare const warn: (message?: string) => void;
export declare const hint: (message?: string) => void;
export declare const success: (message?: string) => void;
export declare const error: (message?: string) => void;
export declare const logo = "\n    _                            _ _           ___   __   _____\n   /_\\  _ __  _ ____      ___ __(_) |_ ___    / __\\ / /   \\_   \\\n  //_\\\\| '_ \\| '_ \\ \\ /\\ / / '__| | __/ _ \\  / /   / /     / /\\/\n /  _  \\ |_) | |_) \\ V  V /| |  | | ||  __/ / /___/ /___/\\/ /_\n \\_/ \\_/ .__/| .__/ \\_/\\_/ |_|  |_|\\__\\___| \\____/\\____/\\____/\n       |_|   |_|\n\n";
export declare const commandDescriptions: Record<string, string>;
export { cliConfig };
//# sourceMappingURL=parser.d.ts.map