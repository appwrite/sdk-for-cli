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

const messaging = new Command("messaging").description(commandDescriptions['messaging']).configureHelp({
    helpWidth: process.stdout.columns || 80
  })

const messagingListMessages = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/messages';
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

const messagingCreateEmail = async ({ messageId, subject, content, topics, users, targets, cc, bcc, status, html, scheduledAt, parseOutput = true, sdk = undefined}) => {
    /* @param {string} messageId */
    /* @param {string} subject */
    /* @param {string} content */
    /* @param {string[]} topics */
    /* @param {string[]} users */
    /* @param {string[]} targets */
    /* @param {string[]} cc */
    /* @param {string[]} bcc */
    /* @param {MessageType} status */
    /* @param {boolean} html */
    /* @param {string} scheduledAt */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/messages/email';
    let payload = {};
    
    /** Body Params */

    if (typeof messageId !== 'undefined') {
        payload['messageId'] = messageId;
    }


    if (typeof subject !== 'undefined') {
        payload['subject'] = subject;
    }


    if (typeof content !== 'undefined') {
        payload['content'] = content;
    }

    topics = topics === true ? [] : topics;

    if (typeof topics !== 'undefined') {
        payload['topics'] = topics;
    }

    users = users === true ? [] : users;

    if (typeof users !== 'undefined') {
        payload['users'] = users;
    }

    targets = targets === true ? [] : targets;

    if (typeof targets !== 'undefined') {
        payload['targets'] = targets;
    }

    cc = cc === true ? [] : cc;

    if (typeof cc !== 'undefined') {
        payload['cc'] = cc;
    }

    bcc = bcc === true ? [] : bcc;

    if (typeof bcc !== 'undefined') {
        payload['bcc'] = bcc;
    }


    if (typeof status !== 'undefined') {
        payload['status'] = status;
    }


    if (typeof html !== 'undefined') {
        payload['html'] = html;
    }


    if (typeof scheduledAt !== 'undefined') {
        payload['scheduledAt'] = scheduledAt;
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

const messagingUpdateEmail = async ({ messageId, topics, users, targets, subject, content, status, html, cc, bcc, scheduledAt, parseOutput = true, sdk = undefined}) => {
    /* @param {string} messageId */
    /* @param {string[]} topics */
    /* @param {string[]} users */
    /* @param {string[]} targets */
    /* @param {string} subject */
    /* @param {string} content */
    /* @param {MessageType} status */
    /* @param {boolean} html */
    /* @param {string[]} cc */
    /* @param {string[]} bcc */
    /* @param {string} scheduledAt */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/messages/email/{messageId}'.replace('{messageId}', messageId);
    let payload = {};
    
    /** Body Params */
    topics = topics === true ? [] : topics;

    if (typeof topics !== 'undefined') {
        payload['topics'] = topics;
    }

    users = users === true ? [] : users;

    if (typeof users !== 'undefined') {
        payload['users'] = users;
    }

    targets = targets === true ? [] : targets;

    if (typeof targets !== 'undefined') {
        payload['targets'] = targets;
    }


    if (typeof subject !== 'undefined') {
        payload['subject'] = subject;
    }


    if (typeof content !== 'undefined') {
        payload['content'] = content;
    }


    if (typeof status !== 'undefined') {
        payload['status'] = status;
    }


    if (typeof html !== 'undefined') {
        payload['html'] = html;
    }

    cc = cc === true ? [] : cc;

    if (typeof cc !== 'undefined') {
        payload['cc'] = cc;
    }

    bcc = bcc === true ? [] : bcc;

    if (typeof bcc !== 'undefined') {
        payload['bcc'] = bcc;
    }


    if (typeof scheduledAt !== 'undefined') {
        payload['scheduledAt'] = scheduledAt;
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

const messagingCreatePush = async ({ messageId, title, body, topics, users, targets, data, action, icon, sound, color, tag, badge, status, scheduledAt, parseOutput = true, sdk = undefined}) => {
    /* @param {string} messageId */
    /* @param {string} title */
    /* @param {string} body */
    /* @param {string[]} topics */
    /* @param {string[]} users */
    /* @param {string[]} targets */
    /* @param {object} data */
    /* @param {string} action */
    /* @param {string} icon */
    /* @param {string} sound */
    /* @param {string} color */
    /* @param {string} tag */
    /* @param {string} badge */
    /* @param {MessageType} status */
    /* @param {string} scheduledAt */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/messages/push';
    let payload = {};
    
    /** Body Params */

    if (typeof messageId !== 'undefined') {
        payload['messageId'] = messageId;
    }


    if (typeof title !== 'undefined') {
        payload['title'] = title;
    }


    if (typeof body !== 'undefined') {
        payload['body'] = body;
    }

    topics = topics === true ? [] : topics;

    if (typeof topics !== 'undefined') {
        payload['topics'] = topics;
    }

    users = users === true ? [] : users;

    if (typeof users !== 'undefined') {
        payload['users'] = users;
    }

    targets = targets === true ? [] : targets;

    if (typeof targets !== 'undefined') {
        payload['targets'] = targets;
    }

    if (typeof data !== 'undefined') {
        payload['data'] = JSON.parse(data);
    }


    if (typeof action !== 'undefined') {
        payload['action'] = action;
    }


    if (typeof icon !== 'undefined') {
        payload['icon'] = icon;
    }


    if (typeof sound !== 'undefined') {
        payload['sound'] = sound;
    }


    if (typeof color !== 'undefined') {
        payload['color'] = color;
    }


    if (typeof tag !== 'undefined') {
        payload['tag'] = tag;
    }


    if (typeof badge !== 'undefined') {
        payload['badge'] = badge;
    }


    if (typeof status !== 'undefined') {
        payload['status'] = status;
    }


    if (typeof scheduledAt !== 'undefined') {
        payload['scheduledAt'] = scheduledAt;
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

const messagingUpdatePush = async ({ messageId, topics, users, targets, title, body, data, action, icon, sound, color, tag, badge, status, scheduledAt, parseOutput = true, sdk = undefined}) => {
    /* @param {string} messageId */
    /* @param {string[]} topics */
    /* @param {string[]} users */
    /* @param {string[]} targets */
    /* @param {string} title */
    /* @param {string} body */
    /* @param {object} data */
    /* @param {string} action */
    /* @param {string} icon */
    /* @param {string} sound */
    /* @param {string} color */
    /* @param {string} tag */
    /* @param {number} badge */
    /* @param {MessageType} status */
    /* @param {string} scheduledAt */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/messages/push/{messageId}'.replace('{messageId}', messageId);
    let payload = {};
    
    /** Body Params */
    topics = topics === true ? [] : topics;

    if (typeof topics !== 'undefined') {
        payload['topics'] = topics;
    }

    users = users === true ? [] : users;

    if (typeof users !== 'undefined') {
        payload['users'] = users;
    }

    targets = targets === true ? [] : targets;

    if (typeof targets !== 'undefined') {
        payload['targets'] = targets;
    }


    if (typeof title !== 'undefined') {
        payload['title'] = title;
    }


    if (typeof body !== 'undefined') {
        payload['body'] = body;
    }

    if (typeof data !== 'undefined') {
        payload['data'] = JSON.parse(data);
    }


    if (typeof action !== 'undefined') {
        payload['action'] = action;
    }


    if (typeof icon !== 'undefined') {
        payload['icon'] = icon;
    }


    if (typeof sound !== 'undefined') {
        payload['sound'] = sound;
    }


    if (typeof color !== 'undefined') {
        payload['color'] = color;
    }


    if (typeof tag !== 'undefined') {
        payload['tag'] = tag;
    }


    if (typeof badge !== 'undefined') {
        payload['badge'] = badge;
    }


    if (typeof status !== 'undefined') {
        payload['status'] = status;
    }


    if (typeof scheduledAt !== 'undefined') {
        payload['scheduledAt'] = scheduledAt;
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

const messagingCreateSMS = async ({ messageId, content, topics, users, targets, status, scheduledAt, parseOutput = true, sdk = undefined}) => {
    /* @param {string} messageId */
    /* @param {string} content */
    /* @param {string[]} topics */
    /* @param {string[]} users */
    /* @param {string[]} targets */
    /* @param {MessageType} status */
    /* @param {string} scheduledAt */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/messages/sms';
    let payload = {};
    
    /** Body Params */

    if (typeof messageId !== 'undefined') {
        payload['messageId'] = messageId;
    }


    if (typeof content !== 'undefined') {
        payload['content'] = content;
    }

    topics = topics === true ? [] : topics;

    if (typeof topics !== 'undefined') {
        payload['topics'] = topics;
    }

    users = users === true ? [] : users;

    if (typeof users !== 'undefined') {
        payload['users'] = users;
    }

    targets = targets === true ? [] : targets;

    if (typeof targets !== 'undefined') {
        payload['targets'] = targets;
    }


    if (typeof status !== 'undefined') {
        payload['status'] = status;
    }


    if (typeof scheduledAt !== 'undefined') {
        payload['scheduledAt'] = scheduledAt;
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

const messagingUpdateSMS = async ({ messageId, topics, users, targets, content, status, scheduledAt, parseOutput = true, sdk = undefined}) => {
    /* @param {string} messageId */
    /* @param {string[]} topics */
    /* @param {string[]} users */
    /* @param {string[]} targets */
    /* @param {string} content */
    /* @param {MessageType} status */
    /* @param {string} scheduledAt */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/messages/sms/{messageId}'.replace('{messageId}', messageId);
    let payload = {};
    
    /** Body Params */
    topics = topics === true ? [] : topics;

    if (typeof topics !== 'undefined') {
        payload['topics'] = topics;
    }

    users = users === true ? [] : users;

    if (typeof users !== 'undefined') {
        payload['users'] = users;
    }

    targets = targets === true ? [] : targets;

    if (typeof targets !== 'undefined') {
        payload['targets'] = targets;
    }


    if (typeof content !== 'undefined') {
        payload['content'] = content;
    }


    if (typeof status !== 'undefined') {
        payload['status'] = status;
    }


    if (typeof scheduledAt !== 'undefined') {
        payload['scheduledAt'] = scheduledAt;
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

const messagingGetMessage = async ({ messageId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} messageId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/messages/{messageId}'.replace('{messageId}', messageId);
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

const messagingDelete = async ({ messageId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} messageId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/messages/{messageId}'.replace('{messageId}', messageId);
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

const messagingListMessageLogs = async ({ messageId, queries, parseOutput = true, sdk = undefined}) => {
    /* @param {string} messageId */
    /* @param {string[]} queries */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/messages/{messageId}/logs'.replace('{messageId}', messageId);
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

const messagingListTargets = async ({ messageId, queries, parseOutput = true, sdk = undefined}) => {
    /* @param {string} messageId */
    /* @param {string[]} queries */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/messages/{messageId}/targets'.replace('{messageId}', messageId);
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

const messagingListProviders = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers';
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

const messagingCreateAPNSProvider = async ({ providerId, name, authKey, authKeyId, teamId, bundleId, enabled, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {string} authKey */
    /* @param {string} authKeyId */
    /* @param {string} teamId */
    /* @param {string} bundleId */
    /* @param {boolean} enabled */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/apns';
    let payload = {};
    
    /** Body Params */

    if (typeof providerId !== 'undefined') {
        payload['providerId'] = providerId;
    }


    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof authKey !== 'undefined') {
        payload['authKey'] = authKey;
    }


    if (typeof authKeyId !== 'undefined') {
        payload['authKeyId'] = authKeyId;
    }


    if (typeof teamId !== 'undefined') {
        payload['teamId'] = teamId;
    }


    if (typeof bundleId !== 'undefined') {
        payload['bundleId'] = bundleId;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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

const messagingUpdateAPNSProvider = async ({ providerId, name, enabled, authKey, authKeyId, teamId, bundleId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {boolean} enabled */
    /* @param {string} authKey */
    /* @param {string} authKeyId */
    /* @param {string} teamId */
    /* @param {string} bundleId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/apns/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
    
    /** Body Params */

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }


    if (typeof authKey !== 'undefined') {
        payload['authKey'] = authKey;
    }


    if (typeof authKeyId !== 'undefined') {
        payload['authKeyId'] = authKeyId;
    }


    if (typeof teamId !== 'undefined') {
        payload['teamId'] = teamId;
    }


    if (typeof bundleId !== 'undefined') {
        payload['bundleId'] = bundleId;
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

const messagingCreateFCMProvider = async ({ providerId, name, serviceAccountJSON, enabled, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {object} serviceAccountJSON */
    /* @param {boolean} enabled */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/fcm';
    let payload = {};
    
    /** Body Params */

    if (typeof providerId !== 'undefined') {
        payload['providerId'] = providerId;
    }


    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }

    if (typeof serviceAccountJSON !== 'undefined') {
        payload['serviceAccountJSON'] = JSON.parse(serviceAccountJSON);
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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

const messagingUpdateFCMProvider = async ({ providerId, name, enabled, serviceAccountJSON, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {boolean} enabled */
    /* @param {object} serviceAccountJSON */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/fcm/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
    
    /** Body Params */

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }

    if (typeof serviceAccountJSON !== 'undefined') {
        payload['serviceAccountJSON'] = JSON.parse(serviceAccountJSON);
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

const messagingCreateMailgunProvider = async ({ providerId, name, apiKey, domain, isEuRegion, fromName, fromEmail, replyToName, replyToEmail, enabled, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {string} apiKey */
    /* @param {string} domain */
    /* @param {boolean} isEuRegion */
    /* @param {string} fromName */
    /* @param {string} fromEmail */
    /* @param {string} replyToName */
    /* @param {string} replyToEmail */
    /* @param {boolean} enabled */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/mailgun';
    let payload = {};
    
    /** Body Params */

    if (typeof providerId !== 'undefined') {
        payload['providerId'] = providerId;
    }


    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof apiKey !== 'undefined') {
        payload['apiKey'] = apiKey;
    }


    if (typeof domain !== 'undefined') {
        payload['domain'] = domain;
    }


    if (typeof isEuRegion !== 'undefined') {
        payload['isEuRegion'] = isEuRegion;
    }


    if (typeof fromName !== 'undefined') {
        payload['fromName'] = fromName;
    }


    if (typeof fromEmail !== 'undefined') {
        payload['fromEmail'] = fromEmail;
    }


    if (typeof replyToName !== 'undefined') {
        payload['replyToName'] = replyToName;
    }


    if (typeof replyToEmail !== 'undefined') {
        payload['replyToEmail'] = replyToEmail;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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

const messagingUpdateMailgunProvider = async ({ providerId, name, apiKey, domain, isEuRegion, enabled, fromName, fromEmail, replyToName, replyToEmail, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {string} apiKey */
    /* @param {string} domain */
    /* @param {boolean} isEuRegion */
    /* @param {boolean} enabled */
    /* @param {string} fromName */
    /* @param {string} fromEmail */
    /* @param {string} replyToName */
    /* @param {string} replyToEmail */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/mailgun/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
    
    /** Body Params */

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof apiKey !== 'undefined') {
        payload['apiKey'] = apiKey;
    }


    if (typeof domain !== 'undefined') {
        payload['domain'] = domain;
    }


    if (typeof isEuRegion !== 'undefined') {
        payload['isEuRegion'] = isEuRegion;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }


    if (typeof fromName !== 'undefined') {
        payload['fromName'] = fromName;
    }


    if (typeof fromEmail !== 'undefined') {
        payload['fromEmail'] = fromEmail;
    }


    if (typeof replyToName !== 'undefined') {
        payload['replyToName'] = replyToName;
    }


    if (typeof replyToEmail !== 'undefined') {
        payload['replyToEmail'] = replyToEmail;
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

const messagingCreateMsg91Provider = async ({ providerId, name, from, senderId, authKey, enabled, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {string} from */
    /* @param {string} senderId */
    /* @param {string} authKey */
    /* @param {boolean} enabled */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/msg91';
    let payload = {};
    
    /** Body Params */

    if (typeof providerId !== 'undefined') {
        payload['providerId'] = providerId;
    }


    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof from !== 'undefined') {
        payload['from'] = from;
    }


    if (typeof senderId !== 'undefined') {
        payload['senderId'] = senderId;
    }


    if (typeof authKey !== 'undefined') {
        payload['authKey'] = authKey;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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

const messagingUpdateMsg91Provider = async ({ providerId, name, enabled, senderId, authKey, from, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {boolean} enabled */
    /* @param {string} senderId */
    /* @param {string} authKey */
    /* @param {string} from */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/msg91/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
    
    /** Body Params */

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }


    if (typeof senderId !== 'undefined') {
        payload['senderId'] = senderId;
    }


    if (typeof authKey !== 'undefined') {
        payload['authKey'] = authKey;
    }


    if (typeof from !== 'undefined') {
        payload['from'] = from;
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

const messagingCreateSendgridProvider = async ({ providerId, name, apiKey, fromName, fromEmail, replyToName, replyToEmail, enabled, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {string} apiKey */
    /* @param {string} fromName */
    /* @param {string} fromEmail */
    /* @param {string} replyToName */
    /* @param {string} replyToEmail */
    /* @param {boolean} enabled */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/sendgrid';
    let payload = {};
    
    /** Body Params */

    if (typeof providerId !== 'undefined') {
        payload['providerId'] = providerId;
    }


    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof apiKey !== 'undefined') {
        payload['apiKey'] = apiKey;
    }


    if (typeof fromName !== 'undefined') {
        payload['fromName'] = fromName;
    }


    if (typeof fromEmail !== 'undefined') {
        payload['fromEmail'] = fromEmail;
    }


    if (typeof replyToName !== 'undefined') {
        payload['replyToName'] = replyToName;
    }


    if (typeof replyToEmail !== 'undefined') {
        payload['replyToEmail'] = replyToEmail;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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

const messagingUpdateSendgridProvider = async ({ providerId, name, enabled, apiKey, fromName, fromEmail, replyToName, replyToEmail, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {boolean} enabled */
    /* @param {string} apiKey */
    /* @param {string} fromName */
    /* @param {string} fromEmail */
    /* @param {string} replyToName */
    /* @param {string} replyToEmail */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/sendgrid/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
    
    /** Body Params */

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }


    if (typeof apiKey !== 'undefined') {
        payload['apiKey'] = apiKey;
    }


    if (typeof fromName !== 'undefined') {
        payload['fromName'] = fromName;
    }


    if (typeof fromEmail !== 'undefined') {
        payload['fromEmail'] = fromEmail;
    }


    if (typeof replyToName !== 'undefined') {
        payload['replyToName'] = replyToName;
    }


    if (typeof replyToEmail !== 'undefined') {
        payload['replyToEmail'] = replyToEmail;
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

const messagingCreateSMTPProvider = async ({ providerId, name, host, port, username, password, encryption, autoTLS, mailer, fromName, fromEmail, replyToName, replyToEmail, enabled, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {string} host */
    /* @param {number} port */
    /* @param {string} username */
    /* @param {string} password */
    /* @param {SMTPEncryption} encryption */
    /* @param {boolean} autoTLS */
    /* @param {string} mailer */
    /* @param {string} fromName */
    /* @param {string} fromEmail */
    /* @param {string} replyToName */
    /* @param {string} replyToEmail */
    /* @param {boolean} enabled */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/smtp';
    let payload = {};
    
    /** Body Params */

    if (typeof providerId !== 'undefined') {
        payload['providerId'] = providerId;
    }


    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof host !== 'undefined') {
        payload['host'] = host;
    }


    if (typeof port !== 'undefined') {
        payload['port'] = port;
    }


    if (typeof username !== 'undefined') {
        payload['username'] = username;
    }


    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }


    if (typeof encryption !== 'undefined') {
        payload['encryption'] = encryption;
    }


    if (typeof autoTLS !== 'undefined') {
        payload['autoTLS'] = autoTLS;
    }


    if (typeof mailer !== 'undefined') {
        payload['mailer'] = mailer;
    }


    if (typeof fromName !== 'undefined') {
        payload['fromName'] = fromName;
    }


    if (typeof fromEmail !== 'undefined') {
        payload['fromEmail'] = fromEmail;
    }


    if (typeof replyToName !== 'undefined') {
        payload['replyToName'] = replyToName;
    }


    if (typeof replyToEmail !== 'undefined') {
        payload['replyToEmail'] = replyToEmail;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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

const messagingUpdateSMTPProvider = async ({ providerId, name, host, port, username, password, encryption, autoTLS, fromName, fromEmail, replyToName, replyToEmail, enabled, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {string} host */
    /* @param {number} port */
    /* @param {string} username */
    /* @param {string} password */
    /* @param {SMTPEncryption} encryption */
    /* @param {boolean} autoTLS */
    /* @param {string} fromName */
    /* @param {string} fromEmail */
    /* @param {string} replyToName */
    /* @param {string} replyToEmail */
    /* @param {boolean} enabled */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/smtp/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
    
    /** Body Params */

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof host !== 'undefined') {
        payload['host'] = host;
    }


    if (typeof port !== 'undefined') {
        payload['port'] = port;
    }


    if (typeof username !== 'undefined') {
        payload['username'] = username;
    }


    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }


    if (typeof encryption !== 'undefined') {
        payload['encryption'] = encryption;
    }


    if (typeof autoTLS !== 'undefined') {
        payload['autoTLS'] = autoTLS;
    }


    if (typeof fromName !== 'undefined') {
        payload['fromName'] = fromName;
    }


    if (typeof fromEmail !== 'undefined') {
        payload['fromEmail'] = fromEmail;
    }


    if (typeof replyToName !== 'undefined') {
        payload['replyToName'] = replyToName;
    }


    if (typeof replyToEmail !== 'undefined') {
        payload['replyToEmail'] = replyToEmail;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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

const messagingCreateTelesignProvider = async ({ providerId, name, from, username, password, enabled, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {string} from */
    /* @param {string} username */
    /* @param {string} password */
    /* @param {boolean} enabled */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/telesign';
    let payload = {};
    
    /** Body Params */

    if (typeof providerId !== 'undefined') {
        payload['providerId'] = providerId;
    }


    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof from !== 'undefined') {
        payload['from'] = from;
    }


    if (typeof username !== 'undefined') {
        payload['username'] = username;
    }


    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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

const messagingUpdateTelesignProvider = async ({ providerId, name, enabled, username, password, from, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {boolean} enabled */
    /* @param {string} username */
    /* @param {string} password */
    /* @param {string} from */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/telesign/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
    
    /** Body Params */

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }


    if (typeof username !== 'undefined') {
        payload['username'] = username;
    }


    if (typeof password !== 'undefined') {
        payload['password'] = password;
    }


    if (typeof from !== 'undefined') {
        payload['from'] = from;
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

const messagingCreateTextmagicProvider = async ({ providerId, name, from, username, apiKey, enabled, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {string} from */
    /* @param {string} username */
    /* @param {string} apiKey */
    /* @param {boolean} enabled */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/textmagic';
    let payload = {};
    
    /** Body Params */

    if (typeof providerId !== 'undefined') {
        payload['providerId'] = providerId;
    }


    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof from !== 'undefined') {
        payload['from'] = from;
    }


    if (typeof username !== 'undefined') {
        payload['username'] = username;
    }


    if (typeof apiKey !== 'undefined') {
        payload['apiKey'] = apiKey;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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

const messagingUpdateTextmagicProvider = async ({ providerId, name, enabled, username, apiKey, from, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {boolean} enabled */
    /* @param {string} username */
    /* @param {string} apiKey */
    /* @param {string} from */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/textmagic/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
    
    /** Body Params */

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }


    if (typeof username !== 'undefined') {
        payload['username'] = username;
    }


    if (typeof apiKey !== 'undefined') {
        payload['apiKey'] = apiKey;
    }


    if (typeof from !== 'undefined') {
        payload['from'] = from;
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

const messagingCreateTwilioProvider = async ({ providerId, name, from, accountSid, authToken, enabled, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {string} from */
    /* @param {string} accountSid */
    /* @param {string} authToken */
    /* @param {boolean} enabled */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/twilio';
    let payload = {};
    
    /** Body Params */

    if (typeof providerId !== 'undefined') {
        payload['providerId'] = providerId;
    }


    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof from !== 'undefined') {
        payload['from'] = from;
    }


    if (typeof accountSid !== 'undefined') {
        payload['accountSid'] = accountSid;
    }


    if (typeof authToken !== 'undefined') {
        payload['authToken'] = authToken;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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

const messagingUpdateTwilioProvider = async ({ providerId, name, enabled, accountSid, authToken, from, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {boolean} enabled */
    /* @param {string} accountSid */
    /* @param {string} authToken */
    /* @param {string} from */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/twilio/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
    
    /** Body Params */

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }


    if (typeof accountSid !== 'undefined') {
        payload['accountSid'] = accountSid;
    }


    if (typeof authToken !== 'undefined') {
        payload['authToken'] = authToken;
    }


    if (typeof from !== 'undefined') {
        payload['from'] = from;
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

const messagingCreateVonageProvider = async ({ providerId, name, from, apiKey, apiSecret, enabled, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {string} from */
    /* @param {string} apiKey */
    /* @param {string} apiSecret */
    /* @param {boolean} enabled */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/vonage';
    let payload = {};
    
    /** Body Params */

    if (typeof providerId !== 'undefined') {
        payload['providerId'] = providerId;
    }


    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof from !== 'undefined') {
        payload['from'] = from;
    }


    if (typeof apiKey !== 'undefined') {
        payload['apiKey'] = apiKey;
    }


    if (typeof apiSecret !== 'undefined') {
        payload['apiSecret'] = apiSecret;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
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

const messagingUpdateVonageProvider = async ({ providerId, name, enabled, apiKey, apiSecret, from, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string} name */
    /* @param {boolean} enabled */
    /* @param {string} apiKey */
    /* @param {string} apiSecret */
    /* @param {string} from */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/vonage/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
    
    /** Body Params */

    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }


    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }


    if (typeof apiKey !== 'undefined') {
        payload['apiKey'] = apiKey;
    }


    if (typeof apiSecret !== 'undefined') {
        payload['apiSecret'] = apiSecret;
    }


    if (typeof from !== 'undefined') {
        payload['from'] = from;
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

const messagingGetProvider = async ({ providerId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/{providerId}'.replace('{providerId}', providerId);
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

const messagingDeleteProvider = async ({ providerId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/{providerId}'.replace('{providerId}', providerId);
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

const messagingListProviderLogs = async ({ providerId, queries, parseOutput = true, sdk = undefined}) => {
    /* @param {string} providerId */
    /* @param {string[]} queries */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/providers/{providerId}/logs'.replace('{providerId}', providerId);
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

const messagingListSubscriberLogs = async ({ subscriberId, queries, parseOutput = true, sdk = undefined}) => {
    /* @param {string} subscriberId */
    /* @param {string[]} queries */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/subscribers/{subscriberId}/logs'.replace('{subscriberId}', subscriberId);
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

const messagingListTopics = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/topics';
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

const messagingCreateTopic = async ({ topicId, name, parseOutput = true, sdk = undefined}) => {
    /* @param {string} topicId */
    /* @param {string} name */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/topics';
    let payload = {};
    
    /** Body Params */

    if (typeof topicId !== 'undefined') {
        payload['topicId'] = topicId;
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

const messagingGetTopic = async ({ topicId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} topicId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/topics/{topicId}'.replace('{topicId}', topicId);
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

const messagingUpdateTopic = async ({ topicId, name, parseOutput = true, sdk = undefined}) => {
    /* @param {string} topicId */
    /* @param {string} name */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/topics/{topicId}'.replace('{topicId}', topicId);
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

const messagingDeleteTopic = async ({ topicId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} topicId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/topics/{topicId}'.replace('{topicId}', topicId);
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

const messagingListTopicLogs = async ({ topicId, queries, parseOutput = true, sdk = undefined}) => {
    /* @param {string} topicId */
    /* @param {string[]} queries */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/topics/{topicId}/logs'.replace('{topicId}', topicId);
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

const messagingListSubscribers = async ({ topicId, queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string} topicId */
    /* @param {string[]} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/topics/{topicId}/subscribers'.replace('{topicId}', topicId);
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

const messagingCreateSubscriber = async ({ topicId, subscriberId, targetId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} topicId */
    /* @param {string} subscriberId */
    /* @param {string} targetId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/topics/{topicId}/subscribers'.replace('{topicId}', topicId);
    let payload = {};
    
    /** Body Params */

    if (typeof subscriberId !== 'undefined') {
        payload['subscriberId'] = subscriberId;
    }


    if (typeof targetId !== 'undefined') {
        payload['targetId'] = targetId;
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

const messagingGetSubscriber = async ({ topicId, subscriberId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} topicId */
    /* @param {string} subscriberId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/topics/{topicId}/subscribers/{subscriberId}'.replace('{topicId}', topicId).replace('{subscriberId}', subscriberId);
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

const messagingDeleteSubscriber = async ({ topicId, subscriberId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} topicId */
    /* @param {string} subscriberId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/messaging/topics/{topicId}/subscribers/{subscriberId}'.replace('{topicId}', topicId).replace('{subscriberId}', subscriberId);
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


messaging
    .command(`listMessages`)
    .description(``)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: scheduledAt, deliveredAt, deliveredTotal, status, description, providerType`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(messagingListMessages))

messaging
    .command(`createEmail`)
    .description(``)
    .requiredOption(`--messageId <messageId>`, `Message ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--subject <subject>`, `Email Subject.`)
    .requiredOption(`--content <content>`, `Email Content.`)
    .option(`--topics [topics...]`, `List of Topic IDs.`)
    .option(`--users [users...]`, `List of User IDs.`)
    .option(`--targets [targets...]`, `List of Targets IDs.`)
    .option(`--cc [cc...]`, `Array of target IDs to be added as CC.`)
    .option(`--bcc [bcc...]`, `Array of target IDs to be added as BCC.`)
    .option(`--status <status>`, `Message Status. Value must be one of: draft, scheduled, processing.`)
    .option(`--html <html>`, `Is content of type HTML`, parseBool)
    .option(`--scheduledAt <scheduledAt>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .action(actionRunner(messagingCreateEmail))

messaging
    .command(`updateEmail`)
    .description(``)
    .requiredOption(`--messageId <messageId>`, `Message ID.`)
    .option(`--topics [topics...]`, `List of Topic IDs.`)
    .option(`--users [users...]`, `List of User IDs.`)
    .option(`--targets [targets...]`, `List of Targets IDs.`)
    .option(`--subject <subject>`, `Email Subject.`)
    .option(`--content <content>`, `Email Content.`)
    .option(`--status <status>`, `Message Status. Value must be one of: draft, scheduled, processing.`)
    .option(`--html <html>`, `Is content of type HTML`, parseBool)
    .option(`--cc [cc...]`, `Array of target IDs to be added as CC.`)
    .option(`--bcc [bcc...]`, `Array of target IDs to be added as BCC.`)
    .option(`--scheduledAt <scheduledAt>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .action(actionRunner(messagingUpdateEmail))

messaging
    .command(`createPush`)
    .description(``)
    .requiredOption(`--messageId <messageId>`, `Message ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--title <title>`, `Title for push notification.`)
    .requiredOption(`--body <body>`, `Body for push notification.`)
    .option(`--topics [topics...]`, `List of Topic IDs.`)
    .option(`--users [users...]`, `List of User IDs.`)
    .option(`--targets [targets...]`, `List of Targets IDs.`)
    .option(`--data <data>`, `Additional Data for push notification.`)
    .option(`--action <action>`, `Action for push notification.`)
    .option(`--icon <icon>`, `Icon for push notification. Available only for Android and Web Platform.`)
    .option(`--sound <sound>`, `Sound for push notification. Available only for Android and IOS Platform.`)
    .option(`--color <color>`, `Color for push notification. Available only for Android Platform.`)
    .option(`--tag <tag>`, `Tag for push notification. Available only for Android Platform.`)
    .option(`--badge <badge>`, `Badge for push notification. Available only for IOS Platform.`)
    .option(`--status <status>`, `Message Status. Value must be one of: draft, scheduled, processing.`)
    .option(`--scheduledAt <scheduledAt>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .action(actionRunner(messagingCreatePush))

messaging
    .command(`updatePush`)
    .description(``)
    .requiredOption(`--messageId <messageId>`, `Message ID.`)
    .option(`--topics [topics...]`, `List of Topic IDs.`)
    .option(`--users [users...]`, `List of User IDs.`)
    .option(`--targets [targets...]`, `List of Targets IDs.`)
    .option(`--title <title>`, `Title for push notification.`)
    .option(`--body <body>`, `Body for push notification.`)
    .option(`--data <data>`, `Additional Data for push notification.`)
    .option(`--action <action>`, `Action for push notification.`)
    .option(`--icon <icon>`, `Icon for push notification. Available only for Android and Web platforms.`)
    .option(`--sound <sound>`, `Sound for push notification. Available only for Android and iOS platforms.`)
    .option(`--color <color>`, `Color for push notification. Available only for Android platforms.`)
    .option(`--tag <tag>`, `Tag for push notification. Available only for Android platforms.`)
    .option(`--badge <badge>`, `Badge for push notification. Available only for iOS platforms.`, parseInteger)
    .option(`--status <status>`, `Message Status. Value must be either draft, cancelled, or processing.`)
    .option(`--scheduledAt <scheduledAt>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .action(actionRunner(messagingUpdatePush))

messaging
    .command(`createSMS`)
    .description(``)
    .requiredOption(`--messageId <messageId>`, `Message ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--content <content>`, `SMS Content.`)
    .option(`--topics [topics...]`, `List of Topic IDs.`)
    .option(`--users [users...]`, `List of User IDs.`)
    .option(`--targets [targets...]`, `List of Targets IDs.`)
    .option(`--status <status>`, `Message Status. Value must be one of: draft, scheduled, processing.`)
    .option(`--scheduledAt <scheduledAt>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .action(actionRunner(messagingCreateSMS))

messaging
    .command(`updateSMS`)
    .description(``)
    .requiredOption(`--messageId <messageId>`, `Message ID.`)
    .option(`--topics [topics...]`, `List of Topic IDs.`)
    .option(`--users [users...]`, `List of User IDs.`)
    .option(`--targets [targets...]`, `List of Targets IDs.`)
    .option(`--content <content>`, `Email Content.`)
    .option(`--status <status>`, `Message Status. Value must be either draft or cancelled or processing.`)
    .option(`--scheduledAt <scheduledAt>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .action(actionRunner(messagingUpdateSMS))

messaging
    .command(`getMessage`)
    .description(``)
    .requiredOption(`--messageId <messageId>`, `Message ID.`)
    .action(actionRunner(messagingGetMessage))

messaging
    .command(`delete`)
    .description(``)
    .requiredOption(`--messageId <messageId>`, `Message ID.`)
    .action(actionRunner(messagingDelete))

messaging
    .command(`listMessageLogs`)
    .description(``)
    .requiredOption(`--messageId <messageId>`, `Message ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(messagingListMessageLogs))

messaging
    .command(`listTargets`)
    .description(`List the targets associated with a message as set via the targets attribute.`)
    .requiredOption(`--messageId <messageId>`, `Message ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, providerId, identifier, providerType`)
    .action(actionRunner(messagingListTargets))

messaging
    .command(`listProviders`)
    .description(``)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, provider, type, enabled`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(messagingListProviders))

messaging
    .command(`createAPNSProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--authKey <authKey>`, `APNS authentication key.`)
    .option(`--authKeyId <authKeyId>`, `APNS authentication key ID.`)
    .option(`--teamId <teamId>`, `APNS team ID.`)
    .option(`--bundleId <bundleId>`, `APNS bundle ID.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateAPNSProvider))

messaging
    .command(`updateAPNSProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--authKey <authKey>`, `APNS authentication key.`)
    .option(`--authKeyId <authKeyId>`, `APNS authentication key ID.`)
    .option(`--teamId <teamId>`, `APNS team ID.`)
    .option(`--bundleId <bundleId>`, `APNS bundle ID.`)
    .action(actionRunner(messagingUpdateAPNSProvider))

messaging
    .command(`createFCMProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--serviceAccountJSON <serviceAccountJSON>`, `FCM service account JSON.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateFCMProvider))

messaging
    .command(`updateFCMProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--serviceAccountJSON <serviceAccountJSON>`, `FCM service account JSON.`)
    .action(actionRunner(messagingUpdateFCMProvider))

messaging
    .command(`createMailgunProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--apiKey <apiKey>`, `Mailgun API Key.`)
    .option(`--domain <domain>`, `Mailgun Domain.`)
    .option(`--isEuRegion <isEuRegion>`, `Set as EU region.`, parseBool)
    .option(`--fromName <fromName>`, `Sender Name.`)
    .option(`--fromEmail <fromEmail>`, `Sender email address.`)
    .option(`--replyToName <replyToName>`, `Name set in the reply to field for the mail. Default value is sender name. Reply to name must have reply to email as well.`)
    .option(`--replyToEmail <replyToEmail>`, `Email set in the reply to field for the mail. Default value is sender email. Reply to email must have reply to name as well.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateMailgunProvider))

messaging
    .command(`updateMailgunProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--apiKey <apiKey>`, `Mailgun API Key.`)
    .option(`--domain <domain>`, `Mailgun Domain.`)
    .option(`--isEuRegion <isEuRegion>`, `Set as EU region.`, parseBool)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--fromName <fromName>`, `Sender Name.`)
    .option(`--fromEmail <fromEmail>`, `Sender email address.`)
    .option(`--replyToName <replyToName>`, `Name set in the reply to field for the mail. Default value is sender name.`)
    .option(`--replyToEmail <replyToEmail>`, `Email set in the reply to field for the mail. Default value is sender email.`)
    .action(actionRunner(messagingUpdateMailgunProvider))

messaging
    .command(`createMsg91Provider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--from <from>`, `Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .option(`--senderId <senderId>`, `Msg91 Sender ID.`)
    .option(`--authKey <authKey>`, `Msg91 Auth Key.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateMsg91Provider))

messaging
    .command(`updateMsg91Provider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--senderId <senderId>`, `Msg91 Sender ID.`)
    .option(`--authKey <authKey>`, `Msg91 Auth Key.`)
    .option(`--from <from>`, `Sender number.`)
    .action(actionRunner(messagingUpdateMsg91Provider))

messaging
    .command(`createSendgridProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--apiKey <apiKey>`, `Sendgrid API key.`)
    .option(`--fromName <fromName>`, `Sender Name.`)
    .option(`--fromEmail <fromEmail>`, `Sender email address.`)
    .option(`--replyToName <replyToName>`, `Name set in the reply to field for the mail. Default value is sender name.`)
    .option(`--replyToEmail <replyToEmail>`, `Email set in the reply to field for the mail. Default value is sender email.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateSendgridProvider))

messaging
    .command(`updateSendgridProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--apiKey <apiKey>`, `Sendgrid API key.`)
    .option(`--fromName <fromName>`, `Sender Name.`)
    .option(`--fromEmail <fromEmail>`, `Sender email address.`)
    .option(`--replyToName <replyToName>`, `Name set in the Reply To field for the mail. Default value is Sender Name.`)
    .option(`--replyToEmail <replyToEmail>`, `Email set in the Reply To field for the mail. Default value is Sender Email.`)
    .action(actionRunner(messagingUpdateSendgridProvider))

messaging
    .command(`createSMTPProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .requiredOption(`--host <host>`, `SMTP hosts. Either a single hostname or multiple semicolon-delimited hostnames. You can also specify a different port for each host by using this format: [hostname:port] (e.g. "smtp1.example.com:25;smtp2.example.com"). You can also specify encryption type, for example: (e.g. "tls://smtp1.example.com:587;ssl://smtp2.example.com:465"). Hosts will be tried in order.`)
    .option(`--port <port>`, `The default SMTP server port.`, parseInteger)
    .option(`--username <username>`, `Authentication username.`)
    .option(`--password <password>`, `Authentication password.`)
    .option(`--encryption <encryption>`, `Encryption type. Can be omitted, 'ssl', or 'tls'`)
    .option(`--autoTLS <autoTLS>`, `Enable SMTP AutoTLS feature.`, parseBool)
    .option(`--mailer <mailer>`, `The value to use for the X-Mailer header.`)
    .option(`--fromName <fromName>`, `Sender Name.`)
    .option(`--fromEmail <fromEmail>`, `Sender email address.`)
    .option(`--replyToName <replyToName>`, `Name set in the reply to field for the mail. Default value is sender name.`)
    .option(`--replyToEmail <replyToEmail>`, `Email set in the reply to field for the mail. Default value is sender email.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateSMTPProvider))

messaging
    .command(`updateSMTPProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--host <host>`, `SMTP hosts. Either a single hostname or multiple semicolon-delimited hostnames. You can also specify a different port for each host by using this format: [hostname:port] (e.g. "smtp1.example.com:25;smtp2.example.com"). You can also specify encryption type, for example: (e.g. "tls://smtp1.example.com:587;ssl://smtp2.example.com:465"). Hosts will be tried in order.`)
    .option(`--port <port>`, `SMTP port.`, parseInteger)
    .option(`--username <username>`, `Authentication username.`)
    .option(`--password <password>`, `Authentication password.`)
    .option(`--encryption <encryption>`, `Encryption type. Can be 'ssl' or 'tls'`)
    .option(`--autoTLS <autoTLS>`, `Enable SMTP AutoTLS feature.`, parseBool)
    .option(`--fromName <fromName>`, `Sender Name.`)
    .option(`--fromEmail <fromEmail>`, `Sender email address.`)
    .option(`--replyToName <replyToName>`, `Name set in the Reply To field for the mail. Default value is Sender Name.`)
    .option(`--replyToEmail <replyToEmail>`, `Email set in the Reply To field for the mail. Default value is Sender Email.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingUpdateSMTPProvider))

messaging
    .command(`createTelesignProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--from <from>`, `Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .option(`--username <username>`, `Telesign username.`)
    .option(`--password <password>`, `Telesign password.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateTelesignProvider))

messaging
    .command(`updateTelesignProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--username <username>`, `Telesign username.`)
    .option(`--password <password>`, `Telesign password.`)
    .option(`--from <from>`, `Sender number.`)
    .action(actionRunner(messagingUpdateTelesignProvider))

messaging
    .command(`createTextmagicProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--from <from>`, `Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .option(`--username <username>`, `Textmagic username.`)
    .option(`--apiKey <apiKey>`, `Textmagic apiKey.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateTextmagicProvider))

messaging
    .command(`updateTextmagicProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--username <username>`, `Textmagic username.`)
    .option(`--apiKey <apiKey>`, `Textmagic apiKey.`)
    .option(`--from <from>`, `Sender number.`)
    .action(actionRunner(messagingUpdateTextmagicProvider))

messaging
    .command(`createTwilioProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--from <from>`, `Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .option(`--accountSid <accountSid>`, `Twilio account secret ID.`)
    .option(`--authToken <authToken>`, `Twilio authentication token.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateTwilioProvider))

messaging
    .command(`updateTwilioProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--accountSid <accountSid>`, `Twilio account secret ID.`)
    .option(`--authToken <authToken>`, `Twilio authentication token.`)
    .option(`--from <from>`, `Sender number.`)
    .action(actionRunner(messagingUpdateTwilioProvider))

messaging
    .command(`createVonageProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--from <from>`, `Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .option(`--apiKey <apiKey>`, `Vonage API key.`)
    .option(`--apiSecret <apiSecret>`, `Vonage API secret.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateVonageProvider))

messaging
    .command(`updateVonageProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--apiKey <apiKey>`, `Vonage API key.`)
    .option(`--apiSecret <apiSecret>`, `Vonage API secret.`)
    .option(`--from <from>`, `Sender number.`)
    .action(actionRunner(messagingUpdateVonageProvider))

messaging
    .command(`getProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID.`)
    .action(actionRunner(messagingGetProvider))

messaging
    .command(`deleteProvider`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID.`)
    .action(actionRunner(messagingDeleteProvider))

messaging
    .command(`listProviderLogs`)
    .description(``)
    .requiredOption(`--providerId <providerId>`, `Provider ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(messagingListProviderLogs))

messaging
    .command(`listSubscriberLogs`)
    .description(``)
    .requiredOption(`--subscriberId <subscriberId>`, `Subscriber ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(messagingListSubscriberLogs))

messaging
    .command(`listTopics`)
    .description(``)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, description, total`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(messagingListTopics))

messaging
    .command(`createTopic`)
    .description(``)
    .requiredOption(`--topicId <topicId>`, `Topic ID. Choose a custom Topic ID or a new Topic ID.`)
    .requiredOption(`--name <name>`, `Topic Name.`)
    .action(actionRunner(messagingCreateTopic))

messaging
    .command(`getTopic`)
    .description(``)
    .requiredOption(`--topicId <topicId>`, `Topic ID.`)
    .action(actionRunner(messagingGetTopic))

messaging
    .command(`updateTopic`)
    .description(``)
    .requiredOption(`--topicId <topicId>`, `Topic ID.`)
    .option(`--name <name>`, `Topic Name.`)
    .action(actionRunner(messagingUpdateTopic))

messaging
    .command(`deleteTopic`)
    .description(``)
    .requiredOption(`--topicId <topicId>`, `Topic ID.`)
    .action(actionRunner(messagingDeleteTopic))

messaging
    .command(`listTopicLogs`)
    .description(``)
    .requiredOption(`--topicId <topicId>`, `Topic ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(messagingListTopicLogs))

messaging
    .command(`listSubscribers`)
    .description(``)
    .requiredOption(`--topicId <topicId>`, `Topic ID. The topic ID subscribed to.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, provider, type, enabled`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(messagingListSubscribers))

messaging
    .command(`createSubscriber`)
    .description(``)
    .requiredOption(`--topicId <topicId>`, `Topic ID. The topic ID to subscribe to.`)
    .requiredOption(`--subscriberId <subscriberId>`, `Subscriber ID. Choose a custom Subscriber ID or a new Subscriber ID.`)
    .requiredOption(`--targetId <targetId>`, `Target ID. The target ID to link to the specified Topic ID.`)
    .action(actionRunner(messagingCreateSubscriber))

messaging
    .command(`getSubscriber`)
    .description(``)
    .requiredOption(`--topicId <topicId>`, `Topic ID. The topic ID subscribed to.`)
    .requiredOption(`--subscriberId <subscriberId>`, `Subscriber ID.`)
    .action(actionRunner(messagingGetSubscriber))

messaging
    .command(`deleteSubscriber`)
    .description(``)
    .requiredOption(`--topicId <topicId>`, `Topic ID. The topic ID subscribed to.`)
    .requiredOption(`--subscriberId <subscriberId>`, `Subscriber ID.`)
    .action(actionRunner(messagingDeleteSubscriber))


module.exports = {
    messaging,
    messagingListMessages,
    messagingCreateEmail,
    messagingUpdateEmail,
    messagingCreatePush,
    messagingUpdatePush,
    messagingCreateSMS,
    messagingUpdateSMS,
    messagingGetMessage,
    messagingDelete,
    messagingListMessageLogs,
    messagingListTargets,
    messagingListProviders,
    messagingCreateAPNSProvider,
    messagingUpdateAPNSProvider,
    messagingCreateFCMProvider,
    messagingUpdateFCMProvider,
    messagingCreateMailgunProvider,
    messagingUpdateMailgunProvider,
    messagingCreateMsg91Provider,
    messagingUpdateMsg91Provider,
    messagingCreateSendgridProvider,
    messagingUpdateSendgridProvider,
    messagingCreateSMTPProvider,
    messagingUpdateSMTPProvider,
    messagingCreateTelesignProvider,
    messagingUpdateTelesignProvider,
    messagingCreateTextmagicProvider,
    messagingUpdateTextmagicProvider,
    messagingCreateTwilioProvider,
    messagingUpdateTwilioProvider,
    messagingCreateVonageProvider,
    messagingUpdateVonageProvider,
    messagingGetProvider,
    messagingDeleteProvider,
    messagingListProviderLogs,
    messagingListSubscriberLogs,
    messagingListTopics,
    messagingCreateTopic,
    messagingGetTopic,
    messagingUpdateTopic,
    messagingDeleteTopic,
    messagingListTopicLogs,
    messagingListSubscribers,
    messagingCreateSubscriber,
    messagingGetSubscriber,
    messagingDeleteSubscriber
};
