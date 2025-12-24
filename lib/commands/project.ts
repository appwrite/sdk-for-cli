import fs = require('fs');
import pathLib = require('path');
import tar = require('tar');
import ignore from 'ignore';
import { promisify } from 'util';
import Client from '../client';
import { getAllFiles, showConsoleLink } from '../utils';
import { Command } from 'commander';
import { sdkForProject, sdkForConsole } from '../sdks';
import { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log, warn } from '../parser';
import { localConfig, globalConfig } from '../config';
import { File } from 'undici';
import { ReadableStream } from 'stream/web';
import type { UploadProgress, FileInput } from '../types';
import { ProjectUsageRange } from '../enums/project-usage-range';

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

export const project = new Command("project").description(commandDescriptions['project'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

interface ProjectGetUsageRequestParams {
    startDate: string;
    endDate: string;
    period?: ProjectUsageRange;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectGetUsage = async ({startDate,endDate,period,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectGetUsageRequestParams): Promise<any> => {
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
interface ProjectListVariablesRequestParams {
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectListVariables = async ({parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectListVariablesRequestParams): Promise<any> => {
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
interface ProjectCreateVariableRequestParams {
    key: string;
    value: string;
    secret?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectCreateVariable = async ({key,value,secret,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectCreateVariableRequestParams): Promise<any> => {
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
interface ProjectGetVariableRequestParams {
    variableId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectGetVariable = async ({variableId,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectGetVariableRequestParams): Promise<any> => {
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
interface ProjectUpdateVariableRequestParams {
    variableId: string;
    key: string;
    value?: string;
    secret?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectUpdateVariable = async ({variableId,key,value,secret,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectUpdateVariableRequestParams): Promise<any> => {
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
interface ProjectDeleteVariableRequestParams {
    variableId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectDeleteVariable = async ({variableId,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectDeleteVariableRequestParams): Promise<any> => {
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
    .option(`--secret [value]`, `Secret variables can be updated or deleted, but only projects can read them during build and runtime.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .option(`--secret [value]`, `Secret variables can be updated or deleted, but only projects can read them during build and runtime.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectUpdateVariable))

project
    .command(`delete-variable`)
    .description(`Delete a project variable by its unique ID. `)
    .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
    .action(actionRunner(projectDeleteVariable))


