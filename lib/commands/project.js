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

const project = new Command("project").description(commandDescriptions['project']).configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} ProjectGetUsageRequestParams
 * @property {string} startDate Starting date for the usage
 * @property {string} endDate End date for the usage
 * @property {ProjectUsageRange} period Period used
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectGetUsageRequestParams} params
 */
const projectGetUsage = async ({ startDate, endDate, period, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/project/usage';
    let payload = {};
    if (typeof startDate !== 'undefined') {
        payload['startDate'] = startDate;
    }
    if (typeof endDate !== 'undefined') {
        payload['endDate'] = endDate;
    }
    if (typeof period !== 'undefined') {
        payload['period'] = period;
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
 * @typedef {Object} ProjectListVariablesRequestParams
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectListVariablesRequestParams} params
 */
const projectListVariables = async ({ parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/project/variables';
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
 * @typedef {Object} ProjectCreateVariableRequestParams
 * @property {string} key Variable key. Max length: 255 chars.
 * @property {string} value Variable value. Max length: 8192 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectCreateVariableRequestParams} params
 */
const projectCreateVariable = async ({ key, value, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/project/variables';
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof value !== 'undefined') {
        payload['value'] = value;
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
 * @typedef {Object} ProjectGetVariableRequestParams
 * @property {string} variableId Variable unique ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectGetVariableRequestParams} params
 */
const projectGetVariable = async ({ variableId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/project/variables/{variableId}'.replace('{variableId}', variableId);
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
 * @typedef {Object} ProjectUpdateVariableRequestParams
 * @property {string} variableId Variable unique ID.
 * @property {string} key Variable key. Max length: 255 chars.
 * @property {string} value Variable value. Max length: 8192 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectUpdateVariableRequestParams} params
 */
const projectUpdateVariable = async ({ variableId, key, value, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/project/variables/{variableId}'.replace('{variableId}', variableId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof value !== 'undefined') {
        payload['value'] = value;
    }

    let response = undefined;

    response = await client.call('put', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectDeleteVariableRequestParams
 * @property {string} variableId Variable unique ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectDeleteVariableRequestParams} params
 */
const projectDeleteVariable = async ({ variableId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/project/variables/{variableId}'.replace('{variableId}', variableId);
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

project
    .command(`getUsage`)
    .description(``)
    .requiredOption(`--startDate <startDate>`, `Starting date for the usage`)
    .requiredOption(`--endDate <endDate>`, `End date for the usage`)
    .option(`--period <period>`, `Period used`)
    .action(actionRunner(projectGetUsage))

project
    .command(`listVariables`)
    .description(`Get a list of all project variables. These variables will be accessible in all Appwrite Functions at runtime.`)
    .action(actionRunner(projectListVariables))

project
    .command(`createVariable`)
    .description(`Create a new project variable. This variable will be accessible in all Appwrite Functions at runtime.`)
    .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
    .requiredOption(`--value <value>`, `Variable value. Max length: 8192 chars.`)
    .action(actionRunner(projectCreateVariable))

project
    .command(`getVariable`)
    .description(`Get a project variable by its unique ID.`)
    .requiredOption(`--variableId <variableId>`, `Variable unique ID.`)
    .action(actionRunner(projectGetVariable))

project
    .command(`updateVariable`)
    .description(`Update project variable by its unique ID. This variable will be accessible in all Appwrite Functions at runtime.`)
    .requiredOption(`--variableId <variableId>`, `Variable unique ID.`)
    .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
    .option(`--value <value>`, `Variable value. Max length: 8192 chars.`)
    .action(actionRunner(projectUpdateVariable))

project
    .command(`deleteVariable`)
    .description(`Delete a project variable by its unique ID. `)
    .requiredOption(`--variableId <variableId>`, `Variable unique ID.`)
    .action(actionRunner(projectDeleteVariable))

module.exports = {
    project,
    projectGetUsage,
    projectListVariables,
    projectCreateVariable,
    projectGetVariable,
    projectUpdateVariable,
    projectDeleteVariable
};