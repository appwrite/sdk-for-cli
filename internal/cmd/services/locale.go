package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/locale"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewLocaleCommand builds the `locale` command tree.
func NewLocaleCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "locale",
		Short: "The Locale service allows you to customize your app based on your users' location.",
	}

	cmd.AddCommand(newLocaleGetCommand())
	cmd.AddCommand(newLocaleListCodesCommand())
	cmd.AddCommand(newLocaleListContinentsCommand())
	cmd.AddCommand(newLocaleListCountriesCommand())
	cmd.AddCommand(newLocaleListCountriesEUCommand())
	cmd.AddCommand(newLocaleListCountriesPhonesCommand())
	cmd.AddCommand(newLocaleListCurrenciesCommand())
	cmd.AddCommand(newLocaleListLanguagesCommand())

	return cmd
}

func newLocaleGetCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get the current user location based on IP. Returns an object with user country code, country name, continent name, continent code, ip address and suggested currency. You can use the locale header to get the data in a supported language.\n\n(IP Geolocation by DB-IP (https://db-ip.com))",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := locale.New(client)

			result, err := service.Get()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newLocaleListCodesCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-codes",
		Short: "List of all locale codes in ISO 639-1 (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := locale.New(client)

			result, err := service.ListCodes()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newLocaleListContinentsCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-continents",
		Short: "List of all continents. You can use the locale header to get the data in a supported language.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := locale.New(client)

			result, err := service.ListContinents()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newLocaleListCountriesCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-countries",
		Short: "List of all countries. You can use the locale header to get the data in a supported language.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := locale.New(client)

			result, err := service.ListCountries()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newLocaleListCountriesEUCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-countries-eu",
		Short: "List of all countries that are currently members of the EU. You can use the locale header to get the data in a supported language.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := locale.New(client)

			result, err := service.ListCountriesEU()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newLocaleListCountriesPhonesCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-countries-phones",
		Short: "List of all countries phone codes. You can use the locale header to get the data in a supported language.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := locale.New(client)

			result, err := service.ListCountriesPhones()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newLocaleListCurrenciesCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-currencies",
		Short: "List of all currencies, including currency symbol, name, plural, and decimal digits for all major and minor currencies. You can use the locale header to get the data in a supported language.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := locale.New(client)

			result, err := service.ListCurrencies()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newLocaleListLanguagesCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-languages",
		Short: "List of all languages classified by ISO 639-1 including 2-letter code, name in English, and name in the respective language.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := locale.New(client)

			result, err := service.ListLanguages()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}
