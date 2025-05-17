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

const databases = new Command("databases").description(commandDescriptions['databases'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} DatabasesListRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesListRequestParams} params
 */
const databasesList = async ({queries,search,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases';
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
            showConsoleLink('databases', 'list');
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} DatabasesCreateRequestParams
 * @property {string} databaseId Unique Id. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Database name. Max length: 128 chars.
 * @property {boolean} enabled Is the database enabled? When set to &#039;disabled&#039;, users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateRequestParams} params
 */
const databasesCreate = async ({databaseId,name,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases';
    let payload = {};
    if (typeof databaseId !== 'undefined') {
        payload['databaseId'] = databaseId;
    }
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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
 * @typedef {Object} DatabasesGetUsageRequestParams
 * @property {DatabaseUsageRange} range &#039;Date range.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesGetUsageRequestParams} params
 */
const databasesGetUsage = async ({range,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/usage';
    let payload = {};
    if (typeof range !== 'undefined') {
        payload['range'] = range;
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
 * @typedef {Object} DatabasesGetRequestParams
 * @property {string} databaseId Database ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesGetRequestParams} params
 */
const databasesGet = async ({databaseId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}'.replace('{databaseId}', databaseId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('databases', 'get', databaseId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} DatabasesUpdateRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} name Database name. Max length: 128 chars.
 * @property {boolean} enabled Is database enabled? When set to &#039;disabled&#039;, users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateRequestParams} params
 */
const databasesUpdate = async ({databaseId,name,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}'.replace('{databaseId}', databaseId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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
 * @typedef {Object} DatabasesDeleteRequestParams
 * @property {string} databaseId Database ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesDeleteRequestParams} params
 */
const databasesDelete = async ({databaseId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}'.replace('{databaseId}', databaseId);
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
 * @typedef {Object} DatabasesListCollectionsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, documentSecurity
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesListCollectionsRequestParams} params
 */
const databasesListCollections = async ({databaseId,queries,search,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections'.replace('{databaseId}', databaseId);
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
            showConsoleLink('databases', 'listCollections', databaseId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} DatabasesCreateCollectionRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Unique Id. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Collection name. Max length: 128 chars.
 * @property {string[]} permissions An array of permissions strings. By default, no user is granted with any permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} documentSecurity Enables configuring permissions for individual documents. A user needs one of document or collection level permissions to access a document. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} enabled Is collection enabled? When set to &#039;disabled&#039;, users cannot access the collection but Server SDKs with and API key can still read and write to the collection. No data is lost when this is toggled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateCollectionRequestParams} params
 */
const databasesCreateCollection = async ({databaseId,collectionId,name,permissions,documentSecurity,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections'.replace('{databaseId}', databaseId);
    let payload = {};
    if (typeof collectionId !== 'undefined') {
        payload['collectionId'] = collectionId;
    }
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    permissions = permissions === true ? [] : permissions;
    if (typeof permissions !== 'undefined') {
        payload['permissions'] = permissions;
    }
    if (typeof documentSecurity !== 'undefined') {
        payload['documentSecurity'] = documentSecurity;
    }
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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
 * @typedef {Object} DatabasesGetCollectionRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesGetCollectionRequestParams} params
 */
const databasesGetCollection = async ({databaseId,collectionId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('databases', 'getCollection', databaseId, collectionId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} DatabasesUpdateCollectionRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID.
 * @property {string} name Collection name. Max length: 128 chars.
 * @property {string[]} permissions An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} documentSecurity Enables configuring permissions for individual documents. A user needs one of document or collection level permissions to access a document. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} enabled Is collection enabled? When set to &#039;disabled&#039;, users cannot access the collection but Server SDKs with and API key can still read and write to the collection. No data is lost when this is toggled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateCollectionRequestParams} params
 */
const databasesUpdateCollection = async ({databaseId,collectionId,name,permissions,documentSecurity,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    permissions = permissions === true ? [] : permissions;
    if (typeof permissions !== 'undefined') {
        payload['permissions'] = permissions;
    }
    if (typeof documentSecurity !== 'undefined') {
        payload['documentSecurity'] = documentSecurity;
    }
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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
 * @typedef {Object} DatabasesDeleteCollectionRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesDeleteCollectionRequestParams} params
 */
const databasesDeleteCollection = async ({databaseId,collectionId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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
 * @typedef {Object} DatabasesListAttributesRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, size, required, array, status, error
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesListAttributesRequestParams} params
 */
const databasesListAttributes = async ({databaseId,collectionId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('databases', 'listAttributes', databaseId, collectionId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} DatabasesCreateBooleanAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {boolean} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {boolean} array Is attribute an array?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateBooleanAttributeRequestParams} params
 */
const databasesCreateBooleanAttribute = async ({databaseId,collectionId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/boolean'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof array !== 'undefined') {
        payload['array'] = array;
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
 * @typedef {Object} DatabasesUpdateBooleanAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {boolean} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {string} newKey New attribute key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateBooleanAttributeRequestParams} params
 */
const databasesUpdateBooleanAttribute = async ({databaseId,collectionId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/boolean/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
    let payload = {};
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof newKey !== 'undefined') {
        payload['newKey'] = newKey;
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
 * @typedef {Object} DatabasesCreateDatetimeAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {string} xdefault Default value for the attribute in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Cannot be set when attribute is required.
 * @property {boolean} array Is attribute an array?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateDatetimeAttributeRequestParams} params
 */
const databasesCreateDatetimeAttribute = async ({databaseId,collectionId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/datetime'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof array !== 'undefined') {
        payload['array'] = array;
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
 * @typedef {Object} DatabasesUpdateDatetimeAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {string} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {string} newKey New attribute key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateDatetimeAttributeRequestParams} params
 */
const databasesUpdateDatetimeAttribute = async ({databaseId,collectionId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/datetime/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
    let payload = {};
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof newKey !== 'undefined') {
        payload['newKey'] = newKey;
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
 * @typedef {Object} DatabasesCreateEmailAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {string} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {boolean} array Is attribute an array?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateEmailAttributeRequestParams} params
 */
const databasesCreateEmailAttribute = async ({databaseId,collectionId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/email'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof array !== 'undefined') {
        payload['array'] = array;
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
 * @typedef {Object} DatabasesUpdateEmailAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {string} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {string} newKey New attribute key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateEmailAttributeRequestParams} params
 */
const databasesUpdateEmailAttribute = async ({databaseId,collectionId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/email/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
    let payload = {};
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof newKey !== 'undefined') {
        payload['newKey'] = newKey;
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
 * @typedef {Object} DatabasesCreateEnumAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {string[]} elements Array of elements in enumerated type. Uses length of longest element to determine size. Maximum of 100 elements are allowed, each 255 characters long.
 * @property {boolean} required Is attribute required?
 * @property {string} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {boolean} array Is attribute an array?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateEnumAttributeRequestParams} params
 */
const databasesCreateEnumAttribute = async ({databaseId,collectionId,key,elements,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/enum'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    elements = elements === true ? [] : elements;
    if (typeof elements !== 'undefined') {
        payload['elements'] = elements;
    }
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof array !== 'undefined') {
        payload['array'] = array;
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
 * @typedef {Object} DatabasesUpdateEnumAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {string[]} elements Array of elements in enumerated type. Uses length of longest element to determine size. Maximum of 100 elements are allowed, each 255 characters long.
 * @property {boolean} required Is attribute required?
 * @property {string} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {string} newKey New attribute key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateEnumAttributeRequestParams} params
 */
const databasesUpdateEnumAttribute = async ({databaseId,collectionId,key,elements,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/enum/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
    let payload = {};
    elements = elements === true ? [] : elements;
    if (typeof elements !== 'undefined') {
        payload['elements'] = elements;
    }
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof newKey !== 'undefined') {
        payload['newKey'] = newKey;
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
 * @typedef {Object} DatabasesCreateFloatAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {number} min Minimum value to enforce on new documents
 * @property {number} max Maximum value to enforce on new documents
 * @property {number} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {boolean} array Is attribute an array?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateFloatAttributeRequestParams} params
 */
const databasesCreateFloatAttribute = async ({databaseId,collectionId,key,required,min,max,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/float'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof min !== 'undefined') {
        payload['min'] = min;
    }
    if (typeof max !== 'undefined') {
        payload['max'] = max;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof array !== 'undefined') {
        payload['array'] = array;
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
 * @typedef {Object} DatabasesUpdateFloatAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {number} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {number} min Minimum value to enforce on new documents
 * @property {number} max Maximum value to enforce on new documents
 * @property {string} newKey New attribute key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateFloatAttributeRequestParams} params
 */
const databasesUpdateFloatAttribute = async ({databaseId,collectionId,key,required,xdefault,min,max,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/float/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
    let payload = {};
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof min !== 'undefined') {
        payload['min'] = min;
    }
    if (typeof max !== 'undefined') {
        payload['max'] = max;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof newKey !== 'undefined') {
        payload['newKey'] = newKey;
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
 * @typedef {Object} DatabasesCreateIntegerAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {number} min Minimum value to enforce on new documents
 * @property {number} max Maximum value to enforce on new documents
 * @property {number} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {boolean} array Is attribute an array?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateIntegerAttributeRequestParams} params
 */
const databasesCreateIntegerAttribute = async ({databaseId,collectionId,key,required,min,max,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/integer'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof min !== 'undefined') {
        payload['min'] = min;
    }
    if (typeof max !== 'undefined') {
        payload['max'] = max;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof array !== 'undefined') {
        payload['array'] = array;
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
 * @typedef {Object} DatabasesUpdateIntegerAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {number} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {number} min Minimum value to enforce on new documents
 * @property {number} max Maximum value to enforce on new documents
 * @property {string} newKey New attribute key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateIntegerAttributeRequestParams} params
 */
const databasesUpdateIntegerAttribute = async ({databaseId,collectionId,key,required,xdefault,min,max,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/integer/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
    let payload = {};
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof min !== 'undefined') {
        payload['min'] = min;
    }
    if (typeof max !== 'undefined') {
        payload['max'] = max;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof newKey !== 'undefined') {
        payload['newKey'] = newKey;
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
 * @typedef {Object} DatabasesCreateIpAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {string} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {boolean} array Is attribute an array?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateIpAttributeRequestParams} params
 */
const databasesCreateIpAttribute = async ({databaseId,collectionId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/ip'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof array !== 'undefined') {
        payload['array'] = array;
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
 * @typedef {Object} DatabasesUpdateIpAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {string} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {string} newKey New attribute key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateIpAttributeRequestParams} params
 */
const databasesUpdateIpAttribute = async ({databaseId,collectionId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/ip/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
    let payload = {};
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof newKey !== 'undefined') {
        payload['newKey'] = newKey;
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
 * @typedef {Object} DatabasesCreateRelationshipAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} relatedCollectionId Related Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {RelationshipType} type Relation type
 * @property {boolean} twoWay Is Two Way?
 * @property {string} key Attribute Key.
 * @property {string} twoWayKey Two Way Attribute Key.
 * @property {RelationMutate} onDelete Constraints option
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateRelationshipAttributeRequestParams} params
 */
const databasesCreateRelationshipAttribute = async ({databaseId,collectionId,relatedCollectionId,type,twoWay,key,twoWayKey,onDelete,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/relationship'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof relatedCollectionId !== 'undefined') {
        payload['relatedCollectionId'] = relatedCollectionId;
    }
    if (typeof type !== 'undefined') {
        payload['type'] = type;
    }
    if (typeof twoWay !== 'undefined') {
        payload['twoWay'] = twoWay;
    }
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof twoWayKey !== 'undefined') {
        payload['twoWayKey'] = twoWayKey;
    }
    if (typeof onDelete !== 'undefined') {
        payload['onDelete'] = onDelete;
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
 * @typedef {Object} DatabasesCreateStringAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {number} size Attribute size for text attributes, in number of characters.
 * @property {boolean} required Is attribute required?
 * @property {string} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {boolean} array Is attribute an array?
 * @property {boolean} encrypt Toggle encryption for the attribute. Encryption enhances security by not storing any plain text values in the database. However, encrypted attributes cannot be queried.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateStringAttributeRequestParams} params
 */
const databasesCreateStringAttribute = async ({databaseId,collectionId,key,size,required,xdefault,array,encrypt,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/string'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof size !== 'undefined') {
        payload['size'] = size;
    }
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof array !== 'undefined') {
        payload['array'] = array;
    }
    if (typeof encrypt !== 'undefined') {
        payload['encrypt'] = encrypt;
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
 * @typedef {Object} DatabasesUpdateStringAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {string} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {number} size Maximum size of the string attribute.
 * @property {string} newKey New attribute key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateStringAttributeRequestParams} params
 */
const databasesUpdateStringAttribute = async ({databaseId,collectionId,key,required,xdefault,size,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/string/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
    let payload = {};
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof size !== 'undefined') {
        payload['size'] = size;
    }
    if (typeof newKey !== 'undefined') {
        payload['newKey'] = newKey;
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
 * @typedef {Object} DatabasesCreateUrlAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {string} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {boolean} array Is attribute an array?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateUrlAttributeRequestParams} params
 */
const databasesCreateUrlAttribute = async ({databaseId,collectionId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/url'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof array !== 'undefined') {
        payload['array'] = array;
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
 * @typedef {Object} DatabasesUpdateUrlAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {string} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {string} newKey New attribute key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateUrlAttributeRequestParams} params
 */
const databasesUpdateUrlAttribute = async ({databaseId,collectionId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/url/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
    let payload = {};
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
    }
    if (typeof newKey !== 'undefined') {
        payload['newKey'] = newKey;
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
 * @typedef {Object} DatabasesGetAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesGetAttributeRequestParams} params
 */
const databasesGetAttribute = async ({databaseId,collectionId,key,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
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
 * @typedef {Object} DatabasesDeleteAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesDeleteAttributeRequestParams} params
 */
const databasesDeleteAttribute = async ({databaseId,collectionId,key,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
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
 * @typedef {Object} DatabasesUpdateRelationshipAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {RelationMutate} onDelete Constraints option
 * @property {string} newKey New attribute key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateRelationshipAttributeRequestParams} params
 */
const databasesUpdateRelationshipAttribute = async ({databaseId,collectionId,key,onDelete,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/{key}/relationship'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
    let payload = {};
    if (typeof onDelete !== 'undefined') {
        payload['onDelete'] = onDelete;
    }
    if (typeof newKey !== 'undefined') {
        payload['newKey'] = newKey;
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
 * @typedef {Object} DatabasesListDocumentsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesListDocumentsRequestParams} params
 */
const databasesListDocuments = async ({databaseId,collectionId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/documents'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('databases', 'listDocuments', databaseId, collectionId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} DatabasesCreateDocumentRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.
 * @property {string} documentId Document ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {object} data Document data as JSON object.
 * @property {string[]} permissions An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateDocumentRequestParams} params
 */
const databasesCreateDocument = async ({databaseId,collectionId,documentId,data,permissions,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/documents'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof documentId !== 'undefined') {
        payload['documentId'] = documentId;
    }
    if (typeof data !== 'undefined') {
        payload['data'] = JSON.parse(data);
    }
    permissions = permissions === true ? [] : permissions;
    if (typeof permissions !== 'undefined') {
        payload['permissions'] = permissions;
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
 * @typedef {Object} DatabasesCreateDocumentsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.
 * @property {object[]} documents Array of documents data as JSON objects.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateDocumentsRequestParams} params
 */
const databasesCreateDocuments = async ({databaseId,collectionId,documents,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/documents'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    documents = documents === true ? [] : documents;
    if (typeof documents !== 'undefined') {
        payload['documents'] = documents;
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
 * @typedef {Object} DatabasesUpsertDocumentsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID.
 * @property {object[]} documents Array of document data as JSON objects. May contain partial documents.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpsertDocumentsRequestParams} params
 */
const databasesUpsertDocuments = async ({databaseId,collectionId,documents,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/documents'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    documents = documents === true ? [] : documents;
    if (typeof documents !== 'undefined') {
        payload['documents'] = documents;
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
 * @typedef {Object} DatabasesUpdateDocumentsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID.
 * @property {object} data Document data as JSON object. Include only attribute and value pairs to be updated.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateDocumentsRequestParams} params
 */
const databasesUpdateDocuments = async ({databaseId,collectionId,data,queries,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/documents'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof data !== 'undefined') {
        payload['data'] = JSON.parse(data);
    }
    queries = queries === true ? [] : queries;
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
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
 * @typedef {Object} DatabasesDeleteDocumentsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesDeleteDocumentsRequestParams} params
 */
const databasesDeleteDocuments = async ({databaseId,collectionId,queries,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/documents'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    queries = queries === true ? [] : queries;
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

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
 * @typedef {Object} DatabasesGetDocumentRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} documentId Document ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesGetDocumentRequestParams} params
 */
const databasesGetDocument = async ({databaseId,collectionId,documentId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('databases', 'getDocument', databaseId, collectionId, documentId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} DatabasesUpdateDocumentRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID.
 * @property {string} documentId Document ID.
 * @property {object} data Document data as JSON object. Include only attribute and value pairs to be updated.
 * @property {string[]} permissions An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateDocumentRequestParams} params
 */
const databasesUpdateDocument = async ({databaseId,collectionId,documentId,data,permissions,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
    let payload = {};
    if (typeof data !== 'undefined') {
        payload['data'] = JSON.parse(data);
    }
    permissions = permissions === true ? [] : permissions;
    if (typeof permissions !== 'undefined') {
        payload['permissions'] = permissions;
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
 * @typedef {Object} DatabasesDeleteDocumentRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} documentId Document ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesDeleteDocumentRequestParams} params
 */
const databasesDeleteDocument = async ({databaseId,collectionId,documentId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
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
 * @typedef {Object} DatabasesListDocumentLogsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID.
 * @property {string} documentId Document ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesListDocumentLogsRequestParams} params
 */
const databasesListDocumentLogs = async ({databaseId,collectionId,documentId,queries,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}/logs'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
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
 * @typedef {Object} DatabasesListIndexesRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, status, attributes, error
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesListIndexesRequestParams} params
 */
const databasesListIndexes = async ({databaseId,collectionId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/indexes'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('databases', 'listIndexes', databaseId, collectionId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} DatabasesCreateIndexRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Index Key.
 * @property {IndexType} type Index type.
 * @property {string[]} attributes Array of attributes to index. Maximum of 100 attributes are allowed, each 32 characters long.
 * @property {string[]} orders Array of index orders. Maximum of 100 orders are allowed.
 * @property {number[]} lengths Length of index. Maximum of 100
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateIndexRequestParams} params
 */
const databasesCreateIndex = async ({databaseId,collectionId,key,type,attributes,orders,lengths,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/indexes'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof type !== 'undefined') {
        payload['type'] = type;
    }
    attributes = attributes === true ? [] : attributes;
    if (typeof attributes !== 'undefined') {
        payload['attributes'] = attributes;
    }
    orders = orders === true ? [] : orders;
    if (typeof orders !== 'undefined') {
        payload['orders'] = orders;
    }
    lengths = lengths === true ? [] : lengths;
    if (typeof lengths !== 'undefined') {
        payload['lengths'] = lengths;
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
 * @typedef {Object} DatabasesGetIndexRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Index Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesGetIndexRequestParams} params
 */
const databasesGetIndex = async ({databaseId,collectionId,key,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/indexes/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
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
 * @typedef {Object} DatabasesDeleteIndexRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Index Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesDeleteIndexRequestParams} params
 */
const databasesDeleteIndex = async ({databaseId,collectionId,key,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/indexes/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
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
 * @typedef {Object} DatabasesListCollectionLogsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesListCollectionLogsRequestParams} params
 */
const databasesListCollectionLogs = async ({databaseId,collectionId,queries,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/logs'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
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
 * @typedef {Object} DatabasesGetCollectionUsageRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID.
 * @property {DatabaseUsageRange} range Date range.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesGetCollectionUsageRequestParams} params
 */
const databasesGetCollectionUsage = async ({databaseId,collectionId,range,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/usage'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof range !== 'undefined') {
        payload['range'] = range;
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
 * @typedef {Object} DatabasesListLogsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesListLogsRequestParams} params
 */
const databasesListLogs = async ({databaseId,queries,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/logs'.replace('{databaseId}', databaseId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
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
 * @typedef {Object} DatabasesGetDatabaseUsageRequestParams
 * @property {string} databaseId Database ID.
 * @property {DatabaseUsageRange} range &#039;Date range.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesGetDatabaseUsageRequestParams} params
 */
const databasesGetDatabaseUsage = async ({databaseId,range,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/usage'.replace('{databaseId}', databaseId);
    let payload = {};
    if (typeof range !== 'undefined') {
        payload['range'] = range;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('databases', 'getDatabaseUsage', databaseId);
         } else {
            parse(response)
        }
    }

    return response;

}

databases
    .command(`list`)
    .description(`Get a list of all databases from the current Appwrite project. You can use the search parameter to filter your results.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesList))

databases
    .command(`create`)
    .description(`Create a new Database. `)
    .requiredOption(`--database-id <database-id>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Database name. Max length: 128 chars.`)
    .option(`--enabled [value]`, `Is the database enabled? When set to 'disabled', users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreate))

databases
    .command(`get-usage`)
    .description(`Get usage metrics and statistics for all databases in the project. You can view the total number of databases, collections, documents, and storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
    .option(`--range <range>`, `'Date range.`)
    .action(actionRunner(databasesGetUsage))

databases
    .command(`get`)
    .description(`Get a database by its unique ID. This endpoint response returns a JSON object with the database metadata.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesGet))

databases
    .command(`update`)
    .description(`Update a database by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--name <name>`, `Database name. Max length: 128 chars.`)
    .option(`--enabled [value]`, `Is database enabled? When set to 'disabled', users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesUpdate))

databases
    .command(`delete`)
    .description(`Delete a database by its unique ID. Only API keys with with databases.write scope can delete a database.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .action(actionRunner(databasesDelete))

databases
    .command(`list-collections`)
    .description(`Get a list of all collections that belong to the provided databaseId. You can use the search parameter to filter your results.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, documentSecurity`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesListCollections))

databases
    .command(`create-collection`)
    .description(`Create a new Collection. Before using this route, you should create a new database resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, no user is granted with any permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--document-security [value]`, `Enables configuring permissions for individual documents. A user needs one of document or collection level permissions to access a document. [Learn more about permissions](https://appwrite.io/docs/permissions).`, (value) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Is collection enabled? When set to 'disabled', users cannot access the collection but Server SDKs with and API key can still read and write to the collection. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateCollection))

databases
    .command(`get-collection`)
    .description(`Get a collection by its unique ID. This endpoint response returns a JSON object with the collection metadata.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesGetCollection))

databases
    .command(`update-collection`)
    .description(`Update a collection by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
    .option(`--permissions [permissions...]`, `An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--document-security [value]`, `Enables configuring permissions for individual documents. A user needs one of document or collection level permissions to access a document. [Learn more about permissions](https://appwrite.io/docs/permissions).`, (value) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Is collection enabled? When set to 'disabled', users cannot access the collection but Server SDKs with and API key can still read and write to the collection. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesUpdateCollection))

databases
    .command(`delete-collection`)
    .description(`Delete a collection by its unique ID. Only users with write permissions have access to delete this resource.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .action(actionRunner(databasesDeleteCollection))

databases
    .command(`list-attributes`)
    .description(`List attributes in the collection.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, size, required, array, status, error`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesListAttributes))

databases
    .command(`create-boolean-attribute`)
    .description(`Create a boolean attribute. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault [value]`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateBooleanAttribute))

databases
    .command(`update-boolean-attribute`)
    .description(`Update a boolean attribute. Changing the 'default' value will not update already existing documents.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault [value]`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--new-key <new-key>`, `New attribute key.`)
    .action(actionRunner(databasesUpdateBooleanAttribute))

databases
    .command(`create-datetime-attribute`)
    .description(`Create a date time attribute according to the ISO 8601 standard.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for the attribute in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Cannot be set when attribute is required.`)
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateDatetimeAttribute))

databases
    .command(`update-datetime-attribute`)
    .description(`Update a date time attribute. Changing the 'default' value will not update already existing documents.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--new-key <new-key>`, `New attribute key.`)
    .action(actionRunner(databasesUpdateDatetimeAttribute))

databases
    .command(`create-email-attribute`)
    .description(`Create an email attribute. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateEmailAttribute))

databases
    .command(`update-email-attribute`)
    .description(`Update an email attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--new-key <new-key>`, `New attribute key.`)
    .action(actionRunner(databasesUpdateEmailAttribute))

databases
    .command(`create-enum-attribute`)
    .description(`Create an enumeration attribute. The 'elements' param acts as a white-list of accepted values for this attribute.  `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--elements [elements...]`, `Array of elements in enumerated type. Uses length of longest element to determine size. Maximum of 100 elements are allowed, each 255 characters long.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateEnumAttribute))

databases
    .command(`update-enum-attribute`)
    .description(`Update an enum attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--elements [elements...]`, `Array of elements in enumerated type. Uses length of longest element to determine size. Maximum of 100 elements are allowed, each 255 characters long.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--new-key <new-key>`, `New attribute key.`)
    .action(actionRunner(databasesUpdateEnumAttribute))

databases
    .command(`create-float-attribute`)
    .description(`Create a float attribute. Optionally, minimum and maximum values can be provided. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--min <min>`, `Minimum value to enforce on new documents`, parseInteger)
    .option(`--max <max>`, `Maximum value to enforce on new documents`, parseInteger)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, parseInteger)
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateFloatAttribute))

databases
    .command(`update-float-attribute`)
    .description(`Update a float attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, parseInteger)
    .option(`--min <min>`, `Minimum value to enforce on new documents`, parseInteger)
    .option(`--max <max>`, `Maximum value to enforce on new documents`, parseInteger)
    .option(`--new-key <new-key>`, `New attribute key.`)
    .action(actionRunner(databasesUpdateFloatAttribute))

databases
    .command(`create-integer-attribute`)
    .description(`Create an integer attribute. Optionally, minimum and maximum values can be provided. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--min <min>`, `Minimum value to enforce on new documents`, parseInteger)
    .option(`--max <max>`, `Maximum value to enforce on new documents`, parseInteger)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, parseInteger)
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateIntegerAttribute))

databases
    .command(`update-integer-attribute`)
    .description(`Update an integer attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, parseInteger)
    .option(`--min <min>`, `Minimum value to enforce on new documents`, parseInteger)
    .option(`--max <max>`, `Maximum value to enforce on new documents`, parseInteger)
    .option(`--new-key <new-key>`, `New attribute key.`)
    .action(actionRunner(databasesUpdateIntegerAttribute))

databases
    .command(`create-ip-attribute`)
    .description(`Create IP address attribute. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateIpAttribute))

databases
    .command(`update-ip-attribute`)
    .description(`Update an ip attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--new-key <new-key>`, `New attribute key.`)
    .action(actionRunner(databasesUpdateIpAttribute))

databases
    .command(`create-relationship-attribute`)
    .description(`Create relationship attribute. [Learn more about relationship attributes](https://appwrite.io/docs/databases-relationships#relationship-attributes). `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--related-collection-id <related-collection-id>`, `Related Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--type <type>`, `Relation type`)
    .option(`--two-way [value]`, `Is Two Way?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--key <key>`, `Attribute Key.`)
    .option(`--two-way-key <two-way-key>`, `Two Way Attribute Key.`)
    .option(`--on-delete <on-delete>`, `Constraints option`)
    .action(actionRunner(databasesCreateRelationshipAttribute))

databases
    .command(`create-string-attribute`)
    .description(`Create a string attribute. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--size <size>`, `Attribute size for text attributes, in number of characters.`, parseInteger)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--encrypt [value]`, `Toggle encryption for the attribute. Encryption enhances security by not storing any plain text values in the database. However, encrypted attributes cannot be queried.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateStringAttribute))

databases
    .command(`update-string-attribute`)
    .description(`Update a string attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--size <size>`, `Maximum size of the string attribute.`, parseInteger)
    .option(`--new-key <new-key>`, `New attribute key.`)
    .action(actionRunner(databasesUpdateStringAttribute))

databases
    .command(`create-url-attribute`)
    .description(`Create a URL attribute. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateUrlAttribute))

databases
    .command(`update-url-attribute`)
    .description(`Update an url attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--new-key <new-key>`, `New attribute key.`)
    .action(actionRunner(databasesUpdateUrlAttribute))

databases
    .command(`get-attribute`)
    .description(`Get attribute by ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .action(actionRunner(databasesGetAttribute))

databases
    .command(`delete-attribute`)
    .description(`Deletes an attribute.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .action(actionRunner(databasesDeleteAttribute))

databases
    .command(`update-relationship-attribute`)
    .description(`Update relationship attribute. [Learn more about relationship attributes](https://appwrite.io/docs/databases-relationships#relationship-attributes). `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .option(`--on-delete <on-delete>`, `Constraints option`)
    .option(`--new-key <new-key>`, `New attribute key.`)
    .action(actionRunner(databasesUpdateRelationshipAttribute))

databases
    .command(`list-documents`)
    .description(`Get a list of all the user's documents in a given collection. You can use the query params to filter your results.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesListDocuments))

databases
    .command(`create-document`)
    .description(`Create a new Document. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.`)
    .requiredOption(`--document-id <document-id>`, `Document ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--data <data>`, `Document data as JSON object.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .action(actionRunner(databasesCreateDocument))

databases
    .command(`create-documents`)
    .description(`Create new Documents. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.`)
    .requiredOption(`--documents [documents...]`, `Array of documents data as JSON objects.`)
    .action(actionRunner(databasesCreateDocuments))

databases
    .command(`upsert-documents`)
    .description(`Create or update Documents. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .option(`--documents [documents...]`, `Array of document data as JSON objects. May contain partial documents.`)
    .action(actionRunner(databasesUpsertDocuments))

databases
    .command(`update-documents`)
    .description(`Update all documents that match your queries, if no queries are submitted then all documents are updated. You can pass only specific fields to be updated.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .option(`--data <data>`, `Document data as JSON object. Include only attribute and value pairs to be updated.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .action(actionRunner(databasesUpdateDocuments))

databases
    .command(`delete-documents`)
    .description(`Bulk delete documents using queries, if no queries are passed then all documents are deleted.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .action(actionRunner(databasesDeleteDocuments))

databases
    .command(`get-document`)
    .description(`Get a document by its unique ID. This endpoint response returns a JSON object with the document data.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--document-id <document-id>`, `Document ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesGetDocument))

databases
    .command(`update-document`)
    .description(`Update a document by its unique ID. Using the patch method you can pass only specific fields that will get updated.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--document-id <document-id>`, `Document ID.`)
    .option(`--data <data>`, `Document data as JSON object. Include only attribute and value pairs to be updated.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .action(actionRunner(databasesUpdateDocument))

databases
    .command(`delete-document`)
    .description(`Delete a document by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--document-id <document-id>`, `Document ID.`)
    .action(actionRunner(databasesDeleteDocument))

databases
    .command(`list-document-logs`)
    .description(`Get the document activity logs list by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--document-id <document-id>`, `Document ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(databasesListDocumentLogs))

databases
    .command(`list-indexes`)
    .description(`List indexes in the collection.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, status, attributes, error`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesListIndexes))

databases
    .command(`create-index`)
    .description(`Creates an index on the attributes listed. Your index should include all the attributes you will query in a single request. Attributes can be 'key', 'fulltext', and 'unique'.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .requiredOption(`--type <type>`, `Index type.`)
    .requiredOption(`--attributes [attributes...]`, `Array of attributes to index. Maximum of 100 attributes are allowed, each 32 characters long.`)
    .option(`--orders [orders...]`, `Array of index orders. Maximum of 100 orders are allowed.`)
    .option(`--lengths [lengths...]`, `Length of index. Maximum of 100`)
    .action(actionRunner(databasesCreateIndex))

databases
    .command(`get-index`)
    .description(`Get index by ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .action(actionRunner(databasesGetIndex))

databases
    .command(`delete-index`)
    .description(`Delete an index.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .action(actionRunner(databasesDeleteIndex))

databases
    .command(`list-collection-logs`)
    .description(`Get the collection activity logs list by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(databasesListCollectionLogs))

databases
    .command(`get-collection-usage`)
    .description(`Get usage metrics and statistics for a collection. Returning the total number of documents. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .option(`--range <range>`, `Date range.`)
    .action(actionRunner(databasesGetCollectionUsage))

databases
    .command(`list-logs`)
    .description(`Get the database activity logs list by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(databasesListLogs))

databases
    .command(`get-database-usage`)
    .description(`Get usage metrics and statistics for a database. You can view the total number of collections, documents, and storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .option(`--range <range>`, `'Date range.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesGetDatabaseUsage))

module.exports = {
    databases,
    databasesList,
    databasesCreate,
    databasesGetUsage,
    databasesGet,
    databasesUpdate,
    databasesDelete,
    databasesListCollections,
    databasesCreateCollection,
    databasesGetCollection,
    databasesUpdateCollection,
    databasesDeleteCollection,
    databasesListAttributes,
    databasesCreateBooleanAttribute,
    databasesUpdateBooleanAttribute,
    databasesCreateDatetimeAttribute,
    databasesUpdateDatetimeAttribute,
    databasesCreateEmailAttribute,
    databasesUpdateEmailAttribute,
    databasesCreateEnumAttribute,
    databasesUpdateEnumAttribute,
    databasesCreateFloatAttribute,
    databasesUpdateFloatAttribute,
    databasesCreateIntegerAttribute,
    databasesUpdateIntegerAttribute,
    databasesCreateIpAttribute,
    databasesUpdateIpAttribute,
    databasesCreateRelationshipAttribute,
    databasesCreateStringAttribute,
    databasesUpdateStringAttribute,
    databasesCreateUrlAttribute,
    databasesUpdateUrlAttribute,
    databasesGetAttribute,
    databasesDeleteAttribute,
    databasesUpdateRelationshipAttribute,
    databasesListDocuments,
    databasesCreateDocument,
    databasesCreateDocuments,
    databasesUpsertDocuments,
    databasesUpdateDocuments,
    databasesDeleteDocuments,
    databasesGetDocument,
    databasesUpdateDocument,
    databasesDeleteDocument,
    databasesListDocumentLogs,
    databasesListIndexes,
    databasesCreateIndex,
    databasesGetIndex,
    databasesDeleteIndex,
    databasesListCollectionLogs,
    databasesGetCollectionUsage,
    databasesListLogs,
    databasesGetDatabaseUsage
};
