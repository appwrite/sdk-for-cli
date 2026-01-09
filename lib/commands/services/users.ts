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
import {
  Users,
  PasswordHash,
  UsageRange,
  AuthenticatorType,
  MessagingProviderType,
} from "@appwrite.io/console";

let usersClient: Users | null = null;

const getUsersClient = async (): Promise<Users> => {
  if (!usersClient) {
    const sdkClient = await sdkForProject();
    usersClient = new Users(sdkClient);
  }
  return usersClient;
};

export const users = new Command("users")
  .description(commandDescriptions["users"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

users
  .command(`list`)
  .description(`Get a list of all the project's users. You can use the query params to filter your results.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, email, phone, status, passwordUpdate, registration, emailVerification, phoneVerification, labels`)
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
        parse(await (await getUsersClient()).list(queries, search, total)),
    ),
  );

users
  .command(`create`)
  .description(`Create a new user.`)
  .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .option(`--email <email>`, `User email.`)
  .option(`--phone <phone>`, `Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
  .option(`--password <password>`, `Plain text user password. Must be at least 8 chars.`)
  .option(`--name <name>`, `User name. Max length: 128 chars.`)
  .action(
    actionRunner(
      async ({ userId, email, phone, password, name }) =>
        parse(await (await getUsersClient()).create(userId, email, phone, password, name)),
    ),
  );

users
  .command(`create-argon-2-user`)
  .description(`Create a new user. Password provided must be hashed with the [Argon2](https://en.wikipedia.org/wiki/Argon2) algorithm. Use the [POST /users](https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
  .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--email <email>`, `User email.`)
  .requiredOption(`--password <password>`, `User password hashed using Argon2.`)
  .option(`--name <name>`, `User name. Max length: 128 chars.`)
  .action(
    actionRunner(
      async ({ userId, email, password, name }) =>
        parse(await (await getUsersClient()).createArgon2User(userId, email, password, name)),
    ),
  );

users
  .command(`create-bcrypt-user`)
  .description(`Create a new user. Password provided must be hashed with the [Bcrypt](https://en.wikipedia.org/wiki/Bcrypt) algorithm. Use the [POST /users](https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
  .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--email <email>`, `User email.`)
  .requiredOption(`--password <password>`, `User password hashed using Bcrypt.`)
  .option(`--name <name>`, `User name. Max length: 128 chars.`)
  .action(
    actionRunner(
      async ({ userId, email, password, name }) =>
        parse(await (await getUsersClient()).createBcryptUser(userId, email, password, name)),
    ),
  );

users
  .command(`list-identities`)
  .description(`Get identities for all users.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, provider, providerUid, providerEmail, providerAccessTokenExpiry`)
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
        parse(await (await getUsersClient()).listIdentities(queries, search, total)),
    ),
  );

users
  .command(`delete-identity`)
  .description(`Delete an identity by its unique ID.`)
  .requiredOption(`--identity-id <identity-id>`, `Identity ID.`)
  .action(
    actionRunner(
      async ({ identityId }) =>
        parse(await (await getUsersClient()).deleteIdentity(identityId)),
    ),
  );

users
  .command(`create-md-5-user`)
  .description(`Create a new user. Password provided must be hashed with the [MD5](https://en.wikipedia.org/wiki/MD5) algorithm. Use the [POST /users](https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
  .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--email <email>`, `User email.`)
  .requiredOption(`--password <password>`, `User password hashed using MD5.`)
  .option(`--name <name>`, `User name. Max length: 128 chars.`)
  .action(
    actionRunner(
      async ({ userId, email, password, name }) =>
        parse(await (await getUsersClient()).createMD5User(userId, email, password, name)),
    ),
  );

users
  .command(`create-ph-pass-user`)
  .description(`Create a new user. Password provided must be hashed with the [PHPass](https://www.openwall.com/phpass/) algorithm. Use the [POST /users](https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
  .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or pass the string \`ID.unique()\`to auto generate it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--email <email>`, `User email.`)
  .requiredOption(`--password <password>`, `User password hashed using PHPass.`)
  .option(`--name <name>`, `User name. Max length: 128 chars.`)
  .action(
    actionRunner(
      async ({ userId, email, password, name }) =>
        parse(await (await getUsersClient()).createPHPassUser(userId, email, password, name)),
    ),
  );

users
  .command(`create-scrypt-user`)
  .description(`Create a new user. Password provided must be hashed with the [Scrypt](https://github.com/Tarsnap/scrypt) algorithm. Use the [POST /users](https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
  .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--email <email>`, `User email.`)
  .requiredOption(`--password <password>`, `User password hashed using Scrypt.`)
  .requiredOption(`--password-salt <password-salt>`, `Optional salt used to hash password.`)
  .requiredOption(`--password-cpu <password-cpu>`, `Optional CPU cost used to hash password.`, parseInteger)
  .requiredOption(`--password-memory <password-memory>`, `Optional memory cost used to hash password.`, parseInteger)
  .requiredOption(`--password-parallel <password-parallel>`, `Optional parallelization cost used to hash password.`, parseInteger)
  .requiredOption(`--password-length <password-length>`, `Optional hash length used to hash password.`, parseInteger)
  .option(`--name <name>`, `User name. Max length: 128 chars.`)
  .action(
    actionRunner(
      async ({ userId, email, password, passwordSalt, passwordCpu, passwordMemory, passwordParallel, passwordLength, name }) =>
        parse(await (await getUsersClient()).createScryptUser(userId, email, password, passwordSalt, passwordCpu, passwordMemory, passwordParallel, passwordLength, name)),
    ),
  );

users
  .command(`create-scrypt-modified-user`)
  .description(`Create a new user. Password provided must be hashed with the [Scrypt Modified](https://gist.github.com/Meldiron/eecf84a0225eccb5a378d45bb27462cc) algorithm. Use the [POST /users](https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
  .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--email <email>`, `User email.`)
  .requiredOption(`--password <password>`, `User password hashed using Scrypt Modified.`)
  .requiredOption(`--password-salt <password-salt>`, `Salt used to hash password.`)
  .requiredOption(`--password-salt-separator <password-salt-separator>`, `Salt separator used to hash password.`)
  .requiredOption(`--password-signer-key <password-signer-key>`, `Signer key used to hash password.`)
  .option(`--name <name>`, `User name. Max length: 128 chars.`)
  .action(
    actionRunner(
      async ({ userId, email, password, passwordSalt, passwordSaltSeparator, passwordSignerKey, name }) =>
        parse(await (await getUsersClient()).createScryptModifiedUser(userId, email, password, passwordSalt, passwordSaltSeparator, passwordSignerKey, name)),
    ),
  );

users
  .command(`create-sha-user`)
  .description(`Create a new user. Password provided must be hashed with the [SHA](https://en.wikipedia.org/wiki/Secure_Hash_Algorithm) algorithm. Use the [POST /users](https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
  .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--email <email>`, `User email.`)
  .requiredOption(`--password <password>`, `User password hashed using SHA.`)
  .option(`--password-version <password-version>`, `Optional SHA version used to hash password. Allowed values are: 'sha1', 'sha224', 'sha256', 'sha384', 'sha512/224', 'sha512/256', 'sha512', 'sha3-224', 'sha3-256', 'sha3-384', 'sha3-512'`)
  .option(`--name <name>`, `User name. Max length: 128 chars.`)
  .action(
    actionRunner(
      async ({ userId, email, password, passwordVersion, name }) =>
        parse(await (await getUsersClient()).createSHAUser(userId, email, password, passwordVersion as PasswordHash, name)),
    ),
  );

users
  .command(`get-usage`)
  .description(`Get usage metrics and statistics for all users in the project. You can view the total number of users and sessions. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.
`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ range }) =>
        parse(await (await getUsersClient()).getUsage(range as UsageRange)),
    ),
  );

users
  .command(`get`)
  .description(`Get a user by its unique ID.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .action(
    actionRunner(
      async ({ userId }) =>
        parse(await (await getUsersClient()).get(userId)),
    ),
  );

users
  .command(`delete`)
  .description(`Delete a user by its unique ID, thereby releasing it's ID. Since ID is released and can be reused, all user-related resources like documents or storage files should be deleted before user deletion. If you want to keep ID reserved, use the [updateStatus](https://appwrite.io/docs/server/users#usersUpdateStatus) endpoint instead.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .action(
    actionRunner(
      async ({ userId }) =>
        parse(await (await getUsersClient()).delete(userId)),
    ),
  );

users
  .command(`update-email`)
  .description(`Update the user email by its unique ID.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .requiredOption(`--email <email>`, `User email.`)
  .action(
    actionRunner(
      async ({ userId, email }) =>
        parse(await (await getUsersClient()).updateEmail(userId, email)),
    ),
  );

users
  .command(`create-jwt`)
  .description(`Use this endpoint to create a JSON Web Token for user by its unique ID. You can use the resulting JWT to authenticate on behalf of the user. The JWT secret will become invalid if the session it uses gets deleted.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .option(`--session-id <session-id>`, `Session ID. Use the string 'recent' to use the most recent session. Defaults to the most recent session.`)
  .option(`--duration <duration>`, `Time in seconds before JWT expires. Default duration is 900 seconds, and maximum is 3600 seconds.`, parseInteger)
  .action(
    actionRunner(
      async ({ userId, sessionId, duration }) =>
        parse(await (await getUsersClient()).createJWT(userId, sessionId, duration)),
    ),
  );

users
  .command(`update-labels`)
  .description(`Update the user labels by its unique ID. 

Labels can be used to grant access to resources. While teams are a way for user's to share access to a resource, labels can be defined by the developer to grant access without an invitation. See the [Permissions docs](https://appwrite.io/docs/permissions) for more info.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .requiredOption(`--labels [labels...]`, `Array of user labels. Replaces the previous labels. Maximum of 1000 labels are allowed, each up to 36 alphanumeric characters long.`)
  .action(
    actionRunner(
      async ({ userId, labels }) =>
        parse(await (await getUsersClient()).updateLabels(userId, labels)),
    ),
  );

users
  .command(`list-logs`)
  .description(`Get the user activity logs list by its unique ID.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ userId, queries, total }) =>
        parse(await (await getUsersClient()).listLogs(userId, queries, total)),
    ),
  );

users
  .command(`list-memberships`)
  .description(`Get the user membership list by its unique ID.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, teamId, invited, joined, confirm, roles`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ userId, queries, search, total }) =>
        parse(await (await getUsersClient()).listMemberships(userId, queries, search, total)),
    ),
  );

users
  .command(`update-mfa`)
  .description(`Enable or disable MFA on a user account.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .requiredOption(`--mfa <mfa>`, `Enable or disable MFA.`, parseBool)
  .action(
    actionRunner(
      async ({ userId, mfa }) =>
        parse(await (await getUsersClient()).updateMfa(userId, mfa)),
    ),
  );

users
  .command(`delete-mfa-authenticator`)
  .description(`Delete an authenticator app.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .requiredOption(`--type <type>`, `Type of authenticator.`)
  .action(
    actionRunner(
      async ({ userId, type }) =>
        parse(await (await getUsersClient()).deleteMfaAuthenticator(userId, type as AuthenticatorType)),
    ),
  );

users
  .command(`list-mfa-factors`)
  .description(`List the factors available on the account to be used as a MFA challange.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .action(
    actionRunner(
      async ({ userId }) =>
        parse(await (await getUsersClient()).listMfaFactors(userId)),
    ),
  );

users
  .command(`get-mfa-recovery-codes`)
  .description(`Get recovery codes that can be used as backup for MFA flow by User ID. Before getting codes, they must be generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .action(
    actionRunner(
      async ({ userId }) =>
        parse(await (await getUsersClient()).getMfaRecoveryCodes(userId)),
    ),
  );

users
  .command(`update-mfa-recovery-codes`)
  .description(`Regenerate recovery codes that can be used as backup for MFA flow by User ID. Before regenerating codes, they must be first generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .action(
    actionRunner(
      async ({ userId }) =>
        parse(await (await getUsersClient()).updateMfaRecoveryCodes(userId)),
    ),
  );

users
  .command(`create-mfa-recovery-codes`)
  .description(`Generate recovery codes used as backup for MFA flow for User ID. Recovery codes can be used as a MFA verification type in [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge) method by client SDK.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .action(
    actionRunner(
      async ({ userId }) =>
        parse(await (await getUsersClient()).createMfaRecoveryCodes(userId)),
    ),
  );

users
  .command(`update-name`)
  .description(`Update the user name by its unique ID.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .requiredOption(`--name <name>`, `User name. Max length: 128 chars.`)
  .action(
    actionRunner(
      async ({ userId, name }) =>
        parse(await (await getUsersClient()).updateName(userId, name)),
    ),
  );

users
  .command(`update-password`)
  .description(`Update the user password by its unique ID.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .requiredOption(`--password <password>`, `New user password. Must be at least 8 chars.`)
  .action(
    actionRunner(
      async ({ userId, password }) =>
        parse(await (await getUsersClient()).updatePassword(userId, password)),
    ),
  );

users
  .command(`update-phone`)
  .description(`Update the user phone by its unique ID.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .requiredOption(`--number <number>`, `User phone number.`)
  .action(
    actionRunner(
      async ({ userId, number }) =>
        parse(await (await getUsersClient()).updatePhone(userId, number)),
    ),
  );

users
  .command(`get-prefs`)
  .description(`Get the user preferences by its unique ID.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .action(
    actionRunner(
      async ({ userId }) =>
        parse(await (await getUsersClient()).getPrefs(userId)),
    ),
  );

users
  .command(`update-prefs`)
  .description(`Update the user preferences by its unique ID. The object you pass is stored as is, and replaces any previous value. The maximum allowed prefs size is 64kB and throws error if exceeded.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .requiredOption(`--prefs <prefs>`, `Prefs key-value JSON object.`)
  .action(
    actionRunner(
      async ({ userId, prefs }) =>
        parse(await (await getUsersClient()).updatePrefs(userId, JSON.parse(prefs))),
    ),
  );

users
  .command(`list-sessions`)
  .description(`Get the user sessions list by its unique ID.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ userId, total }) =>
        parse(await (await getUsersClient()).listSessions(userId, total)),
    ),
  );

users
  .command(`create-session`)
  .description(`Creates a session for a user. Returns an immediately usable session object.

If you want to generate a token for a custom authentication flow, use the [POST /users/{userId}/tokens](https://appwrite.io/docs/server/users#createToken) endpoint.`)
  .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .action(
    actionRunner(
      async ({ userId }) =>
        parse(await (await getUsersClient()).createSession(userId)),
    ),
  );

users
  .command(`delete-sessions`)
  .description(`Delete all user's sessions by using the user's unique ID.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .action(
    actionRunner(
      async ({ userId }) =>
        parse(await (await getUsersClient()).deleteSessions(userId)),
    ),
  );

users
  .command(`delete-session`)
  .description(`Delete a user sessions by its unique ID.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .requiredOption(`--session-id <session-id>`, `Session ID.`)
  .action(
    actionRunner(
      async ({ userId, sessionId }) =>
        parse(await (await getUsersClient()).deleteSession(userId, sessionId)),
    ),
  );

users
  .command(`update-status`)
  .description(`Update the user status by its unique ID. Use this endpoint as an alternative to deleting a user if you want to keep user's ID reserved.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .requiredOption(`--status <status>`, `User Status. To activate the user pass \`true\` and to block the user pass \`false\`.`, parseBool)
  .action(
    actionRunner(
      async ({ userId, status }) =>
        parse(await (await getUsersClient()).updateStatus(userId, status)),
    ),
  );

users
  .command(`list-targets`)
  .description(`List the messaging targets that are associated with a user.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, providerId, identifier, providerType`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ userId, queries, total }) =>
        parse(await (await getUsersClient()).listTargets(userId, queries, total)),
    ),
  );

users
  .command(`create-target`)
  .description(`Create a messaging target.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .requiredOption(`--target-id <target-id>`, `Target ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--provider-type <provider-type>`, `The target provider type. Can be one of the following: \`email\`, \`sms\` or \`push\`.`)
  .requiredOption(`--identifier <identifier>`, `The target identifier (token, email, phone etc.)`)
  .option(`--provider-id <provider-id>`, `Provider ID. Message will be sent to this target from the specified provider ID. If no provider ID is set the first setup provider will be used.`)
  .option(`--name <name>`, `Target name. Max length: 128 chars. For example: My Awesome App Galaxy S23.`)
  .action(
    actionRunner(
      async ({ userId, targetId, providerType, identifier, providerId, name }) =>
        parse(await (await getUsersClient()).createTarget(userId, targetId, providerType as MessagingProviderType, identifier, providerId, name)),
    ),
  );

users
  .command(`get-target`)
  .description(`Get a user's push notification target by ID.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .requiredOption(`--target-id <target-id>`, `Target ID.`)
  .action(
    actionRunner(
      async ({ userId, targetId }) =>
        parse(await (await getUsersClient()).getTarget(userId, targetId)),
    ),
  );

users
  .command(`update-target`)
  .description(`Update a messaging target.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .requiredOption(`--target-id <target-id>`, `Target ID.`)
  .option(`--identifier <identifier>`, `The target identifier (token, email, phone etc.)`)
  .option(`--provider-id <provider-id>`, `Provider ID. Message will be sent to this target from the specified provider ID. If no provider ID is set the first setup provider will be used.`)
  .option(`--name <name>`, `Target name. Max length: 128 chars. For example: My Awesome App Galaxy S23.`)
  .action(
    actionRunner(
      async ({ userId, targetId, identifier, providerId, name }) =>
        parse(await (await getUsersClient()).updateTarget(userId, targetId, identifier, providerId, name)),
    ),
  );

users
  .command(`delete-target`)
  .description(`Delete a messaging target.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .requiredOption(`--target-id <target-id>`, `Target ID.`)
  .action(
    actionRunner(
      async ({ userId, targetId }) =>
        parse(await (await getUsersClient()).deleteTarget(userId, targetId)),
    ),
  );

users
  .command(`create-token`)
  .description(`Returns a token with a secret key for creating a session. Use the user ID and secret and submit a request to the [PUT /account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint to complete the login process.
`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .option(`--length <length>`, `Token length in characters. The default length is 6 characters`, parseInteger)
  .option(`--expire <expire>`, `Token expiration period in seconds. The default expiration is 15 minutes.`, parseInteger)
  .action(
    actionRunner(
      async ({ userId, length, expire }) =>
        parse(await (await getUsersClient()).createToken(userId, length, expire)),
    ),
  );

users
  .command(`update-email-verification`)
  .description(`Update the user email verification status by its unique ID.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .requiredOption(`--email-verification <email-verification>`, `User email verification status.`, parseBool)
  .action(
    actionRunner(
      async ({ userId, emailVerification }) =>
        parse(await (await getUsersClient()).updateEmailVerification(userId, emailVerification)),
    ),
  );

users
  .command(`update-phone-verification`)
  .description(`Update the user phone verification status by its unique ID.`)
  .requiredOption(`--user-id <user-id>`, `User ID.`)
  .requiredOption(`--phone-verification <phone-verification>`, `User phone verification status.`, parseBool)
  .action(
    actionRunner(
      async ({ userId, phoneVerification }) =>
        parse(await (await getUsersClient()).updatePhoneVerification(userId, phoneVerification)),
    ),
  );

