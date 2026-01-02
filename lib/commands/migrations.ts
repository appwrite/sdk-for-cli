import fs from "fs";
import pathLib from "path";
import tar from "tar";
import ignoreModule from "ignore";
const ignore: typeof ignoreModule =
  (ignoreModule as any).default ?? ignoreModule;
import { promisify } from "util";
import Client from "../client.js";
import { getAllFiles, showConsoleLink } from "../utils.js";
import { Command } from "commander";
import { sdkForProject, sdkForConsole } from "../sdks.js";
import {
  parse,
  actionRunner,
  parseInteger,
  parseBool,
  commandDescriptions,
  success,
  log,
  warn,
} from "../parser.js";
import { localConfig, globalConfig } from "../config.js";
import { File } from "undici";
import { ReadableStream } from "stream/web";
import type { UploadProgress, FileInput } from "../types.js";

function convertReadStreamToReadableStream(
  readStream: fs.ReadStream,
): ReadableStream {
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

export const migrations = new Command("migrations")
  .description(commandDescriptions["migrations"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

interface MigrationsListRequestParams {
  queries?: string[];
  search?: string;
  total?: boolean;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const migrationsList = async ({
  queries,
  search,
  total,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: MigrationsListRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/migrations";
  let payload = {};
  if (typeof queries !== "undefined") {
    payload["queries"] = queries;
  }
  if (typeof search !== "undefined") {
    payload["search"] = search;
  }
  if (typeof total !== "undefined") {
    payload["total"] = total;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface MigrationsCreateAppwriteMigrationRequestParams {
  resources: string[];
  endpoint: string;
  projectId: string;
  apiKey: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const migrationsCreateAppwriteMigration = async ({
  resources,
  endpoint,
  projectId,
  apiKey,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: MigrationsCreateAppwriteMigrationRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/migrations/appwrite";
  let payload = {};
  resources = (resources as unknown) === true ? [] : resources;
  if (typeof resources !== "undefined") {
    payload["resources"] = resources;
  }
  if (typeof endpoint !== "undefined") {
    payload["endpoint"] = endpoint;
  }
  if (typeof projectId !== "undefined") {
    payload["projectId"] = projectId;
  }
  if (typeof apiKey !== "undefined") {
    payload["apiKey"] = apiKey;
  }

  let response = undefined;

  response = await client.call(
    "post",
    apiPath,
    {
      "content-type": "application/json",
    },
    payload,
  );

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface MigrationsGetAppwriteReportRequestParams {
  resources: string[];
  endpoint: string;
  projectID: string;
  key: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const migrationsGetAppwriteReport = async ({
  resources,
  endpoint,
  projectID,
  key,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: MigrationsGetAppwriteReportRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/migrations/appwrite/report";
  let payload = {};
  if (typeof resources !== "undefined") {
    payload["resources"] = resources;
  }
  if (typeof endpoint !== "undefined") {
    payload["endpoint"] = endpoint;
  }
  if (typeof projectID !== "undefined") {
    payload["projectID"] = projectID;
  }
  if (typeof key !== "undefined") {
    payload["key"] = key;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface MigrationsCreateCSVExportRequestParams {
  resourceId: string;
  filename: string;
  columns?: string[];
  queries?: string[];
  delimiter?: string;
  enclosure?: string;
  escape?: string;
  header?: boolean;
  notify?: boolean;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const migrationsCreateCSVExport = async ({
  resourceId,
  filename,
  columns,
  queries,
  delimiter,
  enclosure,
  escape,
  header,
  notify,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: MigrationsCreateCSVExportRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/migrations/csv/exports";
  let payload = {};
  if (typeof resourceId !== "undefined") {
    payload["resourceId"] = resourceId;
  }
  if (typeof filename !== "undefined") {
    payload["filename"] = filename;
  }
  columns = (columns as unknown) === true ? [] : columns;
  if (typeof columns !== "undefined") {
    payload["columns"] = columns;
  }
  queries = (queries as unknown) === true ? [] : queries;
  if (typeof queries !== "undefined") {
    payload["queries"] = queries;
  }
  if (typeof delimiter !== "undefined") {
    payload["delimiter"] = delimiter;
  }
  if (typeof enclosure !== "undefined") {
    payload["enclosure"] = enclosure;
  }
  if (typeof escape !== "undefined") {
    payload["escape"] = escape;
  }
  if (typeof header !== "undefined") {
    payload["header"] = header;
  }
  if (typeof notify !== "undefined") {
    payload["notify"] = notify;
  }

  let response = undefined;

  response = await client.call(
    "post",
    apiPath,
    {
      "content-type": "application/json",
    },
    payload,
  );

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface MigrationsCreateCSVImportRequestParams {
  bucketId: string;
  fileId: string;
  resourceId: string;
  internalFile?: boolean;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const migrationsCreateCSVImport = async ({
  bucketId,
  fileId,
  resourceId,
  internalFile,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: MigrationsCreateCSVImportRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/migrations/csv/imports";
  let payload = {};
  if (typeof bucketId !== "undefined") {
    payload["bucketId"] = bucketId;
  }
  if (typeof fileId !== "undefined") {
    payload["fileId"] = fileId;
  }
  if (typeof resourceId !== "undefined") {
    payload["resourceId"] = resourceId;
  }
  if (typeof internalFile !== "undefined") {
    payload["internalFile"] = internalFile;
  }

  let response = undefined;

  response = await client.call(
    "post",
    apiPath,
    {
      "content-type": "application/json",
    },
    payload,
  );

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface MigrationsCreateFirebaseMigrationRequestParams {
  resources: string[];
  serviceAccount: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const migrationsCreateFirebaseMigration = async ({
  resources,
  serviceAccount,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: MigrationsCreateFirebaseMigrationRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/migrations/firebase";
  let payload = {};
  resources = (resources as unknown) === true ? [] : resources;
  if (typeof resources !== "undefined") {
    payload["resources"] = resources;
  }
  if (typeof serviceAccount !== "undefined") {
    payload["serviceAccount"] = serviceAccount;
  }

  let response = undefined;

  response = await client.call(
    "post",
    apiPath,
    {
      "content-type": "application/json",
    },
    payload,
  );

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface MigrationsGetFirebaseReportRequestParams {
  resources: string[];
  serviceAccount: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const migrationsGetFirebaseReport = async ({
  resources,
  serviceAccount,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: MigrationsGetFirebaseReportRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/migrations/firebase/report";
  let payload = {};
  if (typeof resources !== "undefined") {
    payload["resources"] = resources;
  }
  if (typeof serviceAccount !== "undefined") {
    payload["serviceAccount"] = serviceAccount;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface MigrationsCreateNHostMigrationRequestParams {
  resources: string[];
  subdomain: string;
  region: string;
  adminSecret: string;
  database: string;
  username: string;
  password: string;
  port?: number;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const migrationsCreateNHostMigration = async ({
  resources,
  subdomain,
  region,
  adminSecret,
  database,
  username,
  password,
  port,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: MigrationsCreateNHostMigrationRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/migrations/nhost";
  let payload = {};
  resources = (resources as unknown) === true ? [] : resources;
  if (typeof resources !== "undefined") {
    payload["resources"] = resources;
  }
  if (typeof subdomain !== "undefined") {
    payload["subdomain"] = subdomain;
  }
  if (typeof region !== "undefined") {
    payload["region"] = region;
  }
  if (typeof adminSecret !== "undefined") {
    payload["adminSecret"] = adminSecret;
  }
  if (typeof database !== "undefined") {
    payload["database"] = database;
  }
  if (typeof username !== "undefined") {
    payload["username"] = username;
  }
  if (typeof password !== "undefined") {
    payload["password"] = password;
  }
  if (typeof port !== "undefined") {
    payload["port"] = port;
  }

  let response = undefined;

  response = await client.call(
    "post",
    apiPath,
    {
      "content-type": "application/json",
    },
    payload,
  );

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface MigrationsGetNHostReportRequestParams {
  resources: string[];
  subdomain: string;
  region: string;
  adminSecret: string;
  database: string;
  username: string;
  password: string;
  port?: number;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const migrationsGetNHostReport = async ({
  resources,
  subdomain,
  region,
  adminSecret,
  database,
  username,
  password,
  port,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: MigrationsGetNHostReportRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/migrations/nhost/report";
  let payload = {};
  if (typeof resources !== "undefined") {
    payload["resources"] = resources;
  }
  if (typeof subdomain !== "undefined") {
    payload["subdomain"] = subdomain;
  }
  if (typeof region !== "undefined") {
    payload["region"] = region;
  }
  if (typeof adminSecret !== "undefined") {
    payload["adminSecret"] = adminSecret;
  }
  if (typeof database !== "undefined") {
    payload["database"] = database;
  }
  if (typeof username !== "undefined") {
    payload["username"] = username;
  }
  if (typeof password !== "undefined") {
    payload["password"] = password;
  }
  if (typeof port !== "undefined") {
    payload["port"] = port;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface MigrationsCreateSupabaseMigrationRequestParams {
  resources: string[];
  endpoint: string;
  apiKey: string;
  databaseHost: string;
  username: string;
  password: string;
  port?: number;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const migrationsCreateSupabaseMigration = async ({
  resources,
  endpoint,
  apiKey,
  databaseHost,
  username,
  password,
  port,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: MigrationsCreateSupabaseMigrationRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/migrations/supabase";
  let payload = {};
  resources = (resources as unknown) === true ? [] : resources;
  if (typeof resources !== "undefined") {
    payload["resources"] = resources;
  }
  if (typeof endpoint !== "undefined") {
    payload["endpoint"] = endpoint;
  }
  if (typeof apiKey !== "undefined") {
    payload["apiKey"] = apiKey;
  }
  if (typeof databaseHost !== "undefined") {
    payload["databaseHost"] = databaseHost;
  }
  if (typeof username !== "undefined") {
    payload["username"] = username;
  }
  if (typeof password !== "undefined") {
    payload["password"] = password;
  }
  if (typeof port !== "undefined") {
    payload["port"] = port;
  }

  let response = undefined;

  response = await client.call(
    "post",
    apiPath,
    {
      "content-type": "application/json",
    },
    payload,
  );

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface MigrationsGetSupabaseReportRequestParams {
  resources: string[];
  endpoint: string;
  apiKey: string;
  databaseHost: string;
  username: string;
  password: string;
  port?: number;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const migrationsGetSupabaseReport = async ({
  resources,
  endpoint,
  apiKey,
  databaseHost,
  username,
  password,
  port,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: MigrationsGetSupabaseReportRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/migrations/supabase/report";
  let payload = {};
  if (typeof resources !== "undefined") {
    payload["resources"] = resources;
  }
  if (typeof endpoint !== "undefined") {
    payload["endpoint"] = endpoint;
  }
  if (typeof apiKey !== "undefined") {
    payload["apiKey"] = apiKey;
  }
  if (typeof databaseHost !== "undefined") {
    payload["databaseHost"] = databaseHost;
  }
  if (typeof username !== "undefined") {
    payload["username"] = username;
  }
  if (typeof password !== "undefined") {
    payload["password"] = password;
  }
  if (typeof port !== "undefined") {
    payload["port"] = port;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface MigrationsGetRequestParams {
  migrationId: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const migrationsGet = async ({
  migrationId,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: MigrationsGetRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/migrations/{migrationId}".replace(
    "{migrationId}",
    migrationId,
  );
  let payload = {};

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface MigrationsRetryRequestParams {
  migrationId: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const migrationsRetry = async ({
  migrationId,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: MigrationsRetryRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/migrations/{migrationId}".replace(
    "{migrationId}",
    migrationId,
  );
  let payload = {};

  let response = undefined;

  response = await client.call(
    "patch",
    apiPath,
    {
      "content-type": "application/json",
    },
    payload,
  );

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface MigrationsDeleteRequestParams {
  migrationId: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const migrationsDelete = async ({
  migrationId,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: MigrationsDeleteRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/migrations/{migrationId}".replace(
    "{migrationId}",
    migrationId,
  );
  let payload = {};

  let response = undefined;

  response = await client.call(
    "delete",
    apiPath,
    {
      "content-type": "application/json",
    },
    payload,
  );

  if (parseOutput) {
    parse(response);
  }

  return response;
};
migrations
  .command(`list`)
  .description(
    `List all migrations in the current project. This endpoint returns a list of all migrations including their status, progress, and any errors that occurred during the migration process.`,
  )
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: status, stage, source, destination, resources, statusCounters, resourceData, errors`,
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
  .action(actionRunner(migrationsList));

migrations
  .command(`create-appwrite-migration`)
  .description(
    `Migrate data from another Appwrite project to your current project. This endpoint allows you to migrate resources like databases, collections, documents, users, and files from an existing Appwrite project. `,
  )
  .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
  .requiredOption(`--endpoint <endpoint>`, `Source Appwrite endpoint`)
  .requiredOption(`--project-id <project-id>`, `Source Project ID`)
  .requiredOption(`--api-key <api-key>`, `Source API Key`)
  .action(actionRunner(migrationsCreateAppwriteMigration));

migrations
  .command(`get-appwrite-report`)
  .description(
    `Generate a report of the data in an Appwrite project before migrating. This endpoint analyzes the source project and returns information about the resources that can be migrated.`,
  )
  .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
  .requiredOption(`--endpoint <endpoint>`, `Source's Appwrite Endpoint`)
  .requiredOption(`--project-id <project-id>`, `Source's Project ID`)
  .requiredOption(`--key <key>`, `Source's API Key`)
  .action(actionRunner(migrationsGetAppwriteReport));

migrations
  .command(`create-csv-export`)
  .description(
    `Export documents to a CSV file from your Appwrite database. This endpoint allows you to export documents to a CSV file stored in a secure internal bucket. You'll receive an email with a download link when the export is complete.`,
  )
  .requiredOption(
    `--resource-id <resource-id>`,
    `Composite ID in the format {databaseId:collectionId}, identifying a collection within a database to export.`,
  )
  .requiredOption(
    `--filename <filename>`,
    `The name of the file to be created for the export, excluding the .csv extension.`,
  )
  .option(
    `--columns [columns...]`,
    `List of attributes to export. If empty, all attributes will be exported. You can use the '*' wildcard to export all attributes from the collection.`,
  )
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK to filter documents to export. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long.`,
  )
  .option(
    `--delimiter <delimiter>`,
    `The character that separates each column value. Default is comma.`,
  )
  .option(
    `--enclosure <enclosure>`,
    `The character that encloses each column value. Default is double quotes.`,
  )
  .option(
    `--escape <escape>`,
    `The escape character for the enclosure character. Default is double quotes.`,
  )
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
  .action(actionRunner(migrationsCreateCSVExport));

migrations
  .command(`create-csv-import`)
  .description(
    `Import documents from a CSV file into your Appwrite database. This endpoint allows you to import documents from a CSV file uploaded to Appwrite Storage bucket.`,
  )
  .requiredOption(
    `--bucket-id <bucket-id>`,
    `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`,
  )
  .requiredOption(`--file-id <file-id>`, `File ID.`)
  .requiredOption(
    `--resource-id <resource-id>`,
    `Composite ID in the format {databaseId:collectionId}, identifying a collection within a database.`,
  )
  .option(
    `--internal-file [value]`,
    `Is the file stored in an internal bucket?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(actionRunner(migrationsCreateCSVImport));

migrations
  .command(`create-firebase-migration`)
  .description(
    `Migrate data from a Firebase project to your Appwrite project. This endpoint allows you to migrate resources like authentication and other supported services from a Firebase project. `,
  )
  .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
  .requiredOption(
    `--service-account <service-account>`,
    `JSON of the Firebase service account credentials`,
  )
  .action(actionRunner(migrationsCreateFirebaseMigration));

migrations
  .command(`get-firebase-report`)
  .description(
    `Generate a report of the data in a Firebase project before migrating. This endpoint analyzes the source project and returns information about the resources that can be migrated.`,
  )
  .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
  .requiredOption(
    `--service-account <service-account>`,
    `JSON of the Firebase service account credentials`,
  )
  .action(actionRunner(migrationsGetFirebaseReport));

migrations
  .command(`create-n-host-migration`)
  .description(
    `Migrate data from an NHost project to your Appwrite project. This endpoint allows you to migrate resources like authentication, databases, and other supported services from an NHost project. `,
  )
  .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
  .requiredOption(`--subdomain <subdomain>`, `Source's Subdomain`)
  .requiredOption(`--region <region>`, `Source's Region`)
  .requiredOption(`--admin-secret <admin-secret>`, `Source's Admin Secret`)
  .requiredOption(`--database <database>`, `Source's Database Name`)
  .requiredOption(`--username <username>`, `Source's Database Username`)
  .requiredOption(`--password <password>`, `Source's Database Password`)
  .option(`--port <port>`, `Source's Database Port`, parseInteger)
  .action(actionRunner(migrationsCreateNHostMigration));

migrations
  .command(`get-n-host-report`)
  .description(
    `Generate a detailed report of the data in an NHost project before migrating. This endpoint analyzes the source project and returns information about the resources that can be migrated. `,
  )
  .requiredOption(`--resources [resources...]`, `List of resources to migrate.`)
  .requiredOption(`--subdomain <subdomain>`, `Source's Subdomain.`)
  .requiredOption(`--region <region>`, `Source's Region.`)
  .requiredOption(`--admin-secret <admin-secret>`, `Source's Admin Secret.`)
  .requiredOption(`--database <database>`, `Source's Database Name.`)
  .requiredOption(`--username <username>`, `Source's Database Username.`)
  .requiredOption(`--password <password>`, `Source's Database Password.`)
  .option(`--port <port>`, `Source's Database Port.`, parseInteger)
  .action(actionRunner(migrationsGetNHostReport));

migrations
  .command(`create-supabase-migration`)
  .description(
    `Migrate data from a Supabase project to your Appwrite project. This endpoint allows you to migrate resources like authentication, databases, and other supported services from a Supabase project. `,
  )
  .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
  .requiredOption(`--endpoint <endpoint>`, `Source's Supabase Endpoint`)
  .requiredOption(`--api-key <api-key>`, `Source's API Key`)
  .requiredOption(`--database-host <database-host>`, `Source's Database Host`)
  .requiredOption(`--username <username>`, `Source's Database Username`)
  .requiredOption(`--password <password>`, `Source's Database Password`)
  .option(`--port <port>`, `Source's Database Port`, parseInteger)
  .action(actionRunner(migrationsCreateSupabaseMigration));

migrations
  .command(`get-supabase-report`)
  .description(
    `Generate a report of the data in a Supabase project before migrating. This endpoint analyzes the source project and returns information about the resources that can be migrated. `,
  )
  .requiredOption(`--resources [resources...]`, `List of resources to migrate`)
  .requiredOption(`--endpoint <endpoint>`, `Source's Supabase Endpoint.`)
  .requiredOption(`--api-key <api-key>`, `Source's API Key.`)
  .requiredOption(`--database-host <database-host>`, `Source's Database Host.`)
  .requiredOption(`--username <username>`, `Source's Database Username.`)
  .requiredOption(`--password <password>`, `Source's Database Password.`)
  .option(`--port <port>`, `Source's Database Port.`, parseInteger)
  .action(actionRunner(migrationsGetSupabaseReport));

migrations
  .command(`get`)
  .description(
    `Get a migration by its unique ID. This endpoint returns detailed information about a specific migration including its current status, progress, and any errors that occurred during the migration process. `,
  )
  .requiredOption(`--migration-id <migration-id>`, `Migration unique ID.`)
  .action(actionRunner(migrationsGet));

migrations
  .command(`retry`)
  .description(
    `Retry a failed migration. This endpoint allows you to retry a migration that has previously failed.`,
  )
  .requiredOption(`--migration-id <migration-id>`, `Migration unique ID.`)
  .action(actionRunner(migrationsRetry));

migrations
  .command(`delete`)
  .description(
    `Delete a migration by its unique ID. This endpoint allows you to remove a migration from your project's migration history. `,
  )
  .requiredOption(`--migration-id <migration-id>`, `Migration ID.`)
  .action(actionRunner(migrationsDelete));
