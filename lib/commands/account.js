const fs = require('fs');
const pathLib = require('path');
const tar = require("tar");
const ignore = require("ignore");
const { promisify } = require('util');
const libClient = require('../client.js');
const { getAllFiles, showConsoleLink } = require('../utils.js');
const { Command } = require('commander');
const { sdkForProject, sdkForConsole } = require('../sdks')
const { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log, warn } = require('../parser')
const { localConfig, globalConfig } = require("../config");
const { File } = require('undici');
const { ReadableStream } = require('stream/web');

/**
 * @param {fs.ReadStream} readStream
 * @returns {ReadableStream}
 */
function convertReadStreamToReadableStream(readStream) {
  return new ReadableStream({
    start(controller) {
      readStream.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      readStream.on("end", () => {
        controller.close();
      });
      readStream.on("error", (err) => {
        controller.error(err);
      });
    },
    cancel() {
      readStream.destroy();
    },
  });
}

const account = new Command("account").description(commandDescriptions['account'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} AccountGetRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountGetRequestParams} params
 */
const accountGet = async ({parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('account', 'get');
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} AccountCreateRequestParams
 * @property {string} userId User ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} email User email.
 * @property {string} password New user password. Must be between 8 and 256 chars.
 * @property {string} name User name. Max length: 128 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountCreateRequestParams} params
 */
const accountCreate = async ({userId,email,password,name,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} AccountDeleteRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountDeleteRequestParams} params
 */
const accountDelete = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account';
    let payload = {};

    let response = undefined;

    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountUpdateEmailRequestParams
 * @property {string} email User email.
 * @property {string} password User password. Must be at least 8 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountUpdateEmailRequestParams} params
 */
const accountUpdateEmail = async ({email,password,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/email';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} AccountListIdentitiesRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, provider, providerUid, providerEmail, providerAccessTokenExpiry
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountListIdentitiesRequestParams} params
 */
const accountListIdentities = async ({queries,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/identities';
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountDeleteIdentityRequestParams
 * @property {string} identityId Identity ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountDeleteIdentityRequestParams} params
 */
const accountDeleteIdentity = async ({identityId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/identities/{identityId}'.replace('{identityId}', identityId);
    let payload = {};

    let response = undefined;

    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountCreateJWTRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountCreateJWTRequestParams} params
 */
const accountCreateJWT = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/jwts';
    let payload = {};

    let response = undefined;

    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountListLogsRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountListLogsRequestParams} params
 */
const accountListLogs = async ({queries,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/logs';
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountUpdateMFARequestParams
 * @property {boolean} mfa Enable or disable MFA.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountUpdateMFARequestParams} params
 */
const accountUpdateMFA = async ({mfa,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/mfa';
    let payload = {};
    if (typeof mfa !== 'undefined') {
        payload['mfa'] = mfa;
    }

    let response = undefined;

    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountCreateMfaAuthenticatorRequestParams
 * @property {AuthenticatorType} type Type of authenticator. Must be &#039;totp&#039;
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountCreateMfaAuthenticatorRequestParams} params
 */
const accountCreateMfaAuthenticator = async ({type,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/mfa/authenticators/{type}'.replace('{type}', type);
    let payload = {};

    let response = undefined;

    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountUpdateMfaAuthenticatorRequestParams
 * @property {AuthenticatorType} type Type of authenticator.
 * @property {string} otp Valid verification token.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountUpdateMfaAuthenticatorRequestParams} params
 */
const accountUpdateMfaAuthenticator = async ({type,otp,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/mfa/authenticators/{type}'.replace('{type}', type);
    let payload = {};
    if (typeof otp !== 'undefined') {
        payload['otp'] = otp;
    }

    let response = undefined;

    response = await client.call('put', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountDeleteMfaAuthenticatorRequestParams
 * @property {AuthenticatorType} type Type of authenticator.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountDeleteMfaAuthenticatorRequestParams} params
 */
const accountDeleteMfaAuthenticator = async ({type,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/mfa/authenticators/{type}'.replace('{type}', type);
    let payload = {};

    let response = undefined;

    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountCreateMfaChallengeRequestParams
 * @property {AuthenticationFactor} factor Factor used for verification. Must be one of following: &#039;email&#039;, &#039;phone&#039;, &#039;totp&#039;, &#039;recoveryCode&#039;.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountCreateMfaChallengeRequestParams} params
 */
const accountCreateMfaChallenge = async ({factor,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/mfa/challenge';
    let payload = {};
    if (typeof factor !== 'undefined') {
        payload['factor'] = factor;
    }

    let response = undefined;

    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountUpdateMfaChallengeRequestParams
 * @property {string} challengeId ID of the challenge.
 * @property {string} otp Valid verification token.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountUpdateMfaChallengeRequestParams} params
 */
const accountUpdateMfaChallenge = async ({challengeId,otp,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/mfa/challenge';
    let payload = {};
    if (typeof challengeId !== 'undefined') {
        payload['challengeId'] = challengeId;
    }
    if (typeof otp !== 'undefined') {
        payload['otp'] = otp;
    }

    let response = undefined;

    response = await client.call('put', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountListMfaFactorsRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountListMfaFactorsRequestParams} params
 */
const accountListMfaFactors = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/mfa/factors';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountGetMfaRecoveryCodesRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountGetMfaRecoveryCodesRequestParams} params
 */
const accountGetMfaRecoveryCodes = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/mfa/recovery-codes';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountCreateMfaRecoveryCodesRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountCreateMfaRecoveryCodesRequestParams} params
 */
const accountCreateMfaRecoveryCodes = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/mfa/recovery-codes';
    let payload = {};

    let response = undefined;

    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountUpdateMfaRecoveryCodesRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountUpdateMfaRecoveryCodesRequestParams} params
 */
const accountUpdateMfaRecoveryCodes = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/mfa/recovery-codes';
    let payload = {};

    let response = undefined;

    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountUpdateNameRequestParams
 * @property {string} name User name. Max length: 128 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountUpdateNameRequestParams} params
 */
const accountUpdateName = async ({name,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/name';
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    let response = undefined;

    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountUpdatePasswordRequestParams
 * @property {string} password New user password. Must be at least 8 chars.
 * @property {string} oldPassword Current user password. Must be at least 8 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountUpdatePasswordRequestParams} params
 */
const accountUpdatePassword = async ({password,oldPassword,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/password';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} AccountUpdatePhoneRequestParams
 * @property {string} phone Phone number. Format this number with a leading &#039;+&#039; and a country code, e.g., +16175551212.
 * @property {string} password User password. Must be at least 8 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountUpdatePhoneRequestParams} params
 */
const accountUpdatePhone = async ({phone,password,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/phone';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} AccountGetPrefsRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountGetPrefsRequestParams} params
 */
const accountGetPrefs = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/prefs';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountUpdatePrefsRequestParams
 * @property {object} prefs Prefs key-value JSON object.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountUpdatePrefsRequestParams} params
 */
const accountUpdatePrefs = async ({prefs,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/prefs';
    let payload = {};
    if (typeof prefs !== 'undefined') {
        payload['prefs'] = JSON.parse(prefs);
    }

    let response = undefined;

    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountCreateRecoveryRequestParams
 * @property {string} email User email.
 * @property {string} url URL to redirect the user back to your app from the recovery email. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountCreateRecoveryRequestParams} params
 */
const accountCreateRecovery = async ({email,url,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/recovery';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} AccountUpdateRecoveryRequestParams
 * @property {string} userId User ID.
 * @property {string} secret Valid reset token.
 * @property {string} password New user password. Must be between 8 and 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountUpdateRecoveryRequestParams} params
 */
const accountUpdateRecovery = async ({userId,secret,password,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/recovery';
    let payload = {};
    if (typeof userId !== 'undefined') {
        payload['userId'] = userId;
    }
    if (typeof secret !== 'undefined') {
        payload['secret'] = secret;
    }
    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }

    let response = undefined;

    response = await client.call('put', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountListSessionsRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountListSessionsRequestParams} params
 */
const accountListSessions = async ({parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/sessions';
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('account', 'listSessions');
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} AccountDeleteSessionsRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountDeleteSessionsRequestParams} params
 */
const accountDeleteSessions = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/sessions';
    let payload = {};

    let response = undefined;

    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountCreateAnonymousSessionRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountCreateAnonymousSessionRequestParams} params
 */
const accountCreateAnonymousSession = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/sessions/anonymous';
    let payload = {};

    let response = undefined;

    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountCreateEmailPasswordSessionRequestParams
 * @property {string} email User email.
 * @property {string} password User password. Must be at least 8 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountCreateEmailPasswordSessionRequestParams} params
 */
const accountCreateEmailPasswordSession = async ({email,password,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/sessions/email';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} AccountUpdateMagicURLSessionRequestParams
 * @property {string} userId User ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} secret Valid verification token.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountUpdateMagicURLSessionRequestParams} params
 */
const accountUpdateMagicURLSession = async ({userId,secret,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/sessions/magic-url';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} AccountCreateOAuth2SessionRequestParams
 * @property {OAuthProvider} provider OAuth2 Provider. Currently, supported providers are: amazon, apple, auth0, authentik, autodesk, bitbucket, bitly, box, dailymotion, discord, disqus, dropbox, etsy, facebook, figma, github, gitlab, google, linkedin, microsoft, notion, oidc, okta, paypal, paypalSandbox, podio, salesforce, slack, spotify, stripe, tradeshift, tradeshiftBox, twitch, wordpress, yahoo, yammer, yandex, zoho, zoom.
 * @property {string} success URL to redirect back to your app after a successful login attempt.  Only URLs from hostnames in your project&#039;s platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
 * @property {string} failure URL to redirect back to your app after a failed login attempt.  Only URLs from hostnames in your project&#039;s platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
 * @property {string[]} scopes A list of custom OAuth2 scopes. Check each provider internal docs for a list of supported scopes. Maximum of 100 scopes are allowed, each 4096 characters long.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountCreateOAuth2SessionRequestParams} params
 */
const accountCreateOAuth2Session = async ({provider,success,failure,scopes,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/sessions/oauth2/{provider}'.replace('{provider}', provider);
    let payload = {};
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
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountUpdatePhoneSessionRequestParams
 * @property {string} userId User ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} secret Valid verification token.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountUpdatePhoneSessionRequestParams} params
 */
const accountUpdatePhoneSession = async ({userId,secret,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/sessions/phone';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} AccountCreateSessionRequestParams
 * @property {string} userId User ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} secret Secret of a token generated by login methods. For example, the &#039;createMagicURLToken&#039; or &#039;createPhoneToken&#039; methods.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountCreateSessionRequestParams} params
 */
const accountCreateSession = async ({userId,secret,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/sessions/token';
    let payload = {};
    if (typeof userId !== 'undefined') {
        payload['userId'] = userId;
    }
    if (typeof secret !== 'undefined') {
        payload['secret'] = secret;
    }

    let response = undefined;

    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountGetSessionRequestParams
 * @property {string} sessionId Session ID. Use the string &#039;current&#039; to get the current device session.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountGetSessionRequestParams} params
 */
const accountGetSession = async ({sessionId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountUpdateSessionRequestParams
 * @property {string} sessionId Session ID. Use the string &#039;current&#039; to update the current device session.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountUpdateSessionRequestParams} params
 */
const accountUpdateSession = async ({sessionId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
    let payload = {};

    let response = undefined;

    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountDeleteSessionRequestParams
 * @property {string} sessionId Session ID. Use the string &#039;current&#039; to delete the current device session.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountDeleteSessionRequestParams} params
 */
const accountDeleteSession = async ({sessionId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/sessions/{sessionId}'.replace('{sessionId}', sessionId);
    let payload = {};

    let response = undefined;

    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountUpdateStatusRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountUpdateStatusRequestParams} params
 */
const accountUpdateStatus = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/status';
    let payload = {};

    let response = undefined;

    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountCreatePushTargetRequestParams
 * @property {string} targetId Target ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} identifier The target identifier (token, email, phone etc.)
 * @property {string} providerId Provider ID. Message will be sent to this target from the specified provider ID. If no provider ID is set the first setup provider will be used.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountCreatePushTargetRequestParams} params
 */
const accountCreatePushTarget = async ({targetId,identifier,providerId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/targets/push';
    let payload = {};
    if (typeof targetId !== 'undefined') {
        payload['targetId'] = targetId;
    }
    if (typeof identifier !== 'undefined') {
        payload['identifier'] = identifier;
    }
    if (typeof providerId !== 'undefined') {
        payload['providerId'] = providerId;
    }

    let response = undefined;

    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountUpdatePushTargetRequestParams
 * @property {string} targetId Target ID.
 * @property {string} identifier The target identifier (token, email, phone etc.)
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountUpdatePushTargetRequestParams} params
 */
const accountUpdatePushTarget = async ({targetId,identifier,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/targets/{targetId}/push'.replace('{targetId}', targetId);
    let payload = {};
    if (typeof identifier !== 'undefined') {
        payload['identifier'] = identifier;
    }

    let response = undefined;

    response = await client.call('put', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountDeletePushTargetRequestParams
 * @property {string} targetId Target ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountDeletePushTargetRequestParams} params
 */
const accountDeletePushTarget = async ({targetId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/targets/{targetId}/push'.replace('{targetId}', targetId);
    let payload = {};

    let response = undefined;

    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountCreateEmailTokenRequestParams
 * @property {string} userId User ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} email User email.
 * @property {boolean} phrase Toggle for security phrase. If enabled, email will be send with a randomly generated phrase and the phrase will also be included in the response. Confirming phrases match increases the security of your authentication flow.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountCreateEmailTokenRequestParams} params
 */
const accountCreateEmailToken = async ({userId,email,phrase,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/tokens/email';
    let payload = {};
    if (typeof userId !== 'undefined') {
        payload['userId'] = userId;
    }
    if (typeof email !== 'undefined') {
        payload['email'] = email;
    }
    if (typeof phrase !== 'undefined') {
        payload['phrase'] = phrase;
    }

    let response = undefined;

    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountCreateMagicURLTokenRequestParams
 * @property {string} userId Unique Id. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} email User email.
 * @property {string} url URL to redirect the user back to your app from the magic URL login. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
 * @property {boolean} phrase Toggle for security phrase. If enabled, email will be send with a randomly generated phrase and the phrase will also be included in the response. Confirming phrases match increases the security of your authentication flow.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountCreateMagicURLTokenRequestParams} params
 */
const accountCreateMagicURLToken = async ({userId,email,url,phrase,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/tokens/magic-url';
    let payload = {};
    if (typeof userId !== 'undefined') {
        payload['userId'] = userId;
    }
    if (typeof email !== 'undefined') {
        payload['email'] = email;
    }
    if (typeof url !== 'undefined') {
        payload['url'] = url;
    }
    if (typeof phrase !== 'undefined') {
        payload['phrase'] = phrase;
    }

    let response = undefined;

    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountCreateOAuth2TokenRequestParams
 * @property {OAuthProvider} provider OAuth2 Provider. Currently, supported providers are: amazon, apple, auth0, authentik, autodesk, bitbucket, bitly, box, dailymotion, discord, disqus, dropbox, etsy, facebook, figma, github, gitlab, google, linkedin, microsoft, notion, oidc, okta, paypal, paypalSandbox, podio, salesforce, slack, spotify, stripe, tradeshift, tradeshiftBox, twitch, wordpress, yahoo, yammer, yandex, zoho, zoom.
 * @property {string} success URL to redirect back to your app after a successful login attempt.  Only URLs from hostnames in your project&#039;s platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
 * @property {string} failure URL to redirect back to your app after a failed login attempt.  Only URLs from hostnames in your project&#039;s platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
 * @property {string[]} scopes A list of custom OAuth2 scopes. Check each provider internal docs for a list of supported scopes. Maximum of 100 scopes are allowed, each 4096 characters long.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountCreateOAuth2TokenRequestParams} params
 */
const accountCreateOAuth2Token = async ({provider,success,failure,scopes,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/tokens/oauth2/{provider}'.replace('{provider}', provider);
    let payload = {};
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
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountCreatePhoneTokenRequestParams
 * @property {string} userId Unique Id. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} phone Phone number. Format this number with a leading &#039;+&#039; and a country code, e.g., +16175551212.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountCreatePhoneTokenRequestParams} params
 */
const accountCreatePhoneToken = async ({userId,phone,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/tokens/phone';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} AccountCreateVerificationRequestParams
 * @property {string} url URL to redirect the user back to your app from the verification email. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountCreateVerificationRequestParams} params
 */
const accountCreateVerification = async ({url,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/verification';
    let payload = {};
    if (typeof url !== 'undefined') {
        payload['url'] = url;
    }

    let response = undefined;

    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountUpdateVerificationRequestParams
 * @property {string} userId User ID.
 * @property {string} secret Valid verification token.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountUpdateVerificationRequestParams} params
 */
const accountUpdateVerification = async ({userId,secret,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/verification';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} AccountCreatePhoneVerificationRequestParams
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountCreatePhoneVerificationRequestParams} params
 */
const accountCreatePhoneVerification = async ({parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/verification/phone';
    let payload = {};

    let response = undefined;

    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} AccountUpdatePhoneVerificationRequestParams
 * @property {string} userId User ID.
 * @property {string} secret Valid verification token.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AccountUpdatePhoneVerificationRequestParams} params
 */
const accountUpdatePhoneVerification = async ({userId,secret,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/account/verification/phone';
    let payload = {};
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
    }

    return response;

}

account
    .command(`get`)
    .description(`Get the currently logged in user.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(accountGet))

account
    .command(`create`)
    .description(`Use this endpoint to allow a new user to register a new account in your project. After the user registration completes successfully, you can use the [/account/verfication](https://appwrite.io/docs/references/cloud/client-web/account#createVerification) route to start verifying the user email address. To allow the new user to login to their new account, you need to create a new [account session](https://appwrite.io/docs/references/cloud/client-web/account#createEmailSession).`)
    .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `New user password. Must be between 8 and 256 chars.`)
    .option(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(accountCreate))

account
    .command(`delete`)
    .description(`Delete the currently logged in user.`)
    .action(actionRunner(accountDelete))

account
    .command(`update-email`)
    .description(`Update currently logged in user account email address. After changing user address, the user confirmation status will get reset. A new confirmation email is not sent automatically however you can use the send confirmation email endpoint again to send the confirmation email. For security measures, user password is required to complete this request. This endpoint can also be used to convert an anonymous account to a normal one, by passing an email address and a new password. `)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `User password. Must be at least 8 chars.`)
    .action(actionRunner(accountUpdateEmail))

account
    .command(`list-identities`)
    .description(`Get the list of identities for the currently logged in user.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, provider, providerUid, providerEmail, providerAccessTokenExpiry`)
    .action(actionRunner(accountListIdentities))

account
    .command(`delete-identity`)
    .description(`Delete an identity by its unique ID.`)
    .requiredOption(`--identity-id <identity-id>`, `Identity ID.`)
    .action(actionRunner(accountDeleteIdentity))

account
    .command(`create-jwt`)
    .description(`Use this endpoint to create a JSON Web Token. You can use the resulting JWT to authenticate on behalf of the current user when working with the Appwrite server-side API and SDKs. The JWT secret is valid for 15 minutes from its creation and will be invalid if the user will logout in that time frame.`)
    .action(actionRunner(accountCreateJWT))

account
    .command(`list-logs`)
    .description(`Get the list of latest security activity logs for the currently logged in user. Each log returns user IP address, location and date and time of log.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(accountListLogs))

account
    .command(`update-mfa`)
    .description(`Enable or disable MFA on an account.`)
    .requiredOption(`--mfa [value]`, `Enable or disable MFA.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(accountUpdateMFA))

account
    .command(`create-mfa-authenticator`)
    .description(`Add an authenticator app to be used as an MFA factor. Verify the authenticator using the [verify authenticator](/docs/references/cloud/client-web/account#updateMfaAuthenticator) method.`)
    .requiredOption(`--type <type>`, `Type of authenticator. Must be 'totp'`)
    .action(actionRunner(accountCreateMfaAuthenticator))

account
    .command(`update-mfa-authenticator`)
    .description(`Verify an authenticator app after adding it using the [add authenticator](/docs/references/cloud/client-web/account#createMfaAuthenticator) method.`)
    .requiredOption(`--type <type>`, `Type of authenticator.`)
    .requiredOption(`--otp <otp>`, `Valid verification token.`)
    .action(actionRunner(accountUpdateMfaAuthenticator))

account
    .command(`delete-mfa-authenticator`)
    .description(`Delete an authenticator for a user by ID.`)
    .requiredOption(`--type <type>`, `Type of authenticator.`)
    .action(actionRunner(accountDeleteMfaAuthenticator))

account
    .command(`create-mfa-challenge`)
    .description(`Begin the process of MFA verification after sign-in. Finish the flow with [updateMfaChallenge](/docs/references/cloud/client-web/account#updateMfaChallenge) method.`)
    .requiredOption(`--factor <factor>`, `Factor used for verification. Must be one of following: 'email', 'phone', 'totp', 'recoveryCode'.`)
    .action(actionRunner(accountCreateMfaChallenge))

account
    .command(`update-mfa-challenge`)
    .description(`Complete the MFA challenge by providing the one-time password. Finish the process of MFA verification by providing the one-time password. To begin the flow, use [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge) method.`)
    .requiredOption(`--challenge-id <challenge-id>`, `ID of the challenge.`)
    .requiredOption(`--otp <otp>`, `Valid verification token.`)
    .action(actionRunner(accountUpdateMfaChallenge))

account
    .command(`list-mfa-factors`)
    .description(`List the factors available on the account to be used as a MFA challange.`)
    .action(actionRunner(accountListMfaFactors))

account
    .command(`get-mfa-recovery-codes`)
    .description(`Get recovery codes that can be used as backup for MFA flow. Before getting codes, they must be generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method. An OTP challenge is required to read recovery codes.`)
    .action(actionRunner(accountGetMfaRecoveryCodes))

account
    .command(`create-mfa-recovery-codes`)
    .description(`Generate recovery codes as backup for MFA flow. It's recommended to generate and show then immediately after user successfully adds their authehticator. Recovery codes can be used as a MFA verification type in [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge) method.`)
    .action(actionRunner(accountCreateMfaRecoveryCodes))

account
    .command(`update-mfa-recovery-codes`)
    .description(`Regenerate recovery codes that can be used as backup for MFA flow. Before regenerating codes, they must be first generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method. An OTP challenge is required to regenreate recovery codes.`)
    .action(actionRunner(accountUpdateMfaRecoveryCodes))

account
    .command(`update-name`)
    .description(`Update currently logged in user account name.`)
    .requiredOption(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(accountUpdateName))

account
    .command(`update-password`)
    .description(`Update currently logged in user password. For validation, user is required to pass in the new password, and the old password. For users created with OAuth, Team Invites and Magic URL, oldPassword is optional.`)
    .requiredOption(`--password <password>`, `New user password. Must be at least 8 chars.`)
    .option(`--old-password <old-password>`, `Current user password. Must be at least 8 chars.`)
    .action(actionRunner(accountUpdatePassword))

account
    .command(`update-phone`)
    .description(`Update the currently logged in user's phone number. After updating the phone number, the phone verification status will be reset. A confirmation SMS is not sent automatically, however you can use the [POST /account/verification/phone](https://appwrite.io/docs/references/cloud/client-web/account#createPhoneVerification) endpoint to send a confirmation SMS.`)
    .requiredOption(`--phone <phone>`, `Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .requiredOption(`--password <password>`, `User password. Must be at least 8 chars.`)
    .action(actionRunner(accountUpdatePhone))

account
    .command(`get-prefs`)
    .description(`Get the preferences as a key-value object for the currently logged in user.`)
    .action(actionRunner(accountGetPrefs))

account
    .command(`update-prefs`)
    .description(`Update currently logged in user account preferences. The object you pass is stored as is, and replaces any previous value. The maximum allowed prefs size is 64kB and throws error if exceeded.`)
    .requiredOption(`--prefs <prefs>`, `Prefs key-value JSON object.`)
    .action(actionRunner(accountUpdatePrefs))

account
    .command(`create-recovery`)
    .description(`Sends the user an email with a temporary secret key for password reset. When the user clicks the confirmation link he is redirected back to your app password reset URL with the secret key and email address values attached to the URL query string. Use the query string params to submit a request to the [PUT /account/recovery](https://appwrite.io/docs/references/cloud/client-web/account#updateRecovery) endpoint to complete the process. The verification link sent to the user's email address is valid for 1 hour.`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--url <url>`, `URL to redirect the user back to your app from the recovery email. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .action(actionRunner(accountCreateRecovery))

account
    .command(`update-recovery`)
    .description(`Use this endpoint to complete the user account password reset. Both the **userId** and **secret** arguments will be passed as query parameters to the redirect URL you have provided when sending your request to the [POST /account/recovery](https://appwrite.io/docs/references/cloud/client-web/account#createRecovery) endpoint.  Please note that in order to avoid a [Redirect Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md) the only valid redirect URLs are the ones from domains you have set when adding your platforms in the console interface.`)
    .requiredOption(`--user-id <user-id>`, `User ID.`)
    .requiredOption(`--secret <secret>`, `Valid reset token.`)
    .requiredOption(`--password <password>`, `New user password. Must be between 8 and 256 chars.`)
    .action(actionRunner(accountUpdateRecovery))

account
    .command(`list-sessions`)
    .description(`Get the list of active sessions across different devices for the currently logged in user.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(accountListSessions))

account
    .command(`delete-sessions`)
    .description(`Delete all sessions from the user account and remove any sessions cookies from the end client.`)
    .action(actionRunner(accountDeleteSessions))

account
    .command(`create-anonymous-session`)
    .description(`Use this endpoint to allow a new user to register an anonymous account in your project. This route will also create a new session for the user. To allow the new user to convert an anonymous account to a normal account, you need to update its [email and password](https://appwrite.io/docs/references/cloud/client-web/account#updateEmail) or create an [OAuth2 session](https://appwrite.io/docs/references/cloud/client-web/account#CreateOAuth2Session).`)
    .action(actionRunner(accountCreateAnonymousSession))

account
    .command(`create-email-password-session`)
    .description(`Allow the user to login into their account by providing a valid email and password combination. This route will create a new session for the user.  A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `User password. Must be at least 8 chars.`)
    .action(actionRunner(accountCreateEmailPasswordSession))

account
    .command(`update-magic-url-session`)
    .description(`[**DEPRECATED** - This command is deprecated.] Use this endpoint to create a session from token. Provide the **userId** and **secret** parameters from the successful response of authentication flows initiated by token creation. For example, magic URL and phone login.`)
    .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--secret <secret>`, `Valid verification token.`)
    .action(actionRunner(accountUpdateMagicURLSession))

account
    .command(`create-o-auth-2-session`)
    .description(`Allow the user to login to their account using the OAuth2 provider of their choice. Each OAuth2 provider should be enabled from the Appwrite console first. Use the success and failure arguments to provide a redirect URL's back to your app when login is completed.  If there is already an active session, the new session will be attached to the logged-in account. If there are no active sessions, the server will attempt to look for a user with the same email address as the email received from the OAuth2 provider and attach the new session to the existing user. If no matching user is found - the server will create a new user.  A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits). `)
    .requiredOption(`--provider <provider>`, `OAuth2 Provider. Currently, supported providers are: amazon, apple, auth0, authentik, autodesk, bitbucket, bitly, box, dailymotion, discord, disqus, dropbox, etsy, facebook, figma, github, gitlab, google, linkedin, microsoft, notion, oidc, okta, paypal, paypalSandbox, podio, salesforce, slack, spotify, stripe, tradeshift, tradeshiftBox, twitch, wordpress, yahoo, yammer, yandex, zoho, zoom.`)
    .option(`--success <success>`, `URL to redirect back to your app after a successful login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .option(`--failure <failure>`, `URL to redirect back to your app after a failed login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .option(`--scopes [scopes...]`, `A list of custom OAuth2 scopes. Check each provider internal docs for a list of supported scopes. Maximum of 100 scopes are allowed, each 4096 characters long.`)
    .action(actionRunner(accountCreateOAuth2Session))

account
    .command(`update-phone-session`)
    .description(`[**DEPRECATED** - This command is deprecated.] Use this endpoint to create a session from token. Provide the **userId** and **secret** parameters from the successful response of authentication flows initiated by token creation. For example, magic URL and phone login.`)
    .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--secret <secret>`, `Valid verification token.`)
    .action(actionRunner(accountUpdatePhoneSession))

account
    .command(`create-session`)
    .description(`Use this endpoint to create a session from token. Provide the **userId** and **secret** parameters from the successful response of authentication flows initiated by token creation. For example, magic URL and phone login.`)
    .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--secret <secret>`, `Secret of a token generated by login methods. For example, the 'createMagicURLToken' or 'createPhoneToken' methods.`)
    .action(actionRunner(accountCreateSession))

account
    .command(`get-session`)
    .description(`Use this endpoint to get a logged in user's session using a Session ID. Inputting 'current' will return the current session being used.`)
    .requiredOption(`--session-id <session-id>`, `Session ID. Use the string 'current' to get the current device session.`)
    .action(actionRunner(accountGetSession))

account
    .command(`update-session`)
    .description(`Use this endpoint to extend a session's length. Extending a session is useful when session expiry is short. If the session was created using an OAuth provider, this endpoint refreshes the access token from the provider.`)
    .requiredOption(`--session-id <session-id>`, `Session ID. Use the string 'current' to update the current device session.`)
    .action(actionRunner(accountUpdateSession))

account
    .command(`delete-session`)
    .description(`Logout the user. Use 'current' as the session ID to logout on this device, use a session ID to logout on another device. If you're looking to logout the user on all devices, use [Delete Sessions](https://appwrite.io/docs/references/cloud/client-web/account#deleteSessions) instead.`)
    .requiredOption(`--session-id <session-id>`, `Session ID. Use the string 'current' to delete the current device session.`)
    .action(actionRunner(accountDeleteSession))

account
    .command(`update-status`)
    .description(`Block the currently logged in user account. Behind the scene, the user record is not deleted but permanently blocked from any access. To completely delete a user, use the Users API instead.`)
    .action(actionRunner(accountUpdateStatus))

account
    .command(`create-push-target`)
    .description(`Use this endpoint to register a device for push notifications. Provide a target ID (custom or generated using ID.unique()), a device identifier (usually a device token), and optionally specify which provider should send notifications to this target. The target is automatically linked to the current session and includes device information like brand and model.`)
    .requiredOption(`--target-id <target-id>`, `Target ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--identifier <identifier>`, `The target identifier (token, email, phone etc.)`)
    .option(`--provider-id <provider-id>`, `Provider ID. Message will be sent to this target from the specified provider ID. If no provider ID is set the first setup provider will be used.`)
    .action(actionRunner(accountCreatePushTarget))

account
    .command(`update-push-target`)
    .description(`Update the currently logged in user's push notification target. You can modify the target's identifier (device token) and provider ID (token, email, phone etc.). The target must exist and belong to the current user. If you change the provider ID, notifications will be sent through the new messaging provider instead.`)
    .requiredOption(`--target-id <target-id>`, `Target ID.`)
    .requiredOption(`--identifier <identifier>`, `The target identifier (token, email, phone etc.)`)
    .action(actionRunner(accountUpdatePushTarget))

account
    .command(`delete-push-target`)
    .description(`Delete a push notification target for the currently logged in user. After deletion, the device will no longer receive push notifications. The target must exist and belong to the current user.`)
    .requiredOption(`--target-id <target-id>`, `Target ID.`)
    .action(actionRunner(accountDeletePushTarget))

account
    .command(`create-email-token`)
    .description(`Sends the user an email with a secret key for creating a session. If the provided user ID has not be registered, a new user will be created. Use the returned user ID and secret and submit a request to the [POST /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint to complete the login process. The secret sent to the user's email is valid for 15 minutes.  A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).`)
    .requiredOption(`--user-id <user-id>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--email <email>`, `User email.`)
    .option(`--phrase [value]`, `Toggle for security phrase. If enabled, email will be send with a randomly generated phrase and the phrase will also be included in the response. Confirming phrases match increases the security of your authentication flow.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(accountCreateEmailToken))

account
    .command(`create-magic-url-token`)
    .description(`Sends the user an email with a secret key for creating a session. If the provided user ID has not been registered, a new user will be created. When the user clicks the link in the email, the user is redirected back to the URL you provided with the secret key and userId values attached to the URL query string. Use the query string parameters to submit a request to the [POST /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint to complete the login process. The link sent to the user's email address is valid for 1 hour.  A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits). `)
    .requiredOption(`--user-id <user-id>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--email <email>`, `User email.`)
    .option(`--url <url>`, `URL to redirect the user back to your app from the magic URL login. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .option(`--phrase [value]`, `Toggle for security phrase. If enabled, email will be send with a randomly generated phrase and the phrase will also be included in the response. Confirming phrases match increases the security of your authentication flow.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(accountCreateMagicURLToken))

account
    .command(`create-o-auth-2-token`)
    .description(`Allow the user to login to their account using the OAuth2 provider of their choice. Each OAuth2 provider should be enabled from the Appwrite console first. Use the success and failure arguments to provide a redirect URL's back to your app when login is completed.   If authentication succeeds, 'userId' and 'secret' of a token will be appended to the success URL as query parameters. These can be used to create a new session using the [Create session](https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint.  A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).`)
    .requiredOption(`--provider <provider>`, `OAuth2 Provider. Currently, supported providers are: amazon, apple, auth0, authentik, autodesk, bitbucket, bitly, box, dailymotion, discord, disqus, dropbox, etsy, facebook, figma, github, gitlab, google, linkedin, microsoft, notion, oidc, okta, paypal, paypalSandbox, podio, salesforce, slack, spotify, stripe, tradeshift, tradeshiftBox, twitch, wordpress, yahoo, yammer, yandex, zoho, zoom.`)
    .option(`--success <success>`, `URL to redirect back to your app after a successful login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .option(`--failure <failure>`, `URL to redirect back to your app after a failed login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .option(`--scopes [scopes...]`, `A list of custom OAuth2 scopes. Check each provider internal docs for a list of supported scopes. Maximum of 100 scopes are allowed, each 4096 characters long.`)
    .action(actionRunner(accountCreateOAuth2Token))

account
    .command(`create-phone-token`)
    .description(`Sends the user an SMS with a secret key for creating a session. If the provided user ID has not be registered, a new user will be created. Use the returned user ID and secret and submit a request to the [POST /v1/account/sessions/token](https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint to complete the login process. The secret sent to the user's phone is valid for 15 minutes.  A user is limited to 10 active sessions at a time by default. [Learn more about session limits](https://appwrite.io/docs/authentication-security#limits).`)
    .requiredOption(`--user-id <user-id>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--phone <phone>`, `Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .action(actionRunner(accountCreatePhoneToken))

account
    .command(`create-verification`)
    .description(`Use this endpoint to send a verification message to your user email address to confirm they are the valid owners of that address. Both the **userId** and **secret** arguments will be passed as query parameters to the URL you have provided to be attached to the verification email. The provided URL should redirect the user back to your app and allow you to complete the verification process by verifying both the **userId** and **secret** parameters. Learn more about how to [complete the verification process](https://appwrite.io/docs/references/cloud/client-web/account#updateVerification). The verification link sent to the user's email address is valid for 7 days.  Please note that in order to avoid a [Redirect Attack](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md), the only valid redirect URLs are the ones from domains you have set when adding your platforms in the console interface. `)
    .requiredOption(`--url <url>`, `URL to redirect the user back to your app from the verification email. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an [open redirect](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.`)
    .action(actionRunner(accountCreateVerification))

account
    .command(`update-verification`)
    .description(`Use this endpoint to complete the user email verification process. Use both the **userId** and **secret** parameters that were attached to your app URL to verify the user email ownership. If confirmed this route will return a 200 status code.`)
    .requiredOption(`--user-id <user-id>`, `User ID.`)
    .requiredOption(`--secret <secret>`, `Valid verification token.`)
    .action(actionRunner(accountUpdateVerification))

account
    .command(`create-phone-verification`)
    .description(`Use this endpoint to send a verification SMS to the currently logged in user. This endpoint is meant for use after updating a user's phone number using the [accountUpdatePhone](https://appwrite.io/docs/references/cloud/client-web/account#updatePhone) endpoint. Learn more about how to [complete the verification process](https://appwrite.io/docs/references/cloud/client-web/account#updatePhoneVerification). The verification code sent to the user's phone number is valid for 15 minutes.`)
    .action(actionRunner(accountCreatePhoneVerification))

account
    .command(`update-phone-verification`)
    .description(`Use this endpoint to complete the user phone verification process. Use the **userId** and **secret** that were sent to your user's phone number to verify the user email ownership. If confirmed this route will return a 200 status code.`)
    .requiredOption(`--user-id <user-id>`, `User ID.`)
    .requiredOption(`--secret <secret>`, `Valid verification token.`)
    .action(actionRunner(accountUpdatePhoneVerification))

module.exports = {
    account,
    accountGet,
    accountCreate,
    accountDelete,
    accountUpdateEmail,
    accountListIdentities,
    accountDeleteIdentity,
    accountCreateJWT,
    accountListLogs,
    accountUpdateMFA,
    accountCreateMfaAuthenticator,
    accountUpdateMfaAuthenticator,
    accountDeleteMfaAuthenticator,
    accountCreateMfaChallenge,
    accountUpdateMfaChallenge,
    accountListMfaFactors,
    accountGetMfaRecoveryCodes,
    accountCreateMfaRecoveryCodes,
    accountUpdateMfaRecoveryCodes,
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
    accountCreateEmailPasswordSession,
    accountUpdateMagicURLSession,
    accountCreateOAuth2Session,
    accountUpdatePhoneSession,
    accountCreateSession,
    accountGetSession,
    accountUpdateSession,
    accountDeleteSession,
    accountUpdateStatus,
    accountCreatePushTarget,
    accountUpdatePushTarget,
    accountDeletePushTarget,
    accountCreateEmailToken,
    accountCreateMagicURLToken,
    accountCreateOAuth2Token,
    accountCreatePhoneToken,
    accountCreateVerification,
    accountUpdateVerification,
    accountCreatePhoneVerification,
    accountUpdatePhoneVerification
};
