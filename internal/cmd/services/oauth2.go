package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/oauth2"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewOauth2Command builds the `oauth2` command tree.
func NewOauth2Command() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "oauth2",
		Short: "The OAuth2 service allows you to authorize apps and issue standards-based OAuth2 and OpenID Connect tokens.",
	}

	cmd.AddCommand(newOauth2AuthorizeCommand())
	cmd.AddCommand(newOauth2AuthorizePostCommand())
	cmd.AddCommand(newOauth2CreateDeviceAuthorizationCommand())
	cmd.AddCommand(newOauth2CreateGrantCommand())
	cmd.AddCommand(newOauth2GetGrantCommand())
	cmd.AddCommand(newOauth2ListOrganizationsCommand())
	cmd.AddCommand(newOauth2CreatePARCommand())
	cmd.AddCommand(newOauth2ListProjectsCommand())
	cmd.AddCommand(newOauth2RejectCommand())
	cmd.AddCommand(newOauth2RevokeCommand())
	cmd.AddCommand(newOauth2CreateTokenCommand())

	return cmd
}

// NewOauth2RootCommands returns the methods promoted to
// top-level commands. The service subcommand stays registered but hidden, so
// both spellings keep working.
func NewOauth2RootCommands() []*cobra.Command {
	commands := []*cobra.Command{
		newOauth2ListOrganizationsCommand(),
		newOauth2ListProjectsCommand(),
	}

	// The same constructor builds both spellings, and it marks the command
	// hidden so it does not appear twice under its service. The promoted copy is
	// the one --help is meant to advertise, so it is made visible here.
	for _, command := range commands {
		command.Hidden = false
	}

	return commands
}

func newOauth2AuthorizeCommand() *cobra.Command {
	var clientId string
	var redirectUri string
	var responseType string
	var scope string
	var state string
	var nonce string
	var codeChallenge string
	var codeChallengeMethod string
	var prompt string
	var maxAge int
	var authorizationDetails string
	var resource string
	var audience string
	var requestUri string

	cmd := &cobra.Command{
		Use:   "authorize",
		Short: "Begin the OAuth2 authorization flow. When called without a session, the user is redirected to the consent screen without grant ID. When called with a session, the redirect URL includes param for grant ID. You can pass Accept header of `application/json` to receive a JSON response instead of a redirect.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := oauth2.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []oauth2.AuthorizeOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithAuthorizeClientId(clientId))
			}
			if cmd.Flags().Changed("redirect-uri") {
				options = append(options, service.WithAuthorizeRedirectUri(redirectUri))
			}
			if cmd.Flags().Changed("response-type") {
				options = append(options, service.WithAuthorizeResponseType(responseType))
			}
			if cmd.Flags().Changed("scope") {
				options = append(options, service.WithAuthorizeScope(scope))
			}
			if cmd.Flags().Changed("state") {
				options = append(options, service.WithAuthorizeState(state))
			}
			if cmd.Flags().Changed("nonce") {
				options = append(options, service.WithAuthorizeNonce(nonce))
			}
			if cmd.Flags().Changed("code-challenge") {
				options = append(options, service.WithAuthorizeCodeChallenge(codeChallenge))
			}
			if cmd.Flags().Changed("code-challenge-method") {
				options = append(options, service.WithAuthorizeCodeChallengeMethod(codeChallengeMethod))
			}
			if cmd.Flags().Changed("prompt") {
				options = append(options, service.WithAuthorizePrompt(prompt))
			}
			if cmd.Flags().Changed("max-age") {
				options = append(options, service.WithAuthorizeMaxAge(maxAge))
			}
			if cmd.Flags().Changed("authorization-details") {
				options = append(options, service.WithAuthorizeAuthorizationDetails(authorizationDetails))
			}
			if cmd.Flags().Changed("resource") {
				options = append(options, service.WithAuthorizeResource(resource))
			}
			if cmd.Flags().Changed("audience") {
				options = append(options, service.WithAuthorizeAudience(audience))
			}
			if cmd.Flags().Changed("request-uri") {
				options = append(options, service.WithAuthorizeRequestUri(requestUri))
			}

			result, err := service.Authorize(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.")
	cmd.Flags().StringVar(&redirectUri, "redirect-uri", "", "Redirect URI where visitor will be redirected after authorization, whether successful or not.")
	cmd.Flags().StringVar(&responseType, "response-type", "", "OAuth2 / OIDC response type. One of `code` (Authorization Code Flow), `id_token` (Implicit Flow, OIDC login only), or `code id_token` (Hybrid Flow).")
	cmd.Flags().StringVar(&scope, "scope", "", "Space-separated OAuth2 scopes. Can include project scopes, and built-in scopes: `openid`, `email`, `profile`, `phone`.")
	cmd.Flags().StringVar(&state, "state", "", "OAuth2 state. You receive this back in the redirect URI.")
	cmd.Flags().StringVar(&nonce, "nonce", "", "OIDC nonce parameter to prevent replay attacks. Required when response_type includes `id_token`.")
	cmd.Flags().StringVar(&codeChallenge, "code-challenge", "", "PKCE code challenge. Required when OAuth2 app is public.")
	cmd.Flags().StringVar(&codeChallengeMethod, "code-challenge-method", "", "PKCE code challenge method. Required when OAuth2 app is public.")
	cmd.Flags().StringVar(&prompt, "prompt", "", "OIDC prompt parameter for customization of consent screen. Space-separated list of: none, login, consent, select_account.")
	cmd.Flags().IntVar(&maxAge, "max-age", 0, "OIDC max_age paraleter for customization of consent screen. Maximum allowable elapsed time in seconds since the user last authenticated. If exceeded, re-authentication is required.")
	cmd.Flags().StringVar(&authorizationDetails, "authorization-details", "", "Rich authorization request. JSON array of objects, each with a `type` and project-defined fields")
	cmd.Flags().StringVar(&resource, "resource", "", "RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.")
	cmd.Flags().StringVar(&audience, "audience", "", "Compatibility alias for a single OAuth2 resource indicator URI.")
	cmd.Flags().StringVar(&requestUri, "request-uri", "", "OAuth2 authorization request handle returned by the pushed authorization request endpoint.")
	return cmd
}

func newOauth2AuthorizePostCommand() *cobra.Command {
	var clientId string
	var redirectUri string
	var responseType string
	var scope string
	var state string
	var nonce string
	var codeChallenge string
	var codeChallengeMethod string
	var prompt string
	var maxAge int
	var authorizationDetails string
	var resource string
	var audience string
	var requestUri string

	cmd := &cobra.Command{
		Use:   "authorize-post",
		Short: "Begin the OAuth2 authorization flow. When called without a session, the user is redirected to the consent screen without grant ID. When called with a session, the redirect URL includes param for grant ID. You can pass Accept header of `application/json` to receive a JSON response instead of a redirect.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := oauth2.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []oauth2.AuthorizePostOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithAuthorizePostClientId(clientId))
			}
			if cmd.Flags().Changed("redirect-uri") {
				options = append(options, service.WithAuthorizePostRedirectUri(redirectUri))
			}
			if cmd.Flags().Changed("response-type") {
				options = append(options, service.WithAuthorizePostResponseType(responseType))
			}
			if cmd.Flags().Changed("scope") {
				options = append(options, service.WithAuthorizePostScope(scope))
			}
			if cmd.Flags().Changed("state") {
				options = append(options, service.WithAuthorizePostState(state))
			}
			if cmd.Flags().Changed("nonce") {
				options = append(options, service.WithAuthorizePostNonce(nonce))
			}
			if cmd.Flags().Changed("code-challenge") {
				options = append(options, service.WithAuthorizePostCodeChallenge(codeChallenge))
			}
			if cmd.Flags().Changed("code-challenge-method") {
				options = append(options, service.WithAuthorizePostCodeChallengeMethod(codeChallengeMethod))
			}
			if cmd.Flags().Changed("prompt") {
				options = append(options, service.WithAuthorizePostPrompt(prompt))
			}
			if cmd.Flags().Changed("max-age") {
				options = append(options, service.WithAuthorizePostMaxAge(maxAge))
			}
			if cmd.Flags().Changed("authorization-details") {
				options = append(options, service.WithAuthorizePostAuthorizationDetails(authorizationDetails))
			}
			if cmd.Flags().Changed("resource") {
				options = append(options, service.WithAuthorizePostResource(resource))
			}
			if cmd.Flags().Changed("audience") {
				options = append(options, service.WithAuthorizePostAudience(audience))
			}
			if cmd.Flags().Changed("request-uri") {
				options = append(options, service.WithAuthorizePostRequestUri(requestUri))
			}

			result, err := service.AuthorizePost(options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.")
	cmd.Flags().StringVar(&redirectUri, "redirect-uri", "", "Redirect URI where visitor will be redirected after authorization, whether successful or not.")
	cmd.Flags().StringVar(&responseType, "response-type", "", "OAuth2 / OIDC response type. One of `code` (Authorization Code Flow), `id_token` (Implicit Flow, OIDC login only), or `code id_token` (Hybrid Flow).")
	cmd.Flags().StringVar(&scope, "scope", "", "Space-separated OAuth2 scopes. Can include project scopes, and built-in scopes: `openid`, `email`, `profile`, `phone`.")
	cmd.Flags().StringVar(&state, "state", "", "OAuth2 state. You receive this back in the redirect URI.")
	cmd.Flags().StringVar(&nonce, "nonce", "", "OIDC nonce parameter to prevent replay attacks. Required when response_type includes `id_token`.")
	cmd.Flags().StringVar(&codeChallenge, "code-challenge", "", "PKCE code challenge. Required when OAuth2 app is public.")
	cmd.Flags().StringVar(&codeChallengeMethod, "code-challenge-method", "", "PKCE code challenge method. Required when OAuth2 app is public.")
	cmd.Flags().StringVar(&prompt, "prompt", "", "OIDC prompt parameter for customization of consent screen. Space-separated list of: none, login, consent, select_account.")
	cmd.Flags().IntVar(&maxAge, "max-age", 0, "OIDC max_age paraleter for customization of consent screen. Maximum allowable elapsed time in seconds since the user last authenticated. If exceeded, re-authentication is required.")
	cmd.Flags().StringVar(&authorizationDetails, "authorization-details", "", "Rich authorization request. JSON array of objects, each with a `type` and project-defined fields")
	cmd.Flags().StringVar(&resource, "resource", "", "RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.")
	cmd.Flags().StringVar(&audience, "audience", "", "Compatibility alias for a single OAuth2 resource indicator URI.")
	cmd.Flags().StringVar(&requestUri, "request-uri", "", "OAuth2 authorization request handle returned by the pushed authorization request endpoint.")
	return cmd
}

func newOauth2CreateDeviceAuthorizationCommand() *cobra.Command {
	var clientId string
	var scope string
	var authorizationDetails string
	var resource string
	var audience string

	cmd := &cobra.Command{
		Use:   "create-device-authorization",
		Short: "Start the OAuth2 Device Authorization Grant. Returns the device code, user code, verification URL, expiration, and polling interval.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := oauth2.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []oauth2.CreateDeviceAuthorizationOption{}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithCreateDeviceAuthorizationClientId(clientId))
			}
			if cmd.Flags().Changed("scope") {
				options = append(options, service.WithCreateDeviceAuthorizationScope(scope))
			}
			if cmd.Flags().Changed("authorization-details") {
				options = append(options, service.WithCreateDeviceAuthorizationAuthorizationDetails(authorizationDetails))
			}
			if cmd.Flags().Changed("resource") {
				options = append(options, service.WithCreateDeviceAuthorizationResource(resource))
			}
			if cmd.Flags().Changed("audience") {
				options = append(options, service.WithCreateDeviceAuthorizationAudience(audience))
			}

			result, err := service.CreateDeviceAuthorization(options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.")
	cmd.Flags().StringVar(&scope, "scope", "", "Space-separated OAuth2 scopes. Can include project scopes, and built-in scopes: `openid`, `email`, `profile`.")
	cmd.Flags().StringVar(&authorizationDetails, "authorization-details", "", "Rich authorization request. JSON array of objects, each with a `type` and project-defined fields")
	cmd.Flags().StringVar(&resource, "resource", "", "RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.")
	cmd.Flags().StringVar(&audience, "audience", "", "Compatibility alias for a single OAuth2 resource indicator URI.")
	return cmd
}

func newOauth2CreateGrantCommand() *cobra.Command {
	var userCode string

	cmd := &cobra.Command{
		Use:   "create-grant",
		Short: "Exchange a device flow user code for an OAuth2 grant. The authenticated user is bound to the pending grant. Pass the returned grant ID to the get grant endpoint to render the consent screen, then to the approve or reject endpoint to complete the flow.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := oauth2.New(client)

			result, err := service.CreateGrant(userCode)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userCode, "user-code", "", "User code displayed on the device.")
	_ = cmd.MarkFlagRequired("user-code")
	return cmd
}

func newOauth2GetGrantCommand() *cobra.Command {
	var grantId string

	cmd := &cobra.Command{
		Use:   "get-grant",
		Short: "Get an OAuth2 grant by its ID. Used by the consent screen to display the details of the authorization the user is being asked to approve. A grant can only be read by the user it belongs to, or by server SDK.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := oauth2.New(client)

			result, err := service.GetGrant(grantId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&grantId, "grant-id", "", "Grant ID made during authorization, provided to consent screen in URL search params.")
	_ = cmd.MarkFlagRequired("grant-id")
	return cmd
}

func newOauth2ListOrganizationsCommand() *cobra.Command {
	var limit int
	var offset int
	var search string

	cmd := &cobra.Command{
		Use:    "list-organizations",
		Short:  "List the organizations the OAuth2 access token can access. Resolves the token's `organization` authorization details, expanding the `*` wildcard into the concrete set of organizations the user can see.",
		Hidden: true,
		RunE: func(cmd *cobra.Command, args []string) error {

			result, err := app.ListOrganizationsForSession(
				app.FlagInt(cmd, "limit", limit), app.FlagInt(cmd, "offset", offset), search)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().IntVar(&limit, "limit", 0, "Maximum number of organizations to return. Between 1 and 5000.")
	cmd.Flags().IntVar(&offset, "offset", 0, "Number of organizations to skip before returning results. Used for pagination.")
	cmd.Flags().StringVar(&search, "search", "", "Search term to filter your list results. Max length: 256 chars.")
	return cmd
}

func newOauth2CreatePARCommand() *cobra.Command {
	var clientId string
	var redirectUri string
	var responseType string
	var scope string
	var state string
	var nonce string
	var codeChallenge string
	var codeChallengeMethod string
	var prompt string
	var maxAge int
	var authorizationDetails string
	var resource string
	var audience string

	cmd := &cobra.Command{
		Use:   "create-par",
		Short: "Store an OAuth2 authorization request server-side and receive a short-lived request_uri handle for the authorize endpoint.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := oauth2.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []oauth2.CreatePAROption{}
			if cmd.Flags().Changed("scope") {
				options = append(options, service.WithCreatePARScope(scope))
			}
			if cmd.Flags().Changed("state") {
				options = append(options, service.WithCreatePARState(state))
			}
			if cmd.Flags().Changed("nonce") {
				options = append(options, service.WithCreatePARNonce(nonce))
			}
			if cmd.Flags().Changed("code-challenge") {
				options = append(options, service.WithCreatePARCodeChallenge(codeChallenge))
			}
			if cmd.Flags().Changed("code-challenge-method") {
				options = append(options, service.WithCreatePARCodeChallengeMethod(codeChallengeMethod))
			}
			if cmd.Flags().Changed("prompt") {
				options = append(options, service.WithCreatePARPrompt(prompt))
			}
			if cmd.Flags().Changed("max-age") {
				options = append(options, service.WithCreatePARMaxAge(maxAge))
			}
			if cmd.Flags().Changed("authorization-details") {
				options = append(options, service.WithCreatePARAuthorizationDetails(authorizationDetails))
			}
			if cmd.Flags().Changed("resource") {
				options = append(options, service.WithCreatePARResource(resource))
			}
			if cmd.Flags().Changed("audience") {
				options = append(options, service.WithCreatePARAudience(audience))
			}

			result, err := service.CreatePAR(clientId, redirectUri, responseType, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&clientId, "client-id", "", "OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.")
	_ = cmd.MarkFlagRequired("client-id")
	cmd.Flags().StringVar(&redirectUri, "redirect-uri", "", "Redirect URI where visitor will be redirected after authorization, whether successful or not.")
	_ = cmd.MarkFlagRequired("redirect-uri")
	cmd.Flags().StringVar(&responseType, "response-type", "", "OAuth2 / OIDC response type.")
	_ = cmd.MarkFlagRequired("response-type")
	cmd.Flags().StringVar(&scope, "scope", "", "Space-separated OAuth2 scopes. Can include project scopes, and built-in scopes: `openid`, `email`, `profile`, `phone`.")
	cmd.Flags().StringVar(&state, "state", "", "OAuth2 state. You receive this back in the redirect URI.")
	cmd.Flags().StringVar(&nonce, "nonce", "", "OIDC nonce parameter to prevent replay attacks. Required when response_type includes `id_token`.")
	cmd.Flags().StringVar(&codeChallenge, "code-challenge", "", "PKCE code challenge. Required when OAuth2 app is public.")
	cmd.Flags().StringVar(&codeChallengeMethod, "code-challenge-method", "", "PKCE code challenge method. Required when OAuth2 app is public.")
	cmd.Flags().StringVar(&prompt, "prompt", "", "OIDC prompt parameter for customization of consent screen. Space-separated list of: none, login, consent, select_account.")
	cmd.Flags().IntVar(&maxAge, "max-age", 0, "OIDC max_age parameter for customization of consent screen.")
	cmd.Flags().StringVar(&authorizationDetails, "authorization-details", "", "Rich authorization request. JSON array of objects, each with a `type` and project-defined fields")
	cmd.Flags().StringVar(&resource, "resource", "", "RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.")
	cmd.Flags().StringVar(&audience, "audience", "", "Compatibility alias for a single OAuth2 resource indicator URI.")
	return cmd
}

func newOauth2ListProjectsCommand() *cobra.Command {
	var limit int
	var offset int
	var search string

	cmd := &cobra.Command{
		Use:    "list-projects",
		Short:  "List the projects the OAuth2 access token can access. Resolves the token's `project` authorization details, expanding the `*` wildcard into the concrete set of projects the user can see.",
		Hidden: true,
		RunE: func(cmd *cobra.Command, args []string) error {

			result, err := app.ListProjectsForSession("",
				app.FlagInt(cmd, "limit", limit), app.FlagInt(cmd, "offset", offset), search)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().IntVar(&limit, "limit", 0, "Maximum number of projects to return. Between 1 and 5000.")
	cmd.Flags().IntVar(&offset, "offset", 0, "Number of projects to skip before returning results. Used for pagination.")
	cmd.Flags().StringVar(&search, "search", "", "Search term to filter your list results. Max length: 256 chars.")
	return cmd
}

func newOauth2RejectCommand() *cobra.Command {
	var grantId string

	cmd := &cobra.Command{
		Use:   "reject",
		Short: "Reject an OAuth2 grant when the user denies consent. Returns the `redirectUrl` the end user should be sent to with an `access_denied` error. You can pass Accept header of `application/json` to receive a JSON response instead of a redirect.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := oauth2.New(client)

			result, err := service.Reject(grantId)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&grantId, "grant-id", "", "Grant ID made during authorization, provided to consent screen in URL search params.")
	_ = cmd.MarkFlagRequired("grant-id")
	return cmd
}

func newOauth2RevokeCommand() *cobra.Command {
	var token string
	var tokenTypeHint string
	var clientId string
	var clientSecret string

	cmd := &cobra.Command{
		Use:   "revoke",
		Short: "Revoke an OAuth2 access token or refresh token.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := oauth2.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []oauth2.RevokeOption{}
			if cmd.Flags().Changed("token-type-hint") {
				options = append(options, service.WithRevokeTokenTypeHint(tokenTypeHint))
			}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithRevokeClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithRevokeClientSecret(clientSecret))
			}

			result, err := service.Revoke(token, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&token, "token", "", "The access or refresh token to revoke.")
	_ = cmd.MarkFlagRequired("token")
	cmd.Flags().StringVar(&tokenTypeHint, "token-type-hint", "", "Type of token to revoke (access_token or refresh_token).")
	cmd.Flags().StringVar(&clientId, "client-id", "", "OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "OAuth2 client secret. Required for confidential apps; omitted for public apps.")
	return cmd
}

func newOauth2CreateTokenCommand() *cobra.Command {
	var grantType string
	var code string
	var refreshToken string
	var deviceCode string
	var clientId string
	var clientSecret string
	var codeVerifier string
	var redirectUri string
	var resource string
	var audience string

	cmd := &cobra.Command{
		Use:   "create-token",
		Short: "Exchange an OAuth2 authorization code, refresh token, or device code for access and refresh tokens.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := oauth2.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []oauth2.CreateTokenOption{}
			if cmd.Flags().Changed("code") {
				options = append(options, service.WithCreateTokenCode(code))
			}
			if cmd.Flags().Changed("refresh-token") {
				options = append(options, service.WithCreateTokenRefreshToken(refreshToken))
			}
			if cmd.Flags().Changed("device-code") {
				options = append(options, service.WithCreateTokenDeviceCode(deviceCode))
			}
			if cmd.Flags().Changed("client-id") {
				options = append(options, service.WithCreateTokenClientId(clientId))
			}
			if cmd.Flags().Changed("client-secret") {
				options = append(options, service.WithCreateTokenClientSecret(clientSecret))
			}
			if cmd.Flags().Changed("code-verifier") {
				options = append(options, service.WithCreateTokenCodeVerifier(codeVerifier))
			}
			if cmd.Flags().Changed("redirect-uri") {
				options = append(options, service.WithCreateTokenRedirectUri(redirectUri))
			}
			if cmd.Flags().Changed("resource") {
				options = append(options, service.WithCreateTokenResource(resource))
			}
			if cmd.Flags().Changed("audience") {
				options = append(options, service.WithCreateTokenAudience(audience))
			}

			result, err := service.CreateToken(grantType, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&grantType, "grant-type", "", "OAuth2 grant type. Can be one of: `authorization_code`, `refresh_token`, `urn:ietf:params:oauth:grant-type:device_code`.")
	_ = cmd.MarkFlagRequired("grant-type")
	cmd.Flags().StringVar(&code, "code", "", "Authorization code to be exchanged for access and refresh tokens. Required for `authorization_code` grant type.")
	cmd.Flags().StringVar(&refreshToken, "refresh-token", "", "Refresh token to be exchanged for a new access and refresh tokens. Required for `refresh_token` grant type.")
	cmd.Flags().StringVar(&deviceCode, "device-code", "", "Device code obtained from the device authorization endpoint. Required for `urn:ietf:params:oauth:grant-type:device_code` grant type.")
	cmd.Flags().StringVar(&clientId, "client-id", "", "OAuth2 client ID. Either a registered app ID or an HTTPS client ID metadata document URL.")
	cmd.Flags().StringVar(&clientSecret, "client-secret", "", "OAuth2 client secret. Required for confidential apps.")
	cmd.Flags().StringVar(&codeVerifier, "code-verifier", "", "PKCE code verifier. Required for public apps.")
	cmd.Flags().StringVar(&redirectUri, "redirect-uri", "", "Redirect URI. Required for `authorization_code` grant type.")
	cmd.Flags().StringVar(&resource, "resource", "", "RFC 8707 resource indicator URI or URI list. Each value must be an absolute URI without a fragment.")
	cmd.Flags().StringVar(&audience, "audience", "", "Compatibility alias for a single OAuth2 resource indicator URI.")
	return cmd
}
