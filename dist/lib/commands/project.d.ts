import { Command } from "commander";
import { ProjectUsageRange } from "@appwrite.io/console";
export declare const project: Command;
export declare const projectGetUsage: ({ startDate, endDate, period, parseOutput, }: {
    startDate: string;
    endDate: string;
    period?: ProjectUsageRange;
    parseOutput?: boolean;
}) => Promise<any>;
export declare const projectListVariables: ({ parseOutput, }: {
    parseOutput?: boolean;
}) => Promise<any>;
export declare const projectCreateVariable: ({ key, value, secret, parseOutput, }: {
    key: string;
    value: string;
    secret?: boolean;
    parseOutput?: boolean;
}) => Promise<any>;
export declare const projectGetVariable: ({ variableId, parseOutput, }: {
    variableId: string;
    parseOutput?: boolean;
}) => Promise<any>;
export declare const projectUpdateVariable: ({ variableId, key, value, secret, parseOutput, }: {
    variableId: string;
    key: string;
    value?: string;
    secret?: boolean;
    parseOutput?: boolean;
}) => Promise<any>;
export declare const projectDeleteVariable: ({ variableId, parseOutput, }: {
    variableId: string;
    parseOutput?: boolean;
}) => Promise<any>;
//# sourceMappingURL=project.d.ts.map