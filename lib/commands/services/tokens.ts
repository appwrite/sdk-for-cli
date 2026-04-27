import { Command } from "commander";
import {
  buildQueries,
  collectQueryValue,
  parseWhereQuery,
} from "../utils/query.js";
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

const tokensListCommand = tokens
  .command(`list`)
  .description(`List all the tokens created for a specific file or bucket. You can use the query params to filter your results.`)
  .requiredOption(`--bucket-id <bucket-id>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service server integration (https://appwrite.io/docs/server/storage#createBucket).`)
  .requiredOption(`--file-id <file-id>`, `File unique ID.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --where, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: expire`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--where <expression>`, `Filter using a simple comparison expression. Repeat for multiple filters. Supports field=value, field!=value, field>value, field>=value, field<value, and field<=value.`, (value: string, previous: string[] | undefined) => collectQueryValue(parseWhereQuery(value), previous))
  .option(`--sort-asc <attribute>`, `Sort results by an attribute in ascending order. Repeat for multiple sort fields.`, (value: string, previous: string[] | undefined) => collectQueryValue(value, previous))
  .option(`--sort-desc <attribute>`, `Sort results by an attribute in descending order. Repeat for multiple sort fields.`, (value: string, previous: string[] | undefined) => collectQueryValue(value, previous))
  .option(`--limit <limit>`, `Maximum number of results to return.`, parseInteger)
  .option(`--offset <offset>`, `Number of results to skip.`, parseInteger)
  .option(`--cursor-after <id>`, `Return results after this cursor ID.`)
  .option(`--cursor-before <id>`, `Return results before this cursor ID.`)
  .action(
    actionRunner(
      async ({ bucketId, fileId, queries, total, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }) =>
        parse(await (await getTokensClient()).list(bucketId, fileId, buildQueries({ queries, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }), total)),
    ),
  );


const tokensCreateFileTokenCommand = tokens
  .command(`create-file-token`)
  .description(`Create a new token. A token is linked to a file. Token can be passed as a request URL search parameter.`)
  .requiredOption(`--bucket-id <bucket-id>`, `Storage bucket unique ID. You can create a new storage bucket using the Storage service server integration (https://appwrite.io/docs/server/storage#createBucket).`)
  .requiredOption(`--file-id <file-id>`, `File unique ID.`)
  .option(`--expire <expire>`, `Token expiry date`)
  .action(
    actionRunner(
      async ({ bucketId, fileId, expire }) =>
        parse(await (await getTokensClient()).createFileToken(bucketId, fileId, expire)),
    ),
  );


const tokensGetCommand = tokens
  .command(`get`)
  .description(`Get a token by its unique ID.`)
  .requiredOption(`--token-id <token-id>`, `Token ID.`)
  .action(
    actionRunner(
      async ({ tokenId }) =>
        parse(await (await getTokensClient()).get(tokenId)),
    ),
  );


const tokensUpdateCommand = tokens
  .command(`update`)
  .description(`Update a token by its unique ID. Use this endpoint to update a token's expiry date.`)
  .requiredOption(`--token-id <token-id>`, `Token unique ID.`)
  .option(`--expire <expire>`, `File token expiry date`)
  .action(
    actionRunner(
      async ({ tokenId, expire }) =>
        parse(await (await getTokensClient()).update(tokenId, expire)),
    ),
  );


const tokensDeleteCommand = tokens
  .command(`delete`)
  .description(`Delete a token by its unique ID.`)
  .requiredOption(`--token-id <token-id>`, `Token ID.`)
  .action(
    actionRunner(
      async ({ tokenId }) =>
        parse(await (await getTokensClient()).delete(tokenId)),
    ),
  );


