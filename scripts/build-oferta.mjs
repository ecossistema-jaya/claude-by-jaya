/* Publica a página de oferta do curso.

   originais/claude-do-zero.html é a fonte editável; public/oferta/index.html é
   derivado e regenerável — mesma relação de build-zona.mjs entre originais/ e public/.

   O destino é index.html porque next.config.ts reescreve /claude-do-zero para
   /oferta/index.html. Página pública: o middleware libera claude-do-zero e oferta/.

   Na Vercel originais/ não existe (.vercelignore): sem fonte, mantém o derivado
   versionado e sai com 0. Ver docs/RUNBOOK.md. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const FONTE = path.join(ROOT, 'originais', 'claude-do-zero.html');
const DEST = path.join(ROOT, 'public', 'oferta', 'index.html');

if (!fs.existsSync(FONTE)) {
  if (fs.existsSync(DEST)) {
    console.log('= sem originais/claude-do-zero.html, mantendo public/oferta/ como está');
    process.exit(0);
  }
  console.error('x sem originais/claude-do-zero.html e sem public/oferta/index.html');
  process.exit(1);
}

fs.mkdirSync(path.dirname(DEST), { recursive: true });
fs.copyFileSync(FONTE, DEST);
console.log('+ public/oferta/index.html');
