// SDK
export const SDK_TITLE = 'Appwrite';
export const SDK_TITLE_LOWER = 'appwrite';
export const SDK_VERSION = '17.3.0';
export const SDK_NAME = 'Command Line';
export const SDK_PLATFORM = 'console';
export const SDK_LANGUAGE = 'cli';
export const SDK_LOGO = "\n    _                            _ _           ___   __   _____\n   \/_\\  _ __  _ ____      ___ __(_) |_ ___    \/ __\\ \/ \/   \\_   \\\n  \/\/_\\\\| '_ \\| '_ \\ \\ \/\\ \/ \/ '__| | __\/ _ \\  \/ \/   \/ \/     \/ \/\\\/\n \/  _  \\ |_) | |_) \\ V  V \/| |  | | ||  __\/ \/ \/___\/ \/___\/\\\/ \/_\n \\_\/ \\_\/ .__\/| .__\/ \\_\/\\_\/ |_|  |_|\\__\\___| \\____\/\\____\/\\____\/\n       |_|   |_|\n\n";

// CLI
export const EXECUTABLE_NAME = 'appwrite';
// 1 day
export const UPDATE_CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;

// NPM
export const NPM_PACKAGE_NAME = 'appwrite-cli';
export const NPM_REGISTRY_URL = `https://registry.npmjs.org/${NPM_PACKAGE_NAME}/latest`;

// GitHub
export const GITHUB_REPO = 'appwrite/appwrite-cli';
export const GITHUB_RELEASES_URL = `https://github.com/${GITHUB_REPO}/releases`;

// API
export const DEFAULT_ENDPOINT = 'https://cloud.appwrite.io/v1';

// Config resources
export const CONFIG_RESOURCE_KEYS = [
  "databases",
  "functions",
  "topics",
  "messages",
  "sites",
  "buckets",
  "tablesDB",
  "tables",
  "teams",
  "collections",
] as const;

export const TOP_LEVEL_RESOURCE_ARRAY_KEYS = new Set<string>(
  CONFIG_RESOURCE_KEYS,
);
