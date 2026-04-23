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

const projectUpdateCanonicalEmailsCommand = project
  .command(`update-canonical-emails`)
  .description(`Configure if canonical emails (alias subaddresses and emails with suffixes) are allowed during new users sign-ups in this project.`)
  .requiredOption(`--enabled <enabled>`, `Set whether or not to require canonical email addresses during signup and email updates.`, parseBool)
  .action(
    actionRunner(
      async ({ enabled }) =>
        parse(await (await getProjectClient()).updateCanonicalEmails(enabled)),
    ),
  );


const projectUpdateDisposableEmailsCommand = project
  .command(`update-disposable-emails`)
  .description(`Configure if disposable emails (emails of known temporary domains) are allowed during new users sign-ups in this project.`)
  .requiredOption(`--enabled <enabled>`, `Set whether or not to block disposable email addresses during signup and email updates.`, parseBool)
  .action(
    actionRunner(
      async ({ enabled }) =>
        parse(await (await getProjectClient()).updateDisposableEmails(enabled)),
    ),
  );


const projectUpdateFreeEmailsCommand = project
  .command(`update-free-emails`)
  .description(`Configure if free emails (non-commercial and not a custom domain) are allowed during new users sign-ups in this project.`)
  .requiredOption(`--enabled <enabled>`, `Set whether or not to block free email addresses during signup and email updates.`, parseBool)
  .action(
    actionRunner(
      async ({ enabled }) =>
        parse(await (await getProjectClient()).updateFreeEmails(enabled)),
    ),
  );


const projectListKeysCommand = project
  .command(`list-keys`)
  .description(`Get a list of all API keys from the current project.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: expire, accessedAt, name, scopes`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ queries, total }) =>
        parse(await (await getProjectClient()).listKeys(queries, total)),
    ),
  );


const projectCreateKeyCommand = project
  .command(`create-key`)
  .description(`Create a new API key. It's recommended to have multiple API keys with strict scopes for separate functions within your project.`)
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


const projectListPlatformsCommand = project
  .command(`list-platforms`)
  .description(`Get a list of all platforms in the project. This endpoint returns an array of all platforms and their configurations.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: type, name, hostname, bundleIdentifier, applicationId, packageIdentifierName, packageName`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ queries, total }) =>
        parse(await (await getProjectClient()).listPlatforms(queries, total)),
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
  .requiredOption(`--service-id <service-id>`, `Service name. Can be one of: account, avatars, databases, tablesdb, locale, health, project, storage, teams, users, vcs, sites, functions, proxy, graphql, migrations, messaging`)
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
  .option(`--username <username>`, `SMTP server username. Leave empty for no authorization.`)
  .option(`--password <password>`, `SMTP server password. Leave empty for no authorization. This property is stored securely and cannot be read in future (write-only).`)
  .option(`--sender-email <sender-email>`, `Email address shown in inbox as the sender of the email.`)
  .option(`--sender-name <sender-name>`, `Name shown in inbox as the sender of the email.`)
  .option(`--reply-to-email <reply-to-email>`, `Email used when user replies to the email.`)
  .option(`--reply-to-name <reply-to-name>`, `Name used when user replies to the email.`)
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


const projectUpdateEmailTemplateCommand = project
  .command(`update-email-template`)
  .description(`Update a custom email template for the specified locale and type. Use this endpoint to modify the content of your email templates.`)
  .requiredOption(`--template-id <template-id>`, `Custom email template type. Can be one of: verification, magicSession, recovery, invitation, mfaChallenge, sessionAlert, otpSession`)
  .option(`--locale <locale>`, `Custom email template locale. If left empty, the fallback locale (en) will be used.`)
  .option(`--subject <subject>`, `Subject of the email template. Can be up to 255 characters.`)
  .option(`--message <message>`, `Plain or HTML body of the email template message. Can be up to 10MB of content.`)
  .option(`--sender-name <sender-name>`, `Name of the email sender.`)
  .option(`--sender-email <sender-email>`, `Email of the sender.`)
  .option(`--reply-to-email <reply-to-email>`, `Reply to email.`)
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
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, resourceType, resourceId, secret`)
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


