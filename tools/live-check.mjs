import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const origin=process.env.SITE_URL||'https://digifender.com';
const root=new URL('../',import.meta.url);
const {pages}=JSON.parse(await readFile(new URL('.evidence/build-manifest.json',root),'utf8'));
const results=[];
const paths=[...pages.map(page=>({route:page.route,status:200,kind:page.kind})),
  ...pages.filter(page=>page.kind==='document').map(page=>({route:page.pdfRoute,status:200,kind:'pdf'})),
  ...['/styles.css','/legal-print.css','/legal-actions.js','/favicon.svg'].map(route=>({route,status:200,kind:'asset'}))];
for(let offset=0;offset<paths.length;offset+=4){
  await Promise.all(paths.slice(offset,offset+4).map(async item=>{
    const response=await fetch(origin+item.route);
    assert.equal(response.status,item.status,item.route);
    const localPath=item.kind==='pdf'||item.kind==='asset'?item.route:item.route==='/'?'/index.html':item.route+'.html';
    const body=Buffer.from(await response.arrayBuffer());
    assert(body.equals(await readFile(new URL('dist'+localPath,root))),'Exact deployed asset: '+item.route);
    assert(response.headers.get('content-security-policy')?.includes("frame-ancestors 'none'"));
    assert.equal(response.headers.get('x-content-type-options'),'nosniff');
    if(item.kind==='pdf'){
      assert(response.headers.get('content-type').startsWith('application/pdf'));
      assert(response.headers.get('content-disposition').startsWith('attachment;'));
      assert.equal(response.headers.get('x-robots-tag'),'noindex');
      assert(response.headers.get('link').includes(item.route.slice(0,-4)));
    }
    if(item.kind==='print'){
      assert(response.headers.get('content-security-policy').includes("script-src 'self'"));
      assert.equal(response.headers.get('x-robots-tag'),'noindex');
    }
    results.push({route:item.route,status:response.status,bytes:body.length,exactMatch:true});
  }));
}
for(const route of ['/not-a-page','/.evidence/documents.json','/content/labthrift/privacy.md','/README.md']){
  assert.equal((await fetch(origin+route)).status,404,'Private or absent path: '+route);
}
if(new URL(origin).hostname==='digifender.com'){
  for(const input of ['http://digifender.com/legal/labthrift?print=1','https://www.digifender.com/legal/labthrift?print=1']){
    const response=await fetch(input,{redirect:'manual'});
    assert([301,308].includes(response.status));
    assert.equal(response.headers.get('location'),'https://digifender.com/legal/labthrift?print=1');
  }
}
const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext();
  const page=await context.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{window.__printCalls=0;window.print=()=>{window.__printCalls++;};});
  for(const product of ['chapelcloud','labthrift']){
    await page.goto(origin+'/legal/'+product+'/privacy',{waitUntil:'networkidle'});
    const downloadEvent=page.waitForEvent('download');
    await page.getByRole('link',{name:'Download PDF',exact:true}).click();
    const download=await downloadEvent;
    assert(download.suggestedFilename().endsWith('.pdf'));
    assert.equal(await download.failure(),null);
    await page.getByRole('link',{name:'Printer-friendly view',exact:true}).click();
    await page.getByRole('button',{name:'Print / Save as PDF',exact:true}).click();
    assert.equal(await page.evaluate(()=>window.__printCalls),1);
  }
  assert.deepEqual(errors,[]);
  await context.close();
}finally{await browser.close();}
await writeFile(new URL('.evidence/expanded-legal-live-check.json',root),JSON.stringify({origin,checkedAt:new Date().toISOString(),results,printAndDownload:'passed'},null,2)+'\n');
console.log(`Verified ${results.length} deployed pages/assets against the local build; PDF headers, real print/download controls, redirects, security headers and private-path exclusions passed.`);
