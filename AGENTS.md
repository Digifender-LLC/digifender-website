## Deployment

This repository deploys two Cloudflare Workers through Cloudflare Workers Builds. Do not deploy by hand.

- `mta-sts/` (Worker `digifender-mta-sts`): merging changes under `mta-sts/` to `main` deploys it automatically with `npx wrangler deploy`.
- Root site (Worker `digifender-site`): linked to Workers Builds, but not yet deploying automatically. Its build reads files from a sibling Whumpo checkout (`../Whumpo/docs/legal/`), which the build cannot see. Until that is fixed, merges only upload an inactive version; ask the owner before any production deploy of the site.
- Never run `wrangler deploy`, `wrangler versions deploy`, `opennextjs-cloudflare deploy`, `wrangler d1 migrations apply --remote`, or any other command that changes production. You do not need a Cloudflare API token and should not look for one.
- Check the result on the commit's Workers Builds check in GitHub. If the build failed, fix it with another PR; do not deploy around it.
- The build only has this repository. Files outside the repo, gitignored files and local secrets are not available to it.
