import fs from "fs";
import pathLib from "path";
import tar from "tar";
import ignoreModule from "ignore";
const ignore: typeof ignoreModule =
  (ignoreModule as any).default ?? ignoreModule;
import { promisify } from "util";
import Client from "../client.js";
import { getAllFiles, showConsoleLink } from "../utils.js";
import { Command } from "commander";
import { sdkForProject, sdkForConsole } from "../sdks.js";
import {
  parse,
  actionRunner,
  parseInteger,
  parseBool,
  commandDescriptions,
  success,
  log,
  warn,
} from "../parser.js";
import { localConfig, globalConfig } from "../config.js";
import { File } from "undici";
import { ReadableStream } from "stream/web";
import type { UploadProgress, FileInput } from "../types.js";

function convertReadStreamToReadableStream(
  readStream: fs.ReadStream,
): ReadableStream {
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

export const tokens = new Command("tokens")
  .description(commandDescriptions["tokens"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

interface TokensListRequestParams {
  bucketId: string;
  fileId: string;
  queries?: string[];
  total?: boolean;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
  console?: boolean;
}

export const tokensList = async ({
  bucketId,
  fileId,
  queries,
  total,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
  console: showConsole,
}: TokensListRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/tokens/buckets/{bucketId}/files/{fileId}"
    .replace("{bucketId}", bucketId)
    .replace("{fileId}", fileId);
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
      showConsoleLink("tokens", "list", bucketId, fileId);
    } else {
      parse(response);
    }
  }

  return response;
};
interface TokensCreateFileTokenRequestParams {
  bucketId: string;
  fileId: string;
  expire?: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const tokensCreateFileToken = async ({
  bucketId,
  fileId,
  expire,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: TokensCreateFileTokenRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/tokens/buckets/{bucketId}/files/{fileId}"
    .replace("{bucketId}", bucketId)
    .replace("{fileId}", fileId);
  let payload = {};
  if (typeof expire !== "undefined") {
    payload["expire"] = expire;
  }

  let response = undefined;

  response = await client.call(
    "post",
    apiPath,
    {
      "content-type": "application/json",
    },
    payload,
  );

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface TokensGetRequestParams {
  tokenId: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
  console?: boolean;
}

export const tokensGet = async ({
  tokenId,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
  console: showConsole,
}: TokensGetRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/tokens/{tokenId}".replace("{tokenId}", tokenId);
  let payload = {};

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    if (showConsole) {
      showConsoleLink("tokens", "get", tokenId);
    } else {
      parse(response);
    }
  }

  return response;
};
interface TokensUpdateRequestParams {
  tokenId: string;
  expire?: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const tokensUpdate = async ({
  tokenId,
  expire,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: TokensUpdateRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/tokens/{tokenId}".replace("{tokenId}", tokenId);
  let payload = {};
  if (typeof expire !== "undefined") {
    payload["expire"] = expire;
  }

  let response = undefined;

  response = await client.call(
    "patch",
    apiPath,
    {
      "content-type": "application/json",
    },
    payload,
  );

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface TokensDeleteRequestParams {
  tokenId: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const tokensDelete = async ({
  tokenId,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: TokensDeleteRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/tokens/{tokenId}".replace("{tokenId}", tokenId);
  let payload = {};

  let response = undefined;

  response = await client.call(
    "delete",
    apiPath,
    {
      "content-type": "application/json",
    },
    payload,
  );

  if (parseOutput) {
    parse(response);
  }

  return response;
};
tokens
  .command(`list`)
  .description(
    `List all the tokens created for a specific file or bucket. You can use the query params to filter your results.`,
  )
  .requiredOption(
    `--bucket-id <bucket-id>`,
    `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`,
  )
  .requiredOption(`--file-id <file-id>`, `File unique ID.`)
  .option(
    `--queries [queries...]`,
    `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: expire`,
  )
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--console`, `Get the resource console url`)
  .action(actionRunner(tokensList));

tokens
  .command(`create-file-token`)
  .description(
    `Create a new token. A token is linked to a file. Token can be passed as a request URL search parameter.`,
  )
  .requiredOption(
    `--bucket-id <bucket-id>`,
    `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`,
  )
  .requiredOption(`--file-id <file-id>`, `File unique ID.`)
  .option(`--expire <expire>`, `Token expiry date`)
  .action(actionRunner(tokensCreateFileToken));

tokens
  .command(`get`)
  .description(`Get a token by its unique ID.`)
  .requiredOption(`--token-id <token-id>`, `Token ID.`)
  .option(`--console`, `Get the resource console url`)
  .action(actionRunner(tokensGet));

tokens
  .command(`update`)
  .description(
    `Update a token by its unique ID. Use this endpoint to update a token's expiry date.`,
  )
  .requiredOption(`--token-id <token-id>`, `Token unique ID.`)
  .option(`--expire <expire>`, `File token expiry date`)
  .action(actionRunner(tokensUpdate));

tokens
  .command(`delete`)
  .description(`Delete a token by its unique ID.`)
  .requiredOption(`--token-id <token-id>`, `Token ID.`)
  .action(actionRunner(tokensDelete));
