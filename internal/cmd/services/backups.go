package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/backups"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
)

// NewBackupsCommand builds the `backups` command tree.
func NewBackupsCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "backups",
		Short: "The Backups service allows you to manage backup policies, archives, and restorations for your project.",
	}

	cmd.AddCommand(newBackupsListArchivesCommand())
	cmd.AddCommand(newBackupsCreateArchiveCommand())
	cmd.AddCommand(newBackupsGetArchiveCommand())
	cmd.AddCommand(newBackupsDeleteArchiveCommand())
	cmd.AddCommand(newBackupsListPoliciesCommand())
	cmd.AddCommand(newBackupsCreatePolicyCommand())
	cmd.AddCommand(newBackupsGetPolicyCommand())
	cmd.AddCommand(newBackupsUpdatePolicyCommand())
	cmd.AddCommand(newBackupsDeletePolicyCommand())
	cmd.AddCommand(newBackupsCreateRestorationCommand())
	cmd.AddCommand(newBackupsListRestorationsCommand())
	cmd.AddCommand(newBackupsGetRestorationCommand())

	return cmd
}

func newBackupsListArchivesCommand() *cobra.Command {
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
		Use:   "list-archives",
		Short: "List all archives for a project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := backups.New(client)

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
			options := []backups.ListArchivesOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListArchivesQueries(queries))
			}

			result, err := service.ListArchives(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.")
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

func newBackupsCreateArchiveCommand() *cobra.Command {
	var services []string
	var resourceId string

	cmd := &cobra.Command{
		Use:   "create-archive",
		Short: "Create a new archive asynchronously for a project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := backups.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []backups.CreateArchiveOption{}
			if cmd.Flags().Changed("resource-id") {
				options = append(options, service.WithCreateArchiveResourceId(resourceId))
			}

			result, err := service.CreateArchive(services, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&services, "services", nil, "Array of services to backup")
	_ = cmd.MarkFlagRequired("services")
	cmd.Flags().StringVar(&resourceId, "resource-id", "", "Resource ID. When set, only this single resource will be backed up.")
	return cmd
}

func newBackupsGetArchiveCommand() *cobra.Command {
	var archiveId string

	cmd := &cobra.Command{
		Use:   "get-archive",
		Short: "Get a backup archive using it's ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := backups.New(client)

			result, err := service.GetArchive(archiveId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&archiveId, "archive-id", "", "Archive ID. Choose a custom ID`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("archive-id")
	return cmd
}

func newBackupsDeleteArchiveCommand() *cobra.Command {
	var archiveId string

	cmd := &cobra.Command{
		Use:   "delete-archive",
		Short: "Delete an existing archive for a project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := backups.New(client)

			result, err := service.DeleteArchive(archiveId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&archiveId, "archive-id", "", "Policy ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("archive-id")
	return cmd
}

func newBackupsListPoliciesCommand() *cobra.Command {
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
		Use:   "list-policies",
		Short: "List all policies for a project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := backups.New(client)

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
			options := []backups.ListPoliciesOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListPoliciesQueries(queries))
			}

			result, err := service.ListPolicies(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.")
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

func newBackupsCreatePolicyCommand() *cobra.Command {
	var policyId string
	var services []string
	var retention int
	var schedule string
	var name string
	var resourceId string
	var enabled bool

	cmd := &cobra.Command{
		Use:   "create-policy",
		Short: "Create a new backup policy.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := backups.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []backups.CreatePolicyOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithCreatePolicyName(name))
			}
			if cmd.Flags().Changed("resource-id") {
				options = append(options, service.WithCreatePolicyResourceId(resourceId))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreatePolicyEnabled(enabled))
			}

			result, err := service.CreatePolicy(policyId, services, retention, schedule, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&policyId, "policy-id", "", "Policy ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("policy-id")
	cmd.Flags().StringArrayVar(&services, "services", nil, "Array of services to backup")
	_ = cmd.MarkFlagRequired("services")
	cmd.Flags().IntVar(&retention, "retention", 0, "Days to keep backups before deletion")
	_ = cmd.MarkFlagRequired("retention")
	cmd.Flags().StringVar(&schedule, "schedule", "", "Schedule CRON syntax.")
	_ = cmd.MarkFlagRequired("schedule")
	cmd.Flags().StringVar(&name, "name", "", "Policy name. Max length: 128 chars.")
	cmd.Flags().StringVar(&resourceId, "resource-id", "", "Resource ID. When set, only this single resource will be backed up.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is policy enabled? When set to 'disabled', no backups will be taken")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	return cmd
}

func newBackupsGetPolicyCommand() *cobra.Command {
	var policyId string

	cmd := &cobra.Command{
		Use:   "get-policy",
		Short: "Get a backup policy using it's ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := backups.New(client)

			result, err := service.GetPolicy(policyId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&policyId, "policy-id", "", "Policy ID. Choose a custom ID`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("policy-id")
	return cmd
}

func newBackupsUpdatePolicyCommand() *cobra.Command {
	var policyId string
	var name string
	var retention int
	var schedule string
	var enabled bool

	cmd := &cobra.Command{
		Use:   "update-policy",
		Short: "Update an existing policy using it's ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := backups.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []backups.UpdatePolicyOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdatePolicyName(name))
			}
			if cmd.Flags().Changed("retention") {
				options = append(options, service.WithUpdatePolicyRetention(retention))
			}
			if cmd.Flags().Changed("schedule") {
				options = append(options, service.WithUpdatePolicySchedule(schedule))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdatePolicyEnabled(enabled))
			}

			result, err := service.UpdatePolicy(policyId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&policyId, "policy-id", "", "Policy ID. Choose a custom ID`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("policy-id")
	cmd.Flags().StringVar(&name, "name", "", "Policy name. Max length: 128 chars.")
	cmd.Flags().IntVar(&retention, "retention", 0, "Days to keep backups before deletion")
	cmd.Flags().StringVar(&schedule, "schedule", "", "Cron expression")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is Backup enabled? When set to 'disabled', No backup will be taken")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	return cmd
}

func newBackupsDeletePolicyCommand() *cobra.Command {
	var policyId string

	cmd := &cobra.Command{
		Use:   "delete-policy",
		Short: "Delete a policy using it's ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := backups.New(client)

			result, err := service.DeletePolicy(policyId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&policyId, "policy-id", "", "Policy ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("policy-id")
	return cmd
}

func newBackupsCreateRestorationCommand() *cobra.Command {
	var archiveId string
	var services []string
	var newResourceId string
	var newResourceName string

	cmd := &cobra.Command{
		Use:   "create-restoration",
		Short: "Create and trigger a new restoration for a backup on a project.\n\nFor a backup of one database, the restoration resolves its destination before it is queued. When `newResourceId` is omitted, the archived database is restored in place and its own ID is returned in `options`. Pass a different `newResourceId` to restore alongside it as a new database instead.\n\nThe restoration migration records the archived database in `resourceId` and `resourceType`, and the resolved database in `destinationResourceId` and `destinationResourceType`. Database types are stored canonically as `database`, `documentsdb`, or `vectorsdb`. Project-wide restorations leave these fields empty because they do not have a single source or destination database.\n\nTo list every migration related to one database, use its canonical type in a nested `OR(AND(...), AND(...), AND(...))` across the root, parent, and destination relation pairs: `(resourceType, resourceId)`, `(parentResourceType, parentResourceId)`, and `(destinationResourceType, destinationResourceId)`. Legacy and TablesDB databases use `database`; the operational `resourceType` of a table migration is not rewritten to `tablesdb`.\n\nWhen restoring a DocumentsDB or VectorsDB database from a dedicated source, the restore provisions a fresh dedicated backing database at the source database's own specification and lands the data there. An in-place restore swaps the database onto that backing only once the restore has succeeded, and retires the backing it displaced only once that swap is confirmed, so the source keeps serving its own data until the restored data is in place and any failure leaves it untouched. A serverless source has no dedicated backing to clone and restores onto the archived database instead.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := backups.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []backups.CreateRestorationOption{}
			if cmd.Flags().Changed("new-resource-id") {
				options = append(options, service.WithCreateRestorationNewResourceId(newResourceId))
			}
			if cmd.Flags().Changed("new-resource-name") {
				options = append(options, service.WithCreateRestorationNewResourceName(newResourceName))
			}

			result, err := service.CreateRestoration(archiveId, services, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&archiveId, "archive-id", "", "Backup archive ID to restore")
	_ = cmd.MarkFlagRequired("archive-id")
	cmd.Flags().StringArrayVar(&services, "services", nil, "Array of services to restore")
	_ = cmd.MarkFlagRequired("services")
	cmd.Flags().StringVar(&newResourceId, "new-resource-id", "", "Destination resource ID. Omit to restore the archived resource in place, or pass a different ID to restore alongside it as a new resource. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	cmd.Flags().StringVar(&newResourceName, "new-resource-name", "", "Database name. Max length: 128 chars.")
	return cmd
}

func newBackupsListRestorationsCommand() *cobra.Command {
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
		Use:   "list-restorations",
		Short: "List all backup restorations for a project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := backups.New(client)

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
			options := []backups.ListRestorationsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListRestorationsQueries(queries))
			}

			result, err := service.ListRestorations(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.")
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

func newBackupsGetRestorationCommand() *cobra.Command {
	var restorationId string

	cmd := &cobra.Command{
		Use:   "get-restoration",
		Short: "Get the current status of a backup restoration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := backups.New(client)

			result, err := service.GetRestoration(restorationId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&restorationId, "restoration-id", "", "Restoration ID. Choose a custom ID`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("restoration-id")
	return cmd
}
