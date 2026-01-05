import { Command } from "commander";
import { sdkForProject } from "../../sdks.js";
import { actionRunner, commandDescriptions, } from "../../parser.js";
import { Console, Assistant } from "@appwrite.io/console";
let consoleClient = null;
const getConsoleClient = async () => {
    if (!consoleClient) {
        const sdkClient = await sdkForProject();
        consoleClient = new Console(sdkClient);
    }
    return consoleClient;
};
let assistantClient = null;
const getAssistantClient = async () => {
    if (!assistantClient) {
        const sdkClient = await sdkForProject();
        assistantClient = new Assistant(sdkClient);
    }
    return assistantClient;
};
export const console = new Command("console")
    .description(commandDescriptions["console"] ?? "")
    .configureHelp({
    helpWidth: process.stdout.columns || 80,
});
console
    .command(`chat`)
    .description(`Send a prompt to the AI assistant and receive a response. This endpoint allows you to interact with Appwrite's AI assistant by sending questions or prompts and receiving helpful responses in real-time through a server-sent events stream. `)
    .requiredOption(`--prompt <prompt>`, `Prompt. A string containing questions asked to the AI assistant.`)
    .action(actionRunner(async ({ prompt }) => await (await getAssistantClient()).chat(prompt)));
console
    .command(`get-resource`)
    .description(`Check if a resource ID is available.`)
    .requiredOption(`--value <value>`, `Resource value.`)
    .requiredOption(`--type <type>`, `Resource type.`)
    .action(actionRunner(async ({ value, xType }) => await (await getConsoleClient()).getResource(value, xType)));
console
    .command(`variables`)
    .description(`Get all Environment Variables that are relevant for the console.`)
    .action(actionRunner(async () => await (await getConsoleClient()).variables()));
//# sourceMappingURL=console.js.map