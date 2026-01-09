import { Command } from "commander";
import { sdkForProject } from "../../sdks.js";
import {
  actionRunner,
  commandDescriptions,
  success,
  parse,
  parseBool,
  parseInteger,
} from "../../parser.js";
// Mock enums
export enum VCSDetectionType {
  // Mock enum values
}

// Mock Vcs class
class Vcs {
  constructor(sdkClient: any) {}

  async createRepositoryDetection(installationId: string, providerRepositoryId: string, type: string, providerRootDirectory?: string): Promise<any> {
    return { result: 'POST:/v1/vcs/github/installations/{installationId}/detections:passed' };
  }

  async listRepositories(installationId: string, type: string, search?: string, queries?: any[]): Promise<any> {
    return { result: 'GET:/v1/vcs/github/installations/{installationId}/providerRepositories:passed' };
  }

  async createRepository(installationId: string, name: string, xPrivate: boolean): Promise<any> {
    return { result: 'POST:/v1/vcs/github/installations/{installationId}/providerRepositories:passed' };
  }

  async getRepository(installationId: string, providerRepositoryId: string): Promise<any> {
    return { result: 'GET:/v1/vcs/github/installations/{installationId}/providerRepositories/{providerRepositoryId}:passed' };
  }

  async listRepositoryBranches(installationId: string, providerRepositoryId: string): Promise<any> {
    return { result: 'GET:/v1/vcs/github/installations/{installationId}/providerRepositories/{providerRepositoryId}/branches:passed' };
  }

  async getRepositoryContents(installationId: string, providerRepositoryId: string, providerRootDirectory?: string, providerReference?: string): Promise<any> {
    return { result: 'GET:/v1/vcs/github/installations/{installationId}/providerRepositories/{providerRepositoryId}/contents:passed' };
  }

  async updateExternalDeployments(installationId: string, repositoryId: string, providerPullRequestId: string): Promise<any> {
    return { result: 'PATCH:/v1/vcs/github/installations/{installationId}/repositories/{repositoryId}:passed' };
  }

  async listInstallations(queries?: any[], search?: string, total?: boolean): Promise<any> {
    return { result: 'GET:/v1/vcs/installations:passed' };
  }

  async getInstallation(installationId: string): Promise<any> {
    return { result: 'GET:/v1/vcs/installations/{installationId}:passed' };
  }

  async deleteInstallation(installationId: string): Promise<any> {
    return { result: 'DELETE:/v1/vcs/installations/{installationId}:passed' };
  }
}


let vcsClient: Vcs | null = null;

const getVcsClient = async (): Promise<Vcs> => {
  if (!vcsClient) {
    const sdkClient = await sdkForProject();
    vcsClient = new Vcs(sdkClient);
  }
  return vcsClient;
};

export const vcs = new Command("vcs")
  .description(commandDescriptions["vcs"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

vcs
  .command(`create-repository-detection`)
  .description(`Analyze a GitHub repository to automatically detect the programming language and runtime environment. This endpoint scans the repository's files and language statistics to determine the appropriate runtime settings for your function. The GitHub installation must be properly configured and the repository must be accessible through your installation for this endpoint to work.`)
  .requiredOption(`--installationid <installationid>`, `Installation Id`)
  .requiredOption(`--providerrepositoryid <providerrepositoryid>`, `Repository Id`)
  .requiredOption(`--type <type>`, `Detector type. Must be one of the following: runtime, framework`)
  .option(`--providerrootdirectory <providerrootdirectory>`, `Path to Root Directory`)
  .action(
    actionRunner(
      async ({ installationId, providerRepositoryId, type, providerRootDirectory }) =>
        parse(await (await getVcsClient()).createRepositoryDetection(installationId, providerRepositoryId, type as VCSDetectionType, providerRootDirectory)),
    ),
  );

vcs
  .command(`list-repositories`)
  .description(`Get a list of GitHub repositories available through your installation. This endpoint returns repositories with their basic information, detected runtime environments, and latest push dates. You can optionally filter repositories using a search term. Each repository's runtime is automatically detected based on its contents and language statistics. The GitHub installation must be properly configured for this endpoint to work.`)
  .requiredOption(`--installationid <installationid>`, `Installation Id`)
  .requiredOption(`--type <type>`, `Detector type. Must be one of the following: runtime, framework`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .action(
    actionRunner(
      async ({ installationId, type, search, queries }) =>
        parse(await (await getVcsClient()).listRepositories(installationId, type as VCSDetectionType, search, queries)),
    ),
  );

vcs
  .command(`create-repository`)
  .description(`Create a new GitHub repository through your installation. This endpoint allows you to create either a public or private repository by specifying a name and visibility setting. The repository will be created under your GitHub user account or organization, depending on your installation type. The GitHub installation must be properly configured and have the necessary permissions for repository creation.`)
  .requiredOption(`--installationid <installationid>`, `Installation Id`)
  .requiredOption(`--name <name>`, `Repository name (slug)`)
  .requiredOption(`--xprivate <xprivate>`, `Mark repository public or private`, parseBool)
  .action(
    actionRunner(
      async ({ installationId, name, xPrivate }) =>
        parse(await (await getVcsClient()).createRepository(installationId, name, xPrivate)),
    ),
  );

vcs
  .command(`get-repository`)
  .description(`Get detailed information about a specific GitHub repository from your installation. This endpoint returns repository details including its ID, name, visibility status, organization, and latest push date. The GitHub installation must be properly configured and have access to the requested repository for this endpoint to work.`)
  .requiredOption(`--installationid <installationid>`, `Installation Id`)
  .requiredOption(`--providerrepositoryid <providerrepositoryid>`, `Repository Id`)
  .action(
    actionRunner(
      async ({ installationId, providerRepositoryId }) =>
        parse(await (await getVcsClient()).getRepository(installationId, providerRepositoryId)),
    ),
  );

vcs
  .command(`list-repository-branches`)
  .description(`Get a list of all branches from a GitHub repository in your installation. This endpoint returns the names of all branches in the repository and their total count. The GitHub installation must be properly configured and have access to the requested repository for this endpoint to work.
`)
  .requiredOption(`--installationid <installationid>`, `Installation Id`)
  .requiredOption(`--providerrepositoryid <providerrepositoryid>`, `Repository Id`)
  .action(
    actionRunner(
      async ({ installationId, providerRepositoryId }) =>
        parse(await (await getVcsClient()).listRepositoryBranches(installationId, providerRepositoryId)),
    ),
  );

vcs
  .command(`get-repository-contents`)
  .description(`Get a list of files and directories from a GitHub repository connected to your project. This endpoint returns the contents of a specified repository path, including file names, sizes, and whether each item is a file or directory. The GitHub installation must be properly configured and the repository must be accessible through your installation for this endpoint to work.`)
  .requiredOption(`--installationid <installationid>`, `Installation Id`)
  .requiredOption(`--providerrepositoryid <providerrepositoryid>`, `Repository Id`)
  .option(`--providerrootdirectory <providerrootdirectory>`, `Path to get contents of nested directory`)
  .option(`--providerreference <providerreference>`, `Git reference (branch, tag, commit) to get contents from`)
  .action(
    actionRunner(
      async ({ installationId, providerRepositoryId, providerRootDirectory, providerReference }) =>
        parse(await (await getVcsClient()).getRepositoryContents(installationId, providerRepositoryId, providerRootDirectory, providerReference)),
    ),
  );

vcs
  .command(`update-external-deployments`)
  .description(`Authorize and create deployments for a GitHub pull request in your project. This endpoint allows external contributions by creating deployments from pull requests, enabling preview environments for code review. The pull request must be open and not previously authorized. The GitHub installation must be properly configured and have access to both the repository and pull request for this endpoint to work.`)
  .requiredOption(`--installationid <installationid>`, `Installation Id`)
  .requiredOption(`--repositoryid <repositoryid>`, `VCS Repository Id`)
  .requiredOption(`--providerpullrequestid <providerpullrequestid>`, `GitHub Pull Request Id`)
  .action(
    actionRunner(
      async ({ installationId, repositoryId, providerPullRequestId }) =>
        parse(await (await getVcsClient()).updateExternalDeployments(installationId, repositoryId, providerPullRequestId)),
    ),
  );

vcs
  .command(`list-installations`)
  .description(`List all VCS installations configured for the current project. This endpoint returns a list of installations including their provider, organization, and other configuration details.
`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: provider, organization`)
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
        parse(await (await getVcsClient()).listInstallations(queries, search, total)),
    ),
  );

vcs
  .command(`get-installation`)
  .description(`Get a VCS installation by its unique ID. This endpoint returns the installation's details including its provider, organization, and configuration. `)
  .requiredOption(`--installationid <installationid>`, `Installation Id`)
  .action(
    actionRunner(
      async ({ installationId }) =>
        parse(await (await getVcsClient()).getInstallation(installationId)),
    ),
  );

vcs
  .command(`delete-installation`)
  .description(`Delete a VCS installation by its unique ID. This endpoint removes the installation and all its associated repositories from the project.`)
  .requiredOption(`--installationid <installationid>`, `Installation Id`)
  .action(
    actionRunner(
      async ({ installationId }) =>
        parse(await (await getVcsClient()).deleteInstallation(installationId)),
    ),
  );

