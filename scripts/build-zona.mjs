/* Publica a Zona de Genialidade.

   originais/zona-de-genialidade.html é a fonte editável; public/zona/index.html é
   derivado e regenerável — mesma relação de build-aulas.mjs entre originais/ e
   public/aulas/.

   O destino é index.html porque next.config.ts reescreve /zona-de-genialidade
   para /zona/index.html. A URL que a pessoa vê não tem extensão; o arquivo servido
   tem. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const FONTE = path.join(ROOT, 'originais', 'zona-de-genialidade.html');
const DEST = path.join(ROOT, 'public', 'zona', 'index.html');

if (!fs.existsSync(FONTE)) {
  console.log('= sem originais/zona-de-genialidade.html, nada a fazer');
  process.exit(0);
}

fs.mkdirSync(path.dirname(DEST), { recursive: true });
fs.copyFileSync(FONTE, DEST);

const kb = Math.round(fs.statSync(DEST).size / 1024);
console.log(`→ public/zona/index.html (${kb}KB)`);
