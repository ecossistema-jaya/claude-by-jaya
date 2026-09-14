/* Copia os HTML de originais/ para public/aulas/, de onde os iframes carregam.
   originais/ é a fonte editável; public/aulas/ é derivado e regenerável. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const ORIG = path.join(ROOT, 'originais');
const DEST = path.join(ROOT, 'public', 'aulas');

fs.mkdirSync(DEST, { recursive: true });
/* Só as aulas. originais/ também guarda zona-de-genialidade.html, que é público e
   vai para public/zona/ por build-zona.mjs — copiá-lo aqui o publicaria de novo
   numa segunda URL, essa fechada pelo middleware. */
if (fs.existsSync(ORIG)) {
  for (const f of fs.readdirSync(ORIG).filter((f) => /^aula-.*\.html$/.test(f))) {
    let html = fs.readFileSync(path.join(ORIG, f), 'utf8');
    if (f === 'aula-04-psicometria.html') {
      const start = '<button class="btn" onclick="App.startAssess()">Começar o assessment</button>';
      if (!html.includes(start)) throw new Error('Lesson 4 assessment entry point was not found.');
      html = html.replace(start, '<a class="btn" href="/mapa-autoconhecimento-v0.html" target="_top">Começar o assessment</a>');
      html = html.replace('≈ 30 minutos', 'No seu ritmo').replace('43 perguntas', '26 perguntas + 5 opcionais');
      html = html.replace('Responda o questionário uma única vez. Sete lentes analisam as mesmas respostas — Hendricks, Clifton, Sullivan, Hamilton, Hormozi, Kolbe e Hogshead — e devolvem seu blueprint e um dashboard psicométrico completo.', 'Explore seus interesses, seu jeito de agir e o que importa nesta fase. O novo mapa usa linguagem cotidiana e reúne suas respostas em um dashboard de reflexão, com uma Carta de Travessia simbólica. Trabalho e renda são opcionais.');
    }
    fs.writeFileSync(path.join(DEST, f), html);
    console.log(`→ public/aulas/${f}`);
  }
} else if (fs.existsSync(path.join(DEST, 'aula-04-psicometria.html'))) {
  console.log('= sem originais/, mantendo public/aulas/ como está');
} else {
  console.error('x sem originais/ e sem aulas derivadas em public/aulas/');
  process.exit(1);
}

const MAPA_FONTE = path.join(ROOT, 'docs', 'mapa-autoconhecimento-v0.html');
const MAPA_DEST = path.join(ROOT, 'public', 'mapa-autoconhecimento-v0.html');

/* docs/ fica fora do upload da Vercel. No desenvolvimento, atualiza o derivado;
   no deploy, mantém o public/ já versionado. */
if (fs.existsSync(MAPA_FONTE)) {
  const mapa = fs.readFileSync(MAPA_FONTE, 'utf8');
  fs.writeFileSync(MAPA_DEST, mapa.replaceAll('http://localhost:4012/', '/'));
  console.log('→ public/mapa-autoconhecimento-v0.html');
} else if (fs.existsSync(MAPA_DEST)) {
  console.log('= sem docs/mapa-autoconhecimento-v0.html, mantendo public/ como está');
} else {
  console.error('x sem docs/mapa-autoconhecimento-v0.html e sem public/mapa-autoconhecimento-v0.html');
  process.exit(1);
}
