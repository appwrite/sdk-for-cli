package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/embeddings"

	"github.com/appwrite/sdk-for-cli/internal/app"
)

// NewEmbeddingsCommand builds the `embeddings` command tree.
func NewEmbeddingsCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "embeddings",
		Short: "",
	}

	cmd.AddCommand(newEmbeddingsCreateTextEmbeddingsCommand())

	return cmd
}

func newEmbeddingsCreateTextEmbeddingsCommand() *cobra.Command {
	var texts []string
	var model string

	cmd := &cobra.Command{
		Use:   "create-text-embeddings",
		Short: "Generate vector embeddings for an array of text using the selected embedding model. Use the returned vectors to power semantic search and similarity queries against your vector collections.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := embeddings.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []embeddings.CreateTextEmbeddingsOption{}
			if cmd.Flags().Changed("model") {
				options = append(options, service.WithCreateTextEmbeddingsModel(model))
			}

			result, err := service.CreateTextEmbeddings(texts, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&texts, "texts", nil, "Array of text to generate embeddings.")
	_ = cmd.MarkFlagRequired("texts")
	cmd.Flags().StringVar(&model, "model", "", "The embedding model to use for generating vector embeddings.")
	return cmd
}
