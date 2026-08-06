package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/sites"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
)

// NewSitesCommand builds the `sites` command tree.
func NewSitesCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "sites",
		Short: "The Sites Service allows you view, create and manage your web applications.",
	}

	cmd.AddCommand(newSitesListCommand())
	cmd.AddCommand(newSitesCreateCommand())
	cmd.AddCommand(newSitesListFrameworksCommand())
	cmd.AddCommand(newSitesListSpecificationsCommand())
	cmd.AddCommand(newSitesGetCommand())
	cmd.AddCommand(newSitesUpdateCommand())
	cmd.AddCommand(newSitesDeleteCommand())
	cmd.AddCommand(newSitesUpdateSiteDeploymentCommand())
	cmd.AddCommand(newSitesListDeploymentsCommand())
	cmd.AddCommand(newSitesCreateDeploymentCommand())
	cmd.AddCommand(newSitesCreateDuplicateDeploymentCommand())
	cmd.AddCommand(newSitesCreateTemplateDeploymentCommand())
	cmd.AddCommand(newSitesCreateVcsDeploymentCommand())
	cmd.AddCommand(newSitesGetDeploymentCommand())
	cmd.AddCommand(newSitesDeleteDeploymentCommand())
	cmd.AddCommand(newSitesGetDeploymentDownloadCommand())
	cmd.AddCommand(newSitesUpdateDeploymentStatusCommand())
	cmd.AddCommand(newSitesListLogsCommand())
	cmd.AddCommand(newSitesGetLogCommand())
	cmd.AddCommand(newSitesDeleteLogCommand())
	cmd.AddCommand(newSitesListVariablesCommand())
	cmd.AddCommand(newSitesCreateVariableCommand())
	cmd.AddCommand(newSitesGetVariableCommand())
	cmd.AddCommand(newSitesUpdateVariableCommand())
	cmd.AddCommand(newSitesDeleteVariableCommand())

	return cmd
}

func newSitesListCommand() *cobra.Command {
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
		Short: "Get a list of all the project's sites. You can use the query params to filter your results.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

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
			options := []sites.ListOption{}
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

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, enabled, framework, deploymentId, buildCommand, installCommand, outputDirectory, installationId")
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

func newSitesCreateCommand() *cobra.Command {
	var siteId string
	var name string
	var framework string
	var buildRuntime string
	var enabled bool
	var logging bool
	var timeout int
	var installCommand string
	var buildCommand string
	var startCommand string
	var outputDirectory string
	var adapter string
	var installationId string
	var fallbackFile string
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
		Short: "Create a new site.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []sites.CreateOption{}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateEnabled(enabled))
			}
			if cmd.Flags().Changed("logging") {
				options = append(options, service.WithCreateLogging(logging))
			}
			if cmd.Flags().Changed("timeout") {
				options = append(options, service.WithCreateTimeout(timeout))
			}
			if cmd.Flags().Changed("install-command") {
				options = append(options, service.WithCreateInstallCommand(installCommand))
			}
			if cmd.Flags().Changed("build-command") {
				options = append(options, service.WithCreateBuildCommand(buildCommand))
			}
			if cmd.Flags().Changed("start-command") {
				options = append(options, service.WithCreateStartCommand(startCommand))
			}
			if cmd.Flags().Changed("output-directory") {
				options = append(options, service.WithCreateOutputDirectory(outputDirectory))
			}
			if cmd.Flags().Changed("adapter") {
				options = append(options, service.WithCreateAdapter(adapter))
			}
			if cmd.Flags().Changed("installation-id") {
				options = append(options, service.WithCreateInstallationId(installationId))
			}
			if cmd.Flags().Changed("fallback-file") {
				options = append(options, service.WithCreateFallbackFile(fallbackFile))
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

			result, err := service.Create(siteId, name, framework, buildRuntime, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&name, "name", "", "Site name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&framework, "framework", "", "Sites framework.")
	_ = cmd.MarkFlagRequired("framework")
	cmd.Flags().StringVar(&buildRuntime, "build-runtime", "", "Runtime to use during build step.")
	_ = cmd.MarkFlagRequired("build-runtime")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is site enabled? When set to 'disabled', users cannot access the site but Server SDKs with and API key can still access the site. No data is lost when this is toggled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&logging, "logging", false, "When disabled, request logs will exclude logs and errors, and site responses will be slightly faster.")
	cmd.Flags().Lookup("logging").NoOptDefVal = "true"
	cmd.Flags().IntVar(&timeout, "timeout", 0, "Maximum request time in seconds.")
	cmd.Flags().StringVar(&installCommand, "install-command", "", "Install Command.")
	cmd.Flags().StringVar(&buildCommand, "build-command", "", "Build Command.")
	cmd.Flags().StringVar(&startCommand, "start-command", "", "Custom start command. Leave empty to use default.")
	cmd.Flags().StringVar(&outputDirectory, "output-directory", "", "Output Directory for site.")
	cmd.Flags().StringVar(&adapter, "adapter", "", "Framework adapter defining rendering strategy. Allowed values are: static, ssr")
	cmd.Flags().StringVar(&installationId, "installation-id", "", "Appwrite Installation ID for VCS (Version Control System) deployment.")
	cmd.Flags().StringVar(&fallbackFile, "fallback-file", "", "Fallback file for single page application sites.")
	cmd.Flags().StringVar(&providerRepositoryId, "provider-repository-id", "", "Repository ID of the repo linked to the site.")
	cmd.Flags().StringVar(&providerBranch, "provider-branch", "", "Production branch for the repo linked to the site.")
	cmd.Flags().BoolVar(&providerSilentMode, "provider-silent-mode", false, "Is the VCS (Version Control System) connection in silent mode for the repo linked to the site? In silent mode, comments will not be made on commits and pull requests.")
	cmd.Flags().Lookup("provider-silent-mode").NoOptDefVal = "true"
	cmd.Flags().StringVar(&providerRootDirectory, "provider-root-directory", "", "Path to site code in the linked repo.")
	cmd.Flags().StringArrayVar(&providerBranches, "provider-branches", nil, "List of branch name patterns to trigger automatic deployments. Supports wildcards. Leave empty to deploy on all branches.")
	cmd.Flags().StringArrayVar(&providerPaths, "provider-paths", nil, "List of file path patterns to trigger automatic deployments. Supports wildcards. Leave empty to deploy on all file changes.")
	cmd.Flags().StringVar(&buildSpecification, "build-specification", "", "Build specification for the site deployments.")
	cmd.Flags().StringVar(&runtimeSpecification, "runtime-specification", "", "Runtime specification for the SSR executions.")
	cmd.Flags().IntVar(&deploymentRetention, "deployment-retention", 0, "Days to keep non-active deployments before deletion. Value 0 means all deployments will be kept.")
	return cmd
}

func newSitesListFrameworksCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-frameworks",
		Short: "Get a list of all frameworks that are currently available on the server instance.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			result, err := service.ListFrameworks()
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newSitesListSpecificationsCommand() *cobra.Command {
	var typeArg string

	cmd := &cobra.Command{
		Use:   "list-specifications",
		Short: "List allowed site specifications for this instance.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []sites.ListSpecificationsOption{}
			if cmd.Flags().Changed("type") {
				options = append(options, service.WithListSpecificationsType(typeArg))
			}

			result, err := service.ListSpecifications(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&typeArg, "type", "", "Specification type to list. Can be one of: runtimes, builds.")
	return cmd
}

func newSitesGetCommand() *cobra.Command {
	var siteId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a site by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			result, err := service.Get(siteId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site ID.")
	_ = cmd.MarkFlagRequired("site-id")
	return cmd
}

func newSitesUpdateCommand() *cobra.Command {
	var siteId string
	var name string
	var framework string
	var enabled bool
	var logging bool
	var timeout int
	var installCommand string
	var buildCommand string
	var startCommand string
	var outputDirectory string
	var buildRuntime string
	var adapter string
	var fallbackFile string
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
		Short: "Update site by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []sites.UpdateOption{}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateEnabled(enabled))
			}
			if cmd.Flags().Changed("logging") {
				options = append(options, service.WithUpdateLogging(logging))
			}
			if cmd.Flags().Changed("timeout") {
				options = append(options, service.WithUpdateTimeout(timeout))
			}
			if cmd.Flags().Changed("install-command") {
				options = append(options, service.WithUpdateInstallCommand(installCommand))
			}
			if cmd.Flags().Changed("build-command") {
				options = append(options, service.WithUpdateBuildCommand(buildCommand))
			}
			if cmd.Flags().Changed("start-command") {
				options = append(options, service.WithUpdateStartCommand(startCommand))
			}
			if cmd.Flags().Changed("output-directory") {
				options = append(options, service.WithUpdateOutputDirectory(outputDirectory))
			}
			if cmd.Flags().Changed("build-runtime") {
				options = append(options, service.WithUpdateBuildRuntime(buildRuntime))
			}
			if cmd.Flags().Changed("adapter") {
				options = append(options, service.WithUpdateAdapter(adapter))
			}
			if cmd.Flags().Changed("fallback-file") {
				options = append(options, service.WithUpdateFallbackFile(fallbackFile))
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

			result, err := service.Update(siteId, name, framework, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site ID.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&name, "name", "", "Site name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&framework, "framework", "", "Sites framework.")
	_ = cmd.MarkFlagRequired("framework")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is site enabled? When set to 'disabled', users cannot access the site but Server SDKs with and API key can still access the site. No data is lost when this is toggled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&logging, "logging", false, "When disabled, request logs will exclude logs and errors, and site responses will be slightly faster.")
	cmd.Flags().Lookup("logging").NoOptDefVal = "true"
	cmd.Flags().IntVar(&timeout, "timeout", 0, "Maximum request time in seconds.")
	cmd.Flags().StringVar(&installCommand, "install-command", "", "Install Command.")
	cmd.Flags().StringVar(&buildCommand, "build-command", "", "Build Command.")
	cmd.Flags().StringVar(&startCommand, "start-command", "", "Custom start command. Leave empty to use default.")
	cmd.Flags().StringVar(&outputDirectory, "output-directory", "", "Output Directory for site.")
	cmd.Flags().StringVar(&buildRuntime, "build-runtime", "", "Runtime to use during build step.")
	cmd.Flags().StringVar(&adapter, "adapter", "", "Framework adapter defining rendering strategy. Allowed values are: static, ssr")
	cmd.Flags().StringVar(&fallbackFile, "fallback-file", "", "Fallback file for single page application sites.")
	cmd.Flags().StringVar(&installationId, "installation-id", "", "Appwrite Installation ID for VCS (Version Control System) deployment.")
	cmd.Flags().StringVar(&providerRepositoryId, "provider-repository-id", "", "Repository ID of the repo linked to the site.")
	cmd.Flags().StringVar(&providerBranch, "provider-branch", "", "Production branch for the repo linked to the site.")
	cmd.Flags().BoolVar(&providerSilentMode, "provider-silent-mode", false, "Is the VCS (Version Control System) connection in silent mode for the repo linked to the site? In silent mode, comments will not be made on commits and pull requests.")
	cmd.Flags().Lookup("provider-silent-mode").NoOptDefVal = "true"
	cmd.Flags().StringVar(&providerRootDirectory, "provider-root-directory", "", "Path to site code in the linked repo.")
	cmd.Flags().StringArrayVar(&providerBranches, "provider-branches", nil, "List of branch name patterns to trigger automatic deployments. Supports wildcards. Leave empty to deploy on all branches.")
	cmd.Flags().StringArrayVar(&providerPaths, "provider-paths", nil, "List of file path patterns to trigger automatic deployments. Supports wildcards. Leave empty to deploy on all file changes.")
	cmd.Flags().StringVar(&buildSpecification, "build-specification", "", "Build specification for the site deployments.")
	cmd.Flags().StringVar(&runtimeSpecification, "runtime-specification", "", "Runtime specification for the SSR executions.")
	cmd.Flags().IntVar(&deploymentRetention, "deployment-retention", 0, "Days to keep non-active deployments before deletion. Value 0 means all deployments will be kept.")
	return cmd
}

func newSitesDeleteCommand() *cobra.Command {
	var siteId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a site by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			result, err := service.Delete(siteId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site ID.")
	_ = cmd.MarkFlagRequired("site-id")
	return cmd
}

func newSitesUpdateSiteDeploymentCommand() *cobra.Command {
	var siteId string
	var deploymentId string

	cmd := &cobra.Command{
		Use:   "update-site-deployment",
		Short: "Update the site active deployment. Use this endpoint to switch the code deployment that should be used when visitor opens your site.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			result, err := service.UpdateSiteDeployment(siteId, deploymentId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site ID.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&deploymentId, "deployment-id", "", "Deployment ID.")
	_ = cmd.MarkFlagRequired("deployment-id")
	return cmd
}

func newSitesListDeploymentsCommand() *cobra.Command {
	var siteId string
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
		Short: "Get a list of all the site's code deployments. You can use the query params to filter your results.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

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
			options := []sites.ListDeploymentsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListDeploymentsQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListDeploymentsSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListDeploymentsTotal(total))
			}

			result, err := service.ListDeployments(siteId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site ID.")
	_ = cmd.MarkFlagRequired("site-id")
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

func newSitesCreateDeploymentCommand() *cobra.Command {
	var siteId string
	var code string
	var installCommand string
	var buildCommand string
	var outputDirectory string
	var activate bool

	cmd := &cobra.Command{
		Use:   "create-deployment",
		Short: "Create a new site code deployment. Use this endpoint to upload a new version of your site code. To activate your newly uploaded code, you'll need to update the site's deployment to use your new deployment ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)
			codeFile, err := app.InputFile(code)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []sites.CreateDeploymentOption{}
			if cmd.Flags().Changed("install-command") {
				options = append(options, service.WithCreateDeploymentInstallCommand(installCommand))
			}
			if cmd.Flags().Changed("build-command") {
				options = append(options, service.WithCreateDeploymentBuildCommand(buildCommand))
			}
			if cmd.Flags().Changed("output-directory") {
				options = append(options, service.WithCreateDeploymentOutputDirectory(outputDirectory))
			}
			if cmd.Flags().Changed("activate") {
				options = append(options, service.WithCreateDeploymentActivate(activate))
			}

			result, err := service.CreateDeployment(siteId, codeFile, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site ID.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&code, "code", "", "Gzip file with your code package. When used with the Appwrite CLI, pass the path to your code directory, and the CLI will automatically package your code. Use a path that is within the current directory.")
	_ = cmd.MarkFlagRequired("code")
	cmd.Flags().StringVar(&installCommand, "install-command", "", "Install Commands.")
	cmd.Flags().StringVar(&buildCommand, "build-command", "", "Build Commands.")
	cmd.Flags().StringVar(&outputDirectory, "output-directory", "", "Output Directory.")
	cmd.Flags().BoolVar(&activate, "activate", false, "Automatically activate the deployment when it is finished building.")
	cmd.Flags().Lookup("activate").NoOptDefVal = "true"
	return cmd
}

func newSitesCreateDuplicateDeploymentCommand() *cobra.Command {
	var siteId string
	var deploymentId string

	cmd := &cobra.Command{
		Use:   "create-duplicate-deployment",
		Short: "Create a new build for an existing site deployment. This endpoint allows you to rebuild a deployment with the updated site configuration, including its commands and output directory if they have been modified. The build process will be queued and executed asynchronously. The original deployment's code will be preserved and used for the new build.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			result, err := service.CreateDuplicateDeployment(siteId, deploymentId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site ID.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&deploymentId, "deployment-id", "", "Deployment ID.")
	_ = cmd.MarkFlagRequired("deployment-id")
	return cmd
}

func newSitesCreateTemplateDeploymentCommand() *cobra.Command {
	var siteId string
	var repository string
	var owner string
	var rootDirectory string
	var typeArg string
	var reference string
	var activate bool

	cmd := &cobra.Command{
		Use:   "create-template-deployment",
		Short: "Create a deployment based on a template.\n\nUse this endpoint with combination of listTemplates (https://appwrite.io/docs/products/sites/templates) to find the template details.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []sites.CreateTemplateDeploymentOption{}
			if cmd.Flags().Changed("activate") {
				options = append(options, service.WithCreateTemplateDeploymentActivate(activate))
			}

			result, err := service.CreateTemplateDeployment(siteId, repository, owner, rootDirectory, typeArg, reference, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site ID.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&repository, "repository", "", "Repository name of the template.")
	_ = cmd.MarkFlagRequired("repository")
	cmd.Flags().StringVar(&owner, "owner", "", "The name of the owner of the template.")
	_ = cmd.MarkFlagRequired("owner")
	cmd.Flags().StringVar(&rootDirectory, "root-directory", "", "Path to site code in the template repo.")
	_ = cmd.MarkFlagRequired("root-directory")
	cmd.Flags().StringVar(&typeArg, "type", "", "Type for the reference provided. Can be commit, branch, or tag")
	_ = cmd.MarkFlagRequired("type")
	cmd.Flags().StringVar(&reference, "reference", "", "Reference value, can be a commit hash, branch name, or release tag")
	_ = cmd.MarkFlagRequired("reference")
	cmd.Flags().BoolVar(&activate, "activate", false, "Automatically activate the deployment when it is finished building.")
	cmd.Flags().Lookup("activate").NoOptDefVal = "true"
	return cmd
}

func newSitesCreateVcsDeploymentCommand() *cobra.Command {
	var siteId string
	var typeArg string
	var reference string
	var activate bool

	cmd := &cobra.Command{
		Use:   "create-vcs-deployment",
		Short: "Create a deployment when a site is connected to VCS.\n\nThis endpoint lets you create deployment from a branch, commit, or a tag.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []sites.CreateVcsDeploymentOption{}
			if cmd.Flags().Changed("activate") {
				options = append(options, service.WithCreateVcsDeploymentActivate(activate))
			}

			result, err := service.CreateVcsDeployment(siteId, typeArg, reference, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site ID.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&typeArg, "type", "", "Type of reference passed. Allowed values are: branch, commit")
	_ = cmd.MarkFlagRequired("type")
	cmd.Flags().StringVar(&reference, "reference", "", "VCS reference to create deployment from. Depending on type this can be: branch name, commit hash")
	_ = cmd.MarkFlagRequired("reference")
	cmd.Flags().BoolVar(&activate, "activate", false, "Automatically activate the deployment when it is finished building.")
	cmd.Flags().Lookup("activate").NoOptDefVal = "true"
	return cmd
}

func newSitesGetDeploymentCommand() *cobra.Command {
	var siteId string
	var deploymentId string

	cmd := &cobra.Command{
		Use:   "get-deployment",
		Short: "Get a site deployment by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			result, err := service.GetDeployment(siteId, deploymentId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site ID.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&deploymentId, "deployment-id", "", "Deployment ID.")
	_ = cmd.MarkFlagRequired("deployment-id")
	return cmd
}

func newSitesDeleteDeploymentCommand() *cobra.Command {
	var siteId string
	var deploymentId string

	cmd := &cobra.Command{
		Use:   "delete-deployment",
		Short: "Delete a site deployment by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			result, err := service.DeleteDeployment(siteId, deploymentId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site ID.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&deploymentId, "deployment-id", "", "Deployment ID.")
	_ = cmd.MarkFlagRequired("deployment-id")
	return cmd
}

func newSitesGetDeploymentDownloadCommand() *cobra.Command {
	var siteId string
	var deploymentId string
	var typeArg string
	var token string
	var destination string

	cmd := &cobra.Command{
		Use:   "get-deployment-download",
		Short: "Get a site deployment content by its unique ID. The endpoint response return with a 'Content-Disposition: attachment' header that tells the browser to start downloading the file to user downloads directory.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []sites.GetDeploymentDownloadOption{}
			if cmd.Flags().Changed("type") {
				options = append(options, service.WithGetDeploymentDownloadType(typeArg))
			}
			if cmd.Flags().Changed("token") {
				options = append(options, service.WithGetDeploymentDownloadToken(token))
			}

			result, err := service.GetDeploymentDownload(siteId, deploymentId, options...)
			if err != nil {
				return err
			}

			// A location method returns the file bytes, not a URL. The
			// TypeScript fetches the URL itself; the SDK has already done that.
			return app.WriteFile(destination, result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site ID.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&deploymentId, "deployment-id", "", "Deployment ID.")
	_ = cmd.MarkFlagRequired("deployment-id")
	cmd.Flags().StringVar(&typeArg, "type", "", "Deployment file to download. Can be: \"source\", \"output\".")
	cmd.Flags().StringVar(&token, "token", "", "Presigned source-download token for accessing this deployment without a session (jobs-service).")
	cmd.Flags().StringVar(&destination, "destination", "", "Path to save the file to.")
	_ = cmd.MarkFlagRequired("destination")
	return cmd
}

func newSitesUpdateDeploymentStatusCommand() *cobra.Command {
	var siteId string
	var deploymentId string

	cmd := &cobra.Command{
		Use:   "update-deployment-status",
		Short: "Cancel an ongoing site deployment build. If the build is already in progress, it will be stopped and marked as canceled. If the build hasn't started yet, it will be marked as canceled without executing. You cannot cancel builds that have already completed (status 'ready') or failed. The response includes the final build status and details.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			result, err := service.UpdateDeploymentStatus(siteId, deploymentId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site ID.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&deploymentId, "deployment-id", "", "Deployment ID.")
	_ = cmd.MarkFlagRequired("deployment-id")
	return cmd
}

func newSitesListLogsCommand() *cobra.Command {
	var siteId string
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
		Use:   "list-logs",
		Short: "Get a list of all site logs. You can use the query params to filter your results.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

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
			options := []sites.ListLogsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListLogsQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListLogsTotal(total))
			}

			result, err := service.ListLogs(siteId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site ID.")
	_ = cmd.MarkFlagRequired("site-id")
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

func newSitesGetLogCommand() *cobra.Command {
	var siteId string
	var logId string

	cmd := &cobra.Command{
		Use:   "get-log",
		Short: "Get a site request log by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			result, err := service.GetLog(siteId, logId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site ID.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&logId, "log-id", "", "Log ID.")
	_ = cmd.MarkFlagRequired("log-id")
	return cmd
}

func newSitesDeleteLogCommand() *cobra.Command {
	var siteId string
	var logId string

	cmd := &cobra.Command{
		Use:   "delete-log",
		Short: "Delete a site log by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			result, err := service.DeleteLog(siteId, logId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site ID.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&logId, "log-id", "", "Log ID.")
	_ = cmd.MarkFlagRequired("log-id")
	return cmd
}

func newSitesListVariablesCommand() *cobra.Command {
	var siteId string
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
		Short: "Get a list of all variables of a specific site.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

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
			options := []sites.ListVariablesOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListVariablesQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListVariablesTotal(total))
			}

			result, err := service.ListVariables(siteId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site unique ID.")
	_ = cmd.MarkFlagRequired("site-id")
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

func newSitesCreateVariableCommand() *cobra.Command {
	var siteId string
	var variableId string
	var key string
	var value string
	var secret bool

	cmd := &cobra.Command{
		Use:   "create-variable",
		Short: "Create a new site variable. These variables can be accessed during build and runtime (server-side rendering) as environment variables.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []sites.CreateVariableOption{}
			if cmd.Flags().Changed("secret") {
				options = append(options, service.WithCreateVariableSecret(secret))
			}

			result, err := service.CreateVariable(siteId, variableId, key, value, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site unique ID.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&variableId, "variable-id", "", "Variable ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("variable-id")
	cmd.Flags().StringVar(&key, "key", "", "Variable key. Max length: 255 chars.")
	_ = cmd.MarkFlagRequired("key")
	cmd.Flags().StringVar(&value, "value", "", "Variable value. Max length: 8192 chars.")
	_ = cmd.MarkFlagRequired("value")
	cmd.Flags().BoolVar(&secret, "secret", false, "Secret variables can be updated or deleted, but only sites can read them during build and runtime.")
	cmd.Flags().Lookup("secret").NoOptDefVal = "true"
	return cmd
}

func newSitesGetVariableCommand() *cobra.Command {
	var siteId string
	var variableId string

	cmd := &cobra.Command{
		Use:   "get-variable",
		Short: "Get a variable by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			result, err := service.GetVariable(siteId, variableId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site unique ID.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&variableId, "variable-id", "", "Variable unique ID.")
	_ = cmd.MarkFlagRequired("variable-id")
	return cmd
}

func newSitesUpdateVariableCommand() *cobra.Command {
	var siteId string
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
			service := sites.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []sites.UpdateVariableOption{}
			if cmd.Flags().Changed("key") {
				options = append(options, service.WithUpdateVariableKey(key))
			}
			if cmd.Flags().Changed("value") {
				options = append(options, service.WithUpdateVariableValue(value))
			}
			if cmd.Flags().Changed("secret") {
				options = append(options, service.WithUpdateVariableSecret(secret))
			}

			result, err := service.UpdateVariable(siteId, variableId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site unique ID.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&variableId, "variable-id", "", "Variable unique ID.")
	_ = cmd.MarkFlagRequired("variable-id")
	cmd.Flags().StringVar(&key, "key", "", "Variable key. Max length: 255 chars.")
	cmd.Flags().StringVar(&value, "value", "", "Variable value. Max length: 8192 chars.")
	cmd.Flags().BoolVar(&secret, "secret", false, "Secret variables can be updated or deleted, but only sites can read them during build and runtime.")
	cmd.Flags().Lookup("secret").NoOptDefVal = "true"
	return cmd
}

func newSitesDeleteVariableCommand() *cobra.Command {
	var siteId string
	var variableId string

	cmd := &cobra.Command{
		Use:   "delete-variable",
		Short: "Delete a variable by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := sites.New(client)

			result, err := service.DeleteVariable(siteId, variableId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&siteId, "site-id", "", "Site unique ID.")
	_ = cmd.MarkFlagRequired("site-id")
	cmd.Flags().StringVar(&variableId, "variable-id", "", "Variable unique ID.")
	_ = cmd.MarkFlagRequired("variable-id")
	return cmd
}
