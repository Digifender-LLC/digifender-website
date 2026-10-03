import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const origin=process.env.SITE_URL||'http://127.0.0.1:8791';
const {pages}=JSON.parse(await readFile(new URL('../.evidence/build-manifest.json',import.meta.url),'utf8'));
const evidence=new URL('../.evidence/',import.meta.url);
await mkdir(evidence,{recursive:true});
const browser=await chromium.launch({headless:true});
const results=[];
try {
  for(const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
    const context=await browser.newContext({viewport,bypassCSP:true});
    const page=await context.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    for(const item of pages.filter(p=>p.route!=='/404')) {
      const response=await page.goto(origin+item.route,{waitUntil:'networkidle'});
      assert.equal(response.status(),200,item.route);
      assert(response.headers()['content-security-policy']?.includes("frame-ancestors 'none'"));
      assert.equal(await page.locator('h1').count(),1);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Horizontal overflow ${item.route} ${viewport.width}`);
      const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      assert.deepEqual(audit.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),[],`Accessibility ${item.route} ${viewport.width}`);
      results.push({route:item.route,width:viewport.width,status:response.status(),accessibility:'passed'});
      if(['/','/legal','/legal/chapelcloud/privacy','/legal/labthrift/privacy','/legal/labthrift/privacy/print'].includes(item.route))await page.screenshot({path:fileURLToPath(new URL(`site-${item.route==='/'?'home':item.route.replaceAll('/','-').slice(1)}-${viewport.width}.png`,evidence)),fullPage:true});
    }
    await page.goto(origin+'/');
    await page.getByRole('navigation',{name:'Main',exact:true}).getByRole('link',{name:'Legal hub'}).click();
    assert.equal(new URL(page.url()).pathname,'/legal');
    const missing=await page.goto(origin+'/this-page-does-not-exist');
    assert.equal(missing.status(),404);
    assert.equal(await page.getByRole('heading',{level:1}).innerText(),'A little off course.');
    assert.deepEqual(errors,[],'No browser runtime errors');
    await context.close();
    console.log(`Page and accessibility checks passed at ${viewport.width}px.`);
  }
  const context=await browser.newContext();
  const page=await context.newPage();
  const external=[];
  page.on('request',r=>{if(new URL(r.url()).origin!==new URL(origin).origin)external.push(r.url())});
  await page.goto(origin,{waitUntil:'networkidle'});
  assert.deepEqual(external,[],'Homepage makes no third-party browser requests');
  assert.deepEqual(await context.cookies(),[],'No cookies on ordinary homepage visit');
  await context.close();
  // Exercise printing with the real production CSP, including progressive enhancement.
  const printContext=await browser.newContext();
  const printPage=await printContext.newPage();
  await printPage.addInitScript(()=>{window.__printCalls=0;window.print=()=>{window.__printCalls++;};});
  for(const document of pages.filter(p=>p.kind==='document')) {
    await printPage.goto(origin+document.route);
    const webText=await printPage.locator('.policy-body').evaluate(el=>[...el.children].filter(n=>!n.classList.contains('policy-meta')).map(n=>n.textContent).join(' '));
    await printPage.getByRole('link',{name:'Printer-friendly view',exact:true}).click();
    assert.equal(new URL(printPage.url()).pathname,document.printRoute);
    const printText=await printPage.locator('.print-body').evaluate(el=>[...el.children].map(n=>n.textContent).join(' '));
    assert.equal(printText,webText,'Print copy preserves full policy text');
    assert.equal(await printPage.evaluate(()=>window.__printCalls),0,'No automatic print dialog');
    await printPage.getByRole('button',{name:'Print / Save as PDF',exact:true}).click();
    assert.equal(await printPage.evaluate(()=>window.__printCalls),1);
    await printPage.emulateMedia({media:'print'});
    assert.equal(await printPage.locator('.print-toolbar').evaluate(el=>getComputedStyle(el).display),'none');
    await printPage.emulateMedia({media:'screen'});
    const download=await printContext.request.get(origin+document.pdfRoute);
    assert.equal(download.status(),200);
    assert(download.headers()['content-type'].startsWith('application/pdf'));
    assert(download.headers()['content-disposition'].startsWith('attachment;'));
    assert.equal(download.headers()['x-robots-tag'],'noindex');
    assert((await download.body()).equals(await readFile(new URL('../dist'+document.pdfRoute,import.meta.url))),'Downloaded PDF matches built copy');
  }
  const pendingDownload=printPage.waitForEvent('download');
  await printPage.getByRole('link',{name:'Download PDF',exact:true}).click();
  const downloaded=await pendingDownload;
  assert(downloaded.suggestedFilename().endsWith('.pdf'));
  await downloaded.saveAs(fileURLToPath(new URL('browser-download.pdf',evidence)));
  await printContext.close();
  const noJS=await browser.newContext({javaScriptEnabled:false});
  const fallback=await noJS.newPage();await fallback.goto(origin+'/legal/labthrift/privacy/print');
  assert.equal(await fallback.locator('button[data-print]').isVisible(),false);
  assert((await fallback.locator('.print-toolbar').innerText()).includes('browser’s Print menu'));
  await noJS.close();
} finally { await browser.close(); }
await writeFile(new URL('browser-check.json',evidence),JSON.stringify({origin,checkedAt:new Date().toISOString(),results},null,2)+'\n');
console.log(`Browser checks passed on ${results.length} desktop/mobile page visits, all PDF downloads and print controls, text parity, no-JS fallback, navigation, 404, accessibility and cookie-free ordinary browsing.`);
