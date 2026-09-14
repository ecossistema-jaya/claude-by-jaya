// Explicit local-only preview. Production authentication stays in Next middleware.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {fileURLToPath} from 'node:url';
import {prepareMap,mapPrompt,parseMap,MapError} from '../app/lib/mapa.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
for(const name of ['.env.local','.env']){const p=path.join(root,name);if(fs.existsSync(p))process.loadEnvFile(p)}
const code=ts.transpileModule(fs.readFileSync(path.join(root,'app/lib/gemini.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {analisar,excedeu}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const allowed=new Set(['http://localhost:4180','http://127.0.0.1:4180']);
const server=http.createServer(async(req,res)=>{
  const origin='http://'+req.headers.host;
  const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data))};
  if(!allowed.has(origin))return send(403,{error:'Host inválido.'});
  const url=new URL(req.url,origin);
  if(url.pathname==='/api/mapa/analyze'){
    if(req.method!=='POST'||!allowed.has(req.headers.origin)||!req.headers['content-type']?.startsWith('application/json'))return send(403,{error:'Origem inválida.'});
    if(excedeu('preview','local',12))return send(429,{error:'Limite de testes atingido. Aguarde uma hora.'});
    try{
      const chunks=[];let size=0;
      for await(const chunk of req){size+=chunk.length;if(size>32768)throw new MapError('Respostas longas demais.',413);chunks.push(chunk)}
      let body;try{body=JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{throw new MapError('Respostas inválidas.',400)}
      const input=prepareMap(body);
      const result=await analisar(mapPrompt(input),AbortSignal.timeout(50000));
      if(!result.ok)return send(result.erro==='limite'?429:502,{error:'Não foi possível consultar a IA agora. Suas respostas continuam salvas.'});
      return send(200,{analysis:parseMap(result.text,input)});
    }catch(e){if(e.validation)console.warn('map validation:',e.validation);return send(e instanceof MapError?e.status:502,{error:e instanceof MapError?e.message:'A análise não terminou. Tente novamente.'})}
  }
  // Serve only the prototype, not the repository or environment files.
  if(req.method==='GET' && url.pathname==='/mapa-autoconhecimento-v0.html'){
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
    return fs.createReadStream(path.join(root,'docs/mapa-autoconhecimento-v0.html')).pipe(res);
  }
  return send(404,{error:'Não encontrado.'});
});
server.requestTimeout=60000;
server.listen(4180,'127.0.0.1',()=>console.log('Mapa com API local: http://localhost:4180/mapa-autoconhecimento-v0.html'));
