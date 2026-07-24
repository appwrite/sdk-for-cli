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
import { Apps } from "@appwrite.io/console";

let appsClient: Apps | null = null;

const getAppsClient = async (): Promise<Apps> => {
  if (!appsClient) {
    const sdkClient = await sdkForProject();
    appsClient = new Apps(sdkClient);
  }
  return appsClient;
};

export const apps = new Command("apps")
  .description(commandDescriptions["apps"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

const appsListCommand = apps
  .command(`list`)
  .description(`List applications.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
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
        parse(await (await getAppsClient()).list(buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }), total)),
    ),
  );


const appsCreateCommand = apps
  .command(`create`)
  .description(`Create a new application.`)
  .requiredOption(`--app-id <app-id>`, `Application ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Application name.`)
  .requiredOption(`--redirect-uris [redirect-uris...]`, `Redirect URIs. Each must be an https URL, an http loopback URL (localhost, 127.0.0.1, [::1]), or a private-use scheme URI (e.g. com.example.app:/oauth), and must not contain a fragment.`)
  .option(`--description <description>`, `Application description shown to users during OAuth2 consent.`)
  .option(`--client-uri <client-uri>`, `Application homepage URL shown to users during OAuth2 consent.`)
  .option(`--logo-uri <logo-uri>`, `Application logo URL shown to users during OAuth2 consent.`)
  .option(`--privacy-policy-url <privacy-policy-url>`, `Application privacy policy URL shown to users during OAuth2 consent.`)
  .option(`--terms-url <terms-url>`, `Application terms of service URL shown to users during OAuth2 consent.`)
  .option(`--contacts [contacts...]`, `Application support or security contact emails. Maximum of 100 contacts are allowed.`)
  .option(`--tagline <tagline>`, `Application tagline shown to users during OAuth2 consent.`)
  .option(`--tags [tags...]`, `Application tags shown to users during OAuth2 consent. Maximum of 100 tags are allowed, each up to 64 characters long.`)
  .option(`--images [images...]`, `Application image URLs shown to users during OAuth2 consent. Maximum of 100 images are allowed.`)
  .option(`--support-url <support-url>`, `Application support URL shown to users during OAuth2 consent.`)
  .option(`--data-deletion-url <data-deletion-url>`, `Application data deletion URL shown to users during OAuth2 consent.`)
  .option(`--post-logout-redirect-uris [post-logout-redirect-uris...]`, `Post-logout redirect URIs for OpenID Connect RP-Initiated Logout. Each must be an https URL, an http loopback URL, or a private-use scheme URI, and must not contain a fragment. After ending the user session, the logout endpoint only redirects to URIs in this list.`)
  .option(
    `--enabled [value]`,
    `Is application enabled?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--type <type>`, `OAuth2 client type. Use \`public\` for SPAs, mobile, and native apps that cannot keep a \`client_secret\` — PKCE is then required at the token endpoint. Use \`confidential\` for server-side clients that present a \`client_secret\`. Defaults to \`confidential\`.`)
  .option(
    `--device-flow [value]`,
    `Allow this client to use the OAuth2 Device Authorization Grant (RFC 8628) for input-constrained devices such as TVs and CLIs. Defaults to false.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--team-id <team-id>`, `Team unique ID.`)
  .action(
    actionRunner(
      async ({ appId, name, redirectUris, description, clientUri, logoUri, privacyPolicyUrl, termsUrl, contacts, tagline, tags, images, supportUrl, dataDeletionUrl, postLogoutRedirectUris, enabled, type, deviceFlow, teamId }) =>
        parse(await (await getAppsClient()).create(appId, name, redirectUris, description, clientUri, logoUri, privacyPolicyUrl, termsUrl, contacts, tagline, tags, images, supportUrl, dataDeletionUrl, postLogoutRedirectUris, enabled, type, deviceFlow, teamId)),
    ),
  );


const appsListInstallationScopesCommand = apps
  .command(`list-installation-scopes`)
  .description(`List scopes an application can request when installed on a team.`)
  .action(
    actionRunner(
      async () => parse(await (await getAppsClient()).listInstallationScopes()),
    ),
  );


const appsListOAuth2ScopesCommand = apps
  .command(`list-o-auth-2-scopes`)
  .description(`List scopes an application can request during the OAuth2 flow.`)
  .action(
    actionRunner(
      async () => parse(await (await getAppsClient()).listOAuth2Scopes()),
    ),
  );


const appsGetCommand = apps
  .command(`get`)
  .description(`Get an application by its unique ID.`)
  .requiredOption(`--app-id <app-id>`, `Application unique ID or HTTPS client ID metadata document URL.`)
  .action(
    actionRunner(
      async ({ appId }) =>
        parse(await (await getAppsClient()).get(appId)),
    ),
  );


const appsUpdateCommand = apps
  .command(`update`)
  .description(`Update an application by its unique ID.`)
  .requiredOption(`--app-id <app-id>`, `Application unique ID.`)
  .requiredOption(`--name <name>`, `Application name.`)
  .option(`--description <description>`, `Application description shown to users during OAuth2 consent.`)
  .option(`--client-uri <client-uri>`, `Application homepage URL shown to users during OAuth2 consent.`)
  .option(`--logo-uri <logo-uri>`, `Application logo URL shown to users during OAuth2 consent.`)
  .option(`--privacy-policy-url <privacy-policy-url>`, `Application privacy policy URL shown to users during OAuth2 consent.`)
  .option(`--terms-url <terms-url>`, `Application terms of service URL shown to users during OAuth2 consent.`)
  .option(`--contacts [contacts...]`, `Application support or security contact emails. Maximum of 100 contacts are allowed.`)
  .option(`--tagline <tagline>`, `Application tagline shown to users during OAuth2 consent.`)
  .option(`--tags [tags...]`, `Application tags shown to users during OAuth2 consent. Maximum of 100 tags are allowed, each up to 64 characters long.`)
  .option(`--images [images...]`, `Application image URLs shown to users during OAuth2 consent. Maximum of 100 images are allowed.`)
  .option(`--support-url <support-url>`, `Application support URL shown to users during OAuth2 consent.`)
  .option(`--data-deletion-url <data-deletion-url>`, `Application data deletion URL shown to users during OAuth2 consent.`)
  .option(
    `--enabled [value]`,
    `Is application enabled?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--redirect-uris [redirect-uris...]`, `Redirect URIs. Each must be an https URL, an http loopback URL (localhost, 127.0.0.1, [::1]), or a private-use scheme URI (e.g. com.example.app:/oauth), and must not contain a fragment.`)
  .option(`--post-logout-redirect-uris [post-logout-redirect-uris...]`, `Post-logout redirect URIs for OpenID Connect RP-Initiated Logout. Each must be an https URL, an http loopback URL, or a private-use scheme URI, and must not contain a fragment. After ending the user session, the logout endpoint only redirects to URIs in this list.`)
  .option(`--type <type>`, `OAuth2 client type. Use \`public\` for SPAs, mobile, and native apps that cannot keep a \`client_secret\` — PKCE is then required at the token endpoint. Use \`confidential\` for server-side clients that present a \`client_secret\`. Defaults to \`confidential\`.`)
  .option(
    `--device-flow [value]`,
    `Allow this client to use the OAuth2 Device Authorization Grant (RFC 8628) for input-constrained devices such as TVs and CLIs. Defaults to false.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--installation-scopes [installation-scopes...]`, `Scopes the application requests when installed on a team. Organization-level and project-level scopes only; use the list scopes endpoint with \`type=installation\` to discover available values. Maximum of 100 scopes are allowed.`)
  .option(`--installation-redirect-url <installation-redirect-url>`, `URL users are redirected to after creating or updating an installation of this application. Must be an https URL, an http loopback URL (localhost, 127.0.0.1, [::1]), or a private-use scheme URI, and must not contain a fragment. Leave empty for no redirect.`)
  .action(
    actionRunner(
      async ({ appId, name, description, clientUri, logoUri, privacyPolicyUrl, termsUrl, contacts, tagline, tags, images, supportUrl, dataDeletionUrl, enabled, redirectUris, postLogoutRedirectUris, type, deviceFlow, installationScopes, installationRedirectUrl }) =>
        parse(await (await getAppsClient()).update(appId, name, description, clientUri, logoUri, privacyPolicyUrl, termsUrl, contacts, tagline, tags, images, supportUrl, dataDeletionUrl, enabled, redirectUris, postLogoutRedirectUris, type, deviceFlow, installationScopes, installationRedirectUrl)),
    ),
  );


const appsDeleteCommand = apps
  .command(`delete`)
  .description(`Delete an application by its unique ID.`)
  .requiredOption(`--app-id <app-id>`, `Application unique ID.`)
  .action(
    actionRunner(
      async ({ appId }) =>
        parse(await (await getAppsClient()).delete(appId)),
    ),
  );


const appsListKeysCommand = apps
  .command(`list-keys`)
  .description(`List app keys for an application.`)
  .requiredOption(`--app-id <app-id>`, `Application unique ID.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
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
      async ({ appId, queries, total, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }) =>
        parse(await (await getAppsClient()).listKeys(appId, buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }), total)),
    ),
  );


const appsCreateKeyCommand = apps
  .command(`create-key`)
  .description(`Create a new app key for an application. App keys carry no scopes; send one in the \`X-Appwrite-Key\` header alongside the \`X-Appwrite-App\` header to list the application's installations and create installation access tokens.`)
  .requiredOption(`--app-id <app-id>`, `Application unique ID.`)
  .action(
    actionRunner(
      async ({ appId }) =>
        parse(await (await getAppsClient()).createKey(appId)),
    ),
  );


const appsGetKeyCommand = apps
  .command(`get-key`)
  .description(`Get an app key by its unique ID.`)
  .requiredOption(`--app-id <app-id>`, `Application unique ID.`)
  .requiredOption(`--key-id <key-id>`, `App key unique ID.`)
  .action(
    actionRunner(
      async ({ appId, keyId }) =>
        parse(await (await getAppsClient()).getKey(appId, keyId)),
    ),
  );


const appsDeleteKeyCommand = apps
  .command(`delete-key`)
  .description(`Delete an app key by its unique ID.`)
  .requiredOption(`--app-id <app-id>`, `Application unique ID.`)
  .requiredOption(`--key-id <key-id>`, `App key unique ID.`)
  .action(
    actionRunner(
      async ({ appId, keyId }) =>
        parse(await (await getAppsClient()).deleteKey(appId, keyId)),
    ),
  );


const appsUpdateLabelsCommand = apps
  .command(`update-labels`)
  .description(`Update the labels of an application. Labels are read-only for clients; only a server SDK using a project API key can set them. Replaces the previous labels.`)
  .requiredOption(`--app-id <app-id>`, `Application unique ID.`)
  .requiredOption(`--labels [labels...]`, `Array of application labels. Replaces the previous labels. Maximum of 1000 labels are allowed, each up to 36 alphanumeric characters long.`)
  .action(
    actionRunner(
      async ({ appId, labels }) =>
        parse(await (await getAppsClient()).updateLabels(appId, labels)),
    ),
  );


const appsListSecretsCommand = apps
  .command(`list-secrets`)
  .description(`List client secrets for an application.`)
  .requiredOption(`--app-id <app-id>`, `Application unique ID.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
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
      async ({ appId, queries, total, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }) =>
        parse(await (await getAppsClient()).listSecrets(appId, buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }), total)),
    ),
  );


const appsCreateSecretCommand = apps
  .command(`create-secret`)
  .description(`Create a new client secret for an application.`)
  .requiredOption(`--app-id <app-id>`, `Application unique ID.`)
  .action(
    actionRunner(
      async ({ appId }) =>
        parse(await (await getAppsClient()).createSecret(appId)),
    ),
  );


const appsGetSecretCommand = apps
  .command(`get-secret`)
  .description(`Get an application client secret by its unique ID.`)
  .requiredOption(`--app-id <app-id>`, `Application unique ID.`)
  .requiredOption(`--secret-id <secret-id>`, `Secret unique ID.`)
  .action(
    actionRunner(
      async ({ appId, secretId }) =>
        parse(await (await getAppsClient()).getSecret(appId, secretId)),
    ),
  );


const appsDeleteSecretCommand = apps
  .command(`delete-secret`)
  .description(`Delete an application client secret by its unique ID.`)
  .requiredOption(`--app-id <app-id>`, `Application unique ID.`)
  .requiredOption(`--secret-id <secret-id>`, `Secret unique ID.`)
  .action(
    actionRunner(
      async ({ appId, secretId }) =>
        parse(await (await getAppsClient()).deleteSecret(appId, secretId)),
    ),
  );


const appsUpdateTeamCommand = apps
  .command(`update-team`)
  .description(`Transfer an application to another team by its unique ID.`)
  .requiredOption(`--app-id <app-id>`, `Application unique ID.`)
  .requiredOption(`--team-id <team-id>`, `Team ID of the team to transfer application to.`)
  .action(
    actionRunner(
      async ({ appId, teamId }) =>
        parse(await (await getAppsClient()).updateTeam(appId, teamId)),
    ),
  );


const appsDeleteTokensCommand = apps
  .command(`delete-tokens`)
  .description(`Revoke all tokens for an application by its unique ID.`)
  .requiredOption(`--app-id <app-id>`, `Application unique ID.`)
  .action(
    actionRunner(
      async ({ appId }) =>
        parse(await (await getAppsClient()).deleteTokens(appId)),
    ),
  );


