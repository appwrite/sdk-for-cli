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

const project = new Command("project").description(commandDescriptions['project'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} ProjectGetUsageRequestParams
 * @property {string} startDate Starting date for the usage
 * @property {string} endDate End date for the usage
 * @property {ProjectUsageRange} period Period used
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectGetUsageRequestParams} params
 */
const projectGetUsage = async ({startDate,endDate,period,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
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
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
/**
 * @typedef {Object} ProjectListVariablesRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectListVariablesRequestParams} params
 */
const projectListVariables = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/project/variables';
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
 * @typedef {Object} ProjectCreateVariableRequestParams
 * @property {string} key Variable key. Max length: 255 chars.
 * @property {string} value Variable value. Max length: 8192 chars.
 * @property {boolean} secret Secret variables can be updated or deleted, but only projects can read them during build and runtime.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectCreateVariableRequestParams} params
 */
const projectCreateVariable = async ({key,value,secret,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/project/variables';
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof value !== 'undefined') {
        payload['value'] = value;
    }
    if (typeof secret !== 'undefined') {
        payload['secret'] = secret;
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
 * @typedef {Object} ProjectGetVariableRequestParams
 * @property {string} variableId Variable unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectGetVariableRequestParams} params
 */
const projectGetVariable = async ({variableId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/project/variables/{variableId}'.replace('{variableId}', variableId);
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
 * @typedef {Object} ProjectUpdateVariableRequestParams
 * @property {string} variableId Variable unique ID.
 * @property {string} key Variable key. Max length: 255 chars.
 * @property {string} value Variable value. Max length: 8192 chars.
 * @property {boolean} secret Secret variables can be updated or deleted, but only projects can read them during build and runtime.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectUpdateVariableRequestParams} params
 */
const projectUpdateVariable = async ({variableId,key,value,secret,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/project/variables/{variableId}'.replace('{variableId}', variableId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof value !== 'undefined') {
        payload['value'] = value;
    }
    if (typeof secret !== 'undefined') {
        payload['secret'] = secret;
    }

    let response = undefined;

    response = await client.call('put', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
/**
 * @typedef {Object} ProjectDeleteVariableRequestParams
 * @property {string} variableId Variable unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectDeleteVariableRequestParams} params
 */
const projectDeleteVariable = async ({variableId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/project/variables/{variableId}'.replace('{variableId}', variableId);
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
project
    .command(`get-usage`)
    .description(`Get comprehensive usage statistics for your project. View metrics including network requests, bandwidth, storage, function executions, database usage, and user activity. Specify a time range with startDate and endDate, and optionally set the data granularity with period (1h or 1d). The response includes both total counts and detailed breakdowns by resource, along with historical data over the specified period.`)
    .requiredOption(`--start-date <start-date>`, `Starting date for the usage`)
    .requiredOption(`--end-date <end-date>`, `End date for the usage`)
    .option(`--period <period>`, `Period used`)
    .action(actionRunner(projectGetUsage))

project
    .command(`list-variables`)
    .description(`Get a list of all project variables. These variables will be accessible in all Appwrite Functions at runtime.`)
    .action(actionRunner(projectListVariables))

project
    .command(`create-variable`)
    .description(`Create a new project variable. This variable will be accessible in all Appwrite Functions at runtime.`)
    .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
    .requiredOption(`--value <value>`, `Variable value. Max length: 8192 chars.`)
    .option(`--secret [value]`, `Secret variables can be updated or deleted, but only projects can read them during build and runtime.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectCreateVariable))

project
    .command(`get-variable`)
    .description(`Get a project variable by its unique ID.`)
    .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
    .action(actionRunner(projectGetVariable))

project
    .command(`update-variable`)
    .description(`Update project variable by its unique ID. This variable will be accessible in all Appwrite Functions at runtime.`)
    .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
    .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
    .option(`--value <value>`, `Variable value. Max length: 8192 chars.`)
    .option(`--secret [value]`, `Secret variables can be updated or deleted, but only projects can read them during build and runtime.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectUpdateVariable))

project
    .command(`delete-variable`)
    .description(`Delete a project variable by its unique ID. `)
    .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
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
