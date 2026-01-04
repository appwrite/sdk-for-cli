import { Command } from "commander";
import { sdkForProject } from "../../sdks.js";
import {
  actionRunner,
  commandDescriptions,
  parseBool,
  parseInteger,
} from "../../parser.js";
import {
  Client as ConsoleClient,
  Databases,
  UsageRange,
  RelationshipType,
  RelationMutate,
  IndexType,
} from "@appwrite.io/console";

let databasesClient: Databases | null = null;

const getDatabasesClient = async (): Promise<Databases> => {
  if (!databasesClient) {
    const sdkClient = await sdkForProject();
    databasesClient = new Databases(sdkClient as unknown as ConsoleClient);
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
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases list' instead] Get a list of all databases from the current Appwrite project. You can use the search parameter to filter your results.`,
  )
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name`,
  )
  .option(
    `--search <search>`,
    `Search term to filter your list results. Max length: 256 chars.`,
  )
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ queries, search, total }) =>
        await (await getDatabasesClient()).list(queries, search, total),
    ),
  );

databases
  .command(`create`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases create' instead] Create a new Database.
`,
  )
  .requiredOption(
    `--database-id <database-id>`,
    `Unique Id. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`,
  )
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
        await (await getDatabasesClient()).create(databaseId, name, enabled),
    ),
  );

databases
  .command(`list-transactions`)
  .description(`List transactions across all databases.`)
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries).`,
  )
  .action(
    actionRunner(
      async ({ queries }) =>
        await (await getDatabasesClient()).listTransactions(queries),
    ),
  );

databases
  .command(`create-transaction`)
  .description(`Create a new transaction.`)
  .option(
    `--ttl <ttl>`,
    `Seconds before the transaction expires.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ ttl }) =>
        await (await getDatabasesClient()).createTransaction(ttl),
    ),
  );

databases
  .command(`get-transaction`)
  .description(`Get a transaction by its unique ID.`)
  .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
  .action(
    actionRunner(
      async ({ transactionId }) =>
        await (await getDatabasesClient()).getTransaction(transactionId),
    ),
  );

databases
  .command(`update-transaction`)
  .description(
    `Update a transaction, to either commit or roll back its operations.`,
  )
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
        await (
          await getDatabasesClient()
        ).updateTransaction(transactionId, commit, rollback),
    ),
  );

databases
  .command(`delete-transaction`)
  .description(`Delete a transaction by its unique ID.`)
  .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
  .action(
    actionRunner(
      async ({ transactionId }) =>
        await (await getDatabasesClient()).deleteTransaction(transactionId),
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
        await (
          await getDatabasesClient()
        ).createOperations(transactionId, operations),
    ),
  );

databases
  .command(`list-usage`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases listUsage' instead] List usage metrics and statistics for all databases in the project. You can view the total number of databases, collections, documents, and storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`,
  )
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ range }) =>
        await (await getDatabasesClient()).listUsage(range as UsageRange),
    ),
  );

databases
  .command(`get`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases get' instead] Get a database by its unique ID. This endpoint response returns a JSON object with the database metadata.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        await (await getDatabasesClient()).get(databaseId),
    ),
  );

databases
  .command(`update`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases update' instead] Update a database by its unique ID.`,
  )
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
        await (await getDatabasesClient()).update(databaseId, name, enabled),
    ),
  );

databases
  .command(`delete`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases delete' instead] Delete a database by its unique ID. Only API keys with with databases.write scope can delete a database.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        await (await getDatabasesClient()).delete(databaseId),
    ),
  );

databases
  .command(`list-collections`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases listCollections' instead] Get a list of all collections that belong to the provided databaseId. You can use the search parameter to filter your results.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, documentSecurity`,
  )
  .option(
    `--search <search>`,
    `Search term to filter your list results. Max length: 256 chars.`,
  )
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, queries, search, total }) =>
        await (
          await getDatabasesClient()
        ).listCollections(databaseId, queries, search, total),
    ),
  );

databases
  .command(`create-collection`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases createCollection' instead] Create a new Collection. Before using this route, you should create a new database resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Unique Id. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`,
  )
  .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
  .option(
    `--permissions [permissions...]`,
    `An array of permissions strings. By default, no user is granted with any permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`,
  )
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
  .option(
    `--attributes [attributes...]`,
    `Array of attribute definitions to create. Each attribute should contain: key (string), type (string: string, integer, float, boolean, datetime), size (integer, required for string type), required (boolean, optional), default (mixed, optional), array (boolean, optional), and type-specific options.`,
  )
  .option(
    `--indexes [indexes...]`,
    `Array of index definitions to create. Each index should contain: key (string), type (string: key, fulltext, unique, spatial), attributes (array of attribute keys), orders (array of ASC/DESC, optional), and lengths (array of integers, optional).`,
  )
  .action(
    actionRunner(
      async ({
        databaseId,
        collectionId,
        name,
        permissions,
        documentSecurity,
        enabled,
        attributes,
        indexes,
      }) =>
        await (
          await getDatabasesClient()
        ).createCollection(
          databaseId,
          collectionId,
          name,
          permissions,
          documentSecurity,
          enabled,
          attributes,
          indexes,
        ),
    ),
  );

databases
  .command(`get-collection`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases getCollection' instead] Get a collection by its unique ID. This endpoint response returns a JSON object with the collection metadata.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId }) =>
        await (
          await getDatabasesClient()
        ).getCollection(databaseId, collectionId),
    ),
  );

databases
  .command(`update-collection`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases updateCollection' instead] Update a collection by its unique ID.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
  .option(
    `--permissions [permissions...]`,
    `An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`,
  )
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
      async ({
        databaseId,
        collectionId,
        name,
        permissions,
        documentSecurity,
        enabled,
      }) =>
        await (
          await getDatabasesClient()
        ).updateCollection(
          databaseId,
          collectionId,
          name,
          permissions,
          documentSecurity,
          enabled,
        ),
    ),
  );

databases
  .command(`delete-collection`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases deleteCollection' instead] Delete a collection by its unique ID. Only users with write permissions have access to delete this resource.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId }) =>
        await (
          await getDatabasesClient()
        ).deleteCollection(databaseId, collectionId),
    ),
  );

databases
  .command(`list-attributes`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases listAttributes' instead] List attributes in the collection.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, size, required, array, status, error`,
  )
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, queries, total }) =>
        await (
          await getDatabasesClient()
        ).listAttributes(databaseId, collectionId, queries, total),
    ),
  );

databases
  .command(`create-boolean-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases createBooleanAttribute' instead] Create a boolean attribute.
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`,
  )
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(
    `--default [value]`,
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
      async ({ databaseId, collectionId, key, required, xDefault, array }) =>
        await (
          await getDatabasesClient()
        ).createBooleanAttribute(
          databaseId,
          collectionId,
          key,
          required,
          xDefault,
          array,
        ),
    ),
  );

databases
  .command(`update-boolean-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases updateBooleanAttribute' instead] Update a boolean attribute. Changing the \`default\` value will not update already existing documents.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#createCollection).`,
  )
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .requiredOption(
    `--default <default>`,
    `Default value for attribute when not provided. Cannot be set when attribute is required.`,
    parseBool,
  )
  .option(`--new-key <new-key>`, `New attribute key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xDefault, newKey }) =>
        await (
          await getDatabasesClient()
        ).updateBooleanAttribute(
          databaseId,
          collectionId,
          key,
          required,
          xDefault,
          newKey,
        ),
    ),
  );

databases
  .command(`create-datetime-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases createDatetimeAttribute' instead] Create a date time attribute according to the ISO 8601 standard.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#createCollection).`,
  )
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(
    `--default <default>`,
    `Default value for the attribute in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Cannot be set when attribute is required.`,
  )
  .option(
    `--array [value]`,
    `Is attribute an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xDefault, array }) =>
        await (
          await getDatabasesClient()
        ).createDatetimeAttribute(
          databaseId,
          collectionId,
          key,
          required,
          xDefault,
          array,
        ),
    ),
  );

databases
  .command(`update-datetime-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases updateDatetimeAttribute' instead] Update a date time attribute. Changing the \`default\` value will not update already existing documents.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .requiredOption(
    `--default <default>`,
    `Default value for attribute when not provided. Cannot be set when attribute is required.`,
  )
  .option(`--new-key <new-key>`, `New attribute key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xDefault, newKey }) =>
        await (
          await getDatabasesClient()
        ).updateDatetimeAttribute(
          databaseId,
          collectionId,
          key,
          required,
          xDefault,
          newKey,
        ),
    ),
  );

databases
  .command(`create-email-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases createEmailAttribute' instead] Create an email attribute.
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(
    `--default <default>`,
    `Default value for attribute when not provided. Cannot be set when attribute is required.`,
  )
  .option(
    `--array [value]`,
    `Is attribute an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xDefault, array }) =>
        await (
          await getDatabasesClient()
        ).createEmailAttribute(
          databaseId,
          collectionId,
          key,
          required,
          xDefault,
          array,
        ),
    ),
  );

databases
  .command(`update-email-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases updateEmailAttribute' instead] Update an email attribute. Changing the \`default\` value will not update already existing documents.
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .requiredOption(
    `--default <default>`,
    `Default value for attribute when not provided. Cannot be set when attribute is required.`,
  )
  .option(`--new-key <new-key>`, `New Attribute Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xDefault, newKey }) =>
        await (
          await getDatabasesClient()
        ).updateEmailAttribute(
          databaseId,
          collectionId,
          key,
          required,
          xDefault,
          newKey,
        ),
    ),
  );

databases
  .command(`create-enum-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases createEnumAttribute' instead] Create an enum attribute. The \`elements\` param acts as a white-list of accepted values for this attribute. 
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--elements [elements...]`, `Array of enum values.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(
    `--default <default>`,
    `Default value for attribute when not provided. Cannot be set when attribute is required.`,
  )
  .option(
    `--array [value]`,
    `Is attribute an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({
        databaseId,
        collectionId,
        key,
        elements,
        required,
        xDefault,
        array,
      }) =>
        await (
          await getDatabasesClient()
        ).createEnumAttribute(
          databaseId,
          collectionId,
          key,
          elements,
          required,
          xDefault,
          array,
        ),
    ),
  );

databases
  .command(`update-enum-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases updateEnumAttribute' instead] Update an enum attribute. Changing the \`default\` value will not update already existing documents.
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--elements [elements...]`, `Updated list of enum values.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .requiredOption(
    `--default <default>`,
    `Default value for attribute when not provided. Cannot be set when attribute is required.`,
  )
  .option(`--new-key <new-key>`, `New Attribute Key.`)
  .action(
    actionRunner(
      async ({
        databaseId,
        collectionId,
        key,
        elements,
        required,
        xDefault,
        newKey,
      }) =>
        await (
          await getDatabasesClient()
        ).updateEnumAttribute(
          databaseId,
          collectionId,
          key,
          elements,
          required,
          xDefault,
          newKey,
        ),
    ),
  );

databases
  .command(`create-float-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases createFloatAttribute' instead] Create a float attribute. Optionally, minimum and maximum values can be provided.
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--min <min>`, `Minimum value.`, parseInteger)
  .option(`--max <max>`, `Maximum value.`, parseInteger)
  .option(
    `--default <default>`,
    `Default value. Cannot be set when required.`,
    parseInteger,
  )
  .option(
    `--array [value]`,
    `Is attribute an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({
        databaseId,
        collectionId,
        key,
        required,
        min,
        max,
        xDefault,
        array,
      }) =>
        await (
          await getDatabasesClient()
        ).createFloatAttribute(
          databaseId,
          collectionId,
          key,
          required,
          min,
          max,
          xDefault,
          array,
        ),
    ),
  );

databases
  .command(`update-float-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases updateFloatAttribute' instead] Update a float attribute. Changing the \`default\` value will not update already existing documents.
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--min <min>`, `Minimum value.`, parseInteger)
  .option(`--max <max>`, `Maximum value.`, parseInteger)
  .requiredOption(
    `--default <default>`,
    `Default value. Cannot be set when required.`,
    parseInteger,
  )
  .option(`--new-key <new-key>`, `New Attribute Key.`)
  .action(
    actionRunner(
      async ({
        databaseId,
        collectionId,
        key,
        required,
        min,
        max,
        xDefault,
        newKey,
      }) =>
        await (
          await getDatabasesClient()
        ).updateFloatAttribute(
          databaseId,
          collectionId,
          key,
          required,
          min,
          max,
          xDefault,
          newKey,
        ),
    ),
  );

databases
  .command(`create-integer-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases createIntegerAttribute' instead] Create an integer attribute. Optionally, minimum and maximum values can be provided.
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--min <min>`, `Minimum value`, parseInteger)
  .option(`--max <max>`, `Maximum value`, parseInteger)
  .option(
    `--default <default>`,
    `Default value. Cannot be set when attribute is required.`,
    parseInteger,
  )
  .option(
    `--array [value]`,
    `Is attribute an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({
        databaseId,
        collectionId,
        key,
        required,
        min,
        max,
        xDefault,
        array,
      }) =>
        await (
          await getDatabasesClient()
        ).createIntegerAttribute(
          databaseId,
          collectionId,
          key,
          required,
          min,
          max,
          xDefault,
          array,
        ),
    ),
  );

databases
  .command(`update-integer-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases updateIntegerAttribute' instead] Update an integer attribute. Changing the \`default\` value will not update already existing documents.
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(`--min <min>`, `Minimum value`, parseInteger)
  .option(`--max <max>`, `Maximum value`, parseInteger)
  .requiredOption(
    `--default <default>`,
    `Default value. Cannot be set when attribute is required.`,
    parseInteger,
  )
  .option(`--new-key <new-key>`, `New Attribute Key.`)
  .action(
    actionRunner(
      async ({
        databaseId,
        collectionId,
        key,
        required,
        min,
        max,
        xDefault,
        newKey,
      }) =>
        await (
          await getDatabasesClient()
        ).updateIntegerAttribute(
          databaseId,
          collectionId,
          key,
          required,
          min,
          max,
          xDefault,
          newKey,
        ),
    ),
  );

databases
  .command(`create-ip-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases createIpAttribute' instead] Create IP address attribute.
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(
    `--default <default>`,
    `Default value. Cannot be set when attribute is required.`,
  )
  .option(
    `--array [value]`,
    `Is attribute an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xDefault, array }) =>
        await (
          await getDatabasesClient()
        ).createIpAttribute(
          databaseId,
          collectionId,
          key,
          required,
          xDefault,
          array,
        ),
    ),
  );

databases
  .command(`update-ip-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases updateIpAttribute' instead] Update an ip attribute. Changing the \`default\` value will not update already existing documents.
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .requiredOption(
    `--default <default>`,
    `Default value. Cannot be set when attribute is required.`,
  )
  .option(`--new-key <new-key>`, `New Attribute Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xDefault, newKey }) =>
        await (
          await getDatabasesClient()
        ).updateIpAttribute(
          databaseId,
          collectionId,
          key,
          required,
          xDefault,
          newKey,
        ),
    ),
  );

databases
  .command(`create-line-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases createLineAttribute' instead] Create a geometric line attribute.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`,
  )
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(
    `--default [default...]`,
    `Default value for attribute when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when attribute is required.`,
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xDefault }) =>
        await (
          await getDatabasesClient()
        ).createLineAttribute(
          databaseId,
          collectionId,
          key,
          required,
          xDefault,
        ),
    ),
  );

databases
  .command(`update-line-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases updateLineAttribute' instead] Update a line attribute. Changing the \`default\` value will not update already existing documents.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#createCollection).`,
  )
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(
    `--default [default...]`,
    `Default value for attribute when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when attribute is required.`,
  )
  .option(`--new-key <new-key>`, `New attribute key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xDefault, newKey }) =>
        await (
          await getDatabasesClient()
        ).updateLineAttribute(
          databaseId,
          collectionId,
          key,
          required,
          xDefault,
          newKey,
        ),
    ),
  );

databases
  .command(`create-point-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases createPointAttribute' instead] Create a geometric point attribute.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`,
  )
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(
    `--default [default...]`,
    `Default value for attribute when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when attribute is required.`,
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xDefault }) =>
        await (
          await getDatabasesClient()
        ).createPointAttribute(
          databaseId,
          collectionId,
          key,
          required,
          xDefault,
        ),
    ),
  );

databases
  .command(`update-point-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases updatePointAttribute' instead] Update a point attribute. Changing the \`default\` value will not update already existing documents.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#createCollection).`,
  )
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(
    `--default [default...]`,
    `Default value for attribute when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when attribute is required.`,
  )
  .option(`--new-key <new-key>`, `New attribute key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xDefault, newKey }) =>
        await (
          await getDatabasesClient()
        ).updatePointAttribute(
          databaseId,
          collectionId,
          key,
          required,
          xDefault,
          newKey,
        ),
    ),
  );

databases
  .command(`create-polygon-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases createPolygonAttribute' instead] Create a geometric polygon attribute.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`,
  )
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(
    `--default [default...]`,
    `Default value for attribute when not provided, three-dimensional array where the outer array holds one or more linear rings, [[[longitude, latitude], …], …], the first ring is the exterior boundary, any additional rings are interior holes, and each ring must start and end with the same coordinate pair. Cannot be set when attribute is required.`,
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xDefault }) =>
        await (
          await getDatabasesClient()
        ).createPolygonAttribute(
          databaseId,
          collectionId,
          key,
          required,
          xDefault,
        ),
    ),
  );

databases
  .command(`update-polygon-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases updatePolygonAttribute' instead] Update a polygon attribute. Changing the \`default\` value will not update already existing documents.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#createCollection).`,
  )
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(
    `--default [default...]`,
    `Default value for attribute when not provided, three-dimensional array where the outer array holds one or more linear rings, [[[longitude, latitude], …], …], the first ring is the exterior boundary, any additional rings are interior holes, and each ring must start and end with the same coordinate pair. Cannot be set when attribute is required.`,
  )
  .option(`--new-key <new-key>`, `New attribute key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xDefault, newKey }) =>
        await (
          await getDatabasesClient()
        ).updatePolygonAttribute(
          databaseId,
          collectionId,
          key,
          required,
          xDefault,
          newKey,
        ),
    ),
  );

databases
  .command(`create-relationship-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases createRelationshipAttribute' instead] Create relationship attribute. [Learn more about relationship attributes](https://appwrite.io/docs/databases-relationships#relationship-attributes).
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(
    `--related-collection-id <related-collection-id>`,
    `Related Collection ID.`,
  )
  .requiredOption(`--type <type>`, `Relation type`)
  .option(`--two-way [value]`, `Is Two Way?`, (value: string | undefined) =>
    value === undefined ? true : parseBool(value),
  )
  .option(`--key <key>`, `Attribute Key.`)
  .option(`--two-way-key <two-way-key>`, `Two Way Attribute Key.`)
  .option(`--on-delete <on-delete>`, `Constraints option`)
  .action(
    actionRunner(
      async ({
        databaseId,
        collectionId,
        relatedCollectionId,
        xType,
        twoWay,
        key,
        twoWayKey,
        onDelete,
      }) =>
        await (
          await getDatabasesClient()
        ).createRelationshipAttribute(
          databaseId,
          collectionId,
          relatedCollectionId,
          xType as RelationshipType,
          twoWay,
          key,
          twoWayKey,
          onDelete as RelationMutate,
        ),
    ),
  );

databases
  .command(`create-string-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases createStringAttribute' instead] Create a string attribute.
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`,
  )
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(
    `--size <size>`,
    `Attribute size for text attributes, in number of characters.`,
    parseInteger,
  )
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(
    `--default <default>`,
    `Default value for attribute when not provided. Cannot be set when attribute is required.`,
  )
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
      async ({
        databaseId,
        collectionId,
        key,
        size,
        required,
        xDefault,
        array,
        encrypt,
      }) =>
        await (
          await getDatabasesClient()
        ).createStringAttribute(
          databaseId,
          collectionId,
          key,
          size,
          required,
          xDefault,
          array,
          encrypt,
        ),
    ),
  );

databases
  .command(`update-string-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases updateStringAttribute' instead] Update a string attribute. Changing the \`default\` value will not update already existing documents.
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`,
  )
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .requiredOption(
    `--default <default>`,
    `Default value for attribute when not provided. Cannot be set when attribute is required.`,
  )
  .option(
    `--size <size>`,
    `Maximum size of the string attribute.`,
    parseInteger,
  )
  .option(`--new-key <new-key>`, `New Attribute Key.`)
  .action(
    actionRunner(
      async ({
        databaseId,
        collectionId,
        key,
        required,
        xDefault,
        size,
        newKey,
      }) =>
        await (
          await getDatabasesClient()
        ).updateStringAttribute(
          databaseId,
          collectionId,
          key,
          required,
          xDefault,
          size,
          newKey,
        ),
    ),
  );

databases
  .command(`create-url-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases createUrlAttribute' instead] Create a URL attribute.
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .option(
    `--default <default>`,
    `Default value for attribute when not provided. Cannot be set when attribute is required.`,
  )
  .option(
    `--array [value]`,
    `Is attribute an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xDefault, array }) =>
        await (
          await getDatabasesClient()
        ).createUrlAttribute(
          databaseId,
          collectionId,
          key,
          required,
          xDefault,
          array,
        ),
    ),
  );

databases
  .command(`update-url-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases updateUrlAttribute' instead] Update an url attribute. Changing the \`default\` value will not update already existing documents.
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .requiredOption(`--required <required>`, `Is attribute required?`, parseBool)
  .requiredOption(
    `--default <default>`,
    `Default value for attribute when not provided. Cannot be set when attribute is required.`,
  )
  .option(`--new-key <new-key>`, `New Attribute Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, required, xDefault, newKey }) =>
        await (
          await getDatabasesClient()
        ).updateUrlAttribute(
          databaseId,
          collectionId,
          key,
          required,
          xDefault,
          newKey,
        ),
    ),
  );

databases
  .command(`get-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases getAttribute' instead] Get attribute by ID.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key }) =>
        await (
          await getDatabasesClient()
        ).getAttribute(databaseId, collectionId, key),
    ),
  );

databases
  .command(`delete-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases deleteAttribute' instead] Deletes an attribute.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key }) =>
        await (
          await getDatabasesClient()
        ).deleteAttribute(databaseId, collectionId, key),
    ),
  );

databases
  .command(`update-relationship-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases updateRelationshipAttribute' instead] Update relationship attribute. [Learn more about relationship attributes](https://appwrite.io/docs/databases-relationships#relationship-attributes).
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--key <key>`, `Attribute Key.`)
  .option(`--on-delete <on-delete>`, `Constraints option`)
  .option(`--new-key <new-key>`, `New Attribute Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key, onDelete, newKey }) =>
        await (
          await getDatabasesClient()
        ).updateRelationshipAttribute(
          databaseId,
          collectionId,
          key,
          onDelete as RelationMutate,
          newKey,
        ),
    ),
  );

databases
  .command(`list-documents`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases listDocuments' instead] Get a list of all the user's documents in a given collection. You can use the query params to filter your results.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`,
  )
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`,
  )
  .option(
    `--transaction-id <transaction-id>`,
    `Transaction ID to read uncommitted changes within the transaction.`,
  )
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, queries, transactionId, total }) =>
        await (
          await getDatabasesClient()
        ).listDocuments(
          databaseId,
          collectionId,
          queries,
          transactionId,
          total,
        ),
    ),
  );

databases
  .command(`create-document`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases createDocument' instead] Create a new Document. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.`,
  )
  .requiredOption(
    `--document-id <document-id>`,
    `Document ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`,
  )
  .requiredOption(`--data <data>`, `Document data as JSON object.`)
  .option(
    `--permissions [permissions...]`,
    `An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`,
  )
  .option(
    `--transaction-id <transaction-id>`,
    `Transaction ID for staging the operation.`,
  )
  .action(
    actionRunner(
      async ({
        databaseId,
        collectionId,
        documentId,
        data,
        permissions,
        transactionId,
      }) =>
        await (
          await getDatabasesClient()
        ).createDocument(
          databaseId,
          collectionId,
          documentId,
          JSON.parse(data),
          permissions,
          transactionId,
        ),
    ),
  );

databases
  .command(`upsert-documents`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases upsertDocuments' instead] Create or update Documents. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.
`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(
    `--documents [documents...]`,
    `Array of document data as JSON objects. May contain partial documents.`,
  )
  .option(
    `--transaction-id <transaction-id>`,
    `Transaction ID for staging the operation.`,
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documents, transactionId }) =>
        await (
          await getDatabasesClient()
        ).upsertDocuments(databaseId, collectionId, documents, transactionId),
    ),
  );

databases
  .command(`update-documents`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases updateDocuments' instead] Update all documents that match your queries, if no queries are submitted then all documents are updated. You can pass only specific fields to be updated.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .option(
    `--data <data>`,
    `Document data as JSON object. Include only attribute and value pairs to be updated.`,
  )
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`,
  )
  .option(
    `--transaction-id <transaction-id>`,
    `Transaction ID for staging the operation.`,
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, data, queries, transactionId }) =>
        await (
          await getDatabasesClient()
        ).updateDocuments(
          databaseId,
          collectionId,
          JSON.parse(data),
          queries,
          transactionId,
        ),
    ),
  );

databases
  .command(`delete-documents`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases deleteDocuments' instead] Bulk delete documents using queries, if no queries are passed then all documents are deleted.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`,
  )
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`,
  )
  .option(
    `--transaction-id <transaction-id>`,
    `Transaction ID for staging the operation.`,
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, queries, transactionId }) =>
        await (
          await getDatabasesClient()
        ).deleteDocuments(databaseId, collectionId, queries, transactionId),
    ),
  );

databases
  .command(`get-document`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases getDocument' instead] Get a document by its unique ID. This endpoint response returns a JSON object with the document data.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`,
  )
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`,
  )
  .option(
    `--transaction-id <transaction-id>`,
    `Transaction ID to read uncommitted changes within the transaction.`,
  )
  .action(
    actionRunner(
      async ({
        databaseId,
        collectionId,
        documentId,
        queries,
        transactionId,
      }) =>
        await (
          await getDatabasesClient()
        ).getDocument(
          databaseId,
          collectionId,
          documentId,
          queries,
          transactionId,
        ),
    ),
  );

databases
  .command(`upsert-document`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases upsertDocument' instead] Create or update a Document. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(
    `--data <data>`,
    `Document data as JSON object. Include all required attributes of the document to be created or updated.`,
  )
  .option(
    `--permissions [permissions...]`,
    `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`,
  )
  .option(
    `--transaction-id <transaction-id>`,
    `Transaction ID for staging the operation.`,
  )
  .action(
    actionRunner(
      async ({
        databaseId,
        collectionId,
        documentId,
        data,
        permissions,
        transactionId,
      }) =>
        await (
          await getDatabasesClient()
        ).upsertDocument(
          databaseId,
          collectionId,
          documentId,
          JSON.parse(data),
          permissions,
          transactionId,
        ),
    ),
  );

databases
  .command(`update-document`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases updateDocument' instead] Update a document by its unique ID. Using the patch method you can pass only specific fields that will get updated.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(
    `--data <data>`,
    `Document data as JSON object. Include only attribute and value pairs to be updated.`,
  )
  .option(
    `--permissions [permissions...]`,
    `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`,
  )
  .option(
    `--transaction-id <transaction-id>`,
    `Transaction ID for staging the operation.`,
  )
  .action(
    actionRunner(
      async ({
        databaseId,
        collectionId,
        documentId,
        data,
        permissions,
        transactionId,
      }) =>
        await (
          await getDatabasesClient()
        ).updateDocument(
          databaseId,
          collectionId,
          documentId,
          JSON.parse(data),
          permissions,
          transactionId,
        ),
    ),
  );

databases
  .command(`delete-document`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases deleteDocument' instead] Delete a document by its unique ID.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`,
  )
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(
    `--transaction-id <transaction-id>`,
    `Transaction ID for staging the operation.`,
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, transactionId }) =>
        await (
          await getDatabasesClient()
        ).deleteDocument(databaseId, collectionId, documentId, transactionId),
    ),
  );

databases
  .command(`list-document-logs`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases listDocumentLogs' instead] Get the document activity logs list by its unique ID.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`,
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, documentId, queries }) =>
        await (
          await getDatabasesClient()
        ).listDocumentLogs(databaseId, collectionId, documentId, queries),
    ),
  );

databases
  .command(`decrement-document-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases decrementDocumentAttribute' instead] Decrement a specific attribute of a document by a given value.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .requiredOption(`--attribute <attribute>`, `Attribute key.`)
  .option(
    `--value <value>`,
    `Value to increment the attribute by. The value must be a number.`,
    parseInteger,
  )
  .option(
    `--min <min>`,
    `Minimum value for the attribute. If the current value is lesser than this value, an exception will be thrown.`,
    parseInteger,
  )
  .option(
    `--transaction-id <transaction-id>`,
    `Transaction ID for staging the operation.`,
  )
  .action(
    actionRunner(
      async ({
        databaseId,
        collectionId,
        documentId,
        attribute,
        value,
        min,
        transactionId,
      }) =>
        await (
          await getDatabasesClient()
        ).decrementDocumentAttribute(
          databaseId,
          collectionId,
          documentId,
          attribute,
          value,
          min,
          transactionId,
        ),
    ),
  );

databases
  .command(`increment-document-attribute`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases incrementDocumentAttribute' instead] Increment a specific attribute of a document by a given value.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .requiredOption(`--document-id <document-id>`, `Document ID.`)
  .requiredOption(`--attribute <attribute>`, `Attribute key.`)
  .option(
    `--value <value>`,
    `Value to increment the attribute by. The value must be a number.`,
    parseInteger,
  )
  .option(
    `--max <max>`,
    `Maximum value for the attribute. If the current value is greater than this value, an error will be thrown.`,
    parseInteger,
  )
  .option(
    `--transaction-id <transaction-id>`,
    `Transaction ID for staging the operation.`,
  )
  .action(
    actionRunner(
      async ({
        databaseId,
        collectionId,
        documentId,
        attribute,
        value,
        max,
        transactionId,
      }) =>
        await (
          await getDatabasesClient()
        ).incrementDocumentAttribute(
          databaseId,
          collectionId,
          documentId,
          attribute,
          value,
          max,
          transactionId,
        ),
    ),
  );

databases
  .command(`list-indexes`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases listIndexes' instead] List indexes in the collection.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`,
  )
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, status, attributes, error`,
  )
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, queries, total }) =>
        await (
          await getDatabasesClient()
        ).listIndexes(databaseId, collectionId, queries, total),
    ),
  );

databases
  .command(`create-index`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases createIndex' instead] Creates an index on the attributes listed. Your index should include all the attributes you will query in a single request.
Attributes can be \`key\`, \`fulltext\`, and \`unique\`.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`,
  )
  .requiredOption(`--key <key>`, `Index Key.`)
  .requiredOption(`--type <type>`, `Index type.`)
  .requiredOption(
    `--attributes [attributes...]`,
    `Array of attributes to index. Maximum of 100 attributes are allowed, each 32 characters long.`,
  )
  .option(
    `--orders [orders...]`,
    `Array of index orders. Maximum of 100 orders are allowed.`,
  )
  .option(`--lengths [lengths...]`, `Length of index. Maximum of 100`)
  .action(
    actionRunner(
      async ({
        databaseId,
        collectionId,
        key,
        xType,
        attributes,
        orders,
        lengths,
      }) =>
        await (
          await getDatabasesClient()
        ).createIndex(
          databaseId,
          collectionId,
          key,
          xType as IndexType,
          attributes,
          orders,
          lengths,
        ),
    ),
  );

databases
  .command(`get-index`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases getIndex' instead] Get an index by its unique ID.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`,
  )
  .requiredOption(`--key <key>`, `Index Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key }) =>
        await (
          await getDatabasesClient()
        ).getIndex(databaseId, collectionId, key),
    ),
  );

databases
  .command(`delete-index`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases deleteIndex' instead] Delete an index.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(
    `--collection-id <collection-id>`,
    `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`,
  )
  .requiredOption(`--key <key>`, `Index Key.`)
  .action(
    actionRunner(
      async ({ databaseId, collectionId, key }) =>
        await (
          await getDatabasesClient()
        ).deleteIndex(databaseId, collectionId, key),
    ),
  );

databases
  .command(`list-collection-logs`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases listCollectionLogs' instead] Get the collection activity logs list by its unique ID.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`,
  )
  .action(
    actionRunner(
      async ({ databaseId, collectionId, queries }) =>
        await (
          await getDatabasesClient()
        ).listCollectionLogs(databaseId, collectionId, queries),
    ),
  );

databases
  .command(`get-collection-usage`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases getCollectionUsage' instead] Get usage metrics and statistics for a collection. Returning the total number of documents. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--range <range>`, `Date range.`)
  .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
  .action(
    actionRunner(
      async ({ databaseId, range, collectionId }) =>
        await (
          await getDatabasesClient()
        ).getCollectionUsage(databaseId, range as UsageRange, collectionId),
    ),
  );

databases
  .command(`list-logs`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases listLogs' instead] Get the database activity logs list by its unique ID.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`,
  )
  .action(
    actionRunner(
      async ({ databaseId, queries }) =>
        await (await getDatabasesClient()).listLogs(databaseId, queries),
    ),
  );

databases
  .command(`get-usage`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'databases getUsage' instead] Get usage metrics and statistics for a database. You can view the total number of collections, documents, and storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`,
  )
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ databaseId, range }) =>
        await (
          await getDatabasesClient()
        ).getUsage(databaseId, range as UsageRange),
    ),
  );
