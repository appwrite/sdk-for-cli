package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v7/postgresql"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewPostgresqlCommand builds the `postgresql` command tree.
func NewPostgresqlCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "postgresql",
		Short: "",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			return cmd.Help()
		},
	}

	cmd.AddCommand(newPostgresqlListCommand())
	cmd.AddCommand(newPostgresqlCreateCommand())
	cmd.AddCommand(newPostgresqlListSpecificationsCommand())
	cmd.AddCommand(newPostgresqlGetCommand())
	cmd.AddCommand(newPostgresqlUpdateCommand())
	cmd.AddCommand(newPostgresqlDeleteCommand())
	cmd.AddCommand(newPostgresqlListBackupsCommand())
	cmd.AddCommand(newPostgresqlCreateBackupCommand())
	cmd.AddCommand(newPostgresqlListBackupPoliciesCommand())
	cmd.AddCommand(newPostgresqlCreateBackupPolicyCommand())
	cmd.AddCommand(newPostgresqlGetBackupPolicyCommand())
	cmd.AddCommand(newPostgresqlUpdateBackupPolicyCommand())
	cmd.AddCommand(newPostgresqlDeleteBackupPolicyCommand())
	cmd.AddCommand(newPostgresqlUpdateBackupStorageCommand())
	cmd.AddCommand(newPostgresqlGetBackupCommand())
	cmd.AddCommand(newPostgresqlDeleteBackupCommand())
	cmd.AddCommand(newPostgresqlListBranchesCommand())
	cmd.AddCommand(newPostgresqlCreateBranchCommand())
	cmd.AddCommand(newPostgresqlDeleteBranchCommand())
	cmd.AddCommand(newPostgresqlUpdateCredentialsCommand())
	cmd.AddCommand(newPostgresqlCreateExecutionCommand())
	cmd.AddCommand(newPostgresqlListExtensionsCommand())
	cmd.AddCommand(newPostgresqlCreateExtensionCommand())
	cmd.AddCommand(newPostgresqlDeleteExtensionCommand())
	cmd.AddCommand(newPostgresqlCreateFailoverCommand())
	cmd.AddCommand(newPostgresqlUpdateMaintenanceCommand())
	cmd.AddCommand(newPostgresqlCreateMigrationCommand())
	cmd.AddCommand(newPostgresqlListOperationsCommand())
	cmd.AddCommand(newPostgresqlGetPitrCommand())
	cmd.AddCommand(newPostgresqlGetPoolerCommand())
	cmd.AddCommand(newPostgresqlUpdatePoolerCommand())
	cmd.AddCommand(newPostgresqlGetReplicasCommand())
	cmd.AddCommand(newPostgresqlListRestorationsCommand())
	cmd.AddCommand(newPostgresqlCreateRestorationCommand())
	cmd.AddCommand(newPostgresqlGetRestorationCommand())
	cmd.AddCommand(newPostgresqlGetStatusCommand())
	cmd.AddCommand(newPostgresqlCreateUpgradeCommand())

	return cmd
}

func newPostgresqlListCommand() *cobra.Command {
	var queries []string
	var filter []string
	var where []string
	var sortAsc []string
	var sortDesc []string
	var limit int
	var offset int
	var cursorAfter string
	var cursorBefore string

	cmd := &cobra.Command{
		Use:   "list",
		Short: "List all dedicated databases. Results support pagination.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			parsedFilter, err := query.ParseFilters(filter)
			if err != nil {
				return err
			}
			parsedWhere, err := query.ParseFilters(where)
			if err != nil {
				return err
			}

			queries, err := query.Build(query.Options{
				Queries:      queries,
				Filter:       parsedFilter,
				Where:        parsedWhere,
				SortAsc:      sortAsc,
				SortDesc:     sortDesc,
				Limit:        app.FlagInt(cmd, "limit", limit),
				Offset:       app.FlagInt(cmd, "offset", offset),
				CursorAfter:  app.FlagString(cmd, "cursor-after", cursorAfter),
				CursorBefore: app.FlagString(cmd, "cursor-before", cursorBefore),
			})
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []postgresql.ListOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListQueries(queries))
			}

			result, err := service.List(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings.")
	cmd.Flags().StringArrayVar(&filter, "filter", nil, "Filter using a simple comparison expression. Repeat for multiple filters. Supports field=value, field!=value, field>value, field>=value, field<value, and field<=value.")
	cmd.Flags().StringArrayVar(&where, "where", nil, "Deprecated. Use --filter instead. Filter using a simple comparison expression. Repeat for multiple filters.")
	cmd.Flags().StringArrayVar(&sortAsc, "sort-asc", nil, "Sort results by an attribute in ascending order. Repeat for multiple sort fields.")
	cmd.Flags().StringArrayVar(&sortDesc, "sort-desc", nil, "Sort results by an attribute in descending order. Repeat for multiple sort fields.")
	cmd.Flags().IntVar(&limit, "limit", 0, "Maximum number of results to return.")
	cmd.Flags().IntVar(&offset, "offset", 0, "Number of results to skip.")
	cmd.Flags().StringVar(&cursorAfter, "cursor-after", "", "Return results after this cursor ID.")
	cmd.Flags().StringVar(&cursorBefore, "cursor-before", "", "Return results before this cursor ID.")
	return cmd
}

func newPostgresqlCreateCommand() *cobra.Command {
	var databaseId string
	var name string
	var version string
	var specification string
	var replicas int
	var syncMode string
	var networkIdleTimeoutSeconds int
	var networkIpAllowlist []string
	var idleTimeoutMinutes int
	var pitr bool
	var pitrRetentionDays int
	var storageAutoscaling bool
	var storageAutoscalingThresholdPercent int
	var storageAutoscalingMaxGb int

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create a new dedicated database with the chosen engine and configuration. Status will be 'provisioning' until the database is ready.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []postgresql.CreateOption{}
			if cmd.Flags().Changed("version") {
				options = append(options, service.WithCreateVersion(version))
			}
			if cmd.Flags().Changed("specification") {
				options = append(options, service.WithCreateSpecification(specification))
			}
			if cmd.Flags().Changed("replicas") {
				options = append(options, service.WithCreateReplicas(replicas))
			}
			if cmd.Flags().Changed("sync-mode") {
				options = append(options, service.WithCreateSyncMode(syncMode))
			}
			if cmd.Flags().Changed("network-idle-timeout-seconds") {
				options = append(options, service.WithCreateNetworkIdleTimeoutSeconds(networkIdleTimeoutSeconds))
			}
			if cmd.Flags().Changed("network-ip-allowlist") {
				options = append(options, service.WithCreateNetworkIPAllowlist(networkIpAllowlist))
			}
			if cmd.Flags().Changed("idle-timeout-minutes") {
				options = append(options, service.WithCreateIdleTimeoutMinutes(idleTimeoutMinutes))
			}
			if cmd.Flags().Changed("pitr") {
				options = append(options, service.WithCreatePitr(pitr))
			}
			if cmd.Flags().Changed("pitr-retention-days") {
				options = append(options, service.WithCreatePitrRetentionDays(pitrRetentionDays))
			}
			if cmd.Flags().Changed("storage-autoscaling") {
				options = append(options, service.WithCreateStorageAutoscaling(storageAutoscaling))
			}
			if cmd.Flags().Changed("storage-autoscaling-threshold-percent") {
				options = append(options, service.WithCreateStorageAutoscalingThresholdPercent(storageAutoscalingThresholdPercent))
			}
			if cmd.Flags().Changed("storage-autoscaling-max-gb") {
				options = append(options, service.WithCreateStorageAutoscalingMaxGb(storageAutoscalingMaxGb))
			}

			result, err := service.Create(databaseId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&name, "name", "", "Database display name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&version, "version", "", "Database engine version. Defaults to latest for selected engine.")
	cmd.Flags().StringVar(&specification, "specification", "", "Specification identifier. Drives the allocated CPU, memory, storage, storage class, and connection ceiling.")
	cmd.Flags().IntVar(&replicas, "replicas", 0, "Number of high availability replicas (0-5). High availability is enabled when greater than 0.")
	cmd.Flags().StringVar(&syncMode, "sync-mode", "", "Replication sync mode preference. Allowed values: async, sync, quorum.")
	cmd.Flags().IntVar(&networkIdleTimeoutSeconds, "network-idle-timeout-seconds", 0, "Connection idle timeout in seconds.")
	cmd.Flags().StringArrayVar(&networkIpAllowlist, "network-ip-allowlist", nil, "IP addresses/CIDR ranges allowed to connect.")
	cmd.Flags().IntVar(&idleTimeoutMinutes, "idle-timeout-minutes", 0, "Minutes of inactivity before container scales to zero.")
	cmd.Flags().BoolVar(&pitr, "pitr", false, "Enable point-in-time recovery (PITR). Continuously archives changes so the database can be restored to any moment within the retention window.")
	cmd.Flags().Lookup("pitr").NoOptDefVal = "true"
	cmd.Flags().IntVar(&pitrRetentionDays, "pitr-retention-days", 0, "Number of days to retain PITR data.")
	cmd.Flags().BoolVar(&storageAutoscaling, "storage-autoscaling", false, "Enable automatic storage expansion when usage exceeds threshold.")
	cmd.Flags().Lookup("storage-autoscaling").NoOptDefVal = "true"
	cmd.Flags().IntVar(&storageAutoscalingThresholdPercent, "storage-autoscaling-threshold-percent", 0, "Storage usage percentage (50-95) that triggers automatic expansion.")
	cmd.Flags().IntVar(&storageAutoscalingMaxGb, "storage-autoscaling-max-gb", 0, "Maximum storage size in GB for autoscaling. Defaults to 3 times the specification's storage. 0 means no limit.")
	return cmd
}

func newPostgresqlListSpecificationsCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-specifications",
		Short: "List the dedicated database specifications available on the current plan. Each specification reports its resource limits, its own prices and overage rates, and whether it is enabled for the organization.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.ListSpecifications()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newPostgresqlGetCommand() *cobra.Command {
	var databaseId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a dedicated database by its unique ID. Returns the database configuration and current status.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.Get(databaseId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	return cmd
}

func newPostgresqlUpdateCommand() *cobra.Command {
	var databaseId string
	var name string
	var status string
	var specification string
	var replicas int
	var syncMode string
	var networkIdleTimeoutSeconds int
	var networkIpAllowlist []string
	var idleTimeoutMinutes int
	var pitr bool
	var pitrRetentionDays int
	var storageAutoscaling bool
	var storageAutoscalingThresholdPercent int
	var storageAutoscalingMaxGb int
	var metricsTraceSampleRate float64
	var metricsSlowQueryLogThresholdMs int
	var sqlApiEnabled bool
	var sqlApiAllowedStatements []string
	var sqlApiMaxRows int
	var sqlApiMaxBytes int
	var sqlApiTimeoutSeconds int

	cmd := &cobra.Command{
		Use:   "update",
		Short: "Update a dedicated database configuration. All changes are applied with zero downtime. Specification changes (cpu, memory, storage) are handled via rolling cutover. Storage expansion is done online. All other settings are applied in-place.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []postgresql.UpdateOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateName(name))
			}
			if cmd.Flags().Changed("status") {
				options = append(options, service.WithUpdateStatus(status))
			}
			if cmd.Flags().Changed("specification") {
				options = append(options, service.WithUpdateSpecification(specification))
			}
			if cmd.Flags().Changed("replicas") {
				options = append(options, service.WithUpdateReplicas(replicas))
			}
			if cmd.Flags().Changed("sync-mode") {
				options = append(options, service.WithUpdateSyncMode(syncMode))
			}
			if cmd.Flags().Changed("network-idle-timeout-seconds") {
				options = append(options, service.WithUpdateNetworkIdleTimeoutSeconds(networkIdleTimeoutSeconds))
			}
			if cmd.Flags().Changed("network-ip-allowlist") {
				options = append(options, service.WithUpdateNetworkIPAllowlist(networkIpAllowlist))
			}
			if cmd.Flags().Changed("idle-timeout-minutes") {
				options = append(options, service.WithUpdateIdleTimeoutMinutes(idleTimeoutMinutes))
			}
			if cmd.Flags().Changed("pitr") {
				options = append(options, service.WithUpdatePitr(pitr))
			}
			if cmd.Flags().Changed("pitr-retention-days") {
				options = append(options, service.WithUpdatePitrRetentionDays(pitrRetentionDays))
			}
			if cmd.Flags().Changed("storage-autoscaling") {
				options = append(options, service.WithUpdateStorageAutoscaling(storageAutoscaling))
			}
			if cmd.Flags().Changed("storage-autoscaling-threshold-percent") {
				options = append(options, service.WithUpdateStorageAutoscalingThresholdPercent(storageAutoscalingThresholdPercent))
			}
			if cmd.Flags().Changed("storage-autoscaling-max-gb") {
				options = append(options, service.WithUpdateStorageAutoscalingMaxGb(storageAutoscalingMaxGb))
			}
			if cmd.Flags().Changed("metrics-trace-sample-rate") {
				options = append(options, service.WithUpdateMetricsTraceSampleRate(metricsTraceSampleRate))
			}
			if cmd.Flags().Changed("metrics-slow-query-log-threshold-ms") {
				options = append(options, service.WithUpdateMetricsSlowQueryLogThresholdMs(metricsSlowQueryLogThresholdMs))
			}
			if cmd.Flags().Changed("sql-api-enabled") {
				options = append(options, service.WithUpdateSqlApiEnabled(sqlApiEnabled))
			}
			if cmd.Flags().Changed("sql-api-allowed-statements") {
				options = append(options, service.WithUpdateSqlApiAllowedStatements(sqlApiAllowedStatements))
			}
			if cmd.Flags().Changed("sql-api-max-rows") {
				options = append(options, service.WithUpdateSqlApiMaxRows(sqlApiMaxRows))
			}
			if cmd.Flags().Changed("sql-api-max-bytes") {
				options = append(options, service.WithUpdateSqlApiMaxBytes(sqlApiMaxBytes))
			}
			if cmd.Flags().Changed("sql-api-timeout-seconds") {
				options = append(options, service.WithUpdateSqlApiTimeoutSeconds(sqlApiTimeoutSeconds))
			}

			result, err := service.Update(databaseId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&name, "name", "", "Database display name.")
	cmd.Flags().StringVar(&status, "status", "", "Database status. Allowed values: ready, paused, inactive. Set to \"paused\" to pause, \"ready\" to resume (also recovers a failed database whose infrastructure is healthy), or \"inactive\" to spin down a shared-pool database.")
	cmd.Flags().StringVar(&specification, "specification", "", "Specification. Changes cpu, memory, storage, connection ceiling, and node pool based on specification config. Resource changes are applied via rolling cutover with zero downtime.")
	cmd.Flags().IntVar(&replicas, "replicas", 0, "Number of high availability replicas (0-5). High availability is enabled when greater than 0.")
	cmd.Flags().StringVar(&syncMode, "sync-mode", "", "Replication sync mode preference. Allowed values: async, sync, quorum.")
	cmd.Flags().IntVar(&networkIdleTimeoutSeconds, "network-idle-timeout-seconds", 0, "Connection idle timeout in seconds (60-86400).")
	cmd.Flags().StringArrayVar(&networkIpAllowlist, "network-ip-allowlist", nil, "IP addresses/CIDR ranges allowed to connect.")
	cmd.Flags().IntVar(&idleTimeoutMinutes, "idle-timeout-minutes", 0, "Minutes before container scales to zero.")
	cmd.Flags().BoolVar(&pitr, "pitr", false, "Enable or disable point-in-time recovery (PITR).")
	cmd.Flags().Lookup("pitr").NoOptDefVal = "true"
	cmd.Flags().IntVar(&pitrRetentionDays, "pitr-retention-days", 0, "Days to retain PITR data.")
	cmd.Flags().BoolVar(&storageAutoscaling, "storage-autoscaling", false, "Enable automatic storage expansion when usage exceeds threshold.")
	cmd.Flags().Lookup("storage-autoscaling").NoOptDefVal = "true"
	cmd.Flags().IntVar(&storageAutoscalingThresholdPercent, "storage-autoscaling-threshold-percent", 0, "Storage usage percentage (50-95) that triggers automatic expansion.")
	cmd.Flags().IntVar(&storageAutoscalingMaxGb, "storage-autoscaling-max-gb", 0, "Maximum storage size in GB for autoscaling. 0 means no limit.")
	cmd.Flags().Float64Var(&metricsTraceSampleRate, "metrics-trace-sample-rate", 0, "Fraction of queries to trace (0.0–1.0). Forwarded to the sidecar.")
	cmd.Flags().IntVar(&metricsSlowQueryLogThresholdMs, "metrics-slow-query-log-threshold-ms", 0, "Threshold in ms above which queries are logged as slow. Forwarded to the sidecar.")
	cmd.Flags().BoolVar(&sqlApiEnabled, "sql-api-enabled", false, "Enable the SQL API sidecar for this database.")
	cmd.Flags().Lookup("sql-api-enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&sqlApiAllowedStatements, "sql-api-allowed-statements", nil, "Statement types the SQL API accepts. Allowed values: SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, TRUNCATE, GRANT, REVOKE.")
	cmd.Flags().IntVar(&sqlApiMaxRows, "sql-api-max-rows", 0, "Maximum rows returned per SQL API execution (1-1000000).")
	cmd.Flags().IntVar(&sqlApiMaxBytes, "sql-api-max-bytes", 0, "Maximum serialised SQL API result payload in bytes (1024-104857600).")
	cmd.Flags().IntVar(&sqlApiTimeoutSeconds, "sql-api-timeout-seconds", 0, "Per-call SQL API execution timeout in seconds (1-300).")
	return cmd
}

func newPostgresqlDeleteCommand() *cobra.Command {
	var databaseId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a dedicated database. This action is irreversible. The database status will be set to 'deleting' and all resources will be cleaned up. Deletion is allowed from any state, and repeating the call re-dispatches the cleanup.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.Delete(databaseId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	return cmd
}

func newPostgresqlListBackupsCommand() *cobra.Command {
	var databaseId string
	var queries []string
	var filter []string
	var where []string
	var sortAsc []string
	var sortDesc []string
	var limit int
	var offset int
	var cursorAfter string
	var cursorBefore string

	cmd := &cobra.Command{
		Use:   "list-backups",
		Short: "List all backups for a dedicated database. Results can be filtered by status and type.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			parsedFilter, err := query.ParseFilters(filter)
			if err != nil {
				return err
			}
			parsedWhere, err := query.ParseFilters(where)
			if err != nil {
				return err
			}

			queries, err := query.Build(query.Options{
				Queries:      queries,
				Filter:       parsedFilter,
				Where:        parsedWhere,
				SortAsc:      sortAsc,
				SortDesc:     sortDesc,
				Limit:        app.FlagInt(cmd, "limit", limit),
				Offset:       app.FlagInt(cmd, "offset", offset),
				CursorAfter:  app.FlagString(cmd, "cursor-after", cursorAfter),
				CursorBefore: app.FlagString(cmd, "cursor-before", cursorBefore),
			})
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []postgresql.ListBackupsOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListBackupsQueries(queries))
			}

			result, err := service.ListBackups(databaseId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: status, type, databaseId")
	cmd.Flags().StringArrayVar(&filter, "filter", nil, "Filter using a simple comparison expression. Repeat for multiple filters. Supports field=value, field!=value, field>value, field>=value, field<value, and field<=value.")
	cmd.Flags().StringArrayVar(&where, "where", nil, "Deprecated. Use --filter instead. Filter using a simple comparison expression. Repeat for multiple filters.")
	cmd.Flags().StringArrayVar(&sortAsc, "sort-asc", nil, "Sort results by an attribute in ascending order. Repeat for multiple sort fields.")
	cmd.Flags().StringArrayVar(&sortDesc, "sort-desc", nil, "Sort results by an attribute in descending order. Repeat for multiple sort fields.")
	cmd.Flags().IntVar(&limit, "limit", 0, "Maximum number of results to return.")
	cmd.Flags().IntVar(&offset, "offset", 0, "Number of results to skip.")
	cmd.Flags().StringVar(&cursorAfter, "cursor-after", "", "Return results after this cursor ID.")
	cmd.Flags().StringVar(&cursorBefore, "cursor-before", "", "Return results before this cursor ID.")
	return cmd
}

func newPostgresqlCreateBackupCommand() *cobra.Command {
	var databaseId string
	var typeArg string

	cmd := &cobra.Command{
		Use:   "create-backup",
		Short: "Create a manual backup of a dedicated database. The backup will be created asynchronously and its status can be checked via the get backup endpoint.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []postgresql.CreateBackupOption{}
			if cmd.Flags().Changed("type") {
				options = append(options, service.WithCreateBackupType(typeArg))
			}

			result, err := service.CreateBackup(databaseId, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&typeArg, "type", "", "Backup type: full or incremental.")
	return cmd
}

func newPostgresqlListBackupPoliciesCommand() *cobra.Command {
	var databaseId string
	var queries []string
	var filter []string
	var where []string
	var sortAsc []string
	var sortDesc []string
	var limit int
	var offset int
	var cursorAfter string
	var cursorBefore string

	cmd := &cobra.Command{
		Use:   "list-backup-policies",
		Short: "List scheduled backup policies for a dedicated database.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			parsedFilter, err := query.ParseFilters(filter)
			if err != nil {
				return err
			}
			parsedWhere, err := query.ParseFilters(where)
			if err != nil {
				return err
			}

			queries, err := query.Build(query.Options{
				Queries:      queries,
				Filter:       parsedFilter,
				Where:        parsedWhere,
				SortAsc:      sortAsc,
				SortDesc:     sortDesc,
				Limit:        app.FlagInt(cmd, "limit", limit),
				Offset:       app.FlagInt(cmd, "offset", offset),
				CursorAfter:  app.FlagString(cmd, "cursor-after", cursorAfter),
				CursorBefore: app.FlagString(cmd, "cursor-before", cursorBefore),
			})
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []postgresql.ListBackupPoliciesOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListBackupPoliciesQueries(queries))
			}

			result, err := service.ListBackupPolicies(databaseId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK.")
	cmd.Flags().StringArrayVar(&filter, "filter", nil, "Filter using a simple comparison expression. Repeat for multiple filters. Supports field=value, field!=value, field>value, field>=value, field<value, and field<=value.")
	cmd.Flags().StringArrayVar(&where, "where", nil, "Deprecated. Use --filter instead. Filter using a simple comparison expression. Repeat for multiple filters.")
	cmd.Flags().StringArrayVar(&sortAsc, "sort-asc", nil, "Sort results by an attribute in ascending order. Repeat for multiple sort fields.")
	cmd.Flags().StringArrayVar(&sortDesc, "sort-desc", nil, "Sort results by an attribute in descending order. Repeat for multiple sort fields.")
	cmd.Flags().IntVar(&limit, "limit", 0, "Maximum number of results to return.")
	cmd.Flags().IntVar(&offset, "offset", 0, "Number of results to skip.")
	cmd.Flags().StringVar(&cursorAfter, "cursor-after", "", "Return results after this cursor ID.")
	cmd.Flags().StringVar(&cursorBefore, "cursor-before", "", "Return results before this cursor ID.")
	return cmd
}

func newPostgresqlCreateBackupPolicyCommand() *cobra.Command {
	var databaseId string
	var policyId string
	var name string
	var schedule string
	var retention int
	var typeArg string
	var enabled bool

	cmd := &cobra.Command{
		Use:   "create-backup-policy",
		Short: "Create a scheduled backup policy for a dedicated database.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []postgresql.CreateBackupPolicyOption{}
			if cmd.Flags().Changed("type") {
				options = append(options, service.WithCreateBackupPolicyType(typeArg))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateBackupPolicyEnabled(enabled))
			}

			result, err := service.CreateBackupPolicy(databaseId, policyId, name, schedule, retention, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&policyId, "policy-id", "", "Policy ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("policy-id")
	cmd.Flags().StringVar(&name, "name", "", "Policy name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&schedule, "schedule", "", "Schedule CRON syntax.")
	_ = cmd.MarkFlagRequired("schedule")
	cmd.Flags().IntVar(&retention, "retention", 0, "Days to keep backups before deletion.")
	_ = cmd.MarkFlagRequired("retention")
	cmd.Flags().StringVar(&typeArg, "type", "", "Backup type: full or incremental.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is policy enabled? When disabled, no backups will be taken.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	return cmd
}

func newPostgresqlGetBackupPolicyCommand() *cobra.Command {
	var databaseId string
	var policyId string

	cmd := &cobra.Command{
		Use:   "get-backup-policy",
		Short: "Get a scheduled backup policy for a dedicated database.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.GetBackupPolicy(databaseId, policyId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&policyId, "policy-id", "", "Policy ID.")
	_ = cmd.MarkFlagRequired("policy-id")
	return cmd
}

func newPostgresqlUpdateBackupPolicyCommand() *cobra.Command {
	var databaseId string
	var policyId string
	var name string
	var schedule string
	var retention int
	var enabled bool

	cmd := &cobra.Command{
		Use:   "update-backup-policy",
		Short: "Update a scheduled backup policy for a dedicated database.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []postgresql.UpdateBackupPolicyOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateBackupPolicyName(name))
			}
			if cmd.Flags().Changed("schedule") {
				options = append(options, service.WithUpdateBackupPolicySchedule(schedule))
			}
			if cmd.Flags().Changed("retention") {
				options = append(options, service.WithUpdateBackupPolicyRetention(retention))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateBackupPolicyEnabled(enabled))
			}

			result, err := service.UpdateBackupPolicy(databaseId, policyId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&policyId, "policy-id", "", "Policy ID.")
	_ = cmd.MarkFlagRequired("policy-id")
	cmd.Flags().StringVar(&name, "name", "", "Policy name. Max length: 128 chars.")
	cmd.Flags().StringVar(&schedule, "schedule", "", "Schedule CRON syntax.")
	cmd.Flags().IntVar(&retention, "retention", 0, "Days to keep backups before deletion.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is policy enabled? When disabled, no backups will be taken.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	return cmd
}

func newPostgresqlDeleteBackupPolicyCommand() *cobra.Command {
	var databaseId string
	var policyId string

	cmd := &cobra.Command{
		Use:   "delete-backup-policy",
		Short: "Delete a scheduled backup policy for a dedicated database. Backups already taken by the policy are kept until their retention expires.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.DeleteBackupPolicy(databaseId, policyId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&policyId, "policy-id", "", "Policy ID.")
	_ = cmd.MarkFlagRequired("policy-id")
	return cmd
}

func newPostgresqlUpdateBackupStorageCommand() *cobra.Command {
	var databaseId string
	var provider string
	var bucket string
	var accessKey string
	var secretKey string
	var region string
	var prefix string
	var endpoint string

	cmd := &cobra.Command{
		Use:   "update-backup-storage",
		Short: "Configure off-cluster backup storage for a dedicated database. Supports S3, GCS, and Azure Blob Storage destinations. Backups will be stored to the configured destination in addition to on-cluster storage.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []postgresql.UpdateBackupStorageOption{}
			if cmd.Flags().Changed("region") {
				options = append(options, service.WithUpdateBackupStorageRegion(region))
			}
			if cmd.Flags().Changed("prefix") {
				options = append(options, service.WithUpdateBackupStoragePrefix(prefix))
			}
			if cmd.Flags().Changed("endpoint") {
				options = append(options, service.WithUpdateBackupStorageEndpoint(endpoint))
			}

			result, err := service.UpdateBackupStorage(databaseId, provider, bucket, accessKey, secretKey, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&provider, "provider", "", "Storage provider for off-cluster backups. Allowed values: s3 (Amazon S3 or S3-compatible), gcs (Google Cloud Storage), azure (Azure Blob Storage).")
	_ = cmd.MarkFlagRequired("provider")
	cmd.Flags().StringVar(&bucket, "bucket", "", "Storage bucket or container name.")
	_ = cmd.MarkFlagRequired("bucket")
	cmd.Flags().StringVar(&accessKey, "access-key", "", "Access key or client ID for authentication.")
	_ = cmd.MarkFlagRequired("access-key")
	cmd.Flags().StringVar(&secretKey, "secret-key", "", "Secret key or service account JSON for authentication.")
	_ = cmd.MarkFlagRequired("secret-key")
	cmd.Flags().StringVar(&region, "region", "", "Storage region.")
	cmd.Flags().StringVar(&prefix, "prefix", "", "Object key prefix for backups.")
	cmd.Flags().StringVar(&endpoint, "endpoint", "", "Custom endpoint for S3-compatible storage (e.g. MinIO).")
	return cmd
}

func newPostgresqlGetBackupCommand() *cobra.Command {
	var databaseId string
	var backupId string

	cmd := &cobra.Command{
		Use:   "get-backup",
		Short: "Get details of a specific database backup including its status, size, and timestamps.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.GetBackup(databaseId, backupId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&backupId, "backup-id", "", "Backup ID.")
	_ = cmd.MarkFlagRequired("backup-id")
	return cmd
}

func newPostgresqlDeleteBackupCommand() *cobra.Command {
	var databaseId string
	var backupId string

	cmd := &cobra.Command{
		Use:   "delete-backup",
		Short: "Delete a database backup. This will permanently remove the backup from storage and cannot be undone.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.DeleteBackup(databaseId, backupId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&backupId, "backup-id", "", "Backup ID.")
	_ = cmd.MarkFlagRequired("backup-id")
	return cmd
}

func newPostgresqlListBranchesCommand() *cobra.Command {
	var databaseId string

	cmd := &cobra.Command{
		Use:   "list-branches",
		Short: "List all ephemeral branches for a dedicated database. Returns branch metadata including ID, name, namespace, and expiration time.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.ListBranches(databaseId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	return cmd
}

func newPostgresqlCreateBranchCommand() *cobra.Command {
	var databaseId string
	var branchId string
	var ttl int

	cmd := &cobra.Command{
		Use:   "create-branch",
		Short: "Create an ephemeral database branch from the primary via PVC snapshot. The branch is a full copy of the database at the current point in time, useful for testing schema migrations or running experiments without affecting production data. Branches expire after the configured TTL (default 24 hours). The branch is created asynchronously.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []postgresql.CreateBranchOption{}
			if cmd.Flags().Changed("branch-id") {
				options = append(options, service.WithCreateBranchBranchId(branchId))
			}
			if cmd.Flags().Changed("ttl") {
				options = append(options, service.WithCreateBranchTtl(ttl))
			}

			result, err := service.CreateBranch(databaseId, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&branchId, "branch-id", "", "Branch ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time-to-live in seconds before the branch expires. Min 300 (5 min), max 604800 (7 days). Default: 86400 (24h).")
	return cmd
}

func newPostgresqlDeleteBranchCommand() *cobra.Command {
	var databaseId string
	var branchId string

	cmd := &cobra.Command{
		Use:   "delete-branch",
		Short: "Delete an ephemeral database branch. This removes the branch namespace, its PVC, and the associated VolumeSnapshot. The deletion runs asynchronously and is irreversible.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.DeleteBranch(databaseId, branchId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&branchId, "branch-id", "", "Branch ID.")
	_ = cmd.MarkFlagRequired("branch-id")
	return cmd
}

func newPostgresqlUpdateCredentialsCommand() *cobra.Command {
	var databaseId string

	cmd := &cobra.Command{
		Use:   "update-credentials",
		Short: "Queue a rotation of the primary connection credentials for a dedicated database. A hibernated database is woken by the worker before rotation. List database operations until the returned operation reaches a terminal status, then fetch the database again for the refreshed connection string.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.UpdateCredentials(databaseId)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	return cmd
}

func newPostgresqlCreateExecutionCommand() *cobra.Command {
	var databaseId string
	var sql string
	var bindings string
	var timeoutSeconds int

	cmd := &cobra.Command{
		Use:   "create-execution",
		Short: "Execute SQL through the console-facing Cloud endpoint. Cloud proxies through the edge platform to the per-database SQL API sidecar. Application traffic should bypass cloud entirely and POST directly to the per-database hostname: `https://db-{project}-{db}.{region}.appwrite.center/v1/sql/executions` with an `X-Appwrite-Key` header — that path scales to the whole DB fleet without a per-query cloud round-trip. The statement type must be on the database's configured allow-list. Use bound parameters for any user-supplied values — the API does not interpolate raw strings.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)
			bindingsValue, err := app.JSONObject(bindings)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []postgresql.CreateExecutionOption{}
			if cmd.Flags().Changed("bindings") {
				options = append(options, service.WithCreateExecutionBindings(bindingsValue))
			}
			if cmd.Flags().Changed("timeout-seconds") {
				options = append(options, service.WithCreateExecutionTimeoutSeconds(timeoutSeconds))
			}

			result, err := service.CreateExecution(databaseId, sql, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&sql, "sql", "", "SQL statement to execute. Exactly one statement per request.")
	_ = cmd.MarkFlagRequired("sql")
	cmd.Flags().StringVar(&bindings, "bindings", "", "Optional bound parameters. Pass either a positional list or a name => value map matching the placeholder style used in the SQL.")
	cmd.Flags().IntVar(&timeoutSeconds, "timeout-seconds", 0, "Per-call execution timeout override. Must be less than or equal to the database's configured sqlApiTimeoutSeconds.")
	return cmd
}

func newPostgresqlListExtensionsCommand() *cobra.Command {
	var databaseId string

	cmd := &cobra.Command{
		Use:   "list-extensions",
		Short: "List installed and available extensions for a PostgreSQL database.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.ListExtensions(databaseId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	return cmd
}

func newPostgresqlCreateExtensionCommand() *cobra.Command {
	var databaseId string
	var name string

	cmd := &cobra.Command{
		Use:   "create-extension",
		Short: "Install a database extension. Only available for PostgreSQL databases. The install runs asynchronously; poll the extensions list endpoint for status.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.CreateExtension(databaseId, name)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&name, "name", "", "Extension name (e.g., pgvector, postgis, uuid-ossp).")
	_ = cmd.MarkFlagRequired("name")
	return cmd
}

func newPostgresqlDeleteExtensionCommand() *cobra.Command {
	var databaseId string
	var extensionName string

	cmd := &cobra.Command{
		Use:   "delete-extension",
		Short: "Uninstall a database extension from a PostgreSQL database. The uninstall runs asynchronously; poll the extensions list endpoint for status.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.DeleteExtension(databaseId, extensionName)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&extensionName, "extension-name", "", "Extension name to uninstall.")
	_ = cmd.MarkFlagRequired("extension-name")
	return cmd
}

func newPostgresqlCreateFailoverCommand() *cobra.Command {
	var databaseId string
	var targetReplicaId string

	cmd := &cobra.Command{
		Use:   "create-failover",
		Short: "Trigger a manual failover for a dedicated database with high availability enabled. Promotes a replica to primary. The failover runs asynchronously; poll the database document for status updates. A database left mid-operation also accepts this call as a repair once nothing is driving the operation it is stuck in. Repairing a failover that did not finish, a `failed` database, a stranded upgrade or migrate, or a stranded compute resize additionally requires `targetReplicaId` to name the member to promote, because the default target may be the member that operation already promoted.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []postgresql.CreateFailoverOption{}
			if cmd.Flags().Changed("target-replica-id") {
				options = append(options, service.WithCreateFailoverTargetReplicaId(targetReplicaId))
			}

			result, err := service.CreateFailover(databaseId, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&targetReplicaId, "target-replica-id", "", "Target replica ID to promote. If not specified, the healthiest replica is selected.")
	return cmd
}

func newPostgresqlUpdateMaintenanceCommand() *cobra.Command {
	var databaseId string
	var day string
	var hourUtc int

	cmd := &cobra.Command{
		Use:   "update-maintenance",
		Short: "Update the maintenance window for a dedicated database. Maintenance operations like minor version upgrades will be performed during this window.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.UpdateMaintenance(databaseId, day, hourUtc)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&day, "day", "", "Day of the week for the maintenance window. Allowed values: sun, mon, tue, wed, thu, fri, sat.")
	_ = cmd.MarkFlagRequired("day")
	cmd.Flags().IntVar(&hourUtc, "hour-utc", 0, "Hour in UTC (0-23) for maintenance window start.")
	_ = cmd.MarkFlagRequired("hour-utc")
	return cmd
}

func newPostgresqlCreateMigrationCommand() *cobra.Command {
	var databaseId string
	var targetType string
	var specification string

	cmd := &cobra.Command{
		Use:   "create-migration",
		Short: "Migrate a database between shared and dedicated types. Shared to dedicated provisions an always-on dedicated instance; dedicated to shared converts to a serverless instance that scales to zero when idle. Data is copied to the target with a brief read-only window during cutover.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []postgresql.CreateMigrationOption{}
			if cmd.Flags().Changed("specification") {
				options = append(options, service.WithCreateMigrationSpecification(specification))
			}

			result, err := service.CreateMigration(databaseId, targetType, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&targetType, "target-type", "", "Target database type to migrate to. Allowed values: shared (serverless, scales to zero when idle), dedicated (always-on with persistent resources).")
	_ = cmd.MarkFlagRequired("target-type")
	cmd.Flags().StringVar(&specification, "specification", "", "Target specification to provision when migrating to dedicated. Ignored for shared. Defaults to the database's current specification.")
	return cmd
}

func newPostgresqlListOperationsCommand() *cobra.Command {
	var databaseId string
	var status string
	var limit int
	var offset int

	cmd := &cobra.Command{
		Use:   "list-operations",
		Short: "List the lifecycle operations recorded for a dedicated database, newest first. Every provision, update, restore, backup and replication action is recorded here with its outcome, including an attempt that was abandoned because another worker took over the database.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []postgresql.ListOperationsOption{}
			if cmd.Flags().Changed("status") {
				options = append(options, service.WithListOperationsStatus(status))
			}
			if cmd.Flags().Changed("limit") {
				options = append(options, service.WithListOperationsLimit(limit))
			}
			if cmd.Flags().Changed("offset") {
				options = append(options, service.WithListOperationsOffset(offset))
			}

			result, err := service.ListOperations(databaseId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&status, "status", "", "Filter by operation status.")
	cmd.Flags().IntVar(&limit, "limit", 0, "Maximum number of operations to return.")
	cmd.Flags().IntVar(&offset, "offset", 0, "Number of operations to skip.")
	return cmd
}

func newPostgresqlGetPitrCommand() *cobra.Command {
	var databaseId string

	cmd := &cobra.Command{
		Use:   "get-pitr",
		Short: "Get available point-in-time recovery windows for a dedicated database. Returns the earliest and latest recovery points.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.GetPitr(databaseId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	return cmd
}

func newPostgresqlGetPoolerCommand() *cobra.Command {
	var databaseId string

	cmd := &cobra.Command{
		Use:   "get-pooler",
		Short: "Get the connection pooler configuration for a dedicated database. Returns pooler mode, max connections, and pool size settings.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.GetPooler(databaseId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	return cmd
}

func newPostgresqlUpdatePoolerCommand() *cobra.Command {
	var databaseId string
	var mode string
	var maxConnections int
	var defaultPoolSize int
	var readWriteSplitting bool
	var poolerCpuRequest string
	var poolerCpuLimit string
	var poolerMemoryRequest string
	var poolerMemoryLimit string

	cmd := &cobra.Command{
		Use:   "update-pooler",
		Short: "Update the connection pooler configuration for a dedicated database. Configure pool mode, max connections, and pool sizes.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []postgresql.UpdatePoolerOption{}
			if cmd.Flags().Changed("mode") {
				options = append(options, service.WithUpdatePoolerMode(mode))
			}
			if cmd.Flags().Changed("max-connections") {
				options = append(options, service.WithUpdatePoolerMaxConnections(maxConnections))
			}
			if cmd.Flags().Changed("default-pool-size") {
				options = append(options, service.WithUpdatePoolerDefaultPoolSize(defaultPoolSize))
			}
			if cmd.Flags().Changed("read-write-splitting") {
				options = append(options, service.WithUpdatePoolerReadWriteSplitting(readWriteSplitting))
			}
			if cmd.Flags().Changed("pooler-cpu-request") {
				options = append(options, service.WithUpdatePoolerPoolerCpuRequest(poolerCpuRequest))
			}
			if cmd.Flags().Changed("pooler-cpu-limit") {
				options = append(options, service.WithUpdatePoolerPoolerCpuLimit(poolerCpuLimit))
			}
			if cmd.Flags().Changed("pooler-memory-request") {
				options = append(options, service.WithUpdatePoolerPoolerMemoryRequest(poolerMemoryRequest))
			}
			if cmd.Flags().Changed("pooler-memory-limit") {
				options = append(options, service.WithUpdatePoolerPoolerMemoryLimit(poolerMemoryLimit))
			}

			result, err := service.UpdatePooler(databaseId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&mode, "mode", "", "Connection pool mode. Allowed values: transaction, session. Transaction mode returns connections to the pool after each transaction; session mode holds connections for the entire session lifetime.")
	cmd.Flags().IntVar(&maxConnections, "max-connections", 0, "Client-connection ceiling the pooler accepts. Supported on MySQL and MariaDB only; the PostgreSQL pooler has no client cap, so set networkMaxConnections on the database instead.")
	cmd.Flags().IntVar(&defaultPoolSize, "default-pool-size", 0, "Default pool size per user.")
	cmd.Flags().BoolVar(&readWriteSplitting, "read-write-splitting", false, "Route SELECTs to HA replicas, writes and locked reads to the primary. Defaults to true when HA is enabled.")
	cmd.Flags().Lookup("read-write-splitting").NoOptDefVal = "true"
	cmd.Flags().StringVar(&poolerCpuRequest, "pooler-cpu-request", "", "Pooler sidecar CPU request override (Kubernetes quantity, e.g. \"250m\" or \"1\"). Leave null for the proportional default (5% of DB CPU, floor 100m).")
	cmd.Flags().StringVar(&poolerCpuLimit, "pooler-cpu-limit", "", "Pooler sidecar CPU limit override (Kubernetes quantity, e.g. \"500m\" or \"1\"). Leave null for the proportional default (10% of DB CPU, floor 200m). Changing this field rolls the database pod.")
	cmd.Flags().StringVar(&poolerMemoryRequest, "pooler-memory-request", "", "Pooler sidecar memory request override (Kubernetes quantity, e.g. \"128Mi\" or \"1Gi\"). Leave null for the proportional default (7.5% of DB memory, floor 64Mi).")
	cmd.Flags().StringVar(&poolerMemoryLimit, "pooler-memory-limit", "", "Pooler sidecar memory limit override (Kubernetes quantity, e.g. \"256Mi\" or \"1Gi\"). Leave null for the proportional default (15% of DB memory, floor 128Mi). Changing this field rolls the database pod.")
	return cmd
}

func newPostgresqlGetReplicasCommand() *cobra.Command {
	var databaseId string

	cmd := &cobra.Command{
		Use:   "get-replicas",
		Short: "Get high availability status for a dedicated database. Returns replica statuses, replication lag, and sync mode.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.GetReplicas(databaseId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	return cmd
}

func newPostgresqlListRestorationsCommand() *cobra.Command {
	var databaseId string
	var status string
	var typeArg string
	var limit int
	var offset int

	cmd := &cobra.Command{
		Use:   "list-restorations",
		Short: "List all restorations for a dedicated database. Results can be filtered by status and type.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []postgresql.ListRestorationsOption{}
			if cmd.Flags().Changed("status") {
				options = append(options, service.WithListRestorationsStatus(status))
			}
			if cmd.Flags().Changed("type") {
				options = append(options, service.WithListRestorationsType(typeArg))
			}
			if cmd.Flags().Changed("limit") {
				options = append(options, service.WithListRestorationsLimit(limit))
			}
			if cmd.Flags().Changed("offset") {
				options = append(options, service.WithListRestorationsOffset(offset))
			}

			result, err := service.ListRestorations(databaseId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&status, "status", "", "Filter by restoration status.")
	cmd.Flags().StringVar(&typeArg, "type", "", "Filter by restoration type.")
	cmd.Flags().IntVar(&limit, "limit", 0, "Maximum number of restorations to return.")
	cmd.Flags().IntVar(&offset, "offset", 0, "Number of restorations to skip.")
	return cmd
}

func newPostgresqlCreateRestorationCommand() *cobra.Command {
	var databaseId string
	var typeArg string
	var backupId string
	var targetDatabaseId string
	var targetTime string

	cmd := &cobra.Command{
		Use:   "create-restoration",
		Short: "Restore a database from a backup or to a specific point in time (PITR). For backup restoration, provide a backupId. For PITR, provide a targetTime as an ISO 8601 datetime. PITR requires the database to have PITR enabled and is only available for enterprise databases.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []postgresql.CreateRestorationOption{}
			if cmd.Flags().Changed("type") {
				options = append(options, service.WithCreateRestorationType(typeArg))
			}
			if cmd.Flags().Changed("backup-id") {
				options = append(options, service.WithCreateRestorationBackupId(backupId))
			}
			if cmd.Flags().Changed("target-database-id") {
				options = append(options, service.WithCreateRestorationTargetDatabaseId(targetDatabaseId))
			}
			if cmd.Flags().Changed("target-time") {
				options = append(options, service.WithCreateRestorationTargetTime(targetTime))
			}

			result, err := service.CreateRestoration(databaseId, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&typeArg, "type", "", "Restoration type. Allowed values: backup, pitr. Use \"backup\" to restore from a specific backup, or \"pitr\" for point-in-time recovery.")
	cmd.Flags().StringVar(&backupId, "backup-id", "", "Backup ID to restore from (required for backup type).")
	cmd.Flags().StringVar(&targetDatabaseId, "target-database-id", "", "Existing database ID to restore into. The target must be distinct, ready, and use the same engine and version.")
	cmd.Flags().StringVar(&targetTime, "target-time", "", "Target time for PITR (required for pitr type) as an ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) datetime.")
	return cmd
}

func newPostgresqlGetRestorationCommand() *cobra.Command {
	var databaseId string
	var restorationId string

	cmd := &cobra.Command{
		Use:   "get-restoration",
		Short: "Get details of a specific database restoration including its status, type, and timestamps.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.GetRestoration(databaseId, restorationId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&restorationId, "restoration-id", "", "Restoration ID.")
	_ = cmd.MarkFlagRequired("restoration-id")
	return cmd
}

func newPostgresqlGetStatusCommand() *cobra.Command {
	var databaseId string

	cmd := &cobra.Command{
		Use:   "get-status",
		Short: "Get real-time health and status information for a dedicated database. Returns health status, readiness, uptime, connection info, replica status, and volume information.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.GetStatus(databaseId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	return cmd
}

func newPostgresqlCreateUpgradeCommand() *cobra.Command {
	var databaseId string
	var targetVersion string

	cmd := &cobra.Command{
		Use:   "create-upgrade",
		Short: "Upgrade a dedicated database to a new engine version. Uses blue-green deployment for zero-downtime cutover.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := postgresql.New(client)

			result, err := service.CreateUpgrade(databaseId, targetVersion)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&targetVersion, "target-version", "", "Target engine version to upgrade to.")
	_ = cmd.MarkFlagRequired("target-version")
	return cmd
}
