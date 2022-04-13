const fs = require('fs');
const tar = require("tar");
const { promisify } = require('util');
const libClient = require('../client.js');
const { Command } = require('commander');
const { sdkForProject, sdkForConsole } = require('../sdks')
const { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log } = require('../parser')
const { localConfig, globalConfig } = require("../config");

const database = new Command("database").description(commandDescriptions['database'])

const databaseListCollections = async ({ search, limit, offset, cursor, cursorDirection, orderType, parseOutput = true, sdk = undefined}) => {
    /* @param {string} search */
    /* @param {number} limit */
    /* @param {number} offset */
    /* @param {string} cursor */
    /* @param {string} cursorDirection */
    /* @param {string} orderType */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections';
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

const databaseCreateCollection = async ({ collectionId, name, permission, read, write, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} name */
    /* @param {string} permission */
    /* @param {string[]} read */
    /* @param {string[]} write */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections';
    let payload = {};
    
    /** Body Params */
    if (typeof collectionId !== 'undefined') {
        payload['collectionId'] = collectionId;
    }

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    if (typeof permission !== 'undefined') {
        payload['permission'] = permission;
    }

    if (typeof read !== 'undefined') {
        payload['read'] = read;
    }

    if (typeof write !== 'undefined') {
        payload['write'] = write;
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

const databaseGetCollection = async ({ collectionId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}'.replace('{collectionId}', collectionId);
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

const databaseUpdateCollection = async ({ collectionId, name, permission, read, write, enabled, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} name */
    /* @param {string} permission */
    /* @param {string[]} read */
    /* @param {string[]} write */
    /* @param {boolean} enabled */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}'.replace('{collectionId}', collectionId);
    let payload = {};
    
    /** Body Params */
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    if (typeof permission !== 'undefined') {
        payload['permission'] = permission;
    }

    if (typeof read !== 'undefined') {
        payload['read'] = read;
    }

    if (typeof write !== 'undefined') {
        payload['write'] = write;
    }

    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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

const databaseDeleteCollection = async ({ collectionId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}'.replace('{collectionId}', collectionId);
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

const databaseListAttributes = async ({ collectionId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/attributes'.replace('{collectionId}', collectionId);
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

const databaseCreateBooleanAttribute = async ({ collectionId, key, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {boolean} required */
    /* @param {boolean} xdefault */
    /* @param {boolean} array */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/attributes/boolean'.replace('{collectionId}', collectionId);
    let payload = {};
    
    /** Body Params */
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
    response = await client.call('post', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const databaseCreateEmailAttribute = async ({ collectionId, key, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {boolean} required */
    /* @param {string} xdefault */
    /* @param {boolean} array */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/attributes/email'.replace('{collectionId}', collectionId);
    let payload = {};
    
    /** Body Params */
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
    response = await client.call('post', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const databaseCreateEnumAttribute = async ({ collectionId, key, elements, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {string[]} elements */
    /* @param {boolean} required */
    /* @param {string} xdefault */
    /* @param {boolean} array */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/attributes/enum'.replace('{collectionId}', collectionId);
    let payload = {};
    
    /** Body Params */
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }

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
    response = await client.call('post', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const databaseCreateFloatAttribute = async ({ collectionId, key, required, min, max, xdefault, array, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {boolean} required */
    /* @param {number} min */
    /* @param {number} max */
    /* @param {number} xdefault */
    /* @param {boolean} array */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/attributes/float'.replace('{collectionId}', collectionId);
    let payload = {};
    
    /** Body Params */
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
    response = await client.call('post', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const databaseCreateIntegerAttribute = async ({ collectionId, key, required, min, max, xdefault, array, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {boolean} required */
    /* @param {number} min */
    /* @param {number} max */
    /* @param {number} xdefault */
    /* @param {boolean} array */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/attributes/integer'.replace('{collectionId}', collectionId);
    let payload = {};
    
    /** Body Params */
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
    response = await client.call('post', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const databaseCreateIpAttribute = async ({ collectionId, key, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {boolean} required */
    /* @param {string} xdefault */
    /* @param {boolean} array */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/attributes/ip'.replace('{collectionId}', collectionId);
    let payload = {};
    
    /** Body Params */
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
    response = await client.call('post', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const databaseCreateStringAttribute = async ({ collectionId, key, size, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {number} size */
    /* @param {boolean} required */
    /* @param {string} xdefault */
    /* @param {boolean} array */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/attributes/string'.replace('{collectionId}', collectionId);
    let payload = {};
    
    /** Body Params */
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

const databaseCreateUrlAttribute = async ({ collectionId, key, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {boolean} required */
    /* @param {string} xdefault */
    /* @param {boolean} array */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/attributes/url'.replace('{collectionId}', collectionId);
    let payload = {};
    
    /** Body Params */
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
    response = await client.call('post', path, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const databaseGetAttribute = async ({ collectionId, key, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} key */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/attributes/{key}'.replace('{collectionId}', collectionId).replace('{key}', key);
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

const databaseDeleteAttribute = async ({ collectionId, key, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} key */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/attributes/{key}'.replace('{collectionId}', collectionId).replace('{key}', key);
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

const databaseListDocuments = async ({ collectionId, queries, limit, offset, cursor, cursorDirection, orderAttributes, orderTypes, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string[]} queries */
    /* @param {number} limit */
    /* @param {number} offset */
    /* @param {string} cursor */
    /* @param {string} cursorDirection */
    /* @param {string[]} orderAttributes */
    /* @param {string[]} orderTypes */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/documents'.replace('{collectionId}', collectionId);
    let payload = {};

    /** Query Params */
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
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
    if (typeof orderAttributes !== 'undefined') {
        payload['orderAttributes'] = orderAttributes;
    }
    if (typeof orderTypes !== 'undefined') {
        payload['orderTypes'] = orderTypes;
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

const databaseCreateDocument = async ({ collectionId, documentId, data, read, write, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} documentId */
    /* @param {object} data */
    /* @param {string[]} read */
    /* @param {string[]} write */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/documents'.replace('{collectionId}', collectionId);
    let payload = {};
    
    /** Body Params */
    if (typeof documentId !== 'undefined') {
        payload['documentId'] = documentId;
    }

    if (typeof data !== 'undefined') {
        payload['data'] = JSON.parse(data);
    }

    if (typeof read !== 'undefined') {
        payload['read'] = read;
    }

    if (typeof write !== 'undefined') {
        payload['write'] = write;
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

const databaseGetDocument = async ({ collectionId, documentId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} documentId */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/documents/{documentId}'.replace('{collectionId}', collectionId).replace('{documentId}', documentId);
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

const databaseUpdateDocument = async ({ collectionId, documentId, data, read, write, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} documentId */
    /* @param {object} data */
    /* @param {string[]} read */
    /* @param {string[]} write */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/documents/{documentId}'.replace('{collectionId}', collectionId).replace('{documentId}', documentId);
    let payload = {};
    
    /** Body Params */
    if (typeof data !== 'undefined') {
        payload['data'] = JSON.parse(data);
    }

    if (typeof read !== 'undefined') {
        payload['read'] = read;
    }

    if (typeof write !== 'undefined') {
        payload['write'] = write;
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

const databaseDeleteDocument = async ({ collectionId, documentId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} documentId */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/documents/{documentId}'.replace('{collectionId}', collectionId).replace('{documentId}', documentId);
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

const databaseListDocumentLogs = async ({ collectionId, documentId, limit, offset, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} documentId */
    /* @param {number} limit */
    /* @param {number} offset */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/documents/{documentId}/logs'.replace('{collectionId}', collectionId).replace('{documentId}', documentId);
    let payload = {};

    /** Query Params */
    if (typeof limit !== 'undefined') {
        payload['limit'] = limit;
    }
    if (typeof offset !== 'undefined') {
        payload['offset'] = offset;
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

const databaseListIndexes = async ({ collectionId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/indexes'.replace('{collectionId}', collectionId);
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

const databaseCreateIndex = async ({ collectionId, key, type, attributes, orders, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {string} type */
    /* @param {string[]} attributes */
    /* @param {string[]} orders */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/indexes'.replace('{collectionId}', collectionId);
    let payload = {};
    
    /** Body Params */
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }

    if (typeof type !== 'undefined') {
        payload['type'] = type;
    }

    if (typeof attributes !== 'undefined') {
        payload['attributes'] = attributes;
    }

    if (typeof orders !== 'undefined') {
        payload['orders'] = orders;
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

const databaseGetIndex = async ({ collectionId, key, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} key */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/indexes/{key}'.replace('{collectionId}', collectionId).replace('{key}', key);
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

const databaseDeleteIndex = async ({ collectionId, key, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} key */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/indexes/{key}'.replace('{collectionId}', collectionId).replace('{key}', key);
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

const databaseListCollectionLogs = async ({ collectionId, limit, offset, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {number} limit */
    /* @param {number} offset */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/collections/{collectionId}/logs'.replace('{collectionId}', collectionId);
    let payload = {};

    /** Query Params */
    if (typeof limit !== 'undefined') {
        payload['limit'] = limit;
    }
    if (typeof offset !== 'undefined') {
        payload['offset'] = offset;
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

const databaseGetUsage = async ({ range, parseOutput = true, sdk = undefined}) => {
    /* @param {string} range */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/usage';
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

const databaseGetCollectionUsage = async ({ collectionId, range, parseOutput = true, sdk = undefined}) => {
    /* @param {string} collectionId */
    /* @param {string} range */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/database/{collectionId}/usage'.replace('{collectionId}', collectionId);
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


database
    .command(`listCollections`)
    .description(`Get a list of all the user collections. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's collections. [Learn more about different API modes](/docs/admin).`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--limit <limit>`, `Maximum number of collection to return in response. By default will return maximum 25 results. Maximum of 100 results allowed per request.`, parseInteger)
    .option(`--offset <offset>`, `Offset value. The default value is 0. Use this param to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)`, parseInteger)
    .option(`--cursor <cursor>`, `ID of the collection used as the starting point for the query, excluding the collection itself. Should be used for efficient pagination when working with large sets of data.`)
    .option(`--cursorDirection <cursorDirection>`, `Direction of the cursor.`)
    .option(`--orderType <orderType>`, `Order result by ASC or DESC order.`)
    .action(actionRunner(databaseListCollections))

database
    .command(`createCollection`)
    .description(`Create a new Collection.`)
    .requiredOption(`--collectionId <collectionId>`, `Unique Id. Choose your own unique ID or pass the string "unique()" to auto generate it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
    .requiredOption(`--permission <permission>`, `Permissions type model to use for reading documents in this collection. You can use collection-level permission set once on the collection using the 'read' and 'write' params, or you can set document-level permission where each document read and write params will decide who has access to read and write to each document individually. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .requiredOption(`--read <read...>`, `An array of strings with read permissions. By default no user is granted with any read permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .requiredOption(`--write <write...>`, `An array of strings with write permissions. By default no user is granted with any write permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .action(actionRunner(databaseCreateCollection))

database
    .command(`getCollection`)
    .description(`Get a collection by its unique ID. This endpoint response returns a JSON object with the collection metadata.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .action(actionRunner(databaseGetCollection))

database
    .command(`updateCollection`)
    .description(`Update a collection by its unique ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
    .requiredOption(`--permission <permission>`, `Permissions type model to use for reading documents in this collection. You can use collection-level permission set once on the collection using the 'read' and 'write' params, or you can set document-level permission where each document read and write params will decide who has access to read and write to each document individually. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .option(`--read <read...>`, `An array of strings with read permissions. By default inherits the existing read permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .option(`--write <write...>`, `An array of strings with write permissions. By default inherits the existing write permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .option(`--enabled <enabled>`, `Is collection enabled?`, parseBool)
    .action(actionRunner(databaseUpdateCollection))

database
    .command(`deleteCollection`)
    .description(`Delete a collection by its unique ID. Only users with write permissions have access to delete this resource.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .action(actionRunner(databaseDeleteCollection))

database
    .command(`listAttributes`)
    .description(``)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .action(actionRunner(databaseListAttributes))

database
    .command(`createBooleanAttribute`)
    .description(`Create a boolean attribute. `)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, parseBool)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databaseCreateBooleanAttribute))

database
    .command(`createEmailAttribute`)
    .description(`Create an email attribute. `)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databaseCreateEmailAttribute))

database
    .command(`createEnumAttribute`)
    .description(``)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--elements <elements...>`, `Array of elements in enumerated type. Uses length of longest element to determine size.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databaseCreateEnumAttribute))

database
    .command(`createFloatAttribute`)
    .description(`Create a float attribute. Optionally, minimum and maximum values can be provided. `)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--min <min>`, `Minimum value to enforce on new documents`, parseInteger)
    .option(`--max <max>`, `Maximum value to enforce on new documents`, parseInteger)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, parseInteger)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databaseCreateFloatAttribute))

database
    .command(`createIntegerAttribute`)
    .description(`Create an integer attribute. Optionally, minimum and maximum values can be provided. `)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--min <min>`, `Minimum value to enforce on new documents`, parseInteger)
    .option(`--max <max>`, `Maximum value to enforce on new documents`, parseInteger)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, parseInteger)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databaseCreateIntegerAttribute))

database
    .command(`createIpAttribute`)
    .description(`Create IP address attribute. `)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databaseCreateIpAttribute))

database
    .command(`createStringAttribute`)
    .description(`Create a string attribute. `)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--size <size>`, `Attribute size for text attributes, in number of characters.`, parseInteger)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databaseCreateStringAttribute))

database
    .command(`createUrlAttribute`)
    .description(`Create a URL attribute. `)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databaseCreateUrlAttribute))

database
    .command(`getAttribute`)
    .description(``)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .action(actionRunner(databaseGetAttribute))

database
    .command(`deleteAttribute`)
    .description(``)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .action(actionRunner(databaseDeleteAttribute))

database
    .command(`listDocuments`)
    .description(`Get a list of all the user documents. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of the project's documents. [Learn more about different API modes](/docs/admin).`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .option(`--queries <queries...>`, `Array of query strings.`)
    .option(`--limit <limit>`, `Maximum number of documents to return in response. By default will return maximum 25 results. Maximum of 100 results allowed per request.`, parseInteger)
    .option(`--offset <offset>`, `Offset value. The default value is 0. Use this value to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)`, parseInteger)
    .option(`--cursor <cursor>`, `ID of the document used as the starting point for the query, excluding the document itself. Should be used for efficient pagination when working with large sets of data. [learn more about pagination](https://appwrite.io/docs/pagination)`)
    .option(`--cursorDirection <cursorDirection>`, `Direction of the cursor.`)
    .option(`--orderAttributes <orderAttributes...>`, `Array of attributes used to sort results.`)
    .option(`--orderTypes <orderTypes...>`, `Array of order directions for sorting attribtues. Possible values are DESC for descending order, or ASC for ascending order.`)
    .action(actionRunner(databaseListDocuments))

database
    .command(`createDocument`)
    .description(`Create a new Document. Before using this route, you should create a new collection resource using either a [server integration](/docs/server/database#databaseCreateCollection) API or directly from your database console.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection). Make sure to define attributes before creating documents.`)
    .requiredOption(`--documentId <documentId>`, `Document ID. Choose your own unique ID or pass the string "unique()" to auto generate it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--data <data>`, `Document data as JSON object.`)
    .option(`--read <read...>`, `An array of strings with read permissions. By default only the current user is granted with read permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .option(`--write <write...>`, `An array of strings with write permissions. By default only the current user is granted with write permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .action(actionRunner(databaseCreateDocument))

database
    .command(`getDocument`)
    .description(`Get a document by its unique ID. This endpoint response returns a JSON object with the document data.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--documentId <documentId>`, `Document ID.`)
    .action(actionRunner(databaseGetDocument))

database
    .command(`updateDocument`)
    .description(`Update a document by its unique ID. Using the patch method you can pass only specific fields that will get updated.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .requiredOption(`--documentId <documentId>`, `Document ID.`)
    .requiredOption(`--data <data>`, `Document data as JSON object.`)
    .option(`--read <read...>`, `An array of strings with read permissions. By default inherits the existing read permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .option(`--write <write...>`, `An array of strings with write permissions. By default inherits the existing write permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .action(actionRunner(databaseUpdateDocument))

database
    .command(`deleteDocument`)
    .description(`Delete a document by its unique ID. This endpoint deletes only the parent documents, its attributes and relations to other documents. Child documents **will not** be deleted.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--documentId <documentId>`, `Document ID.`)
    .action(actionRunner(databaseDeleteDocument))

database
    .command(`listDocumentLogs`)
    .description(`Get the document activity logs list by its unique ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .requiredOption(`--documentId <documentId>`, `Document ID.`)
    .option(`--limit <limit>`, `Maximum number of logs to return in response. By default will return maximum 25 results. Maximum of 100 results allowed per request.`, parseInteger)
    .option(`--offset <offset>`, `Offset value. The default value is 0. Use this value to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)`, parseInteger)
    .action(actionRunner(databaseListDocumentLogs))

database
    .command(`listIndexes`)
    .description(``)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .action(actionRunner(databaseListIndexes))

database
    .command(`createIndex`)
    .description(``)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .requiredOption(`--type <type>`, `Index type.`)
    .requiredOption(`--attributes <attributes...>`, `Array of attributes to index.`)
    .option(`--orders <orders...>`, `Array of index orders.`)
    .action(actionRunner(databaseCreateIndex))

database
    .command(`getIndex`)
    .description(``)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .action(actionRunner(databaseGetIndex))

database
    .command(`deleteIndex`)
    .description(``)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .action(actionRunner(databaseDeleteIndex))

database
    .command(`listCollectionLogs`)
    .description(`Get the collection activity logs list by its unique ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .option(`--limit <limit>`, `Maximum number of logs to return in response. By default will return maximum 25 results. Maximum of 100 results allowed per request.`, parseInteger)
    .option(`--offset <offset>`, `Offset value. The default value is 0. Use this value to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)`, parseInteger)
    .action(actionRunner(databaseListCollectionLogs))

database
    .command(`getUsage`)
    .description(``)
    .option(`--range <range>`, `Date range.`)
    .action(actionRunner(databaseGetUsage))

database
    .command(`getCollectionUsage`)
    .description(``)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .option(`--range <range>`, `Date range.`)
    .action(actionRunner(databaseGetCollectionUsage))


module.exports = {
    database,
    databaseListCollections,
    databaseCreateCollection,
    databaseGetCollection,
    databaseUpdateCollection,
    databaseDeleteCollection,
    databaseListAttributes,
    databaseCreateBooleanAttribute,
    databaseCreateEmailAttribute,
    databaseCreateEnumAttribute,
    databaseCreateFloatAttribute,
    databaseCreateIntegerAttribute,
    databaseCreateIpAttribute,
    databaseCreateStringAttribute,
    databaseCreateUrlAttribute,
    databaseGetAttribute,
    databaseDeleteAttribute,
    databaseListDocuments,
    databaseCreateDocument,
    databaseGetDocument,
    databaseUpdateDocument,
    databaseDeleteDocument,
    databaseListDocumentLogs,
    databaseListIndexes,
    databaseCreateIndex,
    databaseGetIndex,
    databaseDeleteIndex,
    databaseListCollectionLogs,
    databaseGetUsage,
    databaseGetCollectionUsage
};
