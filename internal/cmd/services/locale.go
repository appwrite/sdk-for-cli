package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v7/locale"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewLocaleCommand builds the `locale` command tree.
func NewLocaleCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "locale",
		Short: "The Locale service allows you to customize your app based on your users' location.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			return cmd.Help()
		},
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
		Args:  cobra.NoArgs,
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
	var total bool

	cmd := &cobra.Command{
		Use:   "list-codes",
		Short: "List of all locale codes in ISO 639-1 (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := locale.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []locale.ListCodesOption{}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListCodesTotal(total))
			}

			result, err := service.ListCodes(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
	return cmd
}

func newLocaleListContinentsCommand() *cobra.Command {
	var total bool

	cmd := &cobra.Command{
		Use:   "list-continents",
		Short: "List of all continents. You can use the locale header to get the data in a supported language.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := locale.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []locale.ListContinentsOption{}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListContinentsTotal(total))
			}

			result, err := service.ListContinents(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
	return cmd
}

func newLocaleListCountriesCommand() *cobra.Command {
	var total bool

	cmd := &cobra.Command{
		Use:   "list-countries",
		Short: "List of all countries. You can use the locale header to get the data in a supported language.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := locale.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []locale.ListCountriesOption{}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListCountriesTotal(total))
			}

			result, err := service.ListCountries(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
	return cmd
}

func newLocaleListCountriesEUCommand() *cobra.Command {
	var total bool

	cmd := &cobra.Command{
		Use:   "list-countries-eu",
		Short: "List of all countries that are currently members of the EU. You can use the locale header to get the data in a supported language.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := locale.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []locale.ListCountriesEUOption{}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListCountriesEUTotal(total))
			}

			result, err := service.ListCountriesEU(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
	return cmd
}

func newLocaleListCountriesPhonesCommand() *cobra.Command {
	var total bool

	cmd := &cobra.Command{
		Use:   "list-countries-phones",
		Short: "List of all countries phone codes. You can use the locale header to get the data in a supported language.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := locale.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []locale.ListCountriesPhonesOption{}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListCountriesPhonesTotal(total))
			}

			result, err := service.ListCountriesPhones(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
	return cmd
}

func newLocaleListCurrenciesCommand() *cobra.Command {
	var total bool

	cmd := &cobra.Command{
		Use:   "list-currencies",
		Short: "List of all currencies, including currency symbol, name, plural, and decimal digits for all major and minor currencies. You can use the locale header to get the data in a supported language.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := locale.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []locale.ListCurrenciesOption{}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListCurrenciesTotal(total))
			}

			result, err := service.ListCurrencies(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
	return cmd
}

func newLocaleListLanguagesCommand() *cobra.Command {
	var total bool

	cmd := &cobra.Command{
		Use:   "list-languages",
		Short: "List of all languages classified by ISO 639-1 including 2-letter code, name in English, and name in the respective language.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForConsole()
			if err != nil {
				return err
			}
			service := locale.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []locale.ListLanguagesOption{}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListLanguagesTotal(total))
			}

			result, err := service.ListLanguages(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
	return cmd
}
