const fs = require("fs");
const tar = require("tar");
const { Command } = require("commander");
const inquirer = require("inquirer");
const { messagingListTopics } = require("./messaging");
const { teamsList } = require("./teams");
const { projectsGet } = require("./projects");
const { functionsList, functionsDownloadDeployment } = require("./functions");
const { databasesGet, databasesListCollections, databasesList } = require("./databases");
const { storageListBuckets } = require("./storage");
const { localConfig } = require("../config");
const { paginate } = require("../paginate");
const { questionsPullCollection, questionsPullFunctions, questionsPullResources } = require("../questions");
const { cliConfig, success, log, actionRunner, commandDescriptions } = require("../parser");

const pullResources = async () => {
    const actions = {
        project: pullProject,
        functions: pullFunctions,
        collections: pullCollection,
        buckets: pullBucket,
        teams: pullTeam,
        messages: pullMessagingTopic
    }

    if (cliConfig.all) {
        for (let action of Object.values(actions)) {
            await action();
        }
    } else {
        const answers = await inquirer.prompt(questionsPullResources[0]);

        const action = actions[answers.resource];
        if (action !== undefined) {
            await action({ returnOnZero: true });
        }
    }
};

const pullProject = async () => {
    try {
        let response = await projectsGet({
            parseOutput: false,
            projectId: localConfig.getProject().projectId

        })

        localConfig.setProject(response.$id, response.name, response);

        success();
    } catch (e) {
        throw e;
    }
}

const pullFunctions = async () => {
    const localFunctions = localConfig.getFunctions();

    const functions = cliConfig.all
        ? (await paginate(functionsList, { parseOutput: false }, 100, 'functions')).functions
        : (await inquirer.prompt(questionsPullFunctions)).functions;

    log(`Pulling ${functions.length} functions`);

    for (let func of functions) {
        const functionExistLocally = localFunctions.find((localFunc) => localFunc['$id'] === func['$id']) !== undefined;

        if (functionExistLocally) {
            localConfig.updateFunction(func['$id'], func);
        } else {
            func['path'] = `functions/${func['$id']}`;
            localConfig.addFunction(func);
            localFunctions.push(func);
        }

        const localFunction = localFunctions.find((localFunc) => localFunc['$id'] === func['$id']);

        if (localFunction['deployment'] === '') {
            continue
        }

        const compressedFileName = `${func['$id']}-${+new Date()}.tar.gz`

        await functionsDownloadDeployment({
            functionId: func['$id'],
            deploymentId: func['deployment'],
            destination: compressedFileName,
            overrideForCli: true,
            parseOutput: false
        })

        if (!fs.existsSync(localFunction['path'])) {
            fs.mkdirSync(localFunction['path'], { recursive: true });
        }

        tar.extract({
            sync: true,
            cwd: localFunction['path'],
            file: compressedFileName,
            strict: false,
        });

        fs.rmSync(compressedFileName);
        success(`Pulled ${func['name']} code and settings`)
    }
}

const pullCollection = async () => {
    let databases = cliConfig.ids;

    if (databases.length === 0) {
        if (cliConfig.all) {
            databases = (await paginate(databasesList, { parseOutput: false }, 100, 'databases')).databases.map(database => database.$id);
        } else {
            databases = (await inquirer.prompt(questionsPullCollection)).databases;
        }
    }

    for (const databaseId of databases) {
        const database = await databasesGet({
            databaseId,
            parseOutput: false
        });

        localConfig.addDatabase(database);

        const { collections, total } = await paginate(databasesListCollections, {
            databaseId,
            parseOutput: false
        }, 100, 'collections');

        log(`Found ${total} collections`);

        collections.map(async collection => {
            log(`Fetching ${collection.name} ...`);
            localConfig.addCollection({
                ...collection,
                '$createdAt': undefined,
                '$updatedAt': undefined
            });
        });
    }

    success();
}

const pullBucket = async () => {
    const { buckets } = await paginate(storageListBuckets, { parseOutput: false }, 100, 'buckets');

    log(`Found ${buckets.length} buckets`);

    buckets.forEach(bucket => localConfig.addBucket(bucket));

    success();
}

const pullTeam = async () => {
    const { teams } = await paginate(teamsList, { parseOutput: false }, 100, 'teams');

    log(`Found ${teams.length} teams`);

    teams.forEach(team => {
        const { total, $updatedAt, $createdAt, prefs, ...rest } = team;
        localConfig.addTeam(rest);
    });

    success();
}

const pullMessagingTopic = async () => {
    const { topics } = await paginate(messagingListTopics, { parseOutput: false }, 100, 'topics');

    log(`Found ${topics.length} topics`);

    topics.forEach(topic => {
        localConfig.addMessagingTopic(topic);
    });

    success();
}

const pull = new Command("pull")
    .description(commandDescriptions['pull'])
    .action(actionRunner(pullResources));

pull
    .command("all")
    .description("Pull all resource.")
    .action(actionRunner(() => {
        cliConfig.all = true;
        return pullResources();
    }));

pull
    .command("project")
    .description("Pull your Appwrite project name, services and auth settings")
    .action(actionRunner(pullProject));

pull
    .command("function")
    .alias("functions")
    .description("Pulling your Appwrite cloud function")
    .action(actionRunner(pullFunctions))

pull
    .command("collection")
    .alias("collections")
    .description("Pulling your Appwrite collections")
    .action(actionRunner(pullCollection))

pull
    .command("bucket")
    .alias("buckets")
    .description("Pulling your Appwrite buckets")
    .action(actionRunner(pullBucket))

pull
    .command("team")
    .alias("teams")
    .description("Pulling your Appwrite teams")
    .action(actionRunner(pullTeam))

pull
    .command("topic")
    .alias("topics")
    .description("Initialise your Appwrite messaging topics")
    .action(actionRunner(pullMessagingTopic))

module.exports = {
    pull,
};
