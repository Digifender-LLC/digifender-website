import { readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { homeContent } from '../src/home.mjs';
import { groups, policies } from '../src/legal-documents.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const origin = 'https://digifender.com';
const manifest = [];
const documents = [];
const escape = text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sectionId = text=>text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

function inline(text, policy) {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g).map(part=>{
    if (part.startsWith('**')&&part.endsWith('**')) return `<strong>${escape(part.slice(2,-2))}</strong>`;
    if (part.startsWith('`')&&part.endsWith('`')) return `<code>${escape(part.slice(1,-1))}</code>`;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const match=policies.find(p=>p.group===policy.group&&p.file===link[2]);
      const href=match?.route||link[2];
      if (!/^(https:\/\/|mailto:legal@digifender\.com$|tel:\+18336339838$|\/(?!\/))/.test(href)) throw Error(`Unsupported legal link in ${policy.file}: ${href}`);
      return `<a href="${escape(href)}">${escape(link[1])}</a>`;
    }
    return escape(part);
  }).join('');
}

function markdown(text, policy) {
  const sections=[];
  const renderedBlocks=[];
  const html=text.trim().split(/\n\s*\n/).slice(1).map(block=>{
    if(block.startsWith('## ')) {
      const label=block.slice(3).trim(); const id=sectionId(label);
      if(sections.some(s=>s.id===id))throw Error('Duplicate heading '+id);
      sections.push({label,id});renderedBlocks.push({type:'h2',html:escape(label)});return `<h2 id="${id}">${escape(label)}</h2>`;
    }
    if(block.startsWith('- ')){const items=block.split(/\n(?=- )/).map(item=>inline(item.slice(2).replace(/\n/g,' '),policy));renderedBlocks.push({type:'list',items});return '<ul>'+items.map(item=>`<li>${item}</li>`).join('')+'</ul>';}
    if(/^(#{1,6} |\|)/.test(block))throw Error('Unsupported Markdown block in '+policy.file);
    const rendered=inline(block.replace(/\n/g,' '),policy);
    renderedBlocks.push({type:'paragraph',html:rendered});
    return `<p>${rendered}</p>`;
  }).join('\n');
  return {html,sections,blocks:renderedBlocks};
}

function layout(title, description, route, content, noindex=false) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(title)} · Digifender</title><meta name="description" content="${escape(description)}">
<link rel="canonical" href="${origin}${route}"><meta name="robots" content="${noindex?'noindex,follow':'index,follow'}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Digifender"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${origin}${route}">
<meta property="og:image" content="${origin}/social.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Digifender — Software. Systems. Built around you."><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${origin}/social.png">
<meta name="theme-color" content="#09172B"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="stylesheet" href="/styles.css"></head>
<body><a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><div class="shell"><a class="brand" href="/" aria-label="Digifender home"><img class="brand-logo" src="/brand/digifender-horizontal-glacier.svg" width="256" height="76" alt="Digifender"></a><nav aria-label="Main"><a href="/#about">Company</a><a href="/#products">Our work</a><a href="/#contact">Partner with us</a><a href="/legal"${route.startsWith('/legal')?' aria-current="'+(route==='/legal'?'page':'true')+'"':''}>Legal hub</a></nav></div></header>
<main id="main">${content}</main>
<footer class="site-footer"><div class="shell"><div class="footer-top"><a class="brand" href="/" aria-label="Digifender home"><img class="brand-logo" src="/brand/digifender-horizontal-glacier.svg" width="256" height="76" alt="Digifender"></a><p>Thoughtful software. Room to build.</p></div><div class="footer-grid"><div><p>Digifender LLC</p><address>9169 W State St #884<br>Garden City, ID 83714<br>United States</address></div><div><p>Get in touch</p><a href="mailto:hello@digifender.com">hello@digifender.com</a><br><a href="tel:+18336339838">(833) 633-9838</a></div><nav aria-label="Footer"><a href="/#contact">Partner with us</a><a href="/legal">Legal hub</a><a href="/legal/terms">Draft website terms</a><a href="/legal/privacy">Website privacy</a><a href="/legal/copyright">Copyright &amp; contact</a></nav></div><div class="footer-bottom"><span>© 2026 Digifender.</span><span>Built with <span role="img" aria-label="love">♥</span></span></div></div></footer></body></html>`;
}

async function page(route,title,description,content,noindex=false) {
  const destination=path.join(dist,route==='/'?'index.html':route.slice(1)+'.html');
  await mkdir(path.dirname(destination),{recursive:true});
  await writeFile(destination,layout(title,description,route,content,noindex));
  manifest.push({route,title,index:!noindex});
}
const cards = list=>`<div class="legal-grid">${list.map(p=>`<a class="legal-card" href="${p.route}"><span class="eyebrow">${p.draft?'Draft for review':p.slug==='privacy'?'Website notice':'Company contact'}</span><h3>${p.title}<span aria-hidden="true"> ↗</span></h3><p>${p.summary}</p></a>`).join('')}</div>`;
const draftNotice=`<aside class="notice" aria-label="Draft policy status"><strong>Drafts for review - not yet adopted.</strong><p>Each document states its scope and status. Publication and downloading do not adopt an agreement or complete the operational work described in it.</p></aside>`;
const groupCards=group=>cards(policies.filter(p=>p.groupId===group.id));
const productSiteLinks=group=>`<nav class="document-actions" aria-label="${escape(group.name)} sites">${group.productLinks.map(link=>`<a href="${escape(link.href)}">${escape(link.label)}</a>`).join('')}</nav>`;
const actions=policy=>`<nav class="document-actions" aria-label="Document copies"><a href="${policy.pdfRoute}" download>Download PDF</a><a href="${policy.printRoute}">Printer-friendly view</a></nav>`;

async function printPage(policy,html,sha256) {
  const canonical=origin+policy.route;
  const draft=policy.draft?'<aside class="notice"><strong>Draft for review - not yet adopted</strong><p>Effective date remains pending. This copy is provided for review.</p></aside>':'';
  const output=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(policy.group+' '+policy.title)} - Print copy</title><meta name="robots" content="noindex,follow"><link rel="canonical" href="${canonical}"><link rel="stylesheet" href="/legal-print.css"><script defer src="/legal-actions.js"></script></head><body class="print-page"><div class="print-toolbar"><a href="${policy.route}">← Back to policy</a><button type="button" data-print hidden>Print / Save as PDF</button><p>Choose Print, then Save as PDF or your printer. You can also use your browser’s Print menu.</p><a href="${policy.pdfRoute}" download>Download PDF</a></div><main class="print-document"><header class="print-document-header"><a class="print-brand" href="/" aria-label="Digifender home"><img src="/brand/digifender-horizontal-ink.svg" width="232" height="69" alt="Digifender"></a><p class="eyebrow">${escape(policy.group)} / Legal</p><h1>${escape(policy.title)}</h1><p class="print-status">${policy.draft?'Draft for review':'Company notice'} · Document revision ${sha256.slice(0,12)}</p></header>${draft}<article class="print-body" aria-label="${escape(policy.title)}">${html}</article><footer class="print-document-footer"><p>Published by Digifender LLC · Document revision <code>${sha256.slice(0,12)}</code></p><p>Web version: <a href="${canonical}">${canonical}</a></p></footer></main></body></html>`;
  const destination=path.join(dist,policy.printRoute.slice(1)+'.html');
  await mkdir(path.dirname(destination),{recursive:true});await writeFile(destination,output);
  manifest.push({route:policy.printRoute,title:policy.group+' '+policy.title+' - Print copy',index:false,kind:'print',canonical:policy.route});
}

await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
await cp(path.join(root,'public'),dist,{recursive:true});
await page('/','Custom software and cloud solutions','Digifender builds custom software, cloud infrastructure and connected systems. Explore our work and partner with us on your next project.',homeContent);
await page('/legal','Legal hub','Company, Whumpo, ChapelCloud, LabThrift and OpenHost legal documents, with PDF downloads and printer-friendly copies.',`<div class="shell"><header class="page-intro"><p class="eyebrow">DIGIFENDER / LEGAL</p><h1>Clear policies.<br>One place.</h1><p class="lede">Find the documents for the company or product you use. Every document includes a PDF download and a printer-friendly view.</p></header><nav class="document-actions" aria-label="Legal collections">${groups.map(g=>`<a href="#${g.id}-policies">${g.name}</a>`).join('')}</nav>${groups.map(group=>`<section class="legal-section" aria-labelledby="${group.id}-policies"><h2 id="${group.id}-policies">${group.name==='Digifender'?'The company website':group.name}</h2><p>${group.description} ${group.id==='digifender'?'':`<a href="${group.route}">View ${group.name} collection</a>.`}</p>${group.id==='digifender'?'':draftNotice}${groupCards(group)}</section>`).join('')}<section class="contact-note"><h2>Need to reach us?</h2><p>For privacy, copyright or other legal questions, contact <a href="mailto:legal@digifender.com">legal@digifender.com</a>.</p></section></div>`);
for(const group of groups.filter(g=>g.id!=='digifender')) {
  await page(group.route,group.name+' policies',group.description,`<div class="shell"><header class="page-intro"><p class="breadcrumbs"><a href="/legal">Legal hub</a> / ${group.name}</p><p class="eyebrow">PRODUCT POLICIES</p><h1>${group.name}.</h1><p class="lede">${group.scope}</p></header>${draftNotice}${productSiteLinks(group)}${groupCards(group)}<section class="contact-note"><p>For copyright concerns and company contact information, use <a href="/legal/copyright">Copyright and Legal Contact</a>. The <a href="/legal/privacy">company website privacy notice</a> covers digifender.com.</p></section></div>`);
}
for(const policy of policies) {
  const text=await readFile(policy.source,'utf8');
  const {html,sections,blocks}=markdown(text,policy);
  const sha256=createHash('sha256').update(text).digest('hex');
  const draft=policy.draft?`<aside class="notice"><strong>Draft for review · not yet adopted</strong><p>This document is published for review. Its effective date remains pending.</p></aside>`:'';
  await page(policy.route,`${policy.group} ${policy.title}`,policy.summary,`<div class="shell"><header class="page-intro"><p class="breadcrumbs"><a href="/legal">Legal hub</a> / ${policy.groupId==='digifender'?'Digifender':`<a href="${policy.groupRoute}">${policy.group}</a>`}</p><p class="eyebrow">${policy.group} / ${policy.draft?'DRAFT FOR REVIEW':'COMPANY WEBSITE'}</p><h1>${policy.title}</h1><p class="lede">${policy.summary}</p></header>${actions(policy)}${draft}<div class="policy-layout"><aside class="policy-nav"><nav aria-label="On this page"><p class="eyebrow">On this page</p>${sections.map(s=>`<a href="#${s.id}">${escape(s.label)}</a>`).join('')}</nav><a class="text-link" href="/legal">← All policies</a></aside><article class="policy-body" aria-label="${policy.title}">${html}<p class="policy-meta">Published by Digifender · Document revision ${sha256.slice(0,12)} · <a href="/legal/copyright">Contact us</a></p></article></div></div>`,policy.draft);
  Object.assign(manifest.at(-1),{source:path.relative(root,policy.source),sha256,pdfRoute:policy.pdfRoute,printRoute:policy.printRoute,kind:'document',draft:policy.draft});
  documents.push({...policy,source:path.relative(root,policy.source),sha256,canonical:origin+policy.route,blocks});
  await printPage(policy,html,sha256);
}
await page('/404','Page not found','This page could not be found. Return to Digifender or browse the legal hub.',`<div class="shell"><header class="page-intro"><p class="eyebrow">404 / PAGE NOT FOUND</p><h1>A little off course.</h1><p class="lede">We couldn’t find that page. <a href="/">Return home</a> or <a href="/legal">browse the legal hub</a>.</p></header></div>`,true);
await writeFile(path.join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${manifest.filter(p=>p.index).map(p=>`<url><loc>${origin}${p.route}</loc></url>`).join('')}</urlset>`);
await writeFile(path.join(dist,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await mkdir(path.join(root,'.evidence'),{recursive:true});
await writeFile(path.join(root,'.evidence','documents.json'),JSON.stringify(documents,null,2)+'\n');
await writeFile(path.join(root,'.evidence','build-manifest.json'),JSON.stringify({builtAt:new Date().toISOString(),pages:manifest},null,2)+'\n');
console.log(`Built ${manifest.length} static pages. Only dist/ will be deployed.`);
