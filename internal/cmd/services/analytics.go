package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v7/analytics"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewAnalyticsCommand builds the `analytics` command tree.
func NewAnalyticsCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "analytics",
		Short: "",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			return cmd.Help()
		},
	}

	cmd.AddCommand(newAnalyticsListPropertiesCommand())
	cmd.AddCommand(newAnalyticsCreatePropertyCommand())
	cmd.AddCommand(newAnalyticsGetPropertyCommand())
	cmd.AddCommand(newAnalyticsUpdatePropertyCommand())
	cmd.AddCommand(newAnalyticsDeletePropertyCommand())
	cmd.AddCommand(newAnalyticsCreateEventCommand())
	cmd.AddCommand(newAnalyticsListMetricsCommand())

	return cmd
}

func newAnalyticsListPropertiesCommand() *cobra.Command {
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
		Use:   "list-properties",
		Short: "List analytics properties for the current project.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := analytics.New(client)

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
			options := []analytics.ListPropertiesOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListPropertiesQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListPropertiesSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListPropertiesTotal(total))
			}

			result, err := service.ListProperties(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, domain, enabled, public")
	cmd.Flags().StringVar(&search, "search", "", "Search term to filter your list results. Matches the property ID, name and domain. Max length: 256 chars.")
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

func newAnalyticsCreatePropertyCommand() *cobra.Command {
	var propertyId string
	var name string
	var domain string
	var enabled bool
	var public bool
	var allowedOrigins []string

	cmd := &cobra.Command{
		Use:   "create-property",
		Short: "Create a new analytics property to track a website or application.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := analytics.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []analytics.CreatePropertyOption{}
			if cmd.Flags().Changed("domain") {
				options = append(options, service.WithCreatePropertyDomain(domain))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreatePropertyEnabled(enabled))
			}
			if cmd.Flags().Changed("public") {
				options = append(options, service.WithCreatePropertyPublic(public))
			}
			if cmd.Flags().Changed("allowed-origins") {
				options = append(options, service.WithCreatePropertyAllowedOrigins(allowedOrigins))
			}

			result, err := service.CreateProperty(propertyId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&propertyId, "property-id", "", "Unique ID. Choose a custom ID or generate a random ID with `ID.unique()`. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("property-id")
	cmd.Flags().StringVar(&name, "name", "", "Human-readable name for this property.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&domain, "domain", "", "Primary domain to track (e.g. example.com). Optional for native apps.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Whether tracking is enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&public, "public", false, "Whether stats are publicly viewable.")
	cmd.Flags().Lookup("public").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&allowedOrigins, "allowed-origins", nil, "Allowed origins for tracking. Use [\"*\"] to allow all.")
	return cmd
}

func newAnalyticsGetPropertyCommand() *cobra.Command {
	var propertyId string

	cmd := &cobra.Command{
		Use:   "get-property",
		Short: "Get an analytics property by ID.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := analytics.New(client)

			result, err := service.GetProperty(propertyId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&propertyId, "property-id", "", "Analytics property unique ID.")
	_ = cmd.MarkFlagRequired("property-id")
	return cmd
}

func newAnalyticsUpdatePropertyCommand() *cobra.Command {
	var propertyId string
	var name string
	var domain string
	var enabled bool
	var public bool
	var allowedOrigins []string

	cmd := &cobra.Command{
		Use:   "update-property",
		Short: "Update an analytics property. Only the attributes you pass are changed; omitted attributes keep their current value.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := analytics.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []analytics.UpdatePropertyOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdatePropertyName(name))
			}
			if cmd.Flags().Changed("domain") {
				options = append(options, service.WithUpdatePropertyDomain(domain))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdatePropertyEnabled(enabled))
			}
			if cmd.Flags().Changed("public") {
				options = append(options, service.WithUpdatePropertyPublic(public))
			}
			if cmd.Flags().Changed("allowed-origins") {
				options = append(options, service.WithUpdatePropertyAllowedOrigins(allowedOrigins))
			}

			result, err := service.UpdateProperty(propertyId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&propertyId, "property-id", "", "Analytics property unique ID.")
	_ = cmd.MarkFlagRequired("property-id")
	cmd.Flags().StringVar(&name, "name", "", "Human-readable name for this property.")
	cmd.Flags().StringVar(&domain, "domain", "", "Primary domain to track (e.g. example.com). Pass an empty string to clear it.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Whether tracking is enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&public, "public", false, "Whether stats are publicly viewable.")
	cmd.Flags().Lookup("public").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&allowedOrigins, "allowed-origins", nil, "Allowed origins for tracking. Use [\"*\"] to allow all.")
	return cmd
}

func newAnalyticsDeletePropertyCommand() *cobra.Command {
	var propertyId string

	cmd := &cobra.Command{
		Use:   "delete-property",
		Short: "Delete an analytics property along with every event and session collected for it. This cannot be undone.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := analytics.New(client)

			result, err := service.DeleteProperty(propertyId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&propertyId, "property-id", "", "Analytics property unique ID.")
	_ = cmd.MarkFlagRequired("property-id")
	return cmd
}

func newAnalyticsCreateEventCommand() *cobra.Command {
	var propertyId string
	var name string
	var url string
	var domain string
	var referrer string
	var screenWidth int
	var sessionHash string
	var scrollDepth int
	var engagementTime int
	var props []string
	var userId string
	var ip string
	var userAgent string

	cmd := &cobra.Command{
		Use:   "create-event",
		Short: "Send a tracking event from a browser, native app, or server-side SDK.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := analytics.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []analytics.CreateEventOption{}
			if cmd.Flags().Changed("domain") {
				options = append(options, service.WithCreateEventDomain(domain))
			}
			if cmd.Flags().Changed("referrer") {
				options = append(options, service.WithCreateEventReferrer(referrer))
			}
			if cmd.Flags().Changed("screen-width") {
				options = append(options, service.WithCreateEventScreenWidth(screenWidth))
			}
			if cmd.Flags().Changed("session-hash") {
				options = append(options, service.WithCreateEventSessionHash(sessionHash))
			}
			if cmd.Flags().Changed("scroll-depth") {
				options = append(options, service.WithCreateEventScrollDepth(scrollDepth))
			}
			if cmd.Flags().Changed("engagement-time") {
				options = append(options, service.WithCreateEventEngagementTime(engagementTime))
			}
			if cmd.Flags().Changed("props") {
				options = append(options, service.WithCreateEventProps(props))
			}
			if cmd.Flags().Changed("user-id") {
				options = append(options, service.WithCreateEventUserId(userId))
			}
			if cmd.Flags().Changed("ip") {
				options = append(options, service.WithCreateEventIp(ip))
			}
			if cmd.Flags().Changed("user-agent") {
				options = append(options, service.WithCreateEventUserAgent(userAgent))
			}

			result, err := service.CreateEvent(propertyId, name, url, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&propertyId, "property-id", "", "Analytics property ID.")
	_ = cmd.MarkFlagRequired("property-id")
	cmd.Flags().StringVar(&name, "name", "", "Event name. \"pageview\" is just a conventional event name; events are not modeled specially.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&url, "url", "", "Full page URL or screen identifier.")
	_ = cmd.MarkFlagRequired("url")
	cmd.Flags().StringVar(&domain, "domain", "", "Hostname (e.g. example.com).")
	cmd.Flags().StringVar(&referrer, "referrer", "", "Referrer URL.")
	cmd.Flags().IntVar(&screenWidth, "screen-width", 0, "Viewport width in CSS pixels.")
	cmd.Flags().StringVar(&sessionHash, "session-hash", "", "Optional session hash (provided by SDK).")
	cmd.Flags().IntVar(&scrollDepth, "scroll-depth", 0, "Scroll depth percentage 0-100.")
	cmd.Flags().IntVar(&engagementTime, "engagement-time", 0, "Engagement time in seconds, 0-4294967295.")
	cmd.Flags().StringArrayVar(&props, "props", nil, "Custom string properties as a flat key=value list (max 32 entries, alternating key,value).")
	cmd.Flags().StringVar(&userId, "user-id", "", "Override user ID. Requires API-key auth with analytics.write scope.")
	cmd.Flags().StringVar(&ip, "ip", "", "Override IP address. Requires API-key auth with analytics.write scope.")
	cmd.Flags().StringVar(&userAgent, "user-agent", "", "Override user agent. Requires API-key auth with analytics.write scope.")
	return cmd
}

func newAnalyticsListMetricsCommand() *cobra.Command {
	var propertyId string
	var queries []string
	var interval string
	var dimensions []string
	var dateRange string
	var startAt string
	var endAt string
	var limit int
	var filter []string
	var where []string
	var sortAsc []string
	var sortDesc []string
	var cursorAfter string
	var cursorBefore string

	cmd := &cobra.Command{
		Use:   "list-metrics",
		Short: "Read analytics metrics (visitors, sessions, pageviews, events, bounceRate, …) for a property over a date range.\n\nThree response shapes, chosen by `dimensions[]` and `interval`:\n- Neither: one row aggregating the whole window, with `value` and `date` null. Only this shape carries `pageviews`, `visits`, `bounceRate`, `visitDuration`, `viewsPerVisit`, `scrollDepth` and `engagementTime`.\n- `dimensions[]`: one row per dimension value, ranked by visitors, with `value` set and `date` null.\n- `interval`: one row per time bucket in chronological order, with `date` set and `value` null.\n\nCombining `dimensions[]` with `interval` is not supported yet. `queries[]` filters the underlying events using standard Utopia query syntax.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := analytics.New(client)

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
				CursorAfter:  app.FlagString(cmd, "cursor-after", cursorAfter),
				CursorBefore: app.FlagString(cmd, "cursor-before", cursorBefore),
			})
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []analytics.ListMetricsOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListMetricsQueries(queries))
			}
			if cmd.Flags().Changed("interval") {
				options = append(options, service.WithListMetricsInterval(interval))
			}
			if cmd.Flags().Changed("dimensions") {
				options = append(options, service.WithListMetricsDimensions(dimensions))
			}
			if cmd.Flags().Changed("date-range") {
				options = append(options, service.WithListMetricsDateRange(dateRange))
			}
			if cmd.Flags().Changed("start-at") {
				options = append(options, service.WithListMetricsStartAt(startAt))
			}
			if cmd.Flags().Changed("end-at") {
				options = append(options, service.WithListMetricsEndAt(endAt))
			}
			if cmd.Flags().Changed("limit") {
				options = append(options, service.WithListMetricsLimit(limit))
			}

			result, err := service.ListMetrics(propertyId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&propertyId, "property-id", "", "Analytics property unique ID.")
	_ = cmd.MarkFlagRequired("property-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Up to 10 filter queries in Utopia syntax. Allowed attributes: country, region, city, browser, operatingSystem, device, screenSize, referrerSource, channel, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, page, hostname, botName, botCategory, eventName. page, eventName are only accepted alongside `interval`, or with a breakdown on a dimension other than entryPage, exitPage. Allowed methods: equal, notEqual, contains, startsWith, endsWith. Example: `queries[]=equal(\"country\", [\"US\"])`.")
	cmd.Flags().StringVar(&interval, "interval", "", "Time bucket size. Omit (null) for a flat aggregate over the whole window. Allowed: 1h, 1d, 1w, 1m.")
	cmd.Flags().StringArrayVar(&dimensions, "dimensions", nil, "Dimension to break the metrics down by. One at most for now; the parameter is a list so that cap can be raised without a breaking change. Allowed: country, region, city, browser, operatingSystem, device, screenSize, referrerSource, channel, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, page, hostname, entryPage, exitPage, trafficType, botName, botCategory, eventName.")
	cmd.Flags().StringVar(&dateRange, "date-range", "", "Date range shorthand (e.g. 7d, 30d). Ignored for any bound you supply explicitly via startAt/endAt.")
	cmd.Flags().StringVar(&startAt, "start-at", "", "Explicit window start in ISO 8601. Defaults to endAt minus dateRange.")
	cmd.Flags().StringVar(&endAt, "end-at", "", "Explicit window end in ISO 8601. Defaults to the current time.")
	cmd.Flags().IntVar(&limit, "limit", 0, "Maximum number of ranked values to return.")
	cmd.Flags().StringArrayVar(&filter, "filter", nil, "Filter using a simple comparison expression. Repeat for multiple filters. Supports field=value, field!=value, field>value, field>=value, field<value, and field<=value.")
	cmd.Flags().StringArrayVar(&where, "where", nil, "Deprecated. Use --filter instead. Filter using a simple comparison expression. Repeat for multiple filters.")
	cmd.Flags().StringArrayVar(&sortAsc, "sort-asc", nil, "Sort results by an attribute in ascending order. Repeat for multiple sort fields.")
	cmd.Flags().StringArrayVar(&sortDesc, "sort-desc", nil, "Sort results by an attribute in descending order. Repeat for multiple sort fields.")
	cmd.Flags().StringVar(&cursorAfter, "cursor-after", "", "Return results after this cursor ID.")
	cmd.Flags().StringVar(&cursorBefore, "cursor-before", "", "Return results before this cursor ID.")
	return cmd
}
