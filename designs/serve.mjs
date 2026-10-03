import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import worker from './worker.js';
const here=path.dirname(fileURLToPath(import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ttf':'font/ttf','.pdf':'application/pdf','.txt':'text/plain; charset=utf-8','.xml':'application/xml'};
for(const [variant,port] of [['signal',8793],['blueprint',8794]]) {
 const root=path.join(here,'releases',variant,'public');
 const server=http.createServer(async(req,res)=>{
  try {
   const url=new URL(req.url,`http://localhost:${port}`);
   const response=await worker.fetch(new Request(url,{method:req.method}),{ASSETS:{fetch:async(request)=>{
    const pathname=decodeURIComponent(new URL(request.url).pathname);
    const file=path.resolve(root,'.'+pathname+(pathname==='/'?'index.html':''));
    if(!file.startsWith(root+path.sep))return new Response('Not found',{status:404});
    for(const candidate of [file,file+'.html']) {
      try {const content=await readFile(candidate);return new Response(content,{headers:{'Content-Type':types[path.extname(candidate)]||'application/octet-stream'}});}catch(error){if(!['ENOENT','EISDIR','ENOTDIR'].includes(error.code))throw error;}
    }
    return new Response(await readFile(path.join(root,'404.html')),{status:404,headers:{'Content-Type':types['.html']}});
   }}});
   response.headers.set('X-Robots-Tag','noindex');
   res.writeHead(response.status,Object.fromEntries(response.headers));
   if(req.method==='HEAD')res.end();else res.end(Buffer.from(await response.arrayBuffer()));
  }catch(error){res.writeHead(500,{'Content-Type':'text/plain'});res.end('Preview error');console.error(error);}
 });
 server.listen(port,'127.0.0.1',()=>console.log(`${variant}: http://localhost:${port}`));
}
