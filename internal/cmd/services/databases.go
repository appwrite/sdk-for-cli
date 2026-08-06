package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/databases"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
)

// NewDatabasesCommand builds the `databases` command tree.
func NewDatabasesCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "databases",
		Short: "The Databases service allows you to create structured collections of documents, query and filter lists of documents",
	}

	cmd.AddCommand(newDatabasesListCommand())
	cmd.AddCommand(newDatabasesCreateCommand())
	cmd.AddCommand(newDatabasesListTransactionsCommand())
	cmd.AddCommand(newDatabasesCreateTransactionCommand())
	cmd.AddCommand(newDatabasesGetTransactionCommand())
	cmd.AddCommand(newDatabasesUpdateTransactionCommand())
	cmd.AddCommand(newDatabasesDeleteTransactionCommand())
	cmd.AddCommand(newDatabasesCreateOperationsCommand())
	cmd.AddCommand(newDatabasesGetCommand())
	cmd.AddCommand(newDatabasesUpdateCommand())
	cmd.AddCommand(newDatabasesDeleteCommand())
	cmd.AddCommand(newDatabasesListCollectionsCommand())
	cmd.AddCommand(newDatabasesCreateCollectionCommand())
	cmd.AddCommand(newDatabasesGetCollectionCommand())
	cmd.AddCommand(newDatabasesUpdateCollectionCommand())
	cmd.AddCommand(newDatabasesDeleteCollectionCommand())
	cmd.AddCommand(newDatabasesListAttributesCommand())
	cmd.AddCommand(newDatabasesCreateBigIntAttributeCommand())
	cmd.AddCommand(newDatabasesUpdateBigIntAttributeCommand())
	cmd.AddCommand(newDatabasesCreateBooleanAttributeCommand())
	cmd.AddCommand(newDatabasesUpdateBooleanAttributeCommand())
	cmd.AddCommand(newDatabasesCreateDatetimeAttributeCommand())
	cmd.AddCommand(newDatabasesUpdateDatetimeAttributeCommand())
	cmd.AddCommand(newDatabasesCreateEmailAttributeCommand())
	cmd.AddCommand(newDatabasesUpdateEmailAttributeCommand())
	cmd.AddCommand(newDatabasesCreateEnumAttributeCommand())
	cmd.AddCommand(newDatabasesUpdateEnumAttributeCommand())
	cmd.AddCommand(newDatabasesCreateFloatAttributeCommand())
	cmd.AddCommand(newDatabasesUpdateFloatAttributeCommand())
	cmd.AddCommand(newDatabasesCreateIntegerAttributeCommand())
	cmd.AddCommand(newDatabasesUpdateIntegerAttributeCommand())
	cmd.AddCommand(newDatabasesCreateIpAttributeCommand())
	cmd.AddCommand(newDatabasesUpdateIpAttributeCommand())
	cmd.AddCommand(newDatabasesCreateLineAttributeCommand())
	cmd.AddCommand(newDatabasesUpdateLineAttributeCommand())
	cmd.AddCommand(newDatabasesCreateLongtextAttributeCommand())
	cmd.AddCommand(newDatabasesUpdateLongtextAttributeCommand())
	cmd.AddCommand(newDatabasesCreateMediumtextAttributeCommand())
	cmd.AddCommand(newDatabasesUpdateMediumtextAttributeCommand())
	cmd.AddCommand(newDatabasesCreatePointAttributeCommand())
	cmd.AddCommand(newDatabasesUpdatePointAttributeCommand())
	cmd.AddCommand(newDatabasesCreatePolygonAttributeCommand())
	cmd.AddCommand(newDatabasesUpdatePolygonAttributeCommand())
	cmd.AddCommand(newDatabasesCreateRelationshipAttributeCommand())
	cmd.AddCommand(newDatabasesUpdateRelationshipAttributeCommand())
	cmd.AddCommand(newDatabasesCreateStringAttributeCommand())
	cmd.AddCommand(newDatabasesUpdateStringAttributeCommand())
	cmd.AddCommand(newDatabasesCreateTextAttributeCommand())
	cmd.AddCommand(newDatabasesUpdateTextAttributeCommand())
	cmd.AddCommand(newDatabasesCreateUrlAttributeCommand())
	cmd.AddCommand(newDatabasesUpdateUrlAttributeCommand())
	cmd.AddCommand(newDatabasesCreateVarcharAttributeCommand())
	cmd.AddCommand(newDatabasesUpdateVarcharAttributeCommand())
	cmd.AddCommand(newDatabasesGetAttributeCommand())
	cmd.AddCommand(newDatabasesDeleteAttributeCommand())
	cmd.AddCommand(newDatabasesListDocumentsCommand())
	cmd.AddCommand(newDatabasesCreateDocumentCommand())
	cmd.AddCommand(newDatabasesCreateDocumentsCommand())
	cmd.AddCommand(newDatabasesUpsertDocumentsCommand())
	cmd.AddCommand(newDatabasesUpdateDocumentsCommand())
	cmd.AddCommand(newDatabasesDeleteDocumentsCommand())
	cmd.AddCommand(newDatabasesGetDocumentCommand())
	cmd.AddCommand(newDatabasesUpsertDocumentCommand())
	cmd.AddCommand(newDatabasesUpdateDocumentCommand())
	cmd.AddCommand(newDatabasesDeleteDocumentCommand())
	cmd.AddCommand(newDatabasesDecrementDocumentAttributeCommand())
	cmd.AddCommand(newDatabasesIncrementDocumentAttributeCommand())
	cmd.AddCommand(newDatabasesListIndexesCommand())
	cmd.AddCommand(newDatabasesCreateIndexCommand())
	cmd.AddCommand(newDatabasesGetIndexCommand())
	cmd.AddCommand(newDatabasesDeleteIndexCommand())

	return cmd
}

func newDatabasesListCommand() *cobra.Command {
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
			service := databases.New(client)

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
			options := []databases.ListOption{}
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

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name")
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

func newDatabasesCreateCommand() *cobra.Command {
	var databaseId string
	var name string
	var enabled bool

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create a new Database.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateOption{}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateEnabled(enabled))
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
	return cmd
}

func newDatabasesListTransactionsCommand() *cobra.Command {
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
			service := databases.New(client)

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
			options := []databases.ListTransactionsOption{}
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

func newDatabasesCreateTransactionCommand() *cobra.Command {
	var ttl int

	cmd := &cobra.Command{
		Use:   "create-transaction",
		Short: "Create a new transaction.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateTransactionOption{}
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

func newDatabasesGetTransactionCommand() *cobra.Command {
	var transactionId string

	cmd := &cobra.Command{
		Use:   "get-transaction",
		Short: "Get a transaction by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

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

func newDatabasesUpdateTransactionCommand() *cobra.Command {
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
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateTransactionOption{}
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

func newDatabasesDeleteTransactionCommand() *cobra.Command {
	var transactionId string

	cmd := &cobra.Command{
		Use:   "delete-transaction",
		Short: "Delete a transaction by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

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

func newDatabasesCreateOperationsCommand() *cobra.Command {
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
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateOperationsOption{}
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

func newDatabasesGetCommand() *cobra.Command {
	var databaseId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a database by its unique ID. This endpoint response returns a JSON object with the database metadata.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

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

func newDatabasesUpdateCommand() *cobra.Command {
	var databaseId string
	var name string
	var enabled bool

	cmd := &cobra.Command{
		Use:   "update",
		Short: "Update a database by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateName(name))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateEnabled(enabled))
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
	return cmd
}

func newDatabasesDeleteCommand() *cobra.Command {
	var databaseId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a database by its unique ID. Only API keys with with databases.write scope can delete a database.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

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

func newDatabasesListCollectionsCommand() *cobra.Command {
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
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

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
			options := []databases.ListCollectionsOption{}
			if cmd.Flags().Changed("queries") {
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
				return err
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

func newDatabasesCreateCollectionCommand() *cobra.Command {
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
		Short: "Create a new Collection. Before using this route, you should create a new database resource using either a server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateCollectionOption{}
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
				options = append(options, service.WithCreateCollectionAttributes(app.ToAnySlice(attributes)))
			}
			if cmd.Flags().Changed("indexes") {
				options = append(options, service.WithCreateCollectionIndexes(app.ToAnySlice(indexes)))
			}

			result, err := service.CreateCollection(databaseId, collectionId, name, options...)
			if err != nil {
				return err
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
	cmd.Flags().StringArrayVar(&attributes, "attributes", nil, "Array of attribute definitions to create. Each attribute should contain: key (string), type (string: string, integer, float, boolean, datetime), size (integer, required for string type), required (boolean, optional), default (mixed, optional), array (boolean, optional), and type-specific options.")
	cmd.Flags().StringArrayVar(&indexes, "indexes", nil, "Array of index definitions to create. Each index should contain: key (string), type (string: key, fulltext, unique, spatial), attributes (array of attribute keys), orders (array of ASC/DESC, optional), and lengths (array of integers, optional).")
	return cmd
}

func newDatabasesGetCollectionCommand() *cobra.Command {
	var databaseId string
	var collectionId string

	cmd := &cobra.Command{
		Use:   "get-collection",
		Short: "Get a collection by its unique ID. This endpoint response returns a JSON object with the collection metadata.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			result, err := service.GetCollection(databaseId, collectionId)
			if err != nil {
				return err
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

func newDatabasesUpdateCollectionCommand() *cobra.Command {
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
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateCollectionOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateCollectionName(name))
			}
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

			result, err := service.UpdateCollection(databaseId, collectionId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&name, "name", "", "Collection name. Max length: 128 chars.")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permission strings. By default, the current permissions are inherited. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().BoolVar(&documentSecurity, "document-security", false, "Enables configuring permissions for individual documents. A user needs one of document or collection level permissions to access a document. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().Lookup("document-security").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is collection enabled? When set to 'disabled', users cannot access the collection but Server SDKs with and API key can still read and write to the collection. No data is lost when this is toggled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&purge, "purge", false, "When true, purge all cached list responses for this collection as part of the update. Use this to force readers to see fresh data immediately instead of waiting for the cache TTL to expire.")
	cmd.Flags().Lookup("purge").NoOptDefVal = "true"
	return cmd
}

func newDatabasesDeleteCollectionCommand() *cobra.Command {
	var databaseId string
	var collectionId string

	cmd := &cobra.Command{
		Use:   "delete-collection",
		Short: "Delete a collection by its unique ID. Only users with write permissions have access to delete this resource.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			result, err := service.DeleteCollection(databaseId, collectionId)
			if err != nil {
				return err
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

func newDatabasesListAttributesCommand() *cobra.Command {
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
		Use:   "list-attributes",
		Short: "List attributes in the collection.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

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
			options := []databases.ListAttributesOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListAttributesQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListAttributesTotal(total))
			}

			result, err := service.ListAttributes(databaseId, collectionId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, type, size, required, array, status, error")
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

func newDatabasesCreateBigIntAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var minArg int
	var maxArg int
	var xdefault int
	var array bool

	cmd := &cobra.Command{
		Use:   "create-big-int-attribute",
		Short: "Create a bigint attribute. Optionally, minimum and maximum values can be provided.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateBigIntAttributeOption{}
			if cmd.Flags().Changed("min") {
				options = append(options, service.WithCreateBigIntAttributeMin(minArg))
			}
			if cmd.Flags().Changed("max") {
				options = append(options, service.WithCreateBigIntAttributeMax(maxArg))
			}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateBigIntAttributeDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateBigIntAttributeArray(array))
			}

			result, err := service.CreateBigIntAttribute(databaseId, collectionId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().IntVar(&minArg, "min", 0, "Minimum value")
	cmd.Flags().IntVar(&maxArg, "max", 0, "Maximum value")
	cmd.Flags().IntVar(&xdefault, "xdefault", 0, "Default value. Cannot be set when attribute is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is attribute an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newDatabasesUpdateBigIntAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault int
	var minArg int
	var maxArg int
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-big-int-attribute",
		Short: "Update a bigint attribute. Changing the `default` value will not update already existing documents.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateBigIntAttributeOption{}
			if cmd.Flags().Changed("min") {
				options = append(options, service.WithUpdateBigIntAttributeMin(minArg))
			}
			if cmd.Flags().Changed("max") {
				options = append(options, service.WithUpdateBigIntAttributeMax(maxArg))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateBigIntAttributeNewKey(newKey))
			}

			result, err := service.UpdateBigIntAttribute(databaseId, collectionId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().IntVar(&xdefault, "xdefault", 0, "Default value. Cannot be set when attribute is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().IntVar(&minArg, "min", 0, "Minimum value")
	cmd.Flags().IntVar(&maxArg, "max", 0, "Maximum value")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Attribute Key.")
	return cmd
}

func newDatabasesCreateBooleanAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault bool
	var array bool

	cmd := &cobra.Command{
		Use:   "create-boolean-attribute",
		Short: "Create a boolean attribute.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateBooleanAttributeOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateBooleanAttributeDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateBooleanAttributeArray(array))
			}

			result, err := service.CreateBooleanAttribute(databaseId, collectionId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().BoolVar(&xdefault, "xdefault", false, "Default value for attribute when not provided. Cannot be set when attribute is required.")
	cmd.Flags().Lookup("xdefault").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&array, "array", false, "Is attribute an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newDatabasesUpdateBooleanAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault bool
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-boolean-attribute",
		Short: "Update a boolean attribute. Changing the `default` value will not update already existing documents.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateBooleanAttributeOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateBooleanAttributeNewKey(newKey))
			}

			result, err := service.UpdateBooleanAttribute(databaseId, collectionId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#createCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().BoolVar(&xdefault, "xdefault", false, "Default value for attribute when not provided. Cannot be set when attribute is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New attribute key.")
	return cmd
}

func newDatabasesCreateDatetimeAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault string
	var array bool

	cmd := &cobra.Command{
		Use:   "create-datetime-attribute",
		Short: "Create a date time attribute according to the ISO 8601 standard.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateDatetimeAttributeOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateDatetimeAttributeDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateDatetimeAttributeArray(array))
			}

			result, err := service.CreateDatetimeAttribute(databaseId, collectionId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#createCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for the attribute in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format. Cannot be set when attribute is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is attribute an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newDatabasesUpdateDatetimeAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-datetime-attribute",
		Short: "Update a date time attribute. Changing the `default` value will not update already existing documents.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateDatetimeAttributeOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateDatetimeAttributeNewKey(newKey))
			}

			result, err := service.UpdateDatetimeAttribute(databaseId, collectionId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for attribute when not provided. Cannot be set when attribute is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New attribute key.")
	return cmd
}

func newDatabasesCreateEmailAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault string
	var array bool

	cmd := &cobra.Command{
		Use:   "create-email-attribute",
		Short: "Create an email attribute.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateEmailAttributeOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateEmailAttributeDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateEmailAttributeArray(array))
			}

			result, err := service.CreateEmailAttribute(databaseId, collectionId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for attribute when not provided. Cannot be set when attribute is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is attribute an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newDatabasesUpdateEmailAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-email-attribute",
		Short: "Update an email attribute. Changing the `default` value will not update already existing documents.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateEmailAttributeOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateEmailAttributeNewKey(newKey))
			}

			result, err := service.UpdateEmailAttribute(databaseId, collectionId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for attribute when not provided. Cannot be set when attribute is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Attribute Key.")
	return cmd
}

func newDatabasesCreateEnumAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var elements []string
	var required bool
	var xdefault string
	var array bool

	cmd := &cobra.Command{
		Use:   "create-enum-attribute",
		Short: "Create an enum attribute. The `elements` param acts as a white-list of accepted values for this attribute. \n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateEnumAttributeOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateEnumAttributeDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateEnumAttributeArray(array))
			}

			result, err := service.CreateEnumAttribute(databaseId, collectionId, key, elements, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().StringArrayVar(&elements, "elements", nil, "Array of enum values.")
	_ = cmd.MarkFlagRequired("elements")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for attribute when not provided. Cannot be set when attribute is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is attribute an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newDatabasesUpdateEnumAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var elements []string
	var required bool
	var xdefault string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-enum-attribute",
		Short: "Update an enum attribute. Changing the `default` value will not update already existing documents.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateEnumAttributeOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateEnumAttributeNewKey(newKey))
			}

			result, err := service.UpdateEnumAttribute(databaseId, collectionId, key, elements, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().StringArrayVar(&elements, "elements", nil, "Updated list of enum values.")
	_ = cmd.MarkFlagRequired("elements")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for attribute when not provided. Cannot be set when attribute is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Attribute Key.")
	return cmd
}

func newDatabasesCreateFloatAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var minArg float64
	var maxArg float64
	var xdefault float64
	var array bool

	cmd := &cobra.Command{
		Use:   "create-float-attribute",
		Short: "Create a float attribute. Optionally, minimum and maximum values can be provided.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateFloatAttributeOption{}
			if cmd.Flags().Changed("min") {
				options = append(options, service.WithCreateFloatAttributeMin(minArg))
			}
			if cmd.Flags().Changed("max") {
				options = append(options, service.WithCreateFloatAttributeMax(maxArg))
			}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateFloatAttributeDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateFloatAttributeArray(array))
			}

			result, err := service.CreateFloatAttribute(databaseId, collectionId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().Float64Var(&minArg, "min", 0, "Minimum value.")
	cmd.Flags().Float64Var(&maxArg, "max", 0, "Maximum value.")
	cmd.Flags().Float64Var(&xdefault, "xdefault", 0, "Default value. Cannot be set when required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is attribute an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newDatabasesUpdateFloatAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault float64
	var minArg float64
	var maxArg float64
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-float-attribute",
		Short: "Update a float attribute. Changing the `default` value will not update already existing documents.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateFloatAttributeOption{}
			if cmd.Flags().Changed("min") {
				options = append(options, service.WithUpdateFloatAttributeMin(minArg))
			}
			if cmd.Flags().Changed("max") {
				options = append(options, service.WithUpdateFloatAttributeMax(maxArg))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateFloatAttributeNewKey(newKey))
			}

			result, err := service.UpdateFloatAttribute(databaseId, collectionId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().Float64Var(&xdefault, "xdefault", 0, "Default value. Cannot be set when required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().Float64Var(&minArg, "min", 0, "Minimum value.")
	cmd.Flags().Float64Var(&maxArg, "max", 0, "Maximum value.")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Attribute Key.")
	return cmd
}

func newDatabasesCreateIntegerAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var minArg int
	var maxArg int
	var xdefault int
	var array bool

	cmd := &cobra.Command{
		Use:   "create-integer-attribute",
		Short: "Create an integer attribute. Optionally, minimum and maximum values can be provided.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateIntegerAttributeOption{}
			if cmd.Flags().Changed("min") {
				options = append(options, service.WithCreateIntegerAttributeMin(minArg))
			}
			if cmd.Flags().Changed("max") {
				options = append(options, service.WithCreateIntegerAttributeMax(maxArg))
			}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateIntegerAttributeDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateIntegerAttributeArray(array))
			}

			result, err := service.CreateIntegerAttribute(databaseId, collectionId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().IntVar(&minArg, "min", 0, "Minimum value")
	cmd.Flags().IntVar(&maxArg, "max", 0, "Maximum value")
	cmd.Flags().IntVar(&xdefault, "xdefault", 0, "Default value. Cannot be set when attribute is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is attribute an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newDatabasesUpdateIntegerAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault int
	var minArg int
	var maxArg int
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-integer-attribute",
		Short: "Update an integer attribute. Changing the `default` value will not update already existing documents.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateIntegerAttributeOption{}
			if cmd.Flags().Changed("min") {
				options = append(options, service.WithUpdateIntegerAttributeMin(minArg))
			}
			if cmd.Flags().Changed("max") {
				options = append(options, service.WithUpdateIntegerAttributeMax(maxArg))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateIntegerAttributeNewKey(newKey))
			}

			result, err := service.UpdateIntegerAttribute(databaseId, collectionId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().IntVar(&xdefault, "xdefault", 0, "Default value. Cannot be set when attribute is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().IntVar(&minArg, "min", 0, "Minimum value")
	cmd.Flags().IntVar(&maxArg, "max", 0, "Maximum value")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Attribute Key.")
	return cmd
}

func newDatabasesCreateIpAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault string
	var array bool

	cmd := &cobra.Command{
		Use:   "create-ip-attribute",
		Short: "Create IP address attribute.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateIpAttributeOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateIpAttributeDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateIpAttributeArray(array))
			}

			result, err := service.CreateIpAttribute(databaseId, collectionId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value. Cannot be set when attribute is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is attribute an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newDatabasesUpdateIpAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-ip-attribute",
		Short: "Update an ip attribute. Changing the `default` value will not update already existing documents.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateIpAttributeOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateIpAttributeNewKey(newKey))
			}

			result, err := service.UpdateIpAttribute(databaseId, collectionId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value. Cannot be set when attribute is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Attribute Key.")
	return cmd
}

func newDatabasesCreateLineAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault []string

	cmd := &cobra.Command{
		Use:   "create-line-attribute",
		Short: "Create a geometric line attribute.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)
			xdefaultDecoded, err := app.DecodeSlice[[]interface{}](xdefault)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateLineAttributeOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateLineAttributeDefault(xdefaultDecoded))
			}

			result, err := service.CreateLineAttribute(databaseId, collectionId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringArrayVar(&xdefault, "xdefault", nil, "Default value for attribute when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when attribute is required.")
	return cmd
}

func newDatabasesUpdateLineAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault []string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-line-attribute",
		Short: "Update a line attribute. Changing the `default` value will not update already existing documents.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)
			xdefaultDecoded, err := app.DecodeSlice[[]interface{}](xdefault)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateLineAttributeOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithUpdateLineAttributeDefault(xdefaultDecoded))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateLineAttributeNewKey(newKey))
			}

			result, err := service.UpdateLineAttribute(databaseId, collectionId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#createCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringArrayVar(&xdefault, "xdefault", nil, "Default value for attribute when not provided, two-dimensional array of coordinate pairs, [[longitude, latitude], [longitude, latitude], …], listing the vertices of the line in order. Cannot be set when attribute is required.")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New attribute key.")
	return cmd
}

func newDatabasesCreateLongtextAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault string
	var array bool
	var encrypt bool

	cmd := &cobra.Command{
		Use:   "create-longtext-attribute",
		Short: "Create a longtext attribute.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateLongtextAttributeOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateLongtextAttributeDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateLongtextAttributeArray(array))
			}
			if cmd.Flags().Changed("encrypt") {
				options = append(options, service.WithCreateLongtextAttributeEncrypt(encrypt))
			}

			result, err := service.CreateLongtextAttribute(databaseId, collectionId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for attribute when not provided. Cannot be set when attribute is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is attribute an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&encrypt, "encrypt", false, "Toggle encryption for the attribute. Encryption enhances security by not storing any plain text values in the database. However, encrypted attributes cannot be queried.")
	cmd.Flags().Lookup("encrypt").NoOptDefVal = "true"
	return cmd
}

func newDatabasesUpdateLongtextAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-longtext-attribute",
		Short: "Update a longtext attribute. Changing the `default` value will not update already existing documents.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateLongtextAttributeOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateLongtextAttributeNewKey(newKey))
			}

			result, err := service.UpdateLongtextAttribute(databaseId, collectionId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for attribute when not provided. Cannot be set when attribute is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Attribute Key.")
	return cmd
}

func newDatabasesCreateMediumtextAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault string
	var array bool
	var encrypt bool

	cmd := &cobra.Command{
		Use:   "create-mediumtext-attribute",
		Short: "Create a mediumtext attribute.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateMediumtextAttributeOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateMediumtextAttributeDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateMediumtextAttributeArray(array))
			}
			if cmd.Flags().Changed("encrypt") {
				options = append(options, service.WithCreateMediumtextAttributeEncrypt(encrypt))
			}

			result, err := service.CreateMediumtextAttribute(databaseId, collectionId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for attribute when not provided. Cannot be set when attribute is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is attribute an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&encrypt, "encrypt", false, "Toggle encryption for the attribute. Encryption enhances security by not storing any plain text values in the database. However, encrypted attributes cannot be queried.")
	cmd.Flags().Lookup("encrypt").NoOptDefVal = "true"
	return cmd
}

func newDatabasesUpdateMediumtextAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-mediumtext-attribute",
		Short: "Update a mediumtext attribute. Changing the `default` value will not update already existing documents.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateMediumtextAttributeOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateMediumtextAttributeNewKey(newKey))
			}

			result, err := service.UpdateMediumtextAttribute(databaseId, collectionId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for attribute when not provided. Cannot be set when attribute is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Attribute Key.")
	return cmd
}

func newDatabasesCreatePointAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault []string

	cmd := &cobra.Command{
		Use:   "create-point-attribute",
		Short: "Create a geometric point attribute.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)
			xdefaultDecoded, err := app.DecodeSlice[float64](xdefault)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreatePointAttributeOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreatePointAttributeDefault(xdefaultDecoded))
			}

			result, err := service.CreatePointAttribute(databaseId, collectionId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringArrayVar(&xdefault, "xdefault", nil, "Default value for attribute when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when attribute is required.")
	return cmd
}

func newDatabasesUpdatePointAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault []string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-point-attribute",
		Short: "Update a point attribute. Changing the `default` value will not update already existing documents.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)
			xdefaultDecoded, err := app.DecodeSlice[float64](xdefault)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdatePointAttributeOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithUpdatePointAttributeDefault(xdefaultDecoded))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdatePointAttributeNewKey(newKey))
			}

			result, err := service.UpdatePointAttribute(databaseId, collectionId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#createCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringArrayVar(&xdefault, "xdefault", nil, "Default value for attribute when not provided, array of two numbers [longitude, latitude], representing a single coordinate. Cannot be set when attribute is required.")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New attribute key.")
	return cmd
}

func newDatabasesCreatePolygonAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault []string

	cmd := &cobra.Command{
		Use:   "create-polygon-attribute",
		Short: "Create a geometric polygon attribute.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)
			xdefaultDecoded, err := app.DecodeSlice[[]interface{}](xdefault)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreatePolygonAttributeOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreatePolygonAttributeDefault(xdefaultDecoded))
			}

			result, err := service.CreatePolygonAttribute(databaseId, collectionId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringArrayVar(&xdefault, "xdefault", nil, "Default value for attribute when not provided, three-dimensional array where the outer array holds one or more linear rings, [[[longitude, latitude], …], …], the first ring is the exterior boundary, any additional rings are interior holes, and each ring must start and end with the same coordinate pair. Cannot be set when attribute is required.")
	return cmd
}

func newDatabasesUpdatePolygonAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault []string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-polygon-attribute",
		Short: "Update a polygon attribute. Changing the `default` value will not update already existing documents.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)
			xdefaultDecoded, err := app.DecodeSlice[[]interface{}](xdefault)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdatePolygonAttributeOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithUpdatePolygonAttributeDefault(xdefaultDecoded))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdatePolygonAttributeNewKey(newKey))
			}

			result, err := service.UpdatePolygonAttribute(databaseId, collectionId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#createCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringArrayVar(&xdefault, "xdefault", nil, "Default value for attribute when not provided, three-dimensional array where the outer array holds one or more linear rings, [[[longitude, latitude], …], …], the first ring is the exterior boundary, any additional rings are interior holes, and each ring must start and end with the same coordinate pair. Cannot be set when attribute is required.")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New attribute key.")
	return cmd
}

func newDatabasesCreateRelationshipAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var relatedCollectionId string
	var typeArg string
	var twoWay bool
	var key string
	var twoWayKey string
	var onDelete string

	cmd := &cobra.Command{
		Use:   "create-relationship-attribute",
		Short: "Create relationship attribute. Learn more about relationship attributes (https://appwrite.io/docs/databases-relationships#relationship-attributes).\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateRelationshipAttributeOption{}
			if cmd.Flags().Changed("two-way") {
				options = append(options, service.WithCreateRelationshipAttributeTwoWay(twoWay))
			}
			if cmd.Flags().Changed("key") {
				options = append(options, service.WithCreateRelationshipAttributeKey(key))
			}
			if cmd.Flags().Changed("two-way-key") {
				options = append(options, service.WithCreateRelationshipAttributeTwoWayKey(twoWayKey))
			}
			if cmd.Flags().Changed("on-delete") {
				options = append(options, service.WithCreateRelationshipAttributeOnDelete(onDelete))
			}

			result, err := service.CreateRelationshipAttribute(databaseId, collectionId, relatedCollectionId, typeArg, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&relatedCollectionId, "related-collection-id", "", "Related Collection ID.")
	_ = cmd.MarkFlagRequired("related-collection-id")
	cmd.Flags().StringVar(&typeArg, "type", "", "Relation type")
	_ = cmd.MarkFlagRequired("type")
	cmd.Flags().BoolVar(&twoWay, "two-way", false, "Is Two Way?")
	cmd.Flags().Lookup("two-way").NoOptDefVal = "true"
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	cmd.Flags().StringVar(&twoWayKey, "two-way-key", "", "Two Way Attribute Key.")
	cmd.Flags().StringVar(&onDelete, "on-delete", "", "Constraints option")
	return cmd
}

func newDatabasesUpdateRelationshipAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var onDelete string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-relationship-attribute",
		Short: "Update relationship attribute. Learn more about relationship attributes (https://appwrite.io/docs/databases-relationships#relationship-attributes).\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateRelationshipAttributeOption{}
			if cmd.Flags().Changed("on-delete") {
				options = append(options, service.WithUpdateRelationshipAttributeOnDelete(onDelete))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateRelationshipAttributeNewKey(newKey))
			}

			result, err := service.UpdateRelationshipAttribute(databaseId, collectionId, key, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().StringVar(&onDelete, "on-delete", "", "Constraints option")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Attribute Key.")
	return cmd
}

func newDatabasesCreateStringAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var size int
	var required bool
	var xdefault string
	var array bool
	var encrypt bool

	cmd := &cobra.Command{
		Use:   "create-string-attribute",
		Short: "Create a string attribute.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateStringAttributeOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateStringAttributeDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateStringAttributeArray(array))
			}
			if cmd.Flags().Changed("encrypt") {
				options = append(options, service.WithCreateStringAttributeEncrypt(encrypt))
			}

			result, err := service.CreateStringAttribute(databaseId, collectionId, key, size, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().IntVar(&size, "size", 0, "Attribute size for text attributes, in number of characters.")
	_ = cmd.MarkFlagRequired("size")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for attribute when not provided. Cannot be set when attribute is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is attribute an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&encrypt, "encrypt", false, "Toggle encryption for the attribute. Encryption enhances security by not storing any plain text values in the database. However, encrypted attributes cannot be queried.")
	cmd.Flags().Lookup("encrypt").NoOptDefVal = "true"
	return cmd
}

func newDatabasesUpdateStringAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault string
	var size int
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-string-attribute",
		Short: "Update a string attribute. Changing the `default` value will not update already existing documents.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateStringAttributeOption{}
			if cmd.Flags().Changed("size") {
				options = append(options, service.WithUpdateStringAttributeSize(size))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateStringAttributeNewKey(newKey))
			}

			result, err := service.UpdateStringAttribute(databaseId, collectionId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new table using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for attribute when not provided. Cannot be set when attribute is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().IntVar(&size, "size", 0, "Maximum size of the string attribute.")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Attribute Key.")
	return cmd
}

func newDatabasesCreateTextAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault string
	var array bool
	var encrypt bool

	cmd := &cobra.Command{
		Use:   "create-text-attribute",
		Short: "Create a text attribute.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateTextAttributeOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateTextAttributeDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateTextAttributeArray(array))
			}
			if cmd.Flags().Changed("encrypt") {
				options = append(options, service.WithCreateTextAttributeEncrypt(encrypt))
			}

			result, err := service.CreateTextAttribute(databaseId, collectionId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for attribute when not provided. Cannot be set when attribute is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is attribute an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&encrypt, "encrypt", false, "Toggle encryption for the attribute. Encryption enhances security by not storing any plain text values in the database. However, encrypted attributes cannot be queried.")
	cmd.Flags().Lookup("encrypt").NoOptDefVal = "true"
	return cmd
}

func newDatabasesUpdateTextAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-text-attribute",
		Short: "Update a text attribute. Changing the `default` value will not update already existing documents.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateTextAttributeOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateTextAttributeNewKey(newKey))
			}

			result, err := service.UpdateTextAttribute(databaseId, collectionId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for attribute when not provided. Cannot be set when attribute is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Attribute Key.")
	return cmd
}

func newDatabasesCreateUrlAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault string
	var array bool

	cmd := &cobra.Command{
		Use:   "create-url-attribute",
		Short: "Create a URL attribute.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateUrlAttributeOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateUrlAttributeDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateUrlAttributeArray(array))
			}

			result, err := service.CreateUrlAttribute(databaseId, collectionId, key, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for attribute when not provided. Cannot be set when attribute is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is attribute an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	return cmd
}

func newDatabasesUpdateUrlAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault string
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-url-attribute",
		Short: "Update an url attribute. Changing the `default` value will not update already existing documents.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateUrlAttributeOption{}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateUrlAttributeNewKey(newKey))
			}

			result, err := service.UpdateUrlAttribute(databaseId, collectionId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for attribute when not provided. Cannot be set when attribute is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Attribute Key.")
	return cmd
}

func newDatabasesCreateVarcharAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var size int
	var required bool
	var xdefault string
	var array bool
	var encrypt bool

	cmd := &cobra.Command{
		Use:   "create-varchar-attribute",
		Short: "Create a varchar attribute.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateVarcharAttributeOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateVarcharAttributeDefault(xdefault))
			}
			if cmd.Flags().Changed("array") {
				options = append(options, service.WithCreateVarcharAttributeArray(array))
			}
			if cmd.Flags().Changed("encrypt") {
				options = append(options, service.WithCreateVarcharAttributeEncrypt(encrypt))
			}

			result, err := service.CreateVarcharAttribute(databaseId, collectionId, key, size, required, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().IntVar(&size, "size", 0, "Attribute size for varchar attributes, in number of characters. Maximum size is 16381.")
	_ = cmd.MarkFlagRequired("size")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for attribute when not provided. Cannot be set when attribute is required.")
	cmd.Flags().BoolVar(&array, "array", false, "Is attribute an array?")
	cmd.Flags().Lookup("array").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&encrypt, "encrypt", false, "Toggle encryption for the attribute. Encryption enhances security by not storing any plain text values in the database. However, encrypted attributes cannot be queried.")
	cmd.Flags().Lookup("encrypt").NoOptDefVal = "true"
	return cmd
}

func newDatabasesUpdateVarcharAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string
	var required bool
	var xdefault string
	var size int
	var newKey string

	cmd := &cobra.Command{
		Use:   "update-varchar-attribute",
		Short: "Update a varchar attribute. Changing the `default` value will not update already existing documents.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateVarcharAttributeOption{}
			if cmd.Flags().Changed("size") {
				options = append(options, service.WithUpdateVarcharAttributeSize(size))
			}
			if cmd.Flags().Changed("new-key") {
				options = append(options, service.WithUpdateVarcharAttributeNewKey(newKey))
			}

			result, err := service.UpdateVarcharAttribute(databaseId, collectionId, key, required, xdefault, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID. You can create a new collection using the Database service server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection).")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().BoolVar(&required, "required", false, "Is attribute required?")
	_ = cmd.MarkFlagRequired("required")
	cmd.Flags().StringVar(&xdefault, "xdefault", "", "Default value for attribute when not provided. Cannot be set when attribute is required.")
	_ = cmd.MarkFlagRequired("xdefault")
	cmd.Flags().IntVar(&size, "size", 0, "Maximum size of the varchar attribute.")
	cmd.Flags().StringVar(&newKey, "new-key", "", "New Attribute Key.")
	return cmd
}

func newDatabasesGetAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string

	cmd := &cobra.Command{
		Use:   "get-attribute",
		Short: "Get attribute by ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			result, err := service.GetAttribute(databaseId, collectionId, key)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	return cmd
}

func newDatabasesDeleteAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string

	cmd := &cobra.Command{
		Use:   "delete-attribute",
		Short: "Deletes an attribute.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			result, err := service.DeleteAttribute(databaseId, collectionId, key)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&key, "key", "", "Attribute Key.")
	_ = cmd.MarkFlagRequired("key")
	return cmd
}

func newDatabasesListDocumentsCommand() *cobra.Command {
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
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

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
			options := []databases.ListDocumentsOption{}
			if cmd.Flags().Changed("queries") {
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
				return err
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
	cmd.Flags().IntVar(&ttl, "ttl", 0, "TTL (seconds) for caching list responses. Responses are stored in an in-memory key-value cache, keyed per project, collection, schema version (attributes and indexes), caller authorization roles, and the exact query — so users with different permissions never share cached entries. Schema changes invalidate cached entries automatically; document writes do not, so choose a TTL you are comfortable serving as stale data. Set to 0 to disable caching. Must be between 0 and 86400 (24 hours).")
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

func newDatabasesCreateDocumentCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documentId string
	var data string
	var permissions []string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "create-document",
		Short: "Create a new Document. Before using this route, you should create a new collection resource using either a server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)
			dataValue, err := app.JSONObject(data)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateDocumentOption{}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithCreateDocumentPermissions(permissions))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithCreateDocumentTransactionId(transactionId))
			}

			result, err := service.CreateDocument(databaseId, collectionId, documentId, dataValue, options...)
			if err != nil {
				return err
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

func newDatabasesCreateDocumentsCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documents []string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "create-documents",
		Short: "Create new Documents. Before using this route, you should create a new collection resource using either a server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateDocumentsOption{}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithCreateDocumentsTransactionId(transactionId))
			}

			result, err := service.CreateDocuments(databaseId, collectionId, app.ToAnySlice(documents), options...)
			if err != nil {
				return err
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

func newDatabasesUpsertDocumentsCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documents []string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "upsert-documents",
		Short: "Create or update Documents. Before using this route, you should create a new collection resource using either a server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpsertDocumentsOption{}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithUpsertDocumentsTransactionId(transactionId))
			}

			result, err := service.UpsertDocuments(databaseId, collectionId, app.ToAnySlice(documents), options...)
			if err != nil {
				return err
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

func newDatabasesUpdateDocumentsCommand() *cobra.Command {
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
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)
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
			options := []databases.UpdateDocumentsOption{}
			if cmd.Flags().Changed("data") {
				options = append(options, service.WithUpdateDocumentsData(dataValue))
			}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithUpdateDocumentsQueries(queries))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithUpdateDocumentsTransactionId(transactionId))
			}

			result, err := service.UpdateDocuments(databaseId, collectionId, options...)
			if err != nil {
				return err
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

func newDatabasesDeleteDocumentsCommand() *cobra.Command {
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
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

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
			options := []databases.DeleteDocumentsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithDeleteDocumentsQueries(queries))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithDeleteDocumentsTransactionId(transactionId))
			}

			result, err := service.DeleteDocuments(databaseId, collectionId, options...)
			if err != nil {
				return err
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

func newDatabasesGetDocumentCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documentId string
	var queries []string
	var transactionId string
	var selectAttributes []string

	cmd := &cobra.Command{
		Use:   "get-document",
		Short: "Get a document by its unique ID. This endpoint response returns a JSON object with the document data.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			queries, err := query.Build(query.Options{
				Queries: queries,
				Select:  selectAttributes,
			})
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.GetDocumentOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithGetDocumentQueries(queries))
			}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithGetDocumentTransactionId(transactionId))
			}

			result, err := service.GetDocument(databaseId, collectionId, documentId, options...)
			if err != nil {
				return err
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

func newDatabasesUpsertDocumentCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documentId string
	var data string
	var permissions []string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "upsert-document",
		Short: "Create or update a Document. Before using this route, you should create a new collection resource using either a server integration (https://appwrite.io/docs/server/databases#databasesCreateCollection) API or directly from your database console.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)
			dataValue, err := app.JSONObject(data)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpsertDocumentOption{}
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
				return err
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
	cmd.Flags().StringVar(&data, "data", "", "Document data as JSON object. Include all required attributes of the document to be created or updated.")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permissions strings. By default, the current permissions are inherited. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newDatabasesUpdateDocumentCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documentId string
	var data string
	var permissions []string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "update-document",
		Short: "Update a document by its unique ID. Using the patch method you can pass only specific fields that will get updated.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)
			dataValue, err := app.JSONObject(data)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.UpdateDocumentOption{}
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
				return err
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
	cmd.Flags().StringVar(&data, "data", "", "Document data as JSON object. Include only attribute and value pairs to be updated.")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permissions strings. By default, the current permissions are inherited. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newDatabasesDeleteDocumentCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documentId string
	var transactionId string

	cmd := &cobra.Command{
		Use:   "delete-document",
		Short: "Delete a document by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.DeleteDocumentOption{}
			if cmd.Flags().Changed("transaction-id") {
				options = append(options, service.WithDeleteDocumentTransactionId(transactionId))
			}

			result, err := service.DeleteDocument(databaseId, collectionId, documentId, options...)
			if err != nil {
				return err
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

func newDatabasesDecrementDocumentAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documentId string
	var attribute string
	var value float64
	var minArg float64
	var transactionId string

	cmd := &cobra.Command{
		Use:   "decrement-document-attribute",
		Short: "Decrement a specific attribute of a document by a given value.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.DecrementDocumentAttributeOption{}
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
				return err
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
	cmd.Flags().Float64Var(&minArg, "min", 0, "Minimum value for the attribute. If the current value is lesser than this value, an exception will be thrown.")
	cmd.Flags().StringVar(&transactionId, "transaction-id", "", "Transaction ID for staging the operation.")
	return cmd
}

func newDatabasesIncrementDocumentAttributeCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var documentId string
	var attribute string
	var value float64
	var maxArg float64
	var transactionId string

	cmd := &cobra.Command{
		Use:   "increment-document-attribute",
		Short: "Increment a specific attribute of a document by a given value.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.IncrementDocumentAttributeOption{}
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
				return err
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

func newDatabasesListIndexesCommand() *cobra.Command {
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
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

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
			options := []databases.ListIndexesOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListIndexesQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListIndexesTotal(total))
			}

			result, err := service.ListIndexes(databaseId, collectionId, options...)
			if err != nil {
				return err
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

func newDatabasesCreateIndexCommand() *cobra.Command {
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
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)
			lengthsDecoded, err := app.DecodeSlice[int](lengths)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []databases.CreateIndexOption{}
			if cmd.Flags().Changed("orders") {
				options = append(options, service.WithCreateIndexOrders(orders))
			}
			if cmd.Flags().Changed("lengths") {
				options = append(options, service.WithCreateIndexLengths(lengthsDecoded))
			}

			result, err := service.CreateIndex(databaseId, collectionId, key, typeArg, attributes, options...)
			if err != nil {
				return err
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

func newDatabasesGetIndexCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string

	cmd := &cobra.Command{
		Use:   "get-index",
		Short: "Get an index by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			result, err := service.GetIndex(databaseId, collectionId, key)
			if err != nil {
				return err
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

func newDatabasesDeleteIndexCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var key string

	cmd := &cobra.Command{
		Use:   "delete-index",
		Short: "Delete an index.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := databases.New(client)

			result, err := service.DeleteIndex(databaseId, collectionId, key)
			if err != nil {
				return err
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
