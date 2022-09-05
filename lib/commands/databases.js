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

const databasesList = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases';
    let payload = {};

    /** Query Params */
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof search !== 'undefined') {
        payload['search'] = search;
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

const databasesListCollections = async ({ databaseId, queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string[]} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections'.replace('{databaseId}', databaseId);
    let payload = {};

    /** Query Params */
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof search !== 'undefined') {
        payload['search'] = search;
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

const databasesCreateCollection = async ({ databaseId, collectionId, name, permissions, documentSecurity, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} name */
    /* @param {string[]} permissions */
    /* @param {boolean} documentSecurity */

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

    if (typeof permissions !== 'undefined') {
        payload['permissions'] = permissions;
    }

    if (typeof documentSecurity !== 'undefined') {
        payload['documentSecurity'] = documentSecurity;
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

const databasesUpdateCollection = async ({ databaseId, collectionId, name, permissions, documentSecurity, enabled, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} name */
    /* @param {string[]} permissions */
    /* @param {boolean} documentSecurity */
    /* @param {boolean} enabled */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};
    
    /** Body Params */
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

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

const databasesCreateDatetimeAttribute = async ({ databaseId, collectionId, key, required, xdefault, array, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} key */
    /* @param {boolean} required */
    /* @param {string} xdefault */
    /* @param {boolean} array */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/attributes/datetime'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
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

const databasesListDocuments = async ({ databaseId, collectionId, queries, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string[]} queries */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/documents'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};

    /** Query Params */
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
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

const databasesCreateDocument = async ({ databaseId, collectionId, documentId, data, permissions, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} documentId */
    /* @param {object} data */
    /* @param {string[]} permissions */

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

    if (typeof permissions !== 'undefined') {
        payload['permissions'] = permissions;
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

const databasesUpdateDocument = async ({ databaseId, collectionId, documentId, data, permissions, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} documentId */
    /* @param {object} data */
    /* @param {string[]} permissions */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
    let payload = {};
    
    /** Body Params */
    if (typeof data !== 'undefined') {
        payload['data'] = JSON.parse(data);
    }

    if (typeof permissions !== 'undefined') {
        payload['permissions'] = permissions;
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

const databasesListDocumentLogs = async ({ databaseId, collectionId, documentId, queries, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string} documentId */
    /* @param {string[]} queries */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/documents/{documentId}/logs'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId).replace('{documentId}', documentId);
    let payload = {};

    /** Query Params */
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
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

const databasesListCollectionLogs = async ({ databaseId, collectionId, queries, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string} collectionId */
    /* @param {string[]} queries */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/collections/{collectionId}/logs'.replace('{databaseId}', databaseId).replace('{collectionId}', collectionId);
    let payload = {};

    /** Query Params */
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
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

const databasesListLogs = async ({ databaseId, queries, parseOutput = true, sdk = undefined}) => {
    /* @param {string} databaseId */
    /* @param {string[]} queries */

    let client = !sdk ? await sdkForProject() : sdk;
    let path = '/databases/{databaseId}/logs'.replace('{databaseId}', databaseId);
    let payload = {};

    /** Query Params */
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
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
    .description(`Get a list of all databases from the current Appwrite project. You can use the search parameter to filter your results.`)
    .option(`--queries <queries...>`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(databasesList))

databases
    .command(`create`)
    .description(`Create a new Database. `)
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
    .description(`Get a database by its unique ID. This endpoint response returns a JSON object with the database metadata.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .action(actionRunner(databasesGet))

databases
    .command(`update`)
    .description(`Update a database by its unique ID.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
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
    .option(`--queries <queries...>`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, documentSecurity`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(databasesListCollections))

databases
    .command(`createCollection`)
    .description(`Create a new Collection. Before using this route, you should create a new database resource using either a [server integration](/docs/server/databases#databasesCreateCollection) API or directly from your database console.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Unique Id. Choose your own unique ID or pass the string "unique()" to auto generate it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
    .option(`--permissions <permissions...>`, `An array of permissions strings. By default no user is granted with any permissions. [Learn more about permissions](/docs/permissions).`)
    .option(`--documentSecurity <documentSecurity>`, `Enables configuring permissions for individual documents. A user needs one of document or collection level permissions to access a document. [Learn more about permissions](/docs/permissions).`, parseBool)
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
    .option(`--permissions <permissions...>`, `An array of permission strings. By default the current permission are inherited. [Learn more about permissions](/docs/permissions).`)
    .option(`--documentSecurity <documentSecurity>`, `Enables configuring permissions for individual documents. A user needs one of document or collection level permissions to access a document. [Learn more about permissions](/docs/permissions).`, parseBool)
    .option(`--enabled <enabled>`, `Is collection enabled?`, parseBool)
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
    .command(`createEnumAttribute`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--elements <elements...>`, `Array of elements in enumerated type. Uses length of longest element to determine size. Maximum of 100 elements are allowed, each 4096 characters long.`)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateEnumAttribute))

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
    .command(`createStringAttribute`)
    .description(`Create a string attribute. `)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--size <size>`, `Attribute size for text attributes, in number of characters.`, parseInteger)
    .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array <array>`, `Is attribute an array?`, parseBool)
    .action(actionRunner(databasesCreateStringAttribute))

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
    .command(`listDocuments`)
    .description(`Get a list of all the user's documents in a given collection. You can use the query params to filter your results. On admin mode, this endpoint will return a list of all of documents belonging to the provided collectionId. [Learn more about different API modes](/docs/admin).`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .option(`--queries <queries...>`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .action(actionRunner(databasesListDocuments))

databases
    .command(`createDocument`)
    .description(`Create a new Document. Before using this route, you should create a new collection resource using either a [server integration](/docs/server/databases#databasesCreateCollection) API or directly from your database console.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.`)
    .requiredOption(`--documentId <documentId>`, `Document ID. Choose your own unique ID or pass the string "unique()" to auto generate it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--data <data>`, `Document data as JSON object.`)
    .option(`--permissions <permissions...>`, `An array of permissions strings. By default the current user is granted with all permissions. [Learn more about permissions](/docs/permissions).`)
    .action(actionRunner(databasesCreateDocument))

databases
    .command(`getDocument`)
    .description(`Get a document by its unique ID. This endpoint response returns a JSON object with the document data.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--documentId <documentId>`, `Document ID.`)
    .action(actionRunner(databasesGetDocument))

databases
    .command(`updateDocument`)
    .description(`Update a document by its unique ID. Using the patch method you can pass only specific fields that will get updated.`)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID.`)
    .requiredOption(`--documentId <documentId>`, `Document ID.`)
    .option(`--data <data>`, `Document data as JSON object. Include only attribute and value pairs to be updated.`)
    .option(`--permissions <permissions...>`, `An array of permissions strings. By default the current permissions are inherited. [Learn more about permissions](/docs/permissions).`)
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
    .option(`--queries <queries...>`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Only supported methods are limit and offset`)
    .action(actionRunner(databasesListDocumentLogs))

databases
    .command(`listIndexes`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .action(actionRunner(databasesListIndexes))

databases
    .command(`createIndex`)
    .description(``)
    .requiredOption(`--databaseId <databaseId>`, `Database ID.`)
    .requiredOption(`--collectionId <collectionId>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .requiredOption(`--type <type>`, `Index type.`)
    .requiredOption(`--attributes <attributes...>`, `Array of attributes to index. Maximum of 100 attributes are allowed, each 32 characters long.`)
    .option(`--orders <orders...>`, `Array of index orders. Maximum of 100 orders are allowed.`)
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
    .option(`--queries <queries...>`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Only supported methods are limit and offset`)
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
    .option(`--queries <queries...>`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Only supported methods are limit and offset`)
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
    databasesCreateDatetimeAttribute,
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
