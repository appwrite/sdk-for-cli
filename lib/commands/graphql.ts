import fs = require('fs');
import pathLib = require('path');
import tar = require('tar');
import ignore = require('ignore');
import { promisify } from 'util';
import Client from '../client';
import { getAllFiles, showConsoleLink } from '../utils';
import { Command } from 'commander';
import { sdkForProject, sdkForConsole } from '../sdks';
import { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log, warn } from '../parser';
import { localConfig, globalConfig } from '../config';
import { File } from 'undici';
import { ReadableStream } from 'stream/web';

function convertReadStreamToReadableStream(readStream: fs.ReadStream): ReadableStream {
  return new ReadableStream({
    start(controller) {
      readStream.on("data", (chunk: Buffer) => {
        controller.enqueue(chunk);
      });
      readStream.on("end", () => {
        controller.close();
      });
      readStream.on("error", (err: Error) => {
        controller.error(err);
      });
    },
    cancel() {
      readStream.destroy();
    },
  });
}

export const graphql = new Command("graphql").description(commandDescriptions['graphql'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

interface GraphqlQueryRequestParams {
    query: object;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const graphqlQuery = async ({query,parseOutput = true, overrideForCli = false, sdk = undefined}: GraphqlQueryRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
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
    }

    return response;

}
interface GraphqlMutationRequestParams {
    query: object;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const graphqlMutation = async ({query,parseOutput = true, overrideForCli = false, sdk = undefined}: GraphqlMutationRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
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


