package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/storage"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
)

// NewStorageCommand builds the `storage` command tree.
func NewStorageCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "storage",
		Short: "The Storage service allows you to manage your project files.",
	}

	cmd.AddCommand(newStorageListBucketsCommand())
	cmd.AddCommand(newStorageCreateBucketCommand())
	cmd.AddCommand(newStorageGetBucketCommand())
	cmd.AddCommand(newStorageUpdateBucketCommand())
	cmd.AddCommand(newStorageDeleteBucketCommand())
	cmd.AddCommand(newStorageListFilesCommand())
	cmd.AddCommand(newStorageCreateFileCommand())
	cmd.AddCommand(newStorageGetFileCommand())
	cmd.AddCommand(newStorageUpdateFileCommand())
	cmd.AddCommand(newStorageDeleteFileCommand())
	cmd.AddCommand(newStorageGetFileDownloadCommand())
	cmd.AddCommand(newStorageGetFilePreviewCommand())
	cmd.AddCommand(newStorageGetFileViewCommand())

	return cmd
}

func newStorageListBucketsCommand() *cobra.Command {
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
		Use:   "list-buckets",
		Short: "Get a list of all the storage buckets. You can use the query params to filter your results.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := storage.New(client)

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
			options := []storage.ListBucketsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListBucketsQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListBucketsSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListBucketsTotal(total))
			}

			result, err := service.ListBuckets(options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: enabled, name, fileSecurity, maximumFileSize, encryption, antivirus, transformations")
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

func newStorageCreateBucketCommand() *cobra.Command {
	var bucketId string
	var name string
	var permissions []string
	var fileSecurity bool
	var enabled bool
	var maximumFileSize int
	var allowedFileExtensions []string
	var compression string
	var encryption bool
	var antivirus bool
	var transformations bool

	cmd := &cobra.Command{
		Use:   "create-bucket",
		Short: "Create a new storage bucket.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := storage.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []storage.CreateBucketOption{}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithCreateBucketPermissions(permissions))
			}
			if cmd.Flags().Changed("file-security") {
				options = append(options, service.WithCreateBucketFileSecurity(fileSecurity))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateBucketEnabled(enabled))
			}
			if cmd.Flags().Changed("maximum-file-size") {
				options = append(options, service.WithCreateBucketMaximumFileSize(maximumFileSize))
			}
			if cmd.Flags().Changed("allowed-file-extensions") {
				options = append(options, service.WithCreateBucketAllowedFileExtensions(allowedFileExtensions))
			}
			if cmd.Flags().Changed("compression") {
				options = append(options, service.WithCreateBucketCompression(compression))
			}
			if cmd.Flags().Changed("encryption") {
				options = append(options, service.WithCreateBucketEncryption(encryption))
			}
			if cmd.Flags().Changed("antivirus") {
				options = append(options, service.WithCreateBucketAntivirus(antivirus))
			}
			if cmd.Flags().Changed("transformations") {
				options = append(options, service.WithCreateBucketTransformations(transformations))
			}

			result, err := service.CreateBucket(bucketId, name, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Unique Id. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("bucket-id")
	cmd.Flags().StringVar(&name, "name", "", "Bucket name")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permission strings. By default, no user is granted with any permissions. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().BoolVar(&fileSecurity, "file-security", false, "Enables configuring permissions for individual file. A user needs one of file or bucket level permissions to access a file. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().Lookup("file-security").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is bucket enabled? When set to 'disabled', users cannot access the files in this bucket but Server SDKs with and API key can still access the bucket. No files are lost when this is toggled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().IntVar(&maximumFileSize, "maximum-file-size", 0, "Maximum file size allowed in bytes. Maximum allowed value is 5GB.")
	cmd.Flags().StringArrayVar(&allowedFileExtensions, "allowed-file-extensions", nil, "Allowed file extensions. Maximum of 100 extensions are allowed, each 64 characters long.")
	cmd.Flags().StringVar(&compression, "compression", "", "Compression algorithm chosen for compression. Can be one of none,  gzip (https://en.wikipedia.org/wiki/Gzip), or zstd (https://en.wikipedia.org/wiki/Zstd), For file size above 20MB compression is skipped even if it's enabled")
	cmd.Flags().BoolVar(&encryption, "encryption", false, "Is encryption enabled? For file size above 20MB encryption is skipped even if it's enabled")
	cmd.Flags().Lookup("encryption").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&antivirus, "antivirus", false, "Is virus scanning enabled? For file size above 20MB AntiVirus scanning is skipped even if it's enabled")
	cmd.Flags().Lookup("antivirus").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&transformations, "transformations", false, "Are image transformations enabled?")
	cmd.Flags().Lookup("transformations").NoOptDefVal = "true"
	return cmd
}

func newStorageGetBucketCommand() *cobra.Command {
	var bucketId string

	cmd := &cobra.Command{
		Use:   "get-bucket",
		Short: "Get a storage bucket by its unique ID. This endpoint response returns a JSON object with the storage bucket metadata.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := storage.New(client)

			result, err := service.GetBucket(bucketId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Bucket unique ID.")
	_ = cmd.MarkFlagRequired("bucket-id")
	return cmd
}

func newStorageUpdateBucketCommand() *cobra.Command {
	var bucketId string
	var name string
	var permissions []string
	var fileSecurity bool
	var enabled bool
	var maximumFileSize int
	var allowedFileExtensions []string
	var compression string
	var encryption bool
	var antivirus bool
	var transformations bool

	cmd := &cobra.Command{
		Use:   "update-bucket",
		Short: "Update a storage bucket by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := storage.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []storage.UpdateBucketOption{}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithUpdateBucketPermissions(permissions))
			}
			if cmd.Flags().Changed("file-security") {
				options = append(options, service.WithUpdateBucketFileSecurity(fileSecurity))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateBucketEnabled(enabled))
			}
			if cmd.Flags().Changed("maximum-file-size") {
				options = append(options, service.WithUpdateBucketMaximumFileSize(maximumFileSize))
			}
			if cmd.Flags().Changed("allowed-file-extensions") {
				options = append(options, service.WithUpdateBucketAllowedFileExtensions(allowedFileExtensions))
			}
			if cmd.Flags().Changed("compression") {
				options = append(options, service.WithUpdateBucketCompression(compression))
			}
			if cmd.Flags().Changed("encryption") {
				options = append(options, service.WithUpdateBucketEncryption(encryption))
			}
			if cmd.Flags().Changed("antivirus") {
				options = append(options, service.WithUpdateBucketAntivirus(antivirus))
			}
			if cmd.Flags().Changed("transformations") {
				options = append(options, service.WithUpdateBucketTransformations(transformations))
			}

			result, err := service.UpdateBucket(bucketId, name, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Bucket unique ID.")
	_ = cmd.MarkFlagRequired("bucket-id")
	cmd.Flags().StringVar(&name, "name", "", "Bucket name")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permission strings. By default, the current permissions are inherited. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().BoolVar(&fileSecurity, "file-security", false, "Enables configuring permissions for individual file. A user needs one of file or bucket level permissions to access a file. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().Lookup("file-security").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Is bucket enabled? When set to 'disabled', users cannot access the files in this bucket but Server SDKs with and API key can still access the bucket. No files are lost when this is toggled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().IntVar(&maximumFileSize, "maximum-file-size", 0, "Maximum file size allowed in bytes. Maximum allowed value is 5GB.")
	cmd.Flags().StringArrayVar(&allowedFileExtensions, "allowed-file-extensions", nil, "Allowed file extensions. Maximum of 100 extensions are allowed, each 64 characters long.")
	cmd.Flags().StringVar(&compression, "compression", "", "Compression algorithm chosen for compression. Can be one of none, gzip (https://en.wikipedia.org/wiki/Gzip), or zstd (https://en.wikipedia.org/wiki/Zstd), For file size above 20MB compression is skipped even if it's enabled")
	cmd.Flags().BoolVar(&encryption, "encryption", false, "Is encryption enabled? For file size above 20MB encryption is skipped even if it's enabled")
	cmd.Flags().Lookup("encryption").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&antivirus, "antivirus", false, "Is virus scanning enabled? For file size above 20MB AntiVirus scanning is skipped even if it's enabled")
	cmd.Flags().Lookup("antivirus").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&transformations, "transformations", false, "Are image transformations enabled?")
	cmd.Flags().Lookup("transformations").NoOptDefVal = "true"
	return cmd
}

func newStorageDeleteBucketCommand() *cobra.Command {
	var bucketId string

	cmd := &cobra.Command{
		Use:   "delete-bucket",
		Short: "Delete a storage bucket by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := storage.New(client)

			result, err := service.DeleteBucket(bucketId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Bucket unique ID.")
	_ = cmd.MarkFlagRequired("bucket-id")
	return cmd
}

func newStorageListFilesCommand() *cobra.Command {
	var bucketId string
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
		Use:   "list-files",
		Short: "Get a list of all the user files. You can use the query params to filter your results.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := storage.New(client)

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
			options := []storage.ListFilesOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListFilesQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListFilesSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListFilesTotal(total))
			}

			result, err := service.ListFiles(bucketId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Storage bucket unique ID. You can create a new storage bucket using the Storage service server integration (https://appwrite.io/docs/server/storage#createBucket).")
	_ = cmd.MarkFlagRequired("bucket-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, folder, signature, mimeType, sizeOriginal, chunksTotal, chunksUploaded")
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

func newStorageCreateFileCommand() *cobra.Command {
	var bucketId string
	var fileId string
	var file string
	var permissions []string
	var folder string

	cmd := &cobra.Command{
		Use:   "create-file",
		Short: "Create a new file. Before using this route, you should create a new bucket resource using either a server integration (https://appwrite.io/docs/server/storage#storageCreateBucket) API or directly from your Appwrite console.\n\nLarger files should be uploaded using multiple requests with the content-range (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) header to send a partial request with a maximum supported chunk of `5MB`. The `content-range` header values should always be in bytes.\n\nWhen the first request is sent, the server will return the File object, and the subsequent part request must include the file's id in `x-appwrite-id` header to allow the server to know that the partial upload is for the existing file and not for a new one.\n\nIf you're creating a new file using one of the Appwrite SDKs, all the chunking logic will be managed by the SDK internally.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := storage.New(client)
			fileFile, err := app.InputFile(file)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []storage.CreateFileOption{}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithCreateFilePermissions(permissions))
			}
			if cmd.Flags().Changed("folder") {
				options = append(options, service.WithCreateFileFolder(folder))
			}

			result, err := service.CreateFile(bucketId, fileId, fileFile, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Storage bucket unique ID. You can create a new storage bucket using the Storage service server integration (https://appwrite.io/docs/server/storage#createBucket).")
	_ = cmd.MarkFlagRequired("bucket-id")
	cmd.Flags().StringVar(&fileId, "file-id", "", "File ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("file-id")
	cmd.Flags().StringVar(&file, "file", "", "Binary file. Appwrite SDKs provide helpers to handle file input. Learn about file input (https://appwrite.io/docs/products/storage/upload-download#input-file).")
	_ = cmd.MarkFlagRequired("file")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permission strings. By default, only the current user is granted all permissions. Learn more about permissions (https://appwrite.io/docs/permissions).")
	cmd.Flags().StringVar(&folder, "folder", "", "Virtual folder to place the file in, for example \"photos/2026\". Nest folders with `/`. Defaults to the bucket root.")
	return cmd
}

func newStorageGetFileCommand() *cobra.Command {
	var bucketId string
	var fileId string

	cmd := &cobra.Command{
		Use:   "get-file",
		Short: "Get a file by its unique ID. This endpoint response returns a JSON object with the file metadata.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := storage.New(client)

			result, err := service.GetFile(bucketId, fileId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Storage bucket unique ID. You can create a new storage bucket using the Storage service server integration (https://appwrite.io/docs/server/storage#createBucket).")
	_ = cmd.MarkFlagRequired("bucket-id")
	cmd.Flags().StringVar(&fileId, "file-id", "", "File ID.")
	_ = cmd.MarkFlagRequired("file-id")
	return cmd
}

func newStorageUpdateFileCommand() *cobra.Command {
	var bucketId string
	var fileId string
	var name string
	var permissions []string

	cmd := &cobra.Command{
		Use:   "update-file",
		Short: "Update a file by its unique ID. Only users with write permissions have access to update this resource.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := storage.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []storage.UpdateFileOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateFileName(name))
			}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithUpdateFilePermissions(permissions))
			}

			result, err := service.UpdateFile(bucketId, fileId, options...)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Bucket unique ID.")
	_ = cmd.MarkFlagRequired("bucket-id")
	cmd.Flags().StringVar(&fileId, "file-id", "", "File ID.")
	_ = cmd.MarkFlagRequired("file-id")
	cmd.Flags().StringVar(&name, "name", "", "File name.")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permission strings. By default, the current permissions are inherited. Learn more about permissions (https://appwrite.io/docs/permissions).")
	return cmd
}

func newStorageDeleteFileCommand() *cobra.Command {
	var bucketId string
	var fileId string

	cmd := &cobra.Command{
		Use:   "delete-file",
		Short: "Delete a file by its unique ID. Only users with write permissions have access to delete this resource.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := storage.New(client)

			result, err := service.DeleteFile(bucketId, fileId)
			if err != nil {
				return err
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Storage bucket unique ID. You can create a new storage bucket using the Storage service server integration (https://appwrite.io/docs/server/storage#createBucket).")
	_ = cmd.MarkFlagRequired("bucket-id")
	cmd.Flags().StringVar(&fileId, "file-id", "", "File ID.")
	_ = cmd.MarkFlagRequired("file-id")
	return cmd
}

func newStorageGetFileDownloadCommand() *cobra.Command {
	var bucketId string
	var fileId string
	var token string
	var destination string

	cmd := &cobra.Command{
		Use:   "get-file-download",
		Short: "Get a file content by its unique ID. The endpoint response return with a 'Content-Disposition: attachment' header that tells the browser to start downloading the file to user downloads directory.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := storage.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []storage.GetFileDownloadOption{}
			if cmd.Flags().Changed("token") {
				options = append(options, service.WithGetFileDownloadToken(token))
			}

			result, err := service.GetFileDownload(bucketId, fileId, options...)
			if err != nil {
				return err
			}

			// A location method returns the file bytes, not a URL. The
			// TypeScript fetches the URL itself; the SDK has already done that.
			return app.WriteFile(destination, result)
		},
	}

	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Storage bucket ID. You can create a new storage bucket using the Storage service server integration (https://appwrite.io/docs/server/storage#createBucket).")
	_ = cmd.MarkFlagRequired("bucket-id")
	cmd.Flags().StringVar(&fileId, "file-id", "", "File ID.")
	_ = cmd.MarkFlagRequired("file-id")
	cmd.Flags().StringVar(&token, "token", "", "File token for accessing this file.")
	cmd.Flags().StringVar(&destination, "destination", "", "Path to save the file to.")
	_ = cmd.MarkFlagRequired("destination")
	return cmd
}

func newStorageGetFilePreviewCommand() *cobra.Command {
	var bucketId string
	var fileId string
	var width int
	var height int
	var gravity string
	var quality int
	var borderWidth int
	var borderColor string
	var borderRadius int
	var opacity float64
	var rotation int
	var background string
	var output string
	var token string
	var destination string

	cmd := &cobra.Command{
		Use:   "get-file-preview",
		Short: "Get a file preview image. Currently, this method supports preview for image files (jpg, png, and gif), other supported formats, like pdf, docs, slides, and spreadsheets, will return the file icon image. You can also pass query string arguments for cutting and resizing your preview image. Preview is supported only for image files smaller than 10MB.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := storage.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []storage.GetFilePreviewOption{}
			if cmd.Flags().Changed("width") {
				options = append(options, service.WithGetFilePreviewWidth(width))
			}
			if cmd.Flags().Changed("height") {
				options = append(options, service.WithGetFilePreviewHeight(height))
			}
			if cmd.Flags().Changed("gravity") {
				options = append(options, service.WithGetFilePreviewGravity(gravity))
			}
			if cmd.Flags().Changed("quality") {
				options = append(options, service.WithGetFilePreviewQuality(quality))
			}
			if cmd.Flags().Changed("border-width") {
				options = append(options, service.WithGetFilePreviewBorderWidth(borderWidth))
			}
			if cmd.Flags().Changed("border-color") {
				options = append(options, service.WithGetFilePreviewBorderColor(borderColor))
			}
			if cmd.Flags().Changed("border-radius") {
				options = append(options, service.WithGetFilePreviewBorderRadius(borderRadius))
			}
			if cmd.Flags().Changed("opacity") {
				options = append(options, service.WithGetFilePreviewOpacity(opacity))
			}
			if cmd.Flags().Changed("rotation") {
				options = append(options, service.WithGetFilePreviewRotation(rotation))
			}
			if cmd.Flags().Changed("background") {
				options = append(options, service.WithGetFilePreviewBackground(background))
			}
			if cmd.Flags().Changed("output") {
				options = append(options, service.WithGetFilePreviewOutput(output))
			}
			if cmd.Flags().Changed("token") {
				options = append(options, service.WithGetFilePreviewToken(token))
			}

			result, err := service.GetFilePreview(bucketId, fileId, options...)
			if err != nil {
				return err
			}

			// A location method returns the file bytes, not a URL. The
			// TypeScript fetches the URL itself; the SDK has already done that.
			return app.WriteFile(destination, result)
		},
	}

	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Storage bucket unique ID. You can create a new storage bucket using the Storage service server integration (https://appwrite.io/docs/server/storage#createBucket).")
	_ = cmd.MarkFlagRequired("bucket-id")
	cmd.Flags().StringVar(&fileId, "file-id", "", "File ID")
	_ = cmd.MarkFlagRequired("file-id")
	cmd.Flags().IntVar(&width, "width", 0, "Resize preview image width, Pass an integer between 0 to 4000.")
	cmd.Flags().IntVar(&height, "height", 0, "Resize preview image height, Pass an integer between 0 to 4000.")
	cmd.Flags().StringVar(&gravity, "gravity", "", "Image crop gravity. Can be one of center,top-left,top,top-right,left,right,bottom-left,bottom,bottom-right")
	cmd.Flags().IntVar(&quality, "quality", 0, "Preview image quality. Pass an integer between 0 to 100. Defaults to keep existing image quality.")
	cmd.Flags().IntVar(&borderWidth, "border-width", 0, "Preview image border in pixels. Pass an integer between 0 to 100. Defaults to 0.")
	cmd.Flags().StringVar(&borderColor, "border-color", "", "Preview image border color. Use a valid HEX color, no # is needed for prefix.")
	cmd.Flags().IntVar(&borderRadius, "border-radius", 0, "Preview image border radius in pixels. Pass an integer between 0 to 4000.")
	cmd.Flags().Float64Var(&opacity, "opacity", 0, "Preview image opacity. Only works with images having an alpha channel (like png). Pass a number between 0 to 1.")
	cmd.Flags().IntVar(&rotation, "rotation", 0, "Preview image rotation in degrees. Pass an integer between -360 and 360.")
	cmd.Flags().StringVar(&background, "background", "", "Preview image background color. Only works with transparent images (png). Use a valid HEX color, no # is needed for prefix.")
	cmd.Flags().StringVar(&output, "output", "", "Output format type (jpeg, jpg, png, gif and webp).")
	cmd.Flags().StringVar(&token, "token", "", "File token for accessing this file.")
	cmd.Flags().StringVar(&destination, "destination", "", "Path to save the file to.")
	_ = cmd.MarkFlagRequired("destination")
	return cmd
}

func newStorageGetFileViewCommand() *cobra.Command {
	var bucketId string
	var fileId string
	var token string
	var destination string

	cmd := &cobra.Command{
		Use:   "get-file-view",
		Short: "Get a file content by its unique ID. This endpoint is similar to the download method but returns with no  'Content-Disposition: attachment' header.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := storage.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []storage.GetFileViewOption{}
			if cmd.Flags().Changed("token") {
				options = append(options, service.WithGetFileViewToken(token))
			}

			result, err := service.GetFileView(bucketId, fileId, options...)
			if err != nil {
				return err
			}

			// A location method returns the file bytes, not a URL. The
			// TypeScript fetches the URL itself; the SDK has already done that.
			return app.WriteFile(destination, result)
		},
	}

	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Storage bucket unique ID. You can create a new storage bucket using the Storage service server integration (https://appwrite.io/docs/server/storage#createBucket).")
	_ = cmd.MarkFlagRequired("bucket-id")
	cmd.Flags().StringVar(&fileId, "file-id", "", "File ID.")
	_ = cmd.MarkFlagRequired("file-id")
	cmd.Flags().StringVar(&token, "token", "", "File token for accessing this file.")
	cmd.Flags().StringVar(&destination, "destination", "", "Path to save the file to.")
	_ = cmd.MarkFlagRequired("destination")
	return cmd
}
