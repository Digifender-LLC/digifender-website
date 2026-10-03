# Digifender company website

Company landing page and legal hub for https://digifender.com. The separate Cloudflare Worker is `digifender-site`; `www.digifender.com` redirects to the root domain while retaining paths and query strings.

## Current production design: Signal (A)

The owner selected Signal on October 2, 2026. The current verified Worker version is `d2c1ba20-7450-48b6-8974-2fb721b10437`; it includes the October 3 LabThrift guided-project draft update, links to the live OpenHost website preview and retains the visibly draft legal collection. The root Wrangler configuration and normal build/dev/deploy commands target Signal. Blueprint remains an unpublished alternative.

Edit `designs/pages.mjs`, `designs/assets/site.css`, and `designs/assets/site.js` for the homepage. The production Worker is `designs/worker.js`, which wraps the original legal/security Worker. `pnpm build` rebuilds the legal sources and both packages; only `designs/releases/signal/public/` is deployed. `dist/` is the intermediate legal build, not the active homepage. See `designs/README.md` for motion, accessibility, and release details. The descriptions of the earlier homepage below are retained as historical implementation notes.

Use `pnpm check:live` for production byte/header/route verification. The previous `tools/live-check.mjs` compares the historical homepage in `dist/` and is not the current production check. Deployment evidence is in `designs/evidence/deployment-signal/`.

## Local work

Use Node 24, pnpm 11 and Python 3 with the pinned PDF dependencies in `tools/pdf-requirements.txt` (`reportlab` and `pypdf`):

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm dev
```

The PDF wrapper uses `DIGIFENDER_PYTHON` when set, otherwise the bundled Codex Python at `~/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3` when available, then `python3` from PATH. For another environment, set `DIGIFENDER_PYTHON` to the desired interpreter and install `tools/pdf-requirements.txt` with that interpreter's `-m pip install -r` command. `pnpm build` generates both the website and PDFs; missing Python dependencies fail the build.

The local site is http://localhost:8791. In another terminal, run `node tools/browser-check.mjs` for desktop/mobile accessibility, layout, navigation, response-header and ordinary-visit cookie checks, plus PDF downloads, print controls, full-text parity and the no-JavaScript print fallback. Set `SITE_URL=https://digifender.com` to check production. Browser screenshots and results are written to `.evidence/`, outside the deployed assets.

Run `pnpm check:portfolio` to compare live Digifender legal pages with visible legal links, company attribution and placeholder contact addresses on the Whumpo landing, sign-in and signup screens and the ChapelCloud, LabThrift, Lab plan and ByteRush homepages. It also samples 12 ChapelCloud service pages and three LabThrift content pages, reporting their shared-template gaps as grouped findings. It checks each legal destination's product label, document heading, canonical URL and draft notice, plus the company homepage's general and ChapelCloud-specific inquiry links and the legal hub contact. It writes `.evidence/portfolio-connections-live.json` and exits nonzero while connection gaps remain. The internal status and source map is in `../00 Start Here/Portfolio Connections.md`. This check does not verify email delivery, every product route, legal adoption, or which repository deployed each product.

## Editing and legal scope

- `src/hero-logo.mjs`: build-time inline copy of the approved SVG for the hero-only CSS draw-in and settle animation.
- `src/home.mjs`: Digifender capabilities, the Whumpo/ChapelCloud/LabThrift showcases, and project/partnership inquiries.
- `public/styles.css` and `public/legal-print.css`: responsive design and dedicated print layout.
- `content/`: company website privacy notice, draft website terms, and copyright/legal contact.
- `content/chapelcloud/`: draft ChapelCloud terms, privacy policy and cookie notice.
- `content/labthrift/`: draft LabThrift terms, privacy policy and cookie/storage notice.
- `content/openhost/`: six OpenHost drafts for terms, privacy, acceptable use, cookies, copyright/abuse and planned providers.
- `src/legal-documents.mjs`: shared allowlisted registry for all 21 documents, product collections, source paths and web/PDF/print routes.
- `tools/build.mjs`: escaped static Markdown renderer for normal HTML and printer-friendly pages; exports the same parsed document blocks to `.evidence/documents.json`.
- `tools/build-pdfs.mjs` and `tools/build-pdfs.py`: Python selection and ReportLab PDF generation from those shared blocks, with `pypdf` checks for complete text and draft labels.
- `public/legal-actions.js`: local progressive enhancement for the printable page's Print / Save as PDF button.
- `src/worker.js`: canonical-domain redirect, method restrictions and response security headers.

Whumpo's six public policies are compiled directly from the sibling checkout at `../../Whumpo/docs/legal`. They remain the canonical editable product sources. `WHUMPO_LEGAL_SOURCE` can select another checkout with those files. Company, ChapelCloud, LabThrift and OpenHost documents are maintained in the content directories above. Web, print and PDF copies share each document's source and parsed blocks; do not maintain separate policy wording in the generated copies. The build fails if a source is missing, includes an unsupported Markdown block, or uses an unsupported link. It never silently deploys stale fallback copies. `.evidence/build-manifest.json` records source paths and SHA-256 revisions; `.evidence/pdf-manifest.json` records PDF routes, page counts, revisions and sizes.

Public routes:

| Path | Scope |
| --- | --- |
| `/` | Company and product overview |
| `/legal` | Company and product legal directory |
| `/legal/privacy` | Company website privacy notice |
| `/legal/terms` | Draft company website terms |
| `/legal/copyright` | Company copyright and legal contact |
| `/legal/whumpo` | Whumpo product policy directory |
| `/legal/whumpo/terms` | Draft Whumpo Terms of Service |
| `/legal/whumpo/privacy` | Draft Whumpo Privacy Policy |
| `/legal/whumpo/acceptable-use` | Draft Whumpo Acceptable Use Policy |
| `/legal/whumpo/cookies` | Draft Whumpo Cookie Notice |
| `/legal/whumpo/copyright` | Draft Whumpo Copyright and Abuse Policy |
| `/legal/whumpo/providers` | Draft Whumpo service-provider disclosure |
| `/legal/chapelcloud` | ChapelCloud product policy directory |
| `/legal/chapelcloud/terms` | Draft ChapelCloud terms |
| `/legal/chapelcloud/privacy` | Draft ChapelCloud privacy policy |
| `/legal/chapelcloud/cookies` | Draft ChapelCloud cookie notice |
| `/legal/labthrift` | LabThrift product policy directory |
| `/legal/labthrift/terms` | Draft LabThrift terms |
| `/legal/labthrift/privacy` | Draft LabThrift privacy policy |
| `/legal/labthrift/cookies` | Draft LabThrift cookie and storage notice |
| `/legal/openhost` | OpenHost draft policy directory |
| `/legal/openhost/terms` | Draft OpenHost Terms of Service |
| `/legal/openhost/privacy` | Draft OpenHost Privacy Policy |
| `/legal/openhost/acceptable-use` | Draft OpenHost Acceptable Use Policy |
| `/legal/openhost/cookies` | Draft OpenHost Cookie Notice |
| `/legal/openhost/copyright` | Draft OpenHost Copyright and Abuse Policy |
| `/legal/openhost/providers` | Draft OpenHost Service Providers disclosure |

Each of the 21 documents has a direct `.pdf` download and a `/print` page appended to its document route. For example, `/legal/chapelcloud/privacy.pdf` downloads the PDF and `/legal/chapelcloud/privacy/print` provides a printer-friendly copy. Each copy preserves the full text, draft status where applicable, canonical web URL and document revision. Directory pages are navigation rather than additional legal documents.

All product documents and company website terms remain visibly marked drafts pending adoption and are excluded from search indexing. Publishing does not adopt a contract, register a DMCA agent, establish a processing agreement, verify company formation, or collect user acceptance. Whumpo adoption work remains in `docs/legal/adoption-checklist.md`; private `.evidence/chapelcloud-review.md` and `.evidence/labthrift-review.md` record product observations and unresolved operational details. Those reviews are not public documents or PDF inputs. ChapelCloud drafts distinguish public information and inquiries from separately contracted church services. LabThrift drafts distinguish its guides, Lab plan and ByteRush. Company website privacy is a factual notice dated October 1, 2026 and does not substitute for product notices.

The Signal homepage loads its local interface script. Ordinary legal pages have no browser scripts. Printer-friendly pages load the small local `legal-actions.js`, which reveals a button and calls `window.print()` when clicked; it makes no network requests, stores no browser data and performs no tracking. The browser's Print menu remains available without JavaScript. There are no remote fonts, analytics tags, accounts, payment widgets or forms on this company site. Cloudflare processes delivery/security metadata; ordinary-page visits were checked for requests and cookies, but that does not certify every edge challenge, visitor location or future setting. Mailbox operation and response procedures must be maintained by the company.

General project and partnership links use `hello@digifender.com`, chosen with the owner's authorization to use the domain's catch-all. Legal/privacy requests retain `legal@digifender.com`. No email was sent and no mail configuration changed as part of this update.

The company owns the three showcased brands, as confirmed by the owner. ChapelCloud descriptions were checked against [its public website](https://chapel.cloud/) and its church software/managed-services pages. LabThrift descriptions were checked against [its about page](https://labthrift.com/about), [Lab plan](https://plan.labthrift.com/) and [ByteRush](https://app.labthrift.com/). Each showcase links to the product's homepage and its clearly labeled draft policy collection on Digifender. The ChapelCloud and LabThrift policy drafts are based on reviewed public behavior and owner-supplied company details; their product source code and footers were not changed. Central publication does not add notice links or acceptance flows to those product sites. Whumpo's legal documents do not cover the other products.

## Brand assets

The complete approved brand kit is archived locally in `brand/`, including the original trace, all SVG/PNG variants, brand board, browsable guide, fonts and ZIP. This folder stays outside `public/` and `dist/`.

The website uses the unchanged seventeen-ridge fingerprint/roof geometry. Curated assets in `public/brand/` provide Glacier lockups for the dark header/footer and hero, and an Ink lockup for printer-friendly HTML. `public/favicon.svg`, `public/apple-touch-icon.png`, and `public/social.svg` / `social.png` carry the same identity. The shared page template declares the social preview and touch icon. Wordmarks are vector outlines, so the public site requires no extra font files or external requests.

The header lockup is 210px wide on desktop and 196px on mobile; the hero mark is capped at 280px. Only the hero animates: seventeen SVG paths draw once in staggered waves, followed by a 2.2% overshoot and settle, completing in 2.3 seconds. Motion is CSS-only, with the full static mark as the default for reduced-motion users; header, footer and shared SVG assets do not animate. The existing mobile layout continues to omit the hero artwork.

The source/output snapshots are `.evidence/logo-update-before/` for the initial identity integration and `.evidence/hero-motion-before/` before the sizing and motion refinement.

## Deployment

```sh
pnpm run deploy
```

This builds and verifies the public output, then uses the existing authenticated Wrangler account. Review changes and run the browser check before deployment. Only `dist/` and the small Worker entrypoint are uploaded. Internal company formation, governance and finance folders are outside the project and never copied. DPA negotiation drafts and adoption checklists are not public assets.

The deployment touches the dedicated company Worker and its two custom domains. It does not deploy Whumpo, activate payments or AI providers, change email routing, purchase a domain, or upgrade a Cloudflare plan. Cloudflare's Custom Domains integration provisions the required website DNS and TLS certificate; see [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) and [static assets](https://developers.cloudflare.com/workers/static-assets/).

After deployment, verify HTTPS, `www` redirects, legal routes, an unknown path returning 404, security headers and mail MX records. Cloudflare's deployment/version history supports Worker rollback; rebuild from the desired source revision when reverting legal text. Keep release evidence and a source snapshot outside `dist/`.

`node tools/live-check.mjs` checks the deployed pages and PDF bytes against the current build, response headers, real download/print controls, redirects and private-path exclusions. It defaults to the production domain; `SITE_URL` can override the origin.

## Verified publication

Initial publication on October 1, 2026 used Worker version `d8819e89-58b0-40fa-820e-047e5bad5341`. Both custom domains were read back as belonging to `digifender-site`. Production checks passed across 24 desktop/mobile page visits, including accessibility, navigation, headers, missing pages and ordinary-visit cookies. HTTP-to-HTTPS and www-to-root redirects preserve the requested path and query. Existing Cloudflare mail MX records were unchanged. The initial source/output snapshot is `.evidence/release-2026-10-01.tar.gz`.

The company-focused portfolio update uses Worker version `78792ce0-7432-4caa-a309-6ee7667e2809`. It leads with Digifender's software/cloud capabilities, limits Whumpo promotion to one showcase, adds ChapelCloud and LabThrift showcases, and directs custom-project/partnership inquiries to `hello@digifender.com`. Shared navigation and metadata are company-focused. The company privacy notice distinguishes all three products from this website. Local checks passed on 24 desktop/mobile visits and 330 internal links; the layout was also inspected at 768 and 320 pixels. All 12 public production page bodies match the tested build. See `.evidence/company-portfolio-live-check.json` and `.evidence/release-company-portfolio-2026-10-01.tar.gz`.

Whumpo [PR #88](https://github.com/zemdregon/whumpo/pull/88) proposes footer and passkey identity links to this hub, based on draft identity [PR #79](https://github.com/zemdregon/whumpo/pull/79). Those app changes require Whumpo's separate review and deployment process; the company-site publication did not deploy that application.

The expanded legal hub uses Worker version `b66839f6-10ed-4421-94f4-968403eb2f5c`. It adds ChapelCloud and LabThrift collections and shared-source PDF/print copies for all 15 documents. Local verification covered 36 pages, 691 internal links and 60 public files; browser checks passed on 70 desktop/mobile visits, all downloads, print controls, text parity and the no-JavaScript fallback. All 36 PDF pages were visually reviewed. Production checks matched 55 deployed pages/assets to the tested build and verified redirects, security/download headers and private-path exclusions. Evidence is in `.evidence/expanded-legal-live-check.json`, with source snapshots in `.evidence/expanded-legal-source/` and the complete release archive in `.evidence/release-expanded-legal-2026-10-01.tar.gz`. The shared footer retains “Built with ♥.”

The approved fingerprint/roof identity update uses Worker version `dffeaee9-9c3b-410f-98ad-56843d24985f`. It imports the complete brand family to `brand/` and updates shared header/footer lockups, the homepage hero, printer-friendly HTML, favicon, touch icon and social preview. The 17 approved centerlines are unchanged. Build verification passed on 36 pages, 728 links and 67 public files; live checks matched 65 served pages/assets exactly, with unchanged legal-source revisions and mail MX. Desktop and 390px mobile layouts were inspected in-browser. See `.evidence/logo-update-release.json` and `.evidence/logo-update-live-check.json`; the pre-update snapshot is `.evidence/logo-update-before/`.

The hero motion and sizing refinement uses Worker version `50c16138-636d-4d92-9edc-392963c7ed4a`. Header and hero sizes are reduced, and only the hero receives the SVG line-draw introduction. Build checks passed on 36 pages, 727 links and 67 public files. Browser checks covered partial drawing, 2.2% overshoot, exact final settlement, static header/footer, reduced motion and the 390px mobile layout. All 65 served pages/assets match the local build. See `.evidence/hero-motion-release.json`, `.evidence/hero-motion-browser-check.json` and `.evidence/hero-motion-live-check.json`.

The October 2 portfolio connection update uses Worker version `f3c3738d-8657-41dd-952a-757f13fb4ceb`. Each homepage showcase now links directly to its product's draft policy collection. `pnpm build` and `pnpm test` passed on 36 pages and 730 internal links. Browser checks passed on 70 desktop/mobile page visits, including accessibility and policy downloads. After brief cache propagation, all 55 checked deployed pages/assets matched the local build, and the live Whumpo card opened its draft collection. The product sites themselves still lack the connections recorded in `../00 Start Here/Portfolio Connections.md`. See `.evidence/portfolio-policy-links-live-check.json` and `.evidence/release-portfolio-policy-links-2026-10-02.tar.gz`.

The October 2 LabThrift name correction uses Worker version `110550f1-da80-43ca-a0bb-506365629212`. It capitalizes the brand consistently in the company privacy notice. The source audit found no other changed legal source; the only changed HTML was the notice and its print copy. Generated PDFs received new creation timestamps, while extracted text changed only in the company privacy PDF. `pnpm build` and `pnpm test` passed on 36 pages and 730 internal links. After propagation, `node tools/live-check.mjs` matched 55 live pages/assets to the build and verified downloads, redirects, headers and private-path exclusions. The live result is `.evidence/labthrift-name-live-check.json`; release source and output are in `.evidence/release-labthrift-name-2026-10-02.tar.gz`.

The October 2 ChapelCloud inquiry update uses Worker version `ec3f1f95-aa60-4a30-b2ac-eb998778c231`. The company homepage card now offers “Ask Digifender about ChapelCloud” through the existing `hello@digifender.com` address with a ChapelCloud subject. Desktop and 390px mobile layouts were visually checked; `pnpm build` and `pnpm test` passed on 36 pages and 730 internal links. The only changed non-PDF assets were the homepage and stylesheet; PDF text remained identical, though generation timestamps changed their bytes. The live browser showed the exact mailto destination, and `node tools/live-check.mjs` matched 55 deployed pages/assets to the build. This does not fix ChapelCloud's own placeholder contact links or prove email delivery. Evidence is in `.evidence/chapelcloud-inquiry-live-check.json` and `.evidence/release-chapelcloud-inquiry-2026-10-02.tar.gz`.

The October 2 OpenHost portfolio addition uses Worker version `ee167334-06e6-4c86-b766-c0784eaadf11`. OpenHost joins the selected Signal homepage as the fourth brand, describing planned hosting and AI operation for developers and small teams. It is labeled “In development · Public launch pending” and links to an inquiry at the existing company mailbox. Its public anchor is `/#product-openhost`. The legal-preserving design build (`node designs/build.mjs --reuse-legal`), `pnpm test`, and `pnpm test:designs` passed. Browser verification covered four tabs, keyboard navigation, no-JavaScript content, and 320–1920px layouts in both variants, with accessibility checks at 390px and 1440px. All 69 live pages/assets matched the final release; the OpenHost deep link and inquiry link passed live desktop/mobile checks. Only the homepage and hashed stylesheet changed in the served package. Evidence: `.evidence/openhost-product/`; previous source/release snapshot: `.evidence/openhost-product-before-2026-10-02/`.

The October 2 OpenHost legal-hub update adds six drafts at `/legal/openhost`: terms, privacy, acceptable use, cookies, copyright/abuse and service providers. The Signal homepage links to that collection. Each has a shared-source PDF and print copy, with draft labels and noindex protection. Company privacy/copyright notices now include OpenHost and clarify the homepage script. Sources are in `content/openhost/`; publication does not adopt terms or establish a live hosting offer. `pnpm build`, `pnpm test` and `pnpm test:designs` passed (49 HTML pages, 21 PDFs). Targeted browser verification passed 36 desktop/mobile visits, eight downloads and print flows; all 17 new/revised PDF pages were visually reviewed. Worker version: `8abbcdf3-4a19-48b1-9d16-58496b5d7212`. Evidence and remaining adoption decisions: `.evidence/openhost-legal/`; previous release snapshot: `.evidence/openhost-legal-before-2026-10-02/`.

Live OpenHost legal publication verified: 88 served pages/assets matched the release exactly, with security/download headers, redirects, methods and private-path checks. Both desktop and mobile browser checks passed for all six drafts and the homepage/hub links. See `.evidence/openhost-legal/live-check.json` and `live-browser-check.json` under the website root.

The separate OpenHost public preview is now live at <https://openhost.pro/>. The Signal OpenHost panel links to it while retaining the Digifender inquiry route and “In development · Public launch pending” label. The draft legal collection also returns to the preview. Worker version `5fe357a0-7ab0-4ead-a494-60ebd733fece` passed the local 49-page/21-PDF checks, both design package checks, 88 exact live-file checks, and desktop/mobile link readback. The product remains unavailable for customer hosting, sign-in, payments and AI actions. Release archive: `.evidence/release-openhost-public-link-2026-10-02.tar.gz`.

The October 2 [preview privacy and draft-status correction](.evidence/openhost-preview-privacy-2026-10-02.md) adds the live static preview to the factual Website Privacy Notice and corrects four OpenHost draft documents that previously described the domain as undeployed or omitted the preview. The current Signal release is `6e65bc38-6763-4333-a3a7-003b8273fa22`; the OpenHost preview links to the factual notice as well as clearly labeled drafts. This does not adopt product terms or activate customer services.

The October 3 LabThrift guided-project draft publication uses Worker `d2c1ba20-7450-48b6-8974-2fb721b10437`. Only the three LabThrift documents changed in text; the six web/print pages and their PDFs remain drafts. Build, design-package, eight-page PDF visual review, desktop/mobile document checks, and all 88 exact live-file checks passed. This release pins the six already-published Whumpo sources from GitHub main `6ed1d8ce6b55283811e1980fbd3808546c29bedb` through `WHUMPO_LEGAL_SOURCE=.evidence/labthrift-drafts-2026-10-03/whumpo-published-source`; the shared untracked Whumpo cookie-name edit requires product-team reconciliation before another default rebuild. Evidence and source/output archive: `.evidence/labthrift-drafts-2026-10-03/`.
