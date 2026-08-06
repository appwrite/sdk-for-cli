package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/tablesdb"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
)

// NewTablesDBCommand builds the `tablesdb` command tree.
func NewTablesDBCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "tablesdb",
		Aliases: []string{"tables-db"},
		Short:   "The TablesDB service allows you to create structured tables of columns, query and filter lists of rows",
	}

	cmd.AddCommand(newTablesDBListCommand())
	cmd.AddCommand(newTablesDBCreateCommand())
	cmd.AddCommand(newTablesDBListSpecificationsCommand())
	cmd.AddCommand(newTablesDBListTransactionsCommand())
	cmd.AddCommand(newTablesDBCreateTransactionCommand())
	cmd.AddCommand(newTablesDBGetTransactionCommand())
	cmd.AddCommand(newTablesDBUpdateTransactionCommand())
	cmd.AddCommand(newTablesDBDeleteTransactionCommand())
	cmd.AddCommand(newTablesDBCreateOperationsCommand())
	cmd.AddCommand(newTablesDBGetCommand())
	cmd.AddCommand(newTablesDBUpdateCommand())
	cmd.AddCommand(newTablesDBDeleteCommand())
	cmd.AddCommand(newTablesDBCreateFailoverCommand())
	cmd.AddCommand(newTablesDBListOperationsCommand())
	cmd.AddCommand(newTablesDBGetReplicasCommand())
	cmd.AddCommand(newTablesDBGetStatusCommand())
	cmd.AddCommand(newTablesDBListTablesCommand())
	cmd.AddCommand(newTablesDBCreateTableCommand())
	cmd.AddCommand(newTablesDBGetTableCommand())
	cmd.AddCommand(newTablesDBUpdateTableCommand())
	cmd.AddCommand(newTablesDBDeleteTableCommand())
	cmd.AddCommand(newTablesDBListColumnsCommand())
	cmd.AddCommand(newTablesDBCreateBigIntColumnCommand())
	cmd.AddCommand(newTablesDBUpdateBigIntColumnCommand())
	cmd.AddCommand(newTablesDBCreateBooleanColumnCommand())
	cmd.AddCommand(newTablesDBUpdateBooleanColumnCommand())
	cmd.AddCommand(newTablesDBCreateDatetimeColumnCommand())
	cmd.AddCommand(newTablesDBUpdateDatetimeColumnCommand())
	cmd.AddCommand(newTablesDBCreateEmailColumnCommand())
	cmd.AddCommand(newTablesDBUpdateEmailColumnCommand())
	cmd.AddCommand(newTablesDBCreateEnumColumnCommand())
	cmd.AddCommand(newTablesDBUpdateEnumColumnCommand())
	cmd.AddCommand(newTablesDBCreateFloatColumnCommand())
	cmd.AddCommand(newTablesDBUpdateFloatColumnCommand())
	cmd.AddCommand(newTablesDBCreateIntegerColumnCommand())
	cmd.AddCommand(newTablesDBUpdateIntegerColumnCommand())
	cmd.AddCommand(newTablesDBCreateIpColumnCommand())
	cmd.AddCommand(newTablesDBUpdateIpColumnCommand())
	cmd.AddCommand(newTablesDBCreateLineColumnCommand())
	cmd.AddCommand(newTablesDBUpdateLineColumnCommand())
	cmd.AddCommand(newTablesDBCreateLongtextColumnCommand())
	cmd.AddCommand(newTablesDBUpdateLongtextColumnCommand())
	cmd.AddCommand(newTablesDBCreateMediumtextColumnCommand())
	cmd.AddCommand(newTablesDBUpdateMediumtextColumnCommand())
	cmd.AddCommand(newTablesDBCreatePointColumnCommand())
	cmd.AddCommand(newTablesDBUpdatePointColumnCommand())
	cmd.AddCommand(newTablesDBCreatePolygonColumnCommand())
	cmd.AddCommand(newTablesDBUpdatePolygonColumnCommand())
	cmd.AddCommand(newTablesDBCreateRelationshipColumnCommand())
	cmd.AddCommand(newTablesDBCreateStringColumnCommand())
	cmd.AddCommand(newTablesDBUpdateStringColumnCommand())
	cmd.AddCommand(newTablesDBCreateTextColumnCommand())
	cmd.AddCommand(newTablesDBUpdateTextColumnCommand())
	cmd.AddCommand(newTablesDBCreateUrlColumnCommand())
	cmd.AddCommand(newTablesDBUpdateUrlColumnCommand())
	cmd.AddCommand(newTablesDBCreateVarcharColumnCommand())
	cmd.AddCommand(newTablesDBUpdateVarcharColumnCommand())
	cmd.AddCommand(newTablesDBGetColumnCommand())
	cmd.AddCommand(newTablesDBDeleteColumnCommand())
	cmd.AddCommand(newTablesDBUpdateRelationshipColumnCommand())
	cmd.AddCommand(newTablesDBListIndexesCommand())
	cmd.AddCommand(newTablesDBCreateIndexCommand())
	cmd.AddCommand(newTablesDBGetIndexCommand())
	cmd.AddCommand(newTablesDBDeleteIndexCommand())
	cmd.AddCommand(newTablesDBListRowsCommand())
	cmd.AddCommand(newTablesDBCreateRowCommand())
	cmd.AddCommand(newTablesDBCreateRowsCommand())
	cmd.AddCommand(newTablesDBUpsertRowsCommand())
	cmd.AddCommand(newTablesDBUpdateRowsCommand())
	cmd.AddCommand(newTablesDBDeleteRowsCommand())
	cmd.AddCommand(newTablesDBGetRowCommand())
	cmd.AddCommand(newTablesDBUpsertRowCommand())
	cmd.AddCommand(newTablesDBUpdateRowCommand())
	cmd.AddCommand(newTablesDBDeleteRowCommand())
	cmd.AddCommand(newTablesDBDecrementRowColumnCommand())
	cmd.AddCommand(newTablesDBIncrementRowColumnCommand())

	return cmd
}

func newTablesDBListCommand() *cobra.Command {
	var queries []string
	var search string
	var total bool
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
		Short: "Get a list of all databases from the current Appwrite project. You can use the search parameter to filter your results.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

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

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.ListOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListTotal(total))
			}

			result, err := service.List(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: name")
	cmd.Flags().StringVar(&search, "search", "", "Search term to filter your list results. Max length: 256 chars.")
	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
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

func newTablesDBCreateCommand() *cobra.Command {
	var databaseId string
	var name string
	var enabled bool
	var specification string
	var replicas int
	var syncMode string

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create a new Database.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateOption{}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateEnabled(enabled))
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

			result, err := service.Create(databaseId, name, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Unique Id. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&name, "name", "", "Database name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is the database enabled? When set to 'disabled', users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&specification, "specification", "", "Database specification. Defaults to `serverless`, which creates the database on the shared pool. Any other value provisions a dedicated database on that specification.")
	cmd.Flags().IntVar(&replicas, "replicas", 0, "Number of high availability replicas (0-5) for the dedicated database backing this database. Requires a dedicated `specification`; must be 0 for a serverless database. High availability is enabled when greater than 0.")
	cmd.Flags().StringVar(&syncMode, "sync-mode", "", "Replication sync mode for the dedicated database backing this database. Requires a dedicated `specification`; the mode is only in force once there is at least one replica. Allowed values: async, sync, quorum.")
	return cmd
}

func newTablesDBListSpecificationsCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-specifications",
		Short: "List the dedicated database specifications available on the current plan. Each specification reports its resource limits, pricing, and whether it is enabled for the organization.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			result, err := service.ListSpecifications()
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newTablesDBListTransactionsCommand() *cobra.Command {
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
		Use:   "list-transactions",
		Short: "List transactions across all databases.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

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

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.ListTransactionsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListTransactionsQueries(queries))
			}

			result, err := service.ListTransactions(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries).")
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

func newTablesDBCreateTransactionCommand() *cobra.Command {
	var ttl int

	cmd := &cobra.Command{
		Use:   "create-transaction",
		Short: "Create a new transaction.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateTransactionOption{}
			if cmd.Flags().Changed("ttl") {
				options = append(options, service.WithCreateTransactionTtl(ttl))
			}

			result, err := service.CreateTransaction(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().IntVar(&ttl, "ttl", 0, "Seconds before the transaction expires.")
	return cmd
}

func newTablesDBGetTransactionCommand() *cobra.Command {
	var transactionId string

	cmd := &cobra.Command{
		Use:   "get-transaction",
		Short: "Get a transaction by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			result, err := service.GetTransaction(transactionId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID.")
	_ = cmd.MarkFlagRequired("transaction-id")
	return cmd
}

func newTablesDBUpdateTransactionCommand() *cobra.Command {
	var transactionId string
	var commit bool
	var rollback bool

	cmd := &cobra.Command{
		Use:   "update-transaction",
		Short: "Update a transaction, to either commit or roll back its operations.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateTransactionOption{}
			if cmd.Flags().Changed("commit") {
				options = append(options, service.WithUpdateTransactionCommit(commit))
			}
			if cmd.Flags().Changed("rollback") {
				options = append(options, service.WithUpdateTransactionRollback(rollback))
			}

			result, err := service.UpdateTransaction(transactionId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID.")
	_ = cmd.MarkFlagRequired("transaction-id")
	cmd.Flags().BoolVar(&commit, "commit", false, "Commit transaction?")
	cmd.Flags().Lookup("commit").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&rollback, "rollback", false, "Rollback transaction?")
	cmd.Flags().Lookup("rollback").NoOptDefVal = "true"
	return cmd
}

func newTablesDBDeleteTransactionCommand() *cobra.Command {
	var transactionId string

	cmd := &cobra.Command{
		Use:   "delete-transaction",
		Short: "Delete a transaction by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			result, err := service.DeleteTransaction(transactionId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID.")
	_ = cmd.MarkFlagRequired("transaction-id")
	return cmd
}

func newTablesDBCreateOperationsCommand() *cobra.Command {
	var transactionId string
	var operations []string

	cmd := &cobra.Command{
		Use:   "create-operations",
		Short: "Create multiple operations in a single transaction.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateOperationsOption{}
			if cmd.Flags().Changed("operations") {
				options = append(options, service.WithCreateOperationsOperations(app.ToAnySlice(operations)))
			}

			result, err := service.CreateOperations(transactionId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID.")
	_ = cmd.MarkFlagRequired("transaction-id")
	cmd.Flags().StringArrayVar(&operations, "operations", nil, "Array of staged operations.")
	return cmd
}

func newTablesDBGetCommand() *cobra.Command {
	var databaseId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a database by its unique ID. This endpoint response returns a JSON object with the database metadata.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			result, err := service.Get(databaseId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	return cmd
}

func newTablesDBUpdateCommand() *cobra.Command {
	var databaseId string
	var name string
	var enabled bool
	var specification string
	var replicas int
	var syncMode string

	cmd := &cobra.Command{
		Use:   "update",
		Short: "Update a database by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateName(name))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateEnabled(enabled))
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

			result, err := service.Update(databaseId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&name, "name", "", "Database name. Max length: 128 chars.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is database enabled? When set to 'disabled', users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&specification, "specification", "", "Database specification. Resizing between dedicated specifications changes cpu, memory, storage and the connection ceiling via a rolling cutover with zero downtime. Moving a `serverless` database onto a dedicated specification is a data migration, not a resize.")
	cmd.Flags().IntVar(&replicas, "replicas", 0, "Number of high availability replicas (0-5) for the dedicated database backing this database. Only valid when the database is backed by a dedicated specification. High availability is enabled when greater than 0.")
	cmd.Flags().StringVar(&syncMode, "sync-mode", "", "Replication sync mode for the dedicated database backing this database. Only valid when the database is backed by a dedicated specification; the mode is only in force once there is at least one replica. Allowed values: async, sync, quorum.")
	return cmd
}

func newTablesDBDeleteCommand() *cobra.Command {
	var databaseId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a database by its unique ID. Only API keys with with databases.write scope can delete a database.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			result, err := service.Delete(databaseId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	return cmd
}

func newTablesDBCreateFailoverCommand() *cobra.Command {
	var databaseId string
	var targetReplicaId string

	cmd := &cobra.Command{
		Use:   "create-failover",
		Short: "Trigger a manual failover for a dedicated database with high availability enabled. Promotes a replica to primary. The failover runs asynchronously; poll the database document for status updates. A database left mid-operation by a failover that did not finish also accepts this call as a repair, provided `targetReplicaId` names the member to promote.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateFailoverOption{}
			if cmd.Flags().Changed("target-replica-id") {
				options = append(options, service.WithCreateFailoverTargetReplicaId(targetReplicaId))
			}

			result, err := service.CreateFailover(databaseId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&targetReplicaId, "target-replica-id", "", "Target replica ID to promote. If not specified, the healthiest replica is selected.")
	return cmd
}

func newTablesDBListOperationsCommand() *cobra.Command {
	var databaseId string
	var status string
	var limit int
	var offset int

	cmd := &cobra.Command{
		Use:   "list-operations",
		Short: "List the lifecycle operations recorded for a dedicated database, newest first. Every provision, update, restore, backup and replication action is recorded here with its outcome, including an attempt that was abandoned because another worker took over the database.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.ListOperationsOption{}
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
				return err
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

func newTablesDBGetReplicasCommand() *cobra.Command {
	var databaseId string

	cmd := &cobra.Command{
		Use:   "get-replicas",
		Short: "Get high availability status for a dedicated database. Returns replica statuses, replication lag, and sync mode.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			result, err := service.GetReplicas(databaseId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	return cmd
}

func newTablesDBGetStatusCommand() *cobra.Command {
	var databaseId string

	cmd := &cobra.Command{
		Use:   "get-status",
		Short: "Get real-time health and status information for a dedicated database. Returns health status, readiness, uptime, connection info, replica status, and volume information.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			result, err := service.GetStatus(databaseId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	return cmd
}

func newTablesDBListTablesCommand() *cobra.Command {
	var databaseId string
	var queries []string
	var search string
	var total bool
	var filter []string
	var where []string
	var sortAsc []string
	var sortDesc []string
	var limit int
	var offset int
	var cursorAfter string
	var cursorBefore string

	cmd := &cobra.Command{
		Use:   "list-tables",
		Short: "Get a list of all tables that belong to the provided databaseId. You can use the search parameter to filter your results.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

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

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.ListTablesOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListTablesQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListTablesSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListTablesTotal(total))
			}

			result, err := service.ListTables(databaseId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: name, enabled, rowSecurity")
	cmd.Flags().StringVar(&search, "search", "", "Search term to filter your list results. Max length: 256 chars.")
	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
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

func newTablesDBCreateTableCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var name string
	var permissions []string
	var rowSecurity bool
	var enabled bool
	var columns []string
	var indexes []string

	cmd := &cobra.Command{
		Use:   "create-table",
		Short: "Create a new Table. Before using this route, you should create a new database resource using either a server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateTableOption{}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithCreateTablePermissions(permissions))
			}
			if cmd.Flags().Changed("row-security") {
				options = append(options, service.WithCreateTableRowSecurity(rowSecurity))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateTableEnabled(enabled))
			}
			if cmd.Flags().Changed("columns") {
				options = append(options, service.WithCreateTableColumns(app.ToAnySlice(columns)))
			}
			if cmd.Flags().Changed("indexes") {
				options = append(options, service.WithCreateTableIndexes(app.ToAnySlice(indexes)))
			}

			result, err := service.CreateTable(databaseId, tableId, name, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Unique Id. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&name, "name", "", "Table name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permissions strings. By default, no user is granted with any permissions. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().BoolVar(&rowSecurity, "row-security", false, "Enables configuring permissions for individual rows. A user needs one of row or table level permissions to access a row. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().Lookup("row-security").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is table enabled? When set to 'disabled', users cannot access the table but Server SDKs with and API key can still read and write to the table. No data is lost when this is toggled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&columns, "columns", nil, "Array of column definitions to create. Each column should contain: key (string), type (string: string, integer, float, boolean, datetime, relationship), size (integer, required for string type), required (boolean, optional), default (mixed, optional), array (boolean, optional), and type-specific options.")
	cmd.Flags().StringArrayVar(&indexes, "indexes", nil, "Array of index definitions to create. Each index should contain: key (string), type (string: key, fulltext, unique, spatial), attributes (array of column keys), orders (array of ASC/DESC, optional), and lengths (array of integers, optional).")
	return cmd
}

func newTablesDBGetTableCommand() *cobra.Command {
	var databaseId string
	var tableId string

	cmd := &cobra.Command{
		Use:   "get-table",
		Short: "Get a table by its unique ID. This endpoint response returns a JSON object with the table metadata.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			result, err := service.GetTable(databaseId, tableId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	return cmd
}

func newTablesDBUpdateTableCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var name string
	var permissions []string
	var rowSecurity bool
	var enabled bool
	var purge bool

	cmd := &cobra.Command{
		Use:   "update-table",
		Short: "Update a table by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateTableOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateTableName(name))
			}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithUpdateTablePermissions(permissions))
			}
			if cmd.Flags().Changed("row-security") {
				options = append(options, service.WithUpdateTableRowSecurity(rowSecurity))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateTableEnabled(enabled))
			}
			if cmd.Flags().Changed("purge") {
				options = append(options, service.WithUpdateTablePurge(purge))
			}

			result, err := service.UpdateTable(databaseId, tableId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&name, "name", "", "Table name. Max length: 128 chars.")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permission strings. By default, the current permissions are inherited. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().BoolVar(&rowSecurity, "row-security", false, "Enables configuring permissions for individual rows. A user needs one of row or table-level permissions to access a row. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().Lookup("row-security").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is table enabled? When set to 'disabled', users cannot access the table but Server SDKs with and API key can still read and write to the table. No data is lost when this is toggled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&purge, "purge", false, "When true, purge all cached list responses for this table as part of the update. Use this to force readers to see fresh data immediately instead of waiting for the cache TTL to expire.")
	cmd.Flags().Lookup("purge").NoOptDefVal = "true"
	return cmd
}

func newTablesDBDeleteTableCommand() *cobra.Command {
	var databaseId string
	var tableId string

	cmd := &cobra.Command{
		Use:   "delete-table",
		Short: "Delete a table by its unique ID. Only users with write permissions have access to delete this resource.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			result, err := service.DeleteTable(databaseId, tableId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	return cmd
}

func newTablesDBListColumnsCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var queries []string
	var total bool
	var filter []string
	var where []string
	var sortAsc []string
	var sortDesc []string
	var limit int
	var offset int
	var cursorAfter string
	var cursorBefore string

	cmd := &cobra.Command{
		Use:   "list-columns",
		Short: "List columns in the table.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

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

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.ListColumnsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListColumnsQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListColumnsTotal(total))
			}

			result, err := service.ListColumns(databaseId, tableId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: key, type, size, required, array, status, error")
	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
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

func newTablesDBCreateBigIntColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var minArg int
	var maxArg int
	var xdefault int
	var array bool

	cmd := &cobra.Command{
		Use:   "create-big-int-column",
		Short: "Create a bigint column. Optionally, minimum and maximum values can be provided.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateBigIntColumnOption{}
			if cmd.Flags().Changed("min") {
				options = append(options, service.WithCreateBigIntColumnMin(minArg))
			}
			if cmd.Flags().Changed("max") {
				options = append(options, service.WithCreateBigIntColumnMax(maxArg))
			}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateBigIntColumnDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateBigIntColumnArray(array))
			}

			result, err := service.CreateBigIntColumn(databaseId, tableId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().IntVar(&minArg, "min", 0, "Minimum value")
	cmd.Flags().IntVar(&maxArg, "max", 0, "Maximum value")
	cmd.Flags().IntVar(&xdefault, "xdefault", 0, "Default value. Cannot be set when column is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is column an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newTablesDBUpdateBigIntColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault int
	var minArg int
	var maxArg int
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-big-int-column",
		Short: "Update a bigint column. Changing the `default` value will not update already existing rows.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateBigIntColumnOption{}
			if cmd.Flags().Changed("min") {
				options = append(options, service.WithUpdateBigIntColumnMin(minArg))
			}
			if cmd.Flags().Changed("max") {
				options = append(options, service.WithUpdateBigIntColumnMax(maxArg))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateBigIntColumnNewKey(newKey))
			}

			result, err := service.UpdateBigIntColumn(databaseId, tableId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().IntVar(&xdefault, "xdefault", 0, "Default value. Cannot be set when column is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().IntVar(&minArg, "min", 0, "Minimum value")
	cmd.Flags().IntVar(&maxArg, "max", 0, "Maximum value")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBCreateBooleanColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault bool
	var array bool

	cmd := &cobra.Command{
		Use:   "create-boolean-column",
		Short: "Create a boolean column.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateBooleanColumnOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateBooleanColumnDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateBooleanColumnArray(array))
			}

			result, err := service.CreateBooleanColumn(databaseId, tableId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().BoolVar(&xdefault, "xdefault", false, "Default value for column when not provided. Cannot be set when column is required.")
	cmd.Flags().Lookup("xdefault").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&array, "array", false, "Is column an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newTablesDBUpdateBooleanColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault bool
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-boolean-column",
		Short: "Update a boolean column. Changing the `default` value will not update already existing rows.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateBooleanColumnOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateBooleanColumnNewKey(newKey))
			}

			result, err := service.UpdateBooleanColumn(databaseId, tableId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().BoolVar(&xdefault, "xdefault", false, "Default value for column when not provided. Cannot be set when column is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBCreateDatetimeColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault string
	var array bool

	cmd := &cobra.Command{
		Use:   "create-datetime-column",
		Short: "Create a date time column according to the ISO 8601 standard.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateDatetimeColumnOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateDatetimeColumnDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateDatetimeColumnArray(array))
			}

			result, err := service.CreateDatetimeColumn(databaseId, tableId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for the column in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format. Cannot be set when column is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is column an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newTablesDBUpdateDatetimeColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-datetime-column",
		Short: "Update a date time column. Changing the `default` value will not update already existing rows.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateDatetimeColumnOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateDatetimeColumnNewKey(newKey))
			}

			result, err := service.UpdateDatetimeColumn(databaseId, tableId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for column when not provided. Cannot be set when column is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBCreateEmailColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault string
	var array bool

	cmd := &cobra.Command{
		Use:   "create-email-column",
		Short: "Create an email column.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateEmailColumnOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateEmailColumnDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateEmailColumnArray(array))
			}

			result, err := service.CreateEmailColumn(databaseId, tableId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for column when not provided. Cannot be set when column is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is column an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newTablesDBUpdateEmailColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-email-column",
		Short: "Update an email column. Changing the `default` value will not update already existing rows.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateEmailColumnOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateEmailColumnNewKey(newKey))
			}

			result, err := service.UpdateEmailColumn(databaseId, tableId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for column when not provided. Cannot be set when column is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBCreateEnumColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var elements []string
	var required bool
	var xdefault string
	var array bool

	cmd := &cobra.Command{
		Use:   "create-enum-column",
		Short: "Create an enumeration column. The `elements` param acts as a white-list of accepted values for this column.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateEnumColumnOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateEnumColumnDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateEnumColumnArray(array))
			}

			result, err := service.CreateEnumColumn(databaseId, tableId, key, elements, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().StringArrayVar(&elements, "elements", nil, "Array of enum values.")
	_ = cmd.MarkFlagRequired("elements")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for column when not provided. Cannot be set when column is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is column an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newTablesDBUpdateEnumColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var elements []string
	var required bool
	var xdefault string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-enum-column",
		Short: "Update an enum column. Changing the `default` value will not update already existing rows.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateEnumColumnOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateEnumColumnNewKey(newKey))
			}

			result, err := service.UpdateEnumColumn(databaseId, tableId, key, elements, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().StringArrayVar(&elements, "elements", nil, "Updated list of enum values.")
	_ = cmd.MarkFlagRequired("elements")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for column when not provided. Cannot be set when column is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBCreateFloatColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var minArg float64
	var maxArg float64
	var xdefault float64
	var array bool

	cmd := &cobra.Command{
		Use:   "create-float-column",
		Short: "Create a float column. Optionally, minimum and maximum values can be provided.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateFloatColumnOption{}
			if cmd.Flags().Changed("min") {
				options = append(options, service.WithCreateFloatColumnMin(minArg))
			}
			if cmd.Flags().Changed("max") {
				options = append(options, service.WithCreateFloatColumnMax(maxArg))
			}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateFloatColumnDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateFloatColumnArray(array))
			}

			result, err := service.CreateFloatColumn(databaseId, tableId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().Float64Var(&minArg, "min", 0, "Minimum value")
	cmd.Flags().Float64Var(&maxArg, "max", 0, "Maximum value")
	cmd.Flags().Float64Var(&xdefault, "xdefault", 0, "Default value. Cannot be set when required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is column an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newTablesDBUpdateFloatColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault float64
	var minArg float64
	var maxArg float64
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-float-column",
		Short: "Update a float column. Changing the `default` value will not update already existing rows.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateFloatColumnOption{}
			if cmd.Flags().Changed("min") {
				options = append(options, service.WithUpdateFloatColumnMin(minArg))
			}
			if cmd.Flags().Changed("max") {
				options = append(options, service.WithUpdateFloatColumnMax(maxArg))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateFloatColumnNewKey(newKey))
			}

			result, err := service.UpdateFloatColumn(databaseId, tableId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().Float64Var(&xdefault, "xdefault", 0, "Default value. Cannot be set when required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().Float64Var(&minArg, "min", 0, "Minimum value")
	cmd.Flags().Float64Var(&maxArg, "max", 0, "Maximum value")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBCreateIntegerColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var minArg int
	var maxArg int
	var xdefault int
	var array bool

	cmd := &cobra.Command{
		Use:   "create-integer-column",
		Short: "Create an integer column. Optionally, minimum and maximum values can be provided.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateIntegerColumnOption{}
			if cmd.Flags().Changed("min") {
				options = append(options, service.WithCreateIntegerColumnMin(minArg))
			}
			if cmd.Flags().Changed("max") {
				options = append(options, service.WithCreateIntegerColumnMax(maxArg))
			}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateIntegerColumnDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateIntegerColumnArray(array))
			}

			result, err := service.CreateIntegerColumn(databaseId, tableId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().IntVar(&minArg, "min", 0, "Minimum value")
	cmd.Flags().IntVar(&maxArg, "max", 0, "Maximum value")
	cmd.Flags().IntVar(&xdefault, "xdefault", 0, "Default value. Cannot be set when column is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is column an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newTablesDBUpdateIntegerColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault int
	var minArg int
	var maxArg int
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-integer-column",
		Short: "Update an integer column. Changing the `default` value will not update already existing rows.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateIntegerColumnOption{}
			if cmd.Flags().Changed("min") {
				options = append(options, service.WithUpdateIntegerColumnMin(minArg))
			}
			if cmd.Flags().Changed("max") {
				options = append(options, service.WithUpdateIntegerColumnMax(maxArg))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateIntegerColumnNewKey(newKey))
			}

			result, err := service.UpdateIntegerColumn(databaseId, tableId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().IntVar(&xdefault, "xdefault", 0, "Default value. Cannot be set when column is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().IntVar(&minArg, "min", 0, "Minimum value")
	cmd.Flags().IntVar(&maxArg, "max", 0, "Maximum value")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBCreateIpColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault string
	var array bool

	cmd := &cobra.Command{
		Use:   "create-ip-column",
		Short: "Create IP address column.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateIpColumnOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateIpColumnDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateIpColumnArray(array))
			}

			result, err := service.CreateIpColumn(databaseId, tableId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value. Cannot be set when column is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is column an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newTablesDBUpdateIpColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-ip-column",
		Short: "Update an ip column. Changing the `default` value will not update already existing rows.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateIpColumnOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateIpColumnNewKey(newKey))
			}

			result, err := service.UpdateIpColumn(databaseId, tableId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value. Cannot be set when column is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBCreateLineColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault []string

	cmd := &cobra.Command{
		Use:   "create-line-column",
		Short: "Create a geometric line column.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)
			xdefaultDecoded, err := app.DecodeSlice[[]interface{}](xdefault)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateLineColumnOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateLineColumnDefault(xdefaultDecoded))
			}

			result, err := service.CreateLineColumn(databaseId, tableId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the TablesDB service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringArrayVar(&xdefault, "xdefault", nil, "Default value for column when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when column is required.")
	return cmd
}

func newTablesDBUpdateLineColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault []string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-line-column",
		Short: "Update a line column. Changing the `default` value will not update already existing rows.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)
			xdefaultDecoded, err := app.DecodeSlice[[]interface{}](xdefault)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateLineColumnOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithUpdateLineColumnDefault(xdefaultDecoded))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateLineColumnNewKey(newKey))
			}

			result, err := service.UpdateLineColumn(databaseId, tableId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the TablesDB service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringArrayVar(&xdefault, "xdefault", nil, "Default value for column when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when column is required.")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBCreateLongtextColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault string
	var array bool
	var encrypt bool

	cmd := &cobra.Command{
		Use:   "create-longtext-column",
		Short: "Create a longtext column.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateLongtextColumnOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateLongtextColumnDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateLongtextColumnArray(array))
			}
			if cmd.Flags().Changed("encrypt") {
				options = append(options, service.WithCreateLongtextColumnEncrypt(encrypt))
			}

			result, err := service.CreateLongtextColumn(databaseId, tableId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for column when not provided. Cannot be set when column is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is column an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&encrypt, "encrypt", false, "Toggle encryption for the column. Encryption enhances security by not storing any plain text values in the database. However, encrypted columns cannot be queried.")
	cmd.Flags().Lookup("encrypt").NoOptDefVal = "true"
	return cmd
}

func newTablesDBUpdateLongtextColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-longtext-column",
		Short: "Update a longtext column. Changing the `default` value will not update already existing rows.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateLongtextColumnOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateLongtextColumnNewKey(newKey))
			}

			result, err := service.UpdateLongtextColumn(databaseId, tableId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for column when not provided. Cannot be set when column is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBCreateMediumtextColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault string
	var array bool
	var encrypt bool

	cmd := &cobra.Command{
		Use:   "create-mediumtext-column",
		Short: "Create a mediumtext column.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateMediumtextColumnOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateMediumtextColumnDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateMediumtextColumnArray(array))
			}
			if cmd.Flags().Changed("encrypt") {
				options = append(options, service.WithCreateMediumtextColumnEncrypt(encrypt))
			}

			result, err := service.CreateMediumtextColumn(databaseId, tableId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for column when not provided. Cannot be set when column is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is column an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&encrypt, "encrypt", false, "Toggle encryption for the column. Encryption enhances security by not storing any plain text values in the database. However, encrypted columns cannot be queried.")
	cmd.Flags().Lookup("encrypt").NoOptDefVal = "true"
	return cmd
}

func newTablesDBUpdateMediumtextColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-mediumtext-column",
		Short: "Update a mediumtext column. Changing the `default` value will not update already existing rows.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateMediumtextColumnOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateMediumtextColumnNewKey(newKey))
			}

			result, err := service.UpdateMediumtextColumn(databaseId, tableId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for column when not provided. Cannot be set when column is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBCreatePointColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault []string

	cmd := &cobra.Command{
		Use:   "create-point-column",
		Short: "Create a geometric point column.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)
			xdefaultDecoded, err := app.DecodeSlice[float64](xdefault)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreatePointColumnOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreatePointColumnDefault(xdefaultDecoded))
			}

			result, err := service.CreatePointColumn(databaseId, tableId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the TablesDB service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringArrayVar(&xdefault, "xdefault", nil, "Default value for column when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when column is required.")
	return cmd
}

func newTablesDBUpdatePointColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault []string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-point-column",
		Short: "Update a point column. Changing the `default` value will not update already existing rows.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)
			xdefaultDecoded, err := app.DecodeSlice[float64](xdefault)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdatePointColumnOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithUpdatePointColumnDefault(xdefaultDecoded))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdatePointColumnNewKey(newKey))
			}

			result, err := service.UpdatePointColumn(databaseId, tableId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the TablesDB service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringArrayVar(&xdefault, "xdefault", nil, "Default value for column when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when column is required.")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBCreatePolygonColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault []string

	cmd := &cobra.Command{
		Use:   "create-polygon-column",
		Short: "Create a geometric polygon column.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)
			xdefaultDecoded, err := app.DecodeSlice[[]interface{}](xdefault)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreatePolygonColumnOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreatePolygonColumnDefault(xdefaultDecoded))
			}

			result, err := service.CreatePolygonColumn(databaseId, tableId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the TablesDB service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringArrayVar(&xdefault, "xdefault", nil, "Default value for column when not provided, three-dimensional array where the outer array holds one or more linear rings, [[[longitude, latitude], …], …], the first ring is the exterior boundary, any additional rings are interior holes, and each ring must start and end with the same coordinate pair. Cannot be set when column is required.")
	return cmd
}

func newTablesDBUpdatePolygonColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault []string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-polygon-column",
		Short: "Update a polygon column. Changing the `default` value will not update already existing rows.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)
			xdefaultDecoded, err := app.DecodeSlice[[]interface{}](xdefault)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdatePolygonColumnOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithUpdatePolygonColumnDefault(xdefaultDecoded))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdatePolygonColumnNewKey(newKey))
			}

			result, err := service.UpdatePolygonColumn(databaseId, tableId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the TablesDB service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringArrayVar(&xdefault, "xdefault", nil, "Default value for column when not provided, three-dimensional array where the outer array holds one or more linear rings, [[[longitude, latitude], …], …], the first ring is the exterior boundary, any additional rings are interior holes, and each ring must start and end with the same coordinate pair. Cannot be set when column is required.")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBCreateRelationshipColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var relatedTableId string
	var typeArg string
	var twoWay bool
	var key string
	var twoWayKey string
	var onDelete string

	cmd := &cobra.Command{
		Use:   "create-relationship-column",
		Short: "Create relationship column. Learn more about relationship columns (https://appwrite.io/docs/databases-relationships#relationship-columns).\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateRelationshipColumnOption{}
			if cmd.Flags().Changed("two-way") {
				options = append(options, service.WithCreateRelationshipColumnTwoWay(twoWay))
			}
			if cmd.Flags().Changed("key") {
				options = append(options, service.WithCreateRelationshipColumnKey(key))
			}
			if cmd.Flags().Changed("two-way-key") {
				options = append(options, service.WithCreateRelationshipColumnTwoWayKey(twoWayKey))
			}
			if cmd.Flags().Changed("on-delete") {
				options = append(options, service.WithCreateRelationshipColumnOnDelete(onDelete))
			}

			result, err := service.CreateRelationshipColumn(databaseId, tableId, relatedTableId, typeArg, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&relatedTableId, "related-table-id", "", "Related Table ID.")
	_ = cmd.MarkFlagRequired("related-table-id")
	cmd.Flags().StringVar(&typeArg, "type", "", "Relation type")
	_ = cmd.MarkFlagRequired("type")
	cmd.Flags().BoolVar(&twoWay, "two-way", false, "Is Two Way?")
	cmd.Flags().Lookup("two-way").NoOptDefVal = "true"
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	cmd.Flags().StringVar(&twoWayKey, "two-way-key", "", "Two Way Column Key.")
	cmd.Flags().StringVar(&onDelete, "on-delete", "", "Constraints option")
	return cmd
}

func newTablesDBCreateStringColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var size int
	var required bool
	var xdefault string
	var array bool
	var encrypt bool

	cmd := &cobra.Command{
		Use:   "create-string-column",
		Short: "Create a string column.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateStringColumnOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateStringColumnDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateStringColumnArray(array))
			}
			if cmd.Flags().Changed("encrypt") {
				options = append(options, service.WithCreateStringColumnEncrypt(encrypt))
			}

			result, err := service.CreateStringColumn(databaseId, tableId, key, size, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().IntVar(&size, "size", 0, "Column size for text columns, in number of characters.")
	_ = cmd.MarkFlagRequired("size")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for column when not provided. Cannot be set when column is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is column an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&encrypt, "encrypt", false, "Toggle encryption for the column. Encryption enhances security by not storing any plain text values in the database. However, encrypted columns cannot be queried.")
	cmd.Flags().Lookup("encrypt").NoOptDefVal = "true"
	return cmd
}

func newTablesDBUpdateStringColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault string
	var size int
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-string-column",
		Short: "Update a string column. Changing the `default` value will not update already existing rows.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateStringColumnOption{}
			if cmd.Flags().Changed("size") {
				options = append(options, service.WithUpdateStringColumnSize(size))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateStringColumnNewKey(newKey))
			}

			result, err := service.UpdateStringColumn(databaseId, tableId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for column when not provided. Cannot be set when column is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().IntVar(&size, "size", 0, "Maximum size of the string column.")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBCreateTextColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault string
	var array bool
	var encrypt bool

	cmd := &cobra.Command{
		Use:   "create-text-column",
		Short: "Create a text column.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateTextColumnOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateTextColumnDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateTextColumnArray(array))
			}
			if cmd.Flags().Changed("encrypt") {
				options = append(options, service.WithCreateTextColumnEncrypt(encrypt))
			}

			result, err := service.CreateTextColumn(databaseId, tableId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for column when not provided. Cannot be set when column is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is column an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&encrypt, "encrypt", false, "Toggle encryption for the column. Encryption enhances security by not storing any plain text values in the database. However, encrypted columns cannot be queried.")
	cmd.Flags().Lookup("encrypt").NoOptDefVal = "true"
	return cmd
}

func newTablesDBUpdateTextColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-text-column",
		Short: "Update a text column. Changing the `default` value will not update already existing rows.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateTextColumnOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateTextColumnNewKey(newKey))
			}

			result, err := service.UpdateTextColumn(databaseId, tableId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for column when not provided. Cannot be set when column is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBCreateUrlColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault string
	var array bool

	cmd := &cobra.Command{
		Use:   "create-url-column",
		Short: "Create a URL column.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateUrlColumnOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateUrlColumnDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateUrlColumnArray(array))
			}

			result, err := service.CreateUrlColumn(databaseId, tableId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for column when not provided. Cannot be set when column is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is column an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newTablesDBUpdateUrlColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-url-column",
		Short: "Update an url column. Changing the `default` value will not update already existing rows.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateUrlColumnOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateUrlColumnNewKey(newKey))
			}

			result, err := service.UpdateUrlColumn(databaseId, tableId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for column when not provided. Cannot be set when column is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBCreateVarcharColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var size int
	var required bool
	var xdefault string
	var array bool
	var encrypt bool

	cmd := &cobra.Command{
		Use:   "create-varchar-column",
		Short: "Create a varchar column.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateVarcharColumnOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateVarcharColumnDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateVarcharColumnArray(array))
			}
			if cmd.Flags().Changed("encrypt") {
				options = append(options, service.WithCreateVarcharColumnEncrypt(encrypt))
			}

			result, err := service.CreateVarcharColumn(databaseId, tableId, key, size, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().IntVar(&size, "size", 0, "Column size for varchar columns, in number of characters. Maximum size is 16381.")
	_ = cmd.MarkFlagRequired("size")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for column when not provided. Cannot be set when column is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is column an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&encrypt, "encrypt", false, "Toggle encryption for the column. Encryption enhances security by not storing any plain text values in the database. However, encrypted columns cannot be queried.")
	cmd.Flags().Lookup("encrypt").NoOptDefVal = "true"
	return cmd
}

func newTablesDBUpdateVarcharColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var required bool
	var xdefault string
	var size int
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-varchar-column",
		Short: "Update a varchar column. Changing the `default` value will not update already existing rows.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateVarcharColumnOption{}
			if cmd.Flags().Changed("size") {
				options = append(options, service.WithUpdateVarcharColumnSize(size))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateVarcharColumnNewKey(newKey))
			}

			result, err := service.UpdateVarcharColumn(databaseId, tableId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is column required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for column when not provided. Cannot be set when column is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().IntVar(&size, "size", 0, "Maximum size of the varchar column.")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBGetColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string

	cmd := &cobra.Command{
		Use:   "get-column",
		Short: "Get column by ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			result, err := service.GetColumn(databaseId, tableId, key)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	return cmd
}

func newTablesDBDeleteColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string

	cmd := &cobra.Command{
		Use:   "delete-column",
		Short: "Deletes a column.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			result, err := service.DeleteColumn(databaseId, tableId, key)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	return cmd
}

func newTablesDBUpdateRelationshipColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var onDelete string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-relationship-column",
		Short: "Update relationship column. Learn more about relationship columns (https://appwrite.io/docs/databases-relationships#relationship-columns).\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateRelationshipColumnOption{}
			if cmd.Flags().Changed("on-delete") {
				options = append(options, service.WithUpdateRelationshipColumnOnDelete(onDelete))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateRelationshipColumnNewKey(newKey))
			}

			result, err := service.UpdateRelationshipColumn(databaseId, tableId, key, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Column Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().StringVar(&onDelete, "on-delete", "", "Constraints option")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Column Key.")
	return cmd
}

func newTablesDBListIndexesCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var queries []string
	var total bool
	var filter []string
	var where []string
	var sortAsc []string
	var sortDesc []string
	var limit int
	var offset int
	var cursorAfter string
	var cursorBefore string

	cmd := &cobra.Command{
		Use:   "list-indexes",
		Short: "List indexes on the table.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

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

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.ListIndexesOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListIndexesQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListIndexesTotal(total))
			}

			result, err := service.ListIndexes(databaseId, tableId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: key, type, status, attributes, error")
	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
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

func newTablesDBCreateIndexCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string
	var typeArg string
	var columns []string
	var orders []string
	var lengths []string

	cmd := &cobra.Command{
		Use:   "create-index",
		Short: "Creates an index on the columns listed. Your index should include all the columns you will query in a single request.\nType can be `key`, `fulltext`, or `unique`.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)
			lengthsDecoded, err := app.DecodeSlice[int](lengths)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateIndexOption{}
			if cmd.Flags().Changed("orders") {
				options = append(options, service.WithCreateIndexOrders(orders))
			}
			if cmd.Flags().Changed("lengths") {
				options = append(options, service.WithCreateIndexLengths(lengthsDecoded))
			}

			result, err := service.CreateIndex(databaseId, tableId, key, typeArg, columns, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Index Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().StringVar(&typeArg, "type", "", "Index type.")
	_ = cmd.MarkFlagRequired("type")
	cmd.Flags().StringArrayVar(&columns, "columns", nil, "Array of columns to index. Maximum of 100 columns are allowed, each 32 characters long.")
	_ = cmd.MarkFlagRequired("columns")
	cmd.Flags().StringArrayVar(&orders, "orders", nil, "Array of index orders. Maximum of 100 orders are allowed.")
	cmd.Flags().StringArrayVar(&lengths, "lengths", nil, "Length of index. Maximum of 100")
	return cmd
}

func newTablesDBGetIndexCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string

	cmd := &cobra.Command{
		Use:   "get-index",
		Short: "Get index by ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			result, err := service.GetIndex(databaseId, tableId, key)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Index Key.")
	_ = cmd.MarkFlagRequired("key")
	return cmd
}

func newTablesDBDeleteIndexCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var key string

	cmd := &cobra.Command{
		Use:   "delete-index",
		Short: "Delete an index.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			result, err := service.DeleteIndex(databaseId, tableId, key)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the TablesDB service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&key, "key", "", "Index Key.")
	_ = cmd.MarkFlagRequired("key")
	return cmd
}

func newTablesDBListRowsCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var queries []string
	var transactionId string
	var total bool
	var ttl int
	var filter []string
	var where []string
	var sortAsc []string
	var sortDesc []string
	var limit int
	var offset int
	var cursorAfter string
	var cursorBefore string
	var selectAttributes []string

	cmd := &cobra.Command{
		Use:   "list-rows",
		Short: "Get a list of all the user's rows in a given table. You can use the query params to filter your results.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

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
				Select:       selectAttributes,
			})
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.ListRowsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListRowsQueries(queries))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithListRowsTransactionId(transactionId))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListRowsTotal(total))
			}
			if cmd.Flags().Changed("ttl") {
				options = append(options, service.WithListRowsTtl(ttl))
			}

			result, err := service.ListRows(databaseId, tableId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the TablesDB service server integration (https://appwrite.io/docs/products/databases/tables#create-table).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID to read uncommitted changes within the transaction.")
	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
	cmd.Flags().IntVar(&ttl, "ttl", 0, "TTL (seconds) for caching list responses. Responses are stored in an in-memory key-value cache, keyed per project, table, schema version (columns and indexes), caller authorization roles, and the exact query — so users with different permissions never share cached entries. Schema changes invalidate cached entries automatically; row writes do not, so choose a TTL you are comfortable serving as stale data. Set to 0 to disable caching. Must be between 0 and 86400 (24 hours).")
	cmd.Flags().StringArrayVar(&filter, "filter", nil, "Filter using a simple comparison expression. Repeat for multiple filters. Supports field=value, field!=value, field>value, field>=value, field<value, and field<=value.")
	cmd.Flags().StringArrayVar(&where, "where", nil, "Deprecated. Use --filter instead. Filter using a simple comparison expression. Repeat for multiple filters.")
	cmd.Flags().StringArrayVar(&sortAsc, "sort-asc", nil, "Sort results by an attribute in ascending order. Repeat for multiple sort fields.")
	cmd.Flags().StringArrayVar(&sortDesc, "sort-desc", nil, "Sort results by an attribute in descending order. Repeat for multiple sort fields.")
	cmd.Flags().IntVar(&limit, "limit", 0, "Maximum number of results to return.")
	cmd.Flags().IntVar(&offset, "offset", 0, "Number of results to skip.")
	cmd.Flags().StringVar(&cursorAfter, "cursor-after", "", "Return results after this cursor ID.")
	cmd.Flags().StringVar(&cursorBefore, "cursor-before", "", "Return results before this cursor ID.")
	cmd.Flags().StringArrayVar(&selectAttributes, "select", nil, "Attribute to include in the response. Repeat for multiple attributes.")
	return cmd
}

func newTablesDBCreateRowCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var rowId string
	var data string
	var permissions []string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "create-row",
		Short: "Create a new Row. Before using this route, you should create a new table resource using either a server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)
			dataValue, err := app.JSONObject(data)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateRowOption{}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithCreateRowPermissions(permissions))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithCreateRowTransactionId(transactionId))
			}

			result, err := service.CreateRow(databaseId, tableId, rowId, dataValue, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable). Make sure to define columns before creating rows.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&rowId, "row-id", "", "Row ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("row-id")
	cmd.Flags().StringVar(&data, "data", "", "Row data as JSON object.")
	_ = cmd.MarkFlagRequired("data")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permissions strings. By default, only the current user is granted all permissions. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newTablesDBCreateRowsCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var rows []string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "create-rows",
		Short: "Create new Rows. Before using this route, you should create a new table resource using either a server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.CreateRowsOption{}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithCreateRowsTransactionId(transactionId))
			}

			result, err := service.CreateRows(databaseId, tableId, app.ToAnySlice(rows), options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable). Make sure to define columns before creating rows.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringArrayVar(&rows, "rows", nil, "Array of rows data as JSON objects.")
	_ = cmd.MarkFlagRequired("rows")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newTablesDBUpsertRowsCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var rows []string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "upsert-rows",
		Short: "Create or update Rows. Before using this route, you should create a new table resource using either a server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpsertRowsOption{}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithUpsertRowsTransactionId(transactionId))
			}

			result, err := service.UpsertRows(databaseId, tableId, app.ToAnySlice(rows), options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringArrayVar(&rows, "rows", nil, "Array of row data as JSON objects. May contain partial rows.")
	_ = cmd.MarkFlagRequired("rows")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newTablesDBUpdateRowsCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var data string
	var queries []string
	var transactionId string
	var filter []string
	var where []string
	var sortAsc []string
	var sortDesc []string
	var limit int
	var offset int
	var cursorAfter string
	var cursorBefore string

	cmd := &cobra.Command{
		Use:   "update-rows",
		Short: "Update all rows that match your queries, if no queries are submitted then all rows are updated. You can pass only specific fields to be updated.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)
			dataValue, err := app.JSONObject(data)
			if err != nil {
				return err
			}

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

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateRowsOption{}
			if cmd.Flags().Changed("data") {
				options = append(options, service.WithUpdateRowsData(dataValue))
			}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithUpdateRowsQueries(queries))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithUpdateRowsTransactionId(transactionId))
			}

			result, err := service.UpdateRows(databaseId, tableId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&data, "data", "", "Row data as JSON object. Include only column and value pairs to be updated.")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
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

func newTablesDBDeleteRowsCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var queries []string
	var transactionId string
	var filter []string
	var where []string
	var sortAsc []string
	var sortDesc []string
	var limit int
	var offset int
	var cursorAfter string
	var cursorBefore string

	cmd := &cobra.Command{
		Use:   "delete-rows",
		Short: "Bulk delete rows using queries, if no queries are passed then all rows are deleted.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

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

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.DeleteRowsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithDeleteRowsQueries(queries))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithDeleteRowsTransactionId(transactionId))
			}

			result, err := service.DeleteRows(databaseId, tableId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
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

func newTablesDBGetRowCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var rowId string
	var queries []string
	var transactionId string
	var selectAttributes []string

	cmd := &cobra.Command{
		Use:   "get-row",
		Short: "Get a row by its unique ID. This endpoint response returns a JSON object with the row data.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			queries, err := query.Build(query.Options{
				Queries: queries,
				Select:  selectAttributes,
			})
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.GetRowOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithGetRowQueries(queries))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithGetRowTransactionId(transactionId))
			}

			result, err := service.GetRow(databaseId, tableId, rowId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&rowId, "row-id", "", "Row ID.")
	_ = cmd.MarkFlagRequired("row-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID to read uncommitted changes within the transaction.")
	cmd.Flags().StringArrayVar(&selectAttributes, "select", nil, "Attribute to include in the response. Repeat for multiple attributes.")
	return cmd
}

func newTablesDBUpsertRowCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var rowId string
	var data string
	var permissions []string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "upsert-row",
		Short: "Create or update a Row. Before using this route, you should create a new table resource using either a server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable) API or directly from your database console.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)
			dataValue, err := app.JSONObject(data)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpsertRowOption{}
			if cmd.Flags().Changed("data") {
				options = append(options, service.WithUpsertRowData(dataValue))
			}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithUpsertRowPermissions(permissions))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithUpsertRowTransactionId(transactionId))
			}

			result, err := service.UpsertRow(databaseId, tableId, rowId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&rowId, "row-id", "", "Row ID.")
	_ = cmd.MarkFlagRequired("row-id")
	cmd.Flags().StringVar(&data, "data", "", "Row data as JSON object. Include all required columns of the row to be created or updated.")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permissions strings. By default, the current permissions are inherited. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newTablesDBUpdateRowCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var rowId string
	var data string
	var permissions []string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "update-row",
		Short: "Update a row by its unique ID. Using the patch method you can pass only specific fields that will get updated.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)
			dataValue, err := app.JSONObject(data)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.UpdateRowOption{}
			if cmd.Flags().Changed("data") {
				options = append(options, service.WithUpdateRowData(dataValue))
			}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithUpdateRowPermissions(permissions))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithUpdateRowTransactionId(transactionId))
			}

			result, err := service.UpdateRow(databaseId, tableId, rowId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&rowId, "row-id", "", "Row ID.")
	_ = cmd.MarkFlagRequired("row-id")
	cmd.Flags().StringVar(&data, "data", "", "Row data as JSON object. Include only columns and value pairs to be updated.")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permissions strings. By default, the current permissions are inherited. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newTablesDBDeleteRowCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var rowId string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "delete-row",
		Short: "Delete a row by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.DeleteRowOption{}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithDeleteRowTransactionId(transactionId))
			}

			result, err := service.DeleteRow(databaseId, tableId, rowId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/references/cloud/server-dart/tablesDB#createTable).")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&rowId, "row-id", "", "Row ID.")
	_ = cmd.MarkFlagRequired("row-id")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newTablesDBDecrementRowColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var rowId string
	var column string
	var value float64
	var minArg float64
	var transactionId string

	cmd := &cobra.Command{
		Use:   "decrement-row-column",
		Short: "Decrement a specific column of a row by a given value.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.DecrementRowColumnOption{}
			if cmd.Flags().Changed("value") {
				options = append(options, service.WithDecrementRowColumnValue(value))
			}
			if cmd.Flags().Changed("min") {
				options = append(options, service.WithDecrementRowColumnMin(minArg))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithDecrementRowColumnTransactionId(transactionId))
			}

			result, err := service.DecrementRowColumn(databaseId, tableId, rowId, column, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&rowId, "row-id", "", "Row ID.")
	_ = cmd.MarkFlagRequired("row-id")
	cmd.Flags().StringVar(&column, "column", "", "Column key.")
	_ = cmd.MarkFlagRequired("column")
	cmd.Flags().Float64Var(&value, "value", 0, "Value to increment the column by. The value must be a number.")
	cmd.Flags().Float64Var(&minArg, "min", 0, "Minimum value for the column. If the current value is lesser than this value, an exception will be thrown.")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newTablesDBIncrementRowColumnCommand() *cobra.Command {
	var databaseId string
	var tableId string
	var rowId string
	var column string
	var value float64
	var maxArg float64
	var transactionId string

	cmd := &cobra.Command{
		Use:   "increment-row-column",
		Short: "Increment a specific column of a row by a given value.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tablesdb.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tablesdb.IncrementRowColumnOption{}
			if cmd.Flags().Changed("value") {
				options = append(options, service.WithIncrementRowColumnValue(value))
			}
			if cmd.Flags().Changed("max") {
				options = append(options, service.WithIncrementRowColumnMax(maxArg))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithIncrementRowColumnTransactionId(transactionId))
			}

			result, err := service.IncrementRowColumn(databaseId, tableId, rowId, column, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&tableId, "table-id", "", "Table ID.")
	_ = cmd.MarkFlagRequired("table-id")
	cmd.Flags().StringVar(&rowId, "row-id", "", "Row ID.")
	_ = cmd.MarkFlagRequired("row-id")
	cmd.Flags().StringVar(&column, "column", "", "Column key.")
	_ = cmd.MarkFlagRequired("column")
	cmd.Flags().Float64Var(&value, "value", 0, "Value to increment the column by. The value must be a number.")
	cmd.Flags().Float64Var(&maxArg, "max", 0, "Maximum value for the column. If the current value is greater than this value, an error will be thrown.")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}
