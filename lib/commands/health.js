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

const health = new Command("health").description(commandDescriptions['health']).configureHelp({
    helpWidth: process.stdout.columns || 80
  })

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

const healthGetQueueCertificates = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/health/queue/certificates';
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

const healthGetQueueFunctions = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/health/queue/functions';
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

const healthGetQueueLogs = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/health/queue/logs';
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

const healthGetQueueWebhooks = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/health/queue/webhooks';
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
    .command(`getQueueCertificates`)
    .description(`Get the number of certificates that are waiting to be issued against [Letsencrypt](https://letsencrypt.org/) in the Appwrite internal queue server.`)
    .action(actionRunner(healthGetQueueCertificates))

health
    .command(`getQueueFunctions`)
    .description(``)
    .action(actionRunner(healthGetQueueFunctions))

health
    .command(`getQueueLogs`)
    .description(`Get the number of logs that are waiting to be processed in the Appwrite internal queue server.`)
    .action(actionRunner(healthGetQueueLogs))

health
    .command(`getQueueWebhooks`)
    .description(`Get the number of webhooks that are waiting to be processed in the Appwrite internal queue server.`)
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
    healthGetQueueCertificates,
    healthGetQueueFunctions,
    healthGetQueueLogs,
    healthGetQueueWebhooks,
    healthGetStorageLocal,
    healthGetTime
};
