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

const health = new Command("health").description(commandDescriptions['health']).configureHelp({
    helpWidth: process.stdout.columns || 80
  })

/**
 * @typedef {Object} HealthGetRequestParams
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetRequestParams} params
 */
const healthGet = async ({ parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
    let apiPath = '/health';
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
 * @typedef {Object} HealthGetAntivirusRequestParams
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetAntivirusRequestParams} params
 */
const healthGetAntivirus = async ({ parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
    let apiPath = '/health/anti-virus';
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
 * @typedef {Object} HealthGetCacheRequestParams
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetCacheRequestParams} params
 */
const healthGetCache = async ({ parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
    let apiPath = '/health/cache';
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
 * @typedef {Object} HealthGetDBRequestParams
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetDBRequestParams} params
 */
const healthGetDB = async ({ parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
    let apiPath = '/health/db';
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
 * @typedef {Object} HealthGetPubSubRequestParams
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetPubSubRequestParams} params
 */
const healthGetPubSub = async ({ parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
    let apiPath = '/health/pubsub';
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
 * @typedef {Object} HealthGetQueueRequestParams
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueRequestParams} params
 */
const healthGetQueue = async ({ parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
    let apiPath = '/health/queue';
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
 * @typedef {Object} HealthGetQueueBuildsRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueBuildsRequestParams} params
 */
const healthGetQueueBuilds = async ({ threshold, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} HealthGetQueueCertificatesRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueCertificatesRequestParams} params
 */
const healthGetQueueCertificates = async ({ threshold, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} HealthGetQueueDatabasesRequestParams
 * @property {string} name Queue name for which to check the queue size
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueDatabasesRequestParams} params
 */
const healthGetQueueDatabases = async ({ name, threshold, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} HealthGetQueueDeletesRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueDeletesRequestParams} params
 */
const healthGetQueueDeletes = async ({ threshold, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} HealthGetQueueFunctionsRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueFunctionsRequestParams} params
 */
const healthGetQueueFunctions = async ({ threshold, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} HealthGetQueueLogsRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueLogsRequestParams} params
 */
const healthGetQueueLogs = async ({ threshold, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} HealthGetQueueMailsRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueMailsRequestParams} params
 */
const healthGetQueueMails = async ({ threshold, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} HealthGetQueueMessagingRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueMessagingRequestParams} params
 */
const healthGetQueueMessaging = async ({ threshold, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} HealthGetQueueMigrationsRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueMigrationsRequestParams} params
 */
const healthGetQueueMigrations = async ({ threshold, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} HealthGetQueueWebhooksRequestParams
 * @property {number} threshold Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetQueueWebhooksRequestParams} params
 */
const healthGetQueueWebhooks = async ({ threshold, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} HealthGetStorageLocalRequestParams
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetStorageLocalRequestParams} params
 */
const healthGetStorageLocal = async ({ parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
    let apiPath = '/health/storage/local';
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
 * @typedef {Object} HealthGetTimeRequestParams
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {HealthGetTimeRequestParams} params
 */
const healthGetTime = async ({ parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    
    let apiPath = '/health/time';
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


health
    .command(`get`)
    .description(`Check the Appwrite HTTP server is up and responsive.`)
    .action(actionRunner(healthGet))

health
    .command(`getAntivirus`)
    .description(`Check the Appwrite Antivirus server is up and connection is successful.`)
    .action(actionRunner(healthGetAntivirus))

health
    .command(`getCache`)
    .description(`Check the Appwrite in-memory cache servers are up and connection is successful.`)
    .action(actionRunner(healthGetCache))

health
    .command(`getDB`)
    .description(`Check the Appwrite database servers are up and connection is successful.`)
    .action(actionRunner(healthGetDB))

health
    .command(`getPubSub`)
    .description(`Check the Appwrite pub-sub servers are up and connection is successful.`)
    .action(actionRunner(healthGetPubSub))

health
    .command(`getQueue`)
    .description(`Check the Appwrite queue messaging servers are up and connection is successful.`)
    .action(actionRunner(healthGetQueue))

health
    .command(`getQueueBuilds`)
    .description(`Get the number of builds that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueBuilds))

health
    .command(`getQueueCertificates`)
    .description(`Get the number of certificates that are waiting to be issued against [Letsencrypt](https://letsencrypt.org/) in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueCertificates))

health
    .command(`getQueueDatabases`)
    .description(`Get the number of database changes that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--name <name>`, `Queue name for which to check the queue size`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueDatabases))

health
    .command(`getQueueDeletes`)
    .description(`Get the number of background destructive changes that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueDeletes))

health
    .command(`getQueueFunctions`)
    .description(``)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueFunctions))

health
    .command(`getQueueLogs`)
    .description(`Get the number of logs that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueLogs))

health
    .command(`getQueueMails`)
    .description(`Get the number of mails that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueMails))

health
    .command(`getQueueMessaging`)
    .description(`Get the number of messages that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueMessaging))

health
    .command(`getQueueMigrations`)
    .description(`Get the number of migrations that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueMigrations))

health
    .command(`getQueueWebhooks`)
    .description(`Get the number of webhooks that are waiting to be processed in the Appwrite internal queue server.`)
    .option(`--threshold <threshold>`, `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`, parseInteger)
    .action(actionRunner(healthGetQueueWebhooks))

health
    .command(`getStorageLocal`)
    .description(`Check the Appwrite local storage device is up and connection is successful.`)
    .action(actionRunner(healthGetStorageLocal))

health
    .command(`getTime`)
    .description(`Check the Appwrite server time is synced with Google remote NTP server. We use this technology to smoothly handle leap seconds with no disruptive events. The [Network Time Protocol](https://en.wikipedia.org/wiki/Network_Time_Protocol) (NTP) is used by hundreds of millions of computers and devices to synchronize their clocks over the Internet. If your computer sets its own clock, it likely uses NTP.`)
    .action(actionRunner(healthGetTime))


module.exports = {
    health,
    healthGet,    
    healthGetAntivirus,    
    healthGetCache,    
    healthGetDB,    
    healthGetPubSub,    
    healthGetQueue,    
    healthGetQueueBuilds,    
    healthGetQueueCertificates,    
    healthGetQueueDatabases,    
    healthGetQueueDeletes,    
    healthGetQueueFunctions,    
    healthGetQueueLogs,    
    healthGetQueueMails,    
    healthGetQueueMessaging,    
    healthGetQueueMigrations,    
    healthGetQueueWebhooks,    
    healthGetStorageLocal,    
    healthGetTime    
};