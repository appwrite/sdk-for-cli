import { Client } from "@appwrite.io/console";
import { Command } from "commander";
import type { UploadProgress } from "../types.js";
import { Runtime, UsageRange, TemplateReferenceType, VCSReferenceType, DeploymentDownloadType, ExecutionMethod } from "@appwrite.io/console";
export declare const functions: Command;
interface FunctionsListRequestParams {
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const functionsList: ({ queries, search, total, parseOutput, overrideForCli, sdk, console: showConsole, }: FunctionsListRequestParams) => Promise<any>;
interface FunctionsCreateRequestParams {
    functionId: string;
    name: string;
    runtime: Runtime;
    execute?: string[];
    events?: string[];
    schedule?: string;
    timeout?: number;
    enabled?: boolean;
    logging?: boolean;
    entrypoint?: string;
    commands?: string;
    scopes?: string[];
    installationId?: string;
    providerRepositoryId?: string;
    providerBranch?: string;
    providerSilentMode?: boolean;
    providerRootDirectory?: string;
    specification?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsCreate: ({ functionId, name, runtime, execute, events, schedule, timeout, enabled, logging, entrypoint, commands, scopes, installationId, providerRepositoryId, providerBranch, providerSilentMode, providerRootDirectory, specification, parseOutput, overrideForCli, sdk, }: FunctionsCreateRequestParams) => Promise<any>;
interface FunctionsListRuntimesRequestParams {
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsListRuntimes: ({ parseOutput, overrideForCli, sdk, }: FunctionsListRuntimesRequestParams) => Promise<any>;
interface FunctionsListSpecificationsRequestParams {
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const functionsListSpecifications: ({ parseOutput, overrideForCli, sdk, console: showConsole, }: FunctionsListSpecificationsRequestParams) => Promise<any>;
interface FunctionsListTemplatesRequestParams {
    runtimes?: string[];
    useCases?: string[];
    limit?: number;
    offset?: number;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const functionsListTemplates: ({ runtimes, useCases, limit, offset, total, parseOutput, overrideForCli, sdk, console: showConsole, }: FunctionsListTemplatesRequestParams) => Promise<any>;
interface FunctionsGetTemplateRequestParams {
    templateId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const functionsGetTemplate: ({ templateId, parseOutput, overrideForCli, sdk, console: showConsole, }: FunctionsGetTemplateRequestParams) => Promise<any>;
interface FunctionsListUsageRequestParams {
    range?: UsageRange;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const functionsListUsage: ({ range, parseOutput, overrideForCli, sdk, console: showConsole, }: FunctionsListUsageRequestParams) => Promise<any>;
interface FunctionsGetRequestParams {
    functionId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const functionsGet: ({ functionId, parseOutput, overrideForCli, sdk, console: showConsole, }: FunctionsGetRequestParams) => Promise<any>;
interface FunctionsUpdateRequestParams {
    functionId: string;
    name: string;
    runtime?: Runtime;
    execute?: string[];
    events?: string[];
    schedule?: string;
    timeout?: number;
    enabled?: boolean;
    logging?: boolean;
    entrypoint?: string;
    commands?: string;
    scopes?: string[];
    installationId?: string;
    providerRepositoryId?: string;
    providerBranch?: string;
    providerSilentMode?: boolean;
    providerRootDirectory?: string;
    specification?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsUpdate: ({ functionId, name, runtime, execute, events, schedule, timeout, enabled, logging, entrypoint, commands, scopes, installationId, providerRepositoryId, providerBranch, providerSilentMode, providerRootDirectory, specification, parseOutput, overrideForCli, sdk, }: FunctionsUpdateRequestParams) => Promise<any>;
interface FunctionsDeleteRequestParams {
    functionId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsDelete: ({ functionId, parseOutput, overrideForCli, sdk, }: FunctionsDeleteRequestParams) => Promise<any>;
interface FunctionsUpdateFunctionDeploymentRequestParams {
    functionId: string;
    deploymentId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsUpdateFunctionDeployment: ({ functionId, deploymentId, parseOutput, overrideForCli, sdk, }: FunctionsUpdateFunctionDeploymentRequestParams) => Promise<any>;
interface FunctionsListDeploymentsRequestParams {
    functionId: string;
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const functionsListDeployments: ({ functionId, queries, search, total, parseOutput, overrideForCli, sdk, console: showConsole, }: FunctionsListDeploymentsRequestParams) => Promise<any>;
interface FunctionsCreateDeploymentRequestParams {
    functionId: string;
    code: string;
    activate: boolean;
    entrypoint?: string;
    commands?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    onProgress?: (progress: UploadProgress) => void;
}
export declare const functionsCreateDeployment: ({ functionId, code, activate, entrypoint, commands, parseOutput, overrideForCli, sdk, onProgress, }: FunctionsCreateDeploymentRequestParams) => Promise<any>;
interface FunctionsCreateDuplicateDeploymentRequestParams {
    functionId: string;
    deploymentId: string;
    buildId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsCreateDuplicateDeployment: ({ functionId, deploymentId, buildId, parseOutput, overrideForCli, sdk, }: FunctionsCreateDuplicateDeploymentRequestParams) => Promise<any>;
interface FunctionsCreateTemplateDeploymentRequestParams {
    functionId: string;
    repository: string;
    owner: string;
    rootDirectory: string;
    type: TemplateReferenceType;
    reference: string;
    activate?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsCreateTemplateDeployment: ({ functionId, repository, owner, rootDirectory, type, reference, activate, parseOutput, overrideForCli, sdk, }: FunctionsCreateTemplateDeploymentRequestParams) => Promise<any>;
interface FunctionsCreateVcsDeploymentRequestParams {
    functionId: string;
    type: VCSReferenceType;
    reference: string;
    activate?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsCreateVcsDeployment: ({ functionId, type, reference, activate, parseOutput, overrideForCli, sdk, }: FunctionsCreateVcsDeploymentRequestParams) => Promise<any>;
interface FunctionsGetDeploymentRequestParams {
    functionId: string;
    deploymentId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const functionsGetDeployment: ({ functionId, deploymentId, parseOutput, overrideForCli, sdk, console: showConsole, }: FunctionsGetDeploymentRequestParams) => Promise<any>;
interface FunctionsDeleteDeploymentRequestParams {
    functionId: string;
    deploymentId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsDeleteDeployment: ({ functionId, deploymentId, parseOutput, overrideForCli, sdk, }: FunctionsDeleteDeploymentRequestParams) => Promise<any>;
interface FunctionsGetDeploymentDownloadRequestParams {
    functionId: string;
    deploymentId: string;
    type?: DeploymentDownloadType;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    destination?: string;
    console?: boolean;
}
export declare const functionsGetDeploymentDownload: ({ functionId, deploymentId, type, parseOutput, overrideForCli, sdk, destination, console: showConsole, }: FunctionsGetDeploymentDownloadRequestParams) => Promise<any>;
interface FunctionsUpdateDeploymentStatusRequestParams {
    functionId: string;
    deploymentId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsUpdateDeploymentStatus: ({ functionId, deploymentId, parseOutput, overrideForCli, sdk, }: FunctionsUpdateDeploymentStatusRequestParams) => Promise<any>;
interface FunctionsListExecutionsRequestParams {
    functionId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const functionsListExecutions: ({ functionId, queries, total, parseOutput, overrideForCli, sdk, console: showConsole, }: FunctionsListExecutionsRequestParams) => Promise<any>;
interface FunctionsCreateExecutionRequestParams {
    functionId: string;
    body?: string;
    async?: boolean;
    xpath?: string;
    method?: ExecutionMethod;
    headers?: string;
    scheduledAt?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsCreateExecution: ({ functionId, body, async, xpath, method, headers, scheduledAt, parseOutput, overrideForCli, sdk, }: FunctionsCreateExecutionRequestParams) => Promise<any>;
interface FunctionsGetExecutionRequestParams {
    functionId: string;
    executionId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const functionsGetExecution: ({ functionId, executionId, parseOutput, overrideForCli, sdk, console: showConsole, }: FunctionsGetExecutionRequestParams) => Promise<any>;
interface FunctionsDeleteExecutionRequestParams {
    functionId: string;
    executionId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsDeleteExecution: ({ functionId, executionId, parseOutput, overrideForCli, sdk, }: FunctionsDeleteExecutionRequestParams) => Promise<any>;
interface FunctionsGetUsageRequestParams {
    functionId: string;
    range?: UsageRange;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsGetUsage: ({ functionId, range, parseOutput, overrideForCli, sdk, }: FunctionsGetUsageRequestParams) => Promise<any>;
interface FunctionsListVariablesRequestParams {
    functionId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsListVariables: ({ functionId, parseOutput, overrideForCli, sdk, }: FunctionsListVariablesRequestParams) => Promise<any>;
interface FunctionsCreateVariableRequestParams {
    functionId: string;
    key: string;
    value: string;
    secret?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsCreateVariable: ({ functionId, key, value, secret, parseOutput, overrideForCli, sdk, }: FunctionsCreateVariableRequestParams) => Promise<any>;
interface FunctionsGetVariableRequestParams {
    functionId: string;
    variableId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsGetVariable: ({ functionId, variableId, parseOutput, overrideForCli, sdk, }: FunctionsGetVariableRequestParams) => Promise<any>;
interface FunctionsUpdateVariableRequestParams {
    functionId: string;
    variableId: string;
    key: string;
    value?: string;
    secret?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsUpdateVariable: ({ functionId, variableId, key, value, secret, parseOutput, overrideForCli, sdk, }: FunctionsUpdateVariableRequestParams) => Promise<any>;
interface FunctionsDeleteVariableRequestParams {
    functionId: string;
    variableId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const functionsDeleteVariable: ({ functionId, variableId, parseOutput, overrideForCli, sdk, }: FunctionsDeleteVariableRequestParams) => Promise<any>;
export {};
//# sourceMappingURL=functions.d.ts.map