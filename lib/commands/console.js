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

const console = new Command("console").description(commandDescriptions['console']).configureHelp({
    helpWidth: process.stdout.columns || 80
  })

const consoleVariables = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/console/variables';
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


console
    .command(`variables`)
    .description(`Get all Environment Variables that are relevant for the console.`)
    .action(actionRunner(consoleVariables))


module.exports = {
    console,
    consoleVariables
};
