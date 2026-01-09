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
import { Graphql } from "@appwrite.io/console";

let graphqlClient: Graphql | null = null;

const getGraphqlClient = async (): Promise<Graphql> => {
  if (!graphqlClient) {
    const sdkClient = await sdkForProject();
    graphqlClient = new Graphql(sdkClient);
  }
  return graphqlClient;
};

export const graphql = new Command("graphql")
  .description(commandDescriptions["graphql"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

graphql
  .command(`query`)
  .description(`Execute a GraphQL mutation.`)
  .requiredOption(`--query <query>`, `The query or queries to execute.`)
  .action(
    actionRunner(
      async ({ query }) =>
        parse(await (await getGraphqlClient()).query(JSON.parse(query))),
    ),
  );

graphql
  .command(`mutation`)
  .description(`Execute a GraphQL mutation.`)
  .requiredOption(`--query <query>`, `The query or queries to execute.`)
  .action(
    actionRunner(
      async ({ query }) =>
        parse(await (await getGraphqlClient()).mutation(JSON.parse(query))),
    ),
  );

