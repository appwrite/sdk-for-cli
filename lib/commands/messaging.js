const fs = require('fs');
const pathLib = require('path');
const tar = require("tar");
const ignore = require("ignore");
const { promisify } = require('util');
const libClient = require('../client.js');
const { getAllFiles, showConsoleLink } = require('../utils.js');
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

const messaging = new Command("messaging").description(commandDescriptions['messaging'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} MessagingListMessagesRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: scheduledAt, deliveredAt, deliveredTotal, status, description, providerType
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingListMessagesRequestParams} params
 */
const messagingListMessages = async ({queries,search,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/messages';
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
        if(console) {
            showConsoleLink('messaging', 'listMessages');
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} MessagingCreateEmailRequestParams
 * @property {string} messageId Message ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} subject Email Subject.
 * @property {string} content Email Content.
 * @property {string[]} topics List of Topic IDs.
 * @property {string[]} users List of User IDs.
 * @property {string[]} targets List of Targets IDs.
 * @property {string[]} cc Array of target IDs to be added as CC.
 * @property {string[]} bcc Array of target IDs to be added as BCC.
 * @property {string[]} attachments Array of compound ID strings of bucket IDs and file IDs to be attached to the email. They should be formatted as &lt;BUCKET_ID&gt;:&lt;FILE_ID&gt;.
 * @property {boolean} draft Is message a draft
 * @property {boolean} html Is content of type HTML
 * @property {string} scheduledAt Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingCreateEmailRequestParams} params
 */
const messagingCreateEmail = async ({messageId,subject,content,topics,users,targets,cc,bcc,attachments,draft,html,scheduledAt,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/messages/email';
    let payload = {};
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
    attachments = attachments === true ? [] : attachments;
    if (typeof attachments !== 'undefined') {
        payload['attachments'] = attachments;
    }
    if (typeof draft !== 'undefined') {
        payload['draft'] = draft;
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingUpdateEmailRequestParams
 * @property {string} messageId Message ID.
 * @property {string[]} topics List of Topic IDs.
 * @property {string[]} users List of User IDs.
 * @property {string[]} targets List of Targets IDs.
 * @property {string} subject Email Subject.
 * @property {string} content Email Content.
 * @property {boolean} draft Is message a draft
 * @property {boolean} html Is content of type HTML
 * @property {string[]} cc Array of target IDs to be added as CC.
 * @property {string[]} bcc Array of target IDs to be added as BCC.
 * @property {string} scheduledAt Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.
 * @property {string[]} attachments Array of compound ID strings of bucket IDs and file IDs to be attached to the email. They should be formatted as &lt;BUCKET_ID&gt;:&lt;FILE_ID&gt;.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingUpdateEmailRequestParams} params
 */
const messagingUpdateEmail = async ({messageId,topics,users,targets,subject,content,draft,html,cc,bcc,scheduledAt,attachments,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/messages/email/{messageId}'.replace('{messageId}', messageId);
    let payload = {};
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
    if (typeof draft !== 'undefined') {
        payload['draft'] = draft;
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
    attachments = attachments === true ? [] : attachments;
    if (typeof attachments !== 'undefined') {
        payload['attachments'] = attachments;
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
 * @typedef {Object} MessagingCreatePushRequestParams
 * @property {string} messageId Message ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} title Title for push notification.
 * @property {string} body Body for push notification.
 * @property {string[]} topics List of Topic IDs.
 * @property {string[]} users List of User IDs.
 * @property {string[]} targets List of Targets IDs.
 * @property {object} data Additional Data for push notification.
 * @property {string} action Action for push notification.
 * @property {string} image Image for push notification. Must be a compound bucket ID to file ID of a jpeg, png, or bmp image in Appwrite Storage. It should be formatted as &lt;BUCKET_ID&gt;:&lt;FILE_ID&gt;.
 * @property {string} icon Icon for push notification. Available only for Android and Web Platform.
 * @property {string} sound Sound for push notification. Available only for Android and IOS Platform.
 * @property {string} color Color for push notification. Available only for Android Platform.
 * @property {string} tag Tag for push notification. Available only for Android Platform.
 * @property {string} badge Badge for push notification. Available only for IOS Platform.
 * @property {boolean} draft Is message a draft
 * @property {string} scheduledAt Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingCreatePushRequestParams} params
 */
const messagingCreatePush = async ({messageId,title,body,topics,users,targets,data,action,image,icon,sound,color,tag,badge,draft,scheduledAt,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/messages/push';
    let payload = {};
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
    if (typeof image !== 'undefined') {
        payload['image'] = image;
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
    if (typeof draft !== 'undefined') {
        payload['draft'] = draft;
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingUpdatePushRequestParams
 * @property {string} messageId Message ID.
 * @property {string[]} topics List of Topic IDs.
 * @property {string[]} users List of User IDs.
 * @property {string[]} targets List of Targets IDs.
 * @property {string} title Title for push notification.
 * @property {string} body Body for push notification.
 * @property {object} data Additional Data for push notification.
 * @property {string} action Action for push notification.
 * @property {string} image Image for push notification. Must be a compound bucket ID to file ID of a jpeg, png, or bmp image in Appwrite Storage. It should be formatted as &lt;BUCKET_ID&gt;:&lt;FILE_ID&gt;.
 * @property {string} icon Icon for push notification. Available only for Android and Web platforms.
 * @property {string} sound Sound for push notification. Available only for Android and iOS platforms.
 * @property {string} color Color for push notification. Available only for Android platforms.
 * @property {string} tag Tag for push notification. Available only for Android platforms.
 * @property {number} badge Badge for push notification. Available only for iOS platforms.
 * @property {boolean} draft Is message a draft
 * @property {string} scheduledAt Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingUpdatePushRequestParams} params
 */
const messagingUpdatePush = async ({messageId,topics,users,targets,title,body,data,action,image,icon,sound,color,tag,badge,draft,scheduledAt,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/messages/push/{messageId}'.replace('{messageId}', messageId);
    let payload = {};
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
    if (typeof image !== 'undefined') {
        payload['image'] = image;
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
    if (typeof draft !== 'undefined') {
        payload['draft'] = draft;
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingCreateSmsRequestParams
 * @property {string} messageId Message ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} content SMS Content.
 * @property {string[]} topics List of Topic IDs.
 * @property {string[]} users List of User IDs.
 * @property {string[]} targets List of Targets IDs.
 * @property {boolean} draft Is message a draft
 * @property {string} scheduledAt Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingCreateSmsRequestParams} params
 */
const messagingCreateSms = async ({messageId,content,topics,users,targets,draft,scheduledAt,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/messages/sms';
    let payload = {};
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
    if (typeof draft !== 'undefined') {
        payload['draft'] = draft;
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingUpdateSmsRequestParams
 * @property {string} messageId Message ID.
 * @property {string[]} topics List of Topic IDs.
 * @property {string[]} users List of User IDs.
 * @property {string[]} targets List of Targets IDs.
 * @property {string} content Email Content.
 * @property {boolean} draft Is message a draft
 * @property {string} scheduledAt Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingUpdateSmsRequestParams} params
 */
const messagingUpdateSms = async ({messageId,topics,users,targets,content,draft,scheduledAt,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/messages/sms/{messageId}'.replace('{messageId}', messageId);
    let payload = {};
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
    if (typeof draft !== 'undefined') {
        payload['draft'] = draft;
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingGetMessageRequestParams
 * @property {string} messageId Message ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingGetMessageRequestParams} params
 */
const messagingGetMessage = async ({messageId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/messages/{messageId}'.replace('{messageId}', messageId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('messaging', 'getMessage', messageId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} MessagingDeleteRequestParams
 * @property {string} messageId Message ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingDeleteRequestParams} params
 */
const messagingDelete = async ({messageId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/messages/{messageId}'.replace('{messageId}', messageId);
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
 * @typedef {Object} MessagingListMessageLogsRequestParams
 * @property {string} messageId Message ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingListMessageLogsRequestParams} params
 */
const messagingListMessageLogs = async ({messageId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/messages/{messageId}/logs'.replace('{messageId}', messageId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('messaging', 'listMessageLogs', messageId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} MessagingListTargetsRequestParams
 * @property {string} messageId Message ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, providerId, identifier, providerType
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingListTargetsRequestParams} params
 */
const messagingListTargets = async ({messageId,queries,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/messages/{messageId}/targets'.replace('{messageId}', messageId);
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingListProvidersRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, provider, type, enabled
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingListProvidersRequestParams} params
 */
const messagingListProviders = async ({queries,search,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers';
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
        if(console) {
            showConsoleLink('messaging', 'listProviders');
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} MessagingCreateApnsProviderRequestParams
 * @property {string} providerId Provider ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Provider name.
 * @property {string} authKey APNS authentication key.
 * @property {string} authKeyId APNS authentication key ID.
 * @property {string} teamId APNS team ID.
 * @property {string} bundleId APNS bundle ID.
 * @property {boolean} sandbox Use APNS sandbox environment.
 * @property {boolean} enabled Set as enabled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingCreateApnsProviderRequestParams} params
 */
const messagingCreateApnsProvider = async ({providerId,name,authKey,authKeyId,teamId,bundleId,sandbox,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/apns';
    let payload = {};
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
    if (typeof sandbox !== 'undefined') {
        payload['sandbox'] = sandbox;
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingUpdateApnsProviderRequestParams
 * @property {string} providerId Provider ID.
 * @property {string} name Provider name.
 * @property {boolean} enabled Set as enabled.
 * @property {string} authKey APNS authentication key.
 * @property {string} authKeyId APNS authentication key ID.
 * @property {string} teamId APNS team ID.
 * @property {string} bundleId APNS bundle ID.
 * @property {boolean} sandbox Use APNS sandbox environment.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingUpdateApnsProviderRequestParams} params
 */
const messagingUpdateApnsProvider = async ({providerId,name,enabled,authKey,authKeyId,teamId,bundleId,sandbox,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/apns/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
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
    if (typeof sandbox !== 'undefined') {
        payload['sandbox'] = sandbox;
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
 * @typedef {Object} MessagingCreateFcmProviderRequestParams
 * @property {string} providerId Provider ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Provider name.
 * @property {object} serviceAccountJSON FCM service account JSON.
 * @property {boolean} enabled Set as enabled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingCreateFcmProviderRequestParams} params
 */
const messagingCreateFcmProvider = async ({providerId,name,serviceAccountJSON,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/fcm';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingUpdateFcmProviderRequestParams
 * @property {string} providerId Provider ID.
 * @property {string} name Provider name.
 * @property {boolean} enabled Set as enabled.
 * @property {object} serviceAccountJSON FCM service account JSON.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingUpdateFcmProviderRequestParams} params
 */
const messagingUpdateFcmProvider = async ({providerId,name,enabled,serviceAccountJSON,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/fcm/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingCreateMailgunProviderRequestParams
 * @property {string} providerId Provider ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Provider name.
 * @property {string} apiKey Mailgun API Key.
 * @property {string} domain Mailgun Domain.
 * @property {boolean} isEuRegion Set as EU region.
 * @property {string} fromName Sender Name.
 * @property {string} fromEmail Sender email address.
 * @property {string} replyToName Name set in the reply to field for the mail. Default value is sender name. Reply to name must have reply to email as well.
 * @property {string} replyToEmail Email set in the reply to field for the mail. Default value is sender email. Reply to email must have reply to name as well.
 * @property {boolean} enabled Set as enabled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingCreateMailgunProviderRequestParams} params
 */
const messagingCreateMailgunProvider = async ({providerId,name,apiKey,domain,isEuRegion,fromName,fromEmail,replyToName,replyToEmail,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/mailgun';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingUpdateMailgunProviderRequestParams
 * @property {string} providerId Provider ID.
 * @property {string} name Provider name.
 * @property {string} apiKey Mailgun API Key.
 * @property {string} domain Mailgun Domain.
 * @property {boolean} isEuRegion Set as EU region.
 * @property {boolean} enabled Set as enabled.
 * @property {string} fromName Sender Name.
 * @property {string} fromEmail Sender email address.
 * @property {string} replyToName Name set in the reply to field for the mail. Default value is sender name.
 * @property {string} replyToEmail Email set in the reply to field for the mail. Default value is sender email.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingUpdateMailgunProviderRequestParams} params
 */
const messagingUpdateMailgunProvider = async ({providerId,name,apiKey,domain,isEuRegion,enabled,fromName,fromEmail,replyToName,replyToEmail,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/mailgun/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingCreateMsg91ProviderRequestParams
 * @property {string} providerId Provider ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Provider name.
 * @property {string} templateId Msg91 template ID
 * @property {string} senderId Msg91 sender ID.
 * @property {string} authKey Msg91 auth key.
 * @property {boolean} enabled Set as enabled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingCreateMsg91ProviderRequestParams} params
 */
const messagingCreateMsg91Provider = async ({providerId,name,templateId,senderId,authKey,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/msg91';
    let payload = {};
    if (typeof providerId !== 'undefined') {
        payload['providerId'] = providerId;
    }
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof templateId !== 'undefined') {
        payload['templateId'] = templateId;
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingUpdateMsg91ProviderRequestParams
 * @property {string} providerId Provider ID.
 * @property {string} name Provider name.
 * @property {boolean} enabled Set as enabled.
 * @property {string} templateId Msg91 template ID.
 * @property {string} senderId Msg91 sender ID.
 * @property {string} authKey Msg91 auth key.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingUpdateMsg91ProviderRequestParams} params
 */
const messagingUpdateMsg91Provider = async ({providerId,name,enabled,templateId,senderId,authKey,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/msg91/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }
    if (typeof templateId !== 'undefined') {
        payload['templateId'] = templateId;
    }
    if (typeof senderId !== 'undefined') {
        payload['senderId'] = senderId;
    }
    if (typeof authKey !== 'undefined') {
        payload['authKey'] = authKey;
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
 * @typedef {Object} MessagingCreateSendgridProviderRequestParams
 * @property {string} providerId Provider ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Provider name.
 * @property {string} apiKey Sendgrid API key.
 * @property {string} fromName Sender Name.
 * @property {string} fromEmail Sender email address.
 * @property {string} replyToName Name set in the reply to field for the mail. Default value is sender name.
 * @property {string} replyToEmail Email set in the reply to field for the mail. Default value is sender email.
 * @property {boolean} enabled Set as enabled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingCreateSendgridProviderRequestParams} params
 */
const messagingCreateSendgridProvider = async ({providerId,name,apiKey,fromName,fromEmail,replyToName,replyToEmail,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/sendgrid';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingUpdateSendgridProviderRequestParams
 * @property {string} providerId Provider ID.
 * @property {string} name Provider name.
 * @property {boolean} enabled Set as enabled.
 * @property {string} apiKey Sendgrid API key.
 * @property {string} fromName Sender Name.
 * @property {string} fromEmail Sender email address.
 * @property {string} replyToName Name set in the Reply To field for the mail. Default value is Sender Name.
 * @property {string} replyToEmail Email set in the Reply To field for the mail. Default value is Sender Email.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingUpdateSendgridProviderRequestParams} params
 */
const messagingUpdateSendgridProvider = async ({providerId,name,enabled,apiKey,fromName,fromEmail,replyToName,replyToEmail,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/sendgrid/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingCreateSmtpProviderRequestParams
 * @property {string} providerId Provider ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Provider name.
 * @property {string} host SMTP hosts. Either a single hostname or multiple semicolon-delimited hostnames. You can also specify a different port for each host such as &#039;smtp1.example.com:25;smtp2.example.com&#039;. You can also specify encryption type, for example: &#039;tls://smtp1.example.com:587;ssl://smtp2.example.com:465&quot;&#039;. Hosts will be tried in order.
 * @property {number} port The default SMTP server port.
 * @property {string} username Authentication username.
 * @property {string} password Authentication password.
 * @property {SmtpEncryption} encryption Encryption type. Can be omitted, &#039;ssl&#039;, or &#039;tls&#039;
 * @property {boolean} autoTLS Enable SMTP AutoTLS feature.
 * @property {string} mailer The value to use for the X-Mailer header.
 * @property {string} fromName Sender Name.
 * @property {string} fromEmail Sender email address.
 * @property {string} replyToName Name set in the reply to field for the mail. Default value is sender name.
 * @property {string} replyToEmail Email set in the reply to field for the mail. Default value is sender email.
 * @property {boolean} enabled Set as enabled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingCreateSmtpProviderRequestParams} params
 */
const messagingCreateSmtpProvider = async ({providerId,name,host,port,username,password,encryption,autoTLS,mailer,fromName,fromEmail,replyToName,replyToEmail,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/smtp';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingUpdateSmtpProviderRequestParams
 * @property {string} providerId Provider ID.
 * @property {string} name Provider name.
 * @property {string} host SMTP hosts. Either a single hostname or multiple semicolon-delimited hostnames. You can also specify a different port for each host such as &#039;smtp1.example.com:25;smtp2.example.com&#039;. You can also specify encryption type, for example: &#039;tls://smtp1.example.com:587;ssl://smtp2.example.com:465&quot;&#039;. Hosts will be tried in order.
 * @property {number} port SMTP port.
 * @property {string} username Authentication username.
 * @property {string} password Authentication password.
 * @property {SmtpEncryption} encryption Encryption type. Can be &#039;ssl&#039; or &#039;tls&#039;
 * @property {boolean} autoTLS Enable SMTP AutoTLS feature.
 * @property {string} mailer The value to use for the X-Mailer header.
 * @property {string} fromName Sender Name.
 * @property {string} fromEmail Sender email address.
 * @property {string} replyToName Name set in the Reply To field for the mail. Default value is Sender Name.
 * @property {string} replyToEmail Email set in the Reply To field for the mail. Default value is Sender Email.
 * @property {boolean} enabled Set as enabled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingUpdateSmtpProviderRequestParams} params
 */
const messagingUpdateSmtpProvider = async ({providerId,name,host,port,username,password,encryption,autoTLS,mailer,fromName,fromEmail,replyToName,replyToEmail,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/smtp/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
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

    response = await client.call('patch', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} MessagingCreateTelesignProviderRequestParams
 * @property {string} providerId Provider ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Provider name.
 * @property {string} from Sender Phone number. Format this number with a leading &#039;+&#039; and a country code, e.g., +16175551212.
 * @property {string} customerId Telesign customer ID.
 * @property {string} apiKey Telesign API key.
 * @property {boolean} enabled Set as enabled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingCreateTelesignProviderRequestParams} params
 */
const messagingCreateTelesignProvider = async ({providerId,name,from,customerId,apiKey,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/telesign';
    let payload = {};
    if (typeof providerId !== 'undefined') {
        payload['providerId'] = providerId;
    }
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof from !== 'undefined') {
        payload['from'] = from;
    }
    if (typeof customerId !== 'undefined') {
        payload['customerId'] = customerId;
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingUpdateTelesignProviderRequestParams
 * @property {string} providerId Provider ID.
 * @property {string} name Provider name.
 * @property {boolean} enabled Set as enabled.
 * @property {string} customerId Telesign customer ID.
 * @property {string} apiKey Telesign API key.
 * @property {string} from Sender number.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingUpdateTelesignProviderRequestParams} params
 */
const messagingUpdateTelesignProvider = async ({providerId,name,enabled,customerId,apiKey,from,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/telesign/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }
    if (typeof customerId !== 'undefined') {
        payload['customerId'] = customerId;
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingCreateTextmagicProviderRequestParams
 * @property {string} providerId Provider ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Provider name.
 * @property {string} from Sender Phone number. Format this number with a leading &#039;+&#039; and a country code, e.g., +16175551212.
 * @property {string} username Textmagic username.
 * @property {string} apiKey Textmagic apiKey.
 * @property {boolean} enabled Set as enabled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingCreateTextmagicProviderRequestParams} params
 */
const messagingCreateTextmagicProvider = async ({providerId,name,from,username,apiKey,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/textmagic';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingUpdateTextmagicProviderRequestParams
 * @property {string} providerId Provider ID.
 * @property {string} name Provider name.
 * @property {boolean} enabled Set as enabled.
 * @property {string} username Textmagic username.
 * @property {string} apiKey Textmagic apiKey.
 * @property {string} from Sender number.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingUpdateTextmagicProviderRequestParams} params
 */
const messagingUpdateTextmagicProvider = async ({providerId,name,enabled,username,apiKey,from,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/textmagic/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingCreateTwilioProviderRequestParams
 * @property {string} providerId Provider ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Provider name.
 * @property {string} from Sender Phone number. Format this number with a leading &#039;+&#039; and a country code, e.g., +16175551212.
 * @property {string} accountSid Twilio account secret ID.
 * @property {string} authToken Twilio authentication token.
 * @property {boolean} enabled Set as enabled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingCreateTwilioProviderRequestParams} params
 */
const messagingCreateTwilioProvider = async ({providerId,name,from,accountSid,authToken,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/twilio';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingUpdateTwilioProviderRequestParams
 * @property {string} providerId Provider ID.
 * @property {string} name Provider name.
 * @property {boolean} enabled Set as enabled.
 * @property {string} accountSid Twilio account secret ID.
 * @property {string} authToken Twilio authentication token.
 * @property {string} from Sender number.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingUpdateTwilioProviderRequestParams} params
 */
const messagingUpdateTwilioProvider = async ({providerId,name,enabled,accountSid,authToken,from,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/twilio/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingCreateVonageProviderRequestParams
 * @property {string} providerId Provider ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Provider name.
 * @property {string} from Sender Phone number. Format this number with a leading &#039;+&#039; and a country code, e.g., +16175551212.
 * @property {string} apiKey Vonage API key.
 * @property {string} apiSecret Vonage API secret.
 * @property {boolean} enabled Set as enabled.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingCreateVonageProviderRequestParams} params
 */
const messagingCreateVonageProvider = async ({providerId,name,from,apiKey,apiSecret,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/vonage';
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingUpdateVonageProviderRequestParams
 * @property {string} providerId Provider ID.
 * @property {string} name Provider name.
 * @property {boolean} enabled Set as enabled.
 * @property {string} apiKey Vonage API key.
 * @property {string} apiSecret Vonage API secret.
 * @property {string} from Sender number.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingUpdateVonageProviderRequestParams} params
 */
const messagingUpdateVonageProvider = async ({providerId,name,enabled,apiKey,apiSecret,from,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/vonage/{providerId}'.replace('{providerId}', providerId);
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingGetProviderRequestParams
 * @property {string} providerId Provider ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingGetProviderRequestParams} params
 */
const messagingGetProvider = async ({providerId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/{providerId}'.replace('{providerId}', providerId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('messaging', 'getProvider', providerId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} MessagingDeleteProviderRequestParams
 * @property {string} providerId Provider ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingDeleteProviderRequestParams} params
 */
const messagingDeleteProvider = async ({providerId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/{providerId}'.replace('{providerId}', providerId);
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
 * @typedef {Object} MessagingListProviderLogsRequestParams
 * @property {string} providerId Provider ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingListProviderLogsRequestParams} params
 */
const messagingListProviderLogs = async ({providerId,queries,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/{providerId}/logs'.replace('{providerId}', providerId);
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingListSubscriberLogsRequestParams
 * @property {string} subscriberId Subscriber ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingListSubscriberLogsRequestParams} params
 */
const messagingListSubscriberLogs = async ({subscriberId,queries,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/subscribers/{subscriberId}/logs'.replace('{subscriberId}', subscriberId);
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingListTopicsRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, description, emailTotal, smsTotal, pushTotal
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingListTopicsRequestParams} params
 */
const messagingListTopics = async ({queries,search,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/topics';
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
        if(console) {
            showConsoleLink('messaging', 'listTopics');
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} MessagingCreateTopicRequestParams
 * @property {string} topicId Topic ID. Choose a custom Topic ID or a new Topic ID.
 * @property {string} name Topic Name.
 * @property {string[]} subscribe An array of role strings with subscribe permission. By default all users are granted with any subscribe permission. [learn more about roles](https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingCreateTopicRequestParams} params
 */
const messagingCreateTopic = async ({topicId,name,subscribe,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/topics';
    let payload = {};
    if (typeof topicId !== 'undefined') {
        payload['topicId'] = topicId;
    }
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    subscribe = subscribe === true ? [] : subscribe;
    if (typeof subscribe !== 'undefined') {
        payload['subscribe'] = subscribe;
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
 * @typedef {Object} MessagingGetTopicRequestParams
 * @property {string} topicId Topic ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingGetTopicRequestParams} params
 */
const messagingGetTopic = async ({topicId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/topics/{topicId}'.replace('{topicId}', topicId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('messaging', 'getTopic', topicId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} MessagingUpdateTopicRequestParams
 * @property {string} topicId Topic ID.
 * @property {string} name Topic Name.
 * @property {string[]} subscribe An array of role strings with subscribe permission. By default all users are granted with any subscribe permission. [learn more about roles](https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingUpdateTopicRequestParams} params
 */
const messagingUpdateTopic = async ({topicId,name,subscribe,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/topics/{topicId}'.replace('{topicId}', topicId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    subscribe = subscribe === true ? [] : subscribe;
    if (typeof subscribe !== 'undefined') {
        payload['subscribe'] = subscribe;
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
 * @typedef {Object} MessagingDeleteTopicRequestParams
 * @property {string} topicId Topic ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingDeleteTopicRequestParams} params
 */
const messagingDeleteTopic = async ({topicId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/topics/{topicId}'.replace('{topicId}', topicId);
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
 * @typedef {Object} MessagingListTopicLogsRequestParams
 * @property {string} topicId Topic ID.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingListTopicLogsRequestParams} params
 */
const messagingListTopicLogs = async ({topicId,queries,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/topics/{topicId}/logs'.replace('{topicId}', topicId);
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingListSubscribersRequestParams
 * @property {string} topicId Topic ID. The topic ID subscribed to.
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, provider, type, enabled
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingListSubscribersRequestParams} params
 */
const messagingListSubscribers = async ({topicId,queries,search,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/topics/{topicId}/subscribers'.replace('{topicId}', topicId);
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
        if(console) {
            showConsoleLink('messaging', 'listSubscribers', topicId);
         } else {
            parse(response)
        }
    }

    return response;

}

/**
 * @typedef {Object} MessagingCreateSubscriberRequestParams
 * @property {string} topicId Topic ID. The topic ID to subscribe to.
 * @property {string} subscriberId Subscriber ID. Choose a custom Subscriber ID or a new Subscriber ID.
 * @property {string} targetId Target ID. The target ID to link to the specified Topic ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingCreateSubscriberRequestParams} params
 */
const messagingCreateSubscriber = async ({topicId,subscriberId,targetId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/topics/{topicId}/subscribers'.replace('{topicId}', topicId);
    let payload = {};
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
    }

    return response;

}

/**
 * @typedef {Object} MessagingGetSubscriberRequestParams
 * @property {string} topicId Topic ID. The topic ID subscribed to.
 * @property {string} subscriberId Subscriber ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingGetSubscriberRequestParams} params
 */
const messagingGetSubscriber = async ({topicId,subscriberId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/topics/{topicId}/subscribers/{subscriberId}'.replace('{topicId}', topicId).replace('{subscriberId}', subscriberId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}

/**
 * @typedef {Object} MessagingDeleteSubscriberRequestParams
 * @property {string} topicId Topic ID. The topic ID subscribed to.
 * @property {string} subscriberId Subscriber ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {MessagingDeleteSubscriberRequestParams} params
 */
const messagingDeleteSubscriber = async ({topicId,subscriberId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/topics/{topicId}/subscribers/{subscriberId}'.replace('{topicId}', topicId).replace('{subscriberId}', subscriberId);
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

messaging
    .command(`list-messages`)
    .description(`Get a list of all messages from the current Appwrite project.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: scheduledAt, deliveredAt, deliveredTotal, status, description, providerType`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(messagingListMessages))

messaging
    .command(`create-email`)
    .description(`Create a new email message.`)
    .requiredOption(`--message-id <message-id>`, `Message ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--subject <subject>`, `Email Subject.`)
    .requiredOption(`--content <content>`, `Email Content.`)
    .option(`--topics [topics...]`, `List of Topic IDs.`)
    .option(`--users [users...]`, `List of User IDs.`)
    .option(`--targets [targets...]`, `List of Targets IDs.`)
    .option(`--cc [cc...]`, `Array of target IDs to be added as CC.`)
    .option(`--bcc [bcc...]`, `Array of target IDs to be added as BCC.`)
    .option(`--attachments [attachments...]`, `Array of compound ID strings of bucket IDs and file IDs to be attached to the email. They should be formatted as <BUCKET_ID>:<FILE_ID>.`)
    .option(`--draft <draft>`, `Is message a draft`, parseBool)
    .option(`--html <html>`, `Is content of type HTML`, parseBool)
    .option(`--scheduled-at <scheduled-at>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .action(actionRunner(messagingCreateEmail))

messaging
    .command(`update-email`)
    .description(`Update an email message by its unique ID. `)
    .requiredOption(`--message-id <message-id>`, `Message ID.`)
    .option(`--topics [topics...]`, `List of Topic IDs.`)
    .option(`--users [users...]`, `List of User IDs.`)
    .option(`--targets [targets...]`, `List of Targets IDs.`)
    .option(`--subject <subject>`, `Email Subject.`)
    .option(`--content <content>`, `Email Content.`)
    .option(`--draft <draft>`, `Is message a draft`, parseBool)
    .option(`--html <html>`, `Is content of type HTML`, parseBool)
    .option(`--cc [cc...]`, `Array of target IDs to be added as CC.`)
    .option(`--bcc [bcc...]`, `Array of target IDs to be added as BCC.`)
    .option(`--scheduled-at <scheduled-at>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .option(`--attachments [attachments...]`, `Array of compound ID strings of bucket IDs and file IDs to be attached to the email. They should be formatted as <BUCKET_ID>:<FILE_ID>.`)
    .action(actionRunner(messagingUpdateEmail))

messaging
    .command(`create-push`)
    .description(`Create a new push notification.`)
    .requiredOption(`--message-id <message-id>`, `Message ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--title <title>`, `Title for push notification.`)
    .requiredOption(`--body <body>`, `Body for push notification.`)
    .option(`--topics [topics...]`, `List of Topic IDs.`)
    .option(`--users [users...]`, `List of User IDs.`)
    .option(`--targets [targets...]`, `List of Targets IDs.`)
    .option(`--data <data>`, `Additional Data for push notification.`)
    .option(`--action <action>`, `Action for push notification.`)
    .option(`--image <image>`, `Image for push notification. Must be a compound bucket ID to file ID of a jpeg, png, or bmp image in Appwrite Storage. It should be formatted as <BUCKET_ID>:<FILE_ID>.`)
    .option(`--icon <icon>`, `Icon for push notification. Available only for Android and Web Platform.`)
    .option(`--sound <sound>`, `Sound for push notification. Available only for Android and IOS Platform.`)
    .option(`--color <color>`, `Color for push notification. Available only for Android Platform.`)
    .option(`--tag <tag>`, `Tag for push notification. Available only for Android Platform.`)
    .option(`--badge <badge>`, `Badge for push notification. Available only for IOS Platform.`)
    .option(`--draft <draft>`, `Is message a draft`, parseBool)
    .option(`--scheduled-at <scheduled-at>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .action(actionRunner(messagingCreatePush))

messaging
    .command(`update-push`)
    .description(`Update a push notification by its unique ID. `)
    .requiredOption(`--message-id <message-id>`, `Message ID.`)
    .option(`--topics [topics...]`, `List of Topic IDs.`)
    .option(`--users [users...]`, `List of User IDs.`)
    .option(`--targets [targets...]`, `List of Targets IDs.`)
    .option(`--title <title>`, `Title for push notification.`)
    .option(`--body <body>`, `Body for push notification.`)
    .option(`--data <data>`, `Additional Data for push notification.`)
    .option(`--action <action>`, `Action for push notification.`)
    .option(`--image <image>`, `Image for push notification. Must be a compound bucket ID to file ID of a jpeg, png, or bmp image in Appwrite Storage. It should be formatted as <BUCKET_ID>:<FILE_ID>.`)
    .option(`--icon <icon>`, `Icon for push notification. Available only for Android and Web platforms.`)
    .option(`--sound <sound>`, `Sound for push notification. Available only for Android and iOS platforms.`)
    .option(`--color <color>`, `Color for push notification. Available only for Android platforms.`)
    .option(`--tag <tag>`, `Tag for push notification. Available only for Android platforms.`)
    .option(`--badge <badge>`, `Badge for push notification. Available only for iOS platforms.`, parseInteger)
    .option(`--draft <draft>`, `Is message a draft`, parseBool)
    .option(`--scheduled-at <scheduled-at>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .action(actionRunner(messagingUpdatePush))

messaging
    .command(`create-sms`)
    .description(`Create a new SMS message.`)
    .requiredOption(`--message-id <message-id>`, `Message ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--content <content>`, `SMS Content.`)
    .option(`--topics [topics...]`, `List of Topic IDs.`)
    .option(`--users [users...]`, `List of User IDs.`)
    .option(`--targets [targets...]`, `List of Targets IDs.`)
    .option(`--draft <draft>`, `Is message a draft`, parseBool)
    .option(`--scheduled-at <scheduled-at>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .action(actionRunner(messagingCreateSms))

messaging
    .command(`update-sms`)
    .description(`Update an email message by its unique ID. `)
    .requiredOption(`--message-id <message-id>`, `Message ID.`)
    .option(`--topics [topics...]`, `List of Topic IDs.`)
    .option(`--users [users...]`, `List of User IDs.`)
    .option(`--targets [targets...]`, `List of Targets IDs.`)
    .option(`--content <content>`, `Email Content.`)
    .option(`--draft <draft>`, `Is message a draft`, parseBool)
    .option(`--scheduled-at <scheduled-at>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .action(actionRunner(messagingUpdateSms))

messaging
    .command(`get-message`)
    .description(`Get a message by its unique ID. `)
    .requiredOption(`--message-id <message-id>`, `Message ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(messagingGetMessage))

messaging
    .command(`delete`)
    .description(`Delete a message. If the message is not a draft or scheduled, but has been sent, this will not recall the message.`)
    .requiredOption(`--message-id <message-id>`, `Message ID.`)
    .action(actionRunner(messagingDelete))

messaging
    .command(`list-message-logs`)
    .description(`Get the message activity logs listed by its unique ID.`)
    .requiredOption(`--message-id <message-id>`, `Message ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(messagingListMessageLogs))

messaging
    .command(`list-targets`)
    .description(`Get a list of the targets associated with a message.`)
    .requiredOption(`--message-id <message-id>`, `Message ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, providerId, identifier, providerType`)
    .action(actionRunner(messagingListTargets))

messaging
    .command(`list-providers`)
    .description(`Get a list of all providers from the current Appwrite project.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, provider, type, enabled`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(messagingListProviders))

messaging
    .command(`create-apns-provider`)
    .description(`Create a new Apple Push Notification service provider.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--auth-key <auth-key>`, `APNS authentication key.`)
    .option(`--auth-key-id <auth-key-id>`, `APNS authentication key ID.`)
    .option(`--team-id <team-id>`, `APNS team ID.`)
    .option(`--bundle-id <bundle-id>`, `APNS bundle ID.`)
    .option(`--sandbox <sandbox>`, `Use APNS sandbox environment.`, parseBool)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateApnsProvider))

messaging
    .command(`update-apns-provider`)
    .description(`Update a Apple Push Notification service provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--auth-key <auth-key>`, `APNS authentication key.`)
    .option(`--auth-key-id <auth-key-id>`, `APNS authentication key ID.`)
    .option(`--team-id <team-id>`, `APNS team ID.`)
    .option(`--bundle-id <bundle-id>`, `APNS bundle ID.`)
    .option(`--sandbox <sandbox>`, `Use APNS sandbox environment.`, parseBool)
    .action(actionRunner(messagingUpdateApnsProvider))

messaging
    .command(`create-fcm-provider`)
    .description(`Create a new Firebase Cloud Messaging provider.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--service-account-json <service-account-json>`, `FCM service account JSON.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateFcmProvider))

messaging
    .command(`update-fcm-provider`)
    .description(`Update a Firebase Cloud Messaging provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--service-account-json <service-account-json>`, `FCM service account JSON.`)
    .action(actionRunner(messagingUpdateFcmProvider))

messaging
    .command(`create-mailgun-provider`)
    .description(`Create a new Mailgun provider.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--api-key <api-key>`, `Mailgun API Key.`)
    .option(`--domain <domain>`, `Mailgun Domain.`)
    .option(`--is-eu-region <is-eu-region>`, `Set as EU region.`, parseBool)
    .option(`--from-name <from-name>`, `Sender Name.`)
    .option(`--from-email <from-email>`, `Sender email address.`)
    .option(`--reply-to-name <reply-to-name>`, `Name set in the reply to field for the mail. Default value is sender name. Reply to name must have reply to email as well.`)
    .option(`--reply-to-email <reply-to-email>`, `Email set in the reply to field for the mail. Default value is sender email. Reply to email must have reply to name as well.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateMailgunProvider))

messaging
    .command(`update-mailgun-provider`)
    .description(`Update a Mailgun provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--api-key <api-key>`, `Mailgun API Key.`)
    .option(`--domain <domain>`, `Mailgun Domain.`)
    .option(`--is-eu-region <is-eu-region>`, `Set as EU region.`, parseBool)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--from-name <from-name>`, `Sender Name.`)
    .option(`--from-email <from-email>`, `Sender email address.`)
    .option(`--reply-to-name <reply-to-name>`, `Name set in the reply to field for the mail. Default value is sender name.`)
    .option(`--reply-to-email <reply-to-email>`, `Email set in the reply to field for the mail. Default value is sender email.`)
    .action(actionRunner(messagingUpdateMailgunProvider))

messaging
    .command(`create-msg-91-provider`)
    .description(`Create a new MSG91 provider.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--template-id <template-id>`, `Msg91 template ID`)
    .option(`--sender-id <sender-id>`, `Msg91 sender ID.`)
    .option(`--auth-key <auth-key>`, `Msg91 auth key.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateMsg91Provider))

messaging
    .command(`update-msg-91-provider`)
    .description(`Update a MSG91 provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--template-id <template-id>`, `Msg91 template ID.`)
    .option(`--sender-id <sender-id>`, `Msg91 sender ID.`)
    .option(`--auth-key <auth-key>`, `Msg91 auth key.`)
    .action(actionRunner(messagingUpdateMsg91Provider))

messaging
    .command(`create-sendgrid-provider`)
    .description(`Create a new Sendgrid provider.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--api-key <api-key>`, `Sendgrid API key.`)
    .option(`--from-name <from-name>`, `Sender Name.`)
    .option(`--from-email <from-email>`, `Sender email address.`)
    .option(`--reply-to-name <reply-to-name>`, `Name set in the reply to field for the mail. Default value is sender name.`)
    .option(`--reply-to-email <reply-to-email>`, `Email set in the reply to field for the mail. Default value is sender email.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateSendgridProvider))

messaging
    .command(`update-sendgrid-provider`)
    .description(`Update a Sendgrid provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--api-key <api-key>`, `Sendgrid API key.`)
    .option(`--from-name <from-name>`, `Sender Name.`)
    .option(`--from-email <from-email>`, `Sender email address.`)
    .option(`--reply-to-name <reply-to-name>`, `Name set in the Reply To field for the mail. Default value is Sender Name.`)
    .option(`--reply-to-email <reply-to-email>`, `Email set in the Reply To field for the mail. Default value is Sender Email.`)
    .action(actionRunner(messagingUpdateSendgridProvider))

messaging
    .command(`create-smtp-provider`)
    .description(`Create a new SMTP provider.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .requiredOption(`--host <host>`, `SMTP hosts. Either a single hostname or multiple semicolon-delimited hostnames. You can also specify a different port for each host such as 'smtp1.example.com:25;smtp2.example.com'. You can also specify encryption type, for example: 'tls://smtp1.example.com:587;ssl://smtp2.example.com:465"'. Hosts will be tried in order.`)
    .option(`--port <port>`, `The default SMTP server port.`, parseInteger)
    .option(`--username <username>`, `Authentication username.`)
    .option(`--password <password>`, `Authentication password.`)
    .option(`--encryption <encryption>`, `Encryption type. Can be omitted, 'ssl', or 'tls'`)
    .option(`--auto-tls <auto-tls>`, `Enable SMTP AutoTLS feature.`, parseBool)
    .option(`--mailer <mailer>`, `The value to use for the X-Mailer header.`)
    .option(`--from-name <from-name>`, `Sender Name.`)
    .option(`--from-email <from-email>`, `Sender email address.`)
    .option(`--reply-to-name <reply-to-name>`, `Name set in the reply to field for the mail. Default value is sender name.`)
    .option(`--reply-to-email <reply-to-email>`, `Email set in the reply to field for the mail. Default value is sender email.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateSmtpProvider))

messaging
    .command(`update-smtp-provider`)
    .description(`Update a SMTP provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--host <host>`, `SMTP hosts. Either a single hostname or multiple semicolon-delimited hostnames. You can also specify a different port for each host such as 'smtp1.example.com:25;smtp2.example.com'. You can also specify encryption type, for example: 'tls://smtp1.example.com:587;ssl://smtp2.example.com:465"'. Hosts will be tried in order.`)
    .option(`--port <port>`, `SMTP port.`, parseInteger)
    .option(`--username <username>`, `Authentication username.`)
    .option(`--password <password>`, `Authentication password.`)
    .option(`--encryption <encryption>`, `Encryption type. Can be 'ssl' or 'tls'`)
    .option(`--auto-tls <auto-tls>`, `Enable SMTP AutoTLS feature.`, parseBool)
    .option(`--mailer <mailer>`, `The value to use for the X-Mailer header.`)
    .option(`--from-name <from-name>`, `Sender Name.`)
    .option(`--from-email <from-email>`, `Sender email address.`)
    .option(`--reply-to-name <reply-to-name>`, `Name set in the Reply To field for the mail. Default value is Sender Name.`)
    .option(`--reply-to-email <reply-to-email>`, `Email set in the Reply To field for the mail. Default value is Sender Email.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingUpdateSmtpProvider))

messaging
    .command(`create-telesign-provider`)
    .description(`Create a new Telesign provider.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--from <from>`, `Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .option(`--customer-id <customer-id>`, `Telesign customer ID.`)
    .option(`--api-key <api-key>`, `Telesign API key.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateTelesignProvider))

messaging
    .command(`update-telesign-provider`)
    .description(`Update a Telesign provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--customer-id <customer-id>`, `Telesign customer ID.`)
    .option(`--api-key <api-key>`, `Telesign API key.`)
    .option(`--from <from>`, `Sender number.`)
    .action(actionRunner(messagingUpdateTelesignProvider))

messaging
    .command(`create-textmagic-provider`)
    .description(`Create a new Textmagic provider.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--from <from>`, `Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .option(`--username <username>`, `Textmagic username.`)
    .option(`--api-key <api-key>`, `Textmagic apiKey.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateTextmagicProvider))

messaging
    .command(`update-textmagic-provider`)
    .description(`Update a Textmagic provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--username <username>`, `Textmagic username.`)
    .option(`--api-key <api-key>`, `Textmagic apiKey.`)
    .option(`--from <from>`, `Sender number.`)
    .action(actionRunner(messagingUpdateTextmagicProvider))

messaging
    .command(`create-twilio-provider`)
    .description(`Create a new Twilio provider.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--from <from>`, `Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .option(`--account-sid <account-sid>`, `Twilio account secret ID.`)
    .option(`--auth-token <auth-token>`, `Twilio authentication token.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateTwilioProvider))

messaging
    .command(`update-twilio-provider`)
    .description(`Update a Twilio provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--account-sid <account-sid>`, `Twilio account secret ID.`)
    .option(`--auth-token <auth-token>`, `Twilio authentication token.`)
    .option(`--from <from>`, `Sender number.`)
    .action(actionRunner(messagingUpdateTwilioProvider))

messaging
    .command(`create-vonage-provider`)
    .description(`Create a new Vonage provider.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--from <from>`, `Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .option(`--api-key <api-key>`, `Vonage API key.`)
    .option(`--api-secret <api-secret>`, `Vonage API secret.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .action(actionRunner(messagingCreateVonageProvider))

messaging
    .command(`update-vonage-provider`)
    .description(`Update a Vonage provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled <enabled>`, `Set as enabled.`, parseBool)
    .option(`--api-key <api-key>`, `Vonage API key.`)
    .option(`--api-secret <api-secret>`, `Vonage API secret.`)
    .option(`--from <from>`, `Sender number.`)
    .action(actionRunner(messagingUpdateVonageProvider))

messaging
    .command(`get-provider`)
    .description(`Get a provider by its unique ID. `)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(messagingGetProvider))

messaging
    .command(`delete-provider`)
    .description(`Delete a provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .action(actionRunner(messagingDeleteProvider))

messaging
    .command(`list-provider-logs`)
    .description(`Get the provider activity logs listed by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(messagingListProviderLogs))

messaging
    .command(`list-subscriber-logs`)
    .description(`Get the subscriber activity logs listed by its unique ID.`)
    .requiredOption(`--subscriber-id <subscriber-id>`, `Subscriber ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(messagingListSubscriberLogs))

messaging
    .command(`list-topics`)
    .description(`Get a list of all topics from the current Appwrite project.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, description, emailTotal, smsTotal, pushTotal`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(messagingListTopics))

messaging
    .command(`create-topic`)
    .description(`Create a new topic.`)
    .requiredOption(`--topic-id <topic-id>`, `Topic ID. Choose a custom Topic ID or a new Topic ID.`)
    .requiredOption(`--name <name>`, `Topic Name.`)
    .option(`--subscribe [subscribe...]`, `An array of role strings with subscribe permission. By default all users are granted with any subscribe permission. [learn more about roles](https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.`)
    .action(actionRunner(messagingCreateTopic))

messaging
    .command(`get-topic`)
    .description(`Get a topic by its unique ID. `)
    .requiredOption(`--topic-id <topic-id>`, `Topic ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(messagingGetTopic))

messaging
    .command(`update-topic`)
    .description(`Update a topic by its unique ID. `)
    .requiredOption(`--topic-id <topic-id>`, `Topic ID.`)
    .option(`--name <name>`, `Topic Name.`)
    .option(`--subscribe [subscribe...]`, `An array of role strings with subscribe permission. By default all users are granted with any subscribe permission. [learn more about roles](https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.`)
    .action(actionRunner(messagingUpdateTopic))

messaging
    .command(`delete-topic`)
    .description(`Delete a topic by its unique ID.`)
    .requiredOption(`--topic-id <topic-id>`, `Topic ID.`)
    .action(actionRunner(messagingDeleteTopic))

messaging
    .command(`list-topic-logs`)
    .description(`Get the topic activity logs listed by its unique ID.`)
    .requiredOption(`--topic-id <topic-id>`, `Topic ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(messagingListTopicLogs))

messaging
    .command(`list-subscribers`)
    .description(`Get a list of all subscribers from the current Appwrite project.`)
    .requiredOption(`--topic-id <topic-id>`, `Topic ID. The topic ID subscribed to.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, provider, type, enabled`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(messagingListSubscribers))

messaging
    .command(`create-subscriber`)
    .description(`Create a new subscriber.`)
    .requiredOption(`--topic-id <topic-id>`, `Topic ID. The topic ID to subscribe to.`)
    .requiredOption(`--subscriber-id <subscriber-id>`, `Subscriber ID. Choose a custom Subscriber ID or a new Subscriber ID.`)
    .requiredOption(`--target-id <target-id>`, `Target ID. The target ID to link to the specified Topic ID.`)
    .action(actionRunner(messagingCreateSubscriber))

messaging
    .command(`get-subscriber`)
    .description(`Get a subscriber by its unique ID. `)
    .requiredOption(`--topic-id <topic-id>`, `Topic ID. The topic ID subscribed to.`)
    .requiredOption(`--subscriber-id <subscriber-id>`, `Subscriber ID.`)
    .action(actionRunner(messagingGetSubscriber))

messaging
    .command(`delete-subscriber`)
    .description(`Delete a subscriber by its unique ID.`)
    .requiredOption(`--topic-id <topic-id>`, `Topic ID. The topic ID subscribed to.`)
    .requiredOption(`--subscriber-id <subscriber-id>`, `Subscriber ID.`)
    .action(actionRunner(messagingDeleteSubscriber))

module.exports = {
    messaging,
    messagingListMessages,
    messagingCreateEmail,
    messagingUpdateEmail,
    messagingCreatePush,
    messagingUpdatePush,
    messagingCreateSms,
    messagingUpdateSms,
    messagingGetMessage,
    messagingDelete,
    messagingListMessageLogs,
    messagingListTargets,
    messagingListProviders,
    messagingCreateApnsProvider,
    messagingUpdateApnsProvider,
    messagingCreateFcmProvider,
    messagingUpdateFcmProvider,
    messagingCreateMailgunProvider,
    messagingUpdateMailgunProvider,
    messagingCreateMsg91Provider,
    messagingUpdateMsg91Provider,
    messagingCreateSendgridProvider,
    messagingUpdateSendgridProvider,
    messagingCreateSmtpProvider,
    messagingUpdateSmtpProvider,
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
