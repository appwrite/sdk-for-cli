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
import { Activities } from "@appwrite.io/console";

let activitiesClient: Activities | null = null;

const getActivitiesClient = async (): Promise<Activities> => {
  if (!activitiesClient) {
    const sdkClient = await sdkForProject();
    activitiesClient = new Activities(sdkClient);
  }
  return activitiesClient;
};

export const activities = new Command("activities")
  .description(commandDescriptions["activities"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

activities
  .command(`list-events`)
  .description(`List all events for selected filters.`)
  .option(`--queries <queries>`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on attributes such as userId, teamId, etc.`)
  .action(
    actionRunner(
      async ({ queries }) =>
        parse(await (await getActivitiesClient()).listEvents(queries)),
    ),
  );

activities
  .command(`get-event`)
  .description(`Get event by ID.
`)
  .requiredOption(`--event-id <event-id>`, `Event ID.`)
  .action(
    actionRunner(
      async ({ eventId }) =>
        parse(await (await getActivitiesClient()).getEvent(eventId)),
    ),
  );

