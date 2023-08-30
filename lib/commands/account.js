const fs = require('fs');
const pathLib = require('path');
const tar = require("tar");
const ignore = require("ignore");
const { promisify } = require('util');
const libClient = require('../client.js');
const { getAllFiles } = require('../utils.js');
const { Command } = require('commander');
const { sdkForProject, sdkForConsole } = require('../sdks')
const { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log } = require('../parser')
const { localConfig, globalConfig } = require("../config");

const account = new Command("account").description(commandDescriptions['account']).configureHelp({
    helpWidth: process.stdout.columns || 80
  })

const accountGet = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account';
    let payload = {};
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountCreate = async ({ userId, email, password, name, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} email */
    /* @param {string} password */
    /* @param {string} name */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account';
    let payload = {};
    
    /** Body Params */

    if (typeof userId !== 'undefined') {
        payload['userId'] = userId;
    }


    if (typeof email !== 'undefined') {
        payload['email'] = email;
    }


    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }


    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    let response = undefined;
    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountUpdateEmail = async ({ email, password, parseOutput = true, sdk = undefined}) => {
    /* @param {string} email */
    /* @param {string} password */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/email';
    let payload = {};
    
    /** Body Params */

    if (typeof email !== 'undefined') {
        payload['email'] = email;
    }


    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }

    let response = undefined;
    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountListIdentities = async ({ queries, parseOutput = true, sdk = undefined}) => {
    /* @param {string} queries */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/identities';
    let payload = {};

    /** Query Params */
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountDeleteIdentity = async ({ identityId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} identityId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/identities/{identityId}'.replace('{identityId}', identityId);
    let payload = {};
    let response = undefined;
    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountCreateJWT = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/jwt';
    let payload = {};
    let response = undefined;
    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountListLogs = async ({ queries, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} queries */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/logs';
    let payload = {};

    /** Query Params */
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountUpdateName = async ({ name, parseOutput = true, sdk = undefined}) => {
    /* @param {string} name */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/name';
    let payload = {};
    
    /** Body Params */

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    let response = undefined;
    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountUpdatePassword = async ({ password, oldPassword, parseOutput = true, sdk = undefined}) => {
    /* @param {string} password */
    /* @param {string} oldPassword */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/password';
    let payload = {};
    
    /** Body Params */

    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }


    if (typeof oldPassword !== 'undefined') {
        payload['oldPassword'] = oldPassword;
    }

    let response = undefined;
    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountUpdatePhone = async ({ phone, password, parseOutput = true, sdk = undefined}) => {
    /* @param {string} phone */
    /* @param {string} password */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/phone';
    let payload = {};
    
    /** Body Params */

    if (typeof phone !== 'undefined') {
        payload['phone'] = phone;
    }


    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }

    let response = undefined;
    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountGetPrefs = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/prefs';
    let payload = {};
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountUpdatePrefs = async ({ prefs, parseOutput = true, sdk = undefined}) => {
    /* @param {object} prefs */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/prefs';
    let payload = {};
    
    /** Body Params */
    if (typeof prefs !== 'undefined') {
        payload['prefs'] = JSON.parse(prefs);
    }

    let response = undefined;
    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountCreateRecovery = async ({ email, url, parseOutput = true, sdk = undefined}) => {
    /* @param {string} email */
    /* @param {string} url */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/recovery';
    let payload = {};
    
    /** Body Params */

    if (typeof email !== 'undefined') {
        payload['email'] = email;
    }


    if (typeof url !== 'undefined') {
        payload['url'] = url;
    }

    let response = undefined;
    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountUpdateRecovery = async ({ userId, secret, password, passwordAgain, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} secret */
    /* @param {string} password */
    /* @param {string} passwordAgain */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/recovery';
    let payload = {};
    
    /** Body Params */

    if (typeof userId !== 'undefined') {
        payload['userId'] = userId;
    }


    if (typeof secret !== 'undefined') {
        payload['secret'] = secret;
    }


    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }


    if (typeof passwordAgain !== 'undefined') {
        payload['passwordAgain'] = passwordAgain;
    }

    let response = undefined;
    response = await client.call('put', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountListSessions = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/sessions';
    let payload = {};
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountDeleteSessions = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/sessions';
    let payload = {};
    let response = undefined;
    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountCreateAnonymousSession = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/sessions/anonymous';
    let payload = {};
    let response = undefined;
    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountCreateEmailSession = async ({ email, password, parseOutput = true, sdk = undefined}) => {
    /* @param {string} email */
    /* @param {string} password */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/sessions/email';
    let payload = {};
    
    /** Body Params */

    if (typeof email !== 'undefined') {
        payload['email'] = email;
    }


    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }

    let response = undefined;
    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountCreateMagicURLSession = async ({ userId, email, url, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} email */
    /* @param {string} url */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/sessions/magic-url';
    let payload = {};
    
    /** Body Params */

    if (typeof userId !== 'undefined') {
        payload['userId'] = userId;
    }


    if (typeof email !== 'undefined') {
        payload['email'] = email;
    }


    if (typeof url !== 'undefined') {
        payload['url'] = url;
    }

    let response = undefined;
    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountUpdateMagicURLSession = async ({ userId, secret, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} secret */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/sessions/magic-url';
    let payload = {};
    
    /** Body Params */

    if (typeof userId !== 'undefined') {
        payload['userId'] = userId;
    }


    if (typeof secret !== 'undefined') {
        payload['secret'] = secret;
    }

    let response = undefined;
    response = await client.call('put', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountCreateOAuth2Session = async ({ provider, success, failure, scopes, parseOutput = true, sdk = undefined}) => {
    /* @param {string} provider */
    /* @param {string} success */
    /* @param {string} failure */
    /* @param {string[]} scopes */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/sessions/oauth2/{provider}'.replace('{provider}', provider);
    let payload = {};

    /** Query Params */
    if (typeof success !== 'undefined') {
        payload['success'] = success;
    }
    if (typeof failure !== 'undefined') {
        payload['failure'] = failure;
    }
    if (typeof scopes !== 'undefined') {
        payload['scopes'] = scopes;
    }
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountCreatePhoneSession = async ({ userId, phone, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} phone */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/sessions/phone';
    let payload = {};
    
    /** Body Params */

    if (typeof userId !== 'undefined') {
        payload['userId'] = userId;
    }


    if (typeof phone !== 'undefined') {
        payload['phone'] = phone;
    }

    let response = undefined;
    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountUpdatePhoneSession = async ({ userId, secret, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} secret */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/sessions/phone';
    let payload = {};
    
    /** Body Params */

    if (typeof userId !== 'undefined') {
        payload['userId'] = userId;
    }


    if (typeof secret !== 'undefined') {
        payload['secret'] = secret;
    }

    let response = undefined;
    response = await client.call('put', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountGetSession = async ({ sessionId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} sessionId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountUpdateSession = async ({ sessionId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} sessionId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
    let payload = {};
    let response = undefined;
    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountDeleteSession = async ({ sessionId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} sessionId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
    let payload = {};
    let response = undefined;
    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountUpdateStatus = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/status';
    let payload = {};
    let response = undefined;
    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountCreateVerification = async ({ url, parseOutput = true, sdk = undefined}) => {
    /* @param {string} url */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/verification';
    let payload = {};
    
    /** Body Params */

    if (typeof url !== 'undefined') {
        payload['url'] = url;
    }

    let response = undefined;
    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountUpdateVerification = async ({ userId, secret, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} secret */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/verification';
    let payload = {};
    
    /** Body Params */

    if (typeof userId !== 'undefined') {
        payload['userId'] = userId;
    }


    if (typeof secret !== 'undefined') {
        payload['secret'] = secret;
    }

    let response = undefined;
    response = await client.call('put', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountCreatePhoneVerification = async ({ parseOutput = true, sdk = undefined}) => {

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/verification/phone';
    let payload = {};
    let response = undefined;
    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const accountUpdatePhoneVerification = async ({ userId, secret, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} secret */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/account/verification/phone';
    let payload = {};
    
    /** Body Params */

    if (typeof userId !== 'undefined') {
        payload['userId'] = userId;
    }


    if (typeof secret !== 'undefined') {
        payload['secret'] = secret;
    }

    let response = undefined;
    response = await client.call('put', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}


account
    .command(`get`)
    .description(`Get the currently logged in user.`)
    .action(actionRunner(accountGet))

account
    .command(`create`)
    .description(`Use this endpoint to allow a new user to register a new account in your project. After the user registration completes successfully, you can use the [/account/verfication](/docs/client/account#accountCreateVerification) route to start verifying the user email address. To allow the new user to login to their new account, you need to create a new [account session](/docs/client/account#accountCreateSession).`)
    .requiredOption(`--userId <userId>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `New user password. Must be at least 8 chars.`)
    .option(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(accountCreate))

account
    .command(`updateEmail`)
    .description(`Update currently logged in user account email address. After changing user address, the user confirmation status will get reset. A new confirmation email is not sent automatically however you can use the send confirmation email endpoint again to send the confirmation email. For security measures, user password is required to complete this request. This endpoint can also be used to convert an anonymous account to a normal one, by passing an email address and a new password. `)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `User password. Must be at least 8 chars.`)
    .action(actionRunner(accountUpdateEmail))

account
    .command(`listIdentities`)
    .description(`Get the list of identities for the currently logged in user.`)
    .option(`--queries <queries>`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, provider, providerUid, providerEmail, providerAccessTokenExpiry`)
    .action(actionRunner(accountListIdentities))

account
    .command(`deleteIdentity`)
    .description(`Delete an identity by its unique ID.`)
    .requiredOption(`--identityId <identityId>`, `Identity ID.`)
    .action(actionRunner(accountDeleteIdentity))

account
    .command(`createJWT`)
    .description(`Use this endpoint to create a JSON Web Token. You can use the resulting JWT to authenticate on behalf of the current user when working with the Appwrite server-side API and SDKs. The JWT secret is valid for 15 minutes from its creation and will be invalid if the user will logout in that time frame.`)
    .action(actionRunner(accountCreateJWT))

account
    .command(`listLogs`)
    .description(`Get the list of latest security activity logs for the currently logged in user. Each log returns user IP address, location and date and time of log.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(accountListLogs))

account
    .command(`updateName`)
    .description(`Update currently logged in user account name.`)
    .requiredOption(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(accountUpdateName))

account
    .command(`updatePassword`)
    .description(`Update currently logged in user password. For validation, user is required to pass in the new password, and the old password. For users created with OAuth, Team Invites and Magic URL, oldPassword is optional.`)
    .requiredOption(`--password <password>`, `New user password. Must be at least 8 chars.`)
    .option(`--oldPassword <oldPassword>`, `Current user password. Must be at least 8 chars.`)
    .action(actionRunner(accountUpdatePassword))

account
    .command(`updatePhone`)
    .description(`Update the currently logged in user's phone number. After updating the phone number, the phone verification status will be reset. A confirmation SMS is not sent automatically, however you can use the [POST /account/verification/phone](/docs/client/account#accountCreatePhoneVerification) endpoint to send a confirmation SMS.`)
    .requiredOption(`--phone <phone>`, `Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .requiredOption(`--password <password>`, `User password. Must be at least 8 chars.`)
    .action(actionRunner(accountUpdatePhone))

account
    .command(`getPrefs`)
    .description(`Get the preferences as a key-value object for the currently logged in user.`)
    .action(actionRunner(accountGetPrefs))

account
    .command(`updatePrefs`)
    .description(`Update currently logged in user account preferences. The object you pass is stored as is, and replaces any previous value. The maximum allowed prefs size is 64kB and throws error if exceeded.`)
    .requiredOption(`--prefs <prefs>`, `Prefs key-value JSON object.`)
    .action(actionRunner(accountUpdatePrefs))

account
    .command(`createRecovery`)
    .description(`Sends the user an email with a temporary secret key for password reset. When the user clicks the confirmation link he is redirected back to your app password reset URL with the secret key and email address values attached to the URL query string. Use the query string params to submit a request to the [PUT /account/recovery](/docs/client/account#accountUpdateRecovery) endpoint to complete the process. The verification link sent to the user's email address is valid for 1 hour.`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--url <url>`, `URL to redirect the user back to your app from the recovery email. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .action(actionRunner(accountCreateRecovery))

account
    .command(`updateRecovery`)
    .description(`Use this endpoint to complete the user account password reset. Both the **userId** and **secret** arguments will be passed as query parameters to the redirect URL you have provided when sending your request to the [POST /account/recovery](/docs/client/account#accountCreateRecovery) endpoint.  Please note that in order to avoid a [Redirect Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md) the only valid redirect URLs are the ones from domains you have set when adding your platforms in the console interface.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--secret <secret>`, `Valid reset token.`)
    .requiredOption(`--password <password>`, `New user password. Must be at least 8 chars.`)
    .requiredOption(`--passwordAgain <passwordAgain>`, `Repeat new user password. Must be at least 8 chars.`)
    .action(actionRunner(accountUpdateRecovery))

account
    .command(`listSessions`)
    .description(`Get the list of active sessions across different devices for the currently logged in user.`)
    .action(actionRunner(accountListSessions))

account
    .command(`deleteSessions`)
    .description(`Delete all sessions from the user account and remove any sessions cookies from the end client.`)
    .action(actionRunner(accountDeleteSessions))

account
    .command(`createAnonymousSession`)
    .description(`Use this endpoint to allow a new user to register an anonymous account in your project. This route will also create a new session for the user. To allow the new user to convert an anonymous account to a normal account, you need to update its [email and password](/docs/client/account#accountUpdateEmail) or create an [OAuth2 session](/docs/client/account#accountCreateOAuth2Session).`)
    .action(actionRunner(accountCreateAnonymousSession))

account
    .command(`createEmailSession`)
    .description(`Allow the user to login into their account by providing a valid email and password combination. This route will create a new session for the user.  A user is limited to 10 active sessions at a time by default. [Learn more about session limits](/docs/authentication-security#limits).`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `User password. Must be at least 8 chars.`)
    .action(actionRunner(accountCreateEmailSession))

account
    .command(`createMagicURLSession`)
    .description(`Sends the user an email with a secret key for creating a session. If the provided user ID has not been registered, a new user will be created. When the user clicks the link in the email, the user is redirected back to the URL you provided with the secret key and userId values attached to the URL query string. Use the query string parameters to submit a request to the [PUT /account/sessions/magic-url](/docs/client/account#accountUpdateMagicURLSession) endpoint to complete the login process. The link sent to the user's email address is valid for 1 hour. If you are on a mobile device you can leave the URL parameter empty, so that the login completion will be handled by your Appwrite instance by default.  A user is limited to 10 active sessions at a time by default. [Learn more about session limits](/docs/authentication-security#limits). `)
    .requiredOption(`--userId <userId>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--email <email>`, `User email.`)
    .option(`--url <url>`, `URL to redirect the user back to your app from the magic URL login. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .action(actionRunner(accountCreateMagicURLSession))

account
    .command(`updateMagicURLSession`)
    .description(`Use this endpoint to complete creating the session with the Magic URL. Both the **userId** and **secret** arguments will be passed as query parameters to the redirect URL you have provided when sending your request to the [POST /account/sessions/magic-url](/docs/client/account#accountCreateMagicURLSession) endpoint.  Please note that in order to avoid a [Redirect Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md) the only valid redirect URLs are the ones from domains you have set when adding your platforms in the console interface.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--secret <secret>`, `Valid verification token.`)
    .action(actionRunner(accountUpdateMagicURLSession))

account
    .command(`createOAuth2Session`)
    .description(`Allow the user to login to their account using the OAuth2 provider of their choice. Each OAuth2 provider should be enabled from the Appwrite console first. Use the success and failure arguments to provide a redirect URL's back to your app when login is completed.  If there is already an active session, the new session will be attached to the logged-in account. If there are no active sessions, the server will attempt to look for a user with the same email address as the email received from the OAuth2 provider and attach the new session to the existing user. If no matching user is found - the server will create a new user.  A user is limited to 10 active sessions at a time by default. [Learn more about session limits](/docs/authentication-security#limits). `)
    .requiredOption(`--provider <provider>`, `OAuth2 Provider. Currently, supported providers are: amazon, apple, auth0, authentik, autodesk, bitbucket, bitly, box, dailymotion, discord, disqus, dropbox, etsy, facebook, github, gitlab, google, linkedin, microsoft, notion, oidc, okta, paypal, paypalSandbox, podio, salesforce, slack, spotify, stripe, tradeshift, tradeshiftBox, twitch, wordpress, yahoo, yammer, yandex, zoom.`)
    .option(`--success <success>`, `URL to redirect back to your app after a successful login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .option(`--failure <failure>`, `URL to redirect back to your app after a failed login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .option(`--scopes [scopes...]`, `A list of custom OAuth2 scopes. Check each provider internal docs for a list of supported scopes. Maximum of 100 scopes are allowed, each 4096 characters long.`)
    .action(actionRunner(accountCreateOAuth2Session))

account
    .command(`createPhoneSession`)
    .description(`Sends the user an SMS with a secret key for creating a session. If the provided user ID has not be registered, a new user will be created. Use the returned user ID and secret and submit a request to the [PUT /account/sessions/phone](/docs/client/account#accountUpdatePhoneSession) endpoint to complete the login process. The secret sent to the user's phone is valid for 15 minutes.  A user is limited to 10 active sessions at a time by default. [Learn more about session limits](/docs/authentication-security#limits).`)
    .requiredOption(`--userId <userId>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--phone <phone>`, `Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .action(actionRunner(accountCreatePhoneSession))

account
    .command(`updatePhoneSession`)
    .description(`Use this endpoint to complete creating a session with SMS. Use the **userId** from the [createPhoneSession](/docs/client/account#accountCreatePhoneSession) endpoint and the **secret** received via SMS to successfully update and confirm the phone session.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--secret <secret>`, `Valid verification token.`)
    .action(actionRunner(accountUpdatePhoneSession))

account
    .command(`getSession`)
    .description(`Use this endpoint to get a logged in user's session using a Session ID. Inputting 'current' will return the current session being used.`)
    .requiredOption(`--sessionId <sessionId>`, `Session ID. Use the string 'current' to get the current device session.`)
    .action(actionRunner(accountGetSession))

account
    .command(`updateSession`)
    .description(`Access tokens have limited lifespan and expire to mitigate security risks. If session was created using an OAuth provider, this route can be used to "refresh" the access token.`)
    .requiredOption(`--sessionId <sessionId>`, `Session ID. Use the string 'current' to update the current device session.`)
    .action(actionRunner(accountUpdateSession))

account
    .command(`deleteSession`)
    .description(`Logout the user. Use 'current' as the session ID to logout on this device, use a session ID to logout on another device. If you're looking to logout the user on all devices, use [Delete Sessions](/docs/client/account#accountDeleteSessions) instead.`)
    .requiredOption(`--sessionId <sessionId>`, `Session ID. Use the string 'current' to delete the current device session.`)
    .action(actionRunner(accountDeleteSession))

account
    .command(`updateStatus`)
    .description(`Block the currently logged in user account. Behind the scene, the user record is not deleted but permanently blocked from any access. To completely delete a user, use the Users API instead.`)
    .action(actionRunner(accountUpdateStatus))

account
    .command(`createVerification`)
    .description(`Use this endpoint to send a verification message to your user email address to confirm they are the valid owners of that address. Both the **userId** and **secret** arguments will be passed as query parameters to the URL you have provided to be attached to the verification email. The provided URL should redirect the user back to your app and allow you to complete the verification process by verifying both the **userId** and **secret** parameters. Learn more about how to [complete the verification process](/docs/client/account#accountUpdateEmailVerification). The verification link sent to the user's email address is valid for 7 days.  Please note that in order to avoid a [Redirect Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md), the only valid redirect URLs are the ones from domains you have set when adding your platforms in the console interface. `)
    .requiredOption(`--url <url>`, `URL to redirect the user back to your app from the verification email. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .action(actionRunner(accountCreateVerification))

account
    .command(`updateVerification`)
    .description(`Use this endpoint to complete the user email verification process. Use both the **userId** and **secret** parameters that were attached to your app URL to verify the user email ownership. If confirmed this route will return a 200 status code.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--secret <secret>`, `Valid verification token.`)
    .action(actionRunner(accountUpdateVerification))

account
    .command(`createPhoneVerification`)
    .description(`Use this endpoint to send a verification SMS to the currently logged in user. This endpoint is meant for use after updating a user's phone number using the [accountUpdatePhone](/docs/client/account#accountUpdatePhone) endpoint. Learn more about how to [complete the verification process](/docs/client/account#accountUpdatePhoneVerification). The verification code sent to the user's phone number is valid for 15 minutes.`)
    .action(actionRunner(accountCreatePhoneVerification))

account
    .command(`updatePhoneVerification`)
    .description(`Use this endpoint to complete the user phone verification process. Use the **userId** and **secret** that were sent to your user's phone number to verify the user email ownership. If confirmed this route will return a 200 status code.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--secret <secret>`, `Valid verification token.`)
    .action(actionRunner(accountUpdatePhoneVerification))


module.exports = {
    account,
    accountGet,
    accountCreate,
    accountUpdateEmail,
    accountListIdentities,
    accountDeleteIdentity,
    accountCreateJWT,
    accountListLogs,
    accountUpdateName,
    accountUpdatePassword,
    accountUpdatePhone,
    accountGetPrefs,
    accountUpdatePrefs,
    accountCreateRecovery,
    accountUpdateRecovery,
    accountListSessions,
    accountDeleteSessions,
    accountCreateAnonymousSession,
    accountCreateEmailSession,
    accountCreateMagicURLSession,
    accountUpdateMagicURLSession,
    accountCreateOAuth2Session,
    accountCreatePhoneSession,
    accountUpdatePhoneSession,
    accountGetSession,
    accountUpdateSession,
    accountDeleteSession,
    accountUpdateStatus,
    accountCreateVerification,
    accountUpdateVerification,
    accountCreatePhoneVerification,
    accountUpdatePhoneVerification
};
