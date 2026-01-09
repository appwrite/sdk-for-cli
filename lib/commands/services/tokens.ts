import { Command } from "commander";
import { sdkForProject } from "../../sdks.js";
import {
  actionRunner,
  commandDescriptions,
  success,
  parse,
  parseBool,
  parseInteger,
} from "../../parser.js";
import { Tokens } from "@appwrite.io/console";

let tokensClient: Tokens | null = null;

const getTokensClient = async (): Promise<Tokens> => {
  if (!tokensClient) {
    const sdkClient = await sdkForProject();
    tokensClient = new Tokens(sdkClient);
  }
  return tokensClient;
};

export const tokens = new Command("tokens")
  .description(commandDescriptions["tokens"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

tokens
  .command(`list`)
  .description(`List all the tokens created for a specific file or bucket. You can use the query params to filter your results.`)
  .requiredOption(`--bucketid <bucketid>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
  .requiredOption(`--fileid <fileid>`, `File unique ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: expire`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ bucketId, fileId, queries, total }) =>
        parse(await (await getTokensClient()).list(bucketId, fileId, queries, total)),
    ),
  );

tokens
  .command(`create-file-token`)
  .description(`Create a new token. A token is linked to a file. Token can be passed as a request URL search parameter.`)
  .requiredOption(`--bucketid <bucketid>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service [server integration](https://appwrite.io/docs/server/storage#createBucket).`)
  .requiredOption(`--fileid <fileid>`, `File unique ID.`)
  .option(`--expire <expire>`, `Token expiry date`)
  .action(
    actionRunner(
      async ({ bucketId, fileId, expire }) =>
        parse(await (await getTokensClient()).createFileToken(bucketId, fileId, expire)),
    ),
  );

tokens
  .command(`get`)
  .description(`Get a token by its unique ID.`)
  .requiredOption(`--tokenid <tokenid>`, `Token ID.`)
  .action(
    actionRunner(
      async ({ tokenId }) =>
        parse(await (await getTokensClient()).get(tokenId)),
    ),
  );

tokens
  .command(`update`)
  .description(`Update a token by its unique ID. Use this endpoint to update a token's expiry date.`)
  .requiredOption(`--tokenid <tokenid>`, `Token unique ID.`)
  .option(`--expire <expire>`, `File token expiry date`)
  .action(
    actionRunner(
      async ({ tokenId, expire }) =>
        parse(await (await getTokensClient()).update(tokenId, expire)),
    ),
  );

tokens
  .command(`delete`)
  .description(`Delete a token by its unique ID.`)
  .requiredOption(`--tokenid <tokenid>`, `Token ID.`)
  .action(
    actionRunner(
      async ({ tokenId }) =>
        parse(await (await getTokensClient()).delete(tokenId)),
    ),
  );

