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

const vcs = new Command("vcs").description(commandDescriptions['vcs']).configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} VcsListRepositoriesRequestParams
 * @property {string} installationId Installation Id
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsListRepositoriesRequestParams} params
 */
const vcsListRepositories = async ({ installationId, search, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/vcs/github/installations/{installationId}/providerRepositories'.replace('{installationId}', installationId);
    let payload = {};
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

/**
 * @typedef {Object} VcsCreateRepositoryRequestParams
 * @property {string} installationId Installation Id
 * @property {string} name Repository name (slug)
 * @property {boolean} xprivate Mark repository public or private
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsCreateRepositoryRequestParams} params
 */
const vcsCreateRepository = async ({ installationId, name, xprivate, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/vcs/github/installations/{installationId}/providerRepositories'.replace('{installationId}', installationId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof xprivate !== 'undefined') {
        payload['private'] = xprivate;
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

/**
 * @typedef {Object} VcsGetRepositoryRequestParams
 * @property {string} installationId Installation Id
 * @property {string} providerRepositoryId Repository Id
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsGetRepositoryRequestParams} params
 */
const vcsGetRepository = async ({ installationId, providerRepositoryId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/vcs/github/installations/{installationId}/providerRepositories/{providerRepositoryId}'.replace('{installationId}', installationId).replace('{providerRepositoryId}', providerRepositoryId);
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

/**
 * @typedef {Object} VcsListRepositoryBranchesRequestParams
 * @property {string} installationId Installation Id
 * @property {string} providerRepositoryId Repository Id
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsListRepositoryBranchesRequestParams} params
 */
const vcsListRepositoryBranches = async ({ installationId, providerRepositoryId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/vcs/github/installations/{installationId}/providerRepositories/{providerRepositoryId}/branches'.replace('{installationId}', installationId).replace('{providerRepositoryId}', providerRepositoryId);
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

/**
 * @typedef {Object} VcsCreateRepositoryDetectionRequestParams
 * @property {string} installationId Installation Id
 * @property {string} providerRepositoryId Repository Id
 * @property {string} providerRootDirectory Path to Root Directory
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsCreateRepositoryDetectionRequestParams} params
 */
const vcsCreateRepositoryDetection = async ({ installationId, providerRepositoryId, providerRootDirectory, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/vcs/github/installations/{installationId}/providerRepositories/{providerRepositoryId}/detection'.replace('{installationId}', installationId).replace('{providerRepositoryId}', providerRepositoryId);
    let payload = {};
    if (typeof providerRootDirectory !== 'undefined') {
        payload['providerRootDirectory'] = providerRootDirectory;
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

/**
 * @typedef {Object} VcsUpdateExternalDeploymentsRequestParams
 * @property {string} installationId Installation Id
 * @property {string} repositoryId VCS Repository Id
 * @property {string} providerPullRequestId GitHub Pull Request Id
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsUpdateExternalDeploymentsRequestParams} params
 */
const vcsUpdateExternalDeployments = async ({ installationId, repositoryId, providerPullRequestId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/vcs/github/installations/{installationId}/repositories/{repositoryId}'.replace('{installationId}', installationId).replace('{repositoryId}', repositoryId);
    let payload = {};
    if (typeof providerPullRequestId !== 'undefined') {
        payload['providerPullRequestId'] = providerPullRequestId;
    }

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

/**
 * @typedef {Object} VcsListInstallationsRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: provider, organization
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsListInstallationsRequestParams} params
 */
const vcsListInstallations = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/vcs/installations';
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
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} VcsGetInstallationRequestParams
 * @property {string} installationId Installation Id
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsGetInstallationRequestParams} params
 */
const vcsGetInstallation = async ({ installationId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/vcs/installations/{installationId}'.replace('{installationId}', installationId);
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

/**
 * @typedef {Object} VcsDeleteInstallationRequestParams
 * @property {string} installationId Installation Id
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsDeleteInstallationRequestParams} params
 */
const vcsDeleteInstallation = async ({ installationId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/vcs/installations/{installationId}'.replace('{installationId}', installationId);
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

vcs
    .command(`listRepositories`)
    .description(``)
    .requiredOption(`--installationId <installationId>`, `Installation Id`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(vcsListRepositories))

vcs
    .command(`createRepository`)
    .description(``)
    .requiredOption(`--installationId <installationId>`, `Installation Id`)
    .requiredOption(`--name <name>`, `Repository name (slug)`)
    .requiredOption(`--xprivate <xprivate>`, `Mark repository public or private`, parseBool)
    .action(actionRunner(vcsCreateRepository))

vcs
    .command(`getRepository`)
    .description(``)
    .requiredOption(`--installationId <installationId>`, `Installation Id`)
    .requiredOption(`--providerRepositoryId <providerRepositoryId>`, `Repository Id`)
    .action(actionRunner(vcsGetRepository))

vcs
    .command(`listRepositoryBranches`)
    .description(``)
    .requiredOption(`--installationId <installationId>`, `Installation Id`)
    .requiredOption(`--providerRepositoryId <providerRepositoryId>`, `Repository Id`)
    .action(actionRunner(vcsListRepositoryBranches))

vcs
    .command(`createRepositoryDetection`)
    .description(``)
    .requiredOption(`--installationId <installationId>`, `Installation Id`)
    .requiredOption(`--providerRepositoryId <providerRepositoryId>`, `Repository Id`)
    .option(`--providerRootDirectory <providerRootDirectory>`, `Path to Root Directory`)
    .action(actionRunner(vcsCreateRepositoryDetection))

vcs
    .command(`updateExternalDeployments`)
    .description(``)
    .requiredOption(`--installationId <installationId>`, `Installation Id`)
    .requiredOption(`--repositoryId <repositoryId>`, `VCS Repository Id`)
    .requiredOption(`--providerPullRequestId <providerPullRequestId>`, `GitHub Pull Request Id`)
    .action(actionRunner(vcsUpdateExternalDeployments))

vcs
    .command(`listInstallations`)
    .description(``)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: provider, organization`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(vcsListInstallations))

vcs
    .command(`getInstallation`)
    .description(``)
    .requiredOption(`--installationId <installationId>`, `Installation Id`)
    .action(actionRunner(vcsGetInstallation))

vcs
    .command(`deleteInstallation`)
    .description(``)
    .requiredOption(`--installationId <installationId>`, `Installation Id`)
    .action(actionRunner(vcsDeleteInstallation))

module.exports = {
    vcs,
    vcsListRepositories,
    vcsCreateRepository,
    vcsGetRepository,
    vcsListRepositoryBranches,
    vcsCreateRepositoryDetection,
    vcsUpdateExternalDeployments,
    vcsListInstallations,
    vcsGetInstallation,
    vcsDeleteInstallation
};