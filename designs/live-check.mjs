import assert from 'node:assert/strict';
import {readFile,readdir,writeFile,mkdir} from 'node:fs/promises';
import {resolveMx} from 'node:dns/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.join(here,'releases/signal/public');
const origin='https://digifender.com';
const results=[];
async function walk(dir,prefix='') {
  const result=[];
  for(const entry of await readdir(dir,{withFileTypes:true})) {
    if(entry.isDirectory()) result.push(...await walk(path.join(dir,entry.name),prefix+entry.name+'/'));
    else result.push(prefix+entry.name);
  }
  return result;
}
const files=(await walk(root)).filter(file=>!['_headers','_redirects'].includes(file));
for(let offset=0;offset<files.length;offset+=5) {
  await Promise.all(files.slice(offset,offset+5).map(async file=>{
    const route=file==='index.html'?'/':file==='404.html'?'/signal-verification-missing':'/'+file.replace(/\.html$/,'');
    const response=await fetch(origin+route);
    assert.equal(response.status,file==='404.html'?404:200,route);
    const body=Buffer.from(await response.arrayBuffer());
    assert(body.equals(await readFile(path.join(root,file))),'Deployed bytes differ: '+route);
    assert.equal(response.headers.get('x-content-type-options'),'nosniff',route);
    assert(response.headers.get('content-security-policy').includes("frame-ancestors 'none'"),route);
    if(route==='/') {
      assert(response.headers.get('content-security-policy').includes("script-src 'self'"));
      assert.equal(response.headers.get('cache-control'),'no-cache');
      assert(!response.headers.get('x-robots-tag')?.includes('noindex'));
      assert(body.toString().includes('Make something that'));
    }
    if(file.endsWith('.pdf')) {
      assert(response.headers.get('content-type').startsWith('application/pdf'));
      assert(response.headers.get('content-disposition').startsWith('attachment;'));
      assert.equal(response.headers.get('x-robots-tag'),'noindex');
    }
    if(/^assets\/site\./.test(file)) assert(response.headers.get('cache-control').includes('immutable'));
    results.push({route,status:response.status,bytes:body.length,exactMatch:true});
  }));
}
for(const route of ['/.evidence/documents.json','/content/labthrift/privacy.md','/README.md','/manifest.json']) {
  assert.equal((await fetch(origin+route)).status,404,route);
}
for(const url of ['http://digifender.com/legal/labthrift?check=signal','https://www.digifender.com/legal/labthrift?check=signal']) {
  const response=await fetch(url,{redirect:'manual'});
  assert([301,308].includes(response.status));
  assert.equal(response.headers.get('location'),origin+'/legal/labthrift?check=signal');
}
assert.equal((await fetch(origin,{method:'POST'})).status,405);
const head=await fetch(origin,{method:'HEAD'});
assert.equal(head.status,200);assert.equal(await head.text(),'');
const evidence=path.join(here,'evidence/deployment-signal');
await mkdir(evidence,{recursive:true});
const before=JSON.parse(await readFile(path.join(evidence,'before.json'),'utf8'));
const normalize=records=>records.map(record=>`${record.priority} ${record.exchange}`).sort();
const mx=await resolveMx('digifender.com');
assert.deepEqual(normalize(mx),normalize(before.mx),'Mail MX changed');
await writeFile(path.join(evidence,'live-check.json'),JSON.stringify({checkedAt:new Date().toISOString(),origin,variant:'signal',results,redirects:true,methods:true,privatePaths:true,mxUnchanged:true},null,2)+'\n');
console.log(`Verified ${results.length} live pages/assets, exact release bytes, security and download headers, redirects, methods, private paths, and unchanged mail MX.`);
