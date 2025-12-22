import fs = require('fs');
import pathLib = require('path');
import tar = require('tar');
import ignore = require('ignore');
import { promisify } from 'util';
import Client from '../client';
import { getAllFiles, showConsoleLink } from '../utils';
import { Command } from 'commander';
import { sdkForProject, sdkForConsole } from '../sdks';
import { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log, warn } from '../parser';
import { localConfig, globalConfig } from '../config';
import { File } from 'undici';
import { ReadableStream } from 'stream/web';

function convertReadStreamToReadableStream(readStream: fs.ReadStream): ReadableStream {
  return new ReadableStream({
    start(controller) {
      readStream.on("data", (chunk: Buffer) => {
        controller.enqueue(chunk);
      });
      readStream.on("end", () => {
        controller.close();
      });
      readStream.on("error", (err: Error) => {
        controller.error(err);
      });
    },
    cancel() {
      readStream.destroy();
    },
  });
}

export const tablesDB = new Command("tables-db").description(commandDescriptions['tables-db'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

interface TablesDBListRequestParams {
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const tablesDBList = async ({queries,search,total,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: TablesDBListRequestParams): Promise<any> => {
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
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('tablesDB', 'list');
         } else {
            parse(response)
        }
    }

    return response;

}
interface TablesDBCreateRequestParams {
    databaseId: string;
    name: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreate = async ({databaseId,name,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateRequestParams): Promise<any> => {
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
interface TablesDBListTransactionsRequestParams {
    queries?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const tablesDBListTransactions = async ({queries,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: TablesDBListTransactionsRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/transactions';
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('tablesDB', 'listTransactions');
         } else {
            parse(response)
        }
    }

    return response;

}
interface TablesDBCreateTransactionRequestParams {
    ttl?: number;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreateTransaction = async ({ttl,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateTransactionRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/transactions';
    let payload = {};
    if (typeof ttl !== 'undefined') {
        payload['ttl'] = ttl;
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
interface TablesDBGetTransactionRequestParams {
    transactionId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const tablesDBGetTransaction = async ({transactionId,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: TablesDBGetTransactionRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/transactions/{transactionId}'.replace('{transactionId}', transactionId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('tablesDB', 'getTransaction', transactionId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface TablesDBUpdateTransactionRequestParams {
    transactionId: string;
    commit?: boolean;
    rollback?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdateTransaction = async ({transactionId,commit,rollback,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdateTransactionRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/transactions/{transactionId}'.replace('{transactionId}', transactionId);
    let payload = {};
    if (typeof commit !== 'undefined') {
        payload['commit'] = commit;
    }
    if (typeof rollback !== 'undefined') {
        payload['rollback'] = rollback;
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
interface TablesDBDeleteTransactionRequestParams {
    transactionId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBDeleteTransaction = async ({transactionId,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBDeleteTransactionRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/transactions/{transactionId}'.replace('{transactionId}', transactionId);
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
interface TablesDBCreateOperationsRequestParams {
    transactionId: string;
    operations?: object[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreateOperations = async ({transactionId,operations,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateOperationsRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/transactions/{transactionId}/operations'.replace('{transactionId}', transactionId);
    let payload = {};
    operations = operations === true ? [] : operations;
    if (typeof operations !== 'undefined') {
        payload['operations'] = operations;
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
interface TablesDBListUsageRequestParams {
    range?: UsageRange;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const tablesDBListUsage = async ({range,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: TablesDBListUsageRequestParams): Promise<any> => {
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
        if(showConsole) {
            showConsoleLink('tablesDB', 'listUsage');
         } else {
            parse(response)
        }
    }

    return response;

}
interface TablesDBGetRequestParams {
    databaseId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const tablesDBGet = async ({databaseId,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: TablesDBGetRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}'.replace('{databaseId}', databaseId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('tablesDB', 'get', databaseId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface TablesDBUpdateRequestParams {
    databaseId: string;
    name: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdate = async ({databaseId,name,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdateRequestParams): Promise<any> => {
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
interface TablesDBDeleteRequestParams {
    databaseId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBDelete = async ({databaseId,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBDeleteRequestParams): Promise<any> => {
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
interface TablesDBListTablesRequestParams {
    databaseId: string;
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const tablesDBListTables = async ({databaseId,queries,search,total,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: TablesDBListTablesRequestParams): Promise<any> => {
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
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('tablesDB', 'listTables', databaseId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface TablesDBCreateTableRequestParams {
    databaseId: string;
    tableId: string;
    name: string;
    permissions?: string[];
    rowSecurity?: boolean;
    enabled?: boolean;
    columns?: object[];
    indexes?: object[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreateTable = async ({databaseId,tableId,name,permissions,rowSecurity,enabled,columns,indexes,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateTableRequestParams): Promise<any> => {
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
    columns = columns === true ? [] : columns;
    if (typeof columns !== 'undefined') {
        payload['columns'] = columns;
    }
    indexes = indexes === true ? [] : indexes;
    if (typeof indexes !== 'undefined') {
        payload['indexes'] = indexes;
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
interface TablesDBGetTableRequestParams {
    databaseId: string;
    tableId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const tablesDBGetTable = async ({databaseId,tableId,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: TablesDBGetTableRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('tablesDB', 'getTable', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface TablesDBUpdateTableRequestParams {
    databaseId: string;
    tableId: string;
    name: string;
    permissions?: string[];
    rowSecurity?: boolean;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdateTable = async ({databaseId,tableId,name,permissions,rowSecurity,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdateTableRequestParams): Promise<any> => {
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
interface TablesDBDeleteTableRequestParams {
    databaseId: string;
    tableId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBDeleteTable = async ({databaseId,tableId,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBDeleteTableRequestParams): Promise<any> => {
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
interface TablesDBListColumnsRequestParams {
    databaseId: string;
    tableId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const tablesDBListColumns = async ({databaseId,tableId,queries,total,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: TablesDBListColumnsRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('tablesDB', 'listColumns', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface TablesDBCreateBooleanColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault?: boolean;
    array?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreateBooleanColumn = async ({databaseId,tableId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateBooleanColumnRequestParams): Promise<any> => {
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
interface TablesDBUpdateBooleanColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault: boolean;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdateBooleanColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdateBooleanColumnRequestParams): Promise<any> => {
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
interface TablesDBCreateDatetimeColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault?: string;
    array?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreateDatetimeColumn = async ({databaseId,tableId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateDatetimeColumnRequestParams): Promise<any> => {
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
interface TablesDBUpdateDatetimeColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault: string;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdateDatetimeColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdateDatetimeColumnRequestParams): Promise<any> => {
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
interface TablesDBCreateEmailColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault?: string;
    array?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreateEmailColumn = async ({databaseId,tableId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateEmailColumnRequestParams): Promise<any> => {
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
interface TablesDBUpdateEmailColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault: string;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdateEmailColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdateEmailColumnRequestParams): Promise<any> => {
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
interface TablesDBCreateEnumColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    elements: string[];
    required: boolean;
    xdefault?: string;
    array?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreateEnumColumn = async ({databaseId,tableId,key,elements,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateEnumColumnRequestParams): Promise<any> => {
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
interface TablesDBUpdateEnumColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    elements: string[];
    required: boolean;
    xdefault: string;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdateEnumColumn = async ({databaseId,tableId,key,elements,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdateEnumColumnRequestParams): Promise<any> => {
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
interface TablesDBCreateFloatColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    min?: number;
    max?: number;
    xdefault?: number;
    array?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreateFloatColumn = async ({databaseId,tableId,key,required,min,max,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateFloatColumnRequestParams): Promise<any> => {
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
interface TablesDBUpdateFloatColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault: number;
    min?: number;
    max?: number;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdateFloatColumn = async ({databaseId,tableId,key,required,xdefault,min,max,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdateFloatColumnRequestParams): Promise<any> => {
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
interface TablesDBCreateIntegerColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    min?: number;
    max?: number;
    xdefault?: number;
    array?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreateIntegerColumn = async ({databaseId,tableId,key,required,min,max,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateIntegerColumnRequestParams): Promise<any> => {
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
interface TablesDBUpdateIntegerColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault: number;
    min?: number;
    max?: number;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdateIntegerColumn = async ({databaseId,tableId,key,required,xdefault,min,max,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdateIntegerColumnRequestParams): Promise<any> => {
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
interface TablesDBCreateIpColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault?: string;
    array?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreateIpColumn = async ({databaseId,tableId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateIpColumnRequestParams): Promise<any> => {
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
interface TablesDBUpdateIpColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault: string;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdateIpColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdateIpColumnRequestParams): Promise<any> => {
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
interface TablesDBCreateLineColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault?: any[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreateLineColumn = async ({databaseId,tableId,key,required,xdefault,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateLineColumnRequestParams): Promise<any> => {
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
interface TablesDBUpdateLineColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault?: any[];
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdateLineColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdateLineColumnRequestParams): Promise<any> => {
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
interface TablesDBCreatePointColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault?: any[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreatePointColumn = async ({databaseId,tableId,key,required,xdefault,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreatePointColumnRequestParams): Promise<any> => {
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
interface TablesDBUpdatePointColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault?: any[];
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdatePointColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdatePointColumnRequestParams): Promise<any> => {
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
interface TablesDBCreatePolygonColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault?: any[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreatePolygonColumn = async ({databaseId,tableId,key,required,xdefault,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreatePolygonColumnRequestParams): Promise<any> => {
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
interface TablesDBUpdatePolygonColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault?: any[];
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdatePolygonColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdatePolygonColumnRequestParams): Promise<any> => {
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
interface TablesDBCreateRelationshipColumnRequestParams {
    databaseId: string;
    tableId: string;
    relatedTableId: string;
    type: RelationshipType;
    twoWay?: boolean;
    key?: string;
    twoWayKey?: string;
    onDelete?: RelationMutate;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreateRelationshipColumn = async ({databaseId,tableId,relatedTableId,type,twoWay,key,twoWayKey,onDelete,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateRelationshipColumnRequestParams): Promise<any> => {
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
interface TablesDBCreateStringColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    size: number;
    required: boolean;
    xdefault?: string;
    array?: boolean;
    encrypt?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreateStringColumn = async ({databaseId,tableId,key,size,required,xdefault,array,encrypt,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateStringColumnRequestParams): Promise<any> => {
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
interface TablesDBUpdateStringColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault: string;
    size?: number;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdateStringColumn = async ({databaseId,tableId,key,required,xdefault,size,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdateStringColumnRequestParams): Promise<any> => {
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
interface TablesDBCreateUrlColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault?: string;
    array?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreateUrlColumn = async ({databaseId,tableId,key,required,xdefault,array,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateUrlColumnRequestParams): Promise<any> => {
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
interface TablesDBUpdateUrlColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    required: boolean;
    xdefault: string;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdateUrlColumn = async ({databaseId,tableId,key,required,xdefault,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdateUrlColumnRequestParams): Promise<any> => {
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
interface TablesDBGetColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const tablesDBGetColumn = async ({databaseId,tableId,key,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: TablesDBGetColumnRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/columns/{key}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{key}', key);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('tablesDB', 'getColumn', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface TablesDBDeleteColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBDeleteColumn = async ({databaseId,tableId,key,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBDeleteColumnRequestParams): Promise<any> => {
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
interface TablesDBUpdateRelationshipColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    onDelete?: RelationMutate;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdateRelationshipColumn = async ({databaseId,tableId,key,onDelete,newKey,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdateRelationshipColumnRequestParams): Promise<any> => {
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
interface TablesDBListIndexesRequestParams {
    databaseId: string;
    tableId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const tablesDBListIndexes = async ({databaseId,tableId,queries,total,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: TablesDBListIndexesRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/indexes'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('tablesDB', 'listIndexes', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface TablesDBCreateIndexRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    type: IndexType;
    columns: string[];
    orders?: string[];
    lengths?: number[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreateIndex = async ({databaseId,tableId,key,type,columns,orders,lengths,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateIndexRequestParams): Promise<any> => {
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
interface TablesDBGetIndexRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBGetIndex = async ({databaseId,tableId,key,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBGetIndexRequestParams): Promise<any> => {
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
interface TablesDBDeleteIndexRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBDeleteIndex = async ({databaseId,tableId,key,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBDeleteIndexRequestParams): Promise<any> => {
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
interface TablesDBListTableLogsRequestParams {
    databaseId: string;
    tableId: string;
    queries?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const tablesDBListTableLogs = async ({databaseId,tableId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: TablesDBListTableLogsRequestParams): Promise<any> => {
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
        if(showConsole) {
            showConsoleLink('tablesDB', 'listTableLogs', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface TablesDBListRowsRequestParams {
    databaseId: string;
    tableId: string;
    queries?: string[];
    transactionId?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const tablesDBListRows = async ({databaseId,tableId,queries,transactionId,total,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: TablesDBListRowsRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof transactionId !== 'undefined') {
        payload['transactionId'] = transactionId;
    }
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('tablesDB', 'listRows', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface TablesDBCreateRowRequestParams {
    databaseId: string;
    tableId: string;
    rowId: string;
    data: object;
    permissions?: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreateRow = async ({databaseId,tableId,rowId,data,permissions,transactionId,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateRowRequestParams): Promise<any> => {
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
    if (typeof transactionId !== 'undefined') {
        payload['transactionId'] = transactionId;
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
interface TablesDBCreateRowsRequestParams {
    databaseId: string;
    tableId: string;
    rows: object[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBCreateRows = async ({databaseId,tableId,rows,transactionId,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBCreateRowsRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    rows = rows === true ? [] : rows;
    if (typeof rows !== 'undefined') {
        payload['rows'] = rows;
    }
    if (typeof transactionId !== 'undefined') {
        payload['transactionId'] = transactionId;
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
interface TablesDBUpsertRowsRequestParams {
    databaseId: string;
    tableId: string;
    rows: object[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpsertRows = async ({databaseId,tableId,rows,transactionId,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpsertRowsRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    rows = rows === true ? [] : rows;
    if (typeof rows !== 'undefined') {
        payload['rows'] = rows;
    }
    if (typeof transactionId !== 'undefined') {
        payload['transactionId'] = transactionId;
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
interface TablesDBUpdateRowsRequestParams {
    databaseId: string;
    tableId: string;
    data?: object;
    queries?: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdateRows = async ({databaseId,tableId,data,queries,transactionId,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdateRowsRequestParams): Promise<any> => {
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
    if (typeof transactionId !== 'undefined') {
        payload['transactionId'] = transactionId;
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
interface TablesDBDeleteRowsRequestParams {
    databaseId: string;
    tableId: string;
    queries?: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBDeleteRows = async ({databaseId,tableId,queries,transactionId,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBDeleteRowsRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows'.replace('{databaseId}', databaseId).replace('{tableId}', tableId);
    let payload = {};
    queries = queries === true ? [] : queries;
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof transactionId !== 'undefined') {
        payload['transactionId'] = transactionId;
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
interface TablesDBGetRowRequestParams {
    databaseId: string;
    tableId: string;
    rowId: string;
    queries?: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const tablesDBGetRow = async ({databaseId,tableId,rowId,queries,transactionId,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: TablesDBGetRowRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof transactionId !== 'undefined') {
        payload['transactionId'] = transactionId;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('tablesDB', 'getRow', databaseId, tableId, rowId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface TablesDBUpsertRowRequestParams {
    databaseId: string;
    tableId: string;
    rowId: string;
    data?: object;
    permissions?: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpsertRow = async ({databaseId,tableId,rowId,data,permissions,transactionId,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpsertRowRequestParams): Promise<any> => {
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
    if (typeof transactionId !== 'undefined') {
        payload['transactionId'] = transactionId;
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
interface TablesDBUpdateRowRequestParams {
    databaseId: string;
    tableId: string;
    rowId: string;
    data?: object;
    permissions?: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBUpdateRow = async ({databaseId,tableId,rowId,data,permissions,transactionId,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBUpdateRowRequestParams): Promise<any> => {
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
    if (typeof transactionId !== 'undefined') {
        payload['transactionId'] = transactionId;
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
interface TablesDBDeleteRowRequestParams {
    databaseId: string;
    tableId: string;
    rowId: string;
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBDeleteRow = async ({databaseId,tableId,rowId,transactionId,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBDeleteRowRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/tablesdb/{databaseId}/tables/{tableId}/rows/{rowId}'.replace('{databaseId}', databaseId).replace('{tableId}', tableId).replace('{rowId}', rowId);
    let payload = {};
    if (typeof transactionId !== 'undefined') {
        payload['transactionId'] = transactionId;
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
interface TablesDBListRowLogsRequestParams {
    databaseId: string;
    tableId: string;
    rowId: string;
    queries?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const tablesDBListRowLogs = async ({databaseId,tableId,rowId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: TablesDBListRowLogsRequestParams): Promise<any> => {
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
        if(showConsole) {
            showConsoleLink('tablesDB', 'listRowLogs', databaseId, tableId, rowId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface TablesDBDecrementRowColumnRequestParams {
    databaseId: string;
    tableId: string;
    rowId: string;
    column: string;
    value?: number;
    min?: number;
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBDecrementRowColumn = async ({databaseId,tableId,rowId,column,value,min,transactionId,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBDecrementRowColumnRequestParams): Promise<any> => {
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
    if (typeof transactionId !== 'undefined') {
        payload['transactionId'] = transactionId;
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
interface TablesDBIncrementRowColumnRequestParams {
    databaseId: string;
    tableId: string;
    rowId: string;
    column: string;
    value?: number;
    max?: number;
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBIncrementRowColumn = async ({databaseId,tableId,rowId,column,value,max,transactionId,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBIncrementRowColumnRequestParams): Promise<any> => {
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
    if (typeof transactionId !== 'undefined') {
        payload['transactionId'] = transactionId;
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
interface TablesDBGetTableUsageRequestParams {
    databaseId: string;
    tableId: string;
    range?: UsageRange;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const tablesDBGetTableUsage = async ({databaseId,tableId,range,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: TablesDBGetTableUsageRequestParams): Promise<any> => {
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
        if(showConsole) {
            showConsoleLink('tablesDB', 'getTableUsage', databaseId, tableId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface TablesDBGetUsageRequestParams {
    databaseId: string;
    range?: UsageRange;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const tablesDBGetUsage = async ({databaseId,range,parseOutput = true, overrideForCli = false, sdk = undefined}: TablesDBGetUsageRequestParams): Promise<any> => {
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
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBList))

tablesDB
    .command(`create`)
    .description(`Create a new Database. `)
    .requiredOption(`--database-id <database-id>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Database name. Max length: 128 chars.`)
    .option(`--enabled [value]`, `Is the database enabled? When set to 'disabled', users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreate))

tablesDB
    .command(`list-transactions`)
    .description(`List transactions across all databases.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries).`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBListTransactions))

tablesDB
    .command(`create-transaction`)
    .description(`Create a new transaction.`)
    .option(`--ttl <ttl>`, `Seconds before the transaction expires.`, parseInteger)
    .action(actionRunner(tablesDBCreateTransaction))

tablesDB
    .command(`get-transaction`)
    .description(`Get a transaction by its unique ID.`)
    .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBGetTransaction))

tablesDB
    .command(`update-transaction`)
    .description(`Update a transaction, to either commit or roll back its operations.`)
    .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
    .option(`--commit [value]`, `Commit transaction?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--rollback [value]`, `Rollback transaction?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBUpdateTransaction))

tablesDB
    .command(`delete-transaction`)
    .description(`Delete a transaction by its unique ID.`)
    .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
    .action(actionRunner(tablesDBDeleteTransaction))

tablesDB
    .command(`create-operations`)
    .description(`Create multiple operations in a single transaction.`)
    .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
    .option(`--operations [operations...]`, `Array of staged operations.`)
    .action(actionRunner(tablesDBCreateOperations))

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
    .option(`--enabled [value]`, `Is database enabled? When set to 'disabled', users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBListTables))

tablesDB
    .command(`create-table`)
    .description(`Create a new Table. Before using this route, you should create a new database resource using either a [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Table name. Max length: 128 chars.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, no user is granted with any permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--row-security [value]`, `Enables configuring permissions for individual rows. A user needs one of row or table level permissions to access a row. [Learn more about permissions](https://appwrite.io/docs/permissions).`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Is table enabled? When set to 'disabled', users cannot access the table but Server SDKs with and API key can still read and write to the table. No data is lost when this is toggled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--columns [columns...]`, `Array of column definitions to create. Each column should contain: key (string), type (string: string, integer, float, boolean, datetime, relationship), size (integer, required for string type), required (boolean, optional), default (mixed, optional), array (boolean, optional), and type-specific options.`)
    .option(`--indexes [indexes...]`, `Array of index definitions to create. Each index should contain: key (string), type (string: key, fulltext, unique, spatial), attributes (array of column keys), orders (array of ASC/DESC, optional), and lengths (array of integers, optional).`)
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
    .option(`--row-security [value]`, `Enables configuring permissions for individual rows. A user needs one of row or table-level permissions to access a row. [Learn more about permissions](https://appwrite.io/docs/permissions).`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Is table enabled? When set to 'disabled', users cannot access the table but Server SDKs with and API key can still read and write to the table. No data is lost when this is toggled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBListColumns))

tablesDB
    .command(`create-boolean-column`)
    .description(`Create a boolean column. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--xdefault [value]`, `Default value for column when not provided. Cannot be set when column is required.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--array [value]`, `Is column an array?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreateBooleanColumn))

tablesDB
    .command(`update-boolean-column`)
    .description(`Update a boolean column. Changing the 'default' value will not update already existing rows.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--xdefault [value]`, `Default value for column when not provided. Cannot be set when column is required.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesDBUpdateBooleanColumn))

tablesDB
    .command(`create-datetime-column`)
    .description(`Create a date time column according to the ISO 8601 standard.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for the column in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreateDatetimeColumn))

tablesDB
    .command(`update-datetime-column`)
    .description(`Update a date time column. Changing the 'default' value will not update already existing rows.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesDBUpdateDatetimeColumn))

tablesDB
    .command(`create-email-column`)
    .description(`Create an email column. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreateEmailColumn))

tablesDB
    .command(`update-email-column`)
    .description(`Update an email column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreateEnumColumn))

tablesDB
    .command(`update-enum-column`)
    .description(`Update an enum column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--elements [elements...]`, `Updated list of enum values.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesDBUpdateEnumColumn))

tablesDB
    .command(`create-float-column`)
    .description(`Create a float column. Optionally, minimum and maximum values can be provided. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--min <min>`, `Minimum value`, parseInteger)
    .option(`--max <max>`, `Maximum value`, parseInteger)
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when required.`, parseInteger)
    .option(`--array [value]`, `Is column an array?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreateFloatColumn))

tablesDB
    .command(`update-float-column`)
    .description(`Update a float column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--min <min>`, `Minimum value`, parseInteger)
    .option(`--max <max>`, `Maximum value`, parseInteger)
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when column is required.`, parseInteger)
    .option(`--array [value]`, `Is column an array?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreateIntegerColumn))

tablesDB
    .command(`update-integer-column`)
    .description(`Update an integer column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreateIpColumn))

tablesDB
    .command(`update-ip-column`)
    .description(`Update an ip column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesDBUpdateIpColumn))

tablesDB
    .command(`create-line-column`)
    .description(`Create a geometric line column.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when column is required.`)
    .action(actionRunner(tablesDBCreateLineColumn))

tablesDB
    .command(`update-line-column`)
    .description(`Update a line column. Changing the 'default' value will not update already existing rows.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesDBUpdateLineColumn))

tablesDB
    .command(`create-point-column`)
    .description(`Create a geometric point column.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when column is required.`)
    .action(actionRunner(tablesDBCreatePointColumn))

tablesDB
    .command(`update-point-column`)
    .description(`Update a point column. Changing the 'default' value will not update already existing rows.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when column is required.`)
    .option(`--new-key <new-key>`, `New Column Key.`)
    .action(actionRunner(tablesDBUpdatePointColumn))

tablesDB
    .command(`create-polygon-column`)
    .description(`Create a geometric polygon column.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided, three-dimensional array where the outer array holds one or more linear rings, [[[longitude, latitude], …], …], the first ring is the exterior boundary, any additional rings are interior holes, and each ring must start and end with the same coordinate pair. Cannot be set when column is required.`)
    .action(actionRunner(tablesDBCreatePolygonColumn))

tablesDB
    .command(`update-polygon-column`)
    .description(`Update a polygon column. Changing the 'default' value will not update already existing rows.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .option(`--two-way [value]`, `Is Two Way?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--key <key>`, `Column Key.`)
    .option(`--two-way-key <two-way-key>`, `Two Way Column Key.`)
    .option(`--on-delete <on-delete>`, `Constraints option`)
    .action(actionRunner(tablesDBCreateRelationshipColumn))

tablesDB
    .command(`create-string-column`)
    .description(`Create a string column. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--size <size>`, `Column size for text columns, in number of characters.`, parseInteger)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--encrypt [value]`, `Toggle encryption for the column. Encryption enhances security by not storing any plain text values in the database. However, encrypted columns cannot be queried.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreateStringColumn))

tablesDB
    .command(`update-string-column`)
    .description(`Update a string column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
    .option(`--array [value]`, `Is column an array?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(tablesDBCreateUrlColumn))

tablesDB
    .command(`update-url-column`)
    .description(`Update an url column. Changing the 'default' value will not update already existing rows. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--key <key>`, `Column Key.`)
    .requiredOption(`--required [value]`, `Is column required?`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: key, type, status, attributes, error`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBListIndexes))

tablesDB
    .command(`create-index`)
    .description(`Creates an index on the columns listed. Your index should include all the columns you will query in a single request. Type can be 'key', 'fulltext', or 'unique'.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
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
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .action(actionRunner(tablesDBGetIndex))

tablesDB
    .command(`delete-index`)
    .description(`Delete an index.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
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
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/products/databases/tables#create-table).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID to read uncommitted changes within the transaction.`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBListRows))

tablesDB
    .command(`create-row`)
    .description(`Create a new Row. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable). Make sure to define columns before creating rows.`)
    .requiredOption(`--row-id <row-id>`, `Row ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--data <data>`, `Row data as JSON object.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
    .action(actionRunner(tablesDBCreateRow))

tablesDB
    .command(`create-rows`)
    .description(`Create new Rows. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable). Make sure to define columns before creating rows.`)
    .requiredOption(`--rows [rows...]`, `Array of rows data as JSON objects.`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
    .action(actionRunner(tablesDBCreateRows))

tablesDB
    .command(`upsert-rows`)
    .description(`Create or update Rows. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--rows [rows...]`, `Array of row data as JSON objects. May contain partial rows.`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
    .action(actionRunner(tablesDBUpsertRows))

tablesDB
    .command(`update-rows`)
    .description(`Update all rows that match your queries, if no queries are submitted then all rows are updated. You can pass only specific fields to be updated.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .option(`--data <data>`, `Row data as JSON object. Include only column and value pairs to be updated.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
    .action(actionRunner(tablesDBUpdateRows))

tablesDB
    .command(`delete-rows`)
    .description(`Bulk delete rows using queries, if no queries are passed then all rows are deleted.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
    .action(actionRunner(tablesDBDeleteRows))

tablesDB
    .command(`get-row`)
    .description(`Get a row by its unique ID. This endpoint response returns a JSON object with the row data.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID to read uncommitted changes within the transaction.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(tablesDBGetRow))

tablesDB
    .command(`upsert-row`)
    .description(`Create or update a Row. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .option(`--data <data>`, `Row data as JSON object. Include all required columns of the row to be created or updated.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
    .action(actionRunner(tablesDBUpsertRow))

tablesDB
    .command(`update-row`)
    .description(`Update a row by its unique ID. Using the patch method you can pass only specific fields that will get updated.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID.`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .option(`--data <data>`, `Row data as JSON object. Include only columns and value pairs to be updated.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
    .action(actionRunner(tablesDBUpdateRow))

tablesDB
    .command(`delete-row`)
    .description(`Delete a row by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
    .requiredOption(`--row-id <row-id>`, `Row ID.`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
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
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
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
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
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


