package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v7/monitors"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewMonitorsCommand builds the `monitors` command tree.
func NewMonitorsCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "monitors",
		Short: "The Monitors service watches your project's usage and raises an alert when a monitor's rules hold, announced by email, in the console or to a webhook.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			return cmd.Help()
		},
	}

	cmd.AddCommand(newMonitorsListCommand())
	cmd.AddCommand(newMonitorsCreateDnsMonitorCommand())
	cmd.AddCommand(newMonitorsUpdateDnsMonitorCommand())
	cmd.AddCommand(newMonitorsCreateHttpMonitorCommand())
	cmd.AddCommand(newMonitorsUpdateHttpMonitorCommand())
	cmd.AddCommand(newMonitorsCreateSmtpMonitorCommand())
	cmd.AddCommand(newMonitorsUpdateSmtpMonitorCommand())
	cmd.AddCommand(newMonitorsCreateTcpMonitorCommand())
	cmd.AddCommand(newMonitorsUpdateTcpMonitorCommand())
	cmd.AddCommand(newMonitorsCreateUsageMonitorCommand())
	cmd.AddCommand(newMonitorsUpdateUsageMonitorCommand())
	cmd.AddCommand(newMonitorsGetCommand())
	cmd.AddCommand(newMonitorsDeleteCommand())

	return cmd
}

func newMonitorsListCommand() *cobra.Command {
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
		Short: "Get a list of the project's monitors of every type. Use queries to filter by type, resource, severity or status, and `Query.search('search', term)` to search monitor IDs, names, metrics and resources.",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := monitors.New(client)

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
			options := []monitors.ListOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListQueries(app.StringSlice(queries)))
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

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, type, resourceType, resourceId, enabled, severity, escalationId, status, evaluatedAt, triggeredAt, search. Repeat the flag for each value.")
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

func newMonitorsCreateDnsMonitorCommand() *cobra.Command {
	var monitorId string
	var name string
	var domain string
	var record string
	var resolver string
	var rules []string
	var interval int
	var timeout int
	var cooldown int
	var enabled bool
	var notify []string
	var severity string
	var escalationId string

	cmd := &cobra.Command{
		Use:   "create-dns-monitor",
		Short: "Create a DNS monitor. It asks a resolver for a domain's records of one type on its own interval, and opens an alert when the resolver fails, or when its rules match the answers, by default when there is no such record. Each alert fires the `monitors.[monitorId].alerts.[alertId].create` event when it opens and `.update` when a check passes again, for project webhooks, functions and realtime, and notifies the organization's members by email and in the console.",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := monitors.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []monitors.CreateDnsMonitorOption{}
			if cmd.Flags().Changed("record") {
				options = append(options, service.WithCreateDnsMonitorRecord(record))
			}
			if cmd.Flags().Changed("resolver") {
				options = append(options, service.WithCreateDnsMonitorResolver(resolver))
			}
			if cmd.Flags().Changed("rules") {
				options = append(options, service.WithCreateDnsMonitorRules(app.StringSlice(rules)))
			}
			if cmd.Flags().Changed("interval") {
				options = append(options, service.WithCreateDnsMonitorInterval(interval))
			}
			if cmd.Flags().Changed("timeout") {
				options = append(options, service.WithCreateDnsMonitorTimeout(timeout))
			}
			if cmd.Flags().Changed("cooldown") {
				options = append(options, service.WithCreateDnsMonitorCooldown(cooldown))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateDnsMonitorEnabled(enabled))
			}
			if cmd.Flags().Changed("notify") {
				options = append(options, service.WithCreateDnsMonitorNotify(app.StringSlice(notify)))
			}
			if cmd.Flags().Changed("severity") {
				options = append(options, service.WithCreateDnsMonitorSeverity(severity))
			}
			if cmd.Flags().Changed("escalation-id") {
				options = append(options, service.WithCreateDnsMonitorEscalationId(escalationId))
			}

			result, err := service.CreateDnsMonitor(monitorId, name, domain, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&monitorId, "monitor-id", "", "Monitor ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("monitor-id")
	cmd.Flags().StringVar(&name, "name", "", "Monitor name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&domain, "domain", "", "Domain to query, such as `example.com`.")
	_ = cmd.MarkFlagRequired("domain")
	cmd.Flags().StringVar(&record, "record", "", "Record type to query: `A`, `AAAA`, `CNAME`, `MX`, `TXT` or `NS`. Defaults to `A`.")
	cmd.Flags().StringVar(&resolver, "resolver", "", "Resolver to query, as an IP address with an optional port, such as `1.1.1.1` or `[2606:4700:4700::1111]:53`. Defaults to the server's DNS resolver.")
	cmd.Flags().StringArrayVar(&rules, "rules", nil, "Rules that describe the failing state, as query strings generated with the Query class. The monitor fires when they match. Transport failures, such as timeouts, DNS failures, refused connections and denied targets, always fire. Variables: `answer` (the first record returned, compared lowercased without the trailing dot), `answers` (number of records returned), `latency` (milliseconds the check took). Operators: `equal`, `notEqual`, `lessThan`, `lessThanEqual`, `greaterThan`, `greaterThanEqual`, `between`, `notBetween`. `answer` takes `equal` and `notEqual` only. Combine rules with `or` and `and`; top-level rules must all match. Without rules it fires when the resolver returns no answers. Repeat the flag for each value.")
	cmd.Flags().IntVar(&interval, "interval", 0, "Seconds between two checks, between 1 and 2592000. The scheduler runs on a one second tick, so one second is the shortest interval. Defaults to 60, or to the shortest interval your plan allows when that is longer. Reads back raised to your plan's minimum interval when the plan no longer allows it.")
	cmd.Flags().IntVar(&timeout, "timeout", 0, "Seconds a check may take before it fails, between 1 and 60, and no longer than the interval.")
	cmd.Flags().IntVar(&cooldown, "cooldown", 0, "Minimum seconds between two team notifications of this monitor firing, between 300 and 2592000. Events fire on every change between firing and resolved regardless.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set to false to create the monitor without checking it.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&notify, "notify", nil, "Organization roles whose confirmed members get an email and a console notification when the monitor fires and resolves. Each must be an organization role, such as `owner` or `developer`. Defaults to owners; pass an empty list to rely on the alert events alone. Repeat the flag for each value.")
	cmd.Flags().StringVar(&severity, "severity", "", "How urgent the monitor's alerts are: `info`, `warning`, `error` or `critical`. Critical alerts may be delivered with higher urgency by the notification channels that support it, such as a push that rings through silent mode.")
	cmd.Flags().StringVar(&escalationId, "escalation-id", "", "ID of an escalation of the organization that notifies the team of this monitor's alerts step by step, until a member acknowledges the alert or it resolves. When set, `notify` is not used. Leave empty to notify the `notify` roles once.")
	return cmd
}

func newMonitorsUpdateDnsMonitorCommand() *cobra.Command {
	var monitorId string
	var name string
	var domain string
	var record string
	var resolver string
	var rules []string
	var interval int
	var timeout int
	var cooldown int
	var enabled bool
	var notify []string
	var severity string
	var escalationId string

	cmd := &cobra.Command{
		Use:   "update-dns-monitor",
		Short: "Update a DNS monitor by its unique ID. Only the parameters passed change; the monitor's state, its last check and its open alert are kept. Passing `rules` replaces all of them.",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := monitors.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []monitors.UpdateDnsMonitorOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateDnsMonitorName(name))
			}
			if cmd.Flags().Changed("domain") {
				options = append(options, service.WithUpdateDnsMonitorDomain(domain))
			}
			if cmd.Flags().Changed("record") {
				options = append(options, service.WithUpdateDnsMonitorRecord(record))
			}
			if cmd.Flags().Changed("resolver") {
				options = append(options, service.WithUpdateDnsMonitorResolver(resolver))
			}
			if cmd.Flags().Changed("rules") {
				options = append(options, service.WithUpdateDnsMonitorRules(app.StringSlice(rules)))
			}
			if cmd.Flags().Changed("interval") {
				options = append(options, service.WithUpdateDnsMonitorInterval(interval))
			}
			if cmd.Flags().Changed("timeout") {
				options = append(options, service.WithUpdateDnsMonitorTimeout(timeout))
			}
			if cmd.Flags().Changed("cooldown") {
				options = append(options, service.WithUpdateDnsMonitorCooldown(cooldown))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateDnsMonitorEnabled(enabled))
			}
			if cmd.Flags().Changed("notify") {
				options = append(options, service.WithUpdateDnsMonitorNotify(app.StringSlice(notify)))
			}
			if cmd.Flags().Changed("severity") {
				options = append(options, service.WithUpdateDnsMonitorSeverity(severity))
			}
			if cmd.Flags().Changed("escalation-id") {
				options = append(options, service.WithUpdateDnsMonitorEscalationId(escalationId))
			}

			result, err := service.UpdateDnsMonitor(monitorId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&monitorId, "monitor-id", "", "Monitor ID.")
	_ = cmd.MarkFlagRequired("monitor-id")
	cmd.Flags().StringVar(&name, "name", "", "Monitor name. Max length: 128 chars.")
	cmd.Flags().StringVar(&domain, "domain", "", "Domain to query, such as `example.com`.")
	cmd.Flags().StringVar(&record, "record", "", "Record type to query: `A`, `AAAA`, `CNAME`, `MX`, `TXT` or `NS`.")
	cmd.Flags().StringVar(&resolver, "resolver", "", "Resolver to query, as an IP address with an optional port, such as `1.1.1.1` or `[2606:4700:4700::1111]:53`. Pass an empty string to use the server's DNS resolver.")
	cmd.Flags().StringArrayVar(&rules, "rules", nil, "Rules that describe the failing state, as query strings generated with the Query class. The monitor fires when they match. Transport failures, such as timeouts, DNS failures, refused connections and denied targets, always fire. Variables: `answer` (the first record returned, compared lowercased without the trailing dot), `answers` (number of records returned), `latency` (milliseconds the check took). Operators: `equal`, `notEqual`, `lessThan`, `lessThanEqual`, `greaterThan`, `greaterThanEqual`, `between`, `notBetween`. `answer` takes `equal` and `notEqual` only. Combine rules with `or` and `and`; top-level rules must all match. Without rules it fires when the resolver returns no answers. Replaces the current rules; an empty list restores the defaults. Repeat the flag for each value.")
	cmd.Flags().IntVar(&interval, "interval", 0, "Seconds between two checks, between 1 and 2592000. The scheduler runs on a one second tick, so one second is the shortest interval. Reads back raised to your plan's minimum interval when the plan no longer allows it.")
	cmd.Flags().IntVar(&timeout, "timeout", 0, "Seconds a check may take before it fails, between 1 and 60, and no longer than the interval.")
	cmd.Flags().IntVar(&cooldown, "cooldown", 0, "Minimum seconds between two team notifications of this monitor firing, between 300 and 2592000. Events fire on every change between firing and resolved regardless.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Whether the monitor is checked.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&notify, "notify", nil, "Organization roles whose confirmed members get an email and a console notification when the monitor fires and resolves. Each must be an organization role, such as `owner` or `developer`. Pass an empty list to rely on the alert events alone. Repeat the flag for each value.")
	cmd.Flags().StringVar(&severity, "severity", "", "How urgent the monitor's alerts are: `info`, `warning`, `error` or `critical`. Critical alerts may be delivered with higher urgency by the notification channels that support it, such as a push that rings through silent mode.")
	cmd.Flags().StringVar(&escalationId, "escalation-id", "", "ID of an escalation of the organization that notifies the team of this monitor's alerts step by step, until a member acknowledges the alert or it resolves. When set, `notify` is not used. Pass an empty string to go back to the `notify` roles.")
	return cmd
}

func newMonitorsCreateHttpMonitorCommand() *cobra.Command {
	var monitorId string
	var name string
	var url string
	var method string
	var headers string
	var body string
	var rules []string
	var interval int
	var timeout int
	var cooldown int
	var enabled bool
	var notify []string
	var severity string
	var escalationId string

	cmd := &cobra.Command{
		Use:   "create-http-monitor",
		Short: "Create an HTTP monitor. It requests a URL on its own interval, following redirects, and opens an alert when the request fails or when its rules match the response, by default a status outside 2xx or the certificate of an HTTPS URL about to expire. The response body is discarded as it arrives. Each alert fires the `monitors.[monitorId].alerts.[alertId].create` event when it opens and `.update` when a check passes again, for project webhooks, functions and realtime, and notifies the organization's members by email and in the console.",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := monitors.New(client)
			headersValue, err := app.JSONObject(headers)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []monitors.CreateHttpMonitorOption{}
			if cmd.Flags().Changed("method") {
				options = append(options, service.WithCreateHttpMonitorMethod(method))
			}
			if cmd.Flags().Changed("headers") {
				options = append(options, service.WithCreateHttpMonitorHeaders(headersValue))
			}
			if cmd.Flags().Changed("body") {
				options = append(options, service.WithCreateHttpMonitorBody(body))
			}
			if cmd.Flags().Changed("rules") {
				options = append(options, service.WithCreateHttpMonitorRules(app.StringSlice(rules)))
			}
			if cmd.Flags().Changed("interval") {
				options = append(options, service.WithCreateHttpMonitorInterval(interval))
			}
			if cmd.Flags().Changed("timeout") {
				options = append(options, service.WithCreateHttpMonitorTimeout(timeout))
			}
			if cmd.Flags().Changed("cooldown") {
				options = append(options, service.WithCreateHttpMonitorCooldown(cooldown))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateHttpMonitorEnabled(enabled))
			}
			if cmd.Flags().Changed("notify") {
				options = append(options, service.WithCreateHttpMonitorNotify(app.StringSlice(notify)))
			}
			if cmd.Flags().Changed("severity") {
				options = append(options, service.WithCreateHttpMonitorSeverity(severity))
			}
			if cmd.Flags().Changed("escalation-id") {
				options = append(options, service.WithCreateHttpMonitorEscalationId(escalationId))
			}

			result, err := service.CreateHttpMonitor(monitorId, name, url, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&monitorId, "monitor-id", "", "Monitor ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("monitor-id")
	cmd.Flags().StringVar(&name, "name", "", "Monitor name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&url, "url", "", "URL to request, with an `http` or `https` scheme.")
	_ = cmd.MarkFlagRequired("url")
	cmd.Flags().StringVar(&method, "method", "", "HTTP method to request the URL with: `GET`, `HEAD`, `POST`, `PUT`, `PATCH`, `DELETE` or `OPTIONS`. Defaults to `GET`.")
	cmd.Flags().StringVar(&headers, "headers", "", "HTTP headers to send, as an object of header names and values. Each name must be a valid HTTP header name.")
	cmd.Flags().StringVar(&body, "body", "", "Request body to send. Max length: 16384 chars.")
	cmd.Flags().StringArrayVar(&rules, "rules", nil, "Rules that describe the failing state, as query strings generated with the Query class. The monitor fires when they match. Transport failures, such as timeouts, DNS failures, refused connections and denied targets, always fire. Variables: `statusCode` (HTTP status), `latency` (milliseconds the check took), `certificateDays` (whole days until the certificate expires), `certificateLifetime` (percent of the certificate's lifetime left). Operators: `equal`, `notEqual`, `lessThan`, `lessThanEqual`, `greaterThan`, `greaterThanEqual`, `between`, `notBetween`. Combine rules with `or` and `and`; top-level rules must all match. Without rules it fires on a status code outside 200 to 299, or on a certificate with fewer than 14 days and less than 25% of its lifetime left. Repeat the flag for each value.")
	cmd.Flags().IntVar(&interval, "interval", 0, "Seconds between two checks, between 1 and 2592000. The scheduler runs on a one second tick, so one second is the shortest interval. Defaults to 60, or to the shortest interval your plan allows when that is longer. Reads back raised to your plan's minimum interval when the plan no longer allows it.")
	cmd.Flags().IntVar(&timeout, "timeout", 0, "Seconds a check may take before it fails, between 1 and 60, and no longer than the interval.")
	cmd.Flags().IntVar(&cooldown, "cooldown", 0, "Minimum seconds between two team notifications of this monitor firing, between 300 and 2592000. Events fire on every change between firing and resolved regardless.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set to false to create the monitor without checking it.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&notify, "notify", nil, "Organization roles whose confirmed members get an email and a console notification when the monitor fires and resolves. Each must be an organization role, such as `owner` or `developer`. Defaults to owners; pass an empty list to rely on the alert events alone. Repeat the flag for each value.")
	cmd.Flags().StringVar(&severity, "severity", "", "How urgent the monitor's alerts are: `info`, `warning`, `error` or `critical`. Critical alerts may be delivered with higher urgency by the notification channels that support it, such as a push that rings through silent mode.")
	cmd.Flags().StringVar(&escalationId, "escalation-id", "", "ID of an escalation of the organization that notifies the team of this monitor's alerts step by step, until a member acknowledges the alert or it resolves. When set, `notify` is not used. Leave empty to notify the `notify` roles once.")
	return cmd
}

func newMonitorsUpdateHttpMonitorCommand() *cobra.Command {
	var monitorId string
	var name string
	var url string
	var method string
	var headers string
	var body string
	var rules []string
	var interval int
	var timeout int
	var cooldown int
	var enabled bool
	var notify []string
	var severity string
	var escalationId string

	cmd := &cobra.Command{
		Use:   "update-http-monitor",
		Short: "Update an HTTP monitor by its unique ID. Only the parameters passed change; the monitor's state, its last check and its open alert are kept. Passing `rules` replaces all of them.",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := monitors.New(client)
			headersValue, err := app.JSONObject(headers)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value.
			options := []monitors.UpdateHttpMonitorOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateHttpMonitorName(name))
			}
			if cmd.Flags().Changed("url") {
				options = append(options, service.WithUpdateHttpMonitorUrl(url))
			}
			if cmd.Flags().Changed("method") {
				options = append(options, service.WithUpdateHttpMonitorMethod(method))
			}
			if cmd.Flags().Changed("headers") {
				options = append(options, service.WithUpdateHttpMonitorHeaders(headersValue))
			}
			if cmd.Flags().Changed("body") {
				options = append(options, service.WithUpdateHttpMonitorBody(body))
			}
			if cmd.Flags().Changed("rules") {
				options = append(options, service.WithUpdateHttpMonitorRules(app.StringSlice(rules)))
			}
			if cmd.Flags().Changed("interval") {
				options = append(options, service.WithUpdateHttpMonitorInterval(interval))
			}
			if cmd.Flags().Changed("timeout") {
				options = append(options, service.WithUpdateHttpMonitorTimeout(timeout))
			}
			if cmd.Flags().Changed("cooldown") {
				options = append(options, service.WithUpdateHttpMonitorCooldown(cooldown))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateHttpMonitorEnabled(enabled))
			}
			if cmd.Flags().Changed("notify") {
				options = append(options, service.WithUpdateHttpMonitorNotify(app.StringSlice(notify)))
			}
			if cmd.Flags().Changed("severity") {
				options = append(options, service.WithUpdateHttpMonitorSeverity(severity))
			}
			if cmd.Flags().Changed("escalation-id") {
				options = append(options, service.WithUpdateHttpMonitorEscalationId(escalationId))
			}

			result, err := service.UpdateHttpMonitor(monitorId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&monitorId, "monitor-id", "", "Monitor ID.")
	_ = cmd.MarkFlagRequired("monitor-id")
	cmd.Flags().StringVar(&name, "name", "", "Monitor name. Max length: 128 chars.")
	cmd.Flags().StringVar(&url, "url", "", "URL to request, with an `http` or `https` scheme.")
	cmd.Flags().StringVar(&method, "method", "", "HTTP method to request the URL with: `GET`, `HEAD`, `POST`, `PUT`, `PATCH`, `DELETE` or `OPTIONS`.")
	cmd.Flags().StringVar(&headers, "headers", "", "HTTP headers to send, as an object of header names and values. Each name must be a valid HTTP header name.")
	cmd.Flags().StringVar(&body, "body", "", "Request body to send. Max length: 16384 chars.")
	cmd.Flags().StringArrayVar(&rules, "rules", nil, "Rules that describe the failing state, as query strings generated with the Query class. The monitor fires when they match. Transport failures, such as timeouts, DNS failures, refused connections and denied targets, always fire. Variables: `statusCode` (HTTP status), `latency` (milliseconds the check took), `certificateDays` (whole days until the certificate expires), `certificateLifetime` (percent of the certificate's lifetime left). Operators: `equal`, `notEqual`, `lessThan`, `lessThanEqual`, `greaterThan`, `greaterThanEqual`, `between`, `notBetween`. Combine rules with `or` and `and`; top-level rules must all match. Without rules it fires on a status code outside 200 to 299, or on a certificate with fewer than 14 days and less than 25% of its lifetime left. Replaces the current rules; an empty list restores the defaults. Repeat the flag for each value.")
	cmd.Flags().IntVar(&interval, "interval", 0, "Seconds between two checks, between 1 and 2592000. The scheduler runs on a one second tick, so one second is the shortest interval. Reads back raised to your plan's minimum interval when the plan no longer allows it.")
	cmd.Flags().IntVar(&timeout, "timeout", 0, "Seconds a check may take before it fails, between 1 and 60, and no longer than the interval.")
	cmd.Flags().IntVar(&cooldown, "cooldown", 0, "Minimum seconds between two team notifications of this monitor firing, between 300 and 2592000. Events fire on every change between firing and resolved regardless.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Whether the monitor is checked.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&notify, "notify", nil, "Organization roles whose confirmed members get an email and a console notification when the monitor fires and resolves. Each must be an organization role, such as `owner` or `developer`. Pass an empty list to rely on the alert events alone. Repeat the flag for each value.")
	cmd.Flags().StringVar(&severity, "severity", "", "How urgent the monitor's alerts are: `info`, `warning`, `error` or `critical`. Critical alerts may be delivered with higher urgency by the notification channels that support it, such as a push that rings through silent mode.")
	cmd.Flags().StringVar(&escalationId, "escalation-id", "", "ID of an escalation of the organization that notifies the team of this monitor's alerts step by step, until a member acknowledges the alert or it resolves. When set, `notify` is not used. Pass an empty string to go back to the `notify` roles.")
	return cmd
}

func newMonitorsCreateSmtpMonitorCommand() *cobra.Command {
	var monitorId string
	var name string
	var host string
	var port int
	var tlsMode string
	var rules []string
	var interval int
	var timeout int
	var cooldown int
	var enabled bool
	var notify []string
	var severity string
	var escalationId string

	cmd := &cobra.Command{
		Use:   "create-smtp-monitor",
		Short: "Create an SMTP monitor. It reads a mail server's greeting, sends `EHLO` and, as its TLS mode asks, upgrades with `STARTTLS` or speaks TLS from the start, on its own interval. It opens an alert when the server cannot be reached, refuses the session or fails the TLS handshake, or when its rules match. It never authenticates or sends mail. Each alert fires the `monitors.[monitorId].alerts.[alertId].create` event when it opens and `.update` when a check passes again, for project webhooks, functions and realtime, and notifies the organization's members by email and in the console.",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := monitors.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []monitors.CreateSmtpMonitorOption{}
			if cmd.Flags().Changed("tls-mode") {
				options = append(options, service.WithCreateSmtpMonitorTlsMode(tlsMode))
			}
			if cmd.Flags().Changed("rules") {
				options = append(options, service.WithCreateSmtpMonitorRules(app.StringSlice(rules)))
			}
			if cmd.Flags().Changed("interval") {
				options = append(options, service.WithCreateSmtpMonitorInterval(interval))
			}
			if cmd.Flags().Changed("timeout") {
				options = append(options, service.WithCreateSmtpMonitorTimeout(timeout))
			}
			if cmd.Flags().Changed("cooldown") {
				options = append(options, service.WithCreateSmtpMonitorCooldown(cooldown))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateSmtpMonitorEnabled(enabled))
			}
			if cmd.Flags().Changed("notify") {
				options = append(options, service.WithCreateSmtpMonitorNotify(app.StringSlice(notify)))
			}
			if cmd.Flags().Changed("severity") {
				options = append(options, service.WithCreateSmtpMonitorSeverity(severity))
			}
			if cmd.Flags().Changed("escalation-id") {
				options = append(options, service.WithCreateSmtpMonitorEscalationId(escalationId))
			}

			result, err := service.CreateSmtpMonitor(monitorId, name, host, port, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&monitorId, "monitor-id", "", "Monitor ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("monitor-id")
	cmd.Flags().StringVar(&name, "name", "", "Monitor name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&host, "host", "", "Hostname or IP address of the mail server.")
	_ = cmd.MarkFlagRequired("host")
	cmd.Flags().IntVar(&port, "port", 0, "Port to connect to, such as 25, 465 or 587.")
	_ = cmd.MarkFlagRequired("port")
	cmd.Flags().StringVar(&tlsMode, "tls-mode", "", "TLS mode: `auto` (`implicit` on port 465, `starttls` on 587 and `none` otherwise), `none`, `starttls` (upgrade after the greeting, and fail when the server does not offer it) or `implicit` (TLS from the first byte). Defaults to `auto`.")
	cmd.Flags().StringArrayVar(&rules, "rules", nil, "Rules that describe the failing state, as query strings generated with the Query class. The monitor fires when they match. Transport failures, such as timeouts, DNS failures, refused connections and denied targets, always fire. Variables: `code` (SMTP reply code), `latency` (milliseconds the check took), `certificateDays` (whole days until the certificate expires), `certificateLifetime` (percent of the certificate's lifetime left). Operators: `equal`, `notEqual`, `lessThan`, `lessThanEqual`, `greaterThan`, `greaterThanEqual`, `between`, `notBetween`. Combine rules with `or` and `and`; top-level rules must all match. Without rules it fires on transport failures only. Repeat the flag for each value.")
	cmd.Flags().IntVar(&interval, "interval", 0, "Seconds between two checks, between 1 and 2592000. The scheduler runs on a one second tick, so one second is the shortest interval. Defaults to 60, or to the shortest interval your plan allows when that is longer. Reads back raised to your plan's minimum interval when the plan no longer allows it.")
	cmd.Flags().IntVar(&timeout, "timeout", 0, "Seconds a check may take before it fails, between 1 and 60, and no longer than the interval.")
	cmd.Flags().IntVar(&cooldown, "cooldown", 0, "Minimum seconds between two team notifications of this monitor firing, between 300 and 2592000. Events fire on every change between firing and resolved regardless.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set to false to create the monitor without checking it.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&notify, "notify", nil, "Organization roles whose confirmed members get an email and a console notification when the monitor fires and resolves. Each must be an organization role, such as `owner` or `developer`. Defaults to owners; pass an empty list to rely on the alert events alone. Repeat the flag for each value.")
	cmd.Flags().StringVar(&severity, "severity", "", "How urgent the monitor's alerts are: `info`, `warning`, `error` or `critical`. Critical alerts may be delivered with higher urgency by the notification channels that support it, such as a push that rings through silent mode.")
	cmd.Flags().StringVar(&escalationId, "escalation-id", "", "ID of an escalation of the organization that notifies the team of this monitor's alerts step by step, until a member acknowledges the alert or it resolves. When set, `notify` is not used. Leave empty to notify the `notify` roles once.")
	return cmd
}

func newMonitorsUpdateSmtpMonitorCommand() *cobra.Command {
	var monitorId string
	var name string
	var host string
	var port int
	var tlsMode string
	var rules []string
	var interval int
	var timeout int
	var cooldown int
	var enabled bool
	var notify []string
	var severity string
	var escalationId string

	cmd := &cobra.Command{
		Use:   "update-smtp-monitor",
		Short: "Update an SMTP monitor by its unique ID. Only the parameters passed change; the monitor's state, its last check and its open alert are kept. Passing `rules` replaces all of them.",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := monitors.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []monitors.UpdateSmtpMonitorOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateSmtpMonitorName(name))
			}
			if cmd.Flags().Changed("host") {
				options = append(options, service.WithUpdateSmtpMonitorHost(host))
			}
			if cmd.Flags().Changed("port") {
				options = append(options, service.WithUpdateSmtpMonitorPort(port))
			}
			if cmd.Flags().Changed("tls-mode") {
				options = append(options, service.WithUpdateSmtpMonitorTlsMode(tlsMode))
			}
			if cmd.Flags().Changed("rules") {
				options = append(options, service.WithUpdateSmtpMonitorRules(app.StringSlice(rules)))
			}
			if cmd.Flags().Changed("interval") {
				options = append(options, service.WithUpdateSmtpMonitorInterval(interval))
			}
			if cmd.Flags().Changed("timeout") {
				options = append(options, service.WithUpdateSmtpMonitorTimeout(timeout))
			}
			if cmd.Flags().Changed("cooldown") {
				options = append(options, service.WithUpdateSmtpMonitorCooldown(cooldown))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateSmtpMonitorEnabled(enabled))
			}
			if cmd.Flags().Changed("notify") {
				options = append(options, service.WithUpdateSmtpMonitorNotify(app.StringSlice(notify)))
			}
			if cmd.Flags().Changed("severity") {
				options = append(options, service.WithUpdateSmtpMonitorSeverity(severity))
			}
			if cmd.Flags().Changed("escalation-id") {
				options = append(options, service.WithUpdateSmtpMonitorEscalationId(escalationId))
			}

			result, err := service.UpdateSmtpMonitor(monitorId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&monitorId, "monitor-id", "", "Monitor ID.")
	_ = cmd.MarkFlagRequired("monitor-id")
	cmd.Flags().StringVar(&name, "name", "", "Monitor name. Max length: 128 chars.")
	cmd.Flags().StringVar(&host, "host", "", "Hostname or IP address of the mail server.")
	cmd.Flags().IntVar(&port, "port", 0, "Port to connect to, such as 25, 465 or 587.")
	cmd.Flags().StringVar(&tlsMode, "tls-mode", "", "TLS mode: `auto` (`implicit` on port 465, `starttls` on 587 and `none` otherwise), `none`, `starttls` (upgrade after the greeting, and fail when the server does not offer it) or `implicit` (TLS from the first byte).")
	cmd.Flags().StringArrayVar(&rules, "rules", nil, "Rules that describe the failing state, as query strings generated with the Query class. The monitor fires when they match. Transport failures, such as timeouts, DNS failures, refused connections and denied targets, always fire. Variables: `code` (SMTP reply code), `latency` (milliseconds the check took), `certificateDays` (whole days until the certificate expires), `certificateLifetime` (percent of the certificate's lifetime left). Operators: `equal`, `notEqual`, `lessThan`, `lessThanEqual`, `greaterThan`, `greaterThanEqual`, `between`, `notBetween`. Combine rules with `or` and `and`; top-level rules must all match. Without rules it fires on transport failures only. Replaces the current rules; an empty list removes them. Repeat the flag for each value.")
	cmd.Flags().IntVar(&interval, "interval", 0, "Seconds between two checks, between 1 and 2592000. The scheduler runs on a one second tick, so one second is the shortest interval. Reads back raised to your plan's minimum interval when the plan no longer allows it.")
	cmd.Flags().IntVar(&timeout, "timeout", 0, "Seconds a check may take before it fails, between 1 and 60, and no longer than the interval.")
	cmd.Flags().IntVar(&cooldown, "cooldown", 0, "Minimum seconds between two team notifications of this monitor firing, between 300 and 2592000. Events fire on every change between firing and resolved regardless.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Whether the monitor is checked.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&notify, "notify", nil, "Organization roles whose confirmed members get an email and a console notification when the monitor fires and resolves. Each must be an organization role, such as `owner` or `developer`. Pass an empty list to rely on the alert events alone. Repeat the flag for each value.")
	cmd.Flags().StringVar(&severity, "severity", "", "How urgent the monitor's alerts are: `info`, `warning`, `error` or `critical`. Critical alerts may be delivered with higher urgency by the notification channels that support it, such as a push that rings through silent mode.")
	cmd.Flags().StringVar(&escalationId, "escalation-id", "", "ID of an escalation of the organization that notifies the team of this monitor's alerts step by step, until a member acknowledges the alert or it resolves. When set, `notify` is not used. Pass an empty string to go back to the `notify` roles.")
	return cmd
}

func newMonitorsCreateTcpMonitorCommand() *cobra.Command {
	var monitorId string
	var name string
	var host string
	var port int
	var rules []string
	var interval int
	var timeout int
	var cooldown int
	var enabled bool
	var notify []string
	var severity string
	var escalationId string

	cmd := &cobra.Command{
		Use:   "create-tcp-monitor",
		Short: "Create a TCP monitor. It opens a connection to a host and port on its own interval and closes it at once, and opens an alert when the connection cannot be made, or when its rules match. Each alert fires the `monitors.[monitorId].alerts.[alertId].create` event when it opens and `.update` when a check passes again, for project webhooks, functions and realtime, and notifies the organization's members by email and in the console.",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := monitors.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []monitors.CreateTcpMonitorOption{}
			if cmd.Flags().Changed("rules") {
				options = append(options, service.WithCreateTcpMonitorRules(app.StringSlice(rules)))
			}
			if cmd.Flags().Changed("interval") {
				options = append(options, service.WithCreateTcpMonitorInterval(interval))
			}
			if cmd.Flags().Changed("timeout") {
				options = append(options, service.WithCreateTcpMonitorTimeout(timeout))
			}
			if cmd.Flags().Changed("cooldown") {
				options = append(options, service.WithCreateTcpMonitorCooldown(cooldown))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateTcpMonitorEnabled(enabled))
			}
			if cmd.Flags().Changed("notify") {
				options = append(options, service.WithCreateTcpMonitorNotify(app.StringSlice(notify)))
			}
			if cmd.Flags().Changed("severity") {
				options = append(options, service.WithCreateTcpMonitorSeverity(severity))
			}
			if cmd.Flags().Changed("escalation-id") {
				options = append(options, service.WithCreateTcpMonitorEscalationId(escalationId))
			}

			result, err := service.CreateTcpMonitor(monitorId, name, host, port, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&monitorId, "monitor-id", "", "Monitor ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("monitor-id")
	cmd.Flags().StringVar(&name, "name", "", "Monitor name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&host, "host", "", "Hostname or IP address to connect to.")
	_ = cmd.MarkFlagRequired("host")
	cmd.Flags().IntVar(&port, "port", 0, "Port to connect to.")
	_ = cmd.MarkFlagRequired("port")
	cmd.Flags().StringArrayVar(&rules, "rules", nil, "Rules that describe the failing state, as query strings generated with the Query class. The monitor fires when they match. Transport failures, such as timeouts, DNS failures, refused connections and denied targets, always fire. Variables: `latency` (milliseconds the check took). Operators: `equal`, `notEqual`, `lessThan`, `lessThanEqual`, `greaterThan`, `greaterThanEqual`, `between`, `notBetween`. Combine rules with `or` and `and`; top-level rules must all match. Without rules it fires on transport failures only. Repeat the flag for each value.")
	cmd.Flags().IntVar(&interval, "interval", 0, "Seconds between two checks, between 1 and 2592000. The scheduler runs on a one second tick, so one second is the shortest interval. Defaults to 60, or to the shortest interval your plan allows when that is longer. Reads back raised to your plan's minimum interval when the plan no longer allows it.")
	cmd.Flags().IntVar(&timeout, "timeout", 0, "Seconds a check may take before it fails, between 1 and 60, and no longer than the interval.")
	cmd.Flags().IntVar(&cooldown, "cooldown", 0, "Minimum seconds between two team notifications of this monitor firing, between 300 and 2592000. Events fire on every change between firing and resolved regardless.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set to false to create the monitor without checking it.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&notify, "notify", nil, "Organization roles whose confirmed members get an email and a console notification when the monitor fires and resolves. Each must be an organization role, such as `owner` or `developer`. Defaults to owners; pass an empty list to rely on the alert events alone. Repeat the flag for each value.")
	cmd.Flags().StringVar(&severity, "severity", "", "How urgent the monitor's alerts are: `info`, `warning`, `error` or `critical`. Critical alerts may be delivered with higher urgency by the notification channels that support it, such as a push that rings through silent mode.")
	cmd.Flags().StringVar(&escalationId, "escalation-id", "", "ID of an escalation of the organization that notifies the team of this monitor's alerts step by step, until a member acknowledges the alert or it resolves. When set, `notify` is not used. Leave empty to notify the `notify` roles once.")
	return cmd
}

func newMonitorsUpdateTcpMonitorCommand() *cobra.Command {
	var monitorId string
	var name string
	var host string
	var port int
	var rules []string
	var interval int
	var timeout int
	var cooldown int
	var enabled bool
	var notify []string
	var severity string
	var escalationId string

	cmd := &cobra.Command{
		Use:   "update-tcp-monitor",
		Short: "Update a TCP monitor by its unique ID. Only the parameters passed change; the monitor's state, its last check and its open alert are kept. Passing `rules` replaces all of them.",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := monitors.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []monitors.UpdateTcpMonitorOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateTcpMonitorName(name))
			}
			if cmd.Flags().Changed("host") {
				options = append(options, service.WithUpdateTcpMonitorHost(host))
			}
			if cmd.Flags().Changed("port") {
				options = append(options, service.WithUpdateTcpMonitorPort(port))
			}
			if cmd.Flags().Changed("rules") {
				options = append(options, service.WithUpdateTcpMonitorRules(app.StringSlice(rules)))
			}
			if cmd.Flags().Changed("interval") {
				options = append(options, service.WithUpdateTcpMonitorInterval(interval))
			}
			if cmd.Flags().Changed("timeout") {
				options = append(options, service.WithUpdateTcpMonitorTimeout(timeout))
			}
			if cmd.Flags().Changed("cooldown") {
				options = append(options, service.WithUpdateTcpMonitorCooldown(cooldown))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateTcpMonitorEnabled(enabled))
			}
			if cmd.Flags().Changed("notify") {
				options = append(options, service.WithUpdateTcpMonitorNotify(app.StringSlice(notify)))
			}
			if cmd.Flags().Changed("severity") {
				options = append(options, service.WithUpdateTcpMonitorSeverity(severity))
			}
			if cmd.Flags().Changed("escalation-id") {
				options = append(options, service.WithUpdateTcpMonitorEscalationId(escalationId))
			}

			result, err := service.UpdateTcpMonitor(monitorId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&monitorId, "monitor-id", "", "Monitor ID.")
	_ = cmd.MarkFlagRequired("monitor-id")
	cmd.Flags().StringVar(&name, "name", "", "Monitor name. Max length: 128 chars.")
	cmd.Flags().StringVar(&host, "host", "", "Hostname or IP address to connect to.")
	cmd.Flags().IntVar(&port, "port", 0, "Port to connect to.")
	cmd.Flags().StringArrayVar(&rules, "rules", nil, "Rules that describe the failing state, as query strings generated with the Query class. The monitor fires when they match. Transport failures, such as timeouts, DNS failures, refused connections and denied targets, always fire. Variables: `latency` (milliseconds the check took). Operators: `equal`, `notEqual`, `lessThan`, `lessThanEqual`, `greaterThan`, `greaterThanEqual`, `between`, `notBetween`. Combine rules with `or` and `and`; top-level rules must all match. Without rules it fires on transport failures only. Replaces the current rules; an empty list removes them. Repeat the flag for each value.")
	cmd.Flags().IntVar(&interval, "interval", 0, "Seconds between two checks, between 1 and 2592000. The scheduler runs on a one second tick, so one second is the shortest interval. Reads back raised to your plan's minimum interval when the plan no longer allows it.")
	cmd.Flags().IntVar(&timeout, "timeout", 0, "Seconds a check may take before it fails, between 1 and 60, and no longer than the interval.")
	cmd.Flags().IntVar(&cooldown, "cooldown", 0, "Minimum seconds between two team notifications of this monitor firing, between 300 and 2592000. Events fire on every change between firing and resolved regardless.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Whether the monitor is checked.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&notify, "notify", nil, "Organization roles whose confirmed members get an email and a console notification when the monitor fires and resolves. Each must be an organization role, such as `owner` or `developer`. Pass an empty list to rely on the alert events alone. Repeat the flag for each value.")
	cmd.Flags().StringVar(&severity, "severity", "", "How urgent the monitor's alerts are: `info`, `warning`, `error` or `critical`. Critical alerts may be delivered with higher urgency by the notification channels that support it, such as a push that rings through silent mode.")
	cmd.Flags().StringVar(&escalationId, "escalation-id", "", "ID of an escalation of the organization that notifies the team of this monitor's alerts step by step, until a member acknowledges the alert or it resolves. When set, `notify` is not used. Pass an empty string to go back to the `notify` roles.")
	return cmd
}

func newMonitorsCreateUsageMonitorCommand() *cobra.Command {
	var monitorId string
	var name string
	var rules []string
	var window int
	var cooldown int
	var enabled bool
	var notify []string
	var severity string
	var escalationId string

	cmd := &cobra.Command{
		Use:   "create-usage-monitor",
		Short: "Create a usage monitor. It reads a usage metric of the project, or of one of its databases, buckets, functions or sites, on a schedule, and opens an alert when all its rules hold. Each alert fires the `monitors.[monitorId].alerts.[alertId].create` event when it opens and `.update` when usage recovers, for project webhooks, functions and realtime, and notifies the confirmed members of the `notify` roles by email and in the console, or the steps of the escalation set by `escalationId`.",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := monitors.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []monitors.CreateUsageMonitorOption{}
			if cmd.Flags().Changed("window") {
				options = append(options, service.WithCreateUsageMonitorWindow(window))
			}
			if cmd.Flags().Changed("cooldown") {
				options = append(options, service.WithCreateUsageMonitorCooldown(cooldown))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateUsageMonitorEnabled(enabled))
			}
			if cmd.Flags().Changed("notify") {
				options = append(options, service.WithCreateUsageMonitorNotify(app.StringSlice(notify)))
			}
			if cmd.Flags().Changed("severity") {
				options = append(options, service.WithCreateUsageMonitorSeverity(severity))
			}
			if cmd.Flags().Changed("escalation-id") {
				options = append(options, service.WithCreateUsageMonitorEscalationId(escalationId))
			}

			result, err := service.CreateUsageMonitor(monitorId, name, app.StringSlice(rules), options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&monitorId, "monitor-id", "", "Monitor ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("monitor-id")
	cmd.Flags().StringVar(&name, "name", "", "Monitor name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringArrayVar(&rules, "rules", nil, "Rules that must all hold for the monitor to fire, as query strings generated with the Query class: one comparing a usage metric, named as the usage endpoints name it (such as `network.outbound` or `databases.operations.reads`), with a threshold in the metric's unit (bytes for storage and bandwidth, MB-seconds for GB-hours, a count otherwise), and optionally `equal` rules on `resourceType` and `resourceId` to watch one database, bucket, function or site instead of the whole project. Repeat the flag for each value.")
	_ = cmd.MarkFlagRequired("rules")
	cmd.Flags().IntVar(&window, "window", 0, "Seconds a counter metric is summed over, between 60 and 2592000. Gauges compare their latest value.")
	cmd.Flags().IntVar(&cooldown, "cooldown", 0, "Minimum seconds between two team notifications of this monitor firing, between 300 and 2592000. Events fire on every change between firing and resolved regardless.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set to false to create the monitor without evaluating it.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&notify, "notify", nil, "Organization roles whose confirmed members get an email and a console notification when the monitor fires and resolves. Each must be an organization role, such as `owner` or `developer`. Defaults to owners; pass an empty list to rely on the alert events alone. Repeat the flag for each value.")
	cmd.Flags().StringVar(&severity, "severity", "", "How urgent the monitor's alerts are: `info`, `warning`, `error` or `critical`. Critical alerts may be delivered with higher urgency by the notification channels that support it, such as a push that rings through silent mode.")
	cmd.Flags().StringVar(&escalationId, "escalation-id", "", "ID of an escalation of the organization that notifies the team of this monitor's alerts step by step, until a member acknowledges the alert or it resolves. When set, `notify` is not used. Leave empty to notify the `notify` roles once.")
	return cmd
}

func newMonitorsUpdateUsageMonitorCommand() *cobra.Command {
	var monitorId string
	var name string
	var rules []string
	var window int
	var cooldown int
	var enabled bool
	var notify []string
	var severity string
	var escalationId string

	cmd := &cobra.Command{
		Use:   "update-usage-monitor",
		Short: "Update a usage monitor by its unique ID. Only the parameters passed change; the monitor's state and its open alert are kept. Passing `rules` replaces all of them.",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := monitors.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []monitors.UpdateUsageMonitorOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateUsageMonitorName(name))
			}
			if cmd.Flags().Changed("rules") {
				options = append(options, service.WithUpdateUsageMonitorRules(app.StringSlice(rules)))
			}
			if cmd.Flags().Changed("window") {
				options = append(options, service.WithUpdateUsageMonitorWindow(window))
			}
			if cmd.Flags().Changed("cooldown") {
				options = append(options, service.WithUpdateUsageMonitorCooldown(cooldown))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateUsageMonitorEnabled(enabled))
			}
			if cmd.Flags().Changed("notify") {
				options = append(options, service.WithUpdateUsageMonitorNotify(app.StringSlice(notify)))
			}
			if cmd.Flags().Changed("severity") {
				options = append(options, service.WithUpdateUsageMonitorSeverity(severity))
			}
			if cmd.Flags().Changed("escalation-id") {
				options = append(options, service.WithUpdateUsageMonitorEscalationId(escalationId))
			}

			result, err := service.UpdateUsageMonitor(monitorId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&monitorId, "monitor-id", "", "Monitor ID.")
	_ = cmd.MarkFlagRequired("monitor-id")
	cmd.Flags().StringVar(&name, "name", "", "Monitor name. Max length: 128 chars.")
	cmd.Flags().StringArrayVar(&rules, "rules", nil, "Rules that must all hold for the monitor to fire, as query strings generated with the Query class: one comparing a usage metric, named as the usage endpoints name it (such as `network.outbound` or `databases.operations.reads`), with a threshold in the metric's unit (bytes for storage and bandwidth, MB-seconds for GB-hours, a count otherwise), and optionally `equal` rules on `resourceType` and `resourceId` to watch one database, bucket, function or site instead of the whole project. Replaces the current rules. Repeat the flag for each value.")
	cmd.Flags().IntVar(&window, "window", 0, "Seconds a counter metric is summed over, between 60 and 2592000. Gauges compare their latest value.")
	cmd.Flags().IntVar(&cooldown, "cooldown", 0, "Minimum seconds between two team notifications of this monitor firing, between 300 and 2592000. Events fire on every change between firing and resolved regardless.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Whether the monitor is evaluated.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&notify, "notify", nil, "Organization roles whose confirmed members get an email and a console notification when the monitor fires and resolves. Each must be an organization role, such as `owner` or `developer`. Pass an empty list to rely on the alert events alone; pass null or omit to keep the current roles. Repeat the flag for each value.")
	cmd.Flags().StringVar(&severity, "severity", "", "How urgent the monitor's alerts are: `info`, `warning`, `error` or `critical`. Critical alerts may be delivered with higher urgency by the notification channels that support it, such as a push that rings through silent mode. Omit to keep the current one.")
	cmd.Flags().StringVar(&escalationId, "escalation-id", "", "ID of an escalation of the organization that notifies the team of this monitor's alerts step by step, until a member acknowledges the alert or it resolves. When set, `notify` is not used. Pass an empty string to go back to the `notify` roles; pass null or omit to keep the current one.")
	return cmd
}

func newMonitorsGetCommand() *cobra.Command {
	var monitorId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a monitor by its unique ID, with its state as of its last evaluation.",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := monitors.New(client)

			result, err := service.Get(monitorId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&monitorId, "monitor-id", "", "Monitor ID.")
	_ = cmd.MarkFlagRequired("monitor-id")
	return cmd
}

func newMonitorsDeleteCommand() *cobra.Command {
	var monitorId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a monitor by its unique ID. It stops being evaluated; an alert it is firing is resolved and kept with the rest of its alert history.",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := monitors.New(client)

			result, err := service.Delete(monitorId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&monitorId, "monitor-id", "", "Monitor ID.")
	_ = cmd.MarkFlagRequired("monitor-id")
	return cmd
}
