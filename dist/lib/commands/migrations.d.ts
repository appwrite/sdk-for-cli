import { Command } from "commander";
export declare const migrations: Command;
export declare const migrationsList: ({ queries, search, total, parseOutput, }: {
    queries?: string[];
    search?: string;
    total?: boolean;
    parseOutput?: boolean;
}) => Promise<any>;
export declare const migrationsCreateAppwriteMigration: ({ resources, endpoint, projectId, apiKey, parseOutput, }: {
    resources: string[];
    endpoint: string;
    projectId: string;
    apiKey: string;
    parseOutput?: boolean;
}) => Promise<any>;
export declare const migrationsGetAppwriteReport: ({ resources, endpoint, projectID, key, parseOutput, }: {
    resources: string[];
    endpoint: string;
    projectID: string;
    key: string;
    parseOutput?: boolean;
}) => Promise<any>;
export declare const migrationsCreateCSVExport: ({ resourceId, filename, columns, queries, delimiter, enclosure, escape, header, notify, parseOutput, }: {
    resourceId: string;
    filename: string;
    columns?: string[];
    queries?: string[];
    delimiter?: string;
    enclosure?: string;
    escape?: string;
    header?: boolean;
    notify?: boolean;
    parseOutput?: boolean;
}) => Promise<any>;
export declare const migrationsCreateCSVImport: ({ bucketId, fileId, resourceId, internalFile, parseOutput, }: {
    bucketId: string;
    fileId: string;
    resourceId: string;
    internalFile?: boolean;
    parseOutput?: boolean;
}) => Promise<any>;
export declare const migrationsCreateFirebaseMigration: ({ resources, serviceAccount, parseOutput, }: {
    resources: string[];
    serviceAccount: string;
    parseOutput?: boolean;
}) => Promise<any>;
export declare const migrationsGetFirebaseReport: ({ resources, serviceAccount, parseOutput, }: {
    resources: string[];
    serviceAccount: string;
    parseOutput?: boolean;
}) => Promise<any>;
export declare const migrationsCreateNHostMigration: ({ resources, subdomain, region, adminSecret, database, username, password, port, parseOutput, }: {
    resources: string[];
    subdomain: string;
    region: string;
    adminSecret: string;
    database: string;
    username: string;
    password: string;
    port?: number;
    parseOutput?: boolean;
}) => Promise<any>;
export declare const migrationsGetNHostReport: ({ resources, subdomain, region, adminSecret, database, username, password, port, parseOutput, }: {
    resources: string[];
    subdomain: string;
    region: string;
    adminSecret: string;
    database: string;
    username: string;
    password: string;
    port?: number;
    parseOutput?: boolean;
}) => Promise<any>;
export declare const migrationsCreateSupabaseMigration: ({ resources, endpoint, apiKey, databaseHost, username, password, port, parseOutput, }: {
    resources: string[];
    endpoint: string;
    apiKey: string;
    databaseHost: string;
    username: string;
    password: string;
    port?: number;
    parseOutput?: boolean;
}) => Promise<any>;
export declare const migrationsGetSupabaseReport: ({ resources, endpoint, apiKey, databaseHost, username, password, port, parseOutput, }: {
    resources: string[];
    endpoint: string;
    apiKey: string;
    databaseHost: string;
    username: string;
    password: string;
    port?: number;
    parseOutput?: boolean;
}) => Promise<any>;
export declare const migrationsGet: ({ migrationId, parseOutput, }: {
    migrationId: string;
    parseOutput?: boolean;
}) => Promise<any>;
export declare const migrationsRetry: ({ migrationId, parseOutput, }: {
    migrationId: string;
    parseOutput?: boolean;
}) => Promise<any>;
export declare const migrationsDelete: ({ migrationId, parseOutput, }: {
    migrationId: string;
    parseOutput?: boolean;
}) => Promise<any>;
//# sourceMappingURL=migrations.d.ts.map