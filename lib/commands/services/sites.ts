import { Command } from "commander";
import fs from "fs";
import { sdkForProject } from "../../sdks.js";
import {
  actionRunner,
  commandDescriptions,
  success,
  parse,
  parseBool,
  parseInteger,
} from "../../parser.js";
import {
  Sites,
  Framework,
  BuildRuntime,
  Adapter,
  UsageRange,
  TemplateReferenceType,
  VCSReferenceType,
  DeploymentDownloadType,
} from "@appwrite.io/console";

let sitesClient: Sites | null = null;

const getSitesClient = async (): Promise<Sites> => {
  if (!sitesClient) {
    const sdkClient = await sdkForProject();
    sitesClient = new Sites(sdkClient);
  }
  return sitesClient;
};

export const sites = new Command("sites")
  .description(commandDescriptions["sites"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

sites
  .command(`list`)
  .description(`Get a list of all the project's sites. You can use the query params to filter your results.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, framework, deploymentId, buildCommand, installCommand, outputDirectory, installationId`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ queries, search, total }) =>
        parse(await (await getSitesClient()).list(queries, search, total)),
    ),
  );

sites
  .command(`create`)
  .description(`Create a new site.`)
  .requiredOption(`--site-id <site-id>`, `Site ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Site name. Max length: 128 chars.`)
  .requiredOption(`--framework <framework>`, `Sites framework.`)
  .requiredOption(`--build-runtime <build-runtime>`, `Runtime to use during build step.`)
  .option(
    `--enabled [value]`,
    `Is site enabled? When set to 'disabled', users cannot access the site but Server SDKs with and API key can still access the site. No data is lost when this is toggled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--logging [value]`,
    `When disabled, request logs will exclude logs and errors, and site responses will be slightly faster.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--timeout <timeout>`, `Maximum request time in seconds.`, parseInteger)
  .option(`--install-command <install-command>`, `Install Command.`)
  .option(`--build-command <build-command>`, `Build Command.`)
  .option(`--output-directory <output-directory>`, `Output Directory for site.`)
  .option(`--adapter <adapter>`, `Framework adapter defining rendering strategy. Allowed values are: static, ssr`)
  .option(`--installation-id <installation-id>`, `Appwrite Installation ID for VCS (Version Control System) deployment.`)
  .option(`--fallback-file <fallback-file>`, `Fallback file for single page application sites.`)
  .option(`--provider-repository-id <provider-repository-id>`, `Repository ID of the repo linked to the site.`)
  .option(`--provider-branch <provider-branch>`, `Production branch for the repo linked to the site.`)
  .option(
    `--provider-silent-mode [value]`,
    `Is the VCS (Version Control System) connection in silent mode for the repo linked to the site? In silent mode, comments will not be made on commits and pull requests.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--provider-root-directory <provider-root-directory>`, `Path to site code in the linked repo.`)
  .option(`--specification <specification>`, `Framework specification for the site and builds.`)
  .action(
    actionRunner(
      async ({ siteId, name, framework, buildRuntime, enabled, logging, timeout, installCommand, buildCommand, outputDirectory, adapter, installationId, fallbackFile, providerRepositoryId, providerBranch, providerSilentMode, providerRootDirectory, specification }) =>
        parse(await (await getSitesClient()).create(siteId, name, framework as Framework, buildRuntime as BuildRuntime, enabled, logging, timeout, installCommand, buildCommand, outputDirectory, adapter as Adapter, installationId, fallbackFile, providerRepositoryId, providerBranch, providerSilentMode, providerRootDirectory, specification)),
    ),
  );

sites
  .command(`list-frameworks`)
  .description(`Get a list of all frameworks that are currently available on the server instance.`)
  .action(
    actionRunner(
      async () => parse(await (await getSitesClient()).listFrameworks()),
    ),
  );

sites
  .command(`list-specifications`)
  .description(`List allowed site specifications for this instance.`)
  .action(
    actionRunner(
      async () => parse(await (await getSitesClient()).listSpecifications()),
    ),
  );

sites
  .command(`list-templates`)
  .description(`List available site templates. You can use template details in [createSite](/docs/references/cloud/server-nodejs/sites#create) method.`)
  .option(`--frameworks [frameworks...]`, `List of frameworks allowed for filtering site templates. Maximum of 100 frameworks are allowed.`)
  .option(`--use-cases [use-cases...]`, `List of use cases allowed for filtering site templates. Maximum of 100 use cases are allowed.`)
  .option(`--limit <limit>`, `Limit the number of templates returned in the response. Default limit is 25, and maximum limit is 5000.`, parseInteger)
  .option(`--offset <offset>`, `Offset the list of returned templates. Maximum offset is 5000.`, parseInteger)
  .action(
    actionRunner(
      async ({ frameworks, useCases, limit, offset }) =>
        parse(await (await getSitesClient()).listTemplates(frameworks, useCases, limit, offset)),
    ),
  );

sites
  .command(`get-template`)
  .description(`Get a site template using ID. You can use template details in [createSite](/docs/references/cloud/server-nodejs/sites#create) method.`)
  .requiredOption(`--template-id <template-id>`, `Template ID.`)
  .action(
    actionRunner(
      async ({ templateId }) =>
        parse(await (await getSitesClient()).getTemplate(templateId)),
    ),
  );

sites
  .command(`list-usage`)
  .description(`Get usage metrics and statistics for all sites in the project. View statistics including total deployments, builds, logs, storage usage, and compute time. The response includes both current totals and historical data for each metric. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, defaults to 30 days.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ range }) =>
        parse(await (await getSitesClient()).listUsage(range as UsageRange)),
    ),
  );

sites
  .command(`get`)
  .description(`Get a site by its unique ID.`)
  .requiredOption(`--site-id <site-id>`, `Site ID.`)
  .action(
    actionRunner(
      async ({ siteId }) =>
        parse(await (await getSitesClient()).get(siteId)),
    ),
  );

sites
  .command(`update`)
  .description(`Update site by its unique ID.`)
  .requiredOption(`--site-id <site-id>`, `Site ID.`)
  .requiredOption(`--name <name>`, `Site name. Max length: 128 chars.`)
  .requiredOption(`--framework <framework>`, `Sites framework.`)
  .option(
    `--enabled [value]`,
    `Is site enabled? When set to 'disabled', users cannot access the site but Server SDKs with and API key can still access the site. No data is lost when this is toggled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--logging [value]`,
    `When disabled, request logs will exclude logs and errors, and site responses will be slightly faster.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--timeout <timeout>`, `Maximum request time in seconds.`, parseInteger)
  .option(`--install-command <install-command>`, `Install Command.`)
  .option(`--build-command <build-command>`, `Build Command.`)
  .option(`--output-directory <output-directory>`, `Output Directory for site.`)
  .option(`--build-runtime <build-runtime>`, `Runtime to use during build step.`)
  .option(`--adapter <adapter>`, `Framework adapter defining rendering strategy. Allowed values are: static, ssr`)
  .option(`--fallback-file <fallback-file>`, `Fallback file for single page application sites.`)
  .option(`--installation-id <installation-id>`, `Appwrite Installation ID for VCS (Version Control System) deployment.`)
  .option(`--provider-repository-id <provider-repository-id>`, `Repository ID of the repo linked to the site.`)
  .option(`--provider-branch <provider-branch>`, `Production branch for the repo linked to the site.`)
  .option(
    `--provider-silent-mode [value]`,
    `Is the VCS (Version Control System) connection in silent mode for the repo linked to the site? In silent mode, comments will not be made on commits and pull requests.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--provider-root-directory <provider-root-directory>`, `Path to site code in the linked repo.`)
  .option(`--specification <specification>`, `Framework specification for the site and builds.`)
  .action(
    actionRunner(
      async ({ siteId, name, framework, enabled, logging, timeout, installCommand, buildCommand, outputDirectory, buildRuntime, adapter, fallbackFile, installationId, providerRepositoryId, providerBranch, providerSilentMode, providerRootDirectory, specification }) =>
        parse(await (await getSitesClient()).update(siteId, name, framework as Framework, enabled, logging, timeout, installCommand, buildCommand, outputDirectory, buildRuntime as BuildRuntime, adapter as Adapter, fallbackFile, installationId, providerRepositoryId, providerBranch, providerSilentMode, providerRootDirectory, specification)),
    ),
  );

sites
  .command(`delete`)
  .description(`Delete a site by its unique ID.`)
  .requiredOption(`--site-id <site-id>`, `Site ID.`)
  .action(
    actionRunner(
      async ({ siteId }) =>
        parse(await (await getSitesClient()).delete(siteId)),
    ),
  );

sites
  .command(`update-site-deployment`)
  .description(`Update the site active deployment. Use this endpoint to switch the code deployment that should be used when visitor opens your site.`)
  .requiredOption(`--site-id <site-id>`, `Site ID.`)
  .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
  .action(
    actionRunner(
      async ({ siteId, deploymentId }) =>
        parse(await (await getSitesClient()).updateSiteDeployment(siteId, deploymentId)),
    ),
  );

sites
  .command(`list-deployments`)
  .description(`Get a list of all the site's code deployments. You can use the query params to filter your results.`)
  .requiredOption(`--site-id <site-id>`, `Site ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: buildSize, sourceSize, totalSize, buildDuration, status, activate, type`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ siteId, queries, search, total }) =>
        parse(await (await getSitesClient()).listDeployments(siteId, queries, search, total)),
    ),
  );

sites
  .command(`create-deployment`)
  .description(`Create a new site code deployment. Use this endpoint to upload a new version of your site code. To activate your newly uploaded code, you'll need to update the site's deployment to use your new deployment ID.`)
  .requiredOption(`--site-id <site-id>`, `Site ID.`)
  .requiredOption(`--code <code>`, `Gzip file with your code package. When used with the Appwrite CLI, pass the path to your code directory, and the CLI will automatically package your code. Use a path that is within the current directory.`)
  .requiredOption(`--activate <activate>`, `Automatically activate the deployment when it is finished building.`, parseBool)
  .option(`--install-command <install-command>`, `Install Commands.`)
  .option(`--build-command <build-command>`, `Build Commands.`)
  .option(`--output-directory <output-directory>`, `Output Directory.`)
  .action(
    actionRunner(
      async ({ siteId, code, activate, installCommand, buildCommand, outputDirectory }) =>
        parse(await (await getSitesClient()).createDeployment(siteId, code, activate, installCommand, buildCommand, outputDirectory)),
    ),
  );

sites
  .command(`create-duplicate-deployment`)
  .description(`Create a new build for an existing site deployment. This endpoint allows you to rebuild a deployment with the updated site configuration, including its commands and output directory if they have been modified. The build process will be queued and executed asynchronously. The original deployment's code will be preserved and used for the new build.`)
  .requiredOption(`--site-id <site-id>`, `Site ID.`)
  .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
  .action(
    actionRunner(
      async ({ siteId, deploymentId }) =>
        parse(await (await getSitesClient()).createDuplicateDeployment(siteId, deploymentId)),
    ),
  );

sites
  .command(`create-template-deployment`)
  .description(`Create a deployment based on a template.

Use this endpoint with combination of [listTemplates](https://appwrite.io/docs/products/sites/templates) to find the template details.`)
  .requiredOption(`--site-id <site-id>`, `Site ID.`)
  .requiredOption(`--repository <repository>`, `Repository name of the template.`)
  .requiredOption(`--owner <owner>`, `The name of the owner of the template.`)
  .requiredOption(`--root-directory <root-directory>`, `Path to site code in the template repo.`)
  .requiredOption(`--type <type>`, `Type for the reference provided. Can be commit, branch, or tag`)
  .requiredOption(`--reference <reference>`, `Reference value, can be a commit hash, branch name, or release tag`)
  .option(
    `--activate [value]`,
    `Automatically activate the deployment when it is finished building.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ siteId, repository, owner, rootDirectory, type, reference, activate }) =>
        parse(await (await getSitesClient()).createTemplateDeployment(siteId, repository, owner, rootDirectory, type as TemplateReferenceType, reference, activate)),
    ),
  );

sites
  .command(`create-vcs-deployment`)
  .description(`Create a deployment when a site is connected to VCS.

This endpoint lets you create deployment from a branch, commit, or a tag.`)
  .requiredOption(`--site-id <site-id>`, `Site ID.`)
  .requiredOption(`--type <type>`, `Type of reference passed. Allowed values are: branch, commit`)
  .requiredOption(`--reference <reference>`, `VCS reference to create deployment from. Depending on type this can be: branch name, commit hash`)
  .option(
    `--activate [value]`,
    `Automatically activate the deployment when it is finished building.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ siteId, type, reference, activate }) =>
        parse(await (await getSitesClient()).createVcsDeployment(siteId, type as VCSReferenceType, reference, activate)),
    ),
  );

sites
  .command(`get-deployment`)
  .description(`Get a site deployment by its unique ID.`)
  .requiredOption(`--site-id <site-id>`, `Site ID.`)
  .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
  .action(
    actionRunner(
      async ({ siteId, deploymentId }) =>
        parse(await (await getSitesClient()).getDeployment(siteId, deploymentId)),
    ),
  );

sites
  .command(`delete-deployment`)
  .description(`Delete a site deployment by its unique ID.`)
  .requiredOption(`--site-id <site-id>`, `Site ID.`)
  .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
  .action(
    actionRunner(
      async ({ siteId, deploymentId }) =>
        parse(await (await getSitesClient()).deleteDeployment(siteId, deploymentId)),
    ),
  );

sites
  .command(`get-deployment-download`)
  .description(`Get a site deployment content by its unique ID. The endpoint response return with a 'Content-Disposition: attachment' header that tells the browser to start downloading the file to user downloads directory.`)
  .requiredOption(`--site-id <site-id>`, `Site ID.`)
  .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
  .option(`--type <type>`, `Deployment file to download. Can be: "source", "output".`)
  .requiredOption(`--destination <destination>`, `Path to save the file to.`)
  .action(
    actionRunner(
      async ({ siteId, deploymentId, type, destination }) => {
        const url = await (await getSitesClient()).getDeploymentDownload(siteId, deploymentId, type as DeploymentDownloadType);
        const response = await fetch(url);
        const buffer = Buffer.from(await response.arrayBuffer());
        fs.writeFileSync(destination, buffer);
        success(`File saved to ${destination}`);
      },
    ),
  );

sites
  .command(`update-deployment-status`)
  .description(`Cancel an ongoing site deployment build. If the build is already in progress, it will be stopped and marked as canceled. If the build hasn't started yet, it will be marked as canceled without executing. You cannot cancel builds that have already completed (status 'ready') or failed. The response includes the final build status and details.`)
  .requiredOption(`--site-id <site-id>`, `Site ID.`)
  .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
  .action(
    actionRunner(
      async ({ siteId, deploymentId }) =>
        parse(await (await getSitesClient()).updateDeploymentStatus(siteId, deploymentId)),
    ),
  );

sites
  .command(`list-logs`)
  .description(`Get a list of all site logs. You can use the query params to filter your results.`)
  .requiredOption(`--site-id <site-id>`, `Site ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: trigger, status, responseStatusCode, duration, requestMethod, requestPath, deploymentId`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ siteId, queries, total }) =>
        parse(await (await getSitesClient()).listLogs(siteId, queries, total)),
    ),
  );

sites
  .command(`get-log`)
  .description(`Get a site request log by its unique ID.`)
  .requiredOption(`--site-id <site-id>`, `Site ID.`)
  .requiredOption(`--log-id <log-id>`, `Log ID.`)
  .action(
    actionRunner(
      async ({ siteId, logId }) =>
        parse(await (await getSitesClient()).getLog(siteId, logId)),
    ),
  );

sites
  .command(`delete-log`)
  .description(`Delete a site log by its unique ID.`)
  .requiredOption(`--site-id <site-id>`, `Site ID.`)
  .requiredOption(`--log-id <log-id>`, `Log ID.`)
  .action(
    actionRunner(
      async ({ siteId, logId }) =>
        parse(await (await getSitesClient()).deleteLog(siteId, logId)),
    ),
  );

sites
  .command(`get-usage`)
  .description(`Get usage metrics and statistics for a for a specific site. View statistics including total deployments, builds, executions, storage usage, and compute time. The response includes both current totals and historical data for each metric. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, defaults to 30 days.`)
  .requiredOption(`--site-id <site-id>`, `Site ID.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ siteId, range }) =>
        parse(await (await getSitesClient()).getUsage(siteId, range as UsageRange)),
    ),
  );

sites
  .command(`list-variables`)
  .description(`Get a list of all variables of a specific site.`)
  .requiredOption(`--site-id <site-id>`, `Site unique ID.`)
  .action(
    actionRunner(
      async ({ siteId }) =>
        parse(await (await getSitesClient()).listVariables(siteId)),
    ),
  );

sites
  .command(`create-variable`)
  .description(`Create a new site variable. These variables can be accessed during build and runtime (server-side rendering) as environment variables.`)
  .requiredOption(`--site-id <site-id>`, `Site unique ID.`)
  .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
  .requiredOption(`--value <value>`, `Variable value. Max length: 8192 chars.`)
  .option(
    `--secret [value]`,
    `Secret variables can be updated or deleted, but only sites can read them during build and runtime.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ siteId, key, value, secret }) =>
        parse(await (await getSitesClient()).createVariable(siteId, key, value, secret)),
    ),
  );

sites
  .command(`get-variable`)
  .description(`Get a variable by its unique ID.`)
  .requiredOption(`--site-id <site-id>`, `Site unique ID.`)
  .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
  .action(
    actionRunner(
      async ({ siteId, variableId }) =>
        parse(await (await getSitesClient()).getVariable(siteId, variableId)),
    ),
  );

sites
  .command(`update-variable`)
  .description(`Update variable by its unique ID.`)
  .requiredOption(`--site-id <site-id>`, `Site unique ID.`)
  .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
  .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
  .option(`--value <value>`, `Variable value. Max length: 8192 chars.`)
  .option(
    `--secret [value]`,
    `Secret variables can be updated or deleted, but only sites can read them during build and runtime.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ siteId, variableId, key, value, secret }) =>
        parse(await (await getSitesClient()).updateVariable(siteId, variableId, key, value, secret)),
    ),
  );

sites
  .command(`delete-variable`)
  .description(`Delete a variable by its unique ID.`)
  .requiredOption(`--site-id <site-id>`, `Site unique ID.`)
  .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
  .action(
    actionRunner(
      async ({ siteId, variableId }) =>
        parse(await (await getSitesClient()).deleteVariable(siteId, variableId)),
    ),
  );

