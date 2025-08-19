const fs = require('fs');
const pathLib = require('path');
const tar = require("tar");
const ignore = require("ignore");
const { promisify } = require('util');
const libClient = require('../client.js');
const { getAllFiles, showConsoleLink } = require('../utils.js');
const { Command } = require('commander');
const { sdkForProject, sdkForConsole } = require('../sdks')
const { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log, warn } = require('../parser')
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

const sites = new Command("sites").description(commandDescriptions['sites'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} SitesListRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, framework, deploymentId, buildCommand, installCommand, outputDirectory, installationId
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesListRequestParams} params
 */
const sitesList = async ({queries,search,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites';
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof search !== 'undefined') {
        payload['search'] = search;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('sites', 'list');
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} SitesCreateRequestParams
 * @property {string} siteId Site ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Site name. Max length: 128 chars.
 * @property {Framework} framework Sites framework.
 * @property {BuildRuntime} buildRuntime Runtime to use during build step.
 * @property {boolean} enabled Is site enabled? When set to &#039;disabled&#039;, users cannot access the site but Server SDKs with and API key can still access the site. No data is lost when this is toggled.
 * @property {boolean} logging When disabled, request logs will exclude logs and errors, and site responses will be slightly faster.
 * @property {number} timeout Maximum request time in seconds.
 * @property {string} installCommand Install Command.
 * @property {string} buildCommand Build Command.
 * @property {string} outputDirectory Output Directory for site.
 * @property {Adapter} adapter Framework adapter defining rendering strategy. Allowed values are: static, ssr
 * @property {string} installationId Appwrite Installation ID for VCS (Version Control System) deployment.
 * @property {string} fallbackFile Fallback file for single page application sites.
 * @property {string} providerRepositoryId Repository ID of the repo linked to the site.
 * @property {string} providerBranch Production branch for the repo linked to the site.
 * @property {boolean} providerSilentMode Is the VCS (Version Control System) connection in silent mode for the repo linked to the site? In silent mode, comments will not be made on commits and pull requests.
 * @property {string} providerRootDirectory Path to site code in the linked repo.
 * @property {string} specification Framework specification for the site and builds.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesCreateRequestParams} params
 */
const sitesCreate = async ({siteId,name,framework,buildRuntime,enabled,logging,timeout,installCommand,buildCommand,outputDirectory,adapter,installationId,fallbackFile,providerRepositoryId,providerBranch,providerSilentMode,providerRootDirectory,specification,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites';
    let payload = {};
    if (typeof siteId !== 'undefined') {
        payload['siteId'] = siteId;
    }
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof framework !== 'undefined') {
        payload['framework'] = framework;
    }
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }
    if (typeof logging !== 'undefined') {
        payload['logging'] = logging;
    }
    if (typeof timeout !== 'undefined') {
        payload['timeout'] = timeout;
    }
    if (typeof installCommand !== 'undefined') {
        payload['installCommand'] = installCommand;
    }
    if (typeof buildCommand !== 'undefined') {
        payload['buildCommand'] = buildCommand;
    }
    if (typeof outputDirectory !== 'undefined') {
        payload['outputDirectory'] = outputDirectory;
    }
    if (typeof buildRuntime !== 'undefined') {
        payload['buildRuntime'] = buildRuntime;
    }
    if (typeof adapter !== 'undefined') {
        payload['adapter'] = adapter;
    }
    if (typeof installationId !== 'undefined') {
        payload['installationId'] = installationId;
    }
    if (typeof fallbackFile !== 'undefined') {
        payload['fallbackFile'] = fallbackFile;
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
    if (typeof specification !== 'undefined') {
        payload['specification'] = specification;
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
 * @typedef {Object} SitesListFrameworksRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesListFrameworksRequestParams} params
 */
const sitesListFrameworks = async ({parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/frameworks';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('sites', 'listFrameworks');
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} SitesListSpecificationsRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesListSpecificationsRequestParams} params
 */
const sitesListSpecifications = async ({parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/specifications';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('sites', 'listSpecifications');
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} SitesListTemplatesRequestParams
 * @property {string[]} frameworks List of frameworks allowed for filtering site templates. Maximum of 100 frameworks are allowed.
 * @property {string[]} useCases List of use cases allowed for filtering site templates. Maximum of 100 use cases are allowed.
 * @property {number} limit Limit the number of templates returned in the response. Default limit is 25, and maximum limit is 5000.
 * @property {number} offset Offset the list of returned templates. Maximum offset is 5000.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesListTemplatesRequestParams} params
 */
const sitesListTemplates = async ({frameworks,useCases,limit,offset,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/templates';
    let payload = {};
    if (typeof frameworks !== 'undefined') {
        payload['frameworks'] = frameworks;
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
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('sites', 'listTemplates');
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} SitesGetTemplateRequestParams
 * @property {string} templateId Template ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesGetTemplateRequestParams} params
 */
const sitesGetTemplate = async ({templateId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/templates/{templateId}'.replace('{templateId}', templateId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('sites', 'getTemplate', templateId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} SitesListUsageRequestParams
 * @property {UsageRange} range Date range.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesListUsageRequestParams} params
 */
const sitesListUsage = async ({range,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/usage';
    let payload = {};
    if (typeof range !== 'undefined') {
        payload['range'] = range;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('sites', 'listUsage');
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} SitesGetRequestParams
 * @property {string} siteId Site ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesGetRequestParams} params
 */
const sitesGet = async ({siteId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}'.replace('{siteId}', siteId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('sites', 'get', siteId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} SitesUpdateRequestParams
 * @property {string} siteId Site ID.
 * @property {string} name Site name. Max length: 128 chars.
 * @property {Framework} framework Sites framework.
 * @property {boolean} enabled Is site enabled? When set to &#039;disabled&#039;, users cannot access the site but Server SDKs with and API key can still access the site. No data is lost when this is toggled.
 * @property {boolean} logging When disabled, request logs will exclude logs and errors, and site responses will be slightly faster.
 * @property {number} timeout Maximum request time in seconds.
 * @property {string} installCommand Install Command.
 * @property {string} buildCommand Build Command.
 * @property {string} outputDirectory Output Directory for site.
 * @property {BuildRuntime} buildRuntime Runtime to use during build step.
 * @property {Adapter} adapter Framework adapter defining rendering strategy. Allowed values are: static, ssr
 * @property {string} fallbackFile Fallback file for single page application sites.
 * @property {string} installationId Appwrite Installation ID for VCS (Version Control System) deployment.
 * @property {string} providerRepositoryId Repository ID of the repo linked to the site.
 * @property {string} providerBranch Production branch for the repo linked to the site.
 * @property {boolean} providerSilentMode Is the VCS (Version Control System) connection in silent mode for the repo linked to the site? In silent mode, comments will not be made on commits and pull requests.
 * @property {string} providerRootDirectory Path to site code in the linked repo.
 * @property {string} specification Framework specification for the site and builds.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesUpdateRequestParams} params
 */
const sitesUpdate = async ({siteId,name,framework,enabled,logging,timeout,installCommand,buildCommand,outputDirectory,buildRuntime,adapter,fallbackFile,installationId,providerRepositoryId,providerBranch,providerSilentMode,providerRootDirectory,specification,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}'.replace('{siteId}', siteId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof framework !== 'undefined') {
        payload['framework'] = framework;
    }
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }
    if (typeof logging !== 'undefined') {
        payload['logging'] = logging;
    }
    if (typeof timeout !== 'undefined') {
        payload['timeout'] = timeout;
    }
    if (typeof installCommand !== 'undefined') {
        payload['installCommand'] = installCommand;
    }
    if (typeof buildCommand !== 'undefined') {
        payload['buildCommand'] = buildCommand;
    }
    if (typeof outputDirectory !== 'undefined') {
        payload['outputDirectory'] = outputDirectory;
    }
    if (typeof buildRuntime !== 'undefined') {
        payload['buildRuntime'] = buildRuntime;
    }
    if (typeof adapter !== 'undefined') {
        payload['adapter'] = adapter;
    }
    if (typeof fallbackFile !== 'undefined') {
        payload['fallbackFile'] = fallbackFile;
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
    if (typeof specification !== 'undefined') {
        payload['specification'] = specification;
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
 * @typedef {Object} SitesDeleteRequestParams
 * @property {string} siteId Site ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesDeleteRequestParams} params
 */
const sitesDelete = async ({siteId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}'.replace('{siteId}', siteId);
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
 * @typedef {Object} SitesUpdateSiteDeploymentRequestParams
 * @property {string} siteId Site ID.
 * @property {string} deploymentId Deployment ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesUpdateSiteDeploymentRequestParams} params
 */
const sitesUpdateSiteDeployment = async ({siteId,deploymentId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/deployment'.replace('{siteId}', siteId);
    let payload = {};
    if (typeof deploymentId !== 'undefined') {
        payload['deploymentId'] = deploymentId;
    }

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
 * @typedef {Object} SitesListDeploymentsRequestParams
 * @property {string} siteId Site ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: buildSize, sourceSize, totalSize, buildDuration, status, activate, type
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesListDeploymentsRequestParams} params
 */
const sitesListDeployments = async ({siteId,queries,search,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/deployments'.replace('{siteId}', siteId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof search !== 'undefined') {
        payload['search'] = search;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('sites', 'listDeployments', siteId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} SitesCreateDeploymentRequestParams
 * @property {string} siteId Site ID.
 * @property {string} code Gzip file with your code package. When used with the Appwrite CLI, pass the path to your code directory, and the CLI will automatically package your code. Use a path that is within the current directory.
 * @property {boolean} activate Automatically activate the deployment when it is finished building.
 * @property {string} installCommand Install Commands.
 * @property {string} buildCommand Build Commands.
 * @property {string} outputDirectory Output Directory.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 * @property {CallableFunction} onProgress
 */

/**
 * @param {SitesCreateDeploymentRequestParams} params
 */
const sitesCreateDeployment = async ({siteId,code,activate,installCommand,buildCommand,outputDirectory,parseOutput = true, overrideForCli = false, sdk = undefined,onProgress = () => {}}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/deployments'.replace('{siteId}', siteId);
    let payload = {};
    if (typeof installCommand !== 'undefined') {
        payload['installCommand'] = installCommand;
    }
    if (typeof buildCommand !== 'undefined') {
        payload['buildCommand'] = buildCommand;
    }
    if (typeof outputDirectory !== 'undefined') {
        payload['outputDirectory'] = outputDirectory;
    }
    const folderPath = fs.realpathSync(code);
    if (!fs.lstatSync(folderPath).isDirectory()) {
        throw new Error('The path is not a directory.');
    }

    const ignorer = ignore();

    const resourceId = siteId;
    const resourceConfig = localConfig.getSite(resourceId);

    ignorer.add('.appwrite');

    if (resourceConfig.ignore) {
        ignorer.add(resourceConfig.ignore);
    } else if (fs.existsSync(pathLib.join(code, '.gitignore'))) {
        ignorer.add(fs.readFileSync(pathLib.join(code, '.gitignore')).toString());
    }

    const files = getAllFiles(code).map((file) => pathLib.relative(code, file)).filter((file) => !ignorer.ignores(file));

    const archiveFileName = `sites-${resourceId}-code.tar.gz`;

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
 * @typedef {Object} SitesCreateDuplicateDeploymentRequestParams
 * @property {string} siteId Site ID.
 * @property {string} deploymentId Deployment ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesCreateDuplicateDeploymentRequestParams} params
 */
const sitesCreateDuplicateDeployment = async ({siteId,deploymentId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/deployments/duplicate'.replace('{siteId}', siteId);
    let payload = {};
    if (typeof deploymentId !== 'undefined') {
        payload['deploymentId'] = deploymentId;
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
 * @typedef {Object} SitesCreateTemplateDeploymentRequestParams
 * @property {string} siteId Site ID.
 * @property {string} repository Repository name of the template.
 * @property {string} owner The name of the owner of the template.
 * @property {string} rootDirectory Path to site code in the template repo.
 * @property {string} version Version (tag) for the repo linked to the site template.
 * @property {boolean} activate Automatically activate the deployment when it is finished building.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesCreateTemplateDeploymentRequestParams} params
 */
const sitesCreateTemplateDeployment = async ({siteId,repository,owner,rootDirectory,version,activate,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/deployments/template'.replace('{siteId}', siteId);
    let payload = {};
    if (typeof repository !== 'undefined') {
        payload['repository'] = repository;
    }
    if (typeof owner !== 'undefined') {
        payload['owner'] = owner;
    }
    if (typeof rootDirectory !== 'undefined') {
        payload['rootDirectory'] = rootDirectory;
    }
    if (typeof version !== 'undefined') {
        payload['version'] = version;
    }
    if (typeof activate !== 'undefined') {
        payload['activate'] = activate;
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
 * @typedef {Object} SitesCreateVcsDeploymentRequestParams
 * @property {string} siteId Site ID.
 * @property {VCSDeploymentType} type Type of reference passed. Allowed values are: branch, commit
 * @property {string} reference VCS reference to create deployment from. Depending on type this can be: branch name, commit hash
 * @property {boolean} activate Automatically activate the deployment when it is finished building.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesCreateVcsDeploymentRequestParams} params
 */
const sitesCreateVcsDeployment = async ({siteId,type,reference,activate,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/deployments/vcs'.replace('{siteId}', siteId);
    let payload = {};
    if (typeof type !== 'undefined') {
        payload['type'] = type;
    }
    if (typeof reference !== 'undefined') {
        payload['reference'] = reference;
    }
    if (typeof activate !== 'undefined') {
        payload['activate'] = activate;
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
 * @typedef {Object} SitesGetDeploymentRequestParams
 * @property {string} siteId Site ID.
 * @property {string} deploymentId Deployment ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesGetDeploymentRequestParams} params
 */
const sitesGetDeployment = async ({siteId,deploymentId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/deployments/{deploymentId}'.replace('{siteId}', siteId).replace('{deploymentId}', deploymentId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('sites', 'getDeployment', siteId, deploymentId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} SitesDeleteDeploymentRequestParams
 * @property {string} siteId Site ID.
 * @property {string} deploymentId Deployment ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesDeleteDeploymentRequestParams} params
 */
const sitesDeleteDeployment = async ({siteId,deploymentId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/deployments/{deploymentId}'.replace('{siteId}', siteId).replace('{deploymentId}', deploymentId);
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
 * @typedef {Object} SitesGetDeploymentDownloadRequestParams
 * @property {string} siteId Site ID.
 * @property {string} deploymentId Deployment ID.
 * @property {DeploymentDownloadType} type Deployment file to download. Can be: &quot;source&quot;, &quot;output&quot;.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 * @property {string} destination
 */

/**
 * @param {SitesGetDeploymentDownloadRequestParams} params
 */
const sitesGetDeploymentDownload = async ({siteId,deploymentId,type,parseOutput = true, overrideForCli = false, sdk = undefined, destination, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/deployments/{deploymentId}/download'.replace('{siteId}', siteId).replace('{deploymentId}', deploymentId);
    let payload = {};
    if (typeof type !== 'undefined') {
        payload['type'] = type;
    }
    if (!overrideForCli) {
        payload['project'] = localConfig.getProject().projectId
        payload['key'] = globalConfig.getKey();
        const queryParams = new URLSearchParams(payload);
        apiPath = `${globalConfig.getEndpoint()}${apiPath}?${queryParams.toString()}`;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload, 'arraybuffer');

    if (overrideForCli) {
        response = Buffer.from(response);
    }

    fs.writeFileSync(destination, response);
    if (parseOutput) {
        if(console) {
            showConsoleLink('sites', 'getDeploymentDownload', siteId, deploymentId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} SitesUpdateDeploymentStatusRequestParams
 * @property {string} siteId Site ID.
 * @property {string} deploymentId Deployment ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesUpdateDeploymentStatusRequestParams} params
 */
const sitesUpdateDeploymentStatus = async ({siteId,deploymentId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/deployments/{deploymentId}/status'.replace('{siteId}', siteId).replace('{deploymentId}', deploymentId);
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
 * @typedef {Object} SitesListLogsRequestParams
 * @property {string} siteId Site ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: trigger, status, responseStatusCode, duration, requestMethod, requestPath, deploymentId
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesListLogsRequestParams} params
 */
const sitesListLogs = async ({siteId,queries,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/logs'.replace('{siteId}', siteId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} SitesGetLogRequestParams
 * @property {string} siteId Site ID.
 * @property {string} logId Log ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesGetLogRequestParams} params
 */
const sitesGetLog = async ({siteId,logId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/logs/{logId}'.replace('{siteId}', siteId).replace('{logId}', logId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('sites', 'getLog', siteId, logId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} SitesDeleteLogRequestParams
 * @property {string} siteId Site ID.
 * @property {string} logId Log ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesDeleteLogRequestParams} params
 */
const sitesDeleteLog = async ({siteId,logId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/logs/{logId}'.replace('{siteId}', siteId).replace('{logId}', logId);
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
 * @typedef {Object} SitesGetUsageRequestParams
 * @property {string} siteId Site ID.
 * @property {UsageRange} range Date range.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesGetUsageRequestParams} params
 */
const sitesGetUsage = async ({siteId,range,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/usage'.replace('{siteId}', siteId);
    let payload = {};
    if (typeof range !== 'undefined') {
        payload['range'] = range;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} SitesListVariablesRequestParams
 * @property {string} siteId Site unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesListVariablesRequestParams} params
 */
const sitesListVariables = async ({siteId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/variables'.replace('{siteId}', siteId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} SitesCreateVariableRequestParams
 * @property {string} siteId Site unique ID.
 * @property {string} key Variable key. Max length: 255 chars.
 * @property {string} value Variable value. Max length: 8192 chars.
 * @property {boolean} secret Secret variables can be updated or deleted, but only sites can read them during build and runtime.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesCreateVariableRequestParams} params
 */
const sitesCreateVariable = async ({siteId,key,value,secret,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/variables'.replace('{siteId}', siteId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof value !== 'undefined') {
        payload['value'] = value;
    }
    if (typeof secret !== 'undefined') {
        payload['secret'] = secret;
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
 * @typedef {Object} SitesGetVariableRequestParams
 * @property {string} siteId Site unique ID.
 * @property {string} variableId Variable unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesGetVariableRequestParams} params
 */
const sitesGetVariable = async ({siteId,variableId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/variables/{variableId}'.replace('{siteId}', siteId).replace('{variableId}', variableId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} SitesUpdateVariableRequestParams
 * @property {string} siteId Site unique ID.
 * @property {string} variableId Variable unique ID.
 * @property {string} key Variable key. Max length: 255 chars.
 * @property {string} value Variable value. Max length: 8192 chars.
 * @property {boolean} secret Secret variables can be updated or deleted, but only sites can read them during build and runtime.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesUpdateVariableRequestParams} params
 */
const sitesUpdateVariable = async ({siteId,variableId,key,value,secret,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/variables/{variableId}'.replace('{siteId}', siteId).replace('{variableId}', variableId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof value !== 'undefined') {
        payload['value'] = value;
    }
    if (typeof secret !== 'undefined') {
        payload['secret'] = secret;
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
 * @typedef {Object} SitesDeleteVariableRequestParams
 * @property {string} siteId Site unique ID.
 * @property {string} variableId Variable unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {SitesDeleteVariableRequestParams} params
 */
const sitesDeleteVariable = async ({siteId,variableId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/sites/{siteId}/variables/{variableId}'.replace('{siteId}', siteId).replace('{variableId}', variableId);
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

sites
    .command(`list`)
    .description(`Get a list of all the project's sites. You can use the query params to filter your results.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, framework, deploymentId, buildCommand, installCommand, outputDirectory, installationId`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(sitesList))

sites
    .command(`create`)
    .description(`Create a new site.`)
    .requiredOption(`--site-id <site-id>`, `Site ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Site name. Max length: 128 chars.`)
    .requiredOption(`--framework <framework>`, `Sites framework.`)
    .requiredOption(`--build-runtime <build-runtime>`, `Runtime to use during build step.`)
    .option(`--enabled [value]`, `Is site enabled? When set to 'disabled', users cannot access the site but Server SDKs with and API key can still access the site. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--logging [value]`, `When disabled, request logs will exclude logs and errors, and site responses will be slightly faster.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--timeout <timeout>`, `Maximum request time in seconds.`, parseInteger)
    .option(`--install-command <install-command>`, `Install Command.`)
    .option(`--build-command <build-command>`, `Build Command.`)
    .option(`--output-directory <output-directory>`, `Output Directory for site.`)
    .option(`--adapter <adapter>`, `Framework adapter defining rendering strategy. Allowed values are: static, ssr`)
    .option(`--installation-id <installation-id>`, `Appwrite Installation ID for VCS (Version Control System) deployment.`)
    .option(`--fallback-file <fallback-file>`, `Fallback file for single page application sites.`)
    .option(`--provider-repository-id <provider-repository-id>`, `Repository ID of the repo linked to the site.`)
    .option(`--provider-branch <provider-branch>`, `Production branch for the repo linked to the site.`)
    .option(`--provider-silent-mode [value]`, `Is the VCS (Version Control System) connection in silent mode for the repo linked to the site? In silent mode, comments will not be made on commits and pull requests.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--provider-root-directory <provider-root-directory>`, `Path to site code in the linked repo.`)
    .option(`--specification <specification>`, `Framework specification for the site and builds.`)
    .action(actionRunner(sitesCreate))

sites
    .command(`list-frameworks`)
    .description(`Get a list of all frameworks that are currently available on the server instance.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(sitesListFrameworks))

sites
    .command(`list-specifications`)
    .description(`List allowed site specifications for this instance.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(sitesListSpecifications))

sites
    .command(`list-templates`)
    .description(`List available site templates. You can use template details in [createSite](/docs/references/cloud/server-nodejs/sites#create) method.`)
    .option(`--frameworks [frameworks...]`, `List of frameworks allowed for filtering site templates. Maximum of 100 frameworks are allowed.`)
    .option(`--use-cases [use-cases...]`, `List of use cases allowed for filtering site templates. Maximum of 100 use cases are allowed.`)
    .option(`--limit <limit>`, `Limit the number of templates returned in the response. Default limit is 25, and maximum limit is 5000.`, parseInteger)
    .option(`--offset <offset>`, `Offset the list of returned templates. Maximum offset is 5000.`, parseInteger)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(sitesListTemplates))

sites
    .command(`get-template`)
    .description(`Get a site template using ID. You can use template details in [createSite](/docs/references/cloud/server-nodejs/sites#create) method.`)
    .requiredOption(`--template-id <template-id>`, `Template ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(sitesGetTemplate))

sites
    .command(`list-usage`)
    .description(`Get usage metrics and statistics for all sites in the project. View statistics including total deployments, builds, logs, storage usage, and compute time. The response includes both current totals and historical data for each metric. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, defaults to 30 days.`)
    .option(`--range <range>`, `Date range.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(sitesListUsage))

sites
    .command(`get`)
    .description(`Get a site by its unique ID.`)
    .requiredOption(`--site-id <site-id>`, `Site ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(sitesGet))

sites
    .command(`update`)
    .description(`Update site by its unique ID.`)
    .requiredOption(`--site-id <site-id>`, `Site ID.`)
    .requiredOption(`--name <name>`, `Site name. Max length: 128 chars.`)
    .requiredOption(`--framework <framework>`, `Sites framework.`)
    .option(`--enabled [value]`, `Is site enabled? When set to 'disabled', users cannot access the site but Server SDKs with and API key can still access the site. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--logging [value]`, `When disabled, request logs will exclude logs and errors, and site responses will be slightly faster.`, (value) => value === undefined ? true : parseBool(value))
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
    .option(`--provider-silent-mode [value]`, `Is the VCS (Version Control System) connection in silent mode for the repo linked to the site? In silent mode, comments will not be made on commits and pull requests.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--provider-root-directory <provider-root-directory>`, `Path to site code in the linked repo.`)
    .option(`--specification <specification>`, `Framework specification for the site and builds.`)
    .action(actionRunner(sitesUpdate))

sites
    .command(`delete`)
    .description(`Delete a site by its unique ID.`)
    .requiredOption(`--site-id <site-id>`, `Site ID.`)
    .action(actionRunner(sitesDelete))

sites
    .command(`update-site-deployment`)
    .description(`Update the site active deployment. Use this endpoint to switch the code deployment that should be used when visitor opens your site.`)
    .requiredOption(`--site-id <site-id>`, `Site ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .action(actionRunner(sitesUpdateSiteDeployment))

sites
    .command(`list-deployments`)
    .description(`Get a list of all the site's code deployments. You can use the query params to filter your results.`)
    .requiredOption(`--site-id <site-id>`, `Site ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: buildSize, sourceSize, totalSize, buildDuration, status, activate, type`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(sitesListDeployments))

sites
    .command(`create-deployment`)
    .description(`Create a new site code deployment. Use this endpoint to upload a new version of your site code. To activate your newly uploaded code, you'll need to update the function's deployment to use your new deployment ID.`)
    .requiredOption(`--site-id <site-id>`, `Site ID.`)
    .requiredOption(`--code <code>`, `Gzip file with your code package. When used with the Appwrite CLI, pass the path to your code directory, and the CLI will automatically package your code. Use a path that is within the current directory.`)
    .requiredOption(`--activate [value]`, `Automatically activate the deployment when it is finished building.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--install-command <install-command>`, `Install Commands.`)
    .option(`--build-command <build-command>`, `Build Commands.`)
    .option(`--output-directory <output-directory>`, `Output Directory.`)
    .action(actionRunner(sitesCreateDeployment))

sites
    .command(`create-duplicate-deployment`)
    .description(`Create a new build for an existing site deployment. This endpoint allows you to rebuild a deployment with the updated site configuration, including its commands and output directory if they have been modified. The build process will be queued and executed asynchronously. The original deployment's code will be preserved and used for the new build.`)
    .requiredOption(`--site-id <site-id>`, `Site ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .action(actionRunner(sitesCreateDuplicateDeployment))

sites
    .command(`create-template-deployment`)
    .description(`Create a deployment based on a template.  Use this endpoint with combination of [listTemplates](https://appwrite.io/docs/server/sites#listTemplates) to find the template details.`)
    .requiredOption(`--site-id <site-id>`, `Site ID.`)
    .requiredOption(`--repository <repository>`, `Repository name of the template.`)
    .requiredOption(`--owner <owner>`, `The name of the owner of the template.`)
    .requiredOption(`--root-directory <root-directory>`, `Path to site code in the template repo.`)
    .requiredOption(`--version <version>`, `Version (tag) for the repo linked to the site template.`)
    .option(`--activate [value]`, `Automatically activate the deployment when it is finished building.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(sitesCreateTemplateDeployment))

sites
    .command(`create-vcs-deployment`)
    .description(`Create a deployment when a site is connected to VCS.  This endpoint lets you create deployment from a branch, commit, or a tag.`)
    .requiredOption(`--site-id <site-id>`, `Site ID.`)
    .requiredOption(`--type <type>`, `Type of reference passed. Allowed values are: branch, commit`)
    .requiredOption(`--reference <reference>`, `VCS reference to create deployment from. Depending on type this can be: branch name, commit hash`)
    .option(`--activate [value]`, `Automatically activate the deployment when it is finished building.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(sitesCreateVcsDeployment))

sites
    .command(`get-deployment`)
    .description(`Get a site deployment by its unique ID.`)
    .requiredOption(`--site-id <site-id>`, `Site ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(sitesGetDeployment))

sites
    .command(`delete-deployment`)
    .description(`Delete a site deployment by its unique ID.`)
    .requiredOption(`--site-id <site-id>`, `Site ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .action(actionRunner(sitesDeleteDeployment))

sites
    .command(`get-deployment-download`)
    .description(`Get a site deployment content by its unique ID. The endpoint response return with a 'Content-Disposition: attachment' header that tells the browser to start downloading the file to user downloads directory.`)
    .requiredOption(`--site-id <site-id>`, `Site ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .option(`--type <type>`, `Deployment file to download. Can be: "source", "output".`)
    .requiredOption(`--destination <path>`, `output file path.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(sitesGetDeploymentDownload))

sites
    .command(`update-deployment-status`)
    .description(`Cancel an ongoing site deployment build. If the build is already in progress, it will be stopped and marked as canceled. If the build hasn't started yet, it will be marked as canceled without executing. You cannot cancel builds that have already completed (status 'ready') or failed. The response includes the final build status and details.`)
    .requiredOption(`--site-id <site-id>`, `Site ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .action(actionRunner(sitesUpdateDeploymentStatus))

sites
    .command(`list-logs`)
    .description(`Get a list of all site logs. You can use the query params to filter your results.`)
    .requiredOption(`--site-id <site-id>`, `Site ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: trigger, status, responseStatusCode, duration, requestMethod, requestPath, deploymentId`)
    .action(actionRunner(sitesListLogs))

sites
    .command(`get-log`)
    .description(`Get a site request log by its unique ID.`)
    .requiredOption(`--site-id <site-id>`, `Site ID.`)
    .requiredOption(`--log-id <log-id>`, `Log ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(sitesGetLog))

sites
    .command(`delete-log`)
    .description(`Delete a site log by its unique ID.`)
    .requiredOption(`--site-id <site-id>`, `Site ID.`)
    .requiredOption(`--log-id <log-id>`, `Log ID.`)
    .action(actionRunner(sitesDeleteLog))

sites
    .command(`get-usage`)
    .description(`Get usage metrics and statistics for a for a specific site. View statistics including total deployments, builds, executions, storage usage, and compute time. The response includes both current totals and historical data for each metric. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, defaults to 30 days.`)
    .requiredOption(`--site-id <site-id>`, `Site ID.`)
    .option(`--range <range>`, `Date range.`)
    .action(actionRunner(sitesGetUsage))

sites
    .command(`list-variables`)
    .description(`Get a list of all variables of a specific site.`)
    .requiredOption(`--site-id <site-id>`, `Site unique ID.`)
    .action(actionRunner(sitesListVariables))

sites
    .command(`create-variable`)
    .description(`Create a new site variable. These variables can be accessed during build and runtime (server-side rendering) as environment variables.`)
    .requiredOption(`--site-id <site-id>`, `Site unique ID.`)
    .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
    .requiredOption(`--value <value>`, `Variable value. Max length: 8192 chars.`)
    .option(`--secret [value]`, `Secret variables can be updated or deleted, but only sites can read them during build and runtime.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(sitesCreateVariable))

sites
    .command(`get-variable`)
    .description(`Get a variable by its unique ID.`)
    .requiredOption(`--site-id <site-id>`, `Site unique ID.`)
    .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
    .action(actionRunner(sitesGetVariable))

sites
    .command(`update-variable`)
    .description(`Update variable by its unique ID.`)
    .requiredOption(`--site-id <site-id>`, `Site unique ID.`)
    .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
    .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
    .option(`--value <value>`, `Variable value. Max length: 8192 chars.`)
    .option(`--secret [value]`, `Secret variables can be updated or deleted, but only sites can read them during build and runtime.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(sitesUpdateVariable))

sites
    .command(`delete-variable`)
    .description(`Delete a variable by its unique ID.`)
    .requiredOption(`--site-id <site-id>`, `Site unique ID.`)
    .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
    .action(actionRunner(sitesDeleteVariable))

module.exports = {
    sites,
    sitesList,
    sitesCreate,
    sitesListFrameworks,
    sitesListSpecifications,
    sitesListTemplates,
    sitesGetTemplate,
    sitesListUsage,
    sitesGet,
    sitesUpdate,
    sitesDelete,
    sitesUpdateSiteDeployment,
    sitesListDeployments,
    sitesCreateDeployment,
    sitesCreateDuplicateDeployment,
    sitesCreateTemplateDeployment,
    sitesCreateVcsDeployment,
    sitesGetDeployment,
    sitesDeleteDeployment,
    sitesGetDeploymentDownload,
    sitesUpdateDeploymentStatus,
    sitesListLogs,
    sitesGetLog,
    sitesDeleteLog,
    sitesGetUsage,
    sitesListVariables,
    sitesCreateVariable,
    sitesGetVariable,
    sitesUpdateVariable,
    sitesDeleteVariable
};
