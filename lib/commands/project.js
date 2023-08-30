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

const project = new Command("project").description(commandDescriptions['project']).configureHelp({
    helpWidth: process.stdout.columns || 80
  })

const projectGetUsage = async ({ range, parseOutput = true, sdk = undefined}) => {
    /* @param {string} range */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/project/usage';
    let payload = {};

    /** Query Params */
    if (typeof range !== 'undefined') {
        payload['range'] = range;
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

const projectCreateVariable = async ({ key, value, parseOutput = true, sdk = undefined}) => {
    /* @param {string} key */
    /* @param {string} value */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/project/variables';
    let payload = {};
    
    /** Body Params */

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

const projectGetVariable = async ({ variableId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} variableId */

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

const projectUpdateVariable = async ({ variableId, key, value, parseOutput = true, sdk = undefined}) => {
    /* @param {string} variableId */
    /* @param {string} key */
    /* @param {string} value */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/project/variables/{variableId}'.replace('{variableId}', variableId);
    let payload = {};
    
    /** Body Params */

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

const projectDeleteVariable = async ({ variableId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} variableId */

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
    .option(`--range <range>`, `Date range.`)
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
