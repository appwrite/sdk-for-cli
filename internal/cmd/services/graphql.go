package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/graphql"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
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
		Short: "Execute a GraphQL query.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := graphql.New(client)
			queryValue, err := app.GraphQLRequest(query)
			if err != nil {
				return err
			}

			result, err := service.Query(queryValue)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&query, "query", "", "Raw GraphQL document, or a JSON request object or array for variables, operation names, or batching.")
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
			queryValue, err := app.GraphQLRequest(query)
			if err != nil {
				return err
			}

			result, err := service.Mutation(queryValue)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&query, "query", "", "Raw GraphQL document, or a JSON request object or array for variables, operation names, or batching.")
	_ = cmd.MarkFlagRequired("query")
	return cmd
}
