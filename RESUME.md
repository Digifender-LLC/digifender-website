# Digifender website checkpoint — 2026-10-03

This private repository captures the company website, legal draft content, design/brand sources, verification tools, and the shared MTA-STS policy Worker. No new deployment was made for this checkpoint.

## Reproduce the published source

The current selected design is **Signal**, served by `digifender-site` from `designs/releases/signal/public`. The last verified company deployment is `d2c1ba20-7450-48b6-8974-2fb721b10437`. Root `dist/` is an intermediate legal-page build and is not the selected homepage.

Whumpo's six published legal drafts come from `zemdregon/whumpo` commit `6ed1d8ce6b55283811e1980fbd3808546c29bedb`. An exact reproduction snapshot and hashes are included in `vendor/whumpo-legal-published/`; Whumpo remains the authoritative source. Its newer local cookie-name edits require product reconciliation before publication. Do not silently replace these documents with a current working checkout.

```sh
corepack pnpm install --frozen-lockfile
python3 -m venv .venv
.venv/bin/pip install -r tools/pdf-requirements.txt
export DIGIFENDER_PYTHON="$PWD/.venv/bin/python3"
export WHUMPO_LEGAL_SOURCE="$PWD/vendor/whumpo-legal-published"
pnpm build
pnpm test
pnpm test:designs
```

Browser-based verification tools may require their Playwright browser installation. See README.md for focused checks and build details. Keep `WHUMPO_LEGAL_SOURCE` set for any reproduction or intentional deployment. Authenticate Cloudflare securely on the new machine; credentials are intentionally absent.

## Status boundaries

- LLC formation is still pending; visible company naming is not formation evidence.
- Product terms remain drafts, not adopted policies.
- DNSSEC for Digifender, Whumpo, OpenHost and ChapelCloud was still pending at the latest October 3 readback. LabThrift was active. MTA-STS is intentionally in testing mode.
- The MTA-STS Worker configuration is in `mta-sts/`; its last verified deployment is `f15158aa-21a5-4f42-b94d-90ffb63414d4`.
- Portfolio handoff, release receipts and exclusions are in the private `zemdregon/portfolio-oversight` repository.

## Excluded local data

Dependencies, `.wrangler`, `.evidence`, temporary files, generated root `dist`, `designs/releases`, and design/concept verification evidence are ignored. They include raw Cloudflare readbacks, release archives and screenshots. Selected sanitized receipts and public verification reports are backed up with the portfolio handoff. Company legal/accounting/formation records outside this website are outside this source repository.
