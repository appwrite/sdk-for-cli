import { Client } from "@appwrite.io/console";
import { Command } from "commander";
import type { UploadProgress } from "../types.js";
import { Compression, ImageGravity, ImageFormat, UsageRange } from "@appwrite.io/console";
export declare const storage: Command;
interface StorageListBucketsRequestParams {
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const storageListBuckets: ({ queries, search, total, parseOutput, overrideForCli, sdk, console: showConsole, }: StorageListBucketsRequestParams) => Promise<any>;
interface StorageCreateBucketRequestParams {
    bucketId: string;
    name: string;
    permissions?: string[];
    fileSecurity?: boolean;
    enabled?: boolean;
    maximumFileSize?: number;
    allowedFileExtensions?: string[];
    compression?: Compression;
    encryption?: boolean;
    antivirus?: boolean;
    transformations?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const storageCreateBucket: ({ bucketId, name, permissions, fileSecurity, enabled, maximumFileSize, allowedFileExtensions, compression, encryption, antivirus, transformations, parseOutput, overrideForCli, sdk, }: StorageCreateBucketRequestParams) => Promise<any>;
interface StorageGetBucketRequestParams {
    bucketId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const storageGetBucket: ({ bucketId, parseOutput, overrideForCli, sdk, console: showConsole, }: StorageGetBucketRequestParams) => Promise<any>;
interface StorageUpdateBucketRequestParams {
    bucketId: string;
    name: string;
    permissions?: string[];
    fileSecurity?: boolean;
    enabled?: boolean;
    maximumFileSize?: number;
    allowedFileExtensions?: string[];
    compression?: Compression;
    encryption?: boolean;
    antivirus?: boolean;
    transformations?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const storageUpdateBucket: ({ bucketId, name, permissions, fileSecurity, enabled, maximumFileSize, allowedFileExtensions, compression, encryption, antivirus, transformations, parseOutput, overrideForCli, sdk, }: StorageUpdateBucketRequestParams) => Promise<any>;
interface StorageDeleteBucketRequestParams {
    bucketId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const storageDeleteBucket: ({ bucketId, parseOutput, overrideForCli, sdk, }: StorageDeleteBucketRequestParams) => Promise<any>;
interface StorageListFilesRequestParams {
    bucketId: string;
    queries?: string[];
    search?: string;
    total?: boolean;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const storageListFiles: ({ bucketId, queries, search, total, parseOutput, overrideForCli, sdk, console: showConsole, }: StorageListFilesRequestParams) => Promise<any>;
interface StorageCreateFileRequestParams {
    bucketId: string;
    fileId: string;
    file: string;
    permissions?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    onProgress?: (progress: UploadProgress) => void;
}
export declare const storageCreateFile: ({ bucketId, fileId, file, permissions, parseOutput, overrideForCli, sdk, onProgress, }: StorageCreateFileRequestParams) => Promise<any>;
interface StorageGetFileRequestParams {
    bucketId: string;
    fileId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const storageGetFile: ({ bucketId, fileId, parseOutput, overrideForCli, sdk, console: showConsole, }: StorageGetFileRequestParams) => Promise<any>;
interface StorageUpdateFileRequestParams {
    bucketId: string;
    fileId: string;
    name?: string;
    permissions?: string[];
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const storageUpdateFile: ({ bucketId, fileId, name, permissions, parseOutput, overrideForCli, sdk, }: StorageUpdateFileRequestParams) => Promise<any>;
interface StorageDeleteFileRequestParams {
    bucketId: string;
    fileId: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const storageDeleteFile: ({ bucketId, fileId, parseOutput, overrideForCli, sdk, }: StorageDeleteFileRequestParams) => Promise<any>;
interface StorageGetFileDownloadRequestParams {
    bucketId: string;
    fileId: string;
    token?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    destination?: string;
}
export declare const storageGetFileDownload: ({ bucketId, fileId, token, parseOutput, overrideForCli, sdk, destination, }: StorageGetFileDownloadRequestParams) => Promise<any>;
interface StorageGetFilePreviewRequestParams {
    bucketId: string;
    fileId: string;
    width?: number;
    height?: number;
    gravity?: ImageGravity;
    quality?: number;
    borderWidth?: number;
    borderColor?: string;
    borderRadius?: number;
    opacity?: number;
    rotation?: number;
    background?: string;
    output?: ImageFormat;
    token?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    destination?: string;
}
export declare const storageGetFilePreview: ({ bucketId, fileId, width, height, gravity, quality, borderWidth, borderColor, borderRadius, opacity, rotation, background, output, token, parseOutput, overrideForCli, sdk, destination, }: StorageGetFilePreviewRequestParams) => Promise<any>;
interface StorageGetFileViewRequestParams {
    bucketId: string;
    fileId: string;
    token?: string;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    destination?: string;
}
export declare const storageGetFileView: ({ bucketId, fileId, token, parseOutput, overrideForCli, sdk, destination, }: StorageGetFileViewRequestParams) => Promise<any>;
interface StorageGetUsageRequestParams {
    range?: UsageRange;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
}
export declare const storageGetUsage: ({ range, parseOutput, overrideForCli, sdk, }: StorageGetUsageRequestParams) => Promise<any>;
interface StorageGetBucketUsageRequestParams {
    bucketId: string;
    range?: UsageRange;
    overrideForCli?: boolean;
    parseOutput?: boolean;
    sdk?: Client;
    console?: boolean;
}
export declare const storageGetBucketUsage: ({ bucketId, range, parseOutput, overrideForCli, sdk, console: showConsole, }: StorageGetBucketUsageRequestParams) => Promise<any>;
export {};
//# sourceMappingURL=storage.d.ts.map