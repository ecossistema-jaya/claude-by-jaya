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
for (const f of fs.readdirSync(ORIG).filter((f) => /^aula-.*\.html$/.test(f))) {
  fs.copyFileSync(path.join(ORIG, f), path.join(DEST, f));
  console.log(`→ public/aulas/${f}`);
}
