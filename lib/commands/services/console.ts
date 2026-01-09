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
// Mock enums
export enum ConsoleResourceType {
  // Mock enum values
}

// Mock Console class
class Console {
  constructor(sdkClient: any) {}

  async getResource(value: string, type: string): Promise<any> {
    return { result: 'GET:/v1/console/resources:passed' };
  }

  async variables(): Promise<any> {
    return { result: 'GET:/v1/console/variables:passed' };
  }
}


let consoleClient: Console | null = null;

const getConsoleClient = async (): Promise<Console> => {
  if (!consoleClient) {
    const sdkClient = await sdkForProject();
    consoleClient = new Console(sdkClient);
  }
  return consoleClient;
};

export const console = new Command("console")
  .description(commandDescriptions["console"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

console
  .command(`get-resource`)
  .description(`Check if a resource ID is available.`)
  .requiredOption(`--value <value>`, `Resource value.`)
  .requiredOption(`--type <type>`, `Resource type.`)
  .action(
    actionRunner(
      async ({ value, type }) =>
        parse(await (await getConsoleClient()).getResource(value, type as ConsoleResourceType)),
    ),
  );

console
  .command(`variables`)
  .description(`Get all Environment Variables that are relevant for the console.`)
  .action(
    actionRunner(
      async () => parse(await (await getConsoleClient()).variables()),
    ),
  );

