package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/organization"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewOrganizationCommand builds the `organization` command tree.
func NewOrganizationCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "organization",
		Short: "The Organization service allows you to manage organization-level projects.",
	}

	cmd.AddCommand(newOrganizationGetCommand())
	cmd.AddCommand(newOrganizationUpdateCommand())
	cmd.AddCommand(newOrganizationDeleteCommand())
	cmd.AddCommand(newOrganizationListInstallationsCommand())
	cmd.AddCommand(newOrganizationCreateInstallationCommand())
	cmd.AddCommand(newOrganizationGetInstallationCommand())
	cmd.AddCommand(newOrganizationUpdateInstallationCommand())
	cmd.AddCommand(newOrganizationDeleteInstallationCommand())
	cmd.AddCommand(newOrganizationListKeysCommand())
	cmd.AddCommand(newOrganizationCreateKeyCommand())
	cmd.AddCommand(newOrganizationGetKeyCommand())
	cmd.AddCommand(newOrganizationUpdateKeyCommand())
	cmd.AddCommand(newOrganizationDeleteKeyCommand())
	cmd.AddCommand(newOrganizationListMembershipsCommand())
	cmd.AddCommand(newOrganizationCreateMembershipCommand())
	cmd.AddCommand(newOrganizationGetMembershipCommand())
	cmd.AddCommand(newOrganizationUpdateMembershipCommand())
	cmd.AddCommand(newOrganizationDeleteMembershipCommand())
	cmd.AddCommand(newOrganizationListProjectsCommand())
	cmd.AddCommand(newOrganizationCreateProjectCommand())
	cmd.AddCommand(newOrganizationGetProjectCommand())
	cmd.AddCommand(newOrganizationUpdateProjectCommand())
	cmd.AddCommand(newOrganizationDeleteProjectCommand())

	return cmd
}

func newOrganizationGetCommand() *cobra.Command {
	var organizationId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get the current organization.",
		RunE: func(cmd *cobra.Command, args []string) error {

			result, err := app.GetOrganizationForSession(organizationId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationUpdateCommand() *cobra.Command {
	var name string
	var organizationId string

	cmd := &cobra.Command{
		Use:   "update",
		Short: "Update the current organization's name.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			result, err := service.Update(name)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&name, "name", "", "New organization name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationDeleteCommand() *cobra.Command {
	var organizationId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete the current organization. All projects that belong to the organization are deleted as well.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			result, err := service.Delete()
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationListInstallationsCommand() *cobra.Command {
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
	var organizationId string

	cmd := &cobra.Command{
		Use:   "list-installations",
		Short: "List app installations on the organization. Any organization member can read installations.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

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
			options := []organization.ListInstallationsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListInstallationsQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListInstallationsTotal(total))
			}

			result, err := service.ListInstallations(options...)
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
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationCreateInstallationCommand() *cobra.Command {
	var appId string
	var authorizationDetails string
	var organizationId string

	cmd := &cobra.Command{
		Use:   "create-installation",
		Short: "Install an app on the organization. Only organization members with the owner role can install apps. The installation is granted the scopes the app currently requests.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []organization.CreateInstallationOption{}
			if cmd.Flags().Changed("authorization-details") {
				options = append(options, service.WithCreateInstallationAuthorizationDetails(authorizationDetails))
			}

			result, err := service.CreateInstallation(appId, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
	cmd.Flags().StringVar(&authorizationDetails, "authorization-details", "", "Authorization details granted to the installation as a JSON array of objects, each with a `type` and app-defined fields. The Appwrite Console stores authorized project IDs here.")
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationGetInstallationCommand() *cobra.Command {
	var installationId string
	var organizationId string

	cmd := &cobra.Command{
		Use:   "get-installation",
		Short: "Get an app installation on the organization by its unique ID. Any organization member can read installations.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			result, err := service.GetInstallation(installationId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&installationId, "installation-id", "", "Installation unique ID.")
	_ = cmd.MarkFlagRequired("installation-id")
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationUpdateInstallationCommand() *cobra.Command {
	var installationId string
	var authorizationDetails string
	var organizationId string

	cmd := &cobra.Command{
		Use:   "update-installation",
		Short: "Update an app installation on the organization. Only organization members with the owner role can update installations. The installation's granted scopes are refreshed to the scopes the app currently requests; previously issued installation access tokens are revoked.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []organization.UpdateInstallationOption{}
			if cmd.Flags().Changed("authorization-details") {
				options = append(options, service.WithUpdateInstallationAuthorizationDetails(authorizationDetails))
			}

			result, err := service.UpdateInstallation(installationId, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&installationId, "installation-id", "", "Installation unique ID.")
	_ = cmd.MarkFlagRequired("installation-id")
	cmd.Flags().StringVar(&authorizationDetails, "authorization-details", "", "Authorization details granted to the installation as a JSON array of objects, each with a `type` and app-defined fields. Omit to keep the current value.")
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationDeleteInstallationCommand() *cobra.Command {
	var installationId string
	var organizationId string

	cmd := &cobra.Command{
		Use:   "delete-installation",
		Short: "Uninstall an app from the organization by its installation ID. Only organization members with the owner role can remove installations. Previously issued installation access tokens are revoked.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			result, err := service.DeleteInstallation(installationId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&installationId, "installation-id", "", "Installation unique ID.")
	_ = cmd.MarkFlagRequired("installation-id")
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationListKeysCommand() *cobra.Command {
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
	var organizationId string

	cmd := &cobra.Command{
		Use:   "list-keys",
		Short: "Get a list of all API keys from the current organization.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

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
			options := []organization.ListKeysOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListKeysQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListKeysTotal(total))
			}

			result, err := service.ListKeys(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
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
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationCreateKeyCommand() *cobra.Command {
	var keyId string
	var name string
	var scopes []string
	var expire string
	var organizationId string

	cmd := &cobra.Command{
		Use:   "create-key",
		Short: "Create a new organization API key.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []organization.CreateKeyOption{}
			if cmd.Flags().Changed("expire") {
				options = append(options, service.WithCreateKeyExpire(expire))
			}

			result, err := service.CreateKey(keyId, name, scopes, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
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
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationGetKeyCommand() *cobra.Command {
	var keyId string
	var organizationId string

	cmd := &cobra.Command{
		Use:   "get-key",
		Short: "Get a key by its unique ID. This endpoint returns details about a specific API key in your organization including its scopes.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			result, err := service.GetKey(keyId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&keyId, "key-id", "", "Key unique ID.")
	_ = cmd.MarkFlagRequired("key-id")
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationUpdateKeyCommand() *cobra.Command {
	var keyId string
	var name string
	var scopes []string
	var expire string
	var organizationId string

	cmd := &cobra.Command{
		Use:   "update-key",
		Short: "Update a key by its unique ID. Use this endpoint to update the name, scopes, or expiration time of an API key.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []organization.UpdateKeyOption{}
			if cmd.Flags().Changed("expire") {
				options = append(options, service.WithUpdateKeyExpire(expire))
			}

			result, err := service.UpdateKey(keyId, name, scopes, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&keyId, "key-id", "", "Key unique ID.")
	_ = cmd.MarkFlagRequired("key-id")
	cmd.Flags().StringVar(&name, "name", "", "Key name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringArrayVar(&scopes, "scopes", nil, "Key scopes list. Maximum of 200 scopes are allowed.")
	_ = cmd.MarkFlagRequired("scopes")
	cmd.Flags().StringVar(&expire, "expire", "", "Expiration time in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.")
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationDeleteKeyCommand() *cobra.Command {
	var keyId string
	var organizationId string

	cmd := &cobra.Command{
		Use:   "delete-key",
		Short: "Delete a key by its unique ID. Once deleted, the key can no longer be used to authenticate API calls.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			result, err := service.DeleteKey(keyId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&keyId, "key-id", "", "Key unique ID.")
	_ = cmd.MarkFlagRequired("key-id")
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationListMembershipsCommand() *cobra.Command {
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
	var organizationId string

	cmd := &cobra.Command{
		Use:   "list-memberships",
		Short: "Get a list of all memberships from the current organization.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

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
			options := []organization.ListMembershipsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListMembershipsQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListMembershipsSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListMembershipsTotal(total))
			}

			result, err := service.ListMemberships(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, teamId, invited, joined, confirm, roles")
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
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationCreateMembershipCommand() *cobra.Command {
	var roles []string
	var email string
	var userId string
	var phone string
	var url string
	var name string
	var organizationId string

	cmd := &cobra.Command{
		Use:   "create-membership",
		Short: "Invite a new member to join the current organization. An email with a link to join the organization will be sent to the new member's email address. If member doesn't exist in the project it will be automatically created.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []organization.CreateMembershipOption{}
			if cmd.Flags().Changed("email") {
				options = append(options, service.WithCreateMembershipEmail(email))
			}
			if cmd.Flags().Changed("user-id") {
				options = append(options, service.WithCreateMembershipUserId(userId))
			}
			if cmd.Flags().Changed("phone") {
				options = append(options, service.WithCreateMembershipPhone(phone))
			}
			if cmd.Flags().Changed("url") {
				options = append(options, service.WithCreateMembershipUrl(url))
			}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithCreateMembershipName(name))
			}

			result, err := service.CreateMembership(roles, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&roles, "roles", nil, "Array of strings. Use this param to set the user roles in the organization. A role can be any string. Learn more about roles and permissions (https://appwrite.io/docs/permissions). Maximum of 100 roles are allowed, each 81 characters long.")
	_ = cmd.MarkFlagRequired("roles")
	cmd.Flags().StringVar(&email, "email", "", "Email of the new organization member.")
	cmd.Flags().StringVar(&userId, "user-id", "", "ID of the user to be added to the organization.")
	cmd.Flags().StringVar(&phone, "phone", "", "Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.")
	cmd.Flags().StringVar(&url, "url", "", "URL to redirect the user back to your app from the invitation email. This parameter is not required when an API key is supplied.")
	cmd.Flags().StringVar(&name, "name", "", "Name of the new organization member. Max length: 128 chars.")
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationGetMembershipCommand() *cobra.Command {
	var membershipId string
	var organizationId string

	cmd := &cobra.Command{
		Use:   "get-membership",
		Short: "Get a membership from the current organization by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			result, err := service.GetMembership(membershipId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&membershipId, "membership-id", "", "Membership ID.")
	_ = cmd.MarkFlagRequired("membership-id")
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationUpdateMembershipCommand() *cobra.Command {
	var membershipId string
	var roles []string
	var organizationId string

	cmd := &cobra.Command{
		Use:   "update-membership",
		Short: "Modify the roles of a member in the current organization.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			result, err := service.UpdateMembership(membershipId, roles)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&membershipId, "membership-id", "", "Membership ID.")
	_ = cmd.MarkFlagRequired("membership-id")
	cmd.Flags().StringArrayVar(&roles, "roles", nil, "An array of strings. Use this param to set the user's roles in the organization. A role can be any string. Learn more about roles and permissions (https://appwrite.io/docs/permissions). Maximum of 100 roles are allowed, each 81 characters long.")
	_ = cmd.MarkFlagRequired("roles")
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationDeleteMembershipCommand() *cobra.Command {
	var membershipId string
	var organizationId string

	cmd := &cobra.Command{
		Use:   "delete-membership",
		Short: "Remove a member from the current organization. The member is removed whether they accepted the invitation or not; a pending invitation is revoked.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			result, err := service.DeleteMembership(membershipId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&membershipId, "membership-id", "", "Membership ID.")
	_ = cmd.MarkFlagRequired("membership-id")
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationListProjectsCommand() *cobra.Command {
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
	var organizationId string

	cmd := &cobra.Command{
		Use:   "list-projects",
		Short: "Get a list of all projects. You can use the query params to filter your results.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

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
			options := []organization.ListProjectsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListProjectsQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListProjectsSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListProjectsTotal(total))
			}

			result, err := service.ListProjects(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, teamId, labels, search, accessedAt")
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
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationCreateProjectCommand() *cobra.Command {
	var projectId string
	var name string
	var region string
	var organizationId string

	cmd := &cobra.Command{
		Use:   "create-project",
		Short: "Create a new project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []organization.CreateProjectOption{}
			if cmd.Flags().Changed("region") {
				options = append(options, service.WithCreateProjectRegion(region))
			}

			result, err := service.CreateProject(projectId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&projectId, "project-id", "", "Unique Id. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, and hyphen. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("project-id")
	cmd.Flags().StringVar(&name, "name", "", "Project name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&region, "region", "", "Project Region.")
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationGetProjectCommand() *cobra.Command {
	var projectId string
	var organizationId string

	cmd := &cobra.Command{
		Use:   "get-project",
		Short: "Get a project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			result, err := service.GetProject(projectId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&projectId, "project-id", "", "Project unique ID.")
	_ = cmd.MarkFlagRequired("project-id")
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationUpdateProjectCommand() *cobra.Command {
	var projectId string
	var name string
	var organizationId string

	cmd := &cobra.Command{
		Use:   "update-project",
		Short: "Update a project by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			result, err := service.UpdateProject(projectId, name)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&projectId, "project-id", "", "Project unique ID.")
	_ = cmd.MarkFlagRequired("project-id")
	cmd.Flags().StringVar(&name, "name", "", "Project name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}

func newOrganizationDeleteProjectCommand() *cobra.Command {
	var projectId string
	var organizationId string

	cmd := &cobra.Command{
		Use:   "delete-project",
		Short: "Delete a project by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForOrganization(organizationId)
			if err != nil {
				return err
			}
			service := organization.New(client)

			result, err := service.DeleteProject(projectId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&projectId, "project-id", "", "Project unique ID.")
	_ = cmd.MarkFlagRequired("project-id")
	cmd.Flags().StringVar(&organizationId, "organization-id", "", "Organization to act on. Defaults to the organization linked in appwrite.config.json.")
	return cmd
}
