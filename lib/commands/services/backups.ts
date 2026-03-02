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
import { Backups } from "@appwrite.io/console";

let backupsClient: Backups | null = null;

const getBackupsClient = async (): Promise<Backups> => {
  if (!backupsClient) {
    const sdkClient = await sdkForProject();
    backupsClient = new Backups(sdkClient);
  }
  return backupsClient;
};

export const backups = new Command("backups")
  .description(commandDescriptions["backups"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

backups
  .command(`list-archives`)
  .description(`List all archives for a project.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .action(
    actionRunner(
      async ({ queries }) =>
        parse(await (await getBackupsClient()).listArchives(queries)),
    ),
  );

backups
  .command(`create-archive`)
  .description(`Create a new archive asynchronously for a project.`)
  .requiredOption(`--services [services...]`, `Array of services to backup`)
  .option(`--resource-id <resource-id>`, `Resource ID. When set, only this single resource will be backed up.`)
  .action(
    actionRunner(
      async ({ services, resourceId }) =>
        parse(await (await getBackupsClient()).createArchive(services, resourceId)),
    ),
  );

backups
  .command(`get-archive`)
  .description(`Get a backup archive using it's ID.`)
  .requiredOption(`--archive-id <archive-id>`, `Archive ID. Choose a custom ID\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .action(
    actionRunner(
      async ({ archiveId }) =>
        parse(await (await getBackupsClient()).getArchive(archiveId)),
    ),
  );

backups
  .command(`delete-archive`)
  .description(`Delete an existing archive for a project.`)
  .requiredOption(`--archive-id <archive-id>`, `Policy ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .action(
    actionRunner(
      async ({ archiveId }) =>
        parse(await (await getBackupsClient()).deleteArchive(archiveId)),
    ),
  );

backups
  .command(`list-policies`)
  .description(`List all policies for a project.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .action(
    actionRunner(
      async ({ queries }) =>
        parse(await (await getBackupsClient()).listPolicies(queries)),
    ),
  );

backups
  .command(`create-policy`)
  .description(`Create a new backup policy.`)
  .requiredOption(`--policy-id <policy-id>`, `Policy ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--services [services...]`, `Array of services to backup`)
  .requiredOption(`--retention <retention>`, `Days to keep backups before deletion`, parseInteger)
  .requiredOption(`--schedule <schedule>`, `Schedule CRON syntax.`)
  .option(`--name <name>`, `Policy name. Max length: 128 chars.`)
  .option(`--resource-id <resource-id>`, `Resource ID. When set, only this single resource will be backed up.`)
  .option(
    `--enabled [value]`,
    `Is policy enabled? When set to 'disabled', no backups will be taken`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ policyId, services, retention, schedule, name, resourceId, enabled }) =>
        parse(await (await getBackupsClient()).createPolicy(policyId, services, retention, schedule, name, resourceId, enabled)),
    ),
  );

backups
  .command(`get-policy`)
  .description(`Get a backup policy using it's ID.`)
  .requiredOption(`--policy-id <policy-id>`, `Policy ID. Choose a custom ID\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .action(
    actionRunner(
      async ({ policyId }) =>
        parse(await (await getBackupsClient()).getPolicy(policyId)),
    ),
  );

backups
  .command(`update-policy`)
  .description(`Update an existing policy using it's ID.`)
  .requiredOption(`--policy-id <policy-id>`, `Policy ID. Choose a custom ID\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .option(`--name <name>`, `Policy name. Max length: 128 chars.`)
  .option(`--retention <retention>`, `Days to keep backups before deletion`, parseInteger)
  .option(`--schedule <schedule>`, `Cron expression`)
  .option(
    `--enabled [value]`,
    `Is Backup enabled? When set to 'disabled', No backup will be taken`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ policyId, name, retention, schedule, enabled }) =>
        parse(await (await getBackupsClient()).updatePolicy(policyId, name, retention, schedule, enabled)),
    ),
  );

backups
  .command(`delete-policy`)
  .description(`Delete a policy using it's ID.`)
  .requiredOption(`--policy-id <policy-id>`, `Policy ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .action(
    actionRunner(
      async ({ policyId }) =>
        parse(await (await getBackupsClient()).deletePolicy(policyId)),
    ),
  );

backups
  .command(`create-restoration`)
  .description(`Create and trigger a new restoration for a backup on a project.`)
  .requiredOption(`--archive-id <archive-id>`, `Backup archive ID to restore`)
  .requiredOption(`--services [services...]`, `Array of services to restore`)
  .option(`--new-resource-id <new-resource-id>`, `Unique Id. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .option(`--new-resource-name <new-resource-name>`, `Database name. Max length: 128 chars.`)
  .action(
    actionRunner(
      async ({ archiveId, services, newResourceId, newResourceName }) =>
        parse(await (await getBackupsClient()).createRestoration(archiveId, services, newResourceId, newResourceName)),
    ),
  );

backups
  .command(`list-restorations`)
  .description(`List all backup restorations for a project.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .action(
    actionRunner(
      async ({ queries }) =>
        parse(await (await getBackupsClient()).listRestorations(queries)),
    ),
  );

backups
  .command(`get-restoration`)
  .description(`Get the current status of a backup restoration.`)
  .requiredOption(`--restoration-id <restoration-id>`, `Restoration ID. Choose a custom ID\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .action(
    actionRunner(
      async ({ restorationId }) =>
        parse(await (await getBackupsClient()).getRestoration(restorationId)),
    ),
  );

