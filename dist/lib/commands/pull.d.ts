import { Command } from "commander";
interface PullResourcesOptions {
    skipDeprecated?: boolean;
}
export declare const pullResources: ({ skipDeprecated, }?: PullResourcesOptions) => Promise<void>;
export declare const pull: Command;
export {};
//# sourceMappingURL=pull.d.ts.map