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
  parseJsonObject,
} from "../../parser.js";
import { Compute } from "@appwrite.io/console";

let computeClient: Compute | null = null;

const getComputeClient = async (): Promise<Compute> => {
  if (!computeClient) {
    const sdkClient = await sdkForProject();
    computeClient = new Compute(sdkClient);
  }
  return computeClient;
};

export const compute = new Command("compute")
  .description(commandDescriptions["compute"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

const computeListDatabasesCommand = compute
  .command(`list-databases`)
  .description(`    List all dedicated databases. Results support pagination.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings.`)
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
        parse(await (await getComputeClient()).listDatabases(buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }))),
    ),
  );


const computeCreateDatabaseCommand = compute
  .command(`create-database`)
  .description(`    Create a new dedicated database with the chosen engine and configuration. Status will be 'provisioning' until the database is ready.`)
  .requiredOption(`--database-id <database-id>`, `Database ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Database display name. Max length: 128 chars.`)
  .option(`--engine <engine>`, `Database engine: postgres, mysql, mariadb, or mongodb.`)
  .option(`--version <version>`, `Database engine version. Defaults to latest for selected engine.`)
  .option(`--region <region>`, `Region identifier. Use one of the enabled region codes (e.g., fra, nyc, syd).`)
  .option(`--type <type>`, `Database type: shared (serverless) or dedicated (always-on).`)
  .option(`--specification <specification>`, `Specification identifier.`)
  .option(`--backend <backend>`, `Database backend provider: prisma, or edge.`)
  .option(`--cpu <cpu>`, `CPU in millicores (125-16000).`, parseInteger)
  .option(`--memory <memory>`, `Memory in MB to allocate (128-65536).`, parseInteger)
  .option(`--storage <storage>`, `Storage in GB to allocate (1-16384).`, parseInteger)
  .option(`--storage-class <storage-class>`, `Storage class: ssd, nvme, or hdd.`)
  .option(`--storage-max-gb <storage-max-gb>`, `Maximum storage limit in GB. 0 uses system default.`, parseInteger)
  .option(
    `--high-availability [value]`,
    `Enable high availability.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--high-availability-replica-count <high-availability-replica-count>`, `Number of high availability replicas (0-5).`, parseInteger)
  .option(`--high-availability-sync-mode <high-availability-sync-mode>`, `Replication sync mode. Allowed values: async, sync, quorum.`)
  .option(`--network-max-connections <network-max-connections>`, `Maximum concurrent connections.`, parseInteger)
  .option(`--network-idle-timeout-seconds <network-idle-timeout-seconds>`, `Connection idle timeout in seconds.`, parseInteger)
  .option(`--network-ip-allowlist [network-ip-allowlist...]`, `IP addresses/CIDR ranges allowed to connect.`)
  .option(`--idle-timeout-minutes <idle-timeout-minutes>`, `Minutes of inactivity before container scales to zero.`, parseInteger)
  .option(
    `--backup-enabled [value]`,
    `Enable automatic backups.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--backup-pitr [value]`,
    `Enable point-in-time recovery.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--backup-cron <backup-cron>`, `Backup schedule in cron format.`)
  .option(`--backup-retention-days <backup-retention-days>`, `Number of days to retain backups.`, parseInteger)
  .option(`--pitr-retention-days <pitr-retention-days>`, `Number of days to retain PITR data.`, parseInteger)
  .option(
    `--storage-autoscaling [value]`,
    `Enable automatic storage expansion when usage exceeds threshold.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--storage-autoscaling-threshold-percent <storage-autoscaling-threshold-percent>`, `Storage usage percentage (50-95) that triggers automatic expansion.`, parseInteger)
  .option(`--storage-autoscaling-max-gb <storage-autoscaling-max-gb>`, `Maximum storage size in GB for autoscaling. 0 means no limit.`, parseInteger)
  .option(
    `--metrics-enabled [value]`,
    `Enable metrics collection.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--pooler-enabled [value]`,
    `Enable connection pooler on provision.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, name, engine, version, region, type, specification, backend, cpu, memory, storage, storageClass, storageMaxGb, highAvailability, highAvailabilityReplicaCount, highAvailabilitySyncMode, networkMaxConnections, networkIdleTimeoutSeconds, networkIpAllowlist, idleTimeoutMinutes, backupEnabled, backupPitr, backupCron, backupRetentionDays, pitrRetentionDays, storageAutoscaling, storageAutoscalingThresholdPercent, storageAutoscalingMaxGb, metricsEnabled, poolerEnabled }) =>
        parse(await (await getComputeClient()).createDatabase(databaseId, name, engine, version, region, type, specification, backend, cpu, memory, storage, storageClass, storageMaxGb, highAvailability, highAvailabilityReplicaCount, highAvailabilitySyncMode, networkMaxConnections, networkIdleTimeoutSeconds, networkIpAllowlist, idleTimeoutMinutes, backupEnabled, backupPitr, backupCron, backupRetentionDays, pitrRetentionDays, storageAutoscaling, storageAutoscalingThresholdPercent, storageAutoscalingMaxGb, metricsEnabled, poolerEnabled)),
    ),
  );


const computeGetDatabaseCommand = compute
  .command(`get-database`)
  .description(`    Get a dedicated database by its unique ID. Returns the database configuration and current status.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getComputeClient()).getDatabase(databaseId)),
    ),
  );


const computeUpdateDatabaseCommand = compute
  .command(`update-database`)
  .description(`    Update a dedicated database configuration. All changes are applied with zero downtime. Resource changes (cpu, memory) are handled via rolling cutover. Storage expansion is done online. All other settings are applied in-place.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--name <name>`, `Database display name.`)
  .option(`--status <status>`, `Database status. Allowed values: ready, paused, inactive. Set to "paused" to pause, "ready" to resume, or "inactive" to spin down a shared database.`)
  .option(`--specification <specification>`, `Specification. Changes cpu, memory, and type based on specification config.`)
  .option(`--cpu <cpu>`, `CPU cores to allocate (125-16000).`, parseInteger)
  .option(`--memory <memory>`, `Memory in MB to allocate (128-65536).`, parseInteger)
  .option(`--storage <storage>`, `Storage in GB to allocate (1-16384).`, parseInteger)
  .option(`--storage-class <storage-class>`, `Storage class. Allowed values: ssd, nvme, hdd.`)
  .option(
    `--high-availability [value]`,
    `Enable high availability.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--high-availability-replica-count <high-availability-replica-count>`, `Number of high availability replicas (0-5).`, parseInteger)
  .option(`--network-max-connections <network-max-connections>`, `Maximum concurrent connections.`, parseInteger)
  .option(`--network-idle-timeout-seconds <network-idle-timeout-seconds>`, `Connection idle timeout in seconds (60-86400).`, parseInteger)
  .option(`--network-ip-allowlist [network-ip-allowlist...]`, `IP addresses/CIDR ranges allowed to connect.`)
  .option(`--idle-timeout-minutes <idle-timeout-minutes>`, `Minutes before container scales to zero.`, parseInteger)
  .option(
    `--backup-enabled [value]`,
    `Enable automatic backups.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--backup-pitr [value]`,
    `Enable point-in-time recovery.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--backup-cron <backup-cron>`, `Backup schedule in cron format.`)
  .option(`--backup-retention-days <backup-retention-days>`, `Days to retain backups.`, parseInteger)
  .option(`--pitr-retention-days <pitr-retention-days>`, `Days to retain PITR data.`, parseInteger)
  .option(
    `--storage-autoscaling [value]`,
    `Enable automatic storage expansion when usage exceeds threshold.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--storage-autoscaling-threshold-percent <storage-autoscaling-threshold-percent>`, `Storage usage percentage (50-95) that triggers automatic expansion.`, parseInteger)
  .option(`--storage-autoscaling-max-gb <storage-autoscaling-max-gb>`, `Maximum storage size in GB for autoscaling. 0 means no limit.`, parseInteger)
  .option(
    `--pooler-enabled [value]`,
    `Attach or detach the connection pooler sidecar. Set to true to add the sidecar (no-op if already attached) or false to remove it.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(
    `--metrics-enabled [value]`,
    `Enable or disable the metrics-agent sidecar.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--metrics-trace-sample-rate <metrics-trace-sample-rate>`, `Fraction of queries to trace (0.0–1.0). Forwarded to the sidecar.`, parseInteger)
  .option(`--metrics-slow-query-log-threshold-ms <metrics-slow-query-log-threshold-ms>`, `Threshold in ms above which queries are logged as slow. Forwarded to the sidecar.`, parseInteger)
  .option(
    `--sql-api-enabled [value]`,
    `Enable the SQL API sidecar for this database.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--sql-api-allowed-statements [sql-api-allowed-statements...]`, `Statement types the SQL API accepts. Allowed values: SELECT, INSERT, UPDATE, DELETE.`)
  .option(`--sql-api-max-rows <sql-api-max-rows>`, `Maximum rows returned per SQL API execution (1-1000000).`, parseInteger)
  .option(`--sql-api-max-bytes <sql-api-max-bytes>`, `Maximum serialised SQL API result payload in bytes (1024-104857600).`, parseInteger)
  .option(`--sql-api-timeout-seconds <sql-api-timeout-seconds>`, `Per-call SQL API execution timeout in seconds (1-300).`, parseInteger)
  .action(
    actionRunner(
      async ({ databaseId, name, status, specification, cpu, memory, storage, storageClass, highAvailability, highAvailabilityReplicaCount, networkMaxConnections, networkIdleTimeoutSeconds, networkIpAllowlist, idleTimeoutMinutes, backupEnabled, backupPitr, backupCron, backupRetentionDays, pitrRetentionDays, storageAutoscaling, storageAutoscalingThresholdPercent, storageAutoscalingMaxGb, poolerEnabled, metricsEnabled, metricsTraceSampleRate, metricsSlowQueryLogThresholdMs, sqlApiEnabled, sqlApiAllowedStatements, sqlApiMaxRows, sqlApiMaxBytes, sqlApiTimeoutSeconds }) =>
        parse(await (await getComputeClient()).updateDatabase(databaseId, name, status, specification, cpu, memory, storage, storageClass, highAvailability, highAvailabilityReplicaCount, networkMaxConnections, networkIdleTimeoutSeconds, networkIpAllowlist, idleTimeoutMinutes, backupEnabled, backupPitr, backupCron, backupRetentionDays, pitrRetentionDays, storageAutoscaling, storageAutoscalingThresholdPercent, storageAutoscalingMaxGb, poolerEnabled, metricsEnabled, metricsTraceSampleRate, metricsSlowQueryLogThresholdMs, sqlApiEnabled, sqlApiAllowedStatements, sqlApiMaxRows, sqlApiMaxBytes, sqlApiTimeoutSeconds)),
    ),
  );


const computeDeleteDatabaseCommand = compute
  .command(`delete-database`)
  .description(`    Delete a dedicated database. This action is irreversible. The database status will be set to 'deleting' and all resources will be cleaned up.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getComputeClient()).deleteDatabase(databaseId)),
    ),
  );


const computeListDatabaseBackupsCommand = compute
  .command(`list-database-backups`)
  .description(`    List all backups for a dedicated database. Results can be filtered by status and type.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--queries [queries...]`, `Raw Appwrite JSON query strings (legacy). Use this for advanced queries or automation; for common filtering, sorting, and pagination prefer --filter, --sort-asc, --sort-desc, --limit, and --offset. When mixed, raw --queries are sent before generated flag queries. Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: status, type, databaseId`)
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
      async ({ databaseId, queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }) =>
        parse(await (await getComputeClient()).listDatabaseBackups(databaseId, buildQueries({ queries, filter, where, sortAsc, sortDesc, cursorAfter, cursorBefore, limit, offset }))),
    ),
  );


const computeCreateDatabaseBackupCommand = compute
  .command(`create-database-backup`)
  .description(`    Create a manual backup of a dedicated database. The backup will be created asynchronously and its status can be checked via the get backup endpoint.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--type <type>`, `Backup type: full or incremental.`)
  .action(
    actionRunner(
      async ({ databaseId, type }) =>
        parse(await (await getComputeClient()).createDatabaseBackup(databaseId, type)),
    ),
  );


const computeUpdateDatabaseBackupStorageCommand = compute
  .command(`update-database-backup-storage`)
  .description(`    Configure off-cluster backup storage for a dedicated database. Supports S3, GCS, and Azure Blob Storage destinations. Backups will be stored to the configured destination in addition to on-cluster storage.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--provider <provider>`, `Storage provider for off-cluster backups. Allowed values: s3 (Amazon S3 or S3-compatible), gcs (Google Cloud Storage), azure (Azure Blob Storage).`)
  .requiredOption(`--bucket <bucket>`, `Storage bucket or container name.`)
  .requiredOption(`--access-key <access-key>`, `Access key or client ID for authentication.`)
  .requiredOption(`--secret-key <secret-key>`, `Secret key or service account JSON for authentication.`)
  .option(`--region <region>`, `Storage region.`)
  .option(`--prefix <prefix>`, `Object key prefix for backups.`)
  .option(`--endpoint <endpoint>`, `Custom endpoint for S3-compatible storage (e.g. MinIO).`)
  .action(
    actionRunner(
      async ({ databaseId, provider, bucket, accessKey, secretKey, region, prefix, endpoint }) =>
        parse(await (await getComputeClient()).updateDatabaseBackupStorage(databaseId, provider, bucket, accessKey, secretKey, region, prefix, endpoint)),
    ),
  );


const computeGetDatabaseBackupCommand = compute
  .command(`get-database-backup`)
  .description(`    Get details of a specific database backup including its status, size, and timestamps.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--backup-id <backup-id>`, `Backup ID.`)
  .action(
    actionRunner(
      async ({ databaseId, backupId }) =>
        parse(await (await getComputeClient()).getDatabaseBackup(databaseId, backupId)),
    ),
  );


const computeDeleteDatabaseBackupCommand = compute
  .command(`delete-database-backup`)
  .description(`    Delete a database backup. This will permanently remove the backup from storage and cannot be undone.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--backup-id <backup-id>`, `Backup ID.`)
  .action(
    actionRunner(
      async ({ databaseId, backupId }) =>
        parse(await (await getComputeClient()).deleteDatabaseBackup(databaseId, backupId)),
    ),
  );


const computeListDatabaseBranchesCommand = compute
  .command(`list-database-branches`)
  .description(`    List all ephemeral branches for a dedicated database. Returns branch metadata including ID, name, namespace, and expiration time.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getComputeClient()).listDatabaseBranches(databaseId)),
    ),
  );


const computeCreateDatabaseBranchCommand = compute
  .command(`create-database-branch`)
  .description(`    Create an ephemeral database branch from the primary via PVC snapshot. The branch is a full copy of the database at the current point in time, useful for testing schema migrations or running experiments without affecting production data. Branches expire after the configured TTL (default 24 hours). The branch is created asynchronously.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--branch-id <branch-id>`, `Branch ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .option(`--ttl <ttl>`, `Time-to-live in seconds before the branch expires. Min 300 (5 min), max 604800 (7 days). Default: 86400 (24h).`, parseInteger)
  .action(
    actionRunner(
      async ({ databaseId, branchId, ttl }) =>
        parse(await (await getComputeClient()).createDatabaseBranch(databaseId, branchId, ttl)),
    ),
  );


const computeDeleteDatabaseBranchCommand = compute
  .command(`delete-database-branch`)
  .description(`    Delete an ephemeral database branch. This removes the branch namespace, its PVC, and the associated VolumeSnapshot. The deletion runs asynchronously and is irreversible.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--branch-id <branch-id>`, `Branch ID.`)
  .action(
    actionRunner(
      async ({ databaseId, branchId }) =>
        parse(await (await getComputeClient()).deleteDatabaseBranch(databaseId, branchId)),
    ),
  );


const computeListDatabaseConnectionsCommand = compute
  .command(`list-database-connections`)
  .description(`    List all database connection users/roles for a dedicated database.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getComputeClient()).listDatabaseConnections(databaseId)),
    ),
  );


const computeCreateDatabaseConnectionCommand = compute
  .command(`create-database-connection`)
  .description(`    Create a new database connection user/role. Returns the connection details including the generated credentials.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--username <username>`, `Connection username.`)
  .option(`--role <role>`, `Connection role for the new user. Common values: readonly (read-only access), readwrite (full read and write access).`)
  .action(
    actionRunner(
      async ({ databaseId, username, role }) =>
        parse(await (await getComputeClient()).createDatabaseConnection(databaseId, username, role)),
    ),
  );


const computeDeleteDatabaseConnectionCommand = compute
  .command(`delete-database-connection`)
  .description(`    Delete a database connection user/role. The connection will be terminated immediately.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--connection-id <connection-id>`, `Connection ID.`)
  .action(
    actionRunner(
      async ({ databaseId, connectionId }) =>
        parse(await (await getComputeClient()).deleteDatabaseConnection(databaseId, connectionId)),
    ),
  );


const computeGetDatabaseCredentialsCommand = compute
  .command(`get-database-credentials`)
  .description(`    Get connection credentials for a dedicated database. Returns the hostname, port, username, password, database name, and full connection string.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getComputeClient()).getDatabaseCredentials(databaseId)),
    ),
  );


const computeUpdateDatabaseCredentialsCommand = compute
  .command(`update-database-credentials`)
  .description(`    Rotate the primary credentials for a dedicated database. Generates a new password and updates the database. Previous credentials will stop working immediately.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getComputeClient()).updateDatabaseCredentials(databaseId)),
    ),
  );


const computeCreateDatabaseExecutionCommand = compute
  .command(`create-database-execution`)
  .description(`Execute SQL through the console-facing Cloud endpoint. Cloud proxies through the edge platform to the per-database SQL API sidecar. Application traffic should bypass cloud entirely and POST directly to the per-database hostname: \`https://db-{project}-{db}.{region}.appwrite.network/v1/sql/execute\` with an \`X-Appwrite-Key\` header — that path scales to the whole DB fleet without a per-query cloud round-trip. The statement type must be on the database's configured allow-list. Use bound parameters for any user-supplied values — the API does not interpolate raw strings.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--sql <sql>`, `SQL statement to execute. Exactly one statement per request.`)
  .option(`--bindings <bindings>`, `Optional bound parameters. Pass either a positional list or a name => value map matching the placeholder style used in the SQL.`)
  .option(`--timeout-seconds <timeout-seconds>`, `Per-call execution timeout override. Must be less than or equal to the database's configured sqlApiTimeoutSeconds.`, parseInteger)
  .action(
    actionRunner(
      async ({ databaseId, sql, bindings, timeoutSeconds }) =>
        parse(await (await getComputeClient()).createDatabaseExecution(databaseId, sql, parseJsonObject(bindings, "--bindings"), timeoutSeconds)),
    ),
  );


const computeCreateDatabaseQueryExplanationCommand = compute
  .command(`create-database-query-explanation`)
  .description(`    Run EXPLAIN on a query against a dedicated database. Available for SQL-compatible engines. Returns the query execution plan including scan types, estimated cost, and resource usage. Optionally run EXPLAIN ANALYZE to get actual execution statistics.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--query <query>`, `Query to explain. Must be a valid query for the database engine.`)
  .option(
    `--analyze [value]`,
    `Run EXPLAIN ANALYZE to get actual execution statistics. This executes the query.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ databaseId, query, analyze }) =>
        parse(await (await getComputeClient()).createDatabaseQueryExplanation(databaseId, query, analyze)),
    ),
  );


const computeListDatabaseExtensionsCommand = compute
  .command(`list-database-extensions`)
  .description(`    List installed and available extensions for a PostgreSQL database.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getComputeClient()).listDatabaseExtensions(databaseId)),
    ),
  );


const computeCreateDatabaseExtensionCommand = compute
  .command(`create-database-extension`)
  .description(`    Install a database extension. Only available for PostgreSQL databases. The install runs asynchronously; poll the extensions list endpoint for status.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--name <name>`, `Extension name (e.g., pgvector, postgis, uuid-ossp).`)
  .action(
    actionRunner(
      async ({ databaseId, name }) =>
        parse(await (await getComputeClient()).createDatabaseExtension(databaseId, name)),
    ),
  );


const computeDeleteDatabaseExtensionCommand = compute
  .command(`delete-database-extension`)
  .description(`    Uninstall a database extension from a PostgreSQL database. The uninstall runs asynchronously; poll the extensions list endpoint for status.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--extension-name <extension-name>`, `Extension name to uninstall.`)
  .action(
    actionRunner(
      async ({ databaseId, extensionName }) =>
        parse(await (await getComputeClient()).deleteDatabaseExtension(databaseId, extensionName)),
    ),
  );


const computeGetDatabaseHAStatusCommand = compute
  .command(`get-database-ha-status`)
  .description(`    Get high availability status for a dedicated database. Returns replica statuses, replication lag, and sync mode.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getComputeClient()).getDatabaseHAStatus(databaseId)),
    ),
  );


const computeCreateDatabaseFailoverCommand = compute
  .command(`create-database-failover`)
  .description(`    Trigger a manual failover for a dedicated database with high availability enabled. Promotes a replica to primary. The failover runs asynchronously; poll the database document for status updates.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--target-replica-id <target-replica-id>`, `Target replica ID to promote. If not specified, the healthiest replica is selected.`)
  .action(
    actionRunner(
      async ({ databaseId, targetReplicaId }) =>
        parse(await (await getComputeClient()).createDatabaseFailover(databaseId, targetReplicaId)),
    ),
  );


const computeGetDatabaseInsightsCommand = compute
  .command(`get-database-insights`)
  .description(`    Get query-level performance insights for a dedicated database. Returns top queries by execution time, wait events, and aggregate query statistics.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--period <period>`, `Analysis period for performance insights. Allowed values: 1h (last hour), 24h (last 24 hours), 7d (last 7 days).`)
  .option(`--limit <limit>`, `Maximum number of queries to return.`, parseInteger)
  .action(
    actionRunner(
      async ({ databaseId, period, limit }) =>
        parse(await (await getComputeClient()).getDatabaseInsights(databaseId, period, limit)),
    ),
  );


const computeListDatabaseLogsCommand = compute
  .command(`list-database-logs`)
  .description(`    List audit logs for a dedicated database. Returns DDL operations and security-relevant events.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--start-time <start-time>`, `Start time in ISO 8601 format.`)
  .option(`--end-time <end-time>`, `End time in ISO 8601 format.`)
  .option(`--limit <limit>`, `Maximum number of logs to return.`, parseInteger)
  .action(
    actionRunner(
      async ({ databaseId, startTime, endTime, limit }) =>
        parse(await (await getComputeClient()).listDatabaseLogs(databaseId, startTime, endTime, limit)),
    ),
  );


const computeUpdateDatabaseMaintenanceWindowCommand = compute
  .command(`update-database-maintenance-window`)
  .description(`    Update the maintenance window for a dedicated database. Maintenance operations like minor version upgrades will be performed during this window.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--day <day>`, `Day of the week for the maintenance window. Allowed values: sun, mon, tue, wed, thu, fri, sat.`)
  .requiredOption(`--hour-utc <hour-utc>`, `Hour in UTC (0-23) for maintenance window start.`, parseInteger)
  .action(
    actionRunner(
      async ({ databaseId, day, hourUtc }) =>
        parse(await (await getComputeClient()).updateDatabaseMaintenanceWindow(databaseId, day, hourUtc)),
    ),
  );


const computeGetDatabaseMetricsCommand = compute
  .command(`get-database-metrics`)
  .description(`    Get detailed performance metrics for a dedicated database. Returns CPU, memory, storage, IOPS, QPS, and connection metrics.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--period <period>`, `Metrics aggregation period. Allowed values: 1h (last hour), 24h (last 24 hours), 7d (last 7 days), 30d (last 30 days).`)
  .action(
    actionRunner(
      async ({ databaseId, period }) =>
        parse(await (await getComputeClient()).getDatabaseMetrics(databaseId, period)),
    ),
  );


const computeCreateDatabaseMigrationCommand = compute
  .command(`create-database-migration`)
  .description(`    Migrate a database between shared and dedicated types. Shared to dedicated creates an always-on StatefulSet with external access. Dedicated to shared converts to a serverless pod that scales to zero when idle. Data is preserved during migration.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--target-type <target-type>`, `Target database type to migrate to. Allowed values: shared (serverless, scales to zero when idle), dedicated (always-on with persistent resources).`)
  .action(
    actionRunner(
      async ({ databaseId, targetType }) =>
        parse(await (await getComputeClient()).createDatabaseMigration(databaseId, targetType)),
    ),
  );


const computeGetDatabasePITRWindowsCommand = compute
  .command(`get-database-pitr-windows`)
  .description(`    Get available point-in-time recovery windows for a dedicated database. Returns the earliest and latest recovery points.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getComputeClient()).getDatabasePITRWindows(databaseId)),
    ),
  );


const computeGetDatabasePoolerCommand = compute
  .command(`get-database-pooler`)
  .description(`    Get the connection pooler configuration for a dedicated database. Returns pooler mode, max connections, and pool size settings.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getComputeClient()).getDatabasePooler(databaseId)),
    ),
  );


const computeUpdateDatabasePoolerCommand = compute
  .command(`update-database-pooler`)
  .description(`    Update the connection pooler configuration for a dedicated database. Configure pool mode, max connections, and pool sizes.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--mode <mode>`, `Connection pool mode. Allowed values: transaction, session. Transaction mode returns connections to the pool after each transaction; session mode holds connections for the entire session lifetime.`)
  .option(`--max-connections <max-connections>`, `Maximum pooled connections.`, parseInteger)
  .option(`--default-pool-size <default-pool-size>`, `Default pool size per user.`, parseInteger)
  .option(
    `--read-write-splitting [value]`,
    `Route SELECTs to HA replicas, writes and locked reads to the primary. Defaults to true when HA is enabled.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .option(`--pooler-cpu-request <pooler-cpu-request>`, `Pooler sidecar CPU request override (Kubernetes quantity, e.g. "250m" or "1"). Leave null for the proportional default (5% of DB CPU, floor 100m).`)
  .option(`--pooler-cpu-limit <pooler-cpu-limit>`, `Pooler sidecar CPU limit override (Kubernetes quantity, e.g. "500m" or "1"). Leave null for the proportional default (10% of DB CPU, floor 200m). Changing this field rolls the database pod.`)
  .option(`--pooler-memory-request <pooler-memory-request>`, `Pooler sidecar memory request override (Kubernetes quantity, e.g. "128Mi" or "1Gi"). Leave null for the proportional default (7.5% of DB memory, floor 64Mi).`)
  .option(`--pooler-memory-limit <pooler-memory-limit>`, `Pooler sidecar memory limit override (Kubernetes quantity, e.g. "256Mi" or "1Gi"). Leave null for the proportional default (15% of DB memory, floor 128Mi). Changing this field rolls the database pod.`)
  .action(
    actionRunner(
      async ({ databaseId, mode, maxConnections, defaultPoolSize, readWriteSplitting, poolerCpuRequest, poolerCpuLimit, poolerMemoryRequest, poolerMemoryLimit }) =>
        parse(await (await getComputeClient()).updateDatabasePooler(databaseId, mode, maxConnections, defaultPoolSize, readWriteSplitting, poolerCpuRequest, poolerCpuLimit, poolerMemoryRequest, poolerMemoryLimit)),
    ),
  );


const computeListDatabaseRestorationsCommand = compute
  .command(`list-database-restorations`)
  .description(`    List all restorations for a dedicated database. Results can be filtered by status and type.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--status <status>`, `Filter by restoration status.`)
  .option(`--type <type>`, `Filter by restoration type.`)
  .option(`--limit <limit>`, `Maximum number of restorations to return.`, parseInteger)
  .option(`--offset <offset>`, `Number of restorations to skip.`, parseInteger)
  .action(
    actionRunner(
      async ({ databaseId, status, type, limit, offset }) =>
        parse(await (await getComputeClient()).listDatabaseRestorations(databaseId, status, type, limit, offset)),
    ),
  );


const computeCreateDatabaseRestorationCommand = compute
  .command(`create-database-restoration`)
  .description(`    Restore a database from a backup or to a specific point in time (PITR). For backup restoration, provide a backupId. For PITR, provide a targetTime. PITR requires the database to have PITR enabled and is only available for enterprise databases.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--type <type>`, `Restoration type. Allowed values: backup, pitr. Use "backup" to restore from a specific backup, or "pitr" for point-in-time recovery.`)
  .option(`--backup-id <backup-id>`, `Backup ID to restore from (required for backup type).`)
  .option(`--target-time <target-time>`, `Target time for PITR as Unix timestamp (required for pitr type).`, parseInteger)
  .action(
    actionRunner(
      async ({ databaseId, type, backupId, targetTime }) =>
        parse(await (await getComputeClient()).createDatabaseRestoration(databaseId, type, backupId, targetTime)),
    ),
  );


const computeGetDatabaseRestorationCommand = compute
  .command(`get-database-restoration`)
  .description(`    Get details of a specific database restoration including its status, type, and timestamps.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--restoration-id <restoration-id>`, `Restoration ID.`)
  .action(
    actionRunner(
      async ({ databaseId, restorationId }) =>
        parse(await (await getComputeClient()).getDatabaseRestoration(databaseId, restorationId)),
    ),
  );


const computeGetDatabaseSchemaCommand = compute
  .command(`get-database-schema`)
  .description(`    Get the current schema for a dedicated database. Returns collections, fields, data types, constraints, and indexes.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getComputeClient()).getDatabaseSchema(databaseId)),
    ),
  );


const computeCreateDatabaseSchemaPreviewCommand = compute
  .command(`create-database-schema-preview`)
  .description(`    Preview a schema change against a dedicated database. Returns the expected impact including affected collections, records, and a dry-run diff of the schema before and after the change.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--sql <sql>`, `Schema statement to preview.`)
  .action(
    actionRunner(
      async ({ databaseId, sql }) =>
        parse(await (await getComputeClient()).createDatabaseSchemaPreview(databaseId, sql)),
    ),
  );


const computeListDatabaseQueriesCommand = compute
  .command(`list-database-queries`)
  .description(`    List slow queries for a dedicated database. Returns queries that exceeded the specified threshold.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--limit <limit>`, `Maximum number of queries to return.`, parseInteger)
  .option(`--threshold-ms <threshold-ms>`, `Minimum query duration in milliseconds.`, parseInteger)
  .action(
    actionRunner(
      async ({ databaseId, limit, thresholdMs }) =>
        parse(await (await getComputeClient()).listDatabaseQueries(databaseId, limit, thresholdMs)),
    ),
  );


const computeGetDatabaseStatusCommand = compute
  .command(`get-database-status`)
  .description(`    Get real-time health and status information for a dedicated database. Returns health status, readiness, uptime, connection info, replica status, and volume information.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .action(
    actionRunner(
      async ({ databaseId }) =>
        parse(await (await getComputeClient()).getDatabaseStatus(databaseId)),
    ),
  );


const computeCreateDatabaseUpgradeCommand = compute
  .command(`create-database-upgrade`)
  .description(`    Upgrade a dedicated database to a new engine version. Uses blue-green deployment for zero-downtime cutover.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .requiredOption(`--target-version <target-version>`, `Target engine version to upgrade to.`)
  .action(
    actionRunner(
      async ({ databaseId, targetVersion }) =>
        parse(await (await getComputeClient()).createDatabaseUpgrade(databaseId, targetVersion)),
    ),
  );


const computeGetDatabaseUsageCommand = compute
  .command(`get-database-usage`)
  .description(`    Get usage metrics for a dedicated database including CPU, memory, storage, connections, and query statistics.`)
  .requiredOption(`--database-id <database-id>`, `Database ID.`)
  .option(`--range <range>`, `Date range.`)
  .action(
    actionRunner(
      async ({ databaseId, range }) =>
        parse(await (await getComputeClient()).getDatabaseUsage(databaseId, range)),
    ),
  );


