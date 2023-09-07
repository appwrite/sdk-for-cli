const fs = require('fs');
const pathLib = require('path');
const tar = require("tar");
const ignore = require("ignore");
const { promisify } = require('util');
const libClient = require('../client.js');
const { getAllFiles } = require('../utils.js');
const { Command } = require('commander');
const { sdkForProject, sdkForConsole } = require('../sdks')
const { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log } = require('../parser')
const { localConfig, globalConfig } = require("../config");

const storage = new Command("storage").description(commandDescriptions['storage']).configureHelp({
    helpWidth: process.stdout.columns || 80
  })

const storageListBuckets = async ({ queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string[]} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/storage/buckets';
    let payload = {};

    /** Query Params */
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
        parse(response)
        success()
    }
    return response;
}

const storageCreateBucket = async ({ bucketId, name, permissions, fileSecurity, enabled, maximumFileSize, allowedFileExtensions, compression, encryption, antivirus, parseOutput = true, sdk = undefined}) => {
    /* @param {string} bucketId */
    /* @param {string} name */
    /* @param {string[]} permissions */
    /* @param {boolean} fileSecurity */
    /* @param {boolean} enabled */
    /* @param {number} maximumFileSize */
    /* @param {string[]} allowedFileExtensions */
    /* @param {string} compression */
    /* @param {boolean} encryption */
    /* @param {boolean} antivirus */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/storage/buckets';
    let payload = {};
    
    /** Body Params */

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
        success()
    }
    return response;
}

const storageGetBucket = async ({ bucketId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} bucketId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/storage/buckets/{bucketId}'.replace('{bucketId}', bucketId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const storageUpdateBucket = async ({ bucketId, name, permissions, fileSecurity, enabled, maximumFileSize, allowedFileExtensions, compression, encryption, antivirus, parseOutput = true, sdk = undefined}) => {
    /* @param {string} bucketId */
    /* @param {string} name */
    /* @param {string[]} permissions */
    /* @param {boolean} fileSecurity */
    /* @param {boolean} enabled */
    /* @param {number} maximumFileSize */
    /* @param {string[]} allowedFileExtensions */
    /* @param {string} compression */
    /* @param {boolean} encryption */
    /* @param {boolean} antivirus */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/storage/buckets/{bucketId}'.replace('{bucketId}', bucketId);
    let payload = {};
    
    /** Body Params */

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
        success()
    }
    return response;
}

const storageDeleteBucket = async ({ bucketId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} bucketId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/storage/buckets/{bucketId}'.replace('{bucketId}', bucketId);
    let payload = {};
    let response = undefined;
    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const storageListFiles = async ({ bucketId, queries, search, parseOutput = true, sdk = undefined}) => {
    /* @param {string} bucketId */
    /* @param {string[]} queries */
    /* @param {string} search */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/storage/buckets/{bucketId}/files'.replace('{bucketId}', bucketId);
    let payload = {};

    /** Query Params */
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
        parse(response)
        success()
    }
    return response;
}

const storageCreateFile = async ({ bucketId, fileId, file, permissions, parseOutput = true, sdk = undefined, onProgress = () => {}}) => {
    /* @param {string} bucketId */
    /* @param {string} fileId */
    /* @param {InputFile} file */
    /* @param {string[]} permissions */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/storage/buckets/{bucketId}/files'.replace('{bucketId}', bucketId);
    let payload = {};
    
    /** Body Params */

    if (typeof fileId !== 'undefined') {
        payload['fileId'] = fileId;
    }

    let filePath = fs.realpathSync(file);
    if (typeof filePath !== 'undefined') {
        payload['file'] = filePath;
    }

    permissions = permissions === true ? [] : permissions;

    if (typeof permissions !== 'undefined') {
        payload['permissions'] = permissions;
    }

    let response = undefined;
    const { size: size } = await promisify(fs.stat)(file);

    if (size <= libClient.CHUNK_SIZE) {
        payload['file'] = fs.createReadStream(payload['file']);

        response = await client.call('post', apiPath, {
            'content-type': 'multipart/form-data',
        }, payload)
    } else {
        const streamFilePath = payload['file'];

        const apiHeaders = {
            'content-type': 'multipart/form-data',
        };

        let offset = 0;
        if(fileId != 'unique()') {
            try {
                response = await client.call('get', apiPath + '/' + fileId, apiHeaders);
                offset = response.chunksUploaded * libClient.CHUNK_SIZE;
            } catch(e) {
            }
        }

        while (offset < size) {
            let end = Math.min(offset + libClient.CHUNK_SIZE - 1, size - 1);

            apiHeaders['content-range'] = 'bytes ' + offset + '-' + end + '/' + size;
            if (response && response.$id) {
                apiHeaders['x-appwrite-id'] = response.$id;
            }

            const stream = fs.createReadStream(streamFilePath, {
                start: offset,
                end
            });
            payload['file'] = stream;
            response = await client.call('post', apiPath, apiHeaders, payload);

            if (onProgress) {
                onProgress({
                    $id: response.$id,
                    progress: ( offset / size ) * 100,
                    sizeUploaded: offset,
                    chunksTotal: response.chunksTotal,
                    chunksUploaded: response.chunksUploaded
                });
            }
            offset += libClient.CHUNK_SIZE;
        }
    }
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const storageGetFile = async ({ bucketId, fileId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} bucketId */
    /* @param {string} fileId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
    let payload = {};
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const storageUpdateFile = async ({ bucketId, fileId, name, permissions, parseOutput = true, sdk = undefined}) => {
    /* @param {string} bucketId */
    /* @param {string} fileId */
    /* @param {string} name */
    /* @param {string[]} permissions */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
    let payload = {};
    
    /** Body Params */

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
        success()
    }
    return response;
}

const storageDeleteFile = async ({ bucketId, fileId, parseOutput = true, sdk = undefined}) => {
    /* @param {string} bucketId */
    /* @param {string} fileId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/storage/buckets/{bucketId}/files/{fileId}'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
    let payload = {};
    let response = undefined;
    response = await client.call('delete', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const storageGetFileDownload = async ({ bucketId, fileId, parseOutput = true, sdk = undefined, destination}) => {
    /* @param {string} bucketId */
    /* @param {string} fileId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/storage/buckets/{bucketId}/files/{fileId}/download'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
    let payload = {};
    payload['project'] = localConfig.getProject().projectId
    payload['key'] = globalConfig.getKey();
    const queryParams = new URLSearchParams(payload);
    apiPath = `${globalConfig.getEndpoint()}${apiPath}?${queryParams.toString()}`;

    const response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload, 'arraybuffer');

    fs.writeFileSync(destination, response);

    if (parseOutput) { 
        log(`File stored in ${destination}`)
        success()
    }
}

const storageGetFilePreview = async ({ bucketId, fileId, width, height, gravity, quality, borderWidth, borderColor, borderRadius, opacity, rotation, background, output, parseOutput = true, sdk = undefined, destination}) => {
    /* @param {string} bucketId */
    /* @param {string} fileId */
    /* @param {number} width */
    /* @param {number} height */
    /* @param {string} gravity */
    /* @param {number} quality */
    /* @param {number} borderWidth */
    /* @param {string} borderColor */
    /* @param {number} borderRadius */
    /* @param {number} opacity */
    /* @param {number} rotation */
    /* @param {string} background */
    /* @param {string} output */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/storage/buckets/{bucketId}/files/{fileId}/preview'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
    let payload = {};

    /** Query Params */
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
    payload['project'] = localConfig.getProject().projectId
    payload['key'] = globalConfig.getKey();
    const queryParams = new URLSearchParams(payload);
    apiPath = `${globalConfig.getEndpoint()}${apiPath}?${queryParams.toString()}`;

    const response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload, 'arraybuffer');

    fs.writeFileSync(destination, response);

    if (parseOutput) { 
        log(`File stored in ${destination}`)
        success()
    }
}

const storageGetFileView = async ({ bucketId, fileId, parseOutput = true, sdk = undefined, destination}) => {
    /* @param {string} bucketId */
    /* @param {string} fileId */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/storage/buckets/{bucketId}/files/{fileId}/view'.replace('{bucketId}', bucketId).replace('{fileId}', fileId);
    let payload = {};
    payload['project'] = localConfig.getProject().projectId
    payload['key'] = globalConfig.getKey();
    const queryParams = new URLSearchParams(payload);
    apiPath = `${globalConfig.getEndpoint()}${apiPath}?${queryParams.toString()}`;

    const response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload, 'arraybuffer');

    fs.writeFileSync(destination, response);

    if (parseOutput) { 
        log(`File stored in ${destination}`)
        success()
    }
}

const storageGetUsage = async ({ range, parseOutput = true, sdk = undefined}) => {
    /* @param {string} range */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/storage/usage';
    let payload = {};

    /** Query Params */
    if (typeof range !== 'undefined') {
        payload['range'] = range;
    }
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}

const storageGetBucketUsage = async ({ bucketId, range, parseOutput = true, sdk = undefined}) => {
    /* @param {string} bucketId */
    /* @param {string} range */

    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/storage/{bucketId}/usage'.replace('{bucketId}', bucketId);
    let payload = {};

    /** Query Params */
    if (typeof range !== 'undefined') {
        payload['range'] = range;
    }
    let response = undefined;
    response = await client.call('get', apiPath, {
        'content-type': 'application/json',
    }, payload);
    
    if (parseOutput) {
        parse(response)
        success()
    }
    return response;
}


storage
    .command(`listBuckets`)
    .description(`Get a list of all the storage buckets. You can use the query params to filter your results.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: enabled, name, fileSecurity, maximumFileSize, encryption, antivirus`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(storageListBuckets))

storage
    .command(`createBucket`)
    .description(`Create a new storage bucket.`)
    .requiredOption(`--bucketId <bucketId>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Bucket name`)
    .option(`--permissions [permissions...]`, `An array of permission strings. By default, no user is granted with any permissions. [Learn more about permissions](/docs/permissions).`)
    .option(`--fileSecurity <fileSecurity>`, `Enables configuring permissions for individual file. A user needs one of file or bucket level permissions to access a file. [Learn more about permissions](/docs/permissions).`, parseBool)
    .option(`--enabled <enabled>`, `Is bucket enabled? When set to 'disabled', users cannot access the files in this bucket but Server SDKs with and API key can still access the bucket. No files are lost when this is toggled.`, parseBool)
    .option(`--maximumFileSize <maximumFileSize>`, `Maximum file size allowed in bytes. Maximum allowed value is 30MB.`, parseInteger)
    .option(`--allowedFileExtensions [allowedFileExtensions...]`, `Allowed file extensions. Maximum of 100 extensions are allowed, each 64 characters long.`)
    .option(`--compression <compression>`, `Compression algorithm choosen for compression. Can be one of none,  [gzip](https://en.wikipedia.org/wiki/Gzip), or [zstd](https://en.wikipedia.org/wiki/Zstd), For file size above 20MB compression is skipped even if it's enabled`)
    .option(`--encryption <encryption>`, `Is encryption enabled? For file size above 20MB encryption is skipped even if it's enabled`, parseBool)
    .option(`--antivirus <antivirus>`, `Is virus scanning enabled? For file size above 20MB AntiVirus scanning is skipped even if it's enabled`, parseBool)
    .action(actionRunner(storageCreateBucket))

storage
    .command(`getBucket`)
    .description(`Get a storage bucket by its unique ID. This endpoint response returns a JSON object with the storage bucket metadata.`)
    .requiredOption(`--bucketId <bucketId>`, `Bucket unique ID.`)
    .action(actionRunner(storageGetBucket))

storage
    .command(`updateBucket`)
    .description(`Update a storage bucket by its unique ID.`)
    .requiredOption(`--bucketId <bucketId>`, `Bucket unique ID.`)
    .requiredOption(`--name <name>`, `Bucket name`)
    .option(`--permissions [permissions...]`, `An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](/docs/permissions).`)
    .option(`--fileSecurity <fileSecurity>`, `Enables configuring permissions for individual file. A user needs one of file or bucket level permissions to access a file. [Learn more about permissions](/docs/permissions).`, parseBool)
    .option(`--enabled <enabled>`, `Is bucket enabled? When set to 'disabled', users cannot access the files in this bucket but Server SDKs with and API key can still access the bucket. No files are lost when this is toggled.`, parseBool)
    .option(`--maximumFileSize <maximumFileSize>`, `Maximum file size allowed in bytes. Maximum allowed value is 30MB.`, parseInteger)
    .option(`--allowedFileExtensions [allowedFileExtensions...]`, `Allowed file extensions. Maximum of 100 extensions are allowed, each 64 characters long.`)
    .option(`--compression <compression>`, `Compression algorithm choosen for compression. Can be one of none, [gzip](https://en.wikipedia.org/wiki/Gzip), or [zstd](https://en.wikipedia.org/wiki/Zstd), For file size above 20MB compression is skipped even if it's enabled`)
    .option(`--encryption <encryption>`, `Is encryption enabled? For file size above 20MB encryption is skipped even if it's enabled`, parseBool)
    .option(`--antivirus <antivirus>`, `Is virus scanning enabled? For file size above 20MB AntiVirus scanning is skipped even if it's enabled`, parseBool)
    .action(actionRunner(storageUpdateBucket))

storage
    .command(`deleteBucket`)
    .description(`Delete a storage bucket by its unique ID.`)
    .requiredOption(`--bucketId <bucketId>`, `Bucket unique ID.`)
    .action(actionRunner(storageDeleteBucket))

storage
    .command(`listFiles`)
    .description(`Get a list of all the user files. You can use the query params to filter your results.`)
    .requiredOption(`--bucketId <bucketId>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](/docs/server/storage#createBucket).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, signature, mimeType, sizeOriginal, chunksTotal, chunksUploaded`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .action(actionRunner(storageListFiles))

storage
    .command(`createFile`)
    .description(`Create a new file. Before using this route, you should create a new bucket resource using either a [server integration](/docs/server/storage#storageCreateBucket) API or directly from your Appwrite console.  Larger files should be uploaded using multiple requests with the [content-range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) header to send a partial request with a maximum supported chunk of '5MB'. The 'content-range' header values should always be in bytes.  When the first request is sent, the server will return the **File** object, and the subsequent part request must include the file's **id** in 'x-appwrite-id' header to allow the server to know that the partial upload is for the existing file and not for a new one.  If you're creating a new file using one of the Appwrite SDKs, all the chunking logic will be managed by the SDK internally. `)
    .requiredOption(`--bucketId <bucketId>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](/docs/server/storage#createBucket).`)
    .requiredOption(`--fileId <fileId>`, `File ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--file <file>`, `Binary file. Appwrite SDKs provide helpers to handle file input. [Learn about file input](/docs/storage#file-input).`)
    .option(`--permissions [permissions...]`, `An array of permission strings. By default, only the current user is granted all permissions. [Learn more about permissions](/docs/permissions).`)
    .action(actionRunner(storageCreateFile))

storage
    .command(`getFile`)
    .description(`Get a file by its unique ID. This endpoint response returns a JSON object with the file metadata.`)
    .requiredOption(`--bucketId <bucketId>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](/docs/server/storage#createBucket).`)
    .requiredOption(`--fileId <fileId>`, `File ID.`)
    .action(actionRunner(storageGetFile))

storage
    .command(`updateFile`)
    .description(`Update a file by its unique ID. Only users with write permissions have access to update this resource.`)
    .requiredOption(`--bucketId <bucketId>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](/docs/server/storage#createBucket).`)
    .requiredOption(`--fileId <fileId>`, `File unique ID.`)
    .option(`--name <name>`, `Name of the file`)
    .option(`--permissions [permissions...]`, `An array of permission string. By default, the current permissions are inherited. [Learn more about permissions](/docs/permissions).`)
    .action(actionRunner(storageUpdateFile))

storage
    .command(`deleteFile`)
    .description(`Delete a file by its unique ID. Only users with write permissions have access to delete this resource.`)
    .requiredOption(`--bucketId <bucketId>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](/docs/server/storage#createBucket).`)
    .requiredOption(`--fileId <fileId>`, `File ID.`)
    .action(actionRunner(storageDeleteFile))

storage
    .command(`getFileDownload`)
    .description(`Get a file content by its unique ID. The endpoint response return with a 'Content-Disposition: attachment' header that tells the browser to start downloading the file to user downloads directory.`)
    .requiredOption(`--bucketId <bucketId>`, `Storage bucket ID. You can create a new storage bucket using the Storage service [server integration](/docs/server/storage#createBucket).`)
    .requiredOption(`--fileId <fileId>`, `File ID.`)
    .requiredOption(`--destination <path>`, `output file path.`)
    .action(actionRunner(storageGetFileDownload))

storage
    .command(`getFilePreview`)
    .description(`Get a file preview image. Currently, this method supports preview for image files (jpg, png, and gif), other supported formats, like pdf, docs, slides, and spreadsheets, will return the file icon image. You can also pass query string arguments for cutting and resizing your preview image. Preview is supported only for image files smaller than 10MB.`)
    .requiredOption(`--bucketId <bucketId>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](/docs/server/storage#createBucket).`)
    .requiredOption(`--fileId <fileId>`, `File ID`)
    .option(`--width <width>`, `Resize preview image width, Pass an integer between 0 to 4000.`, parseInteger)
    .option(`--height <height>`, `Resize preview image height, Pass an integer between 0 to 4000.`, parseInteger)
    .option(`--gravity <gravity>`, `Image crop gravity. Can be one of center,top-left,top,top-right,left,right,bottom-left,bottom,bottom-right`)
    .option(`--quality <quality>`, `Preview image quality. Pass an integer between 0 to 100. Defaults to 100.`, parseInteger)
    .option(`--borderWidth <borderWidth>`, `Preview image border in pixels. Pass an integer between 0 to 100. Defaults to 0.`, parseInteger)
    .option(`--borderColor <borderColor>`, `Preview image border color. Use a valid HEX color, no # is needed for prefix.`)
    .option(`--borderRadius <borderRadius>`, `Preview image border radius in pixels. Pass an integer between 0 to 4000.`, parseInteger)
    .option(`--opacity <opacity>`, `Preview image opacity. Only works with images having an alpha channel (like png). Pass a number between 0 to 1.`, parseInteger)
    .option(`--rotation <rotation>`, `Preview image rotation in degrees. Pass an integer between -360 and 360.`, parseInteger)
    .option(`--background <background>`, `Preview image background color. Only works with transparent images (png). Use a valid HEX color, no # is needed for prefix.`)
    .option(`--output <output>`, `Output format type (jpeg, jpg, png, gif and webp).`)
    .requiredOption(`--destination <path>`, `output file path.`)
    .action(actionRunner(storageGetFilePreview))

storage
    .command(`getFileView`)
    .description(`Get a file content by its unique ID. This endpoint is similar to the download method but returns with no  'Content-Disposition: attachment' header.`)
    .requiredOption(`--bucketId <bucketId>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](/docs/server/storage#createBucket).`)
    .requiredOption(`--fileId <fileId>`, `File ID.`)
    .requiredOption(`--destination <path>`, `output file path.`)
    .action(actionRunner(storageGetFileView))

storage
    .command(`getUsage`)
    .description(``)
    .option(`--range <range>`, `Date range.`)
    .action(actionRunner(storageGetUsage))

storage
    .command(`getBucketUsage`)
    .description(``)
    .requiredOption(`--bucketId <bucketId>`, `Bucket ID.`)
    .option(`--range <range>`, `Date range.`)
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
