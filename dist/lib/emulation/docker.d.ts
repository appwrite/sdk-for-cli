import type { FunctionConfig } from "../types.js";
export declare function dockerStop(id: string): Promise<void>;
export declare function dockerPull(func: FunctionConfig): Promise<void>;
export declare function dockerBuild(func: FunctionConfig, variables: Record<string, string>): Promise<void>;
export declare function dockerStart(func: FunctionConfig, variables: Record<string, string>, port: number): Promise<void>;
export declare function dockerCleanup(functionId: string): Promise<void>;
//# sourceMappingURL=docker.d.ts.map