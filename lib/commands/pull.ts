import fs from "fs";
import chalk from "chalk";
import tar from "tar";
import { Command } from "commander";
import inquirer from "inquirer";
import {
  Databases,
  Functions,
  Messaging,
  Projects,
  Sites,
  Storage,
  TablesDB,
  Teams,
  Client,
  AppwriteException,
  Query,
  Models,
} from "@appwrite.io/console";
import {
  getFunctionsService,
  getSitesService,
  getDatabasesService,
  getTablesDBService,
} from "../services.js";
import { sdkForProject, sdkForConsole } from "../sdks.js";
import { localConfig } from "../config.js";
import { paginate } from "../paginate.js";
import {
  questionsPullFunctions,
  questionsPullFunctionsCode,
  questionsPullSites,
  questionsPullSitesCode,
  questionsPullResources,
} from "../questions.js";
import {
  cliConfig,
  success,
  log,
  warn,
  error,
  actionRunner,
  commandDescriptions,
} from "../parser.js";
import type { ConfigType } from "./config.js";
import { createSettingsObject } from "./config.js";
import { ProjectNotInitializedError } from "./errors.js";
import type { ProjectSettings, RawProjectSettings } from "../types.js";

export interface PullOptions {
  all?: boolean;
  settings?: boolean;
  functions?: boolean;
  sites?: boolean;
  collections?: boolean;
  tables?: boolean;
  buckets?: boolean;
  teams?: boolean;
  topics?: boolean;
  withVariables?: boolean;
  noCode?: boolean;
}

interface PullFunctionsOptions {
  code?: boolean;
  withVariables?: boolean;
  functionIds?: string[];
}

interface PullSitesOptions {
  code?: boolean;
  withVariables?: boolean;
  siteIds?: string[];
}

interface PullResourcesOptions {
  skipDeprecated?: boolean;
}

export interface PullSettingsResult {
  projectName: string;
  settings: ProjectSettings;
  rawSettings: RawProjectSettings;
}

async function createPullInstance(): Promise<Pull> {
  const projectClient = await sdkForProject();
  const consoleClient = await sdkForConsole();
  const pullInstance = new Pull(projectClient, consoleClient);

  pullInstance.setConfigDirectoryPath(localConfig.configDirectoryPath);
  return pullInstance;
}

export class Pull {
  private projectClient: Client;
  private consoleClient: Client;
  private configDirectoryPath: string;

  constructor(projectClient: Client, consoleClient: Client) {
    this.projectClient = projectClient;
    this.consoleClient = consoleClient;
    this.configDirectoryPath = process.cwd();
  }

  /**
   * Set the base directory path for config files and resources
   */
  public setConfigDirectoryPath(path: string): void {
    this.configDirectoryPath = path;
  }

  /**
   * Download and extract deployment code for a resource
   */
  private async downloadDeploymentCode(params: {
    resourceId: string;
    resourcePath: string;
    holdingVars: { key: string; value: string }[];
    withVariables?: boolean;
    listDeployments: () => Promise<any>;
    getDownloadUrl: (deploymentId: string) => string;
  }): Promise<void> {
    const {
      resourceId,
      resourcePath,
      holdingVars,
      withVariables,
      listDeployments,
      getDownloadUrl,
    } = params;

    let deploymentId: string | null = null;
    try {
      const deployments = await listDeployments();
      if (deployments["total"] > 0) {
        deploymentId = deployments["deployments"][0]["$id"];
      }
    } catch (e: unknown) {
      if (e instanceof AppwriteException) {
        error(e.message);
      }
    }

    if (deploymentId === null) {
      return;
    }

    const compressedFileName = `${resourceId}-${+new Date()}.tar.gz`;
    const downloadUrl = getDownloadUrl(deploymentId);

    const downloadBuffer = await this.projectClient.call(
      "get",
      new URL(downloadUrl),
      {},
      {},
      "arrayBuffer",
    );

    try {
      fs.writeFileSync(compressedFileName, Buffer.from(downloadBuffer as any));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(
        `Failed to write deployment archive to "${compressedFileName}": ${message}`,
      );
    }

    tar.extract({
      sync: true,
      cwd: resourcePath,
      file: compressedFileName,
      strict: false,
    });

    fs.rmSync(compressedFileName);

    if (withVariables) {
      const envFileLocation = `${resourcePath}/.env`;
      try {
        fs.rmSync(envFileLocation);
      } catch {}

      fs.writeFileSync(
        envFileLocation,
        holdingVars.map((r) => `${r.key}=${r.value}\n`).join(""),
      );
    }
  }

  /**
   * Pull resources from Appwrite project and return updated config
   *
   * @param config - Current configuration object
   * @param options - Pull options specifying which resources to pull
   * @returns Updated configuration object with pulled resources
   */
  public async pullResources(
    config: ConfigType,
    options: PullOptions = { all: true },
  ): Promise<ConfigType> {
    if (!config.projectId) {
      throw new ProjectNotInitializedError();
    }

    const updatedConfig: ConfigType = { ...config };
    const shouldPullAll = options.all === true;

    if (shouldPullAll || options.settings) {
      const settings = await this.pullSettings(config.projectId);
      updatedConfig.settings = settings.settings;
      updatedConfig.projectName = settings.projectName;
    }

    if (shouldPullAll || options.functions) {
      const functions = await this.pullFunctions({
        code: options.noCode === true ? false : true,
        withVariables: options.withVariables,
      });
      updatedConfig.functions = functions;
    }

    if (shouldPullAll || options.sites) {
      const sites = await this.pullSites({
        code: options.noCode === true ? false : true,
        withVariables: options.withVariables,
      });
      updatedConfig.sites = sites;
    }

    if (shouldPullAll || options.tables) {
      const { databases, tables } = await this.pullTables();
      updatedConfig.databases = databases;
      updatedConfig.collections = tables;
    }

    if (options.collections) {
      const { databases, collections } = await this.pullCollections();
      updatedConfig.databases = databases;
      updatedConfig.collections = collections;
    }

    if (shouldPullAll || options.buckets) {
      const buckets = await this.pullBuckets();
      updatedConfig.buckets = buckets;
    }

    if (shouldPullAll || options.teams) {
      const teams = await this.pullTeams();
      updatedConfig.teams = teams;
    }

    if (shouldPullAll || options.topics) {
      const topics = await this.pullMessagingTopics();
      updatedConfig.topics = topics;
    }

    return updatedConfig;
  }

  /**
   * Pull project settings
   */
  public async pullSettings(projectId: string): Promise<PullSettingsResult> {
    const projectsService = new Projects(this.consoleClient);
    const response = await projectsService.get(projectId);
    const rawSettings = response as RawProjectSettings;

    return {
      projectName: response.name,
      settings: createSettingsObject(rawSettings),
      rawSettings,
    };
  }

  /**
   * Pull functions from the project
   */
  public async pullFunctions(
    options: PullFunctionsOptions = {},
  ): Promise<any[]> {
    const originalCwd = process.cwd();
    process.chdir(this.configDirectoryPath);

    try {
      const functionsService = new Functions(this.projectClient);
      let functions: Models.Function[];

      if (options.functionIds && options.functionIds.length > 0) {
        functions = await Promise.all(
          options.functionIds.map((id) =>
            functionsService.get({
              functionId: id,
            }),
          ),
        );
      } else {
        const fetchResponse = await functionsService.list({
          queries: [Query.limit(1)],
        });

        if (fetchResponse["functions"].length <= 0) {
          return [];
        }

        const { functions: allFunctions } = await paginate(
          async () => new Functions(this.projectClient).list(),
          {},
          100,
          "functions",
        );
        functions = allFunctions;
      }

      const result: any[] = [];

      for (const func of functions) {
        const funcPath = `functions/${func.name}`;
        func["path"] = funcPath;

        const holdingVars = func["vars"] || [];
        delete func["vars"];

        result.push(func);

        if (!fs.existsSync(funcPath)) {
          fs.mkdirSync(funcPath, { recursive: true });
        }

        if (options.code !== false) {
          await this.downloadDeploymentCode({
            resourceId: func["$id"],
            resourcePath: funcPath,
            holdingVars,
            withVariables: options.withVariables,
            listDeployments: () =>
              functionsService.listDeployments({
                functionId: func["$id"],
                queries: [
                  JSON.stringify({ method: "limit", values: [1] }),
                  JSON.stringify({ method: "orderDesc", values: ["$id"] }),
                ],
              }),
            getDownloadUrl: (deploymentId) =>
              functionsService.getDeploymentDownload({
                functionId: func["$id"],
                deploymentId,
              }),
          });
        }
      }

      return result;
    } finally {
      process.chdir(originalCwd);
    }
  }

  /**
   * Pull sites from the project
   */
  public async pullSites(options: PullSitesOptions = {}): Promise<any[]> {
    const originalCwd = process.cwd();
    process.chdir(this.configDirectoryPath);

    try {
      const sitesService = new Sites(this.projectClient);
      let allSites: Models.Site[];

      if (options.siteIds && options.siteIds.length > 0) {
        allSites = await Promise.all(
          options.siteIds.map((id) =>
            sitesService.get({
              siteId: id,
            }),
          ),
        );
      } else {
        const fetchResponse = await sitesService.list({
          queries: [Query.limit(1)],
        });

        if (fetchResponse["sites"].length <= 0) {
          return [];
        }

        const { sites: fetchedSites } = await paginate(
          async () => new Sites(this.projectClient).list(),
          {},
          100,
          "sites",
        );
        allSites = fetchedSites;
      }

      const sites = options.siteIds
        ? allSites.filter((s) => options.siteIds!.includes(s.$id))
        : allSites;

      const result: any[] = [];

      for (const site of sites) {
        const sitePath = `sites/${site.name}`;
        site["path"] = sitePath;

        const holdingVars = site["vars"] || [];
        delete site["vars"];

        result.push(site);

        if (!fs.existsSync(sitePath)) {
          fs.mkdirSync(sitePath, { recursive: true });
        }

        if (options.code !== false) {
          await this.downloadDeploymentCode({
            resourceId: site["$id"],
            resourcePath: sitePath,
            holdingVars,
            withVariables: options.withVariables,
            listDeployments: () =>
              sitesService.listDeployments({
                siteId: site["$id"],
                queries: [
                  JSON.stringify({ method: "limit", values: [1] }),
                  JSON.stringify({ method: "orderDesc", values: ["$id"] }),
                ],
              }),
            getDownloadUrl: (deploymentId) =>
              sitesService.getDeploymentDownload({
                siteId: site["$id"],
                deploymentId,
              }),
          });
        }
      }

      return result;
    } finally {
      process.chdir(originalCwd);
    }
  }

  /**
   * Pull collections from the project (deprecated)
   */
  public async pullCollections(): Promise<{
    databases: any[];
    collections: any[];
  }> {
    const databasesService = new Databases(this.projectClient);

    const fetchResponse = await databasesService.list([
      JSON.stringify({ method: "limit", values: [1] }),
    ]);

    if (fetchResponse["databases"].length <= 0) {
      return { databases: [], collections: [] };
    }

    const { databases } = await paginate(
      async () => new Databases(this.projectClient).list(),
      {},
      100,
      "databases",
    );

    const allDatabases: any[] = [];
    const allCollections: any[] = [];

    for (const database of databases) {
      allDatabases.push(database);

      const { collections } = await paginate(
        async () =>
          new Databases(this.projectClient).listCollections(database.$id),
        {},
        100,
        "collections",
      );

      for (const collection of collections) {
        allCollections.push({
          ...collection,
          $createdAt: undefined,
          $updatedAt: undefined,
        });
      }
    }

    return {
      databases: allDatabases,
      collections: allCollections,
    };
  }

  /**
   * Pull tables from the project
   */
  public async pullTables(): Promise<{
    databases: any[];
    tables: any[];
  }> {
    const tablesDBService = new TablesDB(this.projectClient);

    const fetchResponse = await tablesDBService.list({
      queries: [JSON.stringify({ method: "limit", values: [1] })],
    });

    if (fetchResponse["databases"].length <= 0) {
      return { databases: [], tables: [] };
    }

    const { databases } = await paginate(
      async () => new TablesDB(this.projectClient).list(),
      {},
      100,
      "databases",
    );

    const allDatabases: any[] = [];
    const allTables: any[] = [];

    for (const database of databases) {
      allDatabases.push(database);

      const { tables } = await paginate(
        async () => new TablesDB(this.projectClient).listTables(database.$id),
        {},
        100,
        "tables",
      );

      for (const table of tables) {
        allTables.push({
          ...table,
          $createdAt: undefined,
          $updatedAt: undefined,
        });
      }
    }

    return {
      databases: allDatabases,
      tables: allTables,
    };
  }

  /**
   * Pull storage buckets from the project
   */
  public async pullBuckets(): Promise<any[]> {
    const storageService = new Storage(this.projectClient);

    const fetchResponse = await storageService.listBuckets({
      queries: [JSON.stringify({ method: "limit", values: [1] })],
    });

    if (fetchResponse["buckets"].length <= 0) {
      return [];
    }

    const { buckets } = await paginate(
      async () => new Storage(this.projectClient).listBuckets(),
      {},
      100,
      "buckets",
    );

    return buckets;
  }

  /**
   * Pull teams from the project
   */
  public async pullTeams(): Promise<any[]> {
    const teamsService = new Teams(this.projectClient);

    const fetchResponse = await teamsService.list({
      queries: [JSON.stringify({ method: "limit", values: [1] })],
    });

    if (fetchResponse["teams"].length <= 0) {
      return [];
    }

    const { teams } = await paginate(
      async () => new Teams(this.projectClient).list(),
      {},
      100,
      "teams",
    );

    return teams;
  }

  /**
   * Pull messaging topics from the project
   */
  public async pullMessagingTopics(): Promise<any[]> {
    const messagingService = new Messaging(this.projectClient);

    const fetchResponse = await messagingService.listTopics({
      queries: [JSON.stringify({ method: "limit", values: [1] })],
    });

    if (fetchResponse["topics"].length <= 0) {
      return [];
    }

    const { topics } = await paginate(
      async () => new Messaging(this.projectClient).listTopics(),
      {},
      100,
      "topics",
    );

    return topics;
  }
}

/** Helper methods for CLI commands */

export const pullResources = async ({
  skipDeprecated = false,
}: PullResourcesOptions = {}): Promise<void> => {
  const project = localConfig.getProject();
  if (!project.projectId) {
    error(
      "Project configuration not found. Please run 'appwrite init project' to initialize your project first.",
    );
    process.exit(1);
  }

  const actions: Record<string, (options?: any) => Promise<void>> = {
    settings: pullSettings,
    functions: pullFunctions,
    sites: pullSites,
    collections: pullCollection,
    tables: pullTable,
    buckets: pullBucket,
    teams: pullTeam,
    messages: pullMessagingTopic,
  };

  if (skipDeprecated) {
    delete actions.collections;
  }

  if (cliConfig.all) {
    for (let action of Object.values(actions)) {
      cliConfig.all = true;
      await action({ returnOnZero: true });
    }
  } else {
    const answers = await inquirer.prompt([questionsPullResources[0]]);

    const action = actions[answers.resource];
    if (action !== undefined) {
      await action({ returnOnZero: true });
    }
  }
};

const pullSettings = async (): Promise<void> => {
  log("Pulling project settings ...");

  try {
    const pullInstance = await createPullInstance();
    const projectId = localConfig.getProject().projectId;
    const settings = await pullInstance.pullSettings(projectId);

    localConfig.setProject(
      projectId,
      settings.projectName,
      settings.rawSettings,
    );

    success(`Successfully pulled ${chalk.bold("all")} project settings.`);
  } catch (e) {
    throw e;
  }
};

const pullFunctions = async ({
  code,
  withVariables,
}: PullFunctionsOptions = {}): Promise<void> => {
  log("Fetching functions ...");

  const functionsService = await getFunctionsService();
  const fetchResponse = await functionsService.list([
    JSON.stringify({ method: "limit", values: [1] }),
  ]);
  if (fetchResponse["functions"].length <= 0) {
    log("No functions found.");
    success(`Successfully pulled ${chalk.bold(0)} functions.`);
    return;
  }

  const functionsToCheck = cliConfig.all
    ? (
        await paginate(
          async () => (await getFunctionsService()).list(),
          {},
          100,
          "functions",
        )
      ).functions
    : (await inquirer.prompt(questionsPullFunctions)).functions;

  let allowCodePull: boolean | null = cliConfig.force === true ? true : null;
  if (code !== false && allowCodePull === null) {
    const codeAnswer = await inquirer.prompt(questionsPullFunctionsCode);
    allowCodePull = codeAnswer.override;
  }

  const shouldPullCode = code !== false && allowCodePull === true;
  const selectedFunctionIds = functionsToCheck.map((f: any) => f.$id);

  const pullInstance = await createPullInstance();
  const functions = await pullInstance.pullFunctions({
    code: shouldPullCode,
    withVariables,
    functionIds: selectedFunctionIds,
  });

  for (const func of functions) {
    log(`Pulling function ${chalk.bold(func["name"])} ...`);
    const localFunction = localConfig.getFunction(func.$id);
    func["path"] = localFunction["path"] || func["path"];
    localConfig.addFunction(func);
  }

  if (!shouldPullCode) {
    warn("Source code download skipped.");
  }

  success(`Successfully pulled ${chalk.bold(functions.length)} functions.`);
};

const pullSites = async ({
  code,
  withVariables,
}: PullSitesOptions = {}): Promise<void> => {
  log("Fetching sites ...");

  const sitesService = await getSitesService();
  const fetchResponse = await sitesService.list({
    queries: [JSON.stringify({ method: "limit", values: [1] })],
  });
  if (fetchResponse["sites"].length <= 0) {
    log("No sites found.");
    success(`Successfully pulled ${chalk.bold(0)} sites.`);
    return;
  }

  const sitesToCheck = cliConfig.all
    ? (
        await paginate(
          async () => (await getSitesService()).list(),
          {},
          100,
          "sites",
        )
      ).sites
    : (await inquirer.prompt(questionsPullSites)).sites;

  let allowCodePull: boolean | null = cliConfig.force === true ? true : null;
  if (code !== false && allowCodePull === null) {
    const codeAnswer = await inquirer.prompt(questionsPullSitesCode);
    allowCodePull = codeAnswer.override;
  }

  const shouldPullCode = code !== false && allowCodePull === true;
  const selectedSiteIds = sitesToCheck.map((s: any) => s.$id);

  const pullInstance = await createPullInstance();
  const sites = await pullInstance.pullSites({
    code: shouldPullCode,
    withVariables,
    siteIds: selectedSiteIds,
  });

  for (const site of sites) {
    log(`Pulling site ${chalk.bold(site["name"])} ...`);
    const localSite = localConfig.getSite(site.$id);
    site["path"] = localSite["path"] || site["path"];
    localConfig.addSite(site);
  }

  if (!shouldPullCode) {
    warn("Source code download skipped.");
  }

  success(`Successfully pulled ${chalk.bold(sites.length)} sites.`);
};

const pullCollection = async (): Promise<void> => {
  warn(
    "appwrite pull collection has been deprecated. Please consider using 'appwrite pull tables' instead",
  );
  log("Fetching collections ...");

  const databasesService = await getDatabasesService();
  const fetchResponse = await databasesService.list({
    queries: [JSON.stringify({ method: "limit", values: [1] })],
  });
  if (fetchResponse["databases"].length <= 0) {
    log("No collections found.");
    success(
      `Successfully pulled ${chalk.bold(0)} collections from ${chalk.bold(0)} databases.`,
    );
    return;
  }

  const pullInstance = await createPullInstance();
  const { databases, collections } = await pullInstance.pullCollections();

  for (const database of databases) {
    log(
      `Pulling all collections from ${chalk.bold(database["name"])} database ...`,
    );
    localConfig.addDatabase(database);
  }

  for (const collection of collections) {
    localConfig.addCollection(collection);
  }

  success(
    `Successfully pulled ${chalk.bold(collections.length)} collections from ${chalk.bold(databases.length)} databases.`,
  );
};

const pullTable = async (): Promise<void> => {
  log("Fetching tables ...");

  const tablesDBService = await getTablesDBService();
  const fetchResponse = await tablesDBService.list({
    queries: [JSON.stringify({ method: "limit", values: [1] })],
  });
  if (fetchResponse["databases"].length <= 0) {
    log("No tables found.");
    success(
      `Successfully pulled ${chalk.bold(0)} tables from ${chalk.bold(0)} tableDBs.`,
    );
    return;
  }

  const pullInstance = await createPullInstance();
  const { databases, tables } = await pullInstance.pullTables();

  for (const database of databases) {
    log(`Pulling all tables from ${chalk.bold(database["name"])} database ...`);
    localConfig.addTablesDB(database);
  }

  for (const table of tables) {
    localConfig.addTable(table);
  }

  success(
    `Successfully pulled ${chalk.bold(tables.length)} tables from ${chalk.bold(databases.length)} tableDBs.`,
  );
};

const pullBucket = async (): Promise<void> => {
  log("Fetching buckets ...");

  const pullInstance = await createPullInstance();
  const buckets = await pullInstance.pullBuckets();

  if (buckets.length === 0) {
    log("No buckets found.");
    success(`Successfully pulled ${chalk.bold(0)} buckets.`);
    return;
  }

  for (const bucket of buckets) {
    log(`Pulling bucket ${chalk.bold(bucket["name"])} ...`);
    localConfig.addBucket(bucket);
  }

  success(`Successfully pulled ${chalk.bold(buckets.length)} buckets.`);
};

const pullTeam = async (): Promise<void> => {
  log("Fetching teams ...");

  const pullInstance = await createPullInstance();
  const teams = await pullInstance.pullTeams();

  if (teams.length === 0) {
    log("No teams found.");
    success(`Successfully pulled ${chalk.bold(0)} teams.`);
    return;
  }

  for (const team of teams) {
    log(`Pulling team ${chalk.bold(team["name"])} ...`);
    localConfig.addTeam(team);
  }

  success(`Successfully pulled ${chalk.bold(teams.length)} teams.`);
};

const pullMessagingTopic = async (): Promise<void> => {
  log("Fetching topics ...");

  const pullInstance = await createPullInstance();
  const topics = await pullInstance.pullMessagingTopics();

  if (topics.length === 0) {
    log("No topics found.");
    success(`Successfully pulled ${chalk.bold(0)} topics.`);
    return;
  }

  for (const topic of topics) {
    log(`Pulling topic ${chalk.bold(topic["name"])} ...`);
    localConfig.addMessagingTopic(topic);
  }

  success(`Successfully pulled ${chalk.bold(topics.length)} topics.`);
};

/** Commander.js exports */

export const pull = new Command("pull")
  .description(commandDescriptions["pull"])
  .action(actionRunner(() => pullResources({ skipDeprecated: true })));

pull
  .command("all")
  .description("Pull all resources")
  .action(
    actionRunner(() => {
      cliConfig.all = true;
      return pullResources({
        skipDeprecated: true,
      });
    }),
  );

pull
  .command("settings")
  .description("Pull your Appwrite project name, services and auth settings")
  .action(actionRunner(pullSettings));

pull
  .command("function")
  .alias("functions")
  .description("Pull your Appwrite cloud function")
  .option("--no-code", "Don't pull the function's code")
  .option(
    "--with-variables",
    `Pull function variables. ${chalk.red("recommend for testing purposes only")}`,
  )
  .action(actionRunner(pullFunctions));

pull
  .command("site")
  .alias("sites")
  .description("Pull your Appwrite site")
  .option("--no-code", "Don't pull the site's code")
  .option(
    "--with-variables",
    `Pull site variables. ${chalk.red("recommend for testing purposes only")}`,
  )
  .action(actionRunner(pullSites));

pull
  .command("collection")
  .alias("collections")
  .description(
    "Pull your Appwrite collections (deprecated, please use 'pull tables' instead)",
  )
  .action(actionRunner(pullCollection));

pull
  .command("table")
  .alias("tables")
  .description("Pull your Appwrite tables")
  .action(actionRunner(pullTable));

pull
  .command("bucket")
  .alias("buckets")
  .description("Pull your Appwrite buckets")
  .action(actionRunner(pullBucket));

pull
  .command("team")
  .alias("teams")
  .description("Pull your Appwrite teams")
  .action(actionRunner(pullTeam));

pull
  .command("topic")
  .alias("topics")
  .description("Pull your Appwrite messaging topics")
  .action(actionRunner(pullMessagingTopic));
