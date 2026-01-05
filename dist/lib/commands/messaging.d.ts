import { Client } from "@appwrite.io/console";
import { Command } from "commander";
import { MessagePriority, SmtpEncryption } from "@appwrite.io/console";
export declare const messaging: Command;
interface MessagingListMessagesRequestParams {
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const messagingListMessages: ({ queries, search, total, parseOutput, overrideForCli, sdk, console: showConsole, }: MessagingListMessagesRequestParams) => Promise<any>;
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
export declare const messagingCreateEmail: ({ messageId, subject, content, topics, users, targets, cc, bcc, attachments, draft, html, scheduledAt, parseOutput, overrideForCli, sdk, }: MessagingCreateEmailRequestParams) => Promise<any>;
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
export declare const messagingUpdateEmail: ({ messageId, topics, users, targets, subject, content, draft, html, cc, bcc, scheduledAt, attachments, parseOutput, overrideForCli, sdk, }: MessagingUpdateEmailRequestParams) => Promise<any>;
interface MessagingCreatePushRequestParams {
    messageId: string;
    title?: string;
    body?: string;
    topics?: string[];
    users?: string[];
    targets?: string[];
    data?: string;
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
export declare const messagingCreatePush: ({ messageId, title, body, topics, users, targets, data, action, image, icon, sound, color, tag, badge, draft, scheduledAt, contentAvailable, critical, priority, parseOutput, overrideForCli, sdk, }: MessagingCreatePushRequestParams) => Promise<any>;
interface MessagingUpdatePushRequestParams {
    messageId: string;
    topics?: string[];
    users?: string[];
    targets?: string[];
    title?: string;
    body?: string;
    data?: string;
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
export declare const messagingUpdatePush: ({ messageId, topics, users, targets, title, body, data, action, image, icon, sound, color, tag, badge, draft, scheduledAt, contentAvailable, critical, priority, parseOutput, overrideForCli, sdk, }: MessagingUpdatePushRequestParams) => Promise<any>;
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
export declare const messagingCreateSMS: ({ messageId, content, topics, users, targets, draft, scheduledAt, parseOutput, overrideForCli, sdk, }: MessagingCreateSMSRequestParams) => Promise<any>;
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
export declare const messagingUpdateSMS: ({ messageId, topics, users, targets, content, draft, scheduledAt, parseOutput, overrideForCli, sdk, }: MessagingUpdateSMSRequestParams) => Promise<any>;
interface MessagingGetMessageRequestParams {
    messageId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const messagingGetMessage: ({ messageId, parseOutput, overrideForCli, sdk, console: showConsole, }: MessagingGetMessageRequestParams) => Promise<any>;
interface MessagingDeleteRequestParams {
    messageId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const messagingDelete: ({ messageId, parseOutput, overrideForCli, sdk, }: MessagingDeleteRequestParams) => Promise<any>;
interface MessagingListMessageLogsRequestParams {
    messageId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const messagingListMessageLogs: ({ messageId, queries, total, parseOutput, overrideForCli, sdk, console: showConsole, }: MessagingListMessageLogsRequestParams) => Promise<any>;
interface MessagingListTargetsRequestParams {
    messageId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const messagingListTargets: ({ messageId, queries, total, parseOutput, overrideForCli, sdk, }: MessagingListTargetsRequestParams) => Promise<any>;
interface MessagingListProvidersRequestParams {
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const messagingListProviders: ({ queries, search, total, parseOutput, overrideForCli, sdk, console: showConsole, }: MessagingListProvidersRequestParams) => Promise<any>;
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
export declare const messagingCreateAPNSProvider: ({ providerId, name, authKey, authKeyId, teamId, bundleId, sandbox, enabled, parseOutput, overrideForCli, sdk, }: MessagingCreateAPNSProviderRequestParams) => Promise<any>;
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
export declare const messagingUpdateAPNSProvider: ({ providerId, name, enabled, authKey, authKeyId, teamId, bundleId, sandbox, parseOutput, overrideForCli, sdk, }: MessagingUpdateAPNSProviderRequestParams) => Promise<any>;
interface MessagingCreateFCMProviderRequestParams {
    providerId: string;
    name: string;
    serviceAccountJSON?: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const messagingCreateFCMProvider: ({ providerId, name, serviceAccountJSON, enabled, parseOutput, overrideForCli, sdk, }: MessagingCreateFCMProviderRequestParams) => Promise<any>;
interface MessagingUpdateFCMProviderRequestParams {
    providerId: string;
    name?: string;
    enabled?: boolean;
    serviceAccountJSON?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const messagingUpdateFCMProvider: ({ providerId, name, enabled, serviceAccountJSON, parseOutput, overrideForCli, sdk, }: MessagingUpdateFCMProviderRequestParams) => Promise<any>;
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
export declare const messagingCreateMailgunProvider: ({ providerId, name, apiKey, domain, isEuRegion, fromName, fromEmail, replyToName, replyToEmail, enabled, parseOutput, overrideForCli, sdk, }: MessagingCreateMailgunProviderRequestParams) => Promise<any>;
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
export declare const messagingUpdateMailgunProvider: ({ providerId, name, apiKey, domain, isEuRegion, enabled, fromName, fromEmail, replyToName, replyToEmail, parseOutput, overrideForCli, sdk, }: MessagingUpdateMailgunProviderRequestParams) => Promise<any>;
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
export declare const messagingCreateMsg91Provider: ({ providerId, name, templateId, senderId, authKey, enabled, parseOutput, overrideForCli, sdk, }: MessagingCreateMsg91ProviderRequestParams) => Promise<any>;
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
export declare const messagingUpdateMsg91Provider: ({ providerId, name, enabled, templateId, senderId, authKey, parseOutput, overrideForCli, sdk, }: MessagingUpdateMsg91ProviderRequestParams) => Promise<any>;
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
export declare const messagingCreateResendProvider: ({ providerId, name, apiKey, fromName, fromEmail, replyToName, replyToEmail, enabled, parseOutput, overrideForCli, sdk, }: MessagingCreateResendProviderRequestParams) => Promise<any>;
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
export declare const messagingUpdateResendProvider: ({ providerId, name, enabled, apiKey, fromName, fromEmail, replyToName, replyToEmail, parseOutput, overrideForCli, sdk, }: MessagingUpdateResendProviderRequestParams) => Promise<any>;
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
export declare const messagingCreateSendgridProvider: ({ providerId, name, apiKey, fromName, fromEmail, replyToName, replyToEmail, enabled, parseOutput, overrideForCli, sdk, }: MessagingCreateSendgridProviderRequestParams) => Promise<any>;
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
export declare const messagingUpdateSendgridProvider: ({ providerId, name, enabled, apiKey, fromName, fromEmail, replyToName, replyToEmail, parseOutput, overrideForCli, sdk, }: MessagingUpdateSendgridProviderRequestParams) => Promise<any>;
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
export declare const messagingCreateSMTPProvider: ({ providerId, name, host, port, username, password, encryption, autoTLS, mailer, fromName, fromEmail, replyToName, replyToEmail, enabled, parseOutput, overrideForCli, sdk, }: MessagingCreateSMTPProviderRequestParams) => Promise<any>;
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
export declare const messagingUpdateSMTPProvider: ({ providerId, name, host, port, username, password, encryption, autoTLS, mailer, fromName, fromEmail, replyToName, replyToEmail, enabled, parseOutput, overrideForCli, sdk, }: MessagingUpdateSMTPProviderRequestParams) => Promise<any>;
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
export declare const messagingCreateTelesignProvider: ({ providerId, name, from, customerId, apiKey, enabled, parseOutput, overrideForCli, sdk, }: MessagingCreateTelesignProviderRequestParams) => Promise<any>;
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
export declare const messagingUpdateTelesignProvider: ({ providerId, name, enabled, customerId, apiKey, from, parseOutput, overrideForCli, sdk, }: MessagingUpdateTelesignProviderRequestParams) => Promise<any>;
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
export declare const messagingCreateTextmagicProvider: ({ providerId, name, from, username, apiKey, enabled, parseOutput, overrideForCli, sdk, }: MessagingCreateTextmagicProviderRequestParams) => Promise<any>;
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
export declare const messagingUpdateTextmagicProvider: ({ providerId, name, enabled, username, apiKey, from, parseOutput, overrideForCli, sdk, }: MessagingUpdateTextmagicProviderRequestParams) => Promise<any>;
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
export declare const messagingCreateTwilioProvider: ({ providerId, name, from, accountSid, authToken, enabled, parseOutput, overrideForCli, sdk, }: MessagingCreateTwilioProviderRequestParams) => Promise<any>;
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
export declare const messagingUpdateTwilioProvider: ({ providerId, name, enabled, accountSid, authToken, from, parseOutput, overrideForCli, sdk, }: MessagingUpdateTwilioProviderRequestParams) => Promise<any>;
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
export declare const messagingCreateVonageProvider: ({ providerId, name, from, apiKey, apiSecret, enabled, parseOutput, overrideForCli, sdk, }: MessagingCreateVonageProviderRequestParams) => Promise<any>;
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
export declare const messagingUpdateVonageProvider: ({ providerId, name, enabled, apiKey, apiSecret, from, parseOutput, overrideForCli, sdk, }: MessagingUpdateVonageProviderRequestParams) => Promise<any>;
interface MessagingGetProviderRequestParams {
    providerId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const messagingGetProvider: ({ providerId, parseOutput, overrideForCli, sdk, console: showConsole, }: MessagingGetProviderRequestParams) => Promise<any>;
interface MessagingDeleteProviderRequestParams {
    providerId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const messagingDeleteProvider: ({ providerId, parseOutput, overrideForCli, sdk, }: MessagingDeleteProviderRequestParams) => Promise<any>;
interface MessagingListProviderLogsRequestParams {
    providerId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const messagingListProviderLogs: ({ providerId, queries, total, parseOutput, overrideForCli, sdk, }: MessagingListProviderLogsRequestParams) => Promise<any>;
interface MessagingListSubscriberLogsRequestParams {
    subscriberId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const messagingListSubscriberLogs: ({ subscriberId, queries, total, parseOutput, overrideForCli, sdk, }: MessagingListSubscriberLogsRequestParams) => Promise<any>;
interface MessagingListTopicsRequestParams {
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const messagingListTopics: ({ queries, search, total, parseOutput, overrideForCli, sdk, console: showConsole, }: MessagingListTopicsRequestParams) => Promise<any>;
interface MessagingCreateTopicRequestParams {
    topicId: string;
    name: string;
    subscribe?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const messagingCreateTopic: ({ topicId, name, subscribe, parseOutput, overrideForCli, sdk, }: MessagingCreateTopicRequestParams) => Promise<any>;
interface MessagingGetTopicRequestParams {
    topicId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const messagingGetTopic: ({ topicId, parseOutput, overrideForCli, sdk, console: showConsole, }: MessagingGetTopicRequestParams) => Promise<any>;
interface MessagingUpdateTopicRequestParams {
    topicId: string;
    name?: string;
    subscribe?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const messagingUpdateTopic: ({ topicId, name, subscribe, parseOutput, overrideForCli, sdk, }: MessagingUpdateTopicRequestParams) => Promise<any>;
interface MessagingDeleteTopicRequestParams {
    topicId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const messagingDeleteTopic: ({ topicId, parseOutput, overrideForCli, sdk, }: MessagingDeleteTopicRequestParams) => Promise<any>;
interface MessagingListTopicLogsRequestParams {
    topicId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const messagingListTopicLogs: ({ topicId, queries, total, parseOutput, overrideForCli, sdk, }: MessagingListTopicLogsRequestParams) => Promise<any>;
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
export declare const messagingListSubscribers: ({ topicId, queries, search, total, parseOutput, overrideForCli, sdk, console: showConsole, }: MessagingListSubscribersRequestParams) => Promise<any>;
interface MessagingCreateSubscriberRequestParams {
    topicId: string;
    subscriberId: string;
    targetId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const messagingCreateSubscriber: ({ topicId, subscriberId, targetId, parseOutput, overrideForCli, sdk, }: MessagingCreateSubscriberRequestParams) => Promise<any>;
interface MessagingGetSubscriberRequestParams {
    topicId: string;
    subscriberId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const messagingGetSubscriber: ({ topicId, subscriberId, parseOutput, overrideForCli, sdk, }: MessagingGetSubscriberRequestParams) => Promise<any>;
interface MessagingDeleteSubscriberRequestParams {
    topicId: string;
    subscriberId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const messagingDeleteSubscriber: ({ topicId, subscriberId, parseOutput, overrideForCli, sdk, }: MessagingDeleteSubscriberRequestParams) => Promise<any>;
export {};
//# sourceMappingURL=messaging.d.ts.map