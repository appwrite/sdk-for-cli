import { Command } from "commander";
import { sdkForProject } from "../../sdks.js";
import {
  actionRunner,
  commandDescriptions,
  parseBool,
  parseInteger,
} from "../../parser.js";
import { Health } from "@appwrite.io/console";

let healthClient: Health | null = null;

const getHealthClient = async (): Promise<Health> => {
  if (!healthClient) {
    const sdkClient = await sdkForProject();
    healthClient = new Health(sdkClient);
  }
  return healthClient;
};

export const health = new Command("health")
  .description(commandDescriptions["health"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

health
  .command(`get`)
  .description(`Check the Appwrite HTTP server is up and responsive.`)
  .action(actionRunner(async () => await (await getHealthClient()).get()));

health
  .command(`get-antivirus`)
  .description(
    `Check the Appwrite Antivirus server is up and connection is successful.`,
  )
  .action(
    actionRunner(async () => await (await getHealthClient()).getAntivirus()),
  );

health
  .command(`get-cache`)
  .description(
    `Check the Appwrite in-memory cache servers are up and connection is successful.`,
  )
  .action(actionRunner(async () => await (await getHealthClient()).getCache()));

health
  .command(`get-certificate`)
  .description(`Get the SSL certificate for a domain`)
  .option(`--domain <domain>`, `string`)
  .action(
    actionRunner(
      async ({ domain }) =>
        await (await getHealthClient()).getCertificate(domain),
    ),
  );

health
  .command(`get-db`)
  .description(
    `Check the Appwrite database servers are up and connection is successful.`,
  )
  .action(actionRunner(async () => await (await getHealthClient()).getDB()));

health
  .command(`get-pub-sub`)
  .description(
    `Check the Appwrite pub-sub servers are up and connection is successful.`,
  )
  .action(
    actionRunner(async () => await (await getHealthClient()).getPubSub()),
  );

health
  .command(`get-queue-builds`)
  .description(
    `Get the number of builds that are waiting to be processed in the Appwrite internal queue server.`,
  )
  .option(
    `--threshold <threshold>`,
    `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ threshold }) =>
        await (await getHealthClient()).getQueueBuilds(threshold),
    ),
  );

health
  .command(`get-queue-certificates`)
  .description(
    `Get the number of certificates that are waiting to be issued against [Letsencrypt](https://letsencrypt.org/) in the Appwrite internal queue server.`,
  )
  .option(
    `--threshold <threshold>`,
    `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ threshold }) =>
        await (await getHealthClient()).getQueueCertificates(threshold),
    ),
  );

health
  .command(`get-queue-databases`)
  .description(
    `Get the number of database changes that are waiting to be processed in the Appwrite internal queue server.`,
  )
  .option(`--name <name>`, `Queue name for which to check the queue size`)
  .option(
    `--threshold <threshold>`,
    `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ name, threshold }) =>
        await (await getHealthClient()).getQueueDatabases(name, threshold),
    ),
  );

health
  .command(`get-queue-deletes`)
  .description(
    `Get the number of background destructive changes that are waiting to be processed in the Appwrite internal queue server.`,
  )
  .option(
    `--threshold <threshold>`,
    `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ threshold }) =>
        await (await getHealthClient()).getQueueDeletes(threshold),
    ),
  );

health
  .command(`get-failed-jobs`)
  .description(
    `Returns the amount of failed jobs in a given queue.
`,
  )
  .requiredOption(`--name <name>`, `The name of the queue`)
  .option(
    `--threshold <threshold>`,
    `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ name, threshold }) =>
        await (await getHealthClient()).getFailedJobs(name, threshold),
    ),
  );

health
  .command(`get-queue-functions`)
  .description(
    `Get the number of function executions that are waiting to be processed in the Appwrite internal queue server.`,
  )
  .option(
    `--threshold <threshold>`,
    `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ threshold }) =>
        await (await getHealthClient()).getQueueFunctions(threshold),
    ),
  );

health
  .command(`get-queue-logs`)
  .description(
    `Get the number of logs that are waiting to be processed in the Appwrite internal queue server.`,
  )
  .option(
    `--threshold <threshold>`,
    `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ threshold }) =>
        await (await getHealthClient()).getQueueLogs(threshold),
    ),
  );

health
  .command(`get-queue-mails`)
  .description(
    `Get the number of mails that are waiting to be processed in the Appwrite internal queue server.`,
  )
  .option(
    `--threshold <threshold>`,
    `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ threshold }) =>
        await (await getHealthClient()).getQueueMails(threshold),
    ),
  );

health
  .command(`get-queue-messaging`)
  .description(
    `Get the number of messages that are waiting to be processed in the Appwrite internal queue server.`,
  )
  .option(
    `--threshold <threshold>`,
    `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ threshold }) =>
        await (await getHealthClient()).getQueueMessaging(threshold),
    ),
  );

health
  .command(`get-queue-migrations`)
  .description(
    `Get the number of migrations that are waiting to be processed in the Appwrite internal queue server.`,
  )
  .option(
    `--threshold <threshold>`,
    `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ threshold }) =>
        await (await getHealthClient()).getQueueMigrations(threshold),
    ),
  );

health
  .command(`get-queue-stats-resources`)
  .description(
    `Get the number of metrics that are waiting to be processed in the Appwrite stats resources queue.`,
  )
  .option(
    `--threshold <threshold>`,
    `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ threshold }) =>
        await (await getHealthClient()).getQueueStatsResources(threshold),
    ),
  );

health
  .command(`get-queue-usage`)
  .description(
    `Get the number of metrics that are waiting to be processed in the Appwrite internal queue server.`,
  )
  .option(
    `--threshold <threshold>`,
    `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ threshold }) =>
        await (await getHealthClient()).getQueueUsage(threshold),
    ),
  );

health
  .command(`get-queue-webhooks`)
  .description(
    `Get the number of webhooks that are waiting to be processed in the Appwrite internal queue server.`,
  )
  .option(
    `--threshold <threshold>`,
    `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`,
    parseInteger,
  )
  .action(
    actionRunner(
      async ({ threshold }) =>
        await (await getHealthClient()).getQueueWebhooks(threshold),
    ),
  );

health
  .command(`get-storage`)
  .description(
    `Check the Appwrite storage device is up and connection is successful.`,
  )
  .action(
    actionRunner(async () => await (await getHealthClient()).getStorage()),
  );

health
  .command(`get-storage-local`)
  .description(
    `Check the Appwrite local storage device is up and connection is successful.`,
  )
  .action(
    actionRunner(async () => await (await getHealthClient()).getStorageLocal()),
  );

health
  .command(`get-time`)
  .description(
    `Check the Appwrite server time is synced with Google remote NTP server. We use this technology to smoothly handle leap seconds with no disruptive events. The [Network Time Protocol](https://en.wikipedia.org/wiki/Network_Time_Protocol) (NTP) is used by hundreds of millions of computers and devices to synchronize their clocks over the Internet. If your computer sets its own clock, it likely uses NTP.`,
  )
  .action(actionRunner(async () => await (await getHealthClient()).getTime()));
