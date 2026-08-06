package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/tokens"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
)

// NewTokensCommand builds the `tokens` command tree.
func NewTokensCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "tokens",
		Short: "The Tokens service allows you to create and manage resource tokens for secure file access.",
	}

	cmd.AddCommand(newTokensListCommand())
	cmd.AddCommand(newTokensCreateFileTokenCommand())
	cmd.AddCommand(newTokensGetCommand())
	cmd.AddCommand(newTokensUpdateCommand())
	cmd.AddCommand(newTokensDeleteCommand())

	return cmd
}

func newTokensListCommand() *cobra.Command {
	var bucketId string
	var fileId string
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
		Short: "List all the tokens created for a specific file or bucket. You can use the query params to filter your results.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tokens.New(client)

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
			options := []tokens.ListOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListTotal(total))
			}

			result, err := service.List(bucketId, fileId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Storage bucket unique ID. You can create a new storage bucket using the Storage service server integration (https://appwrite.io/docs/server/storage#createBucket).")
	_ = cmd.MarkFlagRequired("bucket-id")
	cmd.Flags().StringVar(&fileId, "file-id", "", "File unique ID.")
	_ = cmd.MarkFlagRequired("file-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: expire")
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

func newTokensCreateFileTokenCommand() *cobra.Command {
	var bucketId string
	var fileId string
	var expire string

	cmd := &cobra.Command{
		Use:   "create-file-token",
		Short: "Create a new token. A token is linked to a file. Token can be passed as a request URL search parameter.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tokens.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tokens.CreateFileTokenOption{}
			if cmd.Flags().Changed("expire") {
				options = append(options, service.WithCreateFileTokenExpire(expire))
			}

			result, err := service.CreateFileToken(bucketId, fileId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Storage bucket unique ID. You can create a new storage bucket using the Storage service server integration (https://appwrite.io/docs/server/storage#createBucket).")
	_ = cmd.MarkFlagRequired("bucket-id")
	cmd.Flags().StringVar(&fileId, "file-id", "", "File unique ID.")
	_ = cmd.MarkFlagRequired("file-id")
	cmd.Flags().StringVar(&expire, "expire", "", "Token expiry date")
	return cmd
}

func newTokensGetCommand() *cobra.Command {
	var tokenId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a token by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tokens.New(client)

			result, err := service.Get(tokenId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&tokenId, "token-id", "", "Token ID.")
	_ = cmd.MarkFlagRequired("token-id")
	return cmd
}

func newTokensUpdateCommand() *cobra.Command {
	var tokenId string
	var expire string

	cmd := &cobra.Command{
		Use:   "update",
		Short: "Update a token by its unique ID. Use this endpoint to update a token's expiry date.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tokens.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []tokens.UpdateOption{}
			if cmd.Flags().Changed("expire") {
				options = append(options, service.WithUpdateExpire(expire))
			}

			result, err := service.Update(tokenId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&tokenId, "token-id", "", "Token unique ID.")
	_ = cmd.MarkFlagRequired("token-id")
	cmd.Flags().StringVar(&expire, "expire", "", "File token expiry date")
	return cmd
}

func newTokensDeleteCommand() *cobra.Command {
	var tokenId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a token by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := tokens.New(client)

			result, err := service.Delete(tokenId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&tokenId, "token-id", "", "Token ID.")
	_ = cmd.MarkFlagRequired("token-id")
	return cmd
}
