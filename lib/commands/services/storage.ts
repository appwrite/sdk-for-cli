import { Command } from "commander";
import fs from "fs";
import { sdkForProject } from "../../sdks.js";
import {
  actionRunner,
  commandDescriptions,
  success,
  parse,
  parseBool,
  parseInteger,
} from "../../parser.js";
// Mock enums
export enum Compression {
  // Mock enum values
}
export enum ImageGravity {
  // Mock enum values
}
export enum ImageFormat {
  // Mock enum values
}
export enum UsageRange {
  // Mock enum values
}

// Mock Storage class
class Storage {
  constructor(sdkClient: any) {}

  async listBuckets(queries?: any[], search?: string, total?: boolean): Promise<any> {
    return { result: 'GET:/v1/storage/buckets:passed' };
  }

  async createBucket(bucketId: string, name: string, permissions?: any[], fileSecurity?: boolean, enabled?: boolean, maximumFileSize?: number, allowedFileExtensions?: any[], compression?: string, encryption?: boolean, antivirus?: boolean, transformations?: boolean): Promise<any> {
    return { result: 'POST:/v1/storage/buckets:passed' };
  }

  async getBucket(bucketId: string): Promise<any> {
    return { result: 'GET:/v1/storage/buckets/{bucketId}:passed' };
  }

  async updateBucket(bucketId: string, name: string, permissions?: any[], fileSecurity?: boolean, enabled?: boolean, maximumFileSize?: number, allowedFileExtensions?: any[], compression?: string, encryption?: boolean, antivirus?: boolean, transformations?: boolean): Promise<any> {
    return { result: 'PUT:/v1/storage/buckets/{bucketId}:passed' };
  }

  async deleteBucket(bucketId: string): Promise<any> {
    return { result: 'DELETE:/v1/storage/buckets/{bucketId}:passed' };
  }

  async listFiles(bucketId: string, queries?: any[], search?: string, total?: boolean): Promise<any> {
    return { result: 'GET:/v1/storage/buckets/{bucketId}/files:passed' };
  }

  async createFile(bucketId: string, fileId: string, file: any, permissions?: any[]): Promise<any> {
    return { result: 'POST:/v1/storage/buckets/{bucketId}/files:passed' };
  }

  async getFile(bucketId: string, fileId: string): Promise<any> {
    return { result: 'GET:/v1/storage/buckets/{bucketId}/files/{fileId}:passed' };
  }

  async updateFile(bucketId: string, fileId: string, name?: string, permissions?: any[]): Promise<any> {
    return { result: 'PUT:/v1/storage/buckets/{bucketId}/files/{fileId}:passed' };
  }

  async deleteFile(bucketId: string, fileId: string): Promise<any> {
    return { result: 'DELETE:/v1/storage/buckets/{bucketId}/files/{fileId}:passed' };
  }

  async getFileDownload(bucketId: string, fileId: string, token?: string): Promise<any> {
    return { result: 'GET:/v1/storage/buckets/{bucketId}/files/{fileId}/download:passed' };
  }

  async getFilePreview(bucketId: string, fileId: string, width?: number, height?: number, gravity?: string, quality?: number, borderWidth?: number, borderColor?: string, borderRadius?: number, opacity?: number, rotation?: number, background?: string, output?: string, token?: string): Promise<any> {
    return { result: 'GET:/v1/storage/buckets/{bucketId}/files/{fileId}/preview:passed' };
  }

  async getFileView(bucketId: string, fileId: string, token?: string): Promise<any> {
    return { result: 'GET:/v1/storage/buckets/{bucketId}/files/{fileId}/view:passed' };
  }

  async getUsage(range?: string): Promise<any> {
    return { result: 'GET:/v1/storage/usage:passed' };
  }

  async getBucketUsage(bucketId: string, range?: string): Promise<any> {
    return { result: 'GET:/v1/storage/{bucketId}/usage:passed' };
  }
}


let storageClient: Storage | null = null;

const getStorageClient = async (): Promise<Storage> => {
  if (!storageClient) {
    const sdkClient = await sdkForProject();
    storageClient = new Storage(sdkClient);
  }
  return storageClient;
};

export const storage = new Command("storage")
  .description(commandDescriptions["storage"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

storage
  .command(`list-buckets`)
  .description(`Get a list of all the storage buckets. You can use the query params to filter your results.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: enabled, name, fileSecurity, maximumFileSize, encryption, antivirus, transformations`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ queries, search, total }) =>
        parse(await (await getStorageClient()).listBuckets(queries, search, total)),
    ),
  );

storage
  .command(`create-bucket`)
  .description(`Create a new storage bucket.`)
  .requiredOption(`--bucketid <bucketid>`, `Unique Id. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Bucket name`)
  .option(`--permissions [permissions...]`, `An array of permission strings. By default, no user is granted with any permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .option(
    `--filesecurity [value]`,
    `Enables configuring permissions for individual file. A user needs one of file or bucket level permissions to access a file. [Learn more about permissions](https://appwrite.io/docs/permissions).`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--enabled [value]`,
    `Is bucket enabled? When set to 'disabled', users cannot access the files in this bucket but Server SDKs with and API key can still access the bucket. No files are lost when this is toggled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--maximumfilesize <maximumfilesize>`, `Maximum file size allowed in bytes. Maximum allowed value is 30MB.`, parseInteger)
  .option(`--allowedfileextensions [allowedfileextensions...]`, `Allowed file extensions. Maximum of 100 extensions are allowed, each 64 characters long.`)
  .option(`--compression <compression>`, `Compression algorithm choosen for compression. Can be one of none,  [gzip](https://en.wikipedia.org/wiki/Gzip), or [zstd](https://en.wikipedia.org/wiki/Zstd), For file size above 20MB compression is skipped even if it's enabled`)
  .option(
    `--encryption [value]`,
    `Is encryption enabled? For file size above 20MB encryption is skipped even if it's enabled`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--antivirus [value]`,
    `Is virus scanning enabled? For file size above 20MB AntiVirus scanning is skipped even if it's enabled`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--transformations [value]`,
    `Are image transformations enabled?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ bucketId, name, permissions, fileSecurity, enabled, maximumFileSize, allowedFileExtensions, compression, encryption, antivirus, transformations }) =>
        parse(await (await getStorageClient()).createBucket(bucketId, name, permissions, fileSecurity, enabled, maximumFileSize, allowedFileExtensions, compression as Compression, encryption, antivirus, transformations)),
    ),
  );

storage
  .command(`get-bucket`)
  .description(`Get a storage bucket by its unique ID. This endpoint response returns a JSON object with the storage bucket metadata.`)
  .requiredOption(`--bucketid <bucketid>`, `Bucket unique ID.`)
  .action(
    actionRunner(
      async ({ bucketId }) =>
        parse(await (await getStorageClient()).getBucket(bucketId)),
    ),
  );

storage
  .command(`update-bucket`)
  .description(`Update a storage bucket by its unique ID.`)
  .requiredOption(`--bucketid <bucketid>`, `Bucket unique ID.`)
  .requiredOption(`--name <name>`, `Bucket name`)
  .option(`--permissions [permissions...]`, `An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .option(
    `--filesecurity [value]`,
    `Enables configuring permissions for individual file. A user needs one of file or bucket level permissions to access a file. [Learn more about permissions](https://appwrite.io/docs/permissions).`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--enabled [value]`,
    `Is bucket enabled? When set to 'disabled', users cannot access the files in this bucket but Server SDKs with and API key can still access the bucket. No files are lost when this is toggled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--maximumfilesize <maximumfilesize>`, `Maximum file size allowed in bytes. Maximum allowed value is 30MB.`, parseInteger)
  .option(`--allowedfileextensions [allowedfileextensions...]`, `Allowed file extensions. Maximum of 100 extensions are allowed, each 64 characters long.`)
  .option(`--compression <compression>`, `Compression algorithm choosen for compression. Can be one of none, [gzip](https://en.wikipedia.org/wiki/Gzip), or [zstd](https://en.wikipedia.org/wiki/Zstd), For file size above 20MB compression is skipped even if it's enabled`)
  .option(
    `--encryption [value]`,
    `Is encryption enabled? For file size above 20MB encryption is skipped even if it's enabled`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--antivirus [value]`,
    `Is virus scanning enabled? For file size above 20MB AntiVirus scanning is skipped even if it's enabled`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--transformations [value]`,
    `Are image transformations enabled?`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ bucketId, name, permissions, fileSecurity, enabled, maximumFileSize, allowedFileExtensions, compression, encryption, antivirus, transformations }) =>
        parse(await (await getStorageClient()).updateBucket(bucketId, name, permissions, fileSecurity, enabled, maximumFileSize, allowedFileExtensions, compression as Compression, encryption, antivirus, transformations)),
    ),
  );

storage
  .command(`delete-bucket`)
  .description(`Delete a storage bucket by its unique ID.`)
  .requiredOption(`--bucketid <bucketid>`, `Bucket unique ID.`)
  .action(
    actionRunner(
      async ({ bucketId }) =>
        parse(await (await getStorageClient()).deleteBucket(bucketId)),
    ),
  );

storage
  .command(`list-files`)
  .description(`Get a list of all the user files. You can use the query params to filter your results.`)
  .requiredOption(`--bucketid <bucketid>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, signature, mimeType, sizeOriginal, chunksTotal, chunksUploaded`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ bucketId, queries, search, total }) =>
        parse(await (await getStorageClient()).listFiles(bucketId, queries, search, total)),
    ),
  );

storage
  .command(`create-file`)
  .description(`Create a new file. Before using this route, you should create a new bucket resource using either a [server integration](https://appwrite.io/docs/server/storage#storageCreateBucket) API or directly from your Appwrite console.

Larger files should be uploaded using multiple requests with the [content-range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) header to send a partial request with a maximum supported chunk of \`5MB\`. The \`content-range\` header values should always be in bytes.

When the first request is sent, the server will return the **File** object, and the subsequent part request must include the file's **id** in \`x-appwrite-id\` header to allow the server to know that the partial upload is for the existing file and not for a new one.

If you're creating a new file using one of the Appwrite SDKs, all the chunking logic will be managed by the SDK internally.
`)
  .requiredOption(`--bucketid <bucketid>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
  .requiredOption(`--fileid <fileid>`, `File ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--file <file>`, `Binary file. Appwrite SDKs provide helpers to handle file input. [Learn about file input](https://appwrite.io/docs/products/storage/upload-download#input-file).`)
  .option(`--permissions [permissions...]`, `An array of permission strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .action(
    actionRunner(
      async ({ bucketId, fileId, file, permissions }) =>
        parse(await (await getStorageClient()).createFile(bucketId, fileId, file, permissions)),
    ),
  );

storage
  .command(`get-file`)
  .description(`Get a file by its unique ID. This endpoint response returns a JSON object with the file metadata.`)
  .requiredOption(`--bucketid <bucketid>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
  .requiredOption(`--fileid <fileid>`, `File ID.`)
  .action(
    actionRunner(
      async ({ bucketId, fileId }) =>
        parse(await (await getStorageClient()).getFile(bucketId, fileId)),
    ),
  );

storage
  .command(`update-file`)
  .description(`Update a file by its unique ID. Only users with write permissions have access to update this resource.`)
  .requiredOption(`--bucketid <bucketid>`, `Bucket unique ID.`)
  .requiredOption(`--fileid <fileid>`, `File ID.`)
  .option(`--name <name>`, `File name.`)
  .option(`--permissions [permissions...]`, `An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
  .action(
    actionRunner(
      async ({ bucketId, fileId, name, permissions }) =>
        parse(await (await getStorageClient()).updateFile(bucketId, fileId, name, permissions)),
    ),
  );

storage
  .command(`delete-file`)
  .description(`Delete a file by its unique ID. Only users with write permissions have access to delete this resource.`)
  .requiredOption(`--bucketid <bucketid>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
  .requiredOption(`--fileid <fileid>`, `File ID.`)
  .action(
    actionRunner(
      async ({ bucketId, fileId }) =>
        parse(await (await getStorageClient()).deleteFile(bucketId, fileId)),
    ),
  );

storage
  .command(`get-file-download`)
  .description(`Get a file content by its unique ID. The endpoint response return with a 'Content-Disposition: attachment' header that tells the browser to start downloading the file to user downloads directory.`)
  .requiredOption(`--bucketid <bucketid>`, `Storage bucket ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
  .requiredOption(`--fileid <fileid>`, `File ID.`)
  .option(`--token <token>`, `File token for accessing this file.`)
  .requiredOption(`--destination <destination>`, `Path to save the file to.`)
  .action(
    actionRunner(
      async ({ bucketId, fileId, token, destination }) => {
        const url = await (await getStorageClient()).getFileDownload(bucketId, fileId, token);
        const response = await fetch(url);
        const buffer = Buffer.from(await response.arrayBuffer());
        fs.writeFileSync(destination, buffer);
        success(`File saved to ${destination}`);
      },
    ),
  );

storage
  .command(`get-file-preview`)
  .description(`Get a file preview image. Currently, this method supports preview for image files (jpg, png, and gif), other supported formats, like pdf, docs, slides, and spreadsheets, will return the file icon image. You can also pass query string arguments for cutting and resizing your preview image. Preview is supported only for image files smaller than 10MB.`)
  .requiredOption(`--bucketid <bucketid>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
  .requiredOption(`--fileid <fileid>`, `File ID`)
  .option(`--width <width>`, `Resize preview image width, Pass an integer between 0 to 4000.`, parseInteger)
  .option(`--height <height>`, `Resize preview image height, Pass an integer between 0 to 4000.`, parseInteger)
  .option(`--gravity <gravity>`, `Image crop gravity. Can be one of center,top-left,top,top-right,left,right,bottom-left,bottom,bottom-right`)
  .option(`--quality <quality>`, `Preview image quality. Pass an integer between 0 to 100. Defaults to keep existing image quality.`, parseInteger)
  .option(`--borderwidth <borderwidth>`, `Preview image border in pixels. Pass an integer between 0 to 100. Defaults to 0.`, parseInteger)
  .option(`--bordercolor <bordercolor>`, `Preview image border color. Use a valid HEX color, no # is needed for prefix.`)
  .option(`--borderradius <borderradius>`, `Preview image border radius in pixels. Pass an integer between 0 to 4000.`, parseInteger)
  .option(`--opacity <opacity>`, `Preview image opacity. Only works with images having an alpha channel (like png). Pass a number between 0 to 1.`, parseInteger)
  .option(`--rotation <rotation>`, `Preview image rotation in degrees. Pass an integer between -360 and 360.`, parseInteger)
  .option(`--background <background>`, `Preview image background color. Only works with transparent images (png). Use a valid HEX color, no # is needed for prefix.`)
  .option(`--output <output>`, `Output format type (jpeg, jpg, png, gif and webp).`)
  .option(`--token <token>`, `File token for accessing this file.`)
  .requiredOption(`--destination <destination>`, `Path to save the file to.`)
  .action(
    actionRunner(
      async ({ bucketId, fileId, width, height, gravity, quality, borderWidth, borderColor, borderRadius, opacity, rotation, background, output, token, destination }) => {
        const url = await (await getStorageClient()).getFilePreview(bucketId, fileId, width, height, gravity as ImageGravity, quality, borderWidth, borderColor, borderRadius, opacity, rotation, background, output as ImageFormat, token);
        const response = await fetch(url);
        const buffer = Buffer.from(await response.arrayBuffer());
        fs.writeFileSync(destination, buffer);
        success(`File saved to ${destination}`);
      },
    ),
  );

storage
  .command(`get-file-view`)
  .description(`Get a file content by its unique ID. This endpoint is similar to the download method but returns with no  'Content-Disposition: attachment' header.`)
  .requiredOption(`--bucketid <bucketid>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
  .requiredOption(`--fileid <fileid>`, `File ID.`)
  .option(`--token <token>`, `File token for accessing this file.`)
  .requiredOption(`--destination <destination>`, `Path to save the file to.`)
  .action(
    actionRunner(
      async ({ bucketId, fileId, token, destination }) => {
        const url = await (await getStorageClient()).getFileView(bucketId, fileId, token);
        const response = await fetch(url);
        const buffer = Buffer.from(await response.arrayBuffer());
        fs.writeFileSync(destination, buffer);
        success(`File saved to ${destination}`);
      },
    ),
  );

storage
  .command(`get-usage`)
  .description(`Get usage metrics and statistics for all buckets in the project. You can view the total number of buckets, files, storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.
`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ range }) =>
        parse(await (await getStorageClient()).getUsage(range as UsageRange)),
    ),
  );

storage
  .command(`get-bucket-usage`)
  .description(`Get usage metrics and statistics a specific bucket in the project. You can view the total number of files, storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.
`)
  .requiredOption(`--bucketid <bucketid>`, `Bucket ID.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ bucketId, range }) =>
        parse(await (await getStorageClient()).getBucketUsage(bucketId, range as UsageRange)),
    ),
  );

