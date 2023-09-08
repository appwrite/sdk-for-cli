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

const users = new Command("users").description(commandDescriptions['users']).configureHelp({
    helpWidth: process.stdout.columns || 80
  })

const usersList = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users';
    let payload = {};

    /** Query Params */
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

const usersCreate = async ({ userId, email, phone, password, name, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} email */
    /* @param {string} phone */
    /* @param {string} password */
    /* @param {string} name */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users';
    let payload = {};
    
    /** Body Params */

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

const usersCreateArgon2User = async ({ userId, email, password, name, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} email */
    /* @param {string} password */
    /* @param {string} name */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/argon2';
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

const usersCreateBcryptUser = async ({ userId, email, password, name, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} email */
    /* @param {string} password */
    /* @param {string} name */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/bcrypt';
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

const usersListIdentities = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/identities';
    let payload = {};

    /** Query Params */
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

const usersDeleteIdentity = async ({ identityId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} identityId */

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

const usersCreateMD5User = async ({ userId, email, password, name, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} email */
    /* @param {string} password */
    /* @param {string} name */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/md5';
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

const usersCreatePHPassUser = async ({ userId, email, password, name, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} email */
    /* @param {string} password */
    /* @param {string} name */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/phpass';
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

const usersCreateScryptUser = async ({ userId, email, password, passwordSalt, passwordCpu, passwordMemory, passwordParallel, passwordLength, name, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} email */
    /* @param {string} password */
    /* @param {string} passwordSalt */
    /* @param {number} passwordCpu */
    /* @param {number} passwordMemory */
    /* @param {number} passwordParallel */
    /* @param {number} passwordLength */
    /* @param {string} name */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/scrypt';
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

const usersCreateScryptModifiedUser = async ({ userId, email, password, passwordSalt, passwordSaltSeparator, passwordSignerKey, name, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} email */
    /* @param {string} password */
    /* @param {string} passwordSalt */
    /* @param {string} passwordSaltSeparator */
    /* @param {string} passwordSignerKey */
    /* @param {string} name */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/scrypt-modified';
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

const usersCreateSHAUser = async ({ userId, email, password, passwordVersion, name, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} email */
    /* @param {string} password */
    /* @param {string} passwordVersion */
    /* @param {string} name */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/sha';
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

const usersGetUsage = async ({ range, provider, parseOutput = true, sdk = undefined}) => {
    /* @param {string} range */
    /* @param {string} provider */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/usage';
    let payload = {};

    /** Query Params */
    if (typeof range !== 'undefined') {
        payload['range'] = range;
    }
    if (typeof provider !== 'undefined') {
        payload['provider'] = provider;
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

const usersGet = async ({ userId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */

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

const usersDelete = async ({ userId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */

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

const usersUpdateEmail = async ({ userId, email, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} email */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/email'.replace('{userId}', userId);
    let payload = {};
    
    /** Body Params */

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

const usersUpdateLabels = async ({ userId, labels, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string[]} labels */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/labels'.replace('{userId}', userId);
    let payload = {};
    
    /** Body Params */
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

const usersListLogs = async ({ userId, queries, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string[]} queries */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/logs'.replace('{userId}', userId);
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

const usersListMemberships = async ({ userId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */

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

const usersUpdateName = async ({ userId, name, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} name */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/name'.replace('{userId}', userId);
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

const usersUpdatePassword = async ({ userId, password, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} password */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/password'.replace('{userId}', userId);
    let payload = {};
    
    /** Body Params */

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

const usersUpdatePhone = async ({ userId, number, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} number */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/phone'.replace('{userId}', userId);
    let payload = {};
    
    /** Body Params */

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

const usersGetPrefs = async ({ userId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */

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

const usersUpdatePrefs = async ({ userId, prefs, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {object} prefs */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/prefs'.replace('{userId}', userId);
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

const usersListSessions = async ({ userId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */

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

const usersDeleteSessions = async ({ userId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */

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

const usersDeleteSession = async ({ userId, sessionId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {string} sessionId */

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

const usersUpdateStatus = async ({ userId, status, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {boolean} status */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/status'.replace('{userId}', userId);
    let payload = {};
    
    /** Body Params */

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

const usersUpdateEmailVerification = async ({ userId, emailVerification, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {boolean} emailVerification */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/verification'.replace('{userId}', userId);
    let payload = {};
    
    /** Body Params */

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

const usersUpdatePhoneVerification = async ({ userId, phoneVerification, parseOutput = true, sdk = undefined}) => {
    /* @param {string} userId */
    /* @param {boolean} phoneVerification */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/users/{userId}/verification/phone'.replace('{userId}', userId);
    let payload = {};
    
    /** Body Params */

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
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, email, phone, status, passwordUpdate, registration, emailVerification, phoneVerification`)
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
    .description(`Create a new user. Password provided must be hashed with the [Argon2](https://en.wikipedia.org/wiki/Argon2) algorithm. Use the [POST /users](/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
    .requiredOption(`--userId <userId>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `User password hashed using Argon2.`)
    .option(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(usersCreateArgon2User))

users
    .command(`createBcryptUser`)
    .description(`Create a new user. Password provided must be hashed with the [Bcrypt](https://en.wikipedia.org/wiki/Bcrypt) algorithm. Use the [POST /users](/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
    .requiredOption(`--userId <userId>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `User password hashed using Bcrypt.`)
    .option(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(usersCreateBcryptUser))

users
    .command(`listIdentities`)
    .description(`Get identities for all users.`)
    .option(`--queries <queries>`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, provider, providerUid, providerEmail, providerAccessTokenExpiry`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(usersListIdentities))

users
    .command(`deleteIdentity`)
    .description(`Delete an identity by its unique ID.`)
    .requiredOption(`--identityId <identityId>`, `Identity ID.`)
    .action(actionRunner(usersDeleteIdentity))

users
    .command(`createMD5User`)
    .description(`Create a new user. Password provided must be hashed with the [MD5](https://en.wikipedia.org/wiki/MD5) algorithm. Use the [POST /users](/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
    .requiredOption(`--userId <userId>`, `User ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `User password hashed using MD5.`)
    .option(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(usersCreateMD5User))

users
    .command(`createPHPassUser`)
    .description(`Create a new user. Password provided must be hashed with the [PHPass](https://www.openwall.com/phpass/) algorithm. Use the [POST /users](/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
    .requiredOption(`--userId <userId>`, `User ID. Choose a custom ID or pass the string 'ID.unique()'to auto generate it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--email <email>`, `User email.`)
    .requiredOption(`--password <password>`, `User password hashed using PHPass.`)
    .option(`--name <name>`, `User name. Max length: 128 chars.`)
    .action(actionRunner(usersCreatePHPassUser))

users
    .command(`createScryptUser`)
    .description(`Create a new user. Password provided must be hashed with the [Scrypt](https://github.com/Tarsnap/scrypt) algorithm. Use the [POST /users](/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
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
    .description(`Create a new user. Password provided must be hashed with the [Scrypt Modified](https://gist.github.com/Meldiron/eecf84a0225eccb5a378d45bb27462cc) algorithm. Use the [POST /users](/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
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
    .description(`Create a new user. Password provided must be hashed with the [SHA](https://en.wikipedia.org/wiki/Secure_Hash_Algorithm) algorithm. Use the [POST /users](/docs/server/users#usersCreate) endpoint to create users with a plain text password.`)
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
    .option(`--provider <provider>`, `Provider Name.`)
    .action(actionRunner(usersGetUsage))

users
    .command(`get`)
    .description(`Get a user by its unique ID.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .action(actionRunner(usersGet))

users
    .command(`delete`)
    .description(`Delete a user by its unique ID, thereby releasing it's ID. Since ID is released and can be reused, all user-related resources like documents or storage files should be deleted before user deletion. If you want to keep ID reserved, use the [updateStatus](/docs/server/users#usersUpdateStatus) endpoint instead.`)
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
    .description(`Update the user labels by its unique ID.   Labels can be used to grant access to resources. While teams are a way for user's to share access to a resource, labels can be defined by the developer to grant access without an invitation. See the [Permissions docs](/docs/permissions) for more info.`)
    .requiredOption(`--userId <userId>`, `User ID.`)
    .requiredOption(`--labels [labels...]`, `Array of user labels. Replaces the previous labels. Maximum of 100 labels are allowed, each up to 36 alphanumeric characters long.`)
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
    usersUpdateName,
    usersUpdatePassword,
    usersUpdatePhone,
    usersGetPrefs,
    usersUpdatePrefs,
    usersListSessions,
    usersDeleteSessions,
    usersDeleteSession,
    usersUpdateStatus,
    usersUpdateEmailVerification,
    usersUpdatePhoneVerification
};
