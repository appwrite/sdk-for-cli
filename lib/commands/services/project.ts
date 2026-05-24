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

const projectGetCommand = project
  .command(`get`)
  .description(`Get a project.`)
  .action(
    actionRunner(
      async () => parse(await (await getProjectClient()).get()),
    ),
  );


const projectDeleteCommand = project
  .command(`delete`)
  .description(`Delete a project.`)
  .action(
    actionRunner(
      async () => parse(await (await getProjectClient()).delete()),
    ),
  );


const projectUpdateAuthMethodCommand = project
  .command(`update-auth-method`)
  .description(`Update properties of a specific auth method. Use this endpoint to enable or disable a method in your project. `)
  .requiredOption(`--method-id <method-id>`, `Auth Method ID. Possible values: email-password,magic-url,email-otp,anonymous,invites,jwt,phone`)
  .requiredOption(`--enabled <enabled>`, `Auth method status.`, parseBool)
  .action(
    actionRunner(
      async ({ methodId, enabled }) =>
        parse(await (await getProjectClient()).updateAuthMethod(methodId, enabled)),
    ),
  );


const projectListKeysCommand = project
  .command(`list-keys`)
  .description(`Get a list of all API keys from the current project.`)
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
        parse(await (await getProjectClient()).listKeys(buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }), total)),
    ),
  );


const projectCreateKeyCommand = project
  .command(`create-key`)
  .description(`Create a new API key. It's recommended to have multiple API keys with strict scopes for separate functions within your project.

You can also create an ephemeral API key if you need a short-lived key instead.`)
  .requiredOption(`--key-id <key-id>`, `Key ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
  .requiredOption(`--scopes [scopes...]`, `Key scopes list. Maximum of 100 scopes are allowed.`)
  .option(`--expire <expire>`, `Expiration time in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.`)
  .action(
    actionRunner(
      async ({ keyId, name, scopes, expire }) =>
        parse(await (await getProjectClient()).createKey(keyId, name, scopes, expire)),
    ),
  );


const projectCreateEphemeralKeyCommand = project
  .command(`create-ephemeral-key`)
  .description(`Create a new ephemeral API key. It's recommended to have multiple API keys with strict scopes for separate functions within your project.

You can also create a standard API key if you need a longer-lived key instead.`)
  .requiredOption(`--scopes [scopes...]`, `Key scopes list. Maximum of 100 scopes are allowed.`)
  .requiredOption(`--duration <duration>`, `Time in seconds before ephemeral key expires. Maximum duration is 3600 seconds.`, parseInteger)
  .action(
    actionRunner(
      async ({ scopes, duration }) =>
        parse(await (await getProjectClient()).createEphemeralKey(scopes, duration)),
    ),
  );


const projectGetKeyCommand = project
  .command(`get-key`)
  .description(`Get a key by its unique ID. `)
  .requiredOption(`--key-id <key-id>`, `Key ID.`)
  .action(
    actionRunner(
      async ({ keyId }) =>
        parse(await (await getProjectClient()).getKey(keyId)),
    ),
  );


const projectUpdateKeyCommand = project
  .command(`update-key`)
  .description(`Update a key by its unique ID. Use this endpoint to update the name, scopes, or expiration time of an API key.`)
  .requiredOption(`--key-id <key-id>`, `Key ID.`)
  .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
  .requiredOption(`--scopes [scopes...]`, `Key scopes list. Maximum of 100 scopes are allowed.`)
  .option(`--expire <expire>`, `Expiration time in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.`)
  .action(
    actionRunner(
      async ({ keyId, name, scopes, expire }) =>
        parse(await (await getProjectClient()).updateKey(keyId, name, scopes, expire)),
    ),
  );


const projectDeleteKeyCommand = project
  .command(`delete-key`)
  .description(`Delete a key by its unique ID. Once deleted, the key can no longer be used to authenticate API calls.`)
  .requiredOption(`--key-id <key-id>`, `Key ID.`)
  .action(
    actionRunner(
      async ({ keyId }) =>
        parse(await (await getProjectClient()).deleteKey(keyId)),
    ),
  );


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


const projectListMockPhonesCommand = project
  .command(`list-mock-phones`)
  .description(`Get a list of all mock phones in the project. This endpoint returns an array of all mock phones and their OTPs.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common pagination prefer --limit and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--limit <limit>`, `Maximum number of results to return.`, parseInteger)
  .option(`--offset <offset>`, `Number of results to skip.`, parseInteger)
  .action(
    actionRunner(
      async ({ queries, total, limit, offset }) =>
        parse(await (await getProjectClient()).listMockPhones(buildQueries({ queries, limit, offset }), total)),
    ),
  );


const projectCreateMockPhoneCommand = project
  .command(`create-mock-phone`)
  .description(`Create a new mock phone for your project. Use this endpoint to register a mock phone number and its sign-in OTP for your testers.`)
  .requiredOption(`--number <number>`, `Phone number to associate with the mock phone. Must be a valid E.164 formatted phone number.`)
  .requiredOption(`--otp <otp>`, `One-time password (OTP) to associate with the mock phone. Must be a 6-digit numeric code.`)
  .action(
    actionRunner(
      async ({ number, otp }) =>
        parse(await (await getProjectClient()).createMockPhone(number, otp)),
    ),
  );


const projectGetMockPhoneCommand = project
  .command(`get-mock-phone`)
  .description(`Get a mock phone by its unique number. This endpoint returns the mock phone's OTP.`)
  .requiredOption(`--number <number>`, `Phone number associated with the mock phone. Must be a valid E.164 formatted phone number.`)
  .action(
    actionRunner(
      async ({ number }) =>
        parse(await (await getProjectClient()).getMockPhone(number)),
    ),
  );


const projectUpdateMockPhoneCommand = project
  .command(`update-mock-phone`)
  .description(`Update a mock phone by its unique number. Use this endpoint to update the mock phone's OTP.`)
  .requiredOption(`--number <number>`, `Phone number associated with the mock phone. Must be a valid E.164 formatted phone number.`)
  .requiredOption(`--otp <otp>`, `One-time password (OTP) to associate with the mock phone. Must be a 6-digit numeric code.`)
  .action(
    actionRunner(
      async ({ number, otp }) =>
        parse(await (await getProjectClient()).updateMockPhone(number, otp)),
    ),
  );


const projectDeleteMockPhoneCommand = project
  .command(`delete-mock-phone`)
  .description(`Delete a mock phone by its unique number. This endpoint removes the mock phone and its OTP configuration from the project.`)
  .requiredOption(`--number <number>`, `Phone number associated with the mock phone. Must be a valid E.164 formatted phone number.`)
  .action(
    actionRunner(
      async ({ number }) =>
        parse(await (await getProjectClient()).deleteMockPhone(number)),
    ),
  );


const projectListOAuth2ProvidersCommand = project
  .command(`list-o-auth-2-providers`)
  .description(`Get a list of all OAuth2 providers supported by the server, along with the project's configuration for each. Credential fields are write-only and always returned empty.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common pagination prefer --limit and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--limit <limit>`, `Maximum number of results to return.`, parseInteger)
  .option(`--offset <offset>`, `Number of results to skip.`, parseInteger)
  .action(
    actionRunner(
      async ({ queries, total, limit, offset }) =>
        parse(await (await getProjectClient()).listOAuth2Providers(buildQueries({ queries, limit, offset }), total)),
    ),
  );


const projectUpdateOAuth2AmazonCommand = project
  .command(`update-o-auth-2-amazon`)
  .description(`Update the project OAuth2 Amazon configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Amazon OAuth2 app. For example: amzn1.application-oa2-client.87400c00000000000000000000063d5b2`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Amazon OAuth2 app. For example: 79ffe4000000000000000000000000000000000000000000000000000002de55`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Amazon(clientId, clientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2AppleCommand = project
  .command(`update-o-auth-2-apple`)
  .description(`Update the project OAuth2 Apple configuration.`)
  .option(`--service-id <service-id>`, `'Service ID' of Apple OAuth2 app. For example: ip.appwrite.app.web`)
  .option(`--key-id <key-id>`, `'Key ID' of Apple OAuth2 app. For example: P4000000N8`)
  .option(`--team-id <team-id>`, `'Team ID' of Apple OAuth2 app. For example: D4000000R6`)
  .option(`--p-8-file <p-8-file>`, `Contents of the Apple OAuth2 app .p8 private key file. The secret key wrapped by the PEM markers is 200 characters long. For example: -----BEGIN PRIVATE KEY-----MIGTAg...jy2Xbna-----END PRIVATE KEY-----`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ serviceId, keyId, teamId, p8File, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Apple(serviceId, keyId, teamId, p8File, enabled)),
    ),
  );


const projectUpdateOAuth2Auth0Command = project
  .command(`update-o-auth-2-auth-0`)
  .description(`Update the project OAuth2 Auth0 configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Auth0 OAuth2 app. For example: OaOkIA000000000000000000005KLSYq`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Auth0 OAuth2 app. For example: zXz0000-00000000000000000000000000000-00000000000000000000PJafnF`)
  .option(`--endpoint <endpoint>`, `Domain of Auth0 instance. For example: example.us.auth0.com`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, endpoint, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Auth0(clientId, clientSecret, endpoint, enabled)),
    ),
  );


const projectUpdateOAuth2AuthentikCommand = project
  .command(`update-o-auth-2-authentik`)
  .description(`Update the project OAuth2 Authentik configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Authentik OAuth2 app. For example: dTKOPa0000000000000000000000000000e7G8hv`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Authentik OAuth2 app. For example: ntQadq000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000Hp5WK`)
  .option(`--endpoint <endpoint>`, `Domain of Authentik instance. For example: example.authentik.com`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, endpoint, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Authentik(clientId, clientSecret, endpoint, enabled)),
    ),
  );


const projectUpdateOAuth2AutodeskCommand = project
  .command(`update-o-auth-2-autodesk`)
  .description(`Update the project OAuth2 Autodesk configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Autodesk OAuth2 app. For example: 5zw90v00000000000000000000kVYXN7`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Autodesk OAuth2 app. For example: 7I000000000000MW`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Autodesk(clientId, clientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2BitbucketCommand = project
  .command(`update-o-auth-2-bitbucket`)
  .description(`Update the project OAuth2 Bitbucket configuration.`)
  .option(`--key <key>`, `'Key' of Bitbucket OAuth2 app. For example: Knt70000000000ByRc`)
  .option(`--secret <secret>`, `'Secret' of Bitbucket OAuth2 app. For example: NMfLZJ00000000000000000000TLQdDx`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ key, secret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Bitbucket(key, secret, enabled)),
    ),
  );


const projectUpdateOAuth2BitlyCommand = project
  .command(`update-o-auth-2-bitly`)
  .description(`Update the project OAuth2 Bitly configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Bitly OAuth2 app. For example: d95151000000000000000000000000000067af9b`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Bitly OAuth2 app. For example: a13e250000000000000000000000000000d73095`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Bitly(clientId, clientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2BoxCommand = project
  .command(`update-o-auth-2-box`)
  .description(`Update the project OAuth2 Box configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Box OAuth2 app. For example: deglcs00000000000000000000x2og6y`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Box OAuth2 app. For example: OKM1f100000000000000000000eshEif`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Box(clientId, clientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2DailymotionCommand = project
  .command(`update-o-auth-2-dailymotion`)
  .description(`Update the project OAuth2 Dailymotion configuration.`)
  .option(`--api-key <api-key>`, `'API Key' of Dailymotion OAuth2 app. For example: 07a9000000000000067f`)
  .option(`--api-secret <api-secret>`, `'API Secret' of Dailymotion OAuth2 app. For example: a399a90000000000000000000000000000d90639`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ apiKey, apiSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Dailymotion(apiKey, apiSecret, enabled)),
    ),
  );


const projectUpdateOAuth2DiscordCommand = project
  .command(`update-o-auth-2-discord`)
  .description(`Update the project OAuth2 Discord configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Discord OAuth2 app. For example: 950722000000343754`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Discord OAuth2 app. For example: YmPXnM000000000000000000002zFg5D`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Discord(clientId, clientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2DisqusCommand = project
  .command(`update-o-auth-2-disqus`)
  .description(`Update the project OAuth2 Disqus configuration.`)
  .option(`--public-key <public-key>`, `'Public Key, also known as API Key' of Disqus OAuth2 app. For example: cgegH70000000000000000000000000000000000000000000000000000Hr1nYX`)
  .option(`--secret-key <secret-key>`, `'Secret Key, also known as API Secret' of Disqus OAuth2 app. For example: W7Bykj00000000000000000000000000000000000000000000000000003o43w9`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ publicKey, secretKey, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Disqus(publicKey, secretKey, enabled)),
    ),
  );


const projectUpdateOAuth2DropboxCommand = project
  .command(`update-o-auth-2-dropbox`)
  .description(`Update the project OAuth2 Dropbox configuration.`)
  .option(`--app-key <app-key>`, `'App Key' of Dropbox OAuth2 app. For example: jl000000000009t`)
  .option(`--app-secret <app-secret>`, `'App Secret' of Dropbox OAuth2 app. For example: g200000000000vw`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ appKey, appSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Dropbox(appKey, appSecret, enabled)),
    ),
  );


const projectUpdateOAuth2EtsyCommand = project
  .command(`update-o-auth-2-etsy`)
  .description(`Update the project OAuth2 Etsy configuration.`)
  .option(`--key-string <key-string>`, `'Keystring' of Etsy OAuth2 app. For example: nsgzxh0000000000008j85a2`)
  .option(`--shared-secret <shared-secret>`, `'Shared Secret' of Etsy OAuth2 app. For example: tp000000ru`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ keyString, sharedSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Etsy(keyString, sharedSecret, enabled)),
    ),
  );


const projectUpdateOAuth2FacebookCommand = project
  .command(`update-o-auth-2-facebook`)
  .description(`Update the project OAuth2 Facebook configuration.`)
  .option(`--app-id <app-id>`, `'App ID' of Facebook OAuth2 app. For example: 260600000007694`)
  .option(`--app-secret <app-secret>`, `'App Secret' of Facebook OAuth2 app. For example: 2d0b2800000000000000000000d38af4`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ appId, appSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Facebook(appId, appSecret, enabled)),
    ),
  );


const projectUpdateOAuth2FigmaCommand = project
  .command(`update-o-auth-2-figma`)
  .description(`Update the project OAuth2 Figma configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Figma OAuth2 app. For example: byay5H0000000000VtiI40`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Figma OAuth2 app. For example: yEpOYn0000000000000000004iIsU5`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Figma(clientId, clientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2FusionAuthCommand = project
  .command(`update-o-auth-2-fusion-auth`)
  .description(`Update the project OAuth2 FusionAuth configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of FusionAuth OAuth2 app. For example: b2222c00-0000-0000-0000-000000862097`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of FusionAuth OAuth2 app. For example: Jx4s0C0000000000000000000000000000000wGqLsc`)
  .option(`--endpoint <endpoint>`, `Domain of FusionAuth instance. For example: example.fusionauth.io`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, endpoint, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2FusionAuth(clientId, clientSecret, endpoint, enabled)),
    ),
  );


const projectUpdateOAuth2GitHubCommand = project
  .command(`update-o-auth-2-git-hub`)
  .description(`Update the project OAuth2 GitHub configuration.`)
  .option(`--client-id <client-id>`, `'OAuth2 app Client ID, or App ID' of GitHub OAuth2 app. For example: e4d87900000000540733. Example of wrong value: 370006`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of GitHub OAuth2 app. For example: 5e07c00000000000000000000000000000198bcc`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2GitHub(clientId, clientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2GitlabCommand = project
  .command(`update-o-auth-2-gitlab`)
  .description(`Update the project OAuth2 Gitlab configuration.`)
  .option(`--application-id <application-id>`, `'Application ID' of Gitlab OAuth2 app. For example: d41ffe0000000000000000000000000000000000000000000000000000d5e252`)
  .option(`--secret <secret>`, `'Secret' of Gitlab OAuth2 app. For example: gloas-838cfa0000000000000000000000000000000000000000000000000000ecbb38`)
  .option(`--endpoint <endpoint>`, `Endpoint URL of self-hosted GitLab instance. For example: https://gitlab.com`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ applicationId, secret, endpoint, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Gitlab(applicationId, secret, endpoint, enabled)),
    ),
  );


const projectUpdateOAuth2GoogleCommand = project
  .command(`update-o-auth-2-google`)
  .description(`Update the project OAuth2 Google configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Google OAuth2 app. For example: 120000000095-92ifjb00000000000000000000g7ijfb.apps.googleusercontent.com`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Google OAuth2 app. For example: GOCSPX-2k8gsR0000000000000000VNahJj`)
  .option(`--prompt [prompt...]`, `Array of Google OAuth2 prompt values. If "none" is included, it must be the only element. "none" means: don't display any authentication or consent screens. Must not be specified with other values. "consent" means: prompt the user for consent. "select_account" means: prompt the user to select an account.`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, prompt, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Google(clientId, clientSecret, prompt, enabled)),
    ),
  );


const projectUpdateOAuth2KeycloakCommand = project
  .command(`update-o-auth-2-keycloak`)
  .description(`Update the project OAuth2 Keycloak configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Keycloak OAuth2 app. For example: appwrite-o0000000st-app`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Keycloak OAuth2 app. For example: jdjrJd00000000000000000000HUsaZO`)
  .option(`--endpoint <endpoint>`, `Domain of Keycloak instance. For example: keycloak.example.com`)
  .option(`--realm-name <realm-name>`, `Keycloak realm name. For example: appwrite-realm`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, endpoint, realmName, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Keycloak(clientId, clientSecret, endpoint, realmName, enabled)),
    ),
  );


const projectUpdateOAuth2KickCommand = project
  .command(`update-o-auth-2-kick`)
  .description(`Update the project OAuth2 Kick configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Kick OAuth2 app. For example: 01KQ7C00000000000001MFHS32`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Kick OAuth2 app. For example: 34ac5600000000000000000000000000000000000000000000000000e830c8b`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Kick(clientId, clientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2LinkedinCommand = project
  .command(`update-o-auth-2-linkedin`)
  .description(`Update the project OAuth2 Linkedin configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Linkedin OAuth2 app. For example: 770000000000dv`)
  .option(`--primary-client-secret <primary-client-secret>`, `'Primary Client Secret or Secondary Client Secret' of Linkedin OAuth2 app. For example: WPL_AP1.2Bf0000000000000./HtlYw==`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, primaryClientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Linkedin(clientId, primaryClientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2MicrosoftCommand = project
  .command(`update-o-auth-2-microsoft`)
  .description(`Update the project OAuth2 Microsoft configuration.`)
  .option(`--application-id <application-id>`, `'Entra ID Application ID, also known as Client ID' of Microsoft OAuth2 app. For example: 00001111-aaaa-2222-bbbb-3333cccc4444`)
  .option(`--application-secret <application-secret>`, `'Entra ID Application Secret, also known as Client Secret' of Microsoft OAuth2 app. For example: A1bC2dE3fH4iJ5kL6mN7oP8qR9sT0u`)
  .option(`--tenant <tenant>`, `Microsoft Entra ID tenant identifier. Use 'common', 'organizations', 'consumers' or a specific tenant ID. For example: common`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ applicationId, applicationSecret, tenant, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Microsoft(applicationId, applicationSecret, tenant, enabled)),
    ),
  );


const projectUpdateOAuth2NotionCommand = project
  .command(`update-o-auth-2-notion`)
  .description(`Update the project OAuth2 Notion configuration.`)
  .option(`--oauth-client-id <oauth-client-id>`, `'OAuth Client ID' of Notion OAuth2 app. For example: 341d8700-0000-0000-0000-000000446ee3`)
  .option(`--oauth-client-secret <oauth-client-secret>`, `'OAuth Client Secret' of Notion OAuth2 app. For example: secret_dLUr4b000000000000000000000000000000lFHAa9`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ oauthClientId, oauthClientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Notion(oauthClientId, oauthClientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2OidcCommand = project
  .command(`update-o-auth-2-oidc`)
  .description(`Update the project OAuth2 Oidc configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Oidc OAuth2 app. For example: qibI2x0000000000000000000000000006L2YFoG`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Oidc OAuth2 app. For example: Ah68ed000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003qpcHV`)
  .option(`--well-known-url <well-known-url>`, `OpenID Connect well-known configuration URL. When provided, authorization, token, and user info endpoints can be discovered automatically. For example: https://myoauth.com/.well-known/openid-configuration`)
  .option(`--authorization-url <authorization-url>`, `OpenID Connect authorization endpoint URL. Required when wellKnownURL is not provided. For example: https://myoauth.com/oauth2/authorize`)
  .option(`--token-url <token-url>`, `OpenID Connect token endpoint URL. Required when wellKnownURL is not provided. For example: https://myoauth.com/oauth2/token`)
  .option(`--user-info-url <user-info-url>`, `OpenID Connect user info endpoint URL. Required when wellKnownURL is not provided. For example: https://myoauth.com/oauth2/userinfo`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, wellKnownUrl, authorizationUrl, tokenUrl, userInfoUrl, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Oidc(clientId, clientSecret, wellKnownUrl, authorizationUrl, tokenUrl, userInfoUrl, enabled)),
    ),
  );


const projectUpdateOAuth2OktaCommand = project
  .command(`update-o-auth-2-okta`)
  .description(`Update the project OAuth2 Okta configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Okta OAuth2 app. For example: 0oa00000000000000698`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Okta OAuth2 app. For example: Kiq0000000000000000000000000000000000000-00000000000H2L5-3SJ-vRV`)
  .option(`--domain <domain>`, `Okta company domain. Required when enabling the provider. For example: trial-6400025.okta.com. Example of wrong value: trial-6400025-admin.okta.com, or https://trial-6400025.okta.com/`)
  .option(`--authorization-server-id <authorization-server-id>`, `Custom Authorization Servers. Optional, can be left empty or unconfigured. For example: aus000000000000000h7z`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, domain, authorizationServerId, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Okta(clientId, clientSecret, domain, authorizationServerId, enabled)),
    ),
  );


const projectUpdateOAuth2PaypalCommand = project
  .command(`update-o-auth-2-paypal`)
  .description(`Update the project OAuth2 Paypal configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Paypal OAuth2 app. For example: AdhIEG7-000000000000-0000000000000000000000000000000-0000000000000000000000-2pyB`)
  .option(`--secret-key <secret-key>`, `'Secret Key 1 or Secret Key 2' of Paypal OAuth2 app. For example: EH8KCXtew--000000000000000000000000000000000000000_C-1_5UP_000000000000000CB7KDp`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, secretKey, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Paypal(clientId, secretKey, enabled)),
    ),
  );


const projectUpdateOAuth2PaypalSandboxCommand = project
  .command(`update-o-auth-2-paypal-sandbox`)
  .description(`Update the project OAuth2 PaypalSandbox configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of PaypalSandbox OAuth2 app. For example: AdhIEG7-000000000000-0000000000000000000000000000000-0000000000000000000000-2pyB`)
  .option(`--secret-key <secret-key>`, `'Secret Key 1 or Secret Key 2' of PaypalSandbox OAuth2 app. For example: EH8KCXtew--000000000000000000000000000000000000000_C-1_5UP_000000000000000CB7KDp`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, secretKey, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2PaypalSandbox(clientId, secretKey, enabled)),
    ),
  );


const projectUpdateOAuth2PodioCommand = project
  .command(`update-o-auth-2-podio`)
  .description(`Update the project OAuth2 Podio configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Podio OAuth2 app. For example: appwrite-o0000000st-app`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Podio OAuth2 app. For example: Rn247T0000000000000000000000000000000000000000000000000000W2zWTN`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Podio(clientId, clientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2SalesforceCommand = project
  .command(`update-o-auth-2-salesforce`)
  .description(`Update the project OAuth2 Salesforce configuration.`)
  .option(`--customer-key <customer-key>`, `'Consumer Key' of Salesforce OAuth2 app. For example: 3MVG9I0000000000000000000000000000000000000000000000000000000000000000000000000C5Aejq`)
  .option(`--customer-secret <customer-secret>`, `'Consumer Secret' of Salesforce OAuth2 app. For example: 3w000000000000e2`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ customerKey, customerSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Salesforce(customerKey, customerSecret, enabled)),
    ),
  );


const projectUpdateOAuth2SlackCommand = project
  .command(`update-o-auth-2-slack`)
  .description(`Update the project OAuth2 Slack configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Slack OAuth2 app. For example: 23000000089.15000000000023`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Slack OAuth2 app. For example: 81656000000000000000000000f3d2fd`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Slack(clientId, clientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2SpotifyCommand = project
  .command(`update-o-auth-2-spotify`)
  .description(`Update the project OAuth2 Spotify configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Spotify OAuth2 app. For example: 6ec271000000000000000000009beace`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Spotify OAuth2 app. For example: db068a000000000000000000008b5b9f`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Spotify(clientId, clientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2StripeCommand = project
  .command(`update-o-auth-2-stripe`)
  .description(`Update the project OAuth2 Stripe configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Stripe OAuth2 app. For example: ca_UKibXX0000000000000000000006byvR`)
  .option(`--api-secret-key <api-secret-key>`, `'API Secret Key' of Stripe OAuth2 app. For example: sk_51SfOd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000QGWYfp`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, apiSecretKey, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Stripe(clientId, apiSecretKey, enabled)),
    ),
  );


const projectUpdateOAuth2TradeshiftCommand = project
  .command(`update-o-auth-2-tradeshift`)
  .description(`Update the project OAuth2 Tradeshift configuration.`)
  .option(`--oauth-2-client-id <oauth-2-client-id>`, `'OAuth2 Client ID' of Tradeshift OAuth2 app. For example: appwrite-tes00000.0000000000est-app`)
  .option(`--oauth-2-client-secret <oauth-2-client-secret>`, `'OAuth2 Client Secret' of Tradeshift OAuth2 app. For example: 7cb52700-0000-0000-0000-000000ca5b83`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ oauth2ClientId, oauth2ClientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Tradeshift(oauth2ClientId, oauth2ClientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2TradeshiftSandboxCommand = project
  .command(`update-o-auth-2-tradeshift-sandbox`)
  .description(`Update the project OAuth2 Tradeshift Sandbox configuration.`)
  .option(`--oauth-2-client-id <oauth-2-client-id>`, `'OAuth2 Client ID' of Tradeshift Sandbox OAuth2 app. For example: appwrite-tes00000.0000000000est-app`)
  .option(`--oauth-2-client-secret <oauth-2-client-secret>`, `'OAuth2 Client Secret' of Tradeshift Sandbox OAuth2 app. For example: 7cb52700-0000-0000-0000-000000ca5b83`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ oauth2ClientId, oauth2ClientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2TradeshiftSandbox(oauth2ClientId, oauth2ClientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2TwitchCommand = project
  .command(`update-o-auth-2-twitch`)
  .description(`Update the project OAuth2 Twitch configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Twitch OAuth2 app. For example: vvi0in000000000000000000ikmt9p`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Twitch OAuth2 app. For example: pmapue000000000000000000zylw3v`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Twitch(clientId, clientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2WordPressCommand = project
  .command(`update-o-auth-2-word-press`)
  .description(`Update the project OAuth2 WordPress configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of WordPress OAuth2 app. For example: 130005`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of WordPress OAuth2 app. For example: PlBfJS0000000000000000000000000000000000000000000000000000EdUZJk`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2WordPress(clientId, clientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2XCommand = project
  .command(`update-o-auth-2x`)
  .description(`Update the project OAuth2 X configuration.`)
  .option(`--customer-key <customer-key>`, `'Customer Key' of X OAuth2 app. For example: slzZV0000000000000NFLaWT`)
  .option(`--secret-key <secret-key>`, `'Secret Key' of X OAuth2 app. For example: tkEPkp00000000000000000000000000000000000000FTxbI9`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ customerKey, secretKey, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2X(customerKey, secretKey, enabled)),
    ),
  );


const projectUpdateOAuth2YahooCommand = project
  .command(`update-o-auth-2-yahoo`)
  .description(`Update the project OAuth2 Yahoo configuration.`)
  .option(`--client-id <client-id>`, `'Client ID, also known as Customer Key' of Yahoo OAuth2 app. For example: dj0yJm000000000000000000000000000000000000000000000000000000000000000000000000000000000000Z4PWRm`)
  .option(`--client-secret <client-secret>`, `'Client Secret, also known as Customer Secret' of Yahoo OAuth2 app. For example: cf978f0000000000000000000000000000c5e2e9`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Yahoo(clientId, clientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2YandexCommand = project
  .command(`update-o-auth-2-yandex`)
  .description(`Update the project OAuth2 Yandex configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Yandex OAuth2 app. For example: 6a8a6a0000000000000000000091483c`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Yandex OAuth2 app. For example: bbf98500000000000000000000c75a63`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Yandex(clientId, clientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2ZohoCommand = project
  .command(`update-o-auth-2-zoho`)
  .description(`Update the project OAuth2 Zoho configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Zoho OAuth2 app. For example: 1000.83C178000000000000000000RPNX0B`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Zoho OAuth2 app. For example: fb5cac000000000000000000000000000000a68f6e`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Zoho(clientId, clientSecret, enabled)),
    ),
  );


const projectUpdateOAuth2ZoomCommand = project
  .command(`update-o-auth-2-zoom`)
  .description(`Update the project OAuth2 Zoom configuration.`)
  .option(`--client-id <client-id>`, `'Client ID' of Zoom OAuth2 app. For example: QMAC00000000000000w0AQ`)
  .option(`--client-secret <client-secret>`, `'Client Secret' of Zoom OAuth2 app. For example: GAWsG4000000000000000000007U01ON`)
  .option(
    `--enabled [value]`,
    `OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ clientId, clientSecret, enabled }) =>
        parse(await (await getProjectClient()).updateOAuth2Zoom(clientId, clientSecret, enabled)),
    ),
  );


const projectGetOAuth2ProviderCommand = project
  .command(`get-o-auth-2-provider`)
  .description(`Get a single OAuth2 provider configuration. Credential fields (client secret, p8 file, key/team IDs) are write-only and always returned empty.`)
  .requiredOption(`--provider-id <provider-id>`, `OAuth2 provider key. For example: github, google, apple.`)
  .action(
    actionRunner(
      async ({ providerId }) =>
        parse(await (await getProjectClient()).getOAuth2Provider(providerId)),
    ),
  );


const projectListPlatformsCommand = project
  .command(`list-platforms`)
  .description(`Get a list of all platforms in the project. This endpoint returns an array of all platforms and their configurations.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: type, name, hostname, bundleIdentifier, applicationId, packageIdentifierName, packageName`)
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
        parse(await (await getProjectClient()).listPlatforms(buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }), total)),
    ),
  );


const projectCreateAndroidPlatformCommand = project
  .command(`create-android-platform`)
  .description(`Create a new Android platform for your project. Use this endpoint to register a new Android platform where your users will run your application which will interact with the Appwrite API.`)
  .requiredOption(`--platform-id <platform-id>`, `Platform ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
  .requiredOption(`--application-id <application-id>`, `Android application ID. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ platformId, name, applicationId }) =>
        parse(await (await getProjectClient()).createAndroidPlatform(platformId, name, applicationId)),
    ),
  );


const projectUpdateAndroidPlatformCommand = project
  .command(`update-android-platform`)
  .description(`Update an Android platform by its unique ID. Use this endpoint to update the platform's name or application ID.`)
  .requiredOption(`--platform-id <platform-id>`, `Platform ID.`)
  .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
  .requiredOption(`--application-id <application-id>`, `Android application ID. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ platformId, name, applicationId }) =>
        parse(await (await getProjectClient()).updateAndroidPlatform(platformId, name, applicationId)),
    ),
  );


const projectCreateApplePlatformCommand = project
  .command(`create-apple-platform`)
  .description(`Create a new Apple platform for your project. Use this endpoint to register a new Apple platform where your users will run your application which will interact with the Appwrite API.`)
  .requiredOption(`--platform-id <platform-id>`, `Platform ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
  .requiredOption(`--bundle-identifier <bundle-identifier>`, `Apple bundle identifier. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ platformId, name, bundleIdentifier }) =>
        parse(await (await getProjectClient()).createApplePlatform(platformId, name, bundleIdentifier)),
    ),
  );


const projectUpdateApplePlatformCommand = project
  .command(`update-apple-platform`)
  .description(`Update an Apple platform by its unique ID. Use this endpoint to update the platform's name or bundle identifier.`)
  .requiredOption(`--platform-id <platform-id>`, `Platform ID.`)
  .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
  .requiredOption(`--bundle-identifier <bundle-identifier>`, `Apple bundle identifier. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ platformId, name, bundleIdentifier }) =>
        parse(await (await getProjectClient()).updateApplePlatform(platformId, name, bundleIdentifier)),
    ),
  );


const projectCreateLinuxPlatformCommand = project
  .command(`create-linux-platform`)
  .description(`Create a new Linux platform for your project. Use this endpoint to register a new Linux platform where your users will run your application which will interact with the Appwrite API.`)
  .requiredOption(`--platform-id <platform-id>`, `Platform ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
  .requiredOption(`--package-name <package-name>`, `Linux package name. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ platformId, name, packageName }) =>
        parse(await (await getProjectClient()).createLinuxPlatform(platformId, name, packageName)),
    ),
  );


const projectUpdateLinuxPlatformCommand = project
  .command(`update-linux-platform`)
  .description(`Update a Linux platform by its unique ID. Use this endpoint to update the platform's name or package name.`)
  .requiredOption(`--platform-id <platform-id>`, `Platform ID.`)
  .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
  .requiredOption(`--package-name <package-name>`, `Linux package name. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ platformId, name, packageName }) =>
        parse(await (await getProjectClient()).updateLinuxPlatform(platformId, name, packageName)),
    ),
  );


const projectCreateWebPlatformCommand = project
  .command(`create-web-platform`)
  .description(`Create a new web platform for your project. Use this endpoint to register a new platform where your users will run your application which will interact with the Appwrite API.`)
  .requiredOption(`--platform-id <platform-id>`, `Platform ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
  .requiredOption(`--hostname <hostname>`, `Platform web hostname. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ platformId, name, hostname }) =>
        parse(await (await getProjectClient()).createWebPlatform(platformId, name, hostname)),
    ),
  );


const projectUpdateWebPlatformCommand = project
  .command(`update-web-platform`)
  .description(`Update a web platform by its unique ID. Use this endpoint to update the platform's name or hostname.`)
  .requiredOption(`--platform-id <platform-id>`, `Platform ID.`)
  .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
  .requiredOption(`--hostname <hostname>`, `Platform web hostname. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ platformId, name, hostname }) =>
        parse(await (await getProjectClient()).updateWebPlatform(platformId, name, hostname)),
    ),
  );


const projectCreateWindowsPlatformCommand = project
  .command(`create-windows-platform`)
  .description(`Create a new Windows platform for your project. Use this endpoint to register a new Windows platform where your users will run your application which will interact with the Appwrite API.`)
  .requiredOption(`--platform-id <platform-id>`, `Platform ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
  .requiredOption(`--package-identifier-name <package-identifier-name>`, `Windows package identifier name. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ platformId, name, packageIdentifierName }) =>
        parse(await (await getProjectClient()).createWindowsPlatform(platformId, name, packageIdentifierName)),
    ),
  );


const projectUpdateWindowsPlatformCommand = project
  .command(`update-windows-platform`)
  .description(`Update a Windows platform by its unique ID. Use this endpoint to update the platform's name or package identifier name.`)
  .requiredOption(`--platform-id <platform-id>`, `Platform ID.`)
  .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
  .requiredOption(`--package-identifier-name <package-identifier-name>`, `Windows package identifier name. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ platformId, name, packageIdentifierName }) =>
        parse(await (await getProjectClient()).updateWindowsPlatform(platformId, name, packageIdentifierName)),
    ),
  );


const projectGetPlatformCommand = project
  .command(`get-platform`)
  .description(`Get a platform by its unique ID. This endpoint returns the platform's details, including its name, type, and key configurations.`)
  .requiredOption(`--platform-id <platform-id>`, `Platform ID.`)
  .action(
    actionRunner(
      async ({ platformId }) =>
        parse(await (await getProjectClient()).getPlatform(platformId)),
    ),
  );


const projectDeletePlatformCommand = project
  .command(`delete-platform`)
  .description(`Delete a platform by its unique ID. This endpoint removes the platform and all its configurations from the project.`)
  .requiredOption(`--platform-id <platform-id>`, `Platform ID.`)
  .action(
    actionRunner(
      async ({ platformId }) =>
        parse(await (await getProjectClient()).deletePlatform(platformId)),
    ),
  );


const projectListPoliciesCommand = project
  .command(`list-policies`)
  .description(`Get a list of all project policies and their current configuration.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common pagination prefer --limit and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--limit <limit>`, `Maximum number of results to return.`, parseInteger)
  .option(`--offset <offset>`, `Number of results to skip.`, parseInteger)
  .action(
    actionRunner(
      async ({ queries, total, limit, offset }) =>
        parse(await (await getProjectClient()).listPolicies(buildQueries({ queries, limit, offset }), total)),
    ),
  );


const projectUpdateDenyAliasedEmailPolicyCommand = project
  .command(`update-deny-aliased-email-policy`)
  .description(`Configures if aliased emails such as subaddresses and emails with suffixes are denied during new users sign-ups and email updates.`)
  .requiredOption(`--enabled <enabled>`, `Set whether or not to block aliased emails during signup and email updates.`, parseBool)
  .action(
    actionRunner(
      async ({ enabled }) =>
        parse(await (await getProjectClient()).updateDenyAliasedEmailPolicy(enabled)),
    ),
  );


const projectUpdateDenyDisposableEmailPolicyCommand = project
  .command(`update-deny-disposable-email-policy`)
  .description(`Configures if disposable emails from known temporary domains are denied during new users sign-ups and email updates.`)
  .requiredOption(`--enabled <enabled>`, `Set whether or not to block disposable email addresses during signup and email updates.`, parseBool)
  .action(
    actionRunner(
      async ({ enabled }) =>
        parse(await (await getProjectClient()).updateDenyDisposableEmailPolicy(enabled)),
    ),
  );


const projectUpdateDenyFreeEmailPolicyCommand = project
  .command(`update-deny-free-email-policy`)
  .description(`Configures if emails from free providers such as Gmail or Yahoo are denied during new users sign-ups and email updates.`)
  .requiredOption(`--enabled <enabled>`, `Set whether or not to block free email addresses during signup and email updates.`, parseBool)
  .action(
    actionRunner(
      async ({ enabled }) =>
        parse(await (await getProjectClient()).updateDenyFreeEmailPolicy(enabled)),
    ),
  );


const projectUpdateMembershipPrivacyPolicyCommand = project
  .command(`update-membership-privacy-policy`)
  .description(`Updating this policy allows you to control if team members can see other members information. When enabled, all team members can see ID, name, email, phone number, and MFA status of other members..`)
  .option(
    `--user-id [value]`,
    `Set to true if you want make user ID visible to all team members, or false to hide it.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--user-email [value]`,
    `Set to true if you want make user email visible to all team members, or false to hide it.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--user-phone [value]`,
    `Set to true if you want make user phone number visible to all team members, or false to hide it.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--user-name [value]`,
    `Set to true if you want make user name visible to all team members, or false to hide it.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--user-mfa [value]`,
    `Set to true if you want make user MFA status visible to all team members, or false to hide it.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ userId, userEmail, userPhone, userName, userMfa }) =>
        parse(await (await getProjectClient()).updateMembershipPrivacyPolicy(userId, userEmail, userPhone, userName, userMfa)),
    ),
  );


const projectUpdatePasswordDictionaryPolicyCommand = project
  .command(`update-password-dictionary-policy`)
  .description(`Updating this policy allows you to control if new passwords are checked against most common passwords dictionary. When enabled, and user changes their password, password must not be contained in the dictionary.`)
  .requiredOption(`--enabled <enabled>`, `Toggle password dictionary policy. Set to true if you want password change to block passwords in the dictionary, or false to allow them. When changing this policy, existing passwords remain valid.`, parseBool)
  .action(
    actionRunner(
      async ({ enabled }) =>
        parse(await (await getProjectClient()).updatePasswordDictionaryPolicy(enabled)),
    ),
  );


const projectUpdatePasswordHistoryPolicyCommand = project
  .command(`update-password-history-policy`)
  .description(`Updates one of password strength policies. Based on total length configured, previous password hashes are stored, and users cannot choose a new password that is already stored in the passwird history list, when updating an user password, or setting new one through password recovery.

Keep in mind, while password history policy is disabled, the history is not being stored. Enabling the policy will not have any history on existing users, and it will only start to collect and enforce the policy on password changes since the policy is enabled.`)
  .requiredOption(`--total <total>`, `Set the password history length per user. Value can be between 1 and 5000, or null to disable the limit.`, parseInteger)
  .action(
    actionRunner(
      async ({ total }) =>
        parse(await (await getProjectClient()).updatePasswordHistoryPolicy(total)),
    ),
  );


const projectUpdatePasswordPersonalDataPolicyCommand = project
  .command(`update-password-personal-data-policy`)
  .description(`Updating this policy allows you to control if password strength is checked against personal data. When enabled, and user sets or changes their password, the password must not contain user ID, name, email or phone number.`)
  .requiredOption(`--enabled <enabled>`, `Toggle password personal data policy. Set to true if you want to block passwords including user's personal data, or false to allow it. When changing this policy, existing passwords remain valid.`, parseBool)
  .action(
    actionRunner(
      async ({ enabled }) =>
        parse(await (await getProjectClient()).updatePasswordPersonalDataPolicy(enabled)),
    ),
  );


const projectUpdateSessionAlertPolicyCommand = project
  .command(`update-session-alert-policy`)
  .description(`Updating this policy allows you to control if email alert is sent upon session creation. When enabled, and user signs into their account, they will be sent an email notification. There is an exception, the first session after a new sign up does not trigger an alert, even if the policy is enabled.`)
  .requiredOption(`--enabled <enabled>`, `Toggle session alert policy. Set to true if you want users to receive email notifications when a sessions are created for their users, or false to not send email alerts.`, parseBool)
  .action(
    actionRunner(
      async ({ enabled }) =>
        parse(await (await getProjectClient()).updateSessionAlertPolicy(enabled)),
    ),
  );


const projectUpdateSessionDurationPolicyCommand = project
  .command(`update-session-duration-policy`)
  .description(`Update maximum duration how long sessions created within a project should stay active for.`)
  .requiredOption(`--duration <duration>`, `Maximum session length in seconds. Minium allowed value is 5 second, and maximum is 1 year, which is 31536000 seconds.`, parseInteger)
  .action(
    actionRunner(
      async ({ duration }) =>
        parse(await (await getProjectClient()).updateSessionDurationPolicy(duration)),
    ),
  );


const projectUpdateSessionInvalidationPolicyCommand = project
  .command(`update-session-invalidation-policy`)
  .description(`Updating this policy allows you to control if existing sessions should be invalidated when a password of a user is changed. When enabled, and user changes their password, they will be logged out of all their devices.`)
  .requiredOption(`--enabled <enabled>`, `Toggle session invalidation policy. Set to true if you want password change to invalidate all sessions of an user, or false to keep sessions active.`, parseBool)
  .action(
    actionRunner(
      async ({ enabled }) =>
        parse(await (await getProjectClient()).updateSessionInvalidationPolicy(enabled)),
    ),
  );


const projectUpdateSessionLimitPolicyCommand = project
  .command(`update-session-limit-policy`)
  .description(`Update the maximum number of sessions allowed per user. When the limit is hit, the oldest session will be deleted to make room for new one.`)
  .requiredOption(`--total <total>`, `Set the maximum number of sessions allowed per user. Value can be between 1 and 5000, or null to disable the limit.`, parseInteger)
  .action(
    actionRunner(
      async ({ total }) =>
        parse(await (await getProjectClient()).updateSessionLimitPolicy(total)),
    ),
  );


const projectUpdateUserLimitPolicyCommand = project
  .command(`update-user-limit-policy`)
  .description(`Update the maximum number of users in the project. When the limit is hit or amount of existing users already exceeded the limit, all users remain active, but new user sign up will be prohibited.`)
  .requiredOption(`--total <total>`, `Set the maximum number of users allowed in the project. Value can be between 1 and 5000, or null to disable the limit.`, parseInteger)
  .action(
    actionRunner(
      async ({ total }) =>
        parse(await (await getProjectClient()).updateUserLimitPolicy(total)),
    ),
  );


const projectGetPolicyCommand = project
  .command(`get-policy`)
  .description(`Get a policy by its unique ID. This endpoint returns the current configuration for the requested project policy.`)
  .requiredOption(`--policy-id <policy-id>`, `Policy ID. Can be one of: password-dictionary, password-history, password-personal-data, session-alert, session-duration, session-invalidation, session-limit, user-limit, membership-privacy.`)
  .action(
    actionRunner(
      async ({ policyId }) =>
        parse(await (await getProjectClient()).getPolicy(policyId)),
    ),
  );


const projectUpdateProtocolCommand = project
  .command(`update-protocol`)
  .description(`Update properties of a specific protocol. Use this endpoint to enable or disable a protocol in your project. `)
  .requiredOption(`--protocol-id <protocol-id>`, `Protocol name. Can be one of: rest, graphql, websocket`)
  .requiredOption(`--enabled <enabled>`, `Protocol status.`, parseBool)
  .action(
    actionRunner(
      async ({ protocolId, enabled }) =>
        parse(await (await getProjectClient()).updateProtocol(protocolId, enabled)),
    ),
  );


const projectUpdateServiceCommand = project
  .command(`update-service`)
  .description(`Update properties of a specific service. Use this endpoint to enable or disable a service in your project. `)
  .requiredOption(`--service-id <service-id>`, `Service name. Can be one of: account, avatars, databases, tablesdb, locale, health, project, storage, teams, users, vcs, sites, functions, proxy, graphql, migrations, messaging, advisor`)
  .requiredOption(`--enabled <enabled>`, `Service status.`, parseBool)
  .action(
    actionRunner(
      async ({ serviceId, enabled }) =>
        parse(await (await getProjectClient()).updateService(serviceId, enabled)),
    ),
  );


const projectUpdateSMTPCommand = project
  .command(`update-smtp`)
  .description(`Update the SMTP configuration for your project. Use this endpoint to configure your project's SMTP provider with your custom settings for sending transactional emails.`)
  .option(`--host <host>`, `SMTP server hostname (domain)`)
  .option(`--port <port>`, `SMTP server port`, parseInteger)
  .option(`--username <username>`, `SMTP server username. Pass an empty string to clear a previously set value.`)
  .option(`--password <password>`, `SMTP server password. Pass an empty string to clear a previously set value. This property is stored securely and cannot be read in future (write-only).`)
  .option(`--sender-email <sender-email>`, `Email address shown in inbox as the sender of the email. Pass an empty string to clear a previously set value.`)
  .option(`--sender-name <sender-name>`, `Name shown in inbox as the sender of the email. Pass an empty string to clear a previously set value.`)
  .option(`--reply-to-email <reply-to-email>`, `Email used when user replies to the email. Pass an empty string to clear a previously set value.`)
  .option(`--reply-to-name <reply-to-name>`, `Name used when user replies to the email. Pass an empty string to clear a previously set value.`)
  .option(`--secure <secure>`, `Configures if communication with SMTP server is encrypted. Allowed values are: tls, ssl. Leave empty for no encryption.`)
  .option(
    `--enabled [value]`,
    `Enable or disable custom SMTP. Custom SMTP is useful for branding purposes, but also allows use of custom email templates.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ host, port, username, password, senderEmail, senderName, replyToEmail, replyToName, secure, enabled }) =>
        parse(await (await getProjectClient()).updateSMTP(host, port, username, password, senderEmail, senderName, replyToEmail, replyToName, secure, enabled)),
    ),
  );


const projectCreateSMTPTestCommand = project
  .command(`create-smtp-test`)
  .description(`Send a test email to verify SMTP configuration. `)
  .requiredOption(`--emails [emails...]`, `Array of emails to send test email to. Maximum of 10 emails are allowed.`)
  .action(
    actionRunner(
      async ({ emails }) =>
        parse(await (await getProjectClient()).createSMTPTest(emails)),
    ),
  );


const projectListEmailTemplatesCommand = project
  .command(`list-email-templates`)
  .description(`Get a list of all custom email templates configured for the project. This endpoint returns an array of all configured email templates and their locales.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common pagination prefer --limit and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--limit <limit>`, `Maximum number of results to return.`, parseInteger)
  .option(`--offset <offset>`, `Number of results to skip.`, parseInteger)
  .action(
    actionRunner(
      async ({ queries, total, limit, offset }) =>
        parse(await (await getProjectClient()).listEmailTemplates(buildQueries({ queries, limit, offset }), total)),
    ),
  );


const projectUpdateEmailTemplateCommand = project
  .command(`update-email-template`)
  .description(`Update a custom email template for the specified locale and type. Use this endpoint to modify the content of your email templates.`)
  .requiredOption(`--template-id <template-id>`, `Custom email template type. Can be one of: verification, magicSession, recovery, invitation, mfaChallenge, sessionAlert, otpSession`)
  .option(`--locale <locale>`, `Custom email template locale. If left empty, the fallback locale (en) will be used.`)
  .option(`--subject <subject>`, `Subject of the email template. Can be up to 255 characters.`)
  .option(`--message <message>`, `Plain or HTML body of the email template message. Can be up to 10MB of content.`)
  .option(`--sender-name <sender-name>`, `Name of the email sender.`)
  .option(`--sender-email <sender-email>`, `Email of the sender. Pass an empty string to clear a previously set value.`)
  .option(`--reply-to-email <reply-to-email>`, `Reply to email. Pass an empty string to clear a previously set value.`)
  .option(`--reply-to-name <reply-to-name>`, `Reply to name.`)
  .action(
    actionRunner(
      async ({ templateId, locale, subject, message, senderName, senderEmail, replyToEmail, replyToName }) =>
        parse(await (await getProjectClient()).updateEmailTemplate(templateId, locale, subject, message, senderName, senderEmail, replyToEmail, replyToName)),
    ),
  );


const projectGetEmailTemplateCommand = project
  .command(`get-email-template`)
  .description(`Get a custom email template for the specified locale and type. This endpoint returns the template content, subject, and other configuration details.`)
  .requiredOption(`--template-id <template-id>`, `Custom email template type. Can be one of: verification, magicSession, recovery, invitation, mfaChallenge, sessionAlert, otpSession`)
  .option(`--locale <locale>`, `Custom email template locale. If left empty, the fallback locale (en) will be used.`)
  .action(
    actionRunner(
      async ({ templateId, locale }) =>
        parse(await (await getProjectClient()).getEmailTemplate(templateId, locale)),
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
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, resourceType, resourceId, secret`)
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
        parse(await (await getProjectClient()).listVariables(buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }), total)),
    ),
  );


const projectCreateVariableCommand = project
  .command(`create-variable`)
  .description(`Create a new project environment variable. These variables can be accessed by all functions and sites in the project.`)
  .requiredOption(`--variable-id <variable-id>`, `Variable unique ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
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
  .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
  .action(
    actionRunner(
      async ({ variableId }) =>
        parse(await (await getProjectClient()).getVariable(variableId)),
    ),
  );


const projectUpdateVariableCommand = project
  .command(`update-variable`)
  .description(`Update variable by its unique ID.`)
  .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
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
  .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
  .action(
    actionRunner(
      async ({ variableId }) =>
        parse(await (await getProjectClient()).deleteVariable(variableId)),
    ),
  );


