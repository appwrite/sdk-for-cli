const fs = require('fs');
const pathLib = require('path');
const tar = require("tar");
const ignore = require("ignore");
const { promisify } = require('util');
const libClient = require('../client.js');
const { getAllFiles, showConsoleLink } = require('../utils.js');
const { Command } = require('commander');
const { sdkForProject, sdkForConsole } = require('../sdks')
const { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log } = require('../parser')
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

const projects = new Command("projects").description(commandDescriptions['projects'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} ProjectsListRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, teamId
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsListRequestParams} params
 */
const projectsList = async ({queries,search,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects';
    let payload = {};
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
        if(console) {
            showConsoleLink('projects', 'list');
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} ProjectsCreateRequestParams
 * @property {string} projectId Unique Id. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, and hyphen. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Project name. Max length: 128 chars.
 * @property {string} teamId Team unique ID.
 * @property {Region} region Project Region.
 * @property {string} description Project description. Max length: 256 chars.
 * @property {string} logo Project logo.
 * @property {string} url Project URL.
 * @property {string} legalName Project legal Name. Max length: 256 chars.
 * @property {string} legalCountry Project legal Country. Max length: 256 chars.
 * @property {string} legalState Project legal State. Max length: 256 chars.
 * @property {string} legalCity Project legal City. Max length: 256 chars.
 * @property {string} legalAddress Project legal Address. Max length: 256 chars.
 * @property {string} legalTaxId Project legal Tax ID. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsCreateRequestParams} params
 */
const projectsCreate = async ({projectId,name,teamId,region,description,logo,url,legalName,legalCountry,legalState,legalCity,legalAddress,legalTaxId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} ProjectsGetRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsGetRequestParams} params
 */
const projectsGet = async ({projectId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}'.replace('{projectId}', projectId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('projects', 'get', projectId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} ProjectsUpdateRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} name Project name. Max length: 128 chars.
 * @property {string} description Project description. Max length: 256 chars.
 * @property {string} logo Project logo.
 * @property {string} url Project URL.
 * @property {string} legalName Project legal name. Max length: 256 chars.
 * @property {string} legalCountry Project legal country. Max length: 256 chars.
 * @property {string} legalState Project legal state. Max length: 256 chars.
 * @property {string} legalCity Project legal city. Max length: 256 chars.
 * @property {string} legalAddress Project legal address. Max length: 256 chars.
 * @property {string} legalTaxId Project legal tax ID. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateRequestParams} params
 */
const projectsUpdate = async ({projectId,name,description,logo,url,legalName,legalCountry,legalState,legalCity,legalAddress,legalTaxId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}'.replace('{projectId}', projectId);
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} ProjectsDeleteRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsDeleteRequestParams} params
 */
const projectsDelete = async ({projectId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}'.replace('{projectId}', projectId);
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
 * @typedef {Object} ProjectsUpdateApiStatusRequestParams
 * @property {string} projectId Project unique ID.
 * @property {Api} api API name.
 * @property {boolean} status API status.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateApiStatusRequestParams} params
 */
const projectsUpdateApiStatus = async ({projectId,api,status,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/api'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof api !== 'undefined') {
        payload['api'] = api;
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
    }

    return response;

}

/**
 * @typedef {Object} ProjectsUpdateApiStatusAllRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} status API status.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateApiStatusAllRequestParams} params
 */
const projectsUpdateApiStatusAll = async ({projectId,status,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/api/all'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof status !== 'undefined') {
        payload['status'] = status;
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
 * @typedef {Object} ProjectsUpdateAuthDurationRequestParams
 * @property {string} projectId Project unique ID.
 * @property {number} duration Project session length in seconds. Max length: 31536000 seconds.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateAuthDurationRequestParams} params
 */
const projectsUpdateAuthDuration = async ({projectId,duration,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/duration'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof duration !== 'undefined') {
        payload['duration'] = duration;
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
 * @typedef {Object} ProjectsUpdateAuthLimitRequestParams
 * @property {string} projectId Project unique ID.
 * @property {number} limit Set the max number of users allowed in this project. Use 0 for unlimited.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateAuthLimitRequestParams} params
 */
const projectsUpdateAuthLimit = async ({projectId,limit,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/limit'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof limit !== 'undefined') {
        payload['limit'] = limit;
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
 * @typedef {Object} ProjectsUpdateAuthSessionsLimitRequestParams
 * @property {string} projectId Project unique ID.
 * @property {number} limit Set the max number of users allowed in this project. Value allowed is between 1-100. Default is 10
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateAuthSessionsLimitRequestParams} params
 */
const projectsUpdateAuthSessionsLimit = async ({projectId,limit,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/max-sessions'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof limit !== 'undefined') {
        payload['limit'] = limit;
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
 * @typedef {Object} ProjectsUpdateMockNumbersRequestParams
 * @property {string} projectId Project unique ID.
 * @property {object[]} numbers An array of mock numbers and their corresponding verification codes (OTPs). Each number should be a valid E.164 formatted phone number. Maximum of 10 numbers are allowed.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateMockNumbersRequestParams} params
 */
const projectsUpdateMockNumbers = async ({projectId,numbers,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/mock-numbers'.replace('{projectId}', projectId);
    let payload = {};
    numbers = numbers === true ? [] : numbers;
    if (typeof numbers !== 'undefined') {
        payload['numbers'] = numbers;
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
 * @typedef {Object} ProjectsUpdateAuthPasswordDictionaryRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} enabled Set whether or not to enable checking user&#039;s password against most commonly used passwords. Default is false.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateAuthPasswordDictionaryRequestParams} params
 */
const projectsUpdateAuthPasswordDictionary = async ({projectId,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/password-dictionary'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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
 * @typedef {Object} ProjectsUpdateAuthPasswordHistoryRequestParams
 * @property {string} projectId Project unique ID.
 * @property {number} limit Set the max number of passwords to store in user history. User can&#039;t choose a new password that is already stored in the password history list.  Max number of passwords allowed in history is20. Default value is 0
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateAuthPasswordHistoryRequestParams} params
 */
const projectsUpdateAuthPasswordHistory = async ({projectId,limit,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/password-history'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof limit !== 'undefined') {
        payload['limit'] = limit;
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
 * @typedef {Object} ProjectsUpdatePersonalDataCheckRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} enabled Set whether or not to check a password for similarity with personal data. Default is false.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdatePersonalDataCheckRequestParams} params
 */
const projectsUpdatePersonalDataCheck = async ({projectId,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/personal-data'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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
 * @typedef {Object} ProjectsUpdateSessionAlertsRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} alerts Set to true to enable session emails.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateSessionAlertsRequestParams} params
 */
const projectsUpdateSessionAlerts = async ({projectId,alerts,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/session-alerts'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof alerts !== 'undefined') {
        payload['alerts'] = alerts;
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
 * @typedef {Object} ProjectsUpdateAuthStatusRequestParams
 * @property {string} projectId Project unique ID.
 * @property {AuthMethod} method Auth Method. Possible values: email-password,magic-url,email-otp,anonymous,invites,jwt,phone
 * @property {boolean} status Set the status of this auth method.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateAuthStatusRequestParams} params
 */
const projectsUpdateAuthStatus = async ({projectId,method,status,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/{method}'.replace('{projectId}', projectId).replace('{method}', method);
    let payload = {};
    if (typeof status !== 'undefined') {
        payload['status'] = status;
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
 * @typedef {Object} ProjectsCreateJWTRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string[]} scopes List of scopes allowed for JWT key. Maximum of 100 scopes are allowed.
 * @property {number} duration Time in seconds before JWT expires. Default duration is 900 seconds, and maximum is 3600 seconds.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsCreateJWTRequestParams} params
 */
const projectsCreateJWT = async ({projectId,scopes,duration,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/jwts'.replace('{projectId}', projectId);
    let payload = {};
    scopes = scopes === true ? [] : scopes;
    if (typeof scopes !== 'undefined') {
        payload['scopes'] = scopes;
    }
    if (typeof duration !== 'undefined') {
        payload['duration'] = duration;
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
 * @typedef {Object} ProjectsListKeysRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsListKeysRequestParams} params
 */
const projectsListKeys = async ({projectId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/keys'.replace('{projectId}', projectId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('projects', 'listKeys', projectId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} ProjectsCreateKeyRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} name Key name. Max length: 128 chars.
 * @property {string[]} scopes Key scopes list. Maximum of 100 scopes are allowed.
 * @property {string} expire Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsCreateKeyRequestParams} params
 */
const projectsCreateKey = async ({projectId,name,scopes,expire,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/keys'.replace('{projectId}', projectId);
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} ProjectsGetKeyRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} keyId Key unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsGetKeyRequestParams} params
 */
const projectsGetKey = async ({projectId,keyId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('projects', 'getKey', projectId, keyId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} ProjectsUpdateKeyRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} keyId Key unique ID.
 * @property {string} name Key name. Max length: 128 chars.
 * @property {string[]} scopes Key scopes list. Maximum of 100 events are allowed.
 * @property {string} expire Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateKeyRequestParams} params
 */
const projectsUpdateKey = async ({projectId,keyId,name,scopes,expire,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} ProjectsDeleteKeyRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} keyId Key unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsDeleteKeyRequestParams} params
 */
const projectsDeleteKey = async ({projectId,keyId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
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
 * @typedef {Object} ProjectsUpdateOAuth2RequestParams
 * @property {string} projectId Project unique ID.
 * @property {OAuthProvider} provider Provider Name
 * @property {string} appId Provider app ID. Max length: 256 chars.
 * @property {string} secret Provider secret key. Max length: 512 chars.
 * @property {boolean} enabled Provider status. Set to &#039;false&#039; to disable new session creation.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateOAuth2RequestParams} params
 */
const projectsUpdateOAuth2 = async ({projectId,provider,appId,secret,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/oauth2'.replace('{projectId}', projectId);
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} ProjectsListPlatformsRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsListPlatformsRequestParams} params
 */
const projectsListPlatforms = async ({projectId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/platforms'.replace('{projectId}', projectId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('projects', 'listPlatforms', projectId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} ProjectsCreatePlatformRequestParams
 * @property {string} projectId Project unique ID.
 * @property {PlatformType} type Platform type.
 * @property {string} name Platform name. Max length: 128 chars.
 * @property {string} key Package name for Android or bundle ID for iOS or macOS. Max length: 256 chars.
 * @property {string} store App store or Google Play store ID. Max length: 256 chars.
 * @property {string} hostname Platform client hostname. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsCreatePlatformRequestParams} params
 */
const projectsCreatePlatform = async ({projectId,type,name,key,store,hostname,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/platforms'.replace('{projectId}', projectId);
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} ProjectsGetPlatformRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} platformId Platform unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsGetPlatformRequestParams} params
 */
const projectsGetPlatform = async ({projectId,platformId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/platforms/{platformId}'.replace('{projectId}', projectId).replace('{platformId}', platformId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('projects', 'getPlatform', projectId, platformId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} ProjectsUpdatePlatformRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} platformId Platform unique ID.
 * @property {string} name Platform name. Max length: 128 chars.
 * @property {string} key Package name for android or bundle ID for iOS. Max length: 256 chars.
 * @property {string} store App store or Google Play store ID. Max length: 256 chars.
 * @property {string} hostname Platform client URL. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdatePlatformRequestParams} params
 */
const projectsUpdatePlatform = async ({projectId,platformId,name,key,store,hostname,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/platforms/{platformId}'.replace('{projectId}', projectId).replace('{platformId}', platformId);
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} ProjectsDeletePlatformRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} platformId Platform unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsDeletePlatformRequestParams} params
 */
const projectsDeletePlatform = async ({projectId,platformId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/platforms/{platformId}'.replace('{projectId}', projectId).replace('{platformId}', platformId);
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
 * @typedef {Object} ProjectsUpdateServiceStatusRequestParams
 * @property {string} projectId Project unique ID.
 * @property {ApiService} service Service name.
 * @property {boolean} status Service status.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateServiceStatusRequestParams} params
 */
const projectsUpdateServiceStatus = async ({projectId,service,status,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/service'.replace('{projectId}', projectId);
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} ProjectsUpdateServiceStatusAllRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} status Service status.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateServiceStatusAllRequestParams} params
 */
const projectsUpdateServiceStatusAll = async ({projectId,status,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/service/all'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof status !== 'undefined') {
        payload['status'] = status;
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
 * @typedef {Object} ProjectsUpdateSmtpRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} enabled Enable custom SMTP service
 * @property {string} senderName Name of the email sender
 * @property {string} senderEmail Email of the sender
 * @property {string} replyTo Reply to email
 * @property {string} host SMTP server host name
 * @property {number} port SMTP server port
 * @property {string} username SMTP server username
 * @property {string} password SMTP server password
 * @property {SMTPSecure} secure Does SMTP server use secure connection
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateSmtpRequestParams} params
 */
const projectsUpdateSmtp = async ({projectId,enabled,senderName,senderEmail,replyTo,host,port,username,password,secure,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/smtp'.replace('{projectId}', projectId);
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} ProjectsCreateSmtpTestRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string[]} emails Array of emails to send test email to. Maximum of 10 emails are allowed.
 * @property {string} senderName Name of the email sender
 * @property {string} senderEmail Email of the sender
 * @property {string} host SMTP server host name
 * @property {string} replyTo Reply to email
 * @property {number} port SMTP server port
 * @property {string} username SMTP server username
 * @property {string} password SMTP server password
 * @property {SMTPSecure} secure Does SMTP server use secure connection
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsCreateSmtpTestRequestParams} params
 */
const projectsCreateSmtpTest = async ({projectId,emails,senderName,senderEmail,host,replyTo,port,username,password,secure,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/smtp/tests'.replace('{projectId}', projectId);
    let payload = {};
    emails = emails === true ? [] : emails;
    if (typeof emails !== 'undefined') {
        payload['emails'] = emails;
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

    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} ProjectsUpdateTeamRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} teamId Team ID of the team to transfer project to.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateTeamRequestParams} params
 */
const projectsUpdateTeam = async ({projectId,teamId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/team'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof teamId !== 'undefined') {
        payload['teamId'] = teamId;
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
 * @typedef {Object} ProjectsGetEmailTemplateRequestParams
 * @property {string} projectId Project unique ID.
 * @property {EmailTemplateType} type Template type
 * @property {EmailTemplateLocale} locale Template locale
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsGetEmailTemplateRequestParams} params
 */
const projectsGetEmailTemplate = async ({projectId,type,locale,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/templates/email/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} ProjectsUpdateEmailTemplateRequestParams
 * @property {string} projectId Project unique ID.
 * @property {EmailTemplateType} type Template type
 * @property {EmailTemplateLocale} locale Template locale
 * @property {string} subject Email Subject
 * @property {string} message Template message
 * @property {string} senderName Name of the email sender
 * @property {string} senderEmail Email of the sender
 * @property {string} replyTo Reply to email
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateEmailTemplateRequestParams} params
 */
const projectsUpdateEmailTemplate = async ({projectId,type,locale,subject,message,senderName,senderEmail,replyTo,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/templates/email/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} ProjectsDeleteEmailTemplateRequestParams
 * @property {string} projectId Project unique ID.
 * @property {EmailTemplateType} type Template type
 * @property {EmailTemplateLocale} locale Template locale
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsDeleteEmailTemplateRequestParams} params
 */
const projectsDeleteEmailTemplate = async ({projectId,type,locale,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/templates/email/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
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
 * @typedef {Object} ProjectsGetSmsTemplateRequestParams
 * @property {string} projectId Project unique ID.
 * @property {SmsTemplateType} type Template type
 * @property {SmsTemplateLocale} locale Template locale
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsGetSmsTemplateRequestParams} params
 */
const projectsGetSmsTemplate = async ({projectId,type,locale,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/templates/sms/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} ProjectsUpdateSmsTemplateRequestParams
 * @property {string} projectId Project unique ID.
 * @property {SmsTemplateType} type Template type
 * @property {SmsTemplateLocale} locale Template locale
 * @property {string} message Template message
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateSmsTemplateRequestParams} params
 */
const projectsUpdateSmsTemplate = async ({projectId,type,locale,message,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/templates/sms/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
    let payload = {};
    if (typeof message !== 'undefined') {
        payload['message'] = message;
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
 * @typedef {Object} ProjectsDeleteSmsTemplateRequestParams
 * @property {string} projectId Project unique ID.
 * @property {SmsTemplateType} type Template type
 * @property {SmsTemplateLocale} locale Template locale
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsDeleteSmsTemplateRequestParams} params
 */
const projectsDeleteSmsTemplate = async ({projectId,type,locale,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/templates/sms/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
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
 * @typedef {Object} ProjectsListWebhooksRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsListWebhooksRequestParams} params
 */
const projectsListWebhooks = async ({projectId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/webhooks'.replace('{projectId}', projectId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('projects', 'listWebhooks', projectId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} ProjectsCreateWebhookRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} name Webhook name. Max length: 128 chars.
 * @property {string[]} events Events list. Maximum of 100 events are allowed.
 * @property {string} url Webhook URL.
 * @property {boolean} security Certificate verification, false for disabled or true for enabled.
 * @property {boolean} enabled Enable or disable a webhook.
 * @property {string} httpUser Webhook HTTP user. Max length: 256 chars.
 * @property {string} httpPass Webhook HTTP password. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsCreateWebhookRequestParams} params
 */
const projectsCreateWebhook = async ({projectId,name,events,url,security,enabled,httpUser,httpPass,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/webhooks'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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
    }

    return response;

}

/**
 * @typedef {Object} ProjectsGetWebhookRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} webhookId Webhook unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsGetWebhookRequestParams} params
 */
const projectsGetWebhook = async ({projectId,webhookId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/webhooks/{webhookId}'.replace('{projectId}', projectId).replace('{webhookId}', webhookId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('projects', 'getWebhook', projectId, webhookId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} ProjectsUpdateWebhookRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} webhookId Webhook unique ID.
 * @property {string} name Webhook name. Max length: 128 chars.
 * @property {string[]} events Events list. Maximum of 100 events are allowed.
 * @property {string} url Webhook URL.
 * @property {boolean} security Certificate verification, false for disabled or true for enabled.
 * @property {boolean} enabled Enable or disable a webhook.
 * @property {string} httpUser Webhook HTTP user. Max length: 256 chars.
 * @property {string} httpPass Webhook HTTP password. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateWebhookRequestParams} params
 */
const projectsUpdateWebhook = async ({projectId,webhookId,name,events,url,security,enabled,httpUser,httpPass,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/webhooks/{webhookId}'.replace('{projectId}', projectId).replace('{webhookId}', webhookId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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
    }

    return response;

}

/**
 * @typedef {Object} ProjectsDeleteWebhookRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} webhookId Webhook unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsDeleteWebhookRequestParams} params
 */
const projectsDeleteWebhook = async ({projectId,webhookId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/webhooks/{webhookId}'.replace('{projectId}', projectId).replace('{webhookId}', webhookId);
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
 * @typedef {Object} ProjectsUpdateWebhookSignatureRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} webhookId Webhook unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateWebhookSignatureRequestParams} params
 */
const projectsUpdateWebhookSignature = async ({projectId,webhookId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/webhooks/{webhookId}/signature'.replace('{projectId}', projectId).replace('{webhookId}', webhookId);
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

projects
    .command(`list`)
    .description(``)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, teamId`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsList))

projects
    .command(`create`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, and hyphen. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Project name. Max length: 128 chars.`)
    .requiredOption(`--team-id <team-id>`, `Team unique ID.`)
    .option(`--region <region>`, `Project Region.`)
    .option(`--description <description>`, `Project description. Max length: 256 chars.`)
    .option(`--logo <logo>`, `Project logo.`)
    .option(`--url <url>`, `Project URL.`)
    .option(`--legal-name <legal-name>`, `Project legal Name. Max length: 256 chars.`)
    .option(`--legal-country <legal-country>`, `Project legal Country. Max length: 256 chars.`)
    .option(`--legal-state <legal-state>`, `Project legal State. Max length: 256 chars.`)
    .option(`--legal-city <legal-city>`, `Project legal City. Max length: 256 chars.`)
    .option(`--legal-address <legal-address>`, `Project legal Address. Max length: 256 chars.`)
    .option(`--legal-tax-id <legal-tax-id>`, `Project legal Tax ID. Max length: 256 chars.`)
    .action(actionRunner(projectsCreate))

projects
    .command(`get`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsGet))

projects
    .command(`update`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--name <name>`, `Project name. Max length: 128 chars.`)
    .option(`--description <description>`, `Project description. Max length: 256 chars.`)
    .option(`--logo <logo>`, `Project logo.`)
    .option(`--url <url>`, `Project URL.`)
    .option(`--legal-name <legal-name>`, `Project legal name. Max length: 256 chars.`)
    .option(`--legal-country <legal-country>`, `Project legal country. Max length: 256 chars.`)
    .option(`--legal-state <legal-state>`, `Project legal state. Max length: 256 chars.`)
    .option(`--legal-city <legal-city>`, `Project legal city. Max length: 256 chars.`)
    .option(`--legal-address <legal-address>`, `Project legal address. Max length: 256 chars.`)
    .option(`--legal-tax-id <legal-tax-id>`, `Project legal tax ID. Max length: 256 chars.`)
    .action(actionRunner(projectsUpdate))

projects
    .command(`delete`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .action(actionRunner(projectsDelete))

projects
    .command(`update-api-status`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--api <api>`, `API name.`)
    .requiredOption(`--status <status>`, `API status.`, parseBool)
    .action(actionRunner(projectsUpdateApiStatus))

projects
    .command(`update-api-status-all`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--status <status>`, `API status.`, parseBool)
    .action(actionRunner(projectsUpdateApiStatusAll))

projects
    .command(`update-auth-duration`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--duration <duration>`, `Project session length in seconds. Max length: 31536000 seconds.`, parseInteger)
    .action(actionRunner(projectsUpdateAuthDuration))

projects
    .command(`update-auth-limit`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--limit <limit>`, `Set the max number of users allowed in this project. Use 0 for unlimited.`, parseInteger)
    .action(actionRunner(projectsUpdateAuthLimit))

projects
    .command(`update-auth-sessions-limit`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--limit <limit>`, `Set the max number of users allowed in this project. Value allowed is between 1-100. Default is 10`, parseInteger)
    .action(actionRunner(projectsUpdateAuthSessionsLimit))

projects
    .command(`update-mock-numbers`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--numbers [numbers...]`, `An array of mock numbers and their corresponding verification codes (OTPs). Each number should be a valid E.164 formatted phone number. Maximum of 10 numbers are allowed.`)
    .action(actionRunner(projectsUpdateMockNumbers))

projects
    .command(`update-auth-password-dictionary`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--enabled <enabled>`, `Set whether or not to enable checking user's password against most commonly used passwords. Default is false.`, parseBool)
    .action(actionRunner(projectsUpdateAuthPasswordDictionary))

projects
    .command(`update-auth-password-history`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--limit <limit>`, `Set the max number of passwords to store in user history. User can't choose a new password that is already stored in the password history list.  Max number of passwords allowed in history is20. Default value is 0`, parseInteger)
    .action(actionRunner(projectsUpdateAuthPasswordHistory))

projects
    .command(`update-personal-data-check`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--enabled <enabled>`, `Set whether or not to check a password for similarity with personal data. Default is false.`, parseBool)
    .action(actionRunner(projectsUpdatePersonalDataCheck))

projects
    .command(`update-session-alerts`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--alerts <alerts>`, `Set to true to enable session emails.`, parseBool)
    .action(actionRunner(projectsUpdateSessionAlerts))

projects
    .command(`update-auth-status`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--method <method>`, `Auth Method. Possible values: email-password,magic-url,email-otp,anonymous,invites,jwt,phone`)
    .requiredOption(`--status <status>`, `Set the status of this auth method.`, parseBool)
    .action(actionRunner(projectsUpdateAuthStatus))

projects
    .command(`create-jwt`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--scopes [scopes...]`, `List of scopes allowed for JWT key. Maximum of 100 scopes are allowed.`)
    .option(`--duration <duration>`, `Time in seconds before JWT expires. Default duration is 900 seconds, and maximum is 3600 seconds.`, parseInteger)
    .action(actionRunner(projectsCreateJWT))

projects
    .command(`list-keys`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsListKeys))

projects
    .command(`create-key`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
    .requiredOption(`--scopes [scopes...]`, `Key scopes list. Maximum of 100 scopes are allowed.`)
    .option(`--expire <expire>`, `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.`)
    .action(actionRunner(projectsCreateKey))

projects
    .command(`get-key`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsGetKey))

projects
    .command(`update-key`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
    .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
    .requiredOption(`--scopes [scopes...]`, `Key scopes list. Maximum of 100 events are allowed.`)
    .option(`--expire <expire>`, `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.`)
    .action(actionRunner(projectsUpdateKey))

projects
    .command(`delete-key`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
    .action(actionRunner(projectsDeleteKey))

projects
    .command(`update-o-auth-2`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--provider <provider>`, `Provider Name`)
    .option(`--app-id <app-id>`, `Provider app ID. Max length: 256 chars.`)
    .option(`--secret <secret>`, `Provider secret key. Max length: 512 chars.`)
    .option(`--enabled <enabled>`, `Provider status. Set to 'false' to disable new session creation.`, parseBool)
    .action(actionRunner(projectsUpdateOAuth2))

projects
    .command(`list-platforms`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsListPlatforms))

projects
    .command(`create-platform`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Platform type.`)
    .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
    .option(`--key <key>`, `Package name for Android or bundle ID for iOS or macOS. Max length: 256 chars.`)
    .option(`--store <store>`, `App store or Google Play store ID. Max length: 256 chars.`)
    .option(`--hostname <hostname>`, `Platform client hostname. Max length: 256 chars.`)
    .action(actionRunner(projectsCreatePlatform))

projects
    .command(`get-platform`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--platform-id <platform-id>`, `Platform unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsGetPlatform))

projects
    .command(`update-platform`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--platform-id <platform-id>`, `Platform unique ID.`)
    .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
    .option(`--key <key>`, `Package name for android or bundle ID for iOS. Max length: 256 chars.`)
    .option(`--store <store>`, `App store or Google Play store ID. Max length: 256 chars.`)
    .option(`--hostname <hostname>`, `Platform client URL. Max length: 256 chars.`)
    .action(actionRunner(projectsUpdatePlatform))

projects
    .command(`delete-platform`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--platform-id <platform-id>`, `Platform unique ID.`)
    .action(actionRunner(projectsDeletePlatform))

projects
    .command(`update-service-status`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--service <service>`, `Service name.`)
    .requiredOption(`--status <status>`, `Service status.`, parseBool)
    .action(actionRunner(projectsUpdateServiceStatus))

projects
    .command(`update-service-status-all`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--status <status>`, `Service status.`, parseBool)
    .action(actionRunner(projectsUpdateServiceStatusAll))

projects
    .command(`update-smtp`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--enabled <enabled>`, `Enable custom SMTP service`, parseBool)
    .option(`--sender-name <sender-name>`, `Name of the email sender`)
    .option(`--sender-email <sender-email>`, `Email of the sender`)
    .option(`--reply-to <reply-to>`, `Reply to email`)
    .option(`--host <host>`, `SMTP server host name`)
    .option(`--port <port>`, `SMTP server port`, parseInteger)
    .option(`--username <username>`, `SMTP server username`)
    .option(`--password <password>`, `SMTP server password`)
    .option(`--secure <secure>`, `Does SMTP server use secure connection`)
    .action(actionRunner(projectsUpdateSmtp))

projects
    .command(`create-smtp-test`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--emails [emails...]`, `Array of emails to send test email to. Maximum of 10 emails are allowed.`)
    .requiredOption(`--sender-name <sender-name>`, `Name of the email sender`)
    .requiredOption(`--sender-email <sender-email>`, `Email of the sender`)
    .requiredOption(`--host <host>`, `SMTP server host name`)
    .option(`--reply-to <reply-to>`, `Reply to email`)
    .option(`--port <port>`, `SMTP server port`, parseInteger)
    .option(`--username <username>`, `SMTP server username`)
    .option(`--password <password>`, `SMTP server password`)
    .option(`--secure <secure>`, `Does SMTP server use secure connection`)
    .action(actionRunner(projectsCreateSmtpTest))

projects
    .command(`update-team`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--team-id <team-id>`, `Team ID of the team to transfer project to.`)
    .action(actionRunner(projectsUpdateTeam))

projects
    .command(`get-email-template`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsGetEmailTemplate))

projects
    .command(`update-email-template`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .requiredOption(`--subject <subject>`, `Email Subject`)
    .requiredOption(`--message <message>`, `Template message`)
    .option(`--sender-name <sender-name>`, `Name of the email sender`)
    .option(`--sender-email <sender-email>`, `Email of the sender`)
    .option(`--reply-to <reply-to>`, `Reply to email`)
    .action(actionRunner(projectsUpdateEmailTemplate))

projects
    .command(`delete-email-template`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsDeleteEmailTemplate))

projects
    .command(`get-sms-template`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsGetSmsTemplate))

projects
    .command(`update-sms-template`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .requiredOption(`--message <message>`, `Template message`)
    .action(actionRunner(projectsUpdateSmsTemplate))

projects
    .command(`delete-sms-template`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsDeleteSmsTemplate))

projects
    .command(`list-webhooks`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsListWebhooks))

projects
    .command(`create-webhook`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--name <name>`, `Webhook name. Max length: 128 chars.`)
    .requiredOption(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
    .requiredOption(`--url <url>`, `Webhook URL.`)
    .requiredOption(`--security <security>`, `Certificate verification, false for disabled or true for enabled.`, parseBool)
    .option(`--enabled <enabled>`, `Enable or disable a webhook.`, parseBool)
    .option(`--http-user <http-user>`, `Webhook HTTP user. Max length: 256 chars.`)
    .option(`--http-pass <http-pass>`, `Webhook HTTP password. Max length: 256 chars.`)
    .action(actionRunner(projectsCreateWebhook))

projects
    .command(`get-webhook`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--webhook-id <webhook-id>`, `Webhook unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsGetWebhook))

projects
    .command(`update-webhook`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--webhook-id <webhook-id>`, `Webhook unique ID.`)
    .requiredOption(`--name <name>`, `Webhook name. Max length: 128 chars.`)
    .requiredOption(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
    .requiredOption(`--url <url>`, `Webhook URL.`)
    .requiredOption(`--security <security>`, `Certificate verification, false for disabled or true for enabled.`, parseBool)
    .option(`--enabled <enabled>`, `Enable or disable a webhook.`, parseBool)
    .option(`--http-user <http-user>`, `Webhook HTTP user. Max length: 256 chars.`)
    .option(`--http-pass <http-pass>`, `Webhook HTTP password. Max length: 256 chars.`)
    .action(actionRunner(projectsUpdateWebhook))

projects
    .command(`delete-webhook`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--webhook-id <webhook-id>`, `Webhook unique ID.`)
    .action(actionRunner(projectsDeleteWebhook))

projects
    .command(`update-webhook-signature`)
    .description(``)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--webhook-id <webhook-id>`, `Webhook unique ID.`)
    .action(actionRunner(projectsUpdateWebhookSignature))

module.exports = {
    projects,
    projectsList,
    projectsCreate,
    projectsGet,
    projectsUpdate,
    projectsDelete,
    projectsUpdateApiStatus,
    projectsUpdateApiStatusAll,
    projectsUpdateAuthDuration,
    projectsUpdateAuthLimit,
    projectsUpdateAuthSessionsLimit,
    projectsUpdateMockNumbers,
    projectsUpdateAuthPasswordDictionary,
    projectsUpdateAuthPasswordHistory,
    projectsUpdatePersonalDataCheck,
    projectsUpdateSessionAlerts,
    projectsUpdateAuthStatus,
    projectsCreateJWT,
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
    projectsUpdateSmtp,
    projectsCreateSmtpTest,
    projectsUpdateTeam,
    projectsGetEmailTemplate,
    projectsUpdateEmailTemplate,
    projectsDeleteEmailTemplate,
    projectsGetSmsTemplate,
    projectsUpdateSmsTemplate,
    projectsDeleteSmsTemplate,
    projectsListWebhooks,
    projectsCreateWebhook,
    projectsGetWebhook,
    projectsUpdateWebhook,
    projectsDeleteWebhook,
    projectsUpdateWebhookSignature
};
