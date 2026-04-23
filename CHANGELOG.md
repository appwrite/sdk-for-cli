# Change Log

## 19.0.0

* Breaking: Updated project command mappings and examples to singular `project` endpoints.
* Breaking: Changed local init site path handling and template download behavior.
* Added: Added explicit CLI program name registration for command output consistency.
* Updated: Updated Homebrew install instructions to use the Appwrite tap formula.
* Updated: Updated `X-Appwrite-Response-Format` header to `1.9.2`.

## 18.2.0

* Added source code and entrypoint validation before local function execution
* Added macOS code signature verification for standalone binary installs
* Added `webhooks` to the list of supported resource types
* Updated Open Runtimes version from v4 to v5
* Updated runtime start commands from `sh` to `bash` for improved compatibility
* Updated project init flow with contextual next steps and improved prompts
* Fixed Docker process error handling to report exit codes and signals
* Fixed function container startup to detect early exits before port open
* Fixed stderr output in Docker start to write to stderr instead of stdout

## 18.1.0

* Added site screenshot terminal preview after `push site` deployments
* Added standalone binary self-update support in `update` command
* Added installation method detection for smarter version checks (npm, Homebrew, standalone)
* Updated TypeScript query types to use `QueryableFieldValue` for improved type inference
* Fixed indentation in deployment error handling blocks

## 18.0.0

* Breaking: Moved `keys` commands from `projects` to `project` service. They no longer require `--project-id`, but `create-key` now requires `--key-id`
* Breaking: Moved `update-labels` from `projects` to `project` service
* Breaking: Moved platform commands from `projects` to `project` service and split generic `create-platform`/`update-platform` into platform-specific commands: `create-android-platform`, `create-apple-platform`, `create-linux-platform`, `create-web-platform`, `create-windows-platform` (and corresponding update variants). New methods no longer require `--project-id`, but require `--platform-id`, and `key` parameter was renamed to platform-specific terminology, such as `--bundle-identifier` or `--package-name`
* Added `webhooks` service with full pull and push support for project webhooks
* Added `project` service with `update-canonical-emails`, `update-disposable-emails`, `update-free-emails` commands
* Added `protocols` configuration section for REST, GraphQL, and WebSocket protocol status
* Added `--purge` option to `databases update-collection` and `tables-db update-table` commands
* Added `x` (Twitter/X) as supported OAuth2 provider
* Fixed console URL generation to normalize cloud.appwrite.io subdomains
* Fixed Linuxbrew path detection in update command

## 17.4.0

* Added `--activate` flag for `push function` to control deployment activation
* Added deployment logs with URLs and elapsed time after successful push
* Added explicit deployment activation step after function build completes
* Added `deploymentRetention` field to function initialization config
* Added `--template-repository`, `--template-owner`, `--template-root-directory`, `--template-version` options to `functions create`
* Added structured collection rendering for improved CLI output formatting
* Fixed console URL generation to properly strip `/v1` suffix
* Fixed force mode to always prompt for code pull confirmation
* Fixed sensitive key detection to match suffix-based patterns
* Fixed redaction hint display for JSON and raw output modes
* Fixed SDK client initialization for account, locale, migrations, proxy, and vcs services
* Moved `getSafeDirectoryName` to shared utils for pull commands
* Updated `.gitignore` rule handling to add rules individually

## 17.3.1

* Fixed: proxy CLI using console SDK instead of project SDK

## 17.3.0

* Added: Automatic update notifications with cached version checks
* Added: `create-json-export` and `create-json-import` migration commands
* Added: `--activate` flag for site push to control deployment activation
* Added: Deployment retention prompt during site initialization
* Updated: Improved `.gitignore` handling with hierarchical ignore support
* Updated: Function and site init now use safe directory names
* Updated: Config writer prunes empty resource arrays and deprecated site fields
* Fixed: Pinned `@appwrite.io/console` dependency to `~8.2.0`

## 17.2.1

* Fixed: Removed `bun.lock` from `.gitignore` so lockfile is tracked in version control

## 17.2.0

* Added `--show-secrets` flag to control display of sensitive values in output
* Added automatic redaction of secrets, API keys, tokens, and passwords in CLI output
* Added `init skill` command for installing Appwrite agent skills for AI coding agents
* Added automatic agent skills detection and installation during project initialization
* Added `OPEN_RUNTIMES_ENTRYPOINT` environment variable to function emulation
* Updated `-j` and `-R` output flag descriptions for clarity
* Fixed project init to gracefully handle override decline instead of exiting

## 17.1.0

* Added `organizations` command group with multiple subcommands
* Added `--raw` option for full raw JSON output in version command
* Updated docs for `organizations` commands with new examples

## 17.0.0

* [BREAKING] Changed `$sequence` type from `int` to `string` for rows and documents
* [BREAKING] Removed `--key` required option from `appwrite project update-variable` (now optional)
* [BREAKING] Removed billing/payment commands from `appwrite account`: `list-billing-addresses`, `create-billing-address`, `get-billing-address`, `update-billing-address`, `delete-billing-address`, `get-coupon`, `list-invoices`, `list-payment-methods`, `create-payment-method`, `get-payment-method`, `update-payment-method`, `delete-payment-method`, `update-payment-method-provider`, `update-payment-method-mandate-options`
* [BREAKING] Removed cloud-specific health commands: `get-console-pausing`, `get-queue-billing-project-aggregation`, `get-queue-billing-team-aggregation`, `get-queue-priority-builds`, `get-queue-region-manager`, `get-queue-threats`
* [BREAKING] Removed `appwrite projects update-console-access` command
* Added `--variable-id` required parameter to `appwrite project create-variable`
* Added `--queries` and `--total` optional parameters to `appwrite project list-variables`
* Added new `appwrite users update-impersonator` command
* Added `impersonator` as a filterable attribute in `appwrite users list`
* Updated API version badge to `1.9.0` and compatibility to server version `1.9.x`

## 16.0.0

* Breaking: Moved webhook commands from `projects` to new `webhooks` service.

## 15.1.0

* Added `resolveFileParam` to convert file or directory paths into `File` objects and tar.gz packages

## 15.0.0

* Breaking: Separated `specification` with `buildSpecification` and `runtimeSpecification`; added `deploymentRetention` to both functions and sites
* Added `startCommand` option for sites
* Updated `init sites` prompts to select `buildSpecification` and `runtimeSpecification`
* Improved unauthorized error messages

## 14.0.1

* Fixed `push tables` not passing `encrypt` parameter for varchar, text, mediumtext, and longtext string types
* Fixed NVM installation path not being detected by `update` command
* Updated `tar` dependency to v7.4.3

## 14.0.0

* Breaking: Changed createDeployment signature; activate option now optional with default true; parameter order updated
* Added TTL option for cached query results in listDocuments and listRows
* Added get-console-pausing health status command
* Added project management commands: update-console-access and update-status
* Updated site deployment docs to reflect new activate option
* Updated role length limit for teams to 81 characters
* Added appwriteImportSource and importExtension options to code generator

## 13.6.1

* Fix ESLind warnings in generated files with `appwrite generate` command.

## 13.6.0

* Fix large double values (e.g. `1.7976931348623157e+308`) being expanded into huge integer literals.
* Added `activities` command with `list-events` and `get-event`.
* Added `backups` command with full support for archives, policies, and restorations.
* Added account billing commands (addresses, coupons, invoices).
* Added account API key management commands.
* Added account payment method management commands (including provider and mandate updates).

## 13.5.0

* New: Added CLI commands under projects: `list-schedules`, `create-schedule`, and `get-schedule` for managing project schedules.
* Packaging/build: Updated packaging to support explicit ESM/CJS outputs with exports. main now points to dist/index.cjs, module to dist/index.js, and exports include type and entry-point mappings. This enables better compatibility for both ESM and CommonJS users.

## 13.4.0

* Add `--queries` option to `list-keys` command
* Add `--key-id` option to `create-key` command
* Add support for the new `Backups` service
* Add `encrypt` param support to new string type attributes
* Fix `bignumber.js` bundler conflict by removing direct dependency in favor of transitive dependency from `json-bigint`
* Fix missing region in console failUrl for failed deployments

## 13.3.2

- Fix handle null rows in table parser 
- Export config zod schemas

## 13.3.1

- Fix generated TS imports to auto-detect ESM vs non-ESM

## 13.3.0

- Support type generation for text/varchar/mediumtext/longtext attributes
- Improve CLI session switch and logout UX

## 13.2.1

- Fix site domain construction

## 13.2.0

- Feat: Add dedicated commands for text-based attribute management:
  - `create-varchar-attribute`, `create-text-attribute`, `create-mediumtext-attribute`, `create-longtext-attribute`
  - `update-varchar-attribute`, `update-text-attribute`, `update-mediumtext-attribute`, `update-longtext-attribute`
- Feat: Add specifications support to CLI
- Fix: Include specifications parameter when updating functions
- Chore: Update installation docs and examples for new text attribute/column commands
- Refactor: Simplify `update-collection` command syntax

## 13.1.0

- Mark `appwrite generate` command as stable
- Improve permissions param to be a typesafe callback
- Fix relationship handling in generated code
- Fix `appwrite client` properly hanlding `--key` parameter
- Fix `init site` not working on Windows

## 13.1.0-rc.3

- Allow generation of server side CRUD operations on databases and tables
- Fix npm distribution failing due to missing template files in bundle

## 13.1.0-rc.2

- Update generated `databases` services to automatically initialize a client instance
- Update generator to use handlebars templates

## 13.1.0-rc.1

- Feat: `appwrite generate` command to create a fully typesafe SDK for your Appwrite project
- Chore: improve creation of columns during table creation by passing them directly instead of creating them one by one
- Improved config validation by adding extra rules in zod schema

## 13.0.1

- Fix `project init` command leading to Cannot convert to BigInt error
- Fix filter out unwanted attributes being pulled in the config file

## 13.0.0

- Mark release as stable
- Feat: add pull sync on destruction of remote resources (+ confirmation)
- Fix: refine zod schema to check string size
- Validate using zod schema during push cli command
- Maintain order of keys in local config

## 13.0.0-rc.5

- Fix push all command not working correctly

## 13.0.0-rc.4

- Fix CLI ES module import issues

## 13.0.0-rc.3

- Add `Schema` class for programmatically pushing and pulling appwrite config
- Add client side db generation using `schema.db.generate()` command

## 13.0.0-rc.2

- Fixes a lot of typescript errors throughout the codebase

## 13.0.0-rc.1

- Migrates codebase from JavaScript to TypeScript

## 12.0.1

Fix type generation for `point`, `lineString` and `polygon` columns

## 12.0.0

* Change `create-deployment-template`'s `version` parameter to `type` and `reference`. eg. usage - `create-deployment-template --type tag --reference 1.0.0`
* Remove `bucket-id` parameter from `create-csv-export` command
* Allow enabling or disabling of image `transformations` in a bucket
* Fix type generation for `point`, `lineString` and `polygon` columns

## 11.1.1

* Fix duplicate `enums` during type generation by prefixing them with table name. For example, `enum MyEnum` will now be generated as `enum MyTableMyEnum` to avoid conflicts.

## 11.1.0

* Add `total` parameter to list queries allowing skipping counting rows in a table for improved performance

## 11.0.0

* Rename `create-csv-migration` to `create-csv-import` command to create a CSV import of a collection/table
* Add `create-csv-export` command to create a CSV export of a collection/table
* Add `create-resend-provider` and `update-resend-provider` commands to create and update a Resend Email provider
* Fix syncing of tables deleted locally during `push tables` command
* Fix added push command support for cli spatial types
* Fix attribute changing during push
* Replace pkg with @yao-pkg/pkg in dependencies

## 10.2.3

* Fix `init tables` command not working
* Improve tablesDB resource syncing during `push tables` command

## 10.2.2

* Fix `logout` command showing duplicate sessions
* Fix `logout` command showing a blank email even when logged out
* Add syncing of `tablesDB` resource during `push tables` command

## 10.2.1

* Add transaction support for Databases and TablesDB

## 10.1.0

* Deprecate `createVerification` method in `Account` service
* Add `createEmailVerification` method in `Account` service

## 10.0.1

* Fix CLI Dart model generation issues
* Fix row permissions and security sync
* Fix error when pushing columns with relationships
* Fix resource name from attributes to columns for TablesDB indexes

## 10.0.0

* **Breaking:** Removed Avatars CLI command and all related subcommands; corresponding examples deleted
* **Feat:** Geo defaults now accept coordinate arrays for Databases and Tables DB, with automatic normalization
* **Feat:** Pull command skips deprecated resources by default and shows clearer totals/messages
* **Feat:** Updated CLI descriptions: Databases marked legacy; added tables-db, projects, and project
* Fix TypeScript type generation now quotes invalid property names to produce valid typings
* Update documentation: Removed Avatars CLI examples and updated help text to reflect new geo defaults and terminology

## 8.3.0

* **Feat:** Add support for `appwrite.config.json` file
  * All new projects will be initialized with this configuration file
  * Resolves bundler conflicts (e.g., Vite) that incorrectly interpret `.json` files as library imports
* Add `incrementDocumentAttribute` and `decrementDocumentAttribute` support to `Databases` service
* Type generation fixes:
  * Fix relationships using the relatedCollection's id instead of name
  * Update auto generated comment to show relative path instead of absolute path

> **Note:** The existing `appwrite.json` file remains fully supported for backward compatibility

## 8.2.2

* Fix object comparison logic when pushing settings
* Type generation fixes:
   * Dart: Fixed import casing to snake_case, removed `extends Document` and hardcoded attributes, removed unnecessary imports
   * Java: Fixed indentation to 4 spaces, updated imports to `java.util.Objects`, fixed enum casing in strict mode as per [Oracle official docs](https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html)
   * Javascript: Updated optional values formatting from `|null` to `| null`
   * Kotlin: Fixed indentation to 4 spaces per [Kotlinlang official docs](https://kotlinlang.org/docs/coding-conventions.html#indentation)
   * PHP: Fixed indentation to 4 spaces per [PHP Fig official docs](https://www.php-fig.org/psr/psr-2/)
   * Swift: Fixed indentation to 4 spaces, improved `decodeIfPresent` usage for optionals, added missing `public` to `init` method
   * Typescript: Fixed indentation to 4 spaces per [Typescript coding guidelines](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines)

## 8.2.1

* Added `--with-variables` option to the Sites command for adding/updating environment variables  
* Fixed Functions environment variables not being pushed with `--with-variables`  
* Removed `awaitPools` when wiping old variables  

> **Note:** Storing environment variables in the `vars` attribute of `appwrite.json` is now deprecated due to security risks. Variables are now synced directly from the `.env` file in the root directory of the function’s or site’s folder.

## 8.2.0

* Add `encrypt` attribute support
* Add improved warnings on attribute recreation and deletion
* Fix `null` parsing error when using create attribute command
* Type generation fixes and improvements:
  * Add `--strict` / `-s` flag to `appwrite types` command to generate types in strict mode. This automatically converts the casing of attributes to match the language's naming conventions
  * Add automatic package import to `dart` language which uses package detection to import the correct package
  * Add `Document` class extension to generated types in `dart` and `js` language to support internal attributes like `$id` and `$collectionId` etc.
  * Add proper enum support to `js` language
  * Fix indentation in `java`, `kotlin` and `swift` to use 2 spaces instead of 4 for consistency across all languages
  * Fix doc comments to use correct syntax in various languages (for eg. `///` instead of `/*`)
  * Update enums in `dart` to use lowerCamelCase in `strict` mode as per [constant_identifier_names](https://dart.dev/tools/diagnostics/constant_identifier_names?utm_source=dartdev&utm_medium=redir&utm_id=diagcode&utm_content=constant_identifier_names)

## 8.1.1

* Fix circular dependency issue due to usage of `success` method in `utils.js` file from `parser.js` file
* Type generation fixes:
  * Add ability to generate types directly to a specific file by passing a file path to `appwrite types output_path`, instead of just a directory
  * Fix non-required attributes to not be null if default value is provided
  * Fix `Models` import error
  * Improve formatting and add auto-generated comments

## 8.1.0

* Add multi-region support to `init` command
* Update `init` command to clear previous configuration in `appwrite.json`
* Update localConfig to store multi-region endpoint
* Fix throw error when creating unknown attribute instead of timing out
* Fix equal comparison of large numbers and BigNumber instances using proper equality checks
* Fix duplication of reasons when comparing localConfig with remoteConfig
* Fix `firstOrNull()` to `firstOrNull` in types generation for dart
* Refactor to use `isCloud()` method consistently

## 8.0.2

* Add Type generation fixes:
  * Properly handle enum attributes in dart, java and kotlin
  * Fix initialisation of null attributes in dart's fromMap method
  * Fix relationships and enums in swift

## 8.0.1

* Add `resourceId` and `resourceType` attributes to `createRedirectRule`
* Add `providerReference` to vcs command for getting repository contents
* Add warning comment to `bulk updateDocuments` method
* Fix type generation for enums in Typescript and PHP language

## 8.0.0

* Add `types` command to generate language specific typings for collections. Currently supports - `php`, `swift`, `dart`, `js`, `ts`, `kotlin` and `java`
* Update bulk operation docs to include experiment feature warnings
* Remove assistant service and commands

## 7.0.0

* Add `sites` command
* Add `tokens` command
* Add `devKeys` support to `projects` command
* Add `init site`, `pull site` and `push site` commands
* Add bulk operation methods like `createDocuments`, `deleteDocuments` etc.
* Add new upsert methods: `upsertDocument` and `upsertDocuments`
* Update GET requests to not include content-type header

## 6.2.3

* Fix hot swapping error in `python-ml` function

## 6.2.2

* Fix GitHub builds by adding `qemu-system` package
* Fix attribute creation timed out

## 6.2.1

* Add `listOrganizations` method to `organizations` service and fix init project command

## 6.2.0

* Add specifications support to CLI
* Update package version
* Fix: Missed specifications param when updating a function
