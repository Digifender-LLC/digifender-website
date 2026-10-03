import {readFile,readdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {gzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import worker from './worker.js';
const here=path.dirname(fileURLToPath(import.meta.url));
const reports=[];
async function walk(dir,prefix=''){const result=[];for(const e of await readdir(dir,{withFileTypes:true})){if(e.isDirectory())result.push(...await walk(path.join(dir,e.name),prefix+e.name+'/'));else result.push(prefix+e.name);}return result;}
for(const [variant,port] of [['signal',8793],['blueprint',8794]]){
 const root=path.join(here,'releases',variant,'public');
 const manifest=JSON.parse(await readFile(path.join(here,'releases',variant,'manifest.json'),'utf8'));
 const files=await walk(root);
 const htmlFiles=files.filter(f=>f.endsWith('.html'));
 const pages=new Map(await Promise.all(htmlFiles.map(async f=>['/'+(f==='index.html'?'':f.replace(/\.html$/,'')),await readFile(path.join(root,f),'utf8')])));
 let links=0;
 for(const [route,html] of pages){
  assert.equal((html.match(/<h1\b/g)||[]).length,1,route+' h1');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,route+' duplicate IDs');
  assert(!/<iframe\b|<form\b/i.test(html));
  assert(!/Alexa Faith|Ender Raven|EIN application|Owner Decision Record/.test(html));
  const scripts=[...html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(scripts,route==='/'?['/assets/'+manifest.assets.js]:route.endsWith('/print')?['/legal-actions.js']:[],route+' scripts');
  for(const m of html.matchAll(/(?:src|href)="([^"\s]+)"/g)){
   if(!m[1].startsWith('/')&&!m[1].startsWith('#'))continue;
   const url=new URL(m[1].replaceAll('&amp;','&'),'https://digifender.com'+route);
   if(pages.has(url.pathname)){if(url.hash)assert(pages.get(url.pathname).includes(`id="${url.hash.slice(1)}"`),route+' '+m[1]);}
   else assert(files.includes(url.pathname.slice(1)),route+' missing '+m[1]);
   links++;
  }
  const response=await fetch('http://localhost:'+port+route);
  assert.equal(response.status,200,route);
  assert.equal(await response.text(),html,route+' response parity');
  assert(response.headers.get('content-security-policy').includes("default-src 'none'"));
  assert.equal(response.headers.get('content-security-policy').includes("script-src 'self'"),route==='/'||route.endsWith('/print'),route+' CSP');
  assert.equal(response.headers.get('x-content-type-options'),'nosniff');
  if(manifest.legalPages.some(p=>p.route===route&&p.draft)||route.endsWith('/print')) assert.equal(response.headers.get('x-robots-tag'),'noindex',route+' draft indexing');
 }
 for(const policy of manifest.legalPages){
  const content=await readFile(path.join(root,policy.pdfRoute.slice(1)));
  assert.equal(content.subarray(0,5).toString(),'%PDF-');
  const response=await fetch('http://localhost:'+port+policy.pdfRoute);
  assert.equal(response.headers.get('content-type'),'application/pdf');
  assert(response.headers.get('content-disposition').includes('attachment'));
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),content);
 }
 const missing=await fetch('http://localhost:'+port+'/does-not-exist');assert.equal(missing.status,404);
 assert.equal((await fetch('http://localhost:'+port+'/',{method:'POST'})).status,405);
 const head=await fetch('http://localhost:'+port+'/',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
 const home=pages.get('/');assert(home.includes('Invitation-only preview'));
 for(const brand of ['whumpo','chapelcloud','labthrift','openhost'])assert(home.includes(`href="/legal/${brand}"`));
 for(const type of ['css','js']){
  const file=manifest.assets[type];const r=await fetch('http://localhost:'+port+'/assets/'+file);assert.equal(r.status,200);assert(r.headers.get('cache-control').includes('immutable'));
 }
 const size={};for(const type of ['css','js'])size[type]=gzipSync(await readFile(path.join(root,'assets',manifest.assets[type]))).byteLength;
 reports.push({variant,pages:pages.size,links,pdfs:manifest.legalPages.length,files:files.length,gzipBytes:size,passed:true});
}
const redirect=await worker.fetch(new Request('http://www.digifender.com/legal/privacy?from=test'),{ASSETS:{fetch:()=>{throw Error('Redirect must not read assets')}}});
assert.equal(redirect.status,308);assert.equal(redirect.headers.get('location'),'https://digifender.com/legal/privacy?from=test');
await writeFile(path.join(here,'evidence/static-and-http.json'),JSON.stringify(reports,null,2));
console.log(JSON.stringify(reports,null,2));
