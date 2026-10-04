import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const whumpoSource=path.resolve(root,process.env.WHUMPO_LEGAL_SOURCE||'vendor/whumpo-legal-published');
export const groups=[
  {id:'digifender',name:'Digifender',route:'/legal',description:'Notices for digifender.com and company correspondence.'},
  {id:'whumpo',name:'Whumpo',route:'/legal/whumpo',description:'Accounts, AI-assisted workspaces and hosted services.',scope:'These product drafts cover Whumpo accounts, AI tools and hosted services. They have not yet been adopted.',productLinks:[{label:'Visit Whumpo',href:'https://whumpo.com/'}]},
  {id:'chapelcloud',name:'ChapelCloud',route:'/legal/chapelcloud',description:'The church technology website, inquiries and the boundary with contracted services.',scope:'These drafts cover ChapelCloud’s public website and inquiries. Church software, hardware and managed IT engagements require their own scoped agreements.',productLinks:[{label:'Visit ChapelCloud',href:'https://chapel.cloud/'}]},
  {id:'labthrift',name:'LabThrift',route:'/legal/labthrift',description:'The guides, Lab plan notebook and ByteRush learning app.',scope:'These drafts distinguish LabThrift’s guides, the Lab plan notebook and the ByteRush learning app. Provider and operational details remain subject to confirmation.',productLinks:[{label:'Visit LabThrift',href:'https://labthrift.com/'},{label:'Open Lab plan',href:'https://plan.labthrift.com/'},{label:'Open ByteRush',href:'https://app.labthrift.com/'}]},
  {id:'openhost',name:'OpenHost',route:'/legal/openhost',description:'Planned hosting, customer workloads and AI-assisted infrastructure operations.',scope:'The OpenHost public preview is live, while customer hosting, sign-in, billing and AI actions are unavailable. These proposed terms and notices are drafts for review, not evidence of activated services or provider agreements.',productLinks:[{label:'Visit OpenHost preview',href:'https://openhost.pro/'}]},
];

const company=[
  {slug:'privacy',file:'privacy.md',title:'Website Privacy Notice',summary:'Information handled by this company website and in correspondence.',draft:false},
  {slug:'terms',file:'website-terms.md',title:'Website Terms',summary:'Proposed terms for browsing this company website.',draft:true},
  {slug:'copyright',file:'copyright.md',title:'Copyright and Legal Contact',summary:'Report a concern or contact Digifender about its products.',draft:false},
];
const whumpo=[
  {slug:'terms',file:'terms-of-service.md',title:'Terms of Service',summary:'Your account, content, AI assistance and the private preview.'},
  {slug:'privacy',file:'privacy-policy.md',title:'Privacy Policy',summary:'Information, AI processing, retention and your choices.'},
  {slug:'acceptable-use',file:'acceptable-use.md',title:'Acceptable Use Policy',summary:'Content rules, responsible use and reporting concerns.'},
  {slug:'cookies',file:'cookies.md',title:'Cookie Notice',summary:'Account cookies, browser storage and third-party technologies.'},
  {slug:'copyright',file:'copyright.md',title:'Copyright and Abuse Policy',summary:'Proposed copyright notice and counter-notice procedures.'},
  {slug:'providers',file:'service-providers.md',title:'Service Providers',summary:'Infrastructure, AI processing and optional connections.'},
];
const other={
  openhost:[
    {slug:'terms',file:'terms.md',title:'Terms of Service',summary:'Proposed account, hosting, billing, AI authority and cancellation terms.'},
    {slug:'privacy',file:'privacy.md',title:'Privacy Policy',summary:'Planned account, application, AI and provider processing; retention and rights.'},
    {slug:'acceptable-use',file:'acceptable-use.md',title:'Acceptable Use Policy',summary:'Rules for workloads, authorized testing, automation and abuse reports.'},
    {slug:'cookies',file:'cookies.md',title:'Cookie Notice',summary:'The legal hub, developing account controls and the pending live storage inventory.'},
    {slug:'copyright',file:'copyright.md',title:'Copyright and Abuse Policy',summary:'Proposed reporting and counter-notice procedures; agent designation remains pending.'},
    {slug:'providers',file:'providers.md',title:'Service Providers',summary:'Planned infrastructure and supporting integrations, distinct from live processors.'},
  ],
  chapelcloud:[
    {slug:'terms',file:'terms.md',title:'Terms of Service',summary:'Website use, inquiries and separately agreed church technology services.'},
    {slug:'privacy',file:'privacy.md',title:'Privacy Policy',summary:'Website requests, correspondence and service-specific data responsibilities.'},
    {slug:'cookies',file:'cookies.md',title:'Cookie Notice',summary:'Observed website storage, delivery and security technologies.'},
  ],
  labthrift:[
    {slug:'terms',file:'terms.md',title:'Terms of Service',summary:'Educational guides, planning tools and the ByteRush learning app.'},
    {slug:'privacy',file:'privacy.md',title:'Privacy Policy',summary:'Passkeys, notebook data, learning progress and technical information.'},
    {slug:'cookies',file:'cookies.md',title:'Cookie and Storage Notice',summary:'Browser preferences, local app data and Cloudflare technologies.'},
  ],
};
export const policies=groups.flatMap(group=>{
  const list=group.id==='digifender'?company:group.id==='whumpo'?whumpo:other[group.id];
  return list.map(item=>{
    const route=`${group.route}/${item.slug}`;
    const base=group.id==='whumpo'?whumpoSource:path.join(root,'content',group.id==='digifender'?'':group.id);
    return {...item,group:group.name,groupId:group.id,groupRoute:group.route,route,
      pdfRoute:route+'.pdf',printRoute:route+'/print',draft:item.draft??true,source:path.join(base,item.file)};
  });
});
