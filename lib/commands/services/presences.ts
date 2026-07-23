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
  parseJsonObject,
} from "../../parser.js";
import { Presences } from "@appwrite.io/console";

let presencesClient: Presences | null = null;

const getPresencesClient = async (): Promise<Presences> => {
  if (!presencesClient) {
    const sdkClient = await sdkForProject();
    presencesClient = new Presences(sdkClient);
  }
  return presencesClient;
};

export const presences = new Command("presences")
  .description(commandDescriptions["presences"] || "The Presences service allows you to track and manage real-time user presence in your project.")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

const presencesListCommand = presences
  .command(`list`)
  .description(`List presence logs. Expired entries are filtered out automatically.
`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--ttl <ttl>`, `TTL (seconds) for caching list responses. Responses are stored in an in-memory key-value cache, keyed per project, collection, schema version (attributes and indexes), caller authorization roles, and the exact query — so users with different permissions never share cached entries. Schema changes invalidate cached entries automatically; document writes do not, so choose a TTL you are comfortable serving as stale data. Set to 0 to disable caching. Must be between 0 and 86400 (24 hours).`, parseInteger)
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
      async ({ queries, total, ttl, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }) =>
        parse(await (await getPresencesClient()).list(buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }), total, ttl)),
    ),
  );


const presencesGetUsageCommand = presences
  .command(`get-usage`)
  .description(`Get presence usage metrics, including the current total of online users and historical online user counts for the selected time range.
`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ range }) =>
        parse(await (await getPresencesClient()).getUsage(range)),
    ),
  );


const presencesGetCommand = presences
  .command(`get`)
  .description(`Get a presence log by its unique ID. Entries whose \`expiresAt\` is in the past are treated as not found.
`)
  .requiredOption(`--presence-id <presence-id>`, `Presence unique ID.`)
  .action(
    actionRunner(
      async ({ presenceId }) =>
        parse(await (await getPresencesClient()).get(presenceId)),
    ),
  );


const presencesUpsertCommand = presences
  .command(`upsert`)
  .description(`Create or update a presence log by its user ID.
`)
  .requiredOption(`--presence-id <presence-id>`, `Presence unique ID.`)
  .requiredOption(`--status <status>`, `Presence status.`)
  .option(`--permissions [permissions...]`, `An array of permissions strings. By default, only the current user is granted all permissions. Learn more about permissions (https://appwrite.io/docs/permissions).`)
  .option(`--expires-at <expires-at>`, `Presence expiry datetime.`)
  .option(`--metadata <metadata>`, `Presence metadata object.`)
  .action(
    actionRunner(
      async ({ presenceId, status, permissions, expiresAt, metadata }) =>
        parse(await (await getPresencesClient()).upsert(presenceId, status, permissions, expiresAt, parseJsonObject(metadata, "--metadata"))),
    ),
  );


const presencesUpdateCommand = presences
  .command(`update`)
  .description(`Update a presence log by its unique ID. Using the patch method you can pass only specific fields that will get updated.
`)
  .requiredOption(`--presence-id <presence-id>`, `Presence unique ID.`)
  .option(`--status <status>`, `Presence status.`)
  .option(`--expires-at <expires-at>`, `Presence expiry datetime.`)
  .option(`--metadata <metadata>`, `Presence metadata object.`)
  .option(`--permissions [permissions...]`, `An array of permissions strings. By default, only the current user is granted all permissions. Learn more about permissions (https://appwrite.io/docs/permissions).`)
  .option(
    `--purge [value]`,
    `When true, purge cached responses used by list presences endpoint.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ presenceId, status, expiresAt, metadata, permissions, purge }) =>
        parse(await (await getPresencesClient()).update(presenceId, status, expiresAt, parseJsonObject(metadata, "--metadata"), permissions, purge)),
    ),
  );


const presencesDeleteCommand = presences
  .command(`delete`)
  .description(`Delete a presence log by its unique ID.
`)
  .requiredOption(`--presence-id <presence-id>`, `Presence unique ID.`)
  .action(
    actionRunner(
      async ({ presenceId }) =>
        parse(await (await getPresencesClient()).delete(presenceId)),
    ),
  );


