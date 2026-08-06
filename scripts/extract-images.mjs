/* Extrai imagens base64 embutidas nos HTML das aulas 03, 04 e 05, salva como
   arquivo real em public/img/ e troca o src pelo caminho.
   Idempotente: numa segunda execução não sobra base64 para extrair. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const ORIG = path.join(ROOT, 'originais');
const IMG = path.join(ROOT, 'public', 'img');

const RE = /data:image\/([a-z]+);base64,([A-Za-z0-9+/=]+)/g;

fs.mkdirSync(IMG, { recursive: true });

for (const file of fs.readdirSync(ORIG).filter((f) => f.endsWith('.html'))) {
  const slug = file.match(/^aula-\d{2}/)?.[0];
  if (!slug) continue;

  const src = path.join(ORIG, file);
  const before = fs.readFileSync(src, 'utf8');
  let n = 0;

  const after = before.replace(RE, (_, ext, b64) => {
    const name = `${slug}-${++n}.${ext}`;
    fs.writeFileSync(path.join(IMG, name), Buffer.from(b64, 'base64'));
    return `/img/${name}`;
  });

  if (!n) { console.log(`= ${file} (sem base64)`); continue; }
  fs.writeFileSync(src, after);
  const kb = (s) => Math.round(s.length / 1024);
  console.log(`→ ${file}: ${n} imagens, ${kb(before)}KB → ${kb(after)}KB`);
}
