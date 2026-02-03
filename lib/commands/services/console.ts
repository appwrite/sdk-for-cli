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
import { Console } from "@appwrite.io/console";

let consoleClient: Console | null = null;

const getConsoleClient = async (): Promise<Console> => {
  if (!consoleClient) {
    const sdkClient = await sdkForProject();
    consoleClient = new Console(sdkClient);
  }
  return consoleClient;
};

export const console = new Command("console")
  .description(commandDescriptions["console"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

console
  .command(`get-campaign`)
  .description(`Receive the details of a campaign using its ID.`)
  .requiredOption(`--campaign-id <campaign-id>`, `ID of the campaign`)
  .action(
    actionRunner(
      async ({ campaignId }) =>
        parse(await (await getConsoleClient()).getCampaign(campaignId)),
    ),
  );

console
  .command(`get-coupon`)
  .description(`Get the details of a coupon using it's coupon ID.`)
  .requiredOption(`--coupon-id <coupon-id>`, `ID of the coupon`)
  .action(
    actionRunner(
      async ({ couponId }) =>
        parse(await (await getConsoleClient()).getCoupon(couponId)),
    ),
  );

console
  .command(`get-plans`)
  .description(`Return a list of all available plans.`)
  .option(`--platform <platform>`, `Platform type`)
  .action(
    actionRunner(
      async ({ platform }) =>
        parse(await (await getConsoleClient()).getPlans(platform)),
    ),
  );

console
  .command(`get-plan`)
  .description(`Get the details of a plan using its plan ID.`)
  .requiredOption(`--plan-id <plan-id>`, `Plan id`)
  .action(
    actionRunner(
      async ({ planId }) =>
        parse(await (await getConsoleClient()).getPlan(planId)),
    ),
  );

console
  .command(`get-program`)
  .description(`Receive the details of a program using its ID.`)
  .requiredOption(`--program-id <program-id>`, `ID of the program`)
  .action(
    actionRunner(
      async ({ programId }) =>
        parse(await (await getConsoleClient()).getProgram(programId)),
    ),
  );

console
  .command(`create-program-membership`)
  .description(`Create a new membership for an account to a program.`)
  .requiredOption(`--program-id <program-id>`, `ID of the program`)
  .action(
    actionRunner(
      async ({ programId }) =>
        parse(await (await getConsoleClient()).createProgramMembership(programId)),
    ),
  );

console
  .command(`list-regions`)
  .description(`Get all available regions for the console.`)
  .action(
    actionRunner(
      async () => parse(await (await getConsoleClient()).listRegions()),
    ),
  );

console
  .command(`get-resource`)
  .description(`Check if a resource ID is available.`)
  .requiredOption(`--value <value>`, `Resource value.`)
  .requiredOption(`--type <type>`, `Resource type.`)
  .action(
    actionRunner(
      async ({ value, type }) =>
        parse(await (await getConsoleClient()).getResource(value, type)),
    ),
  );

console
  .command(`create-source`)
  .description(`Create a new source.`)
  .option(`--ref <ref>`, `Ref param`)
  .option(`--referrer <referrer>`, `Referrer`)
  .option(`--utm-source <utm-source>`, `Utm source`)
  .option(`--utm-campaign <utm-campaign>`, `Utm campaign`)
  .option(`--utm-medium <utm-medium>`, `Utm medium`)
  .action(
    actionRunner(
      async ({ ref, referrer, utmSource, utmCampaign, utmMedium }) =>
        parse(await (await getConsoleClient()).createSource(ref, referrer, utmSource, utmCampaign, utmMedium)),
    ),
  );

console
  .command(`suggest-columns`)
  .description(`Suggests column names and their size limits based on the provided table name. The API will also analyze other tables in the same database to provide context-aware suggestions, ensuring consistency across schema design. Users may optionally provide custom context to further refine the suggestions.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .option(`--context <context>`, `Optional user provided context to refine suggestions.`)
  .option(`--min <min>`, `Minimum number of suggestions to generate.`, parseInteger)
  .option(`--max <max>`, `Maximum number of suggestions to generate.`, parseInteger)
  .action(
    actionRunner(
      async ({ databaseId, tableId, context, min, max }) =>
        parse(await (await getConsoleClient()).suggestColumns(databaseId, tableId, context, min, max)),
    ),
  );

console
  .command(`suggest-indexes`)
  .description(`Suggests database indexes for table columns based on the provided table structure and existing columns. The API will also analyze the table's column types, names, and patterns to recommend optimal indexes that improve query performance for common database operations like filtering, sorting, and searching.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--table-id <table-id>`, `Table ID.`)
  .option(`--min <min>`, `Minimum number of suggestions to generate.`, parseInteger)
  .option(`--max <max>`, `Maximum number of suggestions to generate.`, parseInteger)
  .action(
    actionRunner(
      async ({ databaseId, tableId, min, max }) =>
        parse(await (await getConsoleClient()).suggestIndexes(databaseId, tableId, min, max)),
    ),
  );

console
  .command(`variables`)
  .description(`Get all Environment Variables that are relevant for the console.`)
  .action(
    actionRunner(
      async () => parse(await (await getConsoleClient()).variables()),
    ),
  );

