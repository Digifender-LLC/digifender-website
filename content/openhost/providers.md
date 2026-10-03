# OpenHost Service Providers

Draft updated October 2, 2026. Effective date: pending adoption. This is a disclosure of planned provider roles, not a verified production subprocessor list or an announcement of approved reseller status. Provider selection, contracts, account configuration and data flows must be confirmed before the affected service is enabled.

## Company website and future hosting service

Cloudflare currently delivers the Digifender company website, this legal hub and the static [OpenHost public preview](https://openhost.pro/). That website-delivery role is described in the [Website Privacy Notice](/legal/privacy). It does not establish that an OpenHost customer hosting service or AI operator is running.

OpenHost's preferred infrastructure providers are Cloudflare and DigitalOcean. Exact products, contracting entities, regions, access, support responsibilities and commercial terms remain to be verified. A provider's public capability does not prove OpenHost has entitlement to resell it or that a customer can order it.

## Planned Cloudflare role

Cloudflare is the preferred provider for the OpenHost control service, edge applications, supporting storage and databases, domain connectivity and selected container workloads. Depending on the enabled service, it could process application code and traffic, uploaded data, deployment artifacts, logs, resource metadata and operational records.

Cloudflare AI Gateway with Workers AI is the chosen direction for the operator's AI processing. Authorized prompts, outputs and selected project context would pass through that service. Cloudflare's [Workers AI data-use documentation](https://developers.cloudflare.com/workers-ai/platform/data-usage/) describes its no-training-without-consent position. [Gateway logging settings](https://developers.cloudflare.com/ai-gateway/observability/logging/) separately control retention of request and response payloads and metadata. OpenHost must verify its own configuration and retention before making a customer commitment.

Models may have separate licenses and limitations. Naming a model family does not establish that its publisher receives customer requests; the actual execution and disclosure path must be checked. External inference providers are outside the accepted initial operator direction.

## Planned DigitalOcean role

DigitalOcean is the complementary infrastructure direction for conventional container services, virtual private servers, managed databases and isolated build execution where selected. Depending on the resource, it could process repository snapshots, build artifacts, application data, storage volumes, logs, backups and network traffic.

Available regions, resource types, backup behavior and provider account arrangements must be confirmed for each enabled offer. No specific region, high-availability configuration, retention period, data-residency guarantee or partner discount is established by this list. See DigitalOcean's [privacy policy](https://www.digitalocean.com/legal/privacy-policy) for its own processing disclosures.

## Supporting integrations still to finalize

- Source hosting and identity: GitHub is a proposed integration for selected repositories and sign-in. The actual application, permissions, account fields and callbacks have not been established for public use.
- Payments and billing: Stripe and Metronome are proposed supporting integrations. The actual processor, billing path, customer fields, tax services and contractual roles must be confirmed before collecting payment information or charging customers.
- Email and support: platform notices and support delivery need verified senders, processors, access arrangements and operational ownership. No additional mail or support vendor is appointed by this document.
- Domain registration: the registrar, customer registrant model, required contact disclosures, renewals and transfer rights must be verified before registration is sold. Connecting an existing domain is a separate feature.

These proposals do not authorize a vendor account, purchase, data transfer or acceptance of third-party terms. Customer-selected connections and software may introduce additional services whose processing the customer must evaluate and disclose.

## What must be disclosed before activation

For each actual recipient, the final disclosure must identify its legal name, function, relevant data categories, processing locations or limitations, and applicable processing agreement. Where required, it must also provide the notice, objection or authorization process for subprocessor changes. This page is not a substitute for a signed data-processing agreement or a valid international transfer mechanism.

The initial US market does not restrict all processing to the United States. Region selection for a workload may not restrict globally delivered traffic, control records, support access or backups. A vendor certification, SLA or contractual promise does not automatically become an OpenHost guarantee.

Updates must reflect the providers actually used and be communicated as required by the adopted contract and law. Contact [legal@digifender.com](mailto:legal@digifender.com) about this list, together with the [OpenHost Privacy Policy](/legal/openhost/privacy).
