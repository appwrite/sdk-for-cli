package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/project"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
)

// NewProjectCommand builds the `project` command tree.
func NewProjectCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "project",
		Short: "The Project service allows you to manage all the projects in your Appwrite server.",
	}

	cmd.AddCommand(newProjectGetCommand())
	cmd.AddCommand(newProjectDeleteCommand())
	cmd.AddCommand(newProjectUpdateAuthMethodCommand())
	cmd.AddCommand(newProjectListKeysCommand())
	cmd.AddCommand(newProjectCreateKeyCommand())
	cmd.AddCommand(newProjectCreateEphemeralKeyCommand())
	cmd.AddCommand(newProjectGetKeyCommand())
	cmd.AddCommand(newProjectUpdateKeyCommand())
	cmd.AddCommand(newProjectDeleteKeyCommand())
	cmd.AddCommand(newProjectUpdateLabelsCommand())
	cmd.AddCommand(newProjectListMockPhonesCommand())
	cmd.AddCommand(newProjectCreateMockPhoneCommand())
	cmd.AddCommand(newProjectGetMockPhoneCommand())
	cmd.AddCommand(newProjectUpdateMockPhoneCommand())
	cmd.AddCommand(newProjectDeleteMockPhoneCommand())
	cmd.AddCommand(newProjectListOAuth2ProvidersCommand())
	cmd.AddCommand(newProjectUpdateOAuth2ServerCommand())
	cmd.AddCommand(newProjectUpdateOAuth2AmazonCommand())
	cmd.AddCommand(newProjectUpdateOAuth2AppleCommand())
	cmd.AddCommand(newProjectUpdateOAuth2AppwriteCommand())
	cmd.AddCommand(newProjectUpdateOAuth2Auth0Command())
	cmd.AddCommand(newProjectUpdateOAuth2AuthentikCommand())
	cmd.AddCommand(newProjectUpdateOAuth2AutodeskCommand())
	cmd.AddCommand(newProjectUpdateOAuth2BitbucketCommand())
	cmd.AddCommand(newProjectUpdateOAuth2BitlyCommand())
	cmd.AddCommand(newProjectUpdateOAuth2BoxCommand())
	cmd.AddCommand(newProjectUpdateOAuth2DailymotionCommand())
	cmd.AddCommand(newProjectUpdateOAuth2DiscordCommand())
	cmd.AddCommand(newProjectUpdateOAuth2DisqusCommand())
	cmd.AddCommand(newProjectUpdateOAuth2DropboxCommand())
	cmd.AddCommand(newProjectUpdateOAuth2EtsyCommand())
	cmd.AddCommand(newProjectUpdateOAuth2FacebookCommand())
	cmd.AddCommand(newProjectUpdateOAuth2FigmaCommand())
	cmd.AddCommand(newProjectUpdateOAuth2FusionAuthCommand())
	cmd.AddCommand(newProjectUpdateOAuth2GitHubCommand())
	cmd.AddCommand(newProjectUpdateOAuth2GitlabCommand())
	cmd.AddCommand(newProjectUpdateOAuth2GoogleCommand())
	cmd.AddCommand(newProjectUpdateOAuth2KeycloakCommand())
	cmd.AddCommand(newProjectUpdateOAuth2KickCommand())
	cmd.AddCommand(newProjectUpdateOAuth2LinkedinCommand())
	cmd.AddCommand(newProjectUpdateOAuth2MicrosoftCommand())
	cmd.AddCommand(newProjectUpdateOAuth2NotionCommand())
	cmd.AddCommand(newProjectUpdateOAuth2OidcCommand())
	cmd.AddCommand(newProjectUpdateOAuth2OktaCommand())
	cmd.AddCommand(newProjectUpdateOAuth2PaypalCommand())
	cmd.AddCommand(newProjectUpdateOAuth2PaypalSandboxCommand())
	cmd.AddCommand(newProjectUpdateOAuth2PodioCommand())
	cmd.AddCommand(newProjectUpdateOAuth2SalesforceCommand())
	cmd.AddCommand(newProjectUpdateOAuth2SlackCommand())
	cmd.AddCommand(newProjectUpdateOAuth2SpotifyCommand())
	cmd.AddCommand(newProjectUpdateOAuth2StripeCommand())
	cmd.AddCommand(newProjectUpdateOAuth2TradeshiftCommand())
	cmd.AddCommand(newProjectUpdateOAuth2TradeshiftSandboxCommand())
	cmd.AddCommand(newProjectUpdateOAuth2TwitchCommand())
	cmd.AddCommand(newProjectUpdateOAuth2WordPressCommand())
	cmd.AddCommand(newProjectUpdateOAuth2XCommand())
	cmd.AddCommand(newProjectUpdateOAuth2YahooCommand())
	cmd.AddCommand(newProjectUpdateOAuth2YandexCommand())
	cmd.AddCommand(newProjectUpdateOAuth2ZohoCommand())
	cmd.AddCommand(newProjectUpdateOAuth2ZoomCommand())
	cmd.AddCommand(newProjectGetOAuth2ProviderCommand())
	cmd.AddCommand(newProjectListPlatformsCommand())
	cmd.AddCommand(newProjectCreateAndroidPlatformCommand())
	cmd.AddCommand(newProjectUpdateAndroidPlatformCommand())
	cmd.AddCommand(newProjectCreateApplePlatformCommand())
	cmd.AddCommand(newProjectUpdateApplePlatformCommand())
	cmd.AddCommand(newProjectCreateLinuxPlatformCommand())
	cmd.AddCommand(newProjectUpdateLinuxPlatformCommand())
	cmd.AddCommand(newProjectCreateWebPlatformCommand())
	cmd.AddCommand(newProjectUpdateWebPlatformCommand())
	cmd.AddCommand(newProjectCreateWindowsPlatformCommand())
	cmd.AddCommand(newProjectUpdateWindowsPlatformCommand())
	cmd.AddCommand(newProjectGetPlatformCommand())
	cmd.AddCommand(newProjectDeletePlatformCommand())
	cmd.AddCommand(newProjectListPoliciesCommand())
	cmd.AddCommand(newProjectUpdateDenyAliasedEmailPolicyCommand())
	cmd.AddCommand(newProjectUpdateDenyCorporateEmailPolicyCommand())
	cmd.AddCommand(newProjectUpdateDenyDisposableEmailPolicyCommand())
	cmd.AddCommand(newProjectUpdateDenyFreeEmailPolicyCommand())
	cmd.AddCommand(newProjectUpdateMembershipPrivacyPolicyCommand())
	cmd.AddCommand(newProjectUpdatePasswordDictionaryPolicyCommand())
	cmd.AddCommand(newProjectUpdatePasswordHistoryPolicyCommand())
	cmd.AddCommand(newProjectUpdatePasswordPersonalDataPolicyCommand())
	cmd.AddCommand(newProjectUpdatePasswordStrengthPolicyCommand())
	cmd.AddCommand(newProjectUpdateSessionAlertPolicyCommand())
	cmd.AddCommand(newProjectUpdateSessionDurationPolicyCommand())
	cmd.AddCommand(newProjectUpdateSessionInvalidationPolicyCommand())
	cmd.AddCommand(newProjectUpdateSessionLimitPolicyCommand())
	cmd.AddCommand(newProjectUpdateUserLimitPolicyCommand())
	cmd.AddCommand(newProjectGetPolicyCommand())
	cmd.AddCommand(newProjectUpdateProtocolCommand())
	cmd.AddCommand(newProjectUpdateServiceCommand())
	cmd.AddCommand(newProjectUpdateSMTPCommand())
	cmd.AddCommand(newProjectCreateSMTPTestCommand())
	cmd.AddCommand(newProjectListEmailTemplatesCommand())
	cmd.AddCommand(newProjectUpdateEmailTemplateCommand())
	cmd.AddCommand(newProjectGetEmailTemplateCommand())
	cmd.AddCommand(newProjectListVariablesCommand())
	cmd.AddCommand(newProjectCreateVariableCommand())
	cmd.AddCommand(newProjectGetVariableCommand())
	cmd.AddCommand(newProjectUpdateVariableCommand())
	cmd.AddCommand(newProjectDeleteVariableCommand())

	return cmd
}

func newProjectGetCommand() *cobra.Command {
	var projectId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.Get()
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectDeleteCommand() *cobra.Command {
	var projectId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.Delete()
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateAuthMethodCommand() *cobra.Command {
	var methodId string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-auth-method",
		Short: "Update properties of a specific auth method. Use this endpoint to enable or disable a method in your project. ",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateAuthMethod(methodId, enabled)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&methodId, "method-id", "", "Auth Method ID. Possible values: email-password,magic-url,email-otp,anonymous,invites,jwt,phone")
	_ = cmd.MarkFlagRequired("method-id")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Auth method status.")
	_ = cmd.MarkFlagRequired("enabled")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectListKeysCommand() *cobra.Command {
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
	var projectId string

	cmd := &cobra.Command{
		Use:   "list-keys",
		Short: "Get a list of all API keys from the current project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

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
			options := []project.ListKeysOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListKeysQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListKeysTotal(total))
			}

			result, err := service.ListKeys(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: expire, accessedAt, name, scopes")
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
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectCreateKeyCommand() *cobra.Command {
	var keyId string
	var name string
	var scopes []string
	var expire string
	var projectId string

	cmd := &cobra.Command{
		Use:   "create-key",
		Short: "Create a new API key. It's recommended to have multiple API keys with strict scopes for separate functions within your project.\n\nYou can also create an ephemeral API key if you need a short-lived key instead.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.CreateKeyOption{}
			if cmd.Flags().Changed("expire") {
				options = append(options, service.WithCreateKeyExpire(expire))
			}

			result, err := service.CreateKey(keyId, name, scopes, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&keyId, "key-id", "", "Key ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("key-id")
	cmd.Flags().StringVar(&name, "name", "", "Key name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringArrayVar(&scopes, "scopes", nil, "Key scopes list. Maximum of 200 scopes are allowed.")
	_ = cmd.MarkFlagRequired("scopes")
	cmd.Flags().StringVar(&expire, "expire", "", "Expiration time in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectCreateEphemeralKeyCommand() *cobra.Command {
	var scopes []string
	var duration int
	var projectId string

	cmd := &cobra.Command{
		Use:   "create-ephemeral-key",
		Short: "Create a new ephemeral API key. It's recommended to have multiple API keys with strict scopes for separate functions within your project.\n\nYou can also create a standard API key if you need a longer-lived key instead.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.CreateEphemeralKey(scopes, duration)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&scopes, "scopes", nil, "Key scopes list. Maximum of 200 scopes are allowed.")
	_ = cmd.MarkFlagRequired("scopes")
	cmd.Flags().IntVar(&duration, "duration", 0, "Time in seconds before ephemeral key expires. Maximum duration is 3600 seconds.")
	_ = cmd.MarkFlagRequired("duration")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectGetKeyCommand() *cobra.Command {
	var keyId string
	var projectId string

	cmd := &cobra.Command{
		Use:   "get-key",
		Short: "Get a key by its unique ID. ",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.GetKey(keyId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&keyId, "key-id", "", "Key ID.")
	_ = cmd.MarkFlagRequired("key-id")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateKeyCommand() *cobra.Command {
	var keyId string
	var name string
	var scopes []string
	var expire string
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-key",
		Short: "Update a key by its unique ID. Use this endpoint to update the name, scopes, or expiration time of an API key.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateKeyOption{}
			if cmd.Flags().Changed("expire") {
				options = append(options, service.WithUpdateKeyExpire(expire))
			}

			result, err := service.UpdateKey(keyId, name, scopes, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&keyId, "key-id", "", "Key ID.")
	_ = cmd.MarkFlagRequired("key-id")
	cmd.Flags().StringVar(&name, "name", "", "Key name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringArrayVar(&scopes, "scopes", nil, "Key scopes list. Maximum of 200 scopes are allowed.")
	_ = cmd.MarkFlagRequired("scopes")
	cmd.Flags().StringVar(&expire, "expire", "", "Expiration time in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectDeleteKeyCommand() *cobra.Command {
	var keyId string
	var projectId string

	cmd := &cobra.Command{
		Use:   "delete-key",
		Short: "Delete a key by its unique ID. Once deleted, the key can no longer be used to authenticate API calls.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.DeleteKey(keyId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&keyId, "key-id", "", "Key ID.")
	_ = cmd.MarkFlagRequired("key-id")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateLabelsCommand() *cobra.Command {
	var labels []string
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-labels",
		Short: "Update the project labels. Labels can be used to easily filter projects in an organization.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateLabels(labels)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&labels, "labels", nil, "Array of project labels. Replaces the previous labels. Maximum of 1000 labels are allowed, each up to 36 alphanumeric characters long.")
	_ = cmd.MarkFlagRequired("labels")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectListMockPhonesCommand() *cobra.Command {
	var queries []string
	var total bool
	var limit int
	var offset int
	var projectId string

	cmd := &cobra.Command{
		Use:   "list-mock-phones",
		Short: "Get a list of all mock phones in the project. This endpoint returns an array of all mock phones and their OTPs.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			queries, err := query.Build(query.Options{
				Queries: queries,
				Limit:   app.FlagInt(cmd, "limit", limit),
				Offset:  app.FlagInt(cmd, "offset", offset),
			})
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.ListMockPhonesOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListMockPhonesQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListMockPhonesTotal(total))
			}

			result, err := service.ListMockPhones(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Only supported methods are limit and offset")
	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
	cmd.Flags().IntVar(&limit, "limit", 0, "Maximum number of results to return.")
	cmd.Flags().IntVar(&offset, "offset", 0, "Number of results to skip.")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectCreateMockPhoneCommand() *cobra.Command {
	var number string
	var otp string
	var projectId string

	cmd := &cobra.Command{
		Use:   "create-mock-phone",
		Short: "Create a new mock phone for your project. Use this endpoint to register a mock phone number and its sign-in OTP for your testers.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.CreateMockPhone(number, otp)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&number, "number", "", "Phone number to associate with the mock phone. Must be a valid E.164 formatted phone number.")
	_ = cmd.MarkFlagRequired("number")
	cmd.Flags().StringVar(&otp, "otp", "", "One-time password (OTP) to associate with the mock phone. Must be a 6-digit numeric code.")
	_ = cmd.MarkFlagRequired("otp")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectGetMockPhoneCommand() *cobra.Command {
	var number string
	var projectId string

	cmd := &cobra.Command{
		Use:   "get-mock-phone",
		Short: "Get a mock phone by its unique number. This endpoint returns the mock phone's OTP.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.GetMockPhone(number)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&number, "number", "", "Phone number associated with the mock phone. Must be a valid E.164 formatted phone number.")
	_ = cmd.MarkFlagRequired("number")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateMockPhoneCommand() *cobra.Command {
	var number string
	var otp string
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-mock-phone",
		Short: "Update a mock phone by its unique number. Use this endpoint to update the mock phone's OTP.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateMockPhone(number, otp)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&number, "number", "", "Phone number associated with the mock phone. Must be a valid E.164 formatted phone number.")
	_ = cmd.MarkFlagRequired("number")
	cmd.Flags().StringVar(&otp, "otp", "", "One-time password (OTP) to associate with the mock phone. Must be a 6-digit numeric code.")
	_ = cmd.MarkFlagRequired("otp")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectDeleteMockPhoneCommand() *cobra.Command {
	var number string
	var projectId string

	cmd := &cobra.Command{
		Use:   "delete-mock-phone",
		Short: "Delete a mock phone by its unique number. This endpoint removes the mock phone and its OTP configuration from the project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.DeleteMockPhone(number)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&number, "number", "", "Phone number associated with the mock phone. Must be a valid E.164 formatted phone number.")
	_ = cmd.MarkFlagRequired("number")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectListOAuth2ProvidersCommand() *cobra.Command {
	var queries []string
	var total bool
	var limit int
	var offset int
	var projectId string

	cmd := &cobra.Command{
		Use:   "list-o-auth-2-providers",
		Short: "Get a list of all OAuth2 providers supported by the server, along with the project's configuration for each. Credential fields are write-only and always returned empty.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			queries, err := query.Build(query.Options{
				Queries: queries,
				Limit:   app.FlagInt(cmd, "limit", limit),
				Offset:  app.FlagInt(cmd, "offset", offset),
			})
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.ListOAuth2ProvidersOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListOAuth2ProvidersQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListOAuth2ProvidersTotal(total))
			}

			result, err := service.ListOAuth2Providers(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Only supported methods are limit and offset")
	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
	cmd.Flags().IntVar(&limit, "limit", 0, "Maximum number of results to return.")
	cmd.Flags().IntVar(&offset, "offset", 0, "Number of results to skip.")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2ServerCommand() *cobra.Command {
	var enabled bool
	var authorizationUrl string
	var scopes []string
	var authorizationDetailsTypes []string
	var accessTokenDuration int
	var refreshTokenDuration int
	var publicAccessTokenDuration int
	var publicRefreshTokenDuration int
	var installationAccessTokenDuration int
	var confidentialPkce bool
	var verificationUrl string
	var userCodeLength int
	var userCodeFormat string
	var deviceCodeDuration int
	var defaultScopes []string
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-server",
		Short: "Update the OAuth2 server (OIDC provider) configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2ServerOption{}
			if cmd.Flags().Changed("scopes") {
				options = append(options, service.WithUpdateOAuth2ServerScopes(scopes))
			}
			if cmd.Flags().Changed("authorization-details-types") {
				options = append(options, service.WithUpdateOAuth2ServerAuthorizationDetailsTypes(authorizationDetailsTypes))
			}
			if cmd.Flags().Changed("access-token-duration") {
				options = append(options, service.WithUpdateOAuth2ServerAccessTokenDuration(accessTokenDuration))
			}
			if cmd.Flags().Changed("refresh-token-duration") {
				options = append(options, service.WithUpdateOAuth2ServerRefreshTokenDuration(refreshTokenDuration))
			}
			if cmd.Flags().Changed("public-access-token-duration") {
				options = append(options, service.WithUpdateOAuth2ServerPublicAccessTokenDuration(publicAccessTokenDuration))
			}
			if cmd.Flags().Changed("public-refresh-token-duration") {
				options = append(options, service.WithUpdateOAuth2ServerPublicRefreshTokenDuration(publicRefreshTokenDuration))
			}
			if cmd.Flags().Changed("installation-access-token-duration") {
				options = append(options, service.WithUpdateOAuth2ServerInstallationAccessTokenDuration(installationAccessTokenDuration))
			}
			if cmd.Flags().Changed("confidential-pkce") {
				options = append(options, service.WithUpdateOAuth2ServerConfidentialPkce(confidentialPkce))
			}
			if cmd.Flags().Changed("verification-url") {
				options = append(options, service.WithUpdateOAuth2ServerVerificationUrl(verificationUrl))
			}
			if cmd.Flags().Changed("user-code-length") {
				options = append(options, service.WithUpdateOAuth2ServerUserCodeLength(userCodeLength))
			}
			if cmd.Flags().Changed("user-code-format") {
				options = append(options, service.WithUpdateOAuth2ServerUserCodeFormat(userCodeFormat))
			}
			if cmd.Flags().Changed("device-code-duration") {
				options = append(options, service.WithUpdateOAuth2ServerDeviceCodeDuration(deviceCodeDuration))
			}
			if cmd.Flags().Changed("default-scopes") {
				options = append(options, service.WithUpdateOAuth2ServerDefaultScopes(defaultScopes))
			}

			result, err := service.UpdateOAuth2Server(enabled, authorizationUrl, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&enabled, "enabled", false, "Enable or disable the OAuth2 server.")
	_ = cmd.MarkFlagRequired("enabled")
	cmd.Flags().StringVar(&authorizationUrl, "authorization-url", "", "URL to your application with consent screen.")
	_ = cmd.MarkFlagRequired("authorization-url")
	cmd.Flags().StringArrayVar(&scopes, "scopes", nil, "List of allowed OAuth2 scopes. Maximum of 100 scopes are allowed, each up to 128 characters long.")
	cmd.Flags().StringArrayVar(&authorizationDetailsTypes, "authorization-details-types", nil, "List of accepted `authorization_details` types. Maximum of 100 types are allowed, each up to 128 characters long.")
	cmd.Flags().IntVar(&accessTokenDuration, "access-token-duration", 0, "Access token duration in seconds for confidential clients (server-side apps that authenticate with a client secret). Leave empty to use default 8 hours.")
	cmd.Flags().IntVar(&refreshTokenDuration, "refresh-token-duration", 0, "Refresh token duration in seconds for confidential clients (server-side apps that authenticate with a client secret). Leave empty to use default 1 year.")
	cmd.Flags().IntVar(&publicAccessTokenDuration, "public-access-token-duration", 0, "Access token duration in seconds for public clients (SPAs, mobile, and native apps that cannot keep a client secret). Leave empty to use default 1 hour.")
	cmd.Flags().IntVar(&publicRefreshTokenDuration, "public-refresh-token-duration", 0, "Refresh token duration in seconds for public clients (SPAs, mobile, and native apps that cannot keep a client secret). Leave empty to use default 30 days.")
	cmd.Flags().IntVar(&installationAccessTokenDuration, "installation-access-token-duration", 0, "Access token duration in seconds for app installation access tokens. Leave empty to use default 1 hour.")
	cmd.Flags().BoolVar(&confidentialPkce, "confidential-pkce", false, "When enabled, PKCE is required for confidential clients (server-side flows using client_secret). PKCE is always required for public clients regardless of this setting.")
	cmd.Flags().Lookup("confidential-pkce").NoOptDefVal = "true"
	cmd.Flags().StringVar(&verificationUrl, "verification-url", "", "URL to your application page where users enter the device flow user code. Required to enable the Device Authorization Grant.")
	cmd.Flags().IntVar(&userCodeLength, "user-code-length", 0, "Number of characters in the device flow user code, excluding the formatting separator. Shorter codes are easier to type but weaker; pair short codes with short expiry. Leave empty to use default 8.")
	cmd.Flags().StringVar(&userCodeFormat, "user-code-format", "", "Character set for device flow user codes: `numeric` (digits only — best for numeric keypads and TV remotes), `alphabetic` (letters only), or `alphanumeric` (letters and digits — highest entropy per character). Defaults to `alphanumeric`.")
	cmd.Flags().IntVar(&deviceCodeDuration, "device-code-duration", 0, "Lifetime in seconds of device flow device codes and user codes. Device codes are intentionally short-lived. Leave empty to use default 600.")
	cmd.Flags().StringArrayVar(&defaultScopes, "default-scopes", nil, "List of OAuth2 scopes used when an authorization request omits the scope parameter. Every default scope must also be allowed by the OAuth2 server. Maximum of 100 scopes are allowed, each up to 128 characters long.")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2AmazonCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-amazon",
		Short: "Update the project OAuth2 Amazon configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2AmazonOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2AmazonClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2AmazonClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2AmazonEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Amazon(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Amazon OAuth2 app. For example: amzn1.application-oa2-client.87400c00000000000000000000063d5b2")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Amazon OAuth2 app. For example: 79ffe4000000000000000000000000000000000000000000000000000002de55")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2AppleCommand() *cobra.Command {
	var serviceId string
	var keyId string
	var teamId string
	var p8File string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-apple",
		Short: "Update the project OAuth2 Apple configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2AppleOption{}
			if cmd.Flags().Changed("service-id") {
				options = append(options, service.WithUpdateOAuth2AppleServiceId(serviceId))
			}
			if cmd.Flags().Changed("key-id") {
				options = append(options, service.WithUpdateOAuth2AppleKeyId(keyId))
			}
			if cmd.Flags().Changed("team-id") {
				options = append(options, service.WithUpdateOAuth2AppleTeamId(teamId))
			}
			if cmd.Flags().Changed("p-8-file") {
				options = append(options, service.WithUpdateOAuth2AppleP8File(p8File))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2AppleEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Apple(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&serviceId, "service-id", "", "'Service ID' of Apple OAuth2 app. For example: ip.appwrite.app.web")
	cmd.Flags().StringVar(&keyId, "key-id", "", "'Key ID' of Apple OAuth2 app. For example: P4000000N8")
	cmd.Flags().StringVar(&teamId, "team-id", "", "'Team ID' of Apple OAuth2 app. For example: D4000000R6")
	cmd.Flags().StringVar(&p8File, "p-8-file", "", "Contents of the Apple OAuth2 app .p8 private key file. The secret key wrapped by the PEM markers is 200 characters long. For example: -----BEGIN PRIVATE KEY-----MIGTAg...jy2Xbna-----END PRIVATE KEY-----")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2AppwriteCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-appwrite",
		Short: "Update the project OAuth2 Appwrite configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2AppwriteOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2AppwriteClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2AppwriteClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2AppwriteEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Appwrite(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Appwrite OAuth2 app. For example: 6a42000000000000b5a0")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Appwrite OAuth2 app. For example: b86afd000000000000000000000000000000000000000000000000000ced5f93")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2Auth0Command() *cobra.Command {
	var clientId string
	var clientSecret string
	var endpoint string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-auth-0",
		Short: "Update the project OAuth2 Auth0 configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2Auth0Option{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2Auth0ClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2Auth0ClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("endpoint") {
				options = append(options, service.WithUpdateOAuth2Auth0Endpoint(endpoint))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2Auth0Enabled(enabled))
			}

			result, err := service.UpdateOAuth2Auth0(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Auth0 OAuth2 app. For example: OaOkIA000000000000000000005KLSYq")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Auth0 OAuth2 app. For example: zXz0000-00000000000000000000000000000-00000000000000000000PJafnF")
	cmd.Flags().StringVar(&endpoint, "endpoint", "", "Domain of Auth0 instance. For example: example.us.auth0.com")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2AuthentikCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var endpoint string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-authentik",
		Short: "Update the project OAuth2 Authentik configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2AuthentikOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2AuthentikClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2AuthentikClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("endpoint") {
				options = append(options, service.WithUpdateOAuth2AuthentikEndpoint(endpoint))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2AuthentikEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Authentik(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Authentik OAuth2 app. For example: dTKOPa0000000000000000000000000000e7G8hv")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Authentik OAuth2 app. For example: ntQadq000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000Hp5WK")
	cmd.Flags().StringVar(&endpoint, "endpoint", "", "Domain of Authentik instance. For example: example.authentik.com")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2AutodeskCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-autodesk",
		Short: "Update the project OAuth2 Autodesk configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2AutodeskOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2AutodeskClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2AutodeskClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2AutodeskEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Autodesk(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Autodesk OAuth2 app. For example: 5zw90v00000000000000000000kVYXN7")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Autodesk OAuth2 app. For example: 7I000000000000MW")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2BitbucketCommand() *cobra.Command {
	var key string
	var secret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-bitbucket",
		Short: "Update the project OAuth2 Bitbucket configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2BitbucketOption{}
			if cmd.Flags().Changed("key") {
				options = append(options, service.WithUpdateOAuth2BitbucketKey(key))
			}
			if cmd.Flags().Changed("secret") {
				options = append(options, service.WithUpdateOAuth2BitbucketSecret(secret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2BitbucketEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Bitbucket(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&key, "key", "", "'Key' of Bitbucket OAuth2 app. For example: Knt70000000000ByRc")
	cmd.Flags().StringVar(&secret, "secret", "", "'Secret' of Bitbucket OAuth2 app. For example: NMfLZJ00000000000000000000TLQdDx")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2BitlyCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-bitly",
		Short: "Update the project OAuth2 Bitly configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2BitlyOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2BitlyClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2BitlyClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2BitlyEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Bitly(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Bitly OAuth2 app. For example: d95151000000000000000000000000000067af9b")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Bitly OAuth2 app. For example: a13e250000000000000000000000000000d73095")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2BoxCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-box",
		Short: "Update the project OAuth2 Box configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2BoxOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2BoxClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2BoxClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2BoxEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Box(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Box OAuth2 app. For example: deglcs00000000000000000000x2og6y")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Box OAuth2 app. For example: OKM1f100000000000000000000eshEif")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2DailymotionCommand() *cobra.Command {
	var apiKey string
	var apiSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-dailymotion",
		Short: "Update the project OAuth2 Dailymotion configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2DailymotionOption{}
			if cmd.Flags().Changed("api-key") {
				options = append(options, service.WithUpdateOAuth2DailymotionApiKey(apiKey))
			}
			if cmd.Flags().Changed("api-secret") {
				options = append(options, service.WithUpdateOAuth2DailymotionApiSecret(apiSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2DailymotionEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Dailymotion(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&apiKey, "api-key", "", "'API Key' of Dailymotion OAuth2 app. For example: 07a9000000000000067f")
	cmd.Flags().StringVar(&apiSecret, "api-secret", "", "'API Secret' of Dailymotion OAuth2 app. For example: a399a90000000000000000000000000000d90639")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2DiscordCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-discord",
		Short: "Update the project OAuth2 Discord configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2DiscordOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2DiscordClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2DiscordClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2DiscordEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Discord(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Discord OAuth2 app. For example: 950722000000343754")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Discord OAuth2 app. For example: YmPXnM000000000000000000002zFg5D")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2DisqusCommand() *cobra.Command {
	var publicKey string
	var secretKey string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-disqus",
		Short: "Update the project OAuth2 Disqus configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2DisqusOption{}
			if cmd.Flags().Changed("public-key") {
				options = append(options, service.WithUpdateOAuth2DisqusPublicKey(publicKey))
			}
			if cmd.Flags().Changed("secret-key") {
				options = append(options, service.WithUpdateOAuth2DisqusSecretKey(secretKey))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2DisqusEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Disqus(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&publicKey, "public-key", "", "'Public Key, also known as API Key' of Disqus OAuth2 app. For example: cgegH70000000000000000000000000000000000000000000000000000Hr1nYX")
	cmd.Flags().StringVar(&secretKey, "secret-key", "", "'Secret Key, also known as API Secret' of Disqus OAuth2 app. For example: W7Bykj00000000000000000000000000000000000000000000000000003o43w9")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2DropboxCommand() *cobra.Command {
	var appKey string
	var appSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-dropbox",
		Short: "Update the project OAuth2 Dropbox configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2DropboxOption{}
			if cmd.Flags().Changed("app-key") {
				options = append(options, service.WithUpdateOAuth2DropboxAppKey(appKey))
			}
			if cmd.Flags().Changed("app-secret") {
				options = append(options, service.WithUpdateOAuth2DropboxAppSecret(appSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2DropboxEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Dropbox(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appKey, "app-key", "", "'App Key' of Dropbox OAuth2 app. For example: jl000000000009t")
	cmd.Flags().StringVar(&appSecret, "app-secret", "", "'App Secret' of Dropbox OAuth2 app. For example: g200000000000vw")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2EtsyCommand() *cobra.Command {
	var keyString string
	var sharedSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-etsy",
		Short: "Update the project OAuth2 Etsy configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2EtsyOption{}
			if cmd.Flags().Changed("key-string") {
				options = append(options, service.WithUpdateOAuth2EtsyKeyString(keyString))
			}
			if cmd.Flags().Changed("shared-secret") {
				options = append(options, service.WithUpdateOAuth2EtsySharedSecret(sharedSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2EtsyEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Etsy(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&keyString, "key-string", "", "'Keystring' of Etsy OAuth2 app. For example: nsgzxh0000000000008j85a2")
	cmd.Flags().StringVar(&sharedSecret, "shared-secret", "", "'Shared Secret' of Etsy OAuth2 app. For example: tp000000ru")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2FacebookCommand() *cobra.Command {
	var appId string
	var appSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-facebook",
		Short: "Update the project OAuth2 Facebook configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2FacebookOption{}
			if cmd.Flags().Changed("app-id") {
				options = append(options, service.WithUpdateOAuth2FacebookAppId(appId))
			}
			if cmd.Flags().Changed("app-secret") {
				options = append(options, service.WithUpdateOAuth2FacebookAppSecret(appSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2FacebookEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Facebook(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "'App ID' of Facebook OAuth2 app. For example: 260600000007694")
	cmd.Flags().StringVar(&appSecret, "app-secret", "", "'App Secret' of Facebook OAuth2 app. For example: 2d0b2800000000000000000000d38af4")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2FigmaCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-figma",
		Short: "Update the project OAuth2 Figma configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2FigmaOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2FigmaClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2FigmaClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2FigmaEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Figma(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Figma OAuth2 app. For example: byay5H0000000000VtiI40")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Figma OAuth2 app. For example: yEpOYn0000000000000000004iIsU5")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2FusionAuthCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var endpoint string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-fusion-auth",
		Short: "Update the project OAuth2 FusionAuth configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2FusionAuthOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2FusionAuthClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2FusionAuthClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("endpoint") {
				options = append(options, service.WithUpdateOAuth2FusionAuthEndpoint(endpoint))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2FusionAuthEnabled(enabled))
			}

			result, err := service.UpdateOAuth2FusionAuth(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of FusionAuth OAuth2 app. For example: b2222c00-0000-0000-0000-000000862097")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of FusionAuth OAuth2 app. For example: Jx4s0C0000000000000000000000000000000wGqLsc")
	cmd.Flags().StringVar(&endpoint, "endpoint", "", "Domain of FusionAuth instance. For example: example.fusionauth.io")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2GitHubCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-git-hub",
		Short: "Update the project OAuth2 GitHub configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2GitHubOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2GitHubClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2GitHubClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2GitHubEnabled(enabled))
			}

			result, err := service.UpdateOAuth2GitHub(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'OAuth2 app Client ID, or App ID' of GitHub OAuth2 app. For example: e4d87900000000540733. Example of wrong value: 370006")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of GitHub OAuth2 app. For example: 5e07c00000000000000000000000000000198bcc")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2GitlabCommand() *cobra.Command {
	var applicationId string
	var secret string
	var endpoint string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-gitlab",
		Short: "Update the project OAuth2 Gitlab configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2GitlabOption{}
			if cmd.Flags().Changed("application-id") {
				options = append(options, service.WithUpdateOAuth2GitlabApplicationId(applicationId))
			}
			if cmd.Flags().Changed("secret") {
				options = append(options, service.WithUpdateOAuth2GitlabSecret(secret))
			}
			if cmd.Flags().Changed("endpoint") {
				options = append(options, service.WithUpdateOAuth2GitlabEndpoint(endpoint))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2GitlabEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Gitlab(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&applicationId, "application-id", "", "'Application ID' of Gitlab OAuth2 app. For example: d41ffe0000000000000000000000000000000000000000000000000000d5e252")
	cmd.Flags().StringVar(&secret, "secret", "", "'Secret' of Gitlab OAuth2 app. For example: gloas-838cfa0000000000000000000000000000000000000000000000000000ecbb38")
	cmd.Flags().StringVar(&endpoint, "endpoint", "", "Endpoint URL of self-hosted GitLab instance. For example: https://gitlab.com")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2GoogleCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var prompt []string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-google",
		Short: "Update the project OAuth2 Google configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2GoogleOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2GoogleClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2GoogleClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("prompt") {
				options = append(options, service.WithUpdateOAuth2GooglePrompt(prompt))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2GoogleEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Google(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Google OAuth2 app. For example: 120000000095-92ifjb00000000000000000000g7ijfb.apps.googleusercontent.com")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Google OAuth2 app. For example: GOCSPX-2k8gsR0000000000000000VNahJj")
	cmd.Flags().StringArrayVar(&prompt, "prompt", nil, "Array of Google OAuth2 prompt values. If \"none\" is included, it must be the only element. \"none\" means: don't display any authentication or consent screens. Must not be specified with other values. \"consent\" means: prompt the user for consent. \"select_account\" means: prompt the user to select an account.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2KeycloakCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var endpoint string
	var realmName string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-keycloak",
		Short: "Update the project OAuth2 Keycloak configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2KeycloakOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2KeycloakClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2KeycloakClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("endpoint") {
				options = append(options, service.WithUpdateOAuth2KeycloakEndpoint(endpoint))
			}
			if cmd.Flags().Changed("realm-name") {
				options = append(options, service.WithUpdateOAuth2KeycloakRealmName(realmName))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2KeycloakEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Keycloak(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Keycloak OAuth2 app. For example: appwrite-o0000000st-app")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Keycloak OAuth2 app. For example: jdjrJd00000000000000000000HUsaZO")
	cmd.Flags().StringVar(&endpoint, "endpoint", "", "Domain of Keycloak instance. For example: keycloak.example.com")
	cmd.Flags().StringVar(&realmName, "realm-name", "", "Keycloak realm name. For example: appwrite-realm")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2KickCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-kick",
		Short: "Update the project OAuth2 Kick configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2KickOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2KickClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2KickClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2KickEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Kick(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Kick OAuth2 app. For example: 01KQ7C00000000000001MFHS32")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Kick OAuth2 app. For example: 34ac5600000000000000000000000000000000000000000000000000e830c8b")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2LinkedinCommand() *cobra.Command {
	var clientId string
	var primaryClientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-linkedin",
		Short: "Update the project OAuth2 Linkedin configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2LinkedinOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2LinkedinClientId(clientId))
			}
			if cmd.Flags().Changed("primary-client-secret") {
				options = append(options, service.WithUpdateOAuth2LinkedinPrimaryClientSecret(primaryClientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2LinkedinEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Linkedin(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Linkedin OAuth2 app. For example: 770000000000dv")
	cmd.Flags().StringVar(&primaryClientSecret, "primary-client-secret", "", "'Primary Client Secret or Secondary Client Secret' of Linkedin OAuth2 app. For example: WPL_AP1.2Bf0000000000000./HtlYw==")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2MicrosoftCommand() *cobra.Command {
	var applicationId string
	var applicationSecret string
	var tenant string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-microsoft",
		Short: "Update the project OAuth2 Microsoft configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2MicrosoftOption{}
			if cmd.Flags().Changed("application-id") {
				options = append(options, service.WithUpdateOAuth2MicrosoftApplicationId(applicationId))
			}
			if cmd.Flags().Changed("application-secret") {
				options = append(options, service.WithUpdateOAuth2MicrosoftApplicationSecret(applicationSecret))
			}
			if cmd.Flags().Changed("tenant") {
				options = append(options, service.WithUpdateOAuth2MicrosoftTenant(tenant))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2MicrosoftEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Microsoft(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&applicationId, "application-id", "", "'Entra ID Application ID, also known as Client ID' of Microsoft OAuth2 app. For example: 00001111-aaaa-2222-bbbb-3333cccc4444")
	cmd.Flags().StringVar(&applicationSecret, "application-secret", "", "'Entra ID Application Secret, also known as Client Secret' of Microsoft OAuth2 app. For example: A1bC2dE3fH4iJ5kL6mN7oP8qR9sT0u")
	cmd.Flags().StringVar(&tenant, "tenant", "", "Microsoft Entra ID tenant identifier. Use 'common', 'organizations', 'consumers' or a specific tenant ID. For example: common")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2NotionCommand() *cobra.Command {
	var oauthClientId string
	var oauthClientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-notion",
		Short: "Update the project OAuth2 Notion configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2NotionOption{}
			if cmd.Flags().Changed("oauth-client-id") {
				options = append(options, service.WithUpdateOAuth2NotionOauthClientId(oauthClientId))
			}
			if cmd.Flags().Changed("oauth-client-secret") {
				options = append(options, service.WithUpdateOAuth2NotionOauthClientSecret(oauthClientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2NotionEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Notion(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&oauthClientId, "oauth-client-id", "", "'OAuth Client ID' of Notion OAuth2 app. For example: 341d8700-0000-0000-0000-000000446ee3")
	cmd.Flags().StringVar(&oauthClientSecret, "oauth-client-secret", "", "'OAuth Client Secret' of Notion OAuth2 app. For example: secret_dLUr4b000000000000000000000000000000lFHAa9")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2OidcCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var wellKnownUrl string
	var authorizationUrl string
	var tokenUrl string
	var userInfoUrl string
	var prompt []string
	var maxAge int
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-oidc",
		Short: "Update the project OAuth2 Oidc configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2OidcOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2OidcClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2OidcClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("well-known-url") {
				options = append(options, service.WithUpdateOAuth2OidcWellKnownURL(wellKnownUrl))
			}
			if cmd.Flags().Changed("authorization-url") {
				options = append(options, service.WithUpdateOAuth2OidcAuthorizationURL(authorizationUrl))
			}
			if cmd.Flags().Changed("token-url") {
				options = append(options, service.WithUpdateOAuth2OidcTokenURL(tokenUrl))
			}
			if cmd.Flags().Changed("user-info-url") {
				options = append(options, service.WithUpdateOAuth2OidcUserInfoURL(userInfoUrl))
			}
			if cmd.Flags().Changed("prompt") {
				options = append(options, service.WithUpdateOAuth2OidcPrompt(prompt))
			}
			if cmd.Flags().Changed("max-age") {
				options = append(options, service.WithUpdateOAuth2OidcMaxAge(maxAge))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2OidcEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Oidc(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Oidc OAuth2 app. For example: qibI2x0000000000000000000000000006L2YFoG")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Oidc OAuth2 app. For example: Ah68ed000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003qpcHV")
	cmd.Flags().StringVar(&wellKnownUrl, "well-known-url", "", "OpenID Connect well-known configuration URL. When provided, authorization, token, and user info endpoints can be discovered automatically. For example: https://myoauth.com/.well-known/openid-configuration")
	cmd.Flags().StringVar(&authorizationUrl, "authorization-url", "", "OpenID Connect authorization endpoint URL. Required when wellKnownURL is not provided. For example: https://myoauth.com/oauth2/authorize")
	cmd.Flags().StringVar(&tokenUrl, "token-url", "", "OpenID Connect token endpoint URL. Required when wellKnownURL is not provided. For example: https://myoauth.com/oauth2/token")
	cmd.Flags().StringVar(&userInfoUrl, "user-info-url", "", "OpenID Connect user info endpoint URL. Required when wellKnownURL is not provided. For example: https://myoauth.com/oauth2/userinfo")
	cmd.Flags().StringArrayVar(&prompt, "prompt", nil, "Array of OpenID Connect prompt values controlling the authentication and consent screens. If \"none\" is included, it must be the only element. \"none\" means: don't display any authentication or consent screens. \"login\" means: prompt the user to re-authenticate. \"consent\" means: prompt the user for consent. \"select_account\" means: prompt the user to select an account.")
	cmd.Flags().IntVar(&maxAge, "max-age", 0, "Maximum authentication age in seconds. When set, the user must have authenticated within this many seconds, otherwise they are prompted to re-authenticate.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2OktaCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var domain string
	var authorizationServerId string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-okta",
		Short: "Update the project OAuth2 Okta configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2OktaOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2OktaClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2OktaClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("domain") {
				options = append(options, service.WithUpdateOAuth2OktaDomain(domain))
			}
			if cmd.Flags().Changed("authorization-server-id") {
				options = append(options, service.WithUpdateOAuth2OktaAuthorizationServerId(authorizationServerId))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2OktaEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Okta(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Okta OAuth2 app. For example: 0oa00000000000000698")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Okta OAuth2 app. For example: Kiq0000000000000000000000000000000000000-00000000000H2L5-3SJ-vRV")
	cmd.Flags().StringVar(&domain, "domain", "", "Okta company domain. Required when enabling the provider. For example: trial-6400025.okta.com. Example of wrong value: trial-6400025-admin.okta.com, or https://trial-6400025.okta.com/")
	cmd.Flags().StringVar(&authorizationServerId, "authorization-server-id", "", "Custom Authorization Servers. Optional, can be left empty or unconfigured. For example: aus000000000000000h7z")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2PaypalCommand() *cobra.Command {
	var clientId string
	var secretKey string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-paypal",
		Short: "Update the project OAuth2 Paypal configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2PaypalOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2PaypalClientId(clientId))
			}
			if cmd.Flags().Changed("secret-key") {
				options = append(options, service.WithUpdateOAuth2PaypalSecretKey(secretKey))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2PaypalEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Paypal(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Paypal OAuth2 app. For example: AdhIEG7-000000000000-0000000000000000000000000000000-0000000000000000000000-2pyB")
	cmd.Flags().StringVar(&secretKey, "secret-key", "", "'Secret Key 1 or Secret Key 2' of Paypal OAuth2 app. For example: EH8KCXtew--000000000000000000000000000000000000000_C-1_5UP_000000000000000CB7KDp")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2PaypalSandboxCommand() *cobra.Command {
	var clientId string
	var secretKey string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-paypal-sandbox",
		Short: "Update the project OAuth2 PaypalSandbox configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2PaypalSandboxOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2PaypalSandboxClientId(clientId))
			}
			if cmd.Flags().Changed("secret-key") {
				options = append(options, service.WithUpdateOAuth2PaypalSandboxSecretKey(secretKey))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2PaypalSandboxEnabled(enabled))
			}

			result, err := service.UpdateOAuth2PaypalSandbox(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of PaypalSandbox OAuth2 app. For example: AdhIEG7-000000000000-0000000000000000000000000000000-0000000000000000000000-2pyB")
	cmd.Flags().StringVar(&secretKey, "secret-key", "", "'Secret Key 1 or Secret Key 2' of PaypalSandbox OAuth2 app. For example: EH8KCXtew--000000000000000000000000000000000000000_C-1_5UP_000000000000000CB7KDp")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2PodioCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-podio",
		Short: "Update the project OAuth2 Podio configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2PodioOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2PodioClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2PodioClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2PodioEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Podio(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Podio OAuth2 app. For example: appwrite-o0000000st-app")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Podio OAuth2 app. For example: Rn247T0000000000000000000000000000000000000000000000000000W2zWTN")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2SalesforceCommand() *cobra.Command {
	var customerKey string
	var customerSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-salesforce",
		Short: "Update the project OAuth2 Salesforce configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2SalesforceOption{}
			if cmd.Flags().Changed("customer-key") {
				options = append(options, service.WithUpdateOAuth2SalesforceCustomerKey(customerKey))
			}
			if cmd.Flags().Changed("customer-secret") {
				options = append(options, service.WithUpdateOAuth2SalesforceCustomerSecret(customerSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2SalesforceEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Salesforce(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&customerKey, "customer-key", "", "'Consumer Key' of Salesforce OAuth2 app. For example: 3MVG9I0000000000000000000000000000000000000000000000000000000000000000000000000C5Aejq")
	cmd.Flags().StringVar(&customerSecret, "customer-secret", "", "'Consumer Secret' of Salesforce OAuth2 app. For example: 3w000000000000e2")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2SlackCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-slack",
		Short: "Update the project OAuth2 Slack configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2SlackOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2SlackClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2SlackClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2SlackEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Slack(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Slack OAuth2 app. For example: 23000000089.15000000000023")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Slack OAuth2 app. For example: 81656000000000000000000000f3d2fd")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2SpotifyCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-spotify",
		Short: "Update the project OAuth2 Spotify configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2SpotifyOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2SpotifyClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2SpotifyClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2SpotifyEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Spotify(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Spotify OAuth2 app. For example: 6ec271000000000000000000009beace")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Spotify OAuth2 app. For example: db068a000000000000000000008b5b9f")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2StripeCommand() *cobra.Command {
	var clientId string
	var apiSecretKey string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-stripe",
		Short: "Update the project OAuth2 Stripe configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2StripeOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2StripeClientId(clientId))
			}
			if cmd.Flags().Changed("api-secret-key") {
				options = append(options, service.WithUpdateOAuth2StripeApiSecretKey(apiSecretKey))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2StripeEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Stripe(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Stripe OAuth2 app. For example: ca_UKibXX0000000000000000000006byvR")
	cmd.Flags().StringVar(&apiSecretKey, "api-secret-key", "", "'API Secret Key' of Stripe OAuth2 app. For example: sk_51SfOd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000QGWYfp")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2TradeshiftCommand() *cobra.Command {
	var oauth2ClientId string
	var oauth2ClientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-tradeshift",
		Short: "Update the project OAuth2 Tradeshift configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2TradeshiftOption{}
			if cmd.Flags().Changed("oauth-2-client-id") {
				options = append(options, service.WithUpdateOAuth2TradeshiftOauth2ClientId(oauth2ClientId))
			}
			if cmd.Flags().Changed("oauth-2-client-secret") {
				options = append(options, service.WithUpdateOAuth2TradeshiftOauth2ClientSecret(oauth2ClientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2TradeshiftEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Tradeshift(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&oauth2ClientId, "oauth-2-client-id", "", "'OAuth2 Client ID' of Tradeshift OAuth2 app. For example: appwrite-tes00000.0000000000est-app")
	cmd.Flags().StringVar(&oauth2ClientSecret, "oauth-2-client-secret", "", "'OAuth2 Client Secret' of Tradeshift OAuth2 app. For example: 7cb52700-0000-0000-0000-000000ca5b83")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2TradeshiftSandboxCommand() *cobra.Command {
	var oauth2ClientId string
	var oauth2ClientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-tradeshift-sandbox",
		Short: "Update the project OAuth2 Tradeshift Sandbox configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2TradeshiftSandboxOption{}
			if cmd.Flags().Changed("oauth-2-client-id") {
				options = append(options, service.WithUpdateOAuth2TradeshiftSandboxOauth2ClientId(oauth2ClientId))
			}
			if cmd.Flags().Changed("oauth-2-client-secret") {
				options = append(options, service.WithUpdateOAuth2TradeshiftSandboxOauth2ClientSecret(oauth2ClientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2TradeshiftSandboxEnabled(enabled))
			}

			result, err := service.UpdateOAuth2TradeshiftSandbox(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&oauth2ClientId, "oauth-2-client-id", "", "'OAuth2 Client ID' of Tradeshift Sandbox OAuth2 app. For example: appwrite-tes00000.0000000000est-app")
	cmd.Flags().StringVar(&oauth2ClientSecret, "oauth-2-client-secret", "", "'OAuth2 Client Secret' of Tradeshift Sandbox OAuth2 app. For example: 7cb52700-0000-0000-0000-000000ca5b83")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2TwitchCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-twitch",
		Short: "Update the project OAuth2 Twitch configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2TwitchOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2TwitchClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2TwitchClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2TwitchEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Twitch(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Twitch OAuth2 app. For example: vvi0in000000000000000000ikmt9p")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Twitch OAuth2 app. For example: pmapue000000000000000000zylw3v")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2WordPressCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-word-press",
		Short: "Update the project OAuth2 WordPress configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2WordPressOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2WordPressClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2WordPressClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2WordPressEnabled(enabled))
			}

			result, err := service.UpdateOAuth2WordPress(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of WordPress OAuth2 app. For example: 130005")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of WordPress OAuth2 app. For example: PlBfJS0000000000000000000000000000000000000000000000000000EdUZJk")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2XCommand() *cobra.Command {
	var customerKey string
	var secretKey string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2x",
		Short: "Update the project OAuth2 X configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2XOption{}
			if cmd.Flags().Changed("customer-key") {
				options = append(options, service.WithUpdateOAuth2XCustomerKey(customerKey))
			}
			if cmd.Flags().Changed("secret-key") {
				options = append(options, service.WithUpdateOAuth2XSecretKey(secretKey))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2XEnabled(enabled))
			}

			result, err := service.UpdateOAuth2X(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&customerKey, "customer-key", "", "'Customer Key' of X OAuth2 app. For example: slzZV0000000000000NFLaWT")
	cmd.Flags().StringVar(&secretKey, "secret-key", "", "'Secret Key' of X OAuth2 app. For example: tkEPkp00000000000000000000000000000000000000FTxbI9")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2YahooCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-yahoo",
		Short: "Update the project OAuth2 Yahoo configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2YahooOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2YahooClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2YahooClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2YahooEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Yahoo(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID, also known as Customer Key' of Yahoo OAuth2 app. For example: dj0yJm000000000000000000000000000000000000000000000000000000000000000000000000000000000000Z4PWRm")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret, also known as Customer Secret' of Yahoo OAuth2 app. For example: cf978f0000000000000000000000000000c5e2e9")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2YandexCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-yandex",
		Short: "Update the project OAuth2 Yandex configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2YandexOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2YandexClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2YandexClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2YandexEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Yandex(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Yandex OAuth2 app. For example: 6a8a6a0000000000000000000091483c")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Yandex OAuth2 app. For example: bbf98500000000000000000000c75a63")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2ZohoCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-zoho",
		Short: "Update the project OAuth2 Zoho configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2ZohoOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2ZohoClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2ZohoClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2ZohoEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Zoho(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Zoho OAuth2 app. For example: 1000.83C178000000000000000000RPNX0B")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Zoho OAuth2 app. For example: fb5cac000000000000000000000000000000a68f6e")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateOAuth2ZoomCommand() *cobra.Command {
	var clientId string
	var clientSecret string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-o-auth-2-zoom",
		Short: "Update the project OAuth2 Zoom configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateOAuth2ZoomOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithUpdateOAuth2ZoomClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithUpdateOAuth2ZoomClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateOAuth2ZoomEnabled(enabled))
			}

			result, err := service.UpdateOAuth2Zoom(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "'Client ID' of Zoom OAuth2 app. For example: QMAC00000000000000w0AQ")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "'Client Secret' of Zoom OAuth2 app. For example: GAWsG4000000000000000000007U01ON")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "OAuth2 sign-in method status. Set to true to enable new session creation. Setting to true will trigger end-to-end credentials validation, and will throw if the credentials are invalid.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectGetOAuth2ProviderCommand() *cobra.Command {
	var providerId string
	var projectId string

	cmd := &cobra.Command{
		Use:   "get-o-auth-2-provider",
		Short: "Get a single OAuth2 provider configuration. Credential fields (client secret, p8 file, key/team IDs) are write-only and always returned empty.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.GetOAuth2Provider(providerId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "OAuth2 provider key. For example: github, google, apple.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectListPlatformsCommand() *cobra.Command {
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
	var projectId string

	cmd := &cobra.Command{
		Use:   "list-platforms",
		Short: "Get a list of all platforms in the project. This endpoint returns an array of all platforms and their configurations.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

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
			options := []project.ListPlatformsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListPlatformsQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListPlatformsTotal(total))
			}

			result, err := service.ListPlatforms(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: type, name, hostname, bundleIdentifier, applicationId, packageIdentifierName, packageName")
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
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectCreateAndroidPlatformCommand() *cobra.Command {
	var platformId string
	var name string
	var applicationId string
	var projectId string

	cmd := &cobra.Command{
		Use:   "create-android-platform",
		Short: "Create a new Android platform for your project. Use this endpoint to register a new Android platform where your users will run your application which will interact with the Appwrite API.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.CreateAndroidPlatform(platformId, name, applicationId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&platformId, "platform-id", "", "Platform ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("platform-id")
	cmd.Flags().StringVar(&name, "name", "", "Platform name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&applicationId, "application-id", "", "Android application ID. Max length: 256 chars.")
	_ = cmd.MarkFlagRequired("application-id")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateAndroidPlatformCommand() *cobra.Command {
	var platformId string
	var name string
	var applicationId string
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-android-platform",
		Short: "Update an Android platform by its unique ID. Use this endpoint to update the platform's name or application ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateAndroidPlatform(platformId, name, applicationId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&platformId, "platform-id", "", "Platform ID.")
	_ = cmd.MarkFlagRequired("platform-id")
	cmd.Flags().StringVar(&name, "name", "", "Platform name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&applicationId, "application-id", "", "Android application ID. Max length: 256 chars.")
	_ = cmd.MarkFlagRequired("application-id")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectCreateApplePlatformCommand() *cobra.Command {
	var platformId string
	var name string
	var bundleIdentifier string
	var projectId string

	cmd := &cobra.Command{
		Use:   "create-apple-platform",
		Short: "Create a new Apple platform for your project. Use this endpoint to register a new Apple platform where your users will run your application which will interact with the Appwrite API.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.CreateApplePlatform(platformId, name, bundleIdentifier)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&platformId, "platform-id", "", "Platform ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("platform-id")
	cmd.Flags().StringVar(&name, "name", "", "Platform name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&bundleIdentifier, "bundle-identifier", "", "Apple bundle identifier. Max length: 256 chars.")
	_ = cmd.MarkFlagRequired("bundle-identifier")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateApplePlatformCommand() *cobra.Command {
	var platformId string
	var name string
	var bundleIdentifier string
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-apple-platform",
		Short: "Update an Apple platform by its unique ID. Use this endpoint to update the platform's name or bundle identifier.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateApplePlatform(platformId, name, bundleIdentifier)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&platformId, "platform-id", "", "Platform ID.")
	_ = cmd.MarkFlagRequired("platform-id")
	cmd.Flags().StringVar(&name, "name", "", "Platform name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&bundleIdentifier, "bundle-identifier", "", "Apple bundle identifier. Max length: 256 chars.")
	_ = cmd.MarkFlagRequired("bundle-identifier")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectCreateLinuxPlatformCommand() *cobra.Command {
	var platformId string
	var name string
	var packageName string
	var projectId string

	cmd := &cobra.Command{
		Use:   "create-linux-platform",
		Short: "Create a new Linux platform for your project. Use this endpoint to register a new Linux platform where your users will run your application which will interact with the Appwrite API.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.CreateLinuxPlatform(platformId, name, packageName)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&platformId, "platform-id", "", "Platform ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("platform-id")
	cmd.Flags().StringVar(&name, "name", "", "Platform name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&packageName, "package-name", "", "Linux package name. Max length: 256 chars.")
	_ = cmd.MarkFlagRequired("package-name")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateLinuxPlatformCommand() *cobra.Command {
	var platformId string
	var name string
	var packageName string
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-linux-platform",
		Short: "Update a Linux platform by its unique ID. Use this endpoint to update the platform's name or package name.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateLinuxPlatform(platformId, name, packageName)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&platformId, "platform-id", "", "Platform ID.")
	_ = cmd.MarkFlagRequired("platform-id")
	cmd.Flags().StringVar(&name, "name", "", "Platform name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&packageName, "package-name", "", "Linux package name. Max length: 256 chars.")
	_ = cmd.MarkFlagRequired("package-name")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectCreateWebPlatformCommand() *cobra.Command {
	var platformId string
	var name string
	var hostname string
	var projectId string

	cmd := &cobra.Command{
		Use:   "create-web-platform",
		Short: "Create a new web platform for your project. Use this endpoint to register a new platform where your users will run your application which will interact with the Appwrite API.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.CreateWebPlatform(platformId, name, hostname)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&platformId, "platform-id", "", "Platform ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("platform-id")
	cmd.Flags().StringVar(&name, "name", "", "Platform name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&hostname, "hostname", "", "Platform web hostname. Max length: 256 chars.")
	_ = cmd.MarkFlagRequired("hostname")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateWebPlatformCommand() *cobra.Command {
	var platformId string
	var name string
	var hostname string
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-web-platform",
		Short: "Update a web platform by its unique ID. Use this endpoint to update the platform's name or hostname.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateWebPlatform(platformId, name, hostname)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&platformId, "platform-id", "", "Platform ID.")
	_ = cmd.MarkFlagRequired("platform-id")
	cmd.Flags().StringVar(&name, "name", "", "Platform name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&hostname, "hostname", "", "Platform web hostname. Max length: 256 chars.")
	_ = cmd.MarkFlagRequired("hostname")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectCreateWindowsPlatformCommand() *cobra.Command {
	var platformId string
	var name string
	var packageIdentifierName string
	var projectId string

	cmd := &cobra.Command{
		Use:   "create-windows-platform",
		Short: "Create a new Windows platform for your project. Use this endpoint to register a new Windows platform where your users will run your application which will interact with the Appwrite API.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.CreateWindowsPlatform(platformId, name, packageIdentifierName)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&platformId, "platform-id", "", "Platform ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("platform-id")
	cmd.Flags().StringVar(&name, "name", "", "Platform name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&packageIdentifierName, "package-identifier-name", "", "Windows package identifier name. Max length: 256 chars.")
	_ = cmd.MarkFlagRequired("package-identifier-name")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateWindowsPlatformCommand() *cobra.Command {
	var platformId string
	var name string
	var packageIdentifierName string
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-windows-platform",
		Short: "Update a Windows platform by its unique ID. Use this endpoint to update the platform's name or package identifier name.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateWindowsPlatform(platformId, name, packageIdentifierName)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&platformId, "platform-id", "", "Platform ID.")
	_ = cmd.MarkFlagRequired("platform-id")
	cmd.Flags().StringVar(&name, "name", "", "Platform name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&packageIdentifierName, "package-identifier-name", "", "Windows package identifier name. Max length: 256 chars.")
	_ = cmd.MarkFlagRequired("package-identifier-name")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectGetPlatformCommand() *cobra.Command {
	var platformId string
	var projectId string

	cmd := &cobra.Command{
		Use:   "get-platform",
		Short: "Get a platform by its unique ID. This endpoint returns the platform's details, including its name, type, and key configurations.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.GetPlatform(platformId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&platformId, "platform-id", "", "Platform ID.")
	_ = cmd.MarkFlagRequired("platform-id")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectDeletePlatformCommand() *cobra.Command {
	var platformId string
	var projectId string

	cmd := &cobra.Command{
		Use:   "delete-platform",
		Short: "Delete a platform by its unique ID. This endpoint removes the platform and all its configurations from the project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.DeletePlatform(platformId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&platformId, "platform-id", "", "Platform ID.")
	_ = cmd.MarkFlagRequired("platform-id")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectListPoliciesCommand() *cobra.Command {
	var queries []string
	var total bool
	var limit int
	var offset int
	var projectId string

	cmd := &cobra.Command{
		Use:   "list-policies",
		Short: "Get a list of all project policies and their current configuration.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			queries, err := query.Build(query.Options{
				Queries: queries,
				Limit:   app.FlagInt(cmd, "limit", limit),
				Offset:  app.FlagInt(cmd, "offset", offset),
			})
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.ListPoliciesOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListPoliciesQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListPoliciesTotal(total))
			}

			result, err := service.ListPolicies(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Only supported methods are limit and offset")
	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
	cmd.Flags().IntVar(&limit, "limit", 0, "Maximum number of results to return.")
	cmd.Flags().IntVar(&offset, "offset", 0, "Number of results to skip.")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateDenyAliasedEmailPolicyCommand() *cobra.Command {
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-deny-aliased-email-policy",
		Short: "Configures if aliased emails such as subaddresses and emails with suffixes are denied during new users sign-ups and email updates.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateDenyAliasedEmailPolicy(enabled)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set whether or not to block aliased emails during signup and email updates.")
	_ = cmd.MarkFlagRequired("enabled")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateDenyCorporateEmailPolicyCommand() *cobra.Command {
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-deny-corporate-email-policy",
		Short: "Configures if only corporate email addresses (non-free and non-disposable domains) are allowed during new user sign-ups and email updates.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateDenyCorporateEmailPolicy(enabled)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set whether or not to restrict sign-ups and email updates to corporate email addresses only.")
	_ = cmd.MarkFlagRequired("enabled")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateDenyDisposableEmailPolicyCommand() *cobra.Command {
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-deny-disposable-email-policy",
		Short: "Configures if disposable emails from known temporary domains are denied during new users sign-ups and email updates.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateDenyDisposableEmailPolicy(enabled)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set whether or not to block disposable email addresses during signup and email updates.")
	_ = cmd.MarkFlagRequired("enabled")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateDenyFreeEmailPolicyCommand() *cobra.Command {
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-deny-free-email-policy",
		Short: "Configures if emails from free providers such as Gmail or Yahoo are denied during new users sign-ups and email updates.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateDenyFreeEmailPolicy(enabled)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set whether or not to block free email addresses during signup and email updates.")
	_ = cmd.MarkFlagRequired("enabled")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateMembershipPrivacyPolicyCommand() *cobra.Command {
	var userId bool
	var userEmail bool
	var userPhone bool
	var userName bool
	var userMfa bool
	var userAccessedAt bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-membership-privacy-policy",
		Short: "Updating this policy allows you to control if team members can see other members information. When enabled, all team members can see ID, name, email, phone number, and MFA status of other members..",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateMembershipPrivacyPolicyOption{}
			if cmd.Flags().Changed("user-id") {
				options = append(options, service.WithUpdateMembershipPrivacyPolicyUserId(userId))
			}
			if cmd.Flags().Changed("user-email") {
				options = append(options, service.WithUpdateMembershipPrivacyPolicyUserEmail(userEmail))
			}
			if cmd.Flags().Changed("user-phone") {
				options = append(options, service.WithUpdateMembershipPrivacyPolicyUserPhone(userPhone))
			}
			if cmd.Flags().Changed("user-name") {
				options = append(options, service.WithUpdateMembershipPrivacyPolicyUserName(userName))
			}
			if cmd.Flags().Changed("user-mfa") {
				options = append(options, service.WithUpdateMembershipPrivacyPolicyUserMFA(userMfa))
			}
			if cmd.Flags().Changed("user-accessed-at") {
				options = append(options, service.WithUpdateMembershipPrivacyPolicyUserAccessedAt(userAccessedAt))
			}

			result, err := service.UpdateMembershipPrivacyPolicy(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&userId, "user-id", false, "Set to true if you want make user ID visible to all team members, or false to hide it.")
	cmd.Flags().Lookup("user-id").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&userEmail, "user-email", false, "Set to true if you want make user email visible to all team members, or false to hide it.")
	cmd.Flags().Lookup("user-email").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&userPhone, "user-phone", false, "Set to true if you want make user phone number visible to all team members, or false to hide it.")
	cmd.Flags().Lookup("user-phone").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&userName, "user-name", false, "Set to true if you want make user name visible to all team members, or false to hide it.")
	cmd.Flags().Lookup("user-name").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&userMfa, "user-mfa", false, "Set to true if you want make user MFA status visible to all team members, or false to hide it.")
	cmd.Flags().Lookup("user-mfa").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&userAccessedAt, "user-accessed-at", false, "Set to true if you want make user last access time visible to all team members, or false to hide it.")
	cmd.Flags().Lookup("user-accessed-at").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdatePasswordDictionaryPolicyCommand() *cobra.Command {
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-password-dictionary-policy",
		Short: "Updating this policy allows you to control if new passwords are checked against most common passwords dictionary. When enabled, and user changes their password, password must not be contained in the dictionary.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdatePasswordDictionaryPolicy(enabled)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&enabled, "enabled", false, "Toggle password dictionary policy. Set to true if you want password change to block passwords in the dictionary, or false to allow them. When changing this policy, existing passwords remain valid.")
	_ = cmd.MarkFlagRequired("enabled")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdatePasswordHistoryPolicyCommand() *cobra.Command {
	var total int
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-password-history-policy",
		Short: "Updates one of password strength policies. Based on total length configured, previous password hashes are stored, and users cannot choose a new password that is already stored in the passwird history list, when updating an user password, or setting new one through password recovery.\n\nKeep in mind, while password history policy is disabled, the history is not being stored. Enabling the policy will not have any history on existing users, and it will only start to collect and enforce the policy on password changes since the policy is enabled.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdatePasswordHistoryPolicy(total)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().IntVar(&total, "total", 0, "Set the password history length per user. Value can be between 1 and 20, or null to disable the limit.")
	_ = cmd.MarkFlagRequired("total")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdatePasswordPersonalDataPolicyCommand() *cobra.Command {
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-password-personal-data-policy",
		Short: "Updating this policy allows you to control if password strength is checked against personal data. When enabled, and user sets or changes their password, the password must not contain user ID, name, email or phone number.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdatePasswordPersonalDataPolicy(enabled)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&enabled, "enabled", false, "Toggle password personal data policy. Set to true if you want to block passwords including user's personal data, or false to allow it. When changing this policy, existing passwords remain valid.")
	_ = cmd.MarkFlagRequired("enabled")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdatePasswordStrengthPolicyCommand() *cobra.Command {
	var minArg int
	var uppercase bool
	var lowercase bool
	var number bool
	var symbols bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-password-strength-policy",
		Short: "Update the password strength requirements for users in the project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdatePasswordStrengthPolicyOption{}
			if cmd.Flags().Changed("min") {
				options = append(options, service.WithUpdatePasswordStrengthPolicyMin(minArg))
			}
			if cmd.Flags().Changed("uppercase") {
				options = append(options, service.WithUpdatePasswordStrengthPolicyUppercase(uppercase))
			}
			if cmd.Flags().Changed("lowercase") {
				options = append(options, service.WithUpdatePasswordStrengthPolicyLowercase(lowercase))
			}
			if cmd.Flags().Changed("number") {
				options = append(options, service.WithUpdatePasswordStrengthPolicyNumber(number))
			}
			if cmd.Flags().Changed("symbols") {
				options = append(options, service.WithUpdatePasswordStrengthPolicySymbols(symbols))
			}

			result, err := service.UpdatePasswordStrengthPolicy(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().IntVar(&minArg, "min", 0, "Minimum password length. Value must be between 8 and 256. Default is 8.")
	cmd.Flags().BoolVar(&uppercase, "uppercase", false, "Whether passwords must include at least one uppercase letter.")
	cmd.Flags().Lookup("uppercase").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&lowercase, "lowercase", false, "Whether passwords must include at least one lowercase letter.")
	cmd.Flags().Lookup("lowercase").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&number, "number", false, "Whether passwords must include at least one number.")
	cmd.Flags().Lookup("number").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&symbols, "symbols", false, "Whether passwords must include at least one symbol.")
	cmd.Flags().Lookup("symbols").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateSessionAlertPolicyCommand() *cobra.Command {
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-session-alert-policy",
		Short: "Updating this policy allows you to control if email alert is sent upon session creation. When enabled, and user signs into their account, they will be sent an email notification. There is an exception, the first session after a new sign up does not trigger an alert, even if the policy is enabled.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateSessionAlertPolicy(enabled)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&enabled, "enabled", false, "Toggle session alert policy. Set to true if you want users to receive email notifications when a sessions are created for their users, or false to not send email alerts.")
	_ = cmd.MarkFlagRequired("enabled")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateSessionDurationPolicyCommand() *cobra.Command {
	var duration int
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-session-duration-policy",
		Short: "Update maximum duration how long sessions created within a project should stay active for.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateSessionDurationPolicy(duration)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().IntVar(&duration, "duration", 0, "Maximum session length in seconds. Minium allowed value is 60 seconds, and maximum is 1 year, which is 31536000 seconds.")
	_ = cmd.MarkFlagRequired("duration")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateSessionInvalidationPolicyCommand() *cobra.Command {
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-session-invalidation-policy",
		Short: "Updating this policy allows you to control if existing sessions should be invalidated when a password of a user is changed. When enabled, and user changes their password, they will be logged out of all their devices.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateSessionInvalidationPolicy(enabled)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&enabled, "enabled", false, "Toggle session invalidation policy. Set to true if you want password change to invalidate all sessions of an user, or false to keep sessions active.")
	_ = cmd.MarkFlagRequired("enabled")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateSessionLimitPolicyCommand() *cobra.Command {
	var total int
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-session-limit-policy",
		Short: "Update the maximum number of sessions allowed per user. When the limit is hit, the oldest session will be deleted to make room for new one.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateSessionLimitPolicy(total)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().IntVar(&total, "total", 0, "Set the maximum number of sessions allowed per user. Value can be between 1 and 100.")
	_ = cmd.MarkFlagRequired("total")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateUserLimitPolicyCommand() *cobra.Command {
	var total int
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-user-limit-policy",
		Short: "Update the maximum number of users in the project. When the limit is hit or amount of existing users already exceeded the limit, all users remain active, but new user sign up will be prohibited.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateUserLimitPolicy(total)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().IntVar(&total, "total", 0, "Set the maximum number of users allowed in the project. Value can be between 0 and 10000. Use 0 or null to disable the limit.")
	_ = cmd.MarkFlagRequired("total")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectGetPolicyCommand() *cobra.Command {
	var policyId string
	var projectId string

	cmd := &cobra.Command{
		Use:   "get-policy",
		Short: "Get a policy by its unique ID. This endpoint returns the current configuration for the requested project policy.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.GetPolicy(policyId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&policyId, "policy-id", "", "Policy ID. Can be one of: password-dictionary, password-history, password-strength, password-personal-data, session-alert, session-duration, session-invalidation, session-limit, user-limit, membership-privacy, deny-aliased-email, deny-disposable-email, deny-free-email, deny-corporate-email.")
	_ = cmd.MarkFlagRequired("policy-id")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateProtocolCommand() *cobra.Command {
	var protocolId string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-protocol",
		Short: "Update properties of a specific protocol. Use this endpoint to enable or disable a protocol in your project. ",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateProtocol(protocolId, enabled)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&protocolId, "protocol-id", "", "Protocol name. Can be one of: rest, graphql, websocket")
	_ = cmd.MarkFlagRequired("protocol-id")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Protocol status.")
	_ = cmd.MarkFlagRequired("enabled")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateServiceCommand() *cobra.Command {
	var serviceId string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-service",
		Short: "Update properties of a specific service. Use this endpoint to enable or disable a service in your project. ",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.UpdateService(serviceId, enabled)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&serviceId, "service-id", "", "Service name. Can be one of: account, avatars, databases, tablesdb, locale, health, project, storage, teams, users, vcs, sites, functions, proxy, graphql, migrations, messaging, advisor, oauth2")
	_ = cmd.MarkFlagRequired("service-id")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Service status.")
	_ = cmd.MarkFlagRequired("enabled")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateSMTPCommand() *cobra.Command {
	var host string
	var port int
	var username string
	var password string
	var senderEmail string
	var senderName string
	var replyToEmail string
	var replyToName string
	var secure string
	var enabled bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-smtp",
		Short: "Update the SMTP configuration for your project. Use this endpoint to configure your project's SMTP provider with your custom settings for sending transactional emails.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateSMTPOption{}
			if cmd.Flags().Changed("host") {
				options = append(options, service.WithUpdateSMTPHost(host))
			}
			if cmd.Flags().Changed("port") {
				options = append(options, service.WithUpdateSMTPPort(port))
			}
			if cmd.Flags().Changed("username") {
				options = append(options, service.WithUpdateSMTPUsername(username))
			}
			if cmd.Flags().Changed("password") {
				options = append(options, service.WithUpdateSMTPPassword(password))
			}
			if cmd.Flags().Changed("sender-email") {
				options = append(options, service.WithUpdateSMTPSenderEmail(senderEmail))
			}
			if cmd.Flags().Changed("sender-name") {
				options = append(options, service.WithUpdateSMTPSenderName(senderName))
			}
			if cmd.Flags().Changed("reply-to-email") {
				options = append(options, service.WithUpdateSMTPReplyToEmail(replyToEmail))
			}
			if cmd.Flags().Changed("reply-to-name") {
				options = append(options, service.WithUpdateSMTPReplyToName(replyToName))
			}
			if cmd.Flags().Changed("secure") {
				options = append(options, service.WithUpdateSMTPSecure(secure))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateSMTPEnabled(enabled))
			}

			result, err := service.UpdateSMTP(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&host, "host", "", "SMTP server hostname (domain)")
	cmd.Flags().IntVar(&port, "port", 0, "SMTP server port")
	cmd.Flags().StringVar(&username, "username", "", "SMTP server username. Pass an empty string to clear a previously set value.")
	cmd.Flags().StringVar(&password, "password", "", "SMTP server password. Pass an empty string to clear a previously set value. This property is stored securely and cannot be read in future (write-only).")
	cmd.Flags().StringVar(&senderEmail, "sender-email", "", "Email address shown in inbox as the sender of the email. Pass an empty string to clear a previously set value.")
	cmd.Flags().StringVar(&senderName, "sender-name", "", "Name shown in inbox as the sender of the email. Pass an empty string to clear a previously set value.")
	cmd.Flags().StringVar(&replyToEmail, "reply-to-email", "", "Email used when user replies to the email. Pass an empty string to clear a previously set value.")
	cmd.Flags().StringVar(&replyToName, "reply-to-name", "", "Name used when user replies to the email. Pass an empty string to clear a previously set value.")
	cmd.Flags().StringVar(&secure, "secure", "", "Configures if communication with SMTP server is encrypted. Allowed values are: tls, ssl. Leave empty for no encryption.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Enable or disable custom SMTP. Custom SMTP is useful for branding purposes, but also allows use of custom email templates.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectCreateSMTPTestCommand() *cobra.Command {
	var emails []string
	var projectId string

	cmd := &cobra.Command{
		Use:   "create-smtp-test",
		Short: "Send a test email to verify SMTP configuration. ",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.CreateSMTPTest(emails)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&emails, "emails", nil, "Array of emails to send test email to. Maximum of 10 emails are allowed.")
	_ = cmd.MarkFlagRequired("emails")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectListEmailTemplatesCommand() *cobra.Command {
	var queries []string
	var total bool
	var limit int
	var offset int
	var projectId string

	cmd := &cobra.Command{
		Use:   "list-email-templates",
		Short: "Get a list of all custom email templates configured for the project. This endpoint returns an array of all configured email templates and their locales.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			queries, err := query.Build(query.Options{
				Queries: queries,
				Limit:   app.FlagInt(cmd, "limit", limit),
				Offset:  app.FlagInt(cmd, "offset", offset),
			})
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.ListEmailTemplatesOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListEmailTemplatesQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListEmailTemplatesTotal(total))
			}

			result, err := service.ListEmailTemplates(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Only supported methods are limit and offset")
	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
	cmd.Flags().IntVar(&limit, "limit", 0, "Maximum number of results to return.")
	cmd.Flags().IntVar(&offset, "offset", 0, "Number of results to skip.")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateEmailTemplateCommand() *cobra.Command {
	var templateId string
	var locale string
	var subject string
	var message string
	var senderName string
	var senderEmail string
	var replyToEmail string
	var replyToName string
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-email-template",
		Short: "Update a custom email template for the specified locale and type. Use this endpoint to modify the content of your email templates.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateEmailTemplateOption{}
			if cmd.Flags().Changed("locale") {
				options = append(options, service.WithUpdateEmailTemplateLocale(locale))
			}
			if cmd.Flags().Changed("subject") {
				options = append(options, service.WithUpdateEmailTemplateSubject(subject))
			}
			if cmd.Flags().Changed("message") {
				options = append(options, service.WithUpdateEmailTemplateMessage(message))
			}
			if cmd.Flags().Changed("sender-name") {
				options = append(options, service.WithUpdateEmailTemplateSenderName(senderName))
			}
			if cmd.Flags().Changed("sender-email") {
				options = append(options, service.WithUpdateEmailTemplateSenderEmail(senderEmail))
			}
			if cmd.Flags().Changed("reply-to-email") {
				options = append(options, service.WithUpdateEmailTemplateReplyToEmail(replyToEmail))
			}
			if cmd.Flags().Changed("reply-to-name") {
				options = append(options, service.WithUpdateEmailTemplateReplyToName(replyToName))
			}

			result, err := service.UpdateEmailTemplate(templateId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&templateId, "template-id", "", "Custom email template type. Can be one of: verification, magicSession, recovery, invitation, mfaChallenge, sessionAlert, otpSession")
	_ = cmd.MarkFlagRequired("template-id")
	cmd.Flags().StringVar(&locale, "locale", "", "Custom email template locale. If left empty, the fallback locale (en) will be used.")
	cmd.Flags().StringVar(&subject, "subject", "", "Subject of the email template. Can be up to 255 characters.")
	cmd.Flags().StringVar(&message, "message", "", "Plain or HTML body of the email template message. Can be up to 10MB of content.")
	cmd.Flags().StringVar(&senderName, "sender-name", "", "Name of the email sender.")
	cmd.Flags().StringVar(&senderEmail, "sender-email", "", "Email of the sender. Pass an empty string to clear a previously set value.")
	cmd.Flags().StringVar(&replyToEmail, "reply-to-email", "", "Reply to email. Pass an empty string to clear a previously set value.")
	cmd.Flags().StringVar(&replyToName, "reply-to-name", "", "Reply to name.")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectGetEmailTemplateCommand() *cobra.Command {
	var templateId string
	var locale string
	var projectId string

	cmd := &cobra.Command{
		Use:   "get-email-template",
		Short: "Get a custom email template for the specified locale and type. This endpoint returns the template content, subject, and other configuration details.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.GetEmailTemplateOption{}
			if cmd.Flags().Changed("locale") {
				options = append(options, service.WithGetEmailTemplateLocale(locale))
			}

			result, err := service.GetEmailTemplate(templateId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&templateId, "template-id", "", "Custom email template type. Can be one of: verification, magicSession, recovery, invitation, mfaChallenge, sessionAlert, otpSession")
	_ = cmd.MarkFlagRequired("template-id")
	cmd.Flags().StringVar(&locale, "locale", "", "Custom email template locale. If left empty, the fallback locale (en) will be used.")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectListVariablesCommand() *cobra.Command {
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
	var projectId string

	cmd := &cobra.Command{
		Use:   "list-variables",
		Short: "Get a list of all project environment variables.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

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
			options := []project.ListVariablesOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListVariablesQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListVariablesTotal(total))
			}

			result, err := service.ListVariables(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, resourceType, resourceId, secret")
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
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectCreateVariableCommand() *cobra.Command {
	var variableId string
	var key string
	var value string
	var secret bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "create-variable",
		Short: "Create a new project environment variable. These variables can be accessed by all functions and sites in the project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.CreateVariableOption{}
			if cmd.Flags().Changed("secret") {
				options = append(options, service.WithCreateVariableSecret(secret))
			}

			result, err := service.CreateVariable(variableId, key, value, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&variableId, "variable-id", "", "Variable unique ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("variable-id")
	cmd.Flags().StringVar(&key, "key", "", "Variable key. Max length: 255 chars.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().StringVar(&value, "value", "", "Variable value. Max length: 8192 chars.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().BoolVar(&secret, "secret", false, "Secret variables can be updated or deleted, but only projects can read them during build and runtime.")
	cmd.Flags().Lookup("secret").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectGetVariableCommand() *cobra.Command {
	var variableId string
	var projectId string

	cmd := &cobra.Command{
		Use:   "get-variable",
		Short: "Get a variable by its unique ID. ",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.GetVariable(variableId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&variableId, "variable-id", "", "Variable unique ID.")
	_ = cmd.MarkFlagRequired("variable-id")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectUpdateVariableCommand() *cobra.Command {
	var variableId string
	var key string
	var value string
	var secret bool
	var projectId string

	cmd := &cobra.Command{
		Use:   "update-variable",
		Short: "Update variable by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []project.UpdateVariableOption{}
			if cmd.Flags().Changed("key") {
				options = append(options, service.WithUpdateVariableKey(key))
			}
			if cmd.Flags().Changed("value") {
				options = append(options, service.WithUpdateVariableValue(value))
			}
			if cmd.Flags().Changed("secret") {
				options = append(options, service.WithUpdateVariableSecret(secret))
			}

			result, err := service.UpdateVariable(variableId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&variableId, "variable-id", "", "Variable unique ID.")
	_ = cmd.MarkFlagRequired("variable-id")
	cmd.Flags().StringVar(&key, "key", "", "Variable key. Max length: 255 chars.")
	cmd.Flags().StringVar(&value, "value", "", "Variable value. Max length: 8192 chars.")
	cmd.Flags().BoolVar(&secret, "secret", false, "Secret variables can be updated or deleted, but only projects can read them during build and runtime.")
	cmd.Flags().Lookup("secret").NoOptDefVal = "true"
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}

func newProjectDeleteVariableCommand() *cobra.Command {
	var variableId string
	var projectId string

	cmd := &cobra.Command{
		Use:   "delete-variable",
		Short: "Delete a variable by its unique ID. ",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject(projectId)
			if err != nil {
				return err
			}
			service := project.New(client)

			result, err := service.DeleteVariable(variableId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&variableId, "variable-id", "", "Variable unique ID.")
	_ = cmd.MarkFlagRequired("variable-id")
	cmd.Flags().StringVar(&projectId, "project-id", "", "Project to act on. Defaults to the project linked in appwrite.config.json.")
	return cmd
}
