package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v7/videos"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewVideosCommand builds the `videos` command tree.
func NewVideosCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "videos",
		Short: "The Videos service allows you to transcode video files into adaptive HLS and DASH streams.",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			return cmd.Help()
		},
	}

	cmd.AddCommand(newVideosListCommand())
	cmd.AddCommand(newVideosCreateCommand())
	cmd.AddCommand(newVideosListCodecsCommand())
	cmd.AddCommand(newVideosGetCommand())
	cmd.AddCommand(newVideosUpdateCommand())
	cmd.AddCommand(newVideosDeleteCommand())
	cmd.AddCommand(newVideosListCaptionsCommand())
	cmd.AddCommand(newVideosCreateCaptionCommand())
	cmd.AddCommand(newVideosUpdateCaptionCommand())
	cmd.AddCommand(newVideosDeleteCaptionCommand())
	cmd.AddCommand(newVideosGetCmafHlsManifestCommand())
	cmd.AddCommand(newVideosGetCmafDashManifestCommand())
	cmd.AddCommand(newVideosGetDashManifestCommand())
	cmd.AddCommand(newVideosGetHlsManifestCommand())
	cmd.AddCommand(newVideosGetCaptionManifestCommand())
	cmd.AddCommand(newVideosListRenditionsCommand())
	cmd.AddCommand(newVideosCreateRenditionCommand())
	cmd.AddCommand(newVideosGetRenditionCommand())
	cmd.AddCommand(newVideosDeleteRenditionCommand())
	cmd.AddCommand(newVideosGetThumbnailCommand())
	cmd.AddCommand(newVideosGetTimelineCommand())

	return cmd
}

func newVideosListCommand() *cobra.Command {
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
		Use:   "list",
		Short: "Get a list of videos in the current project. Sessions receive only videos they can read according to each video's `$permissions`. API keys and admins receive the full project catalog. Playback uses the same document read ACL plus the `videos.play` (or `videos.read`) scope: a guest can stream a video that grants `read(\"any\")` or `read(\"guests\")` even though guests lack `videos.read` and will not see it in this list.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

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

			// An unset flag must be omitted, not sent as its zero value.
			options := []videos.ListOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListQueries(app.StringSlice(queries)))
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

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: bucketId, fileId, name, size, format, duration, width, height, videoCodec, videoBitRate, audioCodec, audioBitRate, search. Repeat the flag for each value.")
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

func newVideosCreateCommand() *cobra.Command {
	var videoId string
	var bucketId string
	var fileId string
	var name string
	var permissions []string

	cmd := &cobra.Command{
		Use:   "create",
		Short: "Create a video resource from an existing file in a storage bucket. The source file must be a video or audio file, and the caller must be able to read that file. Creating a video stores the document and queues timeline generation. The worker downloads the source, probes metadata, extracts embedded captions once, and deletes its working copy when finished. Sources with a video track also get a thumbnail timeline. Call create-rendition to package a streaming output.\n\nAn optional `name` defaults to the source file name. An optional `permissions` array sets the video document ACL (list, get, update, delete, manage child resources, and playback). By default, only the current user is granted all permissions; API keys and admins create with empty permissions when omitted. Guests with `videos.play` can stream when the video grants them read (`read(\"any\")` or `read(\"guests\")`).\n\nUploaded caption files stay listed alongside auto-extracted tracks for the same language; when the current default is an auto-extracted track with that code, the upload takes the default flag.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []videos.CreateOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithCreateName(name))
			}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithCreatePermissions(app.StringSlice(permissions)))
			}

			result, err := service.Create(videoId, bucketId, fileId, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("video-id")
	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Storage bucket unique ID holding the source file.")
	_ = cmd.MarkFlagRequired("bucket-id")
	cmd.Flags().StringVar(&fileId, "file-id", "", "Source file unique ID.")
	_ = cmd.MarkFlagRequired("file-id")
	cmd.Flags().StringVar(&name, "name", "", "Video name. Defaults to the source file name. Max length: 2048 chars.")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permission strings. By default, only the current user is granted all permissions. Learn more about permissions (https://appwrite.io/docs/permissions). Repeat the flag for each value.")
	return cmd
}

func newVideosListCodecsCommand() *cobra.Command {

	cmd := &cobra.Command{
		Use:   "list-codecs",
		Short: "Get a list of video encode codecs enabled on this instance. Each codec includes the output formats it may be packaged into.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			result, err := service.ListCodecs()
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	return cmd
}

func newVideosGetCommand() *cobra.Command {
	var videoId string

	cmd := &cobra.Command{
		Use:   "get",
		Short: "Get a video by its unique ID. This endpoint response returns a JSON object with the video metadata.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			result, err := service.Get(videoId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	return cmd
}

func newVideosUpdateCommand() *cobra.Command {
	var videoId string
	var name string
	var permissions []string

	cmd := &cobra.Command{
		Use:   "update",
		Short: "Update a video's name, permissions, or both. Only the fields you pass are changed: omit `name` to keep the current name and `permissions` to keep the current ACL. The caller must hold update permission on the video document. The source file cannot be replaced; delete the video and create a new one to point at a different file.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []videos.UpdateOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateName(name))
			}
			if cmd.Flags().Changed("permissions") {
				options = append(options, service.WithUpdatePermissions(app.StringSlice(permissions)))
			}

			result, err := service.Update(videoId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	cmd.Flags().StringVar(&name, "name", "", "Video name. Max length: 2048 chars.")
	cmd.Flags().StringArrayVar(&permissions, "permissions", nil, "An array of permission strings. By default, the current permissions are inherited. Learn more about permissions (https://appwrite.io/docs/permissions). Repeat the flag for each value.")
	return cmd
}

func newVideosDeleteCommand() *cobra.Command {
	var videoId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a video by its unique ID. This also removes every rendition, caption, preview and transcoded artifact derived from it. Fails with `video_rendition_in_progress` while a rendition is started or ended, unless that rendition has not been updated within the rendition retention window. Fails with `video_timeline_in_progress` while the video's timeline is being generated, unless the video has not been updated within the same window.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			result, err := service.Delete(videoId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	return cmd
}

func newVideosListCaptionsCommand() *cobra.Command {
	var videoId string
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
		Use:   "list-captions",
		Short: "Get a list of all the caption tracks attached to a video. You can use the query params to filter your results.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

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

			// An unset flag must be omitted, not sent as its zero value.
			options := []videos.ListCaptionsOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListCaptionsQueries(app.StringSlice(queries)))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListCaptionsTotal(total))
			}

			result, err := service.ListCaptions(videoId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, language, default, status, size, bucketId, fileId. Repeat the flag for each value.")
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

func newVideosCreateCaptionCommand() *cobra.Command {
	var videoId string
	var bucketId string
	var fileId string
	var name string
	var language string
	var xdefault bool

	cmd := &cobra.Command{
		Use:   "create-caption",
		Short: "Add a caption track to a video from a WebVTT or SubRip file in a storage bucket. The file is normalised to WebVTT and segmented in the background. Subscribe to `videos.[videoId].captions.[captionId].update` for `started`, `ready`, and `error` status changes instead of only polling the caption document.\n\nUploaded tracks are listed alongside auto-extracted embedded tracks (`embedded: true`). When the current default is an auto-extracted track for the same language code, the upload takes the default flag so players pick the authored file first. Auto-extracted tracks are never removed automatically — delete a track explicitly to remove it. Extraction runs once per video, so a deleted extracted track is not re-created.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []videos.CreateCaptionOption{}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithCreateCaptionDefault(xdefault))
			}

			result, err := service.CreateCaption(videoId, bucketId, fileId, name, language, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Storage bucket unique ID holding the caption file.")
	_ = cmd.MarkFlagRequired("bucket-id")
	cmd.Flags().StringVar(&fileId, "file-id", "", "Caption file unique ID.")
	_ = cmd.MarkFlagRequired("file-id")
	cmd.Flags().StringVar(&name, "name", "", "Caption display name. Allowed characters: a-z, A-Z, 0-9, space, and - . , ( ) _ '")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&language, "language", "", "Caption ISO 639-2 three-letter language code.")
	_ = cmd.MarkFlagRequired("language")
	cmd.Flags().BoolVar(&xdefault, "xdefault", false, "Make this the default caption track for the video.")
	cmd.Flags().Lookup("xdefault").NoOptDefVal = "true"
	return cmd
}

func newVideosUpdateCaptionCommand() *cobra.Command {
	var videoId string
	var captionId string
	var bucketId string
	var fileId string
	var name string
	var language string
	var xdefault bool

	cmd := &cobra.Command{
		Use:   "update-caption",
		Short: "Update a caption track by its unique ID. Pass only `name`, `language`, and/or `default` to retag an extracted track (for example `und` → `heb` for Hebrew) without replacing the file. Changing `bucketId`/`fileId` re-packages the track in the background.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []videos.UpdateCaptionOption{}
			if cmd.Flags().Changed("bucket-id") {
				options = append(options, service.WithUpdateCaptionBucketId(bucketId))
			}
			if cmd.Flags().Changed("file-id") {
				options = append(options, service.WithUpdateCaptionFileId(fileId))
			}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateCaptionName(name))
			}
			if cmd.Flags().Changed("language") {
				options = append(options, service.WithUpdateCaptionLanguage(language))
			}
			if cmd.Flags().Changed("xdefault") {
				options = append(options, service.WithUpdateCaptionDefault(xdefault))
			}

			result, err := service.UpdateCaption(videoId, captionId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	cmd.Flags().StringVar(&captionId, "caption-id", "", "Caption unique ID.")
	_ = cmd.MarkFlagRequired("caption-id")
	cmd.Flags().StringVar(&bucketId, "bucket-id", "", "Storage bucket unique ID holding the caption file. Omit together with fileId to only update name, language, or default.")
	cmd.Flags().StringVar(&fileId, "file-id", "", "Caption file unique ID. Omit together with bucketId to only update name, language, or default.")
	cmd.Flags().StringVar(&name, "name", "", "Caption display name. Allowed characters: a-z, A-Z, 0-9, space, and - . , ( ) _ '")
	cmd.Flags().StringVar(&language, "language", "", "Caption ISO 639-2 three-letter language code (for example `heb` for Hebrew).")
	cmd.Flags().BoolVar(&xdefault, "xdefault", false, "Make this the default caption track for the video. Omit to leave unchanged.")
	cmd.Flags().Lookup("xdefault").NoOptDefVal = "true"
	return cmd
}

func newVideosDeleteCaptionCommand() *cobra.Command {
	var videoId string
	var captionId string

	cmd := &cobra.Command{
		Use:   "delete-caption",
		Short: "Delete a caption track by its unique ID, along with its packaged segments.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			result, err := service.DeleteCaption(videoId, captionId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	cmd.Flags().StringVar(&captionId, "caption-id", "", "Caption unique ID.")
	_ = cmd.MarkFlagRequired("caption-id")
	return cmd
}

func newVideosGetCmafHlsManifestCommand() *cobra.Command {
	var videoId string
	var destination string

	cmd := &cobra.Command{
		Use:   "get-cmaf-hls-manifest",
		Short: "Get the top-level streaming manifest for a video output: an HLS master playlist (`master.m3u8`) or a DASH MPD (`master.mpd`). Hand this URL to a player to begin adaptive playback.\n\nGuests can request this URL when they hold `videos.play` (or `videos.read`) and the video document grants them read. A video with `read(\"any\")` or `read(\"guests\")` is playable without a session.\n\nFor CMAF renditions, use `getCmafHlsManifest` or `getCmafDashManifest`. Both masters point at the same fMP4 segment set.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			result, err := service.GetCmafHlsManifest(videoId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			// A location method returns the file bytes, not a URL -- the SDK
			// has already fetched them.
			return app.WriteFile(destination, result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	cmd.Flags().StringVar(&destination, "destination", "", "Path to save the file to.")
	_ = cmd.MarkFlagRequired("destination")
	return cmd
}

func newVideosGetCmafDashManifestCommand() *cobra.Command {
	var videoId string
	var destination string

	cmd := &cobra.Command{
		Use:   "get-cmaf-dash-manifest",
		Short: "Get the top-level streaming manifest for a video output: an HLS master playlist (`master.m3u8`) or a DASH MPD (`master.mpd`). Hand this URL to a player to begin adaptive playback.\n\nGuests can request this URL when they hold `videos.play` (or `videos.read`) and the video document grants them read. A video with `read(\"any\")` or `read(\"guests\")` is playable without a session.\n\nFor CMAF renditions, use `getCmafHlsManifest` or `getCmafDashManifest`. Both masters point at the same fMP4 segment set.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			result, err := service.GetCmafDashManifest(videoId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			// A location method returns the file bytes, not a URL -- the SDK
			// has already fetched them.
			return app.WriteFile(destination, result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	cmd.Flags().StringVar(&destination, "destination", "", "Path to save the file to.")
	_ = cmd.MarkFlagRequired("destination")
	return cmd
}

func newVideosGetDashManifestCommand() *cobra.Command {
	var videoId string
	var destination string

	cmd := &cobra.Command{
		Use:   "get-dash-manifest",
		Short: "Get the top-level streaming manifest for a video output: an HLS master playlist (`master.m3u8`) or a DASH MPD (`master.mpd`). Hand this URL to a player to begin adaptive playback.\n\nGuests can request this URL when they hold `videos.play` (or `videos.read`) and the video document grants them read. A video with `read(\"any\")` or `read(\"guests\")` is playable without a session.\n\nFor CMAF renditions, use `getCmafHlsManifest` or `getCmafDashManifest`. Both masters point at the same fMP4 segment set.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			result, err := service.GetDashManifest(videoId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			// A location method returns the file bytes, not a URL -- the SDK
			// has already fetched them.
			return app.WriteFile(destination, result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	cmd.Flags().StringVar(&destination, "destination", "", "Path to save the file to.")
	_ = cmd.MarkFlagRequired("destination")
	return cmd
}

func newVideosGetHlsManifestCommand() *cobra.Command {
	var videoId string
	var destination string

	cmd := &cobra.Command{
		Use:   "get-hls-manifest",
		Short: "Get the top-level streaming manifest for a video output: an HLS master playlist (`master.m3u8`) or a DASH MPD (`master.mpd`). Hand this URL to a player to begin adaptive playback.\n\nGuests can request this URL when they hold `videos.play` (or `videos.read`) and the video document grants them read. A video with `read(\"any\")` or `read(\"guests\")` is playable without a session.\n\nFor CMAF renditions, use `getCmafHlsManifest` or `getCmafDashManifest`. Both masters point at the same fMP4 segment set.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			result, err := service.GetHlsManifest(videoId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			// A location method returns the file bytes, not a URL -- the SDK
			// has already fetched them.
			return app.WriteFile(destination, result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	cmd.Flags().StringVar(&destination, "destination", "", "Path to save the file to.")
	_ = cmd.MarkFlagRequired("destination")
	return cmd
}

func newVideosGetCaptionManifestCommand() *cobra.Command {
	var videoId string
	var output string
	var captionId string
	var destination string

	cmd := &cobra.Command{
		Use:   "get-caption-manifest",
		Short: "Get the playable caption resource for a video output: an HLS captions playlist, or the WebVTT file itself for DASH.\n\nGuests can request this URL when they hold `videos.play` (or `videos.read`) and the video document grants them read.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			result, err := service.GetCaptionManifest(videoId, output, captionId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			// A location method returns the file bytes, not a URL -- the SDK
			// has already fetched them.
			return app.WriteFile(destination, result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	cmd.Flags().StringVar(&output, "output", "", "Streaming output format.")
	_ = cmd.MarkFlagRequired("output")
	cmd.Flags().StringVar(&captionId, "caption-id", "", "Caption unique ID.")
	_ = cmd.MarkFlagRequired("caption-id")
	cmd.Flags().StringVar(&destination, "destination", "", "Path to save the file to.")
	_ = cmd.MarkFlagRequired("destination")
	return cmd
}

func newVideosListRenditionsCommand() *cobra.Command {
	var videoId string
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
		Use:   "list-renditions",
		Short: "Get a list of all the renditions of a video. You can use the query params to filter your results.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

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

			// An unset flag must be omitted, not sent as its zero value.
			options := []videos.ListRenditionsOption{}
			if app.AnyFlagChanged(cmd, "queries", "filter", "where", "sort-asc", "sort-desc", "limit", "offset", "cursor-after", "cursor-before", "select") {
				options = append(options, service.WithListRenditionsQueries(app.StringSlice(queries)))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListRenditionsTotal(total))
			}

			result, err := service.ListRenditions(videoId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: profileId, name, status, output, codec, width, height, videoBitRate, audioBitRate, size, startedAt, endedAt. Repeat the flag for each value.")
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

func newVideosCreateRenditionCommand() *cobra.Command {
	var videoId string
	var profileId string
	var output string

	cmd := &cobra.Command{
		Use:   "create-rendition",
		Short: "Request a new rendition of a video, encoded against a video profile and packaged for HLS, DASH, or CMAF. The rendition is created immediately with a `pending` status and transcoded in the background; poll it or subscribe to realtime events to follow its progress. The worker downloads the source file for this job, probes metadata and extracts embedded captions when needed, then deletes the working copy when the job ends.\n\nThe profile codec must be enabled on this instance. A disabled codec fails with `video_codec_disabled`.\n\nEach video may have only one rendition per profile and output combination. Creating a duplicate fails with `video_rendition_already_exists`. After an encode fails or is aborted, delete the rendition and create it again. The same profile may still be encoded for different outputs (for example HLS and DASH).\n\nA video accepts 10 rendition creates per hour. The next create returns `general_rate_limit_exceeded`.\n\nCMAF packs shared fMP4 segments once and exposes both HLS (`/outputs/cmaf/master.m3u8`) and DASH (`/outputs/cmaf/master.mpd`) masters for the same encode.\n\nRenditions can only be created from the Console or a server SDK with an API key that has the `videos.write` scope. Each encode spends the project's compute, so client sessions receive `user_unauthorized`.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			result, err := service.CreateRendition(videoId, profileId, output)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	cmd.Flags().StringVar(&profileId, "profile-id", "", "Video profile unique ID to encode against.")
	_ = cmd.MarkFlagRequired("profile-id")
	cmd.Flags().StringVar(&output, "output", "", "Streaming output format to package as.")
	_ = cmd.MarkFlagRequired("output")
	return cmd
}

func newVideosGetRenditionCommand() *cobra.Command {
	var videoId string
	var renditionId string

	cmd := &cobra.Command{
		Use:   "get-rendition",
		Short: "Get a rendition by its unique ID, including its current transcoding status and progress.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			result, err := service.GetRendition(videoId, renditionId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	cmd.Flags().StringVar(&renditionId, "rendition-id", "", "Rendition unique ID.")
	_ = cmd.MarkFlagRequired("rendition-id")
	return cmd
}

func newVideosDeleteRenditionCommand() *cobra.Command {
	var videoId string
	var renditionId string

	cmd := &cobra.Command{
		Use:   "delete-rendition",
		Short: "Delete a rendition by its unique ID, along with its packaged segments and transcoded output. Fails with `video_rendition_in_progress` while the rendition is started or ended, unless it has not been updated within the rendition retention window.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			result, err := service.DeleteRendition(videoId, renditionId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	cmd.Flags().StringVar(&renditionId, "rendition-id", "", "Rendition unique ID.")
	_ = cmd.MarkFlagRequired("rendition-id")
	return cmd
}

func newVideosGetThumbnailCommand() *cobra.Command {
	var videoId string
	var thumbnailId string
	var width int
	var height int
	var output string
	var destination string

	cmd := &cobra.Command{
		Use:   "get-thumbnail",
		Short: "Get a single thumbnail sheet from a video's timeline as an image. You can resize the returned image and choose its output format.\n\nGuests can request this URL when they hold `videos.play` (or `videos.read`) and the video document grants them read.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			// An unset flag must be omitted, not sent as its zero value.
			options := []videos.GetThumbnailOption{}
			if cmd.Flags().Changed("width") {
				options = append(options, service.WithGetThumbnailWidth(width))
			}
			if cmd.Flags().Changed("height") {
				options = append(options, service.WithGetThumbnailHeight(height))
			}
			if cmd.Flags().Changed("output") {
				options = append(options, service.WithGetThumbnailOutput(output))
			}

			result, err := service.GetThumbnail(videoId, thumbnailId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			// A location method returns the file bytes, not a URL -- the SDK
			// has already fetched them.
			return app.WriteFile(destination, result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	cmd.Flags().StringVar(&thumbnailId, "thumbnail-id", "", "Thumbnail unique ID.")
	_ = cmd.MarkFlagRequired("thumbnail-id")
	cmd.Flags().IntVar(&width, "width", 0, "Resize thumbnail image width, in pixels.")
	cmd.Flags().IntVar(&height, "height", 0, "Resize thumbnail image height, in pixels.")
	cmd.Flags().StringVar(&output, "output", "", "Output format type (jpeg, jpg, png, gif and webp).")
	cmd.Flags().StringVar(&destination, "destination", "", "Path to save the file to.")
	_ = cmd.MarkFlagRequired("destination")
	return cmd
}

func newVideosGetTimelineCommand() *cobra.Command {
	var videoId string
	var destination string

	cmd := &cobra.Command{
		Use:   "get-timeline",
		Short: "Get the WebVTT thumbnail timeline for a video, used to render scrubbing thumbnails in a player. Timeline generation is queued when the video is created. Subscribe to `videos.[videoId].timelines.update` for probe and terminal updates, or poll this endpoint until it returns a WebVTT document. Audio-only sources produce no timeline and this endpoint returns `video_timelines_not_found`.\n\nGuests can request this URL when they hold `videos.play` (or `videos.read`) and the video document grants them read. A video with `read(\"any\")` or `read(\"guests\")` is playable without a session.\n",
		Args:  app.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := videos.New(client)

			result, err := service.GetTimeline(videoId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			// A location method returns the file bytes, not a URL -- the SDK
			// has already fetched them.
			return app.WriteFile(destination, result)
		},
	}

	cmd.Flags().StringVar(&videoId, "video-id", "", "Video unique ID.")
	_ = cmd.MarkFlagRequired("video-id")
	cmd.Flags().StringVar(&destination, "destination", "", "Path to save the file to.")
	_ = cmd.MarkFlagRequired("destination")
	return cmd
}
