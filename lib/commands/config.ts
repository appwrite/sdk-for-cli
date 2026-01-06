import { z } from "zod";

const INT64_MIN = BigInt("-9223372036854775808");
const INT64_MAX = BigInt("9223372036854775807");

const createSettingsObject = (settings: any) => {
  return {
    services: {
      account: settings.serviceStatusForAccount,
      avatars: settings.serviceStatusForAvatars,
      databases: settings.serviceStatusForDatabases,
      locale: settings.serviceStatusForLocale,
      health: settings.serviceStatusForHealth,
      storage: settings.serviceStatusForStorage,
      teams: settings.serviceStatusForTeams,
      users: settings.serviceStatusForUsers,
      sites: settings.serviceStatusForSites,
      functions: settings.serviceStatusForFunctions,
      graphql: settings.serviceStatusForGraphql,
      messaging: settings.serviceStatusForMessaging,
    },
    auth: {
      methods: {
        jwt: settings.authJWT,
        phone: settings.authPhone,
        invites: settings.authInvites,
        anonymous: settings.authAnonymous,
        "email-otp": settings.authEmailOtp,
        "magic-url": settings.authUsersAuthMagicURL,
        "email-password": settings.authEmailPassword,
      },
      security: {
        duration: settings.authDuration,
        limit: settings.authLimit,
        sessionsLimit: settings.authSessionsLimit,
        passwordHistory: settings.authPasswordHistory,
        passwordDictionary: settings.authPasswordDictionary,
        personalDataCheck: settings.authPersonalDataCheck,
        sessionAlerts: settings.authSessionAlerts,
        mockNumbers: settings.authMockNumbers,
      },
    },
  };
};

const SiteSchema = z
  .object({
    path: z.string().optional(),
    $id: z.string(),
    name: z.string(),
    enabled: z.boolean().optional(),
    logging: z.boolean().optional(),
    timeout: z.number().optional(),
    framework: z.string().optional(),
    buildRuntime: z.string().optional(),
    adapter: z.string().optional(),
    installCommand: z.string().optional(),
    buildCommand: z.string().optional(),
    outputDirectory: z.string().optional(),
    fallbackFile: z.string().optional(),
    specification: z.string().optional(),
  })
  .strict();

const FunctionSchema = z
  .object({
    path: z.string().optional(),
    $id: z.string(),
    execute: z.array(z.string()).optional(),
    name: z.string(),
    enabled: z.boolean().optional(),
    logging: z.boolean().optional(),
    runtime: z.string().optional(),
    specification: z.string().optional(),
    scopes: z.array(z.string()).optional(),
    events: z.array(z.string()).optional(),
    schedule: z.string().optional(),
    timeout: z.number().optional(),
    entrypoint: z.string().optional(),
    commands: z.string().optional(),
  })
  .strict();

const int64Schema = z.preprocess(
  (val) => {
    if (typeof val === "bigint") {
      return val;
    }

    if (typeof val === "object" && val !== null) {
      if (typeof val.valueOf === "function") {
        try {
          const valueOfResult = val.valueOf();
          const bigIntVal = BigInt(valueOfResult as string | number | bigint);
          return bigIntVal;
        } catch (e) {
          return undefined;
        }
      }

      const num = Number(val);
      return !isNaN(num) ? BigInt(Math.trunc(num)) : undefined;
    }

    if (typeof val === "string") {
      try {
        return BigInt(val);
      } catch (e) {
        return undefined;
      }
    }

    if (typeof val === "number") {
      return BigInt(Math.trunc(val));
    }

    return val;
  },
  z
    .bigint()
    .nullable()
    .optional()
    .superRefine((val, ctx) => {
      if (val === undefined || val === null) return;

      if (val < INT64_MIN || val > INT64_MAX) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `must be between ${INT64_MIN} and ${INT64_MAX} (64-bit signed integer range)`,
        });
      }
    }),
);

const AttributeSchemaBase = z
  .object({
    key: z.string(),
    type: z.enum([
      "string",
      "integer",
      "double",
      "boolean",
      "datetime",
      "relationship",
      "linestring",
      "point",
      "polygon",
    ]),
    required: z.boolean().optional(),
    array: z.boolean().optional(),
    size: z.number().optional(),
    default: z.any().optional(),
    min: int64Schema,
    max: int64Schema,
    format: z
      .union([
        z.enum(["email", "enum", "url", "ip", "datetime"]),
        z.literal(""),
      ])
      .optional(),
    elements: z.array(z.string()).optional(),
    relatedCollection: z.string().optional(),
    relationType: z.string().optional(),
    twoWay: z.boolean().optional(),
    twoWayKey: z.string().optional(),
    onDelete: z.string().optional(),
    side: z.string().optional(),
    attributes: z.array(z.string()).optional(),
    orders: z.array(z.string()).optional(),
    encrypt: z.boolean().optional(),
  })
  .strict();

const AttributeSchema = AttributeSchemaBase.refine(
  (data) => {
    if (data.required === true && data.default !== null) {
      return false;
    }
    return true;
  },
  {
    message: "When 'required' is true, 'default' must be null",
    path: ["default"],
  },
);

const IndexSchema = z
  .object({
    key: z.string(),
    type: z.string(),
    status: z.string().optional(),
    attributes: z.array(z.string()),
    orders: z.array(z.string()).optional(),
  })
  .strict();

const CollectionSchema = z
  .object({
    $id: z.string(),
    $permissions: z.array(z.string()).optional(),
    databaseId: z.string(),
    name: z.string(),
    enabled: z.boolean().optional(),
    documentSecurity: z.boolean().default(true),
    attributes: z.array(AttributeSchema).optional(),
    indexes: z.array(IndexSchema).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.attributes && data.attributes.length > 0) {
      const seenKeys = new Set<string>();
      const duplicateKeys = new Set<string>();

      data.attributes.forEach((attr, index) => {
        if (seenKeys.has(attr.key)) {
          duplicateKeys.add(attr.key);
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Attribute with the key '${attr.key}' already exists. Attribute keys must be unique, try again with a different key.`,
            path: ["attributes", index, "key"],
          });
        } else {
          seenKeys.add(attr.key);
        }
      });
    }

    if (data.indexes && data.indexes.length > 0) {
      const seenKeys = new Set<string>();
      const duplicateKeys = new Set<string>();

      data.indexes.forEach((index, indexPos) => {
        if (seenKeys.has(index.key)) {
          duplicateKeys.add(index.key);
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Index with the key '${index.key}' already exists. Index keys must be unique, try again with a different key.`,
            path: ["indexes", indexPos, "key"],
          });
        } else {
          seenKeys.add(index.key);
        }
      });
    }
  });

const DatabaseSchema = z
  .object({
    $id: z.string(),
    name: z.string(),
    enabled: z.boolean().optional(),
  })
  .strict();

const BucketSchema = z
  .object({
    $id: z.string(),
    $permissions: z.array(z.string()).optional(),
    fileSecurity: z.boolean().optional(),
    name: z.string(),
    enabled: z.boolean().optional(),
    maximumFileSize: z.number().optional(),
    allowedFileExtensions: z.array(z.string()).optional(),
    compression: z.string().optional(),
    encryption: z.boolean().optional(),
    antivirus: z.boolean().optional(),
  })
  .strict();

const TopicSchema = z
  .object({
    $id: z.string(),
    name: z.string(),
    subscribe: z.array(z.string()).optional(),
  })
  .strict();

const TeamSchema = z
  .object({
    $id: z.string(),
    name: z.string(),
  })
  .strict();

const MessageSchema = z
  .object({
    $id: z.string(),
    name: z.string(),
    emailTotal: z.number().optional(),
    smsTotal: z.number().optional(),
    pushTotal: z.number().optional(),
    subscribe: z.array(z.string()).optional(),
  })
  .strict();

const SettingsSchema = z
  .object({
    services: z
      .object({
        account: z.boolean().optional(),
        avatars: z.boolean().optional(),
        databases: z.boolean().optional(),
        locale: z.boolean().optional(),
        health: z.boolean().optional(),
        storage: z.boolean().optional(),
        teams: z.boolean().optional(),
        users: z.boolean().optional(),
        sites: z.boolean().optional(),
        functions: z.boolean().optional(),
        graphql: z.boolean().optional(),
        messaging: z.boolean().optional(),
      })
      .strict()
      .optional(),
    auth: z
      .object({
        methods: z
          .object({
            jwt: z.boolean().optional(),
            phone: z.boolean().optional(),
            invites: z.boolean().optional(),
            anonymous: z.boolean().optional(),
            "email-otp": z.boolean().optional(),
            "magic-url": z.boolean().optional(),
            "email-password": z.boolean().optional(),
          })
          .strict()
          .optional(),
        security: z
          .object({
            duration: z.number().optional(),
            limit: z.number().optional(),
            sessionsLimit: z.number().optional(),
            passwordHistory: z.number().optional(),
            passwordDictionary: z.boolean().optional(),
            personalDataCheck: z.boolean().optional(),
            sessionAlerts: z.boolean().optional(),
            mockNumbers: z
              .array(
                z
                  .object({
                    phone: z.string(),
                    otp: z.string(),
                  })
                  .strict(),
              )
              .optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

const configSchema = z
  .object({
    projectId: z.string(),
    projectName: z.string().optional(),
    endpoint: z.string().optional(),
    settings: SettingsSchema.optional(),
    functions: z.array(FunctionSchema).optional(),
    sites: z.array(SiteSchema).optional(),
    databases: z.array(DatabaseSchema).optional(),
    collections: z.array(CollectionSchema).optional(),
    topics: z.array(TopicSchema).optional(),
    teams: z.array(TeamSchema).optional(),
    buckets: z.array(BucketSchema).optional(),
    messages: z.array(MessageSchema).optional(),
  })
  .strict();

export type ConfigType = z.infer<typeof configSchema>;
export {
  configSchema,
  SiteSchema,
  FunctionSchema,
  CollectionSchema,
  DatabaseSchema,
  BucketSchema,
  TopicSchema,
  TeamSchema,
  MessageSchema,
  SettingsSchema,
  AttributeSchema,
  AttributeSchemaBase,
  IndexSchema,
  createSettingsObject,
};
