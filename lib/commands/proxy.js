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

const proxy = new Command("proxy").description(commandDescriptions['proxy']).configureHelp({
    helpWidth: process.stdout.columns || 80
  })

const proxyListRules = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/proxy/rules';
    let payload = {};

    /** Query Params */
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof search !== 'undefined') {
        payload['search'] = search;
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

const proxyCreateRule = async ({ domain, resourceType, resourceId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} domain */
    /* @param {string} resourceType */
    /* @param {string} resourceId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/proxy/rules';
    let payload = {};
    
    /** Body Params */

    if (typeof domain !== 'undefined') {
        payload['domain'] = domain;
    }


    if (typeof resourceType !== 'undefined') {
        payload['resourceType'] = resourceType;
    }


    if (typeof resourceId !== 'undefined') {
        payload['resourceId'] = resourceId;
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

const proxyGetRule = async ({ ruleId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} ruleId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/proxy/rules/{ruleId}'.replace('{ruleId}', ruleId);
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

const proxyDeleteRule = async ({ ruleId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} ruleId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/proxy/rules/{ruleId}'.replace('{ruleId}', ruleId);
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

const proxyUpdateRuleVerification = async ({ ruleId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} ruleId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/proxy/rules/{ruleId}/verification'.replace('{ruleId}', ruleId);
    let payload = {};
    let response = undefined;
    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}


proxy
    .command(`listRules`)
    .description(`Get a list of all the proxy rules. You can use the query params to filter your results.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: domain, resourceType, resourceId, url`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(proxyListRules))

proxy
    .command(`createRule`)
    .description(`Create a new proxy rule.`)
    .requiredOption(`--domain <domain>`, `Domain name.`)
    .requiredOption(`--resourceType <resourceType>`, `Action definition for the rule. Possible values are "api", "function"`)
    .option(`--resourceId <resourceId>`, `ID of resource for the action type. If resourceType is "api", leave empty. If resourceType is "function", provide ID of the function.`)
    .action(actionRunner(proxyCreateRule))

proxy
    .command(`getRule`)
    .description(`Get a proxy rule by its unique ID.`)
    .requiredOption(`--ruleId <ruleId>`, `Rule ID.`)
    .action(actionRunner(proxyGetRule))

proxy
    .command(`deleteRule`)
    .description(`Delete a proxy rule by its unique ID.`)
    .requiredOption(`--ruleId <ruleId>`, `Rule ID.`)
    .action(actionRunner(proxyDeleteRule))

proxy
    .command(`updateRuleVerification`)
    .description(``)
    .requiredOption(`--ruleId <ruleId>`, `Rule ID.`)
    .action(actionRunner(proxyUpdateRuleVerification))


module.exports = {
    proxy,
    proxyListRules,
    proxyCreateRule,
    proxyGetRule,
    proxyDeleteRule,
    proxyUpdateRuleVerification
};
