package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/functions"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewFunctionsCommand builds the `functions` command tree.
func NewFunctionsCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "functions",
		Short: "The Functions Service allows you view, create and manage your Cloud Functions.",
	}

	cmd.AddCommand(newFunctionsListCommand())
	cmd.AddCommand(newFunctionsCreateCommand())
	cmd.AddCommand(newFunctionsListRuntimesCommand())
	cmd.AddCommand(newFunctionsListSpecificationsCommand())
	cmd.AddCommand(newFunctionsGetCommand())
	cmd.AddCommand(newFunctionsUpdateCommand())
	cmd.AddCommand(newFunctionsDeleteCommand())
	cmd.AddCommand(newFunctionsUpdateFunctionDeploymentCommand())
	cmd.AddCommand(newFunctionsListDeploymentsCommand())
	cmd.AddCommand(newFunctionsCreateDeploymentCommand())
	cmd.AddCommand(newFunctionsCreateDuplicateDeploymentCommand())
	cmd.AddCommand(newFunctionsCreateTemplateDeploymentCommand())
	cmd.AddCommand(newFunctionsCreateVcsDeploymentCommand())
	cmd.AddCommand(newFunctionsGetDeploymentCommand())
	cmd.AddCommand(newFunctionsDeleteDeploymentCommand())
	cmd.AddCommand(newFunctionsGetDeploymentDownloadCommand())
	cmd.AddCommand(newFunctionsUpdateDeploymentStatusCommand())
	cmd.AddCommand(newFunctionsListExecutionsCommand())
	cmd.AddCommand(newFunctionsCreateExecutionCommand())
	cmd.AddCommand(newFunctionsGetExecutionCommand())
	cmd.AddCommand(newFunctionsDeleteExecutionCommand())
	cmd.AddCommand(newFunctionsListVariablesCommand())
	cmd.AddCommand(newFunctionsCreateVariableCommand())
	cmd.AddCommand(newFunctionsGetVariableCommand())
	cmd.AddCommand(newFunctionsUpdateVariableCommand())
	cmd.AddCommand(newFunctionsDeleteVariableCommand())

	return cmd
}

func newFunctionsListCommand() *cobra.Command {
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
		Short: "Get a list of all the project's functions. You can use the query params to filter your results.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

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
			options := []functions.ListOption{}
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
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, runtime, deploymentId, schedule, scheduleNext, schedulePrevious, timeout, entrypoint, commands, installationId")
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

func newFunctionsCreateCommand() *cobra.Command {
	var functionId string
	var name string
	var runtime string
	var execute []string
	var events []string
	var schedule string
	var timeout int
	var enabled bool
	var logging bool
	var entrypoint string
	var commands string
	var scopes []string
	var installationId string
	var providerRepositoryId string
	var providerBranch string
	var providerSilentMode bool
	var providerRootDirectory string
	var providerBranches []string
	var providerPaths []string
	var buildSpecification string
	var runtimeSpecification string
	var deploymentRetention int

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create a new function. You can pass a list of permissions (https://appwrite.io/docs/permissions) to allow different project users or team with access to execute the function using the client API.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []functions.CreateOption{}
			if cmd.Flags().Changed("execute") {
				options = append(options, service.WithCreateExecute(execute))
			}
			if cmd.Flags().Changed("events") {
				options = append(options, service.WithCreateEvents(events))
			}
			if cmd.Flags().Changed("schedule") {
				options = append(options, service.WithCreateSchedule(schedule))
			}
			if cmd.Flags().Changed("timeout") {
				options = append(options, service.WithCreateTimeout(timeout))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateEnabled(enabled))
			}
			if cmd.Flags().Changed("logging") {
				options = append(options, service.WithCreateLogging(logging))
			}
			if cmd.Flags().Changed("entrypoint") {
				options = append(options, service.WithCreateEntrypoint(entrypoint))
			}
			if cmd.Flags().Changed("commands") {
				options = append(options, service.WithCreateCommands(commands))
			}
			if cmd.Flags().Changed("scopes") {
				options = append(options, service.WithCreateScopes(scopes))
			}
			if cmd.Flags().Changed("installation-id") {
				options = append(options, service.WithCreateInstallationId(installationId))
			}
			if cmd.Flags().Changed("provider-repository-id") {
				options = append(options, service.WithCreateProviderRepositoryId(providerRepositoryId))
			}
			if cmd.Flags().Changed("provider-branch") {
				options = append(options, service.WithCreateProviderBranch(providerBranch))
			}
			if cmd.Flags().Changed("provider-silent-mode") {
				options = append(options, service.WithCreateProviderSilentMode(providerSilentMode))
			}
			if cmd.Flags().Changed("provider-root-directory") {
				options = append(options, service.WithCreateProviderRootDirectory(providerRootDirectory))
			}
			if cmd.Flags().Changed("provider-branches") {
				options = append(options, service.WithCreateProviderBranches(providerBranches))
			}
			if cmd.Flags().Changed("provider-paths") {
				options = append(options, service.WithCreateProviderPaths(providerPaths))
			}
			if cmd.Flags().Changed("build-specification") {
				options = append(options, service.WithCreateBuildSpecification(buildSpecification))
			}
			if cmd.Flags().Changed("runtime-specification") {
				options = append(options, service.WithCreateRuntimeSpecification(runtimeSpecification))
			}
			if cmd.Flags().Changed("deployment-retention") {
				options = append(options, service.WithCreateDeploymentRetention(deploymentRetention))
			}

			result, err := service.Create(functionId, name, runtime, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&name, "name", "", "Function name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&runtime, "runtime", "", "Execution runtime.")
	_ = cmd.MarkFlagRequired("runtime")
	cmd.Flags().StringArrayVar(&execute, "execute", nil, "An array of role strings with execution permissions. By default no user is granted with any execute permissions. learn more about roles (https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.")
	cmd.Flags().StringArrayVar(&events, "events", nil, "Events list. Maximum of 100 events are allowed.")
	cmd.Flags().StringVar(&schedule, "schedule", "", "Schedule CRON syntax.")
	cmd.Flags().IntVar(&timeout, "timeout", 0, "Function maximum execution time in seconds.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is function enabled? When set to 'disabled', users cannot access the function but Server SDKs with and API key can still access the function. No data is lost when this is toggled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&logging, "logging", false, "When disabled, executions will exclude logs and errors, and will be slightly faster.")
	cmd.Flags().Lookup("logging").NoOptDefVal = "true"
	cmd.Flags().StringVar(&entrypoint, "entrypoint", "", "Entrypoint File. This path is relative to the \"providerRootDirectory\".")
	cmd.Flags().StringVar(&commands, "commands", "", "Build Commands.")
	cmd.Flags().StringArrayVar(&scopes, "scopes", nil, "List of scopes allowed for API key auto-generated for every execution. Maximum of 200 scopes are allowed.")
	cmd.Flags().StringVar(&installationId, "installation-id", "", "Appwrite Installation ID for VCS (Version Control System) deployment.")
	cmd.Flags().StringVar(&providerRepositoryId, "provider-repository-id", "", "Repository ID of the repo linked to the function.")
	cmd.Flags().StringVar(&providerBranch, "provider-branch", "", "Production branch for the repo linked to the function.")
	cmd.Flags().BoolVar(&providerSilentMode, "provider-silent-mode", false, "Is the VCS (Version Control System) connection in silent mode for the repo linked to the function? In silent mode, comments will not be made on commits and pull requests.")
	cmd.Flags().Lookup("provider-silent-mode").NoOptDefVal = "true"
	cmd.Flags().StringVar(&providerRootDirectory, "provider-root-directory", "", "Path to function code in the linked repo.")
	cmd.Flags().StringArrayVar(&providerBranches, "provider-branches", nil, "List of branch name patterns to trigger automatic deployments. Supports wildcards. Leave empty to deploy on all branches.")
	cmd.Flags().StringArrayVar(&providerPaths, "provider-paths", nil, "List of file path patterns to trigger automatic deployments. Supports wildcards. Leave empty to deploy on all file changes.")
	cmd.Flags().StringVar(&buildSpecification, "build-specification", "", "Build specification for the function deployments.")
	cmd.Flags().StringVar(&runtimeSpecification, "runtime-specification", "", "Runtime specification for the function executions.")
	cmd.Flags().IntVar(&deploymentRetention, "deployment-retention", 0, "Days to keep non-active deployments before deletion. Value 0 means all deployments will be kept.")
	return cmd
}

func newFunctionsListRuntimesCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-runtimes",
		Short: "Get a list of all runtimes that are currently active on your instance.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			result, err := service.ListRuntimes()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newFunctionsListSpecificationsCommand() *cobra.Command {
	var typeArg string

	cmd := &cobra.Command{
		Use:   "list-specifications",
		Short: "List allowed function specifications for this instance.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []functions.ListSpecificationsOption{}
			if cmd.Flags().Changed("type") {
				options = append(options, service.WithListSpecificationsType(typeArg))
			}

			result, err := service.ListSpecifications(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&typeArg, "type", "", "Specification type to list. Can be one of: runtimes, builds. Defaults to runtimes.")
	return cmd
}

func newFunctionsGetCommand() *cobra.Command {
	var functionId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a function by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			result, err := service.Get(functionId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID.")
	_ = cmd.MarkFlagRequired("function-id")
	return cmd
}

func newFunctionsUpdateCommand() *cobra.Command {
	var functionId string
	var name string
	var runtime string
	var execute []string
	var events []string
	var schedule string
	var timeout int
	var enabled bool
	var logging bool
	var entrypoint string
	var commands string
	var scopes []string
	var installationId string
	var providerRepositoryId string
	var providerBranch string
	var providerSilentMode bool
	var providerRootDirectory string
	var providerBranches []string
	var providerPaths []string
	var buildSpecification string
	var runtimeSpecification string
	var deploymentRetention int

	cmd := &cobra.Command{
		Use:   "update",
		Short: "Update function by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []functions.UpdateOption{}
			if cmd.Flags().Changed("runtime") {
				options = append(options, service.WithUpdateRuntime(runtime))
			}
			if cmd.Flags().Changed("execute") {
				options = append(options, service.WithUpdateExecute(execute))
			}
			if cmd.Flags().Changed("events") {
				options = append(options, service.WithUpdateEvents(events))
			}
			if cmd.Flags().Changed("schedule") {
				options = append(options, service.WithUpdateSchedule(schedule))
			}
			if cmd.Flags().Changed("timeout") {
				options = append(options, service.WithUpdateTimeout(timeout))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateEnabled(enabled))
			}
			if cmd.Flags().Changed("logging") {
				options = append(options, service.WithUpdateLogging(logging))
			}
			if cmd.Flags().Changed("entrypoint") {
				options = append(options, service.WithUpdateEntrypoint(entrypoint))
			}
			if cmd.Flags().Changed("commands") {
				options = append(options, service.WithUpdateCommands(commands))
			}
			if cmd.Flags().Changed("scopes") {
				options = append(options, service.WithUpdateScopes(scopes))
			}
			if cmd.Flags().Changed("installation-id") {
				options = append(options, service.WithUpdateInstallationId(installationId))
			}
			if cmd.Flags().Changed("provider-repository-id") {
				options = append(options, service.WithUpdateProviderRepositoryId(providerRepositoryId))
			}
			if cmd.Flags().Changed("provider-branch") {
				options = append(options, service.WithUpdateProviderBranch(providerBranch))
			}
			if cmd.Flags().Changed("provider-silent-mode") {
				options = append(options, service.WithUpdateProviderSilentMode(providerSilentMode))
			}
			if cmd.Flags().Changed("provider-root-directory") {
				options = append(options, service.WithUpdateProviderRootDirectory(providerRootDirectory))
			}
			if cmd.Flags().Changed("provider-branches") {
				options = append(options, service.WithUpdateProviderBranches(providerBranches))
			}
			if cmd.Flags().Changed("provider-paths") {
				options = append(options, service.WithUpdateProviderPaths(providerPaths))
			}
			if cmd.Flags().Changed("build-specification") {
				options = append(options, service.WithUpdateBuildSpecification(buildSpecification))
			}
			if cmd.Flags().Changed("runtime-specification") {
				options = append(options, service.WithUpdateRuntimeSpecification(runtimeSpecification))
			}
			if cmd.Flags().Changed("deployment-retention") {
				options = append(options, service.WithUpdateDeploymentRetention(deploymentRetention))
			}

			result, err := service.Update(functionId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&name, "name", "", "Function name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&runtime, "runtime", "", "Execution runtime.")
	cmd.Flags().StringArrayVar(&execute, "execute", nil, "An array of role strings with execution permissions. By default no user is granted with any execute permissions. learn more about roles (https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.")
	cmd.Flags().StringArrayVar(&events, "events", nil, "Events list. Maximum of 100 events are allowed.")
	cmd.Flags().StringVar(&schedule, "schedule", "", "Schedule CRON syntax.")
	cmd.Flags().IntVar(&timeout, "timeout", 0, "Maximum execution time in seconds.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is function enabled? When set to 'disabled', users cannot access the function but Server SDKs with and API key can still access the function. No data is lost when this is toggled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&logging, "logging", false, "When disabled, executions will exclude logs and errors, and will be slightly faster.")
	cmd.Flags().Lookup("logging").NoOptDefVal = "true"
	cmd.Flags().StringVar(&entrypoint, "entrypoint", "", "Entrypoint File. This path is relative to the \"providerRootDirectory\".")
	cmd.Flags().StringVar(&commands, "commands", "", "Build Commands.")
	cmd.Flags().StringArrayVar(&scopes, "scopes", nil, "List of scopes allowed for API Key auto-generated for every execution. Maximum of 200 scopes are allowed.")
	cmd.Flags().StringVar(&installationId, "installation-id", "", "Appwrite Installation ID for VCS (Version Controle System) deployment.")
	cmd.Flags().StringVar(&providerRepositoryId, "provider-repository-id", "", "Repository ID of the repo linked to the function")
	cmd.Flags().StringVar(&providerBranch, "provider-branch", "", "Production branch for the repo linked to the function")
	cmd.Flags().BoolVar(&providerSilentMode, "provider-silent-mode", false, "Is the VCS (Version Control System) connection in silent mode for the repo linked to the function? In silent mode, comments will not be made on commits and pull requests.")
	cmd.Flags().Lookup("provider-silent-mode").NoOptDefVal = "true"
	cmd.Flags().StringVar(&providerRootDirectory, "provider-root-directory", "", "Path to function code in the linked repo.")
	cmd.Flags().StringArrayVar(&providerBranches, "provider-branches", nil, "List of branch name patterns to trigger automatic deployments. Supports wildcards. Leave empty to deploy on all branches.")
	cmd.Flags().StringArrayVar(&providerPaths, "provider-paths", nil, "List of file path patterns to trigger automatic deployments. Supports wildcards. Leave empty to deploy on all file changes.")
	cmd.Flags().StringVar(&buildSpecification, "build-specification", "", "Build specification for the function deployments.")
	cmd.Flags().StringVar(&runtimeSpecification, "runtime-specification", "", "Runtime specification for the function executions.")
	cmd.Flags().IntVar(&deploymentRetention, "deployment-retention", 0, "Days to keep non-active deployments before deletion. Value 0 means all deployments will be kept.")
	return cmd
}

func newFunctionsDeleteCommand() *cobra.Command {
	var functionId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a function by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			result, err := service.Delete(functionId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID.")
	_ = cmd.MarkFlagRequired("function-id")
	return cmd
}

func newFunctionsUpdateFunctionDeploymentCommand() *cobra.Command {
	var functionId string
	var deploymentId string

	cmd := &cobra.Command{
		Use:   "update-function-deployment",
		Short: "Update the function active deployment. Use this endpoint to switch the code deployment that should be used when visitor opens your function.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			result, err := service.UpdateFunctionDeployment(functionId, deploymentId)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&deploymentId, "deployment-id", "", "Deployment ID.")
	_ = cmd.MarkFlagRequired("deployment-id")
	return cmd
}

func newFunctionsListDeploymentsCommand() *cobra.Command {
	var functionId string
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
		Use:   "list-deployments",
		Short: "Get a list of all the function's code deployments. You can use the query params to filter your results.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

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
			options := []functions.ListDeploymentsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListDeploymentsQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListDeploymentsSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListDeploymentsTotal(total))
			}

			result, err := service.ListDeployments(functionId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: buildSize, sourceSize, totalSize, buildDuration, status, activate, type")
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

func newFunctionsCreateDeploymentCommand() *cobra.Command {
	var functionId string
	var code string
	var activate bool
	var entrypoint string
	var commands string

	cmd := &cobra.Command{
		Use:   "create-deployment",
		Short: "Create a new function code deployment. Use this endpoint to upload a new version of your code function. To execute your newly uploaded code, you'll need to update the function's deployment to use your new deployment UID.\n\nThis endpoint accepts a tar.gz file compressed with your code. Make sure to include any dependencies your code has within the compressed file. You can learn more about code packaging in the Appwrite Cloud Functions tutorial (https://appwrite.io/docs/functions).\n\nUse the \"command\" param to set the entrypoint used to execute your code.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)
			codeFile, codeFileCleanup, err := app.DeploymentInputFile(code)
			if err != nil {
				return err
			}
			defer codeFileCleanup()

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []functions.CreateDeploymentOption{}
			if cmd.Flags().Changed("entrypoint") {
				options = append(options, service.WithCreateDeploymentEntrypoint(entrypoint))
			}
			if cmd.Flags().Changed("commands") {
				options = append(options, service.WithCreateDeploymentCommands(commands))
			}

			result, err := service.CreateDeployment(functionId, codeFile, activate, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&code, "code", "", "Gzip file with your code package. When used with the Appwrite CLI, pass the path to your code directory, and the CLI will automatically package your code. Use a path that is within the current directory.")
	_ = cmd.MarkFlagRequired("code")
	cmd.Flags().BoolVar(&activate, "activate", false, "Automatically activate the deployment when it is finished building.")
	_ = cmd.MarkFlagRequired("activate")
	cmd.Flags().StringVar(&entrypoint, "entrypoint", "", "Entrypoint File.")
	cmd.Flags().StringVar(&commands, "commands", "", "Build Commands.")
	return cmd
}

func newFunctionsCreateDuplicateDeploymentCommand() *cobra.Command {
	var functionId string
	var deploymentId string
	var buildId string

	cmd := &cobra.Command{
		Use:   "create-duplicate-deployment",
		Short: "Create a new build for an existing function deployment. This endpoint allows you to rebuild a deployment with the updated function configuration, including its entrypoint and build commands if they have been modified. The build process will be queued and executed asynchronously. The original deployment's code will be preserved and used for the new build.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []functions.CreateDuplicateDeploymentOption{}
			if cmd.Flags().Changed("build-id") {
				options = append(options, service.WithCreateDuplicateDeploymentBuildId(buildId))
			}

			result, err := service.CreateDuplicateDeployment(functionId, deploymentId, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&deploymentId, "deployment-id", "", "Deployment ID.")
	_ = cmd.MarkFlagRequired("deployment-id")
	cmd.Flags().StringVar(&buildId, "build-id", "", "Build unique ID.")
	return cmd
}

func newFunctionsCreateTemplateDeploymentCommand() *cobra.Command {
	var functionId string
	var repository string
	var owner string
	var rootDirectory string
	var typeArg string
	var reference string
	var activate bool

	cmd := &cobra.Command{
		Use:   "create-template-deployment",
		Short: "Create a deployment based on a template.\n\nUse this endpoint with combination of listTemplates (https://appwrite.io/docs/products/functions/templates) to find the template details.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []functions.CreateTemplateDeploymentOption{}
			if cmd.Flags().Changed("activate") {
				options = append(options, service.WithCreateTemplateDeploymentActivate(activate))
			}

			result, err := service.CreateTemplateDeployment(functionId, repository, owner, rootDirectory, typeArg, reference, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&repository, "repository", "", "Repository name of the template.")
	_ = cmd.MarkFlagRequired("repository")
	cmd.Flags().StringVar(&owner, "owner", "", "The name of the owner of the template.")
	_ = cmd.MarkFlagRequired("owner")
	cmd.Flags().StringVar(&rootDirectory, "root-directory", "", "Path to function code in the template repo.")
	_ = cmd.MarkFlagRequired("root-directory")
	cmd.Flags().StringVar(&typeArg, "type", "", "Type for the reference provided. Can be commit, branch, or tag")
	_ = cmd.MarkFlagRequired("type")
	cmd.Flags().StringVar(&reference, "reference", "", "Reference value, can be a commit hash, branch name, or release tag")
	_ = cmd.MarkFlagRequired("reference")
	cmd.Flags().BoolVar(&activate, "activate", false, "Automatically activate the deployment when it is finished building.")
	cmd.Flags().Lookup("activate").NoOptDefVal = "true"
	return cmd
}

func newFunctionsCreateVcsDeploymentCommand() *cobra.Command {
	var functionId string
	var typeArg string
	var reference string
	var activate bool

	cmd := &cobra.Command{
		Use:   "create-vcs-deployment",
		Short: "Create a deployment when a function is connected to VCS.\n\nThis endpoint lets you create deployment from a branch, commit, or a tag.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []functions.CreateVcsDeploymentOption{}
			if cmd.Flags().Changed("activate") {
				options = append(options, service.WithCreateVcsDeploymentActivate(activate))
			}

			result, err := service.CreateVcsDeployment(functionId, typeArg, reference, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&typeArg, "type", "", "Type of reference passed. Allowed values are: branch, commit")
	_ = cmd.MarkFlagRequired("type")
	cmd.Flags().StringVar(&reference, "reference", "", "VCS reference to create deployment from. Depending on type this can be: branch name, commit hash")
	_ = cmd.MarkFlagRequired("reference")
	cmd.Flags().BoolVar(&activate, "activate", false, "Automatically activate the deployment when it is finished building.")
	cmd.Flags().Lookup("activate").NoOptDefVal = "true"
	return cmd
}

func newFunctionsGetDeploymentCommand() *cobra.Command {
	var functionId string
	var deploymentId string

	cmd := &cobra.Command{
		Use:   "get-deployment",
		Short: "Get a function deployment by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			result, err := service.GetDeployment(functionId, deploymentId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&deploymentId, "deployment-id", "", "Deployment ID.")
	_ = cmd.MarkFlagRequired("deployment-id")
	return cmd
}

func newFunctionsDeleteDeploymentCommand() *cobra.Command {
	var functionId string
	var deploymentId string

	cmd := &cobra.Command{
		Use:   "delete-deployment",
		Short: "Delete a code deployment by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			result, err := service.DeleteDeployment(functionId, deploymentId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&deploymentId, "deployment-id", "", "Deployment ID.")
	_ = cmd.MarkFlagRequired("deployment-id")
	return cmd
}

func newFunctionsGetDeploymentDownloadCommand() *cobra.Command {
	var functionId string
	var deploymentId string
	var typeArg string
	var token string
	var destination string

	cmd := &cobra.Command{
		Use:   "get-deployment-download",
		Short: "Get a function deployment content by its unique ID. The endpoint response return with a 'Content-Disposition: attachment' header that tells the browser to start downloading the file to user downloads directory.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []functions.GetDeploymentDownloadOption{}
			if cmd.Flags().Changed("type") {
				options = append(options, service.WithGetDeploymentDownloadType(typeArg))
			}
			if cmd.Flags().Changed("token") {
				options = append(options, service.WithGetDeploymentDownloadToken(token))
			}

			result, err := service.GetDeploymentDownload(functionId, deploymentId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			// A location method returns the file bytes, not a URL. The
			// TypeScript fetches the URL itself; the SDK has already done that.
			return app.WriteFile(destination, result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&deploymentId, "deployment-id", "", "Deployment ID.")
	_ = cmd.MarkFlagRequired("deployment-id")
	cmd.Flags().StringVar(&typeArg, "type", "", "Deployment file to download. Can be: \"source\", \"output\".")
	cmd.Flags().StringVar(&token, "token", "", "Presigned source-download token for accessing this deployment without a session (jobs-service).")
	cmd.Flags().StringVar(&destination, "destination", "", "Path to save the file to.")
	_ = cmd.MarkFlagRequired("destination")
	return cmd
}

func newFunctionsUpdateDeploymentStatusCommand() *cobra.Command {
	var functionId string
	var deploymentId string

	cmd := &cobra.Command{
		Use:   "update-deployment-status",
		Short: "Cancel an ongoing function deployment build. If the build is already in progress, it will be stopped and marked as canceled. If the build hasn't started yet, it will be marked as canceled without executing. You cannot cancel builds that have already completed (status 'ready') or failed. The response includes the final build status and details.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			result, err := service.UpdateDeploymentStatus(functionId, deploymentId)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&deploymentId, "deployment-id", "", "Deployment ID.")
	_ = cmd.MarkFlagRequired("deployment-id")
	return cmd
}

func newFunctionsListExecutionsCommand() *cobra.Command {
	var functionId string
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
		Use:   "list-executions",
		Short: "Get a list of all the current user function execution logs. You can use the query params to filter your results.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

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
			options := []functions.ListExecutionsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListExecutionsQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListExecutionsTotal(total))
			}

			result, err := service.ListExecutions(functionId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: trigger, status, responseStatusCode, duration, requestMethod, requestPath, deploymentId")
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

func newFunctionsCreateExecutionCommand() *cobra.Command {
	var functionId string
	var body string
	var async bool
	var path string
	var method string
	var headers string
	var scheduledAt string

	cmd := &cobra.Command{
		Use:   "create-execution",
		Short: "Trigger a function execution. The returned object will return you the current execution status. You can ping the `Get Execution` endpoint to get updates on the current execution status. Once this endpoint is called, your function execution process will start asynchronously.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)
			headersValue, err := app.JSONObject(headers)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []functions.CreateExecutionOption{}
			if cmd.Flags().Changed("body") {
				options = append(options, service.WithCreateExecutionBody(body))
			}
			if cmd.Flags().Changed("async") {
				options = append(options, service.WithCreateExecutionAsync(async))
			}
			if cmd.Flags().Changed("path") {
				options = append(options, service.WithCreateExecutionPath(path))
			}
			if cmd.Flags().Changed("method") {
				options = append(options, service.WithCreateExecutionMethod(method))
			}
			if cmd.Flags().Changed("headers") {
				options = append(options, service.WithCreateExecutionHeaders(headersValue))
			}
			if cmd.Flags().Changed("scheduled-at") {
				options = append(options, service.WithCreateExecutionScheduledAt(scheduledAt))
			}

			result, err := service.CreateExecution(functionId, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&body, "body", "", "HTTP body of execution. Default value is empty string.")
	cmd.Flags().BoolVar(&async, "async", false, "Execute code in the background. Default value is false.")
	cmd.Flags().Lookup("async").NoOptDefVal = "true"
	cmd.Flags().StringVar(&path, "path", "", "HTTP path of execution. Path can include query params. Default value is /")
	cmd.Flags().StringVar(&method, "method", "", "HTTP method of execution. Default value is POST.")
	cmd.Flags().StringVar(&headers, "headers", "", "HTTP headers of execution. Defaults to empty.")
	cmd.Flags().StringVar(&scheduledAt, "scheduled-at", "", "Scheduled execution time in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future with precision in minutes.")
	return cmd
}

func newFunctionsGetExecutionCommand() *cobra.Command {
	var functionId string
	var executionId string

	cmd := &cobra.Command{
		Use:   "get-execution",
		Short: "Get a function execution log by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			result, err := service.GetExecution(functionId, executionId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&executionId, "execution-id", "", "Execution ID.")
	_ = cmd.MarkFlagRequired("execution-id")
	return cmd
}

func newFunctionsDeleteExecutionCommand() *cobra.Command {
	var functionId string
	var executionId string

	cmd := &cobra.Command{
		Use:   "delete-execution",
		Short: "Delete a function execution by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			result, err := service.DeleteExecution(functionId, executionId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&executionId, "execution-id", "", "Execution ID.")
	_ = cmd.MarkFlagRequired("execution-id")
	return cmd
}

func newFunctionsListVariablesCommand() *cobra.Command {
	var functionId string
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
		Use:   "list-variables",
		Short: "Get a list of all variables of a specific function.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

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
			options := []functions.ListVariablesOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListVariablesQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListVariablesTotal(total))
			}

			result, err := service.ListVariables(functionId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function unique ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: key, resourceType, resourceId, secret")
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

func newFunctionsCreateVariableCommand() *cobra.Command {
	var functionId string
	var variableId string
	var key string
	var value string
	var secret bool

	cmd := &cobra.Command{
		Use:   "create-variable",
		Short: "Create a new function environment variable. These variables can be accessed in the function at runtime as environment variables.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []functions.CreateVariableOption{}
			if cmd.Flags().Changed("secret") {
				options = append(options, service.WithCreateVariableSecret(secret))
			}

			result, err := service.CreateVariable(functionId, variableId, key, value, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function unique ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&variableId, "variable-id", "", "Variable ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("variable-id")
	cmd.Flags().StringVar(&key, "key", "", "Variable key. Max length: 255 chars.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().StringVar(&value, "value", "", "Variable value. Max length: 8192 chars.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().BoolVar(&secret, "secret", false, "Secret variables can be updated or deleted, but only functions can read them during build and runtime.")
	cmd.Flags().Lookup("secret").NoOptDefVal = "true"
	return cmd
}

func newFunctionsGetVariableCommand() *cobra.Command {
	var functionId string
	var variableId string

	cmd := &cobra.Command{
		Use:   "get-variable",
		Short: "Get a variable by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			result, err := service.GetVariable(functionId, variableId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function unique ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&variableId, "variable-id", "", "Variable unique ID.")
	_ = cmd.MarkFlagRequired("variable-id")
	return cmd
}

func newFunctionsUpdateVariableCommand() *cobra.Command {
	var functionId string
	var variableId string
	var key string
	var value string
	var secret bool

	cmd := &cobra.Command{
		Use:   "update-variable",
		Short: "Update variable by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []functions.UpdateVariableOption{}
			if cmd.Flags().Changed("key") {
				options = append(options, service.WithUpdateVariableKey(key))
			}
			if cmd.Flags().Changed("value") {
				options = append(options, service.WithUpdateVariableValue(value))
			}
			if cmd.Flags().Changed("secret") {
				options = append(options, service.WithUpdateVariableSecret(secret))
			}

			result, err := service.UpdateVariable(functionId, variableId, options...)
			if err != nil {
				return sdk.WrapMutationError("PUT", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function unique ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&variableId, "variable-id", "", "Variable unique ID.")
	_ = cmd.MarkFlagRequired("variable-id")
	cmd.Flags().StringVar(&key, "key", "", "Variable key. Max length: 255 chars.")
	cmd.Flags().StringVar(&value, "value", "", "Variable value. Max length: 8192 chars.")
	cmd.Flags().BoolVar(&secret, "secret", false, "Secret variables can be updated or deleted, but only functions can read them during build and runtime.")
	cmd.Flags().Lookup("secret").NoOptDefVal = "true"
	return cmd
}

func newFunctionsDeleteVariableCommand() *cobra.Command {
	var functionId string
	var variableId string

	cmd := &cobra.Command{
		Use:   "delete-variable",
		Short: "Delete a variable by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := functions.New(client)

			result, err := service.DeleteVariable(functionId, variableId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&functionId, "function-id", "", "Function unique ID.")
	_ = cmd.MarkFlagRequired("function-id")
	cmd.Flags().StringVar(&variableId, "variable-id", "", "Variable unique ID.")
	_ = cmd.MarkFlagRequired("variable-id")
	return cmd
}
