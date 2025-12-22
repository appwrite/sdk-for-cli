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

export const console = new Command("console").description(commandDescriptions['console'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

interface ConsoleGetResourceRequestParams {
    value: string;
    type: ConsoleResourceType;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const consoleGetResource = async ({value,type,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: ConsoleGetResourceRequestParams): Promise<any> => {
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
        if(showConsole) {
            showConsoleLink('console', 'getResource');
         } else {
            parse(response)
        }
    }

    return response;

}
interface ConsoleVariablesRequestParams {
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const consoleVariables = async ({parseOutput = true, overrideForCli = false, sdk = undefined}: ConsoleVariablesRequestParams): Promise<any> => {
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


