import { Command } from "commander";
import { sdkForProject } from "../sdks.js";
import { parse, actionRunner, parseBool, commandDescriptions, } from "../parser.js";
import { Project } from "@appwrite.io/console";
let projectClient = null;
const getProjectClient = async () => {
    if (!projectClient) {
        const client = await sdkForProject();
        projectClient = new Project(client);
    }
    return projectClient;
};
export const project = new Command("project")
    .description(commandDescriptions["project"] ?? "")
    .configureHelp({
    helpWidth: process.stdout.columns || 80,
});
export const projectGetUsage = async ({ startDate, endDate, period, parseOutput = true, }) => {
    const response = await (await getProjectClient()).getUsage({
        startDate,
        endDate,
        period,
    });
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const projectListVariables = async ({ parseOutput = true, }) => {
    const response = await (await getProjectClient()).listVariables();
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const projectCreateVariable = async ({ key, value, secret, parseOutput = true, }) => {
    const response = await (await getProjectClient()).createVariable({
        key,
        value,
        secret,
    });
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const projectGetVariable = async ({ variableId, parseOutput = true, }) => {
    const response = await (await getProjectClient()).getVariable({ variableId });
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const projectUpdateVariable = async ({ variableId, key, value, secret, parseOutput = true, }) => {
    const response = await (await getProjectClient()).updateVariable({
        variableId,
        key,
        value,
        secret,
    });
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const projectDeleteVariable = async ({ variableId, parseOutput = true, }) => {
    const response = await (await getProjectClient()).deleteVariable({ variableId });
    if (parseOutput) {
        parse(response);
    }
    return response;
};
project
    .command(`get-usage`)
    .description(`Get comprehensive usage statistics for your project. View metrics including network requests, bandwidth, storage, function executions, database usage, and user activity. Specify a time range with startDate and endDate, and optionally set the data granularity with period (1h or 1d). The response includes both total counts and detailed breakdowns by resource, along with historical data over the specified period.`)
    .requiredOption(`--start-date <start-date>`, `Starting date for the usage`)
    .requiredOption(`--end-date <end-date>`, `End date for the usage`)
    .option(`--period <period>`, `Period used`)
    .action(actionRunner(projectGetUsage));
project
    .command(`list-variables`)
    .description(`Get a list of all project variables. These variables will be accessible in all Appwrite Functions at runtime.`)
    .action(actionRunner(projectListVariables));
project
    .command(`create-variable`)
    .description(`Create a new project variable. This variable will be accessible in all Appwrite Functions at runtime.`)
    .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
    .requiredOption(`--value <value>`, `Variable value. Max length: 8192 chars.`)
    .option(`--secret [value]`, `Secret variables can be updated or deleted, but only projects can read them during build and runtime.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectCreateVariable));
project
    .command(`get-variable`)
    .description(`Get a project variable by its unique ID.`)
    .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
    .action(actionRunner(projectGetVariable));
project
    .command(`update-variable`)
    .description(`Update project variable by its unique ID. This variable will be accessible in all Appwrite Functions at runtime.`)
    .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
    .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
    .option(`--value <value>`, `Variable value. Max length: 8192 chars.`)
    .option(`--secret [value]`, `Secret variables can be updated or deleted, but only projects can read them during build and runtime.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectUpdateVariable));
project
    .command(`delete-variable`)
    .description(`Delete a project variable by its unique ID. `)
    .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
    .action(actionRunner(projectDeleteVariable));
//# sourceMappingURL=project.js.map