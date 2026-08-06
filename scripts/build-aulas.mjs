/* Copia os HTML de originais/ para public/aulas/, de onde os iframes carregam.
   originais/ é a fonte editável; public/aulas/ é derivado e regenerável. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const ORIG = path.join(ROOT, 'originais');
const DEST = path.join(ROOT, 'public', 'aulas');

fs.mkdirSync(DEST, { recursive: true });
for (const f of fs.readdirSync(ORIG).filter((f) => f.endsWith('.html'))) {
  fs.copyFileSync(path.join(ORIG, f), path.join(DEST, f));
  console.log(`→ public/aulas/${f}`);
}
