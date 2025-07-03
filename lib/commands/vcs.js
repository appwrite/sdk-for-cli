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

const vcs = new Command("vcs").description(commandDescriptions['vcs'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} VcsCreateRepositoryDetectionRequestParams
 * @property {string} installationId Installation Id
 * @property {string} providerRepositoryId Repository Id
 * @property {VCSDetectionType} type Detector type. Must be one of the following: runtime, framework
 * @property {string} providerRootDirectory Path to Root Directory
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsCreateRepositoryDetectionRequestParams} params
 */
const vcsCreateRepositoryDetection = async ({installationId,providerRepositoryId,type,providerRootDirectory,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/vcs/github/installations/{installationId}/detections'.replace('{installationId}', installationId);
    let payload = {};
    if (typeof providerRepositoryId !== 'undefined') {
        payload['providerRepositoryId'] = providerRepositoryId;
    }
    if (typeof type !== 'undefined') {
        payload['type'] = type;
    }
    if (typeof providerRootDirectory !== 'undefined') {
        payload['providerRootDirectory'] = providerRootDirectory;
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
 * @typedef {Object} VcsListRepositoriesRequestParams
 * @property {string} installationId Installation Id
 * @property {VCSDetectionType} type Detector type. Must be one of the following: runtime, framework
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsListRepositoriesRequestParams} params
 */
const vcsListRepositories = async ({installationId,type,search,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/vcs/github/installations/{installationId}/providerRepositories'.replace('{installationId}', installationId);
    let payload = {};
    if (typeof type !== 'undefined') {
        payload['type'] = type;
    }
    if (typeof search !== 'undefined') {
        payload['search'] = search;
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
 * @typedef {Object} VcsCreateRepositoryRequestParams
 * @property {string} installationId Installation Id
 * @property {string} name Repository name (slug)
 * @property {boolean} xprivate Mark repository public or private
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsCreateRepositoryRequestParams} params
 */
const vcsCreateRepository = async ({installationId,name,xprivate,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
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
    }

    return response;

}

/**
 * @typedef {Object} VcsGetRepositoryRequestParams
 * @property {string} installationId Installation Id
 * @property {string} providerRepositoryId Repository Id
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsGetRepositoryRequestParams} params
 */
const vcsGetRepository = async ({installationId,providerRepositoryId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/vcs/github/installations/{installationId}/providerRepositories/{providerRepositoryId}'.replace('{installationId}', installationId).replace('{providerRepositoryId}', providerRepositoryId);
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
 * @typedef {Object} VcsListRepositoryBranchesRequestParams
 * @property {string} installationId Installation Id
 * @property {string} providerRepositoryId Repository Id
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsListRepositoryBranchesRequestParams} params
 */
const vcsListRepositoryBranches = async ({installationId,providerRepositoryId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/vcs/github/installations/{installationId}/providerRepositories/{providerRepositoryId}/branches'.replace('{installationId}', installationId).replace('{providerRepositoryId}', providerRepositoryId);
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
 * @typedef {Object} VcsGetRepositoryContentsRequestParams
 * @property {string} installationId Installation Id
 * @property {string} providerRepositoryId Repository Id
 * @property {string} providerRootDirectory Path to get contents of nested directory
 * @property {string} providerReference Git reference (branch, tag, commit) to get contents from
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsGetRepositoryContentsRequestParams} params
 */
const vcsGetRepositoryContents = async ({installationId,providerRepositoryId,providerRootDirectory,providerReference,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/vcs/github/installations/{installationId}/providerRepositories/{providerRepositoryId}/contents'.replace('{installationId}', installationId).replace('{providerRepositoryId}', providerRepositoryId);
    let payload = {};
    if (typeof providerRootDirectory !== 'undefined') {
        payload['providerRootDirectory'] = providerRootDirectory;
    }
    if (typeof providerReference !== 'undefined') {
        payload['providerReference'] = providerReference;
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
 * @typedef {Object} VcsUpdateExternalDeploymentsRequestParams
 * @property {string} installationId Installation Id
 * @property {string} repositoryId VCS Repository Id
 * @property {string} providerPullRequestId GitHub Pull Request Id
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsUpdateExternalDeploymentsRequestParams} params
 */
const vcsUpdateExternalDeployments = async ({installationId,repositoryId,providerPullRequestId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
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
    }

    return response;

}

/**
 * @typedef {Object} VcsListInstallationsRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: provider, organization
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsListInstallationsRequestParams} params
 */
const vcsListInstallations = async ({queries,search,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
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
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} VcsGetInstallationRequestParams
 * @property {string} installationId Installation Id
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsGetInstallationRequestParams} params
 */
const vcsGetInstallation = async ({installationId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/vcs/installations/{installationId}'.replace('{installationId}', installationId);
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
 * @typedef {Object} VcsDeleteInstallationRequestParams
 * @property {string} installationId Installation Id
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {VcsDeleteInstallationRequestParams} params
 */
const vcsDeleteInstallation = async ({installationId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/vcs/installations/{installationId}'.replace('{installationId}', installationId);
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

vcs
    .command(`create-repository-detection`)
    .description(`Analyze a GitHub repository to automatically detect the programming language and runtime environment. This endpoint scans the repository's files and language statistics to determine the appropriate runtime settings for your function. The GitHub installation must be properly configured and the repository must be accessible through your installation for this endpoint to work.`)
    .requiredOption(`--installation-id <installation-id>`, `Installation Id`)
    .requiredOption(`--provider-repository-id <provider-repository-id>`, `Repository Id`)
    .requiredOption(`--type <type>`, `Detector type. Must be one of the following: runtime, framework`)
    .option(`--provider-root-directory <provider-root-directory>`, `Path to Root Directory`)
    .action(actionRunner(vcsCreateRepositoryDetection))

vcs
    .command(`list-repositories`)
    .description(`Get a list of GitHub repositories available through your installation. This endpoint returns repositories with their basic information, detected runtime environments, and latest push dates. You can optionally filter repositories using a search term. Each repository's runtime is automatically detected based on its contents and language statistics. The GitHub installation must be properly configured for this endpoint to work.`)
    .requiredOption(`--installation-id <installation-id>`, `Installation Id`)
    .requiredOption(`--type <type>`, `Detector type. Must be one of the following: runtime, framework`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(vcsListRepositories))

vcs
    .command(`create-repository`)
    .description(`Create a new GitHub repository through your installation. This endpoint allows you to create either a public or private repository by specifying a name and visibility setting. The repository will be created under your GitHub user account or organization, depending on your installation type. The GitHub installation must be properly configured and have the necessary permissions for repository creation.`)
    .requiredOption(`--installation-id <installation-id>`, `Installation Id`)
    .requiredOption(`--name <name>`, `Repository name (slug)`)
    .requiredOption(`--xprivate [value]`, `Mark repository public or private`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(vcsCreateRepository))

vcs
    .command(`get-repository`)
    .description(`Get detailed information about a specific GitHub repository from your installation. This endpoint returns repository details including its ID, name, visibility status, organization, and latest push date. The GitHub installation must be properly configured and have access to the requested repository for this endpoint to work.`)
    .requiredOption(`--installation-id <installation-id>`, `Installation Id`)
    .requiredOption(`--provider-repository-id <provider-repository-id>`, `Repository Id`)
    .action(actionRunner(vcsGetRepository))

vcs
    .command(`list-repository-branches`)
    .description(`Get a list of all branches from a GitHub repository in your installation. This endpoint returns the names of all branches in the repository and their total count. The GitHub installation must be properly configured and have access to the requested repository for this endpoint to work. `)
    .requiredOption(`--installation-id <installation-id>`, `Installation Id`)
    .requiredOption(`--provider-repository-id <provider-repository-id>`, `Repository Id`)
    .action(actionRunner(vcsListRepositoryBranches))

vcs
    .command(`get-repository-contents`)
    .description(`Get a list of files and directories from a GitHub repository connected to your project. This endpoint returns the contents of a specified repository path, including file names, sizes, and whether each item is a file or directory. The GitHub installation must be properly configured and the repository must be accessible through your installation for this endpoint to work. `)
    .requiredOption(`--installation-id <installation-id>`, `Installation Id`)
    .requiredOption(`--provider-repository-id <provider-repository-id>`, `Repository Id`)
    .option(`--provider-root-directory <provider-root-directory>`, `Path to get contents of nested directory`)
    .option(`--provider-reference <provider-reference>`, `Git reference (branch, tag, commit) to get contents from`)
    .action(actionRunner(vcsGetRepositoryContents))

vcs
    .command(`update-external-deployments`)
    .description(`Authorize and create deployments for a GitHub pull request in your project. This endpoint allows external contributions by creating deployments from pull requests, enabling preview environments for code review. The pull request must be open and not previously authorized. The GitHub installation must be properly configured and have access to both the repository and pull request for this endpoint to work.`)
    .requiredOption(`--installation-id <installation-id>`, `Installation Id`)
    .requiredOption(`--repository-id <repository-id>`, `VCS Repository Id`)
    .requiredOption(`--provider-pull-request-id <provider-pull-request-id>`, `GitHub Pull Request Id`)
    .action(actionRunner(vcsUpdateExternalDeployments))

vcs
    .command(`list-installations`)
    .description(`List all VCS installations configured for the current project. This endpoint returns a list of installations including their provider, organization, and other configuration details. `)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: provider, organization`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(vcsListInstallations))

vcs
    .command(`get-installation`)
    .description(`Get a VCS installation by its unique ID. This endpoint returns the installation's details including its provider, organization, and configuration. `)
    .requiredOption(`--installation-id <installation-id>`, `Installation Id`)
    .action(actionRunner(vcsGetInstallation))

vcs
    .command(`delete-installation`)
    .description(`Delete a VCS installation by its unique ID. This endpoint removes the installation and all its associated repositories from the project.`)
    .requiredOption(`--installation-id <installation-id>`, `Installation Id`)
    .action(actionRunner(vcsDeleteInstallation))

module.exports = {
    vcs,
    vcsCreateRepositoryDetection,
    vcsListRepositories,
    vcsCreateRepository,
    vcsGetRepository,
    vcsListRepositoryBranches,
    vcsGetRepositoryContents,
    vcsUpdateExternalDeployments,
    vcsListInstallations,
    vcsGetInstallation,
    vcsDeleteInstallation
};
