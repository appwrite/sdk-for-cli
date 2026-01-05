import { Client } from "@appwrite.io/console";
import { Command } from "commander";
import { UsageRange, RelationshipType, RelationMutate, IndexType } from "@appwrite.io/console";
export declare const databases: Command;
interface DatabasesListRequestParams {
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const databasesList: ({ queries, search, total, parseOutput, overrideForCli, sdk, console: showConsole, }: DatabasesListRequestParams) => Promise<any>;
interface DatabasesCreateRequestParams {
    databaseId: string;
    name: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesCreate: ({ databaseId, name, enabled, parseOutput, overrideForCli, sdk, }: DatabasesCreateRequestParams) => Promise<any>;
interface DatabasesListTransactionsRequestParams {
    queries?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const databasesListTransactions: ({ queries, parseOutput, overrideForCli, sdk, console: showConsole, }: DatabasesListTransactionsRequestParams) => Promise<any>;
interface DatabasesCreateTransactionRequestParams {
    ttl?: number;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesCreateTransaction: ({ ttl, parseOutput, overrideForCli, sdk, }: DatabasesCreateTransactionRequestParams) => Promise<any>;
interface DatabasesGetTransactionRequestParams {
    transactionId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const databasesGetTransaction: ({ transactionId, parseOutput, overrideForCli, sdk, console: showConsole, }: DatabasesGetTransactionRequestParams) => Promise<any>;
interface DatabasesUpdateTransactionRequestParams {
    transactionId: string;
    commit?: boolean;
    rollback?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpdateTransaction: ({ transactionId, commit, rollback, parseOutput, overrideForCli, sdk, }: DatabasesUpdateTransactionRequestParams) => Promise<any>;
interface DatabasesDeleteTransactionRequestParams {
    transactionId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesDeleteTransaction: ({ transactionId, parseOutput, overrideForCli, sdk, }: DatabasesDeleteTransactionRequestParams) => Promise<any>;
interface DatabasesCreateOperationsRequestParams {
    transactionId: string;
    operations?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesCreateOperations: ({ transactionId, operations, parseOutput, overrideForCli, sdk, }: DatabasesCreateOperationsRequestParams) => Promise<any>;
interface DatabasesListUsageRequestParams {
    range?: UsageRange;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const databasesListUsage: ({ range, parseOutput, overrideForCli, sdk, console: showConsole, }: DatabasesListUsageRequestParams) => Promise<any>;
interface DatabasesGetRequestParams {
    databaseId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const databasesGet: ({ databaseId, parseOutput, overrideForCli, sdk, console: showConsole, }: DatabasesGetRequestParams) => Promise<any>;
interface DatabasesUpdateRequestParams {
    databaseId: string;
    name: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpdate: ({ databaseId, name, enabled, parseOutput, overrideForCli, sdk, }: DatabasesUpdateRequestParams) => Promise<any>;
interface DatabasesDeleteRequestParams {
    databaseId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesDelete: ({ databaseId, parseOutput, overrideForCli, sdk, }: DatabasesDeleteRequestParams) => Promise<any>;
interface DatabasesListCollectionsRequestParams {
    databaseId: string;
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const databasesListCollections: ({ databaseId, queries, search, total, parseOutput, overrideForCli, sdk, console: showConsole, }: DatabasesListCollectionsRequestParams) => Promise<any>;
interface DatabasesCreateCollectionRequestParams {
    databaseId: string;
    collectionId: string;
    name: string;
    permissions?: string[];
    documentSecurity?: boolean;
    enabled?: boolean;
    attributes?: string[];
    indexes?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesCreateCollection: ({ databaseId, collectionId, name, permissions, documentSecurity, enabled, attributes, indexes, parseOutput, overrideForCli, sdk, }: DatabasesCreateCollectionRequestParams) => Promise<any>;
interface DatabasesGetCollectionRequestParams {
    databaseId: string;
    collectionId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const databasesGetCollection: ({ databaseId, collectionId, parseOutput, overrideForCli, sdk, console: showConsole, }: DatabasesGetCollectionRequestParams) => Promise<any>;
interface DatabasesUpdateCollectionRequestParams {
    databaseId: string;
    collectionId: string;
    name: string;
    permissions?: string[];
    documentSecurity?: boolean;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpdateCollection: ({ databaseId, collectionId, name, permissions, documentSecurity, enabled, parseOutput, overrideForCli, sdk, }: DatabasesUpdateCollectionRequestParams) => Promise<any>;
interface DatabasesDeleteCollectionRequestParams {
    databaseId: string;
    collectionId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesDeleteCollection: ({ databaseId, collectionId, parseOutput, overrideForCli, sdk, }: DatabasesDeleteCollectionRequestParams) => Promise<any>;
interface DatabasesListAttributesRequestParams {
    databaseId: string;
    collectionId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const databasesListAttributes: ({ databaseId, collectionId, queries, total, parseOutput, overrideForCli, sdk, console: showConsole, }: DatabasesListAttributesRequestParams) => Promise<any>;
interface DatabasesCreateBooleanAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    required: boolean;
    xdefault?: boolean;
    array?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesCreateBooleanAttribute: ({ databaseId, collectionId, key, required, xdefault, array, parseOutput, overrideForCli, sdk, }: DatabasesCreateBooleanAttributeRequestParams) => Promise<any>;
interface DatabasesUpdateBooleanAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    required: boolean;
    xdefault: boolean;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpdateBooleanAttribute: ({ databaseId, collectionId, key, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: DatabasesUpdateBooleanAttributeRequestParams) => Promise<any>;
interface DatabasesCreateDatetimeAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    required: boolean;
    xdefault?: string;
    array?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesCreateDatetimeAttribute: ({ databaseId, collectionId, key, required, xdefault, array, parseOutput, overrideForCli, sdk, }: DatabasesCreateDatetimeAttributeRequestParams) => Promise<any>;
interface DatabasesUpdateDatetimeAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    required: boolean;
    xdefault: string;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpdateDatetimeAttribute: ({ databaseId, collectionId, key, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: DatabasesUpdateDatetimeAttributeRequestParams) => Promise<any>;
interface DatabasesCreateEmailAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    required: boolean;
    xdefault?: string;
    array?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesCreateEmailAttribute: ({ databaseId, collectionId, key, required, xdefault, array, parseOutput, overrideForCli, sdk, }: DatabasesCreateEmailAttributeRequestParams) => Promise<any>;
interface DatabasesUpdateEmailAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    required: boolean;
    xdefault: string;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpdateEmailAttribute: ({ databaseId, collectionId, key, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: DatabasesUpdateEmailAttributeRequestParams) => Promise<any>;
interface DatabasesCreateEnumAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    elements: string[];
    required: boolean;
    xdefault?: string;
    array?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesCreateEnumAttribute: ({ databaseId, collectionId, key, elements, required, xdefault, array, parseOutput, overrideForCli, sdk, }: DatabasesCreateEnumAttributeRequestParams) => Promise<any>;
interface DatabasesUpdateEnumAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    elements: string[];
    required: boolean;
    xdefault: string;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpdateEnumAttribute: ({ databaseId, collectionId, key, elements, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: DatabasesUpdateEnumAttributeRequestParams) => Promise<any>;
interface DatabasesCreateFloatAttributeRequestParams {
    databaseId: string;
    collectionId: string;
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
export declare const databasesCreateFloatAttribute: ({ databaseId, collectionId, key, required, min, max, xdefault, array, parseOutput, overrideForCli, sdk, }: DatabasesCreateFloatAttributeRequestParams) => Promise<any>;
interface DatabasesUpdateFloatAttributeRequestParams {
    databaseId: string;
    collectionId: string;
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
export declare const databasesUpdateFloatAttribute: ({ databaseId, collectionId, key, required, xdefault, min, max, newKey, parseOutput, overrideForCli, sdk, }: DatabasesUpdateFloatAttributeRequestParams) => Promise<any>;
interface DatabasesCreateIntegerAttributeRequestParams {
    databaseId: string;
    collectionId: string;
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
export declare const databasesCreateIntegerAttribute: ({ databaseId, collectionId, key, required, min, max, xdefault, array, parseOutput, overrideForCli, sdk, }: DatabasesCreateIntegerAttributeRequestParams) => Promise<any>;
interface DatabasesUpdateIntegerAttributeRequestParams {
    databaseId: string;
    collectionId: string;
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
export declare const databasesUpdateIntegerAttribute: ({ databaseId, collectionId, key, required, xdefault, min, max, newKey, parseOutput, overrideForCli, sdk, }: DatabasesUpdateIntegerAttributeRequestParams) => Promise<any>;
interface DatabasesCreateIpAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    required: boolean;
    xdefault?: string;
    array?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesCreateIpAttribute: ({ databaseId, collectionId, key, required, xdefault, array, parseOutput, overrideForCli, sdk, }: DatabasesCreateIpAttributeRequestParams) => Promise<any>;
interface DatabasesUpdateIpAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    required: boolean;
    xdefault: string;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpdateIpAttribute: ({ databaseId, collectionId, key, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: DatabasesUpdateIpAttributeRequestParams) => Promise<any>;
interface DatabasesCreateLineAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    required: boolean;
    xdefault?: any[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesCreateLineAttribute: ({ databaseId, collectionId, key, required, xdefault, parseOutput, overrideForCli, sdk, }: DatabasesCreateLineAttributeRequestParams) => Promise<any>;
interface DatabasesUpdateLineAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    required: boolean;
    xdefault?: any[];
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpdateLineAttribute: ({ databaseId, collectionId, key, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: DatabasesUpdateLineAttributeRequestParams) => Promise<any>;
interface DatabasesCreatePointAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    required: boolean;
    xdefault?: any[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesCreatePointAttribute: ({ databaseId, collectionId, key, required, xdefault, parseOutput, overrideForCli, sdk, }: DatabasesCreatePointAttributeRequestParams) => Promise<any>;
interface DatabasesUpdatePointAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    required: boolean;
    xdefault?: any[];
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpdatePointAttribute: ({ databaseId, collectionId, key, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: DatabasesUpdatePointAttributeRequestParams) => Promise<any>;
interface DatabasesCreatePolygonAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    required: boolean;
    xdefault?: any[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesCreatePolygonAttribute: ({ databaseId, collectionId, key, required, xdefault, parseOutput, overrideForCli, sdk, }: DatabasesCreatePolygonAttributeRequestParams) => Promise<any>;
interface DatabasesUpdatePolygonAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    required: boolean;
    xdefault?: any[];
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpdatePolygonAttribute: ({ databaseId, collectionId, key, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: DatabasesUpdatePolygonAttributeRequestParams) => Promise<any>;
interface DatabasesCreateRelationshipAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    relatedCollectionId: string;
    type: RelationshipType;
    twoWay?: boolean;
    key?: string;
    twoWayKey?: string;
    onDelete?: RelationMutate;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesCreateRelationshipAttribute: ({ databaseId, collectionId, relatedCollectionId, type, twoWay, key, twoWayKey, onDelete, parseOutput, overrideForCli, sdk, }: DatabasesCreateRelationshipAttributeRequestParams) => Promise<any>;
interface DatabasesCreateStringAttributeRequestParams {
    databaseId: string;
    collectionId: string;
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
export declare const databasesCreateStringAttribute: ({ databaseId, collectionId, key, size, required, xdefault, array, encrypt, parseOutput, overrideForCli, sdk, }: DatabasesCreateStringAttributeRequestParams) => Promise<any>;
interface DatabasesUpdateStringAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    required: boolean;
    xdefault: string;
    size?: number;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpdateStringAttribute: ({ databaseId, collectionId, key, required, xdefault, size, newKey, parseOutput, overrideForCli, sdk, }: DatabasesUpdateStringAttributeRequestParams) => Promise<any>;
interface DatabasesCreateUrlAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    required: boolean;
    xdefault?: string;
    array?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesCreateUrlAttribute: ({ databaseId, collectionId, key, required, xdefault, array, parseOutput, overrideForCli, sdk, }: DatabasesCreateUrlAttributeRequestParams) => Promise<any>;
interface DatabasesUpdateUrlAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    required: boolean;
    xdefault: string;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpdateUrlAttribute: ({ databaseId, collectionId, key, required, xdefault, newKey, parseOutput, overrideForCli, sdk, }: DatabasesUpdateUrlAttributeRequestParams) => Promise<any>;
interface DatabasesGetAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesGetAttribute: ({ databaseId, collectionId, key, parseOutput, overrideForCli, sdk, }: DatabasesGetAttributeRequestParams) => Promise<any>;
interface DatabasesDeleteAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesDeleteAttribute: ({ databaseId, collectionId, key, parseOutput, overrideForCli, sdk, }: DatabasesDeleteAttributeRequestParams) => Promise<any>;
interface DatabasesUpdateRelationshipAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    onDelete?: RelationMutate;
    newKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpdateRelationshipAttribute: ({ databaseId, collectionId, key, onDelete, newKey, parseOutput, overrideForCli, sdk, }: DatabasesUpdateRelationshipAttributeRequestParams) => Promise<any>;
interface DatabasesListDocumentsRequestParams {
    databaseId: string;
    collectionId: string;
    queries?: string[];
    transactionId?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const databasesListDocuments: ({ databaseId, collectionId, queries, transactionId, total, parseOutput, overrideForCli, sdk, console: showConsole, }: DatabasesListDocumentsRequestParams) => Promise<any>;
interface DatabasesCreateDocumentRequestParams {
    databaseId: string;
    collectionId: string;
    documentId: string;
    data: string;
    permissions?: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesCreateDocument: ({ databaseId, collectionId, documentId, data, permissions, transactionId, parseOutput, overrideForCli, sdk, }: DatabasesCreateDocumentRequestParams) => Promise<any>;
interface DatabasesCreateDocumentsRequestParams {
    databaseId: string;
    collectionId: string;
    documents: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesCreateDocuments: ({ databaseId, collectionId, documents, transactionId, parseOutput, overrideForCli, sdk, }: DatabasesCreateDocumentsRequestParams) => Promise<any>;
interface DatabasesUpsertDocumentsRequestParams {
    databaseId: string;
    collectionId: string;
    documents: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpsertDocuments: ({ databaseId, collectionId, documents, transactionId, parseOutput, overrideForCli, sdk, }: DatabasesUpsertDocumentsRequestParams) => Promise<any>;
interface DatabasesUpdateDocumentsRequestParams {
    databaseId: string;
    collectionId: string;
    data?: string;
    queries?: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpdateDocuments: ({ databaseId, collectionId, data, queries, transactionId, parseOutput, overrideForCli, sdk, }: DatabasesUpdateDocumentsRequestParams) => Promise<any>;
interface DatabasesDeleteDocumentsRequestParams {
    databaseId: string;
    collectionId: string;
    queries?: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesDeleteDocuments: ({ databaseId, collectionId, queries, transactionId, parseOutput, overrideForCli, sdk, }: DatabasesDeleteDocumentsRequestParams) => Promise<any>;
interface DatabasesGetDocumentRequestParams {
    databaseId: string;
    collectionId: string;
    documentId: string;
    queries?: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const databasesGetDocument: ({ databaseId, collectionId, documentId, queries, transactionId, parseOutput, overrideForCli, sdk, console: showConsole, }: DatabasesGetDocumentRequestParams) => Promise<any>;
interface DatabasesUpsertDocumentRequestParams {
    databaseId: string;
    collectionId: string;
    documentId: string;
    data?: string;
    permissions?: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpsertDocument: ({ databaseId, collectionId, documentId, data, permissions, transactionId, parseOutput, overrideForCli, sdk, }: DatabasesUpsertDocumentRequestParams) => Promise<any>;
interface DatabasesUpdateDocumentRequestParams {
    databaseId: string;
    collectionId: string;
    documentId: string;
    data?: string;
    permissions?: string[];
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesUpdateDocument: ({ databaseId, collectionId, documentId, data, permissions, transactionId, parseOutput, overrideForCli, sdk, }: DatabasesUpdateDocumentRequestParams) => Promise<any>;
interface DatabasesDeleteDocumentRequestParams {
    databaseId: string;
    collectionId: string;
    documentId: string;
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesDeleteDocument: ({ databaseId, collectionId, documentId, transactionId, parseOutput, overrideForCli, sdk, }: DatabasesDeleteDocumentRequestParams) => Promise<any>;
interface DatabasesListDocumentLogsRequestParams {
    databaseId: string;
    collectionId: string;
    documentId: string;
    queries?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesListDocumentLogs: ({ databaseId, collectionId, documentId, queries, parseOutput, overrideForCli, sdk, }: DatabasesListDocumentLogsRequestParams) => Promise<any>;
interface DatabasesDecrementDocumentAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    documentId: string;
    attribute: string;
    value?: number;
    min?: number;
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesDecrementDocumentAttribute: ({ databaseId, collectionId, documentId, attribute, value, min, transactionId, parseOutput, overrideForCli, sdk, }: DatabasesDecrementDocumentAttributeRequestParams) => Promise<any>;
interface DatabasesIncrementDocumentAttributeRequestParams {
    databaseId: string;
    collectionId: string;
    documentId: string;
    attribute: string;
    value?: number;
    max?: number;
    transactionId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesIncrementDocumentAttribute: ({ databaseId, collectionId, documentId, attribute, value, max, transactionId, parseOutput, overrideForCli, sdk, }: DatabasesIncrementDocumentAttributeRequestParams) => Promise<any>;
interface DatabasesListIndexesRequestParams {
    databaseId: string;
    collectionId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const databasesListIndexes: ({ databaseId, collectionId, queries, total, parseOutput, overrideForCli, sdk, console: showConsole, }: DatabasesListIndexesRequestParams) => Promise<any>;
interface DatabasesCreateIndexRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    type: IndexType;
    attributes: string[];
    orders?: string[];
    lengths?: number[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesCreateIndex: ({ databaseId, collectionId, key, type, attributes, orders, lengths, parseOutput, overrideForCli, sdk, }: DatabasesCreateIndexRequestParams) => Promise<any>;
interface DatabasesGetIndexRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesGetIndex: ({ databaseId, collectionId, key, parseOutput, overrideForCli, sdk, }: DatabasesGetIndexRequestParams) => Promise<any>;
interface DatabasesDeleteIndexRequestParams {
    databaseId: string;
    collectionId: string;
    key: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesDeleteIndex: ({ databaseId, collectionId, key, parseOutput, overrideForCli, sdk, }: DatabasesDeleteIndexRequestParams) => Promise<any>;
interface DatabasesListCollectionLogsRequestParams {
    databaseId: string;
    collectionId: string;
    queries?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesListCollectionLogs: ({ databaseId, collectionId, queries, parseOutput, overrideForCli, sdk, }: DatabasesListCollectionLogsRequestParams) => Promise<any>;
interface DatabasesGetCollectionUsageRequestParams {
    databaseId: string;
    collectionId: string;
    range?: UsageRange;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesGetCollectionUsage: ({ databaseId, collectionId, range, parseOutput, overrideForCli, sdk, }: DatabasesGetCollectionUsageRequestParams) => Promise<any>;
interface DatabasesListLogsRequestParams {
    databaseId: string;
    queries?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesListLogs: ({ databaseId, queries, parseOutput, overrideForCli, sdk, }: DatabasesListLogsRequestParams) => Promise<any>;
interface DatabasesGetUsageRequestParams {
    databaseId: string;
    range?: UsageRange;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const databasesGetUsage: ({ databaseId, range, parseOutput, overrideForCli, sdk, }: DatabasesGetUsageRequestParams) => Promise<any>;
export {};
//# sourceMappingURL=databases.d.ts.map