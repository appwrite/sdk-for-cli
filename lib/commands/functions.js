const fs = require('fs');
const pathLib = require('path');
const tar = require("tar");
const ignore = require("ignore");
const { promisify } = require('util');
const libClient = require('../client.js');
const { getAllFiles, showConsoleLink } = require('../utils.js');
const { Command } = require('commander');
const { sdkForProject, sdkForConsole } = require('../sdks')
const { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log } = require('../parser')
const { localConfig, globalConfig } = require("../config");
const { File } = require('undici');
const { ReadableStream } = require('stream/web');

/**
 * @param {fs.ReadStream} readStream
 * @returns {ReadableStream}
 */
function convertReadStreamToReadableStream(readStream) {
  return new ReadableStream({
    start(controller) {
      readStream.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      readStream.on("end", () => {
        controller.close();
      });
      readStream.on("error", (err) => {
        controller.error(err);
      });
    },
    cancel() {
      readStream.destroy();
    },
  });
}

const functions = new Command("functions").description(commandDescriptions['functions'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} FunctionsListRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, runtime, deployment, schedule, scheduleNext, schedulePrevious, timeout, entrypoint, commands, installationId
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsListRequestParams} params
 */
const functionsList = async ({queries,search,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions';
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof search !== 'undefined') {
        payload['search'] = search;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('functions', 'list');
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} FunctionsCreateRequestParams
 * @property {string} functionId Function ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Function name. Max length: 128 chars.
 * @property {Runtime} runtime Execution runtime.
 * @property {string[]} execute An array of role strings with execution permissions. By default no user is granted with any execute permissions. [learn more about roles](https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.
 * @property {string[]} events Events list. Maximum of 100 events are allowed.
 * @property {string} schedule Schedule CRON syntax.
 * @property {number} timeout Function maximum execution time in seconds.
 * @property {boolean} enabled Is function enabled? When set to &#039;disabled&#039;, users cannot access the function but Server SDKs with and API key can still access the function. No data is lost when this is toggled.
 * @property {boolean} logging Whether executions will be logged. When set to false, executions will not be logged, but will reduce resource used by your Appwrite project.
 * @property {string} entrypoint Entrypoint File. This path is relative to the &quot;providerRootDirectory&quot;.
 * @property {string} commands Build Commands.
 * @property {string[]} scopes List of scopes allowed for API key auto-generated for every execution. Maximum of 100 scopes are allowed.
 * @property {string} installationId Appwrite Installation ID for VCS (Version Control System) deployment.
 * @property {string} providerRepositoryId Repository ID of the repo linked to the function.
 * @property {string} providerBranch Production branch for the repo linked to the function.
 * @property {boolean} providerSilentMode Is the VCS (Version Control System) connection in silent mode for the repo linked to the function? In silent mode, comments will not be made on commits and pull requests.
 * @property {string} providerRootDirectory Path to function code in the linked repo.
 * @property {string} templateRepository Repository name of the template.
 * @property {string} templateOwner The name of the owner of the template.
 * @property {string} templateRootDirectory Path to function code in the template repo.
 * @property {string} templateVersion Version (tag) for the repo linked to the function template.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsCreateRequestParams} params
 */
const functionsCreate = async ({functionId,name,runtime,execute,events,schedule,timeout,enabled,logging,entrypoint,commands,scopes,installationId,providerRepositoryId,providerBranch,providerSilentMode,providerRootDirectory,templateRepository,templateOwner,templateRootDirectory,templateVersion,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions';
    let payload = {};
    if (typeof functionId !== 'undefined') {
        payload['functionId'] = functionId;
    }
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof runtime !== 'undefined') {
        payload['runtime'] = runtime;
    }
    execute = execute === true ? [] : execute;
    if (typeof execute !== 'undefined') {
        payload['execute'] = execute;
    }
    events = events === true ? [] : events;
    if (typeof events !== 'undefined') {
        payload['events'] = events;
    }
    if (typeof schedule !== 'undefined') {
        payload['schedule'] = schedule;
    }
    if (typeof timeout !== 'undefined') {
        payload['timeout'] = timeout;
    }
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }
    if (typeof logging !== 'undefined') {
        payload['logging'] = logging;
    }
    if (typeof entrypoint !== 'undefined') {
        payload['entrypoint'] = entrypoint;
    }
    if (typeof commands !== 'undefined') {
        payload['commands'] = commands;
    }
    scopes = scopes === true ? [] : scopes;
    if (typeof scopes !== 'undefined') {
        payload['scopes'] = scopes;
    }
    if (typeof installationId !== 'undefined') {
        payload['installationId'] = installationId;
    }
    if (typeof providerRepositoryId !== 'undefined') {
        payload['providerRepositoryId'] = providerRepositoryId;
    }
    if (typeof providerBranch !== 'undefined') {
        payload['providerBranch'] = providerBranch;
    }
    if (typeof providerSilentMode !== 'undefined') {
        payload['providerSilentMode'] = providerSilentMode;
    }
    if (typeof providerRootDirectory !== 'undefined') {
        payload['providerRootDirectory'] = providerRootDirectory;
    }
    if (typeof templateRepository !== 'undefined') {
        payload['templateRepository'] = templateRepository;
    }
    if (typeof templateOwner !== 'undefined') {
        payload['templateOwner'] = templateOwner;
    }
    if (typeof templateRootDirectory !== 'undefined') {
        payload['templateRootDirectory'] = templateRootDirectory;
    }
    if (typeof templateVersion !== 'undefined') {
        payload['templateVersion'] = templateVersion;
    }

    let response = undefined;

    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} FunctionsListRuntimesRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsListRuntimesRequestParams} params
 */
const functionsListRuntimes = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/runtimes';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} FunctionsListTemplatesRequestParams
 * @property {string[]} runtimes List of runtimes allowed for filtering function templates. Maximum of 100 runtimes are allowed.
 * @property {string[]} useCases List of use cases allowed for filtering function templates. Maximum of 100 use cases are allowed.
 * @property {number} limit Limit the number of templates returned in the response. Default limit is 25, and maximum limit is 5000.
 * @property {number} offset Offset the list of returned templates. Maximum offset is 5000.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsListTemplatesRequestParams} params
 */
const functionsListTemplates = async ({runtimes,useCases,limit,offset,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/templates';
    let payload = {};
    if (typeof runtimes !== 'undefined') {
        payload['runtimes'] = runtimes;
    }
    if (typeof useCases !== 'undefined') {
        payload['useCases'] = useCases;
    }
    if (typeof limit !== 'undefined') {
        payload['limit'] = limit;
    }
    if (typeof offset !== 'undefined') {
        payload['offset'] = offset;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('functions', 'listTemplates');
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} FunctionsGetTemplateRequestParams
 * @property {string} templateId Template ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsGetTemplateRequestParams} params
 */
const functionsGetTemplate = async ({templateId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/templates/{templateId}'.replace('{templateId}', templateId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('functions', 'getTemplate', templateId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} FunctionsGetUsageRequestParams
 * @property {FunctionUsageRange} range Date range.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsGetUsageRequestParams} params
 */
const functionsGetUsage = async ({range,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/usage';
    let payload = {};
    if (typeof range !== 'undefined') {
        payload['range'] = range;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} FunctionsGetRequestParams
 * @property {string} functionId Function ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsGetRequestParams} params
 */
const functionsGet = async ({functionId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}'.replace('{functionId}', functionId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('functions', 'get', functionId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} FunctionsUpdateRequestParams
 * @property {string} functionId Function ID.
 * @property {string} name Function name. Max length: 128 chars.
 * @property {Runtime} runtime Execution runtime.
 * @property {string[]} execute An array of role strings with execution permissions. By default no user is granted with any execute permissions. [learn more about roles](https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.
 * @property {string[]} events Events list. Maximum of 100 events are allowed.
 * @property {string} schedule Schedule CRON syntax.
 * @property {number} timeout Maximum execution time in seconds.
 * @property {boolean} enabled Is function enabled? When set to &#039;disabled&#039;, users cannot access the function but Server SDKs with and API key can still access the function. No data is lost when this is toggled.
 * @property {boolean} logging Whether executions will be logged. When set to false, executions will not be logged, but will reduce resource used by your Appwrite project.
 * @property {string} entrypoint Entrypoint File. This path is relative to the &quot;providerRootDirectory&quot;.
 * @property {string} commands Build Commands.
 * @property {string[]} scopes List of scopes allowed for API Key auto-generated for every execution. Maximum of 100 scopes are allowed.
 * @property {string} installationId Appwrite Installation ID for VCS (Version Controle System) deployment.
 * @property {string} providerRepositoryId Repository ID of the repo linked to the function
 * @property {string} providerBranch Production branch for the repo linked to the function
 * @property {boolean} providerSilentMode Is the VCS (Version Control System) connection in silent mode for the repo linked to the function? In silent mode, comments will not be made on commits and pull requests.
 * @property {string} providerRootDirectory Path to function code in the linked repo.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsUpdateRequestParams} params
 */
const functionsUpdate = async ({functionId,name,runtime,execute,events,schedule,timeout,enabled,logging,entrypoint,commands,scopes,installationId,providerRepositoryId,providerBranch,providerSilentMode,providerRootDirectory,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}'.replace('{functionId}', functionId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof runtime !== 'undefined') {
        payload['runtime'] = runtime;
    }
    execute = execute === true ? [] : execute;
    if (typeof execute !== 'undefined') {
        payload['execute'] = execute;
    }
    events = events === true ? [] : events;
    if (typeof events !== 'undefined') {
        payload['events'] = events;
    }
    if (typeof schedule !== 'undefined') {
        payload['schedule'] = schedule;
    }
    if (typeof timeout !== 'undefined') {
        payload['timeout'] = timeout;
    }
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }
    if (typeof logging !== 'undefined') {
        payload['logging'] = logging;
    }
    if (typeof entrypoint !== 'undefined') {
        payload['entrypoint'] = entrypoint;
    }
    if (typeof commands !== 'undefined') {
        payload['commands'] = commands;
    }
    scopes = scopes === true ? [] : scopes;
    if (typeof scopes !== 'undefined') {
        payload['scopes'] = scopes;
    }
    if (typeof installationId !== 'undefined') {
        payload['installationId'] = installationId;
    }
    if (typeof providerRepositoryId !== 'undefined') {
        payload['providerRepositoryId'] = providerRepositoryId;
    }
    if (typeof providerBranch !== 'undefined') {
        payload['providerBranch'] = providerBranch;
    }
    if (typeof providerSilentMode !== 'undefined') {
        payload['providerSilentMode'] = providerSilentMode;
    }
    if (typeof providerRootDirectory !== 'undefined') {
        payload['providerRootDirectory'] = providerRootDirectory;
    }

    let response = undefined;

    response = await client.call('put', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} FunctionsDeleteRequestParams
 * @property {string} functionId Function ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsDeleteRequestParams} params
 */
const functionsDelete = async ({functionId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}'.replace('{functionId}', functionId);
    let payload = {};

    let response = undefined;

    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} FunctionsListDeploymentsRequestParams
 * @property {string} functionId Function ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: size, buildId, activate, entrypoint, commands, type, size
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsListDeploymentsRequestParams} params
 */
const functionsListDeployments = async ({functionId,queries,search,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/deployments'.replace('{functionId}', functionId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof search !== 'undefined') {
        payload['search'] = search;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('functions', 'listDeployments', functionId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} FunctionsCreateDeploymentRequestParams
 * @property {string} functionId Function ID.
 * @property {string} code Gzip file with your code package. When used with the Appwrite CLI, pass the path to your code directory, and the CLI will automatically package your code. Use a path that is within the current directory.
 * @property {boolean} activate Automatically activate the deployment when it is finished building.
 * @property {string} entrypoint Entrypoint File.
 * @property {string} commands Build Commands.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 * @property {CallableFunction} onProgress
 */

/**
 * @param {FunctionsCreateDeploymentRequestParams} params
 */
const functionsCreateDeployment = async ({functionId,code,activate,entrypoint,commands,parseOutput = true, overrideForCli = false, sdk = undefined,onProgress = () => {}}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/deployments'.replace('{functionId}', functionId);
    let payload = {};
    if (typeof entrypoint !== 'undefined') {
        payload['entrypoint'] = entrypoint;
    }
    if (typeof commands !== 'undefined') {
        payload['commands'] = commands;
    }
    const folderPath = fs.realpathSync(code);
    if (!fs.lstatSync(folderPath).isDirectory()) {
        throw new Error('The path is not a directory.');
    }

    const ignorer = ignore();

    const func = localConfig.getFunction(functionId);

    ignorer.add('.appwrite');

    if (func.ignore) {
        ignorer.add(func.ignore);
    } else if (fs.existsSync(pathLib.join(code, '.gitignore'))) {
        ignorer.add(fs.readFileSync(pathLib.join(code, '.gitignore')).toString());
    }

    const files = getAllFiles(code).map((file) => pathLib.relative(code, file)).filter((file) => !ignorer.ignores(file));

    const archiveFileName = `${functionId}-code.tar.gz`;

    await tar
        .create({
            gzip: true,
            sync: true,
            cwd: folderPath,
            file: archiveFileName
        }, files);

    let archivePath = fs.realpathSync(archiveFileName)
    if (typeof archivePath !== 'undefined') {
        payload['code'] = archivePath;
       code = archivePath;
    }

    const filePath = fs.realpathSync(code);
    const nodeStream = fs.createReadStream(filePath);
    const stream = convertReadStreamToReadableStream(nodeStream);

    if (typeof filePath !== 'undefined') {
        code = { type: 'file', stream, filename: pathLib.basename(filePath), size: fs.statSync(filePath).size };
        payload['code'] = code
    }
    if (typeof activate !== 'undefined') {
        payload['activate'] = activate;
    }

    const size = code.size;

    const apiHeaders = {
        'content-type': 'multipart/form-data',
    };

    let id = undefined;
    let response = undefined;

    let chunksUploaded = 0;

    let currentChunk = 1;
    let currentPosition = 0;
    let uploadableChunk = new Uint8Array(client.CHUNK_SIZE);

    const uploadChunk = async (lastUpload = false) => {
        if(currentChunk <= chunksUploaded) {
            return;
        }

        const start = ((currentChunk - 1) * client.CHUNK_SIZE);
        let end = start + currentPosition - 1;

        if(!lastUpload || currentChunk !== 1) {
            apiHeaders['content-range'] = 'bytes ' + start + '-' + end + '/' + size;
        }

        let uploadableChunkTrimmed;

        if(currentPosition + 1 >= client.CHUNK_SIZE) {
            uploadableChunkTrimmed = uploadableChunk;
        } else {
            uploadableChunkTrimmed = new Uint8Array(currentPosition);
            for(let i = 0; i <= currentPosition; i++) {
                uploadableChunkTrimmed[i] = uploadableChunk[i];
            }
        }

        if (id) {
            apiHeaders['x-appwrite-id'] = id;
        }

        payload['code'] = { type: 'file', file: new File([uploadableChunkTrimmed], code.filename), filename: code.filename };

        response = await client.call('post', apiPath, apiHeaders, payload);

        if (!id) {
            id = response['$id'];
        }

        if (onProgress !== null) {
            onProgress({
                $id: response['$id'],
                progress: Math.min((currentChunk) * client.CHUNK_SIZE, size) / size * 100,
                sizeUploaded: end+1,
                chunksTotal: response['chunksTotal'],
                chunksUploaded: response['chunksUploaded']
            });
        }

        uploadableChunk = new Uint8Array(client.CHUNK_SIZE);
        currentChunk++;
        currentPosition = 0;
    }

    for await (const chunk of code.stream) {
        for(const b of chunk) {
            uploadableChunk[currentPosition] = b;

            currentPosition++;
            if(currentPosition >= client.CHUNK_SIZE) {
                await uploadChunk();
                currentPosition = 0;
            }
        }
    }

    if (currentPosition > 0) { // Check if there's any remaining data for the last chunk
        await uploadChunk(true);
    }

    await fs.unlink(filePath,()=>{});

    if (parseOutput) {
        parse(response)
    }

    return response;
}

/**
 * @typedef {Object} FunctionsGetDeploymentRequestParams
 * @property {string} functionId Function ID.
 * @property {string} deploymentId Deployment ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsGetDeploymentRequestParams} params
 */
const functionsGetDeployment = async ({functionId,deploymentId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/deployments/{deploymentId}'.replace('{functionId}', functionId).replace('{deploymentId}', deploymentId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('functions', 'getDeployment', functionId, deploymentId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} FunctionsUpdateDeploymentRequestParams
 * @property {string} functionId Function ID.
 * @property {string} deploymentId Deployment ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsUpdateDeploymentRequestParams} params
 */
const functionsUpdateDeployment = async ({functionId,deploymentId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/deployments/{deploymentId}'.replace('{functionId}', functionId).replace('{deploymentId}', deploymentId);
    let payload = {};

    let response = undefined;

    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} FunctionsDeleteDeploymentRequestParams
 * @property {string} functionId Function ID.
 * @property {string} deploymentId Deployment ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsDeleteDeploymentRequestParams} params
 */
const functionsDeleteDeployment = async ({functionId,deploymentId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/deployments/{deploymentId}'.replace('{functionId}', functionId).replace('{deploymentId}', deploymentId);
    let payload = {};

    let response = undefined;

    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} FunctionsCreateBuildRequestParams
 * @property {string} functionId Function ID.
 * @property {string} deploymentId Deployment ID.
 * @property {string} buildId Build unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsCreateBuildRequestParams} params
 */
const functionsCreateBuild = async ({functionId,deploymentId,buildId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/deployments/{deploymentId}/build'.replace('{functionId}', functionId).replace('{deploymentId}', deploymentId);
    let payload = {};
    if (typeof buildId !== 'undefined') {
        payload['buildId'] = buildId;
    }

    let response = undefined;

    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} FunctionsUpdateDeploymentBuildRequestParams
 * @property {string} functionId Function ID.
 * @property {string} deploymentId Deployment ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsUpdateDeploymentBuildRequestParams} params
 */
const functionsUpdateDeploymentBuild = async ({functionId,deploymentId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/deployments/{deploymentId}/build'.replace('{functionId}', functionId).replace('{deploymentId}', deploymentId);
    let payload = {};

    let response = undefined;

    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} FunctionsGetDeploymentDownloadRequestParams
 * @property {string} functionId Function ID.
 * @property {string} deploymentId Deployment ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 * @property {string} destination
 */

/**
 * @param {FunctionsGetDeploymentDownloadRequestParams} params
 */
const functionsGetDeploymentDownload = async ({functionId,deploymentId,parseOutput = true, overrideForCli = false, sdk = undefined, destination, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/deployments/{deploymentId}/download'.replace('{functionId}', functionId).replace('{deploymentId}', deploymentId);
    let payload = {};
    if (!overrideForCli) {
        payload['project'] = localConfig.getProject().projectId
        payload['key'] = globalConfig.getKey();
        const queryParams = new URLSearchParams(payload);
        apiPath = `${globalConfig.getEndpoint()}${apiPath}?${queryParams.toString()}`;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload, 'arraybuffer');

    if (overrideForCli) {
        response = Buffer.from(response);
    }

    fs.writeFileSync(destination, response);
    if (parseOutput) {
        if(console) {
            showConsoleLink('functions', 'getDeploymentDownload', functionId, deploymentId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} FunctionsListExecutionsRequestParams
 * @property {string} functionId Function ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: trigger, status, responseStatusCode, duration, requestMethod, requestPath, deploymentId
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsListExecutionsRequestParams} params
 */
const functionsListExecutions = async ({functionId,queries,search,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/executions'.replace('{functionId}', functionId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof search !== 'undefined') {
        payload['search'] = search;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('functions', 'listExecutions', functionId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} FunctionsCreateExecutionRequestParams
 * @property {string} functionId Function ID.
 * @property {string} body HTTP body of execution. Default value is empty string.
 * @property {boolean} async Execute code in the background. Default value is false.
 * @property {string} xpath HTTP path of execution. Path can include query params. Default value is /
 * @property {ExecutionMethod} method HTTP method of execution. Default value is GET.
 * @property {object} headers HTTP headers of execution. Defaults to empty.
 * @property {string} scheduledAt Scheduled execution time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future with precision in minutes.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 * @property {CallableFunction} onProgress
 */

/**
 * @param {FunctionsCreateExecutionRequestParams} params
 */
const functionsCreateExecution = async ({functionId,body,async,xpath,method,headers,scheduledAt,parseOutput = true, overrideForCli = false, sdk = undefined,onProgress = () => {}}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/executions'.replace('{functionId}', functionId);
    let payload = {};
    if (typeof body !== 'undefined') {
        payload['body'] = body;
    }
    if (typeof async !== 'undefined') {
        payload['async'] = async;
    }
    if (typeof xpath !== 'undefined') {
        payload['path'] = xpath;
    }
    if (typeof method !== 'undefined') {
        payload['method'] = method;
    }
    if (typeof headers !== 'undefined') {
        payload['headers'] = JSON.parse(headers);
    }
    if (typeof scheduledAt !== 'undefined') {
        payload['scheduledAt'] = scheduledAt;
    }

}

/**
 * @typedef {Object} FunctionsGetExecutionRequestParams
 * @property {string} functionId Function ID.
 * @property {string} executionId Execution ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsGetExecutionRequestParams} params
 */
const functionsGetExecution = async ({functionId,executionId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/executions/{executionId}'.replace('{functionId}', functionId).replace('{executionId}', executionId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('functions', 'getExecution', functionId, executionId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} FunctionsDeleteExecutionRequestParams
 * @property {string} functionId Function ID.
 * @property {string} executionId Execution ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsDeleteExecutionRequestParams} params
 */
const functionsDeleteExecution = async ({functionId,executionId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/executions/{executionId}'.replace('{functionId}', functionId).replace('{executionId}', executionId);
    let payload = {};

    let response = undefined;

    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} FunctionsGetFunctionUsageRequestParams
 * @property {string} functionId Function ID.
 * @property {FunctionUsageRange} range Date range.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsGetFunctionUsageRequestParams} params
 */
const functionsGetFunctionUsage = async ({functionId,range,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/usage'.replace('{functionId}', functionId);
    let payload = {};
    if (typeof range !== 'undefined') {
        payload['range'] = range;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('functions', 'getFunctionUsage', functionId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} FunctionsListVariablesRequestParams
 * @property {string} functionId Function unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsListVariablesRequestParams} params
 */
const functionsListVariables = async ({functionId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/variables'.replace('{functionId}', functionId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} FunctionsCreateVariableRequestParams
 * @property {string} functionId Function unique ID.
 * @property {string} key Variable key. Max length: 255 chars.
 * @property {string} value Variable value. Max length: 8192 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsCreateVariableRequestParams} params
 */
const functionsCreateVariable = async ({functionId,key,value,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/variables'.replace('{functionId}', functionId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof value !== 'undefined') {
        payload['value'] = value;
    }

    let response = undefined;

    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} FunctionsGetVariableRequestParams
 * @property {string} functionId Function unique ID.
 * @property {string} variableId Variable unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsGetVariableRequestParams} params
 */
const functionsGetVariable = async ({functionId,variableId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/variables/{variableId}'.replace('{functionId}', functionId).replace('{variableId}', variableId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} FunctionsUpdateVariableRequestParams
 * @property {string} functionId Function unique ID.
 * @property {string} variableId Variable unique ID.
 * @property {string} key Variable key. Max length: 255 chars.
 * @property {string} value Variable value. Max length: 8192 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsUpdateVariableRequestParams} params
 */
const functionsUpdateVariable = async ({functionId,variableId,key,value,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/variables/{variableId}'.replace('{functionId}', functionId).replace('{variableId}', variableId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof value !== 'undefined') {
        payload['value'] = value;
    }

    let response = undefined;

    response = await client.call('put', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} FunctionsDeleteVariableRequestParams
 * @property {string} functionId Function unique ID.
 * @property {string} variableId Variable unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {FunctionsDeleteVariableRequestParams} params
 */
const functionsDeleteVariable = async ({functionId,variableId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/functions/{functionId}/variables/{variableId}'.replace('{functionId}', functionId).replace('{variableId}', variableId);
    let payload = {};

    let response = undefined;

    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

functions
    .command(`list`)
    .description(`Get a list of all the project's functions. You can use the query params to filter your results.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, runtime, deployment, schedule, scheduleNext, schedulePrevious, timeout, entrypoint, commands, installationId`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsList))

functions
    .command(`create`)
    .description(`Create a new function. You can pass a list of [permissions](https://appwrite.io/docs/permissions) to allow different project users or team with access to execute the function using the client API.`)
    .requiredOption(`--function-id <function-id>`, `Function ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Function name. Max length: 128 chars.`)
    .requiredOption(`--runtime <runtime>`, `Execution runtime.`)
    .option(`--execute [execute...]`, `An array of role strings with execution permissions. By default no user is granted with any execute permissions. [learn more about roles](https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.`)
    .option(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
    .option(`--schedule <schedule>`, `Schedule CRON syntax.`)
    .option(`--timeout <timeout>`, `Function maximum execution time in seconds.`, parseInteger)
    .option(`--enabled <enabled>`, `Is function enabled? When set to 'disabled', users cannot access the function but Server SDKs with and API key can still access the function. No data is lost when this is toggled.`, parseBool)
    .option(`--logging <logging>`, `Whether executions will be logged. When set to false, executions will not be logged, but will reduce resource used by your Appwrite project.`, parseBool)
    .option(`--entrypoint <entrypoint>`, `Entrypoint File. This path is relative to the "providerRootDirectory".`)
    .option(`--commands <commands>`, `Build Commands.`)
    .option(`--scopes [scopes...]`, `List of scopes allowed for API key auto-generated for every execution. Maximum of 100 scopes are allowed.`)
    .option(`--installation-id <installation-id>`, `Appwrite Installation ID for VCS (Version Control System) deployment.`)
    .option(`--provider-repository-id <provider-repository-id>`, `Repository ID of the repo linked to the function.`)
    .option(`--provider-branch <provider-branch>`, `Production branch for the repo linked to the function.`)
    .option(`--provider-silent-mode <provider-silent-mode>`, `Is the VCS (Version Control System) connection in silent mode for the repo linked to the function? In silent mode, comments will not be made on commits and pull requests.`, parseBool)
    .option(`--provider-root-directory <provider-root-directory>`, `Path to function code in the linked repo.`)
    .option(`--template-repository <template-repository>`, `Repository name of the template.`)
    .option(`--template-owner <template-owner>`, `The name of the owner of the template.`)
    .option(`--template-root-directory <template-root-directory>`, `Path to function code in the template repo.`)
    .option(`--template-version <template-version>`, `Version (tag) for the repo linked to the function template.`)
    .action(actionRunner(functionsCreate))

functions
    .command(`list-runtimes`)
    .description(`Get a list of all runtimes that are currently active on your instance.`)
    .action(actionRunner(functionsListRuntimes))

functions
    .command(`list-templates`)
    .description(`List available function templates. You can use template details in [createFunction](/docs/references/cloud/server-nodejs/functions#create) method.`)
    .option(`--runtimes [runtimes...]`, `List of runtimes allowed for filtering function templates. Maximum of 100 runtimes are allowed.`)
    .option(`--use-cases [use-cases...]`, `List of use cases allowed for filtering function templates. Maximum of 100 use cases are allowed.`)
    .option(`--limit <limit>`, `Limit the number of templates returned in the response. Default limit is 25, and maximum limit is 5000.`, parseInteger)
    .option(`--offset <offset>`, `Offset the list of returned templates. Maximum offset is 5000.`, parseInteger)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsListTemplates))

functions
    .command(`get-template`)
    .description(`Get a function template using ID. You can use template details in [createFunction](/docs/references/cloud/server-nodejs/functions#create) method.`)
    .requiredOption(`--template-id <template-id>`, `Template ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsGetTemplate))

functions
    .command(`get-usage`)
    .description(``)
    .option(`--range <range>`, `Date range.`)
    .action(actionRunner(functionsGetUsage))

functions
    .command(`get`)
    .description(`Get a function by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsGet))

functions
    .command(`update`)
    .description(`Update function by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--name <name>`, `Function name. Max length: 128 chars.`)
    .option(`--runtime <runtime>`, `Execution runtime.`)
    .option(`--execute [execute...]`, `An array of role strings with execution permissions. By default no user is granted with any execute permissions. [learn more about roles](https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.`)
    .option(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
    .option(`--schedule <schedule>`, `Schedule CRON syntax.`)
    .option(`--timeout <timeout>`, `Maximum execution time in seconds.`, parseInteger)
    .option(`--enabled <enabled>`, `Is function enabled? When set to 'disabled', users cannot access the function but Server SDKs with and API key can still access the function. No data is lost when this is toggled.`, parseBool)
    .option(`--logging <logging>`, `Whether executions will be logged. When set to false, executions will not be logged, but will reduce resource used by your Appwrite project.`, parseBool)
    .option(`--entrypoint <entrypoint>`, `Entrypoint File. This path is relative to the "providerRootDirectory".`)
    .option(`--commands <commands>`, `Build Commands.`)
    .option(`--scopes [scopes...]`, `List of scopes allowed for API Key auto-generated for every execution. Maximum of 100 scopes are allowed.`)
    .option(`--installation-id <installation-id>`, `Appwrite Installation ID for VCS (Version Controle System) deployment.`)
    .option(`--provider-repository-id <provider-repository-id>`, `Repository ID of the repo linked to the function`)
    .option(`--provider-branch <provider-branch>`, `Production branch for the repo linked to the function`)
    .option(`--provider-silent-mode <provider-silent-mode>`, `Is the VCS (Version Control System) connection in silent mode for the repo linked to the function? In silent mode, comments will not be made on commits and pull requests.`, parseBool)
    .option(`--provider-root-directory <provider-root-directory>`, `Path to function code in the linked repo.`)
    .action(actionRunner(functionsUpdate))

functions
    .command(`delete`)
    .description(`Delete a function by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .action(actionRunner(functionsDelete))

functions
    .command(`list-deployments`)
    .description(`Get a list of all the project's code deployments. You can use the query params to filter your results.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: size, buildId, activate, entrypoint, commands, type, size`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsListDeployments))

functions
    .command(`create-deployment`)
    .description(`Create a new function code deployment. Use this endpoint to upload a new version of your code function. To execute your newly uploaded code, you'll need to update the function's deployment to use your new deployment UID.  This endpoint accepts a tar.gz file compressed with your code. Make sure to include any dependencies your code has within the compressed file. You can learn more about code packaging in the [Appwrite Cloud Functions tutorial](https://appwrite.io/docs/functions).  Use the "command" param to set the entrypoint used to execute your code.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--code <code>`, `Gzip file with your code package. When used with the Appwrite CLI, pass the path to your code directory, and the CLI will automatically package your code. Use a path that is within the current directory.`)
    .requiredOption(`--activate <activate>`, `Automatically activate the deployment when it is finished building.`, parseBool)
    .option(`--entrypoint <entrypoint>`, `Entrypoint File.`)
    .option(`--commands <commands>`, `Build Commands.`)
    .action(actionRunner(functionsCreateDeployment))

functions
    .command(`get-deployment`)
    .description(`Get a code deployment by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsGetDeployment))

functions
    .command(`update-deployment`)
    .description(`Update the function code deployment ID using the unique function ID. Use this endpoint to switch the code deployment that should be executed by the execution endpoint.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .action(actionRunner(functionsUpdateDeployment))

functions
    .command(`delete-deployment`)
    .description(`Delete a code deployment by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .action(actionRunner(functionsDeleteDeployment))

functions
    .command(`create-build`)
    .description(``)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .option(`--build-id <build-id>`, `Build unique ID.`)
    .action(actionRunner(functionsCreateBuild))

functions
    .command(`update-deployment-build`)
    .description(``)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .action(actionRunner(functionsUpdateDeploymentBuild))

functions
    .command(`get-deployment-download`)
    .description(`Get a Deployment's contents by its unique ID. This endpoint supports range requests for partial or streaming file download.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .requiredOption(`--destination <path>`, `output file path.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsGetDeploymentDownload))

functions
    .command(`list-executions`)
    .description(`Get a list of all the current user function execution logs. You can use the query params to filter your results.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: trigger, status, responseStatusCode, duration, requestMethod, requestPath, deploymentId`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsListExecutions))

functions
    .command(`create-execution`)
    .description(`Trigger a function execution. The returned object will return you the current execution status. You can ping the 'Get Execution' endpoint to get updates on the current execution status. Once this endpoint is called, your function execution process will start asynchronously.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .option(`--body <body>`, `HTTP body of execution. Default value is empty string.`)
    .option(`--async <async>`, `Execute code in the background. Default value is false.`, parseBool)
    .option(`--xpath <xpath>`, `HTTP path of execution. Path can include query params. Default value is /`)
    .option(`--method <method>`, `HTTP method of execution. Default value is GET.`)
    .option(`--headers <headers>`, `HTTP headers of execution. Defaults to empty.`)
    .option(`--scheduled-at <scheduled-at>`, `Scheduled execution time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future with precision in minutes.`)
    .action(actionRunner(functionsCreateExecution))

functions
    .command(`get-execution`)
    .description(`Get a function execution log by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--execution-id <execution-id>`, `Execution ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsGetExecution))

functions
    .command(`delete-execution`)
    .description(`Delete a function execution by its unique ID. `)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--execution-id <execution-id>`, `Execution ID.`)
    .action(actionRunner(functionsDeleteExecution))

functions
    .command(`get-function-usage`)
    .description(``)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .option(`--range <range>`, `Date range.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsGetFunctionUsage))

functions
    .command(`list-variables`)
    .description(`Get a list of all variables of a specific function.`)
    .requiredOption(`--function-id <function-id>`, `Function unique ID.`)
    .action(actionRunner(functionsListVariables))

functions
    .command(`create-variable`)
    .description(`Create a new function environment variable. These variables can be accessed in the function at runtime as environment variables.`)
    .requiredOption(`--function-id <function-id>`, `Function unique ID.`)
    .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
    .requiredOption(`--value <value>`, `Variable value. Max length: 8192 chars.`)
    .action(actionRunner(functionsCreateVariable))

functions
    .command(`get-variable`)
    .description(`Get a variable by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function unique ID.`)
    .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
    .action(actionRunner(functionsGetVariable))

functions
    .command(`update-variable`)
    .description(`Update variable by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function unique ID.`)
    .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
    .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
    .option(`--value <value>`, `Variable value. Max length: 8192 chars.`)
    .action(actionRunner(functionsUpdateVariable))

functions
    .command(`delete-variable`)
    .description(`Delete a variable by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function unique ID.`)
    .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
    .action(actionRunner(functionsDeleteVariable))

module.exports = {
    functions,
    functionsList,
    functionsCreate,
    functionsListRuntimes,
    functionsListTemplates,
    functionsGetTemplate,
    functionsGetUsage,
    functionsGet,
    functionsUpdate,
    functionsDelete,
    functionsListDeployments,
    functionsCreateDeployment,
    functionsGetDeployment,
    functionsUpdateDeployment,
    functionsDeleteDeployment,
    functionsCreateBuild,
    functionsUpdateDeploymentBuild,
    functionsGetDeploymentDownload,
    functionsListExecutions,
    functionsCreateExecution,
    functionsGetExecution,
    functionsDeleteExecution,
    functionsGetFunctionUsage,
    functionsListVariables,
    functionsCreateVariable,
    functionsGetVariable,
    functionsUpdateVariable,
    functionsDeleteVariable
};
