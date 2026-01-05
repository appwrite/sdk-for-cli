import { Command } from "commander";
import { sdkForProject } from "../../sdks.js";
import {
  actionRunner,
  commandDescriptions,
  parseBool,
  parseInteger,
} from "../../parser.js";
import {
  Projects,
  AuthMethod,
  OAuthProvider,
  PlatformType,
  ApiService,
  SMTPSecure,
  EmailTemplateType,
  EmailTemplateLocale,
  SmsTemplateType,
  SmsTemplateLocale,
} from "@appwrite.io/console";

let projectsClient: Projects | null = null;

const getProjectsClient = async (): Promise<Projects> => {
  if (!projectsClient) {
    const sdkClient = await sdkForProject();
    projectsClient = new Projects(sdkClient);
  }
  return projectsClient;
};

export const projects = new Command("projects")
  .description(commandDescriptions["projects"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

projects
  .command(`list`)
  .description(
    `Get a list of all projects. You can use the query params to filter your results. `,
  )
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, teamId`,
  )
  .option(
    `--search <search>`,
    `Search term to filter your list results. Max length: 256 chars.`,
  )
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ queries, search, total }) =>
        await (await getProjectsClient()).list(queries, search, total),
    ),
  );

projects
  .command(`create`)
  .description(
    `Create a new project. You can create a maximum of 100 projects per account. `,
  )
  .requiredOption(
    `--project-id <project-id>`,
    `Unique Id. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, and hyphen. Can't start with a special char. Max length is 36 chars.`,
  )
  .requiredOption(`--name <name>`, `Project name. Max length: 128 chars.`)
  .requiredOption(`--team-id <team-id>`, `Team unique ID.`)
  .option(`--region <region>`, `Project Region.`)
  .option(
    `--description <description>`,
    `Project description. Max length: 256 chars.`,
  )
  .option(`--logo <logo>`, `Project logo.`)
  .option(`--url <url>`, `Project URL.`)
  .option(
    `--legal-name <legal-name>`,
    `Project legal Name. Max length: 256 chars.`,
  )
  .option(
    `--legal-country <legal-country>`,
    `Project legal Country. Max length: 256 chars.`,
  )
  .option(
    `--legal-state <legal-state>`,
    `Project legal State. Max length: 256 chars.`,
  )
  .option(
    `--legal-city <legal-city>`,
    `Project legal City. Max length: 256 chars.`,
  )
  .option(
    `--legal-address <legal-address>`,
    `Project legal Address. Max length: 256 chars.`,
  )
  .option(
    `--legal-tax-id <legal-tax-id>`,
    `Project legal Tax ID. Max length: 256 chars.`,
  )
  .action(
    actionRunner(
      async ({
        projectId,
        name,
        teamId,
        region,
        description,
        logo,
        url,
        legalName,
        legalCountry,
        legalState,
        legalCity,
        legalAddress,
        legalTaxId,
      }) =>
        await (
          await getProjectsClient()
        ).create(
          projectId,
          name,
          teamId,
          region,
          description,
          logo,
          url,
          legalName,
          legalCountry,
          legalState,
          legalCity,
          legalAddress,
          legalTaxId,
        ),
    ),
  );

projects
  .command(`get`)
  .description(
    `Get a project by its unique ID. This endpoint allows you to retrieve the project's details, including its name, description, team, region, and other metadata. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .action(
    actionRunner(
      async ({ projectId }) => await (await getProjectsClient()).get(projectId),
    ),
  );

projects
  .command(`update`)
  .description(`Update a project by its unique ID.`)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--name <name>`, `Project name. Max length: 128 chars.`)
  .option(
    `--description <description>`,
    `Project description. Max length: 256 chars.`,
  )
  .option(`--logo <logo>`, `Project logo.`)
  .option(`--url <url>`, `Project URL.`)
  .option(
    `--legal-name <legal-name>`,
    `Project legal name. Max length: 256 chars.`,
  )
  .option(
    `--legal-country <legal-country>`,
    `Project legal country. Max length: 256 chars.`,
  )
  .option(
    `--legal-state <legal-state>`,
    `Project legal state. Max length: 256 chars.`,
  )
  .option(
    `--legal-city <legal-city>`,
    `Project legal city. Max length: 256 chars.`,
  )
  .option(
    `--legal-address <legal-address>`,
    `Project legal address. Max length: 256 chars.`,
  )
  .option(
    `--legal-tax-id <legal-tax-id>`,
    `Project legal tax ID. Max length: 256 chars.`,
  )
  .action(
    actionRunner(
      async ({
        projectId,
        name,
        description,
        logo,
        url,
        legalName,
        legalCountry,
        legalState,
        legalCity,
        legalAddress,
        legalTaxId,
      }) =>
        await (
          await getProjectsClient()
        ).update(
          projectId,
          name,
          description,
          logo,
          url,
          legalName,
          legalCountry,
          legalState,
          legalCity,
          legalAddress,
          legalTaxId,
        ),
    ),
  );

projects
  .command(`delete`)
  .description(`Delete a project by its unique ID.`)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .action(
    actionRunner(
      async ({ projectId }) =>
        await (await getProjectsClient()).delete(projectId),
    ),
  );

projects
  .command(`update-api-status`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'projects updateApiStatus' instead] Update the status of a specific API type. Use this endpoint to enable or disable API types such as REST, GraphQL and Realtime.`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--api <api>`, `API name.`)
  .requiredOption(`--status <status>`, `API status.`, parseBool)
  .action(
    actionRunner(
      async ({ projectId, api, status }) =>
        await (
          await getProjectsClient()
        ).updateApiStatus(projectId, api, status),
    ),
  );

projects
  .command(`update-api-status-all`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'projects updateApiStatusAll' instead] Update the status of all API types. Use this endpoint to enable or disable API types such as REST, GraphQL and Realtime all at once.`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--status <status>`, `API status.`, parseBool)
  .action(
    actionRunner(
      async ({ projectId, status }) =>
        await (await getProjectsClient()).updateApiStatusAll(projectId, status),
    ),
  );

projects
  .command(`update-auth-duration`)
  .description(
    `Update how long sessions created within a project should stay active for.`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(
    `--duration <duration>`,
    `Project session length in seconds. Max length: 31536000 seconds.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ projectId, duration }) =>
        await (
          await getProjectsClient()
        ).updateAuthDuration(projectId, duration),
    ),
  );

projects
  .command(`update-auth-limit`)
  .description(
    `Update the maximum number of users allowed in this project. Set to 0 for unlimited users. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(
    `--limit <limit>`,
    `Set the max number of users allowed in this project. Use 0 for unlimited.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ projectId, limit }) =>
        await (await getProjectsClient()).updateAuthLimit(projectId, limit),
    ),
  );

projects
  .command(`update-auth-sessions-limit`)
  .description(
    `Update the maximum number of sessions allowed per user within the project, if the limit is hit the oldest session will be deleted to make room for new sessions.`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(
    `--limit <limit>`,
    `Set the max number of users allowed in this project. Value allowed is between 1-100. Default is 10`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ projectId, limit }) =>
        await (
          await getProjectsClient()
        ).updateAuthSessionsLimit(projectId, limit),
    ),
  );

projects
  .command(`update-memberships-privacy`)
  .description(
    `Update project membership privacy settings. Use this endpoint to control what user information is visible to other team members, such as user name, email, and MFA status. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(
    `--user-name <user-name>`,
    `Set to true to show userName to members of a team.`,
    parseBool,
  )
  .requiredOption(
    `--user-email <user-email>`,
    `Set to true to show email to members of a team.`,
    parseBool,
  )
  .requiredOption(
    `--mfa <mfa>`,
    `Set to true to show mfa to members of a team.`,
    parseBool,
  )
  .action(
    actionRunner(
      async ({ projectId, userName, userEmail, mfa }) =>
        await (
          await getProjectsClient()
        ).updateMembershipsPrivacy(projectId, userName, userEmail, mfa),
    ),
  );

projects
  .command(`update-mock-numbers`)
  .description(
    `Update the list of mock phone numbers for testing. Use these numbers to bypass SMS verification in development. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(
    `--numbers [numbers...]`,
    `An array of mock numbers and their corresponding verification codes (OTPs). Each number should be a valid E.164 formatted phone number. Maximum of 10 numbers are allowed.`,
  )
  .action(
    actionRunner(
      async ({ projectId, numbers }) =>
        await (await getProjectsClient()).updateMockNumbers(projectId, numbers),
    ),
  );

projects
  .command(`update-auth-password-dictionary`)
  .description(
    `Enable or disable checking user passwords against common passwords dictionary. This helps ensure users don't use common and insecure passwords. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(
    `--enabled <enabled>`,
    `Set whether or not to enable checking user's password against most commonly used passwords. Default is false.`,
    parseBool,
  )
  .action(
    actionRunner(
      async ({ projectId, enabled }) =>
        await (
          await getProjectsClient()
        ).updateAuthPasswordDictionary(projectId, enabled),
    ),
  );

projects
  .command(`update-auth-password-history`)
  .description(
    `Update the authentication password history requirement. Use this endpoint to require new passwords to be different than the last X amount of previously used ones.`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(
    `--limit <limit>`,
    `Set the max number of passwords to store in user history. User can't choose a new password that is already stored in the password history list.  Max number of passwords allowed in history is20. Default value is 0`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ projectId, limit }) =>
        await (
          await getProjectsClient()
        ).updateAuthPasswordHistory(projectId, limit),
    ),
  );

projects
  .command(`update-personal-data-check`)
  .description(
    `Enable or disable checking user passwords against their personal data. This helps prevent users from using personal information in their passwords. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(
    `--enabled <enabled>`,
    `Set whether or not to check a password for similarity with personal data. Default is false.`,
    parseBool,
  )
  .action(
    actionRunner(
      async ({ projectId, enabled }) =>
        await (
          await getProjectsClient()
        ).updatePersonalDataCheck(projectId, enabled),
    ),
  );

projects
  .command(`update-session-alerts`)
  .description(
    `Enable or disable session email alerts. When enabled, users will receive email notifications when new sessions are created.`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(
    `--alerts <alerts>`,
    `Set to true to enable session emails.`,
    parseBool,
  )
  .action(
    actionRunner(
      async ({ projectId, alerts }) =>
        await (
          await getProjectsClient()
        ).updateSessionAlerts(projectId, alerts),
    ),
  );

projects
  .command(`update-session-invalidation`)
  .description(
    `Invalidate all existing sessions. An optional auth security setting for projects, and enabled by default for console project.`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(
    `--enabled <enabled>`,
    `Update authentication session invalidation status. Use this endpoint to enable or disable session invalidation on password change`,
    parseBool,
  )
  .action(
    actionRunner(
      async ({ projectId, enabled }) =>
        await (
          await getProjectsClient()
        ).updateSessionInvalidation(projectId, enabled),
    ),
  );

projects
  .command(`update-auth-status`)
  .description(
    `Update the status of a specific authentication method. Use this endpoint to enable or disable different authentication methods such as email, magic urls or sms in your project. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(
    `--method <method>`,
    `Auth Method. Possible values: email-password,magic-url,email-otp,anonymous,invites,jwt,phone`,
  )
  .requiredOption(
    `--status <status>`,
    `Set the status of this auth method.`,
    parseBool,
  )
  .action(
    actionRunner(
      async ({ projectId, method, status }) =>
        await (
          await getProjectsClient()
        ).updateAuthStatus(projectId, method as AuthMethod, status),
    ),
  );

projects
  .command(`list-dev-keys`)
  .description(
    `List all the project\'s dev keys. Dev keys are project specific and allow you to bypass rate limits and get better error logging during development.'`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: accessedAt, expire`,
  )
  .action(
    actionRunner(
      async ({ projectId, queries }) =>
        await (await getProjectsClient()).listDevKeys(projectId, queries),
    ),
  );

projects
  .command(`create-dev-key`)
  .description(
    `Create a new project dev key. Dev keys are project specific and allow you to bypass rate limits and get better error logging during development. Strictly meant for development purposes only.`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
  .requiredOption(
    `--expire <expire>`,
    `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format.`,
  )
  .action(
    actionRunner(
      async ({ projectId, name, expire }) =>
        await (await getProjectsClient()).createDevKey(projectId, name, expire),
    ),
  );

projects
  .command(`get-dev-key`)
  .description(
    `Get a project\'s dev key by its unique ID. Dev keys are project specific and allow you to bypass rate limits and get better error logging during development.`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, keyId }) =>
        await (await getProjectsClient()).getDevKey(projectId, keyId),
    ),
  );

projects
  .command(`update-dev-key`)
  .description(
    `Update a project\'s dev key by its unique ID. Use this endpoint to update a project\'s dev key name or expiration time.'`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
  .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
  .requiredOption(
    `--expire <expire>`,
    `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format.`,
  )
  .action(
    actionRunner(
      async ({ projectId, keyId, name, expire }) =>
        await (
          await getProjectsClient()
        ).updateDevKey(projectId, keyId, name, expire),
    ),
  );

projects
  .command(`delete-dev-key`)
  .description(
    `Delete a project\'s dev key by its unique ID. Once deleted, the key will no longer allow bypassing of rate limits and better logging of errors.`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, keyId }) =>
        await (await getProjectsClient()).deleteDevKey(projectId, keyId),
    ),
  );

projects
  .command(`create-jwt`)
  .description(
    `Create a new JWT token. This token can be used to authenticate users with custom scopes and expiration time. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(
    `--scopes [scopes...]`,
    `List of scopes allowed for JWT key. Maximum of 100 scopes are allowed.`,
  )
  .option(
    `--duration <duration>`,
    `Time in seconds before JWT expires. Default duration is 900 seconds, and maximum is 3600 seconds.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ projectId, scopes, duration }) =>
        await (
          await getProjectsClient()
        ).createJWT(projectId, scopes, duration),
    ),
  );

projects
  .command(`list-keys`)
  .description(`Get a list of all API keys from the current project. `)
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ projectId, total }) =>
        await (await getProjectsClient()).listKeys(projectId, total),
    ),
  );

projects
  .command(`create-key`)
  .description(
    `Create a new API key. It's recommended to have multiple API keys with strict scopes for separate functions within your project.`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
  .requiredOption(
    `--scopes [scopes...]`,
    `Key scopes list. Maximum of 100 scopes are allowed.`,
  )
  .option(
    `--expire <expire>`,
    `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.`,
  )
  .action(
    actionRunner(
      async ({ projectId, name, scopes, expire }) =>
        await (
          await getProjectsClient()
        ).createKey(projectId, name, scopes, expire),
    ),
  );

projects
  .command(`get-key`)
  .description(
    `Get a key by its unique ID. This endpoint returns details about a specific API key in your project including it's scopes.`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, keyId }) =>
        await (await getProjectsClient()).getKey(projectId, keyId),
    ),
  );

projects
  .command(`update-key`)
  .description(
    `Update a key by its unique ID. Use this endpoint to update the name, scopes, or expiration time of an API key. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
  .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
  .requiredOption(
    `--scopes [scopes...]`,
    `Key scopes list. Maximum of 100 events are allowed.`,
  )
  .option(
    `--expire <expire>`,
    `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.`,
  )
  .action(
    actionRunner(
      async ({ projectId, keyId, name, scopes, expire }) =>
        await (
          await getProjectsClient()
        ).updateKey(projectId, keyId, name, scopes, expire),
    ),
  );

projects
  .command(`delete-key`)
  .description(
    `Delete a key by its unique ID. Once deleted, the key can no longer be used to authenticate API calls. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, keyId }) =>
        await (await getProjectsClient()).deleteKey(projectId, keyId),
    ),
  );

projects
  .command(`update-oauth2`)
  .description(
    `Update the OAuth2 provider configurations. Use this endpoint to set up or update the OAuth2 provider credentials or enable/disable providers. `,
  )
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
        await (
          await getProjectsClient()
        ).updateOAuth2(
          projectId,
          provider as OAuthProvider,
          appId,
          secret,
          enabled,
        ),
    ),
  );

projects
  .command(`list-platforms`)
  .description(
    `Get a list of all platforms in the project. This endpoint returns an array of all platforms and their configurations. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ projectId, total }) =>
        await (await getProjectsClient()).listPlatforms(projectId, total),
    ),
  );

projects
  .command(`create-platform`)
  .description(
    `Create a new platform for your project. Use this endpoint to register a new platform where your users will run your application which will interact with the Appwrite API.`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(
    `--type <type>`,
    `Platform type. Possible values are: web, flutter-web, flutter-ios, flutter-android, flutter-linux, flutter-macos, flutter-windows, apple-ios, apple-macos, apple-watchos, apple-tvos, android, unity, react-native-ios, react-native-android.`,
  )
  .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
  .option(
    `--key <key>`,
    `Package name for Android or bundle ID for iOS or macOS. Max length: 256 chars.`,
  )
  .option(
    `--store <store>`,
    `App store or Google Play store ID. Max length: 256 chars.`,
  )
  .option(
    `--hostname <hostname>`,
    `Platform client hostname. Max length: 256 chars.`,
  )
  .action(
    actionRunner(
      async ({ projectId, xType, name, key, store, hostname }) =>
        await (
          await getProjectsClient()
        ).createPlatform(
          projectId,
          xType as PlatformType,
          name,
          key,
          store,
          hostname,
        ),
    ),
  );

projects
  .command(`get-platform`)
  .description(
    `Get a platform by its unique ID. This endpoint returns the platform's details, including its name, type, and key configurations. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--platform-id <platform-id>`, `Platform unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, platformId }) =>
        await (await getProjectsClient()).getPlatform(projectId, platformId),
    ),
  );

projects
  .command(`update-platform`)
  .description(
    `Update a platform by its unique ID. Use this endpoint to update the platform's name, key, platform store ID, or hostname. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--platform-id <platform-id>`, `Platform unique ID.`)
  .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
  .option(
    `--key <key>`,
    `Package name for android or bundle ID for iOS. Max length: 256 chars.`,
  )
  .option(
    `--store <store>`,
    `App store or Google Play store ID. Max length: 256 chars.`,
  )
  .option(
    `--hostname <hostname>`,
    `Platform client URL. Max length: 256 chars.`,
  )
  .action(
    actionRunner(
      async ({ projectId, platformId, name, key, store, hostname }) =>
        await (
          await getProjectsClient()
        ).updatePlatform(projectId, platformId, name, key, store, hostname),
    ),
  );

projects
  .command(`delete-platform`)
  .description(
    `Delete a platform by its unique ID. This endpoint removes the platform and all its configurations from the project. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--platform-id <platform-id>`, `Platform unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, platformId }) =>
        await (await getProjectsClient()).deletePlatform(projectId, platformId),
    ),
  );

projects
  .command(`update-service-status`)
  .description(
    `Update the status of a specific service. Use this endpoint to enable or disable a service in your project. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--service <service>`, `Service name.`)
  .requiredOption(`--status <status>`, `Service status.`, parseBool)
  .action(
    actionRunner(
      async ({ projectId, service, status }) =>
        await (
          await getProjectsClient()
        ).updateServiceStatus(projectId, service as ApiService, status),
    ),
  );

projects
  .command(`update-service-status-all`)
  .description(
    `Update the status of all services. Use this endpoint to enable or disable all optional services at once. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--status <status>`, `Service status.`, parseBool)
  .action(
    actionRunner(
      async ({ projectId, status }) =>
        await (
          await getProjectsClient()
        ).updateServiceStatusAll(projectId, status),
    ),
  );

projects
  .command(`update-smtp`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'projects updateSmtp' instead] Update the SMTP configuration for your project. Use this endpoint to configure your project's SMTP provider with your custom settings for sending transactional emails. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(
    `--enabled <enabled>`,
    `Enable custom SMTP service`,
    parseBool,
  )
  .option(`--sender-name <sender-name>`, `Name of the email sender`)
  .option(`--sender-email <sender-email>`, `Email of the sender`)
  .option(`--reply-to <reply-to>`, `Reply to email`)
  .option(`--host <host>`, `SMTP server host name`)
  .option(`--port <port>`, `SMTP server port`, parseInteger)
  .option(`--username <username>`, `SMTP server username`)
  .option(`--password <password>`, `SMTP server password`)
  .option(`--secure <secure>`, `Does SMTP server use secure connection`)
  .action(
    actionRunner(
      async ({
        projectId,
        enabled,
        senderName,
        senderEmail,
        replyTo,
        host,
        port,
        username,
        password,
        secure,
      }) =>
        await (
          await getProjectsClient()
        ).updateSmtp(
          projectId,
          enabled,
          senderName,
          senderEmail,
          replyTo,
          host,
          port,
          username,
          password,
          secure as SMTPSecure,
        ),
    ),
  );

projects
  .command(`create-smtp-test`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'projects createSmtpTest' instead] Send a test email to verify SMTP configuration. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(
    `--emails [emails...]`,
    `Array of emails to send test email to. Maximum of 10 emails are allowed.`,
  )
  .requiredOption(`--sender-name <sender-name>`, `Name of the email sender`)
  .requiredOption(`--sender-email <sender-email>`, `Email of the sender`)
  .option(`--reply-to <reply-to>`, `Reply to email`)
  .requiredOption(`--host <host>`, `SMTP server host name`)
  .option(`--port <port>`, `SMTP server port`, parseInteger)
  .option(`--username <username>`, `SMTP server username`)
  .option(`--password <password>`, `SMTP server password`)
  .option(`--secure <secure>`, `Does SMTP server use secure connection`)
  .action(
    actionRunner(
      async ({
        projectId,
        emails,
        senderName,
        senderEmail,
        replyTo,
        host,
        port,
        username,
        password,
        secure,
      }) =>
        await (
          await getProjectsClient()
        ).createSmtpTest(
          projectId,
          emails,
          senderName,
          senderEmail,
          replyTo,
          host,
          port,
          username,
          password,
          secure as SMTPSecure,
        ),
    ),
  );

projects
  .command(`update-team`)
  .description(
    `Update the team ID of a project allowing for it to be transferred to another team.`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(
    `--team-id <team-id>`,
    `Team ID of the team to transfer project to.`,
  )
  .action(
    actionRunner(
      async ({ projectId, teamId }) =>
        await (await getProjectsClient()).updateTeam(projectId, teamId),
    ),
  );

projects
  .command(`get-email-template`)
  .description(
    `Get a custom email template for the specified locale and type. This endpoint returns the template content, subject, and other configuration details. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--type <type>`, `Template type`)
  .requiredOption(`--locale <locale>`, `Template locale`)
  .action(
    actionRunner(
      async ({ projectId, xType, locale }) =>
        await (
          await getProjectsClient()
        ).getEmailTemplate(
          projectId,
          xType as EmailTemplateType,
          locale as EmailTemplateLocale,
        ),
    ),
  );

projects
  .command(`update-email-template`)
  .description(
    `Update a custom email template for the specified locale and type. Use this endpoint to modify the content of your email templates.`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--type <type>`, `Template type`)
  .requiredOption(`--locale <locale>`, `Template locale`)
  .requiredOption(`--subject <subject>`, `Email Subject`)
  .requiredOption(`--message <message>`, `Template message`)
  .option(`--sender-name <sender-name>`, `Name of the email sender`)
  .option(`--sender-email <sender-email>`, `Email of the sender`)
  .option(`--reply-to <reply-to>`, `Reply to email`)
  .action(
    actionRunner(
      async ({
        projectId,
        xType,
        locale,
        subject,
        message,
        senderName,
        senderEmail,
        replyTo,
      }) =>
        await (
          await getProjectsClient()
        ).updateEmailTemplate(
          projectId,
          xType as EmailTemplateType,
          locale as EmailTemplateLocale,
          subject,
          message,
          senderName,
          senderEmail,
          replyTo,
        ),
    ),
  );

projects
  .command(`delete-email-template`)
  .description(
    `Reset a custom email template to its default value. This endpoint removes any custom content and restores the template to its original state. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--type <type>`, `Template type`)
  .requiredOption(`--locale <locale>`, `Template locale`)
  .action(
    actionRunner(
      async ({ projectId, xType, locale }) =>
        await (
          await getProjectsClient()
        ).deleteEmailTemplate(
          projectId,
          xType as EmailTemplateType,
          locale as EmailTemplateLocale,
        ),
    ),
  );

projects
  .command(`get-sms-template`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'projects getSmsTemplate' instead] Get a custom SMS template for the specified locale and type returning it's contents.`,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--type <type>`, `Template type`)
  .requiredOption(`--locale <locale>`, `Template locale`)
  .action(
    actionRunner(
      async ({ projectId, xType, locale }) =>
        await (
          await getProjectsClient()
        ).getSmsTemplate(
          projectId,
          xType as SmsTemplateType,
          locale as SmsTemplateLocale,
        ),
    ),
  );

projects
  .command(`update-sms-template`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'projects updateSmsTemplate' instead] Update a custom SMS template for the specified locale and type. Use this endpoint to modify the content of your SMS templates. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--type <type>`, `Template type`)
  .requiredOption(`--locale <locale>`, `Template locale`)
  .requiredOption(`--message <message>`, `Template message`)
  .action(
    actionRunner(
      async ({ projectId, xType, locale, message }) =>
        await (
          await getProjectsClient()
        ).updateSmsTemplate(
          projectId,
          xType as SmsTemplateType,
          locale as SmsTemplateLocale,
          message,
        ),
    ),
  );

projects
  .command(`delete-sms-template`)
  .description(
    `[**DEPRECATED** - This command is deprecated. Please use 'projects deleteSmsTemplate' instead] Reset a custom SMS template to its default value. This endpoint removes any custom message and restores the template to its original state. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--type <type>`, `Template type`)
  .requiredOption(`--locale <locale>`, `Template locale`)
  .action(
    actionRunner(
      async ({ projectId, xType, locale }) =>
        await (
          await getProjectsClient()
        ).deleteSmsTemplate(
          projectId,
          xType as SmsTemplateType,
          locale as SmsTemplateLocale,
        ),
    ),
  );

projects
  .command(`list-webhooks`)
  .description(
    `Get a list of all webhooks belonging to the project. You can use the query params to filter your results. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ projectId, total }) =>
        await (await getProjectsClient()).listWebhooks(projectId, total),
    ),
  );

projects
  .command(`create-webhook`)
  .description(
    `Create a new webhook. Use this endpoint to configure a URL that will receive events from Appwrite when specific events occur. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--name <name>`, `Webhook name. Max length: 128 chars.`)
  .option(
    `--enabled [value]`,
    `Enable or disable a webhook.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .requiredOption(
    `--events [events...]`,
    `Events list. Maximum of 100 events are allowed.`,
  )
  .requiredOption(`--url <url>`, `Webhook URL.`)
  .requiredOption(
    `--security <security>`,
    `Certificate verification, false for disabled or true for enabled.`,
    parseBool,
  )
  .option(
    `--http-user <http-user>`,
    `Webhook HTTP user. Max length: 256 chars.`,
  )
  .option(
    `--http-pass <http-pass>`,
    `Webhook HTTP password. Max length: 256 chars.`,
  )
  .action(
    actionRunner(
      async ({
        projectId,
        name,
        enabled,
        events,
        url,
        security,
        httpUser,
        httpPass,
      }) =>
        await (
          await getProjectsClient()
        ).createWebhook(
          projectId,
          name,
          enabled,
          events,
          url,
          security,
          httpUser,
          httpPass,
        ),
    ),
  );

projects
  .command(`get-webhook`)
  .description(
    `Get a webhook by its unique ID. This endpoint returns details about a specific webhook configured for a project. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--webhook-id <webhook-id>`, `Webhook unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, webhookId }) =>
        await (await getProjectsClient()).getWebhook(projectId, webhookId),
    ),
  );

projects
  .command(`update-webhook`)
  .description(
    `Update a webhook by its unique ID. Use this endpoint to update the URL, events, or status of an existing webhook. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--webhook-id <webhook-id>`, `Webhook unique ID.`)
  .requiredOption(`--name <name>`, `Webhook name. Max length: 128 chars.`)
  .option(
    `--enabled [value]`,
    `Enable or disable a webhook.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .requiredOption(
    `--events [events...]`,
    `Events list. Maximum of 100 events are allowed.`,
  )
  .requiredOption(`--url <url>`, `Webhook URL.`)
  .requiredOption(
    `--security <security>`,
    `Certificate verification, false for disabled or true for enabled.`,
    parseBool,
  )
  .option(
    `--http-user <http-user>`,
    `Webhook HTTP user. Max length: 256 chars.`,
  )
  .option(
    `--http-pass <http-pass>`,
    `Webhook HTTP password. Max length: 256 chars.`,
  )
  .action(
    actionRunner(
      async ({
        projectId,
        webhookId,
        name,
        enabled,
        events,
        url,
        security,
        httpUser,
        httpPass,
      }) =>
        await (
          await getProjectsClient()
        ).updateWebhook(
          projectId,
          webhookId,
          name,
          enabled,
          events,
          url,
          security,
          httpUser,
          httpPass,
        ),
    ),
  );

projects
  .command(`delete-webhook`)
  .description(
    `Delete a webhook by its unique ID. Once deleted, the webhook will no longer receive project events. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--webhook-id <webhook-id>`, `Webhook unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, webhookId }) =>
        await (await getProjectsClient()).deleteWebhook(projectId, webhookId),
    ),
  );

projects
  .command(`update-webhook-signature`)
  .description(
    `Update the webhook signature key. This endpoint can be used to regenerate the signature key used to sign and validate payload deliveries for a specific webhook. `,
  )
  .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
  .requiredOption(`--webhook-id <webhook-id>`, `Webhook unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, webhookId }) =>
        await (
          await getProjectsClient()
        ).updateWebhookSignature(projectId, webhookId),
    ),
  );
