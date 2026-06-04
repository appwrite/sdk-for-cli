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
import { Organization } from "@appwrite.io/console";

let organizationClient: Organization | null = null;

const getOrganizationClient = async (): Promise<Organization> => {
  if (!organizationClient) {
    const sdkClient = await sdkForProject();
    organizationClient = new Organization(sdkClient);
  }
  return organizationClient;
};

export const organization = new Command("organization")
  .description(commandDescriptions["organization"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

const organizationListKeysCommand = organization
  .command(`list-keys`)
  .description(`Get a list of all API keys from the current organization.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: expire, accessedAt, name, scopes`)
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
        parse(await (await getOrganizationClient()).listKeys(buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }), total)),
    ),
  );


const organizationCreateKeyCommand = organization
  .command(`create-key`)
  .description(`Create a new organization API key.`)
  .requiredOption(`--key-id <key-id>`, `Key ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
  .requiredOption(`--scopes [scopes...]`, `Key scopes list. Maximum of 100 scopes are allowed.`)
  .option(`--expire <expire>`, `Expiration time in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.`)
  .action(
    actionRunner(
      async ({ keyId, name, scopes, expire }) =>
        parse(await (await getOrganizationClient()).createKey(keyId, name, scopes, expire)),
    ),
  );


const organizationGetKeyCommand = organization
  .command(`get-key`)
  .description(`Get a key by its unique ID. This endpoint returns details about a specific API key in your organization including its scopes.`)
  .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
  .action(
    actionRunner(
      async ({ keyId }) =>
        parse(await (await getOrganizationClient()).getKey(keyId)),
    ),
  );


const organizationUpdateKeyCommand = organization
  .command(`update-key`)
  .description(`Update a key by its unique ID. Use this endpoint to update the name, scopes, or expiration time of an API key.`)
  .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
  .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
  .requiredOption(`--scopes [scopes...]`, `Key scopes list. Maximum of 100 scopes are allowed.`)
  .option(`--expire <expire>`, `Expiration time in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.`)
  .action(
    actionRunner(
      async ({ keyId, name, scopes, expire }) =>
        parse(await (await getOrganizationClient()).updateKey(keyId, name, scopes, expire)),
    ),
  );


const organizationDeleteKeyCommand = organization
  .command(`delete-key`)
  .description(`Delete a key by its unique ID. Once deleted, the key can no longer be used to authenticate API calls.`)
  .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
  .action(
    actionRunner(
      async ({ keyId }) =>
        parse(await (await getOrganizationClient()).deleteKey(keyId)),
    ),
  );


const organizationListProjectsCommand = organization
  .command(`list-projects`)
  .description(`Get a list of all projects. You can use the query params to filter your results.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, teamId, labels, search`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
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
      async ({ queries, search, total, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }) =>
        parse(await (await getOrganizationClient()).listProjects(buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }), search, total)),
    ),
  );


const organizationCreateProjectCommand = organization
  .command(`create-project`)
  .description(`Create a new project.`)
  .requiredOption(`--project-id <project-id>`, `Unique Id. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, and hyphen. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Project name. Max length: 128 chars.`)
  .option(`--region <region>`, `Project Region.`)
  .action(
    actionRunner(
      async ({ projectId, name, region }) =>
        parse(await (await getOrganizationClient()).createProject(projectId, name, region)),
    ),
  );


const organizationGetProjectCommand = organization
  .command(`get-project`)
  .description(`Get a project.`)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .action(
    actionRunner(
      async ({ projectId }) =>
        parse(await (await getOrganizationClient()).getProject(projectId)),
    ),
  );


const organizationUpdateProjectCommand = organization
  .command(`update-project`)
  .description(`Update a project by its unique ID.`)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--name <name>`, `Project name. Max length: 128 chars.`)
  .action(
    actionRunner(
      async ({ projectId, name }) =>
        parse(await (await getOrganizationClient()).updateProject(projectId, name)),
    ),
  );


const organizationDeleteProjectCommand = organization
  .command(`delete-project`)
  .description(`Delete a project by its unique ID.`)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .action(
    actionRunner(
      async ({ projectId }) =>
        parse(await (await getOrganizationClient()).deleteProject(projectId)),
    ),
  );


