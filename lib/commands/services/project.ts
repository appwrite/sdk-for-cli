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

const projectUpdateLabelsCommand = project
  .command(`update-labels`)
  .description(`Update the project labels. Labels can be used to easily filter projects in an organization.`)
  .requiredOption(`--labels [labels...]`, `Array of project labels. Replaces the previous labels. Maximum of 1000 labels are allowed, each up to 36 alphanumeric characters long.`)
  .action(
    actionRunner(
      async ({ labels }) =>
        parse(await (await getProjectClient()).updateLabels(labels)),
    ),
  );


const projectGetUsageCommand = project
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


const projectListVariablesCommand = project
  .command(`list-variables`)
  .description(`Get a list of all project environment variables.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, resourceType, resourceId, secret`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ queries, total }) =>
        parse(await (await getProjectClient()).listVariables(queries, total)),
    ),
  );


const projectCreateVariableCommand = project
  .command(`create-variable`)
  .description(`Create a new project environment variable. These variables can be accessed by all functions and sites in the project.`)
  .requiredOption(`--variable-id <variable-id>`, `Variable ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
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
      async ({ variableId, key, value, secret }) =>
        parse(await (await getProjectClient()).createVariable(variableId, key, value, secret)),
    ),
  );


const projectGetVariableCommand = project
  .command(`get-variable`)
  .description(`Get a variable by its unique ID. `)
  .requiredOption(`--variable-id <variable-id>`, `Variable ID.`)
  .action(
    actionRunner(
      async ({ variableId }) =>
        parse(await (await getProjectClient()).getVariable(variableId)),
    ),
  );


const projectUpdateVariableCommand = project
  .command(`update-variable`)
  .description(`Update variable by its unique ID.`)
  .requiredOption(`--variable-id <variable-id>`, `Variable ID.`)
  .option(`--key <key>`, `Variable key. Max length: 255 chars.`)
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


const projectDeleteVariableCommand = project
  .command(`delete-variable`)
  .description(`Delete a variable by its unique ID. `)
  .requiredOption(`--variable-id <variable-id>`, `Variable ID.`)
  .action(
    actionRunner(
      async ({ variableId }) =>
        parse(await (await getProjectClient()).deleteVariable(variableId)),
    ),
  );


