const fs = require('fs');
const pathLib = require('path');
const tar = require("tar");
const ignore = require("ignore");
const { promisify } = require('util');
const libClient = require('../client.js');
const { getAllFiles } = require('../utils.js');
const { Command } = require('commander');
const { sdkForProject, sdkForConsole } = require('../sdks')
const { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log } = require('../parser')
const { localConfig, globalConfig } = require("../config");

const functions = new Command("functions").description(commandDescriptions['functions']).configureHelp({
    helpWidth: process.stdout.columns || 80
  })

const functionsList = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions';
    let payload = {};

    /** Query Params */
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
        parse(response)
        success()
    }
    return response;
}

const functionsCreate = async ({ functionId, name, runtime, execute, events, schedule, timeout, enabled, logging, entrypoint, commands, installationId, providerRepositoryId, providerBranch, providerSilentMode, providerRootDirectory, templateRepository, templateOwner, templateRootDirectory, templateBranch, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */
    /* @param {string} name */
    /* @param {string} runtime */
    /* @param {string[]} execute */
    /* @param {string[]} events */
    /* @param {string} schedule */
    /* @param {number} timeout */
    /* @param {boolean} enabled */
    /* @param {boolean} logging */
    /* @param {string} entrypoint */
    /* @param {string} commands */
    /* @param {string} installationId */
    /* @param {string} providerRepositoryId */
    /* @param {string} providerBranch */
    /* @param {boolean} providerSilentMode */
    /* @param {string} providerRootDirectory */
    /* @param {string} templateRepository */
    /* @param {string} templateOwner */
    /* @param {string} templateRootDirectory */
    /* @param {string} templateBranch */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions';
    let payload = {};
    
    /** Body Params */

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


    if (typeof templateBranch !== 'undefined') {
        payload['templateBranch'] = templateBranch;
    }

    let response = undefined;
    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const functionsListRuntimes = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/runtimes';
    let payload = {};
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const functionsGetUsage = async ({ range, parseOutput = true, sdk = undefined}) => {
    /* @param {string} range */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/usage';
    let payload = {};

    /** Query Params */
    if (typeof range !== 'undefined') {
        payload['range'] = range;
    }
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const functionsGet = async ({ functionId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}'.replace('{functionId}', functionId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const functionsUpdate = async ({ functionId, name, runtime, execute, events, schedule, timeout, enabled, logging, entrypoint, commands, installationId, providerRepositoryId, providerBranch, providerSilentMode, providerRootDirectory, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */
    /* @param {string} name */
    /* @param {string} runtime */
    /* @param {string[]} execute */
    /* @param {string[]} events */
    /* @param {string} schedule */
    /* @param {number} timeout */
    /* @param {boolean} enabled */
    /* @param {boolean} logging */
    /* @param {string} entrypoint */
    /* @param {string} commands */
    /* @param {string} installationId */
    /* @param {string} providerRepositoryId */
    /* @param {string} providerBranch */
    /* @param {boolean} providerSilentMode */
    /* @param {string} providerRootDirectory */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}'.replace('{functionId}', functionId);
    let payload = {};
    
    /** Body Params */

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
        success()
    }
    return response;
}

const functionsDelete = async ({ functionId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}'.replace('{functionId}', functionId);
    let payload = {};
    let response = undefined;
    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const functionsListDeployments = async ({ functionId, queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */
    /* @param {string[]} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}/deployments'.replace('{functionId}', functionId);
    let payload = {};

    /** Query Params */
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
        parse(response)
        success()
    }
    return response;
}

const functionsCreateDeployment = async ({ functionId, code, activate, entrypoint, commands, parseOutput = true, sdk = undefined, onProgress = () => {}}) => {
    /* @param {string} functionId */
    /* @param {InputFile} code */
    /* @param {boolean} activate */
    /* @param {string} entrypoint */
    /* @param {string} commands */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}/deployments'.replace('{functionId}', functionId);
    let payload = {};
    
    /** Body Params */

    if (typeof entrypoint !== 'undefined') {
        payload['entrypoint'] = entrypoint;
    }


    if (typeof commands !== 'undefined') {
        payload['commands'] = commands;
    }

    let folderPath = fs.realpathSync(code);
    if (!fs.lstatSync(folderPath).isDirectory())
        throw new Error('The path is not a directory.');
    
    const ignorer = ignore();

    const func = localConfig.getFunction(functionId);

    if(func.ignore) {
        ignorer.add(func.ignore);
        log('Ignoring files using configuration from appwrite.json');
    } else if(fs.existsSync(pathLib.join(code, '.gitignore'))) {
        ignorer.add(fs.readFileSync(pathLib.join(code, '.gitignore')).toString());
        log('Ignoring files in .gitignore');
    }
    
    const files = getAllFiles(code).map((file) => pathLib.relative(code, file)).filter((file) => !ignorer.ignores(file));

    await tar
        .create({
            gzip: true,
            sync: true,
            cwd: folderPath,
            file: 'code.tar.gz'
        }, files);
    let archivePath = fs.realpathSync('code.tar.gz')
    if (typeof archivePath !== 'undefined') {
        payload['code'] = archivePath;
        code = archivePath;
    }


    if (typeof activate !== 'undefined') {
        payload['activate'] = activate.toString();
    }

    let response = undefined;
    const { size: size } = await promisify(fs.stat)(code);

    if (size <= libClient.CHUNK_SIZE) {
        payload['code'] = fs.createReadStream(payload['code']);

        response = await client.call('post', apiPath, {
            'content-type': 'multipart/form-data',
        }, payload).catch(err => {
            fs.unlinkSync(archivePath);
            throw err
        });
    } else {
        const streamFilePath = payload['code'];

        const apiHeaders = {
            'content-type': 'multipart/form-data',
        };

        let offset = 0;

        while (offset < size) {
            let end = Math.min(offset + libClient.CHUNK_SIZE - 1, size - 1);

            apiHeaders['content-range'] = 'bytes ' + offset + '-' + end + '/' + size;
            if (response && response.$id) {
                apiHeaders['x-appwrite-id'] = response.$id;
            }

            const stream = fs.createReadStream(streamFilePath, {
                start: offset,
                end
            });
            payload['code'] = stream;
            response = await client.call('post', apiPath, apiHeaders, payload);

            if (onProgress) {
                onProgress({
                    $id: response.$id,
                    progress: ( offset / size ) * 100,
                    sizeUploaded: offset,
                    chunksTotal: response.chunksTotal,
                    chunksUploaded: response.chunksUploaded
                });
            }
            offset += libClient.CHUNK_SIZE;
        }
    }

    fs.unlinkSync(archivePath);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const functionsGetDeployment = async ({ functionId, deploymentId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */
    /* @param {string} deploymentId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}/deployments/{deploymentId}'.replace('{functionId}', functionId).replace('{deploymentId}', deploymentId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const functionsUpdateDeployment = async ({ functionId, deploymentId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */
    /* @param {string} deploymentId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}/deployments/{deploymentId}'.replace('{functionId}', functionId).replace('{deploymentId}', deploymentId);
    let payload = {};
    let response = undefined;
    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const functionsDeleteDeployment = async ({ functionId, deploymentId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */
    /* @param {string} deploymentId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}/deployments/{deploymentId}'.replace('{functionId}', functionId).replace('{deploymentId}', deploymentId);
    let payload = {};
    let response = undefined;
    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const functionsCreateBuild = async ({ functionId, deploymentId, buildId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */
    /* @param {string} deploymentId */
    /* @param {string} buildId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}/deployments/{deploymentId}/builds/{buildId}'.replace('{functionId}', functionId).replace('{deploymentId}', deploymentId).replace('{buildId}', buildId);
    let payload = {};
    let response = undefined;
    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const functionsDownloadDeployment = async ({ functionId, deploymentId, parseOutput = true, sdk = undefined, destination}) => {
    /* @param {string} functionId */
    /* @param {string} deploymentId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}/deployments/{deploymentId}/download'.replace('{functionId}', functionId).replace('{deploymentId}', deploymentId);
    let payload = {};
    payload['project'] = localConfig.getProject().projectId
    payload['key'] = globalConfig.getKey();
    const queryParams = new URLSearchParams(payload);
    apiPath = `${globalConfig.getEndpoint()}${apiPath}?${queryParams.toString()}`;

    const response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload, 'arraybuffer');

    fs.writeFileSync(destination, response);

    if (parseOutput) { 
        log(`File stored in ${destination}`)
        success()
    }
}

const functionsListExecutions = async ({ functionId, queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */
    /* @param {string[]} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}/executions'.replace('{functionId}', functionId);
    let payload = {};

    /** Query Params */
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
        parse(response)
        success()
    }
    return response;
}

const functionsCreateExecution = async ({ functionId, body, async, xpath, method, headers, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */
    /* @param {string} body */
    /* @param {boolean} async */
    /* @param {string} xpath */
    /* @param {string} method */
    /* @param {object} headers */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}/executions'.replace('{functionId}', functionId);
    let payload = {};
    
    /** Body Params */

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

    let response = undefined;
    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const functionsGetExecution = async ({ functionId, executionId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */
    /* @param {string} executionId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}/executions/{executionId}'.replace('{functionId}', functionId).replace('{executionId}', executionId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const functionsGetFunctionUsage = async ({ functionId, range, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */
    /* @param {string} range */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}/usage'.replace('{functionId}', functionId);
    let payload = {};

    /** Query Params */
    if (typeof range !== 'undefined') {
        payload['range'] = range;
    }
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const functionsListVariables = async ({ functionId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}/variables'.replace('{functionId}', functionId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const functionsCreateVariable = async ({ functionId, key, value, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */
    /* @param {string} key */
    /* @param {string} value */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}/variables'.replace('{functionId}', functionId);
    let payload = {};
    
    /** Body Params */

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
        success()
    }
    return response;
}

const functionsGetVariable = async ({ functionId, variableId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */
    /* @param {string} variableId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}/variables/{variableId}'.replace('{functionId}', functionId).replace('{variableId}', variableId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const functionsUpdateVariable = async ({ functionId, variableId, key, value, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */
    /* @param {string} variableId */
    /* @param {string} key */
    /* @param {string} value */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}/variables/{variableId}'.replace('{functionId}', functionId).replace('{variableId}', variableId);
    let payload = {};
    
    /** Body Params */

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
        success()
    }
    return response;
}

const functionsDeleteVariable = async ({ functionId, variableId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} functionId */
    /* @param {string} variableId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/functions/{functionId}/variables/{variableId}'.replace('{functionId}', functionId).replace('{variableId}', variableId);
    let payload = {};
    let response = undefined;
    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}


functions
    .command(`list`)
    .description(`Get a list of all the project's functions. You can use the query params to filter your results.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, runtime, deployment, schedule, scheduleNext, schedulePrevious, timeout, entrypoint, commands, installationId`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(functionsList))

functions
    .command(`create`)
    .description(`Create a new function. You can pass a list of [permissions](/docs/permissions) to allow different project users or team with access to execute the function using the client API.`)
    .requiredOption(`--functionId <functionId>`, `Function ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
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
    .option(`--installationId <installationId>`, `Appwrite Installation ID for VCS (Version Control System) deployment.`)
    .option(`--providerRepositoryId <providerRepositoryId>`, `Repository ID of the repo linked to the function.`)
    .option(`--providerBranch <providerBranch>`, `Production branch for the repo linked to the function.`)
    .option(`--providerSilentMode <providerSilentMode>`, `Is the VCS (Version Control System) connection in silent mode for the repo linked to the function? In silent mode, comments will not be made on commits and pull requests.`, parseBool)
    .option(`--providerRootDirectory <providerRootDirectory>`, `Path to function code in the linked repo.`)
    .option(`--templateRepository <templateRepository>`, `Repository name of the template.`)
    .option(`--templateOwner <templateOwner>`, `The name of the owner of the template.`)
    .option(`--templateRootDirectory <templateRootDirectory>`, `Path to function code in the template repo.`)
    .option(`--templateBranch <templateBranch>`, `Production branch for the repo linked to the function template.`)
    .action(actionRunner(functionsCreate))

functions
    .command(`listRuntimes`)
    .description(`Get a list of all runtimes that are currently active on your instance.`)
    .action(actionRunner(functionsListRuntimes))

functions
    .command(`getUsage`)
    .description(``)
    .option(`--range <range>`, `Date range.`)
    .action(actionRunner(functionsGetUsage))

functions
    .command(`get`)
    .description(`Get a function by its unique ID.`)
    .requiredOption(`--functionId <functionId>`, `Function ID.`)
    .action(actionRunner(functionsGet))

functions
    .command(`update`)
    .description(`Update function by its unique ID.`)
    .requiredOption(`--functionId <functionId>`, `Function ID.`)
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
    .option(`--installationId <installationId>`, `Appwrite Installation ID for VCS (Version Controle System) deployment.`)
    .option(`--providerRepositoryId <providerRepositoryId>`, `Repository ID of the repo linked to the function`)
    .option(`--providerBranch <providerBranch>`, `Production branch for the repo linked to the function`)
    .option(`--providerSilentMode <providerSilentMode>`, `Is the VCS (Version Control System) connection in silent mode for the repo linked to the function? In silent mode, comments will not be made on commits and pull requests.`, parseBool)
    .option(`--providerRootDirectory <providerRootDirectory>`, `Path to function code in the linked repo.`)
    .action(actionRunner(functionsUpdate))

functions
    .command(`delete`)
    .description(`Delete a function by its unique ID.`)
    .requiredOption(`--functionId <functionId>`, `Function ID.`)
    .action(actionRunner(functionsDelete))

functions
    .command(`listDeployments`)
    .description(`Get a list of all the project's code deployments. You can use the query params to filter your results.`)
    .requiredOption(`--functionId <functionId>`, `Function ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: size, buildId, activate, entrypoint, commands`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(functionsListDeployments))

functions
    .command(`createDeployment`)
    .description(`Create a new function code deployment. Use this endpoint to upload a new version of your code function. To execute your newly uploaded code, you'll need to update the function's deployment to use your new deployment UID.  This endpoint accepts a tar.gz file compressed with your code. Make sure to include any dependencies your code has within the compressed file. You can learn more about code packaging in the [Appwrite Cloud Functions tutorial](/docs/functions).  Use the "command" param to set the entrypoint used to execute your code.`)
    .requiredOption(`--functionId <functionId>`, `Function ID.`)
    .requiredOption(`--code <code>`, `Gzip file with your code package. When used with the Appwrite CLI, pass the path to your code directory, and the CLI will automatically package your code. Use a path that is within the current directory.`)
    .requiredOption(`--activate <activate>`, `Automatically activate the deployment when it is finished building.`, parseBool)
    .option(`--entrypoint <entrypoint>`, `Entrypoint File.`)
    .option(`--commands <commands>`, `Build Commands.`)
    .action(actionRunner(functionsCreateDeployment))

functions
    .command(`getDeployment`)
    .description(`Get a code deployment by its unique ID.`)
    .requiredOption(`--functionId <functionId>`, `Function ID.`)
    .requiredOption(`--deploymentId <deploymentId>`, `Deployment ID.`)
    .action(actionRunner(functionsGetDeployment))

functions
    .command(`updateDeployment`)
    .description(`Update the function code deployment ID using the unique function ID. Use this endpoint to switch the code deployment that should be executed by the execution endpoint.`)
    .requiredOption(`--functionId <functionId>`, `Function ID.`)
    .requiredOption(`--deploymentId <deploymentId>`, `Deployment ID.`)
    .action(actionRunner(functionsUpdateDeployment))

functions
    .command(`deleteDeployment`)
    .description(`Delete a code deployment by its unique ID.`)
    .requiredOption(`--functionId <functionId>`, `Function ID.`)
    .requiredOption(`--deploymentId <deploymentId>`, `Deployment ID.`)
    .action(actionRunner(functionsDeleteDeployment))

functions
    .command(`createBuild`)
    .description(`Create a new build for an Appwrite Function deployment. This endpoint can be used to retry a failed build.`)
    .requiredOption(`--functionId <functionId>`, `Function ID.`)
    .requiredOption(`--deploymentId <deploymentId>`, `Deployment ID.`)
    .requiredOption(`--buildId <buildId>`, `Build unique ID.`)
    .action(actionRunner(functionsCreateBuild))

functions
    .command(`downloadDeployment`)
    .description(``)
    .requiredOption(`--functionId <functionId>`, `Function ID.`)
    .requiredOption(`--deploymentId <deploymentId>`, `Deployment ID.`)
    .requiredOption(`--destination <path>`, `output file path.`)
    .action(actionRunner(functionsDownloadDeployment))

functions
    .command(`listExecutions`)
    .description(`Get a list of all the current user function execution logs. You can use the query params to filter your results.`)
    .requiredOption(`--functionId <functionId>`, `Function ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: trigger, status, responseStatusCode, duration`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(functionsListExecutions))

functions
    .command(`createExecution`)
    .description(`Trigger a function execution. The returned object will return you the current execution status. You can ping the 'Get Execution' endpoint to get updates on the current execution status. Once this endpoint is called, your function execution process will start asynchronously.`)
    .requiredOption(`--functionId <functionId>`, `Function ID.`)
    .option(`--body <body>`, `HTTP body of execution. Default value is empty string.`)
    .option(`--async <async>`, `Execute code in the background. Default value is false.`, parseBool)
    .option(`--xpath <xpath>`, `HTTP path of execution. Path can include query params. Default value is /`)
    .option(`--method <method>`, `HTTP method of execution. Default value is GET.`)
    .option(`--headers <headers>`, `HTTP headers of execution. Defaults to empty.`)
    .action(actionRunner(functionsCreateExecution))

functions
    .command(`getExecution`)
    .description(`Get a function execution log by its unique ID.`)
    .requiredOption(`--functionId <functionId>`, `Function ID.`)
    .requiredOption(`--executionId <executionId>`, `Execution ID.`)
    .action(actionRunner(functionsGetExecution))

functions
    .command(`getFunctionUsage`)
    .description(``)
    .requiredOption(`--functionId <functionId>`, `Function ID.`)
    .option(`--range <range>`, `Date range.`)
    .action(actionRunner(functionsGetFunctionUsage))

functions
    .command(`listVariables`)
    .description(`Get a list of all variables of a specific function.`)
    .requiredOption(`--functionId <functionId>`, `Function unique ID.`)
    .action(actionRunner(functionsListVariables))

functions
    .command(`createVariable`)
    .description(`Create a new function environment variable. These variables can be accessed in the function at runtime as environment variables.`)
    .requiredOption(`--functionId <functionId>`, `Function unique ID.`)
    .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
    .requiredOption(`--value <value>`, `Variable value. Max length: 8192 chars.`)
    .action(actionRunner(functionsCreateVariable))

functions
    .command(`getVariable`)
    .description(`Get a variable by its unique ID.`)
    .requiredOption(`--functionId <functionId>`, `Function unique ID.`)
    .requiredOption(`--variableId <variableId>`, `Variable unique ID.`)
    .action(actionRunner(functionsGetVariable))

functions
    .command(`updateVariable`)
    .description(`Update variable by its unique ID.`)
    .requiredOption(`--functionId <functionId>`, `Function unique ID.`)
    .requiredOption(`--variableId <variableId>`, `Variable unique ID.`)
    .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
    .option(`--value <value>`, `Variable value. Max length: 8192 chars.`)
    .action(actionRunner(functionsUpdateVariable))

functions
    .command(`deleteVariable`)
    .description(`Delete a variable by its unique ID.`)
    .requiredOption(`--functionId <functionId>`, `Function unique ID.`)
    .requiredOption(`--variableId <variableId>`, `Variable unique ID.`)
    .action(actionRunner(functionsDeleteVariable))


module.exports = {
    functions,
    functionsList,
    functionsCreate,
    functionsListRuntimes,
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
    functionsDownloadDeployment,
    functionsListExecutions,
    functionsCreateExecution,
    functionsGetExecution,
    functionsGetFunctionUsage,
    functionsListVariables,
    functionsCreateVariable,
    functionsGetVariable,
    functionsUpdateVariable,
    functionsDeleteVariable
};
