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
import { Project } from "@appwrite.io/console";

let projectClient: Project | null = null;

const getProjectClient = async (): Promise<Project> => {
  if (!projectClient) {
    const sdkClient = await sdkForProject();
    projectClient = new Project(sdkClient);
  }
  return projectClient;
};

export const project = new Command("project")
  .description(commandDescriptions["project"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

project
  .command(`get-usage`)
  .description(`Get comprehensive usage statistics for your project. View metrics including network requests, bandwidth, storage, function executions, database usage, and user activity. Specify a time range with startDate and endDate, and optionally set the data granularity with period (1h or 1d). The response includes both total counts and detailed breakdowns by resource, along with historical data over the specified period.`)
  .requiredOption(`--start-date <start-date>`, `Starting date for the usage`)
  .requiredOption(`--end-date <end-date>`, `End date for the usage`)
  .option(`--period <period>`, `Period used`)
  .action(
    actionRunner(
      async ({ startDate, endDate, period }) =>
        parse(await (await getProjectClient()).getUsage(startDate, endDate, period)),
    ),
  );

project
  .command(`list-variables`)
  .description(`Get a list of all project variables. These variables will be accessible in all Appwrite Functions at runtime.`)
  .action(
    actionRunner(
      async () => parse(await (await getProjectClient()).listVariables()),
    ),
  );

project
  .command(`create-variable`)
  .description(`Create a new project variable. This variable will be accessible in all Appwrite Functions at runtime.`)
  .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
  .requiredOption(`--value <value>`, `Variable value. Max length: 8192 chars.`)
  .option(
    `--secret [value]`,
    `Secret variables can be updated or deleted, but only projects can read them during build and runtime.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ key, value, secret }) =>
        parse(await (await getProjectClient()).createVariable(key, value, secret)),
    ),
  );

project
  .command(`get-variable`)
  .description(`Get a project variable by its unique ID.`)
  .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
  .action(
    actionRunner(
      async ({ variableId }) =>
        parse(await (await getProjectClient()).getVariable(variableId)),
    ),
  );

project
  .command(`update-variable`)
  .description(`Update project variable by its unique ID. This variable will be accessible in all Appwrite Functions at runtime.`)
  .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
  .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
  .option(`--value <value>`, `Variable value. Max length: 8192 chars.`)
  .option(
    `--secret [value]`,
    `Secret variables can be updated or deleted, but only projects can read them during build and runtime.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ variableId, key, value, secret }) =>
        parse(await (await getProjectClient()).updateVariable(variableId, key, value, secret)),
    ),
  );

project
  .command(`delete-variable`)
  .description(`Delete a project variable by its unique ID. `)
  .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
  .action(
    actionRunner(
      async ({ variableId }) =>
        parse(await (await getProjectClient()).deleteVariable(variableId)),
    ),
  );

