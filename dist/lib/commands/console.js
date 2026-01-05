import { Command } from "commander";
import { sdkForProject } from "../sdks.js";
import { actionRunner, commandDescriptions } from "../parser.js";
import { Console as ConsoleService } from "@appwrite.io/console";
let consoleServiceClient = null;
const getConsoleClient = async () => {
    if (!consoleServiceClient) {
        const projectClient = await sdkForProject();
        consoleServiceClient = new ConsoleService(projectClient);
    }
    return consoleServiceClient;
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
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(async ({ value, type }) => await (await getConsoleClient()).getResource(value, type)));
console
    .command(`variables`)
    .description(`Get all Environment Variables that are relevant for the console.`)
    .action(actionRunner(async () => await (await getConsoleClient()).variables()));
//# sourceMappingURL=console.js.map