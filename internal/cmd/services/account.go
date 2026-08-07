package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/account"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewAccountCommand builds the `account` command tree.
func NewAccountCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "account",
		Short: "The Account service allows you to authenticate and manage a user account.",
	}

	cmd.AddCommand(newAccountGetCommand())
	cmd.AddCommand(newAccountCreateCommand())
	cmd.AddCommand(newAccountListConsentsCommand())
	cmd.AddCommand(newAccountGetConsentCommand())
	cmd.AddCommand(newAccountDeleteConsentCommand())
	cmd.AddCommand(newAccountListConsentTokensCommand())
	cmd.AddCommand(newAccountGetConsentTokenCommand())
	cmd.AddCommand(newAccountDeleteConsentTokenCommand())
	cmd.AddCommand(newAccountUpdateEmailCommand())
	cmd.AddCommand(newAccountListIdentitiesCommand())
	cmd.AddCommand(newAccountDeleteIdentityCommand())
	cmd.AddCommand(newAccountCreateJWTCommand())
	cmd.AddCommand(newAccountListLogsCommand())
	cmd.AddCommand(newAccountUpdateMFACommand())
	cmd.AddCommand(newAccountCreateMfaAuthenticatorCommand())
	cmd.AddCommand(newAccountUpdateMfaAuthenticatorCommand())
	cmd.AddCommand(newAccountDeleteMfaAuthenticatorCommand())
	cmd.AddCommand(newAccountCreateMfaChallengeCommand())
	cmd.AddCommand(newAccountUpdateMfaChallengeCommand())
	cmd.AddCommand(newAccountListMfaFactorsCommand())
	cmd.AddCommand(newAccountGetMfaRecoveryCodesCommand())
	cmd.AddCommand(newAccountCreateMfaRecoveryCodesCommand())
	cmd.AddCommand(newAccountUpdateMfaRecoveryCodesCommand())
	cmd.AddCommand(newAccountUpdateNameCommand())
	cmd.AddCommand(newAccountUpdatePasswordCommand())
	cmd.AddCommand(newAccountUpdatePhoneCommand())
	cmd.AddCommand(newAccountGetPrefsCommand())
	cmd.AddCommand(newAccountUpdatePrefsCommand())
	cmd.AddCommand(newAccountCreateRecoveryCommand())
	cmd.AddCommand(newAccountUpdateRecoveryCommand())
	cmd.AddCommand(newAccountListSessionsCommand())
	cmd.AddCommand(newAccountDeleteSessionsCommand())
	cmd.AddCommand(newAccountCreateAnonymousSessionCommand())
	cmd.AddCommand(newAccountCreateEmailPasswordSessionCommand())
	cmd.AddCommand(newAccountUpdateMagicURLSessionCommand())
	cmd.AddCommand(newAccountUpdatePhoneSessionCommand())
	cmd.AddCommand(newAccountCreateSessionCommand())
	cmd.AddCommand(newAccountGetSessionCommand())
	cmd.AddCommand(newAccountUpdateSessionCommand())
	cmd.AddCommand(newAccountDeleteSessionCommand())
	cmd.AddCommand(newAccountUpdateStatusCommand())
	cmd.AddCommand(newAccountCreateEmailTokenCommand())
	cmd.AddCommand(newAccountCreateMagicURLTokenCommand())
	cmd.AddCommand(newAccountCreateOAuth2TokenCommand())
	cmd.AddCommand(newAccountCreatePhoneTokenCommand())
	cmd.AddCommand(newAccountCreateEmailVerificationCommand())
	cmd.AddCommand(newAccountCreateVerificationCommand())
	cmd.AddCommand(newAccountUpdateEmailVerificationCommand())
	cmd.AddCommand(newAccountUpdateVerificationCommand())
	cmd.AddCommand(newAccountCreatePhoneVerificationCommand())
	cmd.AddCommand(newAccountUpdatePhoneVerificationCommand())

	return cmd
}

func newAccountGetCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get the currently logged in user.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.Get()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newAccountCreateCommand() *cobra.Command {
	var userId string
	var email string
	var password string
	var name string

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Use this endpoint to allow a new user to register a new account in your project. After the user registration completes successfully, you can use the /account/verfication (https://appwrite.io/docs/references/cloud/client-web/account#createVerification) route to start verifying the user email address. To allow the new user to login to their new account, you need to create a new account session (https://appwrite.io/docs/references/cloud/client-web/account#createEmailSession).",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []account.CreateOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithCreateName(name))
			}

			result, err := service.Create(userId, email, password, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&email, "email", "", "User email.")
	_ = cmd.MarkFlagRequired("email")
	cmd.Flags().StringVar(&password, "password", "", "New user password. Must be between 8 and 256 chars.")
	_ = cmd.MarkFlagRequired("password")
	cmd.Flags().StringVar(&name, "name", "", "User name. Max length: 128 chars.")
	return cmd
}

func newAccountListConsentsCommand() *cobra.Command {
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
		Use:   "list-consents",
		Short: "Get a list of the OAuth2 consents the current user has given to third-party apps.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

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
			options := []account.ListConsentsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListConsentsQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListConsentsTotal(total))
			}

			result, err := service.ListConsents(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.")
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

func newAccountGetConsentCommand() *cobra.Command {
	var consentId string

	cmd := &cobra.Command{
		Use:   "get-consent",
		Short: "Get an OAuth2 consent the current user has given to a third-party app by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.GetConsent(consentId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&consentId, "consent-id", "", "Consent unique ID.")
	_ = cmd.MarkFlagRequired("consent-id")
	return cmd
}

func newAccountDeleteConsentCommand() *cobra.Command {
	var consentId string

	cmd := &cobra.Command{
		Use:   "delete-consent",
		Short: "Delete an OAuth2 consent by its unique ID. All token families issued under the consent are revoked, and the app must ask for consent again to regain access.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.DeleteConsent(consentId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&consentId, "consent-id", "", "Consent unique ID.")
	_ = cmd.MarkFlagRequired("consent-id")
	return cmd
}

func newAccountListConsentTokensCommand() *cobra.Command {
	var consentId string
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
		Use:   "list-consent-tokens",
		Short: "Get a list of the token families issued under an OAuth2 consent. Each entry represents one authorized device or session; the token secrets themselves are never returned.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

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
			options := []account.ListConsentTokensOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListConsentTokensQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListConsentTokensTotal(total))
			}

			result, err := service.ListConsentTokens(consentId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&consentId, "consent-id", "", "Consent unique ID.")
	_ = cmd.MarkFlagRequired("consent-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.")
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

func newAccountGetConsentTokenCommand() *cobra.Command {
	var consentId string
	var tokenId string

	cmd := &cobra.Command{
		Use:   "get-consent-token",
		Short: "Get a token family issued under an OAuth2 consent by its unique ID. The token secrets themselves are never returned.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.GetConsentToken(consentId, tokenId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&consentId, "consent-id", "", "Consent unique ID.")
	_ = cmd.MarkFlagRequired("consent-id")
	cmd.Flags().StringVar(&tokenId, "token-id", "", "Token unique ID.")
	_ = cmd.MarkFlagRequired("token-id")
	return cmd
}

func newAccountDeleteConsentTokenCommand() *cobra.Command {
	var consentId string
	var tokenId string

	cmd := &cobra.Command{
		Use:   "delete-consent-token",
		Short: "Delete a token family issued under an OAuth2 consent by its unique ID. The access and refresh tokens of the family stop working immediately; other token families and the consent itself are unaffected.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.DeleteConsentToken(consentId, tokenId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&consentId, "consent-id", "", "Consent unique ID.")
	_ = cmd.MarkFlagRequired("consent-id")
	cmd.Flags().StringVar(&tokenId, "token-id", "", "Token unique ID.")
	_ = cmd.MarkFlagRequired("token-id")
	return cmd
}

func newAccountUpdateEmailCommand() *cobra.Command {
	var email string
	var password string

	cmd := &cobra.Command{
		Use:   "update-email",
		Short: "Update currently logged in user account email address. After changing user address, the user confirmation status will get reset. A new confirmation email is not sent automatically however you can use the send confirmation email endpoint again to send the confirmation email. For security measures, user password is required to complete this request.\nThis endpoint can also be used to convert an anonymous account to a normal one, by passing an email address and a new password.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.UpdateEmail(email, password)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&email, "email", "", "User email.")
	_ = cmd.MarkFlagRequired("email")
	cmd.Flags().StringVar(&password, "password", "", "User password. Must be at least 8 chars.")
	_ = cmd.MarkFlagRequired("password")
	return cmd
}

func newAccountListIdentitiesCommand() *cobra.Command {
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
		Use:   "list-identities",
		Short: "Get the list of identities for the currently logged in user.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

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
			options := []account.ListIdentitiesOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListIdentitiesQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListIdentitiesTotal(total))
			}

			result, err := service.ListIdentities(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, provider, providerUid, providerEmail, providerAccessTokenExpiry")
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

func newAccountDeleteIdentityCommand() *cobra.Command {
	var identityId string

	cmd := &cobra.Command{
		Use:   "delete-identity",
		Short: "Delete an identity by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.DeleteIdentity(identityId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&identityId, "identity-id", "", "Identity ID.")
	_ = cmd.MarkFlagRequired("identity-id")
	return cmd
}

func newAccountCreateJWTCommand() *cobra.Command {
	var duration int

	cmd := &cobra.Command{
		Use:   "create-jwt",
		Short: "Use this endpoint to create a JSON Web Token. You can use the resulting JWT to authenticate on behalf of the current user when working with the Appwrite server-side API and SDKs. The JWT secret is valid for 15 minutes from its creation and will be invalid if the user will logout in that time frame.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []account.CreateJWTOption{}
			if cmd.Flags().Changed("duration") {
				options = append(options, service.WithCreateJWTDuration(duration))
			}

			result, err := service.CreateJWT(options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().IntVar(&duration, "duration", 0, "Time in seconds before JWT expires. Default duration is 900 seconds, and maximum is 3600 seconds.")
	return cmd
}

func newAccountListLogsCommand() *cobra.Command {
	var queries []string
	var total bool
	var limit int
	var offset int

	cmd := &cobra.Command{
		Use:   "list-logs",
		Short: "Get the list of latest security activity logs for the currently logged in user. Each log returns user IP address, location and date and time of log.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

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
			options := []account.ListLogsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListLogsQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListLogsTotal(total))
			}

			result, err := service.ListLogs(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Only supported methods are limit and offset")
	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
	cmd.Flags().IntVar(&limit, "limit", 0, "Maximum number of results to return.")
	cmd.Flags().IntVar(&offset, "offset", 0, "Number of results to skip.")
	return cmd
}

func newAccountUpdateMFACommand() *cobra.Command {
	var mfa bool

	cmd := &cobra.Command{
		Use:   "update-mfa",
		Short: "Enable or disable MFA on an account.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.UpdateMFA(mfa)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&mfa, "mfa", false, "Enable or disable MFA.")
	_ = cmd.MarkFlagRequired("mfa")
	return cmd
}

func newAccountCreateMfaAuthenticatorCommand() *cobra.Command {
	var typeArg string

	cmd := &cobra.Command{
		Use:   "create-mfa-authenticator",
		Short: "Add an authenticator app to be used as an MFA factor. Verify the authenticator using the verify authenticator method.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.CreateMfaAuthenticator(typeArg)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&typeArg, "type", "", "Type of authenticator. Must be `totp`")
	_ = cmd.MarkFlagRequired("type")
	return cmd
}

func newAccountUpdateMfaAuthenticatorCommand() *cobra.Command {
	var typeArg string
	var otp string

	cmd := &cobra.Command{
		Use:   "update-mfa-authenticator",
		Short: "Verify an authenticator app after adding it using the add authenticator method.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.UpdateMfaAuthenticator(typeArg, otp)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&typeArg, "type", "", "Type of authenticator.")
	_ = cmd.MarkFlagRequired("type")
	cmd.Flags().StringVar(&otp, "otp", "", "Valid verification token.")
	_ = cmd.MarkFlagRequired("otp")
	return cmd
}

func newAccountDeleteMfaAuthenticatorCommand() *cobra.Command {
	var typeArg string

	cmd := &cobra.Command{
		Use:   "delete-mfa-authenticator",
		Short: "Delete an authenticator for a user by ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.DeleteMfaAuthenticator(typeArg)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&typeArg, "type", "", "Type of authenticator.")
	_ = cmd.MarkFlagRequired("type")
	return cmd
}

func newAccountCreateMfaChallengeCommand() *cobra.Command {
	var factor string

	cmd := &cobra.Command{
		Use:   "create-mfa-challenge",
		Short: "Begin the process of MFA verification after sign-in. Finish the flow with updateMfaChallenge method.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.CreateMfaChallenge(factor)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&factor, "factor", "", "Factor used for verification. Must be one of following: `email`, `phone`, `totp`, `recoveryCode`.")
	_ = cmd.MarkFlagRequired("factor")
	return cmd
}

func newAccountUpdateMfaChallengeCommand() *cobra.Command {
	var challengeId string
	var otp string

	cmd := &cobra.Command{
		Use:   "update-mfa-challenge",
		Short: "Complete the MFA challenge by providing the one-time password. Finish the process of MFA verification by providing the one-time password. To begin the flow, use createMfaChallenge method.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.UpdateMfaChallenge(challengeId, otp)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&challengeId, "challenge-id", "", "ID of the challenge.")
	_ = cmd.MarkFlagRequired("challenge-id")
	cmd.Flags().StringVar(&otp, "otp", "", "Valid verification token.")
	_ = cmd.MarkFlagRequired("otp")
	return cmd
}

func newAccountListMfaFactorsCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-mfa-factors",
		Short: "List the factors available on the account to be used as a MFA challange.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.ListMfaFactors()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newAccountGetMfaRecoveryCodesCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "get-mfa-recovery-codes",
		Short: "Get recovery codes that can be used as backup for MFA flow. Before getting codes, they must be generated using createMfaRecoveryCodes method. An OTP challenge is required to read recovery codes.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.GetMfaRecoveryCodes()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newAccountCreateMfaRecoveryCodesCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "create-mfa-recovery-codes",
		Short: "Generate recovery codes as backup for MFA flow. It's recommended to generate and show then immediately after user successfully adds their authehticator. Recovery codes can be used as a MFA verification type in createMfaChallenge method.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.CreateMfaRecoveryCodes()
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newAccountUpdateMfaRecoveryCodesCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "update-mfa-recovery-codes",
		Short: "Regenerate recovery codes that can be used as backup for MFA flow. Before regenerating codes, they must be first generated using createMfaRecoveryCodes method. An OTP challenge is required to regenreate recovery codes.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.UpdateMfaRecoveryCodes()
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newAccountUpdateNameCommand() *cobra.Command {
	var name string

	cmd := &cobra.Command{
		Use:   "update-name",
		Short: "Update currently logged in user account name.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.UpdateName(name)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&name, "name", "", "User name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	return cmd
}

func newAccountUpdatePasswordCommand() *cobra.Command {
	var password string
	var oldPassword string

	cmd := &cobra.Command{
		Use:   "update-password",
		Short: "Update currently logged in user password. For validation, user is required to pass in the new password, and the old password. For users created with OAuth, Team Invites and Magic URL, oldPassword is optional.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []account.UpdatePasswordOption{}
			if cmd.Flags().Changed("old-password") {
				options = append(options, service.WithUpdatePasswordOldPassword(oldPassword))
			}

			result, err := service.UpdatePassword(password, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&password, "password", "", "New user password. Must be at least 8 chars.")
	_ = cmd.MarkFlagRequired("password")
	cmd.Flags().StringVar(&oldPassword, "old-password", "", "Current user password. Max length: 256 chars.")
	return cmd
}

func newAccountUpdatePhoneCommand() *cobra.Command {
	var phone string
	var password string

	cmd := &cobra.Command{
		Use:   "update-phone",
		Short: "Update the currently logged in user's phone number. After updating the phone number, the phone verification status will be reset. A confirmation SMS is not sent automatically, however you can use the POST /account/verification/phone (https://appwrite.io/docs/references/cloud/client-web/account#createPhoneVerification) endpoint to send a confirmation SMS.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.UpdatePhone(phone, password)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&phone, "phone", "", "Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.")
	_ = cmd.MarkFlagRequired("phone")
	cmd.Flags().StringVar(&password, "password", "", "User password. Must be at least 8 chars.")
	_ = cmd.MarkFlagRequired("password")
	return cmd
}

func newAccountGetPrefsCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "get-prefs",
		Short: "Get the preferences as a key-value object for the currently logged in user.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.GetPrefs()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newAccountUpdatePrefsCommand() *cobra.Command {
	var prefs string

	cmd := &cobra.Command{
		Use:   "update-prefs",
		Short: "Update currently logged in user account preferences. The object you pass is stored as is, and replaces any previous value. The maximum allowed prefs size is 64kB and throws error if exceeded.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)
			prefsValue, err := app.JSONObject(prefs)
			if err != nil {
				return err
			}

			result, err := service.UpdatePrefs(prefsValue)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&prefs, "prefs", "", "Prefs key-value JSON object.")
	_ = cmd.MarkFlagRequired("prefs")
	return cmd
}

func newAccountCreateRecoveryCommand() *cobra.Command {
	var email string
	var url string

	cmd := &cobra.Command{
		Use:   "create-recovery",
		Short: "Sends the user an email with a temporary secret key for password reset. When the user clicks the confirmation link he is redirected back to your app password reset URL with the secret key and email address values attached to the URL query string. Use the query string params to submit a request to the PUT /account/recovery (https://appwrite.io/docs/references/cloud/client-web/account#updateRecovery) endpoint to complete the process. The verification link sent to the user's email address is valid for 1 hour.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.CreateRecovery(email, url)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&email, "email", "", "User email.")
	_ = cmd.MarkFlagRequired("email")
	cmd.Flags().StringVar(&url, "url", "", "URL to redirect the user back to your app from the recovery email. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an open redirect (https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.")
	_ = cmd.MarkFlagRequired("url")
	return cmd
}

func newAccountUpdateRecoveryCommand() *cobra.Command {
	var userId string
	var secret string
	var password string

	cmd := &cobra.Command{
		Use:   "update-recovery",
		Short: "Use this endpoint to complete the user account password reset. Both the userId and secret arguments will be passed as query parameters to the redirect URL you have provided when sending your request to the POST /account/recovery (https://appwrite.io/docs/references/cloud/client-web/account#createRecovery) endpoint.\n\nPlease note that in order to avoid a Redirect Attack (https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md) the only valid redirect URLs are the ones from domains you have set when adding your platforms in the console interface.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.UpdateRecovery(userId, secret, password)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&secret, "secret", "", "Valid reset token.")
	_ = cmd.MarkFlagRequired("secret")
	cmd.Flags().StringVar(&password, "password", "", "New user password. Must be between 8 and 256 chars.")
	_ = cmd.MarkFlagRequired("password")
	return cmd
}

func newAccountListSessionsCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-sessions",
		Short: "Get the list of active sessions across different devices for the currently logged in user.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.ListSessions()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newAccountDeleteSessionsCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "delete-sessions",
		Short: "Delete all sessions from the user account and remove any sessions cookies from the end client.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.DeleteSessions()
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newAccountCreateAnonymousSessionCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "create-anonymous-session",
		Short: "Use this endpoint to allow a new user to register an anonymous account in your project. This route will also create a new session for the user. To allow the new user to convert an anonymous account to a normal account, you need to update its email and password (https://appwrite.io/docs/references/cloud/client-web/account#updateEmail) or create an OAuth2 session (https://appwrite.io/docs/references/cloud/client-web/account#CreateOAuth2Session).",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.CreateAnonymousSession()
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newAccountCreateEmailPasswordSessionCommand() *cobra.Command {
	var email string
	var password string

	cmd := &cobra.Command{
		Use:   "create-email-password-session",
		Short: "Allow the user to login into their account by providing a valid email and password combination. This route will create a new session for the user.\n\nA user is limited to 10 active sessions at a time by default. Learn more about session limits (https://appwrite.io/docs/authentication-security#limits).",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.CreateEmailPasswordSession(email, password)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&email, "email", "", "User email.")
	_ = cmd.MarkFlagRequired("email")
	cmd.Flags().StringVar(&password, "password", "", "User password. Must be at least 8 chars.")
	_ = cmd.MarkFlagRequired("password")
	return cmd
}

func newAccountUpdateMagicURLSessionCommand() *cobra.Command {
	var userId string
	var secret string

	cmd := &cobra.Command{
		Use:   "update-magic-url-session",
		Short: "Use this endpoint to create a session from token. Provide the userId and secret parameters from the successful response of authentication flows initiated by token creation. For example, magic URL and phone login.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.UpdateMagicURLSession(userId, secret)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&secret, "secret", "", "Valid verification token.")
	_ = cmd.MarkFlagRequired("secret")
	return cmd
}

func newAccountUpdatePhoneSessionCommand() *cobra.Command {
	var userId string
	var secret string

	cmd := &cobra.Command{
		Use:   "update-phone-session",
		Short: "Use this endpoint to create a session from token. Provide the userId and secret parameters from the successful response of authentication flows initiated by token creation. For example, magic URL and phone login.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.UpdatePhoneSession(userId, secret)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&secret, "secret", "", "Valid verification token.")
	_ = cmd.MarkFlagRequired("secret")
	return cmd
}

func newAccountCreateSessionCommand() *cobra.Command {
	var userId string
	var secret string

	cmd := &cobra.Command{
		Use:   "create-session",
		Short: "Use this endpoint to create a session from token. Provide the userId and secret parameters from the successful response of authentication flows initiated by token creation. For example, magic URL and phone login.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.CreateSession(userId, secret)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&secret, "secret", "", "Secret of a token generated by login methods. For example, the `createMagicURLToken` or `createPhoneToken` methods.")
	_ = cmd.MarkFlagRequired("secret")
	return cmd
}

func newAccountGetSessionCommand() *cobra.Command {
	var sessionId string

	cmd := &cobra.Command{
		Use:   "get-session",
		Short: "Use this endpoint to get a logged in user's session using a Session ID. Inputting 'current' will return the current session being used.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.GetSession(sessionId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&sessionId, "session-id", "", "Session ID. Use the string 'current' to get the current device session.")
	_ = cmd.MarkFlagRequired("session-id")
	return cmd
}

func newAccountUpdateSessionCommand() *cobra.Command {
	var sessionId string

	cmd := &cobra.Command{
		Use:   "update-session",
		Short: "Use this endpoint to extend a session's length. Extending a session is useful when session expiry is short. If the session was created using an OAuth provider, this endpoint refreshes the access token from the provider.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.UpdateSession(sessionId)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&sessionId, "session-id", "", "Session ID. Use the string 'current' to update the current device session.")
	_ = cmd.MarkFlagRequired("session-id")
	return cmd
}

func newAccountDeleteSessionCommand() *cobra.Command {
	var sessionId string

	cmd := &cobra.Command{
		Use:   "delete-session",
		Short: "Logout the user. Use 'current' as the session ID to logout on this device, use a session ID to logout on another device. If you're looking to logout the user on all devices, use Delete Sessions (https://appwrite.io/docs/references/cloud/client-web/account#deleteSessions) instead.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.DeleteSession(sessionId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&sessionId, "session-id", "", "Session ID. Use the string 'current' to delete the current device session.")
	_ = cmd.MarkFlagRequired("session-id")
	return cmd
}

func newAccountUpdateStatusCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "update-status",
		Short: "Block the currently logged in user account. Behind the scene, the user record is not deleted but permanently blocked from any access. To completely delete a user, use the Users API instead.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.UpdateStatus()
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newAccountCreateEmailTokenCommand() *cobra.Command {
	var userId string
	var email string
	var phrase bool

	cmd := &cobra.Command{
		Use:   "create-email-token",
		Short: "Sends the user an email with a secret key for creating a session. If the email address has never been used, a new account is created using the provided `userId`. Otherwise, if the email address is already attached to an account, the user ID is ignored. Then, the user will receive an email with the one-time password. Use the returned user ID and secret and submit a request to the POST /v1/account/sessions/token (https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint to complete the login process. The secret sent to the user's email is valid for 15 minutes.\n\nA user is limited to 10 active sessions at a time by default. Learn more about session limits (https://appwrite.io/docs/authentication-security#limits).\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []account.CreateEmailTokenOption{}
			if cmd.Flags().Changed("phrase") {
				options = append(options, service.WithCreateEmailTokenPhrase(phrase))
			}

			result, err := service.CreateEmailToken(userId, email, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars. If the email address has never been used, a new account is created using the provided userId. Otherwise, if the email address is already attached to an account, the user ID is ignored.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&email, "email", "", "User email.")
	_ = cmd.MarkFlagRequired("email")
	cmd.Flags().BoolVar(&phrase, "phrase", false, "Toggle for security phrase. If enabled, email will be send with a randomly generated phrase and the phrase will also be included in the response. Confirming phrases match increases the security of your authentication flow.")
	cmd.Flags().Lookup("phrase").NoOptDefVal = "true"
	return cmd
}

func newAccountCreateMagicURLTokenCommand() *cobra.Command {
	var userId string
	var email string
	var url string
	var phrase bool

	cmd := &cobra.Command{
		Use:   "create-magic-url-token",
		Short: "Sends the user an email with a secret key for creating a session. If the provided user ID has not been registered, a new user will be created. When the user clicks the link in the email, the user is redirected back to the URL you provided with the secret key and userId values attached to the URL query string. Use the query string parameters to submit a request to the POST /v1/account/sessions/token (https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint to complete the login process. The link sent to the user's email address is valid for 1 hour.\n\nA user is limited to 10 active sessions at a time by default. Learn more about session limits (https://appwrite.io/docs/authentication-security#limits).\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []account.CreateMagicURLTokenOption{}
			if cmd.Flags().Changed("url") {
				options = append(options, service.WithCreateMagicURLTokenUrl(url))
			}
			if cmd.Flags().Changed("phrase") {
				options = append(options, service.WithCreateMagicURLTokenPhrase(phrase))
			}

			result, err := service.CreateMagicURLToken(userId, email, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "Unique Id. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars. If the email address has never been used, a new account is created using the provided userId. Otherwise, if the email address is already attached to an account, the user ID is ignored.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&email, "email", "", "User email.")
	_ = cmd.MarkFlagRequired("email")
	cmd.Flags().StringVar(&url, "url", "", "URL to redirect the user back to your app from the magic URL login. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an open redirect (https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.")
	cmd.Flags().BoolVar(&phrase, "phrase", false, "Toggle for security phrase. If enabled, email will be send with a randomly generated phrase and the phrase will also be included in the response. Confirming phrases match increases the security of your authentication flow.")
	cmd.Flags().Lookup("phrase").NoOptDefVal = "true"
	return cmd
}

func newAccountCreateOAuth2TokenCommand() *cobra.Command {
	var provider string
	var success string
	var failure string
	var scopes []string

	cmd := &cobra.Command{
		Use:   "create-o-auth-2-token",
		Short: "Allow the user to login to their account using the OAuth2 provider of their choice. Each OAuth2 provider should be enabled from the Appwrite console first. Use the success and failure arguments to provide a redirect URL's back to your app when login is completed. \n\nIf authentication succeeds, `userId` and `secret` of a token will be appended to the success URL as query parameters. These can be used to create a new session using the Create session (https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint.\n\nA user is limited to 10 active sessions at a time by default. Learn more about session limits (https://appwrite.io/docs/authentication-security#limits).",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []account.CreateOAuth2TokenOption{}
			if cmd.Flags().Changed("success") {
				options = append(options, service.WithCreateOAuth2TokenSuccess(success))
			}
			if cmd.Flags().Changed("failure") {
				options = append(options, service.WithCreateOAuth2TokenFailure(failure))
			}
			if cmd.Flags().Changed("scopes") {
				options = append(options, service.WithCreateOAuth2TokenScopes(scopes))
			}

			result, err := service.CreateOAuth2Token(provider, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&provider, "provider", "", "OAuth2 Provider. Currently, supported providers are: amazon, apple, appwrite, auth0, authentik, autodesk, bitbucket, bitly, box, dailymotion, discord, disqus, dropbox, etsy, facebook, figma, fusionauth, github, gitlab, google, keycloak, kick, linkedin, microsoft, notion, oidc, okta, paypal, paypalSandbox, podio, salesforce, slack, spotify, stripe, tradeshift, tradeshiftBox, twitch, wordpress, x, yahoo, yammer, yandex, zoho, zoom.")
	_ = cmd.MarkFlagRequired("provider")
	cmd.Flags().StringVar(&success, "success", "", "URL to redirect back to your app after a successful login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an open redirect (https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.")
	cmd.Flags().StringVar(&failure, "failure", "", "URL to redirect back to your app after a failed login attempt.  Only URLs from hostnames in your project's platform list are allowed. This requirement helps to prevent an open redirect (https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.")
	cmd.Flags().StringArrayVar(&scopes, "scopes", nil, "A list of custom OAuth2 scopes. Check each provider internal docs for a list of supported scopes. Maximum of 100 scopes are allowed, each 4096 characters long.")
	return cmd
}

func newAccountCreatePhoneTokenCommand() *cobra.Command {
	var userId string
	var phone string

	cmd := &cobra.Command{
		Use:   "create-phone-token",
		Short: "Sends the user an SMS with a secret key for creating a session. If the provided user ID has not be registered, a new user will be created. Use the returned user ID and secret and submit a request to the POST /v1/account/sessions/token (https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint to complete the login process. The secret sent to the user's phone is valid for 15 minutes.\n\nA user is limited to 10 active sessions at a time by default. Learn more about session limits (https://appwrite.io/docs/authentication-security#limits).",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.CreatePhoneToken(userId, phone)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "Unique Id. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars. If the phone number has never been used, a new account is created using the provided userId. Otherwise, if the phone number is already attached to an account, the user ID is ignored.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&phone, "phone", "", "Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.")
	_ = cmd.MarkFlagRequired("phone")
	return cmd
}

func newAccountCreateEmailVerificationCommand() *cobra.Command {
	var url string

	cmd := &cobra.Command{
		Use:   "create-email-verification",
		Short: "Use this endpoint to send a verification message to your user email address to confirm they are the valid owners of that address. Both the userId and secret arguments will be passed as query parameters to the URL you have provided to be attached to the verification email. The provided URL should redirect the user back to your app and allow you to complete the verification process by verifying both the userId and secret parameters. Learn more about how to complete the verification process (https://appwrite.io/docs/references/cloud/client-web/account#updateVerification). The verification link sent to the user's email address is valid for 7 days.\n\nPlease note that in order to avoid a Redirect Attack (https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md), the only valid redirect URLs are the ones from domains you have set when adding your platforms in the console interface.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.CreateEmailVerification(url)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&url, "url", "", "URL to redirect the user back to your app from the verification email. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an open redirect (https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.")
	_ = cmd.MarkFlagRequired("url")
	return cmd
}

func newAccountCreateVerificationCommand() *cobra.Command {
	var url string

	cmd := &cobra.Command{
		Use:   "create-verification",
		Short: "Use this endpoint to send a verification message to your user email address to confirm they are the valid owners of that address. Both the userId and secret arguments will be passed as query parameters to the URL you have provided to be attached to the verification email. The provided URL should redirect the user back to your app and allow you to complete the verification process by verifying both the userId and secret parameters. Learn more about how to complete the verification process (https://appwrite.io/docs/references/cloud/client-web/account#updateVerification). The verification link sent to the user's email address is valid for 7 days.\n\nPlease note that in order to avoid a Redirect Attack (https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md), the only valid redirect URLs are the ones from domains you have set when adding your platforms in the console interface.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.CreateVerification(url)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&url, "url", "", "URL to redirect the user back to your app from the verification email. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an open redirect (https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.")
	_ = cmd.MarkFlagRequired("url")
	return cmd
}

func newAccountUpdateEmailVerificationCommand() *cobra.Command {
	var userId string
	var secret string

	cmd := &cobra.Command{
		Use:   "update-email-verification",
		Short: "Use this endpoint to complete the user email verification process. Use both the userId and secret parameters that were attached to your app URL to verify the user email ownership. If confirmed this route will return a 200 status code.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.UpdateEmailVerification(userId, secret)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&secret, "secret", "", "Valid verification token.")
	_ = cmd.MarkFlagRequired("secret")
	return cmd
}

func newAccountUpdateVerificationCommand() *cobra.Command {
	var userId string
	var secret string

	cmd := &cobra.Command{
		Use:   "update-verification",
		Short: "Use this endpoint to complete the user email verification process. Use both the userId and secret parameters that were attached to your app URL to verify the user email ownership. If confirmed this route will return a 200 status code.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.UpdateVerification(userId, secret)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&secret, "secret", "", "Valid verification token.")
	_ = cmd.MarkFlagRequired("secret")
	return cmd
}

func newAccountCreatePhoneVerificationCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "create-phone-verification",
		Short: "Use this endpoint to send a verification SMS to the currently logged in user. This endpoint is meant for use after updating a user's phone number using the accountUpdatePhone (https://appwrite.io/docs/references/cloud/client-web/account#updatePhone) endpoint. Learn more about how to complete the verification process (https://appwrite.io/docs/references/cloud/client-web/account#updatePhoneVerification). The verification code sent to the user's phone number is valid for 15 minutes.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.CreatePhoneVerification()
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newAccountUpdatePhoneVerificationCommand() *cobra.Command {
	var userId string
	var secret string

	cmd := &cobra.Command{
		Use:   "update-phone-verification",
		Short: "Use this endpoint to complete the user phone verification process. Use the userId and secret that were sent to your user's phone number to verify the user email ownership. If confirmed this route will return a 200 status code.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := account.New(client)

			result, err := service.UpdatePhoneVerification(userId, secret)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&secret, "secret", "", "Valid verification token.")
	_ = cmd.MarkFlagRequired("secret")
	return cmd
}
