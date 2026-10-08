package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v7/mongo"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewMongoCommand builds the `mongo` command tree.
func NewMongoCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "mongo",
		Short: "",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			return cmd.Help()
		},
	}

	cmd.AddCommand(newMongoListCommand())
	cmd.AddCommand(newMongoCreateCommand())
	cmd.AddCommand(newMongoListSpecificationsCommand())
	cmd.AddCommand(newMongoGetCommand())
	cmd.AddCommand(newMongoUpdateCommand())
	cmd.AddCommand(newMongoDeleteCommand())
	cmd.AddCommand(newMongoListBackupsCommand())
	cmd.AddCommand(newMongoCreateBackupCommand())
	cmd.AddCommand(newMongoListBackupPoliciesCommand())
	cmd.AddCommand(newMongoCreateBackupPolicyCommand())
	cmd.AddCommand(newMongoGetBackupPolicyCommand())
	cmd.AddCommand(newMongoUpdateBackupPolicyCommand())
	cmd.AddCommand(newMongoDeleteBackupPolicyCommand())
	cmd.AddCommand(newMongoUpdateBackupStorageCommand())
	cmd.AddCommand(newMongoGetBackupCommand())
	cmd.AddCommand(newMongoDeleteBackupCommand())
	cmd.AddCommand(newMongoListBranchesCommand())
	cmd.AddCommand(newMongoCreateBranchCommand())
	cmd.AddCommand(newMongoDeleteBranchCommand())
	cmd.AddCommand(newMongoUpdateCredentialsCommand())
	cmd.AddCommand(newMongoCreateFailoverCommand())
	cmd.AddCommand(newMongoUpdateMaintenanceCommand())
	cmd.AddCommand(newMongoCreateMigrationCommand())
	cmd.AddCommand(newMongoListOperationsCommand())
	cmd.AddCommand(newMongoGetPitrCommand())
	cmd.AddCommand(newMongoGetReplicasCommand())
	cmd.AddCommand(newMongoListRestorationsCommand())
	cmd.AddCommand(newMongoCreateRestorationCommand())
	cmd.AddCommand(newMongoGetRestorationCommand())
	cmd.AddCommand(newMongoGetStatusCommand())
	cmd.AddCommand(newMongoCreateUpgradeCommand())

	return cmd
}

func newMongoListCommand() *cobra.Command {
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
			service := mongo.New(client)

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
			options := []mongo.ListOption{}
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

func newMongoCreateCommand() *cobra.Command {
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
			service := mongo.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []mongo.CreateOption{}
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

func newMongoListSpecificationsCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-specifications",
		Short: "List the dedicated database specifications available on the current plan. Each specification reports its resource limits, its own prices and overage rates, and whether it is enabled for the organization.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := mongo.New(client)

			result, err := service.ListSpecifications()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newMongoGetCommand() *cobra.Command {
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
			service := mongo.New(client)

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

func newMongoUpdateCommand() *cobra.Command {
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
			service := mongo.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []mongo.UpdateOption{}
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

func newMongoDeleteCommand() *cobra.Command {
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
			service := mongo.New(client)

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

func newMongoListBackupsCommand() *cobra.Command {
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
			service := mongo.New(client)

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
			options := []mongo.ListBackupsOption{}
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

func newMongoCreateBackupCommand() *cobra.Command {
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
			service := mongo.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []mongo.CreateBackupOption{}
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

func newMongoListBackupPoliciesCommand() *cobra.Command {
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
			service := mongo.New(client)

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
			options := []mongo.ListBackupPoliciesOption{}
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

func newMongoCreateBackupPolicyCommand() *cobra.Command {
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
			service := mongo.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []mongo.CreateBackupPolicyOption{}
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

func newMongoGetBackupPolicyCommand() *cobra.Command {
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
			service := mongo.New(client)

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

func newMongoUpdateBackupPolicyCommand() *cobra.Command {
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
			service := mongo.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []mongo.UpdateBackupPolicyOption{}
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

func newMongoDeleteBackupPolicyCommand() *cobra.Command {
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
			service := mongo.New(client)

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

func newMongoUpdateBackupStorageCommand() *cobra.Command {
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
			service := mongo.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []mongo.UpdateBackupStorageOption{}
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

func newMongoGetBackupCommand() *cobra.Command {
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
			service := mongo.New(client)

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

func newMongoDeleteBackupCommand() *cobra.Command {
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
			service := mongo.New(client)

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

func newMongoListBranchesCommand() *cobra.Command {
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
			service := mongo.New(client)

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

func newMongoCreateBranchCommand() *cobra.Command {
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
			service := mongo.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []mongo.CreateBranchOption{}
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

func newMongoDeleteBranchCommand() *cobra.Command {
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
			service := mongo.New(client)

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

func newMongoUpdateCredentialsCommand() *cobra.Command {
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
			service := mongo.New(client)

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

func newMongoCreateFailoverCommand() *cobra.Command {
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
			service := mongo.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []mongo.CreateFailoverOption{}
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

func newMongoUpdateMaintenanceCommand() *cobra.Command {
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
			service := mongo.New(client)

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

func newMongoCreateMigrationCommand() *cobra.Command {
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
			service := mongo.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []mongo.CreateMigrationOption{}
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

func newMongoListOperationsCommand() *cobra.Command {
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
			service := mongo.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []mongo.ListOperationsOption{}
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

func newMongoGetPitrCommand() *cobra.Command {
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
			service := mongo.New(client)

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

func newMongoGetReplicasCommand() *cobra.Command {
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
			service := mongo.New(client)

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

func newMongoListRestorationsCommand() *cobra.Command {
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
			service := mongo.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []mongo.ListRestorationsOption{}
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

func newMongoCreateRestorationCommand() *cobra.Command {
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
			service := mongo.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []mongo.CreateRestorationOption{}
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

func newMongoGetRestorationCommand() *cobra.Command {
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
			service := mongo.New(client)

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

func newMongoGetStatusCommand() *cobra.Command {
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
			service := mongo.New(client)

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

func newMongoCreateUpgradeCommand() *cobra.Command {
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
			service := mongo.New(client)

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
