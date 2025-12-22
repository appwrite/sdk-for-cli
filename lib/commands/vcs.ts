import fs = require('fs');
import pathLib = require('path');
import tar = require('tar');
import ignore = require('ignore');
import { promisify } from 'util';
import Client from '../client';
import { getAllFiles, showConsoleLink } from '../utils';
import { Command } from 'commander';
import { sdkForProject, sdkForConsole } from '../sdks';
import { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log, warn } from '../parser';
import { localConfig, globalConfig } from '../config';
import { File } from 'undici';
import { ReadableStream } from 'stream/web';

function convertReadStreamToReadableStream(readStream: fs.ReadStream): ReadableStream {
  return new ReadableStream({
    start(controller) {
      readStream.on("data", (chunk: Buffer) => {
        controller.enqueue(chunk);
      });
      readStream.on("end", () => {
        controller.close();
      });
      readStream.on("error", (err: Error) => {
        controller.error(err);
      });
    },
    cancel() {
      readStream.destroy();
    },
  });
}

export const vcs = new Command("vcs").description(commandDescriptions['vcs'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

interface VcsCreateRepositoryDetectionRequestParams {
    installationId: string;
    providerRepositoryId: string;
    type: VCSDetectionType;
    providerRootDirectory?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const vcsCreateRepositoryDetection = async ({installationId,providerRepositoryId,type,providerRootDirectory,parseOutput = true, overrideForCli = false, sdk = undefined}: VcsCreateRepositoryDetectionRequestParams): Promise<any> => {
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
interface VcsListRepositoriesRequestParams {
    installationId: string;
    type: VCSDetectionType;
    search?: string;
    queries?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const vcsListRepositories = async ({installationId,type,search,queries,parseOutput = true, overrideForCli = false, sdk = undefined}: VcsListRepositoriesRequestParams): Promise<any> => {
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
interface VcsCreateRepositoryRequestParams {
    installationId: string;
    name: string;
    xprivate: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const vcsCreateRepository = async ({installationId,name,xprivate,parseOutput = true, overrideForCli = false, sdk = undefined}: VcsCreateRepositoryRequestParams): Promise<any> => {
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
interface VcsGetRepositoryRequestParams {
    installationId: string;
    providerRepositoryId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const vcsGetRepository = async ({installationId,providerRepositoryId,parseOutput = true, overrideForCli = false, sdk = undefined}: VcsGetRepositoryRequestParams): Promise<any> => {
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
interface VcsListRepositoryBranchesRequestParams {
    installationId: string;
    providerRepositoryId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const vcsListRepositoryBranches = async ({installationId,providerRepositoryId,parseOutput = true, overrideForCli = false, sdk = undefined}: VcsListRepositoryBranchesRequestParams): Promise<any> => {
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
interface VcsGetRepositoryContentsRequestParams {
    installationId: string;
    providerRepositoryId: string;
    providerRootDirectory?: string;
    providerReference?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const vcsGetRepositoryContents = async ({installationId,providerRepositoryId,providerRootDirectory,providerReference,parseOutput = true, overrideForCli = false, sdk = undefined}: VcsGetRepositoryContentsRequestParams): Promise<any> => {
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
interface VcsUpdateExternalDeploymentsRequestParams {
    installationId: string;
    repositoryId: string;
    providerPullRequestId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const vcsUpdateExternalDeployments = async ({installationId,repositoryId,providerPullRequestId,parseOutput = true, overrideForCli = false, sdk = undefined}: VcsUpdateExternalDeploymentsRequestParams): Promise<any> => {
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
interface VcsListInstallationsRequestParams {
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const vcsListInstallations = async ({queries,search,total,parseOutput = true, overrideForCli = false, sdk = undefined}: VcsListInstallationsRequestParams): Promise<any> => {
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
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
interface VcsGetInstallationRequestParams {
    installationId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const vcsGetInstallation = async ({installationId,parseOutput = true, overrideForCli = false, sdk = undefined}: VcsGetInstallationRequestParams): Promise<any> => {
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
interface VcsDeleteInstallationRequestParams {
    installationId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const vcsDeleteInstallation = async ({installationId,parseOutput = true, overrideForCli = false, sdk = undefined}: VcsDeleteInstallationRequestParams): Promise<any> => {
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
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(vcsListRepositories))

vcs
    .command(`create-repository`)
    .description(`Create a new GitHub repository through your installation. This endpoint allows you to create either a public or private repository by specifying a name and visibility setting. The repository will be created under your GitHub user account or organization, depending on your installation type. The GitHub installation must be properly configured and have the necessary permissions for repository creation.`)
    .requiredOption(`--installation-id <installation-id>`, `Installation Id`)
    .requiredOption(`--name <name>`, `Repository name (slug)`)
    .requiredOption(`--xprivate [value]`, `Mark repository public or private`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .description(`Get a list of files and directories from a GitHub repository connected to your project. This endpoint returns the contents of a specified repository path, including file names, sizes, and whether each item is a file or directory. The GitHub installation must be properly configured and the repository must be accessible through your installation for this endpoint to work.`)
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
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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


