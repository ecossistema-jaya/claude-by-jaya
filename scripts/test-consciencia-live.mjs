import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import ts from 'typescript';
import questions from '../app/lib/consciencia-schema.mjs';

// Explicit synthetic integration test; never reads participant answers or registers a lead.
const origin=process.argv[2] || 'http://localhost:4191';
if(!['http://localhost:4191','http://127.0.0.1:4191'].includes(origin))throw Error('Local test only');
for(const file of ['.env.local','.env'])if(fs.existsSync(file))process.loadEnvFile(file);
const compiled=ts.transpileModule(fs.readFileSync('app/lib/lead.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {emitirLead}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const answers=Object.fromEntries(questions.filter(q=>q.type!=='text').map(q=>[q.id,q.type==='multi'?[q.options[0]]:q.options[0]]));
Object.assign(answers,{name:'Pessoa de teste · exemplo fictício',routine:'Estudo e ajudo minha família. Gosto de explicar matemática para minha sobrinha.',interest:['Conversar e explicar'],easy:['Conversar e explicar'],help:['Conversar e explicar'],episode:'Expliquei frações com uma receita. Minha sobrinha entendeu e resolveu um exercício sozinha. Gostei de inventar o exemplo.',good_not_like:'Organizo pagamentos da casa com cuidado, mas prefiro fazer isso menos vezes.',ordinary_activity:'Preencho formulários simples quando preciso, sem muito entusiasmo.',learning_edge:'Quero aprender a desenhar e preciso de ajuda para começar.',contribution_episode:'Depois do meu exemplo com a receita, ela resolveu o exercício sozinha e disse que a explicação ajudou.',energy_after:'Fiquei contente e com vontade de criar outro exemplo depois de explicar a receita.',recognition:'Ela disse que sou paciente e explico com clareza.',wish:'Reservar um tempo para desenhar sem cobrança.',repeat_episode:'Em outro dia, usei peças de montar para explicar divisões. Gostei de adaptar a explicação e ela conseguiu repetir sozinha.',frustration_example:'Os cuidados da casa ocupam meu tempo antes de eu separar material para desenhar.',rhythm:'Em períodos curtos e frequentes',next_clarity:'Sei a direção, mas não sei o primeiro passo',time_context:'É o máximo que consigo e não vejo mudando',professional:'Não, quero ficar com o mapa pessoal'});
const token=await emitirLead('synthetic-test@example.invalid',process.env.AUTH_SECRET);
const start=Date.now();const response=await fetch(origin+'/api/consciencia/analyze',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,Cookie:'zg_lead='+token},body:JSON.stringify({answers}),signal:AbortSignal.timeout(60000)});
const data=await response.json();
console.log(JSON.stringify({status:response.status,seconds:Math.round((Date.now()-start)/1000),error:data.error,insights:data.analysis?.insights?.length,zones:data.analysis?.zoneMap?.zones?.map(z=>({key:z.key,evidence:z.evidence})),summary:data.analysis?.summary}));
if(!response.ok)process.exitCode=1;
else fs.writeFileSync(path.join(os.tmpdir(),'consciencia-live-check.json'),JSON.stringify({answers,analysis:data.analysis}));
