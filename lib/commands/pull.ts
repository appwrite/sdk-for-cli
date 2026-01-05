import fs from "fs";
import chalk from "chalk";
import tar from "tar";
import { Command } from "commander";
import inquirer from "inquirer";
import {
  getMessagingService,
  getTeamsService,
  getProjectsService,
  getFunctionsService,
  getSitesService,
  getDatabasesService,
  getTablesDBService,
  getStorageService,
} from "../services.js";
import { localConfig } from "../config.js";
import { paginate } from "../paginate.js";
import {
  questionsPullCollection,
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

interface PullResourcesOptions {
  skipDeprecated?: boolean;
}

interface PullFunctionsOptions {
  code?: boolean;
  withVariables?: boolean;
}

interface PullSitesOptions {
  code?: boolean;
  withVariables?: boolean;
}

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
    const projectsService = await getProjectsService();
    let response = await projectsService.get(
      localConfig.getProject().projectId,
    );

    localConfig.setProject(response.$id, response.name, response);

    success(`Successfully pulled ${chalk.bold("all")} project settings.`);
  } catch (e) {
    throw e;
  }
};

const pullFunctions = async ({
  code,
  withVariables,
}: PullFunctionsOptions = {}): Promise<void> => {
  process.chdir(localConfig.configDirectoryPath);

  log("Fetching functions ...");
  let total = 0;

  const functionsService = await getFunctionsService();
  const fetchResponse = await functionsService.list([
    JSON.stringify({ method: "limit", values: [1] }),
  ]);
  if (fetchResponse["functions"].length <= 0) {
    log("No functions found.");
    success(`Successfully pulled ${chalk.bold(total)} functions.`);
    return;
  }

  const functions = cliConfig.all
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

  for (let func of functions) {
    total++;
    log(`Pulling function ${chalk.bold(func["name"])} ...`);

    const localFunction = localConfig.getFunction(func.$id);

    func["path"] = localFunction["path"];
    if (!localFunction["path"]) {
      func["path"] = `functions/${func.name}`;
    }
    const holdingVars = func["vars"];
    // We don't save var in to the config
    delete func["vars"];
    localConfig.addFunction(func);

    if (!fs.existsSync(func["path"])) {
      fs.mkdirSync(func["path"], { recursive: true });
    }

    if (code === false) {
      warn("Source code download skipped.");
      continue;
    }

    if (allowCodePull === null) {
      const codeAnswer = await inquirer.prompt(questionsPullFunctionsCode);
      allowCodePull = codeAnswer.override;
    }

    if (!allowCodePull) {
      continue;
    }

    let deploymentId: string | null = null;

    try {
      const fetchResponse = await functionsService.listDeployments({
        functionId: func["$id"],
        queries: [
          JSON.stringify({ method: "limit", values: [1] }),
          JSON.stringify({ method: "orderDesc", values: ["$id"] }),
        ],
      });

      if (fetchResponse["total"] > 0) {
        deploymentId = fetchResponse["deployments"][0]["$id"];
      }
    } catch {}

    if (deploymentId === null) {
      log(
        "Source code download skipped because function doesn't have any available deployment",
      );
      continue;
    }

    log("Pulling latest deployment code ...");

    const compressedFileName = `${func["$id"]}-${+new Date()}.tar.gz`;
    const downloadUrl = functionsService.getDeploymentDownload({
      functionId: func["$id"],
      deploymentId: deploymentId,
    });

    const client = (await getFunctionsService()).client;
    const downloadBuffer = await client.call(
      "get",
      new URL(downloadUrl),
      {},
      {},
      "arrayBuffer",
    );

    fs.writeFileSync(compressedFileName, Buffer.from(downloadBuffer as any));

    tar.extract({
      sync: true,
      cwd: func["path"],
      file: compressedFileName,
      strict: false,
    });

    fs.rmSync(compressedFileName);

    if (withVariables) {
      const envFileLocation = `${func["path"]}/.env`;
      try {
        fs.rmSync(envFileLocation);
      } catch {}

      fs.writeFileSync(
        envFileLocation,
        holdingVars.map((r: any) => `${r.key}=${r.value}\n`).join(""),
      );
    }
  }

  success(`Successfully pulled ${chalk.bold(total)} functions.`);
};

const pullSites = async ({
  code,
  withVariables,
}: PullSitesOptions = {}): Promise<void> => {
  process.chdir(localConfig.configDirectoryPath);

  log("Fetching sites ...");
  let total = 0;

  const sitesService = await getSitesService();
  const fetchResponse = await sitesService.list([
    JSON.stringify({ method: "limit", values: [1] }),
  ]);
  if (fetchResponse["sites"].length <= 0) {
    log("No sites found.");
    success(`Successfully pulled ${chalk.bold(total)} sites.`);
    return;
  }

  const sites = cliConfig.all
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

  for (let site of sites) {
    total++;
    log(`Pulling site ${chalk.bold(site["name"])} ...`);

    const localSite = localConfig.getSite(site.$id);

    site["path"] = localSite["path"];
    if (!localSite["path"]) {
      site["path"] = `sites/${site.name}`;
    }
    const holdingVars = site["vars"];
    // We don't save var in to the config
    delete site["vars"];
    localConfig.addSite(site);

    if (!fs.existsSync(site["path"])) {
      fs.mkdirSync(site["path"], { recursive: true });
    }

    if (code === false) {
      warn("Source code download skipped.");
      continue;
    }

    if (allowCodePull === null) {
      const codeAnswer = await inquirer.prompt(questionsPullSitesCode);
      allowCodePull = codeAnswer.override;
    }

    if (!allowCodePull) {
      continue;
    }

    let deploymentId: string | null = null;

    try {
      const fetchResponse = await sitesService.listDeployments(site["$id"], [
        JSON.stringify({ method: "limit", values: [1] }),
        JSON.stringify({ method: "orderDesc", values: ["$id"] }),
      ]);

      if (fetchResponse["total"] > 0) {
        deploymentId = fetchResponse["deployments"][0]["$id"];
      }
    } catch {}

    if (deploymentId === null) {
      log(
        "Source code download skipped because site doesn't have any available deployment",
      );
      continue;
    }

    log("Pulling latest deployment code ...");

    const compressedFileName = `${site["$id"]}-${+new Date()}.tar.gz`;
    const downloadUrl = sitesService.getDeploymentDownload(
      site["$id"],
      deploymentId,
    );

    const client = (await getSitesService()).client;
    const downloadBuffer = await client.call(
      "get",
      new URL(downloadUrl),
      {},
      {},
      "arrayBuffer",
    );

    fs.writeFileSync(compressedFileName, Buffer.from(downloadBuffer as any));

    tar.extract({
      sync: true,
      cwd: site["path"],
      file: compressedFileName,
      strict: false,
    });

    fs.rmSync(compressedFileName);

    if (withVariables) {
      const envFileLocation = `${site["path"]}/.env`;
      try {
        fs.rmSync(envFileLocation);
      } catch {}

      fs.writeFileSync(
        envFileLocation,
        holdingVars.map((r: any) => `${r.key}=${r.value}\n`).join(""),
      );
    }
  }

  success(`Successfully pulled ${chalk.bold(total)} sites.`);
};

const pullCollection = async (): Promise<void> => {
  warn(
    "appwrite pull collection has been deprecated. Please consider using 'appwrite pull tables' instead",
  );
  log("Fetching collections ...");
  let totalDatabases = 0;
  let totalCollections = 0;

  const databasesService = await getDatabasesService();
  const fetchResponse = await databasesService.list([
    JSON.stringify({ method: "limit", values: [1] }),
  ]);
  if (fetchResponse["databases"].length <= 0) {
    log("No collections found.");
    success(
      `Successfully pulled ${chalk.bold(totalCollections)} collections from ${chalk.bold(totalDatabases)} databases.`,
    );
    return;
  }

  let databases: string[] = cliConfig.ids;

  if (databases.length === 0) {
    if (cliConfig.all) {
      databases = (
        await paginate(
          async () => (await getDatabasesService()).list(),
          {},
          100,
          "databases",
        )
      ).databases.map((database: any) => database.$id);
    } else {
      databases = (await inquirer.prompt(questionsPullCollection)).databases;
    }
  }

  for (const databaseId of databases) {
    const database = await databasesService.get(databaseId);

    totalDatabases++;
    log(
      `Pulling all collections from ${chalk.bold(database["name"])} database ...`,
    );

    localConfig.addDatabase(database);

    const { collections } = await paginate(
      async () => (await getDatabasesService()).listCollections(databaseId),
      {},
      100,
      "collections",
    );

    for (const collection of collections) {
      totalCollections++;
      localConfig.addCollection({
        ...collection,
        $createdAt: undefined,
        $updatedAt: undefined,
      });
    }
  }

  success(
    `Successfully pulled ${chalk.bold(totalCollections)} collections from ${chalk.bold(totalDatabases)} databases.`,
  );
};

const pullTable = async (): Promise<void> => {
  log("Fetching tables ...");
  let totalTablesDBs = 0;
  let totalTables = 0;

  const tablesDBService = await getTablesDBService();
  const fetchResponse = await tablesDBService.list([
    JSON.stringify({ method: "limit", values: [1] }),
  ]);
  if (fetchResponse["databases"].length <= 0) {
    log("No tables found.");
    success(
      `Successfully pulled ${chalk.bold(totalTables)} tables from ${chalk.bold(totalTablesDBs)} tableDBs.`,
    );
    return;
  }

  let databases: string[] = cliConfig.ids;

  if (databases.length === 0) {
    if (cliConfig.all) {
      databases = (
        await paginate(
          async () => (await getTablesDBService()).list(),
          {},
          100,
          "databases",
        )
      ).databases.map((database: any) => database.$id);
    } else {
      databases = (await inquirer.prompt(questionsPullCollection)).databases;
    }
  }

  for (const databaseId of databases) {
    const database = await tablesDBService.get(databaseId);

    totalTablesDBs++;
    log(`Pulling all tables from ${chalk.bold(database["name"])} database ...`);

    localConfig.addTablesDB(database);

    const { tables } = await paginate(
      async () => (await getTablesDBService()).listTables(databaseId),
      {},
      100,
      "tables",
    );

    for (const table of tables) {
      totalTables++;
      localConfig.addTable({
        ...table,
        $createdAt: undefined,
        $updatedAt: undefined,
      });
    }
  }

  success(
    `Successfully pulled ${chalk.bold(totalTables)} tables from ${chalk.bold(totalTablesDBs)} tableDBs.`,
  );
};

const pullBucket = async (): Promise<void> => {
  log("Fetching buckets ...");
  let total = 0;

  const storageService = await getStorageService();
  const fetchResponse = await storageService.listBuckets([
    JSON.stringify({ method: "limit", values: [1] }),
  ]);
  if (fetchResponse["buckets"].length <= 0) {
    log("No buckets found.");
    success(`Successfully pulled ${chalk.bold(total)} buckets.`);
    return;
  }

  const { buckets } = await paginate(
    async () => (await getStorageService()).listBuckets(),
    {},
    100,
    "buckets",
  );

  for (const bucket of buckets) {
    total++;
    log(`Pulling bucket ${chalk.bold(bucket["name"])} ...`);
    localConfig.addBucket(bucket);
  }

  success(`Successfully pulled ${chalk.bold(total)} buckets.`);
};

const pullTeam = async (): Promise<void> => {
  log("Fetching teams ...");
  let total = 0;

  const teamsService = await getTeamsService();
  const fetchResponse = await teamsService.list([
    JSON.stringify({ method: "limit", values: [1] }),
  ]);
  if (fetchResponse["teams"].length <= 0) {
    log("No teams found.");
    success(`Successfully pulled ${chalk.bold(total)} teams.`);
    return;
  }

  const { teams } = await paginate(
    async () => (await getTeamsService()).list(),
    {},
    100,
    "teams",
  );

  for (const team of teams) {
    total++;
    log(`Pulling team ${chalk.bold(team["name"])} ...`);
    localConfig.addTeam(team);
  }

  success(`Successfully pulled ${chalk.bold(total)} teams.`);
};

const pullMessagingTopic = async (): Promise<void> => {
  log("Fetching topics ...");
  let total = 0;

  const messagingService = await getMessagingService();
  const fetchResponse = await messagingService.listTopics([
    JSON.stringify({ method: "limit", values: [1] }),
  ]);
  if (fetchResponse["topics"].length <= 0) {
    log("No topics found.");
    success(`Successfully pulled ${chalk.bold(total)} topics.`);
    return;
  }

  const { topics } = await paginate(
    async () => (await getMessagingService()).listTopics(),
    {},
    100,
    "topics",
  );

  for (const topic of topics) {
    total++;
    log(`Pulling topic ${chalk.bold(topic["name"])} ...`);
    localConfig.addMessagingTopic(topic);
  }

  success(`Successfully pulled ${chalk.bold(total)} topics.`);
};

export const pull = new Command("pull")
  .description(commandDescriptions["pull"])
  .action(actionRunner(() => pullResources({ skipDeprecated: true })));

pull
  .command("all")
  .description("Pull all resource.")
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
