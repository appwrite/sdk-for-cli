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

const tablesDB = new Command("tables-db").description(commandDescriptions['tables-db'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} TablesDBListRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: name
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBListRequestParams} params
 */
const tablesDBList = async ({queries,search,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb';
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
            showConsoleLink('tablesDB', 'list');
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} TablesDBCreateRequestParams
 * @property {string} databaseId Unique Id. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Database name. Max length: 128 chars.
 * @property {boolean} enabled Is the database enabled? When set to &#039;disabled&#039;, users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBCreateRequestParams} params
 */
const tablesDBCreate = async ({databaseId,name,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb';
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
 * @typedef {Object} TablesDBListUsageRequestParams
 * @property {UsageRange} range Date range.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBListUsageRequestParams} params
 */
const tablesDBListUsage = async ({range,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/usage';
    let payload = {};
    if (typeof range !== 'undefined') {
        payload['range'] = range;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tablesDB', 'listUsage');
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} TablesDBGetRequestParams
 * @property {string} databaseId Database ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBGetRequestParams} params
 */
const tablesDBGet = async ({databaseId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}'.replace('{databaseId}', databaseId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tablesDB', 'get', databaseId);
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} TablesDBUpdateRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} name Database name. Max length: 128 chars.
 * @property {boolean} enabled Is database enabled? When set to &#039;disabled&#039;, users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBUpdateRequestParams} params
 */
const tablesDBUpdate = async ({databaseId,name,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}'.replace('{databaseId}', databaseId);
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
 * @typedef {Object} TablesDBDeleteRequestParams
 * @property {string} databaseId Database ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBDeleteRequestParams} params
 */
const tablesDBDelete = async ({databaseId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}'.replace('{databaseId}', databaseId);
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
 * @typedef {Object} TablesDBListTablesRequestParams
 * @property {string} databaseId Database ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: name, enabled, rowSecurity
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBListTablesRequestParams} params
 */
const tablesDBListTables = async ({databaseId,queries,search,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables'.replace('{databaseId}', databaseId);
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
            showConsoleLink('tablesDB', 'listTables', databaseId);
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} TablesDBCreateTableRequestParams
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
 * @param {TablesDBCreateTableRequestParams} params
 */
const tablesDBCreateTable = async ({databaseId,tableId,name,permissions,rowSecurity,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables'.replace('{databaseId}', databaseId);
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
 * @typedef {Object} TablesDBGetTableRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBGetTableRequestParams} params
 */
const tablesDBGetTable = async ({databaseId,tableId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tablesDB', 'getTable', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} TablesDBUpdateTableRequestParams
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
 * @param {TablesDBUpdateTableRequestParams} params
 */
const tablesDBUpdateTable = async ({databaseId,tableId,name,permissions,rowSecurity,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDBDeleteTableRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBDeleteTableRequestParams} params
 */
const tablesDBDeleteTable = async ({databaseId,tableId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDBListColumnsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: key, type, size, required, array, status, error
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBListColumnsRequestParams} params
 */
const tablesDBListColumns = async ({databaseId,tableId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tablesDB', 'listColumns', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} TablesDBCreateBooleanColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {boolean} xdefault Default value for column when not provided. Cannot be set when column is required.
 * @property {boolean} array Is column an array?
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBCreateBooleanColumnRequestParams} params
 */
const tablesDBCreateBooleanColumn = async ({databaseId,tableId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/boolean'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDBUpdateBooleanColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {boolean} xdefault Default value for column when not provided. Cannot be set when column is required.
 * @property {string} newKey New Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBUpdateBooleanColumnRequestParams} params
 */
const tablesDBUpdateBooleanColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/boolean/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesDBCreateDatetimeColumnRequestParams
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
 * @param {TablesDBCreateDatetimeColumnRequestParams} params
 */
const tablesDBCreateDatetimeColumn = async ({databaseId,tableId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/datetime'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDBUpdateDatetimeColumnRequestParams
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
 * @param {TablesDBUpdateDatetimeColumnRequestParams} params
 */
const tablesDBUpdateDatetimeColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/datetime/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesDBCreateEmailColumnRequestParams
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
 * @param {TablesDBCreateEmailColumnRequestParams} params
 */
const tablesDBCreateEmailColumn = async ({databaseId,tableId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/email'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDBUpdateEmailColumnRequestParams
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
 * @param {TablesDBUpdateEmailColumnRequestParams} params
 */
const tablesDBUpdateEmailColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/email/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesDBCreateEnumColumnRequestParams
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
 * @param {TablesDBCreateEnumColumnRequestParams} params
 */
const tablesDBCreateEnumColumn = async ({databaseId,tableId,key,elements,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/enum'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDBUpdateEnumColumnRequestParams
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
 * @param {TablesDBUpdateEnumColumnRequestParams} params
 */
const tablesDBUpdateEnumColumn = async ({databaseId,tableId,key,elements,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/enum/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesDBCreateFloatColumnRequestParams
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
 * @param {TablesDBCreateFloatColumnRequestParams} params
 */
const tablesDBCreateFloatColumn = async ({databaseId,tableId,key,required,min,max,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/float'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDBUpdateFloatColumnRequestParams
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
 * @param {TablesDBUpdateFloatColumnRequestParams} params
 */
const tablesDBUpdateFloatColumn = async ({databaseId,tableId,key,required,xdefault,min,max,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/float/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesDBCreateIntegerColumnRequestParams
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
 * @param {TablesDBCreateIntegerColumnRequestParams} params
 */
const tablesDBCreateIntegerColumn = async ({databaseId,tableId,key,required,min,max,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/integer'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDBUpdateIntegerColumnRequestParams
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
 * @param {TablesDBUpdateIntegerColumnRequestParams} params
 */
const tablesDBUpdateIntegerColumn = async ({databaseId,tableId,key,required,xdefault,min,max,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/integer/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesDBCreateIpColumnRequestParams
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
 * @param {TablesDBCreateIpColumnRequestParams} params
 */
const tablesDBCreateIpColumn = async ({databaseId,tableId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/ip'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDBUpdateIpColumnRequestParams
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
 * @param {TablesDBUpdateIpColumnRequestParams} params
 */
const tablesDBUpdateIpColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/ip/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesDBCreateLineColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {any[]} xdefault Default value for column when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when column is required.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBCreateLineColumnRequestParams} params
 */
const tablesDBCreateLineColumn = async ({databaseId,tableId,key,required,xdefault,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/line'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    xdefault = xdefault === true ? [] : xdefault;
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
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
 * @typedef {Object} TablesDBUpdateLineColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {any[]} xdefault Default value for column when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when column is required.
 * @property {string} newKey New Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBUpdateLineColumnRequestParams} params
 */
const tablesDBUpdateLineColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/line/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
    let payload = {};
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    xdefault = xdefault === true ? [] : xdefault;
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
 * @typedef {Object} TablesDBCreatePointColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {any[]} xdefault Default value for column when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when column is required.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBCreatePointColumnRequestParams} params
 */
const tablesDBCreatePointColumn = async ({databaseId,tableId,key,required,xdefault,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/point'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    xdefault = xdefault === true ? [] : xdefault;
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
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
 * @typedef {Object} TablesDBUpdatePointColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {any[]} xdefault Default value for column when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when column is required.
 * @property {string} newKey New Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBUpdatePointColumnRequestParams} params
 */
const tablesDBUpdatePointColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/point/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
    let payload = {};
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    xdefault = xdefault === true ? [] : xdefault;
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
 * @typedef {Object} TablesDBCreatePolygonColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {any[]} xdefault Default value for column when not provided, three-dimensional array where the outer array holds one or more linear rings, [[[longitude, latitude], …], …], the first ring is the exterior boundary, any additional rings are interior holes, and each ring must start and end with the same coordinate pair. Cannot be set when column is required.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBCreatePolygonColumnRequestParams} params
 */
const tablesDBCreatePolygonColumn = async ({databaseId,tableId,key,required,xdefault,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/polygon'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    xdefault = xdefault === true ? [] : xdefault;
    if (typeof xdefault !== 'undefined') {
        payload['default'] = xdefault;
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
 * @typedef {Object} TablesDBUpdatePolygonColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
 * @property {string} key Column Key.
 * @property {boolean} required Is column required?
 * @property {any[]} xdefault Default value for column when not provided, three-dimensional array where the outer array holds one or more linear rings, [[[longitude, latitude], …], …], the first ring is the exterior boundary, any additional rings are interior holes, and each ring must start and end with the same coordinate pair. Cannot be set when column is required.
 * @property {string} newKey New Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBUpdatePolygonColumnRequestParams} params
 */
const tablesDBUpdatePolygonColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/polygon/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
    let payload = {};
    if (typeof required !== 'undefined') {
        payload['required'] = required;
    }
    xdefault = xdefault === true ? [] : xdefault;
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
 * @typedef {Object} TablesDBCreateRelationshipColumnRequestParams
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
 * @param {TablesDBCreateRelationshipColumnRequestParams} params
 */
const tablesDBCreateRelationshipColumn = async ({databaseId,tableId,relatedTableId,type,twoWay,key,twoWayKey,onDelete,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/relationship'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDBCreateStringColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
 * @property {string} key Column Key.
 * @property {number} size Column size for text columns, in number of characters.
 * @property {boolean} required Is column required?
 * @property {string} xdefault Default value for column when not provided. Cannot be set when column is required.
 * @property {boolean} array Is column an array?
 * @property {boolean} encrypt Toggle encryption for the column. Encryption enhances security by not storing any plain text values in the database. However, encrypted columns cannot be queried.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBCreateStringColumnRequestParams} params
 */
const tablesDBCreateStringColumn = async ({databaseId,tableId,key,size,required,xdefault,array,encrypt,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/string'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDBUpdateStringColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
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
 * @param {TablesDBUpdateStringColumnRequestParams} params
 */
const tablesDBUpdateStringColumn = async ({databaseId,tableId,key,required,xdefault,size,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/string/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesDBCreateUrlColumnRequestParams
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
 * @param {TablesDBCreateUrlColumnRequestParams} params
 */
const tablesDBCreateUrlColumn = async ({databaseId,tableId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/url'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDBUpdateUrlColumnRequestParams
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
 * @param {TablesDBUpdateUrlColumnRequestParams} params
 */
const tablesDBUpdateUrlColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/url/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesDBGetColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBGetColumnRequestParams} params
 */
const tablesDBGetColumn = async ({databaseId,tableId,key,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tablesDB', 'getColumn', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} TablesDBDeleteColumnRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} key Column Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBDeleteColumnRequestParams} params
 */
const tablesDBDeleteColumn = async ({databaseId,tableId,key,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesDBUpdateRelationshipColumnRequestParams
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
 * @param {TablesDBUpdateRelationshipColumnRequestParams} params
 */
const tablesDBUpdateRelationshipColumn = async ({databaseId,tableId,key,onDelete,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/{key}/relationship'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesDBListIndexesRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: key, type, status, attributes, error
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBListIndexesRequestParams} params
 */
const tablesDBListIndexes = async ({databaseId,tableId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/indexes'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tablesDB', 'listIndexes', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} TablesDBCreateIndexRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
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
 * @param {TablesDBCreateIndexRequestParams} params
 */
const tablesDBCreateIndex = async ({databaseId,tableId,key,type,columns,orders,lengths,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/indexes'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDBGetIndexRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
 * @property {string} key Index Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBGetIndexRequestParams} params
 */
const tablesDBGetIndex = async ({databaseId,tableId,key,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/indexes/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesDBDeleteIndexRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
 * @property {string} key Index Key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBDeleteIndexRequestParams} params
 */
const tablesDBDeleteIndex = async ({databaseId,tableId,key,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/indexes/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
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
 * @typedef {Object} TablesDBListTableLogsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBListTableLogsRequestParams} params
 */
const tablesDBListTableLogs = async ({databaseId,tableId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/logs'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tablesDB', 'listTableLogs', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} TablesDBListRowsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the TableDB service [server integration](https://appwrite.io/docs/server/tablesdbdb#tablesdbCreate).
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBListRowsRequestParams} params
 */
const tablesDBListRows = async ({databaseId,tableId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tablesDB', 'listRows', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} TablesDBCreateRowRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate). Make sure to define columns before creating rows.
 * @property {string} rowId Row ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {object} data Row data as JSON object.
 * @property {string[]} permissions An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBCreateRowRequestParams} params
 */
const tablesDBCreateRow = async ({databaseId,tableId,rowId,data,permissions,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDBCreateRowsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate). Make sure to define columns before creating rows.
 * @property {object[]} rows Array of documents data as JSON objects.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBCreateRowsRequestParams} params
 */
const tablesDBCreateRows = async ({databaseId,tableId,rows,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDBUpsertRowsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {object[]} rows Array of row data as JSON objects. May contain partial rows.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBUpsertRowsRequestParams} params
 */
const tablesDBUpsertRows = async ({databaseId,tableId,rows,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    rows = rows === true ? [] : rows;
    if (typeof rows !== 'undefined') {
        payload['rows'] = rows;
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
 * @typedef {Object} TablesDBUpdateRowsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {object} data Row data as JSON object. Include only column and value pairs to be updated.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBUpdateRowsRequestParams} params
 */
const tablesDBUpdateRows = async ({databaseId,tableId,data,queries,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDBDeleteRowsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBDeleteRowsRequestParams} params
 */
const tablesDBDeleteRows = async ({databaseId,tableId,queries,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
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
 * @typedef {Object} TablesDBGetRowRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
 * @property {string} rowId Row ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBGetRowRequestParams} params
 */
const tablesDBGetRow = async ({databaseId,tableId,rowId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tablesDB', 'getRow', databaseId, tableId, rowId);
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} TablesDBUpsertRowRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} rowId Row ID.
 * @property {object} data Row data as JSON object. Include all required columns of the row to be created or updated.
 * @property {string[]} permissions An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBUpsertRowRequestParams} params
 */
const tablesDBUpsertRow = async ({databaseId,tableId,rowId,data,permissions,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
    let payload = {};
    if (typeof data !== 'undefined') {
        payload['data'] = JSON.parse(data);
    }
    permissions = permissions === true ? [] : permissions;
    if (typeof permissions !== 'undefined') {
        payload['permissions'] = permissions;
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
 * @typedef {Object} TablesDBUpdateRowRequestParams
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
 * @param {TablesDBUpdateRowRequestParams} params
 */
const tablesDBUpdateRow = async ({databaseId,tableId,rowId,data,permissions,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
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
 * @typedef {Object} TablesDBDeleteRowRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
 * @property {string} rowId Row ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBDeleteRowRequestParams} params
 */
const tablesDBDeleteRow = async ({databaseId,tableId,rowId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
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
 * @typedef {Object} TablesDBListRowLogsRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {string} rowId Row ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBListRowLogsRequestParams} params
 */
const tablesDBListRowLogs = async ({databaseId,tableId,rowId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}/logs'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tablesDB', 'listRowLogs', databaseId, tableId, rowId);
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} TablesDBDecrementRowColumnRequestParams
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
 * @param {TablesDBDecrementRowColumnRequestParams} params
 */
const tablesDBDecrementRowColumn = async ({databaseId,tableId,rowId,column,value,min,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}/{column}/decrement'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId).replace('{column}', column);
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
 * @typedef {Object} TablesDBIncrementRowColumnRequestParams
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
 * @param {TablesDBIncrementRowColumnRequestParams} params
 */
const tablesDBIncrementRowColumn = async ({databaseId,tableId,rowId,column,value,max,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}/{column}/increment'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId).replace('{column}', column);
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
 * @typedef {Object} TablesDBGetTableUsageRequestParams
 * @property {string} databaseId Database ID.
 * @property {string} tableId Table ID.
 * @property {UsageRange} range Date range.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBGetTableUsageRequestParams} params
 */
const tablesDBGetTableUsage = async ({databaseId,tableId,range,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/usage'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof range !== 'undefined') {
        payload['range'] = range;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('tablesDB', 'getTableUsage', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} TablesDBGetUsageRequestParams
 * @property {string} databaseId Database ID.
 * @property {UsageRange} range Date range.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {TablesDBGetUsageRequestParams} params
 */
const tablesDBGetUsage = async ({databaseId,range,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/usage'.replace('{databaseId}', databaseId);
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
tablesDB
    .command(`list`)
    .description(`Get a list of all databases from the current Appwrite project. You can use the search parameter to filter your results.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: name`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBList))

tablesDB
    .command(`create`)
    .description(`Create a new Database. `)
    .requiredOption(`--database-id <database-id>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Database name. Max length: 128 chars.`)
    .option(`--enabled [value]`, `Is the database enabled? When set to 'disabled', users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreate))

tablesDB
    .command(`list-usage`)
    .description(`List usage metrics and statistics for all databases in the project. You can view the total number of databases, tables, rows, and storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
    .option(`--range <range>`, `Date range.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBListUsage))

tablesDB
    .command(`get`)
    .description(`Get a database by its unique ID. This endpoint response returns a JSON object with the database metadata.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBGet))

tablesDB
    .command(`update`)
    .description(`Update a database by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--name <name>`, `Database name. Max length: 128 chars.`)
    .option(`--enabled [value]`, `Is database enabled? When set to 'disabled', users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBUpdate))

tablesDB
    .command(`delete`)
    .description(`Delete a database by its unique ID. Only API keys with with databases.write scope can delete a database.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .action(actionRunner(tablesDBDelete))

tablesDB
    .command(`list-tables`)
    .description(`Get a list of all tables that belong to the provided databaseId. You can use the search parameter to filter your results.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: name, enabled, rowSecurity`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBListTables))

tablesDB
    .command(`create-table`)
    .description(`Create a new Table. Before using this route, you should create a new database resource using either a [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreateTable) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Table name. Max length: 128 chars.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, no user is granted with any permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--row-security [value]`, `Enables configuring permissions for individual rows. A user needs one of row or table level permissions to access a row. [Learn more about permissions](https://appwrite.io/docs/permissions).`, (value) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Is table enabled? When set to 'disabled', users cannot access the table but Server SDKs with and API key can still read and write to the table. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreateTable))

tablesDB
    .command(`get-table`)
    .description(`Get a table by its unique ID. This endpoint response returns a JSON object with the table metadata.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBGetTable))

tablesDB
    .command(`update-table`)
    .description(`Update a table by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--name <name>`, `Table name. Max length: 128 chars.`)
    .option(`--permissions [permissions...]`, `An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--row-security [value]`, `Enables configuring permissions for individual rows. A user needs one of row or table level permissions to access a document. [Learn more about permissions](https://appwrite.io/docs/permissions).`, (value) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Is table enabled? When set to 'disabled', users cannot access the table but Server SDKs with and API key can still read and write to the table. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBUpdateTable))

tablesDB
    .command(`delete-table`)
    .description(`Delete a table by its unique ID. Only users with write permissions have access to delete this resource.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .action(actionRunner(tablesDBDeleteTable))

tablesDB
    .command(`list-columns`)
    .description(`List columns in the table.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: key, type, size, required, array, status, error`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBListColumns))

tablesDB
    .command(`create-boolean-column`)
    .description(`Create a boolean column. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault [value]`, `Default value for column when not provided. Cannot be set when column is required.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--array [value]`, `Is column an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreateBooleanColumn))

tablesDB
    .command(`update-boolean-column`)
    .description(`Update a boolean column. Changing the 'default' value will not update already existing rows.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault [value]`, `Default value for column when not provided. Cannot be set when column is required.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesDBUpdateBooleanColumn))

tablesDB
    .command(`create-datetime-column`)
    .description(`Create a date time column according to the ISO 8601 standard.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for the column in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreateDatetimeColumn))

tablesDB
    .command(`update-datetime-column`)
    .description(`Update a date time column. Changing the 'default' value will not update already existing rows.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesDBUpdateDatetimeColumn))

tablesDB
    .command(`create-email-column`)
    .description(`Create an email column. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreateEmailColumn))

tablesDB
    .command(`update-email-column`)
    .description(`Update an email column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesDBUpdateEmailColumn))

tablesDB
    .command(`create-enum-column`)
    .description(`Create an enumeration column. The 'elements' param acts as a white-list of accepted values for this column.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--elements [elements...]`, `Array of enum values.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreateEnumColumn))

tablesDB
    .command(`update-enum-column`)
    .description(`Update an enum column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--elements [elements...]`, `Updated list of enum values.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesDBUpdateEnumColumn))

tablesDB
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
    .action(actionRunner(tablesDBCreateFloatColumn))

tablesDB
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
    .action(actionRunner(tablesDBUpdateFloatColumn))

tablesDB
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
    .action(actionRunner(tablesDBCreateIntegerColumn))

tablesDB
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
    .action(actionRunner(tablesDBUpdateIntegerColumn))

tablesDB
    .command(`create-ip-column`)
    .description(`Create IP address column. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreateIpColumn))

tablesDB
    .command(`update-ip-column`)
    .description(`Update an ip column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesDBUpdateIpColumn))

tablesDB
    .command(`create-line-column`)
    .description(`Create a geometric line attribute.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when column is required.`)
    .action(actionRunner(tablesDBCreateLineColumn))

tablesDB
    .command(`update-line-column`)
    .description(`Update a line column. Changing the 'default' value will not update already existing documents.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesDBUpdateLineColumn))

tablesDB
    .command(`create-point-column`)
    .description(`Create a geometric point attribute.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when column is required.`)
    .action(actionRunner(tablesDBCreatePointColumn))

tablesDB
    .command(`update-point-column`)
    .description(`Update a point column. Changing the 'default' value will not update already existing documents.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesDBUpdatePointColumn))

tablesDB
    .command(`create-polygon-column`)
    .description(`Create a geometric polygon attribute.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided, three-dimensional array where the outer array holds one or more linear rings, [[[longitude, latitude], …], …], the first ring is the exterior boundary, any additional rings are interior holes, and each ring must start and end with the same coordinate pair. Cannot be set when column is required.`)
    .action(actionRunner(tablesDBCreatePolygonColumn))

tablesDB
    .command(`update-polygon-column`)
    .description(`Update a polygon column. Changing the 'default' value will not update already existing documents.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided, three-dimensional array where the outer array holds one or more linear rings, [[[longitude, latitude], …], …], the first ring is the exterior boundary, any additional rings are interior holes, and each ring must start and end with the same coordinate pair. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesDBUpdatePolygonColumn))

tablesDB
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
    .action(actionRunner(tablesDBCreateRelationshipColumn))

tablesDB
    .command(`create-string-column`)
    .description(`Create a string column. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--size <size>`, `Column size for text columns, in number of characters.`, parseInteger)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--encrypt [value]`, `Toggle encryption for the column. Encryption enhances security by not storing any plain text values in the database. However, encrypted columns cannot be queried.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreateStringColumn))

tablesDB
    .command(`update-string-column`)
    .description(`Update a string column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--size <size>`, `Maximum size of the string column.`, parseInteger)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesDBUpdateStringColumn))

tablesDB
    .command(`create-url-column`)
    .description(`Create a URL column. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreateUrlColumn))

tablesDB
    .command(`update-url-column`)
    .description(`Update an url column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesDBUpdateUrlColumn))

tablesDB
    .command(`get-column`)
    .description(`Get column by ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBGetColumn))

tablesDB
    .command(`delete-column`)
    .description(`Deletes a column.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .action(actionRunner(tablesDBDeleteColumn))

tablesDB
    .command(`update-relationship-column`)
    .description(`Update relationship column. [Learn more about relationship columns](https://appwrite.io/docs/databases-relationships#relationship-columns). `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .option(`--on-delete <on-delete>`, `Constraints option`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesDBUpdateRelationshipColumn))

tablesDB
    .command(`list-indexes`)
    .description(`List indexes on the table.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: key, type, status, attributes, error`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBListIndexes))

tablesDB
    .command(`create-index`)
    .description(`Creates an index on the columns listed. Your index should include all the columns you will query in a single request. Type can be 'key', 'fulltext', or 'unique'.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .requiredOption(`--type <type>`, `Index type.`)
    .requiredOption(`--columns [columns...]`, `Array of columns to index. Maximum of 100 columns are allowed, each 32 characters long.`)
    .option(`--orders [orders...]`, `Array of index orders. Maximum of 100 orders are allowed.`)
    .option(`--lengths [lengths...]`, `Length of index. Maximum of 100`)
    .action(actionRunner(tablesDBCreateIndex))

tablesDB
    .command(`get-index`)
    .description(`Get index by ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .action(actionRunner(tablesDBGetIndex))

tablesDB
    .command(`delete-index`)
    .description(`Delete an index.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .action(actionRunner(tablesDBDeleteIndex))

tablesDB
    .command(`list-table-logs`)
    .description(`Get the table activity logs list by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBListTableLogs))

tablesDB
    .command(`list-rows`)
    .description(`Get a list of all the user's rows in a given table. You can use the query params to filter your results.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TableDB service [server integration](https://appwrite.io/docs/server/tablesdbdb#tablesdbCreate).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBListRows))

tablesDB
    .command(`create-row`)
    .description(`Create a new Row. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreateTable) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate). Make sure to define columns before creating rows.`)
    .requiredOption(`--row-id <row-id>`, `Row ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--data <data>`, `Row data as JSON object.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .action(actionRunner(tablesDBCreateRow))

tablesDB
    .command(`create-rows`)
    .description(`Create new Rows. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreateTable) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate). Make sure to define columns before creating rows.`)
    .requiredOption(`--rows [rows...]`, `Array of documents data as JSON objects.`)
    .action(actionRunner(tablesDBCreateRows))

tablesDB
    .command(`upsert-rows`)
    .description(`Create or update Rows. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreateTable) API or directly from your database console. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--rows [rows...]`, `Array of row data as JSON objects. May contain partial rows.`)
    .action(actionRunner(tablesDBUpsertRows))

tablesDB
    .command(`update-rows`)
    .description(`Update all rows that match your queries, if no queries are submitted then all rows are updated. You can pass only specific fields to be updated.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .option(`--data <data>`, `Row data as JSON object. Include only column and value pairs to be updated.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .action(actionRunner(tablesDBUpdateRows))

tablesDB
    .command(`delete-rows`)
    .description(`Bulk delete rows using queries, if no queries are passed then all rows are deleted.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .action(actionRunner(tablesDBDeleteRows))

tablesDB
    .command(`get-row`)
    .description(`Get a row by its unique ID. This endpoint response returns a JSON object with the row data.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBGetRow))

tablesDB
    .command(`upsert-row`)
    .description(`Create or update a Row. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreateTable) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .option(`--data <data>`, `Row data as JSON object. Include all required columns of the row to be created or updated.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .action(actionRunner(tablesDBUpsertRow))

tablesDB
    .command(`update-row`)
    .description(`Update a row by its unique ID. Using the patch method you can pass only specific fields that will get updated.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .option(`--data <data>`, `Row data as JSON object. Include only columns and value pairs to be updated.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .action(actionRunner(tablesDBUpdateRow))

tablesDB
    .command(`delete-row`)
    .description(`Delete a row by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .action(actionRunner(tablesDBDeleteRow))

tablesDB
    .command(`list-row-logs`)
    .description(`Get the row activity logs list by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBListRowLogs))

tablesDB
    .command(`decrement-row-column`)
    .description(`Decrement a specific column of a row by a given value.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .requiredOption(`--column <column>`, `Column key.`)
    .option(`--value <value>`, `Value to increment the column by. The value must be a number.`, parseInteger)
    .option(`--min <min>`, `Minimum value for the column. If the current value is lesser than this value, an exception will be thrown.`, parseInteger)
    .action(actionRunner(tablesDBDecrementRowColumn))

tablesDB
    .command(`increment-row-column`)
    .description(`Increment a specific column of a row by a given value.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .requiredOption(`--column <column>`, `Column key.`)
    .option(`--value <value>`, `Value to increment the column by. The value must be a number.`, parseInteger)
    .option(`--max <max>`, `Maximum value for the column. If the current value is greater than this value, an error will be thrown.`, parseInteger)
    .action(actionRunner(tablesDBIncrementRowColumn))

tablesDB
    .command(`get-table-usage`)
    .description(`Get usage metrics and statistics for a table. Returning the total number of rows. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .option(`--range <range>`, `Date range.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBGetTableUsage))

tablesDB
    .command(`get-usage`)
    .description(`Get usage metrics and statistics for a database. You can view the total number of tables, rows, and storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .option(`--range <range>`, `Date range.`)
    .action(actionRunner(tablesDBGetUsage))

module.exports = {
    tablesDB,
    tablesDBList,
    tablesDBCreate,
    tablesDBListUsage,
    tablesDBGet,
    tablesDBUpdate,
    tablesDBDelete,
    tablesDBListTables,
    tablesDBCreateTable,
    tablesDBGetTable,
    tablesDBUpdateTable,
    tablesDBDeleteTable,
    tablesDBListColumns,
    tablesDBCreateBooleanColumn,
    tablesDBUpdateBooleanColumn,
    tablesDBCreateDatetimeColumn,
    tablesDBUpdateDatetimeColumn,
    tablesDBCreateEmailColumn,
    tablesDBUpdateEmailColumn,
    tablesDBCreateEnumColumn,
    tablesDBUpdateEnumColumn,
    tablesDBCreateFloatColumn,
    tablesDBUpdateFloatColumn,
    tablesDBCreateIntegerColumn,
    tablesDBUpdateIntegerColumn,
    tablesDBCreateIpColumn,
    tablesDBUpdateIpColumn,
    tablesDBCreateLineColumn,
    tablesDBUpdateLineColumn,
    tablesDBCreatePointColumn,
    tablesDBUpdatePointColumn,
    tablesDBCreatePolygonColumn,
    tablesDBUpdatePolygonColumn,
    tablesDBCreateRelationshipColumn,
    tablesDBCreateStringColumn,
    tablesDBUpdateStringColumn,
    tablesDBCreateUrlColumn,
    tablesDBUpdateUrlColumn,
    tablesDBGetColumn,
    tablesDBDeleteColumn,
    tablesDBUpdateRelationshipColumn,
    tablesDBListIndexes,
    tablesDBCreateIndex,
    tablesDBGetIndex,
    tablesDBDeleteIndex,
    tablesDBListTableLogs,
    tablesDBListRows,
    tablesDBCreateRow,
    tablesDBCreateRows,
    tablesDBUpsertRows,
    tablesDBUpdateRows,
    tablesDBDeleteRows,
    tablesDBGetRow,
    tablesDBUpsertRow,
    tablesDBUpdateRow,
    tablesDBDeleteRow,
    tablesDBListRowLogs,
    tablesDBDecrementRowColumn,
    tablesDBIncrementRowColumn,
    tablesDBGetTableUsage,
    tablesDBGetUsage
};
