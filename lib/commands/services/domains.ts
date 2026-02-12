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
import { Domains } from "@appwrite.io/console";

let domainsClient: Domains | null = null;

const getDomainsClient = async (): Promise<Domains> => {
  if (!domainsClient) {
    const sdkClient = await sdkForProject();
    domainsClient = new Domains(sdkClient);
  }
  return domainsClient;
};

export const domains = new Command("domains")
  .description(commandDescriptions["domains"] ?? "")
  .configureHelp({
    helpWidth: process.stdout.columns || 80,
  });

domains
  .command(`list`)
  .description(`    List all domains registered for this project. This endpoint supports pagination.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/databases#querying-documents). Maximum of 100 queries are allowed, each 4096 characters long. You may filter on attributes such as domain name, teamInternalId, expiration, etc.`)
  .option(`--search <search>`, `Search term to filter your list results. Max length: 256 chars.`)
  .action(
    actionRunner(
      async ({ queries, search }) =>
        parse(await (await getDomainsClient()).list(queries, search)),
    ),
  );

domains
  .command(`create`)
  .description(`    Create a new domain. Before creating a domain, you need to ensure that your DNS provider is properly configured. After creating the domain, you can use the verification endpoint to check if the domain is ready to be used.`)
  .requiredOption(`--team-id <team-id>`, `Team unique ID.`)
  .requiredOption(`--domain <domain>`, `Domain name (e.g. "example.com").`)
  .action(
    actionRunner(
      async ({ teamId, domain }) =>
        parse(await (await getDomainsClient()).create(teamId, domain)),
    ),
  );

domains
  .command(`get-price`)
  .description(`    Get the registration price for a domain name.`)
  .requiredOption(`--domain <domain>`, `Domain name to get price for.`)
  .option(`--period-years <period-years>`, `Number of years to calculate the domain price for. Must be at least 1.`, parseInteger)
  .option(`--registration-type <registration-type>`, `Type of registration pricing to fetch. Allowed values: new, transfer, renewal, trade.`)
  .action(
    actionRunner(
      async ({ domain, periodYears, registrationType }) =>
        parse(await (await getDomainsClient()).getPrice(domain, periodYears, registrationType)),
    ),
  );

domains
  .command(`list-suggestions`)
  .description(`    List domain suggestions.`)
  .requiredOption(`--query <query>`, `Query to find available domains and suggestions. Max length: 256 chars.`)
  .option(`--tlds [tlds...]`, `TLDs to suggest.`)
  .option(`--limit <limit>`, `Maximum number of suggestions to return.`, parseInteger)
  .option(`--filter-type <filter-type>`, `Filter type: premium, suggestion.`)
  .option(`--price-max <price-max>`, `Filter premium domains by maximum price. Only premium domains at or below this price will be returned. Does not affect regular domain suggestions.`, parseInteger)
  .option(`--price-min <price-min>`, `Filter premium domains by minimum price. Only premium domains at or above this price will be returned. Does not affect regular domain suggestions.`, parseInteger)
  .action(
    actionRunner(
      async ({ query, tlds, limit, filterType, priceMax, priceMin }) =>
        parse(await (await getDomainsClient()).listSuggestions(query, tlds, limit, filterType, priceMax, priceMin)),
    ),
  );

domains
  .command(`get`)
  .description(`    Get a domain by its unique ID.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .action(
    actionRunner(
      async ({ domainId }) =>
        parse(await (await getDomainsClient()).get(domainId)),
    ),
  );

domains
  .command(`delete`)
  .description(`Delete a domain by its unique ID. This endpoint can be used to delete a domain from your project.
Once deleted, the domain will no longer be available for use and all associated resources will be removed.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .action(
    actionRunner(
      async ({ domainId }) =>
        parse(await (await getDomainsClient()).delete(domainId)),
    ),
  );

domains
  .command(`update-nameservers`)
  .description(`    Verify which NS records are used and update the domain accordingly. This will check the domain's
    nameservers and update the domain's status based on whether the nameservers match the expected
    Appwrite nameservers.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .action(
    actionRunner(
      async ({ domainId }) =>
        parse(await (await getDomainsClient()).updateNameservers(domainId)),
    ),
  );

domains
  .command(`get-preset-google-workspace`)
  .description(`    List Google Workspace DNS records.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .action(
    actionRunner(
      async ({ domainId }) =>
        parse(await (await getDomainsClient()).getPresetGoogleWorkspace(domainId)),
    ),
  );

domains
  .command(`create-preset-google-workspace`)
  .description(`    Add Google Workspace DNS records to the domain. This will create the required MX records 
    for Google Workspace email hosting.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .action(
    actionRunner(
      async ({ domainId }) =>
        parse(await (await getDomainsClient()).createPresetGoogleWorkspace(domainId)),
    ),
  );

domains
  .command(`get-preset-i-cloud`)
  .description(`    List iCloud DNS records.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .action(
    actionRunner(
      async ({ domainId }) =>
        parse(await (await getDomainsClient()).getPresetICloud(domainId)),
    ),
  );

domains
  .command(`create-preset-i-cloud`)
  .description(`    Add iCloud DNS records to the domain. This will create the required MX and SPF records
    for using iCloud email services with your domain.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .action(
    actionRunner(
      async ({ domainId }) =>
        parse(await (await getDomainsClient()).createPresetICloud(domainId)),
    ),
  );

domains
  .command(`get-preset-mailgun`)
  .description(`    List Mailgun DNS records.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .action(
    actionRunner(
      async ({ domainId }) =>
        parse(await (await getDomainsClient()).getPresetMailgun(domainId)),
    ),
  );

domains
  .command(`create-preset-mailgun`)
  .description(`    Add Mailgun DNS records to the domain. This endpoint will create the required DNS records 
    for Mailgun in the specified domain.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .action(
    actionRunner(
      async ({ domainId }) =>
        parse(await (await getDomainsClient()).createPresetMailgun(domainId)),
    ),
  );

domains
  .command(`get-preset-outlook`)
  .description(`    List Outlook DNS records.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .action(
    actionRunner(
      async ({ domainId }) =>
        parse(await (await getDomainsClient()).getPresetOutlook(domainId)),
    ),
  );

domains
  .command(`create-preset-outlook`)
  .description(`    Add Outlook DNS records to the domain. This will create the required MX records
    for setting up Outlook email hosting for your domain.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .action(
    actionRunner(
      async ({ domainId }) =>
        parse(await (await getDomainsClient()).createPresetOutlook(domainId)),
    ),
  );

domains
  .command(`get-preset-proton-mail`)
  .description(`    List ProtonMail DNS records.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .action(
    actionRunner(
      async ({ domainId }) =>
        parse(await (await getDomainsClient()).getPresetProtonMail(domainId)),
    ),
  );

domains
  .command(`create-preset-proton-mail`)
  .description(`    Add ProtonMail DNS records to the domain. This will create the required MX records
    for using ProtonMail with your custom domain.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .action(
    actionRunner(
      async ({ domainId }) =>
        parse(await (await getDomainsClient()).createPresetProtonMail(domainId)),
    ),
  );

domains
  .command(`get-preset-zoho`)
  .description(`    List Zoho DNS records.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .action(
    actionRunner(
      async ({ domainId }) =>
        parse(await (await getDomainsClient()).getPresetZoho(domainId)),
    ),
  );

domains
  .command(`create-preset-zoho`)
  .description(`    Add Zoho Mail DNS records to the domain. This will create the required MX records
    for setting up Zoho Mail on your domain.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .action(
    actionRunner(
      async ({ domainId }) =>
        parse(await (await getDomainsClient()).createPresetZoho(domainId)),
    ),
  );

domains
  .command(`list-records`)
  .description(`    List DNS records for a given domain. You can use this endpoint to list all the DNS records
    associated with your domain.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .option(`--queries [queries...]`, `Array of query strings generated using the Query class provided by the SDK. You may filter on attributes such as type, name, value, etc. Maximum of 100 queries are allowed, each 4096 characters long.`)
  .action(
    actionRunner(
      async ({ domainId, queries }) =>
        parse(await (await getDomainsClient()).listRecords(domainId, queries)),
    ),
  );

domains
  .command(`create-record-a`)
  .description(`Create a new A record for the given domain. A records are used to point a domain name 
to an IPv4 address. The record value should be a valid IPv4 address.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--name <name>`, `Record name (subdomain).`)
  .requiredOption(`--value <value>`, `IPv4 address for this A record.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .option(`--comment <comment>`, `A comment explaining what this record is for.`)
  .action(
    actionRunner(
      async ({ domainId, name, value, ttl, comment }) =>
        parse(await (await getDomainsClient()).createRecordA(domainId, name, value, ttl, comment)),
    ),
  );

domains
  .command(`update-record-a`)
  .description(`    Update an existing A record for the given domain. This endpoint allows you to modify 
    the properties of an A record including its name (subdomain), IPv4 address, TTL, 
    and optional comment.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--record-id <record-id>`, `DNS record unique ID.`)
  .requiredOption(`--name <name>`, `Record name (subdomain).`)
  .requiredOption(`--value <value>`, `IPv4 address for this A record.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .option(`--comment <comment>`, `A comment explaining what this record is for.`)
  .action(
    actionRunner(
      async ({ domainId, recordId, name, value, ttl, comment }) =>
        parse(await (await getDomainsClient()).updateRecordA(domainId, recordId, name, value, ttl, comment)),
    ),
  );

domains
  .command(`create-record-aaaa`)
  .description(`    Create a new AAAA record for the given domain. This endpoint allows you to add a new IPv6 DNS record 
    to your domain. The record will be used to point a hostname to an IPv6 address.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--name <name>`, `Record name (subdomain).`)
  .requiredOption(`--value <value>`, `IPv6 address for this AAAA record.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .option(`--comment <comment>`, `A comment explaining what this record is for.`)
  .action(
    actionRunner(
      async ({ domainId, name, value, ttl, comment }) =>
        parse(await (await getDomainsClient()).createRecordAAAA(domainId, name, value, ttl, comment)),
    ),
  );

domains
  .command(`update-record-aaaa`)
  .description(`    Update an existing AAAA record for the given domain. This endpoint allows you to modify
    the properties of an existing AAAA record, including its name (subdomain), IPv6 address,
    TTL, and optional comment.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--record-id <record-id>`, `DNS record unique ID.`)
  .requiredOption(`--name <name>`, `Record name (subdomain).`)
  .requiredOption(`--value <value>`, `IPv6 address for this AAAA record.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .option(`--comment <comment>`, `A comment for this record.`)
  .action(
    actionRunner(
      async ({ domainId, recordId, name, value, ttl, comment }) =>
        parse(await (await getDomainsClient()).updateRecordAAAA(domainId, recordId, name, value, ttl, comment)),
    ),
  );

domains
  .command(`create-record-alias`)
  .description(`    Create a new ALIAS record for the given domain. This record type can be used to point your domain 
    to another domain name that will serve as an alias. This is particularly useful when you want to 
    map your domain to a target domain that may change its IP address.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--name <name>`, `Record name.`)
  .requiredOption(`--value <value>`, `Target domain for this ALIAS record.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .option(`--comment <comment>`, `A comment for this record.`)
  .action(
    actionRunner(
      async ({ domainId, name, value, ttl, comment }) =>
        parse(await (await getDomainsClient()).createRecordAlias(domainId, name, value, ttl, comment)),
    ),
  );

domains
  .command(`update-record-alias`)
  .description(`    Update an existing ALIAS record for the specified domain. This endpoint allows you to modify
    the properties of an existing ALIAS record including its name, target domain, TTL, and comment.
    
    The ALIAS record type is similar to a CNAME record but can be used at the zone apex (root domain).
    It provides a way to map one domain name to another.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--record-id <record-id>`, `DNS record unique ID.`)
  .requiredOption(`--name <name>`, `Record name.`)
  .requiredOption(`--value <value>`, `Target domain for this ALIAS record.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .option(`--comment <comment>`, `A comment for this record.`)
  .action(
    actionRunner(
      async ({ domainId, recordId, name, value, ttl, comment }) =>
        parse(await (await getDomainsClient()).updateRecordAlias(domainId, recordId, name, value, ttl, comment)),
    ),
  );

domains
  .command(`create-record-caa`)
  .description(`Create a new CAA record for the given domain. CAA records are used to specify which 
Certificate Authorities (CAs) are allowed to issue SSL/TLS certificates for your domain.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--name <name>`, `Record name.`)
  .requiredOption(`--value <value>`, `CAA value (e.g. issuer domain).`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .option(`--comment <comment>`, `A comment for this record.`)
  .action(
    actionRunner(
      async ({ domainId, name, value, ttl, comment }) =>
        parse(await (await getDomainsClient()).createRecordCAA(domainId, name, value, ttl, comment)),
    ),
  );

domains
  .command(`update-record-caa`)
  .description(`    Update an existing CAA record for the given domain. A CAA (Certification Authority Authorization) 
    record is used to specify which certificate authorities (CAs) are authorized to issue certificates 
    for a domain.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--record-id <record-id>`, `DNS record unique ID.`)
  .requiredOption(`--name <name>`, `Record name.`)
  .requiredOption(`--value <value>`, `CAA value (e.g. issuer domain).`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .option(`--comment <comment>`, `A comment for this record.`)
  .action(
    actionRunner(
      async ({ domainId, recordId, name, value, ttl, comment }) =>
        parse(await (await getDomainsClient()).updateRecordCAA(domainId, recordId, name, value, ttl, comment)),
    ),
  );

domains
  .command(`create-record-cname`)
  .description(`    Create a new CNAME record for the given domain.
    
    A CNAME record maps a subdomain to another domain name, allowing you to create aliases 
    for your domain. For example, you can create a CNAME record to point 'blog.example.com' 
    to 'example.wordpress.com'.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--name <name>`, `Record name (subdomain).`)
  .requiredOption(`--value <value>`, `Canonical target for this CNAME record.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .option(`--comment <comment>`, `A comment for this record.`)
  .action(
    actionRunner(
      async ({ domainId, name, value, ttl, comment }) =>
        parse(await (await getDomainsClient()).createRecordCNAME(domainId, name, value, ttl, comment)),
    ),
  );

domains
  .command(`update-record-cname`)
  .description(`    Update an existing CNAME record for the given domain.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--record-id <record-id>`, `DNS record unique ID.`)
  .requiredOption(`--name <name>`, `Record name (subdomain).`)
  .requiredOption(`--value <value>`, `Canonical target for this CNAME record.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .option(`--comment <comment>`, `A comment for this record.`)
  .action(
    actionRunner(
      async ({ domainId, recordId, name, value, ttl, comment }) =>
        parse(await (await getDomainsClient()).updateRecordCNAME(domainId, recordId, name, value, ttl, comment)),
    ),
  );

domains
  .command(`create-record-https`)
  .description(`    Create a new HTTPS record for the given domain. This record is used to configure HTTPS 
    settings for your domain, enabling secure communication over SSL/TLS.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--name <name>`, `Record name (subdomain).`)
  .requiredOption(`--value <value>`, `Target for the HTTPS record.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .option(`--comment <comment>`, `A comment for this record.`)
  .action(
    actionRunner(
      async ({ domainId, name, value, ttl, comment }) =>
        parse(await (await getDomainsClient()).createRecordHTTPS(domainId, name, value, ttl, comment)),
    ),
  );

domains
  .command(`update-record-https`)
  .description(`Update an existing HTTPS record for the given domain. This endpoint allows you to modify 
the properties of an HTTPS record associated with your domain, including the name (subdomain), 
target value, TTL, and optional comment.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--record-id <record-id>`, `DNS record unique ID.`)
  .requiredOption(`--name <name>`, `Record name (subdomain).`)
  .requiredOption(`--value <value>`, `Target for the HTTPS record.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .option(`--comment <comment>`, `A comment for this record.`)
  .action(
    actionRunner(
      async ({ domainId, recordId, name, value, ttl, comment }) =>
        parse(await (await getDomainsClient()).updateRecordHTTPS(domainId, recordId, name, value, ttl, comment)),
    ),
  );

domains
  .command(`create-record-mx`)
  .description(`    Create a new MX record for the given domain. MX records are used to define the mail servers responsible 
    for accepting email messages for the domain. Multiple MX records can be created with different priorities.
    The priority parameter determines the order in which mail servers are used, with lower values indicating 
    higher priority.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--name <name>`, `Record name (subdomain).`)
  .requiredOption(`--value <value>`, `Mail server domain for this MX record.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .requiredOption(`--priority <priority>`, `MX priority.`, parseInteger)
  .option(`--comment <comment>`, `A comment for this record.`)
  .action(
    actionRunner(
      async ({ domainId, name, value, ttl, priority, comment }) =>
        parse(await (await getDomainsClient()).createRecordMX(domainId, name, value, ttl, priority, comment)),
    ),
  );

domains
  .command(`update-record-mx`)
  .description(`    Update an existing MX record for the given domain.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--record-id <record-id>`, `DNS record unique ID.`)
  .requiredOption(`--name <name>`, `Record name (subdomain).`)
  .requiredOption(`--value <value>`, `Mail server domain for this MX record.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .requiredOption(`--priority <priority>`, `MX priority.`, parseInteger)
  .option(`--comment <comment>`, `A comment for this record.`)
  .action(
    actionRunner(
      async ({ domainId, recordId, name, value, ttl, priority, comment }) =>
        parse(await (await getDomainsClient()).updateRecordMX(domainId, recordId, name, value, ttl, priority, comment)),
    ),
  );

domains
  .command(`create-record-ns`)
  .description(`    Create a new NS record for the given domain. NS records specify the nameservers that are used 
    to resolve the domain name to IP addresses. Each domain can have multiple NS records.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--name <name>`, `Record name (subdomain).`)
  .requiredOption(`--value <value>`, `Nameserver target for this NS record.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .option(`--comment <comment>`, `A comment for this record.`)
  .action(
    actionRunner(
      async ({ domainId, name, value, ttl, comment }) =>
        parse(await (await getDomainsClient()).createRecordNS(domainId, name, value, ttl, comment)),
    ),
  );

domains
  .command(`update-record-ns`)
  .description(`    Update an existing NS record for the given domain. This endpoint allows you to modify 
    the properties of an NS (nameserver) record associated with your domain. You can update 
    the record name (subdomain), target nameserver value, TTL, and add or modify comments 
    for better record management.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--record-id <record-id>`, `DNS record unique ID.`)
  .requiredOption(`--name <name>`, `Record name (subdomain).`)
  .requiredOption(`--value <value>`, `Nameserver target for this NS record.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .option(`--comment <comment>`, `A comment for this record.`)
  .action(
    actionRunner(
      async ({ domainId, recordId, name, value, ttl, comment }) =>
        parse(await (await getDomainsClient()).updateRecordNS(domainId, recordId, name, value, ttl, comment)),
    ),
  );

domains
  .command(`create-record-srv`)
  .description(`    Create a new SRV record for the given domain. SRV records are used to define the location 
    of servers for specific services. For example, they can be used to specify which server 
    handles a specific service like SIP or XMPP for the domain.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--name <name>`, `Record name (service name).`)
  .requiredOption(`--value <value>`, `Target hostname for this SRV record.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .requiredOption(`--priority <priority>`, `Record priority.`, parseInteger)
  .requiredOption(`--weight <weight>`, `Record weight.`, parseInteger)
  .requiredOption(`--port <port>`, `Port number for the service.`, parseInteger)
  .option(`--comment <comment>`, `A comment for this record.`)
  .action(
    actionRunner(
      async ({ domainId, name, value, ttl, priority, weight, port, comment }) =>
        parse(await (await getDomainsClient()).createRecordSRV(domainId, name, value, ttl, priority, weight, port, comment)),
    ),
  );

domains
  .command(`update-record-srv`)
  .description(`    Update an existing SRV record for the given domain.
    
    Required parameters:
    - domainId: Domain unique ID
    - recordId: DNS record unique ID
    - name: Record name (service name)
    - value: Target hostname for this SRV record
    - ttl: Time to live, in seconds
    - priority: Record priority
    - weight: Record weight
    - port: Port number for the service
    
    Optional parameters:
    - comment: A comment for this record`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--record-id <record-id>`, `DNS record unique ID.`)
  .requiredOption(`--name <name>`, `Record name (service name).`)
  .requiredOption(`--value <value>`, `Target hostname for this SRV record.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .requiredOption(`--priority <priority>`, `Record priority.`, parseInteger)
  .requiredOption(`--weight <weight>`, `Record weight.`, parseInteger)
  .requiredOption(`--port <port>`, `Port number for the service.`, parseInteger)
  .option(`--comment <comment>`, `A comment for this record.`)
  .action(
    actionRunner(
      async ({ domainId, recordId, name, value, ttl, priority, weight, port, comment }) =>
        parse(await (await getDomainsClient()).updateRecordSRV(domainId, recordId, name, value, ttl, priority, weight, port, comment)),
    ),
  );

domains
  .command(`create-record-txt`)
  .description(`    Create a new TXT record for the given domain. TXT records can be used 
    to provide additional information about your domain, such as domain 
    verification records, SPF records, or DKIM records.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--name <name>`, `Record name (subdomain) for the TXT record.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .option(`--value <value>`, `TXT record value.`)
  .option(`--comment <comment>`, `A comment for this record.`)
  .action(
    actionRunner(
      async ({ domainId, name, ttl, value, comment }) =>
        parse(await (await getDomainsClient()).createRecordTXT(domainId, name, ttl, value, comment)),
    ),
  );

domains
  .command(`update-record-txt`)
  .description(`    Update an existing TXT record for the given domain.
    
    Update the TXT record details for a specific domain by providing the domain ID,
    record ID, and the new record configuration including name, value, TTL, and an optional comment.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--record-id <record-id>`, `DNS record unique ID.`)
  .requiredOption(`--name <name>`, `Record name (subdomain) for the TXT record.`)
  .requiredOption(`--value <value>`, `TXT record value.`)
  .requiredOption(`--ttl <ttl>`, `Time to live, in seconds. Must be greater than 0.`, parseInteger)
  .option(`--comment <comment>`, `A comment for this record.`)
  .action(
    actionRunner(
      async ({ domainId, recordId, name, value, ttl, comment }) =>
        parse(await (await getDomainsClient()).updateRecordTXT(domainId, recordId, name, value, ttl, comment)),
    ),
  );

domains
  .command(`get-record`)
  .description(`    Get a single DNS record for a given domain by record ID.
    
    This endpoint allows you to retrieve a specific DNS record associated with a domain
    using its unique identifier. The record contains information about the DNS configuration
    such as type, value, and TTL settings.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--record-id <record-id>`, `DNS record unique ID.`)
  .action(
    actionRunner(
      async ({ domainId, recordId }) =>
        parse(await (await getDomainsClient()).getRecord(domainId, recordId)),
    ),
  );

domains
  .command(`delete-record`)
  .description(`    Delete a DNS record for the given domain. This endpoint allows you to delete an existing DNS record 
    from a specific domain.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--record-id <record-id>`, `DNS record unique ID.`)
  .action(
    actionRunner(
      async ({ domainId, recordId }) =>
        parse(await (await getDomainsClient()).deleteRecord(domainId, recordId)),
    ),
  );

domains
  .command(`update-team`)
  .description(`    Update the team ID for a specific domain. This endpoint requires admin access.
    
    Updating the team ID will transfer ownership and access control of the domain
    and all its DNS records to the new team.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--team-id <team-id>`, `New team unique ID.`)
  .action(
    actionRunner(
      async ({ domainId, teamId }) =>
        parse(await (await getDomainsClient()).updateTeam(domainId, teamId)),
    ),
  );

domains
  .command(`get-zone`)
  .description(`    Retrieve the DNS zone file for the given domain. This endpoint will return the DNS
    zone file in a standardized format that can be used to configure DNS servers.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .action(
    actionRunner(
      async ({ domainId }) =>
        parse(await (await getDomainsClient()).getZone(domainId)),
    ),
  );

domains
  .command(`update-zone`)
  .description(`Update the DNS zone for the given domain using the provided zone file content.
All parsed records are imported and then the main domain document is returned.`)
  .requiredOption(`--domain-id <domain-id>`, `Domain unique ID.`)
  .requiredOption(`--content <content>`, `DNS zone file content as a string.`)
  .action(
    actionRunner(
      async ({ domainId, content }) =>
        parse(await (await getDomainsClient()).updateZone(domainId, content)),
    ),
  );

