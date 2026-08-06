package cmd

import (
	"fmt"
	"os"
	"sort"
	"strings"

	"github.com/charmbracelet/lipgloss"
	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
	"golang.org/x/term"

	"github.com/appwrite/sdk-for-cli/internal/output"
)

// The main help screen. cobra's default lists 40-odd services alphabetically
// with a paragraph each; this groups them by intent with one-line summaries.
//
// The groups, summaries and option order are generated from
// CliCommandSurface::HELP_GROUPS, ::HELP_SUMMARIES and ::HELP_OPTION_ORDER --
// the same tables help.ts is generated from, so the two screens cannot drift.

// helpGroup is one titled section of the listing.
type helpGroup struct {
	title string
	// dim greys the whole section, which is what DEPRECATED is for.
	dim bool
	// commands are paths as typed, so a promoted root command such as
	// `list-projects` can sit beside `login`.
	commands []string
}

var helpGroups = []helpGroup{
	{
		title: "GET STARTED",
		commands: []string{
			"login",
			"list-organizations",
			"list-projects",
			"init",
			"pull",
			"push",
			"run",
			"whoami",
		},
	},
	{
		title: "PROJECT",
		commands: []string{
			"organization",
			"project",
			"apps",
			"proxy",
			"vcs",
			"webhooks",
		},
	},
	{
		title: "RESOURCES",
		commands: []string{
			"account",
			"users",
			"teams",
			"tablesdb",
			"storage",
			"functions",
			"sites",
			"messaging",
			"tokens",
			"backups",
			"presences",
		},
	},
	{
		title: "UTILITIES",
		commands: []string{
			"graphql",
			"generate",
			"types",
			"locale",
			"activities",
			"migrations",
			"notifications",
			"oauth2",
			"client",
			"completion",
			"logout",
			"update",
		},
	},
	{
		title: "DEPRECATED",
		dim:   true,
		commands: []string{
			"databases",
		},
	},
}

// helpSummaries are the one-line summaries for the listing. A command's own
// Short and Long stay the longer form shown on its own help page.
var helpSummaries = map[string]string{
	"login":              "Authenticate with your Appwrite account",
	"list-organizations": "Organizations your session can access",
	"list-projects":      "Projects your session can access",
	"init":               "Scaffold a project, function, site, or resource",
	"pull":               "Pull remote project resources into this directory",
	"push":               "Push local project resources",
	"run":                "Run the project locally for development",
	"whoami":             "Show the currently authenticated account",
	"organization":       "Manage organization-level projects",
	"project":            "Usage, variables, and project-level settings",
	"apps":               "OAuth2 applications, keys, scopes, installations",
	"proxy":              "Domain configuration beyond DNS",
	"vcs":                "Connect and manage VCS repositories",
	"webhooks":           "Project webhooks",
	"account":            "Manage your own user account",
	"users":              "Manage project users",
	"teams":              "Group users to share resource access",
	"tablesdb":           "Structured tables of rows and columns",
	"storage":            "Files and buckets",
	"functions":          "Serverless functions, deployments, and executions",
	"sites":              "Static and SSR sites and their deployments",
	"messaging":          "Topics, subscribers, and message delivery",
	"tokens":             "Resource tokens for secure file access",
	"backups":            "Backup policies, archives, and restorations",
	"presences":          "Real-time user presence tracking",
	"graphql":            "Query and mutate any resource via GraphQL",
	"generate":           "Generate a type-safe SDK from your project config",
	"types":              "Generate TypeScript types for your project",
	"locale":             "Localize your app based on user location",
	"activities":         "List and inspect project activity events",
	"migrations":         "Migrate data between services",
	"notifications":      "Console notifications",
	"oauth2":             "Authorize apps and issue OAuth2 and OIDC tokens",
	"client":             "Configure the CLI itself",
	"completion":         "Generate shell completion scripts",
	"logout":             "Log out of your Appwrite account",
	"update":             "Update the CLI to the latest version",
	"databases":          "Use `tablesdb` instead",
}

// helpOptionOrder is the order of the global flags, by long flag. Anything
// unlisted is appended, alphabetically.
var helpOptionOrder = []string{
	"--version",
	"--help",
	"--json",
	"--raw",
	"--show-secrets",
	"--verbose",
	"--force",
	"--all",
	"--id",
	"--report",
}

// helpLogo is the ASCII art above the screen.
const helpLogo = "\n    _                            _ _           ___   __   _____\n   /_\\  _ __  _ ____      ___ __(_) |_ ___    / __\\ / /   \\_   \\\n  //_\\\\| '_ \\| '_ \\ \\ /\\ / / '__| | __/ _ \\  / /   / /     / /\\/\n /  _  \\ |_) | |_) \\ V  V /| |  | | ||  __/ / /___/ /___/\\/ /_\n \\_/ \\_/ .__/| .__/ \\_/\\_/ |_|  |_|\\__\\___| \\____/\\____/\\____/\n       |_|   |_|\n\n"

// helpDescription is the paragraph under the logo.
//
// shortDescription, not description: the TypeScript screen renders
// `packageJson.description`, and package.json.twig fills that from
// `sdk.shortDescription`. Reading the other one put a different paragraph on
// the two screens.
const helpDescription = "Appwrite is an open-source self-hosted backend server that abstracts and simplifies complex and repetitive development tasks behind a very simple REST API"

const (
	// helpMaxWidth caps the screen on a wide terminal: a summary column that
	// runs to 200 columns is harder to read, not easier.
	helpMaxWidth = 80
	helpGap      = 2
	helpIndent   = "  "
)

var (
	helpLogoStyle  = lipgloss.NewStyle().Foreground(lipgloss.Color("9"))
	helpTitleStyle = lipgloss.NewStyle().Bold(true)
	helpDimStyle   = lipgloss.NewStyle().Faint(true)
)

// registerMainHelp replaces cobra's help screen for the ROOT command only.
//
// A help function is inherited, so this has to fall back to the one cobra
// installed for anything below the root -- `appwrite users --help` is a listing
// of that service, which cobra already renders well.
func registerMainHelp(root *cobra.Command) {
	// Captured before the override, so it is cobra's own implementation rather
	// than this function calling itself.
	fallback := root.HelpFunc()

	// cobra adds both of these lazily, and their generated usage text reads
	// "help for appwrite". Force them now so the wording is ours and so
	// --version and --help appear in OPTIONS at all.
	root.InitDefaultHelpFlag()
	root.InitDefaultVersionFlag()
	if flag := root.Flags().Lookup("help"); flag != nil {
		flag.Usage = "Display help for a command"
	}
	if flag := root.Flags().Lookup("version"); flag != nil {
		flag.Usage = "Output the CLI version"
	}

	root.SetHelpFunc(func(command *cobra.Command, arguments []string) {
		if command != root {
			fallback(command, arguments)

			return
		}

		fmt.Fprint(command.OutOrStdout(), RenderMainHelp(root))
	})
}

// helpRow is one line of a section: the command as typed and its summary.
type helpRow struct {
	name    string
	summary string
}

type helpSection struct {
	title string
	dim   bool
	rows  []helpRow
}

// RenderMainHelp builds the screen. Exported so a test can assert it without
// going through cobra's help plumbing.
func RenderMainHelp(root *cobra.Command) string {
	width := helpWidth()

	sections := make([]helpSection, 0, len(helpGroups)+1)
	claimed := map[string]bool{}

	for _, group := range helpGroups {
		rows := make([]helpRow, 0, len(group.commands))
		for _, path := range group.commands {
			claimed[path] = true

			// A group names commands the spec may not produce -- an exclusion
			// list, or an older API version -- so a missing one is skipped
			// rather than printed as an empty row.
			child := resolveCommand(root, path)
			if child == nil || !isListedInHelp(child) {
				continue
			}

			rows = append(rows, helpRow{name: path, summary: summaryOf(child, path)})
		}

		if len(rows) > 0 {
			sections = append(sections, helpSection{title: group.title, dim: group.dim, rows: rows})
		}
	}

	// Anything the tables do not name still appears, so a command added to the
	// CLI or a service added to the spec can never silently vanish from --help.
	other := make([]helpRow, 0)
	for _, child := range root.Commands() {
		if !isListedInHelp(child) || claimed[child.Name()] {
			continue
		}

		other = append(other, helpRow{name: child.Name(), summary: summaryOf(child, child.Name())})
	}
	if len(other) > 0 {
		sections = append(sections, helpSection{title: "OTHER", rows: other})
	}

	// One column across every section, so the summaries line up down the whole
	// screen rather than per group.
	nameWidth := 0
	for _, section := range sections {
		for _, row := range section.rows {
			if length := len(row.name); length > nameWidth {
				nameWidth = length
			}
		}
	}

	lines := make([]string, 0, 8)

	// A generation that passes no logo gets no blank lines where it would have
	// been. The conformance build is one.
	if logo := renderLogo(); logo != "" {
		lines = append(lines, logo, "")
	}

	lines = append(lines,
		wrapHelpText(helpDescription, width-helpGap-helpGap, helpIndent),
		"",
		helpTitleStyle.Render("USAGE"),
		helpIndent+root.Name()+" [options] <command> [subcommand]",
	)

	for _, section := range sections {
		lines = append(lines, "", helpTitleStyle.Render(section.title))
		for _, row := range section.rows {
			// TrimRight because a command whose description the spec leaves empty
			// has no summary, and the padded name would then end the line in
			// whitespace. The TypeScript pads unconditionally, but it has a
			// summary for everything it lists, so this cannot make the two
			// screens differ -- it only keeps the Go one clean where a service
			// arrives without a description.
			line := strings.TrimRight(
				helpIndent+output.Pad(row.name, nameWidth)+strings.Repeat(" ", helpGap)+row.summary, " ")
			if section.dim {
				line = helpDimStyle.Render(line)
			}
			lines = append(lines, line)
		}
	}

	lines = append(lines,
		"",
		helpTitleStyle.Render("OPTIONS"),
		renderHelpOptions(root),
		"",
		helpDimStyle.Render(fmt.Sprintf(
			"Run `%s <command> --help` for details on a specific command.", root.Name())),
		"",
	)

	return strings.Join(lines, "\n")
}

// renderLogo colours the ASCII art a line at a time.
//
// Not one Render of the whole block: lipgloss pads every line of a multi-line
// block out to the width of the widest one, which leaves trailing spaces on
// most of the art. Invisible on a terminal, but it makes the screen impossible
// to compare against the TypeScript CLI's byte for byte.
func renderLogo() string {
	lines := strings.Split(strings.TrimRight(helpLogo, "\n"), "\n")
	for index, line := range lines {
		lines[index] = helpLogoStyle.Render(line)
	}

	return strings.Join(lines, "\n")
}

// resolveCommand walks a space-separated path against the tree, matching a name
// or any alias, and returns nil if any segment is missing.
func resolveCommand(root *cobra.Command, path string) *cobra.Command {
	current := root

	for _, segment := range strings.Split(path, " ") {
		var found *cobra.Command
		for _, child := range current.Commands() {
			if child.Name() == segment {
				found = child

				break
			}
			for _, alias := range child.Aliases {
				if alias == segment {
					found = child

					break
				}
			}
			if found != nil {
				break
			}
		}

		if found == nil {
			return nil
		}
		current = found
	}

	if current == root {
		return nil
	}

	return current
}

// isListedInHelp mirrors cobra's IsAvailableCommand, minus its own `help`.
func isListedInHelp(command *cobra.Command) bool {
	return command.Name() != "help" && !command.Hidden && !command.IsAdditionalHelpTopicCommand()
}

// summaryOf prefers the declared summary, then the command's own Short, then
// the first sentence of its Long -- so a command with no summary still reads as
// one line rather than as a paragraph.
func summaryOf(command *cobra.Command, path string) string {
	if declared, ok := helpSummaries[path]; ok {
		return declared
	}

	if command.Short != "" {
		return firstSentence(command.Short)
	}

	return firstSentence(command.Long)
}

func firstSentence(text string) string {
	if index := strings.Index(text, ". "); index >= 0 {
		text = text[:index]
	}

	return strings.TrimSuffix(strings.TrimSpace(text), ".")
}

// renderHelpOptions lists the root's flags in helpOptionOrder.
func renderHelpOptions(root *cobra.Command) string {
	type option struct {
		term  string
		usage string
		rank  int
		name  string
	}

	options := make([]option, 0)
	collect := func(flag *pflag.Flag) {
		if flag.Hidden {
			return
		}

		rank := len(helpOptionOrder)
		for index, long := range helpOptionOrder {
			if long == "--"+flag.Name {
				rank = index

				break
			}
		}

		options = append(options, option{
			term:  optionTerm(flag),
			usage: flag.Usage,
			rank:  rank,
			name:  flag.Name,
		})
	}
	root.PersistentFlags().VisitAll(collect)
	// --version and --help are local to the root rather than persistent.
	root.LocalNonPersistentFlags().VisitAll(collect)

	sort.SliceStable(options, func(left, right int) bool {
		if options[left].rank != options[right].rank {
			return options[left].rank < options[right].rank
		}

		return options[left].name < options[right].name
	})

	termWidth := 0
	for _, entry := range options {
		if length := len(entry.term); length > termWidth {
			termWidth = length
		}
	}

	lines := make([]string, 0, len(options))
	for _, entry := range options {
		lines = append(lines, strings.TrimRight(
			helpIndent+output.Pad(entry.term, termWidth)+strings.Repeat(" ", helpGap)+entry.usage, " "))
	}

	return strings.Join(lines, "\n")
}

// optionTerm is how a flag is spelled in the listing: `-j, --json` with a
// shorthand, `--show-secrets` without, and the value placeholder for a flag
// that takes one.
func optionTerm(flag *pflag.Flag) string {
	term := "--" + flag.Name
	if flag.Shorthand != "" {
		term = "-" + flag.Shorthand + ", " + term
	}

	if name, _ := pflag.UnquoteUsage(flag); name != "" {
		term += " <" + name + ">"
	}

	return term
}

// helpMinimumColumns is the narrowest column the paragraph is wrapped into.
// help.ts passes 2 rather than commander's default 40, so the screen keeps
// wrapping all the way down. Matching it also keeps a terminal reporting 3
// columns from reaching the loop with a negative width.
const helpMinimumColumns = 2

// wrapHelpText reproduces commander's Help.wrap, including two quirks a
// from-scratch word wrap does not have: a line holds columns-1 characters, and
// the first line carries two extra characters that were never measured because
// commander wraps only the remainder after `indent`. Reproducing both is what
// makes the two CLIs' screens identical at every width, not just at 80.
func wrapHelpText(text string, columns int, indent string) string {
	// A DELIBERATE deviation: commander returns the indent for an empty or
	// all-whitespace description, which puts a line of trailing spaces on the
	// screen. Nothing generated has an empty description, and a blank line is
	// worse than no line.
	if strings.TrimSpace(text) == "" {
		return ""
	}

	if columns < helpMinimumColumns {
		return indent + text
	}

	// commander's `indent` argument, which help.ts passes as 2 -- the same width
	// as the indent it prefixes the result with.
	unmeasured := len(indent)
	if len(text) <= unmeasured {
		return indent + text
	}

	chunks := wrapChunks(text[unmeasured:], columns-1)

	wrapped := indent + text[:unmeasured] + chunks[0]
	for _, chunk := range chunks[1:] {
		wrapped += "\n" + indent + chunk
	}

	return wrapped
}

// wrapChunks splits text the way commander's regex does: at each position, the
// longest run of at most limit characters that is followed by a space or by the
// end of the string; failing that, the next whole word, however long.
func wrapChunks(text string, limit int) []string {
	chunks := make([]string, 0, 8)

	for position := 0; position < len(text); {
		length := 0
		for candidate := min(limit, len(text)-position); candidate >= 1; candidate-- {
			if position+candidate == len(text) || text[position+candidate] == ' ' {
				length = candidate

				break
			}
		}

		if length == 0 {
			// A word longer than the column: the regex's second alternative
			// takes it whole rather than breaking it.
			length = strings.IndexByte(text[position:], ' ')
			if length < 0 {
				length = len(text) - position
			}
		}

		// A run of consecutive spaces yields a chunk that is nothing but
		// whitespace. commander never emits a blank line for one, so neither
		// does this.
		if chunk := strings.TrimRight(text[position:position+length], " "); chunk != "" {
			chunks = append(chunks, chunk)
		}

		// The break character itself is consumed.
		position += length + 1
	}

	if len(chunks) == 0 {
		return []string{""}
	}

	return chunks
}

// helpWidth is the terminal's width, capped at helpMaxWidth. A terminal that
// reports nothing -- a pipe, a CI log -- gets the cap.
func helpWidth() int {
	width, _, err := term.GetSize(int(os.Stdout.Fd()))
	if err != nil || width <= 0 || width > helpMaxWidth {
		return helpMaxWidth
	}

	return width
}
