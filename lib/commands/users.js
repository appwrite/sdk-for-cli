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

const users = new Command("users").description(commandDescriptions['users']).configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} UsersListRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, email, phone, status, passwordUpdate, registration, emailVerification, phoneVerification, labels
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersListRequestParams} params
 */
const usersList = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users';
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof search !== 'undefined') {
        payload['search'] = search;
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

/**
 * @typedef {Object} UsersCreateRequestParams
 * @property {string} userId User ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} email User email.
 * @property {string} phone Phone number. Format this number with a leading &#039;+&#039; and a country code, e.g., +16175551212.
 * @property {string} password Plain text user password. Must be at least 8 chars.
 * @property {string} name User name. Max length: 128 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersCreateRequestParams} params
 */
const usersCreate = async ({ userId, email, phone, password, name, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users';
    let payload = {};
    if (typeof userId !== 'undefined') {
        payload['userId'] = userId;
    }
    if (typeof email !== 'undefined') {
        payload['email'] = email;
    }
    if (typeof phone !== 'undefined') {
        payload['phone'] = phone;
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

/**
 * @typedef {Object} UsersCreateArgon2UserRequestParams
 * @property {string} userId User ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} email User email.
 * @property {string} password User password hashed using Argon2.
 * @property {string} name User name. Max length: 128 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersCreateArgon2UserRequestParams} params
 */
const usersCreateArgon2User = async ({ userId, email, password, name, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/argon2';
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} UsersCreateBcryptUserRequestParams
 * @property {string} userId User ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} email User email.
 * @property {string} password User password hashed using Bcrypt.
 * @property {string} name User name. Max length: 128 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersCreateBcryptUserRequestParams} params
 */
const usersCreateBcryptUser = async ({ userId, email, password, name, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/bcrypt';
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} UsersListIdentitiesRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, provider, providerUid, providerEmail, providerAccessTokenExpiry
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersListIdentitiesRequestParams} params
 */
const usersListIdentities = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/identities';
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof search !== 'undefined') {
        payload['search'] = search;
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

/**
 * @typedef {Object} UsersDeleteIdentityRequestParams
 * @property {string} identityId Identity ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersDeleteIdentityRequestParams} params
 */
const usersDeleteIdentity = async ({ identityId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/identities/{identityId}'.replace('{identityId}', identityId);
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

/**
 * @typedef {Object} UsersCreateMD5UserRequestParams
 * @property {string} userId User ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} email User email.
 * @property {string} password User password hashed using MD5.
 * @property {string} name User name. Max length: 128 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersCreateMD5UserRequestParams} params
 */
const usersCreateMD5User = async ({ userId, email, password, name, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/md5';
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} UsersCreatePHPassUserRequestParams
 * @property {string} userId User ID. Choose a custom ID or pass the string &#039;ID.unique()&#039;to auto generate it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} email User email.
 * @property {string} password User password hashed using PHPass.
 * @property {string} name User name. Max length: 128 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersCreatePHPassUserRequestParams} params
 */
const usersCreatePHPassUser = async ({ userId, email, password, name, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/phpass';
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} UsersCreateScryptUserRequestParams
 * @property {string} userId User ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} email User email.
 * @property {string} password User password hashed using Scrypt.
 * @property {string} passwordSalt Optional salt used to hash password.
 * @property {number} passwordCpu Optional CPU cost used to hash password.
 * @property {number} passwordMemory Optional memory cost used to hash password.
 * @property {number} passwordParallel Optional parallelization cost used to hash password.
 * @property {number} passwordLength Optional hash length used to hash password.
 * @property {string} name User name. Max length: 128 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersCreateScryptUserRequestParams} params
 */
const usersCreateScryptUser = async ({ userId, email, password, passwordSalt, passwordCpu, passwordMemory, passwordParallel, passwordLength, name, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/scrypt';
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
    if (typeof passwordSalt !== 'undefined') {
        payload['passwordSalt'] = passwordSalt;
    }
    if (typeof passwordCpu !== 'undefined') {
        payload['passwordCpu'] = passwordCpu;
    }
    if (typeof passwordMemory !== 'undefined') {
        payload['passwordMemory'] = passwordMemory;
    }
    if (typeof passwordParallel !== 'undefined') {
        payload['passwordParallel'] = passwordParallel;
    }
    if (typeof passwordLength !== 'undefined') {
        payload['passwordLength'] = passwordLength;
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

/**
 * @typedef {Object} UsersCreateScryptModifiedUserRequestParams
 * @property {string} userId User ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} email User email.
 * @property {string} password User password hashed using Scrypt Modified.
 * @property {string} passwordSalt Salt used to hash password.
 * @property {string} passwordSaltSeparator Salt separator used to hash password.
 * @property {string} passwordSignerKey Signer key used to hash password.
 * @property {string} name User name. Max length: 128 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersCreateScryptModifiedUserRequestParams} params
 */
const usersCreateScryptModifiedUser = async ({ userId, email, password, passwordSalt, passwordSaltSeparator, passwordSignerKey, name, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/scrypt-modified';
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
    if (typeof passwordSalt !== 'undefined') {
        payload['passwordSalt'] = passwordSalt;
    }
    if (typeof passwordSaltSeparator !== 'undefined') {
        payload['passwordSaltSeparator'] = passwordSaltSeparator;
    }
    if (typeof passwordSignerKey !== 'undefined') {
        payload['passwordSignerKey'] = passwordSignerKey;
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

/**
 * @typedef {Object} UsersCreateSHAUserRequestParams
 * @property {string} userId User ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} email User email.
 * @property {string} password User password hashed using SHA.
 * @property {PasswordHash} passwordVersion Optional SHA version used to hash password. Allowed values are: &#039;sha1&#039;, &#039;sha224&#039;, &#039;sha256&#039;, &#039;sha384&#039;, &#039;sha512/224&#039;, &#039;sha512/256&#039;, &#039;sha512&#039;, &#039;sha3-224&#039;, &#039;sha3-256&#039;, &#039;sha3-384&#039;, &#039;sha3-512&#039;
 * @property {string} name User name. Max length: 128 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersCreateSHAUserRequestParams} params
 */
const usersCreateSHAUser = async ({ userId, email, password, passwordVersion, name, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/sha';
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
    if (typeof passwordVersion !== 'undefined') {
        payload['passwordVersion'] = passwordVersion;
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

/**
 * @typedef {Object} UsersGetUsageRequestParams
 * @property {UserUsageRange} range Date range.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersGetUsageRequestParams} params
 */
const usersGetUsage = async ({ range, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/usage';
    let payload = {};
    if (typeof range !== 'undefined') {
        payload['range'] = range;
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

/**
 * @typedef {Object} UsersGetRequestParams
 * @property {string} userId User ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersGetRequestParams} params
 */
const usersGet = async ({ userId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}'.replace('{userId}', userId);
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

/**
 * @typedef {Object} UsersDeleteRequestParams
 * @property {string} userId User ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersDeleteRequestParams} params
 */
const usersDelete = async ({ userId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}'.replace('{userId}', userId);
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

/**
 * @typedef {Object} UsersUpdateEmailRequestParams
 * @property {string} userId User ID.
 * @property {string} email User email.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersUpdateEmailRequestParams} params
 */
const usersUpdateEmail = async ({ userId, email, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/email'.replace('{userId}', userId);
    let payload = {};
    if (typeof email !== 'undefined') {
        payload['email'] = email;
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

/**
 * @typedef {Object} UsersUpdateLabelsRequestParams
 * @property {string} userId User ID.
 * @property {string[]} labels Array of user labels. Replaces the previous labels. Maximum of 1000 labels are allowed, each up to 36 alphanumeric characters long.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersUpdateLabelsRequestParams} params
 */
const usersUpdateLabels = async ({ userId, labels, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/labels'.replace('{userId}', userId);
    let payload = {};
    labels = labels === true ? [] : labels;
    if (typeof labels !== 'undefined') {
        payload['labels'] = labels;
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

/**
 * @typedef {Object} UsersListLogsRequestParams
 * @property {string} userId User ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersListLogsRequestParams} params
 */
const usersListLogs = async ({ userId, queries, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/logs'.replace('{userId}', userId);
    let payload = {};
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

/**
 * @typedef {Object} UsersListMembershipsRequestParams
 * @property {string} userId User ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersListMembershipsRequestParams} params
 */
const usersListMemberships = async ({ userId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/memberships'.replace('{userId}', userId);
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

/**
 * @typedef {Object} UsersUpdateMfaRequestParams
 * @property {string} userId User ID.
 * @property {boolean} mfa Enable or disable MFA.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersUpdateMfaRequestParams} params
 */
const usersUpdateMfa = async ({ userId, mfa, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/mfa'.replace('{userId}', userId);
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} UsersDeleteMfaAuthenticatorRequestParams
 * @property {string} userId User ID.
 * @property {AuthenticatorType} type Type of authenticator.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersDeleteMfaAuthenticatorRequestParams} params
 */
const usersDeleteMfaAuthenticator = async ({ userId, type, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/mfa/authenticators/{type}'.replace('{userId}', userId).replace('{type}', type);
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

/**
 * @typedef {Object} UsersListMfaFactorsRequestParams
 * @property {string} userId User ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersListMfaFactorsRequestParams} params
 */
const usersListMfaFactors = async ({ userId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/mfa/factors'.replace('{userId}', userId);
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

/**
 * @typedef {Object} UsersGetMfaRecoveryCodesRequestParams
 * @property {string} userId User ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersGetMfaRecoveryCodesRequestParams} params
 */
const usersGetMfaRecoveryCodes = async ({ userId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/mfa/recovery-codes'.replace('{userId}', userId);
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

/**
 * @typedef {Object} UsersUpdateMfaRecoveryCodesRequestParams
 * @property {string} userId User ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersUpdateMfaRecoveryCodesRequestParams} params
 */
const usersUpdateMfaRecoveryCodes = async ({ userId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/mfa/recovery-codes'.replace('{userId}', userId);
    let payload = {};

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

/**
 * @typedef {Object} UsersCreateMfaRecoveryCodesRequestParams
 * @property {string} userId User ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersCreateMfaRecoveryCodesRequestParams} params
 */
const usersCreateMfaRecoveryCodes = async ({ userId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/mfa/recovery-codes'.replace('{userId}', userId);
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

/**
 * @typedef {Object} UsersUpdateNameRequestParams
 * @property {string} userId User ID.
 * @property {string} name User name. Max length: 128 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersUpdateNameRequestParams} params
 */
const usersUpdateName = async ({ userId, name, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/name'.replace('{userId}', userId);
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} UsersUpdatePasswordRequestParams
 * @property {string} userId User ID.
 * @property {string} password New user password. Must be at least 8 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersUpdatePasswordRequestParams} params
 */
const usersUpdatePassword = async ({ userId, password, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/password'.replace('{userId}', userId);
    let payload = {};
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

/**
 * @typedef {Object} UsersUpdatePhoneRequestParams
 * @property {string} userId User ID.
 * @property {string} number User phone number.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersUpdatePhoneRequestParams} params
 */
const usersUpdatePhone = async ({ userId, number, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/phone'.replace('{userId}', userId);
    let payload = {};
    if (typeof number !== 'undefined') {
        payload['number'] = number;
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

/**
 * @typedef {Object} UsersGetPrefsRequestParams
 * @property {string} userId User ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersGetPrefsRequestParams} params
 */
const usersGetPrefs = async ({ userId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/prefs'.replace('{userId}', userId);
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

/**
 * @typedef {Object} UsersUpdatePrefsRequestParams
 * @property {string} userId User ID.
 * @property {object} prefs Prefs key-value JSON object.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersUpdatePrefsRequestParams} params
 */
const usersUpdatePrefs = async ({ userId, prefs, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/prefs'.replace('{userId}', userId);
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
        success()
    }
    
    return response;
}

/**
 * @typedef {Object} UsersListSessionsRequestParams
 * @property {string} userId User ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersListSessionsRequestParams} params
 */
const usersListSessions = async ({ userId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/sessions'.replace('{userId}', userId);
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

/**
 * @typedef {Object} UsersCreateSessionRequestParams
 * @property {string} userId User ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersCreateSessionRequestParams} params
 */
const usersCreateSession = async ({ userId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/sessions'.replace('{userId}', userId);
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

/**
 * @typedef {Object} UsersDeleteSessionsRequestParams
 * @property {string} userId User ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersDeleteSessionsRequestParams} params
 */
const usersDeleteSessions = async ({ userId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/sessions'.replace('{userId}', userId);
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

/**
 * @typedef {Object} UsersDeleteSessionRequestParams
 * @property {string} userId User ID.
 * @property {string} sessionId Session ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersDeleteSessionRequestParams} params
 */
const usersDeleteSession = async ({ userId, sessionId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/sessions/{sessionId}'.replace('{userId}', userId).replace('{sessionId}', sessionId);
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

/**
 * @typedef {Object} UsersUpdateStatusRequestParams
 * @property {string} userId User ID.
 * @property {boolean} status User Status. To activate the user pass &#039;true&#039; and to block the user pass &#039;false&#039;.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersUpdateStatusRequestParams} params
 */
const usersUpdateStatus = async ({ userId, status, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/status'.replace('{userId}', userId);
    let payload = {};
    if (typeof status !== 'undefined') {
        payload['status'] = status;
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

/**
 * @typedef {Object} UsersListTargetsRequestParams
 * @property {string} userId User ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, email, phone, status, passwordUpdate, registration, emailVerification, phoneVerification, labels
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersListTargetsRequestParams} params
 */
const usersListTargets = async ({ userId, queries, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/targets'.replace('{userId}', userId);
    let payload = {};
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

/**
 * @typedef {Object} UsersCreateTargetRequestParams
 * @property {string} userId User ID.
 * @property {string} targetId Target ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {MessagingProviderType} providerType The target provider type. Can be one of the following: &#039;email&#039;, &#039;sms&#039; or &#039;push&#039;.
 * @property {string} identifier The target identifier (token, email, phone etc.)
 * @property {string} providerId Provider ID. Message will be sent to this target from the specified provider ID. If no provider ID is set the first setup provider will be used.
 * @property {string} name Target name. Max length: 128 chars. For example: My Awesome App Galaxy S23.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersCreateTargetRequestParams} params
 */
const usersCreateTarget = async ({ userId, targetId, providerType, identifier, providerId, name, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/targets'.replace('{userId}', userId);
    let payload = {};
    if (typeof targetId !== 'undefined') {
        payload['targetId'] = targetId;
    }
    if (typeof providerType !== 'undefined') {
        payload['providerType'] = providerType;
    }
    if (typeof identifier !== 'undefined') {
        payload['identifier'] = identifier;
    }
    if (typeof providerId !== 'undefined') {
        payload['providerId'] = providerId;
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

/**
 * @typedef {Object} UsersGetTargetRequestParams
 * @property {string} userId User ID.
 * @property {string} targetId Target ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersGetTargetRequestParams} params
 */
const usersGetTarget = async ({ userId, targetId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/targets/{targetId}'.replace('{userId}', userId).replace('{targetId}', targetId);
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

/**
 * @typedef {Object} UsersUpdateTargetRequestParams
 * @property {string} userId User ID.
 * @property {string} targetId Target ID.
 * @property {string} identifier The target identifier (token, email, phone etc.)
 * @property {string} providerId Provider ID. Message will be sent to this target from the specified provider ID. If no provider ID is set the first setup provider will be used.
 * @property {string} name Target name. Max length: 128 chars. For example: My Awesome App Galaxy S23.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersUpdateTargetRequestParams} params
 */
const usersUpdateTarget = async ({ userId, targetId, identifier, providerId, name, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/targets/{targetId}'.replace('{userId}', userId).replace('{targetId}', targetId);
    let payload = {};
    if (typeof identifier !== 'undefined') {
        payload['identifier'] = identifier;
    }
    if (typeof providerId !== 'undefined') {
        payload['providerId'] = providerId;
    }
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

/**
 * @typedef {Object} UsersDeleteTargetRequestParams
 * @property {string} userId User ID.
 * @property {string} targetId Target ID.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersDeleteTargetRequestParams} params
 */
const usersDeleteTarget = async ({ userId, targetId, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/targets/{targetId}'.replace('{userId}', userId).replace('{targetId}', targetId);
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

/**
 * @typedef {Object} UsersCreateTokenRequestParams
 * @property {string} userId User ID.
 * @property {number} length Token length in characters. The default length is 6 characters
 * @property {number} expire Token expiration period in seconds. The default expiration is 15 minutes.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersCreateTokenRequestParams} params
 */
const usersCreateToken = async ({ userId, length, expire, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/tokens'.replace('{userId}', userId);
    let payload = {};
    if (typeof length !== 'undefined') {
        payload['length'] = length;
    }
    if (typeof expire !== 'undefined') {
        payload['expire'] = expire;
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

/**
 * @typedef {Object} UsersUpdateEmailVerificationRequestParams
 * @property {string} userId User ID.
 * @property {boolean} emailVerification User email verification status.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersUpdateEmailVerificationRequestParams} params
 */
const usersUpdateEmailVerification = async ({ userId, emailVerification, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/verification'.replace('{userId}', userId);
    let payload = {};
    if (typeof emailVerification !== 'undefined') {
        payload['emailVerification'] = emailVerification;
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

/**
 * @typedef {Object} UsersUpdatePhoneVerificationRequestParams
 * @property {string} userId User ID.
 * @property {boolean} phoneVerification User phone verification status.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {UsersUpdatePhoneVerificationRequestParams} params
 */
const usersUpdatePhoneVerification = async ({ userId, phoneVerification, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/verification/phone'.replace('{userId}', userId);
    let payload = {};
    if (typeof phoneVerification !== 'undefined') {
        payload['phoneVerification'] = phoneVerification;
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

users
    .command(`list`)
    .description(`Get a list of all the project's users. You can use the query params to filter your results.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, email, phone, status, passwordUpdate, registration, emailVerification, phoneVerification, labels`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(usersList))

users
    .command(`create`)
    .description(`Create a new user.`)
    .requiredOption(`--userId <userId>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .option(`--email <email>`, `User email.`)
    .option(`--phone <phone>`, `Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .option(`--password <password>`, `Plain text user password. Must be at least 8 chars.`)
    .option(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(usersCreate))

users
    .command(`createArgon2User`)
    .description(`Create a new user. Password provided must be hashed with the [Argon2](https://en.wikipedia.org/wiki/Argon2) algorithm. Use the [POST /users](https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
    .requiredOption(`--userId <userId>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `User password hashed using Argon2.`)
    .option(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(usersCreateArgon2User))

users
    .command(`createBcryptUser`)
    .description(`Create a new user. Password provided must be hashed with the [Bcrypt](https://en.wikipedia.org/wiki/Bcrypt) algorithm. Use the [POST /users](https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
    .requiredOption(`--userId <userId>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `User password hashed using Bcrypt.`)
    .option(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(usersCreateBcryptUser))

users
    .command(`listIdentities`)
    .description(`Get identities for all users.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, provider, providerUid, providerEmail, providerAccessTokenExpiry`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(usersListIdentities))

users
    .command(`deleteIdentity`)
    .description(`Delete an identity by its unique ID.`)
    .requiredOption(`--identityId <identityId>`, `Identity ID.`)
    .action(actionRunner(usersDeleteIdentity))

users
    .command(`createMD5User`)
    .description(`Create a new user. Password provided must be hashed with the [MD5](https://en.wikipedia.org/wiki/MD5) algorithm. Use the [POST /users](https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
    .requiredOption(`--userId <userId>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `User password hashed using MD5.`)
    .option(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(usersCreateMD5User))

users
    .command(`createPHPassUser`)
    .description(`Create a new user. Password provided must be hashed with the [PHPass](https://www.openwall.com/phpass/) algorithm. Use the [POST /users](https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
    .requiredOption(`--userId <userId>`, `User ID. Choose a custom ID or pass the string 'ID.unique()'to auto generate it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `User password hashed using PHPass.`)
    .option(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(usersCreatePHPassUser))

users
    .command(`createScryptUser`)
    .description(`Create a new user. Password provided must be hashed with the [Scrypt](https://github.com/Tarsnap/scrypt) algorithm. Use the [POST /users](https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
    .requiredOption(`--userId <userId>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `User password hashed using Scrypt.`)
    .requiredOption(`--passwordSalt <passwordSalt>`, `Optional salt used to hash password.`)
    .requiredOption(`--passwordCpu <passwordCpu>`, `Optional CPU cost used to hash password.`, parseInteger)
    .requiredOption(`--passwordMemory <passwordMemory>`, `Optional memory cost used to hash password.`, parseInteger)
    .requiredOption(`--passwordParallel <passwordParallel>`, `Optional parallelization cost used to hash password.`, parseInteger)
    .requiredOption(`--passwordLength <passwordLength>`, `Optional hash length used to hash password.`, parseInteger)
    .option(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(usersCreateScryptUser))

users
    .command(`createScryptModifiedUser`)
    .description(`Create a new user. Password provided must be hashed with the [Scrypt Modified](https://gist.github.com/Meldiron/eecf84a0225eccb5a378d45bb27462cc) algorithm. Use the [POST /users](https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
    .requiredOption(`--userId <userId>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `User password hashed using Scrypt Modified.`)
    .requiredOption(`--passwordSalt <passwordSalt>`, `Salt used to hash password.`)
    .requiredOption(`--passwordSaltSeparator <passwordSaltSeparator>`, `Salt separator used to hash password.`)
    .requiredOption(`--passwordSignerKey <passwordSignerKey>`, `Signer key used to hash password.`)
    .option(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(usersCreateScryptModifiedUser))

users
    .command(`createSHAUser`)
    .description(`Create a new user. Password provided must be hashed with the [SHA](https://en.wikipedia.org/wiki/Secure_Hash_Algorithm) algorithm. Use the [POST /users](https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
    .requiredOption(`--userId <userId>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `User password hashed using SHA.`)
    .option(`--passwordVersion <passwordVersion>`, `Optional SHA version used to hash password. Allowed values are: 'sha1', 'sha224', 'sha256', 'sha384', 'sha512/224', 'sha512/256', 'sha512', 'sha3-224', 'sha3-256', 'sha3-384', 'sha3-512'`)
    .option(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(usersCreateSHAUser))

users
    .command(`getUsage`)
    .description(``)
    .option(`--range <range>`, `Date range.`)
    .action(actionRunner(usersGetUsage))

users
    .command(`get`)
    .description(`Get a user by its unique ID.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .action(actionRunner(usersGet))

users
    .command(`delete`)
    .description(`Delete a user by its unique ID, thereby releasing it's ID. Since ID is released and can be reused, all user-related resources like documents or storage files should be deleted before user deletion. If you want to keep ID reserved, use the [updateStatus](https://appwrite.io/docs/server/users#usersUpdateStatus) endpoint instead.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .action(actionRunner(usersDelete))

users
    .command(`updateEmail`)
    .description(`Update the user email by its unique ID.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--email <email>`, `User email.`)
    .action(actionRunner(usersUpdateEmail))

users
    .command(`updateLabels`)
    .description(`Update the user labels by its unique ID.   Labels can be used to grant access to resources. While teams are a way for user's to share access to a resource, labels can be defined by the developer to grant access without an invitation. See the [Permissions docs](https://appwrite.io/docs/permissions) for more info.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--labels [labels...]`, `Array of user labels. Replaces the previous labels. Maximum of 1000 labels are allowed, each up to 36 alphanumeric characters long.`)
    .action(actionRunner(usersUpdateLabels))

users
    .command(`listLogs`)
    .description(`Get the user activity logs list by its unique ID.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(usersListLogs))

users
    .command(`listMemberships`)
    .description(`Get the user membership list by its unique ID.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .action(actionRunner(usersListMemberships))

users
    .command(`updateMfa`)
    .description(`Enable or disable MFA on a user account.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--mfa <mfa>`, `Enable or disable MFA.`, parseBool)
    .action(actionRunner(usersUpdateMfa))

users
    .command(`deleteMfaAuthenticator`)
    .description(`Delete an authenticator app.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--type <type>`, `Type of authenticator.`)
    .action(actionRunner(usersDeleteMfaAuthenticator))

users
    .command(`listMfaFactors`)
    .description(`List the factors available on the account to be used as a MFA challange.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .action(actionRunner(usersListMfaFactors))

users
    .command(`getMfaRecoveryCodes`)
    .description(`Get recovery codes that can be used as backup for MFA flow by User ID. Before getting codes, they must be generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .action(actionRunner(usersGetMfaRecoveryCodes))

users
    .command(`updateMfaRecoveryCodes`)
    .description(`Regenerate recovery codes that can be used as backup for MFA flow by User ID. Before regenerating codes, they must be first generated using [createMfaRecoveryCodes](/docs/references/cloud/client-web/account#createMfaRecoveryCodes) method.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .action(actionRunner(usersUpdateMfaRecoveryCodes))

users
    .command(`createMfaRecoveryCodes`)
    .description(`Generate recovery codes used as backup for MFA flow for User ID. Recovery codes can be used as a MFA verification type in [createMfaChallenge](/docs/references/cloud/client-web/account#createMfaChallenge) method by client SDK.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .action(actionRunner(usersCreateMfaRecoveryCodes))

users
    .command(`updateName`)
    .description(`Update the user name by its unique ID.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(usersUpdateName))

users
    .command(`updatePassword`)
    .description(`Update the user password by its unique ID.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--password <password>`, `New user password. Must be at least 8 chars.`)
    .action(actionRunner(usersUpdatePassword))

users
    .command(`updatePhone`)
    .description(`Update the user phone by its unique ID.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--number <number>`, `User phone number.`)
    .action(actionRunner(usersUpdatePhone))

users
    .command(`getPrefs`)
    .description(`Get the user preferences by its unique ID.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .action(actionRunner(usersGetPrefs))

users
    .command(`updatePrefs`)
    .description(`Update the user preferences by its unique ID. The object you pass is stored as is, and replaces any previous value. The maximum allowed prefs size is 64kB and throws error if exceeded.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--prefs <prefs>`, `Prefs key-value JSON object.`)
    .action(actionRunner(usersUpdatePrefs))

users
    .command(`listSessions`)
    .description(`Get the user sessions list by its unique ID.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .action(actionRunner(usersListSessions))

users
    .command(`createSession`)
    .description(`Creates a session for a user. Returns an immediately usable session object.  If you want to generate a token for a custom authentication flow, use the [POST /users/{userId}/tokens](https://appwrite.io/docs/server/users#createToken) endpoint.`)
    .requiredOption(`--userId <userId>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .action(actionRunner(usersCreateSession))

users
    .command(`deleteSessions`)
    .description(`Delete all user's sessions by using the user's unique ID.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .action(actionRunner(usersDeleteSessions))

users
    .command(`deleteSession`)
    .description(`Delete a user sessions by its unique ID.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--sessionId <sessionId>`, `Session ID.`)
    .action(actionRunner(usersDeleteSession))

users
    .command(`updateStatus`)
    .description(`Update the user status by its unique ID. Use this endpoint as an alternative to deleting a user if you want to keep user's ID reserved.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--status <status>`, `User Status. To activate the user pass 'true' and to block the user pass 'false'.`, parseBool)
    .action(actionRunner(usersUpdateStatus))

users
    .command(`listTargets`)
    .description(`List the messaging targets that are associated with a user.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, email, phone, status, passwordUpdate, registration, emailVerification, phoneVerification, labels`)
    .action(actionRunner(usersListTargets))

users
    .command(`createTarget`)
    .description(`Create a messaging target.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--targetId <targetId>`, `Target ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--providerType <providerType>`, `The target provider type. Can be one of the following: 'email', 'sms' or 'push'.`)
    .requiredOption(`--identifier <identifier>`, `The target identifier (token, email, phone etc.)`)
    .option(`--providerId <providerId>`, `Provider ID. Message will be sent to this target from the specified provider ID. If no provider ID is set the first setup provider will be used.`)
    .option(`--name <name>`, `Target name. Max length: 128 chars. For example: My Awesome App Galaxy S23.`)
    .action(actionRunner(usersCreateTarget))

users
    .command(`getTarget`)
    .description(`Get a user's push notification target by ID.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--targetId <targetId>`, `Target ID.`)
    .action(actionRunner(usersGetTarget))

users
    .command(`updateTarget`)
    .description(`Update a messaging target.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--targetId <targetId>`, `Target ID.`)
    .option(`--identifier <identifier>`, `The target identifier (token, email, phone etc.)`)
    .option(`--providerId <providerId>`, `Provider ID. Message will be sent to this target from the specified provider ID. If no provider ID is set the first setup provider will be used.`)
    .option(`--name <name>`, `Target name. Max length: 128 chars. For example: My Awesome App Galaxy S23.`)
    .action(actionRunner(usersUpdateTarget))

users
    .command(`deleteTarget`)
    .description(`Delete a messaging target.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--targetId <targetId>`, `Target ID.`)
    .action(actionRunner(usersDeleteTarget))

users
    .command(`createToken`)
    .description(`Returns a token with a secret key for creating a session. If the provided user ID has not be registered, a new user will be created. Use the returned user ID and secret and submit a request to the [PUT /account/sessions/custom](https://appwrite.io/docs/references/cloud/client-web/account#updateCustomSession) endpoint to complete the login process.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .option(`--length <length>`, `Token length in characters. The default length is 6 characters`, parseInteger)
    .option(`--expire <expire>`, `Token expiration period in seconds. The default expiration is 15 minutes.`, parseInteger)
    .action(actionRunner(usersCreateToken))

users
    .command(`updateEmailVerification`)
    .description(`Update the user email verification status by its unique ID.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--emailVerification <emailVerification>`, `User email verification status.`, parseBool)
    .action(actionRunner(usersUpdateEmailVerification))

users
    .command(`updatePhoneVerification`)
    .description(`Update the user phone verification status by its unique ID.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--phoneVerification <phoneVerification>`, `User phone verification status.`, parseBool)
    .action(actionRunner(usersUpdatePhoneVerification))

module.exports = {
    users,
    usersList,
    usersCreate,
    usersCreateArgon2User,
    usersCreateBcryptUser,
    usersListIdentities,
    usersDeleteIdentity,
    usersCreateMD5User,
    usersCreatePHPassUser,
    usersCreateScryptUser,
    usersCreateScryptModifiedUser,
    usersCreateSHAUser,
    usersGetUsage,
    usersGet,
    usersDelete,
    usersUpdateEmail,
    usersUpdateLabels,
    usersListLogs,
    usersListMemberships,
    usersUpdateMfa,
    usersDeleteMfaAuthenticator,
    usersListMfaFactors,
    usersGetMfaRecoveryCodes,
    usersUpdateMfaRecoveryCodes,
    usersCreateMfaRecoveryCodes,
    usersUpdateName,
    usersUpdatePassword,
    usersUpdatePhone,
    usersGetPrefs,
    usersUpdatePrefs,
    usersListSessions,
    usersCreateSession,
    usersDeleteSessions,
    usersDeleteSession,
    usersUpdateStatus,
    usersListTargets,
    usersCreateTarget,
    usersGetTarget,
    usersUpdateTarget,
    usersDeleteTarget,
    usersCreateToken,
    usersUpdateEmailVerification,
    usersUpdatePhoneVerification
};