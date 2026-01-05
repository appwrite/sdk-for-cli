import { EventEmitter } from "node:events";
export declare const openRuntimesVersion = "v4";
export declare const runtimeNames: Record<string, string>;
interface SystemTool {
    isCompiled: boolean;
    startCommand: string;
    dependencyFiles: string[];
}
export declare const systemTools: Record<string, SystemTool>;
export declare const JwtManager: {
    userJwt: string | null;
    functionJwt: string | null;
    timerWarn: NodeJS.Timeout | null;
    timerError: NodeJS.Timeout | null;
    setup(userId?: string | null, projectScopes?: string[]): Promise<void>;
};
export declare const Queue: {
    files: string[];
    locked: boolean;
    events: EventEmitter<[never]>;
    debounce: NodeJS.Timeout | null;
    push(file: string): void;
    lock(): void;
    isEmpty(): boolean;
    unlock(): void;
    _trigger(): void;
};
export {};
//# sourceMappingURL=utils.d.ts.map