let leadReady = false;
function radarHTML(counts) {
  const labels=['Investigar','Criar','Organizar','Acolher','Explicar','Resolver'];
  const point=(i,r)=>[280+Math.cos(i*Math.PI/3-Math.PI/2)*r,200+Math.sin(i*Math.PI/3-Math.PI/2)*r];
  const points=scale=>counts.map((_,i)=>point(i,scale).join(',')).join(' ');
  const rings=[1,2,3].map(n=>`<polygon points="${points(n*43)}" fill="none" stroke="#d9d2c2"/><text x="287" y="${200-n*43+13}" fill="#6b6259" font-size="12">${n}</text>`).join('');
  const axes=counts.map((_,i)=>{const [x,y]=point(i,129);const [lx,ly]=point(i,170);return `<line x1="280" y1="200" x2="${x}" y2="${y}" stroke="#d9d2c2"/><text x="${lx}" y="${ly+5}" class="axis-label" text-anchor="middle" fill="#002f3b" font-size="17">${labels[i]}</text>`}).join('');
  const polygon=counts.map((x,i)=>point(i,x.n*43).join(',')).join(' ');
  return `<div class="radar-layout"><svg class="radar-svg" viewBox="0 0 560 400" role="img" aria-labelledby="radar-title radar-desc"><title id="radar-title">Presença das atividades em três respostas</title><desc id="radar-desc">${counts.map(x=>esc(x.d)+': '+x.n+' de 3').join('; ')}. Contagem de escolhas, não nota de capacidade.</desc>${rings}${axes}<polygon points="${polygon}" fill="#53624b33" stroke="#53624b" stroke-width="3"/>${counts.map((x,i)=>{const [cx,cy]=point(i,x.n*43);return `<circle cx="${cx}" cy="${cy}" r="4" fill="#002f3b"/>`}).join('')}</svg><div><p class="eyebrow">Interesse + facilidade + ajuda</p><h3>O que aparece mais de uma vez?</h3><p>O desenho reúne as mesmas contagens das barras. Quanto mais longe do centro, mais respostas mencionaram aquela atividade.</p><ul class="radar-key">${counts.map(x=>`<li><span>${esc(x.d)}</span><b>${x.n} de 3</b></li>`).join('')}</ul></div></div><p class="evidence">Uma atividade não marcada não indica incapacidade. A matriz abaixo permite ver quais escolhas formam cada contagem.</p>`;
}
function zoneHTML(map) {
  const definitions=[['genialidade','Genialidade','Prazer, facilidade e uma contribuição que faz sentido.','episode'],['excelencia','Excelência','Você faz bem, mas pode preferir dedicar menos espaço a isso.','good_not_like'],['competencia','Competência','Você consegue realizar, mesmo sem muito entusiasmo.','ordinary_activity'],['desenvolvimento','Em desenvolvimento','Algo que gostaria de aprender ou fazer com apoio.','learning_edge']];
  const available=map&&typeof map.hypothesis==='string'&&Array.isArray(map.evidence)&&Array.isArray(map.zones)&&map.zones.length===4;
  return `<section class="zone-map" aria-labelledby="zone-title"><div class="zone-intro"><p class="eyebrow">Quatro zonas · um mapa de possibilidades</p><h2 id="zone-title">O que suas atividades revelam</h2><p class="zone-hypothesis">${esc(available?map.hypothesis:'Onde o que você gosta encontra o que faz bem — e ganha sentido na sua vida.')}</p><p>${available?'Hipóteses para observar, ajustar ou ampliar com situações reais.':'Aqui estão seus exemplos, organizados pelo que cada pergunta explora. A leitura com IA pode conectar essas pistas.'}</p>${available&&map.evidence.length?refsHTML(map.evidence):''}</div><div class="zone-grid">${definitions.map(([key,title,definition,id],i)=>{const z=available?map.zones.find(z=>z&&z.key===key):null;const direct=meaningfulAnswer(answers[id]);return `<article class="zone-cell"><p class="eyebrow">${String(i+1).padStart(2,'0')} · ${z?.evidence?.length?'Hipótese com evidências':!available&&direct?'Seu exemplo':'A explorar'}</p><h3>${title}</h3><p class="zone-definition">${definition}</p><p>${esc(z?.text||(direct?'Você contou: “'+answers[id]+'”.':'Ainda faltam exemplos concretos. Você pode revisar as respostas quando quiser.'))}</p>${z?.evidence?.length?refsHTML(z.evidence):!available&&direct?'<p class="evidence">Este relato é uma pista para explorar, não uma classificação definitiva.</p>':''}</article>`}).join('')}</div><p class="evidence">Adaptação das quatro zonas de Hendricks. As zonas se referem a atividades e momentos da vida. Este questionário não mede percentuais de tempo nem produz escores de personalidade.</p></section>`;
}
function renderAI() {
  const el=$('ai-reading');if(!el)return;
  const valid=aiCache&&aiCache.snapshot===snapshot()&&safeAnalysis(aiCache.analysis);const a=valid?aiCache.analysis:null;
  const stale=aiCache&&!valid;
  let html=zoneHTML(a?.zoneMap);
  if(a)html+=`<article class="tile" style="margin:22px 0"><p class="eyebrow">Sua leitura · hipóteses para explorar</p><h2>Os fios que conectam suas respostas</h2><p class="answer-quote">${esc(a.summary)}</p></article><div class="grid">${a.insights.map(i=>tile(esc(i.title),'<p>'+esc(i.text)+'</p>'+refsHTML(i.evidence))).join('')}${tile(esc(a.experiment.title),'<ol>'+a.experiment.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol>'+refsHTML(a.experiment.evidence))}${a.professional&&answers.professional==='Sim, quero explorar'?tile('Trabalho e renda · possibilidades','<p>'+esc(a.professional.text)+'</p>'+refsHTML(a.professional.evidence),true):''}</div>`;
  html+=`<section class="ai-box no-print" style="margin-top:24px"><p class="eyebrow">Uma leitura que conecta os pontos</p><h3>${a?'Sua leitura está salva':'Quer aprofundar seu mapa?'}</h3><p>Ao solicitar a leitura, suas respostas, sem o campo de nome, serão enviadas ao Gemini (Google). Evite incluir dados íntimos ou identificar outras pessoas nos textos.</p>${leadReady?'':`<form id="lead-form" class="lead-form"><label for="lead-email">Seu e-mail</label><input id="lead-email" type="email" autocomplete="email" maxlength="254" required placeholder="voce@exemplo.com"><label class="option"><input id="lead-consent" type="checkbox" required><span>Autorizo o cadastro do meu e-mail por Jaya Roberta para liberar a leitura e receber conteúdos sobre autoconhecimento. Posso solicitar minha retirada.</span></label><button type="submit" ${aiBusy?'disabled':''}>Autorizar cadastro e gerar leitura</button></form>`}${leadReady?`<button id="generate-ai" ${aiBusy?'disabled':''}>${aiBusy?'Preparando sua leitura…':a?'Gerar outra leitura':'Gerar leitura com IA'}</button>`:''}<p id="ai-status" role="status" aria-live="polite">${esc(aiMessage||(stale?'Você mudou suas respostas. Gere uma nova leitura para refletir as mudanças.':a?'Leitura salva neste navegador.':'Seu mapa das respostas já está disponível, mesmo sem enviar à IA.'))}</p></section>`;
  el.innerHTML=html;
  if($('generate-ai'))$('generate-ai').onclick=generateAI;
  if($('lead-form'))$('lead-form').onsubmit=authorizeAndGenerate;
}
async function authorizeAndGenerate(event) {
  event.preventDefault();if(aiBusy)return;
  const form=event.currentTarget;if(!form.reportValidity())return;
  const email=$('lead-email').value.trim();const consentimento=$('lead-consent').checked;
  aiBusy=true;form.querySelector('button').disabled=true;$('ai-status').textContent='Autorizando seu cadastro…';
  try {
    const r=await fetch('/api/zona/lead',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({email,consentimento,origem:'arquitetura-da-consciencia'}),signal:AbortSignal.timeout(15000)});
    if(!r.ok)throw new Error(r.status===429?'Limite de tentativas atingido. Aguarde e tente novamente.':'Não foi possível autorizar o e-mail. Confira o endereço e tente novamente.');
    leadReady=true;aiBusy=false;await generateAI();
  } catch(e) {
    aiBusy=false;aiMessage=e.name==='TimeoutError'?'O cadastro demorou. Tente novamente; suas respostas continuam salvas.':e.message;
    if(form.isConnected){form.querySelector('button').disabled=false;$('ai-status').textContent=aiMessage}else renderAI();
  }
}
async function generateAI() {
  if(aiBusy)return;aiBusy=true;aiMessage='A análise pode levar até um minuto. Suas respostas já estão salvas.';const sent=snapshot();renderAI();
  try {
    const r=await fetch('/api/consciencia/analyze',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({answers:payloadAnswers()}),signal:AbortSignal.timeout(55000)});
    const d=await r.json().catch(()=>({}));
    if(r.status===401)leadReady=false;
    if(!r.ok)throw new Error(r.status===401?'A autorização expirou. Informe seu e-mail para continuar.':d.error||'Não foi possível gerar a leitura. Suas respostas continuam salvas.');
    if(!safeAnalysis(d.analysis))throw new Error('A leitura veio incompleta. Tente novamente.');
    if(sent!==snapshot())throw new Error('Suas respostas mudaram durante a análise. Gere uma nova leitura.');
    aiCache={snapshot:sent,analysis:d.analysis};aiMessage='Leitura concluída. Você pode baixar ou imprimir seu mapa completo.';
    try{localStorage.setItem(AIKEY,JSON.stringify(aiCache))}catch{aiMessage='Leitura concluída. O navegador não permitiu salvar; baixe seu mapa.'}
  } catch(e) {aiMessage=e.name==='TimeoutError'?'A análise demorou mais que o esperado. Tente novamente; seu mapa continua disponível.':e.message||'Não foi possível gerar a leitura.'}
  finally {aiBusy=false;renderAI()}
}
let exportUrl = null;
async function exportMap() {
  const button=$('download');button.disabled=true;$('export-status').textContent='Preparando seu arquivo com as imagens…';
  try {
    const clone=$('result-content').cloneNode(true);
    const tarot=clone.querySelector('#tarot');
    if(tarot?.hidden)tarot.closest('article').remove();
    clone.querySelectorAll('.no-print').forEach(e=>e.remove());
    clone.querySelectorAll('details').forEach(d=>d.open=true);
    await Promise.all([...clone.querySelectorAll('img')].map(async img=>{
      const response=await fetch(img.getAttribute('src'),{signal:AbortSignal.timeout(15000)});
      if(!response.ok)throw Error('image');
      const blob=await response.blob();
      img.src=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob)});
      img.removeAttribute('srcset');img.removeAttribute('sizes');img.removeAttribute('loading');
    }));
    const html='<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Meu mapa · Arquitetura da Consciência</title><style>'+document.querySelector('style').textContent+'</style></head><body><main style="max-width:1080px;margin:auto;padding:24px"><p>Jaya Roberta · Mapa pessoal · '+new Date().toLocaleDateString('pt-BR')+'</p>'+clone.outerHTML+'<p>Use Imprimir no navegador para salvar como PDF. Guarde este arquivo com cuidado: ele contém suas respostas pessoais.</p></main></body></html>';
    if(exportUrl)URL.revokeObjectURL(exportUrl);
    exportUrl=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));
    const link=document.createElement('a');link.href=exportUrl;link.download='meu-mapa-arquitetura-da-consciencia.html';link.textContent='Salvar arquivo preparado';
    $('export-status').replaceChildren(document.createTextNode('Arquivo pronto, com imagens para abrir sem conexão. Se o download não começou, use este link: '),link);link.click();
  } catch {$('export-status').textContent='Não foi possível incluir todas as imagens. Tente baixar novamente ou use Imprimir / salvar PDF.'}
  finally {button.disabled=false}
}
$('download').onclick=exportMap;
