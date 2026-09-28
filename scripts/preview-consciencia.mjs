import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Local, synthetic review only. No repository-wide file serving or provider calls.
const root=path.resolve(import.meta.dirname,'..');
const fixture=JSON.parse(fs.readFileSync(path.join(os.tmpdir(),'consciencia-live-check.json'),'utf8'));
function sample() {
  let html=fs.readFileSync(path.join(root,'protected/consciencia/index.html'),'utf8');
  html=html.replace('/*__AUTH_CONTEXT__*/null/*__/AUTH_CONTEXT__*/',JSON.stringify({email:'preview@local.test',userId:'preview-local'}));
  html=html.replace('jaya:arquitetura-consciencia:v1','jaya:consciencia:synthetic-preview:v1');
  const marker=/intro\(\);\s*<\/script>/;
  if(!marker.test(html))throw Error('Missing page initializer');
  const literal=value=>JSON.stringify(value).replace(/</g,'\\u003c');
  return html.replace(marker,()=>`answers=${literal(fixture.answers)}; finished=true; aiCache={snapshot:snapshot(),analysis:${literal(fixture.analysis)}}; result();\n</script>`);
}
http.createServer((req,res)=>{
  if(!['localhost:4192','127.0.0.1:4192'].includes(req.headers.host)){res.writeHead(403);return res.end()}
  if(req.method!=='GET'){res.writeHead(405);return res.end()}
  const url=new URL(req.url,'http://localhost:4192');
  if(url.pathname==='/exemplo'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});return res.end(sample())}
  if(!/^\/zona\/arte\/[a-z0-9-]+\.webp$/.test(url.pathname)){res.writeHead(404);return res.end()}
  const file=path.join(root,'public',url.pathname);
  if(!fs.existsSync(file)){res.writeHead(404);return res.end()}
  res.writeHead(200,{'Content-Type':'image/webp','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
}).listen(4192,'127.0.0.1',()=>console.log('Synthetic sample: http://localhost:4192/exemplo'));
