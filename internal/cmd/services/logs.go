package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v7/logs"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewLogsCommand builds the `logs` command tree.
func NewLogsCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "logs",
		Short: "The Logs service allows you to read the log lines your functions and sites write to stdout and stderr.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			return cmd.Help()
		},
	}

	cmd.AddCommand(newLogsListCommand())
	cmd.AddCommand(newLogsGetCommand())

	return cmd
}

func newLogsListCommand() *cobra.Command {
	var resourceType string
	var resourceId string
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
		Short: "List the log lines a resource wrote to stdout and stderr, newest first. Leave out resourceType and resourceId to list every resource in the project. Each row is stamped with the region that served it. Results are limited to your plan's log retention.",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := logs.New(client)

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
			options := []logs.ListOption{}
			if cmd.Flags().Changed("resource-type") {
				options = append(options, service.WithListResourceType(resourceType))
			}
			if cmd.Flags().Changed("resource-id") {
				options = append(options, service.WithListResourceId(resourceId))
			}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListQueries(app.StringSlice(queries)))
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

	cmd.Flags().StringVar(&resourceType, "resource-type", "", "Type of the resource that wrote the logs. Leave out, together with resourceId, to list logs from every resource in the project.")
	cmd.Flags().StringVar(&resourceId, "resource-id", "", "ID of the resource that wrote the logs. Leave out, together with resourceType, to list logs from every resource in the project.")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. Functions and sites require a deploymentId equal filter. You may also filter on region, stream and timestamp, and on resourceType and resourceId when listing the whole project. Repeat the flag for each value.")
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

func newLogsGetCommand() *cobra.Command {
	var logId string
	var resourceType string
	var resourceId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a log line by its unique ID. The log must belong to the given resource and fall within your plan's log retention.",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := logs.New(client)

			result, err := service.Get(logId, resourceType, resourceId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&logId, "log-id", "", "Log ID.")
	_ = cmd.MarkFlagRequired("log-id")
	cmd.Flags().StringVar(&resourceType, "resource-type", "", "Type of the resource that wrote the log.")
	_ = cmd.MarkFlagRequired("resource-type")
	cmd.Flags().StringVar(&resourceId, "resource-id", "", "ID of the resource that wrote the log.")
	_ = cmd.MarkFlagRequired("resource-id")
	return cmd
}
