package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v7/migrations"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewMigrationsCommand builds the `migrations` command tree.
func NewMigrationsCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "migrations",
		Short: "The Migrations service allows you to migrate third-party data to your Appwrite project.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			return cmd.Help()
		},
	}

	cmd.AddCommand(newMigrationsListCommand())
	cmd.AddCommand(newMigrationsCreateAppwriteMigrationCommand())
	cmd.AddCommand(newMigrationsGetAppwriteReportCommand())
	cmd.AddCommand(newMigrationsCreateCSVExportCommand())
	cmd.AddCommand(newMigrationsCreateCSVImportCommand())
	cmd.AddCommand(newMigrationsCreateFirebaseMigrationCommand())
	cmd.AddCommand(newMigrationsGetFirebaseReportCommand())
	cmd.AddCommand(newMigrationsCreateJSONExportCommand())
	cmd.AddCommand(newMigrationsCreateJSONImportCommand())
	cmd.AddCommand(newMigrationsCreateNHostMigrationCommand())
	cmd.AddCommand(newMigrationsGetNHostReportCommand())
	cmd.AddCommand(newMigrationsCreateSupabaseMigrationCommand())
	cmd.AddCommand(newMigrationsGetSupabaseReportCommand())
	cmd.AddCommand(newMigrationsGetCommand())
	cmd.AddCommand(newMigrationsRetryCommand())
	cmd.AddCommand(newMigrationsDeleteCommand())

	return cmd
}

func newMigrationsListCommand() *cobra.Command {
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
		Short: "List all migrations in the current project. This endpoint returns a list of all migrations including their status, progress, and any errors that occurred during the migration process.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := migrations.New(client)

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
			options := []migrations.ListOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListQueries(app.StringSlice(queries)))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListSearch(search))
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

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: status, stage, source, destination, resources, resourceId, resourceInternalId, resourceType, parentResourceId, parentResourceInternalId, parentResourceType, destinationResourceId, destinationResourceInternalId, destinationResourceType, statusCounters, resourceData, errors")
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

func newMigrationsCreateAppwriteMigrationCommand() *cobra.Command {
	var resources []string
	var endpoint string
	var projectId string
	var apiKey string
	var onDuplicate string

	cmd := &cobra.Command{
		Use:   "create-appwrite-migration",
		Short: "Migrate data from another Appwrite project to your current project. This endpoint allows you to migrate resources like databases, collections, documents, users, and files from an existing Appwrite project. ",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := migrations.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []migrations.CreateAppwriteMigrationOption{}
			if cmd.Flags().Changed("on-duplicate") {
				options = append(options, service.WithCreateAppwriteMigrationOnDuplicate(onDuplicate))
			}

			result, err := service.CreateAppwriteMigration(app.StringSlice(resources), endpoint, projectId, apiKey, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&resources, "resources", nil, "List of resources to migrate")
	_ = cmd.MarkFlagRequired("resources")
	cmd.Flags().StringVar(&endpoint, "endpoint", "", "Source Appwrite endpoint")
	_ = cmd.MarkFlagRequired("endpoint")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Source Project ID")
	_ = cmd.MarkFlagRequired("project-id")
	cmd.Flags().StringVar(&apiKey, "api-key", "", "Source API Key")
	_ = cmd.MarkFlagRequired("api-key")
	cmd.Flags().StringVar(&onDuplicate, "on-duplicate", "", "Behavior when a row with an existing $id is encountered. \"fail\" (default): abort on first conflict. \"skip\": silently ignore. \"overwrite\": replace existing row.")
	return cmd
}

func newMigrationsGetAppwriteReportCommand() *cobra.Command {
	var resources []string
	var endpoint string
	var projectId string
	var key string

	cmd := &cobra.Command{
		Use:   "get-appwrite-report",
		Short: "Generate a report of the data in an Appwrite project before migrating. This endpoint analyzes the source project and returns information about the resources that can be migrated.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := migrations.New(client)

			result, err := service.GetAppwriteReport(app.StringSlice(resources), endpoint, projectId, key)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&resources, "resources", nil, "List of resources to migrate")
	_ = cmd.MarkFlagRequired("resources")
	cmd.Flags().StringVar(&endpoint, "endpoint", "", "Source's Appwrite Endpoint")
	_ = cmd.MarkFlagRequired("endpoint")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Source's Project ID")
	_ = cmd.MarkFlagRequired("project-id")
	cmd.Flags().StringVar(&key, "key", "", "Source's API Key")
	_ = cmd.MarkFlagRequired("key")
	return cmd
}

func newMigrationsCreateCSVExportCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var filename string
	var columns []string
	var queries []string
	var delimiter string
	var enclosure string
	var escape string
	var header bool
	var notify bool
	var filter []string
	var where []string
	var sortAsc []string
	var sortDesc []string
	var limit int
	var offset int
	var cursorAfter string
	var cursorBefore string

	cmd := &cobra.Command{
		Use:   "create-csv-export",
		Short: "Export documents to a CSV file from your Appwrite database. This endpoint allows you to export documents to a CSV file stored in a secure internal bucket. You'll receive an email with a download link when the export is complete.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := migrations.New(client)

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
			options := []migrations.CreateCSVExportOption{}
			if cmd.Flags().Changed("columns") {
				options = append(options, service.WithCreateCSVExportColumns(app.StringSlice(columns)))
			}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithCreateCSVExportQueries(app.StringSlice(queries)))
			}
			if cmd.Flags().Changed("delimiter") {
				options = append(options, service.WithCreateCSVExportDelimiter(delimiter))
			}
			if cmd.Flags().Changed("enclosure") {
				options = append(options, service.WithCreateCSVExportEnclosure(enclosure))
			}
			if cmd.Flags().Changed("escape") {
				options = append(options, service.WithCreateCSVExportEscape(escape))
			}
			if cmd.Flags().Changed("header") {
				options = append(options, service.WithCreateCSVExportHeader(header))
			}
			if cmd.Flags().Changed("notify") {
				options = append(options, service.WithCreateCSVExportNotify(notify))
			}

			result, err := service.CreateCSVExport(databaseId, collectionId, filename, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID containing the source collection.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID to export documents from.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&filename, "filename", "", "The name of the file to be created for the export, excluding the .csv extension.")
	_ = cmd.MarkFlagRequired("filename")
	cmd.Flags().StringArrayVar(&columns, "columns", nil, "List of attributes to export. If empty, all attributes will be exported. You can use the `*` wildcard to export all attributes from the collection.")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK to filter documents to export. Learn more about queries (https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long.")
	cmd.Flags().StringVar(&delimiter, "delimiter", "", "The character that separates each column value. Default is comma.")
	cmd.Flags().StringVar(&enclosure, "enclosure", "", "The character that encloses each column value. Default is double quotes.")
	cmd.Flags().StringVar(&escape, "escape", "", "The escape character for the enclosure character. Default is double quotes.")
	cmd.Flags().BoolVar(&header, "header", false, "Whether to include the header row with column names. Default is true.")
	cmd.Flags().Lookup("header").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&notify, "notify", false, "Set to true to receive an email when the export is complete. Default is true.")
	cmd.Flags().Lookup("notify").NoOptDefVal = "true"
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

func newMigrationsCreateCSVImportCommand() *cobra.Command {
	var bucketId string
	var fileId string
	var databaseId string
	var collectionId string
	var internalFile bool
	var onDuplicate string

	cmd := &cobra.Command{
		Use:   "create-csv-import",
		Short: "Import documents from a CSV file into your Appwrite database. This endpoint allows you to import documents from a CSV file uploaded to Appwrite Storage bucket.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := migrations.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []migrations.CreateCSVImportOption{}
			if cmd.Flags().Changed("internal-file") {
				options = append(options, service.WithCreateCSVImportInternalFile(internalFile))
			}
			if cmd.Flags().Changed("on-duplicate") {
				options = append(options, service.WithCreateCSVImportOnDuplicate(onDuplicate))
			}

			result, err := service.CreateCSVImport(bucketId, fileId, databaseId, collectionId, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Storage bucket unique ID. You can create a new storage bucket using the Storage service server integration (https://appwrite.io/docs/server/storage#createBucket).")
	_ = cmd.MarkFlagRequired("bucket-id")
	cmd.Flags().StringVar(&fileId, "file-id", "", "File ID.")
	_ = cmd.MarkFlagRequired("file-id")
	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID containing the target collection.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID to import documents into.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().BoolVar(&internalFile, "internal-file", false, "Is the file stored in an internal bucket?")
	cmd.Flags().Lookup("internal-file").NoOptDefVal = "true"
	cmd.Flags().StringVar(&onDuplicate, "on-duplicate", "", "Behavior when a row with an existing $id is encountered. \"fail\" (default): abort on first conflict. \"skip\": silently ignore. \"overwrite\": replace existing row.")
	return cmd
}

func newMigrationsCreateFirebaseMigrationCommand() *cobra.Command {
	var resources []string
	var serviceAccount string

	cmd := &cobra.Command{
		Use:   "create-firebase-migration",
		Short: "Migrate data from a Firebase project to your Appwrite project. This endpoint allows you to migrate resources like authentication and other supported services from a Firebase project. ",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := migrations.New(client)

			result, err := service.CreateFirebaseMigration(app.StringSlice(resources), serviceAccount)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&resources, "resources", nil, "List of resources to migrate")
	_ = cmd.MarkFlagRequired("resources")
	cmd.Flags().StringVar(&serviceAccount, "service-account", "", "JSON of the Firebase service account credentials")
	_ = cmd.MarkFlagRequired("service-account")
	return cmd
}

func newMigrationsGetFirebaseReportCommand() *cobra.Command {
	var resources []string
	var serviceAccount string

	cmd := &cobra.Command{
		Use:   "get-firebase-report",
		Short: "Generate a report of the data in a Firebase project before migrating. This endpoint analyzes the source project and returns information about the resources that can be migrated.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := migrations.New(client)

			result, err := service.GetFirebaseReport(app.StringSlice(resources), serviceAccount)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&resources, "resources", nil, "List of resources to migrate")
	_ = cmd.MarkFlagRequired("resources")
	cmd.Flags().StringVar(&serviceAccount, "service-account", "", "JSON of the Firebase service account credentials")
	_ = cmd.MarkFlagRequired("service-account")
	return cmd
}

func newMigrationsCreateJSONExportCommand() *cobra.Command {
	var databaseId string
	var collectionId string
	var filename string
	var columns []string
	var queries []string
	var notify bool
	var filter []string
	var where []string
	var sortAsc []string
	var sortDesc []string
	var limit int
	var offset int
	var cursorAfter string
	var cursorBefore string

	cmd := &cobra.Command{
		Use:   "create-json-export",
		Short: "Export documents to a JSON file from your Appwrite database. This endpoint allows you to export documents to a JSON file stored in a secure internal bucket. You'll receive an email with a download link when the export is complete.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := migrations.New(client)

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
			options := []migrations.CreateJSONExportOption{}
			if cmd.Flags().Changed("columns") {
				options = append(options, service.WithCreateJSONExportColumns(app.StringSlice(columns)))
			}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithCreateJSONExportQueries(app.StringSlice(queries)))
			}
			if cmd.Flags().Changed("notify") {
				options = append(options, service.WithCreateJSONExportNotify(notify))
			}

			result, err := service.CreateJSONExport(databaseId, collectionId, filename, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID containing the source collection.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID to export documents from.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().StringVar(&filename, "filename", "", "The name of the file to be created for the export, excluding the .json extension.")
	_ = cmd.MarkFlagRequired("filename")
	cmd.Flags().StringArrayVar(&columns, "columns", nil, "List of attributes to export. If empty, all attributes will be exported. You can use the `*` wildcard to export all attributes from the collection.")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK to filter documents to export. Learn more about queries (https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long.")
	cmd.Flags().BoolVar(&notify, "notify", false, "Set to true to receive an email when the export is complete. Default is true.")
	cmd.Flags().Lookup("notify").NoOptDefVal = "true"
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

func newMigrationsCreateJSONImportCommand() *cobra.Command {
	var bucketId string
	var fileId string
	var databaseId string
	var collectionId string
	var internalFile bool
	var onDuplicate string

	cmd := &cobra.Command{
		Use:   "create-json-import",
		Short: "Import documents from a JSON file into your Appwrite database. This endpoint allows you to import documents from a JSON file uploaded to Appwrite Storage bucket.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := migrations.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []migrations.CreateJSONImportOption{}
			if cmd.Flags().Changed("internal-file") {
				options = append(options, service.WithCreateJSONImportInternalFile(internalFile))
			}
			if cmd.Flags().Changed("on-duplicate") {
				options = append(options, service.WithCreateJSONImportOnDuplicate(onDuplicate))
			}

			result, err := service.CreateJSONImport(bucketId, fileId, databaseId, collectionId, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Storage bucket unique ID. You can create a new storage bucket using the Storage service server integration (https://appwrite.io/docs/server/storage#createBucket).")
	_ = cmd.MarkFlagRequired("bucket-id")
	cmd.Flags().StringVar(&fileId, "file-id", "", "File ID.")
	_ = cmd.MarkFlagRequired("file-id")
	cmd.Flags().StringVar(&databaseId, "database-id", "", "Database ID containing the target collection.")
	_ = cmd.MarkFlagRequired("database-id")
	cmd.Flags().StringVar(&collectionId, "collection-id", "", "Collection ID to import documents into.")
	_ = cmd.MarkFlagRequired("collection-id")
	cmd.Flags().BoolVar(&internalFile, "internal-file", false, "Is the file stored in an internal bucket?")
	cmd.Flags().Lookup("internal-file").NoOptDefVal = "true"
	cmd.Flags().StringVar(&onDuplicate, "on-duplicate", "", "Behavior when a row with an existing $id is encountered. \"fail\" (default): abort on first conflict. \"skip\": silently ignore. \"overwrite\": replace existing row.")
	return cmd
}

func newMigrationsCreateNHostMigrationCommand() *cobra.Command {
	var resources []string
	var subdomain string
	var region string
	var adminSecret string
	var database string
	var username string
	var password string
	var port int

	cmd := &cobra.Command{
		Use:   "create-n-host-migration",
		Short: "Migrate data from an NHost project to your Appwrite project. This endpoint allows you to migrate resources like authentication, databases, and other supported services from an NHost project. ",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := migrations.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []migrations.CreateNHostMigrationOption{}
			if cmd.Flags().Changed("port") {
				options = append(options, service.WithCreateNHostMigrationPort(port))
			}

			result, err := service.CreateNHostMigration(app.StringSlice(resources), subdomain, region, adminSecret, database, username, password, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&resources, "resources", nil, "List of resources to migrate")
	_ = cmd.MarkFlagRequired("resources")
	cmd.Flags().StringVar(&subdomain, "subdomain", "", "Source's Subdomain")
	_ = cmd.MarkFlagRequired("subdomain")
	cmd.Flags().StringVar(&region, "region", "", "Source's Region")
	_ = cmd.MarkFlagRequired("region")
	cmd.Flags().StringVar(&adminSecret, "admin-secret", "", "Source's Admin Secret")
	_ = cmd.MarkFlagRequired("admin-secret")
	cmd.Flags().StringVar(&database, "database", "", "Source's Database Name")
	_ = cmd.MarkFlagRequired("database")
	cmd.Flags().StringVar(&username, "username", "", "Source's Database Username")
	_ = cmd.MarkFlagRequired("username")
	cmd.Flags().StringVar(&password, "password", "", "Source's Database Password")
	_ = cmd.MarkFlagRequired("password")
	cmd.Flags().IntVar(&port, "port", 0, "Source's Database Port")
	return cmd
}

func newMigrationsGetNHostReportCommand() *cobra.Command {
	var resources []string
	var subdomain string
	var region string
	var adminSecret string
	var database string
	var username string
	var password string
	var port int

	cmd := &cobra.Command{
		Use:   "get-n-host-report",
		Short: "Generate a detailed report of the data in an NHost project before migrating. This endpoint analyzes the source project and returns information about the resources that can be migrated. ",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := migrations.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []migrations.GetNHostReportOption{}
			if cmd.Flags().Changed("port") {
				options = append(options, service.WithGetNHostReportPort(port))
			}

			result, err := service.GetNHostReport(app.StringSlice(resources), subdomain, region, adminSecret, database, username, password, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&resources, "resources", nil, "List of resources to migrate.")
	_ = cmd.MarkFlagRequired("resources")
	cmd.Flags().StringVar(&subdomain, "subdomain", "", "Source's Subdomain.")
	_ = cmd.MarkFlagRequired("subdomain")
	cmd.Flags().StringVar(&region, "region", "", "Source's Region.")
	_ = cmd.MarkFlagRequired("region")
	cmd.Flags().StringVar(&adminSecret, "admin-secret", "", "Source's Admin Secret.")
	_ = cmd.MarkFlagRequired("admin-secret")
	cmd.Flags().StringVar(&database, "database", "", "Source's Database Name.")
	_ = cmd.MarkFlagRequired("database")
	cmd.Flags().StringVar(&username, "username", "", "Source's Database Username.")
	_ = cmd.MarkFlagRequired("username")
	cmd.Flags().StringVar(&password, "password", "", "Source's Database Password.")
	_ = cmd.MarkFlagRequired("password")
	cmd.Flags().IntVar(&port, "port", 0, "Source's Database Port.")
	return cmd
}

func newMigrationsCreateSupabaseMigrationCommand() *cobra.Command {
	var resources []string
	var endpoint string
	var apiKey string
	var databaseHost string
	var username string
	var password string
	var port int

	cmd := &cobra.Command{
		Use:   "create-supabase-migration",
		Short: "Migrate data from a Supabase project to your Appwrite project. This endpoint allows you to migrate resources like authentication, databases, and other supported services from a Supabase project. ",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := migrations.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []migrations.CreateSupabaseMigrationOption{}
			if cmd.Flags().Changed("port") {
				options = append(options, service.WithCreateSupabaseMigrationPort(port))
			}

			result, err := service.CreateSupabaseMigration(app.StringSlice(resources), endpoint, apiKey, databaseHost, username, password, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&resources, "resources", nil, "List of resources to migrate")
	_ = cmd.MarkFlagRequired("resources")
	cmd.Flags().StringVar(&endpoint, "endpoint", "", "Source's Supabase Endpoint")
	_ = cmd.MarkFlagRequired("endpoint")
	cmd.Flags().StringVar(&apiKey, "api-key", "", "Source's API Key")
	_ = cmd.MarkFlagRequired("api-key")
	cmd.Flags().StringVar(&databaseHost, "database-host", "", "Source's Database Host")
	_ = cmd.MarkFlagRequired("database-host")
	cmd.Flags().StringVar(&username, "username", "", "Source's Database Username")
	_ = cmd.MarkFlagRequired("username")
	cmd.Flags().StringVar(&password, "password", "", "Source's Database Password")
	_ = cmd.MarkFlagRequired("password")
	cmd.Flags().IntVar(&port, "port", 0, "Source's Database Port")
	return cmd
}

func newMigrationsGetSupabaseReportCommand() *cobra.Command {
	var resources []string
	var endpoint string
	var apiKey string
	var databaseHost string
	var username string
	var password string
	var port int

	cmd := &cobra.Command{
		Use:   "get-supabase-report",
		Short: "Generate a report of the data in a Supabase project before migrating. This endpoint analyzes the source project and returns information about the resources that can be migrated. ",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := migrations.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []migrations.GetSupabaseReportOption{}
			if cmd.Flags().Changed("port") {
				options = append(options, service.WithGetSupabaseReportPort(port))
			}

			result, err := service.GetSupabaseReport(app.StringSlice(resources), endpoint, apiKey, databaseHost, username, password, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&resources, "resources", nil, "List of resources to migrate")
	_ = cmd.MarkFlagRequired("resources")
	cmd.Flags().StringVar(&endpoint, "endpoint", "", "Source's Supabase Endpoint.")
	_ = cmd.MarkFlagRequired("endpoint")
	cmd.Flags().StringVar(&apiKey, "api-key", "", "Source's API Key.")
	_ = cmd.MarkFlagRequired("api-key")
	cmd.Flags().StringVar(&databaseHost, "database-host", "", "Source's Database Host.")
	_ = cmd.MarkFlagRequired("database-host")
	cmd.Flags().StringVar(&username, "username", "", "Source's Database Username.")
	_ = cmd.MarkFlagRequired("username")
	cmd.Flags().StringVar(&password, "password", "", "Source's Database Password.")
	_ = cmd.MarkFlagRequired("password")
	cmd.Flags().IntVar(&port, "port", 0, "Source's Database Port.")
	return cmd
}

func newMigrationsGetCommand() *cobra.Command {
	var migrationId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a migration by its unique ID. This endpoint returns detailed information about a specific migration including its current status, progress, and any errors that occurred during the migration process. ",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := migrations.New(client)

			result, err := service.Get(migrationId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&migrationId, "migration-id", "", "Migration unique ID.")
	_ = cmd.MarkFlagRequired("migration-id")
	return cmd
}

func newMigrationsRetryCommand() *cobra.Command {
	var migrationId string

	cmd := &cobra.Command{
		Use:   "retry",
		Short: "Retry a failed migration. This endpoint allows you to retry a migration that has previously failed.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := migrations.New(client)

			result, err := service.Retry(migrationId)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&migrationId, "migration-id", "", "Migration unique ID.")
	_ = cmd.MarkFlagRequired("migration-id")
	return cmd
}

func newMigrationsDeleteCommand() *cobra.Command {
	var migrationId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a migration by its unique ID. This endpoint allows you to remove a migration from your project's migration history. ",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := migrations.New(client)

			result, err := service.Delete(migrationId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&migrationId, "migration-id", "", "Migration ID.")
	_ = cmd.MarkFlagRequired("migration-id")
	return cmd
}
