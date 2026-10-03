import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { groups, policies } from '../src/legal-documents.mjs';

const company='https://digifender.com';
const products=[
  {id:'whumpo',url:'https://whumpo.com/',links:['terms','privacy','cookies'],legalContact:true},
  {id:'whumpo-signup',url:'https://whumpo.com/workspace?signup=true',group:'whumpo',links:['terms','privacy','cookies'],legalContact:true,ready:'A little hello. A big beginning.'},
  {id:'whumpo-signin',url:'https://whumpo.com/workspace?signup=false',group:'whumpo',links:['terms','privacy','cookies'],legalContact:true,ready:'Welcome back.'},
  {id:'chapelcloud',url:'https://chapel.cloud/',links:['terms','privacy','cookies']},
  {id:'labthrift',url:'https://labthrift.com/',links:['terms','privacy','cookies']},
  {id:'labthrift-plan',url:'https://plan.labthrift.com/',group:'labthrift',links:['terms','privacy','cookies']},
  {id:'byterush',url:'https://app.labthrift.com/',group:'labthrift',links:['terms','privacy','cookies'],ready:'ByteRush'},
];
const secondaryFamilies=[
  {id:'chapelcloud-services',origin:'https://chapel.cloud',group:'chapelcloud',paths:[
    '/software/church-management','/software/giving','/software/communications','/software/volunteer',
    '/hardware/sanctuary-av','/hardware/networking','/hardware/workstations','/hardware/displays',
    '/managed/monitoring','/managed/help-desk','/managed/cybersecurity','/managed/backups',
  ]},
  {id:'labthrift-content',origin:'https://labthrift.com',group:'labthrift',paths:[
    '/about','/guides/','/guides/first-weekend',
  ]},
];

const report={checkedAt:new Date().toISOString(),company,linkScope:'visible rendered anchors, including activated company product tabs',companyLinks:{},companyPolicyLinks:{},companyContacts:{},planned:{},companyCollections:[],legal:[],products:[],secondaryPages:[],gaps:[]};
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const inspect=async (url,ready)=>{
    const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:20000});
    await page.locator('body').waitFor({state:'visible'});
    if(ready)await page.getByRole('heading',{name:ready,exact:true}).waitFor({state:'visible',timeout:20000});
    const anchors=await page.locator('a[href]:visible').evaluateAll(links=>links.map(link=>({href:link.href,label:(link.innerText||'').trim()})));
    return {status:response?.status()??null,title:await page.title(),text:await page.locator('body').innerText(),anchors,hrefs:anchors.map(link=>link.href),footerHrefs:await page.locator('footer:visible a[href]:visible').evaluateAll(links=>links.map(link=>link.href)),footerText:(await page.locator('footer:visible').allInnerTexts()).join(' ')};
  };
  const draftLabeled=(anchors,url)=>anchors.some(link=>link.href===url&&/\bdraft\b/i.test(link.label));
  const companyPage=await inspect(company+'/');
  const companyPanels={};
  for(const product of products.filter(item=>!item.group)) {
    const tab=page.locator('#tab-'+product.id);
    await tab.click();
    const selected=await tab.getAttribute('aria-selected')==='true';
    const hrefs=await page.locator(`#product-${product.id} a[href]:visible`).evaluateAll(links=>links.map(link=>link.href));
    companyPanels[product.id]={selected,hrefs};
    report.companyLinks[product.id]=selected&&hrefs.includes(product.url);
    report.companyPolicyLinks[product.id]=selected&&hrefs.includes(`${company}/legal/${product.id}`);
    if(!report.companyLinks[product.id])report.gaps.push(`Company homepage ${product.id} panel lacks a visible product link`);
    if(!report.companyPolicyLinks[product.id])report.gaps.push(`Company homepage ${product.id} panel lacks a visible draft-policy link`);
  }
  const openhostTab=page.locator('#tab-openhost');
  await openhostTab.click();
  const openhostPanel=page.locator('#product-openhost');
  const openhostText=await openhostPanel.innerText();
  const openhostHrefs=await openhostPanel.locator('a[href]:visible').evaluateAll(links=>links.map(link=>link.href));
  report.planned.openhost={selected:await openhostTab.getAttribute('aria-selected')==='true',developmentLabel:/in development/i.test(openhostText),launchPendingLabel:/public launch pending/i.test(openhostText),inquiry:openhostHrefs.includes('mailto:hello@digifender.com?subject=OpenHost%20inquiry'),liveDomainLink:openhostHrefs.some(href=>/^https?:\/\/(?:www\.)?openhost\.pro(?:\/|$)/i.test(href))};
  if(!report.planned.openhost.selected||!report.planned.openhost.developmentLabel||!report.planned.openhost.launchPendingLabel||!report.planned.openhost.inquiry||!report.planned.openhost.liveDomainLink)report.gaps.push('Company OpenHost panel lacks the live public preview link, development status or company inquiry route');
  const openhostSite=await inspect('https://openhost.pro/');
  const websitePrivacy=await inspect(company+'/legal/privacy');
  report.planned.openhost.publicPreview={status:openhostSite.status,serviceUnavailable:/hosting, payments, and AI actions are not available yet/i.test(openhostSite.text),companyAttribution:openhostSite.footerHrefs.includes(company+'/'),inquiry:openhostSite.anchors.some(link=>link.href==='mailto:hello@digifender.com?subject=OpenHost%20inquiry'&&/contact digifender/i.test(link.label)),legalContact:openhostSite.anchors.some(link=>link.href==='mailto:legal@digifender.com'&&/legal contact/i.test(link.label)),websitePrivacyLink:openhostSite.hrefs.includes(company+'/legal/privacy'),websitePrivacyScope:websitePrivacy.status===200&&websitePrivacy.text.includes('openhost.pro'),draftTerms:draftLabeled(openhostSite.anchors,company+'/legal/openhost/terms'),draftPrivacy:draftLabeled(openhostSite.anchors,company+'/legal/openhost/privacy'),draftCookies:draftLabeled(openhostSite.anchors,company+'/legal/openhost/cookies'),collection:openhostSite.hrefs.includes(company+'/legal/openhost')};
  if(report.planned.openhost.publicPreview.status!==200||Object.values(report.planned.openhost.publicPreview).some(value=>value===false))report.gaps.push('OpenHost public preview lacks an unavailable-service notice, Digifender attribution, company inquiry, legal contact, website privacy or direct labeled draft policies');
  const companyLegal=await inspect(company+'/legal');
  report.companyContacts={
    inquiries:companyPage.hrefs.includes('mailto:hello@digifender.com'),
    legal:companyLegal.hrefs.includes('mailto:legal@digifender.com'),
    chapelcloudInquiry:companyPanels.chapelcloud.hrefs.includes('mailto:hello@digifender.com?subject=ChapelCloud%20inquiry'),
  };
  if(!report.companyContacts.inquiries)report.gaps.push('Company homepage lacks its inquiry email link');
  if(!report.companyContacts.legal)report.gaps.push('Company legal hub lacks its legal contact email link');
  if(!report.companyContacts.chapelcloudInquiry)report.gaps.push('Company ChapelCloud showcase lacks its direct inquiry link');
  report.companyLinks.websiteTerms=companyPage.footerHrefs.includes(company+'/legal/terms')&&companyPage.footerText.includes('Draft website terms');
  if(!report.companyLinks.websiteTerms)report.gaps.push('Company footer lacks a labeled draft website terms link');
  for(const group of groups.filter(item=>item.productLinks)) {
    const result=await inspect(company+group.route);
    const nav=page.getByRole('navigation',{name:group.name+' sites'});
    const navVisible=await nav.isVisible();
    const hrefs=await nav.locator('a[href]:visible').evaluateAll(links=>links.map(link=>link.href));
    const links=Object.fromEntries(group.productLinks.map(link=>[link.designHref||link.href,hrefs.includes(new URL(link.designHref||link.href,company).href)]));
    const draftVisible=result.text.includes('Drafts for review - not yet adopted.');
    report.companyCollections.push({id:group.id,route:group.route,status:result.status,navVisible,links,draftVisible});
    if(result.status!==200||!navVisible||!draftVisible||Object.values(links).some(value=>!value))report.gaps.push(`Company ${group.name} collection lacks a visible product return link or draft notice`);
  }
  for(const policy of policies) {
    const response=await fetch(company+policy.route,{signal:AbortSignal.timeout(15000)});
    const html=await response.text();
    const item={
      route:policy.route,status:response.status,source:policy.source,draft:policy.draft,
      groupVisible:html.includes(`<p class="eyebrow">${policy.group} / ${policy.draft?'DRAFT FOR REVIEW':'COMPANY WEBSITE'}</p>`),
      titleVisible:html.includes(`<h1>${policy.title}</h1>`),
      canonicalCorrect:html.includes(`<link rel="canonical" href="${company+policy.route}">`),
      draftVisible:policy.draft?html.includes('<strong>Draft for review · not yet adopted</strong>'):null,
      draftNoindex:policy.draft?html.includes('<meta name="robots" content="noindex,follow">'):null,
      legalContact:html.includes('href="mailto:legal@digifender.com"'),
      placeholderContact:/href="mailto:[^"]+\.(?:example|invalid|test)(?:\?|"|$)/i.test(html),
    };
    report.legal.push(item);
    if(response.status!==200||!item.groupVisible||!item.titleVisible||!item.canonicalCorrect||policy.draft&&(!item.draftVisible||!item.draftNoindex)||!item.legalContact||item.placeholderContact)report.gaps.push(`Legal page unavailable or product, title, canonical, draft status or contact mismatch: ${policy.route}`);
  }
  for(const product of products) {
    const group=product.group||product.id;
    try {
      const result=await inspect(product.url,product.ready);
      const expected=Object.fromEntries(product.links.map(slug=>[slug,`${company}/legal/${group}/${slug}`]));
      const links=Object.fromEntries(Object.entries(expected).map(([slug,url])=>[slug,result.hrefs.includes(url)]));
      const draftLabels=Object.fromEntries(Object.entries(expected).map(([slug,url])=>[slug,draftLabeled(result.anchors,url)]));
      const companyLink=result.hrefs.some(href=>href===company+'/'||href===company);
      const attribution=/digifender/i.test(result.text);
      const contactLinks=[...new Set(result.hrefs.filter(href=>href.startsWith('mailto:')))];
      const legalContact=contactLinks.includes('mailto:legal@digifender.com');
      const placeholderContacts=contactLinks.filter(href=>/@[^?]+\.(?:example|invalid|test)(?:\?|$)/i.test(href));
      const item={id:product.id,url:product.url,status:result.status,title:result.title,links,draftLabels,companyLink,attribution,contactLinks,legalContact,placeholderContacts};
      report.products.push(item);
      if(result.status!==200)report.gaps.push(`${product.id}: HTTP ${result.status}`);
      for(const [slug,present] of Object.entries(links))if(!present)report.gaps.push(`${product.id}: missing ${slug} link`);
      else if(!draftLabels[slug])report.gaps.push(`${product.id}: ${slug} link lacks a draft label`);
      if(!companyLink||!attribution)report.gaps.push(`${product.id}: missing Digifender link or attribution`);
      if(product.legalContact&&!legalContact)report.gaps.push(`${product.id}: missing legal contact link`);
      for(const href of placeholderContacts)report.gaps.push(`${product.id}: placeholder contact link ${href}`);
    } catch(error) {
      report.products.push({id:product.id,url:product.url,error:String(error)});
      report.gaps.push(`${product.id}: browser check failed`);
    }
  }
  for(const family of secondaryFamilies) {
    let missingConnections=0,placeholderContacts=0,unavailable=0;
    for(const path of family.paths) {
      const url=family.origin+path;
      try {
        const result=await inspect(url);
        const expected=['terms','privacy','cookies'].map(slug=>`${company}/legal/${family.group}/${slug}`);
        const legalLinks=expected.map(href=>result.hrefs.includes(href));
        const draftLabels=expected.map(href=>draftLabeled(result.anchors,href));
        const companyLink=result.hrefs.includes(company+'/')||result.hrefs.includes(company);
        const attribution=/digifender/i.test(result.text);
        const placeholders=[...new Set(result.hrefs.filter(href=>/^mailto:[^?]+\.(?:example|invalid|test)(?:\?|$)/i.test(href)))];
        const connected=legalLinks.every(Boolean)&&draftLabels.every(Boolean)&&companyLink&&attribution;
        report.secondaryPages.push({family:family.id,url,status:result.status,title:result.title,legalLinks,draftLabels,companyLink,attribution,placeholders});
        if(result.status!==200)unavailable++;
        if(!connected)missingConnections++;
        if(placeholders.length)placeholderContacts++;
      } catch(error) {
        unavailable++;
        report.secondaryPages.push({family:family.id,url,error:String(error)});
      }
    }
    if(unavailable)report.gaps.push(`${family.id}: ${unavailable}/${family.paths.length} pages unavailable or failed browser checks`);
    if(missingConnections)report.gaps.push(`${family.id}: ${missingConnections}/${family.paths.length} pages lack legal links or Digifender attribution`);
    if(placeholderContacts)report.gaps.push(`${family.id}: ${placeholderContacts}/${family.paths.length} pages expose placeholder email links`);
  }
  await page.close();
} finally {
  await browser.close();
}

const evidence=new URL('../.evidence/',import.meta.url);
await mkdir(evidence,{recursive:true});
await writeFile(new URL('portfolio-connections-live.json',evidence),JSON.stringify(report,null,2)+'\n');
console.log(`Checked ${report.legal.length} legal pages, ${report.products.length} primary product surfaces, the OpenHost preview and ${report.secondaryPages.length} secondary pages; ${report.gaps.length} open connection gaps.`);
for(const gap of report.gaps)console.log(`- ${gap}`);
if(report.gaps.length)process.exitCode=1;
