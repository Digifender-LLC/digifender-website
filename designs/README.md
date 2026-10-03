# Digifender — Signal & Blueprint

Two complete website alternatives combining the selected round-03 designs 06, 08, 02, and 03. The owner selected **A / Signal**, initially deployed on October 2, 2026 as Worker version `79f6d487-fb7b-4a92-95e1-5cc732e296f7`. The current verified Signal release is Worker version `d2c1ba20-7450-48b6-8974-2fb721b10437`, including the October 3 LabThrift guided-project draft publication. See the root README and `.evidence/labthrift-drafts-2026-10-03/` for its pinned Whumpo source and verification. Blueprint remains an unpublished alternative.

- **A / Signal**: “Make something that matters.” Bold, asymmetric identity; horizontal brand explorer; graphic, expressive motion.
- **B / Blueprint**: “Clarity first. Possibility follows.” Technical drawing; measured typography; vertical brand explorer and editorial capability rows.

Both include company, four products, capabilities, approach, contact, and footer sections. They retain the approved identity geometry, Manrope, brand colors, company contacts, Whumpo preview status, all legal routes, policy draft labels, printer-friendly pages, and 21 PDFs.

## Preview and build

From the website directory:

```sh
node designs/build.mjs
node designs/serve.mjs
```

The first command rebuilds legal pages/PDFs from their canonical sources, runs the existing verifier, then creates both releases. The second runs two local previews through the production Worker logic:

- Signal: http://localhost:8793
- Blueprint: http://localhost:8794

The two-option gallery is served at http://localhost:8792 by the existing concepts preview server. Run `node designs/build-gallery.mjs` to regenerate its HTML and CSS. The previous ten directions are archived in `.evidence/concept-rounds/round-03.tar.gz`.

`node designs/build.mjs --reuse-legal` rebuilds only design packages and rejects stale legal source hashes. `pnpm build:designs`, `pnpm preview:designs`, and `pnpm test:designs` are equivalent package scripts.

## Motion and interactions

- Staggered draw-in of the unchanged seventeen-ridge brand mark.
- Introductory typography, section reveals, and scroll-position navigation.
- Quiet ambient graphics, suspended when outside the viewport or in a background tab.
- Directional product transitions, with independent artwork and color treatments.
- Animated native details panels, hover/focus treatments, mobile menu disclosure, and email copying with a fallback message.
- A Pause motion control and live response to the OS reduced-motion preference.

Product tabs support keyboard navigation, Home/End, and screen-reader labeling. Blueprint uses Up/Down on its vertical desktop tab list and Left/Right on mobile. Deep links such as `/#product-labthrift` select the appropriate product. No automatic product rotation occurs.

Without JavaScript, all four products remain visible, links and navigation work, details remain native controls, and ambient animation is disabled. Reduced motion disables transitions and ambient animation while preserving content and controls. The sites do not write cookies or browser storage, load analytics or external fonts, or submit forms. Email and telephone links open the visitor's preferred app.

## Deployment packages

`releases/signal/` and `releases/blueprint/` are independent, portable Cloudflare Workers packages. Each contains its own Worker, configuration, static output, metadata manifest, and usage instructions. The served `public/` directory contains only website assets; source and evidence are outside it. Each package has its own 1200×630 share image. Manrope's OFL license ships with the font.

Signal is the default in the root Wrangler configuration. `pnpm deploy` builds the packages and publishes Signal to the existing `digifender-site` Worker. The standalone Signal package can also be deployed directly:

```sh
node node_modules/wrangler/bin/wrangler.js deploy --config designs/releases/signal/wrangler.jsonc
```

The Signal command was executed with the owner's authorization. Do not deploy Blueprint without a new selection. Both packages target the same existing account and custom domains. After publishing, run `node designs/live-check.mjs` and inspect the actual domain. The local preview adds `X-Robots-Tag: noindex`; this preview-only behavior is absent from the release Worker.

The homepage permits only its local script under CSP. Legal pages retain their existing stricter policy, with the print-script allowance only on print routes. Hashed CSS/JS filenames support immutable caching, while homepage responses use `no-cache`. `www` and HTTP canonical redirects, GET/HEAD restrictions, PDF download headers, draft noindex rules, and custom 404 behavior are retained.

## Verification

With both local preview servers running:

```sh
node designs/verify.mjs
```

Checks cover both complete packages: 49 HTML pages each, 21 PDFs each, all internal routes/assets/anchors, duplicate IDs, one h1 per page, served-byte parity, headers, cache policy, redirects, GET/HEAD/POST handling, 404s, legal destinations, and PDF bytes.

Browser checks used the actual UI at 320, 390, 768, 1024, 1440, and 1920 CSS pixels. All six product views were tested on desktop and mobile, with no WCAG A/AA violations reported by axe-core 4.13.0 in those twelve states. Manual checks covered mobile menu/Escape behavior, tab keys, deep links, pause/resume, reduced motion, JavaScript disabled, details expansion/collapse, contact copy, and product-policy navigation. No JavaScript errors were observed. Automated accessibility results do not replace testing with a wider set of browsers and assistive technologies.

Both final Worker packages passed Wrangler deployment dry runs. These verify packaging and configuration, not a live deployment. Current CSS and JS gzip to about 9.7 KB and 3.2 KB respectively; the self-hosted variable font is 165 KB uncompressed. No Lighthouse score or external cross-browser certification is claimed.

See `evidence/static-and-http.json`, `evidence/browser-checks.json`, desktop/mobile screenshots, and the dry-run bundles. Existing legal documents remain drafts where marked; this design work does not adopt or revise them.

The October 2 connection update carries the labeled draft website-terms footer link, ChapelCloud inquiry link, and product-return links on all three legal collections into the selected Signal package. It changed only the homepage and three collection HTML pages among the site's HTML; the 15 legal source hashes and extracted PDF text stayed unchanged. Local Signal/Blueprint package checks, targeted 1440px/390px Signal accessibility and layout checks, 69 exact live asset checks, and a live mobile navigation check passed. The portfolio audit still records 35 product-side gaps. The release snapshot is `../.evidence/release-signal-connections-2026-10-02.tar.gz`.

## Editing

- `pages.mjs`: page composition and all marketing copy.
- `assets/site.css`: shared foundations and distinct variant layouts.
- `assets/site.js`: progressive enhancement and motion controls.
- `worker.js`: homepage-only script allowance and asset cache policy over the existing Worker.
- `build.mjs`: canonical legal rebuild and independent release generation.
- `serve.mjs`: local preview adapter using the same Worker behavior.
- `build-gallery.mjs`: final selection gallery.
- `social-cards.mjs`: editable source of browser-rendered social images; regenerate the two PNGs after changing share-image copy.

Use `node designs/build.mjs` after changes. Re-run checks appropriate to what changed; refresh screenshots when layout or copy changes.

## OpenHost portfolio addition — October 2, 2026

OpenHost is the fourth brand in the shared homepage source. Its description follows the OpenHost product brief and current launch roadmap: hosting for developers and small teams with a planned AI operator, explicitly marked “In development · Public launch pending.” The action opens an OpenHost inquiry to the existing company mailbox. That initial portfolio change did not publish a product-policy collection or establish a verified public OpenHost destination. The subsequent legal-hub update below adds its draft collection. Existing product policy links remain explicit in the product data.

Published to Signal as Worker version `ee167334-06e6-4c86-b766-c0784eaadf11`. Verification and screenshots are in `../.evidence/openhost-product/`, including 69 exact live-file matches and live desktop/mobile checks. The served changes are the homepage and stylesheet. Blueprint was rebuilt and checked locally.

## OpenHost legal collection — October 2, 2026

The six OpenHost drafts are published at `/legal/openhost` and linked from its homepage panel. Web, PDF and print copies share `content/openhost/` sources; effective dates remain pending. This extends the legal hub to 49 HTML pages and 21 PDFs. The company notices include OpenHost; other existing policy text is unchanged. Signal Worker version `8abbcdf3-4a19-48b1-9d16-58496b5d7212` carries this update. Build, package, browser, PDF and publication evidence is in `../.evidence/openhost-legal/`.

Live OpenHost legal publication verified: 88 served pages/assets matched the release exactly, with security/download headers, redirects, methods and private-path checks. Both desktop and mobile browser checks passed for all six drafts and the homepage/hub links. See `.evidence/openhost-legal/live-check.json` and `live-browser-check.json` under the website root.
