import { mkdir, writeFile } from 'node:fs/promises';

const sites=[
  {id:'digifender',host:'digifender.com',www:true},
  {id:'whumpo',host:'whumpo.com',www:true,redirectProbe:true},
  {id:'chapelcloud',host:'chapel.cloud',www:true,redirectProbe:true},
  {id:'openhost',host:'openhost.pro',www:true,redirectProbe:301,wwwRedirectProbe:true},
  {id:'labthrift',host:'labthrift.com',www:true},
  {id:'labthrift-plan',host:'plan.labthrift.com'},
  {id:'byterush',host:'app.labthrift.com'},
];

async function follow(start) {
  const chain=[];
  let url=start;
  try {
    for(let step=0;step<6;step++) {
      const response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(10000)});
      const location=response.headers.get('location');
      const hop={url,status:response.status,location};
      if(response.status===200) {
        const html=await response.text();
        hop.title=html.match(/<title>([^<]*)<\/title>/i)?.[1]??null;
        hop.canonical=html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1]??null;
      }
      chain.push(hop);
      if(response.status<300||response.status>=400||!location)break;
      url=new URL(location,url).href;
    }
    return {start,chain};
  } catch(error) {
    return {start,chain,error:{message:String(error),code:error.cause?.code??null}};
  }
}

async function probePathAndQuery(host,{fromWww=false,status=308}={}) {
  const path='/__portfolio_redirect_probe__/nested?from=digifender';
  const requested=`${fromWww?'https://www.':'http://'}${host}${path}`;
  const expected=`https://${host}${path}`;
  try {
    const response=await fetch(requested,{redirect:'manual',signal:AbortSignal.timeout(10000)});
    const location=response.headers.get('location');
    const resolved=location?new URL(location,requested).href:null;
    return {requested,expected,status:response.status,location,resolved,passed:response.status===status&&resolved===expected};
  } catch(error) {
    return {requested,expected,error:{message:String(error),code:error.cause?.code??null},passed:false};
  }
}

const report={checkedAt:new Date().toISOString(),sites:[],gaps:[]};
for(const site of sites) {
  const https=await follow(`https://${site.host}/`);
  const http=await follow(`http://${site.host}/`);
  const www=site.www?await follow(`https://www.${site.host}/`):null;
  const pathAndQuery=site.redirectProbe?await probePathAndQuery(site.host,{status:site.redirectProbe===true?308:site.redirectProbe}):null;
  const wwwPathAndQuery=site.wwwRedirectProbe?await probePathAndQuery(site.host,{fromWww:true}):null;
  const canonical=`https://${site.host}/`;
  const httpsReady=https.chain.at(-1)?.status===200&&https.chain.at(-1)?.url===canonical;
  const httpRedirects=http.chain[0]?.status>=300&&http.chain[0]?.status<400&&
    http.chain.at(-1)?.status===200&&http.chain.at(-1)?.url===canonical;
  report.sites.push({id:site.id,host:site.host,canonical,https,http,www,pathAndQuery,wwwPathAndQuery,httpsReady,httpRedirects});
  if(!httpsReady)report.gaps.push(`${site.id}: canonical HTTPS homepage unavailable`);
  if(!httpRedirects)report.gaps.push(`${site.id}: HTTP apex does not redirect to its HTTPS homepage`);
  if(httpRedirects&&pathAndQuery&&!pathAndQuery.passed)report.gaps.push(`${site.id}: HTTP apex does not preserve a non-root path and query with the expected redirect`);
  if(wwwPathAndQuery&&!wwwPathAndQuery.passed)report.gaps.push(`${site.id}: HTTPS www does not redirect to the apex with a non-root path and query`);
}

await mkdir(new URL('../.evidence/',import.meta.url),{recursive:true});
await writeFile(new URL('../.evidence/domain-entrypoints-live.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(`Checked ${report.sites.length} HTTPS/HTTP product entrypoints; ${report.gaps.length} redirect gaps.`);
for(const gap of report.gaps)console.log(`- ${gap}`);
if(report.gaps.length)process.exitCode=1;
