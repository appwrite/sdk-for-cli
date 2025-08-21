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
 * @typedef {Object} ProjectsUpdateAPIStatusRequestParams
 * @property {string} projectId Project unique ID.
 * @property {Api} api API name.
 * @property {boolean} status API status.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateAPIStatusRequestParams} params
 */
const projectsUpdateAPIStatus = async ({projectId,api,status,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
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
 * @typedef {Object} ProjectsUpdateAPIStatusAllRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} status API status.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateAPIStatusAllRequestParams} params
 */
const projectsUpdateAPIStatusAll = async ({projectId,status,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
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
 * @typedef {Object} ProjectsUpdateMembershipsPrivacyRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} userName Set to true to show userName to members of a team.
 * @property {boolean} userEmail Set to true to show email to members of a team.
 * @property {boolean} mfa Set to true to show mfa to members of a team.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateMembershipsPrivacyRequestParams} params
 */
const projectsUpdateMembershipsPrivacy = async ({projectId,userName,userEmail,mfa,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/memberships-privacy'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof userName !== 'undefined') {
        payload['userName'] = userName;
    }
    if (typeof userEmail !== 'undefined') {
        payload['userEmail'] = userEmail;
    }
    if (typeof mfa !== 'undefined') {
        payload['mfa'] = mfa;
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
 * @typedef {Object} ProjectsUpdateSessionInvalidationRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} enabled Update authentication session invalidation status. Use this endpoint to enable or disable session invalidation on password change
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateSessionInvalidationRequestParams} params
 */
const projectsUpdateSessionInvalidation = async ({projectId,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/session-invalidation'.replace('{projectId}', projectId);
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
 * @typedef {Object} ProjectsListDevKeysRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: accessedAt, expire
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsListDevKeysRequestParams} params
 */
const projectsListDevKeys = async ({projectId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/dev-keys'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('projects', 'listDevKeys', projectId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} ProjectsCreateDevKeyRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} name Key name. Max length: 128 chars.
 * @property {string} expire Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsCreateDevKeyRequestParams} params
 */
const projectsCreateDevKey = async ({projectId,name,expire,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/dev-keys'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
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
 * @typedef {Object} ProjectsGetDevKeyRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} keyId Key unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsGetDevKeyRequestParams} params
 */
const projectsGetDevKey = async ({projectId,keyId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/dev-keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('projects', 'getDevKey', projectId, keyId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} ProjectsUpdateDevKeyRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} keyId Key unique ID.
 * @property {string} name Key name. Max length: 128 chars.
 * @property {string} expire Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateDevKeyRequestParams} params
 */
const projectsUpdateDevKey = async ({projectId,keyId,name,expire,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/dev-keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
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
 * @typedef {Object} ProjectsDeleteDevKeyRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} keyId Key unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsDeleteDevKeyRequestParams} params
 */
const projectsDeleteDevKey = async ({projectId,keyId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/dev-keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
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
 * @typedef {Object} ProjectsUpdateSMTPRequestParams
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
 * @param {ProjectsUpdateSMTPRequestParams} params
 */
const projectsUpdateSMTP = async ({projectId,enabled,senderName,senderEmail,replyTo,host,port,username,password,secure,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
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
 * @typedef {Object} ProjectsCreateSMTPTestRequestParams
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
 * @param {ProjectsCreateSMTPTestRequestParams} params
 */
const projectsCreateSMTPTest = async ({projectId,emails,senderName,senderEmail,host,replyTo,port,username,password,secure,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
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
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} ProjectsGetSMSTemplateRequestParams
 * @property {string} projectId Project unique ID.
 * @property {SmsTemplateType} type Template type
 * @property {SmsTemplateLocale} locale Template locale
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsGetSMSTemplateRequestParams} params
 */
const projectsGetSMSTemplate = async ({projectId,type,locale,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/templates/sms/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
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
 * @typedef {Object} ProjectsUpdateSMSTemplateRequestParams
 * @property {string} projectId Project unique ID.
 * @property {SmsTemplateType} type Template type
 * @property {SmsTemplateLocale} locale Template locale
 * @property {string} message Template message
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateSMSTemplateRequestParams} params
 */
const projectsUpdateSMSTemplate = async ({projectId,type,locale,message,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
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
 * @typedef {Object} ProjectsDeleteSMSTemplateRequestParams
 * @property {string} projectId Project unique ID.
 * @property {SmsTemplateType} type Template type
 * @property {SmsTemplateLocale} locale Template locale
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsDeleteSMSTemplateRequestParams} params
 */
const projectsDeleteSMSTemplate = async ({projectId,type,locale,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
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
    .description(`Get a list of all projects. You can use the query params to filter your results. `)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, teamId`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsList))

projects
    .command(`create`)
    .description(`Create a new project. You can create a maximum of 100 projects per account. `)
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
    .description(`Get a project by its unique ID. This endpoint allows you to retrieve the project's details, including its name, description, team, region, and other metadata. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsGet))

projects
    .command(`update`)
    .description(`Update a project by its unique ID.`)
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
    .description(`Delete a project by its unique ID.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .action(actionRunner(projectsDelete))

projects
    .command(`update-api-status`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'update-api-status' instead] Update the status of a specific API type. Use this endpoint to enable or disable API types such as REST, GraphQL and Realtime.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--api <api>`, `API name.`)
    .requiredOption(`--status [value]`, `API status.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateApiStatus))

projects
    .command(`update-api-status`)
    .description(`Update the status of a specific API type. Use this endpoint to enable or disable API types such as REST, GraphQL and Realtime.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--api <api>`, `API name.`)
    .requiredOption(`--status [value]`, `API status.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateAPIStatus))

projects
    .command(`update-api-status-all`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'update-api-status-all' instead] Update the status of all API types. Use this endpoint to enable or disable API types such as REST, GraphQL and Realtime all at once.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--status [value]`, `API status.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateApiStatusAll))

projects
    .command(`update-api-status-all`)
    .description(`Update the status of all API types. Use this endpoint to enable or disable API types such as REST, GraphQL and Realtime all at once.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--status [value]`, `API status.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateAPIStatusAll))

projects
    .command(`update-auth-duration`)
    .description(`Update how long sessions created within a project should stay active for.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--duration <duration>`, `Project session length in seconds. Max length: 31536000 seconds.`, parseInteger)
    .action(actionRunner(projectsUpdateAuthDuration))

projects
    .command(`update-auth-limit`)
    .description(`Update the maximum number of users allowed in this project. Set to 0 for unlimited users. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--limit <limit>`, `Set the max number of users allowed in this project. Use 0 for unlimited.`, parseInteger)
    .action(actionRunner(projectsUpdateAuthLimit))

projects
    .command(`update-auth-sessions-limit`)
    .description(`Update the maximum number of sessions allowed per user within the project, if the limit is hit the oldest session will be deleted to make room for new sessions.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--limit <limit>`, `Set the max number of users allowed in this project. Value allowed is between 1-100. Default is 10`, parseInteger)
    .action(actionRunner(projectsUpdateAuthSessionsLimit))

projects
    .command(`update-memberships-privacy`)
    .description(`Update project membership privacy settings. Use this endpoint to control what user information is visible to other team members, such as user name, email, and MFA status. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--user-name [value]`, `Set to true to show userName to members of a team.`, (value) => value === undefined ? true : parseBool(value))
    .requiredOption(`--user-email [value]`, `Set to true to show email to members of a team.`, (value) => value === undefined ? true : parseBool(value))
    .requiredOption(`--mfa [value]`, `Set to true to show mfa to members of a team.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateMembershipsPrivacy))

projects
    .command(`update-mock-numbers`)
    .description(`Update the list of mock phone numbers for testing. Use these numbers to bypass SMS verification in development. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--numbers [numbers...]`, `An array of mock numbers and their corresponding verification codes (OTPs). Each number should be a valid E.164 formatted phone number. Maximum of 10 numbers are allowed.`)
    .action(actionRunner(projectsUpdateMockNumbers))

projects
    .command(`update-auth-password-dictionary`)
    .description(`Enable or disable checking user passwords against common passwords dictionary. This helps ensure users don't use common and insecure passwords. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--enabled [value]`, `Set whether or not to enable checking user's password against most commonly used passwords. Default is false.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateAuthPasswordDictionary))

projects
    .command(`update-auth-password-history`)
    .description(`Update the authentication password history requirement. Use this endpoint to require new passwords to be different than the last X amount of previously used ones.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--limit <limit>`, `Set the max number of passwords to store in user history. User can't choose a new password that is already stored in the password history list.  Max number of passwords allowed in history is20. Default value is 0`, parseInteger)
    .action(actionRunner(projectsUpdateAuthPasswordHistory))

projects
    .command(`update-personal-data-check`)
    .description(`Enable or disable checking user passwords against their personal data. This helps prevent users from using personal information in their passwords. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--enabled [value]`, `Set whether or not to check a password for similarity with personal data. Default is false.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdatePersonalDataCheck))

projects
    .command(`update-session-alerts`)
    .description(`Enable or disable session email alerts. When enabled, users will receive email notifications when new sessions are created.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--alerts [value]`, `Set to true to enable session emails.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateSessionAlerts))

projects
    .command(`update-session-invalidation`)
    .description(`Invalidate all existing sessions. An optional auth security setting for projects, and enabled by default for console project.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--enabled [value]`, `Update authentication session invalidation status. Use this endpoint to enable or disable session invalidation on password change`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateSessionInvalidation))

projects
    .command(`update-auth-status`)
    .description(`Update the status of a specific authentication method. Use this endpoint to enable or disable different authentication methods such as email, magic urls or sms in your project. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--method <method>`, `Auth Method. Possible values: email-password,magic-url,email-otp,anonymous,invites,jwt,phone`)
    .requiredOption(`--status [value]`, `Set the status of this auth method.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateAuthStatus))

projects
    .command(`list-dev-keys`)
    .description(`List all the project\'s dev keys. Dev keys are project specific and allow you to bypass rate limits and get better error logging during development.'`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: accessedAt, expire`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsListDevKeys))

projects
    .command(`create-dev-key`)
    .description(`Create a new project dev key. Dev keys are project specific and allow you to bypass rate limits and get better error logging during development. Strictly meant for development purposes only.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
    .requiredOption(`--expire <expire>`, `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format.`)
    .action(actionRunner(projectsCreateDevKey))

projects
    .command(`get-dev-key`)
    .description(`Get a project\'s dev key by its unique ID. Dev keys are project specific and allow you to bypass rate limits and get better error logging during development.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsGetDevKey))

projects
    .command(`update-dev-key`)
    .description(`Update a project\'s dev key by its unique ID. Use this endpoint to update a project\'s dev key name or expiration time.'`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
    .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
    .requiredOption(`--expire <expire>`, `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format.`)
    .action(actionRunner(projectsUpdateDevKey))

projects
    .command(`delete-dev-key`)
    .description(`Delete a project\'s dev key by its unique ID. Once deleted, the key will no longer allow bypassing of rate limits and better logging of errors.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
    .action(actionRunner(projectsDeleteDevKey))

projects
    .command(`create-jwt`)
    .description(`Create a new JWT token. This token can be used to authenticate users with custom scopes and expiration time. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--scopes [scopes...]`, `List of scopes allowed for JWT key. Maximum of 100 scopes are allowed.`)
    .option(`--duration <duration>`, `Time in seconds before JWT expires. Default duration is 900 seconds, and maximum is 3600 seconds.`, parseInteger)
    .action(actionRunner(projectsCreateJWT))

projects
    .command(`list-keys`)
    .description(`Get a list of all API keys from the current project. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsListKeys))

projects
    .command(`create-key`)
    .description(`Create a new API key. It's recommended to have multiple API keys with strict scopes for separate functions within your project.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
    .requiredOption(`--scopes [scopes...]`, `Key scopes list. Maximum of 100 scopes are allowed.`)
    .option(`--expire <expire>`, `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.`)
    .action(actionRunner(projectsCreateKey))

projects
    .command(`get-key`)
    .description(`Get a key by its unique ID. This endpoint returns details about a specific API key in your project including it's scopes.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsGetKey))

projects
    .command(`update-key`)
    .description(`Update a key by its unique ID. Use this endpoint to update the name, scopes, or expiration time of an API key. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
    .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
    .requiredOption(`--scopes [scopes...]`, `Key scopes list. Maximum of 100 events are allowed.`)
    .option(`--expire <expire>`, `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.`)
    .action(actionRunner(projectsUpdateKey))

projects
    .command(`delete-key`)
    .description(`Delete a key by its unique ID. Once deleted, the key can no longer be used to authenticate API calls. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
    .action(actionRunner(projectsDeleteKey))

projects
    .command(`update-o-auth-2`)
    .description(`Update the OAuth2 provider configurations. Use this endpoint to set up or update the OAuth2 provider credentials or enable/disable providers. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--provider <provider>`, `Provider Name`)
    .option(`--app-id <app-id>`, `Provider app ID. Max length: 256 chars.`)
    .option(`--secret <secret>`, `Provider secret key. Max length: 512 chars.`)
    .option(`--enabled [value]`, `Provider status. Set to 'false' to disable new session creation.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateOAuth2))

projects
    .command(`list-platforms`)
    .description(`Get a list of all platforms in the project. This endpoint returns an array of all platforms and their configurations. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsListPlatforms))

projects
    .command(`create-platform`)
    .description(`Create a new platform for your project. Use this endpoint to register a new platform where your users will run your application which will interact with the Appwrite API.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Platform type.`)
    .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
    .option(`--key <key>`, `Package name for Android or bundle ID for iOS or macOS. Max length: 256 chars.`)
    .option(`--store <store>`, `App store or Google Play store ID. Max length: 256 chars.`)
    .option(`--hostname <hostname>`, `Platform client hostname. Max length: 256 chars.`)
    .action(actionRunner(projectsCreatePlatform))

projects
    .command(`get-platform`)
    .description(`Get a platform by its unique ID. This endpoint returns the platform's details, including its name, type, and key configurations. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--platform-id <platform-id>`, `Platform unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsGetPlatform))

projects
    .command(`update-platform`)
    .description(`Update a platform by its unique ID. Use this endpoint to update the platform's name, key, platform store ID, or hostname. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--platform-id <platform-id>`, `Platform unique ID.`)
    .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
    .option(`--key <key>`, `Package name for android or bundle ID for iOS. Max length: 256 chars.`)
    .option(`--store <store>`, `App store or Google Play store ID. Max length: 256 chars.`)
    .option(`--hostname <hostname>`, `Platform client URL. Max length: 256 chars.`)
    .action(actionRunner(projectsUpdatePlatform))

projects
    .command(`delete-platform`)
    .description(`Delete a platform by its unique ID. This endpoint removes the platform and all its configurations from the project. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--platform-id <platform-id>`, `Platform unique ID.`)
    .action(actionRunner(projectsDeletePlatform))

projects
    .command(`update-service-status`)
    .description(`Update the status of a specific service. Use this endpoint to enable or disable a service in your project. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--service <service>`, `Service name.`)
    .requiredOption(`--status [value]`, `Service status.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateServiceStatus))

projects
    .command(`update-service-status-all`)
    .description(`Update the status of all services. Use this endpoint to enable or disable all optional services at once. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--status [value]`, `Service status.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateServiceStatusAll))

projects
    .command(`update-smtp`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'update-smtp' instead] Update the SMTP configuration for your project. Use this endpoint to configure your project's SMTP provider with your custom settings for sending transactional emails. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--enabled [value]`, `Enable custom SMTP service`, (value) => value === undefined ? true : parseBool(value))
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
    .command(`update-smtp`)
    .description(`Update the SMTP configuration for your project. Use this endpoint to configure your project's SMTP provider with your custom settings for sending transactional emails. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--enabled [value]`, `Enable custom SMTP service`, (value) => value === undefined ? true : parseBool(value))
    .option(`--sender-name <sender-name>`, `Name of the email sender`)
    .option(`--sender-email <sender-email>`, `Email of the sender`)
    .option(`--reply-to <reply-to>`, `Reply to email`)
    .option(`--host <host>`, `SMTP server host name`)
    .option(`--port <port>`, `SMTP server port`, parseInteger)
    .option(`--username <username>`, `SMTP server username`)
    .option(`--password <password>`, `SMTP server password`)
    .option(`--secure <secure>`, `Does SMTP server use secure connection`)
    .action(actionRunner(projectsUpdateSMTP))

projects
    .command(`create-smtp-test`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'create-smtp-test' instead] Send a test email to verify SMTP configuration. `)
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
    .command(`create-smtp-test`)
    .description(`Send a test email to verify SMTP configuration. `)
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
    .action(actionRunner(projectsCreateSMTPTest))

projects
    .command(`update-team`)
    .description(`Update the team ID of a project allowing for it to be transferred to another team.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--team-id <team-id>`, `Team ID of the team to transfer project to.`)
    .action(actionRunner(projectsUpdateTeam))

projects
    .command(`get-email-template`)
    .description(`Get a custom email template for the specified locale and type. This endpoint returns the template content, subject, and other configuration details. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsGetEmailTemplate))

projects
    .command(`update-email-template`)
    .description(`Update a custom email template for the specified locale and type. Use this endpoint to modify the content of your email templates.`)
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
    .description(`Reset a custom email template to its default value. This endpoint removes any custom content and restores the template to its original state. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsDeleteEmailTemplate))

projects
    .command(`get-sms-template`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'get-sms-template' instead] Get a custom SMS template for the specified locale and type returning it's contents.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsGetSmsTemplate))

projects
    .command(`get-sms-template`)
    .description(`Get a custom SMS template for the specified locale and type returning it's contents.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsGetSMSTemplate))

projects
    .command(`update-sms-template`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'update-sms-template' instead] Update a custom SMS template for the specified locale and type. Use this endpoint to modify the content of your SMS templates. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .requiredOption(`--message <message>`, `Template message`)
    .action(actionRunner(projectsUpdateSmsTemplate))

projects
    .command(`update-sms-template`)
    .description(`Update a custom SMS template for the specified locale and type. Use this endpoint to modify the content of your SMS templates. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .requiredOption(`--message <message>`, `Template message`)
    .action(actionRunner(projectsUpdateSMSTemplate))

projects
    .command(`delete-sms-template`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'delete-sms-template' instead] Reset a custom SMS template to its default value. This endpoint removes any custom message and restores the template to its original state. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsDeleteSmsTemplate))

projects
    .command(`delete-sms-template`)
    .description(`Reset a custom SMS template to its default value. This endpoint removes any custom message and restores the template to its original state. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsDeleteSMSTemplate))

projects
    .command(`list-webhooks`)
    .description(`Get a list of all webhooks belonging to the project. You can use the query params to filter your results. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsListWebhooks))

projects
    .command(`create-webhook`)
    .description(`Create a new webhook. Use this endpoint to configure a URL that will receive events from Appwrite when specific events occur. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--name <name>`, `Webhook name. Max length: 128 chars.`)
    .requiredOption(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
    .requiredOption(`--url <url>`, `Webhook URL.`)
    .requiredOption(`--security [value]`, `Certificate verification, false for disabled or true for enabled.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Enable or disable a webhook.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--http-user <http-user>`, `Webhook HTTP user. Max length: 256 chars.`)
    .option(`--http-pass <http-pass>`, `Webhook HTTP password. Max length: 256 chars.`)
    .action(actionRunner(projectsCreateWebhook))

projects
    .command(`get-webhook`)
    .description(`Get a webhook by its unique ID. This endpoint returns details about a specific webhook configured for a project. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--webhook-id <webhook-id>`, `Webhook unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsGetWebhook))

projects
    .command(`update-webhook`)
    .description(`Update a webhook by its unique ID. Use this endpoint to update the URL, events, or status of an existing webhook. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--webhook-id <webhook-id>`, `Webhook unique ID.`)
    .requiredOption(`--name <name>`, `Webhook name. Max length: 128 chars.`)
    .requiredOption(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
    .requiredOption(`--url <url>`, `Webhook URL.`)
    .requiredOption(`--security [value]`, `Certificate verification, false for disabled or true for enabled.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Enable or disable a webhook.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--http-user <http-user>`, `Webhook HTTP user. Max length: 256 chars.`)
    .option(`--http-pass <http-pass>`, `Webhook HTTP password. Max length: 256 chars.`)
    .action(actionRunner(projectsUpdateWebhook))

projects
    .command(`delete-webhook`)
    .description(`Delete a webhook by its unique ID. Once deleted, the webhook will no longer receive project events. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--webhook-id <webhook-id>`, `Webhook unique ID.`)
    .action(actionRunner(projectsDeleteWebhook))

projects
    .command(`update-webhook-signature`)
    .description(`Update the webhook signature key. This endpoint can be used to regenerate the signature key used to sign and validate payload deliveries for a specific webhook. `)
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
    projectsUpdateAPIStatus,
    projectsUpdateApiStatusAll,
    projectsUpdateAPIStatusAll,
    projectsUpdateAuthDuration,
    projectsUpdateAuthLimit,
    projectsUpdateAuthSessionsLimit,
    projectsUpdateMembershipsPrivacy,
    projectsUpdateMockNumbers,
    projectsUpdateAuthPasswordDictionary,
    projectsUpdateAuthPasswordHistory,
    projectsUpdatePersonalDataCheck,
    projectsUpdateSessionAlerts,
    projectsUpdateSessionInvalidation,
    projectsUpdateAuthStatus,
    projectsListDevKeys,
    projectsCreateDevKey,
    projectsGetDevKey,
    projectsUpdateDevKey,
    projectsDeleteDevKey,
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
    projectsUpdateSMTP,
    projectsCreateSmtpTest,
    projectsCreateSMTPTest,
    projectsUpdateTeam,
    projectsGetEmailTemplate,
    projectsUpdateEmailTemplate,
    projectsDeleteEmailTemplate,
    projectsGetSmsTemplate,
    projectsGetSMSTemplate,
    projectsUpdateSmsTemplate,
    projectsUpdateSMSTemplate,
    projectsDeleteSmsTemplate,
    projectsDeleteSMSTemplate,
    projectsListWebhooks,
    projectsCreateWebhook,
    projectsGetWebhook,
    projectsUpdateWebhook,
    projectsDeleteWebhook,
    projectsUpdateWebhookSignature
};
