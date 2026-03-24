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
import { VectorsDB } from "@appwrite.io/console";

let vectorsDBClient: VectorsDB | null = null;

const getVectorsDBClient = async (): Promise<VectorsDB> => {
  if (!vectorsDBClient) {
    const sdkClient = await sdkForProject();
    vectorsDBClient = new VectorsDB(sdkClient);
  }
  return vectorsDBClient;
};

export const vectorsDB = new Command("vectors-db")
  .description(commandDescriptions["vectorsDB"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

vectorsDB
  .command(`list`)
  .description(``)
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
        parse(await (await getVectorsDBClient()).list(queries, search, total)),
    ),
  );

vectorsDB
  .command(`create`)
  .description(``)
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
        parse(await (await getVectorsDBClient()).create(databaseId, name, enabled)),
    ),
  );

vectorsDB
  .command(`create-text-embeddings`)
  .description(``)
  .requiredOption(`--texts [texts...]`, `Array of text to generate embeddings.`)
  .option(`--model <model>`, `The embedding model to use for generating vector embeddings.`)
  .action(
    actionRunner(
      async ({ texts, model }) =>
        parse(await (await getVectorsDBClient()).createTextEmbeddings(texts, model)),
    ),
  );

vectorsDB
  .command(`list-transactions`)
  .description(``)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries).`)
  .action(
    actionRunner(
      async ({ queries }) =>
        parse(await (await getVectorsDBClient()).listTransactions(queries)),
    ),
  );

vectorsDB
  .command(`create-transaction`)
  .description(``)
  .option(`--ttl <ttl>`, `Seconds before the transaction expires.`, parseInteger)
  .action(
    actionRunner(
      async ({ ttl }) =>
        parse(await (await getVectorsDBClient()).createTransaction(ttl)),
    ),
  );

vectorsDB
  .command(`get-transaction`)
  .description(``)
  .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
  .action(
    actionRunner(
      async ({ transactionId }) =>
        parse(await (await getVectorsDBClient()).getTransaction(transactionId)),
    ),
  );

vectorsDB
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
        parse(await (await getVectorsDBClient()).updateTransaction(transactionId, commit, rollback)),
    ),
  );

vectorsDB
  .command(`delete-transaction`)
  .description(``)
  .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
  .action(
    actionRunner(
      async ({ transactionId }) =>
        parse(await (await getVectorsDBClient()).deleteTransaction(transactionId)),
    ),
  );

vectorsDB
  .command(`create-operations`)
  .description(``)
  .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
  .option(`--operations [operations...]`, `Array of staged operations.`)
  .action(
    actionRunner(
      async ({ transactionId, operations }) =>
        parse(await (await getVectorsDBClient()).createOperations(transactionId, operations)),
    ),
  );

vectorsDB
  .command(`list-usage`)
  .description(``)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ range }) =>
        parse(await (await getVectorsDBClient()).listUsage(range)),
    ),
  );

vectorsDB
  .command(`get`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getVectorsDBClient()).get(databaseId)),
    ),
  );

vectorsDB
  .command(`update`)
  .description(``)
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
        parse(await (await getVectorsDBClient()).update(databaseId, name, enabled)),
    ),
  );

vectorsDB
  .command(`delete`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getVectorsDBClient()).delete(databaseId)),
    ),
  );

vectorsDB
  .command(`list-collections`)
  .description(``)
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
        parse(await (await getVectorsDBClient()).listCollections(databaseId, queries, search, total)),
    ),
  );

vectorsDB
  .command(`create-collection`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Unique Id. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
  .requiredOption(`--dimension <dimension>`, `Embedding dimension.`, parseInteger)
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
  .action(
    actionRunner(
      async ({ databaseId, collectionId, name, dimension, permissions, documentSecurity, enabled }) =>
        parse(await (await getVectorsDBClient()).createCollection(databaseId, collectionId, name, dimension, permissions, documentSecurity, enabled)),
    ),
  );

vectorsDB
  .command(`get-collection`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId }) =>
        parse(await (await getVectorsDBClient()).getCollection(databaseId, collectionId)),
    ),
  );

vectorsDB
  .command(`update-collection`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
  .option(`--dimension <dimension>`, `Embedding dimensions.`, parseInteger)
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
      async ({ databaseId, collectionId, name, dimension, permissions, documentSecurity, enabled }) =>
        parse(await (await getVectorsDBClient()).updateCollection(databaseId, collectionId, name, dimension, permissions, documentSecurity, enabled)),
    ),
  );

vectorsDB
  .command(`delete-collection`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId }) =>
        parse(await (await getVectorsDBClient()).deleteCollection(databaseId, collectionId)),
    ),
  );

vectorsDB
  .command(`list-documents`)
  .description(``)
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
        parse(await (await getVectorsDBClient()).listDocuments(databaseId, collectionId, queries, transactionId, total, ttl)),
    ),
  );

vectorsDB
  .command(`create-document`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.`)
  .requiredOption(`--document-id <document-id>`, `Document ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--data <data>`, `Document data as JSON object.`)
  .option(`--permissions [permissions...]`, `An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, data, permissions }) =>
        parse(await (await getVectorsDBClient()).createDocument(databaseId, collectionId, documentId, JSON.parse(data), permissions)),
    ),
  );

vectorsDB
  .command(`create-documents`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.`)
  .requiredOption(`--documents [documents...]`, `Array of documents data as JSON objects.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documents }) =>
        parse(await (await getVectorsDBClient()).createDocuments(databaseId, collectionId, documents)),
    ),
  );

vectorsDB
  .command(`upsert-documents`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--documents [documents...]`, `Array of document data as JSON objects. May contain partial documents.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documents, transactionId }) =>
        parse(await (await getVectorsDBClient()).upsertDocuments(databaseId, collectionId, documents, transactionId)),
    ),
  );

vectorsDB
  .command(`update-documents`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .option(`--data <data>`, `Document data as JSON object. Include only attribute and value pairs to be updated.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, data, queries, transactionId }) =>
        parse(await (await getVectorsDBClient()).updateDocuments(databaseId, collectionId, JSON.parse(data), queries, transactionId)),
    ),
  );

vectorsDB
  .command(`delete-documents`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, queries, transactionId }) =>
        parse(await (await getVectorsDBClient()).deleteDocuments(databaseId, collectionId, queries, transactionId)),
    ),
  );

vectorsDB
  .command(`get-document`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID to read uncommitted changes within the transaction.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, queries, transactionId }) =>
        parse(await (await getVectorsDBClient()).getDocument(databaseId, collectionId, documentId, queries, transactionId)),
    ),
  );

vectorsDB
  .command(`upsert-document`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(`--data <data>`, `Document data as JSON object. Include all required fields of the document to be created or updated.`)
  .option(`--permissions [permissions...]`, `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, data, permissions, transactionId }) =>
        parse(await (await getVectorsDBClient()).upsertDocument(databaseId, collectionId, documentId, JSON.parse(data), permissions, transactionId)),
    ),
  );

vectorsDB
  .command(`update-document`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(`--data <data>`, `Document data as JSON object. Include only fields and value pairs to be updated.`)
  .option(`--permissions [permissions...]`, `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, data, permissions, transactionId }) =>
        parse(await (await getVectorsDBClient()).updateDocument(databaseId, collectionId, documentId, JSON.parse(data), permissions, transactionId)),
    ),
  );

vectorsDB
  .command(`delete-document`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, transactionId }) =>
        parse(await (await getVectorsDBClient()).deleteDocument(databaseId, collectionId, documentId, transactionId)),
    ),
  );

vectorsDB
  .command(`list-document-logs`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, queries }) =>
        parse(await (await getVectorsDBClient()).listDocumentLogs(databaseId, collectionId, documentId, queries)),
    ),
  );

vectorsDB
  .command(`list-indexes`)
  .description(``)
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
        parse(await (await getVectorsDBClient()).listIndexes(databaseId, collectionId, queries, total)),
    ),
  );

vectorsDB
  .command(`create-index`)
  .description(``)
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
        parse(await (await getVectorsDBClient()).createIndex(databaseId, collectionId, key, type, attributes, orders, lengths)),
    ),
  );

vectorsDB
  .command(`get-index`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--key <key>`, `Index Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key }) =>
        parse(await (await getVectorsDBClient()).getIndex(databaseId, collectionId, key)),
    ),
  );

vectorsDB
  .command(`delete-index`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--key <key>`, `Index Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key }) =>
        parse(await (await getVectorsDBClient()).deleteIndex(databaseId, collectionId, key)),
    ),
  );

vectorsDB
  .command(`list-collection-logs`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, queries }) =>
        parse(await (await getVectorsDBClient()).listCollectionLogs(databaseId, collectionId, queries)),
    ),
  );

vectorsDB
  .command(`get-collection-usage`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, range }) =>
        parse(await (await getVectorsDBClient()).getCollectionUsage(databaseId, collectionId, range)),
    ),
  );

vectorsDB
  .command(`get-usage`)
  .description(``)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ databaseId, range }) =>
        parse(await (await getVectorsDBClient()).getUsage(databaseId, range)),
    ),
  );

