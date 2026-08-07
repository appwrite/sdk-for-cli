package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/proxy"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewProxyCommand builds the `proxy` command tree.
func NewProxyCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "proxy",
		Short: "The Proxy Service allows you to configure actions for your domains beyond DNS configuration.",
	}

	cmd.AddCommand(newProxyCreateInvalidationCommand())
	cmd.AddCommand(newProxyListRulesCommand())
	cmd.AddCommand(newProxyCreateAPIRuleCommand())
	cmd.AddCommand(newProxyCreateFunctionRuleCommand())
	cmd.AddCommand(newProxyCreateRedirectRuleCommand())
	cmd.AddCommand(newProxyCreateSiteRuleCommand())
	cmd.AddCommand(newProxyGetRuleCommand())
	cmd.AddCommand(newProxyDeleteRuleCommand())
	cmd.AddCommand(newProxyUpdateRuleStatusCommand())

	return cmd
}

func newProxyCreateInvalidationCommand() *cobra.Command {
	var domain string
	var typeArg string
	var reference string

	cmd := &cobra.Command{
		Use:   "create-invalidation",
		Short: "Create a new CDN cache invalidation for a domain. Executes a hard purge of cached content.\n\nDepending on type, the invalidation purges a single cache tag, a single URL path, or all cached content for the domain.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := proxy.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []proxy.CreateInvalidationOption{}
			if cmd.Flags().Changed("reference") {
				options = append(options, service.WithCreateInvalidationReference(reference))
			}

			result, err := service.CreateInvalidation(domain, typeArg, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domain, "domain", "", "Domain name.")
	_ = cmd.MarkFlagRequired("domain")
	cmd.Flags().StringVar(&typeArg, "type", "", "Type of reference passed. Allowed values are: tag, path, all")
	_ = cmd.MarkFlagRequired("type")
	cmd.Flags().StringVar(&reference, "reference", "", "Reference to invalidate. Depending on type this can be: cache tag name (up to 128 characters), URL path (up to 2048 characters). Not required when type is all.")
	return cmd
}

func newProxyListRulesCommand() *cobra.Command {
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
		Use:   "list-rules",
		Short: "Get a list of all the proxy rules. You can use the query params to filter your results.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := proxy.New(client)

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
			options := []proxy.ListRulesOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListRulesQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListRulesTotal(total))
			}

			result, err := service.ListRules(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: domain, type, trigger, deploymentResourceType, deploymentResourceId, deploymentId, deploymentVcsProviderBranch")
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

func newProxyCreateAPIRuleCommand() *cobra.Command {
	var domain string

	cmd := &cobra.Command{
		Use:   "create-api-rule",
		Short: "Create a new proxy rule for serving Appwrite's API on custom domain.\n\nRule ID is automatically generated as MD5 hash of a rule domain for performance purposes.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := proxy.New(client)

			result, err := service.CreateAPIRule(domain)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domain, "domain", "", "Domain name.")
	_ = cmd.MarkFlagRequired("domain")
	return cmd
}

func newProxyCreateFunctionRuleCommand() *cobra.Command {
	var domain string
	var functionId string
	var branch string

	cmd := &cobra.Command{
		Use:   "create-function-rule",
		Short: "Create a new proxy rule for executing Appwrite Function on custom domain.\n\nRule ID is automatically generated as MD5 hash of a rule domain for performance purposes.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := proxy.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []proxy.CreateFunctionRuleOption{}
			if cmd.Flags().Changed("branch") {
				options = append(options, service.WithCreateFunctionRuleBranch(branch))
			}

			result, err := service.CreateFunctionRule(domain, functionId, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domain, "domain", "", "Domain name.")
	_ = cmd.MarkFlagRequired("domain")
	cmd.Flags().StringVar(&functionId, "function-id", "", "ID of function to be executed.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&branch, "branch", "", "Name of VCS branch to deploy changes automatically")
	return cmd
}

func newProxyCreateRedirectRuleCommand() *cobra.Command {
	var domain string
	var url string
	var statusCode string
	var resourceId string
	var resourceType string

	cmd := &cobra.Command{
		Use:   "create-redirect-rule",
		Short: "Create a new proxy rule for to redirect from custom domain to another domain.\n\nRule ID is automatically generated as MD5 hash of a rule domain for performance purposes.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := proxy.New(client)

			result, err := service.CreateRedirectRule(domain, url, statusCode, resourceId, resourceType)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domain, "domain", "", "Domain name.")
	_ = cmd.MarkFlagRequired("domain")
	cmd.Flags().StringVar(&url, "url", "", "Target URL of redirection")
	_ = cmd.MarkFlagRequired("url")
	cmd.Flags().StringVar(&statusCode, "status-code", "", "Status code of redirection")
	_ = cmd.MarkFlagRequired("status-code")
	cmd.Flags().StringVar(&resourceId, "resource-id", "", "ID of parent resource.")
	_ = cmd.MarkFlagRequired("resource-id")
	cmd.Flags().StringVar(&resourceType, "resource-type", "", "Type of parent resource.")
	_ = cmd.MarkFlagRequired("resource-type")
	return cmd
}

func newProxyCreateSiteRuleCommand() *cobra.Command {
	var domain string
	var siteId string
	var branch string

	cmd := &cobra.Command{
		Use:   "create-site-rule",
		Short: "Create a new proxy rule for serving Appwrite Site on custom domain.\n\nRule ID is automatically generated as MD5 hash of a rule domain for performance purposes.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := proxy.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []proxy.CreateSiteRuleOption{}
			if cmd.Flags().Changed("branch") {
				options = append(options, service.WithCreateSiteRuleBranch(branch))
			}

			result, err := service.CreateSiteRule(domain, siteId, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&domain, "domain", "", "Domain name.")
	_ = cmd.MarkFlagRequired("domain")
	cmd.Flags().StringVar(&siteId, "site-id", "", "ID of site to be executed.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&branch, "branch", "", "Name of VCS branch to deploy changes automatically")
	return cmd
}

func newProxyGetRuleCommand() *cobra.Command {
	var ruleId string

	cmd := &cobra.Command{
		Use:   "get-rule",
		Short: "Get a proxy rule by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := proxy.New(client)

			result, err := service.GetRule(ruleId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&ruleId, "rule-id", "", "Rule ID.")
	_ = cmd.MarkFlagRequired("rule-id")
	return cmd
}

func newProxyDeleteRuleCommand() *cobra.Command {
	var ruleId string

	cmd := &cobra.Command{
		Use:   "delete-rule",
		Short: "Delete a proxy rule by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := proxy.New(client)

			result, err := service.DeleteRule(ruleId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&ruleId, "rule-id", "", "Rule ID.")
	_ = cmd.MarkFlagRequired("rule-id")
	return cmd
}

func newProxyUpdateRuleStatusCommand() *cobra.Command {
	var ruleId string

	cmd := &cobra.Command{
		Use:   "update-rule-status",
		Short: "If not succeeded yet, retry verification process of a proxy rule domain. This endpoint triggers domain verification by checking DNS records. If verification is successful, a TLS certificate will be automatically provisioned for the domain asynchronously in the background.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := proxy.New(client)

			result, err := service.UpdateRuleStatus(ruleId)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&ruleId, "rule-id", "", "Rule ID.")
	_ = cmd.MarkFlagRequired("rule-id")
	return cmd
}
