import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=fileURLToPath(new URL('../',import.meta.url));
const dist=path.join(root,'dist');
const {pages}=JSON.parse(await readFile(path.join(root,'.evidence/build-manifest.json'),'utf8'));
const htmlByRoute=new Map();
for(const page of pages) {
  const file=page.route==='/'?'index.html':page.route.slice(1)+'.html';
  const html=await readFile(path.join(dist,file),'utf8');
  htmlByRoute.set(page.route,html);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${page.route}: one descriptive h1`);
  assert(!/<iframe\b|<form\b/i.test(html),`${page.route}: no embeds or forms`);
  const scripts=[...html.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m=>m[0]);
  assert.deepEqual(scripts,page.kind==='print'?['<script defer src="/legal-actions.js"></script>']:[],`${page.route}: only the print view loads its local print control`);
  assert(!/Alexa Faith|Ender Raven|50\/50|EIN application|Owner Decision Record/.test(html),'Private company records must not be published');
  assert(html.includes(`rel="canonical" href="https://digifender.com${page.canonical||page.route}"`),'Canonical URL');
}
let checked=0;
for(const [route,html] of htmlByRoute) {
  for(const match of html.matchAll(/(?:href|src)="([^"\s]+)"/g)) {
    const href=match[1].replace(/&amp;/g,'&');
    if(!href.startsWith('/')&&!href.startsWith('#'))continue;
    const url=new URL(href,`https://digifender.com${route}`);
    const target=htmlByRoute.get(url.pathname);
    if(target) {
      if(url.hash)assert(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),`${route}: broken fragment ${href}`);
    } else {
      assert(!url.hash,`${route}: unexpected asset fragment ${href}`);
      await readFile(path.join(dist,url.pathname.slice(1)));
    }
    checked++;
  }
}
const publicFiles=[];
async function walk(directory,prefix='') {
  for(const entry of await readdir(directory,{withFileTypes:true})) {
    if(entry.isDirectory())await walk(path.join(directory,entry.name),prefix+entry.name+'/');
    else publicFiles.push(prefix+entry.name);
  }
}
await walk(dist);
assert(publicFiles.every(f=>/\.html$|\.css$|\.svg$|^legal-actions\.js$|^legal\/.+\.pdf$|^(social|apple-touch-icon)\.png$|^robots\.txt$|^sitemap\.xml$|^_headers$|^_redirects$/.test(f)),'Unexpected public artifact');
for(const document of pages.filter(p=>p.kind==='document')) {
  const pdf=await readFile(path.join(dist,document.pdfRoute.slice(1)));
  assert.equal(pdf.subarray(0,5).toString(),'%PDF-','Valid PDF signature');
  assert(htmlByRoute.get(document.route).includes(`href="${document.pdfRoute}" download`));
  assert(htmlByRoute.get(document.route).includes(`href="${document.printRoute}"`));
  assert(htmlByRoute.has(document.printRoute),'Print copy exists');
}
for(const group of ['chapelcloud','labthrift','openhost'])assert(htmlByRoute.get('/legal').includes(`href="/legal/${group}"`),'All product groups linked');
const home=htmlByRoute.get('/');
for(const [card,group] of [['whumpo','whumpo'],['chapel','chapelcloud'],['lab','labthrift']]) {
  const showcase=home.match(new RegExp(`<article class="project-showcase project-${card}"[\\s\\S]*?<\\/article>`))?.[0];
  assert(showcase?.includes(`href="/legal/${group}"`),`${group}: homepage showcase links to its policies`);
  assert(showcase?.includes('draft policies</a>'),`${group}: homepage identifies draft status`);
}
assert(htmlByRoute.get('/legal/whumpo/terms').includes('not yet adopted'));
assert(htmlByRoute.get('/legal/copyright').includes('No DMCA designated-agent registration has been filed'));
assert(htmlByRoute.get('/legal/privacy').includes('Effective October 1, 2026'));
console.log(`Verified ${pages.length} pages, ${checked} internal links and ${publicFiles.length} public files.`);
