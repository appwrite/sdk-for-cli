import fs from "fs";
import pathLib from "path";
import tar from "tar";
import ignoreModule from "ignore";
const ignore = ignoreModule.default ?? ignoreModule;
import { getAllFiles, showConsoleLink } from "../utils.js";
import { Command } from "commander";
import { sdkForProject } from "../sdks.js";
import { parse, actionRunner, parseInteger, parseBool, commandDescriptions, } from "../parser.js";
import { localConfig, globalConfig } from "../config.js";
import { File } from "undici";
import { ReadableStream } from "stream/web";
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
export const functions = new Command("functions")
    .description(commandDescriptions["functions"] ?? "")
    .configureHelp({
    helpWidth: process.stdout.columns || 80,
});
export const functionsList = async ({ queries, search, total, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions";
    let payload = {};
    if (typeof queries !== "undefined") {
        payload["queries"] = queries;
    }
    if (typeof search !== "undefined") {
        payload["search"] = search;
    }
    if (typeof total !== "undefined") {
        payload["total"] = total;
    }
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("functions", "list");
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const functionsCreate = async ({ functionId, name, runtime, execute, events, schedule, timeout, enabled, logging, entrypoint, commands, scopes, installationId, providerRepositoryId, providerBranch, providerSilentMode, providerRootDirectory, specification, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions";
    let payload = {};
    if (typeof functionId !== "undefined") {
        payload["functionId"] = functionId;
    }
    if (typeof name !== "undefined") {
        payload["name"] = name;
    }
    if (typeof runtime !== "undefined") {
        payload["runtime"] = runtime;
    }
    execute = execute === true ? [] : execute;
    if (typeof execute !== "undefined") {
        payload["execute"] = execute;
    }
    events = events === true ? [] : events;
    if (typeof events !== "undefined") {
        payload["events"] = events;
    }
    if (typeof schedule !== "undefined") {
        payload["schedule"] = schedule;
    }
    if (typeof timeout !== "undefined") {
        payload["timeout"] = timeout;
    }
    if (typeof enabled !== "undefined") {
        payload["enabled"] = enabled;
    }
    if (typeof logging !== "undefined") {
        payload["logging"] = logging;
    }
    if (typeof entrypoint !== "undefined") {
        payload["entrypoint"] = entrypoint;
    }
    if (typeof commands !== "undefined") {
        payload["commands"] = commands;
    }
    scopes = scopes === true ? [] : scopes;
    if (typeof scopes !== "undefined") {
        payload["scopes"] = scopes;
    }
    if (typeof installationId !== "undefined") {
        payload["installationId"] = installationId;
    }
    if (typeof providerRepositoryId !== "undefined") {
        payload["providerRepositoryId"] = providerRepositoryId;
    }
    if (typeof providerBranch !== "undefined") {
        payload["providerBranch"] = providerBranch;
    }
    if (typeof providerSilentMode !== "undefined") {
        payload["providerSilentMode"] = providerSilentMode;
    }
    if (typeof providerRootDirectory !== "undefined") {
        payload["providerRootDirectory"] = providerRootDirectory;
    }
    if (typeof specification !== "undefined") {
        payload["specification"] = specification;
    }
    let response = undefined;
    response = await client.call("post", apiPath, {
        "content-type": "application/json",
    }, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsListRuntimes = async ({ parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/runtimes";
    let payload = {};
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsListSpecifications = async ({ parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/specifications";
    let payload = {};
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("functions", "listSpecifications");
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const functionsListTemplates = async ({ runtimes, useCases, limit, offset, total, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/templates";
    let payload = {};
    if (typeof runtimes !== "undefined") {
        payload["runtimes"] = runtimes;
    }
    if (typeof useCases !== "undefined") {
        payload["useCases"] = useCases;
    }
    if (typeof limit !== "undefined") {
        payload["limit"] = limit;
    }
    if (typeof offset !== "undefined") {
        payload["offset"] = offset;
    }
    if (typeof total !== "undefined") {
        payload["total"] = total;
    }
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("functions", "listTemplates");
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const functionsGetTemplate = async ({ templateId, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/templates/{templateId}".replace("{templateId}", templateId);
    let payload = {};
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("functions", "getTemplate", templateId);
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const functionsListUsage = async ({ range, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/usage";
    let payload = {};
    if (typeof range !== "undefined") {
        payload["range"] = range;
    }
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("functions", "listUsage");
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const functionsGet = async ({ functionId, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}".replace("{functionId}", functionId);
    let payload = {};
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("functions", "get", functionId);
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const functionsUpdate = async ({ functionId, name, runtime, execute, events, schedule, timeout, enabled, logging, entrypoint, commands, scopes, installationId, providerRepositoryId, providerBranch, providerSilentMode, providerRootDirectory, specification, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}".replace("{functionId}", functionId);
    let payload = {};
    if (typeof name !== "undefined") {
        payload["name"] = name;
    }
    if (typeof runtime !== "undefined") {
        payload["runtime"] = runtime;
    }
    execute = execute === true ? [] : execute;
    if (typeof execute !== "undefined") {
        payload["execute"] = execute;
    }
    events = events === true ? [] : events;
    if (typeof events !== "undefined") {
        payload["events"] = events;
    }
    if (typeof schedule !== "undefined") {
        payload["schedule"] = schedule;
    }
    if (typeof timeout !== "undefined") {
        payload["timeout"] = timeout;
    }
    if (typeof enabled !== "undefined") {
        payload["enabled"] = enabled;
    }
    if (typeof logging !== "undefined") {
        payload["logging"] = logging;
    }
    if (typeof entrypoint !== "undefined") {
        payload["entrypoint"] = entrypoint;
    }
    if (typeof commands !== "undefined") {
        payload["commands"] = commands;
    }
    scopes = scopes === true ? [] : scopes;
    if (typeof scopes !== "undefined") {
        payload["scopes"] = scopes;
    }
    if (typeof installationId !== "undefined") {
        payload["installationId"] = installationId;
    }
    if (typeof providerRepositoryId !== "undefined") {
        payload["providerRepositoryId"] = providerRepositoryId;
    }
    if (typeof providerBranch !== "undefined") {
        payload["providerBranch"] = providerBranch;
    }
    if (typeof providerSilentMode !== "undefined") {
        payload["providerSilentMode"] = providerSilentMode;
    }
    if (typeof providerRootDirectory !== "undefined") {
        payload["providerRootDirectory"] = providerRootDirectory;
    }
    if (typeof specification !== "undefined") {
        payload["specification"] = specification;
    }
    let response = undefined;
    response = await client.call("put", apiPath, {
        "content-type": "application/json",
    }, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsDelete = async ({ functionId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}".replace("{functionId}", functionId);
    let payload = {};
    let response = undefined;
    response = await client.call("delete", apiPath, {
        "content-type": "application/json",
    }, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsUpdateFunctionDeployment = async ({ functionId, deploymentId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/deployment".replace("{functionId}", functionId);
    let payload = {};
    if (typeof deploymentId !== "undefined") {
        payload["deploymentId"] = deploymentId;
    }
    let response = undefined;
    response = await client.call("patch", apiPath, {
        "content-type": "application/json",
    }, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsListDeployments = async ({ functionId, queries, search, total, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/deployments".replace("{functionId}", functionId);
    let payload = {};
    if (typeof queries !== "undefined") {
        payload["queries"] = queries;
    }
    if (typeof search !== "undefined") {
        payload["search"] = search;
    }
    if (typeof total !== "undefined") {
        payload["total"] = total;
    }
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("functions", "listDeployments", functionId);
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const functionsCreateDeployment = async ({ functionId, code, activate, entrypoint, commands, parseOutput = true, overrideForCli = false, sdk = undefined, onProgress = (progress) => { }, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/deployments".replace("{functionId}", functionId);
    let payload = {};
    if (typeof entrypoint !== "undefined") {
        payload["entrypoint"] = entrypoint;
    }
    if (typeof commands !== "undefined") {
        payload["commands"] = commands;
    }
    const folderPath = fs.realpathSync(code);
    if (!fs.lstatSync(folderPath).isDirectory()) {
        throw new Error("The path is not a directory.");
    }
    const ignorer = ignore();
    const resourceId = functionId;
    const resourceConfig = localConfig.getFunction(resourceId);
    ignorer.add(".appwrite");
    if (resourceConfig.ignore) {
        ignorer.add(resourceConfig.ignore);
    }
    else if (fs.existsSync(pathLib.join(code, ".gitignore"))) {
        ignorer.add(fs.readFileSync(pathLib.join(code, ".gitignore")).toString());
    }
    const files = getAllFiles(code)
        .map((file) => pathLib.relative(code, file))
        .filter((file) => !ignorer.ignores(file));
    const archiveFileName = `functions-${resourceId}-code.tar.gz`;
    await tar.create({
        gzip: true,
        sync: true,
        cwd: folderPath,
        file: archiveFileName,
    }, files);
    let archivePath = fs.realpathSync(archiveFileName);
    if (typeof archivePath !== "undefined") {
        payload["code"] = archivePath;
        code = archivePath;
    }
    const filePath = fs.realpathSync(code);
    const nodeStream = fs.createReadStream(filePath);
    const stream = convertReadStreamToReadableStream(nodeStream);
    const codeUpload = {
        type: "file",
        stream,
        filename: pathLib.basename(filePath),
        size: fs.statSync(filePath).size,
    };
    payload["code"] = codeUpload;
    if (typeof activate !== "undefined") {
        payload["activate"] = activate;
    }
    const size = codeUpload.size;
    const apiHeaders = {
        "content-type": "multipart/form-data",
    };
    let id = undefined;
    let response = undefined;
    let chunksUploaded = 0;
    let currentChunk = 1;
    let currentPosition = 0;
    let uploadableChunk = new Uint8Array(client.CHUNK_SIZE);
    const uploadChunk = async (lastUpload = false) => {
        if (currentChunk <= chunksUploaded) {
            return;
        }
        const start = (currentChunk - 1) * client.CHUNK_SIZE;
        let end = start + currentPosition - 1;
        if (!lastUpload || currentChunk !== 1) {
            apiHeaders["content-range"] = "bytes " + start + "-" + end + "/" + size;
        }
        let uploadableChunkTrimmed;
        if (currentPosition + 1 >= client.CHUNK_SIZE) {
            uploadableChunkTrimmed = uploadableChunk;
        }
        else {
            uploadableChunkTrimmed = new Uint8Array(currentPosition);
            for (let i = 0; i <= currentPosition; i++) {
                uploadableChunkTrimmed[i] = uploadableChunk[i];
            }
        }
        if (id) {
            apiHeaders["x-appwrite-id"] = id;
        }
        payload["code"] = {
            type: "file",
            file: new File([uploadableChunkTrimmed], codeUpload.filename),
            filename: codeUpload.filename,
        };
        response = await client.call("post", apiPath, apiHeaders, payload);
        if (!id) {
            id = response["$id"];
        }
        if (onProgress !== null) {
            onProgress({
                $id: response["$id"],
                progress: (Math.min(currentChunk * client.CHUNK_SIZE, size) / size) * 100,
                sizeUploaded: end + 1,
                chunksTotal: response["chunksTotal"],
                chunksUploaded: response["chunksUploaded"],
            });
        }
        uploadableChunk = new Uint8Array(client.CHUNK_SIZE);
        currentChunk++;
        currentPosition = 0;
    };
    for await (const chunk of codeUpload.stream) {
        for (const b of chunk) {
            uploadableChunk[currentPosition] = b;
            currentPosition++;
            if (currentPosition >= client.CHUNK_SIZE) {
                await uploadChunk();
                currentPosition = 0;
            }
        }
    }
    if (currentPosition > 0) {
        // Check if there's any remaining data for the last chunk
        await uploadChunk(true);
    }
    await fs.unlink(filePath, () => { });
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsCreateDuplicateDeployment = async ({ functionId, deploymentId, buildId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/deployments/duplicate".replace("{functionId}", functionId);
    let payload = {};
    if (typeof deploymentId !== "undefined") {
        payload["deploymentId"] = deploymentId;
    }
    if (typeof buildId !== "undefined") {
        payload["buildId"] = buildId;
    }
    let response = undefined;
    response = await client.call("post", apiPath, {
        "content-type": "application/json",
    }, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsCreateTemplateDeployment = async ({ functionId, repository, owner, rootDirectory, type, reference, activate, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/deployments/template".replace("{functionId}", functionId);
    let payload = {};
    if (typeof repository !== "undefined") {
        payload["repository"] = repository;
    }
    if (typeof owner !== "undefined") {
        payload["owner"] = owner;
    }
    if (typeof rootDirectory !== "undefined") {
        payload["rootDirectory"] = rootDirectory;
    }
    if (typeof type !== "undefined") {
        payload["type"] = type;
    }
    if (typeof reference !== "undefined") {
        payload["reference"] = reference;
    }
    if (typeof activate !== "undefined") {
        payload["activate"] = activate;
    }
    let response = undefined;
    response = await client.call("post", apiPath, {
        "content-type": "application/json",
    }, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsCreateVcsDeployment = async ({ functionId, type, reference, activate, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/deployments/vcs".replace("{functionId}", functionId);
    let payload = {};
    if (typeof type !== "undefined") {
        payload["type"] = type;
    }
    if (typeof reference !== "undefined") {
        payload["reference"] = reference;
    }
    if (typeof activate !== "undefined") {
        payload["activate"] = activate;
    }
    let response = undefined;
    response = await client.call("post", apiPath, {
        "content-type": "application/json",
    }, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsGetDeployment = async ({ functionId, deploymentId, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/deployments/{deploymentId}"
        .replace("{functionId}", functionId)
        .replace("{deploymentId}", deploymentId);
    let payload = {};
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("functions", "getDeployment", functionId, deploymentId);
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const functionsDeleteDeployment = async ({ functionId, deploymentId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/deployments/{deploymentId}"
        .replace("{functionId}", functionId)
        .replace("{deploymentId}", deploymentId);
    let payload = {};
    let response = undefined;
    response = await client.call("delete", apiPath, {
        "content-type": "application/json",
    }, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsGetDeploymentDownload = async ({ functionId, deploymentId, type, parseOutput = true, overrideForCli = false, sdk = undefined, destination, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/deployments/{deploymentId}/download"
        .replace("{functionId}", functionId)
        .replace("{deploymentId}", deploymentId);
    let payload = {};
    if (typeof type !== "undefined") {
        payload["type"] = type;
    }
    if (!overrideForCli) {
        payload["project"] = localConfig.getProject().projectId;
        payload["key"] = globalConfig.getKey();
        const queryParams = new URLSearchParams(payload);
        apiPath = `${globalConfig.getEndpoint()}${apiPath}?${queryParams.toString()}`;
    }
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload, "arraybuffer");
    if (overrideForCli) {
        response = Buffer.from(response);
    }
    fs.writeFileSync(destination, response);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("functions", "getDeploymentDownload", functionId, deploymentId);
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const functionsUpdateDeploymentStatus = async ({ functionId, deploymentId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/deployments/{deploymentId}/status"
        .replace("{functionId}", functionId)
        .replace("{deploymentId}", deploymentId);
    let payload = {};
    let response = undefined;
    response = await client.call("patch", apiPath, {
        "content-type": "application/json",
    }, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsListExecutions = async ({ functionId, queries, total, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/executions".replace("{functionId}", functionId);
    let payload = {};
    if (typeof queries !== "undefined") {
        payload["queries"] = queries;
    }
    if (typeof total !== "undefined") {
        payload["total"] = total;
    }
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("functions", "listExecutions", functionId);
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const functionsCreateExecution = async ({ functionId, body, async, xpath, method, headers, scheduledAt, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/executions".replace("{functionId}", functionId);
    let payload = {};
    if (typeof body !== "undefined") {
        payload["body"] = body;
    }
    if (typeof async !== "undefined") {
        payload["async"] = async;
    }
    if (typeof xpath !== "undefined") {
        payload["path"] = xpath;
    }
    if (typeof method !== "undefined") {
        payload["method"] = method;
    }
    if (typeof headers !== "undefined") {
        payload["headers"] = JSON.parse(headers);
    }
    if (typeof scheduledAt !== "undefined") {
        payload["scheduledAt"] = scheduledAt;
    }
    let response = undefined;
    response = await client.call("post", apiPath, {
        "content-type": "application/json",
    }, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsGetExecution = async ({ functionId, executionId, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/executions/{executionId}"
        .replace("{functionId}", functionId)
        .replace("{executionId}", executionId);
    let payload = {};
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("functions", "getExecution", functionId, executionId);
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const functionsDeleteExecution = async ({ functionId, executionId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/executions/{executionId}"
        .replace("{functionId}", functionId)
        .replace("{executionId}", executionId);
    let payload = {};
    let response = undefined;
    response = await client.call("delete", apiPath, {
        "content-type": "application/json",
    }, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsGetUsage = async ({ functionId, range, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/usage".replace("{functionId}", functionId);
    let payload = {};
    if (typeof range !== "undefined") {
        payload["range"] = range;
    }
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsListVariables = async ({ functionId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/variables".replace("{functionId}", functionId);
    let payload = {};
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsCreateVariable = async ({ functionId, key, value, secret, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/variables".replace("{functionId}", functionId);
    let payload = {};
    if (typeof key !== "undefined") {
        payload["key"] = key;
    }
    if (typeof value !== "undefined") {
        payload["value"] = value;
    }
    if (typeof secret !== "undefined") {
        payload["secret"] = secret;
    }
    let response = undefined;
    response = await client.call("post", apiPath, {
        "content-type": "application/json",
    }, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsGetVariable = async ({ functionId, variableId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/variables/{variableId}"
        .replace("{functionId}", functionId)
        .replace("{variableId}", variableId);
    let payload = {};
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsUpdateVariable = async ({ functionId, variableId, key, value, secret, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/variables/{variableId}"
        .replace("{functionId}", functionId)
        .replace("{variableId}", variableId);
    let payload = {};
    if (typeof key !== "undefined") {
        payload["key"] = key;
    }
    if (typeof value !== "undefined") {
        payload["value"] = value;
    }
    if (typeof secret !== "undefined") {
        payload["secret"] = secret;
    }
    let response = undefined;
    response = await client.call("put", apiPath, {
        "content-type": "application/json",
    }, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const functionsDeleteVariable = async ({ functionId, variableId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/functions/{functionId}/variables/{variableId}"
        .replace("{functionId}", functionId)
        .replace("{variableId}", variableId);
    let payload = {};
    let response = undefined;
    response = await client.call("delete", apiPath, {
        "content-type": "application/json",
    }, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
functions
    .command(`list`)
    .description(`Get a list of all the project's functions. You can use the query params to filter your results.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, runtime, deploymentId, schedule, scheduleNext, schedulePrevious, timeout, entrypoint, commands, installationId`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsList));
functions
    .command(`create`)
    .description(`Create a new function. You can pass a list of [permissions](https://appwrite.io/docs/permissions) to allow different project users or team with access to execute the function using the client API.`)
    .requiredOption(`--function-id <function-id>`, `Function ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Function name. Max length: 128 chars.`)
    .requiredOption(`--runtime <runtime>`, `Execution runtime.`)
    .option(`--execute [execute...]`, `An array of role strings with execution permissions. By default no user is granted with any execute permissions. [learn more about roles](https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.`)
    .option(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
    .option(`--schedule <schedule>`, `Schedule CRON syntax.`)
    .option(`--timeout <timeout>`, `Function maximum execution time in seconds.`, parseInteger)
    .option(`--enabled [value]`, `Is function enabled? When set to 'disabled', users cannot access the function but Server SDKs with and API key can still access the function. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--logging [value]`, `When disabled, executions will exclude logs and errors, and will be slightly faster.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--entrypoint <entrypoint>`, `Entrypoint File. This path is relative to the "providerRootDirectory".`)
    .option(`--commands <commands>`, `Build Commands.`)
    .option(`--scopes [scopes...]`, `List of scopes allowed for API key auto-generated for every execution. Maximum of 100 scopes are allowed.`)
    .option(`--installation-id <installation-id>`, `Appwrite Installation ID for VCS (Version Control System) deployment.`)
    .option(`--provider-repository-id <provider-repository-id>`, `Repository ID of the repo linked to the function.`)
    .option(`--provider-branch <provider-branch>`, `Production branch for the repo linked to the function.`)
    .option(`--provider-silent-mode [value]`, `Is the VCS (Version Control System) connection in silent mode for the repo linked to the function? In silent mode, comments will not be made on commits and pull requests.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--provider-root-directory <provider-root-directory>`, `Path to function code in the linked repo.`)
    .option(`--specification <specification>`, `Runtime specification for the function and builds.`)
    .action(actionRunner(functionsCreate));
functions
    .command(`list-runtimes`)
    .description(`Get a list of all runtimes that are currently active on your instance.`)
    .action(actionRunner(functionsListRuntimes));
functions
    .command(`list-specifications`)
    .description(`List allowed function specifications for this instance.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsListSpecifications));
functions
    .command(`list-templates`)
    .description(`List available function templates. You can use template details in [createFunction](/docs/references/cloud/server-nodejs/functions#create) method.`)
    .option(`--runtimes [runtimes...]`, `List of runtimes allowed for filtering function templates. Maximum of 100 runtimes are allowed.`)
    .option(`--use-cases [use-cases...]`, `List of use cases allowed for filtering function templates. Maximum of 100 use cases are allowed.`)
    .option(`--limit <limit>`, `Limit the number of templates returned in the response. Default limit is 25, and maximum limit is 5000.`, parseInteger)
    .option(`--offset <offset>`, `Offset the list of returned templates. Maximum offset is 5000.`, parseInteger)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsListTemplates));
functions
    .command(`get-template`)
    .description(`Get a function template using ID. You can use template details in [createFunction](/docs/references/cloud/server-nodejs/functions#create) method.`)
    .requiredOption(`--template-id <template-id>`, `Template ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsGetTemplate));
functions
    .command(`list-usage`)
    .description(`Get usage metrics and statistics for all functions in the project. View statistics including total deployments, builds, logs, storage usage, and compute time. The response includes both current totals and historical data for each metric. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, defaults to 30 days.`)
    .option(`--range <range>`, `Date range.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsListUsage));
functions
    .command(`get`)
    .description(`Get a function by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsGet));
functions
    .command(`update`)
    .description(`Update function by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--name <name>`, `Function name. Max length: 128 chars.`)
    .option(`--runtime <runtime>`, `Execution runtime.`)
    .option(`--execute [execute...]`, `An array of role strings with execution permissions. By default no user is granted with any execute permissions. [learn more about roles](https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.`)
    .option(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
    .option(`--schedule <schedule>`, `Schedule CRON syntax.`)
    .option(`--timeout <timeout>`, `Maximum execution time in seconds.`, parseInteger)
    .option(`--enabled [value]`, `Is function enabled? When set to 'disabled', users cannot access the function but Server SDKs with and API key can still access the function. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--logging [value]`, `When disabled, executions will exclude logs and errors, and will be slightly faster.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--entrypoint <entrypoint>`, `Entrypoint File. This path is relative to the "providerRootDirectory".`)
    .option(`--commands <commands>`, `Build Commands.`)
    .option(`--scopes [scopes...]`, `List of scopes allowed for API Key auto-generated for every execution. Maximum of 100 scopes are allowed.`)
    .option(`--installation-id <installation-id>`, `Appwrite Installation ID for VCS (Version Controle System) deployment.`)
    .option(`--provider-repository-id <provider-repository-id>`, `Repository ID of the repo linked to the function`)
    .option(`--provider-branch <provider-branch>`, `Production branch for the repo linked to the function`)
    .option(`--provider-silent-mode [value]`, `Is the VCS (Version Control System) connection in silent mode for the repo linked to the function? In silent mode, comments will not be made on commits and pull requests.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--provider-root-directory <provider-root-directory>`, `Path to function code in the linked repo.`)
    .option(`--specification <specification>`, `Runtime specification for the function and builds.`)
    .action(actionRunner(functionsUpdate));
functions
    .command(`delete`)
    .description(`Delete a function by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .action(actionRunner(functionsDelete));
functions
    .command(`update-function-deployment`)
    .description(`Update the function active deployment. Use this endpoint to switch the code deployment that should be used when visitor opens your function.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .action(actionRunner(functionsUpdateFunctionDeployment));
functions
    .command(`list-deployments`)
    .description(`Get a list of all the function's code deployments. You can use the query params to filter your results.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: buildSize, sourceSize, totalSize, buildDuration, status, activate, type`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsListDeployments));
functions
    .command(`create-deployment`)
    .description(`Create a new function code deployment. Use this endpoint to upload a new version of your code function. To execute your newly uploaded code, you'll need to update the function's deployment to use your new deployment UID.  This endpoint accepts a tar.gz file compressed with your code. Make sure to include any dependencies your code has within the compressed file. You can learn more about code packaging in the [Appwrite Cloud Functions tutorial](https://appwrite.io/docs/functions).  Use the "command" param to set the entrypoint used to execute your code.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--code <code>`, `Gzip file with your code package. When used with the Appwrite CLI, pass the path to your code directory, and the CLI will automatically package your code. Use a path that is within the current directory.`)
    .requiredOption(`--activate [value]`, `Automatically activate the deployment when it is finished building.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--entrypoint <entrypoint>`, `Entrypoint File.`)
    .option(`--commands <commands>`, `Build Commands.`)
    .action(actionRunner(functionsCreateDeployment));
functions
    .command(`create-duplicate-deployment`)
    .description(`Create a new build for an existing function deployment. This endpoint allows you to rebuild a deployment with the updated function configuration, including its entrypoint and build commands if they have been modified. The build process will be queued and executed asynchronously. The original deployment's code will be preserved and used for the new build.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .option(`--build-id <build-id>`, `Build unique ID.`)
    .action(actionRunner(functionsCreateDuplicateDeployment));
functions
    .command(`create-template-deployment`)
    .description(`Create a deployment based on a template.  Use this endpoint with combination of [listTemplates](https://appwrite.io/docs/products/functions/templates) to find the template details.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--repository <repository>`, `Repository name of the template.`)
    .requiredOption(`--owner <owner>`, `The name of the owner of the template.`)
    .requiredOption(`--root-directory <root-directory>`, `Path to function code in the template repo.`)
    .requiredOption(`--type <type>`, `Type for the reference provided. Can be commit, branch, or tag`)
    .requiredOption(`--reference <reference>`, `Reference value, can be a commit hash, branch name, or release tag`)
    .option(`--activate [value]`, `Automatically activate the deployment when it is finished building.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(functionsCreateTemplateDeployment));
functions
    .command(`create-vcs-deployment`)
    .description(`Create a deployment when a function is connected to VCS.  This endpoint lets you create deployment from a branch, commit, or a tag.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--type <type>`, `Type of reference passed. Allowed values are: branch, commit`)
    .requiredOption(`--reference <reference>`, `VCS reference to create deployment from. Depending on type this can be: branch name, commit hash`)
    .option(`--activate [value]`, `Automatically activate the deployment when it is finished building.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(functionsCreateVcsDeployment));
functions
    .command(`get-deployment`)
    .description(`Get a function deployment by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsGetDeployment));
functions
    .command(`delete-deployment`)
    .description(`Delete a code deployment by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .action(actionRunner(functionsDeleteDeployment));
functions
    .command(`get-deployment-download`)
    .description(`Get a function deployment content by its unique ID. The endpoint response return with a 'Content-Disposition: attachment' header that tells the browser to start downloading the file to user downloads directory.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .option(`--type <type>`, `Deployment file to download. Can be: "source", "output".`)
    .requiredOption(`--destination <path>`, `output file path.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsGetDeploymentDownload));
functions
    .command(`update-deployment-status`)
    .description(`Cancel an ongoing function deployment build. If the build is already in progress, it will be stopped and marked as canceled. If the build hasn't started yet, it will be marked as canceled without executing. You cannot cancel builds that have already completed (status 'ready') or failed. The response includes the final build status and details.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--deployment-id <deployment-id>`, `Deployment ID.`)
    .action(actionRunner(functionsUpdateDeploymentStatus));
functions
    .command(`list-executions`)
    .description(`Get a list of all the current user function execution logs. You can use the query params to filter your results.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: trigger, status, responseStatusCode, duration, requestMethod, requestPath, deploymentId`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsListExecutions));
functions
    .command(`create-execution`)
    .description(`Trigger a function execution. The returned object will return you the current execution status. You can ping the 'Get Execution' endpoint to get updates on the current execution status. Once this endpoint is called, your function execution process will start asynchronously.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .option(`--body <body>`, `HTTP body of execution. Default value is empty string.`)
    .option(`--async [value]`, `Execute code in the background. Default value is false.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xpath <xpath>`, `HTTP path of execution. Path can include query params. Default value is /`)
    .option(`--method <method>`, `HTTP method of execution. Default value is POST.`)
    .option(`--headers <headers>`, `HTTP headers of execution. Defaults to empty.`)
    .option(`--scheduled-at <scheduled-at>`, `Scheduled execution time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future with precision in minutes.`)
    .action(actionRunner(functionsCreateExecution));
functions
    .command(`get-execution`)
    .description(`Get a function execution log by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--execution-id <execution-id>`, `Execution ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(functionsGetExecution));
functions
    .command(`delete-execution`)
    .description(`Delete a function execution by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .requiredOption(`--execution-id <execution-id>`, `Execution ID.`)
    .action(actionRunner(functionsDeleteExecution));
functions
    .command(`get-usage`)
    .description(`Get usage metrics and statistics for a for a specific function. View statistics including total deployments, builds, executions, storage usage, and compute time. The response includes both current totals and historical data for each metric. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, defaults to 30 days.`)
    .requiredOption(`--function-id <function-id>`, `Function ID.`)
    .option(`--range <range>`, `Date range.`)
    .action(actionRunner(functionsGetUsage));
functions
    .command(`list-variables`)
    .description(`Get a list of all variables of a specific function.`)
    .requiredOption(`--function-id <function-id>`, `Function unique ID.`)
    .action(actionRunner(functionsListVariables));
functions
    .command(`create-variable`)
    .description(`Create a new function environment variable. These variables can be accessed in the function at runtime as environment variables.`)
    .requiredOption(`--function-id <function-id>`, `Function unique ID.`)
    .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
    .requiredOption(`--value <value>`, `Variable value. Max length: 8192 chars.`)
    .option(`--secret [value]`, `Secret variables can be updated or deleted, but only functions can read them during build and runtime.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(functionsCreateVariable));
functions
    .command(`get-variable`)
    .description(`Get a variable by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function unique ID.`)
    .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
    .action(actionRunner(functionsGetVariable));
functions
    .command(`update-variable`)
    .description(`Update variable by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function unique ID.`)
    .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
    .requiredOption(`--key <key>`, `Variable key. Max length: 255 chars.`)
    .option(`--value <value>`, `Variable value. Max length: 8192 chars.`)
    .option(`--secret [value]`, `Secret variables can be updated or deleted, but only functions can read them during build and runtime.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(functionsUpdateVariable));
functions
    .command(`delete-variable`)
    .description(`Delete a variable by its unique ID.`)
    .requiredOption(`--function-id <function-id>`, `Function unique ID.`)
    .requiredOption(`--variable-id <variable-id>`, `Variable unique ID.`)
    .action(actionRunner(functionsDeleteVariable));
//# sourceMappingURL=functions.js.map