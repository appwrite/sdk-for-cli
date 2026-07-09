import { Command } from "commander";
import {
  buildQueries,
  collectQueryValue,
  parseDeprecatedWhereQuery,
  parseFilterQuery,
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
import { Notifications } from "@appwrite.io/console";

let notificationsClient: Notifications | null = null;

const getNotificationsClient = async (): Promise<Notifications> => {
  if (!notificationsClient) {
    const sdkClient = await sdkForProject();
    notificationsClient = new Notifications(sdkClient);
  }
  return notificationsClient;
};

export const notifications = new Command("notifications")
  .description(commandDescriptions["notifications"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

const notificationsListCommand = notifications
  .command(`list`)
  .description(`Get the list of notifications for the currently logged in console user. Use queries to filter the results by attributes such as read status, view timestamps, or creation date.
`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: read, type, channel, messageId, projectId, resourceType, resourceId, parentResourceType, parentResourceId, firstSeen, lastSeen`)
  .option(`--filter <expression>`, `Filter using a simple comparison expression. Repeat for multiple filters. Supports field=value, field!=value, field>value, field>=value, field<value, and field<=value.`, (value: string, previous: string[] | undefined) => collectQueryValue(parseFilterQuery(value), previous))
  .option(`--where <expression>`, `Deprecated. Use --filter instead. Filter using a simple comparison expression. Repeat for multiple filters.`, (value: string, previous: string[] | undefined) => collectQueryValue(parseDeprecatedWhereQuery(value), previous))
  .option(`--sort-asc <attribute>`, `Sort results by an attribute in ascending order. Repeat for multiple sort fields.`, (value: string, previous: string[] | undefined) => collectQueryValue(value, previous))
  .option(`--sort-desc <attribute>`, `Sort results by an attribute in descending order. Repeat for multiple sort fields.`, (value: string, previous: string[] | undefined) => collectQueryValue(value, previous))
  .option(`--limit <limit>`, `Maximum number of results to return.`, parseInteger)
  .option(`--offset <offset>`, `Number of results to skip.`, parseInteger)
  .option(`--cursor-after <id>`, `Return results after this cursor ID.`)
  .option(`--cursor-before <id>`, `Return results before this cursor ID.`)
  .action(
    actionRunner(
      async ({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }) =>
        parse(await (await getNotificationsClient()).list(buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }))),
    ),
  );


const notificationsUpdateCommand = notifications
  .command(`update`)
  .description(`Update a notification by its unique ID. Use the \`read\` parameter to mark the notification as read or unread.
`)
  .requiredOption(`--notification-id <notification-id>`, `Notification ID.`)
  .requiredOption(`--read <read>`, `Notification read status.`, parseBool)
  .action(
    actionRunner(
      async ({ notificationId, read }) =>
        parse(await (await getNotificationsClient()).update(notificationId, read)),
    ),
  );


