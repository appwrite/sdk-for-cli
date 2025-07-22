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

const tables = new Command("tables").description(commandDescriptions['tables'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} TablesListRequestParams
 * @property {string} databaseId Database ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, rowSecurity
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesListRequestParams} params
 */
const tablesList = async ({databaseId,queries,search,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables'.replace('{databaseId}', databaseId);
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
            showConsoleLink('tables', 'list', databaseId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} TablesCreateRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Unique Id. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Table name. Max length: 128 chars.
 * @property {string[]} permissions An array of permissions strings. By default, no user is granted with any permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} rowSecurity Enables configuring permissions for individual rows. A user needs one of row or table level permissions to access a row. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} enabled Is table enabled? When set to &#039;disabled&#039;, users cannot access the table but Server SDKs with and API key can still read and write to the table. No data is lost when this is toggled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesCreateRequestParams} params
 */
const tablesCreate = async ({databaseId,tableId,name,permissions,rowSecurity,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables'.replace('{databaseId}', databaseId);
    let payload = {};
    if (typeof tableId !== 'undefined') {
        payload['tableId'] = tableId;
    }
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    permissions = permissions === true ? [] : permissions;
    if (typeof permissions !== 'undefined') {
        payload['permissions'] = permissions;
    }
    if (typeof rowSecurity !== 'undefined') {
        payload['rowSecurity'] = rowSecurity;
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
 * @typedef {Object} TablesGetRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesGetRequestParams} params
 */
const tablesGet = async ({databaseId,tableId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tables', 'get', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} TablesUpdateRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} name Table name. Max length: 128 chars.
 * @property {string[]} permissions An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} rowSecurity Enables configuring permissions for individual rows. A user needs one of row or table level permissions to access a document. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} enabled Is table enabled? When set to &#039;disabled&#039;, users cannot access the table but Server SDKs with and API key can still read and write to the table. No data is lost when this is toggled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesUpdateRequestParams} params
 */
const tablesUpdate = async ({databaseId,tableId,name,permissions,rowSecurity,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    permissions = permissions === true ? [] : permissions;
    if (typeof permissions !== 'undefined') {
        payload['permissions'] = permissions;
    }
    if (typeof rowSecurity !== 'undefined') {
        payload['rowSecurity'] = rowSecurity;
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
 * @typedef {Object} TablesDeleteRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDeleteRequestParams} params
 */
const tablesDelete = async ({databaseId,tableId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesListColumnsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, size, required, array, status, error
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesListColumnsRequestParams} params
 */
const tablesListColumns = async ({databaseId,tableId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tables', 'listColumns', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} TablesCreateBooleanColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {boolean} xdefault Default value for column when not provided. Cannot be set when column is required.
 * @property {boolean} array Is column an array?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesCreateBooleanColumnRequestParams} params
 */
const tablesCreateBooleanColumn = async ({databaseId,tableId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/boolean'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesUpdateBooleanColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {boolean} xdefault Default value for column when not provided. Cannot be set when column is required.
 * @property {string} newKey New Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesUpdateBooleanColumnRequestParams} params
 */
const tablesUpdateBooleanColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/boolean/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesCreateDatetimeColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {string} xdefault Default value for the column in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Cannot be set when column is required.
 * @property {boolean} array Is column an array?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesCreateDatetimeColumnRequestParams} params
 */
const tablesCreateDatetimeColumn = async ({databaseId,tableId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/datetime'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesUpdateDatetimeColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {string} xdefault Default value for column when not provided. Cannot be set when column is required.
 * @property {string} newKey New Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesUpdateDatetimeColumnRequestParams} params
 */
const tablesUpdateDatetimeColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/datetime/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesCreateEmailColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {string} xdefault Default value for column when not provided. Cannot be set when column is required.
 * @property {boolean} array Is column an array?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesCreateEmailColumnRequestParams} params
 */
const tablesCreateEmailColumn = async ({databaseId,tableId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/email'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesUpdateEmailColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {string} xdefault Default value for column when not provided. Cannot be set when column is required.
 * @property {string} newKey New Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesUpdateEmailColumnRequestParams} params
 */
const tablesUpdateEmailColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/email/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesCreateEnumColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {string[]} elements Array of enum values.
 * @property {boolean} required Is column required?
 * @property {string} xdefault Default value for column when not provided. Cannot be set when column is required.
 * @property {boolean} array Is column an array?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesCreateEnumColumnRequestParams} params
 */
const tablesCreateEnumColumn = async ({databaseId,tableId,key,elements,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/enum'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesUpdateEnumColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {string[]} elements Updated list of enum values.
 * @property {boolean} required Is column required?
 * @property {string} xdefault Default value for column when not provided. Cannot be set when column is required.
 * @property {string} newKey New Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesUpdateEnumColumnRequestParams} params
 */
const tablesUpdateEnumColumn = async ({databaseId,tableId,key,elements,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/enum/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesCreateFloatColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {number} min Minimum value
 * @property {number} max Maximum value
 * @property {number} xdefault Default value. Cannot be set when required.
 * @property {boolean} array Is column an array?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesCreateFloatColumnRequestParams} params
 */
const tablesCreateFloatColumn = async ({databaseId,tableId,key,required,min,max,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/float'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesUpdateFloatColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {number} xdefault Default value. Cannot be set when required.
 * @property {number} min Minimum value
 * @property {number} max Maximum value
 * @property {string} newKey New Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesUpdateFloatColumnRequestParams} params
 */
const tablesUpdateFloatColumn = async ({databaseId,tableId,key,required,xdefault,min,max,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/float/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesCreateIntegerColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {number} min Minimum value
 * @property {number} max Maximum value
 * @property {number} xdefault Default value. Cannot be set when column is required.
 * @property {boolean} array Is column an array?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesCreateIntegerColumnRequestParams} params
 */
const tablesCreateIntegerColumn = async ({databaseId,tableId,key,required,min,max,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/integer'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesUpdateIntegerColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {number} xdefault Default value. Cannot be set when column is required.
 * @property {number} min Minimum value
 * @property {number} max Maximum value
 * @property {string} newKey New Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesUpdateIntegerColumnRequestParams} params
 */
const tablesUpdateIntegerColumn = async ({databaseId,tableId,key,required,xdefault,min,max,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/integer/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesCreateIpColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {string} xdefault Default value. Cannot be set when column is required.
 * @property {boolean} array Is column an array?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesCreateIpColumnRequestParams} params
 */
const tablesCreateIpColumn = async ({databaseId,tableId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/ip'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesUpdateIpColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {string} xdefault Default value. Cannot be set when column is required.
 * @property {string} newKey New Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesUpdateIpColumnRequestParams} params
 */
const tablesUpdateIpColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/ip/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesCreateRelationshipColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} relatedTableId Related Table ID.
 * @property {RelationshipType} type Relation type
 * @property {boolean} twoWay Is Two Way?
 * @property {string} key Column Key.
 * @property {string} twoWayKey Two Way Column Key.
 * @property {RelationMutate} onDelete Constraints option
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesCreateRelationshipColumnRequestParams} params
 */
const tablesCreateRelationshipColumn = async ({databaseId,tableId,relatedTableId,type,twoWay,key,twoWayKey,onDelete,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/relationship'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof relatedTableId !== 'undefined') {
        payload['relatedTableId'] = relatedTableId;
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
 * @typedef {Object} TablesCreateStringColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).
 * @property {string} key Column Key.
 * @property {number} size Attribute size for text attributes, in number of characters.
 * @property {boolean} required Is column required?
 * @property {string} xdefault Default value for column when not provided. Cannot be set when column is required.
 * @property {boolean} array Is column an array?
 * @property {boolean} encrypt Toggle encryption for the column. Encryption enhances security by not storing any plain text values in the database. However, encrypted columns cannot be queried.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesCreateStringColumnRequestParams} params
 */
const tablesCreateStringColumn = async ({databaseId,tableId,key,size,required,xdefault,array,encrypt,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/string'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesUpdateStringColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {string} xdefault Default value for column when not provided. Cannot be set when column is required.
 * @property {number} size Maximum size of the string column.
 * @property {string} newKey New Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesUpdateStringColumnRequestParams} params
 */
const tablesUpdateStringColumn = async ({databaseId,tableId,key,required,xdefault,size,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/string/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesCreateUrlColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {string} xdefault Default value for column when not provided. Cannot be set when column is required.
 * @property {boolean} array Is column an array?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesCreateUrlColumnRequestParams} params
 */
const tablesCreateUrlColumn = async ({databaseId,tableId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/url'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesUpdateUrlColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {string} xdefault Default value for column when not provided. Cannot be set when column is required.
 * @property {string} newKey New Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesUpdateUrlColumnRequestParams} params
 */
const tablesUpdateUrlColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/url/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesGetColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesGetColumnRequestParams} params
 */
const tablesGetColumn = async ({databaseId,tableId,key,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tables', 'getColumn', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} TablesDeleteColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDeleteColumnRequestParams} params
 */
const tablesDeleteColumn = async ({databaseId,tableId,key,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesUpdateRelationshipColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {RelationMutate} onDelete Constraints option
 * @property {string} newKey New Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesUpdateRelationshipColumnRequestParams} params
 */
const tablesUpdateRelationshipColumn = async ({databaseId,tableId,key,onDelete,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/columns/{key}/relationship'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesListIndexesRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, status, attributes, error
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesListIndexesRequestParams} params
 */
const tablesListIndexes = async ({databaseId,tableId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/indexes'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tables', 'listIndexes', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} TablesCreateIndexRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).
 * @property {string} key Index Key.
 * @property {IndexType} type Index type.
 * @property {string[]} columns Array of columns to index. Maximum of 100 columns are allowed, each 32 characters long.
 * @property {string[]} orders Array of index orders. Maximum of 100 orders are allowed.
 * @property {number[]} lengths Length of index. Maximum of 100
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesCreateIndexRequestParams} params
 */
const tablesCreateIndex = async ({databaseId,tableId,key,type,columns,orders,lengths,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/indexes'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof type !== 'undefined') {
        payload['type'] = type;
    }
    columns = columns === true ? [] : columns;
    if (typeof columns !== 'undefined') {
        payload['columns'] = columns;
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
 * @typedef {Object} TablesGetIndexRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).
 * @property {string} key Index Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesGetIndexRequestParams} params
 */
const tablesGetIndex = async ({databaseId,tableId,key,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/indexes/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesDeleteIndexRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).
 * @property {string} key Index Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDeleteIndexRequestParams} params
 */
const tablesDeleteIndex = async ({databaseId,tableId,key,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/indexes/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesListLogsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesListLogsRequestParams} params
 */
const tablesListLogs = async ({databaseId,tableId,queries,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/logs'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesListRowsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesListRowsRequestParams} params
 */
const tablesListRows = async ({databaseId,tableId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tables', 'listRows', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} TablesCreateRowRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate). Make sure to define columns before creating rows.
 * @property {string} rowId Row ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {object} data Row data as JSON object.
 * @property {string[]} permissions An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesCreateRowRequestParams} params
 */
const tablesCreateRow = async ({databaseId,tableId,rowId,data,permissions,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof rowId !== 'undefined') {
        payload['rowId'] = rowId;
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
 * @typedef {Object} TablesCreateRowsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate). Make sure to define columns before creating rows.
 * @property {object[]} rows Array of documents data as JSON objects.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesCreateRowsRequestParams} params
 */
const tablesCreateRows = async ({databaseId,tableId,rows,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    rows = rows === true ? [] : rows;
    if (typeof rows !== 'undefined') {
        payload['rows'] = rows;
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
 * @typedef {Object} TablesUpsertRowsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesUpsertRowsRequestParams} params
 */
const tablesUpsertRows = async ({databaseId,tableId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};

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
 * @typedef {Object} TablesUpdateRowsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {object} data Row data as JSON object. Include only column and value pairs to be updated.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesUpdateRowsRequestParams} params
 */
const tablesUpdateRows = async ({databaseId,tableId,data,queries,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDeleteRowsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDeleteRowsRequestParams} params
 */
const tablesDeleteRows = async ({databaseId,tableId,queries,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesGetRowRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).
 * @property {string} rowId Row ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesGetRowRequestParams} params
 */
const tablesGetRow = async ({databaseId,tableId,rowId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tables', 'getRow', databaseId, tableId, rowId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} TablesUpsertRowRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} rowId Row ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesUpsertRowRequestParams} params
 */
const tablesUpsertRow = async ({databaseId,tableId,rowId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
    let payload = {};

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
 * @typedef {Object} TablesUpdateRowRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} rowId Row ID.
 * @property {object} data Row data as JSON object. Include only columns and value pairs to be updated.
 * @property {string[]} permissions An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesUpdateRowRequestParams} params
 */
const tablesUpdateRow = async ({databaseId,tableId,rowId,data,permissions,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
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
 * @typedef {Object} TablesDeleteRowRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).
 * @property {string} rowId Row ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDeleteRowRequestParams} params
 */
const tablesDeleteRow = async ({databaseId,tableId,rowId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
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
 * @typedef {Object} TablesListRowLogsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} rowId Row ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesListRowLogsRequestParams} params
 */
const tablesListRowLogs = async ({databaseId,tableId,rowId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/rows/{rowId}/logs'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tables', 'listRowLogs', databaseId, tableId, rowId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} TablesDecrementRowColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} rowId Row ID.
 * @property {string} column Column key.
 * @property {number} value Value to increment the column by. The value must be a number.
 * @property {number} min Minimum value for the column. If the current value is lesser than this value, an exception will be thrown.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDecrementRowColumnRequestParams} params
 */
const tablesDecrementRowColumn = async ({databaseId,tableId,rowId,column,value,min,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/rows/{rowId}/{column}/decrement'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId).replace('{column}', column);
    let payload = {};
    if (typeof value !== 'undefined') {
        payload['value'] = value;
    }
    if (typeof min !== 'undefined') {
        payload['min'] = min;
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
 * @typedef {Object} TablesIncrementRowColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} rowId Row ID.
 * @property {string} column Column key.
 * @property {number} value Value to increment the column by. The value must be a number.
 * @property {number} max Maximum value for the column. If the current value is greater than this value, an error will be thrown.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesIncrementRowColumnRequestParams} params
 */
const tablesIncrementRowColumn = async ({databaseId,tableId,rowId,column,value,max,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/rows/{rowId}/{column}/increment'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId).replace('{column}', column);
    let payload = {};
    if (typeof value !== 'undefined') {
        payload['value'] = value;
    }
    if (typeof max !== 'undefined') {
        payload['max'] = max;
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
 * @typedef {Object} TablesGetUsageRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {DatabaseUsageRange} range Date range.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesGetUsageRequestParams} params
 */
const tablesGetUsage = async ({databaseId,tableId,range,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/databases/{databaseId}/tables/{tableId}/usage'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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

tables
    .command(`list`)
    .description(`Get a list of all tables that belong to the provided databaseId. You can use the search parameter to filter your results.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, rowSecurity`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesList))

tables
    .command(`create`)
    .description(`Create a new Table. Before using this route, you should create a new database resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateTable) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Table name. Max length: 128 chars.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, no user is granted with any permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--row-security [value]`, `Enables configuring permissions for individual rows. A user needs one of row or table level permissions to access a row. [Learn more about permissions](https://appwrite.io/docs/permissions).`, (value) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Is table enabled? When set to 'disabled', users cannot access the table but Server SDKs with and API key can still read and write to the table. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesCreate))

tables
    .command(`get`)
    .description(`Get a table by its unique ID. This endpoint response returns a JSON object with the table metadata.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesGet))

tables
    .command(`update`)
    .description(`Update a table by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--name <name>`, `Table name. Max length: 128 chars.`)
    .option(`--permissions [permissions...]`, `An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--row-security [value]`, `Enables configuring permissions for individual rows. A user needs one of row or table level permissions to access a document. [Learn more about permissions](https://appwrite.io/docs/permissions).`, (value) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Is table enabled? When set to 'disabled', users cannot access the table but Server SDKs with and API key can still read and write to the table. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesUpdate))

tables
    .command(`delete`)
    .description(`Delete a table by its unique ID. Only users with write permissions have access to delete this resource.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .action(actionRunner(tablesDelete))

tables
    .command(`list-columns`)
    .description(`List attributes in the collection.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, size, required, array, status, error`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesListColumns))

tables
    .command(`create-boolean-column`)
    .description(`Create a boolean column. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault [value]`, `Default value for column when not provided. Cannot be set when column is required.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--array [value]`, `Is column an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesCreateBooleanColumn))

tables
    .command(`update-boolean-column`)
    .description(`Update a boolean column. Changing the 'default' value will not update already existing rows.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault [value]`, `Default value for column when not provided. Cannot be set when column is required.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesUpdateBooleanColumn))

tables
    .command(`create-datetime-column`)
    .description(`Create a date time column according to the ISO 8601 standard.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for the column in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesCreateDatetimeColumn))

tables
    .command(`update-datetime-column`)
    .description(`Update a date time column. Changing the 'default' value will not update already existing rows.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesUpdateDatetimeColumn))

tables
    .command(`create-email-column`)
    .description(`Create an email column. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesCreateEmailColumn))

tables
    .command(`update-email-column`)
    .description(`Update an email column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesUpdateEmailColumn))

tables
    .command(`create-enum-column`)
    .description(`Create an enumeration column. The 'elements' param acts as a white-list of accepted values for this column.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--elements [elements...]`, `Array of enum values.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesCreateEnumColumn))

tables
    .command(`update-enum-column`)
    .description(`Update an enum column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--elements [elements...]`, `Updated list of enum values.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesUpdateEnumColumn))

tables
    .command(`create-float-column`)
    .description(`Create a float column. Optionally, minimum and maximum values can be provided. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--min <min>`, `Minimum value`, parseInteger)
    .option(`--max <max>`, `Maximum value`, parseInteger)
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when required.`, parseInteger)
    .option(`--array [value]`, `Is column an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesCreateFloatColumn))

tables
    .command(`update-float-column`)
    .description(`Update a float column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when required.`, parseInteger)
    .option(`--min <min>`, `Minimum value`, parseInteger)
    .option(`--max <max>`, `Maximum value`, parseInteger)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesUpdateFloatColumn))

tables
    .command(`create-integer-column`)
    .description(`Create an integer column. Optionally, minimum and maximum values can be provided. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--min <min>`, `Minimum value`, parseInteger)
    .option(`--max <max>`, `Maximum value`, parseInteger)
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when column is required.`, parseInteger)
    .option(`--array [value]`, `Is column an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesCreateIntegerColumn))

tables
    .command(`update-integer-column`)
    .description(`Update an integer column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when column is required.`, parseInteger)
    .option(`--min <min>`, `Minimum value`, parseInteger)
    .option(`--max <max>`, `Maximum value`, parseInteger)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesUpdateIntegerColumn))

tables
    .command(`create-ip-column`)
    .description(`Create IP address column. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesCreateIpColumn))

tables
    .command(`update-ip-column`)
    .description(`Update an ip column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesUpdateIpColumn))

tables
    .command(`create-relationship-column`)
    .description(`Create relationship column. [Learn more about relationship columns](https://appwrite.io/docs/databases-relationships#relationship-columns). `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--related-table-id <related-table-id>`, `Related Table ID.`)
    .requiredOption(`--type <type>`, `Relation type`)
    .option(`--two-way [value]`, `Is Two Way?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--key <key>`, `Column Key.`)
    .option(`--two-way-key <two-way-key>`, `Two Way Column Key.`)
    .option(`--on-delete <on-delete>`, `Constraints option`)
    .action(actionRunner(tablesCreateRelationshipColumn))

tables
    .command(`create-string-column`)
    .description(`Create a string column. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--size <size>`, `Attribute size for text attributes, in number of characters.`, parseInteger)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--encrypt [value]`, `Toggle encryption for the column. Encryption enhances security by not storing any plain text values in the database. However, encrypted columns cannot be queried.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesCreateStringColumn))

tables
    .command(`update-string-column`)
    .description(`Update a string column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--size <size>`, `Maximum size of the string column.`, parseInteger)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesUpdateStringColumn))

tables
    .command(`create-url-column`)
    .description(`Create a URL column. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesCreateUrlColumn))

tables
    .command(`update-url-column`)
    .description(`Update an url column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesUpdateUrlColumn))

tables
    .command(`get-column`)
    .description(`Get column by ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesGetColumn))

tables
    .command(`delete-column`)
    .description(`Deletes a column.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .action(actionRunner(tablesDeleteColumn))

tables
    .command(`update-relationship-column`)
    .description(`Update relationship column. [Learn more about relationship columns](https://appwrite.io/docs/databases-relationships#relationship-columns). `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .option(`--on-delete <on-delete>`, `Constraints option`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesUpdateRelationshipColumn))

tables
    .command(`list-indexes`)
    .description(`List indexes in the collection.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, status, attributes, error`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesListIndexes))

tables
    .command(`create-index`)
    .description(`Creates an index on the attributes listed. Your index should include all the attributes you will query in a single request. Attributes can be 'key', 'fulltext', and 'unique'.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .requiredOption(`--type <type>`, `Index type.`)
    .requiredOption(`--columns [columns...]`, `Array of columns to index. Maximum of 100 columns are allowed, each 32 characters long.`)
    .option(`--orders [orders...]`, `Array of index orders. Maximum of 100 orders are allowed.`)
    .option(`--lengths [lengths...]`, `Length of index. Maximum of 100`)
    .action(actionRunner(tablesCreateIndex))

tables
    .command(`get-index`)
    .description(`Get index by ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .action(actionRunner(tablesGetIndex))

tables
    .command(`delete-index`)
    .description(`Delete an index.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .action(actionRunner(tablesDeleteIndex))

tables
    .command(`list-logs`)
    .description(`Get the table activity logs list by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(tablesListLogs))

tables
    .command(`list-rows`)
    .description(`Get a list of all the user's rows in a given table. You can use the query params to filter your results.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesListRows))

tables
    .command(`create-row`)
    .description(`Create a new Row. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateTable) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate). Make sure to define columns before creating rows.`)
    .requiredOption(`--row-id <row-id>`, `Row ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--data <data>`, `Row data as JSON object.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .action(actionRunner(tablesCreateRow))

tables
    .command(`create-rows`)
    .description(`Create new Rows. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateTable) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate). Make sure to define columns before creating rows.`)
    .requiredOption(`--rows [rows...]`, `Array of documents data as JSON objects.`)
    .action(actionRunner(tablesCreateRows))

tables
    .command(`upsert-rows`)
    .description(`Create or update Rows. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateTable) API or directly from your database console. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .action(actionRunner(tablesUpsertRows))

tables
    .command(`update-rows`)
    .description(`Update all rows that match your queries, if no queries are submitted then all rows are updated. You can pass only specific fields to be updated.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .option(`--data <data>`, `Row data as JSON object. Include only column and value pairs to be updated.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .action(actionRunner(tablesUpdateRows))

tables
    .command(`delete-rows`)
    .description(`Bulk delete rows using queries, if no queries are passed then all rows are deleted.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .action(actionRunner(tablesDeleteRows))

tables
    .command(`get-row`)
    .description(`Get a row by its unique ID. This endpoint response returns a JSON object with the row data.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesGetRow))

tables
    .command(`upsert-row`)
    .description(`Create or update a Row. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateTable) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .action(actionRunner(tablesUpsertRow))

tables
    .command(`update-row`)
    .description(`Update a row by its unique ID. Using the patch method you can pass only specific fields that will get updated.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .option(`--data <data>`, `Row data as JSON object. Include only columns and value pairs to be updated.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .action(actionRunner(tablesUpdateRow))

tables
    .command(`delete-row`)
    .description(`Delete a row by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tables#tablesCreate).`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .action(actionRunner(tablesDeleteRow))

tables
    .command(`list-row-logs`)
    .description(`Get the row activity logs list by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesListRowLogs))

tables
    .command(`decrement-row-column`)
    .description(`Decrement a specific column of a row by a given value.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .requiredOption(`--column <column>`, `Column key.`)
    .option(`--value <value>`, `Value to increment the column by. The value must be a number.`, parseInteger)
    .option(`--min <min>`, `Minimum value for the column. If the current value is lesser than this value, an exception will be thrown.`, parseInteger)
    .action(actionRunner(tablesDecrementRowColumn))

tables
    .command(`increment-row-column`)
    .description(`Increment a specific column of a row by a given value.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .requiredOption(`--column <column>`, `Column key.`)
    .option(`--value <value>`, `Value to increment the column by. The value must be a number.`, parseInteger)
    .option(`--max <max>`, `Maximum value for the column. If the current value is greater than this value, an error will be thrown.`, parseInteger)
    .action(actionRunner(tablesIncrementRowColumn))

tables
    .command(`get-usage`)
    .description(`Get usage metrics and statistics for a table. Returning the total number of rows. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .option(`--range <range>`, `Date range.`)
    .action(actionRunner(tablesGetUsage))

module.exports = {
    tables,
    tablesList,
    tablesCreate,
    tablesGet,
    tablesUpdate,
    tablesDelete,
    tablesListColumns,
    tablesCreateBooleanColumn,
    tablesUpdateBooleanColumn,
    tablesCreateDatetimeColumn,
    tablesUpdateDatetimeColumn,
    tablesCreateEmailColumn,
    tablesUpdateEmailColumn,
    tablesCreateEnumColumn,
    tablesUpdateEnumColumn,
    tablesCreateFloatColumn,
    tablesUpdateFloatColumn,
    tablesCreateIntegerColumn,
    tablesUpdateIntegerColumn,
    tablesCreateIpColumn,
    tablesUpdateIpColumn,
    tablesCreateRelationshipColumn,
    tablesCreateStringColumn,
    tablesUpdateStringColumn,
    tablesCreateUrlColumn,
    tablesUpdateUrlColumn,
    tablesGetColumn,
    tablesDeleteColumn,
    tablesUpdateRelationshipColumn,
    tablesListIndexes,
    tablesCreateIndex,
    tablesGetIndex,
    tablesDeleteIndex,
    tablesListLogs,
    tablesListRows,
    tablesCreateRow,
    tablesCreateRows,
    tablesUpsertRows,
    tablesUpdateRows,
    tablesDeleteRows,
    tablesGetRow,
    tablesUpsertRow,
    tablesUpdateRow,
    tablesDeleteRow,
    tablesListRowLogs,
    tablesDecrementRowColumn,
    tablesIncrementRowColumn,
    tablesGetUsage
};
