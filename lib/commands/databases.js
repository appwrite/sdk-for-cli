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

const databases = new Command("databases").description(commandDescriptions['databases'])

const databasesList = async ({ search, limit, offset, cursor, cursorDirection, orderType, parseOutput = true, sdk = undefined}) => {
    /* @param {string} search */
    /* @param {number} limit */
    /* @param {number} offset */
    /* @param {string} cursor */
    /* @param {string} cursorDirection */
    /* @param {string} orderType */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases';
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

const databasesCreate = async ({ databaseId, name, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} name */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases';
    let payload = {};
    
    /** Body Params */
    if (typeof databaseId !== 'undefined') {
        payload['databaseId'] = databaseId;
    }

    if (typeof name !== 'undefined') {
        payload['name'] = name;
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

const databasesGetUsage = async ({ range, parseOutput = true, sdk = undefined}) => {
    /* @param {string} range */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/usage';
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

const databasesGet = async ({ databaseId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}'.replace('{databaseId}', databaseId);
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

const databasesUpdate = async ({ databaseId, name, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} name */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}'.replace('{databaseId}', databaseId);
    let payload = {};
    
    /** Body Params */
    if (typeof name !== 'undefined') {
        payload['name'] = name;
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

const databasesDelete = async ({ databaseId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}'.replace('{databaseId}', databaseId);
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

const databasesListCollections = async ({ databaseId, search, limit, offset, cursor, cursorDirection, orderType, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} search */
    /* @param {number} limit */
    /* @param {number} offset */
    /* @param {string} cursor */
    /* @param {string} cursorDirection */
    /* @param {string} orderType */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections'.replace('{databaseId}', databaseId);
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

const databasesCreateCollection = async ({ databaseId, collectionId, name, permission, read, write, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} name */
    /* @param {string} permission */
    /* @param {string[]} read */
    /* @param {string[]} write */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections'.replace('{databaseId}', databaseId);
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

const databasesGetCollection = async ({ databaseId, collectionId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesUpdateCollection = async ({ databaseId, collectionId, name, permission, read, write, enabled, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} name */
    /* @param {string} permission */
    /* @param {string[]} read */
    /* @param {string[]} write */
    /* @param {boolean} enabled */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesDeleteCollection = async ({ databaseId, collectionId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesListAttributes = async ({ databaseId, collectionId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/attributes'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesCreateBooleanAttribute = async ({ databaseId, collectionId, key, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {boolean} required */
    /* @param {boolean} xdefault */
    /* @param {boolean} array */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/attributes/boolean'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesCreateEmailAttribute = async ({ databaseId, collectionId, key, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {boolean} required */
    /* @param {string} xdefault */
    /* @param {boolean} array */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/attributes/email'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesCreateEnumAttribute = async ({ databaseId, collectionId, key, elements, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {string[]} elements */
    /* @param {boolean} required */
    /* @param {string} xdefault */
    /* @param {boolean} array */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/attributes/enum'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesCreateFloatAttribute = async ({ databaseId, collectionId, key, required, min, max, xdefault, array, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {boolean} required */
    /* @param {number} min */
    /* @param {number} max */
    /* @param {number} xdefault */
    /* @param {boolean} array */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/attributes/float'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesCreateIntegerAttribute = async ({ databaseId, collectionId, key, required, min, max, xdefault, array, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {boolean} required */
    /* @param {number} min */
    /* @param {number} max */
    /* @param {number} xdefault */
    /* @param {boolean} array */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/attributes/integer'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesCreateIpAttribute = async ({ databaseId, collectionId, key, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {boolean} required */
    /* @param {string} xdefault */
    /* @param {boolean} array */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/attributes/ip'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesCreateStringAttribute = async ({ databaseId, collectionId, key, size, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {number} size */
    /* @param {boolean} required */
    /* @param {string} xdefault */
    /* @param {boolean} array */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/attributes/string'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesCreateUrlAttribute = async ({ databaseId, collectionId, key, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {boolean} required */
    /* @param {string} xdefault */
    /* @param {boolean} array */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/attributes/url'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesGetAttribute = async ({ databaseId, collectionId, key, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} key */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/attributes/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
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

const databasesDeleteAttribute = async ({ databaseId, collectionId, key, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} key */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/attributes/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
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

const databasesListDocuments = async ({ databaseId, collectionId, queries, limit, offset, cursor, cursorDirection, orderAttributes, orderTypes, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string[]} queries */
    /* @param {number} limit */
    /* @param {number} offset */
    /* @param {string} cursor */
    /* @param {string} cursorDirection */
    /* @param {string[]} orderAttributes */
    /* @param {string[]} orderTypes */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/documents'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesCreateDocument = async ({ databaseId, collectionId, documentId, data, read, write, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} documentId */
    /* @param {object} data */
    /* @param {string[]} read */
    /* @param {string[]} write */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/documents'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesGetDocument = async ({ databaseId, collectionId, documentId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} documentId */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
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

const databasesUpdateDocument = async ({ databaseId, collectionId, documentId, data, read, write, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} documentId */
    /* @param {object} data */
    /* @param {string[]} read */
    /* @param {string[]} write */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
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

const databasesDeleteDocument = async ({ databaseId, collectionId, documentId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} documentId */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
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

const databasesListDocumentLogs = async ({ databaseId, collectionId, documentId, limit, offset, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} documentId */
    /* @param {number} limit */
    /* @param {number} offset */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}/logs'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
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

const databasesListIndexes = async ({ databaseId, collectionId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/indexes'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesCreateIndex = async ({ databaseId, collectionId, key, type, attributes, orders, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {string} type */
    /* @param {string[]} attributes */
    /* @param {string[]} orders */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/indexes'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesGetIndex = async ({ databaseId, collectionId, key, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} key */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/indexes/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
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

const databasesDeleteIndex = async ({ databaseId, collectionId, key, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} key */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/indexes/{key}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{key}', key);
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

const databasesListCollectionLogs = async ({ databaseId, collectionId, limit, offset, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {number} limit */
    /* @param {number} offset */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/logs'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesGetCollectionUsage = async ({ databaseId, collectionId, range, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} range */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/usage'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesListLogs = async ({ databaseId, limit, offset, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {number} limit */
    /* @param {number} offset */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/logs'.replace('{databaseId}', databaseId);
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

const databasesGetDatabaseUsage = async ({ databaseId, range, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} range */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/usage'.replace('{databaseId}', databaseId);
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


databases
    .command(`list`)
    .description(``)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--limit <limit>`, `Maximum number of collection to return in response. By default will return maximum 25 results. Maximum of 100 results allowed per request.`, parseInteger)
    .option(`--offset <offset>`, `Offset value. The default value is 0. Use this param to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)`, parseInteger)
    .option(`--cursor <cursor>`, `ID of the collection used as the starting point for the query, excluding the collection itself. Should be used for efficient pagination when working with large sets of data.`)
    .option(`--cursorDirection <cursorDirection>`, `Direction of the cursor, can be either 'before' or 'after'.`)
    .option(`--orderType <orderType>`, `Order result by ASC or DESC order.`)
    .action(actionRunner(databasesList))

databases
    .command(`create`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Unique Id. Choose your own unique ID or pass the string "unique()" to auto generate it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
    .action(actionRunner(databasesCreate))

databases
    .command(`getUsage`)
    .description(``)
    .option(`--range <range>`, `'Date range.`)
    .action(actionRunner(databasesGetUsage))

databases
    .command(`get`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .action(actionRunner(databasesGet))

databases
    .command(`update`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
    .action(actionRunner(databasesUpdate))

databases
    .command(`delete`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .action(actionRunner(databasesDelete))

databases
    .command(`listCollections`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--limit <limit>`, `Maximum number of collection to return in response. By default will return maximum 25 results. Maximum of 100 results allowed per request.`, parseInteger)
    .option(`--offset <offset>`, `Offset value. The default value is 0. Use this param to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)`, parseInteger)
    .option(`--cursor <cursor>`, `ID of the collection used as the starting point for the query, excluding the collection itself. Should be used for efficient pagination when working with large sets of data.`)
    .option(`--cursorDirection <cursorDirection>`, `Direction of the cursor, can be either 'before' or 'after'.`)
    .option(`--orderType <orderType>`, `Order result by ASC or DESC order.`)
    .action(actionRunner(databasesListCollections))

databases
    .command(`createCollection`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Unique Id. Choose your own unique ID or pass the string "unique()" to auto generate it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
    .requiredOption(`--permission <permission>`, `Specifies the permissions model used in this collection, which accepts either 'collection' or 'document'. For 'collection' level permission, the permissions specified in read and write params are applied to all documents in the collection. For 'document' level permissions, read and write permissions are specified in each document. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .requiredOption(`--read <read...>`, `An array of strings with read permissions. By default no user is granted with any read permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .requiredOption(`--write <write...>`, `An array of strings with write permissions. By default no user is granted with any write permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .action(actionRunner(databasesCreateCollection))

databases
    .command(`getCollection`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .action(actionRunner(databasesGetCollection))

databases
    .command(`updateCollection`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
    .requiredOption(`--permission <permission>`, `Permissions type model to use for reading documents in this collection. You can use collection-level permission set once on the collection using the 'read' and 'write' params, or you can set document-level permission where each document read and write params will decide who has access to read and write to each document individually. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .option(`--read <read...>`, `An array of strings with read permissions. By default inherits the existing read permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .option(`--write <write...>`, `An array of strings with write permissions. By default inherits the existing write permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .option(`--enabled <enabled>`, `Is collection enabled?`, parseBool)
    .action(actionRunner(databasesUpdateCollection))

databases
    .command(`deleteCollection`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .action(actionRunner(databasesDeleteCollection))

databases
    .command(`listAttributes`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .action(actionRunner(databasesListAttributes))

databases
    .command(`createBooleanAttribute`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, parseBool)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateBooleanAttribute))

databases
    .command(`createEmailAttribute`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateEmailAttribute))

databases
    .command(`createEnumAttribute`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--elements <elements...>`, `Array of elements in enumerated type. Uses length of longest element to determine size. Maximum of 100 elements are allowed, each 4096 characters long.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateEnumAttribute))

databases
    .command(`createFloatAttribute`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--min <min>`, `Minimum value to enforce on new documents`, parseInteger)
    .option(`--max <max>`, `Maximum value to enforce on new documents`, parseInteger)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, parseInteger)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateFloatAttribute))

databases
    .command(`createIntegerAttribute`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--min <min>`, `Minimum value to enforce on new documents`, parseInteger)
    .option(`--max <max>`, `Maximum value to enforce on new documents`, parseInteger)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, parseInteger)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateIntegerAttribute))

databases
    .command(`createIpAttribute`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateIpAttribute))

databases
    .command(`createStringAttribute`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--size <size>`, `Attribute size for text attributes, in number of characters.`, parseInteger)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateStringAttribute))

databases
    .command(`createUrlAttribute`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateUrlAttribute))

databases
    .command(`getAttribute`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .action(actionRunner(databasesGetAttribute))

databases
    .command(`deleteAttribute`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .action(actionRunner(databasesDeleteAttribute))

databases
    .command(`listDocuments`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .option(`--queries <queries...>`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/database#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .option(`--limit <limit>`, `Maximum number of documents to return in response. By default will return maximum 25 results. Maximum of 100 results allowed per request.`, parseInteger)
    .option(`--offset <offset>`, `Offset value. The default value is 0. Use this value to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)`, parseInteger)
    .option(`--cursor <cursor>`, `ID of the document used as the starting point for the query, excluding the document itself. Should be used for efficient pagination when working with large sets of data. [learn more about pagination](https://appwrite.io/docs/pagination)`)
    .option(`--cursorDirection <cursorDirection>`, `Direction of the cursor, can be either 'before' or 'after'.`)
    .option(`--orderAttributes <orderAttributes...>`, `Array of attributes used to sort results. Maximum of 100 order attributes are allowed, each 4096 characters long.`)
    .option(`--orderTypes <orderTypes...>`, `Array of order directions for sorting attribtues. Possible values are DESC for descending order, or ASC for ascending order. Maximum of 100 order types are allowed.`)
    .action(actionRunner(databasesListDocuments))

databases
    .command(`createDocument`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection). Make sure to define attributes before creating documents.`)
    .requiredOption(`--documentId <documentId>`, `Document ID. Choose your own unique ID or pass the string "unique()" to auto generate it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--data <data>`, `Document data as JSON object.`)
    .option(`--read <read...>`, `An array of strings with read permissions. By default only the current user is granted with read permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .option(`--write <write...>`, `An array of strings with write permissions. By default only the current user is granted with write permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .action(actionRunner(databasesCreateDocument))

databases
    .command(`getDocument`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--documentId <documentId>`, `Document ID.`)
    .action(actionRunner(databasesGetDocument))

databases
    .command(`updateDocument`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .requiredOption(`--documentId <documentId>`, `Document ID.`)
    .option(`--data <data>`, `Document data as JSON object. Include only attribute and value pairs to be updated.`)
    .option(`--read <read...>`, `An array of strings with read permissions. By default inherits the existing read permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .option(`--write <write...>`, `An array of strings with write permissions. By default inherits the existing write permissions. [learn more about permissions](https://appwrite.io/docs/permissions) and get a full list of available permissions.`)
    .action(actionRunner(databasesUpdateDocument))

databases
    .command(`deleteDocument`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--documentId <documentId>`, `Document ID.`)
    .action(actionRunner(databasesDeleteDocument))

databases
    .command(`listDocumentLogs`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .requiredOption(`--documentId <documentId>`, `Document ID.`)
    .option(`--limit <limit>`, `Maximum number of logs to return in response. By default will return maximum 25 results. Maximum of 100 results allowed per request.`, parseInteger)
    .option(`--offset <offset>`, `Offset value. The default value is 0. Use this value to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)`, parseInteger)
    .action(actionRunner(databasesListDocumentLogs))

databases
    .command(`listIndexes`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .action(actionRunner(databasesListIndexes))

databases
    .command(`createIndex`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .requiredOption(`--type <type>`, `Index type.`)
    .requiredOption(`--attributes <attributes...>`, `Array of attributes to index. Maximum of 100 attributes are allowed, each 32 characters long.`)
    .option(`--orders <orders...>`, `Array of index orders. Maximum of 100 orders are allowed.`)
    .action(actionRunner(databasesCreateIndex))

databases
    .command(`getIndex`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .action(actionRunner(databasesGetIndex))

databases
    .command(`deleteIndex`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/database#createCollection).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .action(actionRunner(databasesDeleteIndex))

databases
    .command(`listCollectionLogs`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .option(`--limit <limit>`, `Maximum number of logs to return in response. By default will return maximum 25 results. Maximum of 100 results allowed per request.`, parseInteger)
    .option(`--offset <offset>`, `Offset value. The default value is 0. Use this value to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)`, parseInteger)
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
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .option(`--limit <limit>`, `Maximum number of logs to return in response. By default will return maximum 25 results. Maximum of 100 results allowed per request.`, parseInteger)
    .option(`--offset <offset>`, `Offset value. The default value is 0. Use this value to manage pagination. [learn more about pagination](https://appwrite.io/docs/pagination)`, parseInteger)
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
    databasesCreateEmailAttribute,
    databasesCreateEnumAttribute,
    databasesCreateFloatAttribute,
    databasesCreateIntegerAttribute,
    databasesCreateIpAttribute,
    databasesCreateStringAttribute,
    databasesCreateUrlAttribute,
    databasesGetAttribute,
    databasesDeleteAttribute,
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
