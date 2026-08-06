package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/graphql"

	"github.com/appwrite/sdk-for-cli/internal/app"
)

// NewGraphqlCommand builds the `graphql` command tree.
func NewGraphqlCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "graphql",
		Short: "The GraphQL API allows you to query and mutate your Appwrite server using GraphQL.",
	}

	cmd.AddCommand(newGraphqlQueryCommand())
	cmd.AddCommand(newGraphqlMutationCommand())

	return cmd
}

func newGraphqlQueryCommand() *cobra.Command {
	var query string

	cmd := &cobra.Command{
		Use:   "query",
		Short: "Execute a GraphQL mutation.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := graphql.New(client)
			queryValue, err := app.JSONObject(query)
			if err != nil {
				return err
			}

			result, err := service.Query(queryValue)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&query, "query", "", "The query or queries to execute.")
	_ = cmd.MarkFlagRequired("query")
	return cmd
}

func newGraphqlMutationCommand() *cobra.Command {
	var query string

	cmd := &cobra.Command{
		Use:   "mutation",
		Short: "Execute a GraphQL mutation.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := graphql.New(client)
			queryValue, err := app.JSONObject(query)
			if err != nil {
				return err
			}

			result, err := service.Mutation(queryValue)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&query, "query", "", "The query or queries to execute.")
	_ = cmd.MarkFlagRequired("query")
	return cmd
}
