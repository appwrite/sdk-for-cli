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
// Mock enums
export enum Region {
  // Mock enum values
}
export enum Api {
  // Mock enum values
}
export enum AuthMethod {
  // Mock enum values
}
export enum OAuthProvider {
  // Mock enum values
}
export enum PlatformType {
  // Mock enum values
}
export enum ApiService {
  // Mock enum values
}
export enum SMTPSecure {
  // Mock enum values
}
export enum EmailTemplateType {
  // Mock enum values
}
export enum EmailTemplateLocale {
  // Mock enum values
}
export enum SmsTemplateType {
  // Mock enum values
}
export enum SmsTemplateLocale {
  // Mock enum values
}

// Mock Projects class
class Projects {
  constructor(sdkClient: any) {}

  async list(queries?: any[], search?: string, total?: boolean): Promise<any> {
    return { result: 'GET:/v1/projects:passed' };
  }

  async create(projectId: string, name: string, teamId: string, region?: string, description?: string, logo?: string, url?: string, legalName?: string, legalCountry?: string, legalState?: string, legalCity?: string, legalAddress?: string, legalTaxId?: string): Promise<any> {
    return { result: 'POST:/v1/projects:passed' };
  }

  async get(projectId: string): Promise<any> {
    return { result: 'GET:/v1/projects/{projectId}:passed' };
  }

  async update(projectId: string, name: string, description?: string, logo?: string, url?: string, legalName?: string, legalCountry?: string, legalState?: string, legalCity?: string, legalAddress?: string, legalTaxId?: string): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}:passed' };
  }

  async delete(projectId: string): Promise<any> {
    return { result: 'DELETE:/v1/projects/{projectId}:passed' };
  }

  async updateApiStatus(projectId: string, api: string, status: boolean): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/api:passed' };
  }

  async updateAPIStatus(projectId: string, api: string, status: boolean): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/api:passed' };
  }

  async updateApiStatusAll(projectId: string, status: boolean): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/api/all:passed' };
  }

  async updateAPIStatusAll(projectId: string, status: boolean): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/api/all:passed' };
  }

  async updateAuthDuration(projectId: string, duration: number): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/auth/duration:passed' };
  }

  async updateAuthLimit(projectId: string, limit: number): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/auth/limit:passed' };
  }

  async updateAuthSessionsLimit(projectId: string, limit: number): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/auth/max-sessions:passed' };
  }

  async updateMembershipsPrivacy(projectId: string, userName: boolean, userEmail: boolean, mfa: boolean): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/auth/memberships-privacy:passed' };
  }

  async updateMockNumbers(projectId: string, numbers: any[]): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/auth/mock-numbers:passed' };
  }

  async updateAuthPasswordDictionary(projectId: string, enabled: boolean): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/auth/password-dictionary:passed' };
  }

  async updateAuthPasswordHistory(projectId: string, limit: number): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/auth/password-history:passed' };
  }

  async updatePersonalDataCheck(projectId: string, enabled: boolean): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/auth/personal-data:passed' };
  }

  async updateSessionAlerts(projectId: string, alerts: boolean): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/auth/session-alerts:passed' };
  }

  async updateSessionInvalidation(projectId: string, enabled: boolean): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/auth/session-invalidation:passed' };
  }

  async updateAuthStatus(projectId: string, method: string, status: boolean): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/auth/{method}:passed' };
  }

  async listDevKeys(projectId: string, queries?: any[]): Promise<any> {
    return { result: 'GET:/v1/projects/{projectId}/dev-keys:passed' };
  }

  async createDevKey(projectId: string, name: string, expire: string): Promise<any> {
    return { result: 'POST:/v1/projects/{projectId}/dev-keys:passed' };
  }

  async getDevKey(projectId: string, keyId: string): Promise<any> {
    return { result: 'GET:/v1/projects/{projectId}/dev-keys/{keyId}:passed' };
  }

  async updateDevKey(projectId: string, keyId: string, name: string, expire: string): Promise<any> {
    return { result: 'PUT:/v1/projects/{projectId}/dev-keys/{keyId}:passed' };
  }

  async deleteDevKey(projectId: string, keyId: string): Promise<any> {
    return { result: 'DELETE:/v1/projects/{projectId}/dev-keys/{keyId}:passed' };
  }

  async createJWT(projectId: string, scopes: any[], duration?: number): Promise<any> {
    return { result: 'POST:/v1/projects/{projectId}/jwts:passed' };
  }

  async listKeys(projectId: string, total?: boolean): Promise<any> {
    return { result: 'GET:/v1/projects/{projectId}/keys:passed' };
  }

  async createKey(projectId: string, name: string, scopes: any[], expire?: string): Promise<any> {
    return { result: 'POST:/v1/projects/{projectId}/keys:passed' };
  }

  async getKey(projectId: string, keyId: string): Promise<any> {
    return { result: 'GET:/v1/projects/{projectId}/keys/{keyId}:passed' };
  }

  async updateKey(projectId: string, keyId: string, name: string, scopes: any[], expire?: string): Promise<any> {
    return { result: 'PUT:/v1/projects/{projectId}/keys/{keyId}:passed' };
  }

  async deleteKey(projectId: string, keyId: string): Promise<any> {
    return { result: 'DELETE:/v1/projects/{projectId}/keys/{keyId}:passed' };
  }

  async updateOAuth2(projectId: string, provider: string, appId?: string, secret?: string, enabled?: boolean): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/oauth2:passed' };
  }

  async listPlatforms(projectId: string, total?: boolean): Promise<any> {
    return { result: 'GET:/v1/projects/{projectId}/platforms:passed' };
  }

  async createPlatform(projectId: string, type: string, name: string, key?: string, store?: string, hostname?: string): Promise<any> {
    return { result: 'POST:/v1/projects/{projectId}/platforms:passed' };
  }

  async getPlatform(projectId: string, platformId: string): Promise<any> {
    return { result: 'GET:/v1/projects/{projectId}/platforms/{platformId}:passed' };
  }

  async updatePlatform(projectId: string, platformId: string, name: string, key?: string, store?: string, hostname?: string): Promise<any> {
    return { result: 'PUT:/v1/projects/{projectId}/platforms/{platformId}:passed' };
  }

  async deletePlatform(projectId: string, platformId: string): Promise<any> {
    return { result: 'DELETE:/v1/projects/{projectId}/platforms/{platformId}:passed' };
  }

  async updateServiceStatus(projectId: string, service: string, status: boolean): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/service:passed' };
  }

  async updateServiceStatusAll(projectId: string, status: boolean): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/service/all:passed' };
  }

  async updateSmtp(projectId: string, enabled: boolean, senderName?: string, senderEmail?: string, replyTo?: string, host?: string, port?: number, username?: string, password?: string, secure?: string): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/smtp:passed' };
  }

  async updateSMTP(projectId: string, enabled: boolean, senderName?: string, senderEmail?: string, replyTo?: string, host?: string, port?: number, username?: string, password?: string, secure?: string): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/smtp:passed' };
  }

  async createSmtpTest(projectId: string, emails: any[], senderName: string, senderEmail: string, host: string, replyTo?: string, port?: number, username?: string, password?: string, secure?: string): Promise<any> {
    return { result: 'POST:/v1/projects/{projectId}/smtp/tests:passed' };
  }

  async createSMTPTest(projectId: string, emails: any[], senderName: string, senderEmail: string, host: string, replyTo?: string, port?: number, username?: string, password?: string, secure?: string): Promise<any> {
    return { result: 'POST:/v1/projects/{projectId}/smtp/tests:passed' };
  }

  async updateTeam(projectId: string, teamId: string): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/team:passed' };
  }

  async getEmailTemplate(projectId: string, type: string, locale: string): Promise<any> {
    return { result: 'GET:/v1/projects/{projectId}/templates/email/{type}/{locale}:passed' };
  }

  async updateEmailTemplate(projectId: string, type: string, locale: string, subject: string, message: string, senderName?: string, senderEmail?: string, replyTo?: string): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/templates/email/{type}/{locale}:passed' };
  }

  async deleteEmailTemplate(projectId: string, type: string, locale: string): Promise<any> {
    return { result: 'DELETE:/v1/projects/{projectId}/templates/email/{type}/{locale}:passed' };
  }

  async getSmsTemplate(projectId: string, type: string, locale: string): Promise<any> {
    return { result: 'GET:/v1/projects/{projectId}/templates/sms/{type}/{locale}:passed' };
  }

  async getSMSTemplate(projectId: string, type: string, locale: string): Promise<any> {
    return { result: 'GET:/v1/projects/{projectId}/templates/sms/{type}/{locale}:passed' };
  }

  async updateSmsTemplate(projectId: string, type: string, locale: string, message: string): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/templates/sms/{type}/{locale}:passed' };
  }

  async updateSMSTemplate(projectId: string, type: string, locale: string, message: string): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/templates/sms/{type}/{locale}:passed' };
  }

  async deleteSmsTemplate(projectId: string, type: string, locale: string): Promise<any> {
    return { result: 'DELETE:/v1/projects/{projectId}/templates/sms/{type}/{locale}:passed' };
  }

  async deleteSMSTemplate(projectId: string, type: string, locale: string): Promise<any> {
    return { result: 'DELETE:/v1/projects/{projectId}/templates/sms/{type}/{locale}:passed' };
  }

  async listWebhooks(projectId: string, total?: boolean): Promise<any> {
    return { result: 'GET:/v1/projects/{projectId}/webhooks:passed' };
  }

  async createWebhook(projectId: string, name: string, events: any[], url: string, security: boolean, enabled?: boolean, httpUser?: string, httpPass?: string): Promise<any> {
    return { result: 'POST:/v1/projects/{projectId}/webhooks:passed' };
  }

  async getWebhook(projectId: string, webhookId: string): Promise<any> {
    return { result: 'GET:/v1/projects/{projectId}/webhooks/{webhookId}:passed' };
  }

  async updateWebhook(projectId: string, webhookId: string, name: string, events: any[], url: string, security: boolean, enabled?: boolean, httpUser?: string, httpPass?: string): Promise<any> {
    return { result: 'PUT:/v1/projects/{projectId}/webhooks/{webhookId}:passed' };
  }

  async deleteWebhook(projectId: string, webhookId: string): Promise<any> {
    return { result: 'DELETE:/v1/projects/{projectId}/webhooks/{webhookId}:passed' };
  }

  async updateWebhookSignature(projectId: string, webhookId: string): Promise<any> {
    return { result: 'PATCH:/v1/projects/{projectId}/webhooks/{webhookId}/signature:passed' };
  }
}


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
  .description(`Get a list of all projects. You can use the query params to filter your results. `)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, teamId`)
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

projects
  .command(`create`)
  .description(`Create a new project. You can create a maximum of 100 projects per account. `)
  .requiredOption(`--projectid <projectid>`, `Unique Id. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, and hyphen. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Project name. Max length: 128 chars.`)
  .requiredOption(`--teamid <teamid>`, `Team unique ID.`)
  .option(`--region <region>`, `Project Region.`)
  .option(`--description <description>`, `Project description. Max length: 256 chars.`)
  .option(`--logo <logo>`, `Project logo.`)
  .option(`--url <url>`, `Project URL.`)
  .option(`--legalname <legalname>`, `Project legal Name. Max length: 256 chars.`)
  .option(`--legalcountry <legalcountry>`, `Project legal Country. Max length: 256 chars.`)
  .option(`--legalstate <legalstate>`, `Project legal State. Max length: 256 chars.`)
  .option(`--legalcity <legalcity>`, `Project legal City. Max length: 256 chars.`)
  .option(`--legaladdress <legaladdress>`, `Project legal Address. Max length: 256 chars.`)
  .option(`--legaltaxid <legaltaxid>`, `Project legal Tax ID. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ projectId, name, teamId, region, description, logo, url, legalName, legalCountry, legalState, legalCity, legalAddress, legalTaxId }) =>
        parse(await (await getProjectsClient()).create(projectId, name, teamId, region as Region, description, logo, url, legalName, legalCountry, legalState, legalCity, legalAddress, legalTaxId)),
    ),
  );

projects
  .command(`get`)
  .description(`Get a project by its unique ID. This endpoint allows you to retrieve the project's details, including its name, description, team, region, and other metadata. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .action(
    actionRunner(
      async ({ projectId }) =>
        parse(await (await getProjectsClient()).get(projectId)),
    ),
  );

projects
  .command(`update`)
  .description(`Update a project by its unique ID.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--name <name>`, `Project name. Max length: 128 chars.`)
  .option(`--description <description>`, `Project description. Max length: 256 chars.`)
  .option(`--logo <logo>`, `Project logo.`)
  .option(`--url <url>`, `Project URL.`)
  .option(`--legalname <legalname>`, `Project legal name. Max length: 256 chars.`)
  .option(`--legalcountry <legalcountry>`, `Project legal country. Max length: 256 chars.`)
  .option(`--legalstate <legalstate>`, `Project legal state. Max length: 256 chars.`)
  .option(`--legalcity <legalcity>`, `Project legal city. Max length: 256 chars.`)
  .option(`--legaladdress <legaladdress>`, `Project legal address. Max length: 256 chars.`)
  .option(`--legaltaxid <legaltaxid>`, `Project legal tax ID. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ projectId, name, description, logo, url, legalName, legalCountry, legalState, legalCity, legalAddress, legalTaxId }) =>
        parse(await (await getProjectsClient()).update(projectId, name, description, logo, url, legalName, legalCountry, legalState, legalCity, legalAddress, legalTaxId)),
    ),
  );

projects
  .command(`delete`)
  .description(`Delete a project by its unique ID.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .action(
    actionRunner(
      async ({ projectId }) =>
        parse(await (await getProjectsClient()).delete(projectId)),
    ),
  );

projects
  .command(`update-api-status`)
  .description(`Update the status of a specific API type. Use this endpoint to enable or disable API types such as REST, GraphQL and Realtime.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--api <api>`, `API name.`)
  .requiredOption(`--status <status>`, `API status.`, parseBool)
  .action(
    actionRunner(
      async ({ projectId, api, status }) =>
        parse(await (await getProjectsClient()).updateApiStatus(projectId, api as Api, status)),
    ),
  );

projects
  .command(`update-api-status-all`)
  .description(`Update the status of all API types. Use this endpoint to enable or disable API types such as REST, GraphQL and Realtime all at once.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--status <status>`, `API status.`, parseBool)
  .action(
    actionRunner(
      async ({ projectId, status }) =>
        parse(await (await getProjectsClient()).updateApiStatusAll(projectId, status)),
    ),
  );

projects
  .command(`update-auth-duration`)
  .description(`Update how long sessions created within a project should stay active for.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--duration <duration>`, `Project session length in seconds. Max length: 31536000 seconds.`, parseInteger)
  .action(
    actionRunner(
      async ({ projectId, duration }) =>
        parse(await (await getProjectsClient()).updateAuthDuration(projectId, duration)),
    ),
  );

projects
  .command(`update-auth-limit`)
  .description(`Update the maximum number of users allowed in this project. Set to 0 for unlimited users. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--limit <limit>`, `Set the max number of users allowed in this project. Use 0 for unlimited.`, parseInteger)
  .action(
    actionRunner(
      async ({ projectId, limit }) =>
        parse(await (await getProjectsClient()).updateAuthLimit(projectId, limit)),
    ),
  );

projects
  .command(`update-auth-sessions-limit`)
  .description(`Update the maximum number of sessions allowed per user within the project, if the limit is hit the oldest session will be deleted to make room for new sessions.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--limit <limit>`, `Set the max number of users allowed in this project. Value allowed is between 1-100. Default is 10`, parseInteger)
  .action(
    actionRunner(
      async ({ projectId, limit }) =>
        parse(await (await getProjectsClient()).updateAuthSessionsLimit(projectId, limit)),
    ),
  );

projects
  .command(`update-memberships-privacy`)
  .description(`Update project membership privacy settings. Use this endpoint to control what user information is visible to other team members, such as user name, email, and MFA status. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--username <username>`, `Set to true to show userName to members of a team.`, parseBool)
  .requiredOption(`--useremail <useremail>`, `Set to true to show email to members of a team.`, parseBool)
  .requiredOption(`--mfa <mfa>`, `Set to true to show mfa to members of a team.`, parseBool)
  .action(
    actionRunner(
      async ({ projectId, userName, userEmail, mfa }) =>
        parse(await (await getProjectsClient()).updateMembershipsPrivacy(projectId, userName, userEmail, mfa)),
    ),
  );

projects
  .command(`update-mock-numbers`)
  .description(`Update the list of mock phone numbers for testing. Use these numbers to bypass SMS verification in development. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--numbers [numbers...]`, `An array of mock numbers and their corresponding verification codes (OTPs). Each number should be a valid E.164 formatted phone number. Maximum of 10 numbers are allowed.`)
  .action(
    actionRunner(
      async ({ projectId, numbers }) =>
        parse(await (await getProjectsClient()).updateMockNumbers(projectId, numbers)),
    ),
  );

projects
  .command(`update-auth-password-dictionary`)
  .description(`Enable or disable checking user passwords against common passwords dictionary. This helps ensure users don't use common and insecure passwords. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--enabled <enabled>`, `Set whether or not to enable checking user's password against most commonly used passwords. Default is false.`, parseBool)
  .action(
    actionRunner(
      async ({ projectId, enabled }) =>
        parse(await (await getProjectsClient()).updateAuthPasswordDictionary(projectId, enabled)),
    ),
  );

projects
  .command(`update-auth-password-history`)
  .description(`Update the authentication password history requirement. Use this endpoint to require new passwords to be different than the last X amount of previously used ones.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--limit <limit>`, `Set the max number of passwords to store in user history. User can't choose a new password that is already stored in the password history list.  Max number of passwords allowed in history is20. Default value is 0`, parseInteger)
  .action(
    actionRunner(
      async ({ projectId, limit }) =>
        parse(await (await getProjectsClient()).updateAuthPasswordHistory(projectId, limit)),
    ),
  );

projects
  .command(`update-personal-data-check`)
  .description(`Enable or disable checking user passwords against their personal data. This helps prevent users from using personal information in their passwords. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--enabled <enabled>`, `Set whether or not to check a password for similarity with personal data. Default is false.`, parseBool)
  .action(
    actionRunner(
      async ({ projectId, enabled }) =>
        parse(await (await getProjectsClient()).updatePersonalDataCheck(projectId, enabled)),
    ),
  );

projects
  .command(`update-session-alerts`)
  .description(`Enable or disable session email alerts. When enabled, users will receive email notifications when new sessions are created.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--alerts <alerts>`, `Set to true to enable session emails.`, parseBool)
  .action(
    actionRunner(
      async ({ projectId, alerts }) =>
        parse(await (await getProjectsClient()).updateSessionAlerts(projectId, alerts)),
    ),
  );

projects
  .command(`update-session-invalidation`)
  .description(`Invalidate all existing sessions. An optional auth security setting for projects, and enabled by default for console project.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--enabled <enabled>`, `Update authentication session invalidation status. Use this endpoint to enable or disable session invalidation on password change`, parseBool)
  .action(
    actionRunner(
      async ({ projectId, enabled }) =>
        parse(await (await getProjectsClient()).updateSessionInvalidation(projectId, enabled)),
    ),
  );

projects
  .command(`update-auth-status`)
  .description(`Update the status of a specific authentication method. Use this endpoint to enable or disable different authentication methods such as email, magic urls or sms in your project. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--method <method>`, `Auth Method. Possible values: email-password,magic-url,email-otp,anonymous,invites,jwt,phone`)
  .requiredOption(`--status <status>`, `Set the status of this auth method.`, parseBool)
  .action(
    actionRunner(
      async ({ projectId, method, status }) =>
        parse(await (await getProjectsClient()).updateAuthStatus(projectId, method as AuthMethod, status)),
    ),
  );

projects
  .command(`list-dev-keys`)
  .description(`List all the project\'s dev keys. Dev keys are project specific and allow you to bypass rate limits and get better error logging during development.'`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: accessedAt, expire`)
  .action(
    actionRunner(
      async ({ projectId, queries }) =>
        parse(await (await getProjectsClient()).listDevKeys(projectId, queries)),
    ),
  );

projects
  .command(`create-dev-key`)
  .description(`Create a new project dev key. Dev keys are project specific and allow you to bypass rate limits and get better error logging during development. Strictly meant for development purposes only.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
  .requiredOption(`--expire <expire>`, `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format.`)
  .action(
    actionRunner(
      async ({ projectId, name, expire }) =>
        parse(await (await getProjectsClient()).createDevKey(projectId, name, expire)),
    ),
  );

projects
  .command(`get-dev-key`)
  .description(`Get a project\'s dev key by its unique ID. Dev keys are project specific and allow you to bypass rate limits and get better error logging during development.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--keyid <keyid>`, `Key unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, keyId }) =>
        parse(await (await getProjectsClient()).getDevKey(projectId, keyId)),
    ),
  );

projects
  .command(`update-dev-key`)
  .description(`Update a project\'s dev key by its unique ID. Use this endpoint to update a project\'s dev key name or expiration time.'`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--keyid <keyid>`, `Key unique ID.`)
  .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
  .requiredOption(`--expire <expire>`, `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format.`)
  .action(
    actionRunner(
      async ({ projectId, keyId, name, expire }) =>
        parse(await (await getProjectsClient()).updateDevKey(projectId, keyId, name, expire)),
    ),
  );

projects
  .command(`delete-dev-key`)
  .description(`Delete a project\'s dev key by its unique ID. Once deleted, the key will no longer allow bypassing of rate limits and better logging of errors.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--keyid <keyid>`, `Key unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, keyId }) =>
        parse(await (await getProjectsClient()).deleteDevKey(projectId, keyId)),
    ),
  );

projects
  .command(`create-jwt`)
  .description(`Create a new JWT token. This token can be used to authenticate users with custom scopes and expiration time. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--scopes [scopes...]`, `List of scopes allowed for JWT key. Maximum of 100 scopes are allowed.`)
  .option(`--duration <duration>`, `Time in seconds before JWT expires. Default duration is 900 seconds, and maximum is 3600 seconds.`, parseInteger)
  .action(
    actionRunner(
      async ({ projectId, scopes, duration }) =>
        parse(await (await getProjectsClient()).createJWT(projectId, scopes, duration)),
    ),
  );

projects
  .command(`list-keys`)
  .description(`Get a list of all API keys from the current project. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ projectId, total }) =>
        parse(await (await getProjectsClient()).listKeys(projectId, total)),
    ),
  );

projects
  .command(`create-key`)
  .description(`Create a new API key. It's recommended to have multiple API keys with strict scopes for separate functions within your project.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
  .requiredOption(`--scopes [scopes...]`, `Key scopes list. Maximum of 100 scopes are allowed.`)
  .option(`--expire <expire>`, `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.`)
  .action(
    actionRunner(
      async ({ projectId, name, scopes, expire }) =>
        parse(await (await getProjectsClient()).createKey(projectId, name, scopes, expire)),
    ),
  );

projects
  .command(`get-key`)
  .description(`Get a key by its unique ID. This endpoint returns details about a specific API key in your project including it's scopes.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--keyid <keyid>`, `Key unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, keyId }) =>
        parse(await (await getProjectsClient()).getKey(projectId, keyId)),
    ),
  );

projects
  .command(`update-key`)
  .description(`Update a key by its unique ID. Use this endpoint to update the name, scopes, or expiration time of an API key. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--keyid <keyid>`, `Key unique ID.`)
  .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
  .requiredOption(`--scopes [scopes...]`, `Key scopes list. Maximum of 100 events are allowed.`)
  .option(`--expire <expire>`, `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.`)
  .action(
    actionRunner(
      async ({ projectId, keyId, name, scopes, expire }) =>
        parse(await (await getProjectsClient()).updateKey(projectId, keyId, name, scopes, expire)),
    ),
  );

projects
  .command(`delete-key`)
  .description(`Delete a key by its unique ID. Once deleted, the key can no longer be used to authenticate API calls. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--keyid <keyid>`, `Key unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, keyId }) =>
        parse(await (await getProjectsClient()).deleteKey(projectId, keyId)),
    ),
  );

projects
  .command(`update-o-auth-2`)
  .description(`Update the OAuth2 provider configurations. Use this endpoint to set up or update the OAuth2 provider credentials or enable/disable providers. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--provider <provider>`, `Provider Name`)
  .option(`--appid <appid>`, `Provider app ID. Max length: 256 chars.`)
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
        parse(await (await getProjectsClient()).updateOAuth2(projectId, provider as OAuthProvider, appId, secret, enabled)),
    ),
  );

projects
  .command(`list-platforms`)
  .description(`Get a list of all platforms in the project. This endpoint returns an array of all platforms and their configurations. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ projectId, total }) =>
        parse(await (await getProjectsClient()).listPlatforms(projectId, total)),
    ),
  );

projects
  .command(`create-platform`)
  .description(`Create a new platform for your project. Use this endpoint to register a new platform where your users will run your application which will interact with the Appwrite API.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--type <type>`, `Platform type. Possible values are: web, flutter-web, flutter-ios, flutter-android, flutter-linux, flutter-macos, flutter-windows, apple-ios, apple-macos, apple-watchos, apple-tvos, android, unity, react-native-ios, react-native-android.`)
  .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
  .option(`--key <key>`, `Package name for Android or bundle ID for iOS or macOS. Max length: 256 chars.`)
  .option(`--store <store>`, `App store or Google Play store ID. Max length: 256 chars.`)
  .option(`--hostname <hostname>`, `Platform client hostname. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ projectId, type, name, key, store, hostname }) =>
        parse(await (await getProjectsClient()).createPlatform(projectId, type as PlatformType, name, key, store, hostname)),
    ),
  );

projects
  .command(`get-platform`)
  .description(`Get a platform by its unique ID. This endpoint returns the platform's details, including its name, type, and key configurations. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--platformid <platformid>`, `Platform unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, platformId }) =>
        parse(await (await getProjectsClient()).getPlatform(projectId, platformId)),
    ),
  );

projects
  .command(`update-platform`)
  .description(`Update a platform by its unique ID. Use this endpoint to update the platform's name, key, platform store ID, or hostname. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--platformid <platformid>`, `Platform unique ID.`)
  .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
  .option(`--key <key>`, `Package name for android or bundle ID for iOS. Max length: 256 chars.`)
  .option(`--store <store>`, `App store or Google Play store ID. Max length: 256 chars.`)
  .option(`--hostname <hostname>`, `Platform client URL. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ projectId, platformId, name, key, store, hostname }) =>
        parse(await (await getProjectsClient()).updatePlatform(projectId, platformId, name, key, store, hostname)),
    ),
  );

projects
  .command(`delete-platform`)
  .description(`Delete a platform by its unique ID. This endpoint removes the platform and all its configurations from the project. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--platformid <platformid>`, `Platform unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, platformId }) =>
        parse(await (await getProjectsClient()).deletePlatform(projectId, platformId)),
    ),
  );

projects
  .command(`update-service-status`)
  .description(`Update the status of a specific service. Use this endpoint to enable or disable a service in your project. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--service <service>`, `Service name.`)
  .requiredOption(`--status <status>`, `Service status.`, parseBool)
  .action(
    actionRunner(
      async ({ projectId, service, status }) =>
        parse(await (await getProjectsClient()).updateServiceStatus(projectId, service as ApiService, status)),
    ),
  );

projects
  .command(`update-service-status-all`)
  .description(`Update the status of all services. Use this endpoint to enable or disable all optional services at once. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--status <status>`, `Service status.`, parseBool)
  .action(
    actionRunner(
      async ({ projectId, status }) =>
        parse(await (await getProjectsClient()).updateServiceStatusAll(projectId, status)),
    ),
  );

projects
  .command(`update-smtp`)
  .description(`Update the SMTP configuration for your project. Use this endpoint to configure your project's SMTP provider with your custom settings for sending transactional emails. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--enabled <enabled>`, `Enable custom SMTP service`, parseBool)
  .option(`--sendername <sendername>`, `Name of the email sender`)
  .option(`--senderemail <senderemail>`, `Email of the sender`)
  .option(`--replyto <replyto>`, `Reply to email`)
  .option(`--host <host>`, `SMTP server host name`)
  .option(`--port <port>`, `SMTP server port`, parseInteger)
  .option(`--username <username>`, `SMTP server username`)
  .option(`--password <password>`, `SMTP server password`)
  .option(`--secure <secure>`, `Does SMTP server use secure connection`)
  .action(
    actionRunner(
      async ({ projectId, enabled, senderName, senderEmail, replyTo, host, port, username, password, secure }) =>
        parse(await (await getProjectsClient()).updateSmtp(projectId, enabled, senderName, senderEmail, replyTo, host, port, username, password, secure as SMTPSecure)),
    ),
  );

projects
  .command(`create-smtp-test`)
  .description(`Send a test email to verify SMTP configuration. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--emails [emails...]`, `Array of emails to send test email to. Maximum of 10 emails are allowed.`)
  .requiredOption(`--sendername <sendername>`, `Name of the email sender`)
  .requiredOption(`--senderemail <senderemail>`, `Email of the sender`)
  .requiredOption(`--host <host>`, `SMTP server host name`)
  .option(`--replyto <replyto>`, `Reply to email`)
  .option(`--port <port>`, `SMTP server port`, parseInteger)
  .option(`--username <username>`, `SMTP server username`)
  .option(`--password <password>`, `SMTP server password`)
  .option(`--secure <secure>`, `Does SMTP server use secure connection`)
  .action(
    actionRunner(
      async ({ projectId, emails, senderName, senderEmail, host, replyTo, port, username, password, secure }) =>
        parse(await (await getProjectsClient()).createSmtpTest(projectId, emails, senderName, senderEmail, host, replyTo, port, username, password, secure as SMTPSecure)),
    ),
  );

projects
  .command(`update-team`)
  .description(`Update the team ID of a project allowing for it to be transferred to another team.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--teamid <teamid>`, `Team ID of the team to transfer project to.`)
  .action(
    actionRunner(
      async ({ projectId, teamId }) =>
        parse(await (await getProjectsClient()).updateTeam(projectId, teamId)),
    ),
  );

projects
  .command(`get-email-template`)
  .description(`Get a custom email template for the specified locale and type. This endpoint returns the template content, subject, and other configuration details. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--type <type>`, `Template type`)
  .requiredOption(`--locale <locale>`, `Template locale`)
  .action(
    actionRunner(
      async ({ projectId, type, locale }) =>
        parse(await (await getProjectsClient()).getEmailTemplate(projectId, type as EmailTemplateType, locale as EmailTemplateLocale)),
    ),
  );

projects
  .command(`update-email-template`)
  .description(`Update a custom email template for the specified locale and type. Use this endpoint to modify the content of your email templates.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--type <type>`, `Template type`)
  .requiredOption(`--locale <locale>`, `Template locale`)
  .requiredOption(`--subject <subject>`, `Email Subject`)
  .requiredOption(`--message <message>`, `Template message`)
  .option(`--sendername <sendername>`, `Name of the email sender`)
  .option(`--senderemail <senderemail>`, `Email of the sender`)
  .option(`--replyto <replyto>`, `Reply to email`)
  .action(
    actionRunner(
      async ({ projectId, type, locale, subject, message, senderName, senderEmail, replyTo }) =>
        parse(await (await getProjectsClient()).updateEmailTemplate(projectId, type as EmailTemplateType, locale as EmailTemplateLocale, subject, message, senderName, senderEmail, replyTo)),
    ),
  );

projects
  .command(`delete-email-template`)
  .description(`Reset a custom email template to its default value. This endpoint removes any custom content and restores the template to its original state. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--type <type>`, `Template type`)
  .requiredOption(`--locale <locale>`, `Template locale`)
  .action(
    actionRunner(
      async ({ projectId, type, locale }) =>
        parse(await (await getProjectsClient()).deleteEmailTemplate(projectId, type as EmailTemplateType, locale as EmailTemplateLocale)),
    ),
  );

projects
  .command(`get-sms-template`)
  .description(`Get a custom SMS template for the specified locale and type returning it's contents.`)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--type <type>`, `Template type`)
  .requiredOption(`--locale <locale>`, `Template locale`)
  .action(
    actionRunner(
      async ({ projectId, type, locale }) =>
        parse(await (await getProjectsClient()).getSmsTemplate(projectId, type as SmsTemplateType, locale as SmsTemplateLocale)),
    ),
  );

projects
  .command(`update-sms-template`)
  .description(`Update a custom SMS template for the specified locale and type. Use this endpoint to modify the content of your SMS templates. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--type <type>`, `Template type`)
  .requiredOption(`--locale <locale>`, `Template locale`)
  .requiredOption(`--message <message>`, `Template message`)
  .action(
    actionRunner(
      async ({ projectId, type, locale, message }) =>
        parse(await (await getProjectsClient()).updateSmsTemplate(projectId, type as SmsTemplateType, locale as SmsTemplateLocale, message)),
    ),
  );

projects
  .command(`delete-sms-template`)
  .description(`Reset a custom SMS template to its default value. This endpoint removes any custom message and restores the template to its original state. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--type <type>`, `Template type`)
  .requiredOption(`--locale <locale>`, `Template locale`)
  .action(
    actionRunner(
      async ({ projectId, type, locale }) =>
        parse(await (await getProjectsClient()).deleteSmsTemplate(projectId, type as SmsTemplateType, locale as SmsTemplateLocale)),
    ),
  );

projects
  .command(`list-webhooks`)
  .description(`Get a list of all webhooks belonging to the project. You can use the query params to filter your results. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ projectId, total }) =>
        parse(await (await getProjectsClient()).listWebhooks(projectId, total)),
    ),
  );

projects
  .command(`create-webhook`)
  .description(`Create a new webhook. Use this endpoint to configure a URL that will receive events from Appwrite when specific events occur. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--name <name>`, `Webhook name. Max length: 128 chars.`)
  .requiredOption(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
  .requiredOption(`--url <url>`, `Webhook URL.`)
  .requiredOption(`--security <security>`, `Certificate verification, false for disabled or true for enabled.`, parseBool)
  .option(
    `--enabled [value]`,
    `Enable or disable a webhook.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--httpuser <httpuser>`, `Webhook HTTP user. Max length: 256 chars.`)
  .option(`--httppass <httppass>`, `Webhook HTTP password. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ projectId, name, events, url, security, enabled, httpUser, httpPass }) =>
        parse(await (await getProjectsClient()).createWebhook(projectId, name, events, url, security, enabled, httpUser, httpPass)),
    ),
  );

projects
  .command(`get-webhook`)
  .description(`Get a webhook by its unique ID. This endpoint returns details about a specific webhook configured for a project. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--webhookid <webhookid>`, `Webhook unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, webhookId }) =>
        parse(await (await getProjectsClient()).getWebhook(projectId, webhookId)),
    ),
  );

projects
  .command(`update-webhook`)
  .description(`Update a webhook by its unique ID. Use this endpoint to update the URL, events, or status of an existing webhook. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--webhookid <webhookid>`, `Webhook unique ID.`)
  .requiredOption(`--name <name>`, `Webhook name. Max length: 128 chars.`)
  .requiredOption(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
  .requiredOption(`--url <url>`, `Webhook URL.`)
  .requiredOption(`--security <security>`, `Certificate verification, false for disabled or true for enabled.`, parseBool)
  .option(
    `--enabled [value]`,
    `Enable or disable a webhook.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--httpuser <httpuser>`, `Webhook HTTP user. Max length: 256 chars.`)
  .option(`--httppass <httppass>`, `Webhook HTTP password. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ projectId, webhookId, name, events, url, security, enabled, httpUser, httpPass }) =>
        parse(await (await getProjectsClient()).updateWebhook(projectId, webhookId, name, events, url, security, enabled, httpUser, httpPass)),
    ),
  );

projects
  .command(`delete-webhook`)
  .description(`Delete a webhook by its unique ID. Once deleted, the webhook will no longer receive project events. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--webhookid <webhookid>`, `Webhook unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, webhookId }) =>
        parse(await (await getProjectsClient()).deleteWebhook(projectId, webhookId)),
    ),
  );

projects
  .command(`update-webhook-signature`)
  .description(`Update the webhook signature key. This endpoint can be used to regenerate the signature key used to sign and validate payload deliveries for a specific webhook. `)
  .requiredOption(`--projectid <projectid>`, `Project unique ID.`)
  .requiredOption(`--webhookid <webhookid>`, `Webhook unique ID.`)
  .action(
    actionRunner(
      async ({ projectId, webhookId }) =>
        parse(await (await getProjectsClient()).updateWebhookSignature(projectId, webhookId)),
    ),
  );

