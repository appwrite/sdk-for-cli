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
import { Usage } from "@appwrite.io/console";

let usageClient: Usage | null = null;

const getUsageClient = async (): Promise<Usage> => {
  if (!usageClient) {
    const sdkClient = await sdkForProject();
    usageClient = new Usage(sdkClient);
  }
  return usageClient;
};

export const usage = new Command("usage")
  .description(commandDescriptions["usage"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

const usageListEventsCommand = usage
  .command(`list-events`)
  .description(`Query usage event metrics from the usage database. Returns individual event rows with full metadata. Pass Query objects as JSON strings to filter, paginate, and order results. Supported query methods: equal, greaterThanEqual, lessThanEqual, orderAsc, orderDesc, limit, offset. Supported filter attributes: metric, path, method, status, resource, resourceId, country, userAgent, time (these match the underlying column names — note that the response surfaces \`resource\` as \`resourceType\` and \`country\` as \`countryCode\`). When no time filter is supplied the endpoint defaults to the last 7 days. Default \`limit(100)\` is applied if none is given; user-supplied limits are capped at 500. The \`total\` field is capped at 5000 to keep counts predictable — pass \`total=false\` to skip the count entirely.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings as JSON. Supported: equal("metric", [...]), equal("path", [...]), equal("method", [...]), equal("status", [...]), equal("resource", [...]), equal("resourceId", [...]), equal("country", [...]), equal("userAgent", [...]), greaterThanEqual("time", "..."), lessThanEqual("time", "..."), orderAsc("time"), orderDesc("time"), limit(N), offset(N).`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
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
      async ({ queries, total, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }) =>
        parse(await (await getUsageClient()).listEvents(buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }), total)),
    ),
  );


const usageListGaugesCommand = usage
  .command(`list-gauges`)
  .description(`Query usage gauge metrics (point-in-time resource snapshots) from the usage database. Returns individual gauge snapshots with metric, value, and timestamp. Pass Query objects as JSON strings to filter, paginate, and order results. Supported query methods: equal, greaterThanEqual, lessThanEqual, orderAsc, orderDesc, limit, offset. Supported filter attributes: metric, time. Use \`orderDesc("time"), limit(1)\` to fetch the most recent snapshot. When no time filter is supplied the endpoint defaults to the last 7 days. Default \`limit(100)\` is applied if none is given; user-supplied limits are capped at 500. The \`total\` field is capped at 5000 to keep counts predictable — pass \`total=false\` to skip the count entirely.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings as JSON. Supported: equal("metric", [...]), greaterThanEqual("time", "..."), lessThanEqual("time", "..."), orderAsc("time"), orderDesc("time"), limit(N), offset(N).`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
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
      async ({ queries, total, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }) =>
        parse(await (await getUsageClient()).listGauges(buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }), total)),
    ),
  );


