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

const migrations = new Command("migrations").description(commandDescriptions['migrations']).configureHelp({
    helpWidth: process.stdout.columns || 80
  })

const migrationsList = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/migrations';
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

const migrationsCreateAppwriteMigration = async ({ resources, endpoint, projectId, apiKey, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} resources */
    /* @param {string} endpoint */
    /* @param {string} projectId */
    /* @param {string} apiKey */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/migrations/appwrite';
    let payload = {};
    
    /** Body Params */
    resources = resources === true ? [] : resources;

    if (typeof resources !== 'undefined') {
        payload['resources'] = resources;
    }


    if (typeof endpoint !== 'undefined') {
        payload['endpoint'] = endpoint;
    }


    if (typeof projectId !== 'undefined') {
        payload['projectId'] = projectId;
    }


    if (typeof apiKey !== 'undefined') {
        payload['apiKey'] = apiKey;
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

const migrationsGetAppwriteReport = async ({ resources, endpoint, projectID, key, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} resources */
    /* @param {string} endpoint */
    /* @param {string} projectID */
    /* @param {string} key */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/migrations/appwrite/report';
    let payload = {};

    /** Query Params */
    if (typeof resources !== 'undefined') {
        payload['resources'] = resources;
    }
    if (typeof endpoint !== 'undefined') {
        payload['endpoint'] = endpoint;
    }
    if (typeof projectID !== 'undefined') {
        payload['projectID'] = projectID;
    }
    if (typeof key !== 'undefined') {
        payload['key'] = key;
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

const migrationsCreateFirebaseMigration = async ({ resources, serviceAccount, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} resources */
    /* @param {string} serviceAccount */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/migrations/firebase';
    let payload = {};
    
    /** Body Params */
    resources = resources === true ? [] : resources;

    if (typeof resources !== 'undefined') {
        payload['resources'] = resources;
    }


    if (typeof serviceAccount !== 'undefined') {
        payload['serviceAccount'] = serviceAccount;
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

const migrationsDeleteFirebaseAuth = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/migrations/firebase/deauthorize';
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

const migrationsCreateFirebaseOAuthMigration = async ({ resources, projectId, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} resources */
    /* @param {string} projectId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/migrations/firebase/oauth';
    let payload = {};
    
    /** Body Params */
    resources = resources === true ? [] : resources;

    if (typeof resources !== 'undefined') {
        payload['resources'] = resources;
    }


    if (typeof projectId !== 'undefined') {
        payload['projectId'] = projectId;
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

const migrationsListFirebaseProjects = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/migrations/firebase/projects';
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

const migrationsGetFirebaseReport = async ({ resources, serviceAccount, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} resources */
    /* @param {string} serviceAccount */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/migrations/firebase/report';
    let payload = {};

    /** Query Params */
    if (typeof resources !== 'undefined') {
        payload['resources'] = resources;
    }
    if (typeof serviceAccount !== 'undefined') {
        payload['serviceAccount'] = serviceAccount;
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

const migrationsGetFirebaseReportOAuth = async ({ resources, projectId, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} resources */
    /* @param {string} projectId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/migrations/firebase/report/oauth';
    let payload = {};

    /** Query Params */
    if (typeof resources !== 'undefined') {
        payload['resources'] = resources;
    }
    if (typeof projectId !== 'undefined') {
        payload['projectId'] = projectId;
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

const migrationsCreateNHostMigration = async ({ resources, subdomain, region, adminSecret, database, username, password, port, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} resources */
    /* @param {string} subdomain */
    /* @param {string} region */
    /* @param {string} adminSecret */
    /* @param {string} database */
    /* @param {string} username */
    /* @param {string} password */
    /* @param {number} port */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/migrations/nhost';
    let payload = {};
    
    /** Body Params */
    resources = resources === true ? [] : resources;

    if (typeof resources !== 'undefined') {
        payload['resources'] = resources;
    }


    if (typeof subdomain !== 'undefined') {
        payload['subdomain'] = subdomain;
    }


    if (typeof region !== 'undefined') {
        payload['region'] = region;
    }


    if (typeof adminSecret !== 'undefined') {
        payload['adminSecret'] = adminSecret;
    }


    if (typeof database !== 'undefined') {
        payload['database'] = database;
    }


    if (typeof username !== 'undefined') {
        payload['username'] = username;
    }


    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }


    if (typeof port !== 'undefined') {
        payload['port'] = port;
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

const migrationsGetNHostReport = async ({ resources, subdomain, region, adminSecret, database, username, password, port, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} resources */
    /* @param {string} subdomain */
    /* @param {string} region */
    /* @param {string} adminSecret */
    /* @param {string} database */
    /* @param {string} username */
    /* @param {string} password */
    /* @param {number} port */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/migrations/nhost/report';
    let payload = {};

    /** Query Params */
    if (typeof resources !== 'undefined') {
        payload['resources'] = resources;
    }
    if (typeof subdomain !== 'undefined') {
        payload['subdomain'] = subdomain;
    }
    if (typeof region !== 'undefined') {
        payload['region'] = region;
    }
    if (typeof adminSecret !== 'undefined') {
        payload['adminSecret'] = adminSecret;
    }
    if (typeof database !== 'undefined') {
        payload['database'] = database;
    }
    if (typeof username !== 'undefined') {
        payload['username'] = username;
    }
    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }
    if (typeof port !== 'undefined') {
        payload['port'] = port;
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

const migrationsCreateSupabaseMigration = async ({ resources, endpoint, apiKey, databaseHost, username, password, port, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} resources */
    /* @param {string} endpoint */
    /* @param {string} apiKey */
    /* @param {string} databaseHost */
    /* @param {string} username */
    /* @param {string} password */
    /* @param {number} port */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/migrations/supabase';
    let payload = {};
    
    /** Body Params */
    resources = resources === true ? [] : resources;

    if (typeof resources !== 'undefined') {
        payload['resources'] = resources;
    }


    if (typeof endpoint !== 'undefined') {
        payload['endpoint'] = endpoint;
    }


    if (typeof apiKey !== 'undefined') {
        payload['apiKey'] = apiKey;
    }


    if (typeof databaseHost !== 'undefined') {
        payload['databaseHost'] = databaseHost;
    }


    if (typeof username !== 'undefined') {
        payload['username'] = username;
    }


    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }


    if (typeof port !== 'undefined') {
        payload['port'] = port;
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

const migrationsGetSupabaseReport = async ({ resources, endpoint, apiKey, databaseHost, username, password, port, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} resources */
    /* @param {string} endpoint */
    /* @param {string} apiKey */
    /* @param {string} databaseHost */
    /* @param {string} username */
    /* @param {string} password */
    /* @param {number} port */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/migrations/supabase/report';
    let payload = {};

    /** Query Params */
    if (typeof resources !== 'undefined') {
        payload['resources'] = resources;
    }
    if (typeof endpoint !== 'undefined') {
        payload['endpoint'] = endpoint;
    }
    if (typeof apiKey !== 'undefined') {
        payload['apiKey'] = apiKey;
    }
    if (typeof databaseHost !== 'undefined') {
        payload['databaseHost'] = databaseHost;
    }
    if (typeof username !== 'undefined') {
        payload['username'] = username;
    }
    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }
    if (typeof port !== 'undefined') {
        payload['port'] = port;
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

const migrationsGet = async ({ migrationId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} migrationId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/migrations/{migrationId}'.replace('{migrationId}', migrationId);
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

const migrationsRetry = async ({ migrationId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} migrationId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/migrations/{migrationId}'.replace('{migrationId}', migrationId);
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

const migrationsDelete = async ({ migrationId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} migrationId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/migrations/{migrationId}'.replace('{migrationId}', migrationId);
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


migrations
    .command(`list`)
    .description(``)
    .option(`--queries <queries>`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: status, stage, source, resources, statusCounters, resourceData, errors`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(migrationsList))

migrations
    .command(`createAppwriteMigration`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--endpoint <endpoint>`, `Source's Appwrite Endpoint`)
    .requiredOption(`--projectId <projectId>`, `Source's Project ID`)
    .requiredOption(`--apiKey <apiKey>`, `Source's API Key`)
    .action(actionRunner(migrationsCreateAppwriteMigration))

migrations
    .command(`getAppwriteReport`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--endpoint <endpoint>`, `Source's Appwrite Endpoint`)
    .requiredOption(`--projectID <projectID>`, `Source's Project ID`)
    .requiredOption(`--key <key>`, `Source's API Key`)
    .action(actionRunner(migrationsGetAppwriteReport))

migrations
    .command(`createFirebaseMigration`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--serviceAccount <serviceAccount>`, `JSON of the Firebase service account credentials`)
    .action(actionRunner(migrationsCreateFirebaseMigration))

migrations
    .command(`deleteFirebaseAuth`)
    .description(``)
    .action(actionRunner(migrationsDeleteFirebaseAuth))

migrations
    .command(`createFirebaseOAuthMigration`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--projectId <projectId>`, `Project ID of the Firebase Project`)
    .action(actionRunner(migrationsCreateFirebaseOAuthMigration))

migrations
    .command(`listFirebaseProjects`)
    .description(``)
    .action(actionRunner(migrationsListFirebaseProjects))

migrations
    .command(`getFirebaseReport`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--serviceAccount <serviceAccount>`, `JSON of the Firebase service account credentials`)
    .action(actionRunner(migrationsGetFirebaseReport))

migrations
    .command(`getFirebaseReportOAuth`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--projectId <projectId>`, `Project ID`)
    .action(actionRunner(migrationsGetFirebaseReportOAuth))

migrations
    .command(`createNHostMigration`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--subdomain <subdomain>`, `Source's Subdomain`)
    .requiredOption(`--region <region>`, `Source's Region`)
    .requiredOption(`--adminSecret <adminSecret>`, `Source's Admin Secret`)
    .requiredOption(`--database <database>`, `Source's Database Name`)
    .requiredOption(`--username <username>`, `Source's Database Username`)
    .requiredOption(`--password <password>`, `Source's Database Password`)
    .option(`--port <port>`, `Source's Database Port`, parseInteger)
    .action(actionRunner(migrationsCreateNHostMigration))

migrations
    .command(`getNHostReport`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate.`)
    .requiredOption(`--subdomain <subdomain>`, `Source's Subdomain.`)
    .requiredOption(`--region <region>`, `Source's Region.`)
    .requiredOption(`--adminSecret <adminSecret>`, `Source's Admin Secret.`)
    .requiredOption(`--database <database>`, `Source's Database Name.`)
    .requiredOption(`--username <username>`, `Source's Database Username.`)
    .requiredOption(`--password <password>`, `Source's Database Password.`)
    .option(`--port <port>`, `Source's Database Port.`, parseInteger)
    .action(actionRunner(migrationsGetNHostReport))

migrations
    .command(`createSupabaseMigration`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--endpoint <endpoint>`, `Source's Supabase Endpoint`)
    .requiredOption(`--apiKey <apiKey>`, `Source's API Key`)
    .requiredOption(`--databaseHost <databaseHost>`, `Source's Database Host`)
    .requiredOption(`--username <username>`, `Source's Database Username`)
    .requiredOption(`--password <password>`, `Source's Database Password`)
    .option(`--port <port>`, `Source's Database Port`, parseInteger)
    .action(actionRunner(migrationsCreateSupabaseMigration))

migrations
    .command(`getSupabaseReport`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--endpoint <endpoint>`, `Source's Supabase Endpoint.`)
    .requiredOption(`--apiKey <apiKey>`, `Source's API Key.`)
    .requiredOption(`--databaseHost <databaseHost>`, `Source's Database Host.`)
    .requiredOption(`--username <username>`, `Source's Database Username.`)
    .requiredOption(`--password <password>`, `Source's Database Password.`)
    .option(`--port <port>`, `Source's Database Port.`, parseInteger)
    .action(actionRunner(migrationsGetSupabaseReport))

migrations
    .command(`get`)
    .description(``)
    .requiredOption(`--migrationId <migrationId>`, `Migration unique ID.`)
    .action(actionRunner(migrationsGet))

migrations
    .command(`retry`)
    .description(``)
    .requiredOption(`--migrationId <migrationId>`, `Migration unique ID.`)
    .action(actionRunner(migrationsRetry))

migrations
    .command(`delete`)
    .description(``)
    .requiredOption(`--migrationId <migrationId>`, `Migration ID.`)
    .action(actionRunner(migrationsDelete))


module.exports = {
    migrations,
    migrationsList,
    migrationsCreateAppwriteMigration,
    migrationsGetAppwriteReport,
    migrationsCreateFirebaseMigration,
    migrationsDeleteFirebaseAuth,
    migrationsCreateFirebaseOAuthMigration,
    migrationsListFirebaseProjects,
    migrationsGetFirebaseReport,
    migrationsGetFirebaseReportOAuth,
    migrationsCreateNHostMigration,
    migrationsGetNHostReport,
    migrationsCreateSupabaseMigration,
    migrationsGetSupabaseReport,
    migrationsGet,
    migrationsRetry,
    migrationsDelete
};
