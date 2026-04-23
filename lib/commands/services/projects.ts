import { Command } from "commander";
import { sdkForConsole } from "../../sdks.js";
import {
  actionRunner,
  commandDescriptions,
  success,
  parse,
  parseBool,
  parseInteger,
} from "../../parser.js";
import { Projects } from "@appwrite.io/console";

let projectsClient: Projects | null = null;

const getProjectsClient = async (): Promise<Projects> => {
  if (!projectsClient) {
    const sdkClient = await sdkForConsole();
    projectsClient = new Projects(sdkClient);
  }
  return projectsClient;
};

export const projects = new Command("projects")
  .description(commandDescriptions["projects"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

const projectsListCommand = projects
  .command(`list`)
  .description(`Get a list of all projects. You can use the query params to filter your results. `)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, teamId, labels, search`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ queries, search, total }) =>
        parse(await (await getProjectsClient()).list(queries, search, total)),
    ),
  );

(projectsListCommand as Command & { outputFields?: string[] }).outputFields = ["name", "$id", "region", "status"];

const projectsCreateCommand = projects
  .command(`create`)
  .description(`Create a new project. You can create a maximum of 100 projects per account. `)
  .requiredOption(`--project-id <project-id>`, `Unique Id. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, and hyphen. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Project name. Max length: 128 chars.`)
  .requiredOption(`--team-id <team-id>`, `Team unique ID.`)
  .option(`--region <region>`, `Project Region.`)
  .option(`--description <description>`, `Project description. Max length: 256 chars.`)
  .option(`--logo <logo>`, `Project logo.`)
  .option(`--url <url>`, `Project URL.`)
  .option(`--legal-name <legal-name>`, `Project legal Name. Max length: 256 chars.`)
  .option(`--legal-country <legal-country>`, `Project legal Country. Max length: 256 chars.`)
  .option(`--legal-state <legal-state>`, `Project legal State. Max length: 256 chars.`)
  .option(`--legal-city <legal-city>`, `Project legal City. Max length: 256 chars.`)
  .option(`--legal-address <legal-address>`, `Project legal Address. Max length: 256 chars.`)
  .option(`--legal-tax-id <legal-tax-id>`, `Project legal Tax ID. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ projectId, name, teamId, region, description, logo, url, legalName, legalCountry, legalState, legalCity, legalAddress, legalTaxId }) =>
        parse(await (await getProjectsClient()).create(projectId, name, teamId, region, description, logo, url, legalName, legalCountry, legalState, legalCity, legalAddress, legalTaxId)),
    ),
  );


const projectsGetCommand = projects
  .command(`get`)
  .description(`Get a project by its unique ID. This endpoint allows you to retrieve the project's details, including its name, description, team, region, and other metadata. `)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .action(
    actionRunner(
      async ({ projectId }) =>
        parse(await (await getProjectsClient()).get(projectId)),
    ),
  );


const projectsUpdateCommand = projects
  .command(`update`)
  .description(`Update a project by its unique ID.`)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--name <name>`, `Project name. Max length: 128 chars.`)
  .option(`--description <description>`, `Project description. Max length: 256 chars.`)
  .option(`--logo <logo>`, `Project logo.`)
  .option(`--url <url>`, `Project URL.`)
  .option(`--legal-name <legal-name>`, `Project legal name. Max length: 256 chars.`)
  .option(`--legal-country <legal-country>`, `Project legal country. Max length: 256 chars.`)
  .option(`--legal-state <legal-state>`, `Project legal state. Max length: 256 chars.`)
  .option(`--legal-city <legal-city>`, `Project legal city. Max length: 256 chars.`)
  .option(`--legal-address <legal-address>`, `Project legal address. Max length: 256 chars.`)
  .option(`--legal-tax-id <legal-tax-id>`, `Project legal tax ID. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ projectId, name, description, logo, url, legalName, legalCountry, legalState, legalCity, legalAddress, legalTaxId }) =>
        parse(await (await getProjectsClient()).update(projectId, name, description, logo, url, legalName, legalCountry, legalState, legalCity, legalAddress, legalTaxId)),
    ),
  );


const projectsDeleteCommand = projects
  .command(`delete`)
  .description(`Delete a project by its unique ID.`)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .action(
    actionRunner(
      async ({ projectId }) =>
        parse(await (await getProjectsClient()).delete(projectId)),
    ),
  );


const projectsListDevKeysCommand = projects
  .command(`list-dev-keys`)
  .description(`List all the project\'s dev keys. Dev keys are project specific and allow you to bypass rate limits and get better error logging during development.'`)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: accessedAt, expire`)
  .action(
    actionRunner(
      async ({ projectId, queries }) =>
        parse(await (await getProjectsClient()).listDevKeys(projectId, queries)),
    ),
  );


const projectsCreateDevKeyCommand = projects
  .command(`create-dev-key`)
  .description(`Create a new project dev key. Dev keys are project specific and allow you to bypass rate limits and get better error logging during development. Strictly meant for development purposes only.`)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
  .requiredOption(`--expire <expire>`, `Expiration time in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format.`)
  .action(
    actionRunner(
      async ({ projectId, name, expire }) =>
        parse(await (await getProjectsClient()).createDevKey(projectId, name, expire)),
    ),
  );


const projectsGetDevKeyCommand = projects
  .command(`get-dev-key`)
  .description(`Get a project\'s dev key by its unique ID. Dev keys are project specific and allow you to bypass rate limits and get better error logging during development.`)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, keyId }) =>
        parse(await (await getProjectsClient()).getDevKey(projectId, keyId)),
    ),
  );


const projectsUpdateDevKeyCommand = projects
  .command(`update-dev-key`)
  .description(`Update a project\'s dev key by its unique ID. Use this endpoint to update a project\'s dev key name or expiration time.'`)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
  .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
  .requiredOption(`--expire <expire>`, `Expiration time in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format.`)
  .action(
    actionRunner(
      async ({ projectId, keyId, name, expire }) =>
        parse(await (await getProjectsClient()).updateDevKey(projectId, keyId, name, expire)),
    ),
  );


const projectsDeleteDevKeyCommand = projects
  .command(`delete-dev-key`)
  .description(`Delete a project\'s dev key by its unique ID. Once deleted, the key will no longer allow bypassing of rate limits and better logging of errors.`)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, keyId }) =>
        parse(await (await getProjectsClient()).deleteDevKey(projectId, keyId)),
    ),
  );


const projectsCreateJWTCommand = projects
  .command(`create-jwt`)
  .description(`Create a new JWT token. This token can be used to authenticate users with custom scopes and expiration time. `)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--scopes [scopes...]`, `List of scopes allowed for JWT key. Maximum of 100 scopes are allowed.`)
  .option(`--duration <duration>`, `Time in seconds before JWT expires. Default duration is 900 seconds, and maximum is 3600 seconds.`, parseInteger)
  .action(
    actionRunner(
      async ({ projectId, scopes, duration }) =>
        parse(await (await getProjectsClient()).createJWT(projectId, scopes, duration)),
    ),
  );


const projectsUpdateOAuth2Command = projects
  .command(`update-o-auth-2`)
  .description(`Update the OAuth2 provider configurations. Use this endpoint to set up or update the OAuth2 provider credentials or enable/disable providers. `)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--provider <provider>`, `Provider Name`)
  .option(`--app-id <app-id>`, `Provider app ID. Max length: 256 chars.`)
  .option(`--secret <secret>`, `Provider secret key. Max length: 512 chars.`)
  .option(
    `--enabled [value]`,
    `Provider status. Set to 'false' to disable new session creation.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ projectId, provider, appId, secret, enabled }) =>
        parse(await (await getProjectsClient()).updateOAuth2(projectId, provider, appId, secret, enabled)),
    ),
  );


const projectsListSchedulesCommand = projects
  .command(`list-schedules`)
  .description(`Get a list of all the project's schedules. You can use the query params to filter your results.`)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: resourceType, resourceId, projectId, schedule, active, region`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ projectId, queries, total }) =>
        parse(await (await getProjectsClient()).listSchedules(projectId, queries, total)),
    ),
  );


const projectsCreateScheduleCommand = projects
  .command(`create-schedule`)
  .description(`Create a new schedule for a resource.`)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--resource-type <resource-type>`, `The resource type for the schedule. Possible values: function, execution, message, backup.`)
  .requiredOption(`--resource-id <resource-id>`, `The resource ID to associate with this schedule.`)
  .requiredOption(`--schedule <schedule>`, `Schedule CRON expression.`)
  .option(
    `--active [value]`,
    `Whether the schedule is active.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--data <data>`, `Schedule data as a JSON string. Used to store resource-specific context needed for execution.`)
  .action(
    actionRunner(
      async ({ projectId, resourceType, resourceId, schedule, active, data }) =>
        parse(await (await getProjectsClient()).createSchedule(projectId, resourceType, resourceId, schedule, active, JSON.parse(data))),
    ),
  );


const projectsGetScheduleCommand = projects
  .command(`get-schedule`)
  .description(`Get a schedule by its unique ID.`)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--schedule-id <schedule-id>`, `Schedule ID.`)
  .action(
    actionRunner(
      async ({ projectId, scheduleId }) =>
        parse(await (await getProjectsClient()).getSchedule(projectId, scheduleId)),
    ),
  );


const projectsUpdateStatusCommand = projects
  .command(`update-status`)
  .description(`Update the status of a project. Can be used to archive/restore projects, and to restore paused projects. When restoring a paused project, the console fingerprint header must be provided and the project must not be blocked for any reason other than inactivity.
`)
  .requiredOption(`--project-id <project-id>`, `Project ID`)
  .requiredOption(`--status <status>`, `New status for the project`)
  .action(
    actionRunner(
      async ({ projectId, status }) =>
        parse(await (await getProjectsClient()).updateStatus(projectId, status)),
    ),
  );


const projectsUpdateTeamCommand = projects
  .command(`update-team`)
  .description(`Update the team ID of a project allowing for it to be transferred to another team.`)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--team-id <team-id>`, `Team ID of the team to transfer project to.`)
  .action(
    actionRunner(
      async ({ projectId, teamId }) =>
        parse(await (await getProjectsClient()).updateTeam(projectId, teamId)),
    ),
  );


