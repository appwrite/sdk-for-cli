import ignoreModule from "ignore";
const ignore = ignoreModule.default ?? ignoreModule;
import { showConsoleLink } from "../utils.js";
import { Command } from "commander";
import { sdkForProject } from "../sdks.js";
import { parse, actionRunner, parseInteger, parseBool, commandDescriptions, } from "../parser.js";
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
export const databases = new Command("databases")
    .description(commandDescriptions["databases"] ?? "")
    .configureHelp({
    helpWidth: process.stdout.columns || 80,
});
export const databasesList = async ({ queries, search, total, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases";
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
            showConsoleLink("databases", "list");
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const databasesCreate = async ({ databaseId, name, enabled, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases";
    let payload = {};
    if (typeof databaseId !== "undefined") {
        payload["databaseId"] = databaseId;
    }
    if (typeof name !== "undefined") {
        payload["name"] = name;
    }
    if (typeof enabled !== "undefined") {
        payload["enabled"] = enabled;
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
export const databasesListTransactions = async ({ queries, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/transactions";
    let payload = {};
    if (typeof queries !== "undefined") {
        payload["queries"] = queries;
    }
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("databases", "listTransactions");
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const databasesCreateTransaction = async ({ ttl, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/transactions";
    let payload = {};
    if (typeof ttl !== "undefined") {
        payload["ttl"] = ttl;
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
export const databasesGetTransaction = async ({ transactionId, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/transactions/{transactionId}".replace("{transactionId}", transactionId);
    let payload = {};
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("databases", "getTransaction", transactionId);
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const databasesUpdateTransaction = async ({ transactionId, commit, rollback, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/transactions/{transactionId}".replace("{transactionId}", transactionId);
    let payload = {};
    if (typeof commit !== "undefined") {
        payload["commit"] = commit;
    }
    if (typeof rollback !== "undefined") {
        payload["rollback"] = rollback;
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
export const databasesDeleteTransaction = async ({ transactionId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/transactions/{transactionId}".replace("{transactionId}", transactionId);
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
export const databasesCreateOperations = async ({ transactionId, operations, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/transactions/{transactionId}/operations".replace("{transactionId}", transactionId);
    let payload = {};
    operations = operations === true ? [] : operations;
    if (typeof operations !== "undefined") {
        payload["operations"] = operations;
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
export const databasesListUsage = async ({ range, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/usage";
    let payload = {};
    if (typeof range !== "undefined") {
        payload["range"] = range;
    }
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("databases", "listUsage");
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const databasesGet = async ({ databaseId, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}".replace("{databaseId}", databaseId);
    let payload = {};
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("databases", "get", databaseId);
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const databasesUpdate = async ({ databaseId, name, enabled, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}".replace("{databaseId}", databaseId);
    let payload = {};
    if (typeof name !== "undefined") {
        payload["name"] = name;
    }
    if (typeof enabled !== "undefined") {
        payload["enabled"] = enabled;
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
export const databasesDelete = async ({ databaseId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}".replace("{databaseId}", databaseId);
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
export const databasesListCollections = async ({ databaseId, queries, search, total, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections".replace("{databaseId}", databaseId);
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
            showConsoleLink("databases", "listCollections", databaseId);
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const databasesCreateCollection = async ({ databaseId, collectionId, name, permissions, documentSecurity, enabled, attributes, indexes, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections".replace("{databaseId}", databaseId);
    let payload = {};
    if (typeof collectionId !== "undefined") {
        payload["collectionId"] = collectionId;
    }
    if (typeof name !== "undefined") {
        payload["name"] = name;
    }
    permissions = permissions === true ? [] : permissions;
    if (typeof permissions !== "undefined") {
        payload["permissions"] = permissions;
    }
    if (typeof documentSecurity !== "undefined") {
        payload["documentSecurity"] = documentSecurity;
    }
    if (typeof enabled !== "undefined") {
        payload["enabled"] = enabled;
    }
    attributes = attributes === true ? [] : attributes;
    if (typeof attributes !== "undefined") {
        payload["attributes"] = attributes;
    }
    indexes = indexes === true ? [] : indexes;
    if (typeof indexes !== "undefined") {
        payload["indexes"] = indexes;
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
export const databasesGetCollection = async ({ databaseId, collectionId, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("databases", "getCollection", databaseId, collectionId);
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const databasesUpdateCollection = async ({ databaseId, collectionId, name, permissions, documentSecurity, enabled, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof name !== "undefined") {
        payload["name"] = name;
    }
    permissions = permissions === true ? [] : permissions;
    if (typeof permissions !== "undefined") {
        payload["permissions"] = permissions;
    }
    if (typeof documentSecurity !== "undefined") {
        payload["documentSecurity"] = documentSecurity;
    }
    if (typeof enabled !== "undefined") {
        payload["enabled"] = enabled;
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
export const databasesDeleteCollection = async ({ databaseId, collectionId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
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
export const databasesListAttributes = async ({ databaseId, collectionId, queries, total, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
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
            showConsoleLink("databases", "listAttributes", databaseId, collectionId);
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const databasesCreateBooleanAttribute = async ({ databaseId, collectionId, key, required, xdefault, array, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/boolean"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof key !== "undefined") {
        payload["key"] = key;
    }
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof array !== "undefined") {
        payload["array"] = array;
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
export const databasesUpdateBooleanAttribute = async ({ databaseId, collectionId, key, required, xdefault, newKey, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/boolean/{key}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{key}", key);
    let payload = {};
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof newKey !== "undefined") {
        payload["newKey"] = newKey;
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
export const databasesCreateDatetimeAttribute = async ({ databaseId, collectionId, key, required, xdefault, array, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/datetime"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof key !== "undefined") {
        payload["key"] = key;
    }
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof array !== "undefined") {
        payload["array"] = array;
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
export const databasesUpdateDatetimeAttribute = async ({ databaseId, collectionId, key, required, xdefault, newKey, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/datetime/{key}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{key}", key);
    let payload = {};
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof newKey !== "undefined") {
        payload["newKey"] = newKey;
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
export const databasesCreateEmailAttribute = async ({ databaseId, collectionId, key, required, xdefault, array, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/email"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof key !== "undefined") {
        payload["key"] = key;
    }
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof array !== "undefined") {
        payload["array"] = array;
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
export const databasesUpdateEmailAttribute = async ({ databaseId, collectionId, key, required, xdefault, newKey, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/email/{key}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{key}", key);
    let payload = {};
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof newKey !== "undefined") {
        payload["newKey"] = newKey;
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
export const databasesCreateEnumAttribute = async ({ databaseId, collectionId, key, elements, required, xdefault, array, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/enum"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof key !== "undefined") {
        payload["key"] = key;
    }
    elements = elements === true ? [] : elements;
    if (typeof elements !== "undefined") {
        payload["elements"] = elements;
    }
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof array !== "undefined") {
        payload["array"] = array;
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
export const databasesUpdateEnumAttribute = async ({ databaseId, collectionId, key, elements, required, xdefault, newKey, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/enum/{key}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{key}", key);
    let payload = {};
    elements = elements === true ? [] : elements;
    if (typeof elements !== "undefined") {
        payload["elements"] = elements;
    }
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof newKey !== "undefined") {
        payload["newKey"] = newKey;
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
export const databasesCreateFloatAttribute = async ({ databaseId, collectionId, key, required, min, max, xdefault, array, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/float"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof key !== "undefined") {
        payload["key"] = key;
    }
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof min !== "undefined") {
        payload["min"] = min;
    }
    if (typeof max !== "undefined") {
        payload["max"] = max;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof array !== "undefined") {
        payload["array"] = array;
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
export const databasesUpdateFloatAttribute = async ({ databaseId, collectionId, key, required, xdefault, min, max, newKey, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/float/{key}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{key}", key);
    let payload = {};
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof min !== "undefined") {
        payload["min"] = min;
    }
    if (typeof max !== "undefined") {
        payload["max"] = max;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof newKey !== "undefined") {
        payload["newKey"] = newKey;
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
export const databasesCreateIntegerAttribute = async ({ databaseId, collectionId, key, required, min, max, xdefault, array, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/integer"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof key !== "undefined") {
        payload["key"] = key;
    }
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof min !== "undefined") {
        payload["min"] = min;
    }
    if (typeof max !== "undefined") {
        payload["max"] = max;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof array !== "undefined") {
        payload["array"] = array;
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
export const databasesUpdateIntegerAttribute = async ({ databaseId, collectionId, key, required, xdefault, min, max, newKey, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/integer/{key}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{key}", key);
    let payload = {};
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof min !== "undefined") {
        payload["min"] = min;
    }
    if (typeof max !== "undefined") {
        payload["max"] = max;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof newKey !== "undefined") {
        payload["newKey"] = newKey;
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
export const databasesCreateIpAttribute = async ({ databaseId, collectionId, key, required, xdefault, array, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/ip"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof key !== "undefined") {
        payload["key"] = key;
    }
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof array !== "undefined") {
        payload["array"] = array;
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
export const databasesUpdateIpAttribute = async ({ databaseId, collectionId, key, required, xdefault, newKey, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/ip/{key}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{key}", key);
    let payload = {};
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof newKey !== "undefined") {
        payload["newKey"] = newKey;
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
export const databasesCreateLineAttribute = async ({ databaseId, collectionId, key, required, xdefault, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/line"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof key !== "undefined") {
        payload["key"] = key;
    }
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    xdefault = xdefault === true ? [] : xdefault;
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
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
export const databasesUpdateLineAttribute = async ({ databaseId, collectionId, key, required, xdefault, newKey, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/line/{key}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{key}", key);
    let payload = {};
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    xdefault = xdefault === true ? [] : xdefault;
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof newKey !== "undefined") {
        payload["newKey"] = newKey;
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
export const databasesCreatePointAttribute = async ({ databaseId, collectionId, key, required, xdefault, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/point"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof key !== "undefined") {
        payload["key"] = key;
    }
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    xdefault = xdefault === true ? [] : xdefault;
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
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
export const databasesUpdatePointAttribute = async ({ databaseId, collectionId, key, required, xdefault, newKey, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/point/{key}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{key}", key);
    let payload = {};
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    xdefault = xdefault === true ? [] : xdefault;
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof newKey !== "undefined") {
        payload["newKey"] = newKey;
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
export const databasesCreatePolygonAttribute = async ({ databaseId, collectionId, key, required, xdefault, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/polygon"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof key !== "undefined") {
        payload["key"] = key;
    }
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    xdefault = xdefault === true ? [] : xdefault;
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
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
export const databasesUpdatePolygonAttribute = async ({ databaseId, collectionId, key, required, xdefault, newKey, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/polygon/{key}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{key}", key);
    let payload = {};
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    xdefault = xdefault === true ? [] : xdefault;
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof newKey !== "undefined") {
        payload["newKey"] = newKey;
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
export const databasesCreateRelationshipAttribute = async ({ databaseId, collectionId, relatedCollectionId, type, twoWay, key, twoWayKey, onDelete, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/relationship"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof relatedCollectionId !== "undefined") {
        payload["relatedCollectionId"] = relatedCollectionId;
    }
    if (typeof type !== "undefined") {
        payload["type"] = type;
    }
    if (typeof twoWay !== "undefined") {
        payload["twoWay"] = twoWay;
    }
    if (typeof key !== "undefined") {
        payload["key"] = key;
    }
    if (typeof twoWayKey !== "undefined") {
        payload["twoWayKey"] = twoWayKey;
    }
    if (typeof onDelete !== "undefined") {
        payload["onDelete"] = onDelete;
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
export const databasesCreateStringAttribute = async ({ databaseId, collectionId, key, size, required, xdefault, array, encrypt, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/string"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof key !== "undefined") {
        payload["key"] = key;
    }
    if (typeof size !== "undefined") {
        payload["size"] = size;
    }
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof array !== "undefined") {
        payload["array"] = array;
    }
    if (typeof encrypt !== "undefined") {
        payload["encrypt"] = encrypt;
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
export const databasesUpdateStringAttribute = async ({ databaseId, collectionId, key, required, xdefault, size, newKey, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/string/{key}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{key}", key);
    let payload = {};
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof size !== "undefined") {
        payload["size"] = size;
    }
    if (typeof newKey !== "undefined") {
        payload["newKey"] = newKey;
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
export const databasesCreateUrlAttribute = async ({ databaseId, collectionId, key, required, xdefault, array, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/url"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof key !== "undefined") {
        payload["key"] = key;
    }
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof array !== "undefined") {
        payload["array"] = array;
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
export const databasesUpdateUrlAttribute = async ({ databaseId, collectionId, key, required, xdefault, newKey, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/url/{key}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{key}", key);
    let payload = {};
    if (typeof required !== "undefined") {
        payload["required"] = required;
    }
    if (typeof xdefault !== "undefined") {
        payload["default"] = xdefault;
    }
    if (typeof newKey !== "undefined") {
        payload["newKey"] = newKey;
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
export const databasesGetAttribute = async ({ databaseId, collectionId, key, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/{key}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{key}", key);
    let payload = {};
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const databasesDeleteAttribute = async ({ databaseId, collectionId, key, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/{key}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{key}", key);
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
export const databasesUpdateRelationshipAttribute = async ({ databaseId, collectionId, key, onDelete, newKey, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/attributes/{key}/relationship"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{key}", key);
    let payload = {};
    if (typeof onDelete !== "undefined") {
        payload["onDelete"] = onDelete;
    }
    if (typeof newKey !== "undefined") {
        payload["newKey"] = newKey;
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
export const databasesListDocuments = async ({ databaseId, collectionId, queries, transactionId, total, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/documents"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof queries !== "undefined") {
        payload["queries"] = queries;
    }
    if (typeof transactionId !== "undefined") {
        payload["transactionId"] = transactionId;
    }
    if (typeof total !== "undefined") {
        payload["total"] = total;
    }
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("databases", "listDocuments", databaseId, collectionId);
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const databasesCreateDocument = async ({ databaseId, collectionId, documentId, data, permissions, transactionId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/documents"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof documentId !== "undefined") {
        payload["documentId"] = documentId;
    }
    if (typeof data !== "undefined") {
        payload["data"] = JSON.parse(data);
    }
    permissions = permissions === true ? [] : permissions;
    if (typeof permissions !== "undefined") {
        payload["permissions"] = permissions;
    }
    if (typeof transactionId !== "undefined") {
        payload["transactionId"] = transactionId;
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
export const databasesCreateDocuments = async ({ databaseId, collectionId, documents, transactionId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/documents"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    documents = documents === true ? [] : documents;
    if (typeof documents !== "undefined") {
        payload["documents"] = documents;
    }
    if (typeof transactionId !== "undefined") {
        payload["transactionId"] = transactionId;
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
export const databasesUpsertDocuments = async ({ databaseId, collectionId, documents, transactionId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/documents"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    documents = documents === true ? [] : documents;
    if (typeof documents !== "undefined") {
        payload["documents"] = documents;
    }
    if (typeof transactionId !== "undefined") {
        payload["transactionId"] = transactionId;
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
export const databasesUpdateDocuments = async ({ databaseId, collectionId, data, queries, transactionId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/documents"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof data !== "undefined") {
        payload["data"] = JSON.parse(data);
    }
    queries = queries === true ? [] : queries;
    if (typeof queries !== "undefined") {
        payload["queries"] = queries;
    }
    if (typeof transactionId !== "undefined") {
        payload["transactionId"] = transactionId;
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
export const databasesDeleteDocuments = async ({ databaseId, collectionId, queries, transactionId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/documents"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    queries = queries === true ? [] : queries;
    if (typeof queries !== "undefined") {
        payload["queries"] = queries;
    }
    if (typeof transactionId !== "undefined") {
        payload["transactionId"] = transactionId;
    }
    let response = undefined;
    response = await client.call("delete", apiPath, {
        "content-type": "application/json",
    }, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const databasesGetDocument = async ({ databaseId, collectionId, documentId, queries, transactionId, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{documentId}", documentId);
    let payload = {};
    if (typeof queries !== "undefined") {
        payload["queries"] = queries;
    }
    if (typeof transactionId !== "undefined") {
        payload["transactionId"] = transactionId;
    }
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        if (showConsole) {
            showConsoleLink("databases", "getDocument", databaseId, collectionId, documentId);
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const databasesUpsertDocument = async ({ databaseId, collectionId, documentId, data, permissions, transactionId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{documentId}", documentId);
    let payload = {};
    if (typeof data !== "undefined") {
        payload["data"] = JSON.parse(data);
    }
    permissions = permissions === true ? [] : permissions;
    if (typeof permissions !== "undefined") {
        payload["permissions"] = permissions;
    }
    if (typeof transactionId !== "undefined") {
        payload["transactionId"] = transactionId;
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
export const databasesUpdateDocument = async ({ databaseId, collectionId, documentId, data, permissions, transactionId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{documentId}", documentId);
    let payload = {};
    if (typeof data !== "undefined") {
        payload["data"] = JSON.parse(data);
    }
    permissions = permissions === true ? [] : permissions;
    if (typeof permissions !== "undefined") {
        payload["permissions"] = permissions;
    }
    if (typeof transactionId !== "undefined") {
        payload["transactionId"] = transactionId;
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
export const databasesDeleteDocument = async ({ databaseId, collectionId, documentId, transactionId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{documentId}", documentId);
    let payload = {};
    if (typeof transactionId !== "undefined") {
        payload["transactionId"] = transactionId;
    }
    let response = undefined;
    response = await client.call("delete", apiPath, {
        "content-type": "application/json",
    }, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const databasesListDocumentLogs = async ({ databaseId, collectionId, documentId, queries, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}/logs"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{documentId}", documentId);
    let payload = {};
    if (typeof queries !== "undefined") {
        payload["queries"] = queries;
    }
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const databasesDecrementDocumentAttribute = async ({ databaseId, collectionId, documentId, attribute, value, min, transactionId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}/{attribute}/decrement"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{documentId}", documentId)
        .replace("{attribute}", attribute);
    let payload = {};
    if (typeof value !== "undefined") {
        payload["value"] = value;
    }
    if (typeof min !== "undefined") {
        payload["min"] = min;
    }
    if (typeof transactionId !== "undefined") {
        payload["transactionId"] = transactionId;
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
export const databasesIncrementDocumentAttribute = async ({ databaseId, collectionId, documentId, attribute, value, max, transactionId, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/documents/{documentId}/{attribute}/increment"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{documentId}", documentId)
        .replace("{attribute}", attribute);
    let payload = {};
    if (typeof value !== "undefined") {
        payload["value"] = value;
    }
    if (typeof max !== "undefined") {
        payload["max"] = max;
    }
    if (typeof transactionId !== "undefined") {
        payload["transactionId"] = transactionId;
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
export const databasesListIndexes = async ({ databaseId, collectionId, queries, total, parseOutput = true, overrideForCli = false, sdk = undefined, console: showConsole, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/indexes"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
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
            showConsoleLink("databases", "listIndexes", databaseId, collectionId);
        }
        else {
            parse(response);
        }
    }
    return response;
};
export const databasesCreateIndex = async ({ databaseId, collectionId, key, type, attributes, orders, lengths, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/indexes"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof key !== "undefined") {
        payload["key"] = key;
    }
    if (typeof type !== "undefined") {
        payload["type"] = type;
    }
    attributes = attributes === true ? [] : attributes;
    if (typeof attributes !== "undefined") {
        payload["attributes"] = attributes;
    }
    orders = orders === true ? [] : orders;
    if (typeof orders !== "undefined") {
        payload["orders"] = orders;
    }
    lengths = lengths === true ? [] : lengths;
    if (typeof lengths !== "undefined") {
        payload["lengths"] = lengths;
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
export const databasesGetIndex = async ({ databaseId, collectionId, key, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/indexes/{key}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{key}", key);
    let payload = {};
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const databasesDeleteIndex = async ({ databaseId, collectionId, key, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/indexes/{key}"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId)
        .replace("{key}", key);
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
export const databasesListCollectionLogs = async ({ databaseId, collectionId, queries, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/logs"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
    let payload = {};
    if (typeof queries !== "undefined") {
        payload["queries"] = queries;
    }
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const databasesGetCollectionUsage = async ({ databaseId, collectionId, range, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/collections/{collectionId}/usage"
        .replace("{databaseId}", databaseId)
        .replace("{collectionId}", collectionId);
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
export const databasesListLogs = async ({ databaseId, queries, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/logs".replace("{databaseId}", databaseId);
    let payload = {};
    if (typeof queries !== "undefined") {
        payload["queries"] = queries;
    }
    let response = undefined;
    response = await client.call("get", apiPath, {}, payload);
    if (parseOutput) {
        parse(response);
    }
    return response;
};
export const databasesGetUsage = async ({ databaseId, range, parseOutput = true, overrideForCli = false, sdk = undefined, }) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = "/databases/{databaseId}/usage".replace("{databaseId}", databaseId);
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
databases
    .command(`list`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db list' instead] Get a list of all databases from the current Appwrite project. You can use the search parameter to filter your results.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesList));
databases
    .command(`create`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create' instead] Create a new Database. `)
    .requiredOption(`--database-id <database-id>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Database name. Max length: 128 chars.`)
    .option(`--enabled [value]`, `Is the database enabled? When set to 'disabled', users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreate));
databases
    .command(`list-transactions`)
    .description(`List transactions across all databases.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries).`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesListTransactions));
databases
    .command(`create-transaction`)
    .description(`Create a new transaction.`)
    .option(`--ttl <ttl>`, `Seconds before the transaction expires.`, parseInteger)
    .action(actionRunner(databasesCreateTransaction));
databases
    .command(`get-transaction`)
    .description(`Get a transaction by its unique ID.`)
    .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesGetTransaction));
databases
    .command(`update-transaction`)
    .description(`Update a transaction, to either commit or roll back its operations.`)
    .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
    .option(`--commit [value]`, `Commit transaction?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--rollback [value]`, `Rollback transaction?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesUpdateTransaction));
databases
    .command(`delete-transaction`)
    .description(`Delete a transaction by its unique ID.`)
    .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
    .action(actionRunner(databasesDeleteTransaction));
databases
    .command(`create-operations`)
    .description(`Create multiple operations in a single transaction.`)
    .requiredOption(`--transaction-id <transaction-id>`, `Transaction ID.`)
    .option(`--operations [operations...]`, `Array of staged operations.`)
    .action(actionRunner(databasesCreateOperations));
databases
    .command(`list-usage`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db list-usage' instead] List usage metrics and statistics for all databases in the project. You can view the total number of databases, collections, documents, and storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
    .option(`--range <range>`, `Date range.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesListUsage));
databases
    .command(`get`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db get' instead] Get a database by its unique ID. This endpoint response returns a JSON object with the database metadata.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesGet));
databases
    .command(`update`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db update' instead] Update a database by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--name <name>`, `Database name. Max length: 128 chars.`)
    .option(`--enabled [value]`, `Is database enabled? When set to 'disabled', users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesUpdate));
databases
    .command(`delete`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db delete' instead] Delete a database by its unique ID. Only API keys with with databases.write scope can delete a database.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .action(actionRunner(databasesDelete));
databases
    .command(`list-collections`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db list-tables' instead] Get a list of all collections that belong to the provided databaseId. You can use the search parameter to filter your results.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, documentSecurity`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesListCollections));
databases
    .command(`create-collection`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create-table' instead] Create a new Collection. Before using this route, you should create a new database resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Unique Id. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, no user is granted with any permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--document-security [value]`, `Enables configuring permissions for individual documents. A user needs one of document or collection level permissions to access a document. [Learn more about permissions](https://appwrite.io/docs/permissions).`, (value) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Is collection enabled? When set to 'disabled', users cannot access the collection but Server SDKs with and API key can still read and write to the collection. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--attributes [attributes...]`, `Array of attribute definitions to create. Each attribute should contain: key (string), type (string: string, integer, float, boolean, datetime), size (integer, required for string type), required (boolean, optional), default (mixed, optional), array (boolean, optional), and type-specific options.`)
    .option(`--indexes [indexes...]`, `Array of index definitions to create. Each index should contain: key (string), type (string: key, fulltext, unique, spatial), attributes (array of attribute keys), orders (array of ASC/DESC, optional), and lengths (array of integers, optional).`)
    .action(actionRunner(databasesCreateCollection));
databases
    .command(`get-collection`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db get-table' instead] Get a collection by its unique ID. This endpoint response returns a JSON object with the collection metadata.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesGetCollection));
databases
    .command(`update-collection`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db update-table' instead] Update a collection by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--name <name>`, `Collection name. Max length: 128 chars.`)
    .option(`--permissions [permissions...]`, `An array of permission strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--document-security [value]`, `Enables configuring permissions for individual documents. A user needs one of document or collection level permissions to access a document. [Learn more about permissions](https://appwrite.io/docs/permissions).`, (value) => value === undefined ? true : parseBool(value))
    .option(`--enabled [value]`, `Is collection enabled? When set to 'disabled', users cannot access the collection but Server SDKs with and API key can still read and write to the collection. No data is lost when this is toggled.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesUpdateCollection));
databases
    .command(`delete-collection`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db delete-table' instead] Delete a collection by its unique ID. Only users with write permissions have access to delete this resource.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .action(actionRunner(databasesDeleteCollection));
databases
    .command(`list-attributes`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db list-columns' instead] List attributes in the collection.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, size, required, array, status, error`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesListAttributes));
databases
    .command(`create-boolean-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create-boolean-column' instead] Create a boolean attribute. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault [value]`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateBooleanAttribute));
databases
    .command(`update-boolean-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db update-boolean-column' instead] Update a boolean attribute. Changing the 'default' value will not update already existing documents.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault [value]`, `Default value for attribute when not provided. Cannot be set when attribute is required.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--new-key <new-key>`, `New attribute key.`)
    .action(actionRunner(databasesUpdateBooleanAttribute));
databases
    .command(`create-datetime-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create-datetime-column' instead] Create a date time attribute according to the ISO 8601 standard.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for the attribute in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Cannot be set when attribute is required.`)
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateDatetimeAttribute));
databases
    .command(`update-datetime-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db update-datetime-column' instead] Update a date time attribute. Changing the 'default' value will not update already existing documents.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--new-key <new-key>`, `New attribute key.`)
    .action(actionRunner(databasesUpdateDatetimeAttribute));
databases
    .command(`create-email-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create-email-column' instead] Create an email attribute. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateEmailAttribute));
databases
    .command(`update-email-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db update-email-column' instead] Update an email attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--new-key <new-key>`, `New Attribute Key.`)
    .action(actionRunner(databasesUpdateEmailAttribute));
databases
    .command(`create-enum-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create-enum-column' instead] Create an enum attribute. The 'elements' param acts as a white-list of accepted values for this attribute.  `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--elements [elements...]`, `Array of enum values.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateEnumAttribute));
databases
    .command(`update-enum-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db update-enum-column' instead] Update an enum attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--elements [elements...]`, `Updated list of enum values.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--new-key <new-key>`, `New Attribute Key.`)
    .action(actionRunner(databasesUpdateEnumAttribute));
databases
    .command(`create-float-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create-float-column' instead] Create a float attribute. Optionally, minimum and maximum values can be provided. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--min <min>`, `Minimum value.`, parseInteger)
    .option(`--max <max>`, `Maximum value.`, parseInteger)
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when required.`, parseInteger)
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateFloatAttribute));
databases
    .command(`update-float-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db update-float-column' instead] Update a float attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when required.`, parseInteger)
    .option(`--min <min>`, `Minimum value.`, parseInteger)
    .option(`--max <max>`, `Maximum value.`, parseInteger)
    .option(`--new-key <new-key>`, `New Attribute Key.`)
    .action(actionRunner(databasesUpdateFloatAttribute));
databases
    .command(`create-integer-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create-integer-column' instead] Create an integer attribute. Optionally, minimum and maximum values can be provided. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--min <min>`, `Minimum value`, parseInteger)
    .option(`--max <max>`, `Maximum value`, parseInteger)
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when attribute is required.`, parseInteger)
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateIntegerAttribute));
databases
    .command(`update-integer-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db update-integer-column' instead] Update an integer attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when attribute is required.`, parseInteger)
    .option(`--min <min>`, `Minimum value`, parseInteger)
    .option(`--max <max>`, `Maximum value`, parseInteger)
    .option(`--new-key <new-key>`, `New Attribute Key.`)
    .action(actionRunner(databasesUpdateIntegerAttribute));
databases
    .command(`create-ip-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create-ip-column' instead] Create IP address attribute. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when attribute is required.`)
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateIpAttribute));
databases
    .command(`update-ip-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db update-ip-column' instead] Update an ip attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value. Cannot be set when attribute is required.`)
    .option(`--new-key <new-key>`, `New Attribute Key.`)
    .action(actionRunner(databasesUpdateIpAttribute));
databases
    .command(`create-line-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create-line-column' instead] Create a geometric line attribute.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when attribute is required.`)
    .action(actionRunner(databasesCreateLineAttribute));
databases
    .command(`update-line-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db update-line-column' instead] Update a line attribute. Changing the 'default' value will not update already existing documents.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when attribute is required.`)
    .option(`--new-key <new-key>`, `New attribute key.`)
    .action(actionRunner(databasesUpdateLineAttribute));
databases
    .command(`create-point-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create-point-column' instead] Create a geometric point attribute.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when attribute is required.`)
    .action(actionRunner(databasesCreatePointAttribute));
databases
    .command(`update-point-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db update-point-column' instead] Update a point attribute. Changing the 'default' value will not update already existing documents.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when attribute is required.`)
    .option(`--new-key <new-key>`, `New attribute key.`)
    .action(actionRunner(databasesUpdatePointAttribute));
databases
    .command(`create-polygon-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create-polygon-column' instead] Create a geometric polygon attribute.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided, three-dimensional array where the outer array holds one or more linear rings, [[[longitude, latitude], …], …], the first ring is the exterior boundary, any additional rings are interior holes, and each ring must start and end with the same coordinate pair. Cannot be set when attribute is required.`)
    .action(actionRunner(databasesCreatePolygonAttribute));
databases
    .command(`update-polygon-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db update-polygon-column' instead] Update a polygon attribute. Changing the 'default' value will not update already existing documents.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#createCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided, three-dimensional array where the outer array holds one or more linear rings, [[[longitude, latitude], …], …], the first ring is the exterior boundary, any additional rings are interior holes, and each ring must start and end with the same coordinate pair. Cannot be set when attribute is required.`)
    .option(`--new-key <new-key>`, `New attribute key.`)
    .action(actionRunner(databasesUpdatePolygonAttribute));
databases
    .command(`create-relationship-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create-relationship-column' instead] Create relationship attribute. [Learn more about relationship attributes](https://appwrite.io/docs/databases-relationships#relationship-attributes). `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--related-collection-id <related-collection-id>`, `Related Collection ID.`)
    .requiredOption(`--type <type>`, `Relation type`)
    .option(`--two-way [value]`, `Is Two Way?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--key <key>`, `Attribute Key.`)
    .option(`--two-way-key <two-way-key>`, `Two Way Attribute Key.`)
    .option(`--on-delete <on-delete>`, `Constraints option`)
    .action(actionRunner(databasesCreateRelationshipAttribute));
databases
    .command(`create-string-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create-string-column' instead] Create a string attribute. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--size <size>`, `Attribute size for text attributes, in number of characters.`, parseInteger)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--encrypt [value]`, `Toggle encryption for the attribute. Encryption enhances security by not storing any plain text values in the database. However, encrypted attributes cannot be queried.`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateStringAttribute));
databases
    .command(`update-string-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db update-string-column' instead] Update a string attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--size <size>`, `Maximum size of the string attribute.`, parseInteger)
    .option(`--new-key <new-key>`, `New Attribute Key.`)
    .action(actionRunner(databasesUpdateStringAttribute));
databases
    .command(`create-url-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create-url-column' instead] Create a URL attribute. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--array [value]`, `Is attribute an array?`, (value) => value === undefined ? true : parseBool(value))
    .action(actionRunner(databasesCreateUrlAttribute));
databases
    .command(`update-url-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db update-url-column' instead] Update an url attribute. Changing the 'default' value will not update already existing documents. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .requiredOption(`--required [value]`, `Is attribute required?`, (value) => value === undefined ? true : parseBool(value))
    .option(`--xdefault <xdefault>`, `Default value for attribute when not provided. Cannot be set when attribute is required.`)
    .option(`--new-key <new-key>`, `New Attribute Key.`)
    .action(actionRunner(databasesUpdateUrlAttribute));
databases
    .command(`get-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db get-column' instead] Get attribute by ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .action(actionRunner(databasesGetAttribute));
databases
    .command(`delete-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db delete-column' instead] Deletes an attribute.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .action(actionRunner(databasesDeleteAttribute));
databases
    .command(`update-relationship-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db update-relationship-column' instead] Update relationship attribute. [Learn more about relationship attributes](https://appwrite.io/docs/databases-relationships#relationship-attributes). `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--key <key>`, `Attribute Key.`)
    .option(`--on-delete <on-delete>`, `Constraints option`)
    .option(`--new-key <new-key>`, `New Attribute Key.`)
    .action(actionRunner(databasesUpdateRelationshipAttribute));
databases
    .command(`list-documents`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db list-rows' instead] Get a list of all the user's documents in a given collection. You can use the query params to filter your results.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID to read uncommitted changes within the transaction.`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesListDocuments));
databases
    .command(`create-document`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create-row' instead] Create a new Document. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.`)
    .requiredOption(`--document-id <document-id>`, `Document ID. Choose a custom ID or generate a random ID with 'ID.unique()'. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
    .requiredOption(`--data <data>`, `Document data as JSON object.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
    .action(actionRunner(databasesCreateDocument));
databases
    .command(`create-documents`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create-rows' instead] Create new Documents. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.`)
    .requiredOption(`--documents [documents...]`, `Array of documents data as JSON objects.`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
    .action(actionRunner(databasesCreateDocuments));
databases
    .command(`upsert-documents`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db upsert-rows' instead] Create or update Documents. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console. `)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--documents [documents...]`, `Array of document data as JSON objects. May contain partial documents.`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
    .action(actionRunner(databasesUpsertDocuments));
databases
    .command(`update-documents`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db update-rows' instead] Update all documents that match your queries, if no queries are submitted then all documents are updated. You can pass only specific fields to be updated.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .option(`--data <data>`, `Document data as JSON object. Include only attribute and value pairs to be updated.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
    .action(actionRunner(databasesUpdateDocuments));
databases
    .command(`delete-documents`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db delete-rows' instead] Bulk delete documents using queries, if no queries are passed then all documents are deleted.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
    .action(actionRunner(databasesDeleteDocuments));
databases
    .command(`get-document`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db get-row' instead] Get a document by its unique ID. This endpoint response returns a JSON object with the document data.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--document-id <document-id>`, `Document ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID to read uncommitted changes within the transaction.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesGetDocument));
databases
    .command(`upsert-document`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db upsert-row' instead] Create or update a Document. Before using this route, you should create a new collection resource using either a [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--document-id <document-id>`, `Document ID.`)
    .option(`--data <data>`, `Document data as JSON object. Include all required attributes of the document to be created or updated.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
    .action(actionRunner(databasesUpsertDocument));
databases
    .command(`update-document`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db update-row' instead] Update a document by its unique ID. Using the patch method you can pass only specific fields that will get updated.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--document-id <document-id>`, `Document ID.`)
    .option(`--data <data>`, `Document data as JSON object. Include only attribute and value pairs to be updated.`)
    .option(`--permissions [permissions...]`, `An array of permissions strings. By default, the current permissions are inherited. [Learn more about permissions](https://appwrite.io/docs/permissions).`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
    .action(actionRunner(databasesUpdateDocument));
databases
    .command(`delete-document`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db delete-row' instead] Delete a document by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--document-id <document-id>`, `Document ID.`)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
    .action(actionRunner(databasesDeleteDocument));
databases
    .command(`list-document-logs`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db list-row-logs' instead] Get the document activity logs list by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--document-id <document-id>`, `Document ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(databasesListDocumentLogs));
databases
    .command(`decrement-document-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db decrement-row-column' instead] Decrement a specific attribute of a document by a given value.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--document-id <document-id>`, `Document ID.`)
    .requiredOption(`--attribute <attribute>`, `Attribute key.`)
    .option(`--value <value>`, `Value to increment the attribute by. The value must be a number.`, parseInteger)
    .option(`--min <min>`, `Minimum value for the attribute. If the current value is lesser than this value, an exception will be thrown.`, parseInteger)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
    .action(actionRunner(databasesDecrementDocumentAttribute));
databases
    .command(`increment-document-attribute`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db increment-row-column' instead] Increment a specific attribute of a document by a given value.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .requiredOption(`--document-id <document-id>`, `Document ID.`)
    .requiredOption(`--attribute <attribute>`, `Attribute key.`)
    .option(`--value <value>`, `Value to increment the attribute by. The value must be a number.`, parseInteger)
    .option(`--max <max>`, `Maximum value for the attribute. If the current value is greater than this value, an error will be thrown.`, parseInteger)
    .option(`--transaction-id <transaction-id>`, `Transaction ID for staging the operation.`)
    .action(actionRunner(databasesIncrementDocumentAttribute));
databases
    .command(`list-indexes`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db list-indexes' instead] List indexes in the collection.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, status, attributes, error`)
    .option(`--total [value]`, `When set to false, the total count returned will be 0 and will not be calculated.`, (value) => value === undefined ? true : parseBool(value))
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(databasesListIndexes));
databases
    .command(`create-index`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db create-index' instead] Creates an index on the attributes listed. Your index should include all the attributes you will query in a single request. Attributes can be 'key', 'fulltext', and 'unique'.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .requiredOption(`--type <type>`, `Index type.`)
    .requiredOption(`--attributes [attributes...]`, `Array of attributes to index. Maximum of 100 attributes are allowed, each 32 characters long.`)
    .option(`--orders [orders...]`, `Array of index orders. Maximum of 100 orders are allowed.`)
    .option(`--lengths [lengths...]`, `Length of index. Maximum of 100`)
    .action(actionRunner(databasesCreateIndex));
databases
    .command(`get-index`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db get-index' instead] Get an index by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .action(actionRunner(databasesGetIndex));
databases
    .command(`delete-index`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db delete-index' instead] Delete an index.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID. You can create a new collection using the Database service [server integration](https://appwrite.io/docs/server/databases#databasesCreateCollection).`)
    .requiredOption(`--key <key>`, `Index Key.`)
    .action(actionRunner(databasesDeleteIndex));
databases
    .command(`list-collection-logs`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db list-table-logs' instead] Get the collection activity logs list by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(databasesListCollectionLogs));
databases
    .command(`get-collection-usage`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db get-table-usage' instead] Get usage metrics and statistics for a collection. Returning the total number of documents. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .requiredOption(`--collection-id <collection-id>`, `Collection ID.`)
    .option(`--range <range>`, `Date range.`)
    .action(actionRunner(databasesGetCollectionUsage));
databases
    .command(`list-logs`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db list-database-logs' instead] Get the database activity logs list by its unique ID.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
    .action(actionRunner(databasesListLogs));
databases
    .command(`get-usage`)
    .description(`[**DEPRECATED** - This command is deprecated. Please use 'tables-db get-usage' instead] Get usage metrics and statistics for a database. You can view the total number of collections, documents, and storage usage. The response includes both current totals and historical data over time. Use the optional range parameter to specify the time window for historical data: 24h (last 24 hours), 30d (last 30 days), or 90d (last 90 days). If not specified, range defaults to 30 days.`)
    .requiredOption(`--database-id <database-id>`, `Database ID.`)
    .option(`--range <range>`, `Date range.`)
    .action(actionRunner(databasesGetUsage));
//# sourceMappingURL=databases.js.map