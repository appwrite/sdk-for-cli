package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v7/presences"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewPresencesCommand builds the `presences` command tree.
func NewPresencesCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "presences",
		Short: "The Presences service allows you to track and manage real-time user presence in your project.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			return cmd.Help()
		},
	}

	cmd.AddCommand(newPresencesListCommand())
	cmd.AddCommand(newPresencesGetCommand())
	cmd.AddCommand(newPresencesUpsertCommand())
	cmd.AddCommand(newPresencesUpdateCommand())
	cmd.AddCommand(newPresencesDeleteCommand())

	return cmd
}

func newPresencesListCommand() *cobra.Command {
	var queries []string
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

	cmd := &cobra.Command{
		Use:   "list",
		Short: "List presence logs. Expired entries are filtered out automatically.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := presences.New(client)

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
			options := []presences.ListOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListTotal(total))
			}
			if cmd.Flags().Changed("ttl") {
				options = append(options, service.WithListTtl(ttl))
			}

			result, err := service.List(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK.")
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
	return cmd
}

func newPresencesGetCommand() *cobra.Command {
	var presenceId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a presence log by its unique ID. Entries whose `expiresAt` is in the past are treated as not found.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := presences.New(client)

			result, err := service.Get(presenceId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&presenceId, "presence-id", "", "Presence unique ID.")
	_ = cmd.MarkFlagRequired("presence-id")
	return cmd
}

func newPresencesUpsertCommand() *cobra.Command {
	var presenceId string
	var userId string
	var status string
	var permissions []string
	var expiresAt string
	var metadata string

	cmd := &cobra.Command{
		Use:   "upsert",
		Short: "Create or update a presence log by its user ID.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := presences.New(client)
			metadataValue, err := app.JSONObject(metadata)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []presences.UpsertOption{}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithUpsertPermissions(permissions))
			}
			if cmd.Flags().Changed("expires-at") {
				options = append(options, service.WithUpsertExpiresAt(expiresAt))
			}
			if cmd.Flags().Changed("metadata") {
				options = append(options, service.WithUpsertMetadata(metadataValue))
			}

			result, err := service.Upsert(presenceId, userId, status, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&presenceId, "presence-id", "", "Presence unique ID.")
	_ = cmd.MarkFlagRequired("presence-id")
	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&status, "status", "", "Presence status.")
	_ = cmd.MarkFlagRequired("status")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permissions strings. By default, only the current user is granted all permissions. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().StringVar(&expiresAt, "expires-at", "", "Presence expiry datetime.")
	cmd.Flags().StringVar(&metadata, "metadata", "", "Presence metadata object.")
	return cmd
}

func newPresencesUpdateCommand() *cobra.Command {
	var presenceId string
	var userId string
	var status string
	var expiresAt string
	var metadata string
	var permissions []string
	var purge bool

	cmd := &cobra.Command{
		Use:   "update",
		Short: "Update a presence log by its unique ID. Using the patch method you can pass only specific fields that will get updated.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := presences.New(client)
			metadataValue, err := app.JSONObject(metadata)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []presences.UpdateOption{}
			if cmd.Flags().Changed("status") {
				options = append(options, service.WithUpdateStatus(status))
			}
			if cmd.Flags().Changed("expires-at") {
				options = append(options, service.WithUpdateExpiresAt(expiresAt))
			}
			if cmd.Flags().Changed("metadata") {
				options = append(options, service.WithUpdateMetadata(metadataValue))
			}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithUpdatePermissions(permissions))
			}
			if cmd.Flags().Changed("purge") {
				options = append(options, service.WithUpdatePurge(purge))
			}

			result, err := service.Update(presenceId, userId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&presenceId, "presence-id", "", "Presence unique ID.")
	_ = cmd.MarkFlagRequired("presence-id")
	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&status, "status", "", "Presence status.")
	cmd.Flags().StringVar(&expiresAt, "expires-at", "", "Presence expiry datetime.")
	cmd.Flags().StringVar(&metadata, "metadata", "", "Presence metadata object.")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permissions strings. By default, only the current user is granted all permissions. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().BoolVar(&purge, "purge", false, "When true, purge cached responses used by list presences endpoint.")
	cmd.Flags().Lookup("purge").NoOptDefVal = "true"
	return cmd
}

func newPresencesDeleteCommand() *cobra.Command {
	var presenceId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a presence log by its unique ID.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := presences.New(client)

			result, err := service.Delete(presenceId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&presenceId, "presence-id", "", "Presence unique ID.")
	_ = cmd.MarkFlagRequired("presence-id")
	return cmd
}
