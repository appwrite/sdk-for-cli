package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v7/documentsdb"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewDocumentsDBCommand builds the `documentsdb` command tree.
func NewDocumentsDBCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "documentsdb",
		Short: "",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			return cmd.Help()
		},
	}

	cmd.AddCommand(newDocumentsDBListCommand())
	cmd.AddCommand(newDocumentsDBCreateCommand())
	cmd.AddCommand(newDocumentsDBListSpecificationsCommand())
	cmd.AddCommand(newDocumentsDBListTransactionsCommand())
	cmd.AddCommand(newDocumentsDBCreateTransactionCommand())
	cmd.AddCommand(newDocumentsDBGetTransactionCommand())
	cmd.AddCommand(newDocumentsDBUpdateTransactionCommand())
	cmd.AddCommand(newDocumentsDBDeleteTransactionCommand())
	cmd.AddCommand(newDocumentsDBCreateOperationsCommand())
	cmd.AddCommand(newDocumentsDBGetCommand())
	cmd.AddCommand(newDocumentsDBUpdateCommand())
	cmd.AddCommand(newDocumentsDBDeleteCommand())
	cmd.AddCommand(newDocumentsDBListCollectionsCommand())
	cmd.AddCommand(newDocumentsDBCreateCollectionCommand())
	cmd.AddCommand(newDocumentsDBGetCollectionCommand())
	cmd.AddCommand(newDocumentsDBUpdateCollectionCommand())
	cmd.AddCommand(newDocumentsDBDeleteCollectionCommand())
	cmd.AddCommand(newDocumentsDBListDocumentsCommand())
	cmd.AddCommand(newDocumentsDBCreateDocumentCommand())
	cmd.AddCommand(newDocumentsDBCreateDocumentsCommand())
	cmd.AddCommand(newDocumentsDBUpsertDocumentsCommand())
	cmd.AddCommand(newDocumentsDBUpdateDocumentsCommand())
	cmd.AddCommand(newDocumentsDBDeleteDocumentsCommand())
	cmd.AddCommand(newDocumentsDBGetDocumentCommand())
	cmd.AddCommand(newDocumentsDBUpsertDocumentCommand())
	cmd.AddCommand(newDocumentsDBUpdateDocumentCommand())
	cmd.AddCommand(newDocumentsDBDeleteDocumentCommand())
	cmd.AddCommand(newDocumentsDBDecrementDocumentAttributeCommand())
	cmd.AddCommand(newDocumentsDBIncrementDocumentAttributeCommand())
	cmd.AddCommand(newDocumentsDBListIndexesCommand())
	cmd.AddCommand(newDocumentsDBCreateIndexCommand())
	cmd.AddCommand(newDocumentsDBGetIndexCommand())
	cmd.AddCommand(newDocumentsDBDeleteIndexCommand())
	cmd.AddCommand(newDocumentsDBCreateFailoverCommand())
	cmd.AddCommand(newDocumentsDBListOperationsCommand())
	cmd.AddCommand(newDocumentsDBGetReplicasCommand())
	cmd.AddCommand(newDocumentsDBGetStatusCommand())

	return cmd
}

func newDocumentsDBListCommand() *cobra.Command {
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
		Use:   "list",
		Short: "Get a list of all databases from the current Appwrite project. You can use the search parameter to filter your results.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

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
			options := []documentsdb.ListOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListTotal(total))
			}

			result, err := service.List(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following columns: name")
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

func newDocumentsDBCreateCommand() *cobra.Command {
	var databaseId string
	var name string
	var enabled bool
	var specification string
	var replicas int
	var syncMode string

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create a new Database.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.CreateOption{}
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
				return sdk.WrapMutationError("POST", err)
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

func newDocumentsDBListSpecificationsCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-specifications",
		Short: "List the dedicated database specifications available on the current plan. Each specification reports its resource limits, its own prices and overage rates, and whether it is enabled for the organization.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

			result, err := service.ListSpecifications()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newDocumentsDBListTransactionsCommand() *cobra.Command {
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
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

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
			options := []documentsdb.ListTransactionsOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListTransactionsQueries(queries))
			}

			result, err := service.ListTransactions(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
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

func newDocumentsDBCreateTransactionCommand() *cobra.Command {
	var ttl int

	cmd := &cobra.Command{
		Use:   "create-transaction",
		Short: "Create a new transaction.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.CreateTransactionOption{}
			if cmd.Flags().Changed("ttl") {
				options = append(options, service.WithCreateTransactionTtl(ttl))
			}

			result, err := service.CreateTransaction(options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().IntVar(&ttl, "ttl", 0, "Seconds before the transaction expires.")
	return cmd
}

func newDocumentsDBGetTransactionCommand() *cobra.Command {
	var transactionId string

	cmd := &cobra.Command{
		Use:   "get-transaction",
		Short: "Get a transaction by its unique ID.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

			result, err := service.GetTransaction(transactionId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID.")
	_ = cmd.MarkFlagRequired("transaction-id")
	return cmd
}

func newDocumentsDBUpdateTransactionCommand() *cobra.Command {
	var transactionId string
	var commit bool
	var rollback bool

	cmd := &cobra.Command{
		Use:   "update-transaction",
		Short: "Update a transaction, to either commit or roll back its operations.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.UpdateTransactionOption{}
			if cmd.Flags().Changed("commit") {
				options = append(options, service.WithUpdateTransactionCommit(commit))
			}
			if cmd.Flags().Changed("rollback") {
				options = append(options, service.WithUpdateTransactionRollback(rollback))
			}

			result, err := service.UpdateTransaction(transactionId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
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

func newDocumentsDBDeleteTransactionCommand() *cobra.Command {
	var transactionId string

	cmd := &cobra.Command{
		Use:   "delete-transaction",
		Short: "Delete a transaction by its unique ID.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

			result, err := service.DeleteTransaction(transactionId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID.")
	_ = cmd.MarkFlagRequired("transaction-id")
	return cmd
}

func newDocumentsDBCreateOperationsCommand() *cobra.Command {
	var transactionId string
	var operations []string

	cmd := &cobra.Command{
		Use:   "create-operations",
		Short: "Create multiple operations in a single transaction.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)
			operationsDecoded, err := app.DecodeSlice[interface{}](operations)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.CreateOperationsOption{}
			if cmd.Flags().Changed("operations") {
				options = append(options, service.WithCreateOperationsOperations(operationsDecoded))
			}

			result, err := service.CreateOperations(transactionId, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID.")
	_ = cmd.MarkFlagRequired("transaction-id")
	cmd.Flags().StringArrayVar(&operations, "operations", nil, "Array of staged operations.")
	return cmd
}

func newDocumentsDBGetCommand() *cobra.Command {
	var databaseId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a database by its unique ID. This endpoint response returns a JSON object with the database metadata.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

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

func newDocumentsDBUpdateCommand() *cobra.Command {
	var databaseId string
	var name string
	var enabled bool
	var specification string
	var replicas int
	var syncMode string

	cmd := &cobra.Command{
		Use:   "update",
		Short: "Update a database by its unique ID.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.UpdateOption{}
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

			result, err := service.Update(databaseId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&name, "name", "", "Database name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is database enabled? When set to 'disabled', users cannot access the database but Server SDKs with an API key can still read and write to the database. No data is lost when this is toggled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&specification, "specification", "", "Database specification. Resizing between dedicated specifications changes cpu, memory, storage and the connection ceiling via a rolling cutover with zero downtime. Moving a `serverless` database onto a dedicated specification is a data migration, not a resize.")
	cmd.Flags().IntVar(&replicas, "replicas", 0, "Number of high availability replicas (0-5) for the dedicated database backing this database. Only valid when the database is backed by a dedicated specification. High availability is enabled when greater than 0.")
	cmd.Flags().StringVar(&syncMode, "sync-mode", "", "Replication sync mode for the dedicated database backing this database. Only valid when the database is backed by a dedicated specification; the mode is only in force once there is at least one replica. Allowed values: async, sync, quorum.")
	return cmd
}

func newDocumentsDBDeleteCommand() *cobra.Command {
	var databaseId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a database by its unique ID. Only API keys with with databases.write scope can delete a database.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

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

func newDocumentsDBListCollectionsCommand() *cobra.Command {
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
		Use:   "list-collections",
		Short: "Get a list of all collections that belong to the provided databaseId. You can use the search parameter to filter your results.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

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
			options := []documentsdb.ListCollectionsOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListCollectionsQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListCollectionsSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListCollectionsTotal(total))
			}

			result, err := service.ListCollections(databaseId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, documentSecurity")
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

func newDocumentsDBCreateCollectionCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var name string
	var permissions []string
	var documentSecurity bool
	var enabled bool
	var attributes []string
	var indexes []string

	cmd := &cobra.Command{
		Use:   "create-collection",
		Short: "Create a new Collection. Before using this route, you should create a new database resource using either a server integration (https://appwrite.io/docs/server/databases#documentsDBCreateCollection) API or directly from your database console.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)
			attributesDecoded, err := app.DecodeSlice[interface{}](attributes)
			if err != nil {
				return err
			}
			indexesDecoded, err := app.DecodeSlice[interface{}](indexes)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.CreateCollectionOption{}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithCreateCollectionPermissions(permissions))
			}
			if cmd.Flags().Changed("document-security") {
				options = append(options, service.WithCreateCollectionDocumentSecurity(documentSecurity))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateCollectionEnabled(enabled))
			}
			if cmd.Flags().Changed("attributes") {
				options = append(options, service.WithCreateCollectionAttributes(attributesDecoded))
			}
			if cmd.Flags().Changed("indexes") {
				options = append(options, service.WithCreateCollectionIndexes(indexesDecoded))
			}

			result, err := service.CreateCollection(databaseId, collectionId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Unique Id. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&name, "name", "", "Collection name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permissions strings. By default, no user is granted with any permissions. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().BoolVar(&documentSecurity, "document-security", false, "Enables configuring permissions for individual documents. A user needs one of document or collection level permissions to access a document. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().Lookup("document-security").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is collection enabled? When set to 'disabled', users cannot access the collection but Server SDKs with and API key can still read and write to the collection. No data is lost when this is toggled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&attributes, "attributes", nil, "Array of attribute definitions to create. Each attribute should contain: key (string), type (string: string, varchar, text, mediumtext, longtext, integer, bigint, double, boolean, datetime, point, linestring, polygon, email, url, ip, enum), size (integer, required for string and varchar types), required (boolean, optional), default (mixed, optional), array (boolean, optional), and type-specific options.")
	cmd.Flags().StringArrayVar(&indexes, "indexes", nil, "Array of index definitions to create. Each index should contain: key (string), type (string: key, fulltext, unique, spatial), attributes (array of attribute keys), orders (array of ASC/DESC, optional), and lengths (array of integers, optional).")
	return cmd
}

func newDocumentsDBGetCollectionCommand() *cobra.Command {
	var databaseId string
	var collectionId string

	cmd := &cobra.Command{
		Use:   "get-collection",
		Short: "Get a collection by its unique ID. This endpoint response returns a JSON object with the collection metadata.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

			result, err := service.GetCollection(databaseId, collectionId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	return cmd
}

func newDocumentsDBUpdateCollectionCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var name string
	var permissions []string
	var documentSecurity bool
	var enabled bool
	var purge bool

	cmd := &cobra.Command{
		Use:   "update-collection",
		Short: "Update a collection by its unique ID.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.UpdateCollectionOption{}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithUpdateCollectionPermissions(permissions))
			}
			if cmd.Flags().Changed("document-security") {
				options = append(options, service.WithUpdateCollectionDocumentSecurity(documentSecurity))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateCollectionEnabled(enabled))
			}
			if cmd.Flags().Changed("purge") {
				options = append(options, service.WithUpdateCollectionPurge(purge))
			}

			result, err := service.UpdateCollection(databaseId, collectionId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&name, "name", "", "Collection name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permission strings. By default, the current permissions are inherited. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().BoolVar(&documentSecurity, "document-security", false, "Enables configuring permissions for individual documents. A user needs one of document or collection level permissions to access a document. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().Lookup("document-security").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is collection enabled? When set to 'disabled', users cannot access the collection but Server SDKs with and API key can still read and write to the collection. No data is lost when this is toggled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&purge, "purge", false, "When true, purge all cached list responses for this collection as part of the update. Use this to force readers to see fresh data immediately instead of waiting for the cache TTL to expire.")
	cmd.Flags().Lookup("purge").NoOptDefVal = "true"
	return cmd
}

func newDocumentsDBDeleteCollectionCommand() *cobra.Command {
	var databaseId string
	var collectionId string

	cmd := &cobra.Command{
		Use:   "delete-collection",
		Short: "Delete a collection by its unique ID. Only users with write permissions have access to delete this resource.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

			result, err := service.DeleteCollection(databaseId, collectionId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	return cmd
}

func newDocumentsDBListDocumentsCommand() *cobra.Command {
	var databaseId string
	var collectionId string
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
		Use:   "list-documents",
		Short: "Get a list of all the user's documents in a given collection. You can use the query params to filter your results.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

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

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.ListDocumentsOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListDocumentsQueries(queries))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithListDocumentsTransactionId(transactionId))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListDocumentsTotal(total))
			}
			if cmd.Flags().Changed("ttl") {
				options = append(options, service.WithListDocumentsTtl(ttl))
			}

			result, err := service.ListDocuments(databaseId, collectionId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID to read uncommitted changes within the transaction.")
	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
	cmd.Flags().IntVar(&ttl, "ttl", 0, "TTL (seconds) for cached responses when caching is enabled for select queries. Must be between 0 and 86400 (24 hours).")
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

func newDocumentsDBCreateDocumentCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documentId string
	var data string
	var permissions []string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "create-document",
		Short: "Create a new Document. Before using this route, you should create a new collection resource using either a server integration (https://appwrite.io/docs/server/databases#documentsDBCreateCollection) API or directly from your database console.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)
			dataValue, err := app.JSONObject(data)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.CreateDocumentOption{}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithCreateDocumentPermissions(permissions))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithCreateDocumentTransactionId(transactionId))
			}

			result, err := service.CreateDocument(databaseId, collectionId, documentId, dataValue, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&documentId, "document-id", "", "Document ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("document-id")
	cmd.Flags().StringVar(&data, "data", "", "Document data as JSON object.")
	_ = cmd.MarkFlagRequired("data")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permissions strings. By default, only the current user is granted all permissions. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newDocumentsDBCreateDocumentsCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documents []string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "create-documents",
		Short: "Create new Documents. Before using this route, you should create a new collection resource using either a server integration (https://appwrite.io/docs/server/databases#documentsDBCreateCollection) API or directly from your database console.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)
			documentsDecoded, err := app.DecodeSlice[interface{}](documents)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.CreateDocumentsOption{}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithCreateDocumentsTransactionId(transactionId))
			}

			result, err := service.CreateDocuments(databaseId, collectionId, documentsDecoded, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection). Make sure to define attributes before creating documents.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringArrayVar(&documents, "documents", nil, "Array of documents data as JSON objects.")
	_ = cmd.MarkFlagRequired("documents")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newDocumentsDBUpsertDocumentsCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documents []string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "upsert-documents",
		Short: "Create or update Documents. Before using this route, you should create a new collection resource using either a server integration (https://appwrite.io/docs/server/databases#documentsDBCreateCollection) API or directly from your database console.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)
			documentsDecoded, err := app.DecodeSlice[interface{}](documents)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.UpsertDocumentsOption{}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithUpsertDocumentsTransactionId(transactionId))
			}

			result, err := service.UpsertDocuments(databaseId, collectionId, documentsDecoded, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringArrayVar(&documents, "documents", nil, "Array of document data as JSON objects. May contain partial documents.")
	_ = cmd.MarkFlagRequired("documents")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newDocumentsDBUpdateDocumentsCommand() *cobra.Command {
	var databaseId string
	var collectionId string
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
		Use:   "update-documents",
		Short: "Update all documents that match your queries, if no queries are submitted then all documents are updated. You can pass only specific fields to be updated.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)
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

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.UpdateDocumentsOption{}
			if cmd.Flags().Changed("data") {
				options = append(options, service.WithUpdateDocumentsData(dataValue))
			}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithUpdateDocumentsQueries(queries))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithUpdateDocumentsTransactionId(transactionId))
			}

			result, err := service.UpdateDocuments(databaseId, collectionId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&data, "data", "", "Document data as JSON object. Include only attribute and value pairs to be updated.")
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

func newDocumentsDBDeleteDocumentsCommand() *cobra.Command {
	var databaseId string
	var collectionId string
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
		Use:   "delete-documents",
		Short: "Bulk delete documents using queries, if no queries are passed then all documents are deleted.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

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
			options := []documentsdb.DeleteDocumentsOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithDeleteDocumentsQueries(queries))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithDeleteDocumentsTransactionId(transactionId))
			}

			result, err := service.DeleteDocuments(databaseId, collectionId, options...)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
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

func newDocumentsDBGetDocumentCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documentId string
	var queries []string
	var transactionId string
	var selectAttributes []string

	cmd := &cobra.Command{
		Use:   "get-document",
		Short: "Get a document by its unique ID. This endpoint response returns a JSON object with the document data.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

			queries, err := query.Build(query.Options{
				Queries: queries,
				Select:  selectAttributes,
			})
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.GetDocumentOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithGetDocumentQueries(queries))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithGetDocumentTransactionId(transactionId))
			}

			result, err := service.GetDocument(databaseId, collectionId, documentId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&documentId, "document-id", "", "Document ID.")
	_ = cmd.MarkFlagRequired("document-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID to read uncommitted changes within the transaction.")
	cmd.Flags().StringArrayVar(&selectAttributes, "select", nil, "Attribute to include in the response. Repeat for multiple attributes.")
	return cmd
}

func newDocumentsDBUpsertDocumentCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documentId string
	var data string
	var permissions []string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "upsert-document",
		Short: "Create or update a Document. Before using this route, you should create a new collection resource using either a server integration (https://appwrite.io/docs/server/databases#documentsDBCreateCollection) API or directly from your database console.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)
			dataValue, err := app.JSONObject(data)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.UpsertDocumentOption{}
			if cmd.Flags().Changed("data") {
				options = append(options, service.WithUpsertDocumentData(dataValue))
			}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithUpsertDocumentPermissions(permissions))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithUpsertDocumentTransactionId(transactionId))
			}

			result, err := service.UpsertDocument(databaseId, collectionId, documentId, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&documentId, "document-id", "", "Document ID.")
	_ = cmd.MarkFlagRequired("document-id")
	cmd.Flags().StringVar(&data, "data", "", "Document data as JSON object. Include all required fields of the document to be created or updated.")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permissions strings. By default, the current permissions are inherited. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newDocumentsDBUpdateDocumentCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documentId string
	var data string
	var permissions []string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "update-document",
		Short: "Update a document by its unique ID. Using the patch method you can pass only specific fields that will get updated.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)
			dataValue, err := app.JSONObject(data)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.UpdateDocumentOption{}
			if cmd.Flags().Changed("data") {
				options = append(options, service.WithUpdateDocumentData(dataValue))
			}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithUpdateDocumentPermissions(permissions))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithUpdateDocumentTransactionId(transactionId))
			}

			result, err := service.UpdateDocument(databaseId, collectionId, documentId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&documentId, "document-id", "", "Document ID.")
	_ = cmd.MarkFlagRequired("document-id")
	cmd.Flags().StringVar(&data, "data", "", "Document data as JSON object. Include only fields and value pairs to be updated.")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permissions strings. By default, the current permissions are inherited. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newDocumentsDBDeleteDocumentCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documentId string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "delete-document",
		Short: "Delete a document by its unique ID.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.DeleteDocumentOption{}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithDeleteDocumentTransactionId(transactionId))
			}

			result, err := service.DeleteDocument(databaseId, collectionId, documentId, options...)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&documentId, "document-id", "", "Document ID.")
	_ = cmd.MarkFlagRequired("document-id")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newDocumentsDBDecrementDocumentAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documentId string
	var attribute string
	var value float64
	var minArg float64
	var transactionId string

	cmd := &cobra.Command{
		Use:   "decrement-document-attribute",
		Short: "Decrement a specific column of a row by a given value.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.DecrementDocumentAttributeOption{}
			if cmd.Flags().Changed("value") {
				options = append(options, service.WithDecrementDocumentAttributeValue(value))
			}
			if cmd.Flags().Changed("min") {
				options = append(options, service.WithDecrementDocumentAttributeMin(minArg))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithDecrementDocumentAttributeTransactionId(transactionId))
			}

			result, err := service.DecrementDocumentAttribute(databaseId, collectionId, documentId, attribute, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&documentId, "document-id", "", "Document ID.")
	_ = cmd.MarkFlagRequired("document-id")
	cmd.Flags().StringVar(&attribute, "attribute", "", "Attribute key.")
	_ = cmd.MarkFlagRequired("attribute")
	cmd.Flags().Float64Var(&value, "value", 0, "Value to decrement the attribute by. The value must be a number.")
	cmd.Flags().Float64Var(&minArg, "min", 0, "Minimum value for the attribute. If the current value is lesser than this value, an exception will be thrown.")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newDocumentsDBIncrementDocumentAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documentId string
	var attribute string
	var value float64
	var maxArg float64
	var transactionId string

	cmd := &cobra.Command{
		Use:   "increment-document-attribute",
		Short: "Increment a specific column of a row by a given value.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.IncrementDocumentAttributeOption{}
			if cmd.Flags().Changed("value") {
				options = append(options, service.WithIncrementDocumentAttributeValue(value))
			}
			if cmd.Flags().Changed("max") {
				options = append(options, service.WithIncrementDocumentAttributeMax(maxArg))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithIncrementDocumentAttributeTransactionId(transactionId))
			}

			result, err := service.IncrementDocumentAttribute(databaseId, collectionId, documentId, attribute, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&documentId, "document-id", "", "Document ID.")
	_ = cmd.MarkFlagRequired("document-id")
	cmd.Flags().StringVar(&attribute, "attribute", "", "Attribute key.")
	_ = cmd.MarkFlagRequired("attribute")
	cmd.Flags().Float64Var(&value, "value", 0, "Value to increment the attribute by. The value must be a number.")
	cmd.Flags().Float64Var(&maxArg, "max", 0, "Maximum value for the attribute. If the current value is greater than this value, an error will be thrown.")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newDocumentsDBListIndexesCommand() *cobra.Command {
	var databaseId string
	var collectionId string
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
		Short: "List indexes in the collection.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

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
			options := []documentsdb.ListIndexesOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListIndexesQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListIndexesTotal(total))
			}

			result, err := service.ListIndexes(databaseId, collectionId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, status, attributes, error")
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

func newDocumentsDBCreateIndexCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var typeArg string
	var attributes []string
	var orders []string
	var lengths []string

	cmd := &cobra.Command{
		Use:   "create-index",
		Short: "Creates an index on the attributes listed. Your index should include all the attributes you will query in a single request.\nAttributes can be `key`, `fulltext`, and `unique`.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)
			lengthsDecoded, err := app.DecodeSlice[int](lengths)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.CreateIndexOption{}
			if cmd.Flags().Changed("orders") {
				options = append(options, service.WithCreateIndexOrders(orders))
			}
			if cmd.Flags().Changed("lengths") {
				options = append(options, service.WithCreateIndexLengths(lengthsDecoded))
			}

			result, err := service.CreateIndex(databaseId, collectionId, key, typeArg, attributes, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Index Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().StringVar(&typeArg, "type", "", "Index type.")
	_ = cmd.MarkFlagRequired("type")
	cmd.Flags().StringArrayVar(&attributes, "attributes", nil, "Array of attributes to index. Maximum of 100 attributes are allowed, each 32 characters long.")
	_ = cmd.MarkFlagRequired("attributes")
	cmd.Flags().StringArrayVar(&orders, "orders", nil, "Array of index orders. Maximum of 100 orders are allowed.")
	cmd.Flags().StringArrayVar(&lengths, "lengths", nil, "Length of index. Maximum of 100")
	return cmd
}

func newDocumentsDBGetIndexCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string

	cmd := &cobra.Command{
		Use:   "get-index",
		Short: "Get index by ID.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

			result, err := service.GetIndex(databaseId, collectionId, key)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Index Key.")
	_ = cmd.MarkFlagRequired("key")
	return cmd
}

func newDocumentsDBDeleteIndexCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string

	cmd := &cobra.Command{
		Use:   "delete-index",
		Short: "Delete an index.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := documentsdb.New(client)

			result, err := service.DeleteIndex(databaseId, collectionId, key)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Index Key.")
	_ = cmd.MarkFlagRequired("key")
	return cmd
}

func newDocumentsDBCreateFailoverCommand() *cobra.Command {
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
			service := documentsdb.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.CreateFailoverOption{}
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

func newDocumentsDBListOperationsCommand() *cobra.Command {
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
			service := documentsdb.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []documentsdb.ListOperationsOption{}
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

func newDocumentsDBGetReplicasCommand() *cobra.Command {
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
			service := documentsdb.New(client)

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

func newDocumentsDBGetStatusCommand() *cobra.Command {
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
			service := documentsdb.New(client)

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
