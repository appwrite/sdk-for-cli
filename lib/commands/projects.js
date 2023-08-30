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

const projects = new Command("projects").description(commandDescriptions['projects']).configureHelp({
    helpWidth: process.stdout.columns || 80
  })

const projectsList = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects';
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

const projectsCreate = async ({ projectId, name, teamId, region, description, logo, url, legalName, legalCountry, legalState, legalCity, legalAddress, legalTaxId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} name */
    /* @param {string} teamId */
    /* @param {string} region */
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
    let apiPath = '/projects';
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


    if (typeof region !== 'undefined') {
        payload['region'] = region;
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
    response = await client.call('post', apiPath, {
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
    let apiPath = '/projects/{projectId}'.replace('{projectId}', projectId);
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
    let apiPath = '/projects/{projectId}'.replace('{projectId}', projectId);
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
    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const projectsDelete = async ({ projectId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}'.replace('{projectId}', projectId);
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

const projectsUpdateAuthDuration = async ({ projectId, duration, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {number} duration */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/auth/duration'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */

    if (typeof duration !== 'undefined') {
        payload['duration'] = duration;
    }

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

const projectsUpdateAuthLimit = async ({ projectId, limit, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {number} limit */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/auth/limit'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */

    if (typeof limit !== 'undefined') {
        payload['limit'] = limit;
    }

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

const projectsUpdateAuthSessionsLimit = async ({ projectId, limit, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {number} limit */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/auth/max-sessions'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */

    if (typeof limit !== 'undefined') {
        payload['limit'] = limit;
    }

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

const projectsUpdateAuthPasswordDictionary = async ({ projectId, enabled, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {boolean} enabled */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/auth/password-dictionary'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */

    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }

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

const projectsUpdateAuthPasswordHistory = async ({ projectId, limit, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {number} limit */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/auth/password-history'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */

    if (typeof limit !== 'undefined') {
        payload['limit'] = limit;
    }

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

const projectsUpdatePersonalDataCheck = async ({ projectId, enabled, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {boolean} enabled */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/auth/personal-data'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */

    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }

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

const projectsUpdateAuthStatus = async ({ projectId, method, status, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} method */
    /* @param {boolean} status */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/auth/{method}'.replace('{projectId}', projectId).replace('{method}', method);
    let payload = {};
    
    /** Body Params */

    if (typeof status !== 'undefined') {
        payload['status'] = status;
    }

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

const projectsListKeys = async ({ projectId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/keys'.replace('{projectId}', projectId);
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

const projectsCreateKey = async ({ projectId, name, scopes, expire, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} name */
    /* @param {string[]} scopes */
    /* @param {string} expire */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/keys'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    scopes = scopes === true ? [] : scopes;

    if (typeof scopes !== 'undefined') {
        payload['scopes'] = scopes;
    }


    if (typeof expire !== 'undefined') {
        payload['expire'] = expire;
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

const projectsGetKey = async ({ projectId, keyId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} keyId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
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

const projectsUpdateKey = async ({ projectId, keyId, name, scopes, expire, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} keyId */
    /* @param {string} name */
    /* @param {string[]} scopes */
    /* @param {string} expire */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
    let payload = {};
    
    /** Body Params */

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    scopes = scopes === true ? [] : scopes;

    if (typeof scopes !== 'undefined') {
        payload['scopes'] = scopes;
    }


    if (typeof expire !== 'undefined') {
        payload['expire'] = expire;
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

const projectsDeleteKey = async ({ projectId, keyId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} keyId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
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

const projectsUpdateOAuth2 = async ({ projectId, provider, appId, secret, enabled, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} provider */
    /* @param {string} appId */
    /* @param {string} secret */
    /* @param {boolean} enabled */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/oauth2'.replace('{projectId}', projectId);
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


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }

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

const projectsListPlatforms = async ({ projectId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/platforms'.replace('{projectId}', projectId);
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

const projectsCreatePlatform = async ({ projectId, type, name, key, store, hostname, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} type */
    /* @param {string} name */
    /* @param {string} key */
    /* @param {string} store */
    /* @param {string} hostname */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/platforms'.replace('{projectId}', projectId);
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
    response = await client.call('post', apiPath, {
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
    let apiPath = '/projects/{projectId}/platforms/{platformId}'.replace('{projectId}', projectId).replace('{platformId}', platformId);
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

const projectsUpdatePlatform = async ({ projectId, platformId, name, key, store, hostname, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} platformId */
    /* @param {string} name */
    /* @param {string} key */
    /* @param {string} store */
    /* @param {string} hostname */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/platforms/{platformId}'.replace('{projectId}', projectId).replace('{platformId}', platformId);
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
    response = await client.call('put', apiPath, {
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
    let apiPath = '/projects/{projectId}/platforms/{platformId}'.replace('{projectId}', projectId).replace('{platformId}', platformId);
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

const projectsUpdateServiceStatus = async ({ projectId, service, status, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} service */
    /* @param {boolean} status */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/service'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */

    if (typeof service !== 'undefined') {
        payload['service'] = service;
    }


    if (typeof status !== 'undefined') {
        payload['status'] = status;
    }

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

const projectsUpdateServiceStatusAll = async ({ projectId, status, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {boolean} status */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/service/all'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */

    if (typeof status !== 'undefined') {
        payload['status'] = status;
    }

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

const projectsUpdateSmtpConfiguration = async ({ projectId, enabled, senderName, senderEmail, replyTo, host, port, username, password, secure, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {boolean} enabled */
    /* @param {string} senderName */
    /* @param {string} senderEmail */
    /* @param {string} replyTo */
    /* @param {string} host */
    /* @param {number} port */
    /* @param {string} username */
    /* @param {string} password */
    /* @param {string} secure */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/smtp'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */

    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }


    if (typeof senderName !== 'undefined') {
        payload['senderName'] = senderName;
    }


    if (typeof senderEmail !== 'undefined') {
        payload['senderEmail'] = senderEmail;
    }


    if (typeof replyTo !== 'undefined') {
        payload['replyTo'] = replyTo;
    }


    if (typeof host !== 'undefined') {
        payload['host'] = host;
    }


    if (typeof port !== 'undefined') {
        payload['port'] = port;
    }


    if (typeof username !== 'undefined') {
        payload['username'] = username;
    }


    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }


    if (typeof secure !== 'undefined') {
        payload['secure'] = secure;
    }

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

const projectsUpdateTeam = async ({ projectId, teamId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} teamId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/team'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */

    if (typeof teamId !== 'undefined') {
        payload['teamId'] = teamId;
    }

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

const projectsGetEmailTemplate = async ({ projectId, type, locale, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} type */
    /* @param {string} locale */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/templates/email/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
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

const projectsUpdateEmailTemplate = async ({ projectId, type, locale, subject, message, senderName, senderEmail, replyTo, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} type */
    /* @param {string} locale */
    /* @param {string} subject */
    /* @param {string} message */
    /* @param {string} senderName */
    /* @param {string} senderEmail */
    /* @param {string} replyTo */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/templates/email/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
    let payload = {};
    
    /** Body Params */

    if (typeof subject !== 'undefined') {
        payload['subject'] = subject;
    }


    if (typeof message !== 'undefined') {
        payload['message'] = message;
    }


    if (typeof senderName !== 'undefined') {
        payload['senderName'] = senderName;
    }


    if (typeof senderEmail !== 'undefined') {
        payload['senderEmail'] = senderEmail;
    }


    if (typeof replyTo !== 'undefined') {
        payload['replyTo'] = replyTo;
    }

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

const projectsDeleteEmailTemplate = async ({ projectId, type, locale, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} type */
    /* @param {string} locale */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/templates/email/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
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

const projectsGetSmsTemplate = async ({ projectId, type, locale, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} type */
    /* @param {string} locale */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/templates/sms/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
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

const projectsUpdateSmsTemplate = async ({ projectId, type, locale, message, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} type */
    /* @param {string} locale */
    /* @param {string} message */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/templates/sms/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
    let payload = {};
    
    /** Body Params */

    if (typeof message !== 'undefined') {
        payload['message'] = message;
    }

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

const projectsDeleteSmsTemplate = async ({ projectId, type, locale, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} type */
    /* @param {string} locale */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/templates/sms/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
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

const projectsGetUsage = async ({ projectId, range, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} range */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/usage'.replace('{projectId}', projectId);
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

const projectsListWebhooks = async ({ projectId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/webhooks'.replace('{projectId}', projectId);
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

const projectsCreateWebhook = async ({ projectId, name, events, url, security, httpUser, httpPass, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} name */
    /* @param {string[]} events */
    /* @param {string} url */
    /* @param {boolean} security */
    /* @param {string} httpUser */
    /* @param {string} httpPass */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/webhooks'.replace('{projectId}', projectId);
    let payload = {};
    
    /** Body Params */

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    events = events === true ? [] : events;

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
    response = await client.call('post', apiPath, {
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
    let apiPath = '/projects/{projectId}/webhooks/{webhookId}'.replace('{projectId}', projectId).replace('{webhookId}', webhookId);
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
    let apiPath = '/projects/{projectId}/webhooks/{webhookId}'.replace('{projectId}', projectId).replace('{webhookId}', webhookId);
    let payload = {};
    
    /** Body Params */

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    events = events === true ? [] : events;

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
    response = await client.call('put', apiPath, {
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
    let apiPath = '/projects/{projectId}/webhooks/{webhookId}'.replace('{projectId}', projectId).replace('{webhookId}', webhookId);
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

const projectsUpdateWebhookSignature = async ({ projectId, webhookId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} projectId */
    /* @param {string} webhookId */

    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/webhooks/{webhookId}/signature'.replace('{projectId}', projectId).replace('{webhookId}', webhookId);
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


projects
    .command(`list`)
    .description(``)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, teamId`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(projectsList))

projects
    .command(`create`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, and hyphen. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Project name. Max length: 128 chars.`)
    .requiredOption(`--teamId <teamId>`, `Team unique ID.`)
    .option(`--region <region>`, `Project Region.`)
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
    .action(actionRunner(projectsDelete))

projects
    .command(`updateAuthDuration`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--duration <duration>`, `Project session length in seconds. Max length: 31536000 seconds.`, parseInteger)
    .action(actionRunner(projectsUpdateAuthDuration))

projects
    .command(`updateAuthLimit`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--limit <limit>`, `Set the max number of users allowed in this project. Use 0 for unlimited.`, parseInteger)
    .action(actionRunner(projectsUpdateAuthLimit))

projects
    .command(`updateAuthSessionsLimit`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--limit <limit>`, `Set the max number of users allowed in this project. Value allowed is between 1-100. Default is 10`, parseInteger)
    .action(actionRunner(projectsUpdateAuthSessionsLimit))

projects
    .command(`updateAuthPasswordDictionary`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--enabled <enabled>`, `Set whether or not to enable checking user's password against most commonly used passwords. Default is false.`, parseBool)
    .action(actionRunner(projectsUpdateAuthPasswordDictionary))

projects
    .command(`updateAuthPasswordHistory`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--limit <limit>`, `Set the max number of passwords to store in user history. User can't choose a new password that is already stored in the password history list.  Max number of passwords allowed in history is20. Default value is 0`, parseInteger)
    .action(actionRunner(projectsUpdateAuthPasswordHistory))

projects
    .command(`updatePersonalDataCheck`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--enabled <enabled>`, `Set whether or not to check a password for similarity with personal data. Default is false.`, parseBool)
    .action(actionRunner(projectsUpdatePersonalDataCheck))

projects
    .command(`updateAuthStatus`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--method <method>`, `Auth Method. Possible values: email-password,magic-url,anonymous,invites,jwt,phone`)
    .requiredOption(`--status <status>`, `Set the status of this auth method.`, parseBool)
    .action(actionRunner(projectsUpdateAuthStatus))

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
    .requiredOption(`--scopes [scopes...]`, `Key scopes list. Maximum of 100 scopes are allowed.`)
    .option(`--expire <expire>`, `Expiration time in ISO 8601 format. Use null for unlimited expiration.`)
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
    .requiredOption(`--scopes [scopes...]`, `Key scopes list. Maximum of 100 events are allowed.`)
    .option(`--expire <expire>`, `Expiration time in ISO 8601 format. Use null for unlimited expiration.`)
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
    .option(`--enabled <enabled>`, `Provider status. Set to 'false' to disable new session creation.`, parseBool)
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
    .command(`updateServiceStatusAll`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--status <status>`, `Service status.`, parseBool)
    .action(actionRunner(projectsUpdateServiceStatusAll))

projects
    .command(`updateSmtpConfiguration`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--enabled <enabled>`, `Enable custom SMTP service`, parseBool)
    .option(`--senderName <senderName>`, `Name of the email sender`)
    .option(`--senderEmail <senderEmail>`, `Email of the sender`)
    .option(`--replyTo <replyTo>`, `Reply to email`)
    .option(`--host <host>`, `SMTP server host name`)
    .option(`--port <port>`, `SMTP server port`, parseInteger)
    .option(`--username <username>`, `SMTP server username`)
    .option(`--password <password>`, `SMTP server password`)
    .option(`--secure <secure>`, `Does SMTP server use secure connection`)
    .action(actionRunner(projectsUpdateSmtpConfiguration))

projects
    .command(`updateTeam`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--teamId <teamId>`, `Team ID of the team to transfer project to.`)
    .action(actionRunner(projectsUpdateTeam))

projects
    .command(`getEmailTemplate`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsGetEmailTemplate))

projects
    .command(`updateEmailTemplate`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .requiredOption(`--subject <subject>`, `Email Subject`)
    .requiredOption(`--message <message>`, `Template message`)
    .option(`--senderName <senderName>`, `Name of the email sender`)
    .option(`--senderEmail <senderEmail>`, `Email of the sender`)
    .option(`--replyTo <replyTo>`, `Reply to email`)
    .action(actionRunner(projectsUpdateEmailTemplate))

projects
    .command(`deleteEmailTemplate`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsDeleteEmailTemplate))

projects
    .command(`getSmsTemplate`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsGetSmsTemplate))

projects
    .command(`updateSmsTemplate`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .requiredOption(`--message <message>`, `Template message`)
    .action(actionRunner(projectsUpdateSmsTemplate))

projects
    .command(`deleteSmsTemplate`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsDeleteSmsTemplate))

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
    .requiredOption(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
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
    .requiredOption(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
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

projects
    .command(`updateWebhookSignature`)
    .description(``)
    .requiredOption(`--projectId <projectId>`, `Project unique ID.`)
    .requiredOption(`--webhookId <webhookId>`, `Webhook unique ID.`)
    .action(actionRunner(projectsUpdateWebhookSignature))


module.exports = {
    projects,
    projectsList,
    projectsCreate,
    projectsGet,
    projectsUpdate,
    projectsDelete,
    projectsUpdateAuthDuration,
    projectsUpdateAuthLimit,
    projectsUpdateAuthSessionsLimit,
    projectsUpdateAuthPasswordDictionary,
    projectsUpdateAuthPasswordHistory,
    projectsUpdatePersonalDataCheck,
    projectsUpdateAuthStatus,
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
    projectsUpdateServiceStatusAll,
    projectsUpdateSmtpConfiguration,
    projectsUpdateTeam,
    projectsGetEmailTemplate,
    projectsUpdateEmailTemplate,
    projectsDeleteEmailTemplate,
    projectsGetSmsTemplate,
    projectsUpdateSmsTemplate,
    projectsDeleteSmsTemplate,
    projectsGetUsage,
    projectsListWebhooks,
    projectsCreateWebhook,
    projectsGetWebhook,
    projectsUpdateWebhook,
    projectsDeleteWebhook,
    projectsUpdateWebhookSignature
};
