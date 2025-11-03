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

const tokens = new Command("tokens").description(commandDescriptions['tokens'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} TokensListRequestParams
 * @property {string} bucketId Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).
 * @property {string} fileId File unique ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: expire
 * @property {boolean} total When set to false, the total count returned will be 0 and will not be calculated.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TokensListRequestParams} params
 */
const tokensList = async ({bucketId,fileId,queries,total,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tokens/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tokens', 'list', bucketId, fileId);
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} TokensCreateFileTokenRequestParams
 * @property {string} bucketId Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).
 * @property {string} fileId File unique ID.
 * @property {string} expire Token expiry date
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TokensCreateFileTokenRequestParams} params
 */
const tokensCreateFileToken = async ({bucketId,fileId,expire,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tokens/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
    let payload = {};
    if (typeof expire !== 'undefined') {
        payload['expire'] = expire;
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
 * @typedef {Object} TokensGetRequestParams
 * @property {string} tokenId Token ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TokensGetRequestParams} params
 */
const tokensGet = async ({tokenId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tokens/{tokenId}'.replace('{tokenId}', tokenId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tokens', 'get', tokenId);
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} TokensUpdateRequestParams
 * @property {string} tokenId Token unique ID.
 * @property {string} expire File token expiry date
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TokensUpdateRequestParams} params
 */
const tokensUpdate = async ({tokenId,expire,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tokens/{tokenId}'.replace('{tokenId}', tokenId);
    let payload = {};
    if (typeof expire !== 'undefined') {
        payload['expire'] = expire;
    }

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
 * @typedef {Object} TokensDeleteRequestParams
 * @property {string} tokenId Token ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TokensDeleteRequestParams} params
 */
const tokensDelete = async ({tokenId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tokens/{tokenId}'.replace('{tokenId}', tokenId);
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
tokens
    .command(`list`)
    .description(`List all the tokens created for a specific file or bucket. You can use the query params to filter your results.`)
    .requiredOption(`--bucket-id <bucket-id>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
    .requiredOption(`--file-id <file-id>`, `File unique ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: expire`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tokensList))

tokens
    .command(`create-file-token`)
    .description(`Create a new token. A token is linked to a file. Token can be passed as a request URL search parameter.`)
    .requiredOption(`--bucket-id <bucket-id>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
    .requiredOption(`--file-id <file-id>`, `File unique ID.`)
    .option(`--expire <expire>`, `Token expiry date`)
    .action(actionRunner(tokensCreateFileToken))

tokens
    .command(`get`)
    .description(`Get a token by its unique ID.`)
    .requiredOption(`--token-id <token-id>`, `Token ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tokensGet))

tokens
    .command(`update`)
    .description(`Update a token by its unique ID. Use this endpoint to update a token's expiry date.`)
    .requiredOption(`--token-id <token-id>`, `Token unique ID.`)
    .option(`--expire <expire>`, `File token expiry date`)
    .action(actionRunner(tokensUpdate))

tokens
    .command(`delete`)
    .description(`Delete a token by its unique ID.`)
    .requiredOption(`--token-id <token-id>`, `Token ID.`)
    .action(actionRunner(tokensDelete))

module.exports = {
    tokens,
    tokensList,
    tokensCreateFileToken,
    tokensGet,
    tokensUpdate,
    tokensDelete
};
