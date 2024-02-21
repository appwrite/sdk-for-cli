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

const projects = new Command("projects").description(commandDescriptions['projects']).configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} ProjectsListRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, teamId
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsListRequestParams} params
 */
const projectsList = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsCreateRequestParams
 * @property {string} projectId Unique Id. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, and hyphen. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Project name. Max length: 128 chars.
 * @property {string} teamId Team unique ID.
 * @property {string} region Project Region.
 * @property {string} description Project description. Max length: 256 chars.
 * @property {string} logo Project logo.
 * @property {string} url Project URL.
 * @property {string} legalName Project legal Name. Max length: 256 chars.
 * @property {string} legalCountry Project legal Country. Max length: 256 chars.
 * @property {string} legalState Project legal State. Max length: 256 chars.
 * @property {string} legalCity Project legal City. Max length: 256 chars.
 * @property {string} legalAddress Project legal Address. Max length: 256 chars.
 * @property {string} legalTaxId Project legal Tax ID. Max length: 256 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsCreateRequestParams} params
 */
const projectsCreate = async ({ projectId, name, teamId, region, description, logo, url, legalName, legalCountry, legalState, legalCity, legalAddress, legalTaxId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsGetRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsGetRequestParams} params
 */
const projectsGet = async ({ projectId, parseOutput = true, sdk = undefined}) => {
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
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateRequestParams} params
 */
const projectsUpdate = async ({ projectId, name, description, logo, url, legalName, legalCountry, legalState, legalCity, legalAddress, legalTaxId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsDeleteRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsDeleteRequestParams} params
 */
const projectsDelete = async ({ projectId, parseOutput = true, sdk = undefined}) => {
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

/**
 * @typedef {Object} ProjectsUpdateAuthDurationRequestParams
 * @property {string} projectId Project unique ID.
 * @property {number} duration Project session length in seconds. Max length: 31536000 seconds.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateAuthDurationRequestParams} params
 */
const projectsUpdateAuthDuration = async ({ projectId, duration, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsUpdateAuthLimitRequestParams
 * @property {string} projectId Project unique ID.
 * @property {number} limit Set the max number of users allowed in this project. Use 0 for unlimited.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateAuthLimitRequestParams} params
 */
const projectsUpdateAuthLimit = async ({ projectId, limit, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsUpdateAuthSessionsLimitRequestParams
 * @property {string} projectId Project unique ID.
 * @property {number} limit Set the max number of users allowed in this project. Value allowed is between 1-100. Default is 10
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateAuthSessionsLimitRequestParams} params
 */
const projectsUpdateAuthSessionsLimit = async ({ projectId, limit, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsUpdateAuthPasswordDictionaryRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} enabled Set whether or not to enable checking user&#039;s password against most commonly used passwords. Default is false.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateAuthPasswordDictionaryRequestParams} params
 */
const projectsUpdateAuthPasswordDictionary = async ({ projectId, enabled, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsUpdateAuthPasswordHistoryRequestParams
 * @property {string} projectId Project unique ID.
 * @property {number} limit Set the max number of passwords to store in user history. User can&#039;t choose a new password that is already stored in the password history list.  Max number of passwords allowed in history is20. Default value is 0
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateAuthPasswordHistoryRequestParams} params
 */
const projectsUpdateAuthPasswordHistory = async ({ projectId, limit, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsUpdatePersonalDataCheckRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} enabled Set whether or not to check a password for similarity with personal data. Default is false.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdatePersonalDataCheckRequestParams} params
 */
const projectsUpdatePersonalDataCheck = async ({ projectId, enabled, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsUpdateAuthStatusRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} method Auth Method. Possible values: email-password,magic-url,anonymous,invites,jwt,phone
 * @property {boolean} status Set the status of this auth method.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateAuthStatusRequestParams} params
 */
const projectsUpdateAuthStatus = async ({ projectId, method, status, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsListKeysRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsListKeysRequestParams} params
 */
const projectsListKeys = async ({ projectId, parseOutput = true, sdk = undefined}) => {
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

/**
 * @typedef {Object} ProjectsCreateKeyRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} name Key name. Max length: 128 chars.
 * @property {string[]} scopes Key scopes list. Maximum of 100 scopes are allowed.
 * @property {string} expire Expiration time in ISO 8601 format. Use null for unlimited expiration.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsCreateKeyRequestParams} params
 */
const projectsCreateKey = async ({ projectId, name, scopes, expire, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsGetKeyRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} keyId Key unique ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsGetKeyRequestParams} params
 */
const projectsGetKey = async ({ projectId, keyId, parseOutput = true, sdk = undefined}) => {
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

/**
 * @typedef {Object} ProjectsUpdateKeyRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} keyId Key unique ID.
 * @property {string} name Key name. Max length: 128 chars.
 * @property {string[]} scopes Key scopes list. Maximum of 100 events are allowed.
 * @property {string} expire Expiration time in ISO 8601 format. Use null for unlimited expiration.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateKeyRequestParams} params
 */
const projectsUpdateKey = async ({ projectId, keyId, name, scopes, expire, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsDeleteKeyRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} keyId Key unique ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsDeleteKeyRequestParams} params
 */
const projectsDeleteKey = async ({ projectId, keyId, parseOutput = true, sdk = undefined}) => {
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

/**
 * @typedef {Object} ProjectsUpdateOAuth2RequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} provider Provider Name
 * @property {string} appId Provider app ID. Max length: 256 chars.
 * @property {string} secret Provider secret key. Max length: 512 chars.
 * @property {boolean} enabled Provider status. Set to &#039;false&#039; to disable new session creation.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateOAuth2RequestParams} params
 */
const projectsUpdateOAuth2 = async ({ projectId, provider, appId, secret, enabled, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsListPlatformsRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsListPlatformsRequestParams} params
 */
const projectsListPlatforms = async ({ projectId, parseOutput = true, sdk = undefined}) => {
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

/**
 * @typedef {Object} ProjectsCreatePlatformRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} type Platform type.
 * @property {string} name Platform name. Max length: 128 chars.
 * @property {string} key Package name for Android or bundle ID for iOS or macOS. Max length: 256 chars.
 * @property {string} store App store or Google Play store ID. Max length: 256 chars.
 * @property {string} hostname Platform client hostname. Max length: 256 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsCreatePlatformRequestParams} params
 */
const projectsCreatePlatform = async ({ projectId, type, name, key, store, hostname, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsGetPlatformRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} platformId Platform unique ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsGetPlatformRequestParams} params
 */
const projectsGetPlatform = async ({ projectId, platformId, parseOutput = true, sdk = undefined}) => {
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

/**
 * @typedef {Object} ProjectsUpdatePlatformRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} platformId Platform unique ID.
 * @property {string} name Platform name. Max length: 128 chars.
 * @property {string} key Package name for android or bundle ID for iOS. Max length: 256 chars.
 * @property {string} store App store or Google Play store ID. Max length: 256 chars.
 * @property {string} hostname Platform client URL. Max length: 256 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdatePlatformRequestParams} params
 */
const projectsUpdatePlatform = async ({ projectId, platformId, name, key, store, hostname, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsDeletePlatformRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} platformId Platform unique ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsDeletePlatformRequestParams} params
 */
const projectsDeletePlatform = async ({ projectId, platformId, parseOutput = true, sdk = undefined}) => {
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

/**
 * @typedef {Object} ProjectsUpdateServiceStatusRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} service Service name.
 * @property {boolean} status Service status.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateServiceStatusRequestParams} params
 */
const projectsUpdateServiceStatus = async ({ projectId, service, status, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsUpdateServiceStatusAllRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} status Service status.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateServiceStatusAllRequestParams} params
 */
const projectsUpdateServiceStatusAll = async ({ projectId, status, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsUpdateSmtpConfigurationRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} enabled Enable custom SMTP service
 * @property {string} senderName Name of the email sender
 * @property {string} senderEmail Email of the sender
 * @property {string} replyTo Reply to email
 * @property {string} host SMTP server host name
 * @property {number} port SMTP server port
 * @property {string} username SMTP server username
 * @property {string} password SMTP server password
 * @property {string} secure Does SMTP server use secure connection
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateSmtpConfigurationRequestParams} params
 */
const projectsUpdateSmtpConfiguration = async ({ projectId, enabled, senderName, senderEmail, replyTo, host, port, username, password, secure, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsUpdateTeamRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} teamId Team ID of the team to transfer project to.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateTeamRequestParams} params
 */
const projectsUpdateTeam = async ({ projectId, teamId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsGetEmailTemplateRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} type Template type
 * @property {string} locale Template locale
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsGetEmailTemplateRequestParams} params
 */
const projectsGetEmailTemplate = async ({ projectId, type, locale, parseOutput = true, sdk = undefined}) => {
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

/**
 * @typedef {Object} ProjectsUpdateEmailTemplateRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} type Template type
 * @property {string} locale Template locale
 * @property {string} subject Email Subject
 * @property {string} message Template message
 * @property {string} senderName Name of the email sender
 * @property {string} senderEmail Email of the sender
 * @property {string} replyTo Reply to email
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateEmailTemplateRequestParams} params
 */
const projectsUpdateEmailTemplate = async ({ projectId, type, locale, subject, message, senderName, senderEmail, replyTo, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsDeleteEmailTemplateRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} type Template type
 * @property {string} locale Template locale
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsDeleteEmailTemplateRequestParams} params
 */
const projectsDeleteEmailTemplate = async ({ projectId, type, locale, parseOutput = true, sdk = undefined}) => {
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

/**
 * @typedef {Object} ProjectsGetSmsTemplateRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} type Template type
 * @property {string} locale Template locale
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsGetSmsTemplateRequestParams} params
 */
const projectsGetSmsTemplate = async ({ projectId, type, locale, parseOutput = true, sdk = undefined}) => {
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

/**
 * @typedef {Object} ProjectsUpdateSmsTemplateRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} type Template type
 * @property {string} locale Template locale
 * @property {string} message Template message
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateSmsTemplateRequestParams} params
 */
const projectsUpdateSmsTemplate = async ({ projectId, type, locale, message, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} ProjectsDeleteSmsTemplateRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} type Template type
 * @property {string} locale Template locale
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsDeleteSmsTemplateRequestParams} params
 */
const projectsDeleteSmsTemplate = async ({ projectId, type, locale, parseOutput = true, sdk = undefined}) => {
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

/**
 * @typedef {Object} ProjectsGetUsageRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} range Date range.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsGetUsageRequestParams} params
 */
const projectsGetUsage = async ({ projectId, range, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/usage'.replace('{projectId}', projectId);
    let payload = {};
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

/**
 * @typedef {Object} ProjectsListWebhooksRequestParams
 * @property {string} projectId Project unique ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsListWebhooksRequestParams} params
 */
const projectsListWebhooks = async ({ projectId, parseOutput = true, sdk = undefined}) => {
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

/**
 * @typedef {Object} ProjectsCreateWebhookRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} name Webhook name. Max length: 128 chars.
 * @property {string[]} events Events list. Maximum of 100 events are allowed.
 * @property {string} url Webhook URL.
 * @property {boolean} security Certificate verification, false for disabled or true for enabled.
 * @property {string} httpUser Webhook HTTP user. Max length: 256 chars.
 * @property {string} httpPass Webhook HTTP password. Max length: 256 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsCreateWebhookRequestParams} params
 */
const projectsCreateWebhook = async ({ projectId, name, events, url, security, httpUser, httpPass, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/webhooks'.replace('{projectId}', projectId);
    let payload = {};
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

/**
 * @typedef {Object} ProjectsGetWebhookRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} webhookId Webhook unique ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsGetWebhookRequestParams} params
 */
const projectsGetWebhook = async ({ projectId, webhookId, parseOutput = true, sdk = undefined}) => {
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

/**
 * @typedef {Object} ProjectsUpdateWebhookRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} webhookId Webhook unique ID.
 * @property {string} name Webhook name. Max length: 128 chars.
 * @property {string[]} events Events list. Maximum of 100 events are allowed.
 * @property {string} url Webhook URL.
 * @property {boolean} security Certificate verification, false for disabled or true for enabled.
 * @property {string} httpUser Webhook HTTP user. Max length: 256 chars.
 * @property {string} httpPass Webhook HTTP password. Max length: 256 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateWebhookRequestParams} params
 */
const projectsUpdateWebhook = async ({ projectId, webhookId, name, events, url, security, httpUser, httpPass, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForConsole() : sdk;
    let apiPath = '/projects/{projectId}/webhooks/{webhookId}'.replace('{projectId}', projectId).replace('{webhookId}', webhookId);
    let payload = {};
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

/**
 * @typedef {Object} ProjectsDeleteWebhookRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} webhookId Webhook unique ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsDeleteWebhookRequestParams} params
 */
const projectsDeleteWebhook = async ({ projectId, webhookId, parseOutput = true, sdk = undefined}) => {
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

/**
 * @typedef {Object} ProjectsUpdateWebhookSignatureRequestParams
 * @property {string} projectId Project unique ID.
 * @property {string} webhookId Webhook unique ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {ProjectsUpdateWebhookSignatureRequestParams} params
 */
const projectsUpdateWebhookSignature = async ({ projectId, webhookId, parseOutput = true, sdk = undefined}) => {
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