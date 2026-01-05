import { Command } from "commander";
interface LoginCommandOptions {
    email?: string;
    password?: string;
    endpoint?: string;
    mfa?: string;
    code?: string;
}
export declare const loginCommand: ({ email, password, endpoint, mfa, code, }: LoginCommandOptions) => Promise<void>;
export declare const whoami: Command;
export declare const register: Command;
export declare const login: Command;
export declare const logout: Command;
export declare const client: Command;
export declare const migrate: () => Promise<void>;
export {};
//# sourceMappingURL=generic.d.ts.map