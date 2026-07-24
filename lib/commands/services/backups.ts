import { Command } from "commander";
import {
  buildQueries,
  collectQueryValue,
  parseDeprecatedWhereQuery,
  parseFilterQuery,
} from "../utils/query.js";
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
  .description(commandDescriptions["backups"] || "The Backups service allows you to manage backup policies, archives, and restorations for your project.")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

const backupsListArchivesCommand = backups
  .command(`list-archives`)
  .description(`List all archives for a project.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .option(`--filter <expression>`, `Filter using a simple comparison expression. Repeat for multiple filters. Supports field=value, field!=value, field>value, field>=value, field<value, and field<=value.`, (value: string, previous: string[] | undefined) => collectQueryValue(parseFilterQuery(value), previous))
  .option(`--where <expression>`, `Deprecated. Use --filter instead. Filter using a simple comparison expression. Repeat for multiple filters.`, (value: string, previous: string[] | undefined) => collectQueryValue(parseDeprecatedWhereQuery(value), previous))
  .option(`--sort-asc <attribute>`, `Sort results by an attribute in ascending order. Repeat for multiple sort fields.`, (value: string, previous: string[] | undefined) => collectQueryValue(value, previous))
  .option(`--sort-desc <attribute>`, `Sort results by an attribute in descending order. Repeat for multiple sort fields.`, (value: string, previous: string[] | undefined) => collectQueryValue(value, previous))
  .option(`--limit <limit>`, `Maximum number of results to return.`, parseInteger)
  .option(`--offset <offset>`, `Number of results to skip.`, parseInteger)
  .option(`--cursor-after <id>`, `Return results after this cursor ID.`)
  .option(`--cursor-before <id>`, `Return results before this cursor ID.`)
  .action(
    actionRunner(
      async ({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }) =>
        parse(await (await getBackupsClient()).listArchives(buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }))),
    ),
  );


const backupsCreateArchiveCommand = backups
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


const backupsGetArchiveCommand = backups
  .command(`get-archive`)
  .description(`Get a backup archive using it's ID.`)
  .requiredOption(`--archive-id <archive-id>`, `Archive ID. Choose a custom ID\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .action(
    actionRunner(
      async ({ archiveId }) =>
        parse(await (await getBackupsClient()).getArchive(archiveId)),
    ),
  );


const backupsDeleteArchiveCommand = backups
  .command(`delete-archive`)
  .description(`Delete an existing archive for a project.`)
  .requiredOption(`--archive-id <archive-id>`, `Policy ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .action(
    actionRunner(
      async ({ archiveId }) =>
        parse(await (await getBackupsClient()).deleteArchive(archiveId)),
    ),
  );


const backupsListPoliciesCommand = backups
  .command(`list-policies`)
  .description(`List all policies for a project.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .option(`--filter <expression>`, `Filter using a simple comparison expression. Repeat for multiple filters. Supports field=value, field!=value, field>value, field>=value, field<value, and field<=value.`, (value: string, previous: string[] | undefined) => collectQueryValue(parseFilterQuery(value), previous))
  .option(`--where <expression>`, `Deprecated. Use --filter instead. Filter using a simple comparison expression. Repeat for multiple filters.`, (value: string, previous: string[] | undefined) => collectQueryValue(parseDeprecatedWhereQuery(value), previous))
  .option(`--sort-asc <attribute>`, `Sort results by an attribute in ascending order. Repeat for multiple sort fields.`, (value: string, previous: string[] | undefined) => collectQueryValue(value, previous))
  .option(`--sort-desc <attribute>`, `Sort results by an attribute in descending order. Repeat for multiple sort fields.`, (value: string, previous: string[] | undefined) => collectQueryValue(value, previous))
  .option(`--limit <limit>`, `Maximum number of results to return.`, parseInteger)
  .option(`--offset <offset>`, `Number of results to skip.`, parseInteger)
  .option(`--cursor-after <id>`, `Return results after this cursor ID.`)
  .option(`--cursor-before <id>`, `Return results before this cursor ID.`)
  .action(
    actionRunner(
      async ({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }) =>
        parse(await (await getBackupsClient()).listPolicies(buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }))),
    ),
  );


const backupsCreatePolicyCommand = backups
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


const backupsGetPolicyCommand = backups
  .command(`get-policy`)
  .description(`Get a backup policy using it's ID.`)
  .requiredOption(`--policy-id <policy-id>`, `Policy ID. Choose a custom ID\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .action(
    actionRunner(
      async ({ policyId }) =>
        parse(await (await getBackupsClient()).getPolicy(policyId)),
    ),
  );


const backupsUpdatePolicyCommand = backups
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


const backupsDeletePolicyCommand = backups
  .command(`delete-policy`)
  .description(`Delete a policy using it's ID.`)
  .requiredOption(`--policy-id <policy-id>`, `Policy ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .action(
    actionRunner(
      async ({ policyId }) =>
        parse(await (await getBackupsClient()).deletePolicy(policyId)),
    ),
  );


const backupsCreateRestorationCommand = backups
  .command(`create-restoration`)
  .description(`Create and trigger a new restoration for a backup on a project.

For a backup of one database, the restoration resolves its destination before it is queued. Pass \`newResourceId\` to restore into that database ID, including the archived database ID to overwrite it. When \`newResourceId\` is omitted, a new database ID is generated and returned in \`options\`.

The restoration migration records the archived database in \`resourceId\` and \`resourceType\`, and the resolved database in \`destinationResourceId\` and \`destinationResourceType\`. Database types are stored canonically as \`database\`, \`documentsdb\`, or \`vectorsdb\`. Project-wide restorations leave these fields empty because they do not have a single source or destination database.

To list every migration related to one database, use its canonical type in a nested \`OR(AND(...), AND(...), AND(...))\` across the root, parent, and destination relation pairs: \`(resourceType, resourceId)\`, \`(parentResourceType, parentResourceId)\`, and \`(destinationResourceType, destinationResourceId)\`. Legacy and TablesDB databases use \`database\`; the operational \`resourceType\` of a table migration is not rewritten to \`tablesdb\`.

When restoring a DocumentsDB or VectorsDB database to a new resource from a dedicated source, the restore provisions a fresh dedicated backing database at the source database's own specification.
`)
  .requiredOption(`--archive-id <archive-id>`, `Backup archive ID to restore`)
  .requiredOption(`--services [services...]`, `Array of services to restore`)
  .option(`--new-resource-id <new-resource-id>`, `Destination resource ID. Omit to generate a new ID, or pass the archived resource ID to overwrite it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .option(`--new-resource-name <new-resource-name>`, `Database name. Max length: 128 chars.`)
  .action(
    actionRunner(
      async ({ archiveId, services, newResourceId, newResourceName }) =>
        parse(await (await getBackupsClient()).createRestoration(archiveId, services, newResourceId, newResourceName)),
    ),
  );


const backupsListRestorationsCommand = backups
  .command(`list-restorations`)
  .description(`List all backup restorations for a project.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
  .option(`--filter <expression>`, `Filter using a simple comparison expression. Repeat for multiple filters. Supports field=value, field!=value, field>value, field>=value, field<value, and field<=value.`, (value: string, previous: string[] | undefined) => collectQueryValue(parseFilterQuery(value), previous))
  .option(`--where <expression>`, `Deprecated. Use --filter instead. Filter using a simple comparison expression. Repeat for multiple filters.`, (value: string, previous: string[] | undefined) => collectQueryValue(parseDeprecatedWhereQuery(value), previous))
  .option(`--sort-asc <attribute>`, `Sort results by an attribute in ascending order. Repeat for multiple sort fields.`, (value: string, previous: string[] | undefined) => collectQueryValue(value, previous))
  .option(`--sort-desc <attribute>`, `Sort results by an attribute in descending order. Repeat for multiple sort fields.`, (value: string, previous: string[] | undefined) => collectQueryValue(value, previous))
  .option(`--limit <limit>`, `Maximum number of results to return.`, parseInteger)
  .option(`--offset <offset>`, `Number of results to skip.`, parseInteger)
  .option(`--cursor-after <id>`, `Return results after this cursor ID.`)
  .option(`--cursor-before <id>`, `Return results before this cursor ID.`)
  .action(
    actionRunner(
      async ({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }) =>
        parse(await (await getBackupsClient()).listRestorations(buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }))),
    ),
  );


const backupsGetRestorationCommand = backups
  .command(`get-restoration`)
  .description(`Get the current status of a backup restoration.`)
  .requiredOption(`--restoration-id <restoration-id>`, `Restoration ID. Choose a custom ID\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .action(
    actionRunner(
      async ({ restorationId }) =>
        parse(await (await getBackupsClient()).getRestoration(restorationId)),
    ),
  );


