package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v7/domains"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewDomainsCommand builds the `domains` command tree.
func NewDomainsCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "domains",
		Short: "",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			return cmd.Help()
		},
	}

	cmd.AddCommand(newDomainsListCommand())
	cmd.AddCommand(newDomainsCreateCommand())
	cmd.AddCommand(newDomainsGetPriceCommand())
	cmd.AddCommand(newDomainsListPricesCommand())
	cmd.AddCommand(newDomainsGetCommand())
	cmd.AddCommand(newDomainsDeleteCommand())
	cmd.AddCommand(newDomainsUpdateNameserversCommand())
	cmd.AddCommand(newDomainsVerifyNameserversCommand())
	cmd.AddCommand(newDomainsGetPresetGoogleWorkspaceCommand())
	cmd.AddCommand(newDomainsCreatePresetGoogleWorkspaceCommand())
	cmd.AddCommand(newDomainsGetPresetICloudCommand())
	cmd.AddCommand(newDomainsCreatePresetICloudCommand())
	cmd.AddCommand(newDomainsGetPresetMailgunCommand())
	cmd.AddCommand(newDomainsCreatePresetMailgunCommand())
	cmd.AddCommand(newDomainsGetPresetOutlookCommand())
	cmd.AddCommand(newDomainsCreatePresetOutlookCommand())
	cmd.AddCommand(newDomainsGetPresetProtonMailCommand())
	cmd.AddCommand(newDomainsCreatePresetProtonMailCommand())
	cmd.AddCommand(newDomainsGetPresetZohoCommand())
	cmd.AddCommand(newDomainsCreatePresetZohoCommand())
	cmd.AddCommand(newDomainsListRecordsCommand())
	cmd.AddCommand(newDomainsCreateRecordACommand())
	cmd.AddCommand(newDomainsUpdateRecordACommand())
	cmd.AddCommand(newDomainsCreateRecordAAAACommand())
	cmd.AddCommand(newDomainsUpdateRecordAAAACommand())
	cmd.AddCommand(newDomainsCreateRecordAliasCommand())
	cmd.AddCommand(newDomainsUpdateRecordAliasCommand())
	cmd.AddCommand(newDomainsCreateRecordCAACommand())
	cmd.AddCommand(newDomainsUpdateRecordCAACommand())
	cmd.AddCommand(newDomainsCreateRecordCNAMECommand())
	cmd.AddCommand(newDomainsUpdateRecordCNAMECommand())
	cmd.AddCommand(newDomainsCreateRecordHTTPSCommand())
	cmd.AddCommand(newDomainsUpdateRecordHTTPSCommand())
	cmd.AddCommand(newDomainsCreateRecordMXCommand())
	cmd.AddCommand(newDomainsUpdateRecordMXCommand())
	cmd.AddCommand(newDomainsCreateRecordNSCommand())
	cmd.AddCommand(newDomainsUpdateRecordNSCommand())
	cmd.AddCommand(newDomainsCreateRecordSRVCommand())
	cmd.AddCommand(newDomainsUpdateRecordSRVCommand())
	cmd.AddCommand(newDomainsCreateRecordTXTCommand())
	cmd.AddCommand(newDomainsUpdateRecordTXTCommand())
	cmd.AddCommand(newDomainsGetRecordCommand())
	cmd.AddCommand(newDomainsDeleteRecordCommand())
	cmd.AddCommand(newDomainsUpdateTeamCommand())
	cmd.AddCommand(newDomainsGetTransferStatusCommand())
	cmd.AddCommand(newDomainsGetZoneCommand())
	cmd.AddCommand(newDomainsUpdateZoneCommand())

	return cmd
}

func newDomainsListCommand() *cobra.Command {
	var queries []string
	var search string
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
		Short: "List all domains registered for this project. This endpoint supports pagination.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

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
			options := []domains.ListOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListSearch(search))
			}

			result, err := service.List(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on attributes such as domain name, teamInternalId, expiration, etc.")
	cmd.Flags().StringVar(&search, "search", "", "Search term to filter your list results. Max length: 256 chars.")
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

func newDomainsCreateCommand() *cobra.Command {
	var teamId string
	var domain string

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create a new domain. Before creating a domain, you need to ensure that your DNS provider is properly configured. After creating the domain, you can use the verification endpoint to check if the domain is ready to be used.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.Create(teamId, domain)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&teamId, "team-id", "", "Team unique ID.")
	_ = cmd.MarkFlagRequired("team-id")
	cmd.Flags().StringVar(&domain, "domain", "", "Domain name (e.g. \"example.com\").")
	_ = cmd.MarkFlagRequired("domain")
	return cmd
}

func newDomainsGetPriceCommand() *cobra.Command {
	var domain string
	var periodYears int
	var registrationType string

	cmd := &cobra.Command{
		Use:   "get-price",
		Short: "Get the registration price for a domain name.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.GetPriceOption{}
			if cmd.Flags().Changed("period-years") {
				options = append(options, service.WithGetPricePeriodYears(periodYears))
			}
			if cmd.Flags().Changed("registration-type") {
				options = append(options, service.WithGetPriceRegistrationType(registrationType))
			}

			result, err := service.GetPrice(domain, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domain, "domain", "", "Domain name to get price for.")
	_ = cmd.MarkFlagRequired("domain")
	cmd.Flags().IntVar(&periodYears, "period-years", 0, "Number of years to calculate the domain price for. Must be at least 1.")
	cmd.Flags().StringVar(&registrationType, "registration-type", "", "Type of registration pricing to fetch. Allowed values: new, transfer, renewal, trade.")
	return cmd
}

func newDomainsListPricesCommand() *cobra.Command {
	var domainsArg []string
	var periodYears int
	var registrationType string

	cmd := &cobra.Command{
		Use:   "list-prices",
		Short: "Check availability and get the requested registration price for one or more domain names. Availability is resolved for all domains in a single registrar lookup. Unavailable domains have a null price for new registrations, but can still be priced for renewal, transfer, or trade. Every priced domain also carries its renewal price for the same period, so a separate renewal lookup is not needed. A domain whose price could not be resolved, for example because its TLD is not supported, is returned with a null price.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.ListPricesOption{}
			if cmd.Flags().Changed("period-years") {
				options = append(options, service.WithListPricesPeriodYears(periodYears))
			}
			if cmd.Flags().Changed("registration-type") {
				options = append(options, service.WithListPricesRegistrationType(registrationType))
			}

			result, err := service.ListPrices(domainsArg, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&domainsArg, "domains", nil, "Domain names to check availability and price for. Maximum of 50 domains per request.")
	_ = cmd.MarkFlagRequired("domains")
	cmd.Flags().IntVar(&periodYears, "period-years", 0, "Number of years to calculate the domain price for. Must be at least 1.")
	cmd.Flags().StringVar(&registrationType, "registration-type", "", "Type of registration pricing to fetch. Allowed values: new, transfer, renewal, trade.")
	return cmd
}

func newDomainsGetCommand() *cobra.Command {
	var domainId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a domain by its unique ID.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.Get(domainId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	return cmd
}

func newDomainsDeleteCommand() *cobra.Command {
	var domainId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a domain by its unique ID. This endpoint can be used to delete a domain from your project.\nOnce deleted, the domain will no longer be available for use and all associated resources will be removed.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.Delete(domainId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	return cmd
}

func newDomainsUpdateNameserversCommand() *cobra.Command {
	var domainId string
	var nameservers []string

	cmd := &cobra.Command{
		Use:   "update-nameservers",
		Short: "Update the registrar nameservers for the given domain. When nameservers are not provided,\nthe domain will be updated to use Appwrite nameservers.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.UpdateNameserversOption{}
			if cmd.Flags().Changed("nameservers") {
				options = append(options, service.WithUpdateNameserversNameservers(nameservers))
			}

			result, err := service.UpdateNameservers(domainId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringArrayVar(&nameservers, "nameservers", nil, "Nameservers to set for the domain. Defaults to Appwrite nameservers when omitted.")
	return cmd
}

func newDomainsVerifyNameserversCommand() *cobra.Command {
	var domainId string

	cmd := &cobra.Command{
		Use:   "verify-nameservers",
		Short: "Verify which NS records are used and update the domain accordingly. This will check the domain's\nnameservers and update the domain's status based on whether the nameservers match the expected\nAppwrite nameservers.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.VerifyNameservers(domainId)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	return cmd
}

func newDomainsGetPresetGoogleWorkspaceCommand() *cobra.Command {
	var domainId string

	cmd := &cobra.Command{
		Use:   "get-preset-google-workspace",
		Short: "List Google Workspace DNS records.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.GetPresetGoogleWorkspace(domainId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	return cmd
}

func newDomainsCreatePresetGoogleWorkspaceCommand() *cobra.Command {
	var domainId string

	cmd := &cobra.Command{
		Use:   "create-preset-google-workspace",
		Short: "Add Google Workspace DNS records to the domain. This will create the required MX records \nfor Google Workspace email hosting.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.CreatePresetGoogleWorkspace(domainId)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	return cmd
}

func newDomainsGetPresetICloudCommand() *cobra.Command {
	var domainId string

	cmd := &cobra.Command{
		Use:   "get-preset-i-cloud",
		Short: "List iCloud DNS records.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.GetPresetICloud(domainId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	return cmd
}

func newDomainsCreatePresetICloudCommand() *cobra.Command {
	var domainId string

	cmd := &cobra.Command{
		Use:   "create-preset-i-cloud",
		Short: "Add iCloud DNS records to the domain. This will create the required MX and SPF records\nfor using iCloud email services with your domain.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.CreatePresetICloud(domainId)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	return cmd
}

func newDomainsGetPresetMailgunCommand() *cobra.Command {
	var domainId string

	cmd := &cobra.Command{
		Use:   "get-preset-mailgun",
		Short: "List Mailgun DNS records.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.GetPresetMailgun(domainId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	return cmd
}

func newDomainsCreatePresetMailgunCommand() *cobra.Command {
	var domainId string

	cmd := &cobra.Command{
		Use:   "create-preset-mailgun",
		Short: "Add Mailgun DNS records to the domain. This endpoint will create the required DNS records \nfor Mailgun in the specified domain.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.CreatePresetMailgun(domainId)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	return cmd
}

func newDomainsGetPresetOutlookCommand() *cobra.Command {
	var domainId string

	cmd := &cobra.Command{
		Use:   "get-preset-outlook",
		Short: "List Outlook DNS records.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.GetPresetOutlook(domainId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	return cmd
}

func newDomainsCreatePresetOutlookCommand() *cobra.Command {
	var domainId string

	cmd := &cobra.Command{
		Use:   "create-preset-outlook",
		Short: "Add Outlook DNS records to the domain. This will create the required MX records\nfor setting up Outlook email hosting for your domain.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.CreatePresetOutlook(domainId)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	return cmd
}

func newDomainsGetPresetProtonMailCommand() *cobra.Command {
	var domainId string

	cmd := &cobra.Command{
		Use:   "get-preset-proton-mail",
		Short: "List ProtonMail DNS records.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.GetPresetProtonMail(domainId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	return cmd
}

func newDomainsCreatePresetProtonMailCommand() *cobra.Command {
	var domainId string

	cmd := &cobra.Command{
		Use:   "create-preset-proton-mail",
		Short: "Add ProtonMail DNS records to the domain. This will create the required MX records\nfor using ProtonMail with your custom domain.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.CreatePresetProtonMail(domainId)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	return cmd
}

func newDomainsGetPresetZohoCommand() *cobra.Command {
	var domainId string

	cmd := &cobra.Command{
		Use:   "get-preset-zoho",
		Short: "List Zoho DNS records.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.GetPresetZoho(domainId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	return cmd
}

func newDomainsCreatePresetZohoCommand() *cobra.Command {
	var domainId string

	cmd := &cobra.Command{
		Use:   "create-preset-zoho",
		Short: "Add Zoho Mail DNS records to the domain. This will create the required MX records\nfor setting up Zoho Mail on your domain.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.CreatePresetZoho(domainId)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	return cmd
}

func newDomainsListRecordsCommand() *cobra.Command {
	var domainId string
	var queries []string
	var filter []string
	var where []string
	var sortAsc []string
	var sortDesc []string
	var limit int
	var offset int
	var cursorAfter string
	var cursorBefore string

	cmd := &cobra.Command{
		Use:   "list-records",
		Short: "List DNS records for a given domain. You can use this endpoint to list all the DNS records\nassociated with your domain.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

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
			options := []domains.ListRecordsOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListRecordsQueries(queries))
			}

			result, err := service.ListRecords(domainId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. You may filter on attributes such as type, name, value, etc. Maximum of 100 queries are allowed, each 4096 characters long.")
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

func newDomainsCreateRecordACommand() *cobra.Command {
	var domainId string
	var name string
	var value string
	var ttl int
	var comment string

	cmd := &cobra.Command{
		Use:   "create-record-a",
		Short: "Create a new A record for the given domain. A records are used to point a domain name \nto an IPv4 address. The record value should be a valid IPv4 address.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.CreateRecordAOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithCreateRecordAComment(comment))
			}

			result, err := service.CreateRecordA(domainId, name, value, ttl, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name (subdomain).")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "IPv4 address for this A record.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment explaining what this record is for.")
	return cmd
}

func newDomainsUpdateRecordACommand() *cobra.Command {
	var domainId string
	var recordId string
	var name string
	var value string
	var ttl int
	var comment string

	cmd := &cobra.Command{
		Use:   "update-record-a",
		Short: "Update an existing A record for the given domain. This endpoint allows you to modify \nthe properties of an A record including its name (subdomain), IPv4 address, TTL, \nand optional comment.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.UpdateRecordAOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithUpdateRecordAComment(comment))
			}

			result, err := service.UpdateRecordA(domainId, recordId, name, value, ttl, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&recordId, "record-id", "", "DNS record unique ID.")
	_ = cmd.MarkFlagRequired("record-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name (subdomain).")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "IPv4 address for this A record.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment explaining what this record is for.")
	return cmd
}

func newDomainsCreateRecordAAAACommand() *cobra.Command {
	var domainId string
	var name string
	var value string
	var ttl int
	var comment string

	cmd := &cobra.Command{
		Use:   "create-record-aaaa",
		Short: "Create a new AAAA record for the given domain. This endpoint allows you to add a new IPv6 DNS record \nto your domain. The record will be used to point a hostname to an IPv6 address.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.CreateRecordAAAAOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithCreateRecordAAAAComment(comment))
			}

			result, err := service.CreateRecordAAAA(domainId, name, value, ttl, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name (subdomain).")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "IPv6 address for this AAAA record.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment explaining what this record is for.")
	return cmd
}

func newDomainsUpdateRecordAAAACommand() *cobra.Command {
	var domainId string
	var recordId string
	var name string
	var value string
	var ttl int
	var comment string

	cmd := &cobra.Command{
		Use:   "update-record-aaaa",
		Short: "Update an existing AAAA record for the given domain. This endpoint allows you to modify\nthe properties of an existing AAAA record, including its name (subdomain), IPv6 address,\nTTL, and optional comment.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.UpdateRecordAAAAOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithUpdateRecordAAAAComment(comment))
			}

			result, err := service.UpdateRecordAAAA(domainId, recordId, name, value, ttl, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&recordId, "record-id", "", "DNS record unique ID.")
	_ = cmd.MarkFlagRequired("record-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name (subdomain).")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "IPv6 address for this AAAA record.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment for this record.")
	return cmd
}

func newDomainsCreateRecordAliasCommand() *cobra.Command {
	var domainId string
	var name string
	var value string
	var ttl int
	var comment string

	cmd := &cobra.Command{
		Use:   "create-record-alias",
		Short: "Create a new ALIAS record for the given domain. This record type can be used to point your domain \nto another domain name that will serve as an alias. This is particularly useful when you want to \nmap your domain to a target domain that may change its IP address.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.CreateRecordAliasOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithCreateRecordAliasComment(comment))
			}

			result, err := service.CreateRecordAlias(domainId, name, value, ttl, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "Target domain for this ALIAS record.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment for this record.")
	return cmd
}

func newDomainsUpdateRecordAliasCommand() *cobra.Command {
	var domainId string
	var recordId string
	var name string
	var value string
	var ttl int
	var comment string

	cmd := &cobra.Command{
		Use:   "update-record-alias",
		Short: "Update an existing ALIAS record for the specified domain. This endpoint allows you to modify\nthe properties of an existing ALIAS record including its name, target domain, TTL, and comment.\n    \nThe ALIAS record type is similar to a CNAME record but can be used at the zone apex (root domain).\nIt provides a way to map one domain name to another.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.UpdateRecordAliasOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithUpdateRecordAliasComment(comment))
			}

			result, err := service.UpdateRecordAlias(domainId, recordId, name, value, ttl, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&recordId, "record-id", "", "DNS record unique ID.")
	_ = cmd.MarkFlagRequired("record-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "Target domain for this ALIAS record.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment for this record.")
	return cmd
}

func newDomainsCreateRecordCAACommand() *cobra.Command {
	var domainId string
	var name string
	var value string
	var ttl int
	var comment string

	cmd := &cobra.Command{
		Use:   "create-record-caa",
		Short: "Create a new CAA record for the given domain. CAA records are used to specify which \nCertificate Authorities (CAs) are allowed to issue SSL/TLS certificates for your domain.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.CreateRecordCAAOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithCreateRecordCAAComment(comment))
			}

			result, err := service.CreateRecordCAA(domainId, name, value, ttl, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "CAA value (e.g. issuer domain).")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment for this record.")
	return cmd
}

func newDomainsUpdateRecordCAACommand() *cobra.Command {
	var domainId string
	var recordId string
	var name string
	var value string
	var ttl int
	var comment string

	cmd := &cobra.Command{
		Use:   "update-record-caa",
		Short: "Update an existing CAA record for the given domain. A CAA (Certification Authority Authorization) \nrecord is used to specify which certificate authorities (CAs) are authorized to issue certificates \nfor a domain.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.UpdateRecordCAAOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithUpdateRecordCAAComment(comment))
			}

			result, err := service.UpdateRecordCAA(domainId, recordId, name, value, ttl, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&recordId, "record-id", "", "DNS record unique ID.")
	_ = cmd.MarkFlagRequired("record-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "CAA value (e.g. issuer domain).")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment for this record.")
	return cmd
}

func newDomainsCreateRecordCNAMECommand() *cobra.Command {
	var domainId string
	var name string
	var value string
	var ttl int
	var comment string

	cmd := &cobra.Command{
		Use:   "create-record-cname",
		Short: "Create a new CNAME record for the given domain.\n    \nA CNAME record maps a subdomain to another domain name, allowing you to create aliases \nfor your domain. For example, you can create a CNAME record to point 'blog.example.com' \nto 'example.wordpress.com'.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.CreateRecordCNAMEOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithCreateRecordCNAMEComment(comment))
			}

			result, err := service.CreateRecordCNAME(domainId, name, value, ttl, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name (subdomain).")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "Canonical target for this CNAME record.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment for this record.")
	return cmd
}

func newDomainsUpdateRecordCNAMECommand() *cobra.Command {
	var domainId string
	var recordId string
	var name string
	var value string
	var ttl int
	var comment string

	cmd := &cobra.Command{
		Use:   "update-record-cname",
		Short: "Update an existing CNAME record for the given domain.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.UpdateRecordCNAMEOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithUpdateRecordCNAMEComment(comment))
			}

			result, err := service.UpdateRecordCNAME(domainId, recordId, name, value, ttl, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&recordId, "record-id", "", "DNS record unique ID.")
	_ = cmd.MarkFlagRequired("record-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name (subdomain).")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "Canonical target for this CNAME record.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment for this record.")
	return cmd
}

func newDomainsCreateRecordHTTPSCommand() *cobra.Command {
	var domainId string
	var name string
	var value string
	var ttl int
	var comment string

	cmd := &cobra.Command{
		Use:   "create-record-https",
		Short: "Create a new HTTPS record for the given domain. This record is used to configure HTTPS \nsettings for your domain, enabling secure communication over SSL/TLS.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.CreateRecordHTTPSOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithCreateRecordHTTPSComment(comment))
			}

			result, err := service.CreateRecordHTTPS(domainId, name, value, ttl, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name (subdomain).")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "Target for the HTTPS record.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment for this record.")
	return cmd
}

func newDomainsUpdateRecordHTTPSCommand() *cobra.Command {
	var domainId string
	var recordId string
	var name string
	var value string
	var ttl int
	var comment string

	cmd := &cobra.Command{
		Use:   "update-record-https",
		Short: "Update an existing HTTPS record for the given domain. This endpoint allows you to modify \nthe properties of an HTTPS record associated with your domain, including the name (subdomain), \ntarget value, TTL, and optional comment.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.UpdateRecordHTTPSOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithUpdateRecordHTTPSComment(comment))
			}

			result, err := service.UpdateRecordHTTPS(domainId, recordId, name, value, ttl, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&recordId, "record-id", "", "DNS record unique ID.")
	_ = cmd.MarkFlagRequired("record-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name (subdomain).")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "Target for the HTTPS record.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment for this record.")
	return cmd
}

func newDomainsCreateRecordMXCommand() *cobra.Command {
	var domainId string
	var name string
	var value string
	var ttl int
	var priority int
	var comment string

	cmd := &cobra.Command{
		Use:   "create-record-mx",
		Short: "Create a new MX record for the given domain. MX records are used to define the mail servers responsible \nfor accepting email messages for the domain. Multiple MX records can be created with different priorities.\nThe priority parameter determines the order in which mail servers are used, with lower values indicating \nhigher priority.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.CreateRecordMXOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithCreateRecordMXComment(comment))
			}

			result, err := service.CreateRecordMX(domainId, name, value, ttl, priority, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name (subdomain).")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "Mail server domain for this MX record.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().IntVar(&priority, "priority", 0, "MX priority. Lower values are tried first.")
	_ = cmd.MarkFlagRequired("priority")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment for this record.")
	return cmd
}

func newDomainsUpdateRecordMXCommand() *cobra.Command {
	var domainId string
	var recordId string
	var name string
	var value string
	var ttl int
	var priority int
	var comment string

	cmd := &cobra.Command{
		Use:   "update-record-mx",
		Short: "Update an existing MX record for the given domain.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.UpdateRecordMXOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithUpdateRecordMXComment(comment))
			}

			result, err := service.UpdateRecordMX(domainId, recordId, name, value, ttl, priority, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&recordId, "record-id", "", "DNS record unique ID.")
	_ = cmd.MarkFlagRequired("record-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name (subdomain).")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "Mail server domain for this MX record.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().IntVar(&priority, "priority", 0, "MX priority. Lower values are tried first.")
	_ = cmd.MarkFlagRequired("priority")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment for this record.")
	return cmd
}

func newDomainsCreateRecordNSCommand() *cobra.Command {
	var domainId string
	var name string
	var value string
	var ttl int
	var comment string

	cmd := &cobra.Command{
		Use:   "create-record-ns",
		Short: "Create a new NS record for the given domain. NS records specify the nameservers that are used \nto resolve the domain name to IP addresses. Each domain can have multiple NS records.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.CreateRecordNSOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithCreateRecordNSComment(comment))
			}

			result, err := service.CreateRecordNS(domainId, name, value, ttl, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name (subdomain).")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "Nameserver target for this NS record.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment for this record.")
	return cmd
}

func newDomainsUpdateRecordNSCommand() *cobra.Command {
	var domainId string
	var recordId string
	var name string
	var value string
	var ttl int
	var comment string

	cmd := &cobra.Command{
		Use:   "update-record-ns",
		Short: "Update an existing NS record for the given domain. This endpoint allows you to modify \nthe properties of an NS (nameserver) record associated with your domain. You can update \nthe record name (subdomain), target nameserver value, TTL, and add or modify comments \nfor better record management.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.UpdateRecordNSOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithUpdateRecordNSComment(comment))
			}

			result, err := service.UpdateRecordNS(domainId, recordId, name, value, ttl, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&recordId, "record-id", "", "DNS record unique ID.")
	_ = cmd.MarkFlagRequired("record-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name (subdomain).")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "Nameserver target for this NS record.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment for this record.")
	return cmd
}

func newDomainsCreateRecordSRVCommand() *cobra.Command {
	var domainId string
	var name string
	var value string
	var ttl int
	var priority int
	var weight int
	var port int
	var comment string

	cmd := &cobra.Command{
		Use:   "create-record-srv",
		Short: "Create a new SRV record for the given domain. SRV records are used to define the location \nof servers for specific services. For example, they can be used to specify which server \nhandles a specific service like SIP or XMPP for the domain.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.CreateRecordSRVOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithCreateRecordSRVComment(comment))
			}

			result, err := service.CreateRecordSRV(domainId, name, value, ttl, priority, weight, port, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name (service name).")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "Target hostname for this SRV record.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().IntVar(&priority, "priority", 0, "Record priority. Lower values are tried first.")
	_ = cmd.MarkFlagRequired("priority")
	cmd.Flags().IntVar(&weight, "weight", 0, "Record weight, used to share load between targets of equal priority.")
	_ = cmd.MarkFlagRequired("weight")
	cmd.Flags().IntVar(&port, "port", 0, "Port number for the service.")
	_ = cmd.MarkFlagRequired("port")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment for this record.")
	return cmd
}

func newDomainsUpdateRecordSRVCommand() *cobra.Command {
	var domainId string
	var recordId string
	var name string
	var value string
	var ttl int
	var priority int
	var weight int
	var port int
	var comment string

	cmd := &cobra.Command{
		Use:   "update-record-srv",
		Short: "Update an existing SRV record for the given domain.\n    \nRequired parameters:\n- domainId: Domain unique ID\n- recordId: DNS record unique ID\n- name: Record name (service name)\n- value: Target hostname for this SRV record\n- ttl: Time to live, in seconds\n- priority: Record priority\n- weight: Record weight\n- port: Port number for the service\n    \nOptional parameters:\n- comment: A comment for this record",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.UpdateRecordSRVOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithUpdateRecordSRVComment(comment))
			}

			result, err := service.UpdateRecordSRV(domainId, recordId, name, value, ttl, priority, weight, port, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&recordId, "record-id", "", "DNS record unique ID.")
	_ = cmd.MarkFlagRequired("record-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name (service name).")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "Target hostname for this SRV record.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().IntVar(&priority, "priority", 0, "Record priority. Lower values are tried first.")
	_ = cmd.MarkFlagRequired("priority")
	cmd.Flags().IntVar(&weight, "weight", 0, "Record weight, used to share load between targets of equal priority.")
	_ = cmd.MarkFlagRequired("weight")
	cmd.Flags().IntVar(&port, "port", 0, "Port number for the service.")
	_ = cmd.MarkFlagRequired("port")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment for this record.")
	return cmd
}

func newDomainsCreateRecordTXTCommand() *cobra.Command {
	var domainId string
	var name string
	var ttl int
	var value string
	var comment string

	cmd := &cobra.Command{
		Use:   "create-record-txt",
		Short: "Create a new TXT record for the given domain. TXT records can be used \nto provide additional information about your domain, such as domain \nverification records, SPF records, or DKIM records.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.CreateRecordTXTOption{}
			if cmd.Flags().Changed("value") {
				options = append(options, service.WithCreateRecordTXTValue(value))
			}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithCreateRecordTXTComment(comment))
			}

			result, err := service.CreateRecordTXT(domainId, name, ttl, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name (subdomain) for the TXT record.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().StringVar(&value, "value", "", "TXT record value.")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment for this record.")
	return cmd
}

func newDomainsUpdateRecordTXTCommand() *cobra.Command {
	var domainId string
	var recordId string
	var name string
	var value string
	var ttl int
	var comment string

	cmd := &cobra.Command{
		Use:   "update-record-txt",
		Short: "Update an existing TXT record for the given domain.\n    \nUpdate the TXT record details for a specific domain by providing the domain ID,\nrecord ID, and the new record configuration including name, value, TTL, and an optional comment.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []domains.UpdateRecordTXTOption{}
			if cmd.Flags().Changed("comment") {
				options = append(options, service.WithUpdateRecordTXTComment(comment))
			}

			result, err := service.UpdateRecordTXT(domainId, recordId, name, value, ttl, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&recordId, "record-id", "", "DNS record unique ID.")
	_ = cmd.MarkFlagRequired("record-id")
	cmd.Flags().StringVar(&name, "name", "", "Record name (subdomain) for the TXT record.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&value, "value", "", "TXT record value.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "Time to live, in seconds. Must be between 1 and 2147483647.")
	_ = cmd.MarkFlagRequired("ttl")
	cmd.Flags().StringVar(&comment, "comment", "", "A comment for this record.")
	return cmd
}

func newDomainsGetRecordCommand() *cobra.Command {
	var domainId string
	var recordId string

	cmd := &cobra.Command{
		Use:   "get-record",
		Short: "Get a single DNS record for a given domain by record ID.\n    \nThis endpoint allows you to retrieve a specific DNS record associated with a domain\nusing its unique identifier. The record contains information about the DNS configuration\nsuch as type, value, and TTL settings.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.GetRecord(domainId, recordId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&recordId, "record-id", "", "DNS record unique ID.")
	_ = cmd.MarkFlagRequired("record-id")
	return cmd
}

func newDomainsDeleteRecordCommand() *cobra.Command {
	var domainId string
	var recordId string

	cmd := &cobra.Command{
		Use:   "delete-record",
		Short: "Delete a DNS record for the given domain. This endpoint allows you to delete an existing DNS record \nfrom a specific domain.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.DeleteRecord(domainId, recordId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&recordId, "record-id", "", "DNS record unique ID.")
	_ = cmd.MarkFlagRequired("record-id")
	return cmd
}

func newDomainsUpdateTeamCommand() *cobra.Command {
	var domainId string
	var teamId string

	cmd := &cobra.Command{
		Use:   "update-team",
		Short: "Update the team ID for a specific domain. The caller must administer the current\nteam and be an owner of the destination team.\n\nUpdating the team ID will transfer ownership and access control of the domain\nand all its DNS records to the new team.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.UpdateTeam(domainId, teamId)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&teamId, "team-id", "", "New team unique ID.")
	_ = cmd.MarkFlagRequired("team-id")
	return cmd
}

func newDomainsGetTransferStatusCommand() *cobra.Command {
	var domainId string

	cmd := &cobra.Command{
		Use:   "get-transfer-status",
		Short: "Retrieve the current transfer status for a domain. Returns the status, an optional reason, and a timestamp of the last status change.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.GetTransferStatus(domainId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	return cmd
}

func newDomainsGetZoneCommand() *cobra.Command {
	var domainId string

	cmd := &cobra.Command{
		Use:   "get-zone",
		Short: "Retrieve the DNS zone file for the given domain. This endpoint will return the DNS\nzone file in a standardized format that can be used to configure DNS servers.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.GetZone(domainId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	return cmd
}

func newDomainsUpdateZoneCommand() *cobra.Command {
	var domainId string
	var content string

	cmd := &cobra.Command{
		Use:   "update-zone",
		Short: "Update the DNS zone for the given domain using the provided zone file content.\nAll parsed records are imported and then the main domain document is returned.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := domains.New(client)

			result, err := service.UpdateZone(domainId, content)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domainId, "domain-id", "", "Domain unique ID.")
	_ = cmd.MarkFlagRequired("domain-id")
	cmd.Flags().StringVar(&content, "content", "", "DNS zone file content as a string.")
	_ = cmd.MarkFlagRequired("content")
	return cmd
}
