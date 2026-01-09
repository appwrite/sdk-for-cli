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
  Functions,
  Runtime,
  UsageRange,
  TemplateReferenceType,
  VCSReferenceType,
  DeploymentDownloadType,
  ExecutionMethod,
} from "@appwrite.io/console";

let functionsClient: Functions | null = null;

const getFunctionsClient = async (): Promise<Functions> => {
  if (!functionsClient) {
    const sdkClient = await sdkForProject();
    functionsClient = new Functions(sdkClient);
  }
  return functionsClient;
};

export const functions = new Command("functions")
  .description(commandDescriptions["functions"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

functions
  .command(`list`)
  .description(`Get a list of all the project's functions. You can use the query params to filter your results.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, runtime, deploymentId, schedule, scheduleNext, schedulePrevious, timeout, entrypoint, commands, installationId`)
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
        parse(await (await getFunctionsClient()).list(queries, search, total)),
    ),
  );

functions
  .command(`create`)
  .description(`Create a new function. You can pass a list of [permissions](https://appwrite.io/docs/permissions) to allow different project users or team with access to execute the function using the client API.`)
  .requiredOption(`--functionid <functionid>`, `Function ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Function name. Max length: 128 chars.`)
  .requiredOption(`--runtime <runtime>`, `Execution runtime.`)
  .option(`--execute [execute...]`, `An array of role strings with execution permissions. By default no user is granted with any execute permissions. [learn more about roles](https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.`)
  .option(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
  .option(`--schedule <schedule>`, `Schedule CRON syntax.`)
  .option(`--timeout <timeout>`, `Function maximum execution time in seconds.`, parseInteger)
  .option(
    `--enabled [value]`,
    `Is function enabled? When set to 'disabled', users cannot access the function but Server SDKs with and API key can still access the function. No data is lost when this is toggled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--logging [value]`,
    `When disabled, executions will exclude logs and errors, and will be slightly faster.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--entrypoint <entrypoint>`, `Entrypoint File. This path is relative to the "providerRootDirectory".`)
  .option(`--commands <commands>`, `Build Commands.`)
  .option(`--scopes [scopes...]`, `List of scopes allowed for API key auto-generated for every execution. Maximum of 100 scopes are allowed.`)
  .option(`--installationid <installationid>`, `Appwrite Installation ID for VCS (Version Control System) deployment.`)
  .option(`--providerrepositoryid <providerrepositoryid>`, `Repository ID of the repo linked to the function.`)
  .option(`--providerbranch <providerbranch>`, `Production branch for the repo linked to the function.`)
  .option(
    `--providersilentmode [value]`,
    `Is the VCS (Version Control System) connection in silent mode for the repo linked to the function? In silent mode, comments will not be made on commits and pull requests.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--providerrootdirectory <providerrootdirectory>`, `Path to function code in the linked repo.`)
  .option(`--specification <specification>`, `Runtime specification for the function and builds.`)
  .action(
    actionRunner(
      async ({ functionId, name, runtime, execute, events, schedule, timeout, enabled, logging, entrypoint, commands, scopes, installationId, providerRepositoryId, providerBranch, providerSilentMode, providerRootDirectory, specification }) =>
        parse(await (await getFunctionsClient()).create(functionId, name, runtime as Runtime, execute, events, schedule, timeout, enabled, logging, entrypoint, commands, scopes, installationId, providerRepositoryId, providerBranch, providerSilentMode, providerRootDirectory, specification)),
    ),
  );

functions
  .command(`list-runtimes`)
  .description(`Get a list of all runtimes that are currently active on your instance.`)
  .action(
    actionRunner(
      async () => parse(await (await getFunctionsClient()).listRuntimes()),
    ),
  );

functions
  .command(`list-specifications`)
  .description(`List allowed function specifications for this instance.`)
  .action(
    actionRunner(
      async () => parse(await (await getFunctionsClient()).listSpecifications()),
    ),
  );

functions
  .command(`list-templates`)
  .description(`List available function templates. You can use template details in [createFunction](/docs/references/cloud/server-nodejs/functions#create) method.`)
  .option(`--runtimes [runtimes...]`, `List of runtimes allowed for filtering function templates. Maximum of 100 runtimes are allowed.`)
  .option(`--usecases [usecases...]`, `List of use cases allowed for filtering function templates. Maximum of 100 use cases are allowed.`)
  .option(`--limit <limit>`, `Limit the number of templates returned in the response. Default limit is 25, and maximum limit is 5000.`, parseInteger)
  .option(`--offset <offset>`, `Offset the list of returned templates. Maximum offset is 5000.`, parseInteger)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ runtimes, useCases, limit, offset, total }) =>
        parse(await (await getFunctionsClient()).listTemplates(runtimes, useCases, limit, offset, total)),
    ),
  );

functions
  .command(`get-template`)
  .description(`Get a function template using ID. You can use template details in [createFunction](/docs/references/cloud/server-nodejs/functions#create) method.`)
  .requiredOption(`--templateid <templateid>`, `Template ID.`)
  .action(
    actionRunner(
      async ({ templateId }) =>
        parse(await (await getFunctionsClient()).getTemplate(templateId)),
    ),
  );

functions
  .command(`list-usage`)
  .description(`Get usage metrics and statistics for all functions in the project. View statistics including total deployments, builds, logs, storage usage, and compute time. The response includes both current totals and historical data for each metric. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, defaults to 30 days.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ range }) =>
        parse(await (await getFunctionsClient()).listUsage(range as UsageRange)),
    ),
  );

functions
  .command(`get`)
  .description(`Get a function by its unique ID.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
  .action(
    actionRunner(
      async ({ functionId }) =>
        parse(await (await getFunctionsClient()).get(functionId)),
    ),
  );

functions
  .command(`update`)
  .description(`Update function by its unique ID.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
  .requiredOption(`--name <name>`, `Function name. Max length: 128 chars.`)
  .option(`--runtime <runtime>`, `Execution runtime.`)
  .option(`--execute [execute...]`, `An array of role strings with execution permissions. By default no user is granted with any execute permissions. [learn more about roles](https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.`)
  .option(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
  .option(`--schedule <schedule>`, `Schedule CRON syntax.`)
  .option(`--timeout <timeout>`, `Maximum execution time in seconds.`, parseInteger)
  .option(
    `--enabled [value]`,
    `Is function enabled? When set to 'disabled', users cannot access the function but Server SDKs with and API key can still access the function. No data is lost when this is toggled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--logging [value]`,
    `When disabled, executions will exclude logs and errors, and will be slightly faster.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--entrypoint <entrypoint>`, `Entrypoint File. This path is relative to the "providerRootDirectory".`)
  .option(`--commands <commands>`, `Build Commands.`)
  .option(`--scopes [scopes...]`, `List of scopes allowed for API Key auto-generated for every execution. Maximum of 100 scopes are allowed.`)
  .option(`--installationid <installationid>`, `Appwrite Installation ID for VCS (Version Controle System) deployment.`)
  .option(`--providerrepositoryid <providerrepositoryid>`, `Repository ID of the repo linked to the function`)
  .option(`--providerbranch <providerbranch>`, `Production branch for the repo linked to the function`)
  .option(
    `--providersilentmode [value]`,
    `Is the VCS (Version Control System) connection in silent mode for the repo linked to the function? In silent mode, comments will not be made on commits and pull requests.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--providerrootdirectory <providerrootdirectory>`, `Path to function code in the linked repo.`)
  .option(`--specification <specification>`, `Runtime specification for the function and builds.`)
  .action(
    actionRunner(
      async ({ functionId, name, runtime, execute, events, schedule, timeout, enabled, logging, entrypoint, commands, scopes, installationId, providerRepositoryId, providerBranch, providerSilentMode, providerRootDirectory, specification }) =>
        parse(await (await getFunctionsClient()).update(functionId, name, runtime as Runtime, execute, events, schedule, timeout, enabled, logging, entrypoint, commands, scopes, installationId, providerRepositoryId, providerBranch, providerSilentMode, providerRootDirectory, specification)),
    ),
  );

functions
  .command(`delete`)
  .description(`Delete a function by its unique ID.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
  .action(
    actionRunner(
      async ({ functionId }) =>
        parse(await (await getFunctionsClient()).delete(functionId)),
    ),
  );

functions
  .command(`update-function-deployment`)
  .description(`Update the function active deployment. Use this endpoint to switch the code deployment that should be used when visitor opens your function.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
  .requiredOption(`--deploymentid <deploymentid>`, `Deployment ID.`)
  .action(
    actionRunner(
      async ({ functionId, deploymentId }) =>
        parse(await (await getFunctionsClient()).updateFunctionDeployment(functionId, deploymentId)),
    ),
  );

functions
  .command(`list-deployments`)
  .description(`Get a list of all the function's code deployments. You can use the query params to filter your results.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
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
      async ({ functionId, queries, search, total }) =>
        parse(await (await getFunctionsClient()).listDeployments(functionId, queries, search, total)),
    ),
  );

functions
  .command(`create-deployment`)
  .description(`Create a new function code deployment. Use this endpoint to upload a new version of your code function. To execute your newly uploaded code, you'll need to update the function's deployment to use your new deployment UID.

This endpoint accepts a tar.gz file compressed with your code. Make sure to include any dependencies your code has within the compressed file. You can learn more about code packaging in the [Appwrite Cloud Functions tutorial](https://appwrite.io/docs/functions).

Use the "command" param to set the entrypoint used to execute your code.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
  .requiredOption(`--code <code>`, `Gzip file with your code package. When used with the Appwrite CLI, pass the path to your code directory, and the CLI will automatically package your code. Use a path that is within the current directory.`)
  .requiredOption(`--activate <activate>`, `Automatically activate the deployment when it is finished building.`, parseBool)
  .option(`--entrypoint <entrypoint>`, `Entrypoint File.`)
  .option(`--commands <commands>`, `Build Commands.`)
  .action(
    actionRunner(
      async ({ functionId, code, activate, entrypoint, commands }) =>
        parse(await (await getFunctionsClient()).createDeployment(functionId, code, activate, entrypoint, commands)),
    ),
  );

functions
  .command(`create-duplicate-deployment`)
  .description(`Create a new build for an existing function deployment. This endpoint allows you to rebuild a deployment with the updated function configuration, including its entrypoint and build commands if they have been modified. The build process will be queued and executed asynchronously. The original deployment's code will be preserved and used for the new build.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
  .requiredOption(`--deploymentid <deploymentid>`, `Deployment ID.`)
  .option(`--buildid <buildid>`, `Build unique ID.`)
  .action(
    actionRunner(
      async ({ functionId, deploymentId, buildId }) =>
        parse(await (await getFunctionsClient()).createDuplicateDeployment(functionId, deploymentId, buildId)),
    ),
  );

functions
  .command(`create-template-deployment`)
  .description(`Create a deployment based on a template.

Use this endpoint with combination of [listTemplates](https://appwrite.io/docs/products/functions/templates) to find the template details.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
  .requiredOption(`--repository <repository>`, `Repository name of the template.`)
  .requiredOption(`--owner <owner>`, `The name of the owner of the template.`)
  .requiredOption(`--rootdirectory <rootdirectory>`, `Path to function code in the template repo.`)
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
      async ({ functionId, repository, owner, rootDirectory, type, reference, activate }) =>
        parse(await (await getFunctionsClient()).createTemplateDeployment(functionId, repository, owner, rootDirectory, type as TemplateReferenceType, reference, activate)),
    ),
  );

functions
  .command(`create-vcs-deployment`)
  .description(`Create a deployment when a function is connected to VCS.

This endpoint lets you create deployment from a branch, commit, or a tag.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
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
      async ({ functionId, type, reference, activate }) =>
        parse(await (await getFunctionsClient()).createVcsDeployment(functionId, type as VCSReferenceType, reference, activate)),
    ),
  );

functions
  .command(`get-deployment`)
  .description(`Get a function deployment by its unique ID.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
  .requiredOption(`--deploymentid <deploymentid>`, `Deployment ID.`)
  .action(
    actionRunner(
      async ({ functionId, deploymentId }) =>
        parse(await (await getFunctionsClient()).getDeployment(functionId, deploymentId)),
    ),
  );

functions
  .command(`delete-deployment`)
  .description(`Delete a code deployment by its unique ID.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
  .requiredOption(`--deploymentid <deploymentid>`, `Deployment ID.`)
  .action(
    actionRunner(
      async ({ functionId, deploymentId }) =>
        parse(await (await getFunctionsClient()).deleteDeployment(functionId, deploymentId)),
    ),
  );

functions
  .command(`get-deployment-download`)
  .description(`Get a function deployment content by its unique ID. The endpoint response return with a 'Content-Disposition: attachment' header that tells the browser to start downloading the file to user downloads directory.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
  .requiredOption(`--deploymentid <deploymentid>`, `Deployment ID.`)
  .option(`--type <type>`, `Deployment file to download. Can be: "source", "output".`)
  .requiredOption(`--destination <destination>`, `Path to save the file to.`)
  .action(
    actionRunner(
      async ({ functionId, deploymentId, type, destination }) => {
        const url = await (await getFunctionsClient()).getDeploymentDownload(functionId, deploymentId, type as DeploymentDownloadType);
        const response = await fetch(url);
        const buffer = Buffer.from(await response.arrayBuffer());
        fs.writeFileSync(destination, buffer);
        success(`File saved to ${destination}`);
      },
    ),
  );

functions
  .command(`update-deployment-status`)
  .description(`Cancel an ongoing function deployment build. If the build is already in progress, it will be stopped and marked as canceled. If the build hasn't started yet, it will be marked as canceled without executing. You cannot cancel builds that have already completed (status 'ready') or failed. The response includes the final build status and details.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
  .requiredOption(`--deploymentid <deploymentid>`, `Deployment ID.`)
  .action(
    actionRunner(
      async ({ functionId, deploymentId }) =>
        parse(await (await getFunctionsClient()).updateDeploymentStatus(functionId, deploymentId)),
    ),
  );

functions
  .command(`list-executions`)
  .description(`Get a list of all the current user function execution logs. You can use the query params to filter your results.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: trigger, status, responseStatusCode, duration, requestMethod, requestPath, deploymentId`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ functionId, queries, total }) =>
        parse(await (await getFunctionsClient()).listExecutions(functionId, queries, total)),
    ),
  );

functions
  .command(`create-execution`)
  .description(`Trigger a function execution. The returned object will return you the current execution status. You can ping the \`Get Execution\` endpoint to get updates on the current execution status. Once this endpoint is called, your function execution process will start asynchronously.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
  .option(`--body <body>`, `HTTP body of execution. Default value is empty string.`)
  .option(
    `--async [value]`,
    `Execute code in the background. Default value is false.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--path <path>`, `HTTP path of execution. Path can include query params. Default value is /`)
  .option(`--method <method>`, `HTTP method of execution. Default value is POST.`)
  .option(`--headers <headers>`, `HTTP headers of execution. Defaults to empty.`)
  .option(`--scheduledat <scheduledat>`, `Scheduled execution time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future with precision in minutes.`)
  .action(
    actionRunner(
      async ({ functionId, body, async, path, method, headers, scheduledAt }) =>
        parse(await (await getFunctionsClient()).createExecution(functionId, body, async, path, method as ExecutionMethod, JSON.parse(headers), scheduledAt)),
    ),
  );

functions
  .command(`get-execution`)
  .description(`Get a function execution log by its unique ID.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
  .requiredOption(`--executionid <executionid>`, `Execution ID.`)
  .action(
    actionRunner(
      async ({ functionId, executionId }) =>
        parse(await (await getFunctionsClient()).getExecution(functionId, executionId)),
    ),
  );

functions
  .command(`delete-execution`)
  .description(`Delete a function execution by its unique ID.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
  .requiredOption(`--executionid <executionid>`, `Execution ID.`)
  .action(
    actionRunner(
      async ({ functionId, executionId }) =>
        parse(await (await getFunctionsClient()).deleteExecution(functionId, executionId)),
    ),
  );

functions
  .command(`get-usage`)
  .description(`Get usage metrics and statistics for a for a specific function. View statistics including total deployments, builds, executions, storage usage, and compute time. The response includes both current totals and historical data for each metric. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, defaults to 30 days.`)
  .requiredOption(`--functionid <functionid>`, `Function ID.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ functionId, range }) =>
        parse(await (await getFunctionsClient()).getUsage(functionId, range as UsageRange)),
    ),
  );

functions
  .command(`list-variables`)
  .description(`Get a list of all variables of a specific function.`)
  .requiredOption(`--functionid <functionid>`, `Function unique ID.`)
  .action(
    actionRunner(
      async ({ functionId }) =>
        parse(await (await getFunctionsClient()).listVariables(functionId)),
    ),
  );

functions
  .command(`create-variable`)
  .description(`Create a new function environment variable. These variables can be accessed in the function at runtime as environment variables.`)
  .requiredOption(`--functionid <functionid>`, `Function unique ID.`)
  .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
  .requiredOption(`--value <value>`, `Variable value. Max length: 8192 chars.`)
  .option(
    `--secret [value]`,
    `Secret variables can be updated or deleted, but only functions can read them during build and runtime.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ functionId, key, value, secret }) =>
        parse(await (await getFunctionsClient()).createVariable(functionId, key, value, secret)),
    ),
  );

functions
  .command(`get-variable`)
  .description(`Get a variable by its unique ID.`)
  .requiredOption(`--functionid <functionid>`, `Function unique ID.`)
  .requiredOption(`--variableid <variableid>`, `Variable unique ID.`)
  .action(
    actionRunner(
      async ({ functionId, variableId }) =>
        parse(await (await getFunctionsClient()).getVariable(functionId, variableId)),
    ),
  );

functions
  .command(`update-variable`)
  .description(`Update variable by its unique ID.`)
  .requiredOption(`--functionid <functionid>`, `Function unique ID.`)
  .requiredOption(`--variableid <variableid>`, `Variable unique ID.`)
  .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
  .option(`--value <value>`, `Variable value. Max length: 8192 chars.`)
  .option(
    `--secret [value]`,
    `Secret variables can be updated or deleted, but only functions can read them during build and runtime.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ functionId, variableId, key, value, secret }) =>
        parse(await (await getFunctionsClient()).updateVariable(functionId, variableId, key, value, secret)),
    ),
  );

functions
  .command(`delete-variable`)
  .description(`Delete a variable by its unique ID.`)
  .requiredOption(`--functionid <functionid>`, `Function unique ID.`)
  .requiredOption(`--variableid <variableid>`, `Variable unique ID.`)
  .action(
    actionRunner(
      async ({ functionId, variableId }) =>
        parse(await (await getFunctionsClient()).deleteVariable(functionId, variableId)),
    ),
  );

