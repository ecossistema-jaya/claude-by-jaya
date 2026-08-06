/* Renomeia os HTML de origem e as imagens já extraídas para slugs sem espaço
   e sem acento. Idempotente: se o destino já existe, não faz nada. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const ORIG = path.join(ROOT, 'originais');
const PUB = path.join(ROOT, 'public');
const IMG = path.join(PUB, 'img');

const HTML = {
  'Aula 01-Conversar-com-o-Claude.html': 'aula-01-conversar-com-o-claude.html',
  'Aula 02-Botar-o-Claude-pra-Trabalhar.html': 'aula-02-botar-o-claude-pra-trabalhar.html',
  'Aula 03 - Documento-Mestre.html': 'aula-03-documento-mestre.html',
  'Aula 04 - Psicometria-Zona-de-Genialidade_2.html': 'aula-04-psicometria.html',
  'Aula 5-Landing-Page-com-Identidade-Visual.html': 'aula-05-landing-page.html',
};

/* O nome do arquivo "Slide 15 - Cowork" está errado na origem: Cowork é o
   slide 14 do deck, o 15 é Extensão. Corrigido aqui. */
const IMGS = {
  'Aula 01 - Slide 07 - Modelos.png': 'aula-01-slide-07-modelos.png',
  'Aula 01 - Slide 12 - web Search.png': 'aula-01-slide-12-web-search.png',
  'Aula 01 - Slide 14 - instruções para o Claude.png': 'aula-01-slide-14-instrucoes.png',
  'Aula 01 - Slide 15 - Uso.png': 'aula-01-slide-15-uso.png',
  'Aula 02 - Slide 03 - Artefato.png': 'aula-02-slide-03-artefato.png',
  'Aula 02 - Slide 07 - Projetos.png': 'aula-02-slide-07-projetos.png',
  'Aula 02 - Slide 10 - Conectores.png': 'aula-02-slide-10-conectores.png',
  'Aula 02 - Slide 13 - Skills.png': 'aula-02-slide-13-skills.png',
  'Aula 02 - Slide 15 - Cowork.png': 'aula-02-slide-14-cowork.png',
  'Aula 02 - Slide 16 - Design 1.png': 'aula-02-slide-16-design-1.png',
  'Aula 02 - Slide 16 - Design 2.png': 'aula-02-slide-16-design-2.png',
};

function move(fromDir, toDir, map) {
  fs.mkdirSync(toDir, { recursive: true });
  for (const [from, to] of Object.entries(map)) {
    const src = path.join(fromDir, from);
    const dst = path.join(toDir, to);
    if (fs.existsSync(dst)) { console.log(`  = ${to}`); continue; }
    if (!fs.existsSync(src)) { console.log(`  ! FALTA ${from}`); continue; }
    fs.renameSync(src, dst);
    console.log(`  → ${to}`);
  }
}

console.log('HTML:');
move(ORIG, ORIG, HTML);
console.log('Imagens:');
move(PUB, IMG, IMGS);
