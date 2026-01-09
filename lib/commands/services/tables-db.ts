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
import {
  TablesDB,
  UsageRange,
  RelationshipType,
  RelationMutate,
  IndexType,
} from "@appwrite.io/console";

let tablesDBClient: TablesDB | null = null;

const getTablesDBClient = async (): Promise<TablesDB> => {
  if (!tablesDBClient) {
    const sdkClient = await sdkForProject();
    tablesDBClient = new TablesDB(sdkClient);
  }
  return tablesDBClient;
};

export const tablesDB = new Command("tables-db")
  .description(commandDescriptions["tablesDB"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

tablesDB
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
        parse(await (await getTablesDBClient()).list(queries, search, total)),
    ),
  );

tablesDB
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
        parse(await (await getTablesDBClient()).create(databaseId, name, enabled)),
    ),
  );

tablesDB
  .command(`list-transactions`)
  .description(`List transactions across all databases.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries).`)
  .action(
    actionRunner(
      async ({ queries }) =>
        parse(await (await getTablesDBClient()).listTransactions(queries)),
    ),
  );

tablesDB
  .command(`create-transaction`)
  .description(`Create a new transaction.`)
  .option(`--ttl <ttl>`, `Seconds before the transaction expires.`, parseInteger)
  .action(
    actionRunner(
      async ({ ttl }) =>
        parse(await (await getTablesDBClient()).createTransaction(ttl)),
    ),
  );

tablesDB
  .command(`get-transaction`)
  .description(`Get a transaction by its unique ID.`)
  .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
  .action(
    actionRunner(
      async ({ transactionId }) =>
        parse(await (await getTablesDBClient()).getTransaction(transactionId)),
    ),
  );

tablesDB
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
        parse(await (await getTablesDBClient()).updateTransaction(transactionId, commit, rollback)),
    ),
  );

tablesDB
  .command(`delete-transaction`)
  .description(`Delete a transaction by its unique ID.`)
  .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
  .action(
    actionRunner(
      async ({ transactionId }) =>
        parse(await (await getTablesDBClient()).deleteTransaction(transactionId)),
    ),
  );

tablesDB
  .command(`create-operations`)
  .description(`Create multiple operations in a single transaction.`)
  .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
  .option(`--operations [operations...]`, `Array of staged operations.`)
  .action(
    actionRunner(
      async ({ transactionId, operations }) =>
        parse(await (await getTablesDBClient()).createOperations(transactionId, operations)),
    ),
  );

tablesDB
  .command(`list-usage`)
  .description(`List usage metrics and statistics for all databases in the project. You can view the total number of databases, tables, rows, and storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ range }) =>
        parse(await (await getTablesDBClient()).listUsage(range as UsageRange)),
    ),
  );

tablesDB
  .command(`get`)
  .description(`Get a database by its unique ID. This endpoint response returns a JSON object with the database metadata.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getTablesDBClient()).get(databaseId)),
    ),
  );

tablesDB
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
        parse(await (await getTablesDBClient()).update(databaseId, name, enabled)),
    ),
  );

tablesDB
  .command(`delete`)
  .description(`Delete a database by its unique ID. Only API keys with with databases.write scope can delete a database.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getTablesDBClient()).delete(databaseId)),
    ),
  );

tablesDB
  .command(`list-tables`)
  .description(`Get a list of all tables that belong to the provided databaseId. You can use the search parameter to filter your results.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: name, enabled, rowSecurity`)
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
        parse(await (await getTablesDBClient()).listTables(databaseId, queries, search, total)),
    ),
  );

tablesDB
  .command(`create-table`)
  .description(`Create a new Table. Before using this route, you should create a new database resource using either a [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Unique Id. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Table name. Max length: 128 chars.`)
  .option(`--permissions [permissions...]`, `An array of permissions strings. By default, no user is granted with any permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .option(
    `--row-security [value]`,
    `Enables configuring permissions for individual rows. A user needs one of row or table level permissions to access a row. [Learn more about permissions](https://appwrite.io/docs/permissions).`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--enabled [value]`,
    `Is table enabled? When set to 'disabled', users cannot access the table but Server SDKs with and API key can still read and write to the table. No data is lost when this is toggled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--columns [columns...]`, `Array of column definitions to create. Each column should contain: key (string), type (string: string, integer, float, boolean, datetime, relationship), size (integer, required for string type), required (boolean, optional), default (mixed, optional), array (boolean, optional), and type-specific options.`)
  .option(`--indexes [indexes...]`, `Array of index definitions to create. Each index should contain: key (string), type (string: key, fulltext, unique, spatial), attributes (array of column keys), orders (array of ASC/DESC, optional), and lengths (array of integers, optional).`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, name, permissions, rowSecurity, enabled, columns, indexes }) =>
        parse(await (await getTablesDBClient()).createTable(databaseId, tableId, name, permissions, rowSecurity, enabled, columns, indexes)),
    ),
  );

tablesDB
  .command(`get-table`)
  .description(`Get a table by its unique ID. This endpoint response returns a JSON object with the table metadata.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId }) =>
        parse(await (await getTablesDBClient()).getTable(databaseId, tableId)),
    ),
  );

tablesDB
  .command(`update-table`)
  .description(`Update a table by its unique ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--name <name>`, `Table name. Max length: 128 chars.`)
  .option(`--permissions [permissions...]`, `An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .option(
    `--row-security [value]`,
    `Enables configuring permissions for individual rows. A user needs one of row or table-level permissions to access a row. [Learn more about permissions](https://appwrite.io/docs/permissions).`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--enabled [value]`,
    `Is table enabled? When set to 'disabled', users cannot access the table but Server SDKs with and API key can still read and write to the table. No data is lost when this is toggled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, tableId, name, permissions, rowSecurity, enabled }) =>
        parse(await (await getTablesDBClient()).updateTable(databaseId, tableId, name, permissions, rowSecurity, enabled)),
    ),
  );

tablesDB
  .command(`delete-table`)
  .description(`Delete a table by its unique ID. Only users with write permissions have access to delete this resource.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId }) =>
        parse(await (await getTablesDBClient()).deleteTable(databaseId, tableId)),
    ),
  );

tablesDB
  .command(`list-columns`)
  .description(`List columns in the table.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: key, type, size, required, array, status, error`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, tableId, queries, total }) =>
        parse(await (await getTablesDBClient()).listColumns(databaseId, tableId, queries, total)),
    ),
  );

tablesDB
  .command(`create-boolean-column`)
  .description(`Create a boolean column.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .option(
    `--xdefault [value]`,
    `Default value for column when not provided. Cannot be set when column is required.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--array [value]`,
    `Is column an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault, array }) =>
        parse(await (await getTablesDBClient()).createBooleanColumn(databaseId, tableId, key, required, xdefault, array)),
    ),
  );

tablesDB
  .command(`update-boolean-column`)
  .description(`Update a boolean column. Changing the \`default\` value will not update already existing rows.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`, parseBool)
  .option(`--new-key <new-key>`, `New Column Key.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault, newKey }) =>
        parse(await (await getTablesDBClient()).updateBooleanColumn(databaseId, tableId, key, required, xdefault, newKey)),
    ),
  );

tablesDB
  .command(`create-datetime-column`)
  .description(`Create a date time column according to the ISO 8601 standard.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .option(`--xdefault <xdefault>`, `Default value for the column in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Cannot be set when column is required.`)
  .option(
    `--array [value]`,
    `Is column an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault, array }) =>
        parse(await (await getTablesDBClient()).createDatetimeColumn(databaseId, tableId, key, required, xdefault, array)),
    ),
  );

tablesDB
  .command(`update-datetime-column`)
  .description(`Update a date time column. Changing the \`default\` value will not update already existing rows.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
  .option(`--new-key <new-key>`, `New Column Key.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault, newKey }) =>
        parse(await (await getTablesDBClient()).updateDatetimeColumn(databaseId, tableId, key, required, xdefault, newKey)),
    ),
  );

tablesDB
  .command(`create-email-column`)
  .description(`Create an email column.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
  .option(
    `--array [value]`,
    `Is column an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault, array }) =>
        parse(await (await getTablesDBClient()).createEmailColumn(databaseId, tableId, key, required, xdefault, array)),
    ),
  );

tablesDB
  .command(`update-email-column`)
  .description(`Update an email column. Changing the \`default\` value will not update already existing rows.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
  .option(`--new-key <new-key>`, `New Column Key.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault, newKey }) =>
        parse(await (await getTablesDBClient()).updateEmailColumn(databaseId, tableId, key, required, xdefault, newKey)),
    ),
  );

tablesDB
  .command(`create-enum-column`)
  .description(`Create an enumeration column. The \`elements\` param acts as a white-list of accepted values for this column.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--elements [elements...]`, `Array of enum values.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
  .option(
    `--array [value]`,
    `Is column an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, elements, required, xdefault, array }) =>
        parse(await (await getTablesDBClient()).createEnumColumn(databaseId, tableId, key, elements, required, xdefault, array)),
    ),
  );

tablesDB
  .command(`update-enum-column`)
  .description(`Update an enum column. Changing the \`default\` value will not update already existing rows.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--elements [elements...]`, `Updated list of enum values.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
  .option(`--new-key <new-key>`, `New Column Key.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, elements, required, xdefault, newKey }) =>
        parse(await (await getTablesDBClient()).updateEnumColumn(databaseId, tableId, key, elements, required, xdefault, newKey)),
    ),
  );

tablesDB
  .command(`create-float-column`)
  .description(`Create a float column. Optionally, minimum and maximum values can be provided.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .option(`--min <min>`, `Minimum value`, parseInteger)
  .option(`--max <max>`, `Maximum value`, parseInteger)
  .option(`--xdefault <xdefault>`, `Default value. Cannot be set when required.`, parseInteger)
  .option(
    `--array [value]`,
    `Is column an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, min, max, xdefault, array }) =>
        parse(await (await getTablesDBClient()).createFloatColumn(databaseId, tableId, key, required, min, max, xdefault, array)),
    ),
  );

tablesDB
  .command(`update-float-column`)
  .description(`Update a float column. Changing the \`default\` value will not update already existing rows.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value. Cannot be set when required.`, parseInteger)
  .option(`--min <min>`, `Minimum value`, parseInteger)
  .option(`--max <max>`, `Maximum value`, parseInteger)
  .option(`--new-key <new-key>`, `New Column Key.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault, min, max, newKey }) =>
        parse(await (await getTablesDBClient()).updateFloatColumn(databaseId, tableId, key, required, xdefault, min, max, newKey)),
    ),
  );

tablesDB
  .command(`create-integer-column`)
  .description(`Create an integer column. Optionally, minimum and maximum values can be provided.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .option(`--min <min>`, `Minimum value`, parseInteger)
  .option(`--max <max>`, `Maximum value`, parseInteger)
  .option(`--xdefault <xdefault>`, `Default value. Cannot be set when column is required.`, parseInteger)
  .option(
    `--array [value]`,
    `Is column an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, min, max, xdefault, array }) =>
        parse(await (await getTablesDBClient()).createIntegerColumn(databaseId, tableId, key, required, min, max, xdefault, array)),
    ),
  );

tablesDB
  .command(`update-integer-column`)
  .description(`Update an integer column. Changing the \`default\` value will not update already existing rows.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value. Cannot be set when column is required.`, parseInteger)
  .option(`--min <min>`, `Minimum value`, parseInteger)
  .option(`--max <max>`, `Maximum value`, parseInteger)
  .option(`--new-key <new-key>`, `New Column Key.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault, min, max, newKey }) =>
        parse(await (await getTablesDBClient()).updateIntegerColumn(databaseId, tableId, key, required, xdefault, min, max, newKey)),
    ),
  );

tablesDB
  .command(`create-ip-column`)
  .description(`Create IP address column.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .option(`--xdefault <xdefault>`, `Default value. Cannot be set when column is required.`)
  .option(
    `--array [value]`,
    `Is column an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault, array }) =>
        parse(await (await getTablesDBClient()).createIpColumn(databaseId, tableId, key, required, xdefault, array)),
    ),
  );

tablesDB
  .command(`update-ip-column`)
  .description(`Update an ip column. Changing the \`default\` value will not update already existing rows.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value. Cannot be set when column is required.`)
  .option(`--new-key <new-key>`, `New Column Key.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault, newKey }) =>
        parse(await (await getTablesDBClient()).updateIpColumn(databaseId, tableId, key, required, xdefault, newKey)),
    ),
  );

tablesDB
  .command(`create-line-column`)
  .description(`Create a geometric line column.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .option(`--xdefault [xdefault...]`, `Default value for column when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when column is required.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault }) =>
        parse(await (await getTablesDBClient()).createLineColumn(databaseId, tableId, key, required, xdefault)),
    ),
  );

tablesDB
  .command(`update-line-column`)
  .description(`Update a line column. Changing the \`default\` value will not update already existing rows.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .option(`--xdefault [xdefault...]`, `Default value for column when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when column is required.`)
  .option(`--new-key <new-key>`, `New Column Key.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault, newKey }) =>
        parse(await (await getTablesDBClient()).updateLineColumn(databaseId, tableId, key, required, xdefault, newKey)),
    ),
  );

tablesDB
  .command(`create-point-column`)
  .description(`Create a geometric point column.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .option(`--xdefault [xdefault...]`, `Default value for column when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when column is required.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault }) =>
        parse(await (await getTablesDBClient()).createPointColumn(databaseId, tableId, key, required, xdefault)),
    ),
  );

tablesDB
  .command(`update-point-column`)
  .description(`Update a point column. Changing the \`default\` value will not update already existing rows.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .option(`--xdefault [xdefault...]`, `Default value for column when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when column is required.`)
  .option(`--new-key <new-key>`, `New Column Key.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault, newKey }) =>
        parse(await (await getTablesDBClient()).updatePointColumn(databaseId, tableId, key, required, xdefault, newKey)),
    ),
  );

tablesDB
  .command(`create-polygon-column`)
  .description(`Create a geometric polygon column.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .option(`--xdefault [xdefault...]`, `Default value for column when not provided, three-dimensional array where the outer array holds one or more linear rings, [[[longitude, latitude], …], …], the first ring is the exterior boundary, any additional rings are interior holes, and each ring must start and end with the same coordinate pair. Cannot be set when column is required.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault }) =>
        parse(await (await getTablesDBClient()).createPolygonColumn(databaseId, tableId, key, required, xdefault)),
    ),
  );

tablesDB
  .command(`update-polygon-column`)
  .description(`Update a polygon column. Changing the \`default\` value will not update already existing rows.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .option(`--xdefault [xdefault...]`, `Default value for column when not provided, three-dimensional array where the outer array holds one or more linear rings, [[[longitude, latitude], …], …], the first ring is the exterior boundary, any additional rings are interior holes, and each ring must start and end with the same coordinate pair. Cannot be set when column is required.`)
  .option(`--new-key <new-key>`, `New Column Key.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault, newKey }) =>
        parse(await (await getTablesDBClient()).updatePolygonColumn(databaseId, tableId, key, required, xdefault, newKey)),
    ),
  );

tablesDB
  .command(`create-relationship-column`)
  .description(`Create relationship column. [Learn more about relationship columns](https://appwrite.io/docs/databases-relationships#relationship-columns).
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--related-table-id <related-table-id>`, `Related Table ID.`)
  .requiredOption(`--type <type>`, `Relation type`)
  .option(
    `--two-way [value]`,
    `Is Two Way?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--key <key>`, `Column Key.`)
  .option(`--two-way-key <two-way-key>`, `Two Way Column Key.`)
  .option(`--on-delete <on-delete>`, `Constraints option`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, relatedTableId, type, twoWay, key, twoWayKey, onDelete }) =>
        parse(await (await getTablesDBClient()).createRelationshipColumn(databaseId, tableId, relatedTableId, type as RelationshipType, twoWay, key, twoWayKey, onDelete as RelationMutate)),
    ),
  );

tablesDB
  .command(`create-string-column`)
  .description(`Create a string column.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--size <size>`, `Column size for text columns, in number of characters.`, parseInteger)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
  .option(
    `--array [value]`,
    `Is column an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--encrypt [value]`,
    `Toggle encryption for the column. Encryption enhances security by not storing any plain text values in the database. However, encrypted columns cannot be queried.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, size, required, xdefault, array, encrypt }) =>
        parse(await (await getTablesDBClient()).createStringColumn(databaseId, tableId, key, size, required, xdefault, array, encrypt)),
    ),
  );

tablesDB
  .command(`update-string-column`)
  .description(`Update a string column. Changing the \`default\` value will not update already existing rows.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
  .option(`--size <size>`, `Maximum size of the string column.`, parseInteger)
  .option(`--new-key <new-key>`, `New Column Key.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault, size, newKey }) =>
        parse(await (await getTablesDBClient()).updateStringColumn(databaseId, tableId, key, required, xdefault, size, newKey)),
    ),
  );

tablesDB
  .command(`create-url-column`)
  .description(`Create a URL column.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .option(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
  .option(
    `--array [value]`,
    `Is column an array?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault, array }) =>
        parse(await (await getTablesDBClient()).createUrlColumn(databaseId, tableId, key, required, xdefault, array)),
    ),
  );

tablesDB
  .command(`update-url-column`)
  .description(`Update an url column. Changing the \`default\` value will not update already existing rows.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .requiredOption(`--required <required>`, `Is column required?`, parseBool)
  .requiredOption(`--xdefault <xdefault>`, `Default value for column when not provided. Cannot be set when column is required.`)
  .option(`--new-key <new-key>`, `New Column Key.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, required, xdefault, newKey }) =>
        parse(await (await getTablesDBClient()).updateUrlColumn(databaseId, tableId, key, required, xdefault, newKey)),
    ),
  );

tablesDB
  .command(`get-column`)
  .description(`Get column by ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key }) =>
        parse(await (await getTablesDBClient()).getColumn(databaseId, tableId, key)),
    ),
  );

tablesDB
  .command(`delete-column`)
  .description(`Deletes a column.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key }) =>
        parse(await (await getTablesDBClient()).deleteColumn(databaseId, tableId, key)),
    ),
  );

tablesDB
  .command(`update-relationship-column`)
  .description(`Update relationship column. [Learn more about relationship columns](https://appwrite.io/docs/databases-relationships#relationship-columns).
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--key <key>`, `Column Key.`)
  .option(`--on-delete <on-delete>`, `Constraints option`)
  .option(`--new-key <new-key>`, `New Column Key.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, onDelete, newKey }) =>
        parse(await (await getTablesDBClient()).updateRelationshipColumn(databaseId, tableId, key, onDelete as RelationMutate, newKey)),
    ),
  );

tablesDB
  .command(`list-indexes`)
  .description(`List indexes on the table.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: key, type, status, attributes, error`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, tableId, queries, total }) =>
        parse(await (await getTablesDBClient()).listIndexes(databaseId, tableId, queries, total)),
    ),
  );

tablesDB
  .command(`create-index`)
  .description(`Creates an index on the columns listed. Your index should include all the columns you will query in a single request.
Type can be \`key\`, \`fulltext\`, or \`unique\`.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
  .requiredOption(`--key <key>`, `Index Key.`)
  .requiredOption(`--type <type>`, `Index type.`)
  .requiredOption(`--columns [columns...]`, `Array of columns to index. Maximum of 100 columns are allowed, each 32 characters long.`)
  .option(`--orders [orders...]`, `Array of index orders. Maximum of 100 orders are allowed.`)
  .option(`--lengths [lengths...]`, `Length of index. Maximum of 100`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key, type, columns, orders, lengths }) =>
        parse(await (await getTablesDBClient()).createIndex(databaseId, tableId, key, type as IndexType, columns, orders, lengths)),
    ),
  );

tablesDB
  .command(`get-index`)
  .description(`Get index by ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
  .requiredOption(`--key <key>`, `Index Key.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key }) =>
        parse(await (await getTablesDBClient()).getIndex(databaseId, tableId, key)),
    ),
  );

tablesDB
  .command(`delete-index`)
  .description(`Delete an index.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
  .requiredOption(`--key <key>`, `Index Key.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, key }) =>
        parse(await (await getTablesDBClient()).deleteIndex(databaseId, tableId, key)),
    ),
  );

tablesDB
  .command(`list-table-logs`)
  .description(`Get the table activity logs list by its unique ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, queries }) =>
        parse(await (await getTablesDBClient()).listTableLogs(databaseId, tableId, queries)),
    ),
  );

tablesDB
  .command(`list-rows`)
  .description(`Get a list of all the user's rows in a given table. You can use the query params to filter your results.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the TablesDB service [server integration](https://appwrite.io/docs/products/databases/tables#create-table).`)
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
      async ({ databaseId, tableId, queries, transactionId, total }) =>
        parse(await (await getTablesDBClient()).listRows(databaseId, tableId, queries, transactionId, total)),
    ),
  );

tablesDB
  .command(`create-row`)
  .description(`Create a new Row. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable). Make sure to define columns before creating rows.`)
  .requiredOption(`--row-id <row-id>`, `Row ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--data <data>`, `Row data as JSON object.`)
  .option(`--permissions [permissions...]`, `An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, rowId, data, permissions, transactionId }) =>
        parse(await (await getTablesDBClient()).createRow(databaseId, tableId, rowId, JSON.parse(data), permissions, transactionId)),
    ),
  );

tablesDB
  .command(`create-rows`)
  .description(`Create new Rows. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable). Make sure to define columns before creating rows.`)
  .requiredOption(`--rows [rows...]`, `Array of rows data as JSON objects.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, rows, transactionId }) =>
        parse(await (await getTablesDBClient()).createRows(databaseId, tableId, rows, transactionId)),
    ),
  );

tablesDB
  .command(`upsert-rows`)
  .description(`Create or update Rows. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.
`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--rows [rows...]`, `Array of row data as JSON objects. May contain partial rows.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, rows, transactionId }) =>
        parse(await (await getTablesDBClient()).upsertRows(databaseId, tableId, rows, transactionId)),
    ),
  );

tablesDB
  .command(`update-rows`)
  .description(`Update all rows that match your queries, if no queries are submitted then all rows are updated. You can pass only specific fields to be updated.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .option(`--data <data>`, `Row data as JSON object. Include only column and value pairs to be updated.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, data, queries, transactionId }) =>
        parse(await (await getTablesDBClient()).updateRows(databaseId, tableId, JSON.parse(data), queries, transactionId)),
    ),
  );

tablesDB
  .command(`delete-rows`)
  .description(`Bulk delete rows using queries, if no queries are passed then all rows are deleted.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, queries, transactionId }) =>
        parse(await (await getTablesDBClient()).deleteRows(databaseId, tableId, queries, transactionId)),
    ),
  );

tablesDB
  .command(`get-row`)
  .description(`Get a row by its unique ID. This endpoint response returns a JSON object with the row data.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
  .requiredOption(`--row-id <row-id>`, `Row ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID to read uncommitted changes within the transaction.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, rowId, queries, transactionId }) =>
        parse(await (await getTablesDBClient()).getRow(databaseId, tableId, rowId, queries, transactionId)),
    ),
  );

tablesDB
  .command(`upsert-row`)
  .description(`Create or update a Row. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--row-id <row-id>`, `Row ID.`)
  .option(`--data <data>`, `Row data as JSON object. Include all required columns of the row to be created or updated.`)
  .option(`--permissions [permissions...]`, `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, rowId, data, permissions, transactionId }) =>
        parse(await (await getTablesDBClient()).upsertRow(databaseId, tableId, rowId, JSON.parse(data), permissions, transactionId)),
    ),
  );

tablesDB
  .command(`update-row`)
  .description(`Update a row by its unique ID. Using the patch method you can pass only specific fields that will get updated.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--row-id <row-id>`, `Row ID.`)
  .option(`--data <data>`, `Row data as JSON object. Include only columns and value pairs to be updated.`)
  .option(`--permissions [permissions...]`, `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, rowId, data, permissions, transactionId }) =>
        parse(await (await getTablesDBClient()).updateRow(databaseId, tableId, rowId, JSON.parse(data), permissions, transactionId)),
    ),
  );

tablesDB
  .command(`delete-row`)
  .description(`Delete a row by its unique ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).`)
  .requiredOption(`--row-id <row-id>`, `Row ID.`)
  .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, rowId, transactionId }) =>
        parse(await (await getTablesDBClient()).deleteRow(databaseId, tableId, rowId, transactionId)),
    ),
  );

tablesDB
  .command(`list-row-logs`)
  .description(`Get the row activity logs list by its unique ID.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .requiredOption(`--row-id <row-id>`, `Row ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, rowId, queries }) =>
        parse(await (await getTablesDBClient()).listRowLogs(databaseId, tableId, rowId, queries)),
    ),
  );

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
  .action(
    actionRunner(
      async ({ databaseId, tableId, rowId, column, value, min, transactionId }) =>
        parse(await (await getTablesDBClient()).decrementRowColumn(databaseId, tableId, rowId, column, value, min, transactionId)),
    ),
  );

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
  .action(
    actionRunner(
      async ({ databaseId, tableId, rowId, column, value, max, transactionId }) =>
        parse(await (await getTablesDBClient()).incrementRowColumn(databaseId, tableId, rowId, column, value, max, transactionId)),
    ),
  );

tablesDB
  .command(`get-table-usage`)
  .description(`Get usage metrics and statistics for a table. Returning the total number of rows. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ databaseId, tableId, range }) =>
        parse(await (await getTablesDBClient()).getTableUsage(databaseId, tableId, range as UsageRange)),
    ),
  );

tablesDB
  .command(`get-usage`)
  .description(`Get usage metrics and statistics for a database. You can view the total number of tables, rows, and storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ databaseId, range }) =>
        parse(await (await getTablesDBClient()).getUsage(databaseId, range as UsageRange)),
    ),
  );

