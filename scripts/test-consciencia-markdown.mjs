import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function element(tagName, content=[], attributes={}) {
  const childNodes=(Array.isArray(content)?content:[content]).map(child=>typeof child==='string'?{nodeType:3,textContent:child}:child);
  const node={nodeType:1,tagName:tagName.toUpperCase(),childNodes,hidden:false,...attributes};
  node.children=childNodes.filter(child=>child.nodeType===1);
  node.classList={contains:name=>(attributes.className||'').split(' ').includes(name)};
  Object.defineProperty(node,'textContent',{get:()=>childNodes.map(child=>child.textContent).join('')});
  const descendants=()=>node.children.flatMap(child=>[child,...child.querySelectorAll('*')]);
  node.querySelectorAll=selector=>descendants().filter(child=>selector==='*'||(selector==='#tarot[hidden]'?child.id==='tarot'&&child.hidden:child.tagName.toLowerCase()===selector));
  node.querySelector=selector=>node.querySelectorAll(selector)[0]||null;
  return node;
}

const result=element('div',[
  element('h1','João · reflexão'),
  element('article',[
    element('h2','Minha leitura'),element('p','Cuidar & aprender.'),
    element('details',[element('summary','O que sustenta esta leitura'),element('ul',[element('li','Um exemplo real')])]),
    element('div',[element('span','Conversar e explicar'),element('b','3 de 3')],{className:'barrow'}),
    element('table',[element('tr',[element('th','Atividade'),element('th','Interesse')]),element('tr',[element('td','Criar | aprender'),element('td','●')])]),
    element('ol',[element('li','Observar'),element('li','Anotar')]),
  ]),
  element('dl',[element('dt','Sua resposta'),element('dd','<img src=x>\n# título\n![rastreio](https://exemplo.invalid)')]),
  element('section','EMAIL PRIVADO',{className:'no-print'}),
  element('article',[element('h2','Carta oculta'),element('div','SEGREDO',{id:'tarot',hidden:true})]),
]);
const nodes=new Map([['result-content',result],['download-md',{}],['download',{}],['export-status',{replaceChildren(...children){this.children=children}}]]);
let savedBlob,clicked=false,revoked;
const context=vm.createContext({
  $:id=>nodes.get(id),Blob,Date,
  URL:{createObjectURL(blob){savedBlob=blob;return 'blob:unit-test'},revokeObjectURL(url){revoked=url}},
  document:{createTextNode:text=>text,createElement:()=>({click(){clicked=true}})},
});
vm.runInContext(fs.readFileSync(new URL('../originais/consciencia-reading.js',import.meta.url),'utf8'),context);
vm.runInContext('exportMarkdown()',context);
const markdown=await savedBlob.text();
assert.equal(savedBlob.type,'text/markdown;charset=utf-8');
assert.ok(clicked);
assert.equal(nodes.get('download-md').disabled,false);
assert.equal(nodes.get('export-status').children[1].download,'meu-mapa-arquitetura-da-consciencia.md');
assert.match(markdown,/## João · reflexão/);
assert.match(markdown,/\*\*O que sustenta esta leitura\*\*/);
assert.match(markdown,/- Um exemplo real/);
assert.match(markdown,/- Conversar e explicar: 3 de 3/);
assert.ok(markdown.includes('| Atividade | Interesse |\n| --- | --- |\n| Criar \\| aprender | ● |'));
assert.ok(markdown.includes('1. Observar\n2. Anotar'));
assert.ok(markdown.includes('&lt;img src=x&gt;'));
assert.ok(markdown.includes('\\# título'));
assert.ok(!markdown.includes('![rastreio]'));
assert.ok(!/EMAIL PRIVADO|SEGREDO|Carta oculta/.test(markdown));
result.childNodes.push(element('p','Resposta atualizada'));
vm.runInContext('exportMarkdown()',context);
assert.match(await savedBlob.text(),/Resposta atualizada/);
assert.equal(revoked,'blob:unit-test');
const revealed=element('article',[element('h2','Sua Carta de Travessia'),element('div','O Eremita',{id:'tarot'})]);
context.revealed=revealed;
assert.match(vm.runInContext('markdownNode(revealed)',context),/O Eremita/);
context.URL.createObjectURL=()=>{throw Error('Unavailable')};
vm.runInContext('exportMarkdown()',context);
assert.match(nodes.get('export-status').textContent,/Não foi possível preparar/);
assert.equal(nodes.get('download-md').disabled,false);
console.log('PASS: Markdown content, evidence, tables, Unicode, escaping, hidden content, current result, file metadata, retry and errors');
