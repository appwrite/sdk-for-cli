package services

import (
	"github.com/spf13/cobra"
)

// Register attaches every generated service command to root, plus the methods
// promoted to top-level commands.
func Register(root *cobra.Command) {
	root.AddCommand(NewAccountCommand())
	root.AddCommand(NewActivitiesCommand())
	root.AddCommand(NewAnalyticsCommand())
	root.AddCommand(NewAppsCommand())
	root.AddCommand(NewBackupsCommand())
	root.AddCommand(NewDatabasesCommand())
	root.AddCommand(NewDocumentsDBCommand())
	root.AddCommand(NewDomainsCommand())
	root.AddCommand(NewEmbeddingsCommand())
	root.AddCommand(NewFunctionsCommand())
	root.AddCommand(NewGraphqlCommand())
	root.AddCommand(NewLocaleCommand())
	root.AddCommand(NewMessagingCommand())
	root.AddCommand(NewMongoCommand())
	root.AddCommand(NewMysqlCommand())
	root.AddCommand(NewOauth2Command())
	root.AddCommand(NewOrganizationCommand())
	root.AddCommand(NewPostgresqlCommand())
	root.AddCommand(NewPresencesCommand())
	root.AddCommand(NewProjectCommand())
	root.AddCommand(NewProxyCommand())
	root.AddCommand(NewAdvisorCommand())
	root.AddCommand(NewSitesCommand())
	root.AddCommand(NewStorageCommand())
	root.AddCommand(NewTablesDBCommand())
	root.AddCommand(NewTeamsCommand())
	root.AddCommand(NewTokensCommand())
	root.AddCommand(NewUsersCommand())
	root.AddCommand(NewVectorsDBCommand())
	root.AddCommand(NewWafCommand())
	root.AddCommand(NewWebhooksCommand())

	root.AddCommand(NewOauth2RootCommands()...)
}
