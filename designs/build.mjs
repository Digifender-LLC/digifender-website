import {readFile,writeFile,mkdir,cp,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {renderHome,variants} from './pages.mjs';
import {renderManagedHosting} from './managed-hosting.mjs';
import {groups} from '../src/legal-documents.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.dirname(here);
// Rebuild from canonical legal sources. No deployment occurs in this command.
if (!process.argv.includes('--reuse-legal')) {
  for (const script of ['tools/build.mjs','tools/build-pdfs.mjs','tools/verify.mjs']) {
    const result=spawnSync(process.execPath,[script],{cwd:root,stdio:'inherit'});
    if(result.status!==0)throw Error(`${script} failed`);
  }
}
const baseManifest=JSON.parse(await readFile(path.join(root,'.evidence/build-manifest.json'),'utf8'));
for(const page of baseManifest.pages.filter(p=>p.source)) {
  const source=await readFile(path.resolve(root,page.source));
  if(createHash('sha256').update(source).digest('hex')!==page.sha256)throw Error('Legal build is stale; run without --reuse-legal.');
}
const css=await readFile(path.join(here,'assets/site.css'));
const js=await readFile(path.join(here,'assets/site.js'));
const hash=b=>createHash('sha256').update(b).digest('hex').slice(0,12);
const assetNames={css:`site.${hash(css)}.css`,js:`site.${hash(js)}.js`};
for (const [variant,info] of Object.entries(variants)) {
  const release=path.join(here,'releases',variant);
  const output=path.join(release,'public');
  await rm(output,{recursive:true,force:true});
  await mkdir(path.join(output,'assets'),{recursive:true});
  await cp(path.join(root,'dist'),output,{recursive:true});
  for(const group of groups) {
    for(const link of group.productLinks||[]) {
      if(!link.designHref)continue;
      const collection=path.join(output,group.route.slice(1)+'.html');
      const html=await readFile(collection,'utf8');
      const original=`<a href="${link.href}">${link.label}</a>`;
      if(!html.includes(original))throw Error(`Missing ${group.name} collection link for ${variant}`);
      await writeFile(collection,html.replace(original,`<a href="${link.designHref}">${link.designLabel||link.label}</a>`));
    }
  }
  await writeFile(path.join(output,'assets',assetNames.css),css);
  await writeFile(path.join(output,'assets',assetNames.js),js);
  await cp(path.join(root,'brand/digifender-brand-family/fonts/Manrope-Variable.ttf'),path.join(output,'assets/manrope.ttf'));
  await cp(path.join(root,'brand/digifender-brand-family/fonts/OFL-Manrope.txt'),path.join(output,'assets/OFL-Manrope.txt'));
  await writeFile(path.join(output,'index.html'),renderHome(variant,assetNames));
  await writeFile(path.join(output,'managed-hosting.html'),renderManagedHosting(variant,assetNames));
  await cp(path.join(here,'assets',`social-${variant}.png`),path.join(output,'social.png'));
  const headers=await readFile(path.join(output,'_headers'),'utf8');
  await writeFile(path.join(output,'_headers'),headers+"\n/\n  ! Content-Security-Policy\n  Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests\n");
  const config=JSON.parse((await readFile(path.join(root,'wrangler.jsonc'),'utf8')));
  delete config.$schema;
  config.main='./worker.js';
  config.assets.directory='./public';
  await writeFile(path.join(release,'wrangler.jsonc'),JSON.stringify(config,null,2)+'\n');
  const baseWorker=(await readFile(path.join(root,'src/worker.js'),'utf8')).replace('export default {','const originalWorker = {');
  const variantWorker=(await readFile(path.join(here,'worker.js'),'utf8')).replace("import originalWorker from '../src/worker.js';",'');
  await writeFile(path.join(release,'worker.js'),baseWorker+'\n'+variantWorker);
  await writeFile(path.join(release,'package.json'),JSON.stringify({name:`digifender-${variant}`,version:'1.0.0',private:true,type:'module',scripts:{dev:'wrangler dev',deploy:'wrangler deploy'},devDependencies:{wrangler:'4.143.0'},engines:{node:'>=24'}},null,2)+'\n');
  await writeFile(path.join(release,'README.md'),`# Digifender / ${info.name}\n\n${info.tagline}\n\nThis folder is a standalone Cloudflare Workers release: the Worker, routing configuration, complete static site, ${baseManifest.pages.filter(p=>p.source).length} PDF policy copies, local font and its license, and social image. Only public/ is served. All policy draft labels are preserved.\n\nFrom the Digifender website checkout, run \`node node_modules/wrangler/bin/wrangler.js deploy --config designs/releases/${variant}/wrangler.jsonc\` after this design has been selected. A copied standalone folder can use \`npm install\`, then \`npm run dev\` or \`npm run deploy\`, with the owner's authenticated Cloudflare account. Deployment replaces the dedicated digifender-site Worker and its existing domains. The other variant must not be deployed at the same time.\n\nThis folder is generated locally. See the parent designs/README.md and evidence/ for the selected production design, publication status, and validation details.\n`);
  await writeFile(path.join(release,'manifest.json'),JSON.stringify({variant,...info,builtAt:new Date().toISOString(),assets:assetNames,legalPages:baseManifest.pages.filter(p=>p.source)},null,2)+'\n');
  console.log(`Built ${info.name}: ${output}`);
}
