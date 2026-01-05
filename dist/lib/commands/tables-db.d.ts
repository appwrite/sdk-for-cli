import { Client } from "@appwrite.io/console";
import { Command } from "commander";
import { UsageRange, RelationshipType, RelationMutate, IndexType } from "@appwrite.io/console";
export declare const tablesDB: Command;
interface TablesDBListRequestParams {
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const tablesDBList: ({ queries, search, total, parseOutput, overrideForCli, sdk, console: showConsole, }: TablesDBListRequestParams) => Promise<any>;
interface TablesDBCreateRequestParams {
    databaseId: string;
    name: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBCreate: ({ databaseId, name, enabled, parseOutput, overrideForCli, sdk, }: TablesDBCreateRequestParams) => Promise<any>;
interface TablesDBListTransactionsRequestParams {
    queries?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const tablesDBListTransactions: ({ queries, parseOutput, overrideForCli, sdk, console: showConsole, }: TablesDBListTransactionsRequestParams) => Promise<any>;
interface TablesDBCreateTransactionRequestParams {
    ttl?: number;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBCreateTransaction: ({ ttl, parseOutput, overrideForCli, sdk, }: TablesDBCreateTransactionRequestParams) => Promise<any>;
interface TablesDBGetTransactionRequestParams {
    transactionId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const tablesDBGetTransaction: ({ transactionId, parseOutput, overrideForCli, sdk, console: showConsole, }: TablesDBGetTransactionRequestParams) => Promise<any>;
interface TablesDBUpdateTransactionRequestParams {
    transactionId: string;
    commit?: boolean;
    rollback?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBUpdateTransaction: ({ transactionId, commit, rollback, parseOutput, overrideForCli, sdk, }: TablesDBUpdateTransactionRequestParams) => Promise<any>;
interface TablesDBDeleteTransactionRequestParams {
    transactionId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBDeleteTransaction: ({ transactionId, parseOutput, overrideForCli, sdk, }: TablesDBDeleteTransactionRequestParams) => Promise<any>;
interface TablesDBCreateOperationsRequestParams {
    transactionId: string;
    operations?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBCreateOperations: ({ transactionId, operations, parseOutput, overrideForCli, sdk, }: TablesDBCreateOperationsRequestParams) => Promise<any>;
interface TablesDBListUsageRequestParams {
    range?: UsageRange;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const tablesDBListUsage: ({ range, parseOutput, overrideForCli, sdk, console: showConsole, }: TablesDBListUsageRequestParams) => Promise<any>;
interface TablesDBGetRequestParams {
    databaseId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const tablesDBGet: ({ databaseId, parseOutput, overrideForCli, sdk, console: showConsole, }: TablesDBGetRequestParams) => Promise<any>;
interface TablesDBUpdateRequestParams {
    databaseId: string;
    name: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBUpdate: ({ databaseId, name, enabled, parseOutput, overrideForCli, sdk, }: TablesDBUpdateRequestParams) => Promise<any>;
interface TablesDBDeleteRequestParams {
    databaseId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBDelete: ({ databaseId, parseOutput, overrideForCli, sdk, }: TablesDBDeleteRequestParams) => Promise<any>;
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
export declare const tablesDBListTables: ({ databaseId, queries, search, total, parseOutput, overrideForCli, sdk, console: showConsole, }: TablesDBListTablesRequestParams) => Promise<any>;
interface TablesDBCreateTableRequestParams {
    databaseId: string;
    tableId: string;
    name: string;
    permissions?: string[];
    rowSecurity?: boolean;
    enabled?: boolean;
    columns?: string[];
    indexes?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBCreateTable: ({ databaseId, tableId, name, permissions, rowSecurity, enabled, columns, indexes, parseOutput, overrideForCli, sdk, }: TablesDBCreateTableRequestParams) => Promise<any>;
interface TablesDBGetTableRequestParams {
    databaseId: string;
    tableId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const tablesDBGetTable: ({ databaseId, tableId, parseOutput, overrideForCli, sdk, console: showConsole, }: TablesDBGetTableRequestParams) => Promise<any>;
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
export declare const tablesDBUpdateTable: ({ databaseId, tableId, name, permissions, rowSecurity, enabled, parseOutput, overrideForCli, sdk, }: TablesDBUpdateTableRequestParams) => Promise<any>;
interface TablesDBDeleteTableRequestParams {
    databaseId: string;
    tableId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBDeleteTable: ({ databaseId, tableId, parseOutput, overrideForCli, sdk, }: TablesDBDeleteTableRequestParams) => Promise<any>;
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
export declare const tablesDBListColumns: ({ databaseId, tableId, queries, total, parseOutput, overrideForCli, sdk, console: showConsole, }: TablesDBListColumnsRequestParams) => Promise<any>;
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
export declare const tablesDBCreateBooleanColumn: ({ databaseId, tableId, key, required, xdefault, array, parseOutput, overrideForCli, sdk, }: TablesDBCreateBooleanColumnRequestParams) => Promise<any>;
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
export declare const tablesDBUpdateBooleanColumn: ({ databaseId, tableId, key, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: TablesDBUpdateBooleanColumnRequestParams) => Promise<any>;
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
export declare const tablesDBCreateDatetimeColumn: ({ databaseId, tableId, key, required, xdefault, array, parseOutput, overrideForCli, sdk, }: TablesDBCreateDatetimeColumnRequestParams) => Promise<any>;
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
export declare const tablesDBUpdateDatetimeColumn: ({ databaseId, tableId, key, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: TablesDBUpdateDatetimeColumnRequestParams) => Promise<any>;
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
export declare const tablesDBCreateEmailColumn: ({ databaseId, tableId, key, required, xdefault, array, parseOutput, overrideForCli, sdk, }: TablesDBCreateEmailColumnRequestParams) => Promise<any>;
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
export declare const tablesDBUpdateEmailColumn: ({ databaseId, tableId, key, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: TablesDBUpdateEmailColumnRequestParams) => Promise<any>;
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
export declare const tablesDBCreateEnumColumn: ({ databaseId, tableId, key, elements, required, xdefault, array, parseOutput, overrideForCli, sdk, }: TablesDBCreateEnumColumnRequestParams) => Promise<any>;
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
export declare const tablesDBUpdateEnumColumn: ({ databaseId, tableId, key, elements, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: TablesDBUpdateEnumColumnRequestParams) => Promise<any>;
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
export declare const tablesDBCreateFloatColumn: ({ databaseId, tableId, key, required, min, max, xdefault, array, parseOutput, overrideForCli, sdk, }: TablesDBCreateFloatColumnRequestParams) => Promise<any>;
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
export declare const tablesDBUpdateFloatColumn: ({ databaseId, tableId, key, required, xdefault, min, max, newKey, parseOutput, overrideForCli, sdk, }: TablesDBUpdateFloatColumnRequestParams) => Promise<any>;
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
export declare const tablesDBCreateIntegerColumn: ({ databaseId, tableId, key, required, min, max, xdefault, array, parseOutput, overrideForCli, sdk, }: TablesDBCreateIntegerColumnRequestParams) => Promise<any>;
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
export declare const tablesDBUpdateIntegerColumn: ({ databaseId, tableId, key, required, xdefault, min, max, newKey, parseOutput, overrideForCli, sdk, }: TablesDBUpdateIntegerColumnRequestParams) => Promise<any>;
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
export declare const tablesDBCreateIpColumn: ({ databaseId, tableId, key, required, xdefault, array, parseOutput, overrideForCli, sdk, }: TablesDBCreateIpColumnRequestParams) => Promise<any>;
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
export declare const tablesDBUpdateIpColumn: ({ databaseId, tableId, key, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: TablesDBUpdateIpColumnRequestParams) => Promise<any>;
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
export declare const tablesDBCreateLineColumn: ({ databaseId, tableId, key, required, xdefault, parseOutput, overrideForCli, sdk, }: TablesDBCreateLineColumnRequestParams) => Promise<any>;
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
export declare const tablesDBUpdateLineColumn: ({ databaseId, tableId, key, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: TablesDBUpdateLineColumnRequestParams) => Promise<any>;
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
export declare const tablesDBCreatePointColumn: ({ databaseId, tableId, key, required, xdefault, parseOutput, overrideForCli, sdk, }: TablesDBCreatePointColumnRequestParams) => Promise<any>;
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
export declare const tablesDBUpdatePointColumn: ({ databaseId, tableId, key, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: TablesDBUpdatePointColumnRequestParams) => Promise<any>;
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
export declare const tablesDBCreatePolygonColumn: ({ databaseId, tableId, key, required, xdefault, parseOutput, overrideForCli, sdk, }: TablesDBCreatePolygonColumnRequestParams) => Promise<any>;
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
export declare const tablesDBUpdatePolygonColumn: ({ databaseId, tableId, key, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: TablesDBUpdatePolygonColumnRequestParams) => Promise<any>;
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
export declare const tablesDBCreateRelationshipColumn: ({ databaseId, tableId, relatedTableId, type, twoWay, key, twoWayKey, onDelete, parseOutput, overrideForCli, sdk, }: TablesDBCreateRelationshipColumnRequestParams) => Promise<any>;
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
export declare const tablesDBCreateStringColumn: ({ databaseId, tableId, key, size, required, xdefault, array, encrypt, parseOutput, overrideForCli, sdk, }: TablesDBCreateStringColumnRequestParams) => Promise<any>;
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
export declare const tablesDBUpdateStringColumn: ({ databaseId, tableId, key, required, xdefault, size, newKey, parseOutput, overrideForCli, sdk, }: TablesDBUpdateStringColumnRequestParams) => Promise<any>;
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
export declare const tablesDBCreateUrlColumn: ({ databaseId, tableId, key, required, xdefault, array, parseOutput, overrideForCli, sdk, }: TablesDBCreateUrlColumnRequestParams) => Promise<any>;
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
export declare const tablesDBUpdateUrlColumn: ({ databaseId, tableId, key, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: TablesDBUpdateUrlColumnRequestParams) => Promise<any>;
interface TablesDBGetColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const tablesDBGetColumn: ({ databaseId, tableId, key, parseOutput, overrideForCli, sdk, console: showConsole, }: TablesDBGetColumnRequestParams) => Promise<any>;
interface TablesDBDeleteColumnRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBDeleteColumn: ({ databaseId, tableId, key, parseOutput, overrideForCli, sdk, }: TablesDBDeleteColumnRequestParams) => Promise<any>;
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
export declare const tablesDBUpdateRelationshipColumn: ({ databaseId, tableId, key, onDelete, newKey, parseOutput, overrideForCli, sdk, }: TablesDBUpdateRelationshipColumnRequestParams) => Promise<any>;
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
export declare const tablesDBListIndexes: ({ databaseId, tableId, queries, total, parseOutput, overrideForCli, sdk, console: showConsole, }: TablesDBListIndexesRequestParams) => Promise<any>;
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
export declare const tablesDBCreateIndex: ({ databaseId, tableId, key, type, columns, orders, lengths, parseOutput, overrideForCli, sdk, }: TablesDBCreateIndexRequestParams) => Promise<any>;
interface TablesDBGetIndexRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBGetIndex: ({ databaseId, tableId, key, parseOutput, overrideForCli, sdk, }: TablesDBGetIndexRequestParams) => Promise<any>;
interface TablesDBDeleteIndexRequestParams {
    databaseId: string;
    tableId: string;
    key: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBDeleteIndex: ({ databaseId, tableId, key, parseOutput, overrideForCli, sdk, }: TablesDBDeleteIndexRequestParams) => Promise<any>;
interface TablesDBListTableLogsRequestParams {
    databaseId: string;
    tableId: string;
    queries?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const tablesDBListTableLogs: ({ databaseId, tableId, queries, parseOutput, overrideForCli, sdk, console: showConsole, }: TablesDBListTableLogsRequestParams) => Promise<any>;
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
export declare const tablesDBListRows: ({ databaseId, tableId, queries, transactionId, total, parseOutput, overrideForCli, sdk, console: showConsole, }: TablesDBListRowsRequestParams) => Promise<any>;
interface TablesDBCreateRowRequestParams {
    databaseId: string;
    tableId: string;
    rowId: string;
    data: string;
    permissions?: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBCreateRow: ({ databaseId, tableId, rowId, data, permissions, transactionId, parseOutput, overrideForCli, sdk, }: TablesDBCreateRowRequestParams) => Promise<any>;
interface TablesDBCreateRowsRequestParams {
    databaseId: string;
    tableId: string;
    rows: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBCreateRows: ({ databaseId, tableId, rows, transactionId, parseOutput, overrideForCli, sdk, }: TablesDBCreateRowsRequestParams) => Promise<any>;
interface TablesDBUpsertRowsRequestParams {
    databaseId: string;
    tableId: string;
    rows: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBUpsertRows: ({ databaseId, tableId, rows, transactionId, parseOutput, overrideForCli, sdk, }: TablesDBUpsertRowsRequestParams) => Promise<any>;
interface TablesDBUpdateRowsRequestParams {
    databaseId: string;
    tableId: string;
    data?: string;
    queries?: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBUpdateRows: ({ databaseId, tableId, data, queries, transactionId, parseOutput, overrideForCli, sdk, }: TablesDBUpdateRowsRequestParams) => Promise<any>;
interface TablesDBDeleteRowsRequestParams {
    databaseId: string;
    tableId: string;
    queries?: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBDeleteRows: ({ databaseId, tableId, queries, transactionId, parseOutput, overrideForCli, sdk, }: TablesDBDeleteRowsRequestParams) => Promise<any>;
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
export declare const tablesDBGetRow: ({ databaseId, tableId, rowId, queries, transactionId, parseOutput, overrideForCli, sdk, console: showConsole, }: TablesDBGetRowRequestParams) => Promise<any>;
interface TablesDBUpsertRowRequestParams {
    databaseId: string;
    tableId: string;
    rowId: string;
    data?: string;
    permissions?: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBUpsertRow: ({ databaseId, tableId, rowId, data, permissions, transactionId, parseOutput, overrideForCli, sdk, }: TablesDBUpsertRowRequestParams) => Promise<any>;
interface TablesDBUpdateRowRequestParams {
    databaseId: string;
    tableId: string;
    rowId: string;
    data?: string;
    permissions?: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBUpdateRow: ({ databaseId, tableId, rowId, data, permissions, transactionId, parseOutput, overrideForCli, sdk, }: TablesDBUpdateRowRequestParams) => Promise<any>;
interface TablesDBDeleteRowRequestParams {
    databaseId: string;
    tableId: string;
    rowId: string;
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBDeleteRow: ({ databaseId, tableId, rowId, transactionId, parseOutput, overrideForCli, sdk, }: TablesDBDeleteRowRequestParams) => Promise<any>;
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
export declare const tablesDBListRowLogs: ({ databaseId, tableId, rowId, queries, parseOutput, overrideForCli, sdk, console: showConsole, }: TablesDBListRowLogsRequestParams) => Promise<any>;
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
export declare const tablesDBDecrementRowColumn: ({ databaseId, tableId, rowId, column, value, min, transactionId, parseOutput, overrideForCli, sdk, }: TablesDBDecrementRowColumnRequestParams) => Promise<any>;
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
export declare const tablesDBIncrementRowColumn: ({ databaseId, tableId, rowId, column, value, max, transactionId, parseOutput, overrideForCli, sdk, }: TablesDBIncrementRowColumnRequestParams) => Promise<any>;
interface TablesDBGetTableUsageRequestParams {
    databaseId: string;
    tableId: string;
    range?: UsageRange;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const tablesDBGetTableUsage: ({ databaseId, tableId, range, parseOutput, overrideForCli, sdk, console: showConsole, }: TablesDBGetTableUsageRequestParams) => Promise<any>;
interface TablesDBGetUsageRequestParams {
    databaseId: string;
    range?: UsageRange;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const tablesDBGetUsage: ({ databaseId, range, parseOutput, overrideForCli, sdk, }: TablesDBGetUsageRequestParams) => Promise<any>;
export {};
//# sourceMappingURL=tables-db.d.ts.map