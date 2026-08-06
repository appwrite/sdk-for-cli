package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/users"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
)

// NewUsersCommand builds the `users` command tree.
func NewUsersCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "users",
		Short: "The Users service allows you to manage your project users.",
	}

	cmd.AddCommand(newUsersListCommand())
	cmd.AddCommand(newUsersCreateCommand())
	cmd.AddCommand(newUsersCreateArgon2UserCommand())
	cmd.AddCommand(newUsersCreateBcryptUserCommand())
	cmd.AddCommand(newUsersListIdentitiesCommand())
	cmd.AddCommand(newUsersDeleteIdentityCommand())
	cmd.AddCommand(newUsersCreateMD5UserCommand())
	cmd.AddCommand(newUsersCreatePHPassUserCommand())
	cmd.AddCommand(newUsersCreateScryptUserCommand())
	cmd.AddCommand(newUsersCreateScryptModifiedUserCommand())
	cmd.AddCommand(newUsersCreateSHAUserCommand())
	cmd.AddCommand(newUsersGetCommand())
	cmd.AddCommand(newUsersDeleteCommand())
	cmd.AddCommand(newUsersUpdateEmailCommand())
	cmd.AddCommand(newUsersUpdateImpersonatorCommand())
	cmd.AddCommand(newUsersCreateJWTCommand())
	cmd.AddCommand(newUsersUpdateLabelsCommand())
	cmd.AddCommand(newUsersListLogsCommand())
	cmd.AddCommand(newUsersListMembershipsCommand())
	cmd.AddCommand(newUsersUpdateMfaCommand())
	cmd.AddCommand(newUsersDeleteMfaAuthenticatorCommand())
	cmd.AddCommand(newUsersListMfaFactorsCommand())
	cmd.AddCommand(newUsersGetMfaRecoveryCodesCommand())
	cmd.AddCommand(newUsersUpdateMfaRecoveryCodesCommand())
	cmd.AddCommand(newUsersCreateMfaRecoveryCodesCommand())
	cmd.AddCommand(newUsersUpdateNameCommand())
	cmd.AddCommand(newUsersUpdatePasswordCommand())
	cmd.AddCommand(newUsersUpdatePhoneCommand())
	cmd.AddCommand(newUsersGetPrefsCommand())
	cmd.AddCommand(newUsersUpdatePrefsCommand())
	cmd.AddCommand(newUsersListSessionsCommand())
	cmd.AddCommand(newUsersCreateSessionCommand())
	cmd.AddCommand(newUsersDeleteSessionsCommand())
	cmd.AddCommand(newUsersDeleteSessionCommand())
	cmd.AddCommand(newUsersUpdateStatusCommand())
	cmd.AddCommand(newUsersListTargetsCommand())
	cmd.AddCommand(newUsersCreateTargetCommand())
	cmd.AddCommand(newUsersGetTargetCommand())
	cmd.AddCommand(newUsersUpdateTargetCommand())
	cmd.AddCommand(newUsersDeleteTargetCommand())
	cmd.AddCommand(newUsersCreateTokenCommand())
	cmd.AddCommand(newUsersUpdateEmailVerificationCommand())
	cmd.AddCommand(newUsersUpdatePhoneVerificationCommand())

	return cmd
}

func newUsersListCommand() *cobra.Command {
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
		Short: "Get a list of all the project's users. You can use the query params to filter your results.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

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
			options := []users.ListOption{}
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

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, email, phone, status, passwordUpdate, registration, emailVerification, phoneVerification, labels, impersonator, accessedAt")
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

func newUsersCreateCommand() *cobra.Command {
	var userId string
	var email string
	var phone string
	var password string
	var name string

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create a new user.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []users.CreateOption{}
			if cmd.Flags().Changed("email") {
				options = append(options, service.WithCreateEmail(email))
			}
			if cmd.Flags().Changed("phone") {
				options = append(options, service.WithCreatePhone(phone))
			}
			if cmd.Flags().Changed("password") {
				options = append(options, service.WithCreatePassword(password))
			}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithCreateName(name))
			}

			result, err := service.Create(userId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&email, "email", "", "User email.")
	cmd.Flags().StringVar(&phone, "phone", "", "Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.")
	cmd.Flags().StringVar(&password, "password", "", "Plain text user password. Must be at least 8 chars.")
	cmd.Flags().StringVar(&name, "name", "", "User name. Max length: 128 chars.")
	return cmd
}

func newUsersCreateArgon2UserCommand() *cobra.Command {
	var userId string
	var email string
	var password string
	var name string

	cmd := &cobra.Command{
		Use:   "create-argon-2-user",
		Short: "Create a new user. Password provided must be hashed with the Argon2 (https://en.wikipedia.org/wiki/Argon2) algorithm. Use the POST /users (https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []users.CreateArgon2UserOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithCreateArgon2UserName(name))
			}

			result, err := service.CreateArgon2User(userId, email, password, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&email, "email", "", "User email.")
	_ = cmd.MarkFlagRequired("email")
	cmd.Flags().StringVar(&password, "password", "", "User password hashed using Argon2.")
	_ = cmd.MarkFlagRequired("password")
	cmd.Flags().StringVar(&name, "name", "", "User name. Max length: 128 chars.")
	return cmd
}

func newUsersCreateBcryptUserCommand() *cobra.Command {
	var userId string
	var email string
	var password string
	var name string

	cmd := &cobra.Command{
		Use:   "create-bcrypt-user",
		Short: "Create a new user. Password provided must be hashed with the Bcrypt (https://en.wikipedia.org/wiki/Bcrypt) algorithm. Use the POST /users (https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []users.CreateBcryptUserOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithCreateBcryptUserName(name))
			}

			result, err := service.CreateBcryptUser(userId, email, password, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&email, "email", "", "User email.")
	_ = cmd.MarkFlagRequired("email")
	cmd.Flags().StringVar(&password, "password", "", "User password hashed using Bcrypt.")
	_ = cmd.MarkFlagRequired("password")
	cmd.Flags().StringVar(&name, "name", "", "User name. Max length: 128 chars.")
	return cmd
}

func newUsersListIdentitiesCommand() *cobra.Command {
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
		Use:   "list-identities",
		Short: "Get identities for all users.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

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
			options := []users.ListIdentitiesOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListIdentitiesQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListIdentitiesSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListIdentitiesTotal(total))
			}

			result, err := service.ListIdentities(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, provider, providerUid, providerEmail, providerAccessTokenExpiry")
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

func newUsersDeleteIdentityCommand() *cobra.Command {
	var identityId string

	cmd := &cobra.Command{
		Use:   "delete-identity",
		Short: "Delete an identity by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.DeleteIdentity(identityId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&identityId, "identity-id", "", "Identity ID.")
	_ = cmd.MarkFlagRequired("identity-id")
	return cmd
}

func newUsersCreateMD5UserCommand() *cobra.Command {
	var userId string
	var email string
	var password string
	var name string

	cmd := &cobra.Command{
		Use:   "create-md-5-user",
		Short: "Create a new user. Password provided must be hashed with the MD5 (https://en.wikipedia.org/wiki/MD5) algorithm. Use the POST /users (https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []users.CreateMD5UserOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithCreateMD5UserName(name))
			}

			result, err := service.CreateMD5User(userId, email, password, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&email, "email", "", "User email.")
	_ = cmd.MarkFlagRequired("email")
	cmd.Flags().StringVar(&password, "password", "", "User password hashed using MD5.")
	_ = cmd.MarkFlagRequired("password")
	cmd.Flags().StringVar(&name, "name", "", "User name. Max length: 128 chars.")
	return cmd
}

func newUsersCreatePHPassUserCommand() *cobra.Command {
	var userId string
	var email string
	var password string
	var name string

	cmd := &cobra.Command{
		Use:   "create-ph-pass-user",
		Short: "Create a new user. Password provided must be hashed with the PHPass (https://www.openwall.com/phpass/) algorithm. Use the POST /users (https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []users.CreatePHPassUserOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithCreatePHPassUserName(name))
			}

			result, err := service.CreatePHPassUser(userId, email, password, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID. Choose a custom ID or pass the string `ID.unique()`to auto generate it. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&email, "email", "", "User email.")
	_ = cmd.MarkFlagRequired("email")
	cmd.Flags().StringVar(&password, "password", "", "User password hashed using PHPass.")
	_ = cmd.MarkFlagRequired("password")
	cmd.Flags().StringVar(&name, "name", "", "User name. Max length: 128 chars.")
	return cmd
}

func newUsersCreateScryptUserCommand() *cobra.Command {
	var userId string
	var email string
	var password string
	var passwordSalt string
	var passwordCpu int
	var passwordMemory int
	var passwordParallel int
	var passwordLength int
	var name string

	cmd := &cobra.Command{
		Use:   "create-scrypt-user",
		Short: "Create a new user. Password provided must be hashed with the Scrypt (https://github.com/Tarsnap/scrypt) algorithm. Use the POST /users (https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []users.CreateScryptUserOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithCreateScryptUserName(name))
			}

			result, err := service.CreateScryptUser(userId, email, password, passwordSalt, passwordCpu, passwordMemory, passwordParallel, passwordLength, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&email, "email", "", "User email.")
	_ = cmd.MarkFlagRequired("email")
	cmd.Flags().StringVar(&password, "password", "", "User password hashed using Scrypt.")
	_ = cmd.MarkFlagRequired("password")
	cmd.Flags().StringVar(&passwordSalt, "password-salt", "", "Optional salt used to hash password.")
	_ = cmd.MarkFlagRequired("password-salt")
	cmd.Flags().IntVar(&passwordCpu, "password-cpu", 0, "Optional CPU cost used to hash password.")
	_ = cmd.MarkFlagRequired("password-cpu")
	cmd.Flags().IntVar(&passwordMemory, "password-memory", 0, "Optional memory cost used to hash password.")
	_ = cmd.MarkFlagRequired("password-memory")
	cmd.Flags().IntVar(&passwordParallel, "password-parallel", 0, "Optional parallelization cost used to hash password.")
	_ = cmd.MarkFlagRequired("password-parallel")
	cmd.Flags().IntVar(&passwordLength, "password-length", 0, "Optional hash length used to hash password.")
	_ = cmd.MarkFlagRequired("password-length")
	cmd.Flags().StringVar(&name, "name", "", "User name. Max length: 128 chars.")
	return cmd
}

func newUsersCreateScryptModifiedUserCommand() *cobra.Command {
	var userId string
	var email string
	var password string
	var passwordSalt string
	var passwordSaltSeparator string
	var passwordSignerKey string
	var name string

	cmd := &cobra.Command{
		Use:   "create-scrypt-modified-user",
		Short: "Create a new user. Password provided must be hashed with the Scrypt Modified (https://gist.github.com/Meldiron/eecf84a0225eccb5a378d45bb27462cc) algorithm. Use the POST /users (https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []users.CreateScryptModifiedUserOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithCreateScryptModifiedUserName(name))
			}

			result, err := service.CreateScryptModifiedUser(userId, email, password, passwordSalt, passwordSaltSeparator, passwordSignerKey, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&email, "email", "", "User email.")
	_ = cmd.MarkFlagRequired("email")
	cmd.Flags().StringVar(&password, "password", "", "User password hashed using Scrypt Modified.")
	_ = cmd.MarkFlagRequired("password")
	cmd.Flags().StringVar(&passwordSalt, "password-salt", "", "Salt used to hash password.")
	_ = cmd.MarkFlagRequired("password-salt")
	cmd.Flags().StringVar(&passwordSaltSeparator, "password-salt-separator", "", "Salt separator used to hash password.")
	_ = cmd.MarkFlagRequired("password-salt-separator")
	cmd.Flags().StringVar(&passwordSignerKey, "password-signer-key", "", "Signer key used to hash password.")
	_ = cmd.MarkFlagRequired("password-signer-key")
	cmd.Flags().StringVar(&name, "name", "", "User name. Max length: 128 chars.")
	return cmd
}

func newUsersCreateSHAUserCommand() *cobra.Command {
	var userId string
	var email string
	var password string
	var passwordVersion string
	var name string

	cmd := &cobra.Command{
		Use:   "create-sha-user",
		Short: "Create a new user. Password provided must be hashed with the SHA (https://en.wikipedia.org/wiki/Secure_Hash_Algorithm) algorithm. Use the POST /users (https://appwrite.io/docs/server/users#usersCreate) endpoint to create users with a plain text password.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []users.CreateSHAUserOption{}
			if cmd.Flags().Changed("password-version") {
				options = append(options, service.WithCreateSHAUserPasswordVersion(passwordVersion))
			}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithCreateSHAUserName(name))
			}

			result, err := service.CreateSHAUser(userId, email, password, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&email, "email", "", "User email.")
	_ = cmd.MarkFlagRequired("email")
	cmd.Flags().StringVar(&password, "password", "", "User password hashed using SHA.")
	_ = cmd.MarkFlagRequired("password")
	cmd.Flags().StringVar(&passwordVersion, "password-version", "", "Optional SHA version used to hash password. Allowed values are: 'sha1', 'sha224', 'sha256', 'sha384', 'sha512/224', 'sha512/256', 'sha512', 'sha3-224', 'sha3-256', 'sha3-384', 'sha3-512'")
	cmd.Flags().StringVar(&name, "name", "", "User name. Max length: 128 chars.")
	return cmd
}

func newUsersGetCommand() *cobra.Command {
	var userId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a user by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.Get(userId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	return cmd
}

func newUsersDeleteCommand() *cobra.Command {
	var userId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a user by its unique ID, thereby releasing it's ID. Since ID is released and can be reused, all user-related resources like documents or storage files should be deleted before user deletion. If you want to keep ID reserved, use the updateStatus (https://appwrite.io/docs/server/users#usersUpdateStatus) endpoint instead.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.Delete(userId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	return cmd
}

func newUsersUpdateEmailCommand() *cobra.Command {
	var userId string
	var email string

	cmd := &cobra.Command{
		Use:   "update-email",
		Short: "Update the user email by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.UpdateEmail(userId, email)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&email, "email", "", "User email.")
	_ = cmd.MarkFlagRequired("email")
	return cmd
}

func newUsersUpdateImpersonatorCommand() *cobra.Command {
	var userId string
	var impersonator bool

	cmd := &cobra.Command{
		Use:   "update-impersonator",
		Short: "Enable or disable whether a user can impersonate other users. When impersonation headers are used, the request runs as the target user for API behavior, while internal audit logs still attribute the action to the original impersonator and store the impersonated target details only in internal audit payload data.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.UpdateImpersonator(userId, impersonator)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().BoolVar(&impersonator, "impersonator", false, "Whether the user can impersonate other users. When true, the user can browse project users to choose a target and can pass impersonation headers to act as that user. Internal audit logs still attribute impersonated actions to the original impersonator and store the target user details only in internal audit payload data.")
	_ = cmd.MarkFlagRequired("impersonator")
	return cmd
}

func newUsersCreateJWTCommand() *cobra.Command {
	var userId string
	var sessionId string
	var duration int

	cmd := &cobra.Command{
		Use:   "create-jwt",
		Short: "Use this endpoint to create a JSON Web Token for user by its unique ID. You can use the resulting JWT to authenticate on behalf of the user. The JWT secret will become invalid if the session it uses gets deleted.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []users.CreateJWTOption{}
			if cmd.Flags().Changed("session-id") {
				options = append(options, service.WithCreateJWTSessionId(sessionId))
			}
			if cmd.Flags().Changed("duration") {
				options = append(options, service.WithCreateJWTDuration(duration))
			}

			result, err := service.CreateJWT(userId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&sessionId, "session-id", "", "Session ID. Use the string 'recent' to use the most recent session. Defaults to the most recent session.")
	cmd.Flags().IntVar(&duration, "duration", 0, "Time in seconds before JWT expires. Default duration is 900 seconds, and maximum is 3600 seconds.")
	return cmd
}

func newUsersUpdateLabelsCommand() *cobra.Command {
	var userId string
	var labels []string

	cmd := &cobra.Command{
		Use:   "update-labels",
		Short: "Update the user labels by its unique ID. \n\nLabels can be used to grant access to resources. While teams are a way for user's to share access to a resource, labels can be defined by the developer to grant access without an invitation. See the Permissions docs (https://appwrite.io/docs/permissions) for more info.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.UpdateLabels(userId, labels)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringArrayVar(&labels, "labels", nil, "Array of user labels. Replaces the previous labels. Maximum of 1000 labels are allowed, each up to 36 alphanumeric characters long.")
	_ = cmd.MarkFlagRequired("labels")
	return cmd
}

func newUsersListLogsCommand() *cobra.Command {
	var userId string
	var queries []string
	var total bool
	var limit int
	var offset int

	cmd := &cobra.Command{
		Use:   "list-logs",
		Short: "Get the user activity logs list by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			queries, err := query.Build(query.Options{
				Queries: queries,
				Limit:   app.FlagInt(cmd, "limit", limit),
				Offset:  app.FlagInt(cmd, "offset", offset),
			})
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []users.ListLogsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListLogsQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListLogsTotal(total))
			}

			result, err := service.ListLogs(userId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Only supported methods are limit and offset")
	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
	cmd.Flags().IntVar(&limit, "limit", 0, "Maximum number of results to return.")
	cmd.Flags().IntVar(&offset, "offset", 0, "Number of results to skip.")
	return cmd
}

func newUsersListMembershipsCommand() *cobra.Command {
	var userId string
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
		Use:   "list-memberships",
		Short: "Get the user membership list by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

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
			options := []users.ListMembershipsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListMembershipsQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListMembershipsSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListMembershipsTotal(total))
			}

			result, err := service.ListMemberships(userId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, teamId, invited, joined, confirm, roles")
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

func newUsersUpdateMfaCommand() *cobra.Command {
	var userId string
	var mfa bool

	cmd := &cobra.Command{
		Use:   "update-mfa",
		Short: "Enable or disable MFA on a user account.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.UpdateMfa(userId, mfa)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().BoolVar(&mfa, "mfa", false, "Enable or disable MFA.")
	_ = cmd.MarkFlagRequired("mfa")
	return cmd
}

func newUsersDeleteMfaAuthenticatorCommand() *cobra.Command {
	var userId string
	var typeArg string

	cmd := &cobra.Command{
		Use:   "delete-mfa-authenticator",
		Short: "Delete an authenticator app.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.DeleteMfaAuthenticator(userId, typeArg)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&typeArg, "type", "", "Type of authenticator.")
	_ = cmd.MarkFlagRequired("type")
	return cmd
}

func newUsersListMfaFactorsCommand() *cobra.Command {
	var userId string

	cmd := &cobra.Command{
		Use:   "list-mfa-factors",
		Short: "List the factors available on the account to be used as a MFA challange.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.ListMfaFactors(userId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	return cmd
}

func newUsersGetMfaRecoveryCodesCommand() *cobra.Command {
	var userId string

	cmd := &cobra.Command{
		Use:   "get-mfa-recovery-codes",
		Short: "Get recovery codes that can be used as backup for MFA flow by User ID. Before getting codes, they must be generated using createMfaRecoveryCodes method.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.GetMfaRecoveryCodes(userId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	return cmd
}

func newUsersUpdateMfaRecoveryCodesCommand() *cobra.Command {
	var userId string

	cmd := &cobra.Command{
		Use:   "update-mfa-recovery-codes",
		Short: "Regenerate recovery codes that can be used as backup for MFA flow by User ID. Before regenerating codes, they must be first generated using createMfaRecoveryCodes method.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.UpdateMfaRecoveryCodes(userId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	return cmd
}

func newUsersCreateMfaRecoveryCodesCommand() *cobra.Command {
	var userId string

	cmd := &cobra.Command{
		Use:   "create-mfa-recovery-codes",
		Short: "Generate recovery codes used as backup for MFA flow for User ID. Recovery codes can be used as a MFA verification type in createMfaChallenge method by client SDK.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.CreateMfaRecoveryCodes(userId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	return cmd
}

func newUsersUpdateNameCommand() *cobra.Command {
	var userId string
	var name string

	cmd := &cobra.Command{
		Use:   "update-name",
		Short: "Update the user name by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.UpdateName(userId, name)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&name, "name", "", "User name. Max length: 128 chars.")
	_ = cmd.MarkFlagRequired("name")
	return cmd
}

func newUsersUpdatePasswordCommand() *cobra.Command {
	var userId string
	var password string

	cmd := &cobra.Command{
		Use:   "update-password",
		Short: "Update the user password by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.UpdatePassword(userId, password)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&password, "password", "", "New user password. Must be at least 8 chars.")
	_ = cmd.MarkFlagRequired("password")
	return cmd
}

func newUsersUpdatePhoneCommand() *cobra.Command {
	var userId string
	var number string

	cmd := &cobra.Command{
		Use:   "update-phone",
		Short: "Update the user phone by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.UpdatePhone(userId, number)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&number, "number", "", "User phone number.")
	_ = cmd.MarkFlagRequired("number")
	return cmd
}

func newUsersGetPrefsCommand() *cobra.Command {
	var userId string

	cmd := &cobra.Command{
		Use:   "get-prefs",
		Short: "Get the user preferences by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.GetPrefs(userId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	return cmd
}

func newUsersUpdatePrefsCommand() *cobra.Command {
	var userId string
	var prefs string

	cmd := &cobra.Command{
		Use:   "update-prefs",
		Short: "Update the user preferences by its unique ID. The object you pass is stored as is, and replaces any previous value. The maximum allowed prefs size is 64kB and throws error if exceeded.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)
			prefsValue, err := app.JSONObject(prefs)
			if err != nil {
				return err
			}

			result, err := service.UpdatePrefs(userId, prefsValue)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&prefs, "prefs", "", "Prefs key-value JSON object.")
	_ = cmd.MarkFlagRequired("prefs")
	return cmd
}

func newUsersListSessionsCommand() *cobra.Command {
	var userId string
	var total bool

	cmd := &cobra.Command{
		Use:   "list-sessions",
		Short: "Get the user sessions list by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []users.ListSessionsOption{}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListSessionsTotal(total))
			}

			result, err := service.ListSessions(userId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().BoolVar(&total, "total", false, "When set to false, the total count returned will be 0 and will not be calculated.")
	cmd.Flags().Lookup("total").NoOptDefVal = "true"
	return cmd
}

func newUsersCreateSessionCommand() *cobra.Command {
	var userId string

	cmd := &cobra.Command{
		Use:   "create-session",
		Short: "Creates a session for a user. Returns an immediately usable session object.\n\nIf you want to generate a token for a custom authentication flow, use the POST /users/{userId}/tokens (https://appwrite.io/docs/server/users#createToken) endpoint.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.CreateSession(userId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("user-id")
	return cmd
}

func newUsersDeleteSessionsCommand() *cobra.Command {
	var userId string

	cmd := &cobra.Command{
		Use:   "delete-sessions",
		Short: "Delete all user's sessions by using the user's unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.DeleteSessions(userId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	return cmd
}

func newUsersDeleteSessionCommand() *cobra.Command {
	var userId string
	var sessionId string

	cmd := &cobra.Command{
		Use:   "delete-session",
		Short: "Delete a user sessions by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.DeleteSession(userId, sessionId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&sessionId, "session-id", "", "Session ID.")
	_ = cmd.MarkFlagRequired("session-id")
	return cmd
}

func newUsersUpdateStatusCommand() *cobra.Command {
	var userId string
	var status bool

	cmd := &cobra.Command{
		Use:   "update-status",
		Short: "Update the user status by its unique ID. Use this endpoint as an alternative to deleting a user if you want to keep user's ID reserved.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.UpdateStatus(userId, status)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().BoolVar(&status, "status", false, "User Status. To activate the user pass `true` and to block the user pass `false`.")
	_ = cmd.MarkFlagRequired("status")
	return cmd
}

func newUsersListTargetsCommand() *cobra.Command {
	var userId string
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
		Use:   "list-targets",
		Short: "List the messaging targets that are associated with a user.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

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
			options := []users.ListTargetsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListTargetsQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListTargetsTotal(total))
			}

			result, err := service.ListTargets(userId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: userId, providerId, identifier, providerType")
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

func newUsersCreateTargetCommand() *cobra.Command {
	var userId string
	var targetId string
	var providerType string
	var identifier string
	var providerId string
	var name string

	cmd := &cobra.Command{
		Use:   "create-target",
		Short: "Create a messaging target.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []users.CreateTargetOption{}
			if cmd.Flags().Changed("provider-id") {
				options = append(options, service.WithCreateTargetProviderId(providerId))
			}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithCreateTargetName(name))
			}

			result, err := service.CreateTarget(userId, targetId, providerType, identifier, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&targetId, "target-id", "", "Target ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("target-id")
	cmd.Flags().StringVar(&providerType, "provider-type", "", "The target provider type. Can be one of the following: `email`, `sms` or `push`.")
	_ = cmd.MarkFlagRequired("provider-type")
	cmd.Flags().StringVar(&identifier, "identifier", "", "The target identifier (token, email, phone etc.)")
	_ = cmd.MarkFlagRequired("identifier")
	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID. Message will be sent to this target from the specified provider ID. If no provider ID is set the first setup provider will be used.")
	cmd.Flags().StringVar(&name, "name", "", "Target name. Max length: 128 chars. For example: My Awesome App Galaxy S23.")
	return cmd
}

func newUsersGetTargetCommand() *cobra.Command {
	var userId string
	var targetId string

	cmd := &cobra.Command{
		Use:   "get-target",
		Short: "Get a user's push notification target by ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.GetTarget(userId, targetId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&targetId, "target-id", "", "Target ID.")
	_ = cmd.MarkFlagRequired("target-id")
	return cmd
}

func newUsersUpdateTargetCommand() *cobra.Command {
	var userId string
	var targetId string
	var identifier string
	var providerId string
	var name string

	cmd := &cobra.Command{
		Use:   "update-target",
		Short: "Update a messaging target.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []users.UpdateTargetOption{}
			if cmd.Flags().Changed("identifier") {
				options = append(options, service.WithUpdateTargetIdentifier(identifier))
			}
			if cmd.Flags().Changed("provider-id") {
				options = append(options, service.WithUpdateTargetProviderId(providerId))
			}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateTargetName(name))
			}

			result, err := service.UpdateTarget(userId, targetId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&targetId, "target-id", "", "Target ID.")
	_ = cmd.MarkFlagRequired("target-id")
	cmd.Flags().StringVar(&identifier, "identifier", "", "The target identifier (token, email, phone etc.)")
	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID. Message will be sent to this target from the specified provider ID. If no provider ID is set the first setup provider will be used.")
	cmd.Flags().StringVar(&name, "name", "", "Target name. Max length: 128 chars. For example: My Awesome App Galaxy S23.")
	return cmd
}

func newUsersDeleteTargetCommand() *cobra.Command {
	var userId string
	var targetId string

	cmd := &cobra.Command{
		Use:   "delete-target",
		Short: "Delete a messaging target.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.DeleteTarget(userId, targetId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().StringVar(&targetId, "target-id", "", "Target ID.")
	_ = cmd.MarkFlagRequired("target-id")
	return cmd
}

func newUsersCreateTokenCommand() *cobra.Command {
	var userId string
	var length int
	var expire int

	cmd := &cobra.Command{
		Use:   "create-token",
		Short: "Returns a token with a secret key for creating a session. Use the user ID and secret and submit a request to the PUT /account/sessions/token (https://appwrite.io/docs/references/cloud/client-web/account#createSession) endpoint to complete the login process.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []users.CreateTokenOption{}
			if cmd.Flags().Changed("length") {
				options = append(options, service.WithCreateTokenLength(length))
			}
			if cmd.Flags().Changed("expire") {
				options = append(options, service.WithCreateTokenExpire(expire))
			}

			result, err := service.CreateToken(userId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().IntVar(&length, "length", 0, "Token length in characters. The default length is 6 characters")
	cmd.Flags().IntVar(&expire, "expire", 0, "Token expiration period in seconds. The default expiration is 15 minutes.")
	return cmd
}

func newUsersUpdateEmailVerificationCommand() *cobra.Command {
	var userId string
	var emailVerification bool

	cmd := &cobra.Command{
		Use:   "update-email-verification",
		Short: "Update the user email verification status by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.UpdateEmailVerification(userId, emailVerification)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().BoolVar(&emailVerification, "email-verification", false, "User email verification status.")
	_ = cmd.MarkFlagRequired("email-verification")
	return cmd
}

func newUsersUpdatePhoneVerificationCommand() *cobra.Command {
	var userId string
	var phoneVerification bool

	cmd := &cobra.Command{
		Use:   "update-phone-verification",
		Short: "Update the user phone verification status by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := users.New(client)

			result, err := service.UpdatePhoneVerification(userId, phoneVerification)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&userId, "user-id", "", "User ID.")
	_ = cmd.MarkFlagRequired("user-id")
	cmd.Flags().BoolVar(&phoneVerification, "phone-verification", false, "User phone verification status.")
	_ = cmd.MarkFlagRequired("phone-verification")
	return cmd
}
