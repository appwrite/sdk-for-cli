import { Command } from "commander";
import { sdkForProject } from "../../sdks.js";
import {
  actionRunner,
  commandDescriptions,
  success,
  parse,
  parseBool,
  parseInteger,
} from "../../parser.js";
import { Organizations } from "@appwrite.io/console";

let organizationsClient: Organizations | null = null;

const getOrganizationsClient = async (): Promise<Organizations> => {
  if (!organizationsClient) {
    const sdkClient = await sdkForProject();
    organizationsClient = new Organizations(sdkClient);
  }
  return organizationsClient;
};

export const organizations = new Command("organizations")
  .description(commandDescriptions["organizations"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

organizations
  .command(`list`)
  .description(`Get a list of all the teams in which the current user is a member. You can use the parameters to filter your results.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: name, total, billingPlan, paymentMethodId, backupPaymentMethodId, platform`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ queries, search }) =>
        parse(await (await getOrganizationsClient()).list(queries, search)),
    ),
  );

organizations
  .command(`create`)
  .description(`Create a new organization.
`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID. Choose a custom ID or generate a random ID with \`ID.unique()\`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.`)
  .requiredOption(`--name <name>`, `Organization name. Max length: 128 chars.`)
  .requiredOption(`--billing-plan <billing-plan>`, `Organization billing plan chosen`)
  .option(`--payment-method-id <payment-method-id>`, `Payment method ID. Required for pro plans when trial is not available and user doesn't have default payment method set.`)
  .option(`--billing-address-id <billing-address-id>`, `Unique ID of billing address`)
  .option(`--invites [invites...]`, `Additional member invites`)
  .option(`--coupon-id <coupon-id>`, `Coupon id`)
  .option(`--tax-id <tax-id>`, `Tax Id associated to billing.`)
  .option(`--budget <budget>`, `Budget limit for additional usage set for the organization`, parseInteger)
  .option(`--platform <platform>`, `Platform type`)
  .action(
    actionRunner(
      async ({ organizationId, name, billingPlan, paymentMethodId, billingAddressId, invites, couponId, taxId, budget, platform }) =>
        parse(await (await getOrganizationsClient()).create(organizationId, name, billingPlan, paymentMethodId, billingAddressId, invites, couponId, taxId, budget, platform)),
    ),
  );

organizations
  .command(`estimation-create-organization`)
  .description(`Get estimation for creating an organization.`)
  .requiredOption(`--billing-plan <billing-plan>`, `Organization billing plan chosen`)
  .option(`--payment-method-id <payment-method-id>`, `Payment method ID. Required for pro plans when trial is not available and user doesn't have default payment method set.`)
  .option(`--invites [invites...]`, `Additional member invites`)
  .option(`--coupon-id <coupon-id>`, `Coupon id`)
  .option(`--platform <platform>`, `Platform type`)
  .action(
    actionRunner(
      async ({ billingPlan, paymentMethodId, invites, couponId, platform }) =>
        parse(await (await getOrganizationsClient()).estimationCreateOrganization(billingPlan, paymentMethodId, invites, couponId, platform)),
    ),
  );

organizations
  .command(`delete`)
  .description(`Delete an organization.`)
  .requiredOption(`--organization-id <organization-id>`, `Team ID.`)
  .action(
    actionRunner(
      async ({ organizationId }) =>
        parse(await (await getOrganizationsClient()).delete(organizationId)),
    ),
  );

organizations
  .command(`list-aggregations`)
  .description(`Get a list of all aggregations for an organization.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: teamId, aggregationId, from, to`)
  .action(
    actionRunner(
      async ({ organizationId, queries }) =>
        parse(await (await getOrganizationsClient()).listAggregations(organizationId, queries)),
    ),
  );

organizations
  .command(`get-aggregation`)
  .description(`Get a specific aggregation using it's aggregation ID.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .requiredOption(`--aggregation-id <aggregation-id>`, `Invoice unique ID`)
  .option(`--limit <limit>`, `Maximum number of project aggregations to return in response. By default will return maximum 5 results. Maximum of 10 results allowed per request.`, parseInteger)
  .option(`--offset <offset>`, `Offset value. The default value is 0. Use this param to manage pagination.`, parseInteger)
  .action(
    actionRunner(
      async ({ organizationId, aggregationId, limit, offset }) =>
        parse(await (await getOrganizationsClient()).getAggregation(organizationId, aggregationId, limit, offset)),
    ),
  );

organizations
  .command(`set-billing-address`)
  .description(`Set a billing address for an organization.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .requiredOption(`--billing-address-id <billing-address-id>`, `Unique ID of billing address`)
  .action(
    actionRunner(
      async ({ organizationId, billingAddressId }) =>
        parse(await (await getOrganizationsClient()).setBillingAddress(organizationId, billingAddressId)),
    ),
  );

organizations
  .command(`delete-billing-address`)
  .description(`Delete a team's billing address.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .action(
    actionRunner(
      async ({ organizationId }) =>
        parse(await (await getOrganizationsClient()).deleteBillingAddress(organizationId)),
    ),
  );

organizations
  .command(`get-billing-address`)
  .description(`Get a billing address using it's ID.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .requiredOption(`--billing-address-id <billing-address-id>`, `Unique ID of billing address`)
  .action(
    actionRunner(
      async ({ organizationId, billingAddressId }) =>
        parse(await (await getOrganizationsClient()).getBillingAddress(organizationId, billingAddressId)),
    ),
  );

organizations
  .command(`set-billing-email`)
  .description(`Set the current billing email for the organization.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .requiredOption(`--billing-email <billing-email>`, `Billing email for the organization.`)
  .action(
    actionRunner(
      async ({ organizationId, billingEmail }) =>
        parse(await (await getOrganizationsClient()).setBillingEmail(organizationId, billingEmail)),
    ),
  );

organizations
  .command(`update-budget`)
  .description(`Update the budget limit for an organization.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization Unique ID`)
  .requiredOption(`--budget <budget>`, `Budget limit for additional usage set for the organization`, parseInteger)
  .option(`--alerts [alerts...]`, `Budget alert limit percentage`)
  .action(
    actionRunner(
      async ({ organizationId, budget, alerts }) =>
        parse(await (await getOrganizationsClient()).updateBudget(organizationId, budget, alerts)),
    ),
  );

organizations
  .command(`list-credits`)
  .description(`List all credits for an organization.
`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: teamId, couponId, credits, expiration, status`)
  .action(
    actionRunner(
      async ({ organizationId, queries }) =>
        parse(await (await getOrganizationsClient()).listCredits(organizationId, queries)),
    ),
  );

organizations
  .command(`add-credit`)
  .description(`Add credit to an organization using a coupon.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .requiredOption(`--coupon-id <coupon-id>`, `ID of the coupon`)
  .action(
    actionRunner(
      async ({ organizationId, couponId }) =>
        parse(await (await getOrganizationsClient()).addCredit(organizationId, couponId)),
    ),
  );

organizations
  .command(`get-available-credits`)
  .description(`Get total available valid credits for an organization.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .action(
    actionRunner(
      async ({ organizationId }) =>
        parse(await (await getOrganizationsClient()).getAvailableCredits(organizationId)),
    ),
  );

organizations
  .command(`get-credit`)
  .description(`Get credit details.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .requiredOption(`--credit-id <credit-id>`, `Credit Unique ID`)
  .action(
    actionRunner(
      async ({ organizationId, creditId }) =>
        parse(await (await getOrganizationsClient()).getCredit(organizationId, creditId)),
    ),
  );

organizations
  .command(`estimation-delete-organization`)
  .description(`Get estimation for deleting an organization.`)
  .requiredOption(`--organization-id <organization-id>`, `Team ID.`)
  .action(
    actionRunner(
      async ({ organizationId }) =>
        parse(await (await getOrganizationsClient()).estimationDeleteOrganization(organizationId)),
    ),
  );

organizations
  .command(`estimation-update-plan`)
  .description(`Get estimation for updating the organization plan.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .requiredOption(`--billing-plan <billing-plan>`, `Organization billing plan chosen`)
  .option(`--invites [invites...]`, `Additional member invites`)
  .option(`--coupon-id <coupon-id>`, `Coupon id`)
  .action(
    actionRunner(
      async ({ organizationId, billingPlan, invites, couponId }) =>
        parse(await (await getOrganizationsClient()).estimationUpdatePlan(organizationId, billingPlan, invites, couponId)),
    ),
  );

organizations
  .command(`create-downgrade-feedback`)
  .description(`Submit feedback about downgrading from a paid plan to a lower tier. This helps the team understand user experience and improve the platform.
`)
  .requiredOption(`--organization-id <organization-id>`, `Organization Unique ID`)
  .requiredOption(`--reason <reason>`, `Feedback reason`)
  .requiredOption(`--message <message>`, `Feedback message`)
  .requiredOption(`--from-plan-id <from-plan-id>`, `Plan downgrading from`)
  .requiredOption(`--to-plan-id <to-plan-id>`, `Plan downgrading to`)
  .action(
    actionRunner(
      async ({ organizationId, reason, message, fromPlanId, toPlanId }) =>
        parse(await (await getOrganizationsClient()).createDowngradeFeedback(organizationId, reason, message, fromPlanId, toPlanId)),
    ),
  );

organizations
  .command(`list-invoices`)
  .description(`List all invoices for an organization.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on the following attributes: teamId, aggregationId, amount, currency, from, to, dueAt, attempts, status, grossAmount`)
  .action(
    actionRunner(
      async ({ organizationId, queries }) =>
        parse(await (await getOrganizationsClient()).listInvoices(organizationId, queries)),
    ),
  );

organizations
  .command(`get-invoice`)
  .description(`Get an invoice by its unique ID.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .requiredOption(`--invoice-id <invoice-id>`, `Invoice unique ID`)
  .action(
    actionRunner(
      async ({ organizationId, invoiceId }) =>
        parse(await (await getOrganizationsClient()).getInvoice(organizationId, invoiceId)),
    ),
  );

organizations
  .command(`get-invoice-download`)
  .description(`Download invoice in PDF`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .requiredOption(`--invoice-id <invoice-id>`, `Invoice unique ID`)
  .action(
    actionRunner(
      async ({ organizationId, invoiceId }) =>
        parse(await (await getOrganizationsClient()).getInvoiceDownload(organizationId, invoiceId)),
    ),
  );

organizations
  .command(`create-invoice-payment`)
  .description(`Initiate payment for failed invoice to pay live from console`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .requiredOption(`--invoice-id <invoice-id>`, `Invoice unique ID`)
  .requiredOption(`--payment-method-id <payment-method-id>`, `Payment method ID`)
  .action(
    actionRunner(
      async ({ organizationId, invoiceId, paymentMethodId }) =>
        parse(await (await getOrganizationsClient()).createInvoicePayment(organizationId, invoiceId, paymentMethodId)),
    ),
  );

organizations
  .command(`validate-invoice`)
  .description(`Validates the payment linked with the invoice and updates the invoice status if the payment status is changed.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .requiredOption(`--invoice-id <invoice-id>`, `Invoice unique ID`)
  .action(
    actionRunner(
      async ({ organizationId, invoiceId }) =>
        parse(await (await getOrganizationsClient()).validateInvoice(organizationId, invoiceId)),
    ),
  );

organizations
  .command(`get-invoice-view`)
  .description(`View invoice in PDF`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .requiredOption(`--invoice-id <invoice-id>`, `Invoice unique ID`)
  .action(
    actionRunner(
      async ({ organizationId, invoiceId }) =>
        parse(await (await getOrganizationsClient()).getInvoiceView(organizationId, invoiceId)),
    ),
  );

organizations
  .command(`list-keys`)
  .description(`Get a list of all API keys from the current organization. `)
  .requiredOption(`--organization-id <organization-id>`, `Organization Unique ID`)
  .option(
    `--total [value]`,
    `When set to false, the total count returned will be 0 and will not be calculated.`,
    (value: string | undefined) =>
      value === undefined ? true : parseBool(value),
  )
  .action(
    actionRunner(
      async ({ organizationId, total }) =>
        parse(await (await getOrganizationsClient()).listKeys(organizationId, total)),
    ),
  );

organizations
  .command(`create-key`)
  .description(`Create a new organization API key.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization Unique ID`)
  .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
  .requiredOption(`--scopes [scopes...]`, `Key scopes list. Maximum of 100 scopes are allowed.`)
  .option(`--expire <expire>`, `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.`)
  .action(
    actionRunner(
      async ({ organizationId, name, scopes, expire }) =>
        parse(await (await getOrganizationsClient()).createKey(organizationId, name, scopes, expire)),
    ),
  );

organizations
  .command(`get-key`)
  .description(`Get a key by its unique ID. This endpoint returns details about a specific API key in your organization including it's scopes.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization Unique ID`)
  .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
  .action(
    actionRunner(
      async ({ organizationId, keyId }) =>
        parse(await (await getOrganizationsClient()).getKey(organizationId, keyId)),
    ),
  );

organizations
  .command(`update-key`)
  .description(`Update a key by its unique ID. Use this endpoint to update the name, scopes, or expiration time of an API key.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization Unique ID`)
  .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
  .requiredOption(`--name <name>`, `Key name. Max length: 128 chars.`)
  .requiredOption(`--scopes [scopes...]`, `Key scopes list. Maximum of 100 scopes are allowed.`)
  .option(`--expire <expire>`, `Expiration time in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. Use null for unlimited expiration.`)
  .action(
    actionRunner(
      async ({ organizationId, keyId, name, scopes, expire }) =>
        parse(await (await getOrganizationsClient()).updateKey(organizationId, keyId, name, scopes, expire)),
    ),
  );

organizations
  .command(`delete-key`)
  .description(`Delete a key by its unique ID. Once deleted, the key can no longer be used to authenticate API calls.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization Unique ID`)
  .requiredOption(`--key-id <key-id>`, `Key unique ID.`)
  .action(
    actionRunner(
      async ({ organizationId, keyId }) =>
        parse(await (await getOrganizationsClient()).deleteKey(organizationId, keyId)),
    ),
  );

organizations
  .command(`set-default-payment-method`)
  .description(`Set a organization's default payment method.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .requiredOption(`--payment-method-id <payment-method-id>`, `Unique ID of payment method`)
  .action(
    actionRunner(
      async ({ organizationId, paymentMethodId }) =>
        parse(await (await getOrganizationsClient()).setDefaultPaymentMethod(organizationId, paymentMethodId)),
    ),
  );

organizations
  .command(`delete-default-payment-method`)
  .description(`Delete the default payment method for an organization.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .action(
    actionRunner(
      async ({ organizationId }) =>
        parse(await (await getOrganizationsClient()).deleteDefaultPaymentMethod(organizationId)),
    ),
  );

organizations
  .command(`set-backup-payment-method`)
  .description(`Set an organization's backup payment method.
`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .requiredOption(`--payment-method-id <payment-method-id>`, `Unique ID of payment method`)
  .action(
    actionRunner(
      async ({ organizationId, paymentMethodId }) =>
        parse(await (await getOrganizationsClient()).setBackupPaymentMethod(organizationId, paymentMethodId)),
    ),
  );

organizations
  .command(`delete-backup-payment-method`)
  .description(`Delete a backup payment method for an organization.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .action(
    actionRunner(
      async ({ organizationId }) =>
        parse(await (await getOrganizationsClient()).deleteBackupPaymentMethod(organizationId)),
    ),
  );

organizations
  .command(`get-payment-method`)
  .description(`Get an organization's payment method using it's payment method ID.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .requiredOption(`--payment-method-id <payment-method-id>`, `Unique ID of payment method`)
  .action(
    actionRunner(
      async ({ organizationId, paymentMethodId }) =>
        parse(await (await getOrganizationsClient()).getPaymentMethod(organizationId, paymentMethodId)),
    ),
  );

organizations
  .command(`get-plan`)
  .description(`Get the details of the current billing plan for an organization.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization Unique ID`)
  .action(
    actionRunner(
      async ({ organizationId }) =>
        parse(await (await getOrganizationsClient()).getPlan(organizationId)),
    ),
  );

organizations
  .command(`update-plan`)
  .description(`Update the billing plan for an organization.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization Unique ID`)
  .requiredOption(`--billing-plan <billing-plan>`, `Organization billing plan chosen`)
  .option(`--payment-method-id <payment-method-id>`, `Payment method ID. Required for pro plans when trial is not available and user doesn't have default payment method set.`)
  .option(`--billing-address-id <billing-address-id>`, `Unique ID of billing address`)
  .option(`--invites [invites...]`, `Additional member invites`)
  .option(`--coupon-id <coupon-id>`, `Coupon id`)
  .option(`--tax-id <tax-id>`, `Tax Id associated to billing.`)
  .option(`--budget <budget>`, `Budget limit for additional usage set for the organization`, parseInteger)
  .action(
    actionRunner(
      async ({ organizationId, billingPlan, paymentMethodId, billingAddressId, invites, couponId, taxId, budget }) =>
        parse(await (await getOrganizationsClient()).updatePlan(organizationId, billingPlan, paymentMethodId, billingAddressId, invites, couponId, taxId, budget)),
    ),
  );

organizations
  .command(`cancel-downgrade`)
  .description(`Cancel the downgrade initiated for an organization.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization Unique ID`)
  .action(
    actionRunner(
      async ({ organizationId }) =>
        parse(await (await getOrganizationsClient()).cancelDowngrade(organizationId)),
    ),
  );

organizations
  .command(`update-projects`)
  .description(`Update selected projects to keep in the organization.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization Unique ID`)
  .option(`--projects [projects...]`, `List of project IDs to be selected for the organization`)
  .action(
    actionRunner(
      async ({ organizationId, projects }) =>
        parse(await (await getOrganizationsClient()).updateProjects(organizationId, projects)),
    ),
  );

organizations
  .command(`list-regions`)
  .description(`Get all available regions for an organization.`)
  .requiredOption(`--organization-id <organization-id>`, `Team ID.`)
  .action(
    actionRunner(
      async ({ organizationId }) =>
        parse(await (await getOrganizationsClient()).listRegions(organizationId)),
    ),
  );

organizations
  .command(`get-scopes`)
  .description(`Get Scopes`)
  .requiredOption(`--organization-id <organization-id>`, `Organization id`)
  .action(
    actionRunner(
      async ({ organizationId }) =>
        parse(await (await getOrganizationsClient()).getScopes(organizationId)),
    ),
  );

organizations
  .command(`set-billing-tax-id`)
  .description(`Set an organization's billing tax ID.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .requiredOption(`--tax-id <tax-id>`, `Tax Id associated to billing.`)
  .action(
    actionRunner(
      async ({ organizationId, taxId }) =>
        parse(await (await getOrganizationsClient()).setBillingTaxId(organizationId, taxId)),
    ),
  );

organizations
  .command(`get-usage`)
  .description(`Get the usage data for an organization.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .option(`--start-date <start-date>`, `Starting date for the usage`)
  .option(`--end-date <end-date>`, `End date for the usage`)
  .action(
    actionRunner(
      async ({ organizationId, startDate, endDate }) =>
        parse(await (await getOrganizationsClient()).getUsage(organizationId, startDate, endDate)),
    ),
  );

organizations
  .command(`validate-payment`)
  .description(`Validate payment for team after creation or upgrade.`)
  .requiredOption(`--organization-id <organization-id>`, `Organization ID`)
  .option(`--invites [invites...]`, `Additional member invites`)
  .action(
    actionRunner(
      async ({ organizationId, invites }) =>
        parse(await (await getOrganizationsClient()).validatePayment(organizationId, invites)),
    ),
  );

