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

const graphql = new Command("graphql").description(commandDescriptions['graphql']).configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} GraphqlQueryRequestParams
 * @property {object} query The query or queries to execute.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {GraphqlQueryRequestParams} params
 */
const graphqlQuery = async ({ query, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/graphql';
    let payload = {};
    if (typeof query !== 'undefined') {
        payload['query'] = JSON.parse(query);
    }

    let response = undefined;

    response = await client.call('post', apiPath, {
        'x-sdk-graphql': 'true',
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} GraphqlMutationRequestParams
 * @property {object} query The query or queries to execute.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {GraphqlMutationRequestParams} params
 */
const graphqlMutation = async ({ query, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/graphql/mutation';
    let payload = {};
    if (typeof query !== 'undefined') {
        payload['query'] = JSON.parse(query);
    }

    let response = undefined;

    response = await client.call('post', apiPath, {
        'x-sdk-graphql': 'true',
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

graphql
    .command(`query`)
    .description(`Execute a GraphQL mutation.`)
    .requiredOption(`--query <query>`, `The query or queries to execute.`)
    .action(actionRunner(graphqlQuery))

graphql
    .command(`mutation`)
    .description(`Execute a GraphQL mutation.`)
    .requiredOption(`--query <query>`, `The query or queries to execute.`)
    .action(actionRunner(graphqlMutation))

module.exports = {
    graphql,
    graphqlQuery,
    graphqlMutation
};