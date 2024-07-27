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

const migrations = new Command("migrations").description(commandDescriptions['migrations']).configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} MigrationsListRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: status, stage, source, resources, statusCounters, resourceData, errors
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MigrationsListRequestParams} params
 */
const migrationsList = async ({queries,search,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/migrations';
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
 * @typedef {Object} MigrationsCreateAppwriteMigrationRequestParams
 * @property {string[]} resources List of resources to migrate
 * @property {string} endpoint Source&#039;s Appwrite Endpoint
 * @property {string} projectId Source&#039;s Project ID
 * @property {string} apiKey Source&#039;s API Key
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MigrationsCreateAppwriteMigrationRequestParams} params
 */
const migrationsCreateAppwriteMigration = async ({resources,endpoint,projectId,apiKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/migrations/appwrite';
    let payload = {};
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

/**
 * @typedef {Object} MigrationsGetAppwriteReportRequestParams
 * @property {string[]} resources List of resources to migrate
 * @property {string} endpoint Source&#039;s Appwrite Endpoint
 * @property {string} projectID Source&#039;s Project ID
 * @property {string} key Source&#039;s API Key
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MigrationsGetAppwriteReportRequestParams} params
 */
const migrationsGetAppwriteReport = async ({resources,endpoint,projectID,key,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/migrations/appwrite/report';
    let payload = {};
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

/**
 * @typedef {Object} MigrationsCreateFirebaseMigrationRequestParams
 * @property {string[]} resources List of resources to migrate
 * @property {string} serviceAccount JSON of the Firebase service account credentials
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MigrationsCreateFirebaseMigrationRequestParams} params
 */
const migrationsCreateFirebaseMigration = async ({resources,serviceAccount,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/migrations/firebase';
    let payload = {};
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

/**
 * @typedef {Object} MigrationsDeleteFirebaseAuthRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MigrationsDeleteFirebaseAuthRequestParams} params
 */
const migrationsDeleteFirebaseAuth = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
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

/**
 * @typedef {Object} MigrationsCreateFirebaseOAuthMigrationRequestParams
 * @property {string[]} resources List of resources to migrate
 * @property {string} projectId Project ID of the Firebase Project
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MigrationsCreateFirebaseOAuthMigrationRequestParams} params
 */
const migrationsCreateFirebaseOAuthMigration = async ({resources,projectId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/migrations/firebase/oauth';
    let payload = {};
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

/**
 * @typedef {Object} MigrationsListFirebaseProjectsRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MigrationsListFirebaseProjectsRequestParams} params
 */
const migrationsListFirebaseProjects = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
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

/**
 * @typedef {Object} MigrationsGetFirebaseReportRequestParams
 * @property {string[]} resources List of resources to migrate
 * @property {string} serviceAccount JSON of the Firebase service account credentials
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MigrationsGetFirebaseReportRequestParams} params
 */
const migrationsGetFirebaseReport = async ({resources,serviceAccount,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/migrations/firebase/report';
    let payload = {};
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

/**
 * @typedef {Object} MigrationsGetFirebaseReportOAuthRequestParams
 * @property {string[]} resources List of resources to migrate
 * @property {string} projectId Project ID
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MigrationsGetFirebaseReportOAuthRequestParams} params
 */
const migrationsGetFirebaseReportOAuth = async ({resources,projectId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/migrations/firebase/report/oauth';
    let payload = {};
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

/**
 * @typedef {Object} MigrationsCreateNHostMigrationRequestParams
 * @property {string[]} resources List of resources to migrate
 * @property {string} subdomain Source&#039;s Subdomain
 * @property {string} region Source&#039;s Region
 * @property {string} adminSecret Source&#039;s Admin Secret
 * @property {string} database Source&#039;s Database Name
 * @property {string} username Source&#039;s Database Username
 * @property {string} password Source&#039;s Database Password
 * @property {number} port Source&#039;s Database Port
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MigrationsCreateNHostMigrationRequestParams} params
 */
const migrationsCreateNHostMigration = async ({resources,subdomain,region,adminSecret,database,username,password,port,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/migrations/nhost';
    let payload = {};
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

/**
 * @typedef {Object} MigrationsGetNHostReportRequestParams
 * @property {string[]} resources List of resources to migrate.
 * @property {string} subdomain Source&#039;s Subdomain.
 * @property {string} region Source&#039;s Region.
 * @property {string} adminSecret Source&#039;s Admin Secret.
 * @property {string} database Source&#039;s Database Name.
 * @property {string} username Source&#039;s Database Username.
 * @property {string} password Source&#039;s Database Password.
 * @property {number} port Source&#039;s Database Port.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MigrationsGetNHostReportRequestParams} params
 */
const migrationsGetNHostReport = async ({resources,subdomain,region,adminSecret,database,username,password,port,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/migrations/nhost/report';
    let payload = {};
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

/**
 * @typedef {Object} MigrationsCreateSupabaseMigrationRequestParams
 * @property {string[]} resources List of resources to migrate
 * @property {string} endpoint Source&#039;s Supabase Endpoint
 * @property {string} apiKey Source&#039;s API Key
 * @property {string} databaseHost Source&#039;s Database Host
 * @property {string} username Source&#039;s Database Username
 * @property {string} password Source&#039;s Database Password
 * @property {number} port Source&#039;s Database Port
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MigrationsCreateSupabaseMigrationRequestParams} params
 */
const migrationsCreateSupabaseMigration = async ({resources,endpoint,apiKey,databaseHost,username,password,port,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/migrations/supabase';
    let payload = {};
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

/**
 * @typedef {Object} MigrationsGetSupabaseReportRequestParams
 * @property {string[]} resources List of resources to migrate
 * @property {string} endpoint Source&#039;s Supabase Endpoint.
 * @property {string} apiKey Source&#039;s API Key.
 * @property {string} databaseHost Source&#039;s Database Host.
 * @property {string} username Source&#039;s Database Username.
 * @property {string} password Source&#039;s Database Password.
 * @property {number} port Source&#039;s Database Port.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MigrationsGetSupabaseReportRequestParams} params
 */
const migrationsGetSupabaseReport = async ({resources,endpoint,apiKey,databaseHost,username,password,port,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/migrations/supabase/report';
    let payload = {};
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

/**
 * @typedef {Object} MigrationsGetRequestParams
 * @property {string} migrationId Migration unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MigrationsGetRequestParams} params
 */
const migrationsGet = async ({migrationId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
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

/**
 * @typedef {Object} MigrationsRetryRequestParams
 * @property {string} migrationId Migration unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MigrationsRetryRequestParams} params
 */
const migrationsRetry = async ({migrationId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
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

/**
 * @typedef {Object} MigrationsDeleteRequestParams
 * @property {string} migrationId Migration ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MigrationsDeleteRequestParams} params
 */
const migrationsDelete = async ({migrationId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
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
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: status, stage, source, resources, statusCounters, resourceData, errors`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(migrationsList))

migrations
    .command(`create-appwrite-migration`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--endpoint <endpoint>`, `Source's Appwrite Endpoint`)
    .requiredOption(`--project-id <project-id>`, `Source's Project ID`)
    .requiredOption(`--api-key <api-key>`, `Source's API Key`)
    .action(actionRunner(migrationsCreateAppwriteMigration))

migrations
    .command(`get-appwrite-report`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--endpoint <endpoint>`, `Source's Appwrite Endpoint`)
    .requiredOption(`--project-id <project-id>`, `Source's Project ID`)
    .requiredOption(`--key <key>`, `Source's API Key`)
    .action(actionRunner(migrationsGetAppwriteReport))

migrations
    .command(`create-firebase-migration`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--service-account <service-account>`, `JSON of the Firebase service account credentials`)
    .action(actionRunner(migrationsCreateFirebaseMigration))

migrations
    .command(`delete-firebase-auth`)
    .description(``)
    .action(actionRunner(migrationsDeleteFirebaseAuth))

migrations
    .command(`create-firebase-o-auth-migration`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--project-id <project-id>`, `Project ID of the Firebase Project`)
    .action(actionRunner(migrationsCreateFirebaseOAuthMigration))

migrations
    .command(`list-firebase-projects`)
    .description(``)
    .action(actionRunner(migrationsListFirebaseProjects))

migrations
    .command(`get-firebase-report`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--service-account <service-account>`, `JSON of the Firebase service account credentials`)
    .action(actionRunner(migrationsGetFirebaseReport))

migrations
    .command(`get-firebase-report-o-auth`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--project-id <project-id>`, `Project ID`)
    .action(actionRunner(migrationsGetFirebaseReportOAuth))

migrations
    .command(`create-n-host-migration`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--subdomain <subdomain>`, `Source's Subdomain`)
    .requiredOption(`--region <region>`, `Source's Region`)
    .requiredOption(`--admin-secret <admin-secret>`, `Source's Admin Secret`)
    .requiredOption(`--database <database>`, `Source's Database Name`)
    .requiredOption(`--username <username>`, `Source's Database Username`)
    .requiredOption(`--password <password>`, `Source's Database Password`)
    .option(`--port <port>`, `Source's Database Port`, parseInteger)
    .action(actionRunner(migrationsCreateNHostMigration))

migrations
    .command(`get-n-host-report`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate.`)
    .requiredOption(`--subdomain <subdomain>`, `Source's Subdomain.`)
    .requiredOption(`--region <region>`, `Source's Region.`)
    .requiredOption(`--admin-secret <admin-secret>`, `Source's Admin Secret.`)
    .requiredOption(`--database <database>`, `Source's Database Name.`)
    .requiredOption(`--username <username>`, `Source's Database Username.`)
    .requiredOption(`--password <password>`, `Source's Database Password.`)
    .option(`--port <port>`, `Source's Database Port.`, parseInteger)
    .action(actionRunner(migrationsGetNHostReport))

migrations
    .command(`create-supabase-migration`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--endpoint <endpoint>`, `Source's Supabase Endpoint`)
    .requiredOption(`--api-key <api-key>`, `Source's API Key`)
    .requiredOption(`--database-host <database-host>`, `Source's Database Host`)
    .requiredOption(`--username <username>`, `Source's Database Username`)
    .requiredOption(`--password <password>`, `Source's Database Password`)
    .option(`--port <port>`, `Source's Database Port`, parseInteger)
    .action(actionRunner(migrationsCreateSupabaseMigration))

migrations
    .command(`get-supabase-report`)
    .description(``)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--endpoint <endpoint>`, `Source's Supabase Endpoint.`)
    .requiredOption(`--api-key <api-key>`, `Source's API Key.`)
    .requiredOption(`--database-host <database-host>`, `Source's Database Host.`)
    .requiredOption(`--username <username>`, `Source's Database Username.`)
    .requiredOption(`--password <password>`, `Source's Database Password.`)
    .option(`--port <port>`, `Source's Database Port.`, parseInteger)
    .action(actionRunner(migrationsGetSupabaseReport))

migrations
    .command(`get`)
    .description(``)
    .requiredOption(`--migration-id <migration-id>`, `Migration unique ID.`)
    .action(actionRunner(migrationsGet))

migrations
    .command(`retry`)
    .description(``)
    .requiredOption(`--migration-id <migration-id>`, `Migration unique ID.`)
    .action(actionRunner(migrationsRetry))

migrations
    .command(`delete`)
    .description(``)
    .requiredOption(`--migration-id <migration-id>`, `Migration ID.`)
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
