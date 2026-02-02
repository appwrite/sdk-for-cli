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
import { Databases } from "@appwrite.io/console";

let databasesClient: Databases | null = null;

const getDatabasesClient = async (): Promise<Databases> => {
  if (!databasesClient) {
    const sdkClient = await sdkForProject();
    databasesClient = new Databases(sdkClient);
  }
  return databasesClient;
};

export const databases = new Command("databases")
  .description(commandDescriptions["databases"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

databases
  .command(`list`)
  .description(`Get a list of all databases from the current Appwrite project. You can use the search parameter to filter your results.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name`)
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
        parse(await (await getDatabasesClient()).list(queries, search, total)),
    ),
  );

databases
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
        parse(await (await getDatabasesClient()).create(databaseId, name, enabled)),
    ),
  );

databases
  .command(`list-transactions`)
  .description(`List transactions across all databases.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries).`)
  .action(
    actionRunner(
      async ({ queries }) =>
        parse(await (await getDatabasesClient()).listTransactions(queries)),
    ),
  );

databases
  .command(`create-transaction`)
  .description(`Create a new transaction.`)
  .option(`--ttl <ttl>`, `Seconds before the transaction expires.`, parseInteger)
  .action(
    actionRunner(
      async ({ ttl }) =>
        parse(await (await getDatabasesClient()).createTransaction(ttl)),
    ),
  );

databases
  .command(`get-transaction`)
  .description(`Get a transaction by its unique ID.`)
  .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
  .action(
    actionRunner(
      async ({ transactionId }) =>
        parse(await (await getDatabasesClient()).getTransaction(transactionId)),
    ),
  );

databases
  .command(`update-transaction`)
  .description(`Update a transaction, to either commit or roll back its operations.`)
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
        parse(await (await getDatabasesClient()).updateTransaction(transactionId, commit, rollback)),
    ),
  );

databases
  .command(`delete-transaction`)
  .description(`Delete a transaction by its unique ID.`)
  .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
  .action(
    actionRunner(
      async ({ transactionId }) =>
        parse(await (await getDatabasesClient()).deleteTransaction(transactionId)),
    ),
  );

databases
  .command(`create-operations`)
  .description(`Create multiple operations in a single transaction.`)
  .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
  .option(`--operations [operations...]`, `Array of staged operations.`)
  .action(
    actionRunner(
      async ({ transactionId, operations }) =>
        parse(await (await getDatabasesClient()).createOperations(transactionId, operations)),
    ),
  );

databases
  .command(`list-usage`)
  .description(`List usage metrics and statistics for all databases in the project. You can view the total number of databases, collections, documents, and storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ range }) =>
        parse(await (await getDatabasesClient()).listUsage(range)),
    ),
  );

databases
  .command(`get`)
  .description(`Get a database by its unique ID. This endpoint response returns a JSON object with the database metadata.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getDatabasesClient()).get(databaseId)),
    ),
  );

databases
  .command(`update`)
  .description(`Update a database by its unique ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--name <name>`, `Database name. Max length: 128 chars.`)
  .option(
    `--enabled [value]`,
    `Is database enabled? When set to 'disabled', users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, name, enabled }) =>
        parse(await (await getDatabasesClient()).update(databaseId, name, enabled)),
    ),
  );

databases
  .command(`delete`)
  .description(`Delete a database by its unique ID. Only API keys with with databases.write scope can delete a database.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getDatabasesClient()).delete(databaseId)),
    ),
  );

databases
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
        parse(await (await getDatabasesClient()).listCollections(databaseId, queries, search, total)),
    ),
  );

databases
  .command(`create-collection`)
  .description(`Create a new Collection. Before using this route, you should create a new database resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.`)
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
  .option(`--attributes [attributes...]`, `Array of attribute definitions to create. Each attribute should contain: key (string), type (string: string, integer, float, boolean, datetime), size (integer, required for string type), required (boolean, optional), default (mixed, optional), array (boolean, optional), and type-specific options.`)
  .option(`--indexes [indexes...]`, `Array of index definitions to create. Each index should contain: key (string), type (string: key, fulltext, unique, spatial), attributes (array of attribute keys), orders (array of ASC/DESC, optional), and lengths (array of integers, optional).`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, name, permissions, documentSecurity, enabled, attributes, indexes }) =>
        parse(await (await getDatabasesClient()).createCollection(databaseId, collectionId, name, permissions, documentSecurity, enabled, attributes, indexes)),
    ),
  );

databases
  .command(`get-collection`)
  .description(`Get a collection by its unique ID. This endpoint response returns a JSON object with the collection metadata.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId }) =>
        parse(await (await getDatabasesClient()).getCollection(databaseId, collectionId)),
    ),
  );

databases
  .command(`update-collection`)
  .description(`Update a collection by its unique ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .option(`--name <name>`, `Collection name. Max length: 128 chars.`)
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
        parse(await (await getDatabasesClient()).updateCollection(databaseId, collectionId, name, permissions, documentSecurity, enabled)),
    ),
  );

databases
  .command(`delete-collection`)
  .description(`Delete a collection by its unique ID. Only users with write permissions have access to delete this resource.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId }) =>
        parse(await (await getDatabasesClient()).deleteCollection(databaseId, collectionId)),
    ),
  );

databases
  .command(`list-attributes`)
  .description(`List attributes in the collection.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, size, required, array, status, error`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, queries, total }) =>
        parse(await (await getDatabasesClient()).listAttributes(databaseId, collectionId, queries, total)),
    ),
  );

databases
  .command(`create-boolean-attribute`)
  .description(`Create a boolean attribute.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(
    `--xdefault [value]`,
    `Default value for attribute when not provided. Cannot be set when attribute is required.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--array [value]`,
    `Is attribute an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault, array }) =>
        parse(await (await getDatabasesClient()).createBooleanAttribute(databaseId, collectionId, key, required, xdefault, array)),
    ),
  );

databases
  .command(`update-boolean-attribute`)
  .description(`Update a boolean attribute. Changing the \`default\` value will not update already existing documents.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#createCollection).`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, parseBool)
  .option(`--new-key <new-key>`, `New attribute key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault, newKey }) =>
        parse(await (await getDatabasesClient()).updateBooleanAttribute(databaseId, collectionId, key, required, xdefault, newKey)),
    ),
  );

databases
  .command(`create-datetime-attribute`)
  .description(`Create a date time attribute according to the ISO 8601 standard.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#createCollection).`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--xdefault <xdefault>`, `Default value for the attribute in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Cannot be set when attribute is required.`)
  .option(
    `--array [value]`,
    `Is attribute an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault, array }) =>
        parse(await (await getDatabasesClient()).createDatetimeAttribute(databaseId, collectionId, key, required, xdefault, array)),
    ),
  );

databases
  .command(`update-datetime-attribute`)
  .description(`Update a date time attribute. Changing the \`default\` value will not update already existing documents.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
  .option(`--new-key <new-key>`, `New attribute key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault, newKey }) =>
        parse(await (await getDatabasesClient()).updateDatetimeAttribute(databaseId, collectionId, key, required, xdefault, newKey)),
    ),
  );

databases
  .command(`create-email-attribute`)
  .description(`Create an email attribute.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
  .option(
    `--array [value]`,
    `Is attribute an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault, array }) =>
        parse(await (await getDatabasesClient()).createEmailAttribute(databaseId, collectionId, key, required, xdefault, array)),
    ),
  );

databases
  .command(`update-email-attribute`)
  .description(`Update an email attribute. Changing the \`default\` value will not update already existing documents.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
  .option(`--new-key <new-key>`, `New Attribute Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault, newKey }) =>
        parse(await (await getDatabasesClient()).updateEmailAttribute(databaseId, collectionId, key, required, xdefault, newKey)),
    ),
  );

databases
  .command(`create-enum-attribute`)
  .description(`Create an enum attribute. The \`elements\` param acts as a white-list of accepted values for this attribute. 
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--elements [elements...]`, `Array of enum values.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
  .option(
    `--array [value]`,
    `Is attribute an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, elements, required, xdefault, array }) =>
        parse(await (await getDatabasesClient()).createEnumAttribute(databaseId, collectionId, key, elements, required, xdefault, array)),
    ),
  );

databases
  .command(`update-enum-attribute`)
  .description(`Update an enum attribute. Changing the \`default\` value will not update already existing documents.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--elements [elements...]`, `Updated list of enum values.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
  .option(`--new-key <new-key>`, `New Attribute Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, elements, required, xdefault, newKey }) =>
        parse(await (await getDatabasesClient()).updateEnumAttribute(databaseId, collectionId, key, elements, required, xdefault, newKey)),
    ),
  );

databases
  .command(`create-float-attribute`)
  .description(`Create a float attribute. Optionally, minimum and maximum values can be provided.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--min <min>`, `Minimum value.`, parseInteger)
  .option(`--max <max>`, `Maximum value.`, parseInteger)
  .option(`--xdefault <xdefault>`, `Default value. Cannot be set when required.`, parseInteger)
  .option(
    `--array [value]`,
    `Is attribute an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, min, max, xdefault, array }) =>
        parse(await (await getDatabasesClient()).createFloatAttribute(databaseId, collectionId, key, required, min, max, xdefault, array)),
    ),
  );

databases
  .command(`update-float-attribute`)
  .description(`Update a float attribute. Changing the \`default\` value will not update already existing documents.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value. Cannot be set when required.`, parseInteger)
  .option(`--min <min>`, `Minimum value.`, parseInteger)
  .option(`--max <max>`, `Maximum value.`, parseInteger)
  .option(`--new-key <new-key>`, `New Attribute Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault, min, max, newKey }) =>
        parse(await (await getDatabasesClient()).updateFloatAttribute(databaseId, collectionId, key, required, xdefault, min, max, newKey)),
    ),
  );

databases
  .command(`create-integer-attribute`)
  .description(`Create an integer attribute. Optionally, minimum and maximum values can be provided.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--min <min>`, `Minimum value`, parseInteger)
  .option(`--max <max>`, `Maximum value`, parseInteger)
  .option(`--xdefault <xdefault>`, `Default value. Cannot be set when attribute is required.`, parseInteger)
  .option(
    `--array [value]`,
    `Is attribute an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, min, max, xdefault, array }) =>
        parse(await (await getDatabasesClient()).createIntegerAttribute(databaseId, collectionId, key, required, min, max, xdefault, array)),
    ),
  );

databases
  .command(`update-integer-attribute`)
  .description(`Update an integer attribute. Changing the \`default\` value will not update already existing documents.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value. Cannot be set when attribute is required.`, parseInteger)
  .option(`--min <min>`, `Minimum value`, parseInteger)
  .option(`--max <max>`, `Maximum value`, parseInteger)
  .option(`--new-key <new-key>`, `New Attribute Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault, min, max, newKey }) =>
        parse(await (await getDatabasesClient()).updateIntegerAttribute(databaseId, collectionId, key, required, xdefault, min, max, newKey)),
    ),
  );

databases
  .command(`create-ip-attribute`)
  .description(`Create IP address attribute.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--xdefault <xdefault>`, `Default value. Cannot be set when attribute is required.`)
  .option(
    `--array [value]`,
    `Is attribute an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault, array }) =>
        parse(await (await getDatabasesClient()).createIpAttribute(databaseId, collectionId, key, required, xdefault, array)),
    ),
  );

databases
  .command(`update-ip-attribute`)
  .description(`Update an ip attribute. Changing the \`default\` value will not update already existing documents.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value. Cannot be set when attribute is required.`)
  .option(`--new-key <new-key>`, `New Attribute Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault, newKey }) =>
        parse(await (await getDatabasesClient()).updateIpAttribute(databaseId, collectionId, key, required, xdefault, newKey)),
    ),
  );

databases
  .command(`create-line-attribute`)
  .description(`Create a geometric line attribute.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--xdefault [xdefault...]`, `Default value for attribute when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when attribute is required.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault }) =>
        parse(await (await getDatabasesClient()).createLineAttribute(databaseId, collectionId, key, required, xdefault)),
    ),
  );

databases
  .command(`update-line-attribute`)
  .description(`Update a line attribute. Changing the \`default\` value will not update already existing documents.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#createCollection).`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--xdefault [xdefault...]`, `Default value for attribute when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when attribute is required.`)
  .option(`--new-key <new-key>`, `New attribute key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault, newKey }) =>
        parse(await (await getDatabasesClient()).updateLineAttribute(databaseId, collectionId, key, required, xdefault, newKey)),
    ),
  );

databases
  .command(`create-point-attribute`)
  .description(`Create a geometric point attribute.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--xdefault [xdefault...]`, `Default value for attribute when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when attribute is required.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault }) =>
        parse(await (await getDatabasesClient()).createPointAttribute(databaseId, collectionId, key, required, xdefault)),
    ),
  );

databases
  .command(`update-point-attribute`)
  .description(`Update a point attribute. Changing the \`default\` value will not update already existing documents.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#createCollection).`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--xdefault [xdefault...]`, `Default value for attribute when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when attribute is required.`)
  .option(`--new-key <new-key>`, `New attribute key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault, newKey }) =>
        parse(await (await getDatabasesClient()).updatePointAttribute(databaseId, collectionId, key, required, xdefault, newKey)),
    ),
  );

databases
  .command(`create-polygon-attribute`)
  .description(`Create a geometric polygon attribute.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--xdefault [xdefault...]`, `Default value for attribute when not provided, three-dimensional array where the outer array holds one or more linear rings, [[[longitude, latitude], …], …], the first ring is the exterior boundary, any additional rings are interior holes, and each ring must start and end with the same coordinate pair. Cannot be set when attribute is required.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault }) =>
        parse(await (await getDatabasesClient()).createPolygonAttribute(databaseId, collectionId, key, required, xdefault)),
    ),
  );

databases
  .command(`update-polygon-attribute`)
  .description(`Update a polygon attribute. Changing the \`default\` value will not update already existing documents.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#createCollection).`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--xdefault [xdefault...]`, `Default value for attribute when not provided, three-dimensional array where the outer array holds one or more linear rings, [[[longitude, latitude], …], …], the first ring is the exterior boundary, any additional rings are interior holes, and each ring must start and end with the same coordinate pair. Cannot be set when attribute is required.`)
  .option(`--new-key <new-key>`, `New attribute key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault, newKey }) =>
        parse(await (await getDatabasesClient()).updatePolygonAttribute(databaseId, collectionId, key, required, xdefault, newKey)),
    ),
  );

databases
  .command(`create-relationship-attribute`)
  .description(`Create relationship attribute. [Learn more about relationship attributes](https://appwrite.io/docs/databases-relationships#relationship-attributes).
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--related-collection-id <related-collection-id>`, `Related Collection ID.`)
  .requiredOption(`--type <type>`, `Relation type`)
  .option(
    `--two-way [value]`,
    `Is Two Way?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--key <key>`, `Attribute Key.`)
  .option(`--two-way-key <two-way-key>`, `Two Way Attribute Key.`)
  .option(`--on-delete <on-delete>`, `Constraints option`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, relatedCollectionId, type, twoWay, key, twoWayKey, onDelete }) =>
        parse(await (await getDatabasesClient()).createRelationshipAttribute(databaseId, collectionId, relatedCollectionId, type, twoWay, key, twoWayKey, onDelete)),
    ),
  );

databases
  .command(`create-string-attribute`)
  .description(`Create a string attribute.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--size <size>`, `Attribute size for text attributes, in number of characters.`, parseInteger)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
  .option(
    `--array [value]`,
    `Is attribute an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--encrypt [value]`,
    `Toggle encryption for the attribute. Encryption enhances security by not storing any plain text values in the database. However, encrypted attributes cannot be queried.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, size, required, xdefault, array, encrypt }) =>
        parse(await (await getDatabasesClient()).createStringAttribute(databaseId, collectionId, key, size, required, xdefault, array, encrypt)),
    ),
  );

databases
  .command(`update-string-attribute`)
  .description(`Update a string attribute. Changing the \`default\` value will not update already existing documents.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
  .option(`--size <size>`, `Maximum size of the string attribute.`, parseInteger)
  .option(`--new-key <new-key>`, `New Attribute Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault, size, newKey }) =>
        parse(await (await getDatabasesClient()).updateStringAttribute(databaseId, collectionId, key, required, xdefault, size, newKey)),
    ),
  );

databases
  .command(`create-url-attribute`)
  .description(`Create a URL attribute.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
  .option(
    `--array [value]`,
    `Is attribute an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault, array }) =>
        parse(await (await getDatabasesClient()).createUrlAttribute(databaseId, collectionId, key, required, xdefault, array)),
    ),
  );

databases
  .command(`update-url-attribute`)
  .description(`Update an url attribute. Changing the \`default\` value will not update already existing documents.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
  .option(`--new-key <new-key>`, `New Attribute Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xdefault, newKey }) =>
        parse(await (await getDatabasesClient()).updateUrlAttribute(databaseId, collectionId, key, required, xdefault, newKey)),
    ),
  );

databases
  .command(`get-attribute`)
  .description(`Get attribute by ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key }) =>
        parse(await (await getDatabasesClient()).getAttribute(databaseId, collectionId, key)),
    ),
  );

databases
  .command(`delete-attribute`)
  .description(`Deletes an attribute.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key }) =>
        parse(await (await getDatabasesClient()).deleteAttribute(databaseId, collectionId, key)),
    ),
  );

databases
  .command(`update-relationship-attribute`)
  .description(`Update relationship attribute. [Learn more about relationship attributes](https://appwrite.io/docs/databases-relationships#relationship-attributes).
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .option(`--on-delete <on-delete>`, `Constraints option`)
  .option(`--new-key <new-key>`, `New Attribute Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, onDelete, newKey }) =>
        parse(await (await getDatabasesClient()).updateRelationshipAttribute(databaseId, collectionId, key, onDelete, newKey)),
    ),
  );

databases
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
  .action(
    actionRunner(
      async ({ databaseId, collectionId, queries, transactionId, total }) =>
        parse(await (await getDatabasesClient()).listDocuments(databaseId, collectionId, queries, transactionId, total)),
    ),
  );

databases
  .command(`create-document`)
  .description(`Create a new Document. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.`)
  .requiredOption(`--document-id <document-id>`, `Document ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--data <data>`, `Document data as JSON object.`)
  .option(`--permissions [permissions...]`, `An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, data, permissions, transactionId }) =>
        parse(await (await getDatabasesClient()).createDocument(databaseId, collectionId, documentId, JSON.parse(data), permissions, transactionId)),
    ),
  );

databases
  .command(`create-documents`)
  .description(`Create new Documents. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.`)
  .requiredOption(`--documents [documents...]`, `Array of documents data as JSON objects.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documents, transactionId }) =>
        parse(await (await getDatabasesClient()).createDocuments(databaseId, collectionId, documents, transactionId)),
    ),
  );

databases
  .command(`upsert-documents`)
  .description(`Create or update Documents. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--documents [documents...]`, `Array of document data as JSON objects. May contain partial documents.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documents, transactionId }) =>
        parse(await (await getDatabasesClient()).upsertDocuments(databaseId, collectionId, documents, transactionId)),
    ),
  );

databases
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
        parse(await (await getDatabasesClient()).updateDocuments(databaseId, collectionId, JSON.parse(data), queries, transactionId)),
    ),
  );

databases
  .command(`delete-documents`)
  .description(`Bulk delete documents using queries, if no queries are passed then all documents are deleted.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, queries, transactionId }) =>
        parse(await (await getDatabasesClient()).deleteDocuments(databaseId, collectionId, queries, transactionId)),
    ),
  );

databases
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
        parse(await (await getDatabasesClient()).getDocument(databaseId, collectionId, documentId, queries, transactionId)),
    ),
  );

databases
  .command(`upsert-document`)
  .description(`Create or update a Document. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(`--data <data>`, `Document data as JSON object. Include all required attributes of the document to be created or updated.`)
  .option(`--permissions [permissions...]`, `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, data, permissions, transactionId }) =>
        parse(await (await getDatabasesClient()).upsertDocument(databaseId, collectionId, documentId, JSON.parse(data), permissions, transactionId)),
    ),
  );

databases
  .command(`update-document`)
  .description(`Update a document by its unique ID. Using the patch method you can pass only specific fields that will get updated.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(`--data <data>`, `Document data as JSON object. Include only attribute and value pairs to be updated.`)
  .option(`--permissions [permissions...]`, `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, data, permissions, transactionId }) =>
        parse(await (await getDatabasesClient()).updateDocument(databaseId, collectionId, documentId, JSON.parse(data), permissions, transactionId)),
    ),
  );

databases
  .command(`delete-document`)
  .description(`Delete a document by its unique ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, transactionId }) =>
        parse(await (await getDatabasesClient()).deleteDocument(databaseId, collectionId, documentId, transactionId)),
    ),
  );

databases
  .command(`list-document-logs`)
  .description(`Get the document activity logs list by its unique ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, queries }) =>
        parse(await (await getDatabasesClient()).listDocumentLogs(databaseId, collectionId, documentId, queries)),
    ),
  );

databases
  .command(`decrement-document-attribute`)
  .description(`Decrement a specific attribute of a document by a given value.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .requiredOption(`--attribute <attribute>`, `Attribute key.`)
  .option(`--value <value>`, `Value to increment the attribute by. The value must be a number.`, parseInteger)
  .option(`--min <min>`, `Minimum value for the attribute. If the current value is lesser than this value, an exception will be thrown.`, parseInteger)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, attribute, value, min, transactionId }) =>
        parse(await (await getDatabasesClient()).decrementDocumentAttribute(databaseId, collectionId, documentId, attribute, value, min, transactionId)),
    ),
  );

databases
  .command(`increment-document-attribute`)
  .description(`Increment a specific attribute of a document by a given value.`)
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
        parse(await (await getDatabasesClient()).incrementDocumentAttribute(databaseId, collectionId, documentId, attribute, value, max, transactionId)),
    ),
  );

databases
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
        parse(await (await getDatabasesClient()).listIndexes(databaseId, collectionId, queries, total)),
    ),
  );

databases
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
        parse(await (await getDatabasesClient()).createIndex(databaseId, collectionId, key, type, attributes, orders, lengths)),
    ),
  );

databases
  .command(`get-index`)
  .description(`Get an index by its unique ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--key <key>`, `Index Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key }) =>
        parse(await (await getDatabasesClient()).getIndex(databaseId, collectionId, key)),
    ),
  );

databases
  .command(`delete-index`)
  .description(`Delete an index.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
  .requiredOption(`--key <key>`, `Index Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key }) =>
        parse(await (await getDatabasesClient()).deleteIndex(databaseId, collectionId, key)),
    ),
  );

databases
  .command(`list-collection-logs`)
  .description(`Get the collection activity logs list by its unique ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, queries }) =>
        parse(await (await getDatabasesClient()).listCollectionLogs(databaseId, collectionId, queries)),
    ),
  );

databases
  .command(`get-collection-usage`)
  .description(`Get usage metrics and statistics for a collection. Returning the total number of documents. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, range }) =>
        parse(await (await getDatabasesClient()).getCollectionUsage(databaseId, collectionId, range)),
    ),
  );

databases
  .command(`list-logs`)
  .description(`Get the database activity logs list by its unique ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .action(
    actionRunner(
      async ({ databaseId, queries }) =>
        parse(await (await getDatabasesClient()).listLogs(databaseId, queries)),
    ),
  );

databases
  .command(`get-usage`)
  .description(`Get usage metrics and statistics for a database. You can view the total number of collections, documents, and storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ databaseId, range }) =>
        parse(await (await getDatabasesClient()).getUsage(databaseId, range)),
    ),
  );

