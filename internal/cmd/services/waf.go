package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v7/waf"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewWafCommand builds the `waf` command tree.
func NewWafCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "waf",
		Short: "",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			return cmd.Help()
		},
	}

	cmd.AddCommand(newWafListRulesCommand())
	cmd.AddCommand(newWafCreateBypassRuleCommand())
	cmd.AddCommand(newWafUpdateBypassRuleCommand())
	cmd.AddCommand(newWafCreateChallengeRuleCommand())
	cmd.AddCommand(newWafUpdateChallengeRuleCommand())
	cmd.AddCommand(newWafCreateDenyRuleCommand())
	cmd.AddCommand(newWafUpdateDenyRuleCommand())
	cmd.AddCommand(newWafCreateRateLimitRuleCommand())
	cmd.AddCommand(newWafUpdateRateLimitRuleCommand())
	cmd.AddCommand(newWafCreateRedirectRuleCommand())
	cmd.AddCommand(newWafUpdateRedirectRuleCommand())
	cmd.AddCommand(newWafGetRuleCommand())
	cmd.AddCommand(newWafDeleteRuleCommand())

	return cmd
}

func newWafListRulesCommand() *cobra.Command {
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
		Use:   "list-rules",
		Short: "List WAF rules for the current project.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := waf.New(client)

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
			options := []waf.ListRulesOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListRulesQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListRulesSearch(search))
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

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.")
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

func newWafCreateBypassRuleCommand() *cobra.Command {
	var ruleId string
	var resourceType string
	var name string
	var resourceId string
	var description string
	var priority int
	var enabled bool
	var conditions []string

	cmd := &cobra.Command{
		Use:   "create-bypass-rule",
		Short: "Create a bypass WAF rule. Conditions can match request attributes including `ip` (plain IPs or CIDR blocks like `10.0.0.0/8`), `method`, `path`, `host`, `country`, `continent`, `headers.<name>`, `query.<key>`, `queryKeys`, `userAgent`, `os`, `osVersion`, `browser`, and `browserVersion`. Conditions on `city` and `state` require the premium Geo DB addon.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := waf.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []waf.CreateBypassRuleOption{}
			if cmd.Flags().Changed("resource-id") {
				options = append(options, service.WithCreateBypassRuleResourceId(resourceId))
			}
			if cmd.Flags().Changed("description") {
				options = append(options, service.WithCreateBypassRuleDescription(description))
			}
			if cmd.Flags().Changed("priority") {
				options = append(options, service.WithCreateBypassRulePriority(priority))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateBypassRuleEnabled(enabled))
			}
			if cmd.Flags().Changed("conditions") {
				options = append(options, service.WithCreateBypassRuleConditions(conditions))
			}

			result, err := service.CreateBypassRule(ruleId, resourceType, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&ruleId, "rule-id", "", "Rule ID. Choose a custom ID or pass `ID.unique()` to generate a unique one.")
	_ = cmd.MarkFlagRequired("rule-id")
	cmd.Flags().StringVar(&resourceType, "resource-type", "", "Resource type the rule applies to.")
	_ = cmd.MarkFlagRequired("resource-type")
	cmd.Flags().StringVar(&name, "name", "", "Rule name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&resourceId, "resource-id", "", "Resource identifier. Leave empty for the API resource type.")
	cmd.Flags().StringVar(&description, "description", "", "Optional description for the rule.")
	cmd.Flags().IntVar(&priority, "priority", 0, "Evaluation priority. Lower numbers run earlier.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set to false to create the rule in a disabled state.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&conditions, "conditions", nil, "Array of condition strings generated using the WAF Condition builder. Maximum of 100 conditions are allowed, each 4096 characters long.")
	return cmd
}

func newWafUpdateBypassRuleCommand() *cobra.Command {
	var ruleId string
	var resourceType string
	var resourceId string
	var name string
	var description string
	var priority int
	var enabled bool
	var conditions []string

	cmd := &cobra.Command{
		Use:   "update-bypass-rule",
		Short: "Update a bypass WAF rule. Conditions can match request attributes including `ip` (plain IPs or CIDR blocks like `10.0.0.0/8`), `method`, `path`, `host`, `country`, `continent`, `headers.<name>`, `query.<key>`, `queryKeys`, `userAgent`, `os`, `osVersion`, `browser`, and `browserVersion`. Conditions on `city` and `state` require the premium Geo DB addon.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := waf.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []waf.UpdateBypassRuleOption{}
			if cmd.Flags().Changed("resource-type") {
				options = append(options, service.WithUpdateBypassRuleResourceType(resourceType))
			}
			if cmd.Flags().Changed("resource-id") {
				options = append(options, service.WithUpdateBypassRuleResourceId(resourceId))
			}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateBypassRuleName(name))
			}
			if cmd.Flags().Changed("description") {
				options = append(options, service.WithUpdateBypassRuleDescription(description))
			}
			if cmd.Flags().Changed("priority") {
				options = append(options, service.WithUpdateBypassRulePriority(priority))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateBypassRuleEnabled(enabled))
			}
			if cmd.Flags().Changed("conditions") {
				options = append(options, service.WithUpdateBypassRuleConditions(conditions))
			}

			result, err := service.UpdateBypassRule(ruleId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&ruleId, "rule-id", "", "Rule ID.")
	_ = cmd.MarkFlagRequired("rule-id")
	cmd.Flags().StringVar(&resourceType, "resource-type", "", "Resource type the rule applies to.")
	cmd.Flags().StringVar(&resourceId, "resource-id", "", "Resource identifier. Required for functions and sites.")
	cmd.Flags().StringVar(&name, "name", "", "Rule name.")
	cmd.Flags().StringVar(&description, "description", "", "Optional description for the rule.")
	cmd.Flags().IntVar(&priority, "priority", 0, "Evaluation priority. Lower numbers run earlier.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set to false to disable the rule.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&conditions, "conditions", nil, "Array of condition strings generated using the WAF Condition builder. Maximum of 100 conditions are allowed, each 4096 characters long.")
	return cmd
}

func newWafCreateChallengeRuleCommand() *cobra.Command {
	var ruleId string
	var resourceType string
	var name string
	var resourceId string
	var description string
	var challengeType string
	var priority int
	var enabled bool
	var conditions []string
	var difficulty int
	var ttl int

	cmd := &cobra.Command{
		Use:   "create-challenge-rule",
		Short: "Create a challenge WAF rule. Use `difficulty` (1 easiest to 5 hardest) to tune the client-side proof-of-work cost, and `ttl` to control how long, in seconds, a visitor stays cleared after passing the challenge before being challenged again. Conditions can match request attributes including `ip` (plain IPs or CIDR blocks like `10.0.0.0/8`), `method`, `path`, `host`, `country`, `continent`, `headers.<name>`, `query.<key>`, `queryKeys`, `userAgent`, `os`, `osVersion`, `browser`, and `browserVersion`. Conditions on `city` and `state` require the premium Geo DB addon.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := waf.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []waf.CreateChallengeRuleOption{}
			if cmd.Flags().Changed("resource-id") {
				options = append(options, service.WithCreateChallengeRuleResourceId(resourceId))
			}
			if cmd.Flags().Changed("description") {
				options = append(options, service.WithCreateChallengeRuleDescription(description))
			}
			if cmd.Flags().Changed("challenge-type") {
				options = append(options, service.WithCreateChallengeRuleChallengeType(challengeType))
			}
			if cmd.Flags().Changed("priority") {
				options = append(options, service.WithCreateChallengeRulePriority(priority))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateChallengeRuleEnabled(enabled))
			}
			if cmd.Flags().Changed("conditions") {
				options = append(options, service.WithCreateChallengeRuleConditions(conditions))
			}
			if cmd.Flags().Changed("difficulty") {
				options = append(options, service.WithCreateChallengeRuleDifficulty(difficulty))
			}
			if cmd.Flags().Changed("ttl") {
				options = append(options, service.WithCreateChallengeRuleTtl(ttl))
			}

			result, err := service.CreateChallengeRule(ruleId, resourceType, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&ruleId, "rule-id", "", "Rule ID. Choose a custom ID or pass `ID.unique()` to generate a unique one.")
	_ = cmd.MarkFlagRequired("rule-id")
	cmd.Flags().StringVar(&resourceType, "resource-type", "", "Resource type the rule applies to.")
	_ = cmd.MarkFlagRequired("resource-type")
	cmd.Flags().StringVar(&name, "name", "", "Rule name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&resourceId, "resource-id", "", "Resource identifier. Required for functions and sites.")
	cmd.Flags().StringVar(&description, "description", "", "Optional description for the rule.")
	cmd.Flags().StringVar(&challengeType, "challenge-type", "", "Challenge type enforced by the rule.")
	cmd.Flags().IntVar(&priority, "priority", 0, "Evaluation priority. Lower numbers run earlier.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set to false to create the rule in a disabled state.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&conditions, "conditions", nil, "Array of condition strings generated using the WAF Condition builder. Maximum of 100 conditions are allowed, each 4096 characters long.")
	cmd.Flags().IntVar(&difficulty, "difficulty", 0, "Challenge difficulty from 1 (easiest) to 5 (hardest). Higher values demand more client-side proof-of-work.")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "How long, in seconds, a visitor stays cleared after passing the challenge before being challenged again.")
	return cmd
}

func newWafUpdateChallengeRuleCommand() *cobra.Command {
	var ruleId string
	var resourceType string
	var resourceId string
	var name string
	var description string
	var challengeType string
	var priority int
	var enabled bool
	var conditions []string
	var difficulty int
	var ttl int

	cmd := &cobra.Command{
		Use:   "update-challenge-rule",
		Short: "Update a challenge WAF rule. Use `difficulty` (1 easiest to 5 hardest) to tune the client-side proof-of-work cost, and `ttl` to control how long, in seconds, a visitor stays cleared after passing the challenge before being challenged again. Conditions can match request attributes including `ip` (plain IPs or CIDR blocks like `10.0.0.0/8`), `method`, `path`, `host`, `country`, `continent`, `headers.<name>`, `query.<key>`, `queryKeys`, `userAgent`, `os`, `osVersion`, `browser`, and `browserVersion`. Conditions on `city` and `state` require the premium Geo DB addon.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := waf.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []waf.UpdateChallengeRuleOption{}
			if cmd.Flags().Changed("resource-type") {
				options = append(options, service.WithUpdateChallengeRuleResourceType(resourceType))
			}
			if cmd.Flags().Changed("resource-id") {
				options = append(options, service.WithUpdateChallengeRuleResourceId(resourceId))
			}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateChallengeRuleName(name))
			}
			if cmd.Flags().Changed("description") {
				options = append(options, service.WithUpdateChallengeRuleDescription(description))
			}
			if cmd.Flags().Changed("challenge-type") {
				options = append(options, service.WithUpdateChallengeRuleChallengeType(challengeType))
			}
			if cmd.Flags().Changed("priority") {
				options = append(options, service.WithUpdateChallengeRulePriority(priority))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateChallengeRuleEnabled(enabled))
			}
			if cmd.Flags().Changed("conditions") {
				options = append(options, service.WithUpdateChallengeRuleConditions(conditions))
			}
			if cmd.Flags().Changed("difficulty") {
				options = append(options, service.WithUpdateChallengeRuleDifficulty(difficulty))
			}
			if cmd.Flags().Changed("ttl") {
				options = append(options, service.WithUpdateChallengeRuleTtl(ttl))
			}

			result, err := service.UpdateChallengeRule(ruleId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&ruleId, "rule-id", "", "Rule ID.")
	_ = cmd.MarkFlagRequired("rule-id")
	cmd.Flags().StringVar(&resourceType, "resource-type", "", "Resource type the rule applies to.")
	cmd.Flags().StringVar(&resourceId, "resource-id", "", "Resource identifier. Required for functions and sites.")
	cmd.Flags().StringVar(&name, "name", "", "Rule name.")
	cmd.Flags().StringVar(&description, "description", "", "Optional description for the rule.")
	cmd.Flags().StringVar(&challengeType, "challenge-type", "", "Challenge type enforced by the rule.")
	cmd.Flags().IntVar(&priority, "priority", 0, "Evaluation priority. Lower numbers run earlier.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set to false to disable the rule.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&conditions, "conditions", nil, "Array of condition strings generated using the WAF Condition builder. Maximum of 100 conditions are allowed, each 4096 characters long.")
	cmd.Flags().IntVar(&difficulty, "difficulty", 0, "Challenge difficulty from 1 (easiest) to 5 (hardest). Higher values demand more client-side proof-of-work.")
	cmd.Flags().IntVar(&ttl, "ttl", 0, "How long, in seconds, a visitor stays cleared after passing the challenge before being challenged again.")
	return cmd
}

func newWafCreateDenyRuleCommand() *cobra.Command {
	var ruleId string
	var resourceType string
	var name string
	var resourceId string
	var description string
	var priority int
	var enabled bool
	var conditions []string

	cmd := &cobra.Command{
		Use:   "create-deny-rule",
		Short: "Create a deny WAF rule. Conditions can match request attributes including `ip` (plain IPs or CIDR blocks like `10.0.0.0/8`), `method`, `path`, `host`, `country`, `continent`, `headers.<name>`, `query.<key>`, `queryKeys`, `userAgent`, `os`, `osVersion`, `browser`, and `browserVersion`. Conditions on `city` and `state` require the premium Geo DB addon.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := waf.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []waf.CreateDenyRuleOption{}
			if cmd.Flags().Changed("resource-id") {
				options = append(options, service.WithCreateDenyRuleResourceId(resourceId))
			}
			if cmd.Flags().Changed("description") {
				options = append(options, service.WithCreateDenyRuleDescription(description))
			}
			if cmd.Flags().Changed("priority") {
				options = append(options, service.WithCreateDenyRulePriority(priority))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateDenyRuleEnabled(enabled))
			}
			if cmd.Flags().Changed("conditions") {
				options = append(options, service.WithCreateDenyRuleConditions(conditions))
			}

			result, err := service.CreateDenyRule(ruleId, resourceType, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&ruleId, "rule-id", "", "Rule ID. Choose a custom ID or pass `ID.unique()` to generate a unique one.")
	_ = cmd.MarkFlagRequired("rule-id")
	cmd.Flags().StringVar(&resourceType, "resource-type", "", "Resource type the rule applies to.")
	_ = cmd.MarkFlagRequired("resource-type")
	cmd.Flags().StringVar(&name, "name", "", "Rule name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&resourceId, "resource-id", "", "Resource identifier. Required for functions and sites.")
	cmd.Flags().StringVar(&description, "description", "", "Optional description for the rule.")
	cmd.Flags().IntVar(&priority, "priority", 0, "Evaluation priority. Lower numbers run earlier.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set to false to create the rule in a disabled state.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&conditions, "conditions", nil, "Array of condition strings generated using the WAF Condition builder. Maximum of 100 conditions are allowed, each 4096 characters long.")
	return cmd
}

func newWafUpdateDenyRuleCommand() *cobra.Command {
	var ruleId string
	var resourceType string
	var resourceId string
	var name string
	var description string
	var priority int
	var enabled bool
	var conditions []string

	cmd := &cobra.Command{
		Use:   "update-deny-rule",
		Short: "Update a deny WAF rule. Conditions can match request attributes including `ip` (plain IPs or CIDR blocks like `10.0.0.0/8`), `method`, `path`, `host`, `country`, `continent`, `headers.<name>`, `query.<key>`, `queryKeys`, `userAgent`, `os`, `osVersion`, `browser`, and `browserVersion`. Conditions on `city` and `state` require the premium Geo DB addon.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := waf.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []waf.UpdateDenyRuleOption{}
			if cmd.Flags().Changed("resource-type") {
				options = append(options, service.WithUpdateDenyRuleResourceType(resourceType))
			}
			if cmd.Flags().Changed("resource-id") {
				options = append(options, service.WithUpdateDenyRuleResourceId(resourceId))
			}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateDenyRuleName(name))
			}
			if cmd.Flags().Changed("description") {
				options = append(options, service.WithUpdateDenyRuleDescription(description))
			}
			if cmd.Flags().Changed("priority") {
				options = append(options, service.WithUpdateDenyRulePriority(priority))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateDenyRuleEnabled(enabled))
			}
			if cmd.Flags().Changed("conditions") {
				options = append(options, service.WithUpdateDenyRuleConditions(conditions))
			}

			result, err := service.UpdateDenyRule(ruleId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&ruleId, "rule-id", "", "Rule ID.")
	_ = cmd.MarkFlagRequired("rule-id")
	cmd.Flags().StringVar(&resourceType, "resource-type", "", "Resource type the rule applies to.")
	cmd.Flags().StringVar(&resourceId, "resource-id", "", "Resource identifier. Required for functions and sites.")
	cmd.Flags().StringVar(&name, "name", "", "Rule name.")
	cmd.Flags().StringVar(&description, "description", "", "Optional description for the rule.")
	cmd.Flags().IntVar(&priority, "priority", 0, "Evaluation priority. Lower numbers run earlier.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set to false to disable the rule.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&conditions, "conditions", nil, "Array of condition strings generated using the WAF Condition builder. Maximum of 100 conditions are allowed, each 4096 characters long.")
	return cmd
}

func newWafCreateRateLimitRuleCommand() *cobra.Command {
	var ruleId string
	var resourceType string
	var name string
	var limit int
	var interval int
	var resourceId string
	var description string
	var key string
	var strategy string
	var maxBucketSize int
	var priority int
	var enabled bool
	var conditions []string

	cmd := &cobra.Command{
		Use:   "create-rate-limit-rule",
		Short: "Create a rate limit WAF rule. Use `key` to choose the counter: `ip` limits per client IP, while `userId` limits per authenticated user (requests without an authenticated user skip `userId` rules). Conditions can match request attributes including `ip` (plain IPs or CIDR blocks like `10.0.0.0/8`), `method`, `path`, `host`, `country`, `continent`, `headers.<name>`, `query.<key>`, `queryKeys`, `userAgent`, `os`, `osVersion`, `browser`, and `browserVersion`. Conditions on `city` and `state` require the premium Geo DB addon.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := waf.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []waf.CreateRateLimitRuleOption{}
			if cmd.Flags().Changed("resource-id") {
				options = append(options, service.WithCreateRateLimitRuleResourceId(resourceId))
			}
			if cmd.Flags().Changed("description") {
				options = append(options, service.WithCreateRateLimitRuleDescription(description))
			}
			if cmd.Flags().Changed("key") {
				options = append(options, service.WithCreateRateLimitRuleKey(key))
			}
			if cmd.Flags().Changed("strategy") {
				options = append(options, service.WithCreateRateLimitRuleStrategy(strategy))
			}
			if cmd.Flags().Changed("max-bucket-size") {
				options = append(options, service.WithCreateRateLimitRuleMaxBucketSize(maxBucketSize))
			}
			if cmd.Flags().Changed("priority") {
				options = append(options, service.WithCreateRateLimitRulePriority(priority))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateRateLimitRuleEnabled(enabled))
			}
			if cmd.Flags().Changed("conditions") {
				options = append(options, service.WithCreateRateLimitRuleConditions(conditions))
			}

			result, err := service.CreateRateLimitRule(ruleId, resourceType, name, limit, interval, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&ruleId, "rule-id", "", "Rule ID. Choose a custom ID or pass `ID.unique()` to generate a unique one.")
	_ = cmd.MarkFlagRequired("rule-id")
	cmd.Flags().StringVar(&resourceType, "resource-type", "", "Resource type the rule applies to.")
	_ = cmd.MarkFlagRequired("resource-type")
	cmd.Flags().StringVar(&name, "name", "", "Rule name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().IntVar(&limit, "limit", 0, "Maximum number of matching requests allowed in the configured interval.")
	_ = cmd.MarkFlagRequired("limit")
	cmd.Flags().IntVar(&interval, "interval", 0, "Interval in seconds used for rate limiting.")
	_ = cmd.MarkFlagRequired("interval")
	cmd.Flags().StringVar(&resourceId, "resource-id", "", "Resource identifier. Required for functions and sites.")
	cmd.Flags().StringVar(&description, "description", "", "Optional description for the rule.")
	cmd.Flags().StringVar(&key, "key", "", "Rate limit key. Use `ip` to limit per client IP or `userId` to limit per authenticated user. Requests without an authenticated user skip `userId` rules.")
	cmd.Flags().StringVar(&strategy, "strategy", "", "Rate limit strategy. `fixedWindow` counts requests in discrete intervals, `slidingWindow` weights the previous interval for smoother limiting, and `tokenBucket` refills allowance continuously to permit short bursts.")
	cmd.Flags().IntVar(&maxBucketSize, "max-bucket-size", 0, "Maximum number of tokens the bucket can hold for the `tokenBucket` strategy, controlling how large a burst is allowed. The sustained refill rate is `limit / interval`. Defaults to `limit` when omitted. Ignored by other strategies.")
	cmd.Flags().IntVar(&priority, "priority", 0, "Evaluation priority. Lower numbers run earlier.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set to false to create the rule in a disabled state.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&conditions, "conditions", nil, "Array of condition strings generated using the WAF Condition builder. Maximum of 100 conditions are allowed, each 4096 characters long.")
	return cmd
}

func newWafUpdateRateLimitRuleCommand() *cobra.Command {
	var ruleId string
	var resourceType string
	var resourceId string
	var name string
	var description string
	var limit int
	var interval int
	var key string
	var maxBucketSize int
	var priority int
	var enabled bool
	var conditions []string

	cmd := &cobra.Command{
		Use:   "update-rate-limit-rule",
		Short: "Update a rate limit WAF rule. Use `key` to choose the counter: `ip` limits per client IP, while `userId` limits per authenticated user (requests without an authenticated user skip `userId` rules). Conditions can match request attributes including `ip` (plain IPs or CIDR blocks like `10.0.0.0/8`), `method`, `path`, `host`, `country`, `continent`, `headers.<name>`, `query.<key>`, `queryKeys`, `userAgent`, `os`, `osVersion`, `browser`, and `browserVersion`. Conditions on `city` and `state` require the premium Geo DB addon.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := waf.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []waf.UpdateRateLimitRuleOption{}
			if cmd.Flags().Changed("resource-type") {
				options = append(options, service.WithUpdateRateLimitRuleResourceType(resourceType))
			}
			if cmd.Flags().Changed("resource-id") {
				options = append(options, service.WithUpdateRateLimitRuleResourceId(resourceId))
			}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateRateLimitRuleName(name))
			}
			if cmd.Flags().Changed("description") {
				options = append(options, service.WithUpdateRateLimitRuleDescription(description))
			}
			if cmd.Flags().Changed("limit") {
				options = append(options, service.WithUpdateRateLimitRuleLimit(limit))
			}
			if cmd.Flags().Changed("interval") {
				options = append(options, service.WithUpdateRateLimitRuleInterval(interval))
			}
			if cmd.Flags().Changed("key") {
				options = append(options, service.WithUpdateRateLimitRuleKey(key))
			}
			if cmd.Flags().Changed("max-bucket-size") {
				options = append(options, service.WithUpdateRateLimitRuleMaxBucketSize(maxBucketSize))
			}
			if cmd.Flags().Changed("priority") {
				options = append(options, service.WithUpdateRateLimitRulePriority(priority))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateRateLimitRuleEnabled(enabled))
			}
			if cmd.Flags().Changed("conditions") {
				options = append(options, service.WithUpdateRateLimitRuleConditions(conditions))
			}

			result, err := service.UpdateRateLimitRule(ruleId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&ruleId, "rule-id", "", "Rule ID.")
	_ = cmd.MarkFlagRequired("rule-id")
	cmd.Flags().StringVar(&resourceType, "resource-type", "", "Resource type the rule applies to.")
	cmd.Flags().StringVar(&resourceId, "resource-id", "", "Resource identifier. Required for functions and sites.")
	cmd.Flags().StringVar(&name, "name", "", "Rule name.")
	cmd.Flags().StringVar(&description, "description", "", "Optional description for the rule.")
	cmd.Flags().IntVar(&limit, "limit", 0, "Maximum number of matching requests allowed in the configured interval.")
	cmd.Flags().IntVar(&interval, "interval", 0, "Interval in seconds used for rate limiting.")
	cmd.Flags().StringVar(&key, "key", "", "Rate limit key. Use `ip` to limit per client IP or `userId` to limit per authenticated user. Requests without an authenticated user skip `userId` rules.")
	cmd.Flags().IntVar(&maxBucketSize, "max-bucket-size", 0, "Maximum number of tokens the bucket can hold for the `tokenBucket` strategy, controlling how large a burst is allowed. The sustained refill rate is `limit / interval`. Ignored by other strategies. The strategy itself cannot be changed after creation.")
	cmd.Flags().IntVar(&priority, "priority", 0, "Evaluation priority. Lower numbers run earlier.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set to false to disable the rule.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&conditions, "conditions", nil, "Array of condition strings generated using the WAF Condition builder. Maximum of 100 conditions are allowed, each 4096 characters long.")
	return cmd
}

func newWafCreateRedirectRuleCommand() *cobra.Command {
	var ruleId string
	var resourceType string
	var name string
	var location string
	var statusCode int
	var resourceId string
	var description string
	var priority int
	var enabled bool
	var conditions []string

	cmd := &cobra.Command{
		Use:   "create-redirect-rule",
		Short: "Create a redirect WAF rule. Conditions can match request attributes including `ip` (plain IPs or CIDR blocks like `10.0.0.0/8`), `method`, `path`, `host`, `country`, `continent`, `headers.<name>`, `query.<key>`, `queryKeys`, `userAgent`, `os`, `osVersion`, `browser`, and `browserVersion`. Conditions on `city` and `state` require the premium Geo DB addon.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := waf.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []waf.CreateRedirectRuleOption{}
			if cmd.Flags().Changed("resource-id") {
				options = append(options, service.WithCreateRedirectRuleResourceId(resourceId))
			}
			if cmd.Flags().Changed("description") {
				options = append(options, service.WithCreateRedirectRuleDescription(description))
			}
			if cmd.Flags().Changed("priority") {
				options = append(options, service.WithCreateRedirectRulePriority(priority))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateRedirectRuleEnabled(enabled))
			}
			if cmd.Flags().Changed("conditions") {
				options = append(options, service.WithCreateRedirectRuleConditions(conditions))
			}

			result, err := service.CreateRedirectRule(ruleId, resourceType, name, location, statusCode, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&ruleId, "rule-id", "", "Rule ID. Choose a custom ID or pass `ID.unique()` to generate a unique one.")
	_ = cmd.MarkFlagRequired("rule-id")
	cmd.Flags().StringVar(&resourceType, "resource-type", "", "Resource type the rule applies to.")
	_ = cmd.MarkFlagRequired("resource-type")
	cmd.Flags().StringVar(&name, "name", "", "Rule name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&location, "location", "", "Location used for redirect responses.")
	_ = cmd.MarkFlagRequired("location")
	cmd.Flags().IntVar(&statusCode, "status-code", 0, "Integer status code used for redirect responses.")
	_ = cmd.MarkFlagRequired("status-code")
	cmd.Flags().StringVar(&resourceId, "resource-id", "", "Resource identifier. Required for functions and sites.")
	cmd.Flags().StringVar(&description, "description", "", "Optional description for the rule.")
	cmd.Flags().IntVar(&priority, "priority", 0, "Evaluation priority. Lower numbers run earlier.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set to false to create the rule in a disabled state.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&conditions, "conditions", nil, "Array of condition strings generated using the WAF Condition builder. Maximum of 100 conditions are allowed, each 4096 characters long.")
	return cmd
}

func newWafUpdateRedirectRuleCommand() *cobra.Command {
	var ruleId string
	var resourceType string
	var resourceId string
	var name string
	var description string
	var location string
	var statusCode int
	var priority int
	var enabled bool
	var conditions []string

	cmd := &cobra.Command{
		Use:   "update-redirect-rule",
		Short: "Update a redirect WAF rule. Conditions can match request attributes including `ip` (plain IPs or CIDR blocks like `10.0.0.0/8`), `method`, `path`, `host`, `country`, `continent`, `headers.<name>`, `query.<key>`, `queryKeys`, `userAgent`, `os`, `osVersion`, `browser`, and `browserVersion`. Conditions on `city` and `state` require the premium Geo DB addon.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := waf.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []waf.UpdateRedirectRuleOption{}
			if cmd.Flags().Changed("resource-type") {
				options = append(options, service.WithUpdateRedirectRuleResourceType(resourceType))
			}
			if cmd.Flags().Changed("resource-id") {
				options = append(options, service.WithUpdateRedirectRuleResourceId(resourceId))
			}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateRedirectRuleName(name))
			}
			if cmd.Flags().Changed("description") {
				options = append(options, service.WithUpdateRedirectRuleDescription(description))
			}
			if cmd.Flags().Changed("location") {
				options = append(options, service.WithUpdateRedirectRuleLocation(location))
			}
			if cmd.Flags().Changed("status-code") {
				options = append(options, service.WithUpdateRedirectRuleStatusCode(statusCode))
			}
			if cmd.Flags().Changed("priority") {
				options = append(options, service.WithUpdateRedirectRulePriority(priority))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateRedirectRuleEnabled(enabled))
			}
			if cmd.Flags().Changed("conditions") {
				options = append(options, service.WithUpdateRedirectRuleConditions(conditions))
			}

			result, err := service.UpdateRedirectRule(ruleId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&ruleId, "rule-id", "", "Rule ID.")
	_ = cmd.MarkFlagRequired("rule-id")
	cmd.Flags().StringVar(&resourceType, "resource-type", "", "Resource type the rule applies to.")
	cmd.Flags().StringVar(&resourceId, "resource-id", "", "Resource identifier. Required for functions and sites.")
	cmd.Flags().StringVar(&name, "name", "", "Rule name.")
	cmd.Flags().StringVar(&description, "description", "", "Optional description for the rule.")
	cmd.Flags().StringVar(&location, "location", "", "Location used for redirect responses.")
	cmd.Flags().IntVar(&statusCode, "status-code", 0, "Integer status code used for redirect responses.")
	cmd.Flags().IntVar(&priority, "priority", 0, "Evaluation priority. Lower numbers run earlier.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set to false to disable the rule.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&conditions, "conditions", nil, "Array of condition strings generated using the WAF Condition builder. Maximum of 100 conditions are allowed, each 4096 characters long.")
	return cmd
}

func newWafGetRuleCommand() *cobra.Command {
	var ruleId string

	cmd := &cobra.Command{
		Use:   "get-rule",
		Short: "Get a WAF rule by its ID.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := waf.New(client)

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

func newWafDeleteRuleCommand() *cobra.Command {
	var ruleId string

	cmd := &cobra.Command{
		Use:   "delete-rule",
		Short: "Delete a WAF rule.\n",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := waf.New(client)

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
