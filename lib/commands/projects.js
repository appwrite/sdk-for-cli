const fs = require('fs');
const tar = require("tar");
const { promisify } = require('util');
const libClient = require('../client.js');
const { Command } = require('commander');
const { sdkForProject, sdkForConsole } = require('../sdks')
const { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log } = require('../parser')
const { localConfig, globalConfig } = require("../config");

const projects = new Command("projects").description(commandDescriptions['projects'])

const projectsList = async ({ search, limit, offset, cursor, cursorDirection, orderType, parseOutput = true, sdk = undefined}) => {
    /* @param {string} search */
    /* @param {number} limit */
    /* @param {number} offset */
    /* @param {string} cursor */
    /* @param {string} cursorDirection */
    /* @param {string} orderType */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects';
    let payload = {};

    /** Query Params */
    if (typeof search !== 'undefined') {
        payload['search'] = search;
    }
    if (typeof limit !== 'undefined') {
        payload['limit'] = limit;
    }
    if (typeof offset !== 'undefined') {
        payload['offset'] = offset;
    }
    if (typeof cursor !== 'undefined') {
        payload['cursor'] = cursor;
    }
    if (typeof cursorDirection !== 'undefined') {
        payload['cursorDirection'] = cursorDirection;
    }
    if (typeof orderType !== 'undefined') {
        payload['orderType'] = orderType;
    }
    let response = undefined;
    response = await client.call('get', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsCreate = async ({ projectId, name, teamId, description, logo, url, legalName, legalCountry, legalState, legalCity, legalAddress, legalTaxId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} name */
    /* @param {string} teamId */
    /* @param {string} description */
    /* @param {string} logo */
    /* @param {string} url */
    /* @param {string} legalName */
    /* @param {string} legalCountry */
    /* @param {string} legalState */
    /* @param {string} legalCity */
    /* @param {string} legalAddress */
    /* @param {string} legalTaxId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects';
    let payload = {};
    
    /** Body Params */
    if (typeof projectId !== 'undefined') {
        payload['projectId'] = projectId;
    }

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    if (typeof teamId !== 'undefined') {
        payload['teamId'] = teamId;
    }

    if (typeof description !== 'undefined') {
        payload['description'] = description;
    }

    if (typeof logo !== 'undefined') {
        payload['logo'] = logo;
    }

    if (typeof url !== 'undefined') {
        payload['url'] = url;
    }

    if (typeof legalName !== 'undefined') {
        payload['legalName'] = legalName;
    }

    if (typeof legalCountry !== 'undefined') {
        payload['legalCountry'] = legalCountry;
    }

    if (typeof legalState !== 'undefined') {
        payload['legalState'] = legalState;
    }

    if (typeof legalCity !== 'undefined') {
        payload['legalCity'] = legalCity;
    }

    if (typeof legalAddress !== 'undefined') {
        payload['legalAddress'] = legalAddress;
    }

    if (typeof legalTaxId !== 'undefined') {
        payload['legalTaxId'] = legalTaxId;
    }

    let response = undefined;
    response = await client.call('post', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsGet = async ({ projectId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}'.replace('{projectId}', projectId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsUpdate = async ({ projectId, name, description, logo, url, legalName, legalCountry, legalState, legalCity, legalAddress, legalTaxId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} name */
    /* @param {string} description */
    /* @param {string} logo */
    /* @param {string} url */
    /* @param {string} legalName */
    /* @param {string} legalCountry */
    /* @param {string} legalState */
    /* @param {string} legalCity */
    /* @param {string} legalAddress */
    /* @param {string} legalTaxId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    if (typeof description !== 'undefined') {
        payload['description'] = description;
    }

    if (typeof logo !== 'undefined') {
        payload['logo'] = logo;
    }

    if (typeof url !== 'undefined') {
        payload['url'] = url;
    }

    if (typeof legalName !== 'undefined') {
        payload['legalName'] = legalName;
    }

    if (typeof legalCountry !== 'undefined') {
        payload['legalCountry'] = legalCountry;
    }

    if (typeof legalState !== 'undefined') {
        payload['legalState'] = legalState;
    }

    if (typeof legalCity !== 'undefined') {
        payload['legalCity'] = legalCity;
    }

    if (typeof legalAddress !== 'undefined') {
        payload['legalAddress'] = legalAddress;
    }

    if (typeof legalTaxId !== 'undefined') {
        payload['legalTaxId'] = legalTaxId;
    }

    let response = undefined;
    response = await client.call('patch', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsDelete = async ({ projectId, password, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} password */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */
    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }

    let response = undefined;
    response = await client.call('delete', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsUpdateAuthLimit = async ({ projectId, limit, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {number} limit */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/auth/limit'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */
    if (typeof limit !== 'undefined') {
        payload['limit'] = limit;
    }

    let response = undefined;
    response = await client.call('patch', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsUpdateAuthStatus = async ({ projectId, method, status, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} method */
    /* @param {boolean} status */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/auth/{method}'.replace('{projectId}', projectId).replace('{method}', method);
    let payload = {};
    
    /** Body Params */
    if (typeof status !== 'undefined') {
        payload['status'] = status;
    }

    let response = undefined;
    response = await client.call('patch', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsListDomains = async ({ projectId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/domains'.replace('{projectId}', projectId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsCreateDomain = async ({ projectId, domain, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} domain */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/domains'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */
    if (typeof domain !== 'undefined') {
        payload['domain'] = domain;
    }

    let response = undefined;
    response = await client.call('post', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsGetDomain = async ({ projectId, domainId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} domainId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/domains/{domainId}'.replace('{projectId}', projectId).replace('{domainId}', domainId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsDeleteDomain = async ({ projectId, domainId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} domainId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/domains/{domainId}'.replace('{projectId}', projectId).replace('{domainId}', domainId);
    let payload = {};
    let response = undefined;
    response = await client.call('delete', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsUpdateDomainVerification = async ({ projectId, domainId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} domainId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/domains/{domainId}/verification'.replace('{projectId}', projectId).replace('{domainId}', domainId);
    let payload = {};
    let response = undefined;
    response = await client.call('patch', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsListKeys = async ({ projectId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/keys'.replace('{projectId}', projectId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsCreateKey = async ({ projectId, name, scopes, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} name */
    /* @param {string[]} scopes */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/keys'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    if (typeof scopes !== 'undefined') {
        payload['scopes'] = scopes;
    }

    let response = undefined;
    response = await client.call('post', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsGetKey = async ({ projectId, keyId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} keyId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsUpdateKey = async ({ projectId, keyId, name, scopes, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} keyId */
    /* @param {string} name */
    /* @param {string[]} scopes */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
    let payload = {};
    
    /** Body Params */
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    if (typeof scopes !== 'undefined') {
        payload['scopes'] = scopes;
    }

    let response = undefined;
    response = await client.call('put', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsDeleteKey = async ({ projectId, keyId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} keyId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
    let payload = {};
    let response = undefined;
    response = await client.call('delete', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsUpdateOAuth2 = async ({ projectId, provider, appId, secret, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} provider */
    /* @param {string} appId */
    /* @param {string} secret */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/oauth2'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */
    if (typeof provider !== 'undefined') {
        payload['provider'] = provider;
    }

    if (typeof appId !== 'undefined') {
        payload['appId'] = appId;
    }

    if (typeof secret !== 'undefined') {
        payload['secret'] = secret;
    }

    let response = undefined;
    response = await client.call('patch', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsListPlatforms = async ({ projectId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/platforms'.replace('{projectId}', projectId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsCreatePlatform = async ({ projectId, type, name, key, store, hostname, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} type */
    /* @param {string} name */
    /* @param {string} key */
    /* @param {string} store */
    /* @param {string} hostname */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/platforms'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */
    if (typeof type !== 'undefined') {
        payload['type'] = type;
    }

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }

    if (typeof store !== 'undefined') {
        payload['store'] = store;
    }

    if (typeof hostname !== 'undefined') {
        payload['hostname'] = hostname;
    }

    let response = undefined;
    response = await client.call('post', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsGetPlatform = async ({ projectId, platformId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} platformId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/platforms/{platformId}'.replace('{projectId}', projectId).replace('{platformId}', platformId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsUpdatePlatform = async ({ projectId, platformId, name, key, store, hostname, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} platformId */
    /* @param {string} name */
    /* @param {string} key */
    /* @param {string} store */
    /* @param {string} hostname */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/platforms/{platformId}'.replace('{projectId}', projectId).replace('{platformId}', platformId);
    let payload = {};
    
    /** Body Params */
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }

    if (typeof store !== 'undefined') {
        payload['store'] = store;
    }

    if (typeof hostname !== 'undefined') {
        payload['hostname'] = hostname;
    }

    let response = undefined;
    response = await client.call('put', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsDeletePlatform = async ({ projectId, platformId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} platformId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/platforms/{platformId}'.replace('{projectId}', projectId).replace('{platformId}', platformId);
    let payload = {};
    let response = undefined;
    response = await client.call('delete', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsUpdateServiceStatus = async ({ projectId, service, status, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} service */
    /* @param {boolean} status */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/service'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */
    if (typeof service !== 'undefined') {
        payload['service'] = service;
    }

    if (typeof status !== 'undefined') {
        payload['status'] = status;
    }

    let response = undefined;
    response = await client.call('patch', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsGetUsage = async ({ projectId, range, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} range */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/usage'.replace('{projectId}', projectId);
    let payload = {};

    /** Query Params */
    if (typeof range !== 'undefined') {
        payload['range'] = range;
    }
    let response = undefined;
    response = await client.call('get', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsListWebhooks = async ({ projectId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/webhooks'.replace('{projectId}', projectId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsCreateWebhook = async ({ projectId, name, events, url, security, httpUser, httpPass, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} name */
    /* @param {string[]} events */
    /* @param {string} url */
    /* @param {boolean} security */
    /* @param {string} httpUser */
    /* @param {string} httpPass */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/webhooks'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    if (typeof events !== 'undefined') {
        payload['events'] = events;
    }

    if (typeof url !== 'undefined') {
        payload['url'] = url;
    }

    if (typeof security !== 'undefined') {
        payload['security'] = security;
    }

    if (typeof httpUser !== 'undefined') {
        payload['httpUser'] = httpUser;
    }

    if (typeof httpPass !== 'undefined') {
        payload['httpPass'] = httpPass;
    }

    let response = undefined;
    response = await client.call('post', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsGetWebhook = async ({ projectId, webhookId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} webhookId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/webhooks/{webhookId}'.replace('{projectId}', projectId).replace('{webhookId}', webhookId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsUpdateWebhook = async ({ projectId, webhookId, name, events, url, security, httpUser, httpPass, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} webhookId */
    /* @param {string} name */
    /* @param {string[]} events */
    /* @param {string} url */
    /* @param {boolean} security */
    /* @param {string} httpUser */
    /* @param {string} httpPass */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/webhooks/{webhookId}'.replace('{projectId}', projectId).replace('{webhookId}', webhookId);
    let payload = {};
    
    /** Body Params */
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    if (typeof events !== 'undefined') {
        payload['events'] = events;
    }

    if (typeof url !== 'undefined') {
        payload['url'] = url;
    }

    if (typeof security !== 'undefined') {
        payload['security'] = security;
    }

    if (typeof httpUser !== 'undefined') {
        payload['httpUser'] = httpUser;
    }

    if (typeof httpPass !== 'undefined') {
        payload['httpPass'] = httpPass;
    }

    let response = undefined;
    response = await client.call('put', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsDeleteWebhook = async ({ projectId, webhookId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} webhookId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let path = '/projects/{projectId}/webhooks/{webhookId}'.replace('{projectId}', projectId).replace('{webhookId}', webhookId);
    let payload = {};
    let response = undefined;
    response = await client.call('delete', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}


projects
    .command(`list`)
    .description(``)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--limit <limit>`, `Results limit value. By default will return maximum 25 results. Maximum of 100 results allowed per request.`, parseInteger)
    .option(`--offset <offset>`, `Results offset. The default value is 0. Use this param to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)`, parseInteger)
    .option(`--cursor <cursor>`, `ID of the project used as the starting point for the query, excluding the project itself. Should be used for efficient pagination when working with large sets of data. [learn more about pagination](https://appwrite.io/docs/pagination)`)
    .option(`--cursorDirection <cursorDirection>`, `Direction of the cursor.`)
    .option(`--orderType <orderType>`, `Order result by ASC or DESC order.`)
    .action(actionRunner(projectsList))

projects
    .command(`create`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Unique Id. Choose your own unique ID or pass the string "unique()" to auto generate it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Project name. Max length: 128 chars.`)
    .requiredOption(`--teamId <teamId>`, `Team unique ID.`)
    .option(`--description <description>`, `Project description. Max length: 256 chars.`)
    .option(`--logo <logo>`, `Project logo.`)
    .option(`--url <url>`, `Project URL.`)
    .option(`--legalName <legalName>`, `Project legal Name. Max length: 256 chars.`)
    .option(`--legalCountry <legalCountry>`, `Project legal Country. Max length: 256 chars.`)
    .option(`--legalState <legalState>`, `Project legal State. Max length: 256 chars.`)
    .option(`--legalCity <legalCity>`, `Project legal City. Max length: 256 chars.`)
    .option(`--legalAddress <legalAddress>`, `Project legal Address. Max length: 256 chars.`)
    .option(`--legalTaxId <legalTaxId>`, `Project legal Tax ID. Max length: 256 chars.`)
    .action(actionRunner(projectsCreate))

projects
    .command(`get`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .action(actionRunner(projectsGet))

projects
    .command(`update`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--name <name>`, `Project name. Max length: 128 chars.`)
    .option(`--description <description>`, `Project description. Max length: 256 chars.`)
    .option(`--logo <logo>`, `Project logo.`)
    .option(`--url <url>`, `Project URL.`)
    .option(`--legalName <legalName>`, `Project legal name. Max length: 256 chars.`)
    .option(`--legalCountry <legalCountry>`, `Project legal country. Max length: 256 chars.`)
    .option(`--legalState <legalState>`, `Project legal state. Max length: 256 chars.`)
    .option(`--legalCity <legalCity>`, `Project legal city. Max length: 256 chars.`)
    .option(`--legalAddress <legalAddress>`, `Project legal address. Max length: 256 chars.`)
    .option(`--legalTaxId <legalTaxId>`, `Project legal tax ID. Max length: 256 chars.`)
    .action(actionRunner(projectsUpdate))

projects
    .command(`delete`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--password <password>`, `Your user password for confirmation. Must be at least 8 chars.`)
    .action(actionRunner(projectsDelete))

projects
    .command(`updateAuthLimit`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--limit <limit>`, `Set the max number of users allowed in this project. Use 0 for unlimited.`, parseInteger)
    .action(actionRunner(projectsUpdateAuthLimit))

projects
    .command(`updateAuthStatus`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--method <method>`, `Auth Method. Possible values: email-password,magic-url,anonymous,invites,jwt,phone`)
    .requiredOption(`--status <status>`, `Set the status of this auth method.`, parseBool)
    .action(actionRunner(projectsUpdateAuthStatus))

projects
    .command(`listDomains`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .action(actionRunner(projectsListDomains))

projects
    .command(`createDomain`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--domain <domain>`, `Domain name.`)
    .action(actionRunner(projectsCreateDomain))

projects
    .command(`getDomain`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--domainId <domainId>`, `Domain unique ID.`)
    .action(actionRunner(projectsGetDomain))

projects
    .command(`deleteDomain`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--domainId <domainId>`, `Domain unique ID.`)
    .action(actionRunner(projectsDeleteDomain))

projects
    .command(`updateDomainVerification`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--domainId <domainId>`, `Domain unique ID.`)
    .action(actionRunner(projectsUpdateDomainVerification))

projects
    .command(`listKeys`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .action(actionRunner(projectsListKeys))

projects
    .command(`createKey`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
    .requiredOption(`--scopes <scopes...>`, `Key scopes list.`)
    .action(actionRunner(projectsCreateKey))

projects
    .command(`getKey`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--keyId <keyId>`, `Key unique ID.`)
    .action(actionRunner(projectsGetKey))

projects
    .command(`updateKey`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--keyId <keyId>`, `Key unique ID.`)
    .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
    .requiredOption(`--scopes <scopes...>`, `Key scopes list`)
    .action(actionRunner(projectsUpdateKey))

projects
    .command(`deleteKey`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--keyId <keyId>`, `Key unique ID.`)
    .action(actionRunner(projectsDeleteKey))

projects
    .command(`updateOAuth2`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--provider <provider>`, `Provider Name`)
    .option(`--appId <appId>`, `Provider app ID. Max length: 256 chars.`)
    .option(`--secret <secret>`, `Provider secret key. Max length: 512 chars.`)
    .action(actionRunner(projectsUpdateOAuth2))

projects
    .command(`listPlatforms`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .action(actionRunner(projectsListPlatforms))

projects
    .command(`createPlatform`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Platform type.`)
    .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
    .option(`--key <key>`, `Package name for Android or bundle ID for iOS or macOS. Max length: 256 chars.`)
    .option(`--store <store>`, `App store or Google Play store ID. Max length: 256 chars.`)
    .option(`--hostname <hostname>`, `Platform client hostname. Max length: 256 chars.`)
    .action(actionRunner(projectsCreatePlatform))

projects
    .command(`getPlatform`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--platformId <platformId>`, `Platform unique ID.`)
    .action(actionRunner(projectsGetPlatform))

projects
    .command(`updatePlatform`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--platformId <platformId>`, `Platform unique ID.`)
    .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
    .option(`--key <key>`, `Package name for android or bundle ID for iOS. Max length: 256 chars.`)
    .option(`--store <store>`, `App store or Google Play store ID. Max length: 256 chars.`)
    .option(`--hostname <hostname>`, `Platform client URL. Max length: 256 chars.`)
    .action(actionRunner(projectsUpdatePlatform))

projects
    .command(`deletePlatform`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--platformId <platformId>`, `Platform unique ID.`)
    .action(actionRunner(projectsDeletePlatform))

projects
    .command(`updateServiceStatus`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--service <service>`, `Service name.`)
    .requiredOption(`--status <status>`, `Service status.`, parseBool)
    .action(actionRunner(projectsUpdateServiceStatus))

projects
    .command(`getUsage`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .option(`--range <range>`, `Date range.`)
    .action(actionRunner(projectsGetUsage))

projects
    .command(`listWebhooks`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .action(actionRunner(projectsListWebhooks))

projects
    .command(`createWebhook`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--name <name>`, `Webhook name. Max length: 128 chars.`)
    .requiredOption(`--events <events...>`, `Events list.`)
    .requiredOption(`--url <url>`, `Webhook URL.`)
    .requiredOption(`--security <security>`, `Certificate verification, false for disabled or true for enabled.`, parseBool)
    .option(`--httpUser <httpUser>`, `Webhook HTTP user. Max length: 256 chars.`)
    .option(`--httpPass <httpPass>`, `Webhook HTTP password. Max length: 256 chars.`)
    .action(actionRunner(projectsCreateWebhook))

projects
    .command(`getWebhook`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--webhookId <webhookId>`, `Webhook unique ID.`)
    .action(actionRunner(projectsGetWebhook))

projects
    .command(`updateWebhook`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--webhookId <webhookId>`, `Webhook unique ID.`)
    .requiredOption(`--name <name>`, `Webhook name. Max length: 128 chars.`)
    .requiredOption(`--events <events...>`, `Events list.`)
    .requiredOption(`--url <url>`, `Webhook URL.`)
    .requiredOption(`--security <security>`, `Certificate verification, false for disabled or true for enabled.`, parseBool)
    .option(`--httpUser <httpUser>`, `Webhook HTTP user. Max length: 256 chars.`)
    .option(`--httpPass <httpPass>`, `Webhook HTTP password. Max length: 256 chars.`)
    .action(actionRunner(projectsUpdateWebhook))

projects
    .command(`deleteWebhook`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--webhookId <webhookId>`, `Webhook unique ID.`)
    .action(actionRunner(projectsDeleteWebhook))


module.exports = {
    projects,
    projectsList,
    projectsCreate,
    projectsGet,
    projectsUpdate,
    projectsDelete,
    projectsUpdateAuthLimit,
    projectsUpdateAuthStatus,
    projectsListDomains,
    projectsCreateDomain,
    projectsGetDomain,
    projectsDeleteDomain,
    projectsUpdateDomainVerification,
    projectsListKeys,
    projectsCreateKey,
    projectsGetKey,
    projectsUpdateKey,
    projectsDeleteKey,
    projectsUpdateOAuth2,
    projectsListPlatforms,
    projectsCreatePlatform,
    projectsGetPlatform,
    projectsUpdatePlatform,
    projectsDeletePlatform,
    projectsUpdateServiceStatus,
    projectsGetUsage,
    projectsListWebhooks,
    projectsCreateWebhook,
    projectsGetWebhook,
    projectsUpdateWebhook,
    projectsDeleteWebhook
};
