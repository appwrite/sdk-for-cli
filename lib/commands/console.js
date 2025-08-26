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

const console = new Command("console").description(commandDescriptions['console'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} ConsoleGetResourceRequestParams
 * @property {string} value Resource value.
 * @property {ConsoleResourceType} type Resource type.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ConsoleGetResourceRequestParams} params
 */
const consoleGetResource = async ({value,type,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/console/resources';
    let payload = {};
    if (typeof value !== 'undefined') {
        payload['value'] = value;
    }
    if (typeof type !== 'undefined') {
        payload['type'] = type;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('console', 'getResource');
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} ConsoleVariablesRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ConsoleVariablesRequestParams} params
 */
const consoleVariables = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/console/variables';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
console
    .command(`get-resource`)
    .description(`Check if a resource ID is available.`)
    .requiredOption(`--value <value>`, `Resource value.`)
    .requiredOption(`--type <type>`, `Resource type.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(consoleGetResource))

console
    .command(`variables`)
    .description(`Get all Environment Variables that are relevant for the console.`)
    .action(actionRunner(consoleVariables))

module.exports = {
    console,
    consoleGetResource,
    consoleVariables
};
