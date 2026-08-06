package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/teams"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
)

// NewTeamsCommand builds the `teams` command tree.
func NewTeamsCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "teams",
		Short: "The Teams service allows you to group users of your project and to enable them to share read and write access to your project resources",
	}

	cmd.AddCommand(newTeamsListCommand())
	cmd.AddCommand(newTeamsCreateCommand())
	cmd.AddCommand(newTeamsGetCommand())
	cmd.AddCommand(newTeamsUpdateNameCommand())
	cmd.AddCommand(newTeamsDeleteCommand())
	cmd.AddCommand(newTeamsListInstallationsCommand())
	cmd.AddCommand(newTeamsCreateInstallationCommand())
	cmd.AddCommand(newTeamsGetInstallationCommand())
	cmd.AddCommand(newTeamsUpdateInstallationCommand())
	cmd.AddCommand(newTeamsDeleteInstallationCommand())
	cmd.AddCommand(newTeamsListMembershipsCommand())
	cmd.AddCommand(newTeamsCreateMembershipCommand())
	cmd.AddCommand(newTeamsGetMembershipCommand())
	cmd.AddCommand(newTeamsUpdateMembershipCommand())
	cmd.AddCommand(newTeamsDeleteMembershipCommand())
	cmd.AddCommand(newTeamsUpdateMembershipStatusCommand())
	cmd.AddCommand(newTeamsGetPrefsCommand())
	cmd.AddCommand(newTeamsUpdatePrefsCommand())

	return cmd
}

func newTeamsListCommand() *cobra.Command {
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

	cmd := &cobra.Command{
		Use:   "list",
		Short: "Get a list of all the teams in which the current user is a member. You can use the parameters to filter your results.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)

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
			options := []teams.ListOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListTotal(total))
			}

			result, err := service.List(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, total, billingPlan")
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
	return cmd
}

func newTeamsCreateCommand() *cobra.Command {
	var teamId string
	var name string
	var roles []string

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create a new team. The user who creates the team will automatically be assigned as the owner of the team. Only the users with the owner role can invite new members, add new owners and delete or update the team.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []teams.CreateOption{}
			if cmd.Flags().Changed("roles") {
				options = append(options, service.WithCreateRoles(roles))
			}

			result, err := service.Create(teamId, name, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("team-id")
	cmd.Flags().StringVar(&name, "name", "", "Team name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringArrayVar(&roles, "roles", nil, "Array of strings. Use this param to set the roles in the team for the user who created it. The default role is owner. A role can be any string. Learn more about roles and permissions (https://appwrite.io/docs/permissions). Maximum of 100 roles are allowed, each 32 characters long.")
	return cmd
}

func newTeamsGetCommand() *cobra.Command {
	var teamId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a team by its ID. All team members have read access for this resource.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)

			result, err := service.Get(teamId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID.")
	_ = cmd.MarkFlagRequired("team-id")
	return cmd
}

func newTeamsUpdateNameCommand() *cobra.Command {
	var teamId string
	var name string

	cmd := &cobra.Command{
		Use:   "update-name",
		Short: "Update the team's name by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)

			result, err := service.UpdateName(teamId, name)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID.")
	_ = cmd.MarkFlagRequired("team-id")
	cmd.Flags().StringVar(&name, "name", "", "New team name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	return cmd
}

func newTeamsDeleteCommand() *cobra.Command {
	var teamId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a team using its ID. Only team members with the owner role can delete the team.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)

			result, err := service.Delete(teamId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID.")
	_ = cmd.MarkFlagRequired("team-id")
	return cmd
}

func newTeamsListInstallationsCommand() *cobra.Command {
	var teamId string
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
		Short: "List app installations on a team. Any team member can read installations.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)

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
			options := []teams.ListInstallationsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListInstallationsQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListInstallationsTotal(total))
			}

			result, err := service.ListInstallations(teamId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID.")
	_ = cmd.MarkFlagRequired("team-id")
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

func newTeamsCreateInstallationCommand() *cobra.Command {
	var teamId string
	var appId string
	var authorizationDetails string

	cmd := &cobra.Command{
		Use:   "create-installation",
		Short: "Install an app on a team. When authenticated as a user, only team members with the owner role can install apps. Requests using an API key or in admin mode can install apps on any team. The installation is granted the scopes the app currently requests.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []teams.CreateInstallationOption{}
			if cmd.Flags().Changed("authorization-details") {
				options = append(options, service.WithCreateInstallationAuthorizationDetails(authorizationDetails))
			}

			result, err := service.CreateInstallation(teamId, appId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID.")
	_ = cmd.MarkFlagRequired("team-id")
	cmd.Flags().StringVar(&appId, "app-id", "", "Application unique ID.")
	_ = cmd.MarkFlagRequired("app-id")
	cmd.Flags().StringVar(&authorizationDetails, "authorization-details", "", "Authorization details granted to the installation as a JSON array of objects, each with a `type` and app-defined fields. The Appwrite Console stores authorized project IDs here.")
	return cmd
}

func newTeamsGetInstallationCommand() *cobra.Command {
	var teamId string
	var installationId string

	cmd := &cobra.Command{
		Use:   "get-installation",
		Short: "Get an app installation on a team by its unique ID. Any team member can read installations.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)

			result, err := service.GetInstallation(teamId, installationId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID.")
	_ = cmd.MarkFlagRequired("team-id")
	cmd.Flags().StringVar(&installationId, "installation-id", "", "Installation unique ID.")
	_ = cmd.MarkFlagRequired("installation-id")
	return cmd
}

func newTeamsUpdateInstallationCommand() *cobra.Command {
	var teamId string
	var installationId string
	var authorizationDetails string

	cmd := &cobra.Command{
		Use:   "update-installation",
		Short: "Update an app installation on a team. Only team members with the owner role can update installations. The installation's granted scopes are refreshed to the scopes the app currently requests; previously issued installation access tokens are revoked.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []teams.UpdateInstallationOption{}
			if cmd.Flags().Changed("authorization-details") {
				options = append(options, service.WithUpdateInstallationAuthorizationDetails(authorizationDetails))
			}

			result, err := service.UpdateInstallation(teamId, installationId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID.")
	_ = cmd.MarkFlagRequired("team-id")
	cmd.Flags().StringVar(&installationId, "installation-id", "", "Installation unique ID.")
	_ = cmd.MarkFlagRequired("installation-id")
	cmd.Flags().StringVar(&authorizationDetails, "authorization-details", "", "Authorization details granted to the installation as a JSON array of objects, each with a `type` and app-defined fields. Omit to keep the current value.")
	return cmd
}

func newTeamsDeleteInstallationCommand() *cobra.Command {
	var teamId string
	var installationId string

	cmd := &cobra.Command{
		Use:   "delete-installation",
		Short: "Uninstall an app from a team by its installation ID. Only team members with the owner role can remove installations. Previously issued installation access tokens are revoked.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)

			result, err := service.DeleteInstallation(teamId, installationId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID.")
	_ = cmd.MarkFlagRequired("team-id")
	cmd.Flags().StringVar(&installationId, "installation-id", "", "Installation unique ID.")
	_ = cmd.MarkFlagRequired("installation-id")
	return cmd
}

func newTeamsListMembershipsCommand() *cobra.Command {
	var teamId string
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

	cmd := &cobra.Command{
		Use:   "list-memberships",
		Short: "Use this endpoint to list a team's members using the team's ID. All team members have read access to this endpoint. Hide sensitive attributes from the response by toggling membership privacy in the Console.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)

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
			options := []teams.ListMembershipsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListMembershipsQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListMembershipsSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListMembershipsTotal(total))
			}

			result, err := service.ListMemberships(teamId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID.")
	_ = cmd.MarkFlagRequired("team-id")
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
	return cmd
}

func newTeamsCreateMembershipCommand() *cobra.Command {
	var teamId string
	var roles []string
	var email string
	var userId string
	var phone string
	var url string
	var name string

	cmd := &cobra.Command{
		Use:   "create-membership",
		Short: "Invite a new member to join your team. Provide an ID for existing users, or invite unregistered users using an email or phone number. If initiated from a Client SDK, Appwrite will send an email or sms with a link to join the team to the invited user, and an account will be created for them if one doesn't exist. If initiated from a Server SDK, the new member will be added automatically to the team.\n\nYou only need to provide one of a user ID, email, or phone number. Appwrite will prioritize accepting the user ID > email > phone number if you provide more than one of these parameters.\n\nUse the `url` parameter to redirect the user from the invitation email to your app. After the user is redirected, use the Update Team Membership Status (https://appwrite.io/docs/references/cloud/client-web/teams#updateMembershipStatus) endpoint to allow the user to accept the invitation to the team. \n\nPlease note that to avoid a Redirect Attack (https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md) Appwrite will accept the only redirect URLs under the domains you have added as a platform on the Appwrite Console.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []teams.CreateMembershipOption{}
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

			result, err := service.CreateMembership(teamId, roles, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID.")
	_ = cmd.MarkFlagRequired("team-id")
	cmd.Flags().StringArrayVar(&roles, "roles", nil, "Array of strings. Use this param to set the user roles in the team. A role can be any string. Learn more about roles and permissions (https://appwrite.io/docs/permissions). Maximum of 100 roles are allowed, each 81 characters long.")
	_ = cmd.MarkFlagRequired("roles")
	cmd.Flags().StringVar(&email, "email", "", "Email of the new team member.")
	cmd.Flags().StringVar(&userId, "user-id", "", "ID of the user to be added to a team.")
	cmd.Flags().StringVar(&phone, "phone", "", "Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.")
	cmd.Flags().StringVar(&url, "url", "", "URL to redirect the user back to your app from the invitation email. This parameter is not required when an API key is supplied. Only URLs from hostnames in your project platform list are allowed. This requirement helps to prevent an open redirect (https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) attack against your project API.")
	cmd.Flags().StringVar(&name, "name", "", "Name of the new team member. Max length: 128 chars.")
	return cmd
}

func newTeamsGetMembershipCommand() *cobra.Command {
	var teamId string
	var membershipId string

	cmd := &cobra.Command{
		Use:   "get-membership",
		Short: "Get a team member by the membership unique id. All team members have read access for this resource. Hide sensitive attributes from the response by toggling membership privacy in the Console.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)

			result, err := service.GetMembership(teamId, membershipId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID.")
	_ = cmd.MarkFlagRequired("team-id")
	cmd.Flags().StringVar(&membershipId, "membership-id", "", "Membership ID.")
	_ = cmd.MarkFlagRequired("membership-id")
	return cmd
}

func newTeamsUpdateMembershipCommand() *cobra.Command {
	var teamId string
	var membershipId string
	var roles []string

	cmd := &cobra.Command{
		Use:   "update-membership",
		Short: "Modify the roles of a team member. Only team members with the owner role have access to this endpoint. Learn more about roles and permissions (https://appwrite.io/docs/permissions).\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)

			result, err := service.UpdateMembership(teamId, membershipId, roles)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID.")
	_ = cmd.MarkFlagRequired("team-id")
	cmd.Flags().StringVar(&membershipId, "membership-id", "", "Membership ID.")
	_ = cmd.MarkFlagRequired("membership-id")
	cmd.Flags().StringArrayVar(&roles, "roles", nil, "An array of strings. Use this param to set the user's roles in the team. A role can be any string. Learn more about roles and permissions (https://appwrite.io/docs/permissions). Maximum of 100 roles are allowed, each 81 characters long.")
	_ = cmd.MarkFlagRequired("roles")
	return cmd
}

func newTeamsDeleteMembershipCommand() *cobra.Command {
	var teamId string
	var membershipId string

	cmd := &cobra.Command{
		Use:   "delete-membership",
		Short: "This endpoint allows a user to leave a team or for a team owner to delete the membership of any other team member. You can also use this endpoint to delete a user membership even if it is not accepted.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)

			result, err := service.DeleteMembership(teamId, membershipId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID.")
	_ = cmd.MarkFlagRequired("team-id")
	cmd.Flags().StringVar(&membershipId, "membership-id", "", "Membership ID.")
	_ = cmd.MarkFlagRequired("membership-id")
	return cmd
}

func newTeamsUpdateMembershipStatusCommand() *cobra.Command {
	var teamId string
	var membershipId string
	var userId string
	var secret string

	cmd := &cobra.Command{
		Use:   "update-membership-status",
		Short: "Use this endpoint to allow a user to accept an invitation to join a team after being redirected back to your app from the invitation email received by the user.\n\nIf the request is successful, a session for the user is automatically created.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)

			result, err := service.UpdateMembershipStatus(teamId, membershipId, userId, secret)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID.")
	_ = cmd.MarkFlagRequired("team-id")
	cmd.Flags().StringVar(&membershipId, "membership-id", "", "Membership ID.")
	_ = cmd.MarkFlagRequired("membership-id")
	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&secret, "secret", "", "Secret key.")
	_ = cmd.MarkFlagRequired("secret")
	return cmd
}

func newTeamsGetPrefsCommand() *cobra.Command {
	var teamId string

	cmd := &cobra.Command{
		Use:   "get-prefs",
		Short: "Get the team's shared preferences by its unique ID. If a preference doesn't need to be shared by all team members, prefer storing them in user preferences (https://appwrite.io/docs/references/cloud/client-web/account#getPrefs).",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)

			result, err := service.GetPrefs(teamId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID.")
	_ = cmd.MarkFlagRequired("team-id")
	return cmd
}

func newTeamsUpdatePrefsCommand() *cobra.Command {
	var teamId string
	var prefs string

	cmd := &cobra.Command{
		Use:   "update-prefs",
		Short: "Update the team's preferences by its unique ID. The object you pass is stored as is and replaces any previous value. The maximum allowed prefs size is 64kB and throws an error if exceeded.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := teams.New(client)
			prefsValue, err := app.JSONObject(prefs)
			if err != nil {
				return err
			}

			result, err := service.UpdatePrefs(teamId, prefsValue)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team ID.")
	_ = cmd.MarkFlagRequired("team-id")
	cmd.Flags().StringVar(&prefs, "prefs", "", "Prefs key-value JSON object.")
	_ = cmd.MarkFlagRequired("prefs")
	return cmd
}
