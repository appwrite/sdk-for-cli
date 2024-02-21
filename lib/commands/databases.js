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

const databases = new Command("databases").description(commandDescriptions['databases']).configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} DatabasesListRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesListRequestParams} params
 */
const databasesList = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} DatabasesCreateRequestParams
 * @property {string} databaseId Unique Id. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Database name. Max length: 128 chars.
 * @property {boolean} enabled Is the database enabled? When set to &#039;disabled&#039;, users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateRequestParams} params
 */
const databasesCreate = async ({ databaseId, name, enabled, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} DatabasesGetUsageRequestParams
 * @property {string} range &#039;Date range.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesGetUsageRequestParams} params
 */
const databasesGetUsage = async ({ range, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/usage';
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
 * @typedef {Object} DatabasesGetRequestParams
 * @property {string} databaseId Database ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesGetRequestParams} params
 */
const databasesGet = async ({ databaseId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}'.replace('{databaseId}', databaseId);
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
 * @typedef {Object} DatabasesUpdateRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} name Database name. Max length: 128 chars.
 * @property {boolean} enabled Is database enabled? When set to &#039;disabled&#039;, users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateRequestParams} params
 */
const databasesUpdate = async ({ databaseId, name, enabled, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} DatabasesDeleteRequestParams
 * @property {string} databaseId Database ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesDeleteRequestParams} params
 */
const databasesDelete = async ({ databaseId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}'.replace('{databaseId}', databaseId);
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
 * @typedef {Object} DatabasesListCollectionsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, documentSecurity
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesListCollectionsRequestParams} params
 */
const databasesListCollections = async ({ databaseId, queries, search, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
        success()
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
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateCollectionRequestParams} params
 */
const databasesCreateCollection = async ({ databaseId, collectionId, name, permissions, documentSecurity, enabled, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} DatabasesGetCollectionRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesGetCollectionRequestParams} params
 */
const databasesGetCollection = async ({ databaseId, collectionId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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
 * @typedef {Object} DatabasesUpdateCollectionRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID.
 * @property {string} name Collection name. Max length: 128 chars.
 * @property {string[]} permissions An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} documentSecurity Enables configuring permissions for individual documents. A user needs one of document or collection level permissions to access a document. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} enabled Is collection enabled? When set to &#039;disabled&#039;, users cannot access the collection but Server SDKs with and API key can still read and write to the collection. No data is lost when this is toggled.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateCollectionRequestParams} params
 */
const databasesUpdateCollection = async ({ databaseId, collectionId, name, permissions, documentSecurity, enabled, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} DatabasesDeleteCollectionRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesDeleteCollectionRequestParams} params
 */
const databasesDeleteCollection = async ({ databaseId, collectionId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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
 * @typedef {Object} DatabasesListAttributesRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, size, required, array, status, error
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesListAttributesRequestParams} params
 */
const databasesListAttributes = async ({ databaseId, collectionId, queries, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
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
 * @typedef {Object} DatabasesCreateBooleanAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {boolean} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {boolean} array Is attribute an array?
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateBooleanAttributeRequestParams} params
 */
const databasesCreateBooleanAttribute = async ({ databaseId, collectionId, key, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        success()
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
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateBooleanAttributeRequestParams} params
 */
const databasesUpdateBooleanAttribute = async ({ databaseId, collectionId, key, required, xdefault, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/boolean/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
    let payload = {};
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
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
 * @typedef {Object} DatabasesCreateDatetimeAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {string} xdefault Default value for the attribute in ISO 8601 format. Cannot be set when attribute is required.
 * @property {boolean} array Is attribute an array?
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateDatetimeAttributeRequestParams} params
 */
const databasesCreateDatetimeAttribute = async ({ databaseId, collectionId, key, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        success()
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
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateDatetimeAttributeRequestParams} params
 */
const databasesUpdateDatetimeAttribute = async ({ databaseId, collectionId, key, required, xdefault, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/datetime/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
    let payload = {};
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
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
 * @typedef {Object} DatabasesCreateEmailAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {string} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {boolean} array Is attribute an array?
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateEmailAttributeRequestParams} params
 */
const databasesCreateEmailAttribute = async ({ databaseId, collectionId, key, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        success()
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
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateEmailAttributeRequestParams} params
 */
const databasesUpdateEmailAttribute = async ({ databaseId, collectionId, key, required, xdefault, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/email/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
    let payload = {};
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
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
 * @typedef {Object} DatabasesCreateEnumAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {string[]} elements Array of elements in enumerated type. Uses length of longest element to determine size. Maximum of 100 elements are allowed, each 255 characters long.
 * @property {boolean} required Is attribute required?
 * @property {string} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {boolean} array Is attribute an array?
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateEnumAttributeRequestParams} params
 */
const databasesCreateEnumAttribute = async ({ databaseId, collectionId, key, elements, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        success()
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
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateEnumAttributeRequestParams} params
 */
const databasesUpdateEnumAttribute = async ({ databaseId, collectionId, key, elements, required, xdefault, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
 * @typedef {Object} DatabasesCreateFloatAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {number} min Minimum value to enforce on new documents
 * @property {number} max Maximum value to enforce on new documents
 * @property {number} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {boolean} array Is attribute an array?
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateFloatAttributeRequestParams} params
 */
const databasesCreateFloatAttribute = async ({ databaseId, collectionId, key, required, min, max, xdefault, array, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} DatabasesUpdateFloatAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {number} min Minimum value to enforce on new documents
 * @property {number} max Maximum value to enforce on new documents
 * @property {number} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateFloatAttributeRequestParams} params
 */
const databasesUpdateFloatAttribute = async ({ databaseId, collectionId, key, required, min, max, xdefault, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
 * @typedef {Object} DatabasesCreateIntegerAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {number} min Minimum value to enforce on new documents
 * @property {number} max Maximum value to enforce on new documents
 * @property {number} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {boolean} array Is attribute an array?
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateIntegerAttributeRequestParams} params
 */
const databasesCreateIntegerAttribute = async ({ databaseId, collectionId, key, required, min, max, xdefault, array, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} DatabasesUpdateIntegerAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {number} min Minimum value to enforce on new documents
 * @property {number} max Maximum value to enforce on new documents
 * @property {number} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateIntegerAttributeRequestParams} params
 */
const databasesUpdateIntegerAttribute = async ({ databaseId, collectionId, key, required, min, max, xdefault, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
 * @typedef {Object} DatabasesCreateIpAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {string} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {boolean} array Is attribute an array?
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateIpAttributeRequestParams} params
 */
const databasesCreateIpAttribute = async ({ databaseId, collectionId, key, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        success()
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
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateIpAttributeRequestParams} params
 */
const databasesUpdateIpAttribute = async ({ databaseId, collectionId, key, required, xdefault, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/ip/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
    let payload = {};
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
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
 * @typedef {Object} DatabasesCreateRelationshipAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} relatedCollectionId Related Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} type Relation type
 * @property {boolean} twoWay Is Two Way?
 * @property {string} key Attribute Key.
 * @property {string} twoWayKey Two Way Attribute Key.
 * @property {string} onDelete Constraints option
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateRelationshipAttributeRequestParams} params
 */
const databasesCreateRelationshipAttribute = async ({ databaseId, collectionId, relatedCollectionId, type, twoWay, key, twoWayKey, onDelete, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        success()
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
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateStringAttributeRequestParams} params
 */
const databasesCreateStringAttribute = async ({ databaseId, collectionId, key, size, required, xdefault, array, encrypt, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        success()
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
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateStringAttributeRequestParams} params
 */
const databasesUpdateStringAttribute = async ({ databaseId, collectionId, key, required, xdefault, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/string/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
    let payload = {};
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
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
 * @typedef {Object} DatabasesCreateUrlAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} required Is attribute required?
 * @property {string} xdefault Default value for attribute when not provided. Cannot be set when attribute is required.
 * @property {boolean} array Is attribute an array?
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateUrlAttributeRequestParams} params
 */
const databasesCreateUrlAttribute = async ({ databaseId, collectionId, key, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        success()
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
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateUrlAttributeRequestParams} params
 */
const databasesUpdateUrlAttribute = async ({ databaseId, collectionId, key, required, xdefault, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/url/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
    let payload = {};
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
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
 * @typedef {Object} DatabasesGetAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesGetAttributeRequestParams} params
 */
const databasesGetAttribute = async ({ databaseId, collectionId, key, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
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
 * @typedef {Object} DatabasesDeleteAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesDeleteAttributeRequestParams} params
 */
const databasesDeleteAttribute = async ({ databaseId, collectionId, key, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
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
 * @typedef {Object} DatabasesUpdateRelationshipAttributeRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Attribute Key.
 * @property {string} onDelete Constraints option
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateRelationshipAttributeRequestParams} params
 */
const databasesUpdateRelationshipAttribute = async ({ databaseId, collectionId, key, onDelete, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/attributes/{key}/relationship'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
    let payload = {};
    if (typeof onDelete !== 'undefined') {
        payload['onDelete'] = onDelete;
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
 * @typedef {Object} DatabasesListDocumentsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesListDocumentsRequestParams} params
 */
const databasesListDocuments = async ({ databaseId, collectionId, queries, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/documents'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
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
 * @typedef {Object} DatabasesCreateDocumentRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.
 * @property {string} documentId Document ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {object} data Document data as JSON object.
 * @property {string[]} permissions An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateDocumentRequestParams} params
 */
const databasesCreateDocument = async ({ databaseId, collectionId, documentId, data, permissions, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} DatabasesGetDocumentRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} documentId Document ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Only method allowed is select.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesGetDocumentRequestParams} params
 */
const databasesGetDocument = async ({ databaseId, collectionId, documentId, queries, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
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
 * @typedef {Object} DatabasesUpdateDocumentRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID.
 * @property {string} documentId Document ID.
 * @property {object} data Document data as JSON object. Include only attribute and value pairs to be updated.
 * @property {string[]} permissions An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesUpdateDocumentRequestParams} params
 */
const databasesUpdateDocument = async ({ databaseId, collectionId, documentId, data, permissions, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} DatabasesDeleteDocumentRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} documentId Document ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesDeleteDocumentRequestParams} params
 */
const databasesDeleteDocument = async ({ databaseId, collectionId, documentId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
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
 * @typedef {Object} DatabasesListDocumentLogsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID.
 * @property {string} documentId Document ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesListDocumentLogsRequestParams} params
 */
const databasesListDocumentLogs = async ({ databaseId, collectionId, documentId, queries, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}/logs'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
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
 * @typedef {Object} DatabasesListIndexesRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, status, attributes, error
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesListIndexesRequestParams} params
 */
const databasesListIndexes = async ({ databaseId, collectionId, queries, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/indexes'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
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
 * @typedef {Object} DatabasesCreateIndexRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Index Key.
 * @property {string} type Index type.
 * @property {string[]} attributes Array of attributes to index. Maximum of 100 attributes are allowed, each 32 characters long.
 * @property {string[]} orders Array of index orders. Maximum of 100 orders are allowed.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesCreateIndexRequestParams} params
 */
const databasesCreateIndex = async ({ databaseId, collectionId, key, type, attributes, orders, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
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
 * @typedef {Object} DatabasesGetIndexRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Index Key.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesGetIndexRequestParams} params
 */
const databasesGetIndex = async ({ databaseId, collectionId, key, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/indexes/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
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
 * @typedef {Object} DatabasesDeleteIndexRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).
 * @property {string} key Index Key.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesDeleteIndexRequestParams} params
 */
const databasesDeleteIndex = async ({ databaseId, collectionId, key, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/indexes/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
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
 * @typedef {Object} DatabasesListCollectionLogsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesListCollectionLogsRequestParams} params
 */
const databasesListCollectionLogs = async ({ databaseId, collectionId, queries, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/logs'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
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
 * @typedef {Object} DatabasesGetCollectionUsageRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} collectionId Collection ID.
 * @property {string} range Date range.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesGetCollectionUsageRequestParams} params
 */
const databasesGetCollectionUsage = async ({ databaseId, collectionId, range, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/collections/{collectionId}/usage'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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
 * @typedef {Object} DatabasesListLogsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesListLogsRequestParams} params
 */
const databasesListLogs = async ({ databaseId, queries, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/logs'.replace('{databaseId}', databaseId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
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
 * @typedef {Object} DatabasesGetDatabaseUsageRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} range &#039;Date range.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {DatabasesGetDatabaseUsageRequestParams} params
 */
const databasesGetDatabaseUsage = async ({ databaseId, range, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/databases/{databaseId}/usage'.replace('{databaseId}', databaseId);
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

databases
    .command(`list`)
    .description(`Get a list of all databases from the current Appwrite project. You can use the search parameter to filter your results.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(databasesList))

databases
    .command(`create`)
    .description(`Create a new Database. `)
    .requiredOption(`--databaseId <databaseId>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Database name. Max length: 128 chars.`)
    .option(`--enabled <enabled>`, `Is the database enabled? When set to 'disabled', users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.`, parseBool)
    .action(actionRunner(databasesCreate))

databases
    .command(`getUsage`)
    .description(``)
    .option(`--range <range>`, `'Date range.`)
    .action(actionRunner(databasesGetUsage))

databases
    .command(`get`)
    .description(`Get a database by its unique ID. This endpoint response returns a JSON object with the database metadata.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .action(actionRunner(databasesGet))

databases
    .command(`update`)
    .description(`Update a database by its unique ID.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--name <name>`, `Database name. Max length: 128 chars.`)
    .option(`--enabled <enabled>`, `Is database enabled? When set to 'disabled', users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.`, parseBool)
    .action(actionRunner(databasesUpdate))

databases
    .command(`delete`)
    .description(`Delete a database by its unique ID. Only API keys with with databases.write scope can delete a database.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .action(actionRunner(databasesDelete))

databases
    .command(`listCollections`)
    .description(`Get a list of all collections that belong to the provided databaseId. You can use the search parameter to filter your results.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, documentSecurity`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(databasesListCollections))

databases
    .command(`createCollection`)
    .description(`Create a new Collection. Before using this route, you should create a new database resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, no user is granted with any permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--documentSecurity <documentSecurity>`, `Enables configuring permissions for individual documents. A user needs one of document or collection level permissions to access a document. [Learn more about permissions](https://appwrite.io/docs/permissions).`, parseBool)
    .option(`--enabled <enabled>`, `Is collection enabled? When set to 'disabled', users cannot access the collection but Server SDKs with and API key can still read and write to the collection. No data is lost when this is toggled.`, parseBool)
    .action(actionRunner(databasesCreateCollection))

databases
    .command(`getCollection`)
    .description(`Get a collection by its unique ID. This endpoint response returns a JSON object with the collection metadata.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .action(actionRunner(databasesGetCollection))

databases
    .command(`updateCollection`)
    .description(`Update a collection by its unique ID.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
    .option(`--permissions [permissions...]`, `An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--documentSecurity <documentSecurity>`, `Enables configuring permissions for individual documents. A user needs one of document or collection level permissions to access a document. [Learn more about permissions](https://appwrite.io/docs/permissions).`, parseBool)
    .option(`--enabled <enabled>`, `Is collection enabled? When set to 'disabled', users cannot access the collection but Server SDKs with and API key can still read and write to the collection. No data is lost when this is toggled.`, parseBool)
    .action(actionRunner(databasesUpdateCollection))

databases
    .command(`deleteCollection`)
    .description(`Delete a collection by its unique ID. Only users with write permissions have access to delete this resource.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .action(actionRunner(databasesDeleteCollection))

databases
    .command(`listAttributes`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, size, required, array, status, error`)
    .action(actionRunner(databasesListAttributes))

databases
    .command(`createBooleanAttribute`)
    .description(`Create a boolean attribute. `)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, parseBool)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateBooleanAttribute))

databases
    .command(`updateBooleanAttribute`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, parseBool)
    .action(actionRunner(databasesUpdateBooleanAttribute))

databases
    .command(`createDatetimeAttribute`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for the attribute in ISO 8601 format. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateDatetimeAttribute))

databases
    .command(`updateDatetimeAttribute`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .action(actionRunner(databasesUpdateDatetimeAttribute))

databases
    .command(`createEmailAttribute`)
    .description(`Create an email attribute. `)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateEmailAttribute))

databases
    .command(`updateEmailAttribute`)
    .description(`Update an email attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .action(actionRunner(databasesUpdateEmailAttribute))

databases
    .command(`createEnumAttribute`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--elements [elements...]`, `Array of elements in enumerated type. Uses length of longest element to determine size. Maximum of 100 elements are allowed, each 255 characters long.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateEnumAttribute))

databases
    .command(`updateEnumAttribute`)
    .description(`Update an enum attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--elements [elements...]`, `Array of elements in enumerated type. Uses length of longest element to determine size. Maximum of 100 elements are allowed, each 255 characters long.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .action(actionRunner(databasesUpdateEnumAttribute))

databases
    .command(`createFloatAttribute`)
    .description(`Create a float attribute. Optionally, minimum and maximum values can be provided. `)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--min <min>`, `Minimum value to enforce on new documents`, parseInteger)
    .option(`--max <max>`, `Maximum value to enforce on new documents`, parseInteger)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, parseInteger)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateFloatAttribute))

databases
    .command(`updateFloatAttribute`)
    .description(`Update a float attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .requiredOption(`--min <min>`, `Minimum value to enforce on new documents`, parseInteger)
    .requiredOption(`--max <max>`, `Maximum value to enforce on new documents`, parseInteger)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, parseInteger)
    .action(actionRunner(databasesUpdateFloatAttribute))

databases
    .command(`createIntegerAttribute`)
    .description(`Create an integer attribute. Optionally, minimum and maximum values can be provided. `)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--min <min>`, `Minimum value to enforce on new documents`, parseInteger)
    .option(`--max <max>`, `Maximum value to enforce on new documents`, parseInteger)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, parseInteger)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateIntegerAttribute))

databases
    .command(`updateIntegerAttribute`)
    .description(`Update an integer attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .requiredOption(`--min <min>`, `Minimum value to enforce on new documents`, parseInteger)
    .requiredOption(`--max <max>`, `Maximum value to enforce on new documents`, parseInteger)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, parseInteger)
    .action(actionRunner(databasesUpdateIntegerAttribute))

databases
    .command(`createIpAttribute`)
    .description(`Create IP address attribute. `)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateIpAttribute))

databases
    .command(`updateIpAttribute`)
    .description(`Update an ip attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .action(actionRunner(databasesUpdateIpAttribute))

databases
    .command(`createRelationshipAttribute`)
    .description(`Create relationship attribute. [Learn more about relationship attributes](https://appwrite.io/docs/databases-relationships#relationship-attributes). `)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--relatedCollectionId <relatedCollectionId>`, `Related Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--type <type>`, `Relation type`)
    .option(`--twoWay <twoWay>`, `Is Two Way?`, parseBool)
    .option(`--key <key>`, `Attribute Key.`)
    .option(`--twoWayKey <twoWayKey>`, `Two Way Attribute Key.`)
    .option(`--onDelete <onDelete>`, `Constraints option`)
    .action(actionRunner(databasesCreateRelationshipAttribute))

databases
    .command(`createStringAttribute`)
    .description(`Create a string attribute. `)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--size <size>`, `Attribute size for text attributes, in number of characters.`, parseInteger)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .option(`--encrypt <encrypt>`, `Toggle encryption for the attribute. Encryption enhances security by not storing any plain text values in the database. However, encrypted attributes cannot be queried.`, parseBool)
    .action(actionRunner(databasesCreateStringAttribute))

databases
    .command(`updateStringAttribute`)
    .description(`Update a string attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .action(actionRunner(databasesUpdateStringAttribute))

databases
    .command(`createUrlAttribute`)
    .description(`Create a URL attribute. `)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateUrlAttribute))

databases
    .command(`updateUrlAttribute`)
    .description(`Update an url attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .action(actionRunner(databasesUpdateUrlAttribute))

databases
    .command(`getAttribute`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .action(actionRunner(databasesGetAttribute))

databases
    .command(`deleteAttribute`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .action(actionRunner(databasesDeleteAttribute))

databases
    .command(`updateRelationshipAttribute`)
    .description(`Update relationship attribute. [Learn more about relationship attributes](https://appwrite.io/docs/databases-relationships#relationship-attributes). `)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .option(`--onDelete <onDelete>`, `Constraints option`)
    .action(actionRunner(databasesUpdateRelationshipAttribute))

databases
    .command(`listDocuments`)
    .description(`Get a list of all the user's documents in a given collection. You can use the query params to filter your results.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .action(actionRunner(databasesListDocuments))

databases
    .command(`createDocument`)
    .description(`Create a new Document. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.`)
    .requiredOption(`--documentId <documentId>`, `Document ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--data <data>`, `Document data as JSON object.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .action(actionRunner(databasesCreateDocument))

databases
    .command(`getDocument`)
    .description(`Get a document by its unique ID. This endpoint response returns a JSON object with the document data.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--documentId <documentId>`, `Document ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Only method allowed is select.`)
    .action(actionRunner(databasesGetDocument))

databases
    .command(`updateDocument`)
    .description(`Update a document by its unique ID. Using the patch method you can pass only specific fields that will get updated.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .requiredOption(`--documentId <documentId>`, `Document ID.`)
    .option(`--data <data>`, `Document data as JSON object. Include only attribute and value pairs to be updated.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .action(actionRunner(databasesUpdateDocument))

databases
    .command(`deleteDocument`)
    .description(`Delete a document by its unique ID.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--documentId <documentId>`, `Document ID.`)
    .action(actionRunner(databasesDeleteDocument))

databases
    .command(`listDocumentLogs`)
    .description(`Get the document activity logs list by its unique ID.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .requiredOption(`--documentId <documentId>`, `Document ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(databasesListDocumentLogs))

databases
    .command(`listIndexes`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, status, attributes, error`)
    .action(actionRunner(databasesListIndexes))

databases
    .command(`createIndex`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .requiredOption(`--type <type>`, `Index type.`)
    .requiredOption(`--attributes [attributes...]`, `Array of attributes to index. Maximum of 100 attributes are allowed, each 32 characters long.`)
    .option(`--orders [orders...]`, `Array of index orders. Maximum of 100 orders are allowed.`)
    .action(actionRunner(databasesCreateIndex))

databases
    .command(`getIndex`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .action(actionRunner(databasesGetIndex))

databases
    .command(`deleteIndex`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .action(actionRunner(databasesDeleteIndex))

databases
    .command(`listCollectionLogs`)
    .description(`Get the collection activity logs list by its unique ID.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(databasesListCollectionLogs))

databases
    .command(`getCollectionUsage`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .option(`--range <range>`, `Date range.`)
    .action(actionRunner(databasesGetCollectionUsage))

databases
    .command(`listLogs`)
    .description(`Get the database activity logs list by its unique ID.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(databasesListLogs))

databases
    .command(`getDatabaseUsage`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .option(`--range <range>`, `'Date range.`)
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