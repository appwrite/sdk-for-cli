import { Command } from "commander";
import { sdkForProject } from "../sdks.js";
import { actionRunner, commandDescriptions, parseBool } from "../parser.js";
import { Account } from "@appwrite.io/console";
let accountClient = null;
const getAccountClient = async () => {
    if (!accountClient) {
        const projectClient = await sdkForProject();
        accountClient = new Account(projectClient);
    }
    return accountClient;
};
export const account = new Command("account")
    .description(commandDescriptions["account"] ?? "")
    .configureHelp({
    helpWidth: process.stdout.columns || 80,
});
account
    .command(`get`)
    .description(`Get the currently logged in user.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(async () => await (await getAccountClient()).get()));
account
    .command(`create`)
    .description(`Use this endpoint to allow a new user to register a new account in your project. After the user registration completes successfully, you can use the [/account/verfication](https://appwrite.io/docs/references/cloud/client-web/account#createVerification) route to start verifying the user email address. To allow the new user to login to their new account, you need to create a new [account session](https://appwrite.io/docs/references/cloud/client-web/account#createEmailSession).`)
    .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `New user password. Must be between 8 and 256 chars.`)
    .option(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(async ({ userId, email, password, name }) => await (await getAccountClient()).create(userId, email, password, name)));
account
    .command(`delete`)
    .description(`Delete the currently logged in user.`)
    .action(actionRunner(async () => await (await getAccountClient()).delete()));
account
    .command(`update-email`)
    .description(`Update currently logged in user account email address. After changing user address, the user confirmation status will get reset. A new confirmation email is not sent automatically however you can use the send confirmation email endpoint again to send the confirmation email. For security measures, user password is required to complete this request. This endpoint can also be used to convert an anonymous account to a normal one, by passing an email address and a new password. `)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `User password. Must be at least 8 chars.`)
    .action(actionRunner(async ({ email, password }) => await (await getAccountClient()).updateEmail(email, password)));
account
    .command(`list-identities`)
    .description(`Get the list of identities for the currently logged in user.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, provider, providerUid, providerEmail, providerAccessTokenExpiry`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(async ({ queries }) => await (await getAccountClient()).listIdentities(queries)));
account
    .command(`delete-identity`)
    .description(`Delete an identity by its unique ID.`)
    .requiredOption(`--identity-id <identity-id>`, `Identity ID.`)
    .action(actionRunner(async ({ identityId }) => await (await getAccountClient()).deleteIdentity(identityId)));
account
    .command(`create-jwt`)
    .description(`Use this endpoint to create a JSON Web Token. You can use the resulting JWT to authenticate on behalf of the current user when working with the Appwrite server-side API and SDKs. The JWT secret is valid for 15 minutes from its creation and will be invalid if the user will logout in that time frame.`)
    .action(actionRunner(async () => await (await getAccountClient()).createJWT()));
account
    .command(`list-logs`)
    .description(`Get the list of latest security activity logs for the currently logged in user. Each log returns user IP address, location and date and time of log.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(async ({ queries }) => await (await getAccountClient()).listLogs(queries)));
account
    .command(`update-mfa`)
    .description(`Enable or disable MFA on an account.`)
    .requiredOption(`--mfa [value]`, `Enable or disable MFA.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(async ({ mfa }) => await (await getAccountClient()).updateMFA(mfa)));
account
    .command(`create-mfa-authenticator`)
    .description(`Add an authenticator app to be used as an MFA factor. Verify the authenticator using the [verify authenticator](/docs/references/cloud/client-web/account#updateMfaAuthenticator) method.`)
    .requiredOption(`--type <type>`, `Type of authenticator. Must be 'totp'`)
    .action(actionRunner(async ({ type }) => await (await getAccountClient()).createMfaAuthenticator(type)));
account
    .command(`update-mfa-authenticator`)
    .description(`Verify an authenticator app after adding it using the [add authenticator](/docs/references/cloud/client-web/account#createMfaAuthenticator) method.`)
    .requiredOption(`--type <type>`, `Type of authenticator.`)
    .requiredOption(`--otp <otp>`, `Valid verification token.`)
    .action(actionRunner(async ({ type, otp }) => await (await getAccountClient()).updateMfaAuthenticator(type, otp)));
account
    .command(`delete-mfa-authenticator`)
    .description(`Delete an authenticator for a user by ID.`)
    .requiredOption(`--type <type>`, `Type of authenticator.`)
    .action(actionRunner(async ({ type }) => await (await getAccountClient()).deleteMfaAuthenticator(type)));
account
    .command(`create-mfa-challenge`)
    .description(`Begin the process of MFA verification after sign-in. Finish the flow with [updateMfaChallenge](/docs/references/cloud/client-web/account#updateMfaChallenge) method.`)
    .requiredOption(`--factor <factor>`, `Factor used for verification. Must be one of following: 'email', 'phone', 'totp', 'recoveryCode'.`)
    .action(actionRunner(async ({ factor }) => await (await getAccountClient()).createMfaChallenge(factor)));
account
    .command(`update-mfa-challenge`)
    .description(`Complete the MFA challenge by providing the one-time password. Finish the process of MFA verification by providing the one-time password. To begin the flow, use [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge) method.`)
    .requiredOption(`--challenge-id <challenge-id>`, `ID of the challenge.`)
    .requiredOption(`--otp <otp>`, `Valid verification token.`)
    .action(actionRunner(async ({ challengeId, otp }) => await (await getAccountClient()).updateMfaChallenge(challengeId, otp)));
account
    .command(`list-mfa-factors`)
    .description(`List the factors available on the account to be used as a MFA challange.`)
    .action(actionRunner(async () => await (await getAccountClient()).listMfaFactors()));
account
    .command(`get-mfa-recovery-codes`)
    .description(`Get recovery codes that can be used as backup for MFA flow. Before getting codes, they must be generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method. An OTP challenge is required to read recovery codes.`)
    .action(actionRunner(async () => await (await getAccountClient()).getMfaRecoveryCodes()));
account
    .command(`create-mfa-recovery-codes`)
    .description(`Generate recovery codes as backup for MFA flow. It's recommended to generate and show then immediately after user successfully adds their authehticator. Recovery codes can be used as a MFA verification type in [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge) method.`)
    .action(actionRunner(async () => await (await getAccountClient()).createMfaRecoveryCodes()));
account
    .command(`update-mfa-recovery-codes`)
    .description(`Regenerate recovery codes that can be used as backup for MFA flow. Before regenerating codes, they must be first generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method. An OTP challenge is required to regenreate recovery codes.`)
    .action(actionRunner(async () => await (await getAccountClient()).updateMfaRecoveryCodes()));
account
    .command(`update-name`)
    .description(`Update currently logged in user account name.`)
    .requiredOption(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(async ({ name }) => await (await getAccountClient()).updateName(name)));
account
    .command(`update-password`)
    .description(`Update currently logged in user password. For validation, user is required to pass in the new password, and the old password. For users created with OAuth, Team Invites and Magic URL, oldPassword is optional.`)
    .requiredOption(`--password <password>`, `New user password. Must be at least 8 chars.`)
    .option(`--old-password <old-password>`, `Current user password. Must be at least 8 chars.`)
    .action(actionRunner(async ({ password, oldPassword }) => await (await getAccountClient()).updatePassword(password, oldPassword)));
account
    .command(`update-phone`)
    .description(`Update the currently logged in user's phone number. After updating the phone number, the phone verification status will be reset. A confirmation SMS is not sent automatically, however you can use the [POST /account/verification/phone](https://appwrite.io/docs/references/cloud/client-web/account#createPhoneVerification) endpoint to send a confirmation SMS.`)
    .requiredOption(`--phone <phone>`, `Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .requiredOption(`--password <password>`, `User password. Must be at least 8 chars.`)
    .action(actionRunner(async ({ phone, password }) => await (await getAccountClient()).updatePhone(phone, password)));
account
    .command(`get-prefs`)
    .description(`Get the preferences as a key-value object for the currently logged in user.`)
    .action(actionRunner(async () => await (await getAccountClient()).getPrefs()));
account
    .command(`update-prefs`)
    .description(`Update currently logged in user account preferences. The object you pass is stored as is, and replaces any previous value. The maximum allowed prefs size is 64kB and throws error if exceeded.`)
    .requiredOption(`--prefs <prefs>`, `Prefs key-value JSON object.`)
    .action(actionRunner(async ({ prefs }) => await (await getAccountClient()).updatePrefs(JSON.parse(prefs))));
account
    .command(`create-recovery`)
    .description(`Sends the user an email with a temporary secret key for password reset. When the user clicks the confirmation link he is redirected back to your app password reset URL with the secret key and email address values attached to the URL query string. Use the query string params to submit a request to the [PUT /account/recovery](https://appwrite.io/docs/references/cloud/client-web/account#updateRecovery) endpoint to complete the process. The verification link sent to the user's email address is valid for 1 hour.`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--url <url>`, `URL to redirect the user back to your app from the recovery email. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .action(actionRunner(async ({ email, url }) => await (await getAccountClient()).createRecovery(email, url)));
account
    .command(`update-recovery`)
    .description(`Use this endpoint to complete the user account password reset. Both the **userId** and **secret** arguments will be passed as query parameters to the redirect URL you have provided when sending your request to the [POST /account/recovery](https://appwrite.io/docs/references/cloud/client-web/account#createRecovery) endpoint.  Please note that in order to avoid a [Redirect Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md) the only valid redirect URLs are the ones from domains you have set when adding your platforms in the console interface.`)
    .requiredOption(`--user-id <user-id>`, `User ID.`)
    .requiredOption(`--secret <secret>`, `Valid reset token.`)
    .requiredOption(`--password <password>`, `New user password. Must be between 8 and 256 chars.`)
    .action(actionRunner(async ({ userId, secret, password }) => await (await getAccountClient()).updateRecovery(userId, secret, password)));
account
    .command(`list-sessions`)
    .description(`Get the list of active sessions across different devices for the currently logged in user.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(async () => await (await getAccountClient()).listSessions()));
account
    .command(`delete-sessions`)
    .description(`Delete all sessions from the user account and remove any sessions cookies from the end client.`)
    .action(actionRunner(async () => await (await getAccountClient()).deleteSessions()));
account
    .command(`create-anonymous-session`)
    .description(`Use this endpoint to allow a new user to register an anonymous account in your project. This route will also create a new session for the user. To allow the new user to convert an anonymous account to a normal account, you need to update its [email and password](https://appwrite.io/docs/references/cloud/client-web/account#updateEmail) or create an [OAuth2 session](https://appwrite.io/docs/references/cloud/client-web/account#CreateOAuth2Session).`)
    .action(actionRunner(async () => await (await getAccountClient()).createAnonymousSession()));
account
    .command(`create-email-password-session`)
    .description(`Allow the user to login into their account by providing a valid email and password combination. This route will create a new session for the user.  A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `User password. Must be at least 8 chars.`)
    .action(actionRunner(async ({ email, password }) => await (await getAccountClient()).createEmailPasswordSession(email, password)));
account
    .command(`update-magic-url-session`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'account create-session' instead] Use this endpoint to create a session from token. Provide the **userId** and **secret** parameters from the successful response of authentication flows initiated by token creation. For example, magic URL and phone login.`)
    .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--secret <secret>`, `Valid verification token.`)
    .action(actionRunner(async ({ userId, secret }) => await (await getAccountClient()).updateMagicURLSession(userId, secret)));
account
    .command(`create-o-auth-2-session`)
    .description(`Allow the user to login to their account using the OAuth2 provider of their choice. Each OAuth2 provider should be enabled from the Appwrite console first. Use the success and failure arguments to provide a redirect URL's back to your app when login is completed.  If there is already an active session, the new session will be attached to the logged-in account. If there are no active sessions, the server will attempt to look for a user with the same email address as the email received from the OAuth2 provider and attach the new session to the existing user. If no matching user is found - the server will create a new user.  A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits). `)
    .requiredOption(`--provider <provider>`, `OAuth2 Provider. Currently, supported providers are: amazon, apple, auth0, authentik, autodesk, bitbucket, bitly, box, dailymotion, discord, disqus, dropbox, etsy, facebook, figma, github, gitlab, google, linkedin, microsoft, notion, oidc, okta, paypal, paypalSandbox, podio, salesforce, slack, spotify, stripe, tradeshift, tradeshiftBox, twitch, wordpress, yahoo, yammer, yandex, zoho, zoom.`)
    .option(`--success <success>`, `URL to redirect back to your app after a successful login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .option(`--failure <failure>`, `URL to redirect back to your app after a failed login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .option(`--scopes [scopes...]`, `A list of custom OAuth2 scopes. Check each provider internal docs for a list of supported scopes. Maximum of 100 scopes are allowed, each 4096 characters long.`)
    .action(actionRunner(async ({ provider, success, failure, scopes }) => await (await getAccountClient()).createOAuth2Session(provider, success, failure, scopes)));
account
    .command(`update-phone-session`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'account create-session' instead] Use this endpoint to create a session from token. Provide the **userId** and **secret** parameters from the successful response of authentication flows initiated by token creation. For example, magic URL and phone login.`)
    .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--secret <secret>`, `Valid verification token.`)
    .action(actionRunner(async ({ userId, secret }) => await (await getAccountClient()).updatePhoneSession(userId, secret)));
account
    .command(`create-session`)
    .description(`Use this endpoint to create a session from token. Provide the **userId** and **secret** parameters from the successful response of authentication flows initiated by token creation. For example, magic URL and phone login.`)
    .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--secret <secret>`, `Secret of a token generated by login methods. For example, the 'createMagicURLToken' or 'createPhoneToken' methods.`)
    .action(actionRunner(async ({ userId, secret }) => await (await getAccountClient()).createSession(userId, secret)));
account
    .command(`get-session`)
    .description(`Use this endpoint to get a logged in user's session using a Session ID. Inputting 'current' will return the current session being used.`)
    .requiredOption(`--session-id <session-id>`, `Session ID. Use the string 'current' to get the current device session.`)
    .action(actionRunner(async ({ sessionId }) => await (await getAccountClient()).getSession(sessionId)));
account
    .command(`update-session`)
    .description(`Use this endpoint to extend a session's length. Extending a session is useful when session expiry is short. If the session was created using an OAuth provider, this endpoint refreshes the access token from the provider.`)
    .requiredOption(`--session-id <session-id>`, `Session ID. Use the string 'current' to update the current device session.`)
    .action(actionRunner(async ({ sessionId }) => await (await getAccountClient()).updateSession(sessionId)));
account
    .command(`delete-session`)
    .description(`Logout the user. Use 'current' as the session ID to logout on this device, use a session ID to logout on another device. If you're looking to logout the user on all devices, use [Delete Sessions](https://appwrite.io/docs/references/cloud/client-web/account#deleteSessions) instead.`)
    .requiredOption(`--session-id <session-id>`, `Session ID. Use the string 'current' to delete the current device session.`)
    .action(actionRunner(async ({ sessionId }) => await (await getAccountClient()).deleteSession(sessionId)));
account
    .command(`update-status`)
    .description(`Block the currently logged in user account. Behind the scene, the user record is not deleted but permanently blocked from any access. To completely delete a user, use the Users API instead.`)
    .action(actionRunner(async () => await (await getAccountClient()).updateStatus()));
account
    .command(`create-push-target`)
    .description(`Use this endpoint to register a device for push notifications. Provide a target ID (custom or generated using ID.unique()), a device identifier (usually a device token), and optionally specify which provider should send notifications to this target. The target is automatically linked to the current session and includes device information like brand and model.`)
    .requiredOption(`--target-id <target-id>`, `Target ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--identifier <identifier>`, `The target identifier (token, email, phone etc.)`)
    .option(`--provider-id <provider-id>`, `Provider ID. Message will be sent to this target from the specified provider ID. If no provider ID is set the first setup provider will be used.`)
    .action(actionRunner(async ({ targetId, identifier, providerId }) => await (await getAccountClient()).createPushTarget(targetId, identifier, providerId)));
account
    .command(`update-push-target`)
    .description(`Update the currently logged in user's push notification target. You can modify the target's identifier (device token) and provider ID (token, email, phone etc.). The target must exist and belong to the current user. If you change the provider ID, notifications will be sent through the new messaging provider instead.`)
    .requiredOption(`--target-id <target-id>`, `Target ID.`)
    .requiredOption(`--identifier <identifier>`, `The target identifier (token, email, phone etc.)`)
    .action(actionRunner(async ({ targetId, identifier }) => await (await getAccountClient()).updatePushTarget(targetId, identifier)));
account
    .command(`delete-push-target`)
    .description(`Delete a push notification target for the currently logged in user. After deletion, the device will no longer receive push notifications. The target must exist and belong to the current user.`)
    .requiredOption(`--target-id <target-id>`, `Target ID.`)
    .action(actionRunner(async ({ targetId }) => await (await getAccountClient()).deletePushTarget(targetId)));
account
    .command(`create-email-token`)
    .description(`Sends the user an email with a secret key for creating a session. If the email address has never been used, a **new account is created** using the provided 'userId'. Otherwise, if the email address is already attached to an account, the **user ID is ignored**. Then, the user will receive an email with the one-time password. Use the returned user ID and secret and submit a request to the [POST /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint to complete the login process. The secret sent to the user's email is valid for 15 minutes.  A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits). `)
    .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars. If the email address has never been used, a new account is created using the provided userId. Otherwise, if the email address is already attached to an account, the user ID is ignored.`)
    .requiredOption(`--email <email>`, `User email.`)
    .option(`--phrase [value]`, `Toggle for security phrase. If enabled, email will be send with a randomly generated phrase and the phrase will also be included in the response. Confirming phrases match increases the security of your authentication flow.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(async ({ userId, email, phrase }) => await (await getAccountClient()).createEmailToken(userId, email, phrase)));
account
    .command(`create-magic-url-token`)
    .description(`Sends the user an email with a secret key for creating a session. If the provided user ID has not been registered, a new user will be created. When the user clicks the link in the email, the user is redirected back to the URL you provided with the secret key and userId values attached to the URL query string. Use the query string parameters to submit a request to the [POST /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint to complete the login process. The link sent to the user's email address is valid for 1 hour.  A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits). `)
    .requiredOption(`--user-id <user-id>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars. If the email address has never been used, a new account is created using the provided userId. Otherwise, if the email address is already attached to an account, the user ID is ignored.`)
    .requiredOption(`--email <email>`, `User email.`)
    .option(`--url <url>`, `URL to redirect the user back to your app from the magic URL login. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .option(`--phrase [value]`, `Toggle for security phrase. If enabled, email will be send with a randomly generated phrase and the phrase will also be included in the response. Confirming phrases match increases the security of your authentication flow.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(async ({ userId, email, url, phrase }) => await (await getAccountClient()).createMagicURLToken(userId, email, url, phrase)));
account
    .command(`create-o-auth-2-token`)
    .description(`Allow the user to login to their account using the OAuth2 provider of their choice. Each OAuth2 provider should be enabled from the Appwrite console first. Use the success and failure arguments to provide a redirect URL's back to your app when login is completed.   If authentication succeeds, 'userId' and 'secret' of a token will be appended to the success URL as query parameters. These can be used to create a new session using the [Create session](https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint.  A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).`)
    .requiredOption(`--provider <provider>`, `OAuth2 Provider. Currently, supported providers are: amazon, apple, auth0, authentik, autodesk, bitbucket, bitly, box, dailymotion, discord, disqus, dropbox, etsy, facebook, figma, github, gitlab, google, linkedin, microsoft, notion, oidc, okta, paypal, paypalSandbox, podio, salesforce, slack, spotify, stripe, tradeshift, tradeshiftBox, twitch, wordpress, yahoo, yammer, yandex, zoho, zoom.`)
    .option(`--success <success>`, `URL to redirect back to your app after a successful login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .option(`--failure <failure>`, `URL to redirect back to your app after a failed login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .option(`--scopes [scopes...]`, `A list of custom OAuth2 scopes. Check each provider internal docs for a list of supported scopes. Maximum of 100 scopes are allowed, each 4096 characters long.`)
    .action(actionRunner(async ({ provider, success, failure, scopes }) => await (await getAccountClient()).createOAuth2Token(provider, success, failure, scopes)));
account
    .command(`create-phone-token`)
    .description(`Sends the user an SMS with a secret key for creating a session. If the provided user ID has not be registered, a new user will be created. Use the returned user ID and secret and submit a request to the [POST /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint to complete the login process. The secret sent to the user's phone is valid for 15 minutes.  A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).`)
    .requiredOption(`--user-id <user-id>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars. If the phone number has never been used, a new account is created using the provided userId. Otherwise, if the phone number is already attached to an account, the user ID is ignored.`)
    .requiredOption(`--phone <phone>`, `Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .action(actionRunner(async ({ userId, phone }) => await (await getAccountClient()).createPhoneToken(userId, phone)));
account
    .command(`create-email-verification`)
    .description(`Use this endpoint to send a verification message to your user email address to confirm they are the valid owners of that address. Both the **userId** and **secret** arguments will be passed as query parameters to the URL you have provided to be attached to the verification email. The provided URL should redirect the user back to your app and allow you to complete the verification process by verifying both the **userId** and **secret** parameters. Learn more about how to [complete the verification process](https://appwrite.io/docs/references/cloud/client-web/account#updateVerification). The verification link sent to the user's email address is valid for 7 days.  Please note that in order to avoid a [Redirect Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md), the only valid redirect URLs are the ones from domains you have set when adding your platforms in the console interface. `)
    .requiredOption(`--url <url>`, `URL to redirect the user back to your app from the verification email. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .action(actionRunner(async ({ url }) => await (await getAccountClient()).createVerification(url)));
account
    .command(`create-verification`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'account create-email-verification' instead] Use this endpoint to send a verification message to your user email address to confirm they are the valid owners of that address. Both the **userId** and **secret** arguments will be passed as query parameters to the URL you have provided to be attached to the verification email. The provided URL should redirect the user back to your app and allow you to complete the verification process by verifying both the **userId** and **secret** parameters. Learn more about how to [complete the verification process](https://appwrite.io/docs/references/cloud/client-web/account#updateVerification). The verification link sent to the user's email address is valid for 7 days.  Please note that in order to avoid a [Redirect Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md), the only valid redirect URLs are the ones from domains you have set when adding your platforms in the console interface. `)
    .requiredOption(`--url <url>`, `URL to redirect the user back to your app from the verification email. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .action(actionRunner(async ({ url }) => await (await getAccountClient()).createVerification(url)));
account
    .command(`update-email-verification`)
    .description(`Use this endpoint to complete the user email verification process. Use both the **userId** and **secret** parameters that were attached to your app URL to verify the user email ownership. If confirmed this route will return a 200 status code.`)
    .requiredOption(`--user-id <user-id>`, `User ID.`)
    .requiredOption(`--secret <secret>`, `Valid verification token.`)
    .action(actionRunner(async ({ userId, secret }) => await (await getAccountClient()).updateVerification(userId, secret)));
account
    .command(`update-verification`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'account update-email-verification' instead] Use this endpoint to complete the user email verification process. Use both the **userId** and **secret** parameters that were attached to your app URL to verify the user email ownership. If confirmed this route will return a 200 status code.`)
    .requiredOption(`--user-id <user-id>`, `User ID.`)
    .requiredOption(`--secret <secret>`, `Valid verification token.`)
    .action(actionRunner(async ({ userId, secret }) => await (await getAccountClient()).updateVerification(userId, secret)));
account
    .command(`create-phone-verification`)
    .description(`Use this endpoint to send a verification SMS to the currently logged in user. This endpoint is meant for use after updating a user's phone number using the [accountUpdatePhone](https://appwrite.io/docs/references/cloud/client-web/account#updatePhone) endpoint. Learn more about how to [complete the verification process](https://appwrite.io/docs/references/cloud/client-web/account#updatePhoneVerification). The verification code sent to the user's phone number is valid for 15 minutes.`)
    .action(actionRunner(async () => await (await getAccountClient()).createPhoneVerification()));
account
    .command(`update-phone-verification`)
    .description(`Use this endpoint to complete the user phone verification process. Use the **userId** and **secret** that were sent to your user's phone number to verify the user email ownership. If confirmed this route will return a 200 status code.`)
    .requiredOption(`--user-id <user-id>`, `User ID.`)
    .requiredOption(`--secret <secret>`, `Valid verification token.`)
    .action(actionRunner(async ({ userId, secret }) => await (await getAccountClient()).updatePhoneVerification(userId, secret)));
//# sourceMappingURL=account.js.map