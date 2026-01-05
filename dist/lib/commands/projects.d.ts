import { Client } from "@appwrite.io/console";
import { Command } from "commander";
import { Region, Api, AuthMethod, OAuthProvider, PlatformType, ApiService, SMTPSecure, EmailTemplateType, EmailTemplateLocale, SmsTemplateType, SmsTemplateLocale } from "@appwrite.io/console";
export declare const projects: Command;
interface ProjectsListRequestParams {
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const projectsList: ({ queries, search, total, parseOutput, overrideForCli, sdk, console: showConsole, }: ProjectsListRequestParams) => Promise<any>;
interface ProjectsCreateRequestParams {
    projectId: string;
    name: string;
    teamId: string;
    region?: Region;
    description?: string;
    logo?: string;
    url?: string;
    legalName?: string;
    legalCountry?: string;
    legalState?: string;
    legalCity?: string;
    legalAddress?: string;
    legalTaxId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsCreate: ({ projectId, name, teamId, region, description, logo, url, legalName, legalCountry, legalState, legalCity, legalAddress, legalTaxId, parseOutput, overrideForCli, sdk, }: ProjectsCreateRequestParams) => Promise<any>;
interface ProjectsGetRequestParams {
    projectId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const projectsGet: ({ projectId, parseOutput, overrideForCli, sdk, console: showConsole, }: ProjectsGetRequestParams) => Promise<any>;
interface ProjectsUpdateRequestParams {
    projectId: string;
    name: string;
    description?: string;
    logo?: string;
    url?: string;
    legalName?: string;
    legalCountry?: string;
    legalState?: string;
    legalCity?: string;
    legalAddress?: string;
    legalTaxId?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdate: ({ projectId, name, description, logo, url, legalName, legalCountry, legalState, legalCity, legalAddress, legalTaxId, parseOutput, overrideForCli, sdk, }: ProjectsUpdateRequestParams) => Promise<any>;
interface ProjectsDeleteRequestParams {
    projectId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsDelete: ({ projectId, parseOutput, overrideForCli, sdk, }: ProjectsDeleteRequestParams) => Promise<any>;
interface ProjectsUpdateAPIStatusRequestParams {
    projectId: string;
    api: Api;
    status: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateAPIStatus: ({ projectId, api, status, parseOutput, overrideForCli, sdk, }: ProjectsUpdateAPIStatusRequestParams) => Promise<any>;
interface ProjectsUpdateAPIStatusAllRequestParams {
    projectId: string;
    status: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateAPIStatusAll: ({ projectId, status, parseOutput, overrideForCli, sdk, }: ProjectsUpdateAPIStatusAllRequestParams) => Promise<any>;
interface ProjectsUpdateAuthDurationRequestParams {
    projectId: string;
    duration: number;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateAuthDuration: ({ projectId, duration, parseOutput, overrideForCli, sdk, }: ProjectsUpdateAuthDurationRequestParams) => Promise<any>;
interface ProjectsUpdateAuthLimitRequestParams {
    projectId: string;
    limit: number;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateAuthLimit: ({ projectId, limit, parseOutput, overrideForCli, sdk, }: ProjectsUpdateAuthLimitRequestParams) => Promise<any>;
interface ProjectsUpdateAuthSessionsLimitRequestParams {
    projectId: string;
    limit: number;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateAuthSessionsLimit: ({ projectId, limit, parseOutput, overrideForCli, sdk, }: ProjectsUpdateAuthSessionsLimitRequestParams) => Promise<any>;
interface ProjectsUpdateMembershipsPrivacyRequestParams {
    projectId: string;
    userName: boolean;
    userEmail: boolean;
    mfa: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateMembershipsPrivacy: ({ projectId, userName, userEmail, mfa, parseOutput, overrideForCli, sdk, }: ProjectsUpdateMembershipsPrivacyRequestParams) => Promise<any>;
interface ProjectsUpdateMockNumbersRequestParams {
    projectId: string;
    numbers: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateMockNumbers: ({ projectId, numbers, parseOutput, overrideForCli, sdk, }: ProjectsUpdateMockNumbersRequestParams) => Promise<any>;
interface ProjectsUpdateAuthPasswordDictionaryRequestParams {
    projectId: string;
    enabled: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateAuthPasswordDictionary: ({ projectId, enabled, parseOutput, overrideForCli, sdk, }: ProjectsUpdateAuthPasswordDictionaryRequestParams) => Promise<any>;
interface ProjectsUpdateAuthPasswordHistoryRequestParams {
    projectId: string;
    limit: number;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateAuthPasswordHistory: ({ projectId, limit, parseOutput, overrideForCli, sdk, }: ProjectsUpdateAuthPasswordHistoryRequestParams) => Promise<any>;
interface ProjectsUpdatePersonalDataCheckRequestParams {
    projectId: string;
    enabled: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdatePersonalDataCheck: ({ projectId, enabled, parseOutput, overrideForCli, sdk, }: ProjectsUpdatePersonalDataCheckRequestParams) => Promise<any>;
interface ProjectsUpdateSessionAlertsRequestParams {
    projectId: string;
    alerts: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateSessionAlerts: ({ projectId, alerts, parseOutput, overrideForCli, sdk, }: ProjectsUpdateSessionAlertsRequestParams) => Promise<any>;
interface ProjectsUpdateSessionInvalidationRequestParams {
    projectId: string;
    enabled: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateSessionInvalidation: ({ projectId, enabled, parseOutput, overrideForCli, sdk, }: ProjectsUpdateSessionInvalidationRequestParams) => Promise<any>;
interface ProjectsUpdateAuthStatusRequestParams {
    projectId: string;
    method: AuthMethod;
    status: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateAuthStatus: ({ projectId, method, status, parseOutput, overrideForCli, sdk, }: ProjectsUpdateAuthStatusRequestParams) => Promise<any>;
interface ProjectsListDevKeysRequestParams {
    projectId: string;
    queries?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const projectsListDevKeys: ({ projectId, queries, parseOutput, overrideForCli, sdk, console: showConsole, }: ProjectsListDevKeysRequestParams) => Promise<any>;
interface ProjectsCreateDevKeyRequestParams {
    projectId: string;
    name: string;
    expire: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsCreateDevKey: ({ projectId, name, expire, parseOutput, overrideForCli, sdk, }: ProjectsCreateDevKeyRequestParams) => Promise<any>;
interface ProjectsGetDevKeyRequestParams {
    projectId: string;
    keyId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const projectsGetDevKey: ({ projectId, keyId, parseOutput, overrideForCli, sdk, console: showConsole, }: ProjectsGetDevKeyRequestParams) => Promise<any>;
interface ProjectsUpdateDevKeyRequestParams {
    projectId: string;
    keyId: string;
    name: string;
    expire: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateDevKey: ({ projectId, keyId, name, expire, parseOutput, overrideForCli, sdk, }: ProjectsUpdateDevKeyRequestParams) => Promise<any>;
interface ProjectsDeleteDevKeyRequestParams {
    projectId: string;
    keyId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsDeleteDevKey: ({ projectId, keyId, parseOutput, overrideForCli, sdk, }: ProjectsDeleteDevKeyRequestParams) => Promise<any>;
interface ProjectsCreateJWTRequestParams {
    projectId: string;
    scopes: string[];
    duration?: number;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsCreateJWT: ({ projectId, scopes, duration, parseOutput, overrideForCli, sdk, }: ProjectsCreateJWTRequestParams) => Promise<any>;
interface ProjectsListKeysRequestParams {
    projectId: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const projectsListKeys: ({ projectId, total, parseOutput, overrideForCli, sdk, console: showConsole, }: ProjectsListKeysRequestParams) => Promise<any>;
interface ProjectsCreateKeyRequestParams {
    projectId: string;
    name: string;
    scopes: string[];
    expire?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsCreateKey: ({ projectId, name, scopes, expire, parseOutput, overrideForCli, sdk, }: ProjectsCreateKeyRequestParams) => Promise<any>;
interface ProjectsGetKeyRequestParams {
    projectId: string;
    keyId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const projectsGetKey: ({ projectId, keyId, parseOutput, overrideForCli, sdk, console: showConsole, }: ProjectsGetKeyRequestParams) => Promise<any>;
interface ProjectsUpdateKeyRequestParams {
    projectId: string;
    keyId: string;
    name: string;
    scopes: string[];
    expire?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateKey: ({ projectId, keyId, name, scopes, expire, parseOutput, overrideForCli, sdk, }: ProjectsUpdateKeyRequestParams) => Promise<any>;
interface ProjectsDeleteKeyRequestParams {
    projectId: string;
    keyId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsDeleteKey: ({ projectId, keyId, parseOutput, overrideForCli, sdk, }: ProjectsDeleteKeyRequestParams) => Promise<any>;
interface ProjectsUpdateOAuth2RequestParams {
    projectId: string;
    provider: OAuthProvider;
    appId?: string;
    secret?: string;
    enabled?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateOAuth2: ({ projectId, provider, appId, secret, enabled, parseOutput, overrideForCli, sdk, }: ProjectsUpdateOAuth2RequestParams) => Promise<any>;
interface ProjectsListPlatformsRequestParams {
    projectId: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const projectsListPlatforms: ({ projectId, total, parseOutput, overrideForCli, sdk, console: showConsole, }: ProjectsListPlatformsRequestParams) => Promise<any>;
interface ProjectsCreatePlatformRequestParams {
    projectId: string;
    type: PlatformType;
    name: string;
    key?: string;
    store?: string;
    hostname?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsCreatePlatform: ({ projectId, type, name, key, store, hostname, parseOutput, overrideForCli, sdk, }: ProjectsCreatePlatformRequestParams) => Promise<any>;
interface ProjectsGetPlatformRequestParams {
    projectId: string;
    platformId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const projectsGetPlatform: ({ projectId, platformId, parseOutput, overrideForCli, sdk, console: showConsole, }: ProjectsGetPlatformRequestParams) => Promise<any>;
interface ProjectsUpdatePlatformRequestParams {
    projectId: string;
    platformId: string;
    name: string;
    key?: string;
    store?: string;
    hostname?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdatePlatform: ({ projectId, platformId, name, key, store, hostname, parseOutput, overrideForCli, sdk, }: ProjectsUpdatePlatformRequestParams) => Promise<any>;
interface ProjectsDeletePlatformRequestParams {
    projectId: string;
    platformId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsDeletePlatform: ({ projectId, platformId, parseOutput, overrideForCli, sdk, }: ProjectsDeletePlatformRequestParams) => Promise<any>;
interface ProjectsUpdateServiceStatusRequestParams {
    projectId: string;
    service: ApiService;
    status: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateServiceStatus: ({ projectId, service, status, parseOutput, overrideForCli, sdk, }: ProjectsUpdateServiceStatusRequestParams) => Promise<any>;
interface ProjectsUpdateServiceStatusAllRequestParams {
    projectId: string;
    status: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateServiceStatusAll: ({ projectId, status, parseOutput, overrideForCli, sdk, }: ProjectsUpdateServiceStatusAllRequestParams) => Promise<any>;
interface ProjectsUpdateSMTPRequestParams {
    projectId: string;
    enabled: boolean;
    senderName?: string;
    senderEmail?: string;
    replyTo?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    secure?: SMTPSecure;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateSMTP: ({ projectId, enabled, senderName, senderEmail, replyTo, host, port, username, password, secure, parseOutput, overrideForCli, sdk, }: ProjectsUpdateSMTPRequestParams) => Promise<any>;
interface ProjectsCreateSMTPTestRequestParams {
    projectId: string;
    emails: string[];
    senderName: string;
    senderEmail: string;
    host: string;
    replyTo?: string;
    port?: number;
    username?: string;
    password?: string;
    secure?: SMTPSecure;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsCreateSMTPTest: ({ projectId, emails, senderName, senderEmail, host, replyTo, port, username, password, secure, parseOutput, overrideForCli, sdk, }: ProjectsCreateSMTPTestRequestParams) => Promise<any>;
interface ProjectsUpdateTeamRequestParams {
    projectId: string;
    teamId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateTeam: ({ projectId, teamId, parseOutput, overrideForCli, sdk, }: ProjectsUpdateTeamRequestParams) => Promise<any>;
interface ProjectsGetEmailTemplateRequestParams {
    projectId: string;
    type: EmailTemplateType;
    locale: EmailTemplateLocale;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsGetEmailTemplate: ({ projectId, type, locale, parseOutput, overrideForCli, sdk, }: ProjectsGetEmailTemplateRequestParams) => Promise<any>;
interface ProjectsUpdateEmailTemplateRequestParams {
    projectId: string;
    type: EmailTemplateType;
    locale: EmailTemplateLocale;
    subject: string;
    message: string;
    senderName?: string;
    senderEmail?: string;
    replyTo?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateEmailTemplate: ({ projectId, type, locale, subject, message, senderName, senderEmail, replyTo, parseOutput, overrideForCli, sdk, }: ProjectsUpdateEmailTemplateRequestParams) => Promise<any>;
interface ProjectsDeleteEmailTemplateRequestParams {
    projectId: string;
    type: EmailTemplateType;
    locale: EmailTemplateLocale;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsDeleteEmailTemplate: ({ projectId, type, locale, parseOutput, overrideForCli, sdk, }: ProjectsDeleteEmailTemplateRequestParams) => Promise<any>;
interface ProjectsGetSMSTemplateRequestParams {
    projectId: string;
    type: SmsTemplateType;
    locale: SmsTemplateLocale;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsGetSMSTemplate: ({ projectId, type, locale, parseOutput, overrideForCli, sdk, }: ProjectsGetSMSTemplateRequestParams) => Promise<any>;
interface ProjectsUpdateSMSTemplateRequestParams {
    projectId: string;
    type: SmsTemplateType;
    locale: SmsTemplateLocale;
    message: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateSMSTemplate: ({ projectId, type, locale, message, parseOutput, overrideForCli, sdk, }: ProjectsUpdateSMSTemplateRequestParams) => Promise<any>;
interface ProjectsDeleteSMSTemplateRequestParams {
    projectId: string;
    type: SmsTemplateType;
    locale: SmsTemplateLocale;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsDeleteSMSTemplate: ({ projectId, type, locale, parseOutput, overrideForCli, sdk, }: ProjectsDeleteSMSTemplateRequestParams) => Promise<any>;
interface ProjectsListWebhooksRequestParams {
    projectId: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const projectsListWebhooks: ({ projectId, total, parseOutput, overrideForCli, sdk, console: showConsole, }: ProjectsListWebhooksRequestParams) => Promise<any>;
interface ProjectsCreateWebhookRequestParams {
    projectId: string;
    name: string;
    events: string[];
    url: string;
    security: boolean;
    enabled?: boolean;
    httpUser?: string;
    httpPass?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsCreateWebhook: ({ projectId, name, events, url, security, enabled, httpUser, httpPass, parseOutput, overrideForCli, sdk, }: ProjectsCreateWebhookRequestParams) => Promise<any>;
interface ProjectsGetWebhookRequestParams {
    projectId: string;
    webhookId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const projectsGetWebhook: ({ projectId, webhookId, parseOutput, overrideForCli, sdk, console: showConsole, }: ProjectsGetWebhookRequestParams) => Promise<any>;
interface ProjectsUpdateWebhookRequestParams {
    projectId: string;
    webhookId: string;
    name: string;
    events: string[];
    url: string;
    security: boolean;
    enabled?: boolean;
    httpUser?: string;
    httpPass?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateWebhook: ({ projectId, webhookId, name, events, url, security, enabled, httpUser, httpPass, parseOutput, overrideForCli, sdk, }: ProjectsUpdateWebhookRequestParams) => Promise<any>;
interface ProjectsDeleteWebhookRequestParams {
    projectId: string;
    webhookId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsDeleteWebhook: ({ projectId, webhookId, parseOutput, overrideForCli, sdk, }: ProjectsDeleteWebhookRequestParams) => Promise<any>;
interface ProjectsUpdateWebhookSignatureRequestParams {
    projectId: string;
    webhookId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const projectsUpdateWebhookSignature: ({ projectId, webhookId, parseOutput, overrideForCli, sdk, }: ProjectsUpdateWebhookSignatureRequestParams) => Promise<any>;
export {};
//# sourceMappingURL=projects.d.ts.map