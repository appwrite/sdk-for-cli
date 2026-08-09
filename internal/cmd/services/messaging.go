package services

import (
	"github.com/spf13/cobra"

	"github.com/appwrite/sdk-for-go/v6/messaging"

	"github.com/appwrite/sdk-for-cli/internal/app"
	"github.com/appwrite/sdk-for-cli/internal/query"
	"github.com/appwrite/sdk-for-cli/internal/sdk"
)

// NewMessagingCommand builds the `messaging` command tree.
func NewMessagingCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "messaging",
		Short: "The Messaging service allows you to send messages to any provider type (SMTP, push notification, SMS, etc.).",
	}

	cmd.AddCommand(newMessagingListMessagesCommand())
	cmd.AddCommand(newMessagingCreateEmailCommand())
	cmd.AddCommand(newMessagingUpdateEmailCommand())
	cmd.AddCommand(newMessagingCreatePushCommand())
	cmd.AddCommand(newMessagingUpdatePushCommand())
	cmd.AddCommand(newMessagingCreateSmsCommand())
	cmd.AddCommand(newMessagingUpdateSmsCommand())
	cmd.AddCommand(newMessagingGetMessageCommand())
	cmd.AddCommand(newMessagingDeleteCommand())
	cmd.AddCommand(newMessagingListTargetsCommand())
	cmd.AddCommand(newMessagingListProvidersCommand())
	cmd.AddCommand(newMessagingCreateApnsProviderCommand())
	cmd.AddCommand(newMessagingUpdateApnsProviderCommand())
	cmd.AddCommand(newMessagingCreateFcmProviderCommand())
	cmd.AddCommand(newMessagingUpdateFcmProviderCommand())
	cmd.AddCommand(newMessagingCreateMailgunProviderCommand())
	cmd.AddCommand(newMessagingUpdateMailgunProviderCommand())
	cmd.AddCommand(newMessagingCreateMsg91ProviderCommand())
	cmd.AddCommand(newMessagingUpdateMsg91ProviderCommand())
	cmd.AddCommand(newMessagingCreateResendProviderCommand())
	cmd.AddCommand(newMessagingUpdateResendProviderCommand())
	cmd.AddCommand(newMessagingCreateSendgridProviderCommand())
	cmd.AddCommand(newMessagingUpdateSendgridProviderCommand())
	cmd.AddCommand(newMessagingCreateSesProviderCommand())
	cmd.AddCommand(newMessagingUpdateSesProviderCommand())
	cmd.AddCommand(newMessagingCreateSmtpProviderCommand())
	cmd.AddCommand(newMessagingUpdateSmtpProviderCommand())
	cmd.AddCommand(newMessagingCreateTelesignProviderCommand())
	cmd.AddCommand(newMessagingUpdateTelesignProviderCommand())
	cmd.AddCommand(newMessagingCreateTextmagicProviderCommand())
	cmd.AddCommand(newMessagingUpdateTextmagicProviderCommand())
	cmd.AddCommand(newMessagingCreateTwilioProviderCommand())
	cmd.AddCommand(newMessagingUpdateTwilioProviderCommand())
	cmd.AddCommand(newMessagingCreateVonageProviderCommand())
	cmd.AddCommand(newMessagingUpdateVonageProviderCommand())
	cmd.AddCommand(newMessagingGetProviderCommand())
	cmd.AddCommand(newMessagingDeleteProviderCommand())
	cmd.AddCommand(newMessagingListTopicsCommand())
	cmd.AddCommand(newMessagingCreateTopicCommand())
	cmd.AddCommand(newMessagingGetTopicCommand())
	cmd.AddCommand(newMessagingUpdateTopicCommand())
	cmd.AddCommand(newMessagingDeleteTopicCommand())
	cmd.AddCommand(newMessagingListSubscribersCommand())
	cmd.AddCommand(newMessagingCreateSubscriberCommand())
	cmd.AddCommand(newMessagingGetSubscriberCommand())
	cmd.AddCommand(newMessagingDeleteSubscriberCommand())

	return cmd
}

func newMessagingListMessagesCommand() *cobra.Command {
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
		Use:   "list-messages",
		Short: "Get a list of all messages from the current Appwrite project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

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
			options := []messaging.ListMessagesOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListMessagesQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListMessagesSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListMessagesTotal(total))
			}

			result, err := service.ListMessages(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: scheduledAt, deliveredAt, deliveredTotal, status, description, providerType")
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

func newMessagingCreateEmailCommand() *cobra.Command {
	var messageId string
	var subject string
	var content string
	var topics []string
	var users []string
	var targets []string
	var cc []string
	var bcc []string
	var attachments []string
	var draft bool
	var html bool
	var scheduledAt string

	cmd := &cobra.Command{
		Use:   "create-email",
		Short: "Create a new email message.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.CreateEmailOption{}
			if cmd.Flags().Changed("topics") {
				options = append(options, service.WithCreateEmailTopics(topics))
			}
			if cmd.Flags().Changed("users") {
				options = append(options, service.WithCreateEmailUsers(users))
			}
			if cmd.Flags().Changed("targets") {
				options = append(options, service.WithCreateEmailTargets(targets))
			}
			if cmd.Flags().Changed("cc") {
				options = append(options, service.WithCreateEmailCc(cc))
			}
			if cmd.Flags().Changed("bcc") {
				options = append(options, service.WithCreateEmailBcc(bcc))
			}
			if cmd.Flags().Changed("attachments") {
				options = append(options, service.WithCreateEmailAttachments(attachments))
			}
			if cmd.Flags().Changed("draft") {
				options = append(options, service.WithCreateEmailDraft(draft))
			}
			if cmd.Flags().Changed("html") {
				options = append(options, service.WithCreateEmailHtml(html))
			}
			if cmd.Flags().Changed("scheduled-at") {
				options = append(options, service.WithCreateEmailScheduledAt(scheduledAt))
			}

			result, err := service.CreateEmail(messageId, subject, content, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&messageId, "message-id", "", "Message ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("message-id")
	cmd.Flags().StringVar(&subject, "subject", "", "Email Subject.")
	_ = cmd.MarkFlagRequired("subject")
	cmd.Flags().StringVar(&content, "content", "", "Email Content.")
	_ = cmd.MarkFlagRequired("content")
	cmd.Flags().StringArrayVar(&topics, "topics", nil, "List of Topic IDs.")
	cmd.Flags().StringArrayVar(&users, "users", nil, "List of User IDs.")
	cmd.Flags().StringArrayVar(&targets, "targets", nil, "List of Targets IDs.")
	cmd.Flags().StringArrayVar(&cc, "cc", nil, "Array of target IDs to be added as CC.")
	cmd.Flags().StringArrayVar(&bcc, "bcc", nil, "Array of target IDs to be added as BCC.")
	cmd.Flags().StringArrayVar(&attachments, "attachments", nil, "Array of compound ID strings of bucket IDs and file IDs to be attached to the email. They should be formatted as <BUCKET_ID>:<FILE_ID>.")
	cmd.Flags().BoolVar(&draft, "draft", false, "Is message a draft")
	cmd.Flags().Lookup("draft").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&html, "html", false, "Is content of type HTML")
	cmd.Flags().Lookup("html").NoOptDefVal = "true"
	cmd.Flags().StringVar(&scheduledAt, "scheduled-at", "", "Scheduled delivery time for message in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.")
	return cmd
}

func newMessagingUpdateEmailCommand() *cobra.Command {
	var messageId string
	var topics []string
	var users []string
	var targets []string
	var subject string
	var content string
	var draft bool
	var html bool
	var cc []string
	var bcc []string
	var scheduledAt string
	var attachments []string

	cmd := &cobra.Command{
		Use:   "update-email",
		Short: "Update an email message by its unique ID. This endpoint only works on messages that are in draft status. Messages that are already processing, sent, or failed cannot be updated.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.UpdateEmailOption{}
			if cmd.Flags().Changed("topics") {
				options = append(options, service.WithUpdateEmailTopics(topics))
			}
			if cmd.Flags().Changed("users") {
				options = append(options, service.WithUpdateEmailUsers(users))
			}
			if cmd.Flags().Changed("targets") {
				options = append(options, service.WithUpdateEmailTargets(targets))
			}
			if cmd.Flags().Changed("subject") {
				options = append(options, service.WithUpdateEmailSubject(subject))
			}
			if cmd.Flags().Changed("content") {
				options = append(options, service.WithUpdateEmailContent(content))
			}
			if cmd.Flags().Changed("draft") {
				options = append(options, service.WithUpdateEmailDraft(draft))
			}
			if cmd.Flags().Changed("html") {
				options = append(options, service.WithUpdateEmailHtml(html))
			}
			if cmd.Flags().Changed("cc") {
				options = append(options, service.WithUpdateEmailCc(cc))
			}
			if cmd.Flags().Changed("bcc") {
				options = append(options, service.WithUpdateEmailBcc(bcc))
			}
			if cmd.Flags().Changed("scheduled-at") {
				options = append(options, service.WithUpdateEmailScheduledAt(scheduledAt))
			}
			if cmd.Flags().Changed("attachments") {
				options = append(options, service.WithUpdateEmailAttachments(attachments))
			}

			result, err := service.UpdateEmail(messageId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&messageId, "message-id", "", "Message ID.")
	_ = cmd.MarkFlagRequired("message-id")
	cmd.Flags().StringArrayVar(&topics, "topics", nil, "List of Topic IDs.")
	cmd.Flags().StringArrayVar(&users, "users", nil, "List of User IDs.")
	cmd.Flags().StringArrayVar(&targets, "targets", nil, "List of Targets IDs.")
	cmd.Flags().StringVar(&subject, "subject", "", "Email Subject.")
	cmd.Flags().StringVar(&content, "content", "", "Email Content.")
	cmd.Flags().BoolVar(&draft, "draft", false, "Is message a draft")
	cmd.Flags().Lookup("draft").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&html, "html", false, "Is content of type HTML")
	cmd.Flags().Lookup("html").NoOptDefVal = "true"
	cmd.Flags().StringArrayVar(&cc, "cc", nil, "Array of target IDs to be added as CC.")
	cmd.Flags().StringArrayVar(&bcc, "bcc", nil, "Array of target IDs to be added as BCC.")
	cmd.Flags().StringVar(&scheduledAt, "scheduled-at", "", "Scheduled delivery time for message in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.")
	cmd.Flags().StringArrayVar(&attachments, "attachments", nil, "Array of compound ID strings of bucket IDs and file IDs to be attached to the email. They should be formatted as <BUCKET_ID>:<FILE_ID>.")
	return cmd
}

func newMessagingCreatePushCommand() *cobra.Command {
	var messageId string
	var title string
	var body string
	var topics []string
	var users []string
	var targets []string
	var data string
	var action string
	var image string
	var icon string
	var sound string
	var color string
	var tag string
	var badge int
	var draft bool
	var scheduledAt string
	var contentAvailable bool
	var critical bool
	var priority string

	cmd := &cobra.Command{
		Use:   "create-push",
		Short: "Create a new push notification.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)
			dataValue, err := app.JSONObject(data)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.CreatePushOption{}
			if cmd.Flags().Changed("title") {
				options = append(options, service.WithCreatePushTitle(title))
			}
			if cmd.Flags().Changed("body") {
				options = append(options, service.WithCreatePushBody(body))
			}
			if cmd.Flags().Changed("topics") {
				options = append(options, service.WithCreatePushTopics(topics))
			}
			if cmd.Flags().Changed("users") {
				options = append(options, service.WithCreatePushUsers(users))
			}
			if cmd.Flags().Changed("targets") {
				options = append(options, service.WithCreatePushTargets(targets))
			}
			if cmd.Flags().Changed("data") {
				options = append(options, service.WithCreatePushData(dataValue))
			}
			if cmd.Flags().Changed("action") {
				options = append(options, service.WithCreatePushAction(action))
			}
			if cmd.Flags().Changed("image") {
				options = append(options, service.WithCreatePushImage(image))
			}
			if cmd.Flags().Changed("icon") {
				options = append(options, service.WithCreatePushIcon(icon))
			}
			if cmd.Flags().Changed("sound") {
				options = append(options, service.WithCreatePushSound(sound))
			}
			if cmd.Flags().Changed("color") {
				options = append(options, service.WithCreatePushColor(color))
			}
			if cmd.Flags().Changed("tag") {
				options = append(options, service.WithCreatePushTag(tag))
			}
			if cmd.Flags().Changed("badge") {
				options = append(options, service.WithCreatePushBadge(badge))
			}
			if cmd.Flags().Changed("draft") {
				options = append(options, service.WithCreatePushDraft(draft))
			}
			if cmd.Flags().Changed("scheduled-at") {
				options = append(options, service.WithCreatePushScheduledAt(scheduledAt))
			}
			if cmd.Flags().Changed("content-available") {
				options = append(options, service.WithCreatePushContentAvailable(contentAvailable))
			}
			if cmd.Flags().Changed("critical") {
				options = append(options, service.WithCreatePushCritical(critical))
			}
			if cmd.Flags().Changed("priority") {
				options = append(options, service.WithCreatePushPriority(priority))
			}

			result, err := service.CreatePush(messageId, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&messageId, "message-id", "", "Message ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("message-id")
	cmd.Flags().StringVar(&title, "title", "", "Title for push notification.")
	cmd.Flags().StringVar(&body, "body", "", "Body for push notification.")
	cmd.Flags().StringArrayVar(&topics, "topics", nil, "List of Topic IDs.")
	cmd.Flags().StringArrayVar(&users, "users", nil, "List of User IDs.")
	cmd.Flags().StringArrayVar(&targets, "targets", nil, "List of Targets IDs.")
	cmd.Flags().StringVar(&data, "data", "", "Additional key-value pair data for push notification.")
	cmd.Flags().StringVar(&action, "action", "", "Action for push notification.")
	cmd.Flags().StringVar(&image, "image", "", "Image for push notification. Must be a compound bucket ID to file ID of a jpeg, png, or bmp image in Appwrite Storage. It should be formatted as <BUCKET_ID>:<FILE_ID>.")
	cmd.Flags().StringVar(&icon, "icon", "", "Icon for push notification. Available only for Android and Web Platform.")
	cmd.Flags().StringVar(&sound, "sound", "", "Sound for push notification. Available only for Android and iOS Platform.")
	cmd.Flags().StringVar(&color, "color", "", "Color for push notification. Available only for Android Platform.")
	cmd.Flags().StringVar(&tag, "tag", "", "Tag for push notification. Available only for Android Platform.")
	cmd.Flags().IntVar(&badge, "badge", 0, "Badge for push notification. Available only for iOS Platform.")
	cmd.Flags().BoolVar(&draft, "draft", false, "Is message a draft")
	cmd.Flags().Lookup("draft").NoOptDefVal = "true"
	cmd.Flags().StringVar(&scheduledAt, "scheduled-at", "", "Scheduled delivery time for message in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.")
	cmd.Flags().BoolVar(&contentAvailable, "content-available", false, "If set to true, the notification will be delivered in the background. Available only for iOS Platform.")
	cmd.Flags().Lookup("content-available").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&critical, "critical", false, "If set to true, the notification will be marked as critical. This requires the app to have the critical notification entitlement. Available only for iOS Platform.")
	cmd.Flags().Lookup("critical").NoOptDefVal = "true"
	cmd.Flags().StringVar(&priority, "priority", "", "Set the notification priority. \"normal\" will consider device state and may not deliver notifications immediately. \"high\" will always attempt to immediately deliver the notification.")
	return cmd
}

func newMessagingUpdatePushCommand() *cobra.Command {
	var messageId string
	var topics []string
	var users []string
	var targets []string
	var title string
	var body string
	var data string
	var action string
	var image string
	var icon string
	var sound string
	var color string
	var tag string
	var badge int
	var draft bool
	var scheduledAt string
	var contentAvailable bool
	var critical bool
	var priority string

	cmd := &cobra.Command{
		Use:   "update-push",
		Short: "Update a push notification by its unique ID. This endpoint only works on messages that are in draft status. Messages that are already processing, sent, or failed cannot be updated.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)
			dataValue, err := app.JSONObject(data)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.UpdatePushOption{}
			if cmd.Flags().Changed("topics") {
				options = append(options, service.WithUpdatePushTopics(topics))
			}
			if cmd.Flags().Changed("users") {
				options = append(options, service.WithUpdatePushUsers(users))
			}
			if cmd.Flags().Changed("targets") {
				options = append(options, service.WithUpdatePushTargets(targets))
			}
			if cmd.Flags().Changed("title") {
				options = append(options, service.WithUpdatePushTitle(title))
			}
			if cmd.Flags().Changed("body") {
				options = append(options, service.WithUpdatePushBody(body))
			}
			if cmd.Flags().Changed("data") {
				options = append(options, service.WithUpdatePushData(dataValue))
			}
			if cmd.Flags().Changed("action") {
				options = append(options, service.WithUpdatePushAction(action))
			}
			if cmd.Flags().Changed("image") {
				options = append(options, service.WithUpdatePushImage(image))
			}
			if cmd.Flags().Changed("icon") {
				options = append(options, service.WithUpdatePushIcon(icon))
			}
			if cmd.Flags().Changed("sound") {
				options = append(options, service.WithUpdatePushSound(sound))
			}
			if cmd.Flags().Changed("color") {
				options = append(options, service.WithUpdatePushColor(color))
			}
			if cmd.Flags().Changed("tag") {
				options = append(options, service.WithUpdatePushTag(tag))
			}
			if cmd.Flags().Changed("badge") {
				options = append(options, service.WithUpdatePushBadge(badge))
			}
			if cmd.Flags().Changed("draft") {
				options = append(options, service.WithUpdatePushDraft(draft))
			}
			if cmd.Flags().Changed("scheduled-at") {
				options = append(options, service.WithUpdatePushScheduledAt(scheduledAt))
			}
			if cmd.Flags().Changed("content-available") {
				options = append(options, service.WithUpdatePushContentAvailable(contentAvailable))
			}
			if cmd.Flags().Changed("critical") {
				options = append(options, service.WithUpdatePushCritical(critical))
			}
			if cmd.Flags().Changed("priority") {
				options = append(options, service.WithUpdatePushPriority(priority))
			}

			result, err := service.UpdatePush(messageId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&messageId, "message-id", "", "Message ID.")
	_ = cmd.MarkFlagRequired("message-id")
	cmd.Flags().StringArrayVar(&topics, "topics", nil, "List of Topic IDs.")
	cmd.Flags().StringArrayVar(&users, "users", nil, "List of User IDs.")
	cmd.Flags().StringArrayVar(&targets, "targets", nil, "List of Targets IDs.")
	cmd.Flags().StringVar(&title, "title", "", "Title for push notification.")
	cmd.Flags().StringVar(&body, "body", "", "Body for push notification.")
	cmd.Flags().StringVar(&data, "data", "", "Additional Data for push notification.")
	cmd.Flags().StringVar(&action, "action", "", "Action for push notification.")
	cmd.Flags().StringVar(&image, "image", "", "Image for push notification. Must be a compound bucket ID to file ID of a jpeg, png, or bmp image in Appwrite Storage. It should be formatted as <BUCKET_ID>:<FILE_ID>.")
	cmd.Flags().StringVar(&icon, "icon", "", "Icon for push notification. Available only for Android and Web platforms.")
	cmd.Flags().StringVar(&sound, "sound", "", "Sound for push notification. Available only for Android and iOS platforms.")
	cmd.Flags().StringVar(&color, "color", "", "Color for push notification. Available only for Android platforms.")
	cmd.Flags().StringVar(&tag, "tag", "", "Tag for push notification. Available only for Android platforms.")
	cmd.Flags().IntVar(&badge, "badge", 0, "Badge for push notification. Available only for iOS platforms.")
	cmd.Flags().BoolVar(&draft, "draft", false, "Is message a draft")
	cmd.Flags().Lookup("draft").NoOptDefVal = "true"
	cmd.Flags().StringVar(&scheduledAt, "scheduled-at", "", "Scheduled delivery time for message in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.")
	cmd.Flags().BoolVar(&contentAvailable, "content-available", false, "If set to true, the notification will be delivered in the background. Available only for iOS Platform.")
	cmd.Flags().Lookup("content-available").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&critical, "critical", false, "If set to true, the notification will be marked as critical. This requires the app to have the critical notification entitlement. Available only for iOS Platform.")
	cmd.Flags().Lookup("critical").NoOptDefVal = "true"
	cmd.Flags().StringVar(&priority, "priority", "", "Set the notification priority. \"normal\" will consider device battery state and may send notifications later. \"high\" will always attempt to immediately deliver the notification.")
	return cmd
}

func newMessagingCreateSmsCommand() *cobra.Command {
	var messageId string
	var content string
	var topics []string
	var users []string
	var targets []string
	var draft bool
	var scheduledAt string

	cmd := &cobra.Command{
		Use:   "create-sms",
		Short: "Create a new SMS message.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.CreateSmsOption{}
			if cmd.Flags().Changed("topics") {
				options = append(options, service.WithCreateSmsTopics(topics))
			}
			if cmd.Flags().Changed("users") {
				options = append(options, service.WithCreateSmsUsers(users))
			}
			if cmd.Flags().Changed("targets") {
				options = append(options, service.WithCreateSmsTargets(targets))
			}
			if cmd.Flags().Changed("draft") {
				options = append(options, service.WithCreateSmsDraft(draft))
			}
			if cmd.Flags().Changed("scheduled-at") {
				options = append(options, service.WithCreateSmsScheduledAt(scheduledAt))
			}

			result, err := service.CreateSms(messageId, content, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&messageId, "message-id", "", "Message ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("message-id")
	cmd.Flags().StringVar(&content, "content", "", "SMS Content.")
	_ = cmd.MarkFlagRequired("content")
	cmd.Flags().StringArrayVar(&topics, "topics", nil, "List of Topic IDs.")
	cmd.Flags().StringArrayVar(&users, "users", nil, "List of User IDs.")
	cmd.Flags().StringArrayVar(&targets, "targets", nil, "List of Targets IDs.")
	cmd.Flags().BoolVar(&draft, "draft", false, "Is message a draft")
	cmd.Flags().Lookup("draft").NoOptDefVal = "true"
	cmd.Flags().StringVar(&scheduledAt, "scheduled-at", "", "Scheduled delivery time for message in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.")
	return cmd
}

func newMessagingUpdateSmsCommand() *cobra.Command {
	var messageId string
	var topics []string
	var users []string
	var targets []string
	var content string
	var draft bool
	var scheduledAt string

	cmd := &cobra.Command{
		Use:   "update-sms",
		Short: "Update an SMS message by its unique ID. This endpoint only works on messages that are in draft status. Messages that are already processing, sent, or failed cannot be updated.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.UpdateSmsOption{}
			if cmd.Flags().Changed("topics") {
				options = append(options, service.WithUpdateSmsTopics(topics))
			}
			if cmd.Flags().Changed("users") {
				options = append(options, service.WithUpdateSmsUsers(users))
			}
			if cmd.Flags().Changed("targets") {
				options = append(options, service.WithUpdateSmsTargets(targets))
			}
			if cmd.Flags().Changed("content") {
				options = append(options, service.WithUpdateSmsContent(content))
			}
			if cmd.Flags().Changed("draft") {
				options = append(options, service.WithUpdateSmsDraft(draft))
			}
			if cmd.Flags().Changed("scheduled-at") {
				options = append(options, service.WithUpdateSmsScheduledAt(scheduledAt))
			}

			result, err := service.UpdateSms(messageId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&messageId, "message-id", "", "Message ID.")
	_ = cmd.MarkFlagRequired("message-id")
	cmd.Flags().StringArrayVar(&topics, "topics", nil, "List of Topic IDs.")
	cmd.Flags().StringArrayVar(&users, "users", nil, "List of User IDs.")
	cmd.Flags().StringArrayVar(&targets, "targets", nil, "List of Targets IDs.")
	cmd.Flags().StringVar(&content, "content", "", "Email Content.")
	cmd.Flags().BoolVar(&draft, "draft", false, "Is message a draft")
	cmd.Flags().Lookup("draft").NoOptDefVal = "true"
	cmd.Flags().StringVar(&scheduledAt, "scheduled-at", "", "Scheduled delivery time for message in ISO 8601 (https://www.iso.org/iso-8601-date-and-time-format.html) format. DateTime value must be in future.")
	return cmd
}

func newMessagingGetMessageCommand() *cobra.Command {
	var messageId string

	cmd := &cobra.Command{
		Use:   "get-message",
		Short: "Get a message by its unique ID.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			result, err := service.GetMessage(messageId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&messageId, "message-id", "", "Message ID.")
	_ = cmd.MarkFlagRequired("message-id")
	return cmd
}

func newMessagingDeleteCommand() *cobra.Command {
	var messageId string

	cmd := &cobra.Command{
		Use:   "delete",
		Short: "Delete a message. If the message is not a draft or scheduled, but has been sent, this will not recall the message.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			result, err := service.Delete(messageId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&messageId, "message-id", "", "Message ID.")
	_ = cmd.MarkFlagRequired("message-id")
	return cmd
}

func newMessagingListTargetsCommand() *cobra.Command {
	var messageId string
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
		Short: "Get a list of the targets associated with a message.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

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
			options := []messaging.ListTargetsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListTargetsQueries(queries))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListTargetsTotal(total))
			}

			result, err := service.ListTargets(messageId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&messageId, "message-id", "", "Message ID.")
	_ = cmd.MarkFlagRequired("message-id")
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

func newMessagingListProvidersCommand() *cobra.Command {
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
		Use:   "list-providers",
		Short: "Get a list of all providers from the current Appwrite project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

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
			options := []messaging.ListProvidersOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListProvidersQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListProvidersSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListProvidersTotal(total))
			}

			result, err := service.ListProviders(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, provider, type, enabled")
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

func newMessagingCreateApnsProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var authKey string
	var authKeyId string
	var teamId string
	var bundleId string
	var sandbox bool
	var enabled bool

	cmd := &cobra.Command{
		Use:   "create-apns-provider",
		Short: "Create a new Apple Push Notification service provider.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.CreateApnsProviderOption{}
			if cmd.Flags().Changed("auth-key") {
				options = append(options, service.WithCreateApnsProviderAuthKey(authKey))
			}
			if cmd.Flags().Changed("auth-key-id") {
				options = append(options, service.WithCreateApnsProviderAuthKeyId(authKeyId))
			}
			if cmd.Flags().Changed("team-id") {
				options = append(options, service.WithCreateApnsProviderTeamId(teamId))
			}
			if cmd.Flags().Changed("bundle-id") {
				options = append(options, service.WithCreateApnsProviderBundleId(bundleId))
			}
			if cmd.Flags().Changed("sandbox") {
				options = append(options, service.WithCreateApnsProviderSandbox(sandbox))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateApnsProviderEnabled(enabled))
			}

			result, err := service.CreateApnsProvider(providerId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&authKey, "auth-key", "", "APNS authentication key.")
	cmd.Flags().StringVar(&authKeyId, "auth-key-id", "", "APNS authentication key ID.")
	cmd.Flags().StringVar(&teamId, "team-id", "", "APNS team ID.")
	cmd.Flags().StringVar(&bundleId, "bundle-id", "", "APNS bundle ID.")
	cmd.Flags().BoolVar(&sandbox, "sandbox", false, "Use APNS sandbox environment.")
	cmd.Flags().Lookup("sandbox").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	return cmd
}

func newMessagingUpdateApnsProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var enabled bool
	var authKey string
	var authKeyId string
	var teamId string
	var bundleId string
	var sandbox bool

	cmd := &cobra.Command{
		Use:   "update-apns-provider",
		Short: "Update a Apple Push Notification service provider by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.UpdateApnsProviderOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateApnsProviderName(name))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateApnsProviderEnabled(enabled))
			}
			if cmd.Flags().Changed("auth-key") {
				options = append(options, service.WithUpdateApnsProviderAuthKey(authKey))
			}
			if cmd.Flags().Changed("auth-key-id") {
				options = append(options, service.WithUpdateApnsProviderAuthKeyId(authKeyId))
			}
			if cmd.Flags().Changed("team-id") {
				options = append(options, service.WithUpdateApnsProviderTeamId(teamId))
			}
			if cmd.Flags().Changed("bundle-id") {
				options = append(options, service.WithUpdateApnsProviderBundleId(bundleId))
			}
			if cmd.Flags().Changed("sandbox") {
				options = append(options, service.WithUpdateApnsProviderSandbox(sandbox))
			}

			result, err := service.UpdateApnsProvider(providerId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&authKey, "auth-key", "", "APNS authentication key.")
	cmd.Flags().StringVar(&authKeyId, "auth-key-id", "", "APNS authentication key ID.")
	cmd.Flags().StringVar(&teamId, "team-id", "", "APNS team ID.")
	cmd.Flags().StringVar(&bundleId, "bundle-id", "", "APNS bundle ID.")
	cmd.Flags().BoolVar(&sandbox, "sandbox", false, "Use APNS sandbox environment.")
	cmd.Flags().Lookup("sandbox").NoOptDefVal = "true"
	return cmd
}

func newMessagingCreateFcmProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var serviceAccountJson string
	var enabled bool

	cmd := &cobra.Command{
		Use:   "create-fcm-provider",
		Short: "Create a new Firebase Cloud Messaging provider.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)
			serviceAccountJsonValue, err := app.JSONObject(serviceAccountJson)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.CreateFcmProviderOption{}
			if cmd.Flags().Changed("service-account-json") {
				options = append(options, service.WithCreateFcmProviderServiceAccountJSON(serviceAccountJsonValue))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateFcmProviderEnabled(enabled))
			}

			result, err := service.CreateFcmProvider(providerId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&serviceAccountJson, "service-account-json", "", "FCM service account JSON.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	return cmd
}

func newMessagingUpdateFcmProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var enabled bool
	var serviceAccountJson string

	cmd := &cobra.Command{
		Use:   "update-fcm-provider",
		Short: "Update a Firebase Cloud Messaging provider by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)
			serviceAccountJsonValue, err := app.JSONObject(serviceAccountJson)
			if err != nil {
				return err
			}

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.UpdateFcmProviderOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateFcmProviderName(name))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateFcmProviderEnabled(enabled))
			}
			if cmd.Flags().Changed("service-account-json") {
				options = append(options, service.WithUpdateFcmProviderServiceAccountJSON(serviceAccountJsonValue))
			}

			result, err := service.UpdateFcmProvider(providerId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&serviceAccountJson, "service-account-json", "", "FCM service account JSON.")
	return cmd
}

func newMessagingCreateMailgunProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var apiKey string
	var domain string
	var isEuRegion bool
	var fromName string
	var fromEmail string
	var replyToName string
	var replyToEmail string
	var enabled bool

	cmd := &cobra.Command{
		Use:   "create-mailgun-provider",
		Short: "Create a new Mailgun provider.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.CreateMailgunProviderOption{}
			if cmd.Flags().Changed("api-key") {
				options = append(options, service.WithCreateMailgunProviderApiKey(apiKey))
			}
			if cmd.Flags().Changed("domain") {
				options = append(options, service.WithCreateMailgunProviderDomain(domain))
			}
			if cmd.Flags().Changed("is-eu-region") {
				options = append(options, service.WithCreateMailgunProviderIsEuRegion(isEuRegion))
			}
			if cmd.Flags().Changed("from-name") {
				options = append(options, service.WithCreateMailgunProviderFromName(fromName))
			}
			if cmd.Flags().Changed("from-email") {
				options = append(options, service.WithCreateMailgunProviderFromEmail(fromEmail))
			}
			if cmd.Flags().Changed("reply-to-name") {
				options = append(options, service.WithCreateMailgunProviderReplyToName(replyToName))
			}
			if cmd.Flags().Changed("reply-to-email") {
				options = append(options, service.WithCreateMailgunProviderReplyToEmail(replyToEmail))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateMailgunProviderEnabled(enabled))
			}

			result, err := service.CreateMailgunProvider(providerId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&apiKey, "api-key", "", "Mailgun API Key.")
	cmd.Flags().StringVar(&domain, "domain", "", "Mailgun Domain.")
	cmd.Flags().BoolVar(&isEuRegion, "is-eu-region", false, "Set as EU region.")
	cmd.Flags().Lookup("is-eu-region").NoOptDefVal = "true"
	cmd.Flags().StringVar(&fromName, "from-name", "", "Sender Name.")
	cmd.Flags().StringVar(&fromEmail, "from-email", "", "Sender email address.")
	cmd.Flags().StringVar(&replyToName, "reply-to-name", "", "Name set in the reply to field for the mail. Default value is sender name. Reply to name must have reply to email as well.")
	cmd.Flags().StringVar(&replyToEmail, "reply-to-email", "", "Email set in the reply to field for the mail. Default value is sender email. Reply to email must have reply to name as well.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	return cmd
}

func newMessagingUpdateMailgunProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var apiKey string
	var domain string
	var isEuRegion bool
	var enabled bool
	var fromName string
	var fromEmail string
	var replyToName string
	var replyToEmail string

	cmd := &cobra.Command{
		Use:   "update-mailgun-provider",
		Short: "Update a Mailgun provider by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.UpdateMailgunProviderOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateMailgunProviderName(name))
			}
			if cmd.Flags().Changed("api-key") {
				options = append(options, service.WithUpdateMailgunProviderApiKey(apiKey))
			}
			if cmd.Flags().Changed("domain") {
				options = append(options, service.WithUpdateMailgunProviderDomain(domain))
			}
			if cmd.Flags().Changed("is-eu-region") {
				options = append(options, service.WithUpdateMailgunProviderIsEuRegion(isEuRegion))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateMailgunProviderEnabled(enabled))
			}
			if cmd.Flags().Changed("from-name") {
				options = append(options, service.WithUpdateMailgunProviderFromName(fromName))
			}
			if cmd.Flags().Changed("from-email") {
				options = append(options, service.WithUpdateMailgunProviderFromEmail(fromEmail))
			}
			if cmd.Flags().Changed("reply-to-name") {
				options = append(options, service.WithUpdateMailgunProviderReplyToName(replyToName))
			}
			if cmd.Flags().Changed("reply-to-email") {
				options = append(options, service.WithUpdateMailgunProviderReplyToEmail(replyToEmail))
			}

			result, err := service.UpdateMailgunProvider(providerId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	cmd.Flags().StringVar(&apiKey, "api-key", "", "Mailgun API Key.")
	cmd.Flags().StringVar(&domain, "domain", "", "Mailgun Domain.")
	cmd.Flags().BoolVar(&isEuRegion, "is-eu-region", false, "Set as EU region.")
	cmd.Flags().Lookup("is-eu-region").NoOptDefVal = "true"
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&fromName, "from-name", "", "Sender Name.")
	cmd.Flags().StringVar(&fromEmail, "from-email", "", "Sender email address.")
	cmd.Flags().StringVar(&replyToName, "reply-to-name", "", "Name set in the reply to field for the mail. Default value is sender name.")
	cmd.Flags().StringVar(&replyToEmail, "reply-to-email", "", "Email set in the reply to field for the mail. Default value is sender email.")
	return cmd
}

func newMessagingCreateMsg91ProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var templateId string
	var senderId string
	var authKey string
	var enabled bool

	cmd := &cobra.Command{
		Use:   "create-msg-91-provider",
		Short: "Create a new MSG91 provider.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.CreateMsg91ProviderOption{}
			if cmd.Flags().Changed("template-id") {
				options = append(options, service.WithCreateMsg91ProviderTemplateId(templateId))
			}
			if cmd.Flags().Changed("sender-id") {
				options = append(options, service.WithCreateMsg91ProviderSenderId(senderId))
			}
			if cmd.Flags().Changed("auth-key") {
				options = append(options, service.WithCreateMsg91ProviderAuthKey(authKey))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateMsg91ProviderEnabled(enabled))
			}

			result, err := service.CreateMsg91Provider(providerId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&templateId, "template-id", "", "Msg91 template ID")
	cmd.Flags().StringVar(&senderId, "sender-id", "", "Msg91 sender ID.")
	cmd.Flags().StringVar(&authKey, "auth-key", "", "Msg91 auth key.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	return cmd
}

func newMessagingUpdateMsg91ProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var enabled bool
	var templateId string
	var senderId string
	var authKey string

	cmd := &cobra.Command{
		Use:   "update-msg-91-provider",
		Short: "Update a MSG91 provider by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.UpdateMsg91ProviderOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateMsg91ProviderName(name))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateMsg91ProviderEnabled(enabled))
			}
			if cmd.Flags().Changed("template-id") {
				options = append(options, service.WithUpdateMsg91ProviderTemplateId(templateId))
			}
			if cmd.Flags().Changed("sender-id") {
				options = append(options, service.WithUpdateMsg91ProviderSenderId(senderId))
			}
			if cmd.Flags().Changed("auth-key") {
				options = append(options, service.WithUpdateMsg91ProviderAuthKey(authKey))
			}

			result, err := service.UpdateMsg91Provider(providerId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&templateId, "template-id", "", "Msg91 template ID.")
	cmd.Flags().StringVar(&senderId, "sender-id", "", "Msg91 sender ID.")
	cmd.Flags().StringVar(&authKey, "auth-key", "", "Msg91 auth key.")
	return cmd
}

func newMessagingCreateResendProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var apiKey string
	var fromName string
	var fromEmail string
	var replyToName string
	var replyToEmail string
	var enabled bool

	cmd := &cobra.Command{
		Use:   "create-resend-provider",
		Short: "Create a new Resend provider.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.CreateResendProviderOption{}
			if cmd.Flags().Changed("api-key") {
				options = append(options, service.WithCreateResendProviderApiKey(apiKey))
			}
			if cmd.Flags().Changed("from-name") {
				options = append(options, service.WithCreateResendProviderFromName(fromName))
			}
			if cmd.Flags().Changed("from-email") {
				options = append(options, service.WithCreateResendProviderFromEmail(fromEmail))
			}
			if cmd.Flags().Changed("reply-to-name") {
				options = append(options, service.WithCreateResendProviderReplyToName(replyToName))
			}
			if cmd.Flags().Changed("reply-to-email") {
				options = append(options, service.WithCreateResendProviderReplyToEmail(replyToEmail))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateResendProviderEnabled(enabled))
			}

			result, err := service.CreateResendProvider(providerId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&apiKey, "api-key", "", "Resend API key.")
	cmd.Flags().StringVar(&fromName, "from-name", "", "Sender Name.")
	cmd.Flags().StringVar(&fromEmail, "from-email", "", "Sender email address.")
	cmd.Flags().StringVar(&replyToName, "reply-to-name", "", "Name set in the reply to field for the mail. Default value is sender name.")
	cmd.Flags().StringVar(&replyToEmail, "reply-to-email", "", "Email set in the reply to field for the mail. Default value is sender email.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	return cmd
}

func newMessagingUpdateResendProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var enabled bool
	var apiKey string
	var fromName string
	var fromEmail string
	var replyToName string
	var replyToEmail string

	cmd := &cobra.Command{
		Use:   "update-resend-provider",
		Short: "Update a Resend provider by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.UpdateResendProviderOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateResendProviderName(name))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateResendProviderEnabled(enabled))
			}
			if cmd.Flags().Changed("api-key") {
				options = append(options, service.WithUpdateResendProviderApiKey(apiKey))
			}
			if cmd.Flags().Changed("from-name") {
				options = append(options, service.WithUpdateResendProviderFromName(fromName))
			}
			if cmd.Flags().Changed("from-email") {
				options = append(options, service.WithUpdateResendProviderFromEmail(fromEmail))
			}
			if cmd.Flags().Changed("reply-to-name") {
				options = append(options, service.WithUpdateResendProviderReplyToName(replyToName))
			}
			if cmd.Flags().Changed("reply-to-email") {
				options = append(options, service.WithUpdateResendProviderReplyToEmail(replyToEmail))
			}

			result, err := service.UpdateResendProvider(providerId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&apiKey, "api-key", "", "Resend API key.")
	cmd.Flags().StringVar(&fromName, "from-name", "", "Sender Name.")
	cmd.Flags().StringVar(&fromEmail, "from-email", "", "Sender email address.")
	cmd.Flags().StringVar(&replyToName, "reply-to-name", "", "Name set in the Reply To field for the mail. Default value is Sender Name.")
	cmd.Flags().StringVar(&replyToEmail, "reply-to-email", "", "Email set in the Reply To field for the mail. Default value is Sender Email.")
	return cmd
}

func newMessagingCreateSendgridProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var apiKey string
	var fromName string
	var fromEmail string
	var replyToName string
	var replyToEmail string
	var enabled bool

	cmd := &cobra.Command{
		Use:   "create-sendgrid-provider",
		Short: "Create a new Sendgrid provider.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.CreateSendgridProviderOption{}
			if cmd.Flags().Changed("api-key") {
				options = append(options, service.WithCreateSendgridProviderApiKey(apiKey))
			}
			if cmd.Flags().Changed("from-name") {
				options = append(options, service.WithCreateSendgridProviderFromName(fromName))
			}
			if cmd.Flags().Changed("from-email") {
				options = append(options, service.WithCreateSendgridProviderFromEmail(fromEmail))
			}
			if cmd.Flags().Changed("reply-to-name") {
				options = append(options, service.WithCreateSendgridProviderReplyToName(replyToName))
			}
			if cmd.Flags().Changed("reply-to-email") {
				options = append(options, service.WithCreateSendgridProviderReplyToEmail(replyToEmail))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateSendgridProviderEnabled(enabled))
			}

			result, err := service.CreateSendgridProvider(providerId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&apiKey, "api-key", "", "Sendgrid API key.")
	cmd.Flags().StringVar(&fromName, "from-name", "", "Sender Name.")
	cmd.Flags().StringVar(&fromEmail, "from-email", "", "Sender email address.")
	cmd.Flags().StringVar(&replyToName, "reply-to-name", "", "Name set in the reply to field for the mail. Default value is sender name.")
	cmd.Flags().StringVar(&replyToEmail, "reply-to-email", "", "Email set in the reply to field for the mail. Default value is sender email.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	return cmd
}

func newMessagingUpdateSendgridProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var enabled bool
	var apiKey string
	var fromName string
	var fromEmail string
	var replyToName string
	var replyToEmail string

	cmd := &cobra.Command{
		Use:   "update-sendgrid-provider",
		Short: "Update a Sendgrid provider by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.UpdateSendgridProviderOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateSendgridProviderName(name))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateSendgridProviderEnabled(enabled))
			}
			if cmd.Flags().Changed("api-key") {
				options = append(options, service.WithUpdateSendgridProviderApiKey(apiKey))
			}
			if cmd.Flags().Changed("from-name") {
				options = append(options, service.WithUpdateSendgridProviderFromName(fromName))
			}
			if cmd.Flags().Changed("from-email") {
				options = append(options, service.WithUpdateSendgridProviderFromEmail(fromEmail))
			}
			if cmd.Flags().Changed("reply-to-name") {
				options = append(options, service.WithUpdateSendgridProviderReplyToName(replyToName))
			}
			if cmd.Flags().Changed("reply-to-email") {
				options = append(options, service.WithUpdateSendgridProviderReplyToEmail(replyToEmail))
			}

			result, err := service.UpdateSendgridProvider(providerId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&apiKey, "api-key", "", "Sendgrid API key.")
	cmd.Flags().StringVar(&fromName, "from-name", "", "Sender Name.")
	cmd.Flags().StringVar(&fromEmail, "from-email", "", "Sender email address.")
	cmd.Flags().StringVar(&replyToName, "reply-to-name", "", "Name set in the Reply To field for the mail. Default value is Sender Name.")
	cmd.Flags().StringVar(&replyToEmail, "reply-to-email", "", "Email set in the Reply To field for the mail. Default value is Sender Email.")
	return cmd
}

func newMessagingCreateSesProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var accessKey string
	var secretKey string
	var region string
	var fromName string
	var fromEmail string
	var replyToName string
	var replyToEmail string
	var enabled bool

	cmd := &cobra.Command{
		Use:   "create-ses-provider",
		Short: "Create a new Amazon SES provider.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.CreateSesProviderOption{}
			if cmd.Flags().Changed("access-key") {
				options = append(options, service.WithCreateSesProviderAccessKey(accessKey))
			}
			if cmd.Flags().Changed("secret-key") {
				options = append(options, service.WithCreateSesProviderSecretKey(secretKey))
			}
			if cmd.Flags().Changed("region") {
				options = append(options, service.WithCreateSesProviderRegion(region))
			}
			if cmd.Flags().Changed("from-name") {
				options = append(options, service.WithCreateSesProviderFromName(fromName))
			}
			if cmd.Flags().Changed("from-email") {
				options = append(options, service.WithCreateSesProviderFromEmail(fromEmail))
			}
			if cmd.Flags().Changed("reply-to-name") {
				options = append(options, service.WithCreateSesProviderReplyToName(replyToName))
			}
			if cmd.Flags().Changed("reply-to-email") {
				options = append(options, service.WithCreateSesProviderReplyToEmail(replyToEmail))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateSesProviderEnabled(enabled))
			}

			result, err := service.CreateSesProvider(providerId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&accessKey, "access-key", "", "AWS access key ID.")
	cmd.Flags().StringVar(&secretKey, "secret-key", "", "AWS secret access key.")
	cmd.Flags().StringVar(&region, "region", "", "AWS region, for example us-east-1.")
	cmd.Flags().StringVar(&fromName, "from-name", "", "Sender Name.")
	cmd.Flags().StringVar(&fromEmail, "from-email", "", "Sender email address.")
	cmd.Flags().StringVar(&replyToName, "reply-to-name", "", "Name set in the reply to field for the mail. Default value is sender name.")
	cmd.Flags().StringVar(&replyToEmail, "reply-to-email", "", "Email set in the reply to field for the mail. Default value is sender email.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	return cmd
}

func newMessagingUpdateSesProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var enabled bool
	var accessKey string
	var secretKey string
	var region string
	var fromName string
	var fromEmail string
	var replyToName string
	var replyToEmail string

	cmd := &cobra.Command{
		Use:   "update-ses-provider",
		Short: "Update an Amazon SES provider by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.UpdateSesProviderOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateSesProviderName(name))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateSesProviderEnabled(enabled))
			}
			if cmd.Flags().Changed("access-key") {
				options = append(options, service.WithUpdateSesProviderAccessKey(accessKey))
			}
			if cmd.Flags().Changed("secret-key") {
				options = append(options, service.WithUpdateSesProviderSecretKey(secretKey))
			}
			if cmd.Flags().Changed("region") {
				options = append(options, service.WithUpdateSesProviderRegion(region))
			}
			if cmd.Flags().Changed("from-name") {
				options = append(options, service.WithUpdateSesProviderFromName(fromName))
			}
			if cmd.Flags().Changed("from-email") {
				options = append(options, service.WithUpdateSesProviderFromEmail(fromEmail))
			}
			if cmd.Flags().Changed("reply-to-name") {
				options = append(options, service.WithUpdateSesProviderReplyToName(replyToName))
			}
			if cmd.Flags().Changed("reply-to-email") {
				options = append(options, service.WithUpdateSesProviderReplyToEmail(replyToEmail))
			}

			result, err := service.UpdateSesProvider(providerId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&accessKey, "access-key", "", "AWS access key ID.")
	cmd.Flags().StringVar(&secretKey, "secret-key", "", "AWS secret access key.")
	cmd.Flags().StringVar(&region, "region", "", "AWS region, for example us-east-1.")
	cmd.Flags().StringVar(&fromName, "from-name", "", "Sender Name.")
	cmd.Flags().StringVar(&fromEmail, "from-email", "", "Sender email address.")
	cmd.Flags().StringVar(&replyToName, "reply-to-name", "", "Name set in the Reply To field for the mail. Default value is Sender Name.")
	cmd.Flags().StringVar(&replyToEmail, "reply-to-email", "", "Email set in the Reply To field for the mail. Default value is Sender Email.")
	return cmd
}

func newMessagingCreateSmtpProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var host string
	var port int
	var username string
	var password string
	var encryption string
	var autoTls bool
	var mailer string
	var fromName string
	var fromEmail string
	var replyToName string
	var replyToEmail string
	var enabled bool

	cmd := &cobra.Command{
		Use:   "create-smtp-provider",
		Short: "Create a new SMTP provider.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.CreateSmtpProviderOption{}
			if cmd.Flags().Changed("port") {
				options = append(options, service.WithCreateSmtpProviderPort(port))
			}
			if cmd.Flags().Changed("username") {
				options = append(options, service.WithCreateSmtpProviderUsername(username))
			}
			if cmd.Flags().Changed("password") {
				options = append(options, service.WithCreateSmtpProviderPassword(password))
			}
			if cmd.Flags().Changed("encryption") {
				options = append(options, service.WithCreateSmtpProviderEncryption(encryption))
			}
			if cmd.Flags().Changed("auto-tls") {
				options = append(options, service.WithCreateSmtpProviderAutoTLS(autoTls))
			}
			if cmd.Flags().Changed("mailer") {
				options = append(options, service.WithCreateSmtpProviderMailer(mailer))
			}
			if cmd.Flags().Changed("from-name") {
				options = append(options, service.WithCreateSmtpProviderFromName(fromName))
			}
			if cmd.Flags().Changed("from-email") {
				options = append(options, service.WithCreateSmtpProviderFromEmail(fromEmail))
			}
			if cmd.Flags().Changed("reply-to-name") {
				options = append(options, service.WithCreateSmtpProviderReplyToName(replyToName))
			}
			if cmd.Flags().Changed("reply-to-email") {
				options = append(options, service.WithCreateSmtpProviderReplyToEmail(replyToEmail))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateSmtpProviderEnabled(enabled))
			}

			result, err := service.CreateSmtpProvider(providerId, name, host, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&host, "host", "", "SMTP hosts. Either a single hostname or multiple semicolon-delimited hostnames. You can also specify a different port for each host such as `smtp1.example.com:25;smtp2.example.com`. You can also specify encryption type, for example: `tls://smtp1.example.com:587;ssl://smtp2.example.com:465\"`. Hosts will be tried in order.")
	_ = cmd.MarkFlagRequired("host")
	cmd.Flags().IntVar(&port, "port", 0, "The default SMTP server port.")
	cmd.Flags().StringVar(&username, "username", "", "Authentication username.")
	cmd.Flags().StringVar(&password, "password", "", "Authentication password.")
	cmd.Flags().StringVar(&encryption, "encryption", "", "Encryption type. Can be omitted, 'ssl', or 'tls'")
	cmd.Flags().BoolVar(&autoTls, "auto-tls", false, "Enable SMTP AutoTLS feature.")
	cmd.Flags().Lookup("auto-tls").NoOptDefVal = "true"
	cmd.Flags().StringVar(&mailer, "mailer", "", "The value to use for the X-Mailer header.")
	cmd.Flags().StringVar(&fromName, "from-name", "", "Sender Name.")
	cmd.Flags().StringVar(&fromEmail, "from-email", "", "Sender email address.")
	cmd.Flags().StringVar(&replyToName, "reply-to-name", "", "Name set in the reply to field for the mail. Default value is sender name.")
	cmd.Flags().StringVar(&replyToEmail, "reply-to-email", "", "Email set in the reply to field for the mail. Default value is sender email.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	return cmd
}

func newMessagingUpdateSmtpProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var host string
	var port int
	var username string
	var password string
	var encryption string
	var autoTls bool
	var mailer string
	var fromName string
	var fromEmail string
	var replyToName string
	var replyToEmail string
	var enabled bool

	cmd := &cobra.Command{
		Use:   "update-smtp-provider",
		Short: "Update a SMTP provider by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.UpdateSmtpProviderOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateSmtpProviderName(name))
			}
			if cmd.Flags().Changed("host") {
				options = append(options, service.WithUpdateSmtpProviderHost(host))
			}
			if cmd.Flags().Changed("port") {
				options = append(options, service.WithUpdateSmtpProviderPort(port))
			}
			if cmd.Flags().Changed("username") {
				options = append(options, service.WithUpdateSmtpProviderUsername(username))
			}
			if cmd.Flags().Changed("password") {
				options = append(options, service.WithUpdateSmtpProviderPassword(password))
			}
			if cmd.Flags().Changed("encryption") {
				options = append(options, service.WithUpdateSmtpProviderEncryption(encryption))
			}
			if cmd.Flags().Changed("auto-tls") {
				options = append(options, service.WithUpdateSmtpProviderAutoTLS(autoTls))
			}
			if cmd.Flags().Changed("mailer") {
				options = append(options, service.WithUpdateSmtpProviderMailer(mailer))
			}
			if cmd.Flags().Changed("from-name") {
				options = append(options, service.WithUpdateSmtpProviderFromName(fromName))
			}
			if cmd.Flags().Changed("from-email") {
				options = append(options, service.WithUpdateSmtpProviderFromEmail(fromEmail))
			}
			if cmd.Flags().Changed("reply-to-name") {
				options = append(options, service.WithUpdateSmtpProviderReplyToName(replyToName))
			}
			if cmd.Flags().Changed("reply-to-email") {
				options = append(options, service.WithUpdateSmtpProviderReplyToEmail(replyToEmail))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateSmtpProviderEnabled(enabled))
			}

			result, err := service.UpdateSmtpProvider(providerId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	cmd.Flags().StringVar(&host, "host", "", "SMTP hosts. Either a single hostname or multiple semicolon-delimited hostnames. You can also specify a different port for each host such as `smtp1.example.com:25;smtp2.example.com`. You can also specify encryption type, for example: `tls://smtp1.example.com:587;ssl://smtp2.example.com:465\"`. Hosts will be tried in order.")
	cmd.Flags().IntVar(&port, "port", 0, "SMTP port.")
	cmd.Flags().StringVar(&username, "username", "", "Authentication username.")
	cmd.Flags().StringVar(&password, "password", "", "Authentication password.")
	cmd.Flags().StringVar(&encryption, "encryption", "", "Encryption type. Can be 'ssl' or 'tls'")
	cmd.Flags().BoolVar(&autoTls, "auto-tls", false, "Enable SMTP AutoTLS feature.")
	cmd.Flags().Lookup("auto-tls").NoOptDefVal = "true"
	cmd.Flags().StringVar(&mailer, "mailer", "", "The value to use for the X-Mailer header.")
	cmd.Flags().StringVar(&fromName, "from-name", "", "Sender Name.")
	cmd.Flags().StringVar(&fromEmail, "from-email", "", "Sender email address.")
	cmd.Flags().StringVar(&replyToName, "reply-to-name", "", "Name set in the Reply To field for the mail. Default value is Sender Name.")
	cmd.Flags().StringVar(&replyToEmail, "reply-to-email", "", "Email set in the Reply To field for the mail. Default value is Sender Email.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	return cmd
}

func newMessagingCreateTelesignProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var from string
	var customerId string
	var apiKey string
	var enabled bool

	cmd := &cobra.Command{
		Use:   "create-telesign-provider",
		Short: "Create a new Telesign provider.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.CreateTelesignProviderOption{}
			if cmd.Flags().Changed("from") {
				options = append(options, service.WithCreateTelesignProviderFrom(from))
			}
			if cmd.Flags().Changed("customer-id") {
				options = append(options, service.WithCreateTelesignProviderCustomerId(customerId))
			}
			if cmd.Flags().Changed("api-key") {
				options = append(options, service.WithCreateTelesignProviderApiKey(apiKey))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateTelesignProviderEnabled(enabled))
			}

			result, err := service.CreateTelesignProvider(providerId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&from, "from", "", "Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.")
	cmd.Flags().StringVar(&customerId, "customer-id", "", "Telesign customer ID.")
	cmd.Flags().StringVar(&apiKey, "api-key", "", "Telesign API key.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	return cmd
}

func newMessagingUpdateTelesignProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var enabled bool
	var customerId string
	var apiKey string
	var from string

	cmd := &cobra.Command{
		Use:   "update-telesign-provider",
		Short: "Update a Telesign provider by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.UpdateTelesignProviderOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateTelesignProviderName(name))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateTelesignProviderEnabled(enabled))
			}
			if cmd.Flags().Changed("customer-id") {
				options = append(options, service.WithUpdateTelesignProviderCustomerId(customerId))
			}
			if cmd.Flags().Changed("api-key") {
				options = append(options, service.WithUpdateTelesignProviderApiKey(apiKey))
			}
			if cmd.Flags().Changed("from") {
				options = append(options, service.WithUpdateTelesignProviderFrom(from))
			}

			result, err := service.UpdateTelesignProvider(providerId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&customerId, "customer-id", "", "Telesign customer ID.")
	cmd.Flags().StringVar(&apiKey, "api-key", "", "Telesign API key.")
	cmd.Flags().StringVar(&from, "from", "", "Sender number.")
	return cmd
}

func newMessagingCreateTextmagicProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var from string
	var username string
	var apiKey string
	var enabled bool

	cmd := &cobra.Command{
		Use:   "create-textmagic-provider",
		Short: "Create a new Textmagic provider.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.CreateTextmagicProviderOption{}
			if cmd.Flags().Changed("from") {
				options = append(options, service.WithCreateTextmagicProviderFrom(from))
			}
			if cmd.Flags().Changed("username") {
				options = append(options, service.WithCreateTextmagicProviderUsername(username))
			}
			if cmd.Flags().Changed("api-key") {
				options = append(options, service.WithCreateTextmagicProviderApiKey(apiKey))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateTextmagicProviderEnabled(enabled))
			}

			result, err := service.CreateTextmagicProvider(providerId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&from, "from", "", "Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.")
	cmd.Flags().StringVar(&username, "username", "", "Textmagic username.")
	cmd.Flags().StringVar(&apiKey, "api-key", "", "Textmagic apiKey.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	return cmd
}

func newMessagingUpdateTextmagicProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var enabled bool
	var username string
	var apiKey string
	var from string

	cmd := &cobra.Command{
		Use:   "update-textmagic-provider",
		Short: "Update a Textmagic provider by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.UpdateTextmagicProviderOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateTextmagicProviderName(name))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateTextmagicProviderEnabled(enabled))
			}
			if cmd.Flags().Changed("username") {
				options = append(options, service.WithUpdateTextmagicProviderUsername(username))
			}
			if cmd.Flags().Changed("api-key") {
				options = append(options, service.WithUpdateTextmagicProviderApiKey(apiKey))
			}
			if cmd.Flags().Changed("from") {
				options = append(options, service.WithUpdateTextmagicProviderFrom(from))
			}

			result, err := service.UpdateTextmagicProvider(providerId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&username, "username", "", "Textmagic username.")
	cmd.Flags().StringVar(&apiKey, "api-key", "", "Textmagic apiKey.")
	cmd.Flags().StringVar(&from, "from", "", "Sender number.")
	return cmd
}

func newMessagingCreateTwilioProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var from string
	var accountSid string
	var authToken string
	var enabled bool

	cmd := &cobra.Command{
		Use:   "create-twilio-provider",
		Short: "Create a new Twilio provider.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.CreateTwilioProviderOption{}
			if cmd.Flags().Changed("from") {
				options = append(options, service.WithCreateTwilioProviderFrom(from))
			}
			if cmd.Flags().Changed("account-sid") {
				options = append(options, service.WithCreateTwilioProviderAccountSid(accountSid))
			}
			if cmd.Flags().Changed("auth-token") {
				options = append(options, service.WithCreateTwilioProviderAuthToken(authToken))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateTwilioProviderEnabled(enabled))
			}

			result, err := service.CreateTwilioProvider(providerId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&from, "from", "", "Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.")
	cmd.Flags().StringVar(&accountSid, "account-sid", "", "Twilio account secret ID.")
	cmd.Flags().StringVar(&authToken, "auth-token", "", "Twilio authentication token.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	return cmd
}

func newMessagingUpdateTwilioProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var enabled bool
	var accountSid string
	var authToken string
	var from string

	cmd := &cobra.Command{
		Use:   "update-twilio-provider",
		Short: "Update a Twilio provider by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.UpdateTwilioProviderOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateTwilioProviderName(name))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateTwilioProviderEnabled(enabled))
			}
			if cmd.Flags().Changed("account-sid") {
				options = append(options, service.WithUpdateTwilioProviderAccountSid(accountSid))
			}
			if cmd.Flags().Changed("auth-token") {
				options = append(options, service.WithUpdateTwilioProviderAuthToken(authToken))
			}
			if cmd.Flags().Changed("from") {
				options = append(options, service.WithUpdateTwilioProviderFrom(from))
			}

			result, err := service.UpdateTwilioProvider(providerId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&accountSid, "account-sid", "", "Twilio account secret ID.")
	cmd.Flags().StringVar(&authToken, "auth-token", "", "Twilio authentication token.")
	cmd.Flags().StringVar(&from, "from", "", "Sender number.")
	return cmd
}

func newMessagingCreateVonageProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var from string
	var apiKey string
	var apiSecret string
	var enabled bool

	cmd := &cobra.Command{
		Use:   "create-vonage-provider",
		Short: "Create a new Vonage provider.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.CreateVonageProviderOption{}
			if cmd.Flags().Changed("from") {
				options = append(options, service.WithCreateVonageProviderFrom(from))
			}
			if cmd.Flags().Changed("api-key") {
				options = append(options, service.WithCreateVonageProviderApiKey(apiKey))
			}
			if cmd.Flags().Changed("api-secret") {
				options = append(options, service.WithCreateVonageProviderApiSecret(apiSecret))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithCreateVonageProviderEnabled(enabled))
			}

			result, err := service.CreateVonageProvider(providerId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringVar(&from, "from", "", "Sender Phone number. Format this number with a leading '+' and a country code, e.g., +16175551212.")
	cmd.Flags().StringVar(&apiKey, "api-key", "", "Vonage API key.")
	cmd.Flags().StringVar(&apiSecret, "api-secret", "", "Vonage API secret.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	return cmd
}

func newMessagingUpdateVonageProviderCommand() *cobra.Command {
	var providerId string
	var name string
	var enabled bool
	var apiKey string
	var apiSecret string
	var from string

	cmd := &cobra.Command{
		Use:   "update-vonage-provider",
		Short: "Update a Vonage provider by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.UpdateVonageProviderOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateVonageProviderName(name))
			}
			if cmd.Flags().Changed("enabled") {
				options = append(options, service.WithUpdateVonageProviderEnabled(enabled))
			}
			if cmd.Flags().Changed("api-key") {
				options = append(options, service.WithUpdateVonageProviderApiKey(apiKey))
			}
			if cmd.Flags().Changed("api-secret") {
				options = append(options, service.WithUpdateVonageProviderApiSecret(apiSecret))
			}
			if cmd.Flags().Changed("from") {
				options = append(options, service.WithUpdateVonageProviderFrom(from))
			}

			result, err := service.UpdateVonageProvider(providerId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID.")
	_ = cmd.MarkFlagRequired("provider-id")
	cmd.Flags().StringVar(&name, "name", "", "Provider name.")
	cmd.Flags().BoolVar(&enabled, "enabled", false, "Set as enabled.")
	cmd.Flags().Lookup("enabled").NoOptDefVal = "true"
	cmd.Flags().StringVar(&apiKey, "api-key", "", "Vonage API key.")
	cmd.Flags().StringVar(&apiSecret, "api-secret", "", "Vonage API secret.")
	cmd.Flags().StringVar(&from, "from", "", "Sender number.")
	return cmd
}

func newMessagingGetProviderCommand() *cobra.Command {
	var providerId string

	cmd := &cobra.Command{
		Use:   "get-provider",
		Short: "Get a provider by its unique ID.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			result, err := service.GetProvider(providerId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID.")
	_ = cmd.MarkFlagRequired("provider-id")
	return cmd
}

func newMessagingDeleteProviderCommand() *cobra.Command {
	var providerId string

	cmd := &cobra.Command{
		Use:   "delete-provider",
		Short: "Delete a provider by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			result, err := service.DeleteProvider(providerId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&providerId, "provider-id", "", "Provider ID.")
	_ = cmd.MarkFlagRequired("provider-id")
	return cmd
}

func newMessagingListTopicsCommand() *cobra.Command {
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
		Use:   "list-topics",
		Short: "Get a list of all topics from the current Appwrite project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

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
			options := []messaging.ListTopicsOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListTopicsQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListTopicsSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListTopicsTotal(total))
			}

			result, err := service.ListTopics(options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, description, emailTotal, smsTotal, pushTotal")
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

func newMessagingCreateTopicCommand() *cobra.Command {
	var topicId string
	var name string
	var subscribe []string

	cmd := &cobra.Command{
		Use:   "create-topic",
		Short: "Create a new topic.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.CreateTopicOption{}
			if cmd.Flags().Changed("subscribe") {
				options = append(options, service.WithCreateTopicSubscribe(subscribe))
			}

			result, err := service.CreateTopic(topicId, name, options...)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&topicId, "topic-id", "", "Topic ID. Choose a custom Topic ID or a new Topic ID.")
	_ = cmd.MarkFlagRequired("topic-id")
	cmd.Flags().StringVar(&name, "name", "", "Topic Name.")
	_ = cmd.MarkFlagRequired("name")
	cmd.Flags().StringArrayVar(&subscribe, "subscribe", nil, "An array of role strings with subscribe permission. By default all users are granted with any subscribe permission. learn more about roles (https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.")
	return cmd
}

func newMessagingGetTopicCommand() *cobra.Command {
	var topicId string

	cmd := &cobra.Command{
		Use:   "get-topic",
		Short: "Get a topic by its unique ID.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			result, err := service.GetTopic(topicId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&topicId, "topic-id", "", "Topic ID.")
	_ = cmd.MarkFlagRequired("topic-id")
	return cmd
}

func newMessagingUpdateTopicCommand() *cobra.Command {
	var topicId string
	var name string
	var subscribe []string

	cmd := &cobra.Command{
		Use:   "update-topic",
		Short: "Update a topic by its unique ID.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			// An unset flag must be omitted, not sent as its zero value: the
			// TypeScript passes undefined and the SDK drops it.
			options := []messaging.UpdateTopicOption{}
			if cmd.Flags().Changed("name") {
				options = append(options, service.WithUpdateTopicName(name))
			}
			if cmd.Flags().Changed("subscribe") {
				options = append(options, service.WithUpdateTopicSubscribe(subscribe))
			}

			result, err := service.UpdateTopic(topicId, options...)
			if err != nil {
				return sdk.WrapMutationError("PATCH", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&topicId, "topic-id", "", "Topic ID.")
	_ = cmd.MarkFlagRequired("topic-id")
	cmd.Flags().StringVar(&name, "name", "", "Topic Name.")
	cmd.Flags().StringArrayVar(&subscribe, "subscribe", nil, "An array of role strings with subscribe permission. By default all users are granted with any subscribe permission. learn more about roles (https://appwrite.io/docs/permissions#permission-roles). Maximum of 100 roles are allowed, each 64 characters long.")
	return cmd
}

func newMessagingDeleteTopicCommand() *cobra.Command {
	var topicId string

	cmd := &cobra.Command{
		Use:   "delete-topic",
		Short: "Delete a topic by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			result, err := service.DeleteTopic(topicId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&topicId, "topic-id", "", "Topic ID.")
	_ = cmd.MarkFlagRequired("topic-id")
	return cmd
}

func newMessagingListSubscribersCommand() *cobra.Command {
	var topicId string
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
		Use:   "list-subscribers",
		Short: "Get a list of all subscribers from the current Appwrite project.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

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
			options := []messaging.ListSubscribersOption{}
			if cmd.Flags().Changed("queries") {
				options = append(options, service.WithListSubscribersQueries(queries))
			}
			if cmd.Flags().Changed("search") {
				options = append(options, service.WithListSubscribersSearch(search))
			}
			if cmd.Flags().Changed("total") {
				options = append(options, service.WithListSubscribersTotal(total))
			}

			result, err := service.ListSubscribers(topicId, options...)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&topicId, "topic-id", "", "Topic ID. The topic ID subscribed to.")
	_ = cmd.MarkFlagRequired("topic-id")
	cmd.Flags().StringArrayVar(&queries, "queries", nil, "Array of query strings generated using the Query class provided by the SDK. Learn more about queries (https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: targetId, topicId, userId, providerType")
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

func newMessagingCreateSubscriberCommand() *cobra.Command {
	var topicId string
	var subscriberId string
	var targetId string

	cmd := &cobra.Command{
		Use:   "create-subscriber",
		Short: "Create a new subscriber.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			result, err := service.CreateSubscriber(topicId, subscriberId, targetId)
			if err != nil {
				return sdk.WrapMutationError("POST", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&topicId, "topic-id", "", "Topic ID. The topic ID to subscribe to.")
	_ = cmd.MarkFlagRequired("topic-id")
	cmd.Flags().StringVar(&subscriberId, "subscriber-id", "", "Subscriber ID. Choose a custom Subscriber ID or a new Subscriber ID.")
	_ = cmd.MarkFlagRequired("subscriber-id")
	cmd.Flags().StringVar(&targetId, "target-id", "", "Target ID. The target ID to link to the specified Topic ID.")
	_ = cmd.MarkFlagRequired("target-id")
	return cmd
}

func newMessagingGetSubscriberCommand() *cobra.Command {
	var topicId string
	var subscriberId string

	cmd := &cobra.Command{
		Use:   "get-subscriber",
		Short: "Get a subscriber by its unique ID.\n",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			result, err := service.GetSubscriber(topicId, subscriberId)
			if err != nil {
				return sdk.WrapMutationError("GET", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&topicId, "topic-id", "", "Topic ID. The topic ID subscribed to.")
	_ = cmd.MarkFlagRequired("topic-id")
	cmd.Flags().StringVar(&subscriberId, "subscriber-id", "", "Subscriber ID.")
	_ = cmd.MarkFlagRequired("subscriber-id")
	return cmd
}

func newMessagingDeleteSubscriberCommand() *cobra.Command {
	var topicId string
	var subscriberId string

	cmd := &cobra.Command{
		Use:   "delete-subscriber",
		Short: "Delete a subscriber by its unique ID.",
		RunE: func(cmd *cobra.Command, args []string) error {
			client, err := app.ClientForProject("")
			if err != nil {
				return err
			}
			service := messaging.New(client)

			result, err := service.DeleteSubscriber(topicId, subscriberId)
			if err != nil {
				return sdk.WrapMutationError("DELETE", err)
			}

			return app.Render(result)
		},
	}

	cmd.Flags().StringVar(&topicId, "topic-id", "", "Topic ID. The topic ID subscribed to.")
	_ = cmd.MarkFlagRequired("topic-id")
	cmd.Flags().StringVar(&subscriberId, "subscriber-id", "", "Subscriber ID.")
	_ = cmd.MarkFlagRequired("subscriber-id")
	return cmd
}
