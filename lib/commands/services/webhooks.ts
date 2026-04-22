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
import { Webhooks } from "@appwrite.io/console";

let webhooksClient: Webhooks | null = null;

const getWebhooksClient = async (): Promise<Webhooks> => {
  if (!webhooksClient) {
    const sdkClient = await sdkForProject();
    webhooksClient = new Webhooks(sdkClient);
  }
  return webhooksClient;
};

export const webhooks = new Command("webhooks")
  .description(commandDescriptions["webhooks"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

const webhooksListCommand = webhooks
  .command(`list`)
  .description(`Get a list of all webhooks belonging to the project. You can use the query params to filter your results.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, url, authUsername, tls, events, enabled, logs, attempts`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ queries, total }) =>
        parse(await (await getWebhooksClient()).list(queries, total)),
    ),
  );


const webhooksCreateCommand = webhooks
  .command(`create`)
  .description(`Create a new webhook. Use this endpoint to configure a URL that will receive events from Appwrite when specific events occur.`)
  .requiredOption(`--webhook-id <webhook-id>`, `Webhook ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--url <url>`, `Webhook URL.`)
  .requiredOption(`--name <name>`, `Webhook name. Max length: 128 chars.`)
  .requiredOption(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
  .option(
    `--enabled [value]`,
    `Enable or disable a webhook.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--tls [value]`,
    `Certificate verification, false for disabled or true for enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--auth-username <auth-username>`, `Webhook HTTP user. Max length: 256 chars.`)
  .option(`--auth-password <auth-password>`, `Webhook HTTP password. Max length: 256 chars.`)
  .option(`--secret <secret>`, `Webhook secret key. If not provided, a new key will be generated automatically. Key must be at least 8 characters long, and at max 256 characters.`)
  .action(
    actionRunner(
      async ({ webhookId, url, name, events, enabled, tls, authUsername, authPassword, secret }) =>
        parse(await (await getWebhooksClient()).create(webhookId, url, name, events, enabled, tls, authUsername, authPassword, secret)),
    ),
  );


const webhooksGetCommand = webhooks
  .command(`get`)
  .description(`Get a webhook by its unique ID. This endpoint returns details about a specific webhook configured for a project. `)
  .requiredOption(`--webhook-id <webhook-id>`, `Webhook ID.`)
  .action(
    actionRunner(
      async ({ webhookId }) =>
        parse(await (await getWebhooksClient()).get(webhookId)),
    ),
  );


const webhooksUpdateCommand = webhooks
  .command(`update`)
  .description(`Update a webhook by its unique ID. Use this endpoint to update the URL, events, or status of an existing webhook.`)
  .requiredOption(`--webhook-id <webhook-id>`, `Webhook ID.`)
  .requiredOption(`--name <name>`, `Webhook name. Max length: 128 chars.`)
  .requiredOption(`--url <url>`, `Webhook URL.`)
  .requiredOption(`--events [events...]`, `Events list. Maximum of 100 events are allowed.`)
  .option(
    `--enabled [value]`,
    `Enable or disable a webhook.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--tls [value]`,
    `Certificate verification, false for disabled or true for enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--auth-username <auth-username>`, `Webhook HTTP user. Max length: 256 chars.`)
  .option(`--auth-password <auth-password>`, `Webhook HTTP password. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ webhookId, name, url, events, enabled, tls, authUsername, authPassword }) =>
        parse(await (await getWebhooksClient()).update(webhookId, name, url, events, enabled, tls, authUsername, authPassword)),
    ),
  );


const webhooksDeleteCommand = webhooks
  .command(`delete`)
  .description(`Delete a webhook by its unique ID. Once deleted, the webhook will no longer receive project events. `)
  .requiredOption(`--webhook-id <webhook-id>`, `Webhook ID.`)
  .action(
    actionRunner(
      async ({ webhookId }) =>
        parse(await (await getWebhooksClient()).delete(webhookId)),
    ),
  );


const webhooksUpdateSecretCommand = webhooks
  .command(`update-secret`)
  .description(`Update the webhook signing key. This endpoint can be used to regenerate the signing key used to sign and validate payload deliveries for a specific webhook.`)
  .requiredOption(`--webhook-id <webhook-id>`, `Webhook ID.`)
  .option(`--secret <secret>`, `Webhook secret key. If not provided, a new key will be generated automatically. Key must be at least 8 characters long, and at max 256 characters.`)
  .action(
    actionRunner(
      async ({ webhookId, secret }) =>
        parse(await (await getWebhooksClient()).updateSecret(webhookId, secret)),
    ),
  );


