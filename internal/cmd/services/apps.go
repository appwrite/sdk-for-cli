package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/apps"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewAppsCommand builds the `apps` command tree.
func NewAppsCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "apps",
		Short: "The Apps service allows you to manage OAuth2 applications, their keys, secrets, scopes, and installations.",
	}

	cmd.AddCommand(newAppsListCommand())
	cmd.AddCommand(newAppsCreateCommand())
	cmd.AddCommand(newAppsListInstallationScopesCommand())
	cmd.AddCommand(newAppsListOAuth2ScopesCommand())
	cmd.AddCommand(newAppsGetCommand())
	cmd.AddCommand(newAppsUpdateCommand())
	cmd.AddCommand(newAppsDeleteCommand())
	cmd.AddCommand(newAppsListInstallationsCommand())
	cmd.AddCommand(newAppsGetInstallationCommand())
	cmd.AddCommand(newAppsDeleteInstallationCommand())
	cmd.AddCommand(newAppsCreateInstallationTokenCommand())
	cmd.AddCommand(newAppsListKeysCommand())
	cmd.AddCommand(newAppsCreateKeyCommand())
	cmd.AddCommand(newAppsGetKeyCommand())
	cmd.AddCommand(newAppsDeleteKeyCommand())
	cmd.AddCommand(newAppsUpdateLabelsCommand())
	cmd.AddCommand(newAppsListSecretsCommand())
	cmd.AddCommand(newAppsCreateSecretCommand())
	cmd.AddCommand(newAppsGetSecretCommand())
	cmd.AddCommand(newAppsDeleteSecretCommand())
	cmd.AddCommand(newAppsUpdateTeamCommand())
	cmd.AddCommand(newAppsDeleteTokensCommand())

	return cmd
}

func newAppsListCommand() *cobra.Command {
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
		Short: "List applications.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

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
			options := []apps.ListOption{}
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

func newAppsCreateCommand() *cobra.Command {
	var appId string
	var name string
	var redirectUris []string
	var description string
	var clientUri string
	var logoUri string
	var privacyPolicyUrl string
	var termsUrl string
	var contacts []string
	var tagline string
	var tags []string
	var images []string
	var supportUrl string
	var dataDeletionUrl string
	var postLogoutRedirectUris []string
	var enabled bool
	var typeArg string
	var deviceFlow bool
	var teamId string

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create a new application.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []apps.CreateOption{}
			if cmd.Flags().Changed("description") {
				options = append(options, service.WithCreateDescription(description))
			}
			if cmd.Flags().Changed("client-uri") {
				options = append(options, service.WithCreateClientUri(clientUri))
			}
			if cmd.Flags().Changed("logo-uri") {
				options = append(options, service.WithCreateLogoUri(logoUri))
			}
			if cmd.Flags().Changed("privacy-policy-url") {
				options = append(options, service.WithCreatePrivacyPolicyUrl(privacyPolicyUrl))
			}
			if cmd.Flags().Changed("terms-url") {
				options = append(options, service.WithCreateTermsUrl(termsUrl))
			}
			if cmd.Flags().Changed("contacts") {
				options = append(options, service.WithCreateContacts(contacts))
			}
			if cmd.Flags().Changed("tagline") {
				options = append(options, service.WithCreateTagline(tagline))
			}
			if cmd.Flags().Changed("tags") {
				options = append(options, service.WithCreateTags(tags))
			}
			if cmd.Flags().Changed("images") {
				options = append(options, service.WithCreateImages(images))
			}
			if cmd.Flags().Changed("support-url") {
				options = append(options, service.WithCreateSupportUrl(supportUrl))
			}
			if cmd.Flags().Changed("data-deletion-url") {
				options = append(options, service.WithCreateDataDeletionUrl(dataDeletionUrl))
			}
			if cmd.Flags().Changed("post-logout-redirect-uris") {
				options = append(options, service.WithCreatePostLogoutRedirectUris(postLogoutRedirectUris))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateEnabled(enabled))
			}
			if cmd.Flags().Changed("type") {
				options = append(options, service.WithCreateType(typeArg))
			}
			if cmd.Flags().Changed("device-flow") {
				options = append(options, service.WithCreateDeviceFlow(deviceFlow))
			}
			if cmd.Flags().Changed("team-id") {
				options = append(options, service.WithCreateTeamId(teamId))
			}

			result, err := service.Create(appId, name, redirectUris, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("app-id")
	cmd.Flags().StringVar(&name, "name", "", "Application name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringArrayVar(&redirectUris, "redirect-uris", nil, "Redirect URIs. Each must be an https URL, an http loopback URL (localhost, 127.0.0.1, [::1]), or a private-use scheme URI (e.g. com.example.app:/oauth), and must not contain a fragment.")
	_ = cmd.MarkFlagRequired("redirect-uris")
	cmd.Flags().StringVar(&description, "description", "", "Application description shown to users during OAuth2 consent.")
	cmd.Flags().StringVar(&clientUri, "client-uri", "", "Application homepage URL shown to users during OAuth2 consent.")
	cmd.Flags().StringVar(&logoUri, "logo-uri", "", "Application logo URL shown to users during OAuth2 consent.")
	cmd.Flags().StringVar(&privacyPolicyUrl, "privacy-policy-url", "", "Application privacy policy URL shown to users during OAuth2 consent.")
	cmd.Flags().StringVar(&termsUrl, "terms-url", "", "Application terms of service URL shown to users during OAuth2 consent.")
	cmd.Flags().StringArrayVar(&contacts, "contacts", nil, "Application support or security contact emails. Maximum of 100 contacts are allowed.")
	cmd.Flags().StringVar(&tagline, "tagline", "", "Application tagline shown to users during OAuth2 consent.")
	cmd.Flags().StringArrayVar(&tags, "tags", nil, "Application tags shown to users during OAuth2 consent. Maximum of 100 tags are allowed, each up to 64 characters long.")
	cmd.Flags().StringArrayVar(&images, "images", nil, "Application image URLs shown to users during OAuth2 consent. Maximum of 100 images are allowed.")
	cmd.Flags().StringVar(&supportUrl, "support-url", "", "Application support URL shown to users during OAuth2 consent.")
	cmd.Flags().StringVar(&dataDeletionUrl, "data-deletion-url", "", "Application data deletion URL shown to users during OAuth2 consent.")
	cmd.Flags().StringArrayVar(&postLogoutRedirectUris, "post-logout-redirect-uris", nil, "Post-logout redirect URIs for OpenID Connect RP-Initiated Logout. Each must be an https URL, an http loopback URL, or a private-use scheme URI, and must not contain a fragment. After ending the user session, the logout endpoint only redirects to URIs in this list.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is application enabled?")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&typeArg, "type", "", "OAuth2 client type. Use `public` for SPAs, mobile, and native apps that cannot keep a `client_secret` — PKCE is then required at the token endpoint. Use `confidential` for server-side clients that present a `client_secret`. Defaults to `confidential`.")
	cmd.Flags().BoolVar(&deviceFlow, "device-flow", false, "Allow this client to use the OAuth2 Device Authorization Grant (RFC 8628) for input-constrained devices such as TVs and CLIs. Defaults to false.")
	cmd.Flags().Lookup("device-flow").NoOptDefVal = "true"
	cmd.Flags().StringVar(&teamId, "team-id", "", "Team unique ID.")
	return cmd
}

func newAppsListInstallationScopesCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-installation-scopes",
		Short: "List scopes an application can request when installed on a team.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			result, err := service.ListInstallationScopes()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newAppsListOAuth2ScopesCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-o-auth-2-scopes",
		Short: "List scopes an application can request during the OAuth2 flow.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			result, err := service.ListOAuth2Scopes()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newAppsGetCommand() *cobra.Command {
	var appId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get an application by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			result, err := service.Get(appId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID or HTTPS client ID metadata document URL.")
	_ = cmd.MarkFlagRequired("app-id")
	return cmd
}

func newAppsUpdateCommand() *cobra.Command {
	var appId string
	var name string
	var description string
	var clientUri string
	var logoUri string
	var privacyPolicyUrl string
	var termsUrl string
	var contacts []string
	var tagline string
	var tags []string
	var images []string
	var supportUrl string
	var dataDeletionUrl string
	var enabled bool
	var redirectUris []string
	var postLogoutRedirectUris []string
	var typeArg string
	var deviceFlow bool
	var installationScopes []string
	var installationRedirectUrl string

	cmd := &cobra.Command{
		Use:   "update",
		Short: "Update an application by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []apps.UpdateOption{}
			if cmd.Flags().Changed("description") {
				options = append(options, service.WithUpdateDescription(description))
			}
			if cmd.Flags().Changed("client-uri") {
				options = append(options, service.WithUpdateClientUri(clientUri))
			}
			if cmd.Flags().Changed("logo-uri") {
				options = append(options, service.WithUpdateLogoUri(logoUri))
			}
			if cmd.Flags().Changed("privacy-policy-url") {
				options = append(options, service.WithUpdatePrivacyPolicyUrl(privacyPolicyUrl))
			}
			if cmd.Flags().Changed("terms-url") {
				options = append(options, service.WithUpdateTermsUrl(termsUrl))
			}
			if cmd.Flags().Changed("contacts") {
				options = append(options, service.WithUpdateContacts(contacts))
			}
			if cmd.Flags().Changed("tagline") {
				options = append(options, service.WithUpdateTagline(tagline))
			}
			if cmd.Flags().Changed("tags") {
				options = append(options, service.WithUpdateTags(tags))
			}
			if cmd.Flags().Changed("images") {
				options = append(options, service.WithUpdateImages(images))
			}
			if cmd.Flags().Changed("support-url") {
				options = append(options, service.WithUpdateSupportUrl(supportUrl))
			}
			if cmd.Flags().Changed("data-deletion-url") {
				options = append(options, service.WithUpdateDataDeletionUrl(dataDeletionUrl))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateEnabled(enabled))
			}
			if cmd.Flags().Changed("redirect-uris") {
				options = append(options, service.WithUpdateRedirectUris(redirectUris))
			}
			if cmd.Flags().Changed("post-logout-redirect-uris") {
				options = append(options, service.WithUpdatePostLogoutRedirectUris(postLogoutRedirectUris))
			}
			if cmd.Flags().Changed("type") {
				options = append(options, service.WithUpdateType(typeArg))
			}
			if cmd.Flags().Changed("device-flow") {
				options = append(options, service.WithUpdateDeviceFlow(deviceFlow))
			}
			if cmd.Flags().Changed("installation-scopes") {
				options = append(options, service.WithUpdateInstallationScopes(installationScopes))
			}
			if cmd.Flags().Changed("installation-redirect-url") {
				options = append(options, service.WithUpdateInstallationRedirectUrl(installationRedirectUrl))
			}

			result, err := service.Update(appId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
	cmd.Flags().StringVar(&name, "name", "", "Application name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&description, "description", "", "Application description shown to users during OAuth2 consent.")
	cmd.Flags().StringVar(&clientUri, "client-uri", "", "Application homepage URL shown to users during OAuth2 consent.")
	cmd.Flags().StringVar(&logoUri, "logo-uri", "", "Application logo URL shown to users during OAuth2 consent.")
	cmd.Flags().StringVar(&privacyPolicyUrl, "privacy-policy-url", "", "Application privacy policy URL shown to users during OAuth2 consent.")
	cmd.Flags().StringVar(&termsUrl, "terms-url", "", "Application terms of service URL shown to users during OAuth2 consent.")
	cmd.Flags().StringArrayVar(&contacts, "contacts", nil, "Application support or security contact emails. Maximum of 100 contacts are allowed.")
	cmd.Flags().StringVar(&tagline, "tagline", "", "Application tagline shown to users during OAuth2 consent.")
	cmd.Flags().StringArrayVar(&tags, "tags", nil, "Application tags shown to users during OAuth2 consent. Maximum of 100 tags are allowed, each up to 64 characters long.")
	cmd.Flags().StringArrayVar(&images, "images", nil, "Application image URLs shown to users during OAuth2 consent. Maximum of 100 images are allowed.")
	cmd.Flags().StringVar(&supportUrl, "support-url", "", "Application support URL shown to users during OAuth2 consent.")
	cmd.Flags().StringVar(&dataDeletionUrl, "data-deletion-url", "", "Application data deletion URL shown to users during OAuth2 consent.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is application enabled?")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&redirectUris, "redirect-uris", nil, "Redirect URIs. Each must be an https URL, an http loopback URL (localhost, 127.0.0.1, [::1]), or a private-use scheme URI (e.g. com.example.app:/oauth), and must not contain a fragment.")
	cmd.Flags().StringArrayVar(&postLogoutRedirectUris, "post-logout-redirect-uris", nil, "Post-logout redirect URIs for OpenID Connect RP-Initiated Logout. Each must be an https URL, an http loopback URL, or a private-use scheme URI, and must not contain a fragment. After ending the user session, the logout endpoint only redirects to URIs in this list.")
	cmd.Flags().StringVar(&typeArg, "type", "", "OAuth2 client type. Use `public` for SPAs, mobile, and native apps that cannot keep a `client_secret` — PKCE is then required at the token endpoint. Use `confidential` for server-side clients that present a `client_secret`. Defaults to `confidential`.")
	cmd.Flags().BoolVar(&deviceFlow, "device-flow", false, "Allow this client to use the OAuth2 Device Authorization Grant (RFC 8628) for input-constrained devices such as TVs and CLIs. Defaults to false.")
	cmd.Flags().Lookup("device-flow").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&installationScopes, "installation-scopes", nil, "Scopes the application requests when installed on a team. Organization-level and project-level scopes only; use the list scopes endpoint with `type=installation` to discover available values. Maximum of 100 scopes are allowed.")
	cmd.Flags().StringVar(&installationRedirectUrl, "installation-redirect-url", "", "URL users are redirected to after creating or updating an installation of this application. Must be an https URL, an http loopback URL (localhost, 127.0.0.1, [::1]), or a private-use scheme URI, and must not contain a fragment. Leave empty for no redirect.")
	return cmd
}

func newAppsDeleteCommand() *cobra.Command {
	var appId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete an application by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			result, err := service.Delete(appId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
	return cmd
}

func newAppsListInstallationsCommand() *cobra.Command {
	var appId string
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
		Use:   "list-installations",
		Short: "List installations of an application. Requires an app key sent in the `X-Appwrite-Key` header alongside the `X-Appwrite-App` header, or a caller with update access to the app.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

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
			options := []apps.ListInstallationsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListInstallationsQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListInstallationsTotal(total))
			}

			result, err := service.ListInstallations(appId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
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

func newAppsGetInstallationCommand() *cobra.Command {
	var appId string
	var installationId string

	cmd := &cobra.Command{
		Use:   "get-installation",
		Short: "Get an installation of an application by its unique ID. Requires an app key sent in the `X-Appwrite-Key` header alongside the `X-Appwrite-App` header, or a caller with update access to the app.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			result, err := service.GetInstallation(appId, installationId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
	cmd.Flags().StringVar(&installationId, "installation-id", "", "Installation unique ID.")
	_ = cmd.MarkFlagRequired("installation-id")
	return cmd
}

func newAppsDeleteInstallationCommand() *cobra.Command {
	var appId string
	var installationId string

	cmd := &cobra.Command{
		Use:   "delete-installation",
		Short: "Delete an installation of an application by its unique ID. Requires a caller with update access to the app. Previously issued installation access tokens are revoked.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			result, err := service.DeleteInstallation(appId, installationId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
	cmd.Flags().StringVar(&installationId, "installation-id", "", "Installation unique ID.")
	_ = cmd.MarkFlagRequired("installation-id")
	return cmd
}

func newAppsCreateInstallationTokenCommand() *cobra.Command {
	var appId string
	var installationId string

	cmd := &cobra.Command{
		Use:   "create-installation-token",
		Short: "Create a token for an installation of an application. Requires an app key sent in the `X-Appwrite-Key` header alongside the `X-Appwrite-App` header, or a caller with update access to the app. The returned token carries the scopes and authorization details granted to the installation, and can be used as an `Authorization: Bearer` header everywhere OAuth2 access tokens are accepted. Multiple tokens can be active for the same installation at once; each token stays valid until it expires or the installation is updated or deleted.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			result, err := service.CreateInstallationToken(appId, installationId)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
	cmd.Flags().StringVar(&installationId, "installation-id", "", "Installation unique ID.")
	_ = cmd.MarkFlagRequired("installation-id")
	return cmd
}

func newAppsListKeysCommand() *cobra.Command {
	var appId string
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
		Use:   "list-keys",
		Short: "List app keys for an application.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

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
			options := []apps.ListKeysOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListKeysQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListKeysTotal(total))
			}

			result, err := service.ListKeys(appId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
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

func newAppsCreateKeyCommand() *cobra.Command {
	var appId string

	cmd := &cobra.Command{
		Use:   "create-key",
		Short: "Create a new app key for an application. App keys carry no scopes; send one in the `X-Appwrite-Key` header alongside the `X-Appwrite-App` header to list the application's installations and create installation access tokens.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			result, err := service.CreateKey(appId)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
	return cmd
}

func newAppsGetKeyCommand() *cobra.Command {
	var appId string
	var keyId string

	cmd := &cobra.Command{
		Use:   "get-key",
		Short: "Get an app key by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			result, err := service.GetKey(appId, keyId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
	cmd.Flags().StringVar(&keyId, "key-id", "", "App key unique ID.")
	_ = cmd.MarkFlagRequired("key-id")
	return cmd
}

func newAppsDeleteKeyCommand() *cobra.Command {
	var appId string
	var keyId string

	cmd := &cobra.Command{
		Use:   "delete-key",
		Short: "Delete an app key by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			result, err := service.DeleteKey(appId, keyId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
	cmd.Flags().StringVar(&keyId, "key-id", "", "App key unique ID.")
	_ = cmd.MarkFlagRequired("key-id")
	return cmd
}

func newAppsUpdateLabelsCommand() *cobra.Command {
	var appId string
	var labels []string

	cmd := &cobra.Command{
		Use:   "update-labels",
		Short: "Update the labels of an application. Labels are read-only for clients; only a server SDK using a project API key can set them. Replaces the previous labels.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			result, err := service.UpdateLabels(appId, labels)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
	cmd.Flags().StringArrayVar(&labels, "labels", nil, "Array of application labels. Replaces the previous labels. Maximum of 1000 labels are allowed, each up to 36 alphanumeric characters long.")
	_ = cmd.MarkFlagRequired("labels")
	return cmd
}

func newAppsListSecretsCommand() *cobra.Command {
	var appId string
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
		Use:   "list-secrets",
		Short: "List client secrets for an application.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

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
			options := []apps.ListSecretsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListSecretsQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListSecretsTotal(total))
			}

			result, err := service.ListSecrets(appId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
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

func newAppsCreateSecretCommand() *cobra.Command {
	var appId string

	cmd := &cobra.Command{
		Use:   "create-secret",
		Short: "Create a new client secret for an application.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			result, err := service.CreateSecret(appId)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
	return cmd
}

func newAppsGetSecretCommand() *cobra.Command {
	var appId string
	var secretId string

	cmd := &cobra.Command{
		Use:   "get-secret",
		Short: "Get an application client secret by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			result, err := service.GetSecret(appId, secretId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
	cmd.Flags().StringVar(&secretId, "secret-id", "", "Secret unique ID.")
	_ = cmd.MarkFlagRequired("secret-id")
	return cmd
}

func newAppsDeleteSecretCommand() *cobra.Command {
	var appId string
	var secretId string

	cmd := &cobra.Command{
		Use:   "delete-secret",
		Short: "Delete an application client secret by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			result, err := service.DeleteSecret(appId, secretId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
	cmd.Flags().StringVar(&secretId, "secret-id", "", "Secret unique ID.")
	_ = cmd.MarkFlagRequired("secret-id")
	return cmd
}

func newAppsUpdateTeamCommand() *cobra.Command {
	var appId string
	var teamId string

	cmd := &cobra.Command{
		Use:   "update-team",
		Short: "Transfer an application to another team by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			result, err := service.UpdateTeam(appId, teamId)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID of the team to transfer application to.")
	_ = cmd.MarkFlagRequired("team-id")
	return cmd
}

func newAppsDeleteTokensCommand() *cobra.Command {
	var appId string

	cmd := &cobra.Command{
		Use:   "delete-tokens",
		Short: "Revoke all tokens for an application by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := apps.New(client)

			result, err := service.DeleteTokens(appId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
	return cmd
}
