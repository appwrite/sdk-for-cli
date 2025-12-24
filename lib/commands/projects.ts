import fs = require('fs');
import pathLib = require('path');
import tar = require('tar');
import ignore from 'ignore';
import { promisify } from 'util';
import Client from '../client';
import { getAllFiles, showConsoleLink } from '../utils';
import { Command } from 'commander';
import { sdkForProject, sdkForConsole } from '../sdks';
import { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log, warn } from '../parser';
import { localConfig, globalConfig } from '../config';
import { File } from 'undici';
import { ReadableStream } from 'stream/web';
import type { UploadProgress, FileInput } from '../types';
import { Region } from '../enums/region';
import { Api } from '../enums/api';
import { AuthMethod } from '../enums/auth-method';
import { OAuthProvider } from '../enums/o-auth-provider';
import { PlatformType } from '../enums/platform-type';
import { ApiService } from '../enums/api-service';
import { SMTPSecure } from '../enums/smtp-secure';
import { EmailTemplateType } from '../enums/email-template-type';
import { EmailTemplateLocale } from '../enums/email-template-locale';
import { SmsTemplateType } from '../enums/sms-template-type';
import { SmsTemplateLocale } from '../enums/sms-template-locale';

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

export const projects = new Command("projects").description(commandDescriptions['projects'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

interface ProjectsListRequestParams {
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const projectsList = async ({queries,search,total,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: ProjectsListRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects';
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
            showConsoleLink('projects', 'list');
         } else {
            parse(response)
        }
    }

    return response;

}
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

export const projectsCreate = async ({projectId,name,teamId,region,description,logo,url,legalName,legalCountry,legalState,legalCity,legalAddress,legalTaxId,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsCreateRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects';
    let payload = {};
    if (typeof projectId !== 'undefined') {
        payload['projectId'] = projectId;
    }
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof teamId !== 'undefined') {
        payload['teamId'] = teamId;
    }
    if (typeof region !== 'undefined') {
        payload['region'] = region;
    }
    if (typeof description !== 'undefined') {
        payload['description'] = description;
    }
    if (typeof logo !== 'undefined') {
        payload['logo'] = logo;
    }
    if (typeof url !== 'undefined') {
        payload['url'] = url;
    }
    if (typeof legalName !== 'undefined') {
        payload['legalName'] = legalName;
    }
    if (typeof legalCountry !== 'undefined') {
        payload['legalCountry'] = legalCountry;
    }
    if (typeof legalState !== 'undefined') {
        payload['legalState'] = legalState;
    }
    if (typeof legalCity !== 'undefined') {
        payload['legalCity'] = legalCity;
    }
    if (typeof legalAddress !== 'undefined') {
        payload['legalAddress'] = legalAddress;
    }
    if (typeof legalTaxId !== 'undefined') {
        payload['legalTaxId'] = legalTaxId;
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
interface ProjectsGetRequestParams {
    projectId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const projectsGet = async ({projectId,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: ProjectsGetRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}'.replace('{projectId}', projectId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('projects', 'get', projectId);
         } else {
            parse(response)
        }
    }

    return response;

}
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

export const projectsUpdate = async ({projectId,name,description,logo,url,legalName,legalCountry,legalState,legalCity,legalAddress,legalTaxId,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof description !== 'undefined') {
        payload['description'] = description;
    }
    if (typeof logo !== 'undefined') {
        payload['logo'] = logo;
    }
    if (typeof url !== 'undefined') {
        payload['url'] = url;
    }
    if (typeof legalName !== 'undefined') {
        payload['legalName'] = legalName;
    }
    if (typeof legalCountry !== 'undefined') {
        payload['legalCountry'] = legalCountry;
    }
    if (typeof legalState !== 'undefined') {
        payload['legalState'] = legalState;
    }
    if (typeof legalCity !== 'undefined') {
        payload['legalCity'] = legalCity;
    }
    if (typeof legalAddress !== 'undefined') {
        payload['legalAddress'] = legalAddress;
    }
    if (typeof legalTaxId !== 'undefined') {
        payload['legalTaxId'] = legalTaxId;
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
interface ProjectsDeleteRequestParams {
    projectId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsDelete = async ({projectId,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsDeleteRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}'.replace('{projectId}', projectId);
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
interface ProjectsUpdateAPIStatusRequestParams {
    projectId: string;
    api: Api;
    status: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateAPIStatus = async ({projectId,api,status,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateAPIStatusRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/api'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof api !== 'undefined') {
        payload['api'] = api;
    }
    if (typeof status !== 'undefined') {
        payload['status'] = status;
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
interface ProjectsUpdateAPIStatusAllRequestParams {
    projectId: string;
    status: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateAPIStatusAll = async ({projectId,status,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateAPIStatusAllRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/api/all'.replace('{projectId}', projectId);
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
    }

    return response;

}
interface ProjectsUpdateAuthDurationRequestParams {
    projectId: string;
    duration: number;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateAuthDuration = async ({projectId,duration,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateAuthDurationRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/duration'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof duration !== 'undefined') {
        payload['duration'] = duration;
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
interface ProjectsUpdateAuthLimitRequestParams {
    projectId: string;
    limit: number;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateAuthLimit = async ({projectId,limit,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateAuthLimitRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/limit'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof limit !== 'undefined') {
        payload['limit'] = limit;
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
interface ProjectsUpdateAuthSessionsLimitRequestParams {
    projectId: string;
    limit: number;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateAuthSessionsLimit = async ({projectId,limit,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateAuthSessionsLimitRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/max-sessions'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof limit !== 'undefined') {
        payload['limit'] = limit;
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
interface ProjectsUpdateMembershipsPrivacyRequestParams {
    projectId: string;
    userName: boolean;
    userEmail: boolean;
    mfa: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateMembershipsPrivacy = async ({projectId,userName,userEmail,mfa,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateMembershipsPrivacyRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/memberships-privacy'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof userName !== 'undefined') {
        payload['userName'] = userName;
    }
    if (typeof userEmail !== 'undefined') {
        payload['userEmail'] = userEmail;
    }
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
interface ProjectsUpdateMockNumbersRequestParams {
    projectId: string;
    numbers: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateMockNumbers = async ({projectId,numbers,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateMockNumbersRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/mock-numbers'.replace('{projectId}', projectId);
    let payload = {};
    numbers = (numbers as unknown) === true ? [] : numbers;
    if (typeof numbers !== 'undefined') {
        payload['numbers'] = numbers;
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
interface ProjectsUpdateAuthPasswordDictionaryRequestParams {
    projectId: string;
    enabled: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateAuthPasswordDictionary = async ({projectId,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateAuthPasswordDictionaryRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/password-dictionary'.replace('{projectId}', projectId);
    let payload = {};
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
interface ProjectsUpdateAuthPasswordHistoryRequestParams {
    projectId: string;
    limit: number;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateAuthPasswordHistory = async ({projectId,limit,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateAuthPasswordHistoryRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/password-history'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof limit !== 'undefined') {
        payload['limit'] = limit;
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
interface ProjectsUpdatePersonalDataCheckRequestParams {
    projectId: string;
    enabled: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdatePersonalDataCheck = async ({projectId,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdatePersonalDataCheckRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/personal-data'.replace('{projectId}', projectId);
    let payload = {};
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
interface ProjectsUpdateSessionAlertsRequestParams {
    projectId: string;
    alerts: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateSessionAlerts = async ({projectId,alerts,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateSessionAlertsRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/session-alerts'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof alerts !== 'undefined') {
        payload['alerts'] = alerts;
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
interface ProjectsUpdateSessionInvalidationRequestParams {
    projectId: string;
    enabled: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateSessionInvalidation = async ({projectId,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateSessionInvalidationRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/session-invalidation'.replace('{projectId}', projectId);
    let payload = {};
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
interface ProjectsUpdateAuthStatusRequestParams {
    projectId: string;
    method: AuthMethod;
    status: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateAuthStatus = async ({projectId,method,status,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateAuthStatusRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/auth/{method}'.replace('{projectId}', projectId).replace('{method}', method);
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
    }

    return response;

}
interface ProjectsListDevKeysRequestParams {
    projectId: string;
    queries?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const projectsListDevKeys = async ({projectId,queries,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: ProjectsListDevKeysRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/dev-keys'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof queries !== 'undefined') {
        payload['queries'] = queries;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('projects', 'listDevKeys', projectId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface ProjectsCreateDevKeyRequestParams {
    projectId: string;
    name: string;
    expire: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsCreateDevKey = async ({projectId,name,expire,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsCreateDevKeyRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/dev-keys'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
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
    }

    return response;

}
interface ProjectsGetDevKeyRequestParams {
    projectId: string;
    keyId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const projectsGetDevKey = async ({projectId,keyId,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: ProjectsGetDevKeyRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/dev-keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('projects', 'getDevKey', projectId, keyId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface ProjectsUpdateDevKeyRequestParams {
    projectId: string;
    keyId: string;
    name: string;
    expire: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateDevKey = async ({projectId,keyId,name,expire,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateDevKeyRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/dev-keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof expire !== 'undefined') {
        payload['expire'] = expire;
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
interface ProjectsDeleteDevKeyRequestParams {
    projectId: string;
    keyId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsDeleteDevKey = async ({projectId,keyId,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsDeleteDevKeyRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/dev-keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
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
interface ProjectsCreateJWTRequestParams {
    projectId: string;
    scopes: string[];
    duration?: number;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsCreateJWT = async ({projectId,scopes,duration,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsCreateJWTRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/jwts'.replace('{projectId}', projectId);
    let payload = {};
    scopes = (scopes as unknown) === true ? [] : scopes;
    if (typeof scopes !== 'undefined') {
        payload['scopes'] = scopes;
    }
    if (typeof duration !== 'undefined') {
        payload['duration'] = duration;
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
interface ProjectsListKeysRequestParams {
    projectId: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const projectsListKeys = async ({projectId,total,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: ProjectsListKeysRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/keys'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('projects', 'listKeys', projectId);
         } else {
            parse(response)
        }
    }

    return response;

}
interface ProjectsCreateKeyRequestParams {
    projectId: string;
    name: string;
    scopes: string[];
    expire?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsCreateKey = async ({projectId,name,scopes,expire,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsCreateKeyRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/keys'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    scopes = (scopes as unknown) === true ? [] : scopes;
    if (typeof scopes !== 'undefined') {
        payload['scopes'] = scopes;
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
    }

    return response;

}
interface ProjectsGetKeyRequestParams {
    projectId: string;
    keyId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const projectsGetKey = async ({projectId,keyId,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: ProjectsGetKeyRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('projects', 'getKey', projectId, keyId);
         } else {
            parse(response)
        }
    }

    return response;

}
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

export const projectsUpdateKey = async ({projectId,keyId,name,scopes,expire,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateKeyRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    scopes = (scopes as unknown) === true ? [] : scopes;
    if (typeof scopes !== 'undefined') {
        payload['scopes'] = scopes;
    }
    if (typeof expire !== 'undefined') {
        payload['expire'] = expire;
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
interface ProjectsDeleteKeyRequestParams {
    projectId: string;
    keyId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsDeleteKey = async ({projectId,keyId,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsDeleteKeyRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/keys/{keyId}'.replace('{projectId}', projectId).replace('{keyId}', keyId);
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

export const projectsUpdateOAuth2 = async ({projectId,provider,appId,secret,enabled,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateOAuth2RequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/oauth2'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof provider !== 'undefined') {
        payload['provider'] = provider;
    }
    if (typeof appId !== 'undefined') {
        payload['appId'] = appId;
    }
    if (typeof secret !== 'undefined') {
        payload['secret'] = secret;
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
interface ProjectsListPlatformsRequestParams {
    projectId: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const projectsListPlatforms = async ({projectId,total,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: ProjectsListPlatformsRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/platforms'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('projects', 'listPlatforms', projectId);
         } else {
            parse(response)
        }
    }

    return response;

}
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

export const projectsCreatePlatform = async ({projectId,type,name,key,store,hostname,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsCreatePlatformRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/platforms'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof type !== 'undefined') {
        payload['type'] = type;
    }
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof store !== 'undefined') {
        payload['store'] = store;
    }
    if (typeof hostname !== 'undefined') {
        payload['hostname'] = hostname;
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
interface ProjectsGetPlatformRequestParams {
    projectId: string;
    platformId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const projectsGetPlatform = async ({projectId,platformId,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: ProjectsGetPlatformRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/platforms/{platformId}'.replace('{projectId}', projectId).replace('{platformId}', platformId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('projects', 'getPlatform', projectId, platformId);
         } else {
            parse(response)
        }
    }

    return response;

}
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

export const projectsUpdatePlatform = async ({projectId,platformId,name,key,store,hostname,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdatePlatformRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/platforms/{platformId}'.replace('{projectId}', projectId).replace('{platformId}', platformId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof key !== 'undefined') {
        payload['key'] = key;
    }
    if (typeof store !== 'undefined') {
        payload['store'] = store;
    }
    if (typeof hostname !== 'undefined') {
        payload['hostname'] = hostname;
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
interface ProjectsDeletePlatformRequestParams {
    projectId: string;
    platformId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsDeletePlatform = async ({projectId,platformId,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsDeletePlatformRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/platforms/{platformId}'.replace('{projectId}', projectId).replace('{platformId}', platformId);
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
interface ProjectsUpdateServiceStatusRequestParams {
    projectId: string;
    service: ApiService;
    status: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateServiceStatus = async ({projectId,service,status,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateServiceStatusRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/service'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof service !== 'undefined') {
        payload['service'] = service;
    }
    if (typeof status !== 'undefined') {
        payload['status'] = status;
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
interface ProjectsUpdateServiceStatusAllRequestParams {
    projectId: string;
    status: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateServiceStatusAll = async ({projectId,status,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateServiceStatusAllRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/service/all'.replace('{projectId}', projectId);
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
    }

    return response;

}
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

export const projectsUpdateSMTP = async ({projectId,enabled,senderName,senderEmail,replyTo,host,port,username,password,secure,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateSMTPRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/smtp'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }
    if (typeof senderName !== 'undefined') {
        payload['senderName'] = senderName;
    }
    if (typeof senderEmail !== 'undefined') {
        payload['senderEmail'] = senderEmail;
    }
    if (typeof replyTo !== 'undefined') {
        payload['replyTo'] = replyTo;
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
    if (typeof secure !== 'undefined') {
        payload['secure'] = secure;
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

export const projectsCreateSMTPTest = async ({projectId,emails,senderName,senderEmail,host,replyTo,port,username,password,secure,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsCreateSMTPTestRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/smtp/tests'.replace('{projectId}', projectId);
    let payload = {};
    emails = (emails as unknown) === true ? [] : emails;
    if (typeof emails !== 'undefined') {
        payload['emails'] = emails;
    }
    if (typeof senderName !== 'undefined') {
        payload['senderName'] = senderName;
    }
    if (typeof senderEmail !== 'undefined') {
        payload['senderEmail'] = senderEmail;
    }
    if (typeof replyTo !== 'undefined') {
        payload['replyTo'] = replyTo;
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
    if (typeof secure !== 'undefined') {
        payload['secure'] = secure;
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
interface ProjectsUpdateTeamRequestParams {
    projectId: string;
    teamId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateTeam = async ({projectId,teamId,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateTeamRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/team'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof teamId !== 'undefined') {
        payload['teamId'] = teamId;
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
interface ProjectsGetEmailTemplateRequestParams {
    projectId: string;
    type: EmailTemplateType;
    locale: EmailTemplateLocale;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsGetEmailTemplate = async ({projectId,type,locale,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsGetEmailTemplateRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/templates/email/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
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

export const projectsUpdateEmailTemplate = async ({projectId,type,locale,subject,message,senderName,senderEmail,replyTo,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateEmailTemplateRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/templates/email/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
    let payload = {};
    if (typeof subject !== 'undefined') {
        payload['subject'] = subject;
    }
    if (typeof message !== 'undefined') {
        payload['message'] = message;
    }
    if (typeof senderName !== 'undefined') {
        payload['senderName'] = senderName;
    }
    if (typeof senderEmail !== 'undefined') {
        payload['senderEmail'] = senderEmail;
    }
    if (typeof replyTo !== 'undefined') {
        payload['replyTo'] = replyTo;
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
interface ProjectsDeleteEmailTemplateRequestParams {
    projectId: string;
    type: EmailTemplateType;
    locale: EmailTemplateLocale;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsDeleteEmailTemplate = async ({projectId,type,locale,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsDeleteEmailTemplateRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/templates/email/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
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
interface ProjectsGetSMSTemplateRequestParams {
    projectId: string;
    type: SmsTemplateType;
    locale: SmsTemplateLocale;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsGetSMSTemplate = async ({projectId,type,locale,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsGetSMSTemplateRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/templates/sms/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
interface ProjectsUpdateSMSTemplateRequestParams {
    projectId: string;
    type: SmsTemplateType;
    locale: SmsTemplateLocale;
    message: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateSMSTemplate = async ({projectId,type,locale,message,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateSMSTemplateRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/templates/sms/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
    let payload = {};
    if (typeof message !== 'undefined') {
        payload['message'] = message;
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
interface ProjectsDeleteSMSTemplateRequestParams {
    projectId: string;
    type: SmsTemplateType;
    locale: SmsTemplateLocale;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsDeleteSMSTemplate = async ({projectId,type,locale,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsDeleteSMSTemplateRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/templates/sms/{type}/{locale}'.replace('{projectId}', projectId).replace('{type}', type).replace('{locale}', locale);
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
interface ProjectsListWebhooksRequestParams {
    projectId: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const projectsListWebhooks = async ({projectId,total,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: ProjectsListWebhooksRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/webhooks'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof total !== 'undefined') {
        payload['total'] = total;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('projects', 'listWebhooks', projectId);
         } else {
            parse(response)
        }
    }

    return response;

}
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

export const projectsCreateWebhook = async ({projectId,name,events,url,security,enabled,httpUser,httpPass,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsCreateWebhookRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/webhooks'.replace('{projectId}', projectId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }
    events = (events as unknown) === true ? [] : events;
    if (typeof events !== 'undefined') {
        payload['events'] = events;
    }
    if (typeof url !== 'undefined') {
        payload['url'] = url;
    }
    if (typeof security !== 'undefined') {
        payload['security'] = security;
    }
    if (typeof httpUser !== 'undefined') {
        payload['httpUser'] = httpUser;
    }
    if (typeof httpPass !== 'undefined') {
        payload['httpPass'] = httpPass;
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
interface ProjectsGetWebhookRequestParams {
    projectId: string;
    webhookId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}

export const projectsGetWebhook = async ({projectId,webhookId,parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole}: ProjectsGetWebhookRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/webhooks/{webhookId}'.replace('{projectId}', projectId).replace('{webhookId}', webhookId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(showConsole) {
            showConsoleLink('projects', 'getWebhook', projectId, webhookId);
         } else {
            parse(response)
        }
    }

    return response;

}
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

export const projectsUpdateWebhook = async ({projectId,webhookId,name,events,url,security,enabled,httpUser,httpPass,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateWebhookRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/webhooks/{webhookId}'.replace('{projectId}', projectId).replace('{webhookId}', webhookId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }
    events = (events as unknown) === true ? [] : events;
    if (typeof events !== 'undefined') {
        payload['events'] = events;
    }
    if (typeof url !== 'undefined') {
        payload['url'] = url;
    }
    if (typeof security !== 'undefined') {
        payload['security'] = security;
    }
    if (typeof httpUser !== 'undefined') {
        payload['httpUser'] = httpUser;
    }
    if (typeof httpPass !== 'undefined') {
        payload['httpPass'] = httpPass;
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
interface ProjectsDeleteWebhookRequestParams {
    projectId: string;
    webhookId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsDeleteWebhook = async ({projectId,webhookId,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsDeleteWebhookRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/webhooks/{webhookId}'.replace('{projectId}', projectId).replace('{webhookId}', webhookId);
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
interface ProjectsUpdateWebhookSignatureRequestParams {
    projectId: string;
    webhookId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}

export const projectsUpdateWebhookSignature = async ({projectId,webhookId,parseOutput = true, overrideForCli = false, sdk = undefined}: ProjectsUpdateWebhookSignatureRequestParams): Promise<any> => {
    let client = !sdk ? await sdkForConsole() :
    sdk;
    let apiPath = '/projects/{projectId}/webhooks/{webhookId}/signature'.replace('{projectId}', projectId).replace('{webhookId}', webhookId);
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
projects
    .command(`list`)
    .description(`Get a list of all projects. You can use the query params to filter your results. `)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, teamId`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsList))

projects
    .command(`create`)
    .description(`Create a new project. You can create a maximum of 100 projects per account. `)
    .requiredOption(`--project-id <project-id>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, and hyphen. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Project name. Max length: 128 chars.`)
    .requiredOption(`--team-id <team-id>`, `Team unique ID.`)
    .option(`--region <region>`, `Project Region.`)
    .option(`--description <description>`, `Project description. Max length: 256 chars.`)
    .option(`--logo <logo>`, `Project logo.`)
    .option(`--url <url>`, `Project URL.`)
    .option(`--legal-name <legal-name>`, `Project legal Name. Max length: 256 chars.`)
    .option(`--legal-country <legal-country>`, `Project legal Country. Max length: 256 chars.`)
    .option(`--legal-state <legal-state>`, `Project legal State. Max length: 256 chars.`)
    .option(`--legal-city <legal-city>`, `Project legal City. Max length: 256 chars.`)
    .option(`--legal-address <legal-address>`, `Project legal Address. Max length: 256 chars.`)
    .option(`--legal-tax-id <legal-tax-id>`, `Project legal Tax ID. Max length: 256 chars.`)
    .action(actionRunner(projectsCreate))

projects
    .command(`get`)
    .description(`Get a project by its unique ID. This endpoint allows you to retrieve the project's details, including its name, description, team, region, and other metadata. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsGet))

projects
    .command(`update`)
    .description(`Update a project by its unique ID.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--name <name>`, `Project name. Max length: 128 chars.`)
    .option(`--description <description>`, `Project description. Max length: 256 chars.`)
    .option(`--logo <logo>`, `Project logo.`)
    .option(`--url <url>`, `Project URL.`)
    .option(`--legal-name <legal-name>`, `Project legal name. Max length: 256 chars.`)
    .option(`--legal-country <legal-country>`, `Project legal country. Max length: 256 chars.`)
    .option(`--legal-state <legal-state>`, `Project legal state. Max length: 256 chars.`)
    .option(`--legal-city <legal-city>`, `Project legal city. Max length: 256 chars.`)
    .option(`--legal-address <legal-address>`, `Project legal address. Max length: 256 chars.`)
    .option(`--legal-tax-id <legal-tax-id>`, `Project legal tax ID. Max length: 256 chars.`)
    .action(actionRunner(projectsUpdate))

projects
    .command(`delete`)
    .description(`Delete a project by its unique ID.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .action(actionRunner(projectsDelete))

projects
    .command(`update-api-status`)
    .description(`Update the status of a specific API type. Use this endpoint to enable or disable API types such as REST, GraphQL and Realtime.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--api <api>`, `API name.`)
    .requiredOption(`--status [value]`, `API status.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateAPIStatus))

projects
    .command(`update-api-status-all`)
    .description(`Update the status of all API types. Use this endpoint to enable or disable API types such as REST, GraphQL and Realtime all at once.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--status [value]`, `API status.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateAPIStatusAll))

projects
    .command(`update-auth-duration`)
    .description(`Update how long sessions created within a project should stay active for.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--duration <duration>`, `Project session length in seconds. Max length: 31536000 seconds.`, parseInteger)
    .action(actionRunner(projectsUpdateAuthDuration))

projects
    .command(`update-auth-limit`)
    .description(`Update the maximum number of users allowed in this project. Set to 0 for unlimited users. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--limit <limit>`, `Set the max number of users allowed in this project. Use 0 for unlimited.`, parseInteger)
    .action(actionRunner(projectsUpdateAuthLimit))

projects
    .command(`update-auth-sessions-limit`)
    .description(`Update the maximum number of sessions allowed per user within the project, if the limit is hit the oldest session will be deleted to make room for new sessions.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--limit <limit>`, `Set the max number of users allowed in this project. Value allowed is between 1-100. Default is 10`, parseInteger)
    .action(actionRunner(projectsUpdateAuthSessionsLimit))

projects
    .command(`update-memberships-privacy`)
    .description(`Update project membership privacy settings. Use this endpoint to control what user information is visible to other team members, such as user name, email, and MFA status. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--user-name [value]`, `Set to true to show userName to members of a team.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .requiredOption(`--user-email [value]`, `Set to true to show email to members of a team.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .requiredOption(`--mfa [value]`, `Set to true to show mfa to members of a team.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateMembershipsPrivacy))

projects
    .command(`update-mock-numbers`)
    .description(`Update the list of mock phone numbers for testing. Use these numbers to bypass SMS verification in development. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--numbers [numbers...]`, `An array of mock numbers and their corresponding verification codes (OTPs). Each number should be a valid E.164 formatted phone number. Maximum of 10 numbers are allowed.`)
    .action(actionRunner(projectsUpdateMockNumbers))

projects
    .command(`update-auth-password-dictionary`)
    .description(`Enable or disable checking user passwords against common passwords dictionary. This helps ensure users don't use common and insecure passwords. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--enabled [value]`, `Set whether or not to enable checking user's password against most commonly used passwords. Default is false.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateAuthPasswordDictionary))

projects
    .command(`update-auth-password-history`)
    .description(`Update the authentication password history requirement. Use this endpoint to require new passwords to be different than the last X amount of previously used ones.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--limit <limit>`, `Set the max number of passwords to store in user history. User can't choose a new password that is already stored in the password history list.  Max number of passwords allowed in history is20. Default value is 0`, parseInteger)
    .action(actionRunner(projectsUpdateAuthPasswordHistory))

projects
    .command(`update-personal-data-check`)
    .description(`Enable or disable checking user passwords against their personal data. This helps prevent users from using personal information in their passwords. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--enabled [value]`, `Set whether or not to check a password for similarity with personal data. Default is false.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdatePersonalDataCheck))

projects
    .command(`update-session-alerts`)
    .description(`Enable or disable session email alerts. When enabled, users will receive email notifications when new sessions are created.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--alerts [value]`, `Set to true to enable session emails.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateSessionAlerts))

projects
    .command(`update-session-invalidation`)
    .description(`Invalidate all existing sessions. An optional auth security setting for projects, and enabled by default for console project.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--enabled [value]`, `Update authentication session invalidation status. Use this endpoint to enable or disable session invalidation on password change`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateSessionInvalidation))

projects
    .command(`update-auth-status`)
    .description(`Update the status of a specific authentication method. Use this endpoint to enable or disable different authentication methods such as email, magic urls or sms in your project. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--method <method>`, `Auth Method. Possible values: email-password,magic-url,email-otp,anonymous,invites,jwt,phone`)
    .requiredOption(`--status [value]`, `Set the status of this auth method.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateAuthStatus))

projects
    .command(`list-dev-keys`)
    .description(`List all the project\'s dev keys. Dev keys are project specific and allow you to bypass rate limits and get better error logging during development.'`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: accessedAt, expire`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsListDevKeys))

projects
    .command(`create-dev-key`)
    .description(`Create a new project dev key. Dev keys are project specific and allow you to bypass rate limits and get better error logging during development. Strictly meant for development purposes only.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
    .requiredOption(`--expire <expire>`, `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format.`)
    .action(actionRunner(projectsCreateDevKey))

projects
    .command(`get-dev-key`)
    .description(`Get a project\'s dev key by its unique ID. Dev keys are project specific and allow you to bypass rate limits and get better error logging during development.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsGetDevKey))

projects
    .command(`update-dev-key`)
    .description(`Update a project\'s dev key by its unique ID. Use this endpoint to update a project\'s dev key name or expiration time.'`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
    .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
    .requiredOption(`--expire <expire>`, `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format.`)
    .action(actionRunner(projectsUpdateDevKey))

projects
    .command(`delete-dev-key`)
    .description(`Delete a project\'s dev key by its unique ID. Once deleted, the key will no longer allow bypassing of rate limits and better logging of errors.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
    .action(actionRunner(projectsDeleteDevKey))

projects
    .command(`create-jwt`)
    .description(`Create a new JWT token. This token can be used to authenticate users with custom scopes and expiration time. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--scopes [scopes...]`, `List of scopes allowed for JWT key. Maximum of 100 scopes are allowed.`)
    .option(`--duration <duration>`, `Time in seconds before JWT expires. Default duration is 900 seconds, and maximum is 3600 seconds.`, parseInteger)
    .action(actionRunner(projectsCreateJWT))

projects
    .command(`list-keys`)
    .description(`Get a list of all API keys from the current project. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsListKeys))

projects
    .command(`create-key`)
    .description(`Create a new API key. It's recommended to have multiple API keys with strict scopes for separate functions within your project.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
    .option(`--scopes [scopes...]`, `Key scopes list. Maximum of 100 scopes are allowed.`)
    .option(`--expire <expire>`, `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.`)
    .action(actionRunner(projectsCreateKey))

projects
    .command(`get-key`)
    .description(`Get a key by its unique ID. This endpoint returns details about a specific API key in your project including it's scopes.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsGetKey))

projects
    .command(`update-key`)
    .description(`Update a key by its unique ID. Use this endpoint to update the name, scopes, or expiration time of an API key. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
    .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
    .option(`--scopes [scopes...]`, `Key scopes list. Maximum of 100 events are allowed.`)
    .option(`--expire <expire>`, `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.`)
    .action(actionRunner(projectsUpdateKey))

projects
    .command(`delete-key`)
    .description(`Delete a key by its unique ID. Once deleted, the key can no longer be used to authenticate API calls. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
    .action(actionRunner(projectsDeleteKey))

projects
    .command(`update-o-auth-2`)
    .description(`Update the OAuth2 provider configurations. Use this endpoint to set up or update the OAuth2 provider credentials or enable/disable providers. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--provider <provider>`, `Provider Name`)
    .option(`--app-id <app-id>`, `Provider app ID. Max length: 256 chars.`)
    .option(`--secret <secret>`, `Provider secret key. Max length: 512 chars.`)
    .option(`--enabled [value]`, `Provider status. Set to 'false' to disable new session creation.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateOAuth2))

projects
    .command(`list-platforms`)
    .description(`Get a list of all platforms in the project. This endpoint returns an array of all platforms and their configurations. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsListPlatforms))

projects
    .command(`create-platform`)
    .description(`Create a new platform for your project. Use this endpoint to register a new platform where your users will run your application which will interact with the Appwrite API.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Platform type. Possible values are: web, flutter-web, flutter-ios, flutter-android, flutter-linux, flutter-macos, flutter-windows, apple-ios, apple-macos, apple-watchos, apple-tvos, android, unity, react-native-ios, react-native-android.`)
    .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
    .option(`--key <key>`, `Package name for Android or bundle ID for iOS or macOS. Max length: 256 chars.`)
    .option(`--store <store>`, `App store or Google Play store ID. Max length: 256 chars.`)
    .option(`--hostname <hostname>`, `Platform client hostname. Max length: 256 chars.`)
    .action(actionRunner(projectsCreatePlatform))

projects
    .command(`get-platform`)
    .description(`Get a platform by its unique ID. This endpoint returns the platform's details, including its name, type, and key configurations. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--platform-id <platform-id>`, `Platform unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsGetPlatform))

projects
    .command(`update-platform`)
    .description(`Update a platform by its unique ID. Use this endpoint to update the platform's name, key, platform store ID, or hostname. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--platform-id <platform-id>`, `Platform unique ID.`)
    .requiredOption(`--name <name>`, `Platform name. Max length: 128 chars.`)
    .option(`--key <key>`, `Package name for android or bundle ID for iOS. Max length: 256 chars.`)
    .option(`--store <store>`, `App store or Google Play store ID. Max length: 256 chars.`)
    .option(`--hostname <hostname>`, `Platform client URL. Max length: 256 chars.`)
    .action(actionRunner(projectsUpdatePlatform))

projects
    .command(`delete-platform`)
    .description(`Delete a platform by its unique ID. This endpoint removes the platform and all its configurations from the project. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--platform-id <platform-id>`, `Platform unique ID.`)
    .action(actionRunner(projectsDeletePlatform))

projects
    .command(`update-service-status`)
    .description(`Update the status of a specific service. Use this endpoint to enable or disable a service in your project. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--service <service>`, `Service name.`)
    .requiredOption(`--status [value]`, `Service status.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateServiceStatus))

projects
    .command(`update-service-status-all`)
    .description(`Update the status of all services. Use this endpoint to enable or disable all optional services at once. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--status [value]`, `Service status.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .action(actionRunner(projectsUpdateServiceStatusAll))

projects
    .command(`update-smtp`)
    .description(`Update the SMTP configuration for your project. Use this endpoint to configure your project's SMTP provider with your custom settings for sending transactional emails. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--enabled [value]`, `Enable custom SMTP service`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--sender-name <sender-name>`, `Name of the email sender`)
    .option(`--sender-email <sender-email>`, `Email of the sender`)
    .option(`--reply-to <reply-to>`, `Reply to email`)
    .option(`--host <host>`, `SMTP server host name`)
    .option(`--port <port>`, `SMTP server port`, parseInteger)
    .option(`--username <username>`, `SMTP server username`)
    .option(`--password <password>`, `SMTP server password`)
    .option(`--secure <secure>`, `Does SMTP server use secure connection`)
    .action(actionRunner(projectsUpdateSMTP))

projects
    .command(`create-smtp-test`)
    .description(`Send a test email to verify SMTP configuration. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--emails [emails...]`, `Array of emails to send test email to. Maximum of 10 emails are allowed.`)
    .requiredOption(`--sender-name <sender-name>`, `Name of the email sender`)
    .requiredOption(`--sender-email <sender-email>`, `Email of the sender`)
    .requiredOption(`--host <host>`, `SMTP server host name`)
    .option(`--reply-to <reply-to>`, `Reply to email`)
    .option(`--port <port>`, `SMTP server port`, parseInteger)
    .option(`--username <username>`, `SMTP server username`)
    .option(`--password <password>`, `SMTP server password`)
    .option(`--secure <secure>`, `Does SMTP server use secure connection`)
    .action(actionRunner(projectsCreateSMTPTest))

projects
    .command(`update-team`)
    .description(`Update the team ID of a project allowing for it to be transferred to another team.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--team-id <team-id>`, `Team ID of the team to transfer project to.`)
    .action(actionRunner(projectsUpdateTeam))

projects
    .command(`get-email-template`)
    .description(`Get a custom email template for the specified locale and type. This endpoint returns the template content, subject, and other configuration details. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsGetEmailTemplate))

projects
    .command(`update-email-template`)
    .description(`Update a custom email template for the specified locale and type. Use this endpoint to modify the content of your email templates.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .requiredOption(`--subject <subject>`, `Email Subject`)
    .requiredOption(`--message <message>`, `Template message`)
    .option(`--sender-name <sender-name>`, `Name of the email sender`)
    .option(`--sender-email <sender-email>`, `Email of the sender`)
    .option(`--reply-to <reply-to>`, `Reply to email`)
    .action(actionRunner(projectsUpdateEmailTemplate))

projects
    .command(`delete-email-template`)
    .description(`Reset a custom email template to its default value. This endpoint removes any custom content and restores the template to its original state. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsDeleteEmailTemplate))

projects
    .command(`get-sms-template`)
    .description(`Get a custom SMS template for the specified locale and type returning it's contents.`)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsGetSMSTemplate))

projects
    .command(`update-sms-template`)
    .description(`Update a custom SMS template for the specified locale and type. Use this endpoint to modify the content of your SMS templates. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .requiredOption(`--message <message>`, `Template message`)
    .action(actionRunner(projectsUpdateSMSTemplate))

projects
    .command(`delete-sms-template`)
    .description(`Reset a custom SMS template to its default value. This endpoint removes any custom message and restores the template to its original state. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--type <type>`, `Template type`)
    .requiredOption(`--locale <locale>`, `Template locale`)
    .action(actionRunner(projectsDeleteSMSTemplate))

projects
    .command(`list-webhooks`)
    .description(`Get a list of all webhooks belonging to the project. You can use the query params to filter your results. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsListWebhooks))

projects
    .command(`create-webhook`)
    .description(`Create a new webhook. Use this endpoint to configure a URL that will receive events from Appwrite when specific events occur. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--name <name>`, `Webhook name. Max length: 128 chars.`)
    .requiredOption(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
    .requiredOption(`--url <url>`, `Webhook URL.`)
    .requiredOption(`--security [value]`, `Certificate verification, false for disabled or true for enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Enable or disable a webhook.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--http-user <http-user>`, `Webhook HTTP user. Max length: 256 chars.`)
    .option(`--http-pass <http-pass>`, `Webhook HTTP password. Max length: 256 chars.`)
    .action(actionRunner(projectsCreateWebhook))

projects
    .command(`get-webhook`)
    .description(`Get a webhook by its unique ID. This endpoint returns details about a specific webhook configured for a project. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--webhook-id <webhook-id>`, `Webhook unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(projectsGetWebhook))

projects
    .command(`update-webhook`)
    .description(`Update a webhook by its unique ID. Use this endpoint to update the URL, events, or status of an existing webhook. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--webhook-id <webhook-id>`, `Webhook unique ID.`)
    .requiredOption(`--name <name>`, `Webhook name. Max length: 128 chars.`)
    .requiredOption(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
    .requiredOption(`--url <url>`, `Webhook URL.`)
    .requiredOption(`--security [value]`, `Certificate verification, false for disabled or true for enabled.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Enable or disable a webhook.`, (value: string | undefined) => value === undefined ? true : parseBool(value))
    .option(`--http-user <http-user>`, `Webhook HTTP user. Max length: 256 chars.`)
    .option(`--http-pass <http-pass>`, `Webhook HTTP password. Max length: 256 chars.`)
    .action(actionRunner(projectsUpdateWebhook))

projects
    .command(`delete-webhook`)
    .description(`Delete a webhook by its unique ID. Once deleted, the webhook will no longer receive project events. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--webhook-id <webhook-id>`, `Webhook unique ID.`)
    .action(actionRunner(projectsDeleteWebhook))

projects
    .command(`update-webhook-signature`)
    .description(`Update the webhook signature key. This endpoint can be used to regenerate the signature key used to sign and validate payload deliveries for a specific webhook. `)
    .requiredOption(`--project-id <project-id>`, `Project unique ID.`)
    .requiredOption(`--webhook-id <webhook-id>`, `Webhook unique ID.`)
    .action(actionRunner(projectsUpdateWebhookSignature))


