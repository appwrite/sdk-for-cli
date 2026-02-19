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
import { Migrations } from "@appwrite.io/console";

let migrationsClient: Migrations | null = null;

const getMigrationsClient = async (): Promise<Migrations> => {
  if (!migrationsClient) {
    const sdkClient = await sdkForProject();
    migrationsClient = new Migrations(sdkClient);
  }
  return migrationsClient;
};

export const migrations = new Command("migrations")
  .description(commandDescriptions["migrations"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

migrations
  .command(`list`)
  .description(`List all migrations in the current project. This endpoint returns a list of all migrations including their status, progress, and any errors that occurred during the migration process.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: status, stage, source, destination, resources, resourceId, resourceType, statusCounters, resourceData, errors`)
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
        parse(await (await getMigrationsClient()).list(queries, search, total)),
    ),
  );

migrations
  .command(`create-appwrite-migration`)
  .description(`Migrate data from another Appwrite project to your current project. This endpoint allows you to migrate resources like databases, collections, documents, users, and files from an existing Appwrite project. `)
  .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
  .requiredOption(`--endpoint <endpoint>`, `Source Appwrite endpoint`)
  .requiredOption(`--project-id <project-id>`, `Source Project ID`)
  .requiredOption(`--api-key <api-key>`, `Source API Key`)
  .action(
    actionRunner(
      async ({ resources, endpoint, projectId, apiKey }) =>
        parse(await (await getMigrationsClient()).createAppwriteMigration(resources, endpoint, projectId, apiKey)),
    ),
  );

migrations
  .command(`get-appwrite-report`)
  .description(`Generate a report of the data in an Appwrite project before migrating. This endpoint analyzes the source project and returns information about the resources that can be migrated.`)
  .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
  .requiredOption(`--endpoint <endpoint>`, `Source's Appwrite Endpoint`)
  .requiredOption(`--project-id <project-id>`, `Source's Project ID`)
  .requiredOption(`--key <key>`, `Source's API Key`)
  .action(
    actionRunner(
      async ({ resources, endpoint, projectId, key }) =>
        parse(await (await getMigrationsClient()).getAppwriteReport(resources, endpoint, projectId, key)),
    ),
  );

migrations
  .command(`create-csv-export`)
  .description(`Export documents to a CSV file from your Appwrite database. This endpoint allows you to export documents to a CSV file stored in a secure internal bucket. You'll receive an email with a download link when the export is complete.`)
  .requiredOption(`--resource-id <resource-id>`, `Composite ID in the format {databaseId:collectionId}, identifying a collection within a database to export.`)
  .requiredOption(`--filename <filename>`, `The name of the file to be created for the export, excluding the .csv extension.`)
  .option(`--columns [columns...]`, `List of attributes to export. If empty, all attributes will be exported. You can use the \`*\` wildcard to export all attributes from the collection.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK to filter documents to export. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .option(`--delimiter <delimiter>`, `The character that separates each column value. Default is comma.`)
  .option(`--enclosure <enclosure>`, `The character that encloses each column value. Default is double quotes.`)
  .option(`--escape <escape>`, `The escape character for the enclosure character. Default is double quotes.`)
  .option(
    `--header [value]`,
    `Whether to include the header row with column names. Default is true.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--notify [value]`,
    `Set to true to receive an email when the export is complete. Default is true.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ resourceId, filename, columns, queries, delimiter, enclosure, escape, header, notify }) =>
        parse(await (await getMigrationsClient()).createCSVExport(resourceId, filename, columns, queries, delimiter, enclosure, escape, header, notify)),
    ),
  );

migrations
  .command(`create-csv-import`)
  .description(`Import documents from a CSV file into your Appwrite database. This endpoint allows you to import documents from a CSV file uploaded to Appwrite Storage bucket.`)
  .requiredOption(`--bucket-id <bucket-id>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
  .requiredOption(`--file-id <file-id>`, `File ID.`)
  .requiredOption(`--resource-id <resource-id>`, `Composite ID in the format {databaseId:collectionId}, identifying a collection within a database.`)
  .option(
    `--internal-file [value]`,
    `Is the file stored in an internal bucket?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ bucketId, fileId, resourceId, internalFile }) =>
        parse(await (await getMigrationsClient()).createCSVImport(bucketId, fileId, resourceId, internalFile)),
    ),
  );

migrations
  .command(`create-firebase-migration`)
  .description(`Migrate data from a Firebase project to your Appwrite project. This endpoint allows you to migrate resources like authentication and other supported services from a Firebase project. `)
  .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
  .requiredOption(`--service-account <service-account>`, `JSON of the Firebase service account credentials`)
  .action(
    actionRunner(
      async ({ resources, serviceAccount }) =>
        parse(await (await getMigrationsClient()).createFirebaseMigration(resources, serviceAccount)),
    ),
  );

migrations
  .command(`get-firebase-report`)
  .description(`Generate a report of the data in a Firebase project before migrating. This endpoint analyzes the source project and returns information about the resources that can be migrated.`)
  .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
  .requiredOption(`--service-account <service-account>`, `JSON of the Firebase service account credentials`)
  .action(
    actionRunner(
      async ({ resources, serviceAccount }) =>
        parse(await (await getMigrationsClient()).getFirebaseReport(resources, serviceAccount)),
    ),
  );

migrations
  .command(`create-n-host-migration`)
  .description(`Migrate data from an NHost project to your Appwrite project. This endpoint allows you to migrate resources like authentication, databases, and other supported services from an NHost project. `)
  .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
  .requiredOption(`--subdomain <subdomain>`, `Source's Subdomain`)
  .requiredOption(`--region <region>`, `Source's Region`)
  .requiredOption(`--admin-secret <admin-secret>`, `Source's Admin Secret`)
  .requiredOption(`--database <database>`, `Source's Database Name`)
  .requiredOption(`--username <username>`, `Source's Database Username`)
  .requiredOption(`--password <password>`, `Source's Database Password`)
  .option(`--port <port>`, `Source's Database Port`, parseInteger)
  .action(
    actionRunner(
      async ({ resources, subdomain, region, adminSecret, database, username, password, port }) =>
        parse(await (await getMigrationsClient()).createNHostMigration(resources, subdomain, region, adminSecret, database, username, password, port)),
    ),
  );

migrations
  .command(`get-n-host-report`)
  .description(`Generate a detailed report of the data in an NHost project before migrating. This endpoint analyzes the source project and returns information about the resources that can be migrated. `)
  .requiredOption(`--resources [resources...]`, `List of resources to migrate.`)
  .requiredOption(`--subdomain <subdomain>`, `Source's Subdomain.`)
  .requiredOption(`--region <region>`, `Source's Region.`)
  .requiredOption(`--admin-secret <admin-secret>`, `Source's Admin Secret.`)
  .requiredOption(`--database <database>`, `Source's Database Name.`)
  .requiredOption(`--username <username>`, `Source's Database Username.`)
  .requiredOption(`--password <password>`, `Source's Database Password.`)
  .option(`--port <port>`, `Source's Database Port.`, parseInteger)
  .action(
    actionRunner(
      async ({ resources, subdomain, region, adminSecret, database, username, password, port }) =>
        parse(await (await getMigrationsClient()).getNHostReport(resources, subdomain, region, adminSecret, database, username, password, port)),
    ),
  );

migrations
  .command(`create-supabase-migration`)
  .description(`Migrate data from a Supabase project to your Appwrite project. This endpoint allows you to migrate resources like authentication, databases, and other supported services from a Supabase project. `)
  .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
  .requiredOption(`--endpoint <endpoint>`, `Source's Supabase Endpoint`)
  .requiredOption(`--api-key <api-key>`, `Source's API Key`)
  .requiredOption(`--database-host <database-host>`, `Source's Database Host`)
  .requiredOption(`--username <username>`, `Source's Database Username`)
  .requiredOption(`--password <password>`, `Source's Database Password`)
  .option(`--port <port>`, `Source's Database Port`, parseInteger)
  .action(
    actionRunner(
      async ({ resources, endpoint, apiKey, databaseHost, username, password, port }) =>
        parse(await (await getMigrationsClient()).createSupabaseMigration(resources, endpoint, apiKey, databaseHost, username, password, port)),
    ),
  );

migrations
  .command(`get-supabase-report`)
  .description(`Generate a report of the data in a Supabase project before migrating. This endpoint analyzes the source project and returns information about the resources that can be migrated. `)
  .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
  .requiredOption(`--endpoint <endpoint>`, `Source's Supabase Endpoint.`)
  .requiredOption(`--api-key <api-key>`, `Source's API Key.`)
  .requiredOption(`--database-host <database-host>`, `Source's Database Host.`)
  .requiredOption(`--username <username>`, `Source's Database Username.`)
  .requiredOption(`--password <password>`, `Source's Database Password.`)
  .option(`--port <port>`, `Source's Database Port.`, parseInteger)
  .action(
    actionRunner(
      async ({ resources, endpoint, apiKey, databaseHost, username, password, port }) =>
        parse(await (await getMigrationsClient()).getSupabaseReport(resources, endpoint, apiKey, databaseHost, username, password, port)),
    ),
  );

migrations
  .command(`get`)
  .description(`Get a migration by its unique ID. This endpoint returns detailed information about a specific migration including its current status, progress, and any errors that occurred during the migration process. `)
  .requiredOption(`--migration-id <migration-id>`, `Migration unique ID.`)
  .action(
    actionRunner(
      async ({ migrationId }) =>
        parse(await (await getMigrationsClient()).get(migrationId)),
    ),
  );

migrations
  .command(`retry`)
  .description(`Retry a failed migration. This endpoint allows you to retry a migration that has previously failed.`)
  .requiredOption(`--migration-id <migration-id>`, `Migration unique ID.`)
  .action(
    actionRunner(
      async ({ migrationId }) =>
        parse(await (await getMigrationsClient()).retry(migrationId)),
    ),
  );

migrations
  .command(`delete`)
  .description(`Delete a migration by its unique ID. This endpoint allows you to remove a migration from your project's migration history. `)
  .requiredOption(`--migration-id <migration-id>`, `Migration ID.`)
  .action(
    actionRunner(
      async ({ migrationId }) =>
        parse(await (await getMigrationsClient()).delete(migrationId)),
    ),
  );

