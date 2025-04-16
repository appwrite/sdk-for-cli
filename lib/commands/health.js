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

const health = new Command("health").description(commandDescriptions['health'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} HealthGetRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetRequestParams} params
 */
const healthGet = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetAntivirusRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetAntivirusRequestParams} params
 */
const healthGetAntivirus = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/anti-virus';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetCacheRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetCacheRequestParams} params
 */
const healthGetCache = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/cache';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetCertificateRequestParams
 * @property {string} domain string
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetCertificateRequestParams} params
 */
const healthGetCertificate = async ({domain,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/certificate';
    let payload = {};
    if (typeof domain !== 'undefined') {
        payload['domain'] = domain;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetDBRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetDBRequestParams} params
 */
const healthGetDB = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/db';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetPubSubRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetPubSubRequestParams} params
 */
const healthGetPubSub = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/pubsub';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetQueueBuildsRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueBuildsRequestParams} params
 */
const healthGetQueueBuilds = async ({threshold,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/queue/builds';
    let payload = {};
    if (typeof threshold !== 'undefined') {
        payload['threshold'] = threshold;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetQueueCertificatesRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueCertificatesRequestParams} params
 */
const healthGetQueueCertificates = async ({threshold,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/queue/certificates';
    let payload = {};
    if (typeof threshold !== 'undefined') {
        payload['threshold'] = threshold;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetQueueDatabasesRequestParams
 * @property {string} name Queue name for which to check the queue size
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueDatabasesRequestParams} params
 */
const healthGetQueueDatabases = async ({name,threshold,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/queue/databases';
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof threshold !== 'undefined') {
        payload['threshold'] = threshold;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetQueueDeletesRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueDeletesRequestParams} params
 */
const healthGetQueueDeletes = async ({threshold,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/queue/deletes';
    let payload = {};
    if (typeof threshold !== 'undefined') {
        payload['threshold'] = threshold;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetFailedJobsRequestParams
 * @property {Name} name The name of the queue
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetFailedJobsRequestParams} params
 */
const healthGetFailedJobs = async ({name,threshold,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/queue/failed/{name}'.replace('{name}', name);
    let payload = {};
    if (typeof threshold !== 'undefined') {
        payload['threshold'] = threshold;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetQueueFunctionsRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueFunctionsRequestParams} params
 */
const healthGetQueueFunctions = async ({threshold,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/queue/functions';
    let payload = {};
    if (typeof threshold !== 'undefined') {
        payload['threshold'] = threshold;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetQueueLogsRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueLogsRequestParams} params
 */
const healthGetQueueLogs = async ({threshold,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/queue/logs';
    let payload = {};
    if (typeof threshold !== 'undefined') {
        payload['threshold'] = threshold;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetQueueMailsRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueMailsRequestParams} params
 */
const healthGetQueueMails = async ({threshold,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/queue/mails';
    let payload = {};
    if (typeof threshold !== 'undefined') {
        payload['threshold'] = threshold;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetQueueMessagingRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueMessagingRequestParams} params
 */
const healthGetQueueMessaging = async ({threshold,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/queue/messaging';
    let payload = {};
    if (typeof threshold !== 'undefined') {
        payload['threshold'] = threshold;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetQueueMigrationsRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueMigrationsRequestParams} params
 */
const healthGetQueueMigrations = async ({threshold,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/queue/migrations';
    let payload = {};
    if (typeof threshold !== 'undefined') {
        payload['threshold'] = threshold;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetQueueStatsResourcesRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueStatsResourcesRequestParams} params
 */
const healthGetQueueStatsResources = async ({threshold,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/queue/stats-resources';
    let payload = {};
    if (typeof threshold !== 'undefined') {
        payload['threshold'] = threshold;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetQueueUsageRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueUsageRequestParams} params
 */
const healthGetQueueUsage = async ({threshold,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/queue/stats-usage';
    let payload = {};
    if (typeof threshold !== 'undefined') {
        payload['threshold'] = threshold;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetQueueStatsUsageDumpRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueStatsUsageDumpRequestParams} params
 */
const healthGetQueueStatsUsageDump = async ({threshold,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/queue/stats-usage-dump';
    let payload = {};
    if (typeof threshold !== 'undefined') {
        payload['threshold'] = threshold;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetQueueWebhooksRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueWebhooksRequestParams} params
 */
const healthGetQueueWebhooks = async ({threshold,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/queue/webhooks';
    let payload = {};
    if (typeof threshold !== 'undefined') {
        payload['threshold'] = threshold;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetStorageRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetStorageRequestParams} params
 */
const healthGetStorage = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/storage';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetStorageLocalRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetStorageLocalRequestParams} params
 */
const healthGetStorageLocal = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/storage/local';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} HealthGetTimeRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetTimeRequestParams} params
 */
const healthGetTime = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/health/time';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

health
    .command(`get`)
    .description(`Check the Appwrite HTTP server is up and responsive.`)
    .action(actionRunner(healthGet))

health
    .command(`get-antivirus`)
    .description(`Check the Appwrite Antivirus server is up and connection is successful.`)
    .action(actionRunner(healthGetAntivirus))

health
    .command(`get-cache`)
    .description(`Check the Appwrite in-memory cache servers are up and connection is successful.`)
    .action(actionRunner(healthGetCache))

health
    .command(`get-certificate`)
    .description(`Get the SSL certificate for a domain`)
    .option(`--domain <domain>`, `string`)
    .action(actionRunner(healthGetCertificate))

health
    .command(`get-db`)
    .description(`Check the Appwrite database servers are up and connection is successful.`)
    .action(actionRunner(healthGetDB))

health
    .command(`get-pub-sub`)
    .description(`Check the Appwrite pub-sub servers are up and connection is successful.`)
    .action(actionRunner(healthGetPubSub))

health
    .command(`get-queue-builds`)
    .description(`Get the number of builds that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueBuilds))

health
    .command(`get-queue-certificates`)
    .description(`Get the number of certificates that are waiting to be issued against [Letsencrypt](https://letsencrypt.org/) in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueCertificates))

health
    .command(`get-queue-databases`)
    .description(`Get the number of database changes that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--name <name>`, `Queue name for which to check the queue size`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueDatabases))

health
    .command(`get-queue-deletes`)
    .description(`Get the number of background destructive changes that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueDeletes))

health
    .command(`get-failed-jobs`)
    .description(`Returns the amount of failed jobs in a given queue. `)
    .requiredOption(`--name <name>`, `The name of the queue`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetFailedJobs))

health
    .command(`get-queue-functions`)
    .description(`Get the number of function executions that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueFunctions))

health
    .command(`get-queue-logs`)
    .description(`Get the number of logs that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueLogs))

health
    .command(`get-queue-mails`)
    .description(`Get the number of mails that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueMails))

health
    .command(`get-queue-messaging`)
    .description(`Get the number of messages that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueMessaging))

health
    .command(`get-queue-migrations`)
    .description(`Get the number of migrations that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueMigrations))

health
    .command(`get-queue-stats-resources`)
    .description(`Get the number of metrics that are waiting to be processed in the Appwrite stats resources queue.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueStatsResources))

health
    .command(`get-queue-usage`)
    .description(`Get the number of metrics that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueUsage))

health
    .command(`get-queue-stats-usage-dump`)
    .description(`Get the number of projects containing metrics that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueStatsUsageDump))

health
    .command(`get-queue-webhooks`)
    .description(`Get the number of webhooks that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueWebhooks))

health
    .command(`get-storage`)
    .description(`Check the Appwrite storage device is up and connection is successful.`)
    .action(actionRunner(healthGetStorage))

health
    .command(`get-storage-local`)
    .description(`Check the Appwrite local storage device is up and connection is successful.`)
    .action(actionRunner(healthGetStorageLocal))

health
    .command(`get-time`)
    .description(`Check the Appwrite server time is synced with Google remote NTP server. We use this technology to smoothly handle leap seconds with no disruptive events. The [Network Time Protocol](https://en.wikipedia.org/wiki/Network_Time_Protocol) (NTP) is used by hundreds of millions of computers and devices to synchronize their clocks over the Internet. If your computer sets its own clock, it likely uses NTP.`)
    .action(actionRunner(healthGetTime))

module.exports = {
    health,
    healthGet,
    healthGetAntivirus,
    healthGetCache,
    healthGetCertificate,
    healthGetDB,
    healthGetPubSub,
    healthGetQueueBuilds,
    healthGetQueueCertificates,
    healthGetQueueDatabases,
    healthGetQueueDeletes,
    healthGetFailedJobs,
    healthGetQueueFunctions,
    healthGetQueueLogs,
    healthGetQueueMails,
    healthGetQueueMessaging,
    healthGetQueueMigrations,
    healthGetQueueStatsResources,
    healthGetQueueUsage,
    healthGetQueueStatsUsageDump,
    healthGetQueueWebhooks,
    healthGetStorage,
    healthGetStorageLocal,
    healthGetTime
};
