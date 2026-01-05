import { Command } from "commander";
import { sdkForProject } from "../sdks.js";
import { actionRunner, commandDescriptions } from "../parser.js";
import { Organizations as OrganizationsService } from "@appwrite.io/console";
let organizationsClient = null;
const getOrganizationsClient = async () => {
    if (!organizationsClient) {
        const projectClient = await sdkForProject();
        organizationsClient = new OrganizationsService(projectClient);
    }
    return organizationsClient;
};
export const organizations = new Command("organizations")
    .description(commandDescriptions["organizations"] ?? "")
    .configureHelp({
    helpWidth: process.stdout.columns || 80,
});
organizations
    .command(`list`)
    .description(`Get a list of all the teams in which the current user is a member. You can use the parameters to filter your results.`)
    .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.`)
    .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
    .option(`--console`, `Get the resource console url`)
    .action(actionRunner(async ({ queries, search }) => await (await getOrganizationsClient()).list(queries, search)));
export const organizationsList = async (params) => {
    return await (await getOrganizationsClient()).list(params.queries, params.search);
};
//# sourceMappingURL=organizations.js.map