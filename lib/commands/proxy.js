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

const proxy = new Command("proxy").description(commandDescriptions['proxy'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} ProxyListRulesRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: domain, type, trigger, deploymentResourceType, deploymentResourceId, deploymentId, deploymentVcsProviderBranch
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProxyListRulesRequestParams} params
 */
const proxyListRules = async ({queries,search,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/proxy/rules';
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof search !== 'undefined') {
        payload['search'] = search;
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
 * @typedef {Object} ProxyCreateAPIRuleRequestParams
 * @property {string} domain Domain name.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProxyCreateAPIRuleRequestParams} params
 */
const proxyCreateAPIRule = async ({domain,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/proxy/rules/api';
    let payload = {};
    if (typeof domain !== 'undefined') {
        payload['domain'] = domain;
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
 * @typedef {Object} ProxyCreateFunctionRuleRequestParams
 * @property {string} domain Domain name.
 * @property {string} functionId ID of function to be executed.
 * @property {string} branch Name of VCS branch to deploy changes automatically
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProxyCreateFunctionRuleRequestParams} params
 */
const proxyCreateFunctionRule = async ({domain,functionId,branch,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/proxy/rules/function';
    let payload = {};
    if (typeof domain !== 'undefined') {
        payload['domain'] = domain;
    }
    if (typeof functionId !== 'undefined') {
        payload['functionId'] = functionId;
    }
    if (typeof branch !== 'undefined') {
        payload['branch'] = branch;
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
 * @typedef {Object} ProxyCreateRedirectRuleRequestParams
 * @property {string} domain Domain name.
 * @property {string} url Target URL of redirection
 * @property {StatusCode} statusCode Status code of redirection
 * @property {string} resourceId ID of parent resource.
 * @property {ProxyResourceType} resourceType Type of parent resource.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProxyCreateRedirectRuleRequestParams} params
 */
const proxyCreateRedirectRule = async ({domain,url,statusCode,resourceId,resourceType,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/proxy/rules/redirect';
    let payload = {};
    if (typeof domain !== 'undefined') {
        payload['domain'] = domain;
    }
    if (typeof url !== 'undefined') {
        payload['url'] = url;
    }
    if (typeof statusCode !== 'undefined') {
        payload['statusCode'] = statusCode;
    }
    if (typeof resourceId !== 'undefined') {
        payload['resourceId'] = resourceId;
    }
    if (typeof resourceType !== 'undefined') {
        payload['resourceType'] = resourceType;
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
 * @typedef {Object} ProxyCreateSiteRuleRequestParams
 * @property {string} domain Domain name.
 * @property {string} siteId ID of site to be executed.
 * @property {string} branch Name of VCS branch to deploy changes automatically
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProxyCreateSiteRuleRequestParams} params
 */
const proxyCreateSiteRule = async ({domain,siteId,branch,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/proxy/rules/site';
    let payload = {};
    if (typeof domain !== 'undefined') {
        payload['domain'] = domain;
    }
    if (typeof siteId !== 'undefined') {
        payload['siteId'] = siteId;
    }
    if (typeof branch !== 'undefined') {
        payload['branch'] = branch;
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
 * @typedef {Object} ProxyGetRuleRequestParams
 * @property {string} ruleId Rule ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProxyGetRuleRequestParams} params
 */
const proxyGetRule = async ({ruleId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/proxy/rules/{ruleId}'.replace('{ruleId}', ruleId);
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
 * @typedef {Object} ProxyDeleteRuleRequestParams
 * @property {string} ruleId Rule ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProxyDeleteRuleRequestParams} params
 */
const proxyDeleteRule = async ({ruleId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/proxy/rules/{ruleId}'.replace('{ruleId}', ruleId);
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
/**
 * @typedef {Object} ProxyUpdateRuleVerificationRequestParams
 * @property {string} ruleId Rule ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProxyUpdateRuleVerificationRequestParams} params
 */
const proxyUpdateRuleVerification = async ({ruleId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/proxy/rules/{ruleId}/verification'.replace('{ruleId}', ruleId);
    let payload = {};

    let response = undefined;

    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
proxy
    .command(`list-rules`)
    .description(`Get a list of all the proxy rules. You can use the query params to filter your results.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: domain, type, trigger, deploymentResourceType, deploymentResourceId, deploymentId, deploymentVcsProviderBranch`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(proxyListRules))

proxy
    .command(`create-api-rule`)
    .description(`Create a new proxy rule for serving Appwrite's API on custom domain.`)
    .requiredOption(`--domain <domain>`, `Domain name.`)
    .action(actionRunner(proxyCreateAPIRule))

proxy
    .command(`create-function-rule`)
    .description(`Create a new proxy rule for executing Appwrite Function on custom domain.`)
    .requiredOption(`--domain <domain>`, `Domain name.`)
    .requiredOption(`--function-id <function-id>`, `ID of function to be executed.`)
    .option(`--branch <branch>`, `Name of VCS branch to deploy changes automatically`)
    .action(actionRunner(proxyCreateFunctionRule))

proxy
    .command(`create-redirect-rule`)
    .description(`Create a new proxy rule for to redirect from custom domain to another domain.`)
    .requiredOption(`--domain <domain>`, `Domain name.`)
    .requiredOption(`--url <url>`, `Target URL of redirection`)
    .requiredOption(`--status-code <status-code>`, `Status code of redirection`)
    .requiredOption(`--resource-id <resource-id>`, `ID of parent resource.`)
    .requiredOption(`--resource-type <resource-type>`, `Type of parent resource.`)
    .action(actionRunner(proxyCreateRedirectRule))

proxy
    .command(`create-site-rule`)
    .description(`Create a new proxy rule for serving Appwrite Site on custom domain.`)
    .requiredOption(`--domain <domain>`, `Domain name.`)
    .requiredOption(`--site-id <site-id>`, `ID of site to be executed.`)
    .option(`--branch <branch>`, `Name of VCS branch to deploy changes automatically`)
    .action(actionRunner(proxyCreateSiteRule))

proxy
    .command(`get-rule`)
    .description(`Get a proxy rule by its unique ID.`)
    .requiredOption(`--rule-id <rule-id>`, `Rule ID.`)
    .action(actionRunner(proxyGetRule))

proxy
    .command(`delete-rule`)
    .description(`Delete a proxy rule by its unique ID.`)
    .requiredOption(`--rule-id <rule-id>`, `Rule ID.`)
    .action(actionRunner(proxyDeleteRule))

proxy
    .command(`update-rule-verification`)
    .description(`Retry getting verification process of a proxy rule. This endpoint triggers domain verification by checking DNS records (CNAME) against the configured target domain. If verification is successful, a TLS certificate will be automatically provisioned for the domain.`)
    .requiredOption(`--rule-id <rule-id>`, `Rule ID.`)
    .action(actionRunner(proxyUpdateRuleVerification))

module.exports = {
    proxy,
    proxyListRules,
    proxyCreateAPIRule,
    proxyCreateFunctionRule,
    proxyCreateRedirectRule,
    proxyCreateSiteRule,
    proxyGetRule,
    proxyDeleteRule,
    proxyUpdateRuleVerification
};
