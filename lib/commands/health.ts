import fs from "fs";
import pathLib from "path";
import tar from "tar";
import ignoreModule from "ignore";
const ignore: typeof ignoreModule =
  (ignoreModule as any).default ?? ignoreModule;
import { promisify } from "util";
import Client from "../client.js";
import { getAllFiles, showConsoleLink } from "../utils.js";
import { Command } from "commander";
import { sdkForProject, sdkForConsole } from "../sdks.js";
import {
  parse,
  actionRunner,
  parseInteger,
  parseBool,
  commandDescriptions,
  success,
  log,
  warn,
} from "../parser.js";
import { localConfig, globalConfig } from "../config.js";
import { File } from "undici";
import { ReadableStream } from "stream/web";
import type { UploadProgress, FileInput } from "../types.js";
import { Name } from "@appwrite.io/console";

function convertReadStreamToReadableStream(
  readStream: fs.ReadStream,
): ReadableStream {
  return new ReadableStream({
    start(controller) {
      readStream.on("data", (chunk: Buffer) => {
        controller.enqueue(chunk);
      });
      readStream.on("end", () => {
        controller.close();
      });
      readStream.on("error", (err: Error) => {
        controller.error(err);
      });
    },
    cancel() {
      readStream.destroy();
    },
  });
}

export const health = new Command("health")
  .description(commandDescriptions["health"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

interface HealthGetRequestParams {
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGet = async ({
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health";
  let payload = {};

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetAntivirusRequestParams {
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetAntivirus = async ({
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetAntivirusRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/anti-virus";
  let payload = {};

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetCacheRequestParams {
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetCache = async ({
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetCacheRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/cache";
  let payload = {};

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetCertificateRequestParams {
  domain?: string;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetCertificate = async ({
  domain,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetCertificateRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/certificate";
  let payload = {};
  if (typeof domain !== "undefined") {
    payload["domain"] = domain;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetDBRequestParams {
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetDB = async ({
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetDBRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/db";
  let payload = {};

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetPubSubRequestParams {
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetPubSub = async ({
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetPubSubRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/pubsub";
  let payload = {};

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetQueueBuildsRequestParams {
  threshold?: number;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetQueueBuilds = async ({
  threshold,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetQueueBuildsRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/queue/builds";
  let payload = {};
  if (typeof threshold !== "undefined") {
    payload["threshold"] = threshold;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetQueueCertificatesRequestParams {
  threshold?: number;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetQueueCertificates = async ({
  threshold,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetQueueCertificatesRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/queue/certificates";
  let payload = {};
  if (typeof threshold !== "undefined") {
    payload["threshold"] = threshold;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetQueueDatabasesRequestParams {
  name?: string;
  threshold?: number;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetQueueDatabases = async ({
  name,
  threshold,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetQueueDatabasesRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/queue/databases";
  let payload = {};
  if (typeof name !== "undefined") {
    payload["name"] = name;
  }
  if (typeof threshold !== "undefined") {
    payload["threshold"] = threshold;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetQueueDeletesRequestParams {
  threshold?: number;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetQueueDeletes = async ({
  threshold,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetQueueDeletesRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/queue/deletes";
  let payload = {};
  if (typeof threshold !== "undefined") {
    payload["threshold"] = threshold;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetFailedJobsRequestParams {
  name: Name;
  threshold?: number;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetFailedJobs = async ({
  name,
  threshold,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetFailedJobsRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/queue/failed/{name}".replace("{name}", name);
  let payload = {};
  if (typeof threshold !== "undefined") {
    payload["threshold"] = threshold;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetQueueFunctionsRequestParams {
  threshold?: number;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetQueueFunctions = async ({
  threshold,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetQueueFunctionsRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/queue/functions";
  let payload = {};
  if (typeof threshold !== "undefined") {
    payload["threshold"] = threshold;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetQueueLogsRequestParams {
  threshold?: number;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetQueueLogs = async ({
  threshold,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetQueueLogsRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/queue/logs";
  let payload = {};
  if (typeof threshold !== "undefined") {
    payload["threshold"] = threshold;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetQueueMailsRequestParams {
  threshold?: number;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetQueueMails = async ({
  threshold,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetQueueMailsRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/queue/mails";
  let payload = {};
  if (typeof threshold !== "undefined") {
    payload["threshold"] = threshold;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetQueueMessagingRequestParams {
  threshold?: number;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetQueueMessaging = async ({
  threshold,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetQueueMessagingRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/queue/messaging";
  let payload = {};
  if (typeof threshold !== "undefined") {
    payload["threshold"] = threshold;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetQueueMigrationsRequestParams {
  threshold?: number;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetQueueMigrations = async ({
  threshold,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetQueueMigrationsRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/queue/migrations";
  let payload = {};
  if (typeof threshold !== "undefined") {
    payload["threshold"] = threshold;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetQueueStatsResourcesRequestParams {
  threshold?: number;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetQueueStatsResources = async ({
  threshold,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetQueueStatsResourcesRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/queue/stats-resources";
  let payload = {};
  if (typeof threshold !== "undefined") {
    payload["threshold"] = threshold;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetQueueUsageRequestParams {
  threshold?: number;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetQueueUsage = async ({
  threshold,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetQueueUsageRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/queue/stats-usage";
  let payload = {};
  if (typeof threshold !== "undefined") {
    payload["threshold"] = threshold;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetQueueWebhooksRequestParams {
  threshold?: number;
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetQueueWebhooks = async ({
  threshold,
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetQueueWebhooksRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/queue/webhooks";
  let payload = {};
  if (typeof threshold !== "undefined") {
    payload["threshold"] = threshold;
  }

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetStorageRequestParams {
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetStorage = async ({
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetStorageRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/storage";
  let payload = {};

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetStorageLocalRequestParams {
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetStorageLocal = async ({
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetStorageLocalRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/storage/local";
  let payload = {};

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
interface HealthGetTimeRequestParams {
  overrideForCli?: boolean;
  parseOutput?: boolean;
  sdk?: Client;
}

export const healthGetTime = async ({
  parseOutput = true,
  overrideForCli = false,
  sdk = undefined,
}: HealthGetTimeRequestParams): Promise<any> => {
  let client = !sdk ? await sdkForProject() : sdk;
  let apiPath = "/health/time";
  let payload = {};

  let response = undefined;

  response = await client.call("get", apiPath, {}, payload);

  if (parseOutput) {
    parse(response);
  }

  return response;
};
health
  .command(`get`)
  .description(`Check the Appwrite HTTP server is up and responsive.`)
  .action(actionRunner(healthGet));

health
  .command(`get-antivirus`)
  .description(
    `Check the Appwrite Antivirus server is up and connection is successful.`,
  )
  .action(actionRunner(healthGetAntivirus));

health
  .command(`get-cache`)
  .description(
    `Check the Appwrite in-memory cache servers are up and connection is successful.`,
  )
  .action(actionRunner(healthGetCache));

health
  .command(`get-certificate`)
  .description(`Get the SSL certificate for a domain`)
  .option(`--domain <domain>`, `string`)
  .action(actionRunner(healthGetCertificate));

health
  .command(`get-db`)
  .description(
    `Check the Appwrite database servers are up and connection is successful.`,
  )
  .action(actionRunner(healthGetDB));

health
  .command(`get-pub-sub`)
  .description(
    `Check the Appwrite pub-sub servers are up and connection is successful.`,
  )
  .action(actionRunner(healthGetPubSub));

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
  .action(actionRunner(healthGetQueueBuilds));

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
  .action(actionRunner(healthGetQueueCertificates));

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
  .action(actionRunner(healthGetQueueDatabases));

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
  .action(actionRunner(healthGetQueueDeletes));

health
  .command(`get-failed-jobs`)
  .description(`Returns the amount of failed jobs in a given queue. `)
  .requiredOption(`--name <name>`, `The name of the queue`)
  .option(
    `--threshold <threshold>`,
    `Queue size threshold. When hit (equal or higher), endpoint returns server error. Default value is 5000.`,
    parseInteger,
  )
  .action(actionRunner(healthGetFailedJobs));

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
  .action(actionRunner(healthGetQueueFunctions));

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
  .action(actionRunner(healthGetQueueLogs));

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
  .action(actionRunner(healthGetQueueMails));

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
  .action(actionRunner(healthGetQueueMessaging));

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
  .action(actionRunner(healthGetQueueMigrations));

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
  .action(actionRunner(healthGetQueueStatsResources));

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
  .action(actionRunner(healthGetQueueUsage));

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
  .action(actionRunner(healthGetQueueWebhooks));

health
  .command(`get-storage`)
  .description(
    `Check the Appwrite storage device is up and connection is successful.`,
  )
  .action(actionRunner(healthGetStorage));

health
  .command(`get-storage-local`)
  .description(
    `Check the Appwrite local storage device is up and connection is successful.`,
  )
  .action(actionRunner(healthGetStorageLocal));

health
  .command(`get-time`)
  .description(
    `Check the Appwrite server time is synced with Google remote NTP server. We use this technology to smoothly handle leap seconds with no disruptive events. The [Network Time Protocol](https://en.wikipedia.org/wiki/Network_Time_Protocol) (NTP) is used by hundreds of millions of computers and devices to synchronize their clocks over the Internet. If your computer sets its own clock, it likely uses NTP.`,
  )
  .action(actionRunner(healthGetTime));
