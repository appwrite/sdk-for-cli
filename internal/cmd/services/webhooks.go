package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/webhooks"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewWebhooksCommand builds the `webhooks` command tree.
func NewWebhooksCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "webhooks",
		Short: "The Webhooks service allows you to manage your project webhooks.",
	}

	cmd.AddCommand(newWebhooksListCommand())
	cmd.AddCommand(newWebhooksCreateCommand())
	cmd.AddCommand(newWebhooksGetCommand())
	cmd.AddCommand(newWebhooksUpdateCommand())
	cmd.AddCommand(newWebhooksDeleteCommand())
	cmd.AddCommand(newWebhooksUpdateSecretCommand())

	return cmd
}

func newWebhooksListCommand() *cobra.Command {
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
		Short: "Get a list of all webhooks belonging to the project. You can use the query params to filter your results.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := webhooks.New(client)

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
			options := []webhooks.ListOption{}
			if cmd.Flags().Changed("queries") {
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

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, url, authUsername, tls, events, enabled, logs, attempts")
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

func newWebhooksCreateCommand() *cobra.Command {
	var webhookId string
	var url string
	var name string
	var events []string
	var enabled bool
	var tls bool
	var authUsername string
	var authPassword string
	var secret string

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create a new webhook. Use this endpoint to configure a URL that will receive events from Appwrite when specific events occur.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := webhooks.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []webhooks.CreateOption{}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateEnabled(enabled))
			}
			if cmd.Flags().Changed("tls") {
				options = append(options, service.WithCreateTls(tls))
			}
			if cmd.Flags().Changed("auth-username") {
				options = append(options, service.WithCreateAuthUsername(authUsername))
			}
			if cmd.Flags().Changed("auth-password") {
				options = append(options, service.WithCreateAuthPassword(authPassword))
			}
			if cmd.Flags().Changed("secret") {
				options = append(options, service.WithCreateSecret(secret))
			}

			result, err := service.Create(webhookId, url, name, events, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&webhookId, "webhook-id", "", "Webhook ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("webhook-id")
	cmd.Flags().StringVar(&url, "url", "", "Webhook URL.")
	_ = cmd.MarkFlagRequired("url")
	cmd.Flags().StringVar(&name, "name", "", "Webhook name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringArrayVar(&events, "events", nil, "Events list. Maximum of 100 events are allowed.")
	_ = cmd.MarkFlagRequired("events")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Enable or disable a webhook.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&tls, "tls", false, "Certificate verification, false for disabled or true for enabled.")
	cmd.Flags().Lookup("tls").NoOptDefVal = "true"
	cmd.Flags().StringVar(&authUsername, "auth-username", "", "Webhook HTTP user. Max length: 256 chars.")
	cmd.Flags().StringVar(&authPassword, "auth-password", "", "Webhook HTTP password. Max length: 256 chars.")
	cmd.Flags().StringVar(&secret, "secret", "", "Webhook secret key. If not provided, a new key will be generated automatically. Key must be at least 8 characters long, and at max 256 characters.")
	return cmd
}

func newWebhooksGetCommand() *cobra.Command {
	var webhookId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a webhook by its unique ID. This endpoint returns details about a specific webhook configured for a project. ",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := webhooks.New(client)

			result, err := service.Get(webhookId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&webhookId, "webhook-id", "", "Webhook ID.")
	_ = cmd.MarkFlagRequired("webhook-id")
	return cmd
}

func newWebhooksUpdateCommand() *cobra.Command {
	var webhookId string
	var name string
	var url string
	var events []string
	var enabled bool
	var tls bool
	var authUsername string
	var authPassword string

	cmd := &cobra.Command{
		Use:   "update",
		Short: "Update a webhook by its unique ID. Use this endpoint to update the URL, events, or status of an existing webhook.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := webhooks.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []webhooks.UpdateOption{}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateEnabled(enabled))
			}
			if cmd.Flags().Changed("tls") {
				options = append(options, service.WithUpdateTls(tls))
			}
			if cmd.Flags().Changed("auth-username") {
				options = append(options, service.WithUpdateAuthUsername(authUsername))
			}
			if cmd.Flags().Changed("auth-password") {
				options = append(options, service.WithUpdateAuthPassword(authPassword))
			}

			result, err := service.Update(webhookId, name, url, events, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&webhookId, "webhook-id", "", "Webhook ID.")
	_ = cmd.MarkFlagRequired("webhook-id")
	cmd.Flags().StringVar(&name, "name", "", "Webhook name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&url, "url", "", "Webhook URL.")
	_ = cmd.MarkFlagRequired("url")
	cmd.Flags().StringArrayVar(&events, "events", nil, "Events list. Maximum of 100 events are allowed.")
	_ = cmd.MarkFlagRequired("events")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Enable or disable a webhook.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&tls, "tls", false, "Certificate verification, false for disabled or true for enabled.")
	cmd.Flags().Lookup("tls").NoOptDefVal = "true"
	cmd.Flags().StringVar(&authUsername, "auth-username", "", "Webhook HTTP user. Max length: 256 chars.")
	cmd.Flags().StringVar(&authPassword, "auth-password", "", "Webhook HTTP password. Max length: 256 chars.")
	return cmd
}

func newWebhooksDeleteCommand() *cobra.Command {
	var webhookId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a webhook by its unique ID. Once deleted, the webhook will no longer receive project events. ",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := webhooks.New(client)

			result, err := service.Delete(webhookId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&webhookId, "webhook-id", "", "Webhook ID.")
	_ = cmd.MarkFlagRequired("webhook-id")
	return cmd
}

func newWebhooksUpdateSecretCommand() *cobra.Command {
	var webhookId string
	var secret string

	cmd := &cobra.Command{
		Use:   "update-secret",
		Short: "Update the webhook signing key. This endpoint can be used to regenerate the signing key used to sign and validate payload deliveries for a specific webhook.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := webhooks.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []webhooks.UpdateSecretOption{}
			if cmd.Flags().Changed("secret") {
				options = append(options, service.WithUpdateSecretSecret(secret))
			}

			result, err := service.UpdateSecret(webhookId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&webhookId, "webhook-id", "", "Webhook ID.")
	_ = cmd.MarkFlagRequired("webhook-id")
	cmd.Flags().StringVar(&secret, "secret", "", "Webhook secret key. If not provided, a new key will be generated automatically. Key must be at least 8 characters long, and at max 256 characters.")
	return cmd
}
