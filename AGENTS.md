## Deployment

This repository deploys two Cloudflare Workers through Cloudflare Workers Builds. Do not deploy by hand.

- `mta-sts/` (Worker `digifender-mta-sts`): merging changes under `mta-sts/` to `main` deploys it automatically with `npx wrangler deploy`.
- Root site (Worker `digifender-site`, digifender.com and www): merging any change outside `mta-sts/` to `main` deploys it automatically. The build runs `pnpm run build:ci && pnpm test`, then `npx wrangler deploy`. Whumpo legal text comes from the pinned copy in `vendor/whumpo-legal-published/`; update it (and `provenance.json`) by PR, never by pointing the build at a sibling checkout.
- Never run `wrangler deploy`, `wrangler versions deploy`, `opennextjs-cloudflare deploy`, `wrangler d1 migrations apply --remote`, or any other command that changes production. You do not need a Cloudflare API token and should not look for one.
- Check the result on the commit's Workers Builds check in GitHub. If the build failed, fix it with another PR; do not deploy around it.
- The build only has this repository. Files outside the repo, gitignored files and local secrets are not available to it.
