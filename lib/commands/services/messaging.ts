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
import {
  Messaging,
  MessagePriority,
  SmtpEncryption,
} from "@appwrite.io/console";

let messagingClient: Messaging | null = null;

const getMessagingClient = async (): Promise<Messaging> => {
  if (!messagingClient) {
    const sdkClient = await sdkForProject();
    messagingClient = new Messaging(sdkClient);
  }
  return messagingClient;
};

export const messaging = new Command("messaging")
  .description(commandDescriptions["messaging"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

messaging
  .command(`list-messages`)
  .description(`Get a list of all messages from the current Appwrite project.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: scheduledAt, deliveredAt, deliveredTotal, status, description, providerType`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ queries, search, total }) =>
        parse(await (await getMessagingClient()).listMessages(queries, search, total)),
    ),
  );

messaging
  .command(`create-email`)
  .description(`Create a new email message.`)
  .requiredOption(`--messageid <messageid>`, `Message ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--subject <subject>`, `Email Subject.`)
  .requiredOption(`--content <content>`, `Email Content.`)
  .option(`--topics [topics...]`, `List of Topic IDs.`)
  .option(`--users [users...]`, `List of User IDs.`)
  .option(`--targets [targets...]`, `List of Targets IDs.`)
  .option(`--cc [cc...]`, `Array of target IDs to be added as CC.`)
  .option(`--bcc [bcc...]`, `Array of target IDs to be added as BCC.`)
  .option(`--attachments [attachments...]`, `Array of compound ID strings of bucket IDs and file IDs to be attached to the email. They should be formatted as <BUCKET_ID>:<FILE_ID>.`)
  .option(
    `--draft [value]`,
    `Is message a draft`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--html [value]`,
    `Is content of type HTML`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--scheduledat <scheduledat>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
  .action(
    actionRunner(
      async ({ messageId, subject, content, topics, users, targets, cc, bcc, attachments, draft, html, scheduledAt }) =>
        parse(await (await getMessagingClient()).createEmail(messageId, subject, content, topics, users, targets, cc, bcc, attachments, draft, html, scheduledAt)),
    ),
  );

messaging
  .command(`update-email`)
  .description(`Update an email message by its unique ID. This endpoint only works on messages that are in draft status. Messages that are already processing, sent, or failed cannot be updated.
`)
  .requiredOption(`--messageid <messageid>`, `Message ID.`)
  .option(`--topics [topics...]`, `List of Topic IDs.`)
  .option(`--users [users...]`, `List of User IDs.`)
  .option(`--targets [targets...]`, `List of Targets IDs.`)
  .option(`--subject <subject>`, `Email Subject.`)
  .option(`--content <content>`, `Email Content.`)
  .option(
    `--draft [value]`,
    `Is message a draft`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--html [value]`,
    `Is content of type HTML`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--cc [cc...]`, `Array of target IDs to be added as CC.`)
  .option(`--bcc [bcc...]`, `Array of target IDs to be added as BCC.`)
  .option(`--scheduledat <scheduledat>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
  .option(`--attachments [attachments...]`, `Array of compound ID strings of bucket IDs and file IDs to be attached to the email. They should be formatted as <BUCKET_ID>:<FILE_ID>.`)
  .action(
    actionRunner(
      async ({ messageId, topics, users, targets, subject, content, draft, html, cc, bcc, scheduledAt, attachments }) =>
        parse(await (await getMessagingClient()).updateEmail(messageId, topics, users, targets, subject, content, draft, html, cc, bcc, scheduledAt, attachments)),
    ),
  );

messaging
  .command(`create-push`)
  .description(`Create a new push notification.`)
  .requiredOption(`--messageid <messageid>`, `Message ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .option(`--title <title>`, `Title for push notification.`)
  .option(`--body <body>`, `Body for push notification.`)
  .option(`--topics [topics...]`, `List of Topic IDs.`)
  .option(`--users [users...]`, `List of User IDs.`)
  .option(`--targets [targets...]`, `List of Targets IDs.`)
  .option(`--data <data>`, `Additional key-value pair data for push notification.`)
  .option(`--action <action>`, `Action for push notification.`)
  .option(`--image <image>`, `Image for push notification. Must be a compound bucket ID to file ID of a jpeg, png, or bmp image in Appwrite Storage. It should be formatted as <BUCKET_ID>:<FILE_ID>.`)
  .option(`--icon <icon>`, `Icon for push notification. Available only for Android and Web Platform.`)
  .option(`--sound <sound>`, `Sound for push notification. Available only for Android and iOS Platform.`)
  .option(`--color <color>`, `Color for push notification. Available only for Android Platform.`)
  .option(`--tag <tag>`, `Tag for push notification. Available only for Android Platform.`)
  .option(`--badge <badge>`, `Badge for push notification. Available only for iOS Platform.`, parseInteger)
  .option(
    `--draft [value]`,
    `Is message a draft`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--scheduledat <scheduledat>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
  .option(
    `--contentavailable [value]`,
    `If set to true, the notification will be delivered in the background. Available only for iOS Platform.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--critical [value]`,
    `If set to true, the notification will be marked as critical. This requires the app to have the critical notification entitlement. Available only for iOS Platform.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--priority <priority>`, `Set the notification priority. "normal" will consider device state and may not deliver notifications immediately. "high" will always attempt to immediately deliver the notification.`)
  .action(
    actionRunner(
      async ({ messageId, title, body, topics, users, targets, data, action, image, icon, sound, color, tag, badge, draft, scheduledAt, contentAvailable, critical, priority }) =>
        parse(await (await getMessagingClient()).createPush(messageId, title, body, topics, users, targets, JSON.parse(data), action, image, icon, sound, color, tag, badge, draft, scheduledAt, contentAvailable, critical, priority as MessagePriority)),
    ),
  );

messaging
  .command(`update-push`)
  .description(`Update a push notification by its unique ID. This endpoint only works on messages that are in draft status. Messages that are already processing, sent, or failed cannot be updated.
`)
  .requiredOption(`--messageid <messageid>`, `Message ID.`)
  .option(`--topics [topics...]`, `List of Topic IDs.`)
  .option(`--users [users...]`, `List of User IDs.`)
  .option(`--targets [targets...]`, `List of Targets IDs.`)
  .option(`--title <title>`, `Title for push notification.`)
  .option(`--body <body>`, `Body for push notification.`)
  .option(`--data <data>`, `Additional Data for push notification.`)
  .option(`--action <action>`, `Action for push notification.`)
  .option(`--image <image>`, `Image for push notification. Must be a compound bucket ID to file ID of a jpeg, png, or bmp image in Appwrite Storage. It should be formatted as <BUCKET_ID>:<FILE_ID>.`)
  .option(`--icon <icon>`, `Icon for push notification. Available only for Android and Web platforms.`)
  .option(`--sound <sound>`, `Sound for push notification. Available only for Android and iOS platforms.`)
  .option(`--color <color>`, `Color for push notification. Available only for Android platforms.`)
  .option(`--tag <tag>`, `Tag for push notification. Available only for Android platforms.`)
  .option(`--badge <badge>`, `Badge for push notification. Available only for iOS platforms.`, parseInteger)
  .option(
    `--draft [value]`,
    `Is message a draft`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--scheduledat <scheduledat>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
  .option(
    `--contentavailable [value]`,
    `If set to true, the notification will be delivered in the background. Available only for iOS Platform.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--critical [value]`,
    `If set to true, the notification will be marked as critical. This requires the app to have the critical notification entitlement. Available only for iOS Platform.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--priority <priority>`, `Set the notification priority. "normal" will consider device battery state and may send notifications later. "high" will always attempt to immediately deliver the notification.`)
  .action(
    actionRunner(
      async ({ messageId, topics, users, targets, title, body, data, action, image, icon, sound, color, tag, badge, draft, scheduledAt, contentAvailable, critical, priority }) =>
        parse(await (await getMessagingClient()).updatePush(messageId, topics, users, targets, title, body, JSON.parse(data), action, image, icon, sound, color, tag, badge, draft, scheduledAt, contentAvailable, critical, priority as MessagePriority)),
    ),
  );

messaging
  .command(`create-sms`)
  .description(`Create a new SMS message.`)
  .requiredOption(`--messageid <messageid>`, `Message ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--content <content>`, `SMS Content.`)
  .option(`--topics [topics...]`, `List of Topic IDs.`)
  .option(`--users [users...]`, `List of User IDs.`)
  .option(`--targets [targets...]`, `List of Targets IDs.`)
  .option(
    `--draft [value]`,
    `Is message a draft`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--scheduledat <scheduledat>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
  .action(
    actionRunner(
      async ({ messageId, content, topics, users, targets, draft, scheduledAt }) =>
        parse(await (await getMessagingClient()).createSms(messageId, content, topics, users, targets, draft, scheduledAt)),
    ),
  );

messaging
  .command(`update-sms`)
  .description(`Update an SMS message by its unique ID. This endpoint only works on messages that are in draft status. Messages that are already processing, sent, or failed cannot be updated.
`)
  .requiredOption(`--messageid <messageid>`, `Message ID.`)
  .option(`--topics [topics...]`, `List of Topic IDs.`)
  .option(`--users [users...]`, `List of User IDs.`)
  .option(`--targets [targets...]`, `List of Targets IDs.`)
  .option(`--content <content>`, `Email Content.`)
  .option(
    `--draft [value]`,
    `Is message a draft`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--scheduledat <scheduledat>`, `Scheduled delivery time for message in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.`)
  .action(
    actionRunner(
      async ({ messageId, topics, users, targets, content, draft, scheduledAt }) =>
        parse(await (await getMessagingClient()).updateSms(messageId, topics, users, targets, content, draft, scheduledAt)),
    ),
  );

messaging
  .command(`get-message`)
  .description(`Get a message by its unique ID.
`)
  .requiredOption(`--messageid <messageid>`, `Message ID.`)
  .action(
    actionRunner(
      async ({ messageId }) =>
        parse(await (await getMessagingClient()).getMessage(messageId)),
    ),
  );

messaging
  .command(`delete`)
  .description(`Delete a message. If the message is not a draft or scheduled, but has been sent, this will not recall the message.`)
  .requiredOption(`--messageid <messageid>`, `Message ID.`)
  .action(
    actionRunner(
      async ({ messageId }) =>
        parse(await (await getMessagingClient()).delete(messageId)),
    ),
  );

messaging
  .command(`list-message-logs`)
  .description(`Get the message activity logs listed by its unique ID.`)
  .requiredOption(`--messageid <messageid>`, `Message ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ messageId, queries, total }) =>
        parse(await (await getMessagingClient()).listMessageLogs(messageId, queries, total)),
    ),
  );

messaging
  .command(`list-targets`)
  .description(`Get a list of the targets associated with a message.`)
  .requiredOption(`--messageid <messageid>`, `Message ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, providerId, identifier, providerType`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ messageId, queries, total }) =>
        parse(await (await getMessagingClient()).listTargets(messageId, queries, total)),
    ),
  );

messaging
  .command(`list-providers`)
  .description(`Get a list of all providers from the current Appwrite project.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, provider, type, enabled`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ queries, search, total }) =>
        parse(await (await getMessagingClient()).listProviders(queries, search, total)),
    ),
  );

messaging
  .command(`create-apns-provider`)
  .description(`Create a new Apple Push Notification service provider.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Provider name.`)
  .option(`--authkey <authkey>`, `APNS authentication key.`)
  .option(`--authkeyid <authkeyid>`, `APNS authentication key ID.`)
  .option(`--teamid <teamid>`, `APNS team ID.`)
  .option(`--bundleid <bundleid>`, `APNS bundle ID.`)
  .option(
    `--sandbox [value]`,
    `Use APNS sandbox environment.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ providerId, name, authKey, authKeyId, teamId, bundleId, sandbox, enabled }) =>
        parse(await (await getMessagingClient()).createApnsProvider(providerId, name, authKey, authKeyId, teamId, bundleId, sandbox, enabled)),
    ),
  );

messaging
  .command(`update-apns-provider`)
  .description(`Update a Apple Push Notification service provider by its unique ID.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID.`)
  .option(`--name <name>`, `Provider name.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--authkey <authkey>`, `APNS authentication key.`)
  .option(`--authkeyid <authkeyid>`, `APNS authentication key ID.`)
  .option(`--teamid <teamid>`, `APNS team ID.`)
  .option(`--bundleid <bundleid>`, `APNS bundle ID.`)
  .option(
    `--sandbox [value]`,
    `Use APNS sandbox environment.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ providerId, name, enabled, authKey, authKeyId, teamId, bundleId, sandbox }) =>
        parse(await (await getMessagingClient()).updateApnsProvider(providerId, name, enabled, authKey, authKeyId, teamId, bundleId, sandbox)),
    ),
  );

messaging
  .command(`create-fcm-provider`)
  .description(`Create a new Firebase Cloud Messaging provider.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Provider name.`)
  .option(`--serviceaccountjson <serviceaccountjson>`, `FCM service account JSON.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ providerId, name, serviceAccountJSON, enabled }) =>
        parse(await (await getMessagingClient()).createFcmProvider(providerId, name, JSON.parse(serviceAccountJSON), enabled)),
    ),
  );

messaging
  .command(`update-fcm-provider`)
  .description(`Update a Firebase Cloud Messaging provider by its unique ID.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID.`)
  .option(`--name <name>`, `Provider name.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--serviceaccountjson <serviceaccountjson>`, `FCM service account JSON.`)
  .action(
    actionRunner(
      async ({ providerId, name, enabled, serviceAccountJSON }) =>
        parse(await (await getMessagingClient()).updateFcmProvider(providerId, name, enabled, JSON.parse(serviceAccountJSON))),
    ),
  );

messaging
  .command(`create-mailgun-provider`)
  .description(`Create a new Mailgun provider.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Provider name.`)
  .option(`--apikey <apikey>`, `Mailgun API Key.`)
  .option(`--domain <domain>`, `Mailgun Domain.`)
  .option(
    `--iseuregion [value]`,
    `Set as EU region.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--fromname <fromname>`, `Sender Name.`)
  .option(`--fromemail <fromemail>`, `Sender email address.`)
  .option(`--replytoname <replytoname>`, `Name set in the reply to field for the mail. Default value is sender name. Reply to name must have reply to email as well.`)
  .option(`--replytoemail <replytoemail>`, `Email set in the reply to field for the mail. Default value is sender email. Reply to email must have reply to name as well.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ providerId, name, apiKey, domain, isEuRegion, fromName, fromEmail, replyToName, replyToEmail, enabled }) =>
        parse(await (await getMessagingClient()).createMailgunProvider(providerId, name, apiKey, domain, isEuRegion, fromName, fromEmail, replyToName, replyToEmail, enabled)),
    ),
  );

messaging
  .command(`update-mailgun-provider`)
  .description(`Update a Mailgun provider by its unique ID.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID.`)
  .option(`--name <name>`, `Provider name.`)
  .option(`--apikey <apikey>`, `Mailgun API Key.`)
  .option(`--domain <domain>`, `Mailgun Domain.`)
  .option(
    `--iseuregion [value]`,
    `Set as EU region.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--fromname <fromname>`, `Sender Name.`)
  .option(`--fromemail <fromemail>`, `Sender email address.`)
  .option(`--replytoname <replytoname>`, `Name set in the reply to field for the mail. Default value is sender name.`)
  .option(`--replytoemail <replytoemail>`, `Email set in the reply to field for the mail. Default value is sender email.`)
  .action(
    actionRunner(
      async ({ providerId, name, apiKey, domain, isEuRegion, enabled, fromName, fromEmail, replyToName, replyToEmail }) =>
        parse(await (await getMessagingClient()).updateMailgunProvider(providerId, name, apiKey, domain, isEuRegion, enabled, fromName, fromEmail, replyToName, replyToEmail)),
    ),
  );

messaging
  .command(`create-msg-91-provider`)
  .description(`Create a new MSG91 provider.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Provider name.`)
  .option(`--templateid <templateid>`, `Msg91 template ID`)
  .option(`--senderid <senderid>`, `Msg91 sender ID.`)
  .option(`--authkey <authkey>`, `Msg91 auth key.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ providerId, name, templateId, senderId, authKey, enabled }) =>
        parse(await (await getMessagingClient()).createMsg91Provider(providerId, name, templateId, senderId, authKey, enabled)),
    ),
  );

messaging
  .command(`update-msg-91-provider`)
  .description(`Update a MSG91 provider by its unique ID.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID.`)
  .option(`--name <name>`, `Provider name.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--templateid <templateid>`, `Msg91 template ID.`)
  .option(`--senderid <senderid>`, `Msg91 sender ID.`)
  .option(`--authkey <authkey>`, `Msg91 auth key.`)
  .action(
    actionRunner(
      async ({ providerId, name, enabled, templateId, senderId, authKey }) =>
        parse(await (await getMessagingClient()).updateMsg91Provider(providerId, name, enabled, templateId, senderId, authKey)),
    ),
  );

messaging
  .command(`create-resend-provider`)
  .description(`Create a new Resend provider.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Provider name.`)
  .option(`--apikey <apikey>`, `Resend API key.`)
  .option(`--fromname <fromname>`, `Sender Name.`)
  .option(`--fromemail <fromemail>`, `Sender email address.`)
  .option(`--replytoname <replytoname>`, `Name set in the reply to field for the mail. Default value is sender name.`)
  .option(`--replytoemail <replytoemail>`, `Email set in the reply to field for the mail. Default value is sender email.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ providerId, name, apiKey, fromName, fromEmail, replyToName, replyToEmail, enabled }) =>
        parse(await (await getMessagingClient()).createResendProvider(providerId, name, apiKey, fromName, fromEmail, replyToName, replyToEmail, enabled)),
    ),
  );

messaging
  .command(`update-resend-provider`)
  .description(`Update a Resend provider by its unique ID.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID.`)
  .option(`--name <name>`, `Provider name.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--apikey <apikey>`, `Resend API key.`)
  .option(`--fromname <fromname>`, `Sender Name.`)
  .option(`--fromemail <fromemail>`, `Sender email address.`)
  .option(`--replytoname <replytoname>`, `Name set in the Reply To field for the mail. Default value is Sender Name.`)
  .option(`--replytoemail <replytoemail>`, `Email set in the Reply To field for the mail. Default value is Sender Email.`)
  .action(
    actionRunner(
      async ({ providerId, name, enabled, apiKey, fromName, fromEmail, replyToName, replyToEmail }) =>
        parse(await (await getMessagingClient()).updateResendProvider(providerId, name, enabled, apiKey, fromName, fromEmail, replyToName, replyToEmail)),
    ),
  );

messaging
  .command(`create-sendgrid-provider`)
  .description(`Create a new Sendgrid provider.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Provider name.`)
  .option(`--apikey <apikey>`, `Sendgrid API key.`)
  .option(`--fromname <fromname>`, `Sender Name.`)
  .option(`--fromemail <fromemail>`, `Sender email address.`)
  .option(`--replytoname <replytoname>`, `Name set in the reply to field for the mail. Default value is sender name.`)
  .option(`--replytoemail <replytoemail>`, `Email set in the reply to field for the mail. Default value is sender email.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ providerId, name, apiKey, fromName, fromEmail, replyToName, replyToEmail, enabled }) =>
        parse(await (await getMessagingClient()).createSendgridProvider(providerId, name, apiKey, fromName, fromEmail, replyToName, replyToEmail, enabled)),
    ),
  );

messaging
  .command(`update-sendgrid-provider`)
  .description(`Update a Sendgrid provider by its unique ID.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID.`)
  .option(`--name <name>`, `Provider name.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--apikey <apikey>`, `Sendgrid API key.`)
  .option(`--fromname <fromname>`, `Sender Name.`)
  .option(`--fromemail <fromemail>`, `Sender email address.`)
  .option(`--replytoname <replytoname>`, `Name set in the Reply To field for the mail. Default value is Sender Name.`)
  .option(`--replytoemail <replytoemail>`, `Email set in the Reply To field for the mail. Default value is Sender Email.`)
  .action(
    actionRunner(
      async ({ providerId, name, enabled, apiKey, fromName, fromEmail, replyToName, replyToEmail }) =>
        parse(await (await getMessagingClient()).updateSendgridProvider(providerId, name, enabled, apiKey, fromName, fromEmail, replyToName, replyToEmail)),
    ),
  );

messaging
  .command(`create-smtp-provider`)
  .description(`Create a new SMTP provider.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Provider name.`)
  .requiredOption(`--host <host>`, `SMTP hosts. Either a single hostname or multiple semicolon-delimited hostnames. You can also specify a different port for each host such as \`smtp1.example.com:25;smtp2.example.com\`. You can also specify encryption type, for example: \`tls://smtp1.example.com:587;ssl://smtp2.example.com:465"\`. Hosts will be tried in order.`)
  .option(`--port <port>`, `The default SMTP server port.`, parseInteger)
  .option(`--username <username>`, `Authentication username.`)
  .option(`--password <password>`, `Authentication password.`)
  .option(`--encryption <encryption>`, `Encryption type. Can be omitted, 'ssl', or 'tls'`)
  .option(
    `--autotls [value]`,
    `Enable SMTP AutoTLS feature.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--mailer <mailer>`, `The value to use for the X-Mailer header.`)
  .option(`--fromname <fromname>`, `Sender Name.`)
  .option(`--fromemail <fromemail>`, `Sender email address.`)
  .option(`--replytoname <replytoname>`, `Name set in the reply to field for the mail. Default value is sender name.`)
  .option(`--replytoemail <replytoemail>`, `Email set in the reply to field for the mail. Default value is sender email.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ providerId, name, host, port, username, password, encryption, autoTLS, mailer, fromName, fromEmail, replyToName, replyToEmail, enabled }) =>
        parse(await (await getMessagingClient()).createSmtpProvider(providerId, name, host, port, username, password, encryption as SmtpEncryption, autoTLS, mailer, fromName, fromEmail, replyToName, replyToEmail, enabled)),
    ),
  );

messaging
  .command(`update-smtp-provider`)
  .description(`Update a SMTP provider by its unique ID.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID.`)
  .option(`--name <name>`, `Provider name.`)
  .option(`--host <host>`, `SMTP hosts. Either a single hostname or multiple semicolon-delimited hostnames. You can also specify a different port for each host such as \`smtp1.example.com:25;smtp2.example.com\`. You can also specify encryption type, for example: \`tls://smtp1.example.com:587;ssl://smtp2.example.com:465"\`. Hosts will be tried in order.`)
  .option(`--port <port>`, `SMTP port.`, parseInteger)
  .option(`--username <username>`, `Authentication username.`)
  .option(`--password <password>`, `Authentication password.`)
  .option(`--encryption <encryption>`, `Encryption type. Can be 'ssl' or 'tls'`)
  .option(
    `--autotls [value]`,
    `Enable SMTP AutoTLS feature.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--mailer <mailer>`, `The value to use for the X-Mailer header.`)
  .option(`--fromname <fromname>`, `Sender Name.`)
  .option(`--fromemail <fromemail>`, `Sender email address.`)
  .option(`--replytoname <replytoname>`, `Name set in the Reply To field for the mail. Default value is Sender Name.`)
  .option(`--replytoemail <replytoemail>`, `Email set in the Reply To field for the mail. Default value is Sender Email.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ providerId, name, host, port, username, password, encryption, autoTLS, mailer, fromName, fromEmail, replyToName, replyToEmail, enabled }) =>
        parse(await (await getMessagingClient()).updateSmtpProvider(providerId, name, host, port, username, password, encryption as SmtpEncryption, autoTLS, mailer, fromName, fromEmail, replyToName, replyToEmail, enabled)),
    ),
  );

messaging
  .command(`create-telesign-provider`)
  .description(`Create a new Telesign provider.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Provider name.`)
  .option(`--from <from>`, `Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
  .option(`--customerid <customerid>`, `Telesign customer ID.`)
  .option(`--apikey <apikey>`, `Telesign API key.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ providerId, name, from, customerId, apiKey, enabled }) =>
        parse(await (await getMessagingClient()).createTelesignProvider(providerId, name, from, customerId, apiKey, enabled)),
    ),
  );

messaging
  .command(`update-telesign-provider`)
  .description(`Update a Telesign provider by its unique ID.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID.`)
  .option(`--name <name>`, `Provider name.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--customerid <customerid>`, `Telesign customer ID.`)
  .option(`--apikey <apikey>`, `Telesign API key.`)
  .option(`--from <from>`, `Sender number.`)
  .action(
    actionRunner(
      async ({ providerId, name, enabled, customerId, apiKey, from }) =>
        parse(await (await getMessagingClient()).updateTelesignProvider(providerId, name, enabled, customerId, apiKey, from)),
    ),
  );

messaging
  .command(`create-textmagic-provider`)
  .description(`Create a new Textmagic provider.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Provider name.`)
  .option(`--from <from>`, `Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
  .option(`--username <username>`, `Textmagic username.`)
  .option(`--apikey <apikey>`, `Textmagic apiKey.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ providerId, name, from, username, apiKey, enabled }) =>
        parse(await (await getMessagingClient()).createTextmagicProvider(providerId, name, from, username, apiKey, enabled)),
    ),
  );

messaging
  .command(`update-textmagic-provider`)
  .description(`Update a Textmagic provider by its unique ID.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID.`)
  .option(`--name <name>`, `Provider name.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--username <username>`, `Textmagic username.`)
  .option(`--apikey <apikey>`, `Textmagic apiKey.`)
  .option(`--from <from>`, `Sender number.`)
  .action(
    actionRunner(
      async ({ providerId, name, enabled, username, apiKey, from }) =>
        parse(await (await getMessagingClient()).updateTextmagicProvider(providerId, name, enabled, username, apiKey, from)),
    ),
  );

messaging
  .command(`create-twilio-provider`)
  .description(`Create a new Twilio provider.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Provider name.`)
  .option(`--from <from>`, `Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
  .option(`--accountsid <accountsid>`, `Twilio account secret ID.`)
  .option(`--authtoken <authtoken>`, `Twilio authentication token.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ providerId, name, from, accountSid, authToken, enabled }) =>
        parse(await (await getMessagingClient()).createTwilioProvider(providerId, name, from, accountSid, authToken, enabled)),
    ),
  );

messaging
  .command(`update-twilio-provider`)
  .description(`Update a Twilio provider by its unique ID.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID.`)
  .option(`--name <name>`, `Provider name.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--accountsid <accountsid>`, `Twilio account secret ID.`)
  .option(`--authtoken <authtoken>`, `Twilio authentication token.`)
  .option(`--from <from>`, `Sender number.`)
  .action(
    actionRunner(
      async ({ providerId, name, enabled, accountSid, authToken, from }) =>
        parse(await (await getMessagingClient()).updateTwilioProvider(providerId, name, enabled, accountSid, authToken, from)),
    ),
  );

messaging
  .command(`create-vonage-provider`)
  .description(`Create a new Vonage provider.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Provider name.`)
  .option(`--from <from>`, `Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.`)
  .option(`--apikey <apikey>`, `Vonage API key.`)
  .option(`--apisecret <apisecret>`, `Vonage API secret.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ providerId, name, from, apiKey, apiSecret, enabled }) =>
        parse(await (await getMessagingClient()).createVonageProvider(providerId, name, from, apiKey, apiSecret, enabled)),
    ),
  );

messaging
  .command(`update-vonage-provider`)
  .description(`Update a Vonage provider by its unique ID.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID.`)
  .option(`--name <name>`, `Provider name.`)
  .option(
    `--enabled [value]`,
    `Set as enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--apikey <apikey>`, `Vonage API key.`)
  .option(`--apisecret <apisecret>`, `Vonage API secret.`)
  .option(`--from <from>`, `Sender number.`)
  .action(
    actionRunner(
      async ({ providerId, name, enabled, apiKey, apiSecret, from }) =>
        parse(await (await getMessagingClient()).updateVonageProvider(providerId, name, enabled, apiKey, apiSecret, from)),
    ),
  );

messaging
  .command(`get-provider`)
  .description(`Get a provider by its unique ID.
`)
  .requiredOption(`--providerid <providerid>`, `Provider ID.`)
  .action(
    actionRunner(
      async ({ providerId }) =>
        parse(await (await getMessagingClient()).getProvider(providerId)),
    ),
  );

messaging
  .command(`delete-provider`)
  .description(`Delete a provider by its unique ID.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID.`)
  .action(
    actionRunner(
      async ({ providerId }) =>
        parse(await (await getMessagingClient()).deleteProvider(providerId)),
    ),
  );

messaging
  .command(`list-provider-logs`)
  .description(`Get the provider activity logs listed by its unique ID.`)
  .requiredOption(`--providerid <providerid>`, `Provider ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ providerId, queries, total }) =>
        parse(await (await getMessagingClient()).listProviderLogs(providerId, queries, total)),
    ),
  );

messaging
  .command(`list-subscriber-logs`)
  .description(`Get the subscriber activity logs listed by its unique ID.`)
  .requiredOption(`--subscriberid <subscriberid>`, `Subscriber ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ subscriberId, queries, total }) =>
        parse(await (await getMessagingClient()).listSubscriberLogs(subscriberId, queries, total)),
    ),
  );

messaging
  .command(`list-topics`)
  .description(`Get a list of all topics from the current Appwrite project.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, description, emailTotal, smsTotal, pushTotal`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ queries, search, total }) =>
        parse(await (await getMessagingClient()).listTopics(queries, search, total)),
    ),
  );

messaging
  .command(`create-topic`)
  .description(`Create a new topic.`)
  .requiredOption(`--topicid <topicid>`, `Topic ID. Choose a custom Topic ID or a new Topic ID.`)
  .requiredOption(`--name <name>`, `Topic Name.`)
  .option(`--subscribe [subscribe...]`, `An array of role strings with subscribe permission. By default all users are granted with any subscribe permission. [learn more about roles](https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.`)
  .action(
    actionRunner(
      async ({ topicId, name, subscribe }) =>
        parse(await (await getMessagingClient()).createTopic(topicId, name, subscribe)),
    ),
  );

messaging
  .command(`get-topic`)
  .description(`Get a topic by its unique ID.
`)
  .requiredOption(`--topicid <topicid>`, `Topic ID.`)
  .action(
    actionRunner(
      async ({ topicId }) =>
        parse(await (await getMessagingClient()).getTopic(topicId)),
    ),
  );

messaging
  .command(`update-topic`)
  .description(`Update a topic by its unique ID.
`)
  .requiredOption(`--topicid <topicid>`, `Topic ID.`)
  .option(`--name <name>`, `Topic Name.`)
  .option(`--subscribe [subscribe...]`, `An array of role strings with subscribe permission. By default all users are granted with any subscribe permission. [learn more about roles](https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.`)
  .action(
    actionRunner(
      async ({ topicId, name, subscribe }) =>
        parse(await (await getMessagingClient()).updateTopic(topicId, name, subscribe)),
    ),
  );

messaging
  .command(`delete-topic`)
  .description(`Delete a topic by its unique ID.`)
  .requiredOption(`--topicid <topicid>`, `Topic ID.`)
  .action(
    actionRunner(
      async ({ topicId }) =>
        parse(await (await getMessagingClient()).deleteTopic(topicId)),
    ),
  );

messaging
  .command(`list-topic-logs`)
  .description(`Get the topic activity logs listed by its unique ID.`)
  .requiredOption(`--topicid <topicid>`, `Topic ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Only supported methods are limit and offset`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ topicId, queries, total }) =>
        parse(await (await getMessagingClient()).listTopicLogs(topicId, queries, total)),
    ),
  );

messaging
  .command(`list-subscribers`)
  .description(`Get a list of all subscribers from the current Appwrite project.`)
  .requiredOption(`--topicid <topicid>`, `Topic ID. The topic ID subscribed to.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, provider, type, enabled`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ topicId, queries, search, total }) =>
        parse(await (await getMessagingClient()).listSubscribers(topicId, queries, search, total)),
    ),
  );

messaging
  .command(`create-subscriber`)
  .description(`Create a new subscriber.`)
  .requiredOption(`--topicid <topicid>`, `Topic ID. The topic ID to subscribe to.`)
  .requiredOption(`--subscriberid <subscriberid>`, `Subscriber ID. Choose a custom Subscriber ID or a new Subscriber ID.`)
  .requiredOption(`--targetid <targetid>`, `Target ID. The target ID to link to the specified Topic ID.`)
  .action(
    actionRunner(
      async ({ topicId, subscriberId, targetId }) =>
        parse(await (await getMessagingClient()).createSubscriber(topicId, subscriberId, targetId)),
    ),
  );

messaging
  .command(`get-subscriber`)
  .description(`Get a subscriber by its unique ID.
`)
  .requiredOption(`--topicid <topicid>`, `Topic ID. The topic ID subscribed to.`)
  .requiredOption(`--subscriberid <subscriberid>`, `Subscriber ID.`)
  .action(
    actionRunner(
      async ({ topicId, subscriberId }) =>
        parse(await (await getMessagingClient()).getSubscriber(topicId, subscriberId)),
    ),
  );

messaging
  .command(`delete-subscriber`)
  .description(`Delete a subscriber by its unique ID.`)
  .requiredOption(`--topicid <topicid>`, `Topic ID. The topic ID subscribed to.`)
  .requiredOption(`--subscriberid <subscriberid>`, `Subscriber ID.`)
  .action(
    actionRunner(
      async ({ topicId, subscriberId }) =>
        parse(await (await getMessagingClient()).deleteSubscriber(topicId, subscriberId)),
    ),
  );

