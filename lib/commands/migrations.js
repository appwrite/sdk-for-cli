const fs = require('fs');
const pathLib = require('path');
const tar = require("tar");
const ignore = require("ignore");
const { promisify } = require('util');
const libClient = require('../client.js');
const { getAllFiles, showConsoleLink } = require('../utils.js');
const { Command } = require('commander');
const { sdkForProject, sdkForConsole } = require('../sdks')
const { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log, warn } = require('../parser')
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

const migrations = new Command("migrations").description(commandDescriptions['migrations'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} MigrationsListRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: status, stage, source, destination, resources, statusCounters, resourceData, errors
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
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} MigrationsCreateAppwriteMigrationRequestParams
 * @property {string[]} resources List of resources to migrate
 * @property {string} endpoint Source Appwrite endpoint
 * @property {string} projectId Source Project ID
 * @property {string} apiKey Source API Key
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
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} MigrationsCreateCsvMigrationRequestParams
 * @property {string} bucketId Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).
 * @property {string} fileId File ID.
 * @property {string} resourceId Composite ID in the format {databaseId:collectionId}, identifying a collection within a database.
 * @property {boolean} internalFile Is the file stored in an internal bucket?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MigrationsCreateCsvMigrationRequestParams} params
 */
const migrationsCreateCsvMigration = async ({bucketId,fileId,resourceId,internalFile,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/migrations/csv';
    let payload = {};
    if (typeof bucketId !== 'undefined') {
        payload['bucketId'] = bucketId;
    }
    if (typeof fileId !== 'undefined') {
        payload['fileId'] = fileId;
    }
    if (typeof resourceId !== 'undefined') {
        payload['resourceId'] = resourceId;
    }
    if (typeof internalFile !== 'undefined') {
        payload['internalFile'] = internalFile;
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
    }, payload);

    if (parseOutput) {
        parse(response)
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
    }, payload);

    if (parseOutput) {
        parse(response)
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
    }, payload);

    if (parseOutput) {
        parse(response)
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
    }, payload);

    if (parseOutput) {
        parse(response)
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
    }

    return response;

}

migrations
    .command(`list`)
    .description(`List all migrations in the current project. This endpoint returns a list of all migrations including their status, progress, and any errors that occurred during the migration process.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: status, stage, source, destination, resources, statusCounters, resourceData, errors`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(migrationsList))

migrations
    .command(`create-appwrite-migration`)
    .description(`Migrate data from another Appwrite project to your current project. This endpoint allows you to migrate resources like databases, collections, documents, users, and files from an existing Appwrite project. `)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--endpoint <endpoint>`, `Source Appwrite endpoint`)
    .requiredOption(`--project-id <project-id>`, `Source Project ID`)
    .requiredOption(`--api-key <api-key>`, `Source API Key`)
    .action(actionRunner(migrationsCreateAppwriteMigration))

migrations
    .command(`get-appwrite-report`)
    .description(`Generate a report of the data in an Appwrite project before migrating. This endpoint analyzes the source project and returns information about the resources that can be migrated.`)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--endpoint <endpoint>`, `Source's Appwrite Endpoint`)
    .requiredOption(`--project-id <project-id>`, `Source's Project ID`)
    .requiredOption(`--key <key>`, `Source's API Key`)
    .action(actionRunner(migrationsGetAppwriteReport))

migrations
    .command(`create-csv-migration`)
    .description(`Import documents from a CSV file into your Appwrite database. This endpoint allows you to import documents from a CSV file uploaded to Appwrite Storage bucket.`)
    .requiredOption(`--bucket-id <bucket-id>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
    .requiredOption(`--file-id <file-id>`, `File ID.`)
    .requiredOption(`--resource-id <resource-id>`, `Composite ID in the format {databaseId:collectionId}, identifying a collection within a database.`)
    .option(`--internal-file [value]`, `Is the file stored in an internal bucket?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(migrationsCreateCsvMigration))

migrations
    .command(`create-firebase-migration`)
    .description(`Migrate data from a Firebase project to your Appwrite project. This endpoint allows you to migrate resources like authentication and other supported services from a Firebase project. `)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--service-account <service-account>`, `JSON of the Firebase service account credentials`)
    .action(actionRunner(migrationsCreateFirebaseMigration))

migrations
    .command(`get-firebase-report`)
    .description(`Generate a report of the data in a Firebase project before migrating. This endpoint analyzes the source project and returns information about the resources that can be migrated.`)
    .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
    .requiredOption(`--service-account <service-account>`, `JSON of the Firebase service account credentials`)
    .action(actionRunner(migrationsGetFirebaseReport))

migrations
    .command(`create-n-host-migration`)
    .description(`Migrate data from an NHost project to your Appwrite project. This endpoint allows you to migrate resources like authentication, databases, and other supported services from an NHost project. `)
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
    .description(`Generate a detailed report of the data in an NHost project before migrating. This endpoint analyzes the source project and returns information about the resources that can be migrated. `)
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
    .description(`Migrate data from a Supabase project to your Appwrite project. This endpoint allows you to migrate resources like authentication, databases, and other supported services from a Supabase project. `)
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
    .description(`Generate a report of the data in a Supabase project before migrating. This endpoint analyzes the source project and returns information about the resources that can be migrated. `)
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
    .description(`Get a migration by its unique ID. This endpoint returns detailed information about a specific migration including its current status, progress, and any errors that occurred during the migration process. `)
    .requiredOption(`--migration-id <migration-id>`, `Migration unique ID.`)
    .action(actionRunner(migrationsGet))

migrations
    .command(`retry`)
    .description(`Retry a failed migration. This endpoint allows you to retry a migration that has previously failed.`)
    .requiredOption(`--migration-id <migration-id>`, `Migration unique ID.`)
    .action(actionRunner(migrationsRetry))

migrations
    .command(`delete`)
    .description(`Delete a migration by its unique ID. This endpoint allows you to remove a migration from your project's migration history. `)
    .requiredOption(`--migration-id <migration-id>`, `Migration ID.`)
    .action(actionRunner(migrationsDelete))

module.exports = {
    migrations,
    migrationsList,
    migrationsCreateAppwriteMigration,
    migrationsGetAppwriteReport,
    migrationsCreateCsvMigration,
    migrationsCreateFirebaseMigration,
    migrationsGetFirebaseReport,
    migrationsCreateNHostMigration,
    migrationsGetNHostReport,
    migrationsCreateSupabaseMigration,
    migrationsGetSupabaseReport,
    migrationsGet,
    migrationsRetry,
    migrationsDelete
};
