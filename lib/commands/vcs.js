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

const vcs = new Command("vcs").description(commandDescriptions['vcs']).configureHelp({
    helpWidth: process.stdout.columns || 80
  })

const vcsListRepositories = async ({ installationId, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string} installationId */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/vcs/github/installations/{installationId}/providerRepositories'.replace('{installationId}', installationId);
    let payload = {};

    /** Query Params */
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

const vcsCreateRepository = async ({ installationId, name, xprivate, parseOutput = true, sdk = undefined}) => {
    /* @param {string} installationId */
    /* @param {string} name */
    /* @param {boolean} xprivate */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/vcs/github/installations/{installationId}/providerRepositories'.replace('{installationId}', installationId);
    let payload = {};
    
    /** Body Params */

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

const vcsGetRepository = async ({ installationId, providerRepositoryId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} installationId */
    /* @param {string} providerRepositoryId */

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

const vcsListRepositoryBranches = async ({ installationId, providerRepositoryId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} installationId */
    /* @param {string} providerRepositoryId */

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

const vcsCreateRepositoryDetection = async ({ installationId, providerRepositoryId, providerRootDirectory, parseOutput = true, sdk = undefined}) => {
    /* @param {string} installationId */
    /* @param {string} providerRepositoryId */
    /* @param {string} providerRootDirectory */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/vcs/github/installations/{installationId}/providerRepositories/{providerRepositoryId}/detection'.replace('{installationId}', installationId).replace('{providerRepositoryId}', providerRepositoryId);
    let payload = {};
    
    /** Body Params */

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

const vcsUpdateExternalDeployments = async ({ installationId, repositoryId, providerPullRequestId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} installationId */
    /* @param {string} repositoryId */
    /* @param {string} providerPullRequestId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/vcs/github/installations/{installationId}/repositories/{repositoryId}'.replace('{installationId}', installationId).replace('{repositoryId}', repositoryId);
    let payload = {};
    
    /** Body Params */

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

const vcsListInstallations = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/vcs/installations';
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

const vcsGetInstallation = async ({ installationId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} installationId */

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

const vcsDeleteInstallation = async ({ installationId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} installationId */

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
