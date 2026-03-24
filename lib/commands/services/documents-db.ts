import { Command } from "commander";
import { sdkForProject } from "../../sdks.js";
import {
  actionRunner,
  commandDescriptions,
  success,
  parse,
  parseBool,
  parseInteger,
} from "../../parser.js";
import { DocumentsDB } from "@appwrite.io/console";

let documentsDBClient: DocumentsDB | null = null;

const getDocumentsDBClient = async (): Promise<DocumentsDB> => {
  if (!documentsDBClient) {
    const sdkClient = await sdkForProject();
    documentsDBClient = new DocumentsDB(sdkClient);
  }
  return documentsDBClient;
};

export const documentsDB = new Command("documents-db")
  .description(commandDescriptions["documentsDB"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

documentsDB
  .command(`list`)
  .description(`Get a list of all databases from the current Appwrite project. You can use the search parameter to filter your results.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: name`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ queries, search, total }) =>
        parse(await (await getDocumentsDBClient()).list(queries, search, total)),
    ),
  );

documentsDB
  .command(`create`)
  .description(`Create a new Database.
`)
  .requiredOption(`--database-id <database-id>`, `Unique Id. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Database name. Max length: 128 chars.`)
  .option(
    `--enabled [value]`,
    `Is the database enabled? When set to 'disabled', users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, name, enabled }) =>
        parse(await (await getDocumentsDBClient()).create(databaseId, name, enabled)),
    ),
  );

documentsDB
  .command(`list-transactions`)
  .description(``)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries).`)
  .action(
    actionRunner(
      async ({ queries }) =>
        parse(await (await getDocumentsDBClient()).listTransactions(queries)),
    ),
  );

documentsDB
  .command(`create-transaction`)
  .description(``)
  .option(`--ttl <ttl>`, `Seconds before the transaction expires.`, parseInteger)
  .action(
    actionRunner(
      async ({ ttl }) =>
        parse(await (await getDocumentsDBClient()).createTransaction(ttl)),
    ),
  );

documentsDB
  .command(`get-transaction`)
  .description(``)
  .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
  .action(
    actionRunner(
      async ({ transactionId }) =>
        parse(await (await getDocumentsDBClient()).getTransaction(transactionId)),
    ),
  );

documentsDB
  .command(`update-transaction`)
  .description(``)
  .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
  .option(
    `--commit [value]`,
    `Commit transaction?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--rollback [value]`,
    `Rollback transaction?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ transactionId, commit, rollback }) =>
        parse(await (await getDocumentsDBClient()).updateTransaction(transactionId, commit, rollback)),
    ),
  );

documentsDB
  .command(`delete-transaction`)
  .description(``)
  .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
  .action(
    actionRunner(
      async ({ transactionId }) =>
        parse(await (await getDocumentsDBClient()).deleteTransaction(transactionId)),
    ),
  );

documentsDB
  .command(`list-usage`)
  .description(`List usage metrics and statistics for all databases in the project. You can view the total number of databases, collections, documents, and storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ range }) =>
        parse(await (await getDocumentsDBClient()).listUsage(range)),
    ),
  );

documentsDB
  .command(`get`)
  .description(`Get a database by its unique ID. This endpoint response returns a JSON object with the database metadata.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getDocumentsDBClient()).get(databaseId)),
    ),
  );

documentsDB
  .command(`update`)
  .description(`Update a database by its unique ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--name <name>`, `Database name. Max length: 128 chars.`)
  .option(
    `--enabled [value]`,
    `Is database enabled? When set to 'disabled', users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, name, enabled }) =>
        parse(await (await getDocumentsDBClient()).update(databaseId, name, enabled)),
    ),
  );

documentsDB
  .command(`delete`)
  .description(`Delete a database by its unique ID. Only API keys with with databases.write scope can delete a database.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getDocumentsDBClient()).delete(databaseId)),
    ),
  );

documentsDB
  .command(`list-collections`)
  .description(`Get a list of all collections that belong to the provided databaseId. You can use the search parameter to filter your results.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, documentSecurity`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, queries, search, total }) =>
        parse(await (await getDocumentsDBClient()).listCollections(databaseId, queries, search, total)),
    ),
  );

documentsDB
  .command(`create-collection`)
  .description(`Create a new Collection. Before using this route, you should create a new database resource using either a [server integration](https://appwrite.io/docs/server/databases#documentsDBCreateCollection) API or directly from your database console.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Unique Id. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
  .option(`--permissions [permissions...]`, `An array of permissions strings. By default, no user is granted with any permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .option(
    `--document-security [value]`,
    `Enables configuring permissions for individual documents. A user needs one of document or collection level permissions to access a document. [Learn more about permissions](https://appwrite.io/docs/permissions).`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--enabled [value]`,
    `Is collection enabled? When set to 'disabled', users cannot access the collection but Server SDKs with and API key can still read and write to the collection. No data is lost when this is toggled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--attributes [attributes...]`, `Array of attribute definitions to create. Each attribute should contain: key (string), type (string: string, integer, float, boolean, datetime, relationship), size (integer, required for string type), required (boolean, optional), default (mixed, optional), array (boolean, optional), and type-specific options.`)
  .option(`--indexes [indexes...]`, `Array of index definitions to create. Each index should contain: key (string), type (string: key, fulltext, unique, spatial), attributes (array of attribute keys), orders (array of ASC/DESC, optional), and lengths (array of integers, optional).`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, name, permissions, documentSecurity, enabled, attributes, indexes }) =>
        parse(await (await getDocumentsDBClient()).createCollection(databaseId, collectionId, name, permissions, documentSecurity, enabled, attributes, indexes)),
    ),
  );

documentsDB
  .command(`get-collection`)
  .description(`Get a collection by its unique ID. This endpoint response returns a JSON object with the collection metadata.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId }) =>
        parse(await (await getDocumentsDBClient()).getCollection(databaseId, collectionId)),
    ),
  );

documentsDB
  .command(`update-collection`)
  .description(`Update a collection by its unique ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
  .option(`--permissions [permissions...]`, `An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .option(
    `--document-security [value]`,
    `Enables configuring permissions for individual documents. A user needs one of document or collection level permissions to access a document. [Learn more about permissions](https://appwrite.io/docs/permissions).`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--enabled [value]`,
    `Is collection enabled? When set to 'disabled', users cannot access the collection but Server SDKs with and API key can still read and write to the collection. No data is lost when this is toggled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, name, permissions, documentSecurity, enabled }) =>
        parse(await (await getDocumentsDBClient()).updateCollection(databaseId, collectionId, name, permissions, documentSecurity, enabled)),
    ),
  );

documentsDB
  .command(`delete-collection`)
  .description(`Delete a collection by its unique ID. Only users with write permissions have access to delete this resource.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId }) =>
        parse(await (await getDocumentsDBClient()).deleteCollection(databaseId, collectionId)),
    ),
  );

documentsDB
  .command(`list-documents`)
  .description(`Get a list of all the user's documents in a given collection. You can use the query params to filter your results.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID to read uncommitted changes within the transaction.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--ttl <ttl>`, `TTL (seconds) for cached responses when caching is enabled for select queries. Must be between 0 and 86400 (24 hours).`, parseInteger)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, queries, transactionId, total, ttl }) =>
        parse(await (await getDocumentsDBClient()).listDocuments(databaseId, collectionId, queries, transactionId, total, ttl)),
    ),
  );

documentsDB
  .command(`create-document`)
  .description(`Create a new Document. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#documentsDBCreateCollection) API or directly from your database console.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.`)
  .requiredOption(`--document-id <document-id>`, `Document ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--data <data>`, `Document data as JSON object.`)
  .option(`--permissions [permissions...]`, `An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, data, permissions }) =>
        parse(await (await getDocumentsDBClient()).createDocument(databaseId, collectionId, documentId, JSON.parse(data), permissions)),
    ),
  );

documentsDB
  .command(`create-documents`)
  .description(`Create new Documents. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#documentsDBCreateCollection) API or directly from your database console.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.`)
  .requiredOption(`--documents [documents...]`, `Array of documents data as JSON objects.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documents }) =>
        parse(await (await getDocumentsDBClient()).createDocuments(databaseId, collectionId, documents)),
    ),
  );

documentsDB
  .command(`upsert-documents`)
  .description(`Create or update Documents. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#documentsDBCreateCollection) API or directly from your database console.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--documents [documents...]`, `Array of document data as JSON objects. May contain partial documents.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documents, transactionId }) =>
        parse(await (await getDocumentsDBClient()).upsertDocuments(databaseId, collectionId, documents, transactionId)),
    ),
  );

documentsDB
  .command(`update-documents`)
  .description(`Update all documents that match your queries, if no queries are submitted then all documents are updated. You can pass only specific fields to be updated.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .option(`--data <data>`, `Document data as JSON object. Include only attribute and value pairs to be updated.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, data, queries, transactionId }) =>
        parse(await (await getDocumentsDBClient()).updateDocuments(databaseId, collectionId, JSON.parse(data), queries, transactionId)),
    ),
  );

documentsDB
  .command(`delete-documents`)
  .description(`Bulk delete documents using queries, if no queries are passed then all documents are deleted.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, queries, transactionId }) =>
        parse(await (await getDocumentsDBClient()).deleteDocuments(databaseId, collectionId, queries, transactionId)),
    ),
  );

documentsDB
  .command(`get-document`)
  .description(`Get a document by its unique ID. This endpoint response returns a JSON object with the document data.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID to read uncommitted changes within the transaction.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, queries, transactionId }) =>
        parse(await (await getDocumentsDBClient()).getDocument(databaseId, collectionId, documentId, queries, transactionId)),
    ),
  );

documentsDB
  .command(`upsert-document`)
  .description(`Create or update a Document. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#documentsDBCreateCollection) API or directly from your database console.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(`--data <data>`, `Document data as JSON object. Include all required fields of the document to be created or updated.`)
  .option(`--permissions [permissions...]`, `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, data, permissions, transactionId }) =>
        parse(await (await getDocumentsDBClient()).upsertDocument(databaseId, collectionId, documentId, JSON.parse(data), permissions, transactionId)),
    ),
  );

documentsDB
  .command(`update-document`)
  .description(`Update a document by its unique ID. Using the patch method you can pass only specific fields that will get updated.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(`--data <data>`, `Document data as JSON object. Include only fields and value pairs to be updated.`)
  .option(`--permissions [permissions...]`, `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, data, permissions, transactionId }) =>
        parse(await (await getDocumentsDBClient()).updateDocument(databaseId, collectionId, documentId, JSON.parse(data), permissions, transactionId)),
    ),
  );

documentsDB
  .command(`delete-document`)
  .description(`Delete a document by its unique ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, transactionId }) =>
        parse(await (await getDocumentsDBClient()).deleteDocument(databaseId, collectionId, documentId, transactionId)),
    ),
  );

documentsDB
  .command(`list-document-logs`)
  .description(`Get the document activity logs list by its unique ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, queries }) =>
        parse(await (await getDocumentsDBClient()).listDocumentLogs(databaseId, collectionId, documentId, queries)),
    ),
  );

documentsDB
  .command(`decrement-document-attribute`)
  .description(`Decrement a specific column of a row by a given value.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .requiredOption(`--attribute <attribute>`, `Attribute key.`)
  .option(`--value <value>`, `Value to decrement the attribute by. The value must be a number.`, parseInteger)
  .option(`--min <min>`, `Minimum value for the attribute. If the current value is lesser than this value, an exception will be thrown.`, parseInteger)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, attribute, value, min, transactionId }) =>
        parse(await (await getDocumentsDBClient()).decrementDocumentAttribute(databaseId, collectionId, documentId, attribute, value, min, transactionId)),
    ),
  );

documentsDB
  .command(`increment-document-attribute`)
  .description(`Increment a specific column of a row by a given value.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .requiredOption(`--attribute <attribute>`, `Attribute key.`)
  .option(`--value <value>`, `Value to increment the attribute by. The value must be a number.`, parseInteger)
  .option(`--max <max>`, `Maximum value for the attribute. If the current value is greater than this value, an error will be thrown.`, parseInteger)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, attribute, value, max, transactionId }) =>
        parse(await (await getDocumentsDBClient()).incrementDocumentAttribute(databaseId, collectionId, documentId, attribute, value, max, transactionId)),
    ),
  );

documentsDB
  .command(`list-indexes`)
  .description(`List indexes in the collection.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, status, attributes, error`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, queries, total }) =>
        parse(await (await getDocumentsDBClient()).listIndexes(databaseId, collectionId, queries, total)),
    ),
  );

documentsDB
  .command(`create-index`)
  .description(`Creates an index on the attributes listed. Your index should include all the attributes you will query in a single request.
Attributes can be \`key\`, \`fulltext\`, and \`unique\`.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--key <key>`, `Index Key.`)
  .requiredOption(`--type <type>`, `Index type.`)
  .requiredOption(`--attributes [attributes...]`, `Array of attributes to index. Maximum of 100 attributes are allowed, each 32 characters long.`)
  .option(`--orders [orders...]`, `Array of index orders. Maximum of 100 orders are allowed.`)
  .option(`--lengths [lengths...]`, `Length of index. Maximum of 100`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, type, attributes, orders, lengths }) =>
        parse(await (await getDocumentsDBClient()).createIndex(databaseId, collectionId, key, type, attributes, orders, lengths)),
    ),
  );

documentsDB
  .command(`get-index`)
  .description(`Get index by ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--key <key>`, `Index Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key }) =>
        parse(await (await getDocumentsDBClient()).getIndex(databaseId, collectionId, key)),
    ),
  );

documentsDB
  .command(`delete-index`)
  .description(`Delete an index.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--key <key>`, `Index Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key }) =>
        parse(await (await getDocumentsDBClient()).deleteIndex(databaseId, collectionId, key)),
    ),
  );

documentsDB
  .command(`list-collection-logs`)
  .description(`Get the collection activity logs list by its unique ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, queries }) =>
        parse(await (await getDocumentsDBClient()).listCollectionLogs(databaseId, collectionId, queries)),
    ),
  );

documentsDB
  .command(`get-collection-usage`)
  .description(`Get usage metrics and statistics for a collection. Returning the total number of documents. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, range }) =>
        parse(await (await getDocumentsDBClient()).getCollectionUsage(databaseId, collectionId, range)),
    ),
  );

documentsDB
  .command(`get-usage`)
  .description(`Get usage metrics and statistics for a database. You can view the total number of collections, documents, and storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ databaseId, range }) =>
        parse(await (await getDocumentsDBClient()).getUsage(databaseId, range)),
    ),
  );

