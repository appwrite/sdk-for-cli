import fs = require('fs');
import pathLib = require('path');
import tar = require('tar');
import ignore = require('ignore');
import { promisify } from 'util';
import Client from '../client';
import { getAllFiles, showConsoleLink } from '../utils';
import { Command } from 'commander';
import { sdkForProject, sdkForConsole } from '../sdks';
import { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log, warn } from '../parser';
import { localConfig, globalConfig } from '../config';
import { File } from 'undici';
import { ReadableStream } from 'stream/web';

function convertReadStreamToReadableStream(readStream: fs.ReadStream): ReadableStream {
  return new ReadableStream({
    start(controller) {
      readStream.on("data", (chunk: Buffer) => {
        controller.enqueue(chunk);
      });
      readStream.on("end", () => {
        controller.close();
      });
      readStream.on("error", (err: Error) => {
        controller.error(err);
      });
    },
    cancel() {
      readStream.destroy();
    },
  });
}

export const messaging = new Command("messaging").description(commandDescriptions['messaging'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

interface MessagingListMessagesRequestParams {
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const messagingListMessages = async ({queries,search,total,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: MessagingListMessagesRequestParams): Promise<any> => {
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
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('messaging', 'listMessages');
         } else {
            parse(response)
        }
    }

    return response;

}
interface MessagingCreateEmailRequestParams {
    messageId: string;
    subject: string;
    content: string;
    topics?: string[];
    users?: string[];
    targets?: string[];
    cc?: string[];
    bcc?: string[];
    attachments?: string[];
    draft?: boolean;
    html?: boolean;
    scheduledAt?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingCreateEmail = async ({messageId,subject,content,topics,users,targets,cc,bcc,attachments,draft,html,scheduledAt,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingCreateEmailRequestParams): Promise<any> => {
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
interface MessagingUpdateEmailRequestParams {
    messageId: string;
    topics?: string[];
    users?: string[];
    targets?: string[];
    subject?: string;
    content?: string;
    draft?: boolean;
    html?: boolean;
    cc?: string[];
    bcc?: string[];
    scheduledAt?: string;
    attachments?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingUpdateEmail = async ({messageId,topics,users,targets,subject,content,draft,html,cc,bcc,scheduledAt,attachments,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingUpdateEmailRequestParams): Promise<any> => {
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
interface MessagingCreatePushRequestParams {
    messageId: string;
    title?: string;
    body?: string;
    topics?: string[];
    users?: string[];
    targets?: string[];
    data?: object;
    action?: string;
    image?: string;
    icon?: string;
    sound?: string;
    color?: string;
    tag?: string;
    badge?: number;
    draft?: boolean;
    scheduledAt?: string;
    contentAvailable?: boolean;
    critical?: boolean;
    priority?: MessagePriority;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingCreatePush = async ({messageId,title,body,topics,users,targets,data,action,image,icon,sound,color,tag,badge,draft,scheduledAt,contentAvailable,critical,priority,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingCreatePushRequestParams): Promise<any> => {
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
    if (typeof contentAvailable !== 'undefined') {
        payload['contentAvailable'] = contentAvailable;
    }
    if (typeof critical !== 'undefined') {
        payload['critical'] = critical;
    }
    if (typeof priority !== 'undefined') {
        payload['priority'] = priority;
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
interface MessagingUpdatePushRequestParams {
    messageId: string;
    topics?: string[];
    users?: string[];
    targets?: string[];
    title?: string;
    body?: string;
    data?: object;
    action?: string;
    image?: string;
    icon?: string;
    sound?: string;
    color?: string;
    tag?: string;
    badge?: number;
    draft?: boolean;
    scheduledAt?: string;
    contentAvailable?: boolean;
    critical?: boolean;
    priority?: MessagePriority;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingUpdatePush = async ({messageId,topics,users,targets,title,body,data,action,image,icon,sound,color,tag,badge,draft,scheduledAt,contentAvailable,critical,priority,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingUpdatePushRequestParams): Promise<any> => {
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
    if (typeof contentAvailable !== 'undefined') {
        payload['contentAvailable'] = contentAvailable;
    }
    if (typeof critical !== 'undefined') {
        payload['critical'] = critical;
    }
    if (typeof priority !== 'undefined') {
        payload['priority'] = priority;
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
interface MessagingCreateSMSRequestParams {
    messageId: string;
    content: string;
    topics?: string[];
    users?: string[];
    targets?: string[];
    draft?: boolean;
    scheduledAt?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingCreateSMS = async ({messageId,content,topics,users,targets,draft,scheduledAt,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingCreateSMSRequestParams): Promise<any> => {
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
interface MessagingUpdateSMSRequestParams {
    messageId: string;
    topics?: string[];
    users?: string[];
    targets?: string[];
    content?: string;
    draft?: boolean;
    scheduledAt?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingUpdateSMS = async ({messageId,topics,users,targets,content,draft,scheduledAt,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingUpdateSMSRequestParams): Promise<any> => {
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
interface MessagingGetMessageRequestParams {
    messageId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const messagingGetMessage = async ({messageId,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: MessagingGetMessageRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/messages/{messageId}'.replace('{messageId}', messageId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('messaging', 'getMessage', messageId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface MessagingDeleteRequestParams {
    messageId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingDelete = async ({messageId,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingDeleteRequestParams): Promise<any> => {
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
interface MessagingListMessageLogsRequestParams {
    messageId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const messagingListMessageLogs = async ({messageId,queries,total,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: MessagingListMessageLogsRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/messages/{messageId}/logs'.replace('{messageId}', messageId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('messaging', 'listMessageLogs', messageId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface MessagingListTargetsRequestParams {
    messageId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingListTargets = async ({messageId,queries,total,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingListTargetsRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/messages/{messageId}/targets'.replace('{messageId}', messageId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
interface MessagingListProvidersRequestParams {
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const messagingListProviders = async ({queries,search,total,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: MessagingListProvidersRequestParams): Promise<any> => {
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
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('messaging', 'listProviders');
         } else {
            parse(response)
        }
    }

    return response;

}
interface MessagingCreateAPNSProviderRequestParams {
    providerId: string;
    name: string;
    authKey?: string;
    authKeyId?: string;
    teamId?: string;
    bundleId?: string;
    sandbox?: boolean;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingCreateAPNSProvider = async ({providerId,name,authKey,authKeyId,teamId,bundleId,sandbox,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingCreateAPNSProviderRequestParams): Promise<any> => {
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
interface MessagingUpdateAPNSProviderRequestParams {
    providerId: string;
    name?: string;
    enabled?: boolean;
    authKey?: string;
    authKeyId?: string;
    teamId?: string;
    bundleId?: string;
    sandbox?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingUpdateAPNSProvider = async ({providerId,name,enabled,authKey,authKeyId,teamId,bundleId,sandbox,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingUpdateAPNSProviderRequestParams): Promise<any> => {
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
interface MessagingCreateFCMProviderRequestParams {
    providerId: string;
    name: string;
    serviceAccountJSON?: object;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingCreateFCMProvider = async ({providerId,name,serviceAccountJSON,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingCreateFCMProviderRequestParams): Promise<any> => {
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
interface MessagingUpdateFCMProviderRequestParams {
    providerId: string;
    name?: string;
    enabled?: boolean;
    serviceAccountJSON?: object;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingUpdateFCMProvider = async ({providerId,name,enabled,serviceAccountJSON,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingUpdateFCMProviderRequestParams): Promise<any> => {
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
interface MessagingCreateMailgunProviderRequestParams {
    providerId: string;
    name: string;
    apiKey?: string;
    domain?: string;
    isEuRegion?: boolean;
    fromName?: string;
    fromEmail?: string;
    replyToName?: string;
    replyToEmail?: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingCreateMailgunProvider = async ({providerId,name,apiKey,domain,isEuRegion,fromName,fromEmail,replyToName,replyToEmail,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingCreateMailgunProviderRequestParams): Promise<any> => {
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
interface MessagingUpdateMailgunProviderRequestParams {
    providerId: string;
    name?: string;
    apiKey?: string;
    domain?: string;
    isEuRegion?: boolean;
    enabled?: boolean;
    fromName?: string;
    fromEmail?: string;
    replyToName?: string;
    replyToEmail?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingUpdateMailgunProvider = async ({providerId,name,apiKey,domain,isEuRegion,enabled,fromName,fromEmail,replyToName,replyToEmail,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingUpdateMailgunProviderRequestParams): Promise<any> => {
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
interface MessagingCreateMsg91ProviderRequestParams {
    providerId: string;
    name: string;
    templateId?: string;
    senderId?: string;
    authKey?: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingCreateMsg91Provider = async ({providerId,name,templateId,senderId,authKey,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingCreateMsg91ProviderRequestParams): Promise<any> => {
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
interface MessagingUpdateMsg91ProviderRequestParams {
    providerId: string;
    name?: string;
    enabled?: boolean;
    templateId?: string;
    senderId?: string;
    authKey?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingUpdateMsg91Provider = async ({providerId,name,enabled,templateId,senderId,authKey,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingUpdateMsg91ProviderRequestParams): Promise<any> => {
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
interface MessagingCreateResendProviderRequestParams {
    providerId: string;
    name: string;
    apiKey?: string;
    fromName?: string;
    fromEmail?: string;
    replyToName?: string;
    replyToEmail?: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingCreateResendProvider = async ({providerId,name,apiKey,fromName,fromEmail,replyToName,replyToEmail,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingCreateResendProviderRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/resend';
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
interface MessagingUpdateResendProviderRequestParams {
    providerId: string;
    name?: string;
    enabled?: boolean;
    apiKey?: string;
    fromName?: string;
    fromEmail?: string;
    replyToName?: string;
    replyToEmail?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingUpdateResendProvider = async ({providerId,name,enabled,apiKey,fromName,fromEmail,replyToName,replyToEmail,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingUpdateResendProviderRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/resend/{providerId}'.replace('{providerId}', providerId);
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
interface MessagingCreateSendgridProviderRequestParams {
    providerId: string;
    name: string;
    apiKey?: string;
    fromName?: string;
    fromEmail?: string;
    replyToName?: string;
    replyToEmail?: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingCreateSendgridProvider = async ({providerId,name,apiKey,fromName,fromEmail,replyToName,replyToEmail,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingCreateSendgridProviderRequestParams): Promise<any> => {
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
interface MessagingUpdateSendgridProviderRequestParams {
    providerId: string;
    name?: string;
    enabled?: boolean;
    apiKey?: string;
    fromName?: string;
    fromEmail?: string;
    replyToName?: string;
    replyToEmail?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingUpdateSendgridProvider = async ({providerId,name,enabled,apiKey,fromName,fromEmail,replyToName,replyToEmail,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingUpdateSendgridProviderRequestParams): Promise<any> => {
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
interface MessagingCreateSMTPProviderRequestParams {
    providerId: string;
    name: string;
    host: string;
    port?: number;
    username?: string;
    password?: string;
    encryption?: SmtpEncryption;
    autoTLS?: boolean;
    mailer?: string;
    fromName?: string;
    fromEmail?: string;
    replyToName?: string;
    replyToEmail?: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingCreateSMTPProvider = async ({providerId,name,host,port,username,password,encryption,autoTLS,mailer,fromName,fromEmail,replyToName,replyToEmail,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingCreateSMTPProviderRequestParams): Promise<any> => {
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
interface MessagingUpdateSMTPProviderRequestParams {
    providerId: string;
    name?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    encryption?: SmtpEncryption;
    autoTLS?: boolean;
    mailer?: string;
    fromName?: string;
    fromEmail?: string;
    replyToName?: string;
    replyToEmail?: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingUpdateSMTPProvider = async ({providerId,name,host,port,username,password,encryption,autoTLS,mailer,fromName,fromEmail,replyToName,replyToEmail,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingUpdateSMTPProviderRequestParams): Promise<any> => {
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
interface MessagingCreateTelesignProviderRequestParams {
    providerId: string;
    name: string;
    from?: string;
    customerId?: string;
    apiKey?: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingCreateTelesignProvider = async ({providerId,name,from,customerId,apiKey,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingCreateTelesignProviderRequestParams): Promise<any> => {
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
interface MessagingUpdateTelesignProviderRequestParams {
    providerId: string;
    name?: string;
    enabled?: boolean;
    customerId?: string;
    apiKey?: string;
    from?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingUpdateTelesignProvider = async ({providerId,name,enabled,customerId,apiKey,from,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingUpdateTelesignProviderRequestParams): Promise<any> => {
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
interface MessagingCreateTextmagicProviderRequestParams {
    providerId: string;
    name: string;
    from?: string;
    username?: string;
    apiKey?: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingCreateTextmagicProvider = async ({providerId,name,from,username,apiKey,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingCreateTextmagicProviderRequestParams): Promise<any> => {
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
interface MessagingUpdateTextmagicProviderRequestParams {
    providerId: string;
    name?: string;
    enabled?: boolean;
    username?: string;
    apiKey?: string;
    from?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingUpdateTextmagicProvider = async ({providerId,name,enabled,username,apiKey,from,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingUpdateTextmagicProviderRequestParams): Promise<any> => {
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
interface MessagingCreateTwilioProviderRequestParams {
    providerId: string;
    name: string;
    from?: string;
    accountSid?: string;
    authToken?: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingCreateTwilioProvider = async ({providerId,name,from,accountSid,authToken,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingCreateTwilioProviderRequestParams): Promise<any> => {
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
interface MessagingUpdateTwilioProviderRequestParams {
    providerId: string;
    name?: string;
    enabled?: boolean;
    accountSid?: string;
    authToken?: string;
    from?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingUpdateTwilioProvider = async ({providerId,name,enabled,accountSid,authToken,from,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingUpdateTwilioProviderRequestParams): Promise<any> => {
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
interface MessagingCreateVonageProviderRequestParams {
    providerId: string;
    name: string;
    from?: string;
    apiKey?: string;
    apiSecret?: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingCreateVonageProvider = async ({providerId,name,from,apiKey,apiSecret,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingCreateVonageProviderRequestParams): Promise<any> => {
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
interface MessagingUpdateVonageProviderRequestParams {
    providerId: string;
    name?: string;
    enabled?: boolean;
    apiKey?: string;
    apiSecret?: string;
    from?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingUpdateVonageProvider = async ({providerId,name,enabled,apiKey,apiSecret,from,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingUpdateVonageProviderRequestParams): Promise<any> => {
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
interface MessagingGetProviderRequestParams {
    providerId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const messagingGetProvider = async ({providerId,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: MessagingGetProviderRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/{providerId}'.replace('{providerId}', providerId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('messaging', 'getProvider', providerId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface MessagingDeleteProviderRequestParams {
    providerId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingDeleteProvider = async ({providerId,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingDeleteProviderRequestParams): Promise<any> => {
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
interface MessagingListProviderLogsRequestParams {
    providerId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingListProviderLogs = async ({providerId,queries,total,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingListProviderLogsRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/providers/{providerId}/logs'.replace('{providerId}', providerId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
interface MessagingListSubscriberLogsRequestParams {
    subscriberId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingListSubscriberLogs = async ({subscriberId,queries,total,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingListSubscriberLogsRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/subscribers/{subscriberId}/logs'.replace('{subscriberId}', subscriberId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
interface MessagingListTopicsRequestParams {
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const messagingListTopics = async ({queries,search,total,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: MessagingListTopicsRequestParams): Promise<any> => {
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
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('messaging', 'listTopics');
         } else {
            parse(response)
        }
    }

    return response;

}
interface MessagingCreateTopicRequestParams {
    topicId: string;
    name: string;
    subscribe?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingCreateTopic = async ({topicId,name,subscribe,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingCreateTopicRequestParams): Promise<any> => {
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
interface MessagingGetTopicRequestParams {
    topicId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const messagingGetTopic = async ({topicId,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: MessagingGetTopicRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/topics/{topicId}'.replace('{topicId}', topicId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('messaging', 'getTopic', topicId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface MessagingUpdateTopicRequestParams {
    topicId: string;
    name?: string;
    subscribe?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingUpdateTopic = async ({topicId,name,subscribe,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingUpdateTopicRequestParams): Promise<any> => {
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
interface MessagingDeleteTopicRequestParams {
    topicId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingDeleteTopic = async ({topicId,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingDeleteTopicRequestParams): Promise<any> => {
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
interface MessagingListTopicLogsRequestParams {
    topicId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingListTopicLogs = async ({topicId,queries,total,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingListTopicLogsRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/topics/{topicId}/logs'.replace('{topicId}', topicId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
interface MessagingListSubscribersRequestParams {
    topicId: string;
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const messagingListSubscribers = async ({topicId,queries,search,total,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: MessagingListSubscribersRequestParams): Promise<any> => {
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
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('messaging', 'listSubscribers', topicId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface MessagingCreateSubscriberRequestParams {
    topicId: string;
    subscriberId: string;
    targetId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingCreateSubscriber = async ({topicId,subscriberId,targetId,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingCreateSubscriberRequestParams): Promise<any> => {
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
interface MessagingGetSubscriberRequestParams {
    topicId: string;
    subscriberId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingGetSubscriber = async ({topicId,subscriberId,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingGetSubscriberRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/messaging/topics/{topicId}/subscribers/{subscriberId}'.replace('{topicId}', topicId).replace('{subscriberId}', subscriberId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
interface MessagingDeleteSubscriberRequestParams {
    topicId: string;
    subscriberId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const messagingDeleteSubscriber = async ({topicId,subscriberId,parseOutput = true, overrideForCli = false, sdk = undefined}: MessagingDeleteSubscriberRequestParams): Promise<any> => {
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
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .option(`--draft [value]`, `Is message a draft`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--html [value]`, `Is content of type HTML`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--scheduled-at <scheduled-at>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .action(actionRunner(messagingCreateEmail))

messaging
    .command(`update-email`)
    .description(`Update an email message by its unique ID. This endpoint only works on messages that are in draft status. Messages that are already processing, sent, or failed cannot be updated. `)
    .requiredOption(`--message-id <message-id>`, `Message ID.`)
    .option(`--topics [topics...]`, `List of Topic IDs.`)
    .option(`--users [users...]`, `List of User IDs.`)
    .option(`--targets [targets...]`, `List of Targets IDs.`)
    .option(`--subject <subject>`, `Email Subject.`)
    .option(`--content <content>`, `Email Content.`)
    .option(`--draft [value]`, `Is message a draft`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--html [value]`, `Is content of type HTML`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--cc [cc...]`, `Array of target IDs to be added as CC.`)
    .option(`--bcc [bcc...]`, `Array of target IDs to be added as BCC.`)
    .option(`--scheduled-at <scheduled-at>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .option(`--attachments [attachments...]`, `Array of compound ID strings of bucket IDs and file IDs to be attached to the email. They should be formatted as <BUCKET_ID>:<FILE_ID>.`)
    .action(actionRunner(messagingUpdateEmail))

messaging
    .command(`create-push`)
    .description(`Create a new push notification.`)
    .requiredOption(`--message-id <message-id>`, `Message ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .option(`--title <title>`, `Title for push notification.`)
    .option(`--body <body>`, `Body for push notification.`)
    .option(`--topics [topics...]`, `List of Topic IDs.`)
    .option(`--users [users...]`, `List of User IDs.`)
    .option(`--targets [targets...]`, `List of Targets IDs.`)
    .option(`--data <data>`, `Additional key-value pair data for push notification.`)
    .option(`--action <action>`, `Action for push notification.`)
    .option(`--image <image>`, `Image for push notification. Must be a compound bucket ID to file ID of a jpeg, png, or bmp image in Appwrite Storage. It should be formatted as <BUCKET_ID>:<FILE_ID>.`)
    .option(`--icon <icon>`, `Icon for push notification. Available only for Android and Web Platform.`)
    .option(`--sound <sound>`, `Sound for push notification. Available only for Android and iOS Platform.`)
    .option(`--color <color>`, `Color for push notification. Available only for Android Platform.`)
    .option(`--tag <tag>`, `Tag for push notification. Available only for Android Platform.`)
    .option(`--badge <badge>`, `Badge for push notification. Available only for iOS Platform.`, parseInteger)
    .option(`--draft [value]`, `Is message a draft`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--scheduled-at <scheduled-at>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .option(`--content-available [value]`, `If set to true, the notification will be delivered in the background. Available only for iOS Platform.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--critical [value]`, `If set to true, the notification will be marked as critical. This requires the app to have the critical notification entitlement. Available only for iOS Platform.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--priority <priority>`, `Set the notification priority. "normal" will consider device state and may not deliver notifications immediately. "high" will always attempt to immediately deliver the notification.`)
    .action(actionRunner(messagingCreatePush))

messaging
    .command(`update-push`)
    .description(`Update a push notification by its unique ID. This endpoint only works on messages that are in draft status. Messages that are already processing, sent, or failed cannot be updated. `)
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
    .option(`--draft [value]`, `Is message a draft`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--scheduled-at <scheduled-at>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .option(`--content-available [value]`, `If set to true, the notification will be delivered in the background. Available only for iOS Platform.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--critical [value]`, `If set to true, the notification will be marked as critical. This requires the app to have the critical notification entitlement. Available only for iOS Platform.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--priority <priority>`, `Set the notification priority. "normal" will consider device battery state and may send notifications later. "high" will always attempt to immediately deliver the notification.`)
    .action(actionRunner(messagingUpdatePush))

messaging
    .command(`create-sms`)
    .description(`Create a new SMS message.`)
    .requiredOption(`--message-id <message-id>`, `Message ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--content <content>`, `SMS Content.`)
    .option(`--topics [topics...]`, `List of Topic IDs.`)
    .option(`--users [users...]`, `List of User IDs.`)
    .option(`--targets [targets...]`, `List of Targets IDs.`)
    .option(`--draft [value]`, `Is message a draft`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--scheduled-at <scheduled-at>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .action(actionRunner(messagingCreateSMS))

messaging
    .command(`update-sms`)
    .description(`Update an SMS message by its unique ID. This endpoint only works on messages that are in draft status. Messages that are already processing, sent, or failed cannot be updated. `)
    .requiredOption(`--message-id <message-id>`, `Message ID.`)
    .option(`--topics [topics...]`, `List of Topic IDs.`)
    .option(`--users [users...]`, `List of User IDs.`)
    .option(`--targets [targets...]`, `List of Targets IDs.`)
    .option(`--content <content>`, `Email Content.`)
    .option(`--draft [value]`, `Is message a draft`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--scheduled-at <scheduled-at>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
    .action(actionRunner(messagingUpdateSMS))

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
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(messagingListMessageLogs))

messaging
    .command(`list-targets`)
    .description(`Get a list of the targets associated with a message.`)
    .requiredOption(`--message-id <message-id>`, `Message ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, providerId, identifier, providerType`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(messagingListTargets))

messaging
    .command(`list-providers`)
    .description(`Get a list of all providers from the current Appwrite project.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, provider, type, enabled`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .option(`--sandbox [value]`, `Use APNS sandbox environment.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(messagingCreateAPNSProvider))

messaging
    .command(`update-apns-provider`)
    .description(`Update a Apple Push Notification service provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--auth-key <auth-key>`, `APNS authentication key.`)
    .option(`--auth-key-id <auth-key-id>`, `APNS authentication key ID.`)
    .option(`--team-id <team-id>`, `APNS team ID.`)
    .option(`--bundle-id <bundle-id>`, `APNS bundle ID.`)
    .option(`--sandbox [value]`, `Use APNS sandbox environment.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(messagingUpdateAPNSProvider))

messaging
    .command(`create-fcm-provider`)
    .description(`Create a new Firebase Cloud Messaging provider.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--service-account-json <service-account-json>`, `FCM service account JSON.`)
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(messagingCreateFCMProvider))

messaging
    .command(`update-fcm-provider`)
    .description(`Update a Firebase Cloud Messaging provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--service-account-json <service-account-json>`, `FCM service account JSON.`)
    .action(actionRunner(messagingUpdateFCMProvider))

messaging
    .command(`create-mailgun-provider`)
    .description(`Create a new Mailgun provider.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--api-key <api-key>`, `Mailgun API Key.`)
    .option(`--domain <domain>`, `Mailgun Domain.`)
    .option(`--is-eu-region [value]`, `Set as EU region.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--from-name <from-name>`, `Sender Name.`)
    .option(`--from-email <from-email>`, `Sender email address.`)
    .option(`--reply-to-name <reply-to-name>`, `Name set in the reply to field for the mail. Default value is sender name. Reply to name must have reply to email as well.`)
    .option(`--reply-to-email <reply-to-email>`, `Email set in the reply to field for the mail. Default value is sender email. Reply to email must have reply to name as well.`)
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(messagingCreateMailgunProvider))

messaging
    .command(`update-mailgun-provider`)
    .description(`Update a Mailgun provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--api-key <api-key>`, `Mailgun API Key.`)
    .option(`--domain <domain>`, `Mailgun Domain.`)
    .option(`--is-eu-region [value]`, `Set as EU region.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(messagingCreateMsg91Provider))

messaging
    .command(`update-msg-91-provider`)
    .description(`Update a MSG91 provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--template-id <template-id>`, `Msg91 template ID.`)
    .option(`--sender-id <sender-id>`, `Msg91 sender ID.`)
    .option(`--auth-key <auth-key>`, `Msg91 auth key.`)
    .action(actionRunner(messagingUpdateMsg91Provider))

messaging
    .command(`create-resend-provider`)
    .description(`Create a new Resend provider.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--api-key <api-key>`, `Resend API key.`)
    .option(`--from-name <from-name>`, `Sender Name.`)
    .option(`--from-email <from-email>`, `Sender email address.`)
    .option(`--reply-to-name <reply-to-name>`, `Name set in the reply to field for the mail. Default value is sender name.`)
    .option(`--reply-to-email <reply-to-email>`, `Email set in the reply to field for the mail. Default value is sender email.`)
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(messagingCreateResendProvider))

messaging
    .command(`update-resend-provider`)
    .description(`Update a Resend provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--api-key <api-key>`, `Resend API key.`)
    .option(`--from-name <from-name>`, `Sender Name.`)
    .option(`--from-email <from-email>`, `Sender email address.`)
    .option(`--reply-to-name <reply-to-name>`, `Name set in the Reply To field for the mail. Default value is Sender Name.`)
    .option(`--reply-to-email <reply-to-email>`, `Email set in the Reply To field for the mail. Default value is Sender Email.`)
    .action(actionRunner(messagingUpdateResendProvider))

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
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(messagingCreateSendgridProvider))

messaging
    .command(`update-sendgrid-provider`)
    .description(`Update a Sendgrid provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .option(`--auto-tls [value]`, `Enable SMTP AutoTLS feature.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--mailer <mailer>`, `The value to use for the X-Mailer header.`)
    .option(`--from-name <from-name>`, `Sender Name.`)
    .option(`--from-email <from-email>`, `Sender email address.`)
    .option(`--reply-to-name <reply-to-name>`, `Name set in the reply to field for the mail. Default value is sender name.`)
    .option(`--reply-to-email <reply-to-email>`, `Email set in the reply to field for the mail. Default value is sender email.`)
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(messagingCreateSMTPProvider))

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
    .option(`--auto-tls [value]`, `Enable SMTP AutoTLS feature.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--mailer <mailer>`, `The value to use for the X-Mailer header.`)
    .option(`--from-name <from-name>`, `Sender Name.`)
    .option(`--from-email <from-email>`, `Sender email address.`)
    .option(`--reply-to-name <reply-to-name>`, `Name set in the Reply To field for the mail. Default value is Sender Name.`)
    .option(`--reply-to-email <reply-to-email>`, `Email set in the Reply To field for the mail. Default value is Sender Email.`)
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(messagingUpdateSMTPProvider))

messaging
    .command(`create-telesign-provider`)
    .description(`Create a new Telesign provider.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Provider name.`)
    .option(`--from <from>`, `Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
    .option(`--customer-id <customer-id>`, `Telesign customer ID.`)
    .option(`--api-key <api-key>`, `Telesign API key.`)
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(messagingCreateTelesignProvider))

messaging
    .command(`update-telesign-provider`)
    .description(`Update a Telesign provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(messagingCreateTextmagicProvider))

messaging
    .command(`update-textmagic-provider`)
    .description(`Update a Textmagic provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(messagingCreateTwilioProvider))

messaging
    .command(`update-twilio-provider`)
    .description(`Update a Twilio provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(messagingCreateVonageProvider))

messaging
    .command(`update-vonage-provider`)
    .description(`Update a Vonage provider by its unique ID.`)
    .requiredOption(`--provider-id <provider-id>`, `Provider ID.`)
    .option(`--name <name>`, `Provider name.`)
    .option(`--enabled [value]`, `Set as enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(messagingListProviderLogs))

messaging
    .command(`list-subscriber-logs`)
    .description(`Get the subscriber activity logs listed by its unique ID.`)
    .requiredOption(`--subscriber-id <subscriber-id>`, `Subscriber ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(messagingListSubscriberLogs))

messaging
    .command(`list-topics`)
    .description(`Get a list of all topics from the current Appwrite project.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, description, emailTotal, smsTotal, pushTotal`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(messagingListTopicLogs))

messaging
    .command(`list-subscribers`)
    .description(`Get a list of all subscribers from the current Appwrite project.`)
    .requiredOption(`--topic-id <topic-id>`, `Topic ID. The topic ID subscribed to.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, provider, type, enabled`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
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


