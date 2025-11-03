const fs = require('fs');
const pathLib = require('path');
const tar = require("tar");
const ignore = require("ignore");
const { promisify } = require('util');
const libClient = require('../client.js');
const { getAllFiles, showConsoleLink } = require('../utils.js');
const { Command } = require('commander');
const { sdkForProject, sdkForConsole } = require('../sdks')
const { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log, warn } = require('../parser')
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

const storage = new Command("storage").description(commandDescriptions['storage'] ?? '').configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} StorageListBucketsRequestParams
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: enabled, name, fileSecurity, maximumFileSize, encryption, antivirus
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} total When set to false, the total count returned will be 0 and will not be calculated.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {StorageListBucketsRequestParams} params
 */
const storageListBuckets = async ({queries,search,total,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/storage/buckets';
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
        if(console) {
            showConsoleLink('storage', 'listBuckets');
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} StorageCreateBucketRequestParams
 * @property {string} bucketId Unique Id. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} name Bucket name
 * @property {string[]} permissions An array of permission strings. By default, no user is granted with any permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} fileSecurity Enables configuring permissions for individual file. A user needs one of file or bucket level permissions to access a file. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} enabled Is bucket enabled? When set to &#039;disabled&#039;, users cannot access the files in this bucket but Server SDKs with and API key can still access the bucket. No files are lost when this is toggled.
 * @property {number} maximumFileSize Maximum file size allowed in bytes. Maximum allowed value is 30MB.
 * @property {string[]} allowedFileExtensions Allowed file extensions. Maximum of 100 extensions are allowed, each 64 characters long.
 * @property {Compression} compression Compression algorithm choosen for compression. Can be one of none,  [gzip](https://en.wikipedia.org/wiki/Gzip), or [zstd](https://en.wikipedia.org/wiki/Zstd), For file size above 20MB compression is skipped even if it&#039;s enabled
 * @property {boolean} encryption Is encryption enabled? For file size above 20MB encryption is skipped even if it&#039;s enabled
 * @property {boolean} antivirus Is virus scanning enabled? For file size above 20MB AntiVirus scanning is skipped even if it&#039;s enabled
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {StorageCreateBucketRequestParams} params
 */
const storageCreateBucket = async ({bucketId,name,permissions,fileSecurity,enabled,maximumFileSize,allowedFileExtensions,compression,encryption,antivirus,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/storage/buckets';
    let payload = {};
    if (typeof bucketId !== 'undefined') {
        payload['bucketId'] = bucketId;
    }
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    permissions = permissions === true ? [] : permissions;
    if (typeof permissions !== 'undefined') {
        payload['permissions'] = permissions;
    }
    if (typeof fileSecurity !== 'undefined') {
        payload['fileSecurity'] = fileSecurity;
    }
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }
    if (typeof maximumFileSize !== 'undefined') {
        payload['maximumFileSize'] = maximumFileSize;
    }
    allowedFileExtensions = allowedFileExtensions === true ? [] : allowedFileExtensions;
    if (typeof allowedFileExtensions !== 'undefined') {
        payload['allowedFileExtensions'] = allowedFileExtensions;
    }
    if (typeof compression !== 'undefined') {
        payload['compression'] = compression;
    }
    if (typeof encryption !== 'undefined') {
        payload['encryption'] = encryption;
    }
    if (typeof antivirus !== 'undefined') {
        payload['antivirus'] = antivirus;
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
 * @typedef {Object} StorageGetBucketRequestParams
 * @property {string} bucketId Bucket unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {StorageGetBucketRequestParams} params
 */
const storageGetBucket = async ({bucketId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/storage/buckets/{bucketId}'.replace('{bucketId}', bucketId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('storage', 'getBucket', bucketId);
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} StorageUpdateBucketRequestParams
 * @property {string} bucketId Bucket unique ID.
 * @property {string} name Bucket name
 * @property {string[]} permissions An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} fileSecurity Enables configuring permissions for individual file. A user needs one of file or bucket level permissions to access a file. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} enabled Is bucket enabled? When set to &#039;disabled&#039;, users cannot access the files in this bucket but Server SDKs with and API key can still access the bucket. No files are lost when this is toggled.
 * @property {number} maximumFileSize Maximum file size allowed in bytes. Maximum allowed value is 30MB.
 * @property {string[]} allowedFileExtensions Allowed file extensions. Maximum of 100 extensions are allowed, each 64 characters long.
 * @property {Compression} compression Compression algorithm choosen for compression. Can be one of none, [gzip](https://en.wikipedia.org/wiki/Gzip), or [zstd](https://en.wikipedia.org/wiki/Zstd), For file size above 20MB compression is skipped even if it&#039;s enabled
 * @property {boolean} encryption Is encryption enabled? For file size above 20MB encryption is skipped even if it&#039;s enabled
 * @property {boolean} antivirus Is virus scanning enabled? For file size above 20MB AntiVirus scanning is skipped even if it&#039;s enabled
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {StorageUpdateBucketRequestParams} params
 */
const storageUpdateBucket = async ({bucketId,name,permissions,fileSecurity,enabled,maximumFileSize,allowedFileExtensions,compression,encryption,antivirus,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/storage/buckets/{bucketId}'.replace('{bucketId}', bucketId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    permissions = permissions === true ? [] : permissions;
    if (typeof permissions !== 'undefined') {
        payload['permissions'] = permissions;
    }
    if (typeof fileSecurity !== 'undefined') {
        payload['fileSecurity'] = fileSecurity;
    }
    if (typeof enabled !== 'undefined') {
        payload['enabled'] = enabled;
    }
    if (typeof maximumFileSize !== 'undefined') {
        payload['maximumFileSize'] = maximumFileSize;
    }
    allowedFileExtensions = allowedFileExtensions === true ? [] : allowedFileExtensions;
    if (typeof allowedFileExtensions !== 'undefined') {
        payload['allowedFileExtensions'] = allowedFileExtensions;
    }
    if (typeof compression !== 'undefined') {
        payload['compression'] = compression;
    }
    if (typeof encryption !== 'undefined') {
        payload['encryption'] = encryption;
    }
    if (typeof antivirus !== 'undefined') {
        payload['antivirus'] = antivirus;
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
/**
 * @typedef {Object} StorageDeleteBucketRequestParams
 * @property {string} bucketId Bucket unique ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {StorageDeleteBucketRequestParams} params
 */
const storageDeleteBucket = async ({bucketId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/storage/buckets/{bucketId}'.replace('{bucketId}', bucketId);
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
 * @typedef {Object} StorageListFilesRequestParams
 * @property {string} bucketId Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).
 * @property {string[]} queries Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, signature, mimeType, sizeOriginal, chunksTotal, chunksUploaded
 * @property {string} search Search term to filter your list results. Max length: 256 chars.
 * @property {boolean} total When set to false, the total count returned will be 0 and will not be calculated.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {StorageListFilesRequestParams} params
 */
const storageListFiles = async ({bucketId,queries,search,total,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/storage/buckets/{bucketId}/files'.replace('{bucketId}', bucketId);
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
        if(console) {
            showConsoleLink('storage', 'listFiles', bucketId);
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} StorageCreateFileRequestParams
 * @property {string} bucketId Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).
 * @property {string} fileId File ID. Choose a custom ID or generate a random ID with &#039;ID.unique()&#039;. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can&#039;t start with a special char. Max length is 36 chars.
 * @property {string} file Binary file. Appwrite SDKs provide helpers to handle file input. [Learn about file input](https://appwrite.io/docs/products/storage/upload-download#input-file).
 * @property {string[]} permissions An array of permission strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 * @property {CallableFunction} onProgress
 */

/**
 * @param {StorageCreateFileRequestParams} params
 */
const storageCreateFile = async ({bucketId,fileId,file,permissions,parseOutput = true, overrideForCli = false, sdk = undefined,onProgress = () => {}}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/storage/buckets/{bucketId}/files'.replace('{bucketId}', bucketId);
    let payload = {};
    if (typeof fileId !== 'undefined') {
        payload['fileId'] = fileId;
    }
    const filePath = fs.realpathSync(file);
    const nodeStream = fs.createReadStream(filePath);
    const stream = convertReadStreamToReadableStream(nodeStream);

    if (typeof filePath !== 'undefined') {
        file = { type: 'file', stream, filename: pathLib.basename(filePath), size: fs.statSync(filePath).size };
        payload['file'] = file
    }
    permissions = permissions === true ? [] : permissions;
    if (typeof permissions !== 'undefined') {
        payload['permissions'] = permissions;
    }

    const size = file.size;

    const apiHeaders = {
        'content-type': 'multipart/form-data',
    };

    let id = undefined;
    let response = undefined;

    let chunksUploaded = 0;

    if(fileId != 'unique()') {
        try {
            response = await client.call('get', apiPath + '/' + fileId, apiHeaders);
            chunksUploaded = response.chunksUploaded;
        } catch(e) {
        }
    }

    let currentChunk = 1;
    let currentPosition = 0;
    let uploadableChunk = new Uint8Array(client.CHUNK_SIZE);

    const uploadChunk = async (lastUpload = false) => {
        if(currentChunk <= chunksUploaded) {
            return;
        }

        const start = ((currentChunk - 1) * client.CHUNK_SIZE);
        let end = start + currentPosition - 1;

        if(!lastUpload || currentChunk !== 1) {
            apiHeaders['content-range'] = 'bytes ' + start + '-' + end + '/' + size;
        }

        let uploadableChunkTrimmed;

        if(currentPosition + 1 >= client.CHUNK_SIZE) {
            uploadableChunkTrimmed = uploadableChunk;
        } else {
            uploadableChunkTrimmed = new Uint8Array(currentPosition);
            for(let i = 0; i <= currentPosition; i++) {
                uploadableChunkTrimmed[i] = uploadableChunk[i];
            }
        }

        if (id) {
            apiHeaders['x-appwrite-id'] = id;
        }

        payload['file'] = { type: 'file', file: new File([uploadableChunkTrimmed], file.filename), filename: file.filename };

        response = await client.call('post', apiPath, apiHeaders, payload);

        if (!id) {
            id = response['$id'];
        }

        if (onProgress !== null) {
            onProgress({
                $id: response['$id'],
                progress: Math.min((currentChunk) * client.CHUNK_SIZE, size) / size * 100,
                sizeUploaded: end+1,
                chunksTotal: response['chunksTotal'],
                chunksUploaded: response['chunksUploaded']
            });
        }

        uploadableChunk = new Uint8Array(client.CHUNK_SIZE);
        currentChunk++;
        currentPosition = 0;
    }

    for await (const chunk of file.stream) {
        for(const b of chunk) {
            uploadableChunk[currentPosition] = b;

            currentPosition++;
            if(currentPosition >= client.CHUNK_SIZE) {
                await uploadChunk();
                currentPosition = 0;
            }
        }
    }

    if (currentPosition > 0) { // Check if there's any remaining data for the last chunk
        await uploadChunk(true);
    }


    if (parseOutput) {
        parse(response)
    }

    return response;
}
/**
 * @typedef {Object} StorageGetFileRequestParams
 * @property {string} bucketId Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).
 * @property {string} fileId File ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {StorageGetFileRequestParams} params
 */
const storageGetFile = async ({bucketId,fileId,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
    let payload = {};

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('storage', 'getFile', bucketId, fileId);
         } else {
            parse(response)
        }
    }

    return response;

}
/**
 * @typedef {Object} StorageUpdateFileRequestParams
 * @property {string} bucketId Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).
 * @property {string} fileId File unique ID.
 * @property {string} name Name of the file
 * @property {string[]} permissions An array of permission string. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {StorageUpdateFileRequestParams} params
 */
const storageUpdateFile = async ({bucketId,fileId,name,permissions,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
    let payload = {};
    if (typeof name !== 'undefined') {
        payload['name'] = name;
    }
    permissions = permissions === true ? [] : permissions;
    if (typeof permissions !== 'undefined') {
        payload['permissions'] = permissions;
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
/**
 * @typedef {Object} StorageDeleteFileRequestParams
 * @property {string} bucketId Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).
 * @property {string} fileId File ID.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {StorageDeleteFileRequestParams} params
 */
const storageDeleteFile = async ({bucketId,fileId,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
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
 * @typedef {Object} StorageGetFileDownloadRequestParams
 * @property {string} bucketId Storage bucket ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).
 * @property {string} fileId File ID.
 * @property {string} token File token for accessing this file.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 * @property {string} destination
 */

/**
 * @param {StorageGetFileDownloadRequestParams} params
 */
const storageGetFileDownload = async ({bucketId,fileId,token,parseOutput = true, overrideForCli = false, sdk = undefined, destination}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/storage/buckets/{bucketId}/files/{fileId}/download'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
    let payload = {};
    if (typeof token !== 'undefined') {
        payload['token'] = token;
    }
    if (!overrideForCli) {
        payload['project'] = localConfig.getProject().projectId
        payload['key'] = globalConfig.getKey();
        const queryParams = new URLSearchParams(payload);
        apiPath = `${globalConfig.getEndpoint()}${apiPath}?${queryParams.toString()}`;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload, 'arraybuffer');

    if (overrideForCli) {
        response = Buffer.from(response);
    }

    fs.writeFileSync(destination, response);
    if (parseOutput) {
        parse(response)
    }

    return response;

}
/**
 * @typedef {Object} StorageGetFilePreviewRequestParams
 * @property {string} bucketId Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).
 * @property {string} fileId File ID
 * @property {number} width Resize preview image width, Pass an integer between 0 to 4000.
 * @property {number} height Resize preview image height, Pass an integer between 0 to 4000.
 * @property {ImageGravity} gravity Image crop gravity. Can be one of center,top-left,top,top-right,left,right,bottom-left,bottom,bottom-right
 * @property {number} quality Preview image quality. Pass an integer between 0 to 100. Defaults to keep existing image quality.
 * @property {number} borderWidth Preview image border in pixels. Pass an integer between 0 to 100. Defaults to 0.
 * @property {string} borderColor Preview image border color. Use a valid HEX color, no # is needed for prefix.
 * @property {number} borderRadius Preview image border radius in pixels. Pass an integer between 0 to 4000.
 * @property {number} opacity Preview image opacity. Only works with images having an alpha channel (like png). Pass a number between 0 to 1.
 * @property {number} rotation Preview image rotation in degrees. Pass an integer between -360 and 360.
 * @property {string} background Preview image background color. Only works with transparent images (png). Use a valid HEX color, no # is needed for prefix.
 * @property {ImageFormat} output Output format type (jpeg, jpg, png, gif and webp).
 * @property {string} token File token for accessing this file.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 * @property {string} destination
 */

/**
 * @param {StorageGetFilePreviewRequestParams} params
 */
const storageGetFilePreview = async ({bucketId,fileId,width,height,gravity,quality,borderWidth,borderColor,borderRadius,opacity,rotation,background,output,token,parseOutput = true, overrideForCli = false, sdk = undefined, destination}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/storage/buckets/{bucketId}/files/{fileId}/preview'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
    let payload = {};
    if (typeof width !== 'undefined') {
        payload['width'] = width;
    }
    if (typeof height !== 'undefined') {
        payload['height'] = height;
    }
    if (typeof gravity !== 'undefined') {
        payload['gravity'] = gravity;
    }
    if (typeof quality !== 'undefined') {
        payload['quality'] = quality;
    }
    if (typeof borderWidth !== 'undefined') {
        payload['borderWidth'] = borderWidth;
    }
    if (typeof borderColor !== 'undefined') {
        payload['borderColor'] = borderColor;
    }
    if (typeof borderRadius !== 'undefined') {
        payload['borderRadius'] = borderRadius;
    }
    if (typeof opacity !== 'undefined') {
        payload['opacity'] = opacity;
    }
    if (typeof rotation !== 'undefined') {
        payload['rotation'] = rotation;
    }
    if (typeof background !== 'undefined') {
        payload['background'] = background;
    }
    if (typeof output !== 'undefined') {
        payload['output'] = output;
    }
    if (typeof token !== 'undefined') {
        payload['token'] = token;
    }
    if (!overrideForCli) {
        payload['project'] = localConfig.getProject().projectId
        payload['key'] = globalConfig.getKey();
        const queryParams = new URLSearchParams(payload);
        apiPath = `${globalConfig.getEndpoint()}${apiPath}?${queryParams.toString()}`;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload, 'arraybuffer');

    if (overrideForCli) {
        response = Buffer.from(response);
    }

    fs.writeFileSync(destination, response);
    if (parseOutput) {
        parse(response)
    }

    return response;

}
/**
 * @typedef {Object} StorageGetFileViewRequestParams
 * @property {string} bucketId Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).
 * @property {string} fileId File ID.
 * @property {string} token File token for accessing this file.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 * @property {string} destination
 */

/**
 * @param {StorageGetFileViewRequestParams} params
 */
const storageGetFileView = async ({bucketId,fileId,token,parseOutput = true, overrideForCli = false, sdk = undefined, destination}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/storage/buckets/{bucketId}/files/{fileId}/view'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
    let payload = {};
    if (typeof token !== 'undefined') {
        payload['token'] = token;
    }
    if (!overrideForCli) {
        payload['project'] = localConfig.getProject().projectId
        payload['key'] = globalConfig.getKey();
        const queryParams = new URLSearchParams(payload);
        apiPath = `${globalConfig.getEndpoint()}${apiPath}?${queryParams.toString()}`;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload, 'arraybuffer');

    if (overrideForCli) {
        response = Buffer.from(response);
    }

    fs.writeFileSync(destination, response);
    if (parseOutput) {
        parse(response)
    }

    return response;

}
/**
 * @typedef {Object} StorageGetUsageRequestParams
 * @property {UsageRange} range Date range.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {StorageGetUsageRequestParams} params
 */
const storageGetUsage = async ({range,parseOutput = true, overrideForCli = false, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/storage/usage';
    let payload = {};
    if (typeof range !== 'undefined') {
        payload['range'] = range;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        parse(response)
    }

    return response;

}
/**
 * @typedef {Object} StorageGetBucketUsageRequestParams
 * @property {string} bucketId Bucket ID.
 * @property {UsageRange} range Date range.
 * @property {boolean} overrideForCli
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {StorageGetBucketUsageRequestParams} params
 */
const storageGetBucketUsage = async ({bucketId,range,parseOutput = true, overrideForCli = false, sdk = undefined, console}) => {
    let client = !sdk ? await sdkForProject() :
    sdk;
    let apiPath = '/storage/{bucketId}/usage'.replace('{bucketId}', bucketId);
    let payload = {};
    if (typeof range !== 'undefined') {
        payload['range'] = range;
    }

    let response = undefined;

    response = await client.call('get', apiPath, {
    }, payload);

    if (parseOutput) {
        if(console) {
            showConsoleLink('storage', 'getBucketUsage', bucketId);
         } else {
            parse(response)
        }
    }

    return response;

}
storage
    .command(`list-buckets`)
    .description(`Get a list of all the storage buckets. You can use the query params to filter your results.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: enabled, name, fileSecurity, maximumFileSize, encryption, antivirus`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(storageListBuckets))

storage
    .command(`create-bucket`)
    .description(`Create a new storage bucket.`)
    .requiredOption(`--bucket-id <bucket-id>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Bucket name`)
    .option(`--permissions [permissions...]`, `An array of permission strings. By default, no user is granted with any permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--file-security [value]`, `Enables configuring permissions for individual file. A user needs one of file or bucket level permissions to access a file. [Learn more about permissions](https://appwrite.io/docs/permissions).`, (value) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Is bucket enabled? When set to 'disabled', users cannot access the files in this bucket but Server SDKs with and API key can still access the bucket. No files are lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--maximum-file-size <maximum-file-size>`, `Maximum file size allowed in bytes. Maximum allowed value is 30MB.`, parseInteger)
    .option(`--allowed-file-extensions [allowed-file-extensions...]`, `Allowed file extensions. Maximum of 100 extensions are allowed, each 64 characters long.`)
    .option(`--compression <compression>`, `Compression algorithm choosen for compression. Can be one of none,  [gzip](https://en.wikipedia.org/wiki/Gzip), or [zstd](https://en.wikipedia.org/wiki/Zstd), For file size above 20MB compression is skipped even if it's enabled`)
    .option(`--encryption [value]`, `Is encryption enabled? For file size above 20MB encryption is skipped even if it's enabled`, (value) => value === undefined ? true : parseBool(value))
    .option(`--antivirus [value]`, `Is virus scanning enabled? For file size above 20MB AntiVirus scanning is skipped even if it's enabled`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(storageCreateBucket))

storage
    .command(`get-bucket`)
    .description(`Get a storage bucket by its unique ID. This endpoint response returns a JSON object with the storage bucket metadata.`)
    .requiredOption(`--bucket-id <bucket-id>`, `Bucket unique ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(storageGetBucket))

storage
    .command(`update-bucket`)
    .description(`Update a storage bucket by its unique ID.`)
    .requiredOption(`--bucket-id <bucket-id>`, `Bucket unique ID.`)
    .requiredOption(`--name <name>`, `Bucket name`)
    .option(`--permissions [permissions...]`, `An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--file-security [value]`, `Enables configuring permissions for individual file. A user needs one of file or bucket level permissions to access a file. [Learn more about permissions](https://appwrite.io/docs/permissions).`, (value) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Is bucket enabled? When set to 'disabled', users cannot access the files in this bucket but Server SDKs with and API key can still access the bucket. No files are lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--maximum-file-size <maximum-file-size>`, `Maximum file size allowed in bytes. Maximum allowed value is 30MB.`, parseInteger)
    .option(`--allowed-file-extensions [allowed-file-extensions...]`, `Allowed file extensions. Maximum of 100 extensions are allowed, each 64 characters long.`)
    .option(`--compression <compression>`, `Compression algorithm choosen for compression. Can be one of none, [gzip](https://en.wikipedia.org/wiki/Gzip), or [zstd](https://en.wikipedia.org/wiki/Zstd), For file size above 20MB compression is skipped even if it's enabled`)
    .option(`--encryption [value]`, `Is encryption enabled? For file size above 20MB encryption is skipped even if it's enabled`, (value) => value === undefined ? true : parseBool(value))
    .option(`--antivirus [value]`, `Is virus scanning enabled? For file size above 20MB AntiVirus scanning is skipped even if it's enabled`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(storageUpdateBucket))

storage
    .command(`delete-bucket`)
    .description(`Delete a storage bucket by its unique ID.`)
    .requiredOption(`--bucket-id <bucket-id>`, `Bucket unique ID.`)
    .action(actionRunner(storageDeleteBucket))

storage
    .command(`list-files`)
    .description(`Get a list of all the user files. You can use the query params to filter your results.`)
    .requiredOption(`--bucket-id <bucket-id>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, signature, mimeType, sizeOriginal, chunksTotal, chunksUploaded`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(storageListFiles))

storage
    .command(`create-file`)
    .description(`Create a new file. Before using this route, you should create a new bucket resource using either a [server integration](https://appwrite.io/docs/server/storage#storageCreateBucket) API or directly from your Appwrite console.  Larger files should be uploaded using multiple requests with the [content-range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) header to send a partial request with a maximum supported chunk of '5MB'. The 'content-range' header values should always be in bytes.  When the first request is sent, the server will return the **File** object, and the subsequent part request must include the file's **id** in 'x-appwrite-id' header to allow the server to know that the partial upload is for the existing file and not for a new one.  If you're creating a new file using one of the Appwrite SDKs, all the chunking logic will be managed by the SDK internally. `)
    .requiredOption(`--bucket-id <bucket-id>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
    .requiredOption(`--file-id <file-id>`, `File ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--file <file>`, `Binary file. Appwrite SDKs provide helpers to handle file input. [Learn about file input](https://appwrite.io/docs/products/storage/upload-download#input-file).`)
    .option(`--permissions [permissions...]`, `An array of permission strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .action(actionRunner(storageCreateFile))

storage
    .command(`get-file`)
    .description(`Get a file by its unique ID. This endpoint response returns a JSON object with the file metadata.`)
    .requiredOption(`--bucket-id <bucket-id>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
    .requiredOption(`--file-id <file-id>`, `File ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(storageGetFile))

storage
    .command(`update-file`)
    .description(`Update a file by its unique ID. Only users with write permissions have access to update this resource.`)
    .requiredOption(`--bucket-id <bucket-id>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
    .requiredOption(`--file-id <file-id>`, `File unique ID.`)
    .option(`--name <name>`, `Name of the file`)
    .option(`--permissions [permissions...]`, `An array of permission string. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .action(actionRunner(storageUpdateFile))

storage
    .command(`delete-file`)
    .description(`Delete a file by its unique ID. Only users with write permissions have access to delete this resource.`)
    .requiredOption(`--bucket-id <bucket-id>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
    .requiredOption(`--file-id <file-id>`, `File ID.`)
    .action(actionRunner(storageDeleteFile))

storage
    .command(`get-file-download`)
    .description(`Get a file content by its unique ID. The endpoint response return with a 'Content-Disposition: attachment' header that tells the browser to start downloading the file to user downloads directory.`)
    .requiredOption(`--bucket-id <bucket-id>`, `Storage bucket ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
    .requiredOption(`--file-id <file-id>`, `File ID.`)
    .option(`--token <token>`, `File token for accessing this file.`)
    .requiredOption(`--destination <path>`, `output file path.`)
    .action(actionRunner(storageGetFileDownload))

storage
    .command(`get-file-preview`)
    .description(`Get a file preview image. Currently, this method supports preview for image files (jpg, png, and gif), other supported formats, like pdf, docs, slides, and spreadsheets, will return the file icon image. You can also pass query string arguments for cutting and resizing your preview image. Preview is supported only for image files smaller than 10MB.`)
    .requiredOption(`--bucket-id <bucket-id>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
    .requiredOption(`--file-id <file-id>`, `File ID`)
    .option(`--width <width>`, `Resize preview image width, Pass an integer between 0 to 4000.`, parseInteger)
    .option(`--height <height>`, `Resize preview image height, Pass an integer between 0 to 4000.`, parseInteger)
    .option(`--gravity <gravity>`, `Image crop gravity. Can be one of center,top-left,top,top-right,left,right,bottom-left,bottom,bottom-right`)
    .option(`--quality <quality>`, `Preview image quality. Pass an integer between 0 to 100. Defaults to keep existing image quality.`, parseInteger)
    .option(`--border-width <border-width>`, `Preview image border in pixels. Pass an integer between 0 to 100. Defaults to 0.`, parseInteger)
    .option(`--border-color <border-color>`, `Preview image border color. Use a valid HEX color, no # is needed for prefix.`)
    .option(`--border-radius <border-radius>`, `Preview image border radius in pixels. Pass an integer between 0 to 4000.`, parseInteger)
    .option(`--opacity <opacity>`, `Preview image opacity. Only works with images having an alpha channel (like png). Pass a number between 0 to 1.`, parseInteger)
    .option(`--rotation <rotation>`, `Preview image rotation in degrees. Pass an integer between -360 and 360.`, parseInteger)
    .option(`--background <background>`, `Preview image background color. Only works with transparent images (png). Use a valid HEX color, no # is needed for prefix.`)
    .option(`--output <output>`, `Output format type (jpeg, jpg, png, gif and webp).`)
    .option(`--token <token>`, `File token for accessing this file.`)
    .requiredOption(`--destination <path>`, `output file path.`)
    .action(actionRunner(storageGetFilePreview))

storage
    .command(`get-file-view`)
    .description(`Get a file content by its unique ID. This endpoint is similar to the download method but returns with no  'Content-Disposition: attachment' header.`)
    .requiredOption(`--bucket-id <bucket-id>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
    .requiredOption(`--file-id <file-id>`, `File ID.`)
    .option(`--token <token>`, `File token for accessing this file.`)
    .requiredOption(`--destination <path>`, `output file path.`)
    .action(actionRunner(storageGetFileView))

storage
    .command(`get-usage`)
    .description(`Get usage metrics and statistics for all buckets in the project. You can view the total number of buckets, files, storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days. `)
    .option(`--range <range>`, `Date range.`)
    .action(actionRunner(storageGetUsage))

storage
    .command(`get-bucket-usage`)
    .description(`Get usage metrics and statistics a specific bucket in the project. You can view the total number of files, storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days. `)
    .requiredOption(`--bucket-id <bucket-id>`, `Bucket ID.`)
    .option(`--range <range>`, `Date range.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(storageGetBucketUsage))

module.exports = {
    storage,
    storageListBuckets,
    storageCreateBucket,
    storageGetBucket,
    storageUpdateBucket,
    storageDeleteBucket,
    storageListFiles,
    storageCreateFile,
    storageGetFile,
    storageUpdateFile,
    storageDeleteFile,
    storageGetFileDownload,
    storageGetFilePreview,
    storageGetFileView,
    storageGetUsage,
    storageGetBucketUsage
};
