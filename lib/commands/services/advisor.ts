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
import { Advisor } from "@appwrite.io/console";

let advisorClient: Advisor | null = null;

const getAdvisorClient = async (): Promise<Advisor> => {
  if (!advisorClient) {
    const sdkClient = await sdkForProject();
    advisorClient = new Advisor(sdkClient);
  }
  return advisorClient;
};

export const advisor = new Command("advisor")
  .description(commandDescriptions["advisor"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

const advisorListReportsCommand = advisor
  .command(`list-reports`)
  .description(`Get a list of all the project's analyzer reports. You can use the query params to filter your results.
`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: appId, type, targetType, target, analyzedAt`)
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
        parse(await (await getAdvisorClient()).listReports(buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }), total)),
    ),
  );


const advisorGetReportCommand = advisor
  .command(`get-report`)
  .description(`Get an analyzer report by its unique ID. The response includes the report's metadata and the nested insights it produced.
`)
  .requiredOption(`--report-id <report-id>`, `Report ID.`)
  .action(
    actionRunner(
      async ({ reportId }) =>
        parse(await (await getAdvisorClient()).getReport(reportId)),
    ),
  );


const advisorDeleteReportCommand = advisor
  .command(`delete-report`)
  .description(`Delete an analyzer report by its unique ID. Nested insights and CTA metadata are removed asynchronously by the deletes worker.
`)
  .requiredOption(`--report-id <report-id>`, `Report ID.`)
  .action(
    actionRunner(
      async ({ reportId }) =>
        parse(await (await getAdvisorClient()).deleteReport(reportId)),
    ),
  );


const advisorListInsightsCommand = advisor
  .command(`list-insights`)
  .description(`List the insights produced under a single analyzer report. You can use the query params to filter your results further.
`)
  .requiredOption(`--report-id <report-id>`, `Parent report ID.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: type, severity, status, resourceType, resourceId, parentResourceType, parentResourceId, analyzedAt, dismissedAt, dismissedBy`)
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
      async ({ reportId, queries, total, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }) =>
        parse(await (await getAdvisorClient()).listInsights(reportId, buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }), total)),
    ),
  );


const advisorGetInsightCommand = advisor
  .command(`get-insight`)
  .description(`Get an insight by its unique ID, scoped to its parent report.
`)
  .requiredOption(`--report-id <report-id>`, `Parent report ID.`)
  .requiredOption(`--insight-id <insight-id>`, `Insight ID.`)
  .action(
    actionRunner(
      async ({ reportId, insightId }) =>
        parse(await (await getAdvisorClient()).getInsight(reportId, insightId)),
    ),
  );


