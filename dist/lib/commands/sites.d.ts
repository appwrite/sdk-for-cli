import { Client } from "@appwrite.io/console";
import { Command } from "commander";
import type { UploadProgress } from "../types.js";
import { Framework, BuildRuntime, Adapter, UsageRange, TemplateReferenceType, VCSReferenceType, DeploymentDownloadType } from "@appwrite.io/console";
export declare const sites: Command;
interface SitesListRequestParams {
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const sitesList: ({ queries, search, total, parseOutput, overrideForCli, sdk, console: showConsole, }: SitesListRequestParams) => Promise<any>;
interface SitesCreateRequestParams {
    siteId: string;
    name: string;
    framework: Framework;
    buildRuntime: BuildRuntime;
    enabled?: boolean;
    logging?: boolean;
    timeout?: number;
    installCommand?: string;
    buildCommand?: string;
    outputDirectory?: string;
    adapter?: Adapter;
    installationId?: string;
    fallbackFile?: string;
    providerRepositoryId?: string;
    providerBranch?: string;
    providerSilentMode?: boolean;
    providerRootDirectory?: string;
    specification?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const sitesCreate: ({ siteId, name, framework, buildRuntime, enabled, logging, timeout, installCommand, buildCommand, outputDirectory, adapter, installationId, fallbackFile, providerRepositoryId, providerBranch, providerSilentMode, providerRootDirectory, specification, parseOutput, overrideForCli, sdk, }: SitesCreateRequestParams) => Promise<any>;
interface SitesListFrameworksRequestParams {
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const sitesListFrameworks: ({ parseOutput, overrideForCli, sdk, console: showConsole, }: SitesListFrameworksRequestParams) => Promise<any>;
interface SitesListSpecificationsRequestParams {
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const sitesListSpecifications: ({ parseOutput, overrideForCli, sdk, console: showConsole, }: SitesListSpecificationsRequestParams) => Promise<any>;
interface SitesListTemplatesRequestParams {
    frameworks?: string[];
    useCases?: string[];
    limit?: number;
    offset?: number;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const sitesListTemplates: ({ frameworks, useCases, limit, offset, parseOutput, overrideForCli, sdk, console: showConsole, }: SitesListTemplatesRequestParams) => Promise<any>;
interface SitesGetTemplateRequestParams {
    templateId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const sitesGetTemplate: ({ templateId, parseOutput, overrideForCli, sdk, console: showConsole, }: SitesGetTemplateRequestParams) => Promise<any>;
interface SitesListUsageRequestParams {
    range?: UsageRange;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const sitesListUsage: ({ range, parseOutput, overrideForCli, sdk, console: showConsole, }: SitesListUsageRequestParams) => Promise<any>;
interface SitesGetRequestParams {
    siteId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const sitesGet: ({ siteId, parseOutput, overrideForCli, sdk, console: showConsole, }: SitesGetRequestParams) => Promise<any>;
interface SitesUpdateRequestParams {
    siteId: string;
    name: string;
    framework: Framework;
    enabled?: boolean;
    logging?: boolean;
    timeout?: number;
    installCommand?: string;
    buildCommand?: string;
    outputDirectory?: string;
    buildRuntime?: BuildRuntime;
    adapter?: Adapter;
    fallbackFile?: string;
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
export declare const sitesUpdate: ({ siteId, name, framework, enabled, logging, timeout, installCommand, buildCommand, outputDirectory, buildRuntime, adapter, fallbackFile, installationId, providerRepositoryId, providerBranch, providerSilentMode, providerRootDirectory, specification, parseOutput, overrideForCli, sdk, }: SitesUpdateRequestParams) => Promise<any>;
interface SitesDeleteRequestParams {
    siteId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const sitesDelete: ({ siteId, parseOutput, overrideForCli, sdk, }: SitesDeleteRequestParams) => Promise<any>;
interface SitesUpdateSiteDeploymentRequestParams {
    siteId: string;
    deploymentId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const sitesUpdateSiteDeployment: ({ siteId, deploymentId, parseOutput, overrideForCli, sdk, }: SitesUpdateSiteDeploymentRequestParams) => Promise<any>;
interface SitesListDeploymentsRequestParams {
    siteId: string;
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const sitesListDeployments: ({ siteId, queries, search, total, parseOutput, overrideForCli, sdk, console: showConsole, }: SitesListDeploymentsRequestParams) => Promise<any>;
interface SitesCreateDeploymentRequestParams {
    siteId: string;
    code: string;
    activate: boolean;
    installCommand?: string;
    buildCommand?: string;
    outputDirectory?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    onProgress?: (progress: UploadProgress) => void;
}
export declare const sitesCreateDeployment: ({ siteId, code, activate, installCommand, buildCommand, outputDirectory, parseOutput, overrideForCli, sdk, onProgress, }: SitesCreateDeploymentRequestParams) => Promise<any>;
interface SitesCreateDuplicateDeploymentRequestParams {
    siteId: string;
    deploymentId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const sitesCreateDuplicateDeployment: ({ siteId, deploymentId, parseOutput, overrideForCli, sdk, }: SitesCreateDuplicateDeploymentRequestParams) => Promise<any>;
interface SitesCreateTemplateDeploymentRequestParams {
    siteId: string;
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
export declare const sitesCreateTemplateDeployment: ({ siteId, repository, owner, rootDirectory, type, reference, activate, parseOutput, overrideForCli, sdk, }: SitesCreateTemplateDeploymentRequestParams) => Promise<any>;
interface SitesCreateVcsDeploymentRequestParams {
    siteId: string;
    type: VCSReferenceType;
    reference: string;
    activate?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const sitesCreateVcsDeployment: ({ siteId, type, reference, activate, parseOutput, overrideForCli, sdk, }: SitesCreateVcsDeploymentRequestParams) => Promise<any>;
interface SitesGetDeploymentRequestParams {
    siteId: string;
    deploymentId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const sitesGetDeployment: ({ siteId, deploymentId, parseOutput, overrideForCli, sdk, console: showConsole, }: SitesGetDeploymentRequestParams) => Promise<any>;
interface SitesDeleteDeploymentRequestParams {
    siteId: string;
    deploymentId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const sitesDeleteDeployment: ({ siteId, deploymentId, parseOutput, overrideForCli, sdk, }: SitesDeleteDeploymentRequestParams) => Promise<any>;
interface SitesGetDeploymentDownloadRequestParams {
    siteId: string;
    deploymentId: string;
    type?: DeploymentDownloadType;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    destination?: string;
    console?: boolean;
}
export declare const sitesGetDeploymentDownload: ({ siteId, deploymentId, type, parseOutput, overrideForCli, sdk, destination, console: showConsole, }: SitesGetDeploymentDownloadRequestParams) => Promise<any>;
interface SitesUpdateDeploymentStatusRequestParams {
    siteId: string;
    deploymentId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const sitesUpdateDeploymentStatus: ({ siteId, deploymentId, parseOutput, overrideForCli, sdk, }: SitesUpdateDeploymentStatusRequestParams) => Promise<any>;
interface SitesListLogsRequestParams {
    siteId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const sitesListLogs: ({ siteId, queries, total, parseOutput, overrideForCli, sdk, }: SitesListLogsRequestParams) => Promise<any>;
interface SitesGetLogRequestParams {
    siteId: string;
    logId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const sitesGetLog: ({ siteId, logId, parseOutput, overrideForCli, sdk, console: showConsole, }: SitesGetLogRequestParams) => Promise<any>;
interface SitesDeleteLogRequestParams {
    siteId: string;
    logId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const sitesDeleteLog: ({ siteId, logId, parseOutput, overrideForCli, sdk, }: SitesDeleteLogRequestParams) => Promise<any>;
interface SitesGetUsageRequestParams {
    siteId: string;
    range?: UsageRange;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const sitesGetUsage: ({ siteId, range, parseOutput, overrideForCli, sdk, }: SitesGetUsageRequestParams) => Promise<any>;
interface SitesListVariablesRequestParams {
    siteId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const sitesListVariables: ({ siteId, parseOutput, overrideForCli, sdk, }: SitesListVariablesRequestParams) => Promise<any>;
interface SitesCreateVariableRequestParams {
    siteId: string;
    key: string;
    value: string;
    secret?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const sitesCreateVariable: ({ siteId, key, value, secret, parseOutput, overrideForCli, sdk, }: SitesCreateVariableRequestParams) => Promise<any>;
interface SitesGetVariableRequestParams {
    siteId: string;
    variableId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const sitesGetVariable: ({ siteId, variableId, parseOutput, overrideForCli, sdk, }: SitesGetVariableRequestParams) => Promise<any>;
interface SitesUpdateVariableRequestParams {
    siteId: string;
    variableId: string;
    key: string;
    value?: string;
    secret?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const sitesUpdateVariable: ({ siteId, variableId, key, value, secret, parseOutput, overrideForCli, sdk, }: SitesUpdateVariableRequestParams) => Promise<any>;
interface SitesDeleteVariableRequestParams {
    siteId: string;
    variableId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const sitesDeleteVariable: ({ siteId, variableId, parseOutput, overrideForCli, sdk, }: SitesDeleteVariableRequestParams) => Promise<any>;
export {};
//# sourceMappingURL=sites.d.ts.map