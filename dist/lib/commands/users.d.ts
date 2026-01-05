import { Client } from "@appwrite.io/console";
import { Command } from "commander";
import { PasswordHash, UsageRange, AuthenticatorType, MessagingProviderType } from "@appwrite.io/console";
export declare const users: Command;
interface UsersListRequestParams {
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const usersList: ({ queries, search, total, parseOutput, overrideForCli, sdk, console: showConsole, }: UsersListRequestParams) => Promise<any>;
interface UsersCreateRequestParams {
    userId: string;
    email?: string;
    phone?: string;
    password?: string;
    name?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersCreate: ({ userId, email, phone, password, name, parseOutput, overrideForCli, sdk, }: UsersCreateRequestParams) => Promise<any>;
interface UsersCreateArgon2UserRequestParams {
    userId: string;
    email: string;
    password: string;
    name?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersCreateArgon2User: ({ userId, email, password, name, parseOutput, overrideForCli, sdk, }: UsersCreateArgon2UserRequestParams) => Promise<any>;
interface UsersCreateBcryptUserRequestParams {
    userId: string;
    email: string;
    password: string;
    name?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersCreateBcryptUser: ({ userId, email, password, name, parseOutput, overrideForCli, sdk, }: UsersCreateBcryptUserRequestParams) => Promise<any>;
interface UsersListIdentitiesRequestParams {
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersListIdentities: ({ queries, search, total, parseOutput, overrideForCli, sdk, }: UsersListIdentitiesRequestParams) => Promise<any>;
interface UsersDeleteIdentityRequestParams {
    identityId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersDeleteIdentity: ({ identityId, parseOutput, overrideForCli, sdk, }: UsersDeleteIdentityRequestParams) => Promise<any>;
interface UsersCreateMD5UserRequestParams {
    userId: string;
    email: string;
    password: string;
    name?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersCreateMD5User: ({ userId, email, password, name, parseOutput, overrideForCli, sdk, }: UsersCreateMD5UserRequestParams) => Promise<any>;
interface UsersCreatePHPassUserRequestParams {
    userId: string;
    email: string;
    password: string;
    name?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersCreatePHPassUser: ({ userId, email, password, name, parseOutput, overrideForCli, sdk, }: UsersCreatePHPassUserRequestParams) => Promise<any>;
interface UsersCreateScryptUserRequestParams {
    userId: string;
    email: string;
    password: string;
    passwordSalt: string;
    passwordCpu: number;
    passwordMemory: number;
    passwordParallel: number;
    passwordLength: number;
    name?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersCreateScryptUser: ({ userId, email, password, passwordSalt, passwordCpu, passwordMemory, passwordParallel, passwordLength, name, parseOutput, overrideForCli, sdk, }: UsersCreateScryptUserRequestParams) => Promise<any>;
interface UsersCreateScryptModifiedUserRequestParams {
    userId: string;
    email: string;
    password: string;
    passwordSalt: string;
    passwordSaltSeparator: string;
    passwordSignerKey: string;
    name?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersCreateScryptModifiedUser: ({ userId, email, password, passwordSalt, passwordSaltSeparator, passwordSignerKey, name, parseOutput, overrideForCli, sdk, }: UsersCreateScryptModifiedUserRequestParams) => Promise<any>;
interface UsersCreateSHAUserRequestParams {
    userId: string;
    email: string;
    password: string;
    passwordVersion?: PasswordHash;
    name?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersCreateSHAUser: ({ userId, email, password, passwordVersion, name, parseOutput, overrideForCli, sdk, }: UsersCreateSHAUserRequestParams) => Promise<any>;
interface UsersGetUsageRequestParams {
    range?: UsageRange;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersGetUsage: ({ range, parseOutput, overrideForCli, sdk, }: UsersGetUsageRequestParams) => Promise<any>;
interface UsersGetRequestParams {
    userId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const usersGet: ({ userId, parseOutput, overrideForCli, sdk, console: showConsole, }: UsersGetRequestParams) => Promise<any>;
interface UsersDeleteRequestParams {
    userId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersDelete: ({ userId, parseOutput, overrideForCli, sdk, }: UsersDeleteRequestParams) => Promise<any>;
interface UsersUpdateEmailRequestParams {
    userId: string;
    email: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersUpdateEmail: ({ userId, email, parseOutput, overrideForCli, sdk, }: UsersUpdateEmailRequestParams) => Promise<any>;
interface UsersCreateJWTRequestParams {
    userId: string;
    sessionId?: string;
    duration?: number;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersCreateJWT: ({ userId, sessionId, duration, parseOutput, overrideForCli, sdk, }: UsersCreateJWTRequestParams) => Promise<any>;
interface UsersUpdateLabelsRequestParams {
    userId: string;
    labels: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersUpdateLabels: ({ userId, labels, parseOutput, overrideForCli, sdk, }: UsersUpdateLabelsRequestParams) => Promise<any>;
interface UsersListLogsRequestParams {
    userId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersListLogs: ({ userId, queries, total, parseOutput, overrideForCli, sdk, }: UsersListLogsRequestParams) => Promise<any>;
interface UsersListMembershipsRequestParams {
    userId: string;
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersListMemberships: ({ userId, queries, search, total, parseOutput, overrideForCli, sdk, }: UsersListMembershipsRequestParams) => Promise<any>;
interface UsersUpdateMFARequestParams {
    userId: string;
    mfa: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersUpdateMFA: ({ userId, mfa, parseOutput, overrideForCli, sdk, }: UsersUpdateMFARequestParams) => Promise<any>;
interface UsersDeleteMFAAuthenticatorRequestParams {
    userId: string;
    type: AuthenticatorType;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersDeleteMFAAuthenticator: ({ userId, type, parseOutput, overrideForCli, sdk, }: UsersDeleteMFAAuthenticatorRequestParams) => Promise<any>;
interface UsersListMFAFactorsRequestParams {
    userId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersListMFAFactors: ({ userId, parseOutput, overrideForCli, sdk, }: UsersListMFAFactorsRequestParams) => Promise<any>;
interface UsersGetMFARecoveryCodesRequestParams {
    userId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersGetMFARecoveryCodes: ({ userId, parseOutput, overrideForCli, sdk, }: UsersGetMFARecoveryCodesRequestParams) => Promise<any>;
interface UsersUpdateMFARecoveryCodesRequestParams {
    userId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersUpdateMFARecoveryCodes: ({ userId, parseOutput, overrideForCli, sdk, }: UsersUpdateMFARecoveryCodesRequestParams) => Promise<any>;
interface UsersCreateMFARecoveryCodesRequestParams {
    userId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersCreateMFARecoveryCodes: ({ userId, parseOutput, overrideForCli, sdk, }: UsersCreateMFARecoveryCodesRequestParams) => Promise<any>;
interface UsersUpdateNameRequestParams {
    userId: string;
    name: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersUpdateName: ({ userId, name, parseOutput, overrideForCli, sdk, }: UsersUpdateNameRequestParams) => Promise<any>;
interface UsersUpdatePasswordRequestParams {
    userId: string;
    password: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersUpdatePassword: ({ userId, password, parseOutput, overrideForCli, sdk, }: UsersUpdatePasswordRequestParams) => Promise<any>;
interface UsersUpdatePhoneRequestParams {
    userId: string;
    number: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersUpdatePhone: ({ userId, number, parseOutput, overrideForCli, sdk, }: UsersUpdatePhoneRequestParams) => Promise<any>;
interface UsersGetPrefsRequestParams {
    userId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersGetPrefs: ({ userId, parseOutput, overrideForCli, sdk, }: UsersGetPrefsRequestParams) => Promise<any>;
interface UsersUpdatePrefsRequestParams {
    userId: string;
    prefs: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersUpdatePrefs: ({ userId, prefs, parseOutput, overrideForCli, sdk, }: UsersUpdatePrefsRequestParams) => Promise<any>;
interface UsersListSessionsRequestParams {
    userId: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const usersListSessions: ({ userId, total, parseOutput, overrideForCli, sdk, console: showConsole, }: UsersListSessionsRequestParams) => Promise<any>;
interface UsersCreateSessionRequestParams {
    userId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersCreateSession: ({ userId, parseOutput, overrideForCli, sdk, }: UsersCreateSessionRequestParams) => Promise<any>;
interface UsersDeleteSessionsRequestParams {
    userId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersDeleteSessions: ({ userId, parseOutput, overrideForCli, sdk, }: UsersDeleteSessionsRequestParams) => Promise<any>;
interface UsersDeleteSessionRequestParams {
    userId: string;
    sessionId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersDeleteSession: ({ userId, sessionId, parseOutput, overrideForCli, sdk, }: UsersDeleteSessionRequestParams) => Promise<any>;
interface UsersUpdateStatusRequestParams {
    userId: string;
    status: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersUpdateStatus: ({ userId, status, parseOutput, overrideForCli, sdk, }: UsersUpdateStatusRequestParams) => Promise<any>;
interface UsersListTargetsRequestParams {
    userId: string;
    queries?: string[];
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersListTargets: ({ userId, queries, total, parseOutput, overrideForCli, sdk, }: UsersListTargetsRequestParams) => Promise<any>;
interface UsersCreateTargetRequestParams {
    userId: string;
    targetId: string;
    providerType: MessagingProviderType;
    identifier: string;
    providerId?: string;
    name?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersCreateTarget: ({ userId, targetId, providerType, identifier, providerId, name, parseOutput, overrideForCli, sdk, }: UsersCreateTargetRequestParams) => Promise<any>;
interface UsersGetTargetRequestParams {
    userId: string;
    targetId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersGetTarget: ({ userId, targetId, parseOutput, overrideForCli, sdk, }: UsersGetTargetRequestParams) => Promise<any>;
interface UsersUpdateTargetRequestParams {
    userId: string;
    targetId: string;
    identifier?: string;
    providerId?: string;
    name?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersUpdateTarget: ({ userId, targetId, identifier, providerId, name, parseOutput, overrideForCli, sdk, }: UsersUpdateTargetRequestParams) => Promise<any>;
interface UsersDeleteTargetRequestParams {
    userId: string;
    targetId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersDeleteTarget: ({ userId, targetId, parseOutput, overrideForCli, sdk, }: UsersDeleteTargetRequestParams) => Promise<any>;
interface UsersCreateTokenRequestParams {
    userId: string;
    length?: number;
    expire?: number;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersCreateToken: ({ userId, length, expire, parseOutput, overrideForCli, sdk, }: UsersCreateTokenRequestParams) => Promise<any>;
interface UsersUpdateEmailVerificationRequestParams {
    userId: string;
    emailVerification: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersUpdateEmailVerification: ({ userId, emailVerification, parseOutput, overrideForCli, sdk, }: UsersUpdateEmailVerificationRequestParams) => Promise<any>;
interface UsersUpdatePhoneVerificationRequestParams {
    userId: string;
    phoneVerification: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const usersUpdatePhoneVerification: ({ userId, phoneVerification, parseOutput, overrideForCli, sdk, }: UsersUpdatePhoneVerificationRequestParams) => Promise<any>;
export {};
//# sourceMappingURL=users.d.ts.map